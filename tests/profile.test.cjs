const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const output = path.join(__dirname, '..', 'test-results');

test('edit child identity and explicitly confirm independent conversion', async () => {
    const page=await browser.newPage({viewport:{width:390,height:844}});
    await page.goto(url);
    await page.locator('#family-plans-open').click();
    await page.locator('[data-tier="free"]').click();
    await page.locator('#family-settings-consent').check();
    await page.locator('#family-activate-submit').click();
    await page.setViewportSize({width:1440,height:1000});
    const birthBox=await page.locator('#family-birth-day').boundingBox(), genderBox=await page.locator('#family-new-gender').boundingBox();
    assert.ok(Math.abs(birthBox.y-genderBox.y)<=2);
    assert.ok(Math.abs(birthBox.height-genderBox.height)<=2);
    await fillBirth(page,'2018-06-15');
    await page.screenshot({path:path.join(output,'compact-create-mobile.png')});
    assert.equal(await page.locator('.input-guidance').count(),0);
    await page.locator('#family-new-name').focus();
    await page.locator('#family-new-name').fill('Minh Anh');
    await page.locator('#family-new-password').fill('Example1234');
    await page.locator('#family-confirm-password').fill('Mismatch123');
    assert.equal(await page.locator('#family-confirm-password-mismatch').textContent(),'');
    await page.locator('#family-new-gender').focus();
    assert.match(await page.locator('#family-confirm-password-mismatch').textContent(),/chưa khớp/);
    await page.locator('#family-confirm-password').fill('Example1234');
    await page.locator('#family-new-gender').selectOption('other');
    await page.locator('#family-create-form button[type="submit"]').click();
    await page.locator('#family-apply-preset').click();
    await page.locator('#child-profile-settings summary').click();
    const editBirthBox=await page.locator('#edit-birth-day').boundingBox(), editGenderBox=await page.locator('#child-edit-gender').boundingBox();
    assert.ok(Math.abs(editBirthBox.y-editGenderBox.y)<=2);
    await page.screenshot({path:path.join(output,'aligned-identity-desktop.png')});
    await page.setViewportSize({width:390,height:844});

    await page.locator('#child-edit-name').fill('Minh Anh mới');
    await page.locator('#edit-birth-year').selectOption('');
    await page.locator('#family-settings-save').click();
    assert.match(await page.locator('#family-limit-error').textContent(),/tương lai/);
    await page.locator('#edit-birth-year').selectOption('2000'); await page.locator('#edit-birth-month').selectOption('1'); await page.locator('#edit-birth-day').selectOption('1');
    assert.equal(await page.locator('#child-edit-username').getAttribute('readonly'),'');
    await page.locator('#child-password-settings summary').click();
    await page.locator('#child-change-password').click();
    assert.match(await page.locator('#child-password-status').textContent(),/hiện tại/);
    await page.locator('#child-forgot-password').click();
    assert.equal(await page.locator('#child-recovery').isVisible(),true);
    await page.locator('#child-forgot-password').click();
    await page.locator('#child-current-password').fill('OldPassword123');
    await page.locator('#child-new-password').fill('Example1234'); await page.locator('#child-confirm-password').fill('different');
    await page.locator('#child-change-password').click(); assert.match(await page.locator('#child-password-status').textContent(),/chưa khớp/);
    await page.locator('#child-confirm-password').fill('Example1234'); await page.locator('#child-change-password').click();
    assert.equal(await page.locator('#child-new-password').inputValue(),'');
    await page.screenshot({path:path.join(output,'account-security-mobile.png')});
    await page.locator('#family-settings-save').click();
    assert.equal(await page.locator('#family-child-name').textContent(),'Minh Anh mới');
    assert.equal(await page.locator('#child-independent-offer').isVisible(),true);
    await page.locator('#child-transfer-start').click();
    await page.locator('#transfer-cancel').click();
    await page.waitForFunction(()=>document.getElementById('family-preview').open);
    assert.equal(await page.locator('#child-edit-dob').inputValue(),'2000-01-01');
    await page.locator('#child-transfer-start').click();
    await page.locator('#transfer-phone').fill('123');
    await page.locator('#transfer-send-code').click();
    assert.equal(await page.locator('#transfer-code-step').isVisible(),false);
    await page.locator('#transfer-phone').fill('0901234567');
    await page.locator('#transfer-send-code').click();
    await page.locator('#transfer-code').fill('000000');
    await page.locator('#transfer-verify').click();
    assert.equal(await page.locator('#transfer-confirm-step').isVisible(),false);
    await page.locator('#transfer-code').fill('123456');
    await page.locator('#transfer-verify').click();
    assert.equal(await page.locator('#transfer-confirm').isDisabled(),true);
    await page.locator('#transfer-consent').check();
    await page.screenshot({path:path.join(output,'transfer-mobile.png')});
    assert.equal(await page.locator('#child-transfer-dialog').evaluate(e=>e.scrollWidth<=e.clientWidth),true);
    await page.locator('#transfer-confirm').click();
    assert.equal(await page.locator('#transfer-complete').isVisible(),true);
    assert.equal(await page.locator('#transfer-phone').inputValue(),'');
    await page.locator('#transfer-cancel').click();
    assert.equal(await page.locator('#family-preview').evaluate(e=>e.open),false);
    await page.close();
});

let browser, server, url;
async function expandManagement(page) {
    for (const id of ['family-content-controls','family-advanced','family-reports']) {
        const section=page.locator('#'+id);
        if(await section.isVisible() && !(await section.getAttribute('open') !== null)) await section.locator('summary').click();
    }
}


async function fillBirth(page,value) { const [y,m,d]=value.split('-'); await page.locator('#family-birth-year').selectOption(y); await page.locator('#family-birth-month').selectOption(String(Number(m))); await page.locator('#family-birth-day').selectOption(String(Number(d))); }





before(async () => {
    fs.mkdirSync(output, { recursive: true });
    server = http.createServer((request, response) => {
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        response.end(html);
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    url = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {}) });
});
after(async () => {
    if (browser) await browser.close();
    if (server) await new Promise(resolve => server.close(resolve));
});

test('family preview validates, isolates edits, restores focus and clears samples on close', async () => {
    const page = await browser.newPage();
    const errors = [], unexpectedRequests = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => { if (request.url() !== url + '/') unexpectedRequests.push(request.url()); });
    await page.goto(url);
    assert.equal(await page.locator('#btn-save').isDisabled(), true);
    await page.locator('#family-guide-toggle').click();
    assert.equal(await page.locator('#family-guide').isVisible(), true);
    assert.equal(await page.locator('#family-guide-toggle').getAttribute('aria-expanded'), 'true');
    await page.locator('#family-guide-toggle').click();
    assert.equal(await page.locator('#family-guide').isVisible(), false);
    await page.locator('#family-preview-open').click();
    assert.equal(await page.locator('#family-preview').evaluate(e => e.open), true);
    assert.equal(await page.locator('#family-preview-close').evaluate(e => e === document.activeElement), true);
    await expandManagement(page);
    for (let i = 0; i < 18; i++) {
        await page.keyboard.press('Tab');
        assert.equal(await page.evaluate(() => !!document.activeElement.closest('#family-preview')), true);
    }
    await page.locator('#family-limit').fill('20');
    await page.locator('[data-family-child="1"]').click();
    assert.equal(await page.locator('#family-child-name').textContent(), 'Mây Nhỏ');
    assert.match(await page.locator('#family-feedback').textContent(), /hủy thay đổi/);
    for (const invalid of ['', '-1', '181', '1.5']) {
        await page.locator('#family-limit').fill(invalid);
        await page.locator('#family-settings-save').click();
        assert.equal(await page.locator('#family-limit').getAttribute('aria-invalid'), 'true');
    }
    await page.locator('#family-limit').fill('0');
    await page.locator('#family-settings-save').click();
    assert.match(await page.locator('#family-remaining').textContent(), /hết hạn mức/);
    assert.equal(await page.locator('#family-usage-progress').getAttribute('max'), '1');
    assert.match(await page.locator('#family-feedback').textContent(), /Đã lưu cài đặt/);
    await page.locator('[data-family-child="1"]').click();
    assert.equal(await page.locator('#family-limit').inputValue(), '45');
    await page.locator('#family-limit').fill('90');
    await page.locator('#family-settings-reset').click();
    assert.equal(await page.locator('#family-limit').inputValue(), '45');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#family-preview').evaluate(e => e.open), false);
    assert.equal(await page.locator('#family-preview-open').evaluate(e => e === document.activeElement), true);
    assert.equal(await page.locator('#btn-save').isDisabled(), true);
    await page.locator('#family-preview-open').click(); await expandManagement(page);
    assert.equal(await page.locator('#family-limit').inputValue(), '60');
    await page.locator('#family-preview-close').click();
    assert.deepEqual(await page.evaluate(() => [localStorage.length, sessionStorage.length]), [0, 0]);
    assert.deepEqual(errors, []);
    assert.deepEqual(unexpectedRequests, []);
    await page.close();
});

test('existing profile save, cancel, identity expansion and avatar still work', async () => {
    const page = await browser.newPage();
    await page.goto(url);
    await page.locator('#fullname').fill('Tên kiểm thử');
    assert.equal(await page.locator('#btn-save').isEnabled(), true);
    await page.locator('#btn-reset').click();
    assert.equal(await page.locator('#fullname').inputValue(), 'GameVui');
    await page.locator('#fullname').fill('  Hồ sơ mới  ');
    await page.locator('#btn-save').click();
    assert.equal(await page.locator('#main-display-name').textContent(), 'Hồ sơ mới');
    assert.equal(await page.locator('#btn-save').isDisabled(), true);
    await page.locator('#btn-toggle-extra').click();
    assert.equal(await page.locator('#extra-identity-section').isVisible(), true);
    assert.equal(await page.locator('#dob-day').isDisabled(), true);
    const originalAvatar = await page.locator('#avatar-preview').getAttribute('src');
    await page.locator('#file-input').setInputFiles({ name: 'sample.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64') });
    await page.waitForFunction(() => document.getElementById('avatar-preview').src.startsWith('data:image/jpeg'));
    await page.locator('#btn-reset').click();
    assert.equal(await page.locator('#avatar-preview').getAttribute('src'), originalAvatar);
    await page.locator('#link-change-phone').click();
    assert.match(await page.locator('#toast-message').textContent(), /Chưa kết nối xác thực để đổi số điện thoại/);
    await page.close();
});



test('readable setup guide without JavaScript', async () => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 900 } });
    const page = await context.newPage();
    await page.goto(url);
    assert.equal(await page.locator('#family-guide').isVisible(), true);
    assert.equal(await page.locator('#family-preview-open').isVisible(), false);
    await context.close();
});









test('runtime is self contained: no CDN, external libraries, fonts or network data calls', async () => {
    const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
    assert.equal(scripts.length, 2);
    scripts.forEach(([, source]) => assert.doesNotThrow(() => new Function(source)));
    assert.equal(/<script[^>]+src\s*=/i.test(html), false);
    assert.equal(/<link\b/i.test(html), false);
    assert.equal(/@import\b|@font-face\b/.test(html), false);
    const css = html.match(/<style>([\s\S]*?)<\/style>/i)[1];
    const cssUrls = [...css.matchAll(/url\(["']?([^)'"\s]+)/g)].map(match => match[1]);
    assert.ok(cssUrls.every(url => url.startsWith('data:')));
    assert.equal(/\b(fetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon\s*\(|import\s*\()/.test(scripts.map(([, source]) => source).join('\n')), false);
    const page = await browser.newPage();
    const requests = [];
    page.on('request', request => requests.push(request.url()));
    await page.goto(url);
    assert.deepEqual(await page.locator('[src]').evaluateAll(elements => elements.map(e => e.getAttribute('src')).filter(src => !src.startsWith('data:'))), []);
    assert.deepEqual(requests, [url + '/']);
    await page.close();
});





test('discovery is interactive, opens selected limit and header has no upgrade action', async () => {
    const page = await browser.newPage();
    await page.goto(url);
    assert.equal(await page.locator('.profile-header-card button#account-upgrade').count(),0);
    assert.doesNotMatch(await page.locator('body').innerText(), /preview|mô phỏng|dữ liệu mẫu|tài khoản mẫu/i);
    for (const value of [30,90,60]) {
        await page.locator('[data-discovery-limit="'+value+'"]').click();
        assert.equal(await page.locator('#discovery-remaining').textContent(),String(value-25));
        assert.equal(await page.locator('[data-discovery-limit="'+value+'"]').getAttribute('aria-pressed'),'true');
    }
    await page.locator('[data-discovery-limit="30"]').click();
    await page.locator('#discovery-open').click();
    assert.equal(await page.locator('#family-limit').inputValue(),'30');
    assert.doesNotMatch(await page.locator('#family-preview').innerText(), /preview|mô phỏng|dữ liệu mẫu/i);
    await page.locator('#family-preview-close').click();
    assert.equal(await page.locator('#discovery-open').evaluate(e=>e===document.activeElement),true);
    await page.locator('#family-plans-open').click();
    assert.doesNotMatch(await page.locator('#family-onboarding').innerText(), /preview|mô phỏng|dữ liệu mẫu/i);
    await page.close();
});

















test('180-minute limit can be saved and saved again; all-games label includes every rating', async()=>{
 const page=await browser.newPage();await page.goto(url);await page.locator('#family-preview-open').click();
 await page.locator('#family-limit').fill('180');await page.locator('#family-settings-save').click();
 assert.match(await page.locator('#family-feedback').textContent(),/Đã lưu/);
 assert.equal(await page.locator('#family-limit').inputValue(),'180');
 await page.locator('#family-settings-save').click();assert.match(await page.locator('#family-feedback').textContent(),/Đã lưu/);
 await page.locator('#family-age').selectOption('18');await page.locator('#family-settings-save').click();
 assert.match(await page.locator('#family-current-policy').textContent(),/Tất cả game/);
 assert.equal(await page.locator('#family-rating-warning').isVisible(),true);
 await page.locator('#family-limit').fill('181');await page.locator('#family-settings-save').click();
 assert.equal(await page.locator('#family-limit').getAttribute('aria-invalid'),'true');
 await page.locator('#family-settings-reset').click();assert.equal(await page.locator('#family-limit').inputValue(),'180');await page.close();
});


test('public pages use single-zero rating and no legacy presentation marker',()=>{
 for(const file of ['index.html','kid/index.html']) {
  const source=fs.readFileSync(path.join(__dirname,'..',file),'utf8');
  assert.equal(source.includes('0'+'0+'),false);
  assert.equal(new RegExp('de'+'mo','i').test(source),false);
 }
});

test('two-tier launch has Free only activation and Standard coming soon',async()=>{
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(url);
 await page.locator('#family-plans-open').click();
 assert.deepEqual(await page.locator('.family-tier-grid h4').allTextContents(),['Free','Standard']);
 assert.equal(await page.locator('[data-tier="standard"], [data-tier="pro"], [data-family-plan]').count(),0);
 assert.match(await page.locator('.standard-coming').textContent(),/Sắp ra mắt/);
 for(const width of [320,390,768,1440]) {await page.setViewportSize({width,height:1000});assert.equal(await page.locator('#family-onboarding').evaluate(e=>e.scrollWidth<=e.clientWidth),true);}
 await page.screenshot({path:path.join(output,'two-tier-plans.png')});
 await page.locator('[data-tier="free"]').click();await page.locator('#family-settings-consent').check();await page.locator('#family-activate-submit').click();
 assert.equal(await page.locator('#family-create-form').isVisible(),true);assert.equal(await page.locator('#account-plan-badge').textContent(),'Free');
 assert.equal(await page.locator('#family-manage-categories [data-category]').count(),75);
 assert.equal(await page.locator('#category-group option').count(),1);
 assert.deepEqual(await page.locator('#family-manage-categories label span').allTextContents().then(a=>a.slice(0,6)),['Game Hot','Game Hay','Game Mới','Giải trí','Game Vui','Văn phòng']);
 assert.equal(await page.locator('#family-manage-categories h4').count(),0);
 assert.deepEqual(errors,[]);await page.close();
});
