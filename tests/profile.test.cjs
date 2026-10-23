const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const output = path.join(__dirname, '..', 'test-results');

let browser, server, url;

test('Free entitlement, bounded birth dates, legal age gates and multiple categories', async () => {
    const page=await browser.newPage();
    await page.goto(url);
    await page.locator('#family-plans-open').click();
    assert.deepEqual(await page.locator('.family-tier-grid .family-plan-price').allTextContents(),['0đ','49.000đ','79.000đ']);
    await page.locator('[data-tier="free"]').click();
    assert.match(await page.locator('#family-selected-price').textContent(),/0đ/);
    await page.locator('#family-demo-consent').check();
    await page.locator('#family-activate-submit').click();
    const today=new Date();
    assert.equal(await page.locator('#family-birth-year option').evaluateAll(items=>Math.max(...items.map(i=>Number(i.value)))),today.getFullYear());
    await fillBirth(page,'2020-02-29');
    await page.locator('#family-birth-year').selectOption('2021');
    assert.equal(await page.locator('#family-birth-day').inputValue(),'');
    for (const [years,allowed12,allowed16] of [[11,false,false],[12,true,false],[15,true,false],[16,true,true]]) {
        const now=new Date();
        await fillBirth(page,`${now.getFullYear()-years}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`);
        assert.equal(await page.locator('[data-preset="young"]').isDisabled(),!allowed12);
        assert.equal(await page.locator('[data-preset="teen"]').isDisabled(),!allowed16);
    }
    await fillBirth(page,'2018-06-15');
    await page.locator('#family-new-name').fill('Bé demo');
    await page.locator('#family-new-password').fill('Example1234');
    await page.locator('#family-confirm-password').fill('Example1234');
    await page.locator('#family-new-gender').selectOption('other');
    await page.locator('#family-create-form button[type="submit"]').click();
    assert.equal(await page.locator('[data-preset="young"]').isDisabled(),true);
    assert.equal(await page.locator('[data-preset="teen"]').isDisabled(),true);
    await page.locator('#family-apply-preset').click();
    await page.waitForFunction(()=>document.getElementById('family-preview').open);
    assert.equal(await page.locator('#family-age option[value="12"]').isDisabled(),true);
    assert.equal(await page.locator('#family-age option[value="18"]').isDisabled(),true);
    assert.equal(await page.locator('#family-advanced').isVisible(),false);
    assert.equal(await page.locator('#family-content-controls').isVisible(),false);
    assert.equal(await page.locator('#family-manage-keywords').isVisible(),false);
    assert.equal(await page.locator('#family-export').isVisible(),false);
    assert.equal(await page.locator('#family-comparison').isVisible(),false);
    await page.locator('#family-preview-close').click();
    await page.locator('#family-plans-open').click();
    await page.locator('[data-tier="standard"]').click();
    await page.locator('[data-family-plan="month"]').click();
    await page.locator('#family-demo-consent').check();
    await page.locator('#family-activate-submit').click();
    await page.locator('#family-create-later').click();
    await page.locator('#family-preview-open').click();
    assert.equal(await page.locator('#family-advanced').isVisible(),true);
    await page.locator('#category-clear').click();
    await page.locator('[data-category="learning"]').check();
    await page.locator('[data-category="sports"]').check();
    await page.locator('#family-demo-save').click();
    await page.locator('#family-preview-close').click();
    await page.locator('#family-preview-open').click();
    assert.deepEqual(await page.locator('[data-category]:checked').evaluateAll(items=>items.map(e=>e.dataset.category)),['learning','sports']);
    await page.locator('[data-category="puzzle"]').check();
    await page.locator('#family-demo-reset').click();
    assert.equal(await page.locator('[data-category="puzzle"]').isChecked(),false);
    await page.close();
});
async function fillBirth(page,value) { const [y,m,d]=value.split('-'); await page.locator('#family-birth-year').selectOption(y); await page.locator('#family-birth-month').selectOption(String(Number(m))); await page.locator('#family-birth-day').selectOption(String(Number(d))); }

test('six-field account creation precedes age setup; apply, manual edit and defer', async () => {
    const page = await browser.newPage();
    await page.goto(url);
    await page.locator('#family-plans-open').click();
    await page.locator('[data-tier=\"pro\"]').click();
    await page.locator('[data-family-plan="month"]').click();
    await page.locator('#family-demo-consent').check();
    await page.locator('#family-activate-submit').click();
    assert.equal(await page.locator('#family-create-form input:not([type=hidden]), #family-create-form select').count(),8);
    await page.locator('#family-new-name').fill('Con mẫu');
    await page.locator('#family-new-password').fill('Example1234');
    await page.locator('#family-confirm-password').fill('Example1234');
    await page.locator('#family-new-gender').selectOption('other');
    await page.locator('#family-create-form button[type="submit"]').click();
    assert.equal(await page.locator('#family-birth-year').getAttribute('aria-invalid'),'true');
    assert.equal(await page.locator('#family-birth-year option[value="2999"]').count(),0);
    await page.locator('#family-create-form button[type="submit"]').click();
    assert.equal(await page.locator('[data-flow-panel="success"]').isVisible(),false);
    await fillBirth(page,'2012-06-15');
    assert.equal(await page.locator('#family-recommendations').isVisible(),false);
    await page.locator('#family-create-form button[type="submit"]').click();
    assert.equal(await page.locator('#family-recommendations').isVisible(),true);
    assert.equal(await page.locator('[data-preset="young"]').getAttribute('aria-pressed'),'true');
    await page.locator('[data-preset="preschool"]').click();
    assert.match(await page.locator('#family-preset-content').textContent(),/20 phút/);
    assert.match(await page.locator('[data-overview-child="0"]').textContent(),/0\/0/);
    for (const width of [390,1440]) {
        await page.setViewportSize({width,height:900});
        assert.equal(await page.locator('#family-onboarding').evaluate(e=>e.scrollWidth<=e.clientWidth),true);
        await page.screenshot({path:path.join(output,`post-create-${width}.png`)});
    }
    await page.locator('[data-preset="young"]').click();
    await page.locator('#family-apply-preset').click();
    await page.waitForFunction(()=>document.getElementById('family-preview').open);
    assert.equal(await page.locator('#family-age').inputValue(),'12');
    assert.equal(await page.locator('#family-limit').inputValue(),'45');
    assert.deepEqual(await page.locator('[data-category]:checked').evaluateAll(items=>items.map(e=>e.dataset.category)),['puzzle','iq','chess','learning','math','english','design','music','sports']);
    assert.equal(await page.locator('#family-manage-keywords').inputValue(),'');
    await page.locator('#family-limit').fill('35');
    await page.locator('#family-demo-save').click();
    await page.locator('#family-preview-close').click();
    await page.locator('#family-add-child').click();
    await page.locator('#family-new-name').fill('Con thứ hai');
    await page.locator('#family-new-password').fill('Example1234');
    await page.locator('#family-confirm-password').fill('Example1234');
    await fillBirth(page,'2022-01-01');
    await page.locator('#family-new-gender').selectOption('other');
    await page.locator('#family-create-form button[type="submit"]').click();
    await page.locator('#family-setup-later').click();
    assert.equal(await page.locator('[data-overview-child]').count(),2);
    await page.locator('[data-overview-child="0"]').click();
    assert.equal(await page.locator('#family-limit').inputValue(),'35');
    await page.locator('[data-family-child="1"]').click();
    assert.equal(await page.locator('#family-limit').inputValue(),'0');
    await page.close();
});

test('tiers are independent of terms; caps, downgrade protection, schedule and CSV', async () => {
    const page = await browser.newPage({ acceptDownloads: true });
    await page.goto(url);
    await page.locator('#family-plans-open').click();
    for (const [tier, prices] of [['standard',['49.000đ','132.300đ','249.900đ','441.000đ']],['pro',['79.000đ','213.300đ','402.900đ','711.000đ']]]) {
        await page.locator(`[data-tier="${tier}"]`).click();
        assert.deepEqual(await page.locator('[data-price]').allTextContents(), prices);
    }
    await page.locator('[data-family-plan="month"]').click();
    await page.locator('#family-demo-consent').check();
    await page.locator('#family-activate-submit').click();
    for (let i=0;i<5;i++) {
        if(i) await page.locator('#family-create-another').click();
        await page.locator('#family-new-name').fill('Con mẫu '+i);
        await fillBirth(page,'2012-06-15');
        await page.locator('#family-new-gender').selectOption('other');
        await page.locator('#family-new-password').fill('Example1234');
        await page.locator('#family-confirm-password').fill('Example1234');
        await page.locator('#family-create-form button[type="submit"]').click();
        assert.equal(await page.locator('[data-flow-panel="success"]').isVisible(),true);
    }
    await page.locator('#family-create-another').click();
    await page.locator('#family-create-form button[type="submit"]').click();
    assert.match(await page.locator('#family-create-error').textContent(),/Đã đủ 5/);
    await page.locator('#family-onboarding-close').click();
    await page.locator('#family-preview-open').click();
    assert.equal(await page.locator('#family-advanced').isVisible(),true);
    await page.locator('[data-weekday="0"]').fill('35');
    await page.locator('#family-rest-start').fill('21:00');
    await page.locator('#family-rest-end').fill('07:00');
    await page.locator('#family-demo-save').click();
    await page.locator('#family-history-days').selectOption('90');
    assert.match(await page.locator('#family-history-summary').textContent(),/90 ngày/);
    assert.equal(await page.locator('#family-comparison').isVisible(),true);
    const downloadEvent=page.waitForEvent('download');
    await page.locator('#family-export').click();
    const download=await downloadEvent;
    const csv=fs.readFileSync(await download.path(),'utf8');
    assert.equal(csv.trim().split('\r\n').length,91);
    assert.match(csv,/date,minutes,source/);
    await page.locator('#family-preview-close').click();
    await page.locator('#family-preview-open').click();
    assert.equal(await page.locator('[data-weekday="0"]').inputValue(),'35');
    await page.locator('#family-preview-close').click();
    await page.locator('#family-plans-open').click();
    await page.locator('[data-tier=\"standard\"]').click();
    await page.locator('[data-family-plan="year"]').click();
    await page.locator('#family-demo-consent').check();
    await page.locator('#family-activate-submit').click();
    assert.match(await page.locator('#family-activate-error').textContent(),/không xóa hồ sơ/);
    await page.locator('#family-onboarding-close').click();
    assert.match(await page.locator('#family-parent-summary-text').textContent(),/Pro.*5\/5/);
    await page.close();
});

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
        await page.locator('#family-demo-save').click();
        assert.equal(await page.locator('#family-limit').getAttribute('aria-invalid'), 'true');
    }
    await page.locator('#family-limit').fill('0');
    await page.locator('#family-demo-save').click();
    assert.match(await page.locator('#family-remaining').textContent(), /hết hạn mức/);
    assert.equal(await page.locator('#family-usage-progress').getAttribute('max'), '1');
    assert.match(await page.locator('#family-feedback').textContent(), /Đã lưu cài đặt trong phiên này/);
    await page.locator('[data-family-child="1"]').click();
    assert.equal(await page.locator('#family-limit').inputValue(), '45');
    await page.locator('#family-limit').fill('90');
    await page.locator('#family-demo-reset').click();
    assert.equal(await page.locator('#family-limit').inputValue(), '45');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#family-preview').evaluate(e => e.open), false);
    assert.equal(await page.locator('#family-preview-open').evaluate(e => e === document.activeElement), true);
    assert.equal(await page.locator('#btn-save').isDisabled(), true);
    await page.locator('#family-preview-open').click();
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

test('responsive layout, dialog overflow, touch targets and DOM references', async () => {
    const page = await browser.newPage();
    await page.goto(url);
    assert.deepEqual(await page.evaluate(() => {
        const ids = Array.from(document.querySelectorAll('[id]'), e => e.id);
        return ids.filter((id, i) => ids.indexOf(id) !== i);
    }), []);
    assert.deepEqual(await page.evaluate(() => Array.from(document.querySelectorAll('[aria-controls], [aria-labelledby], [aria-describedby], label[for]')).flatMap(e => ['aria-controls', 'aria-labelledby', 'aria-describedby', 'for'].flatMap(attr => (e.getAttribute(attr) || '').split(' ').filter(Boolean).filter(id => !document.getElementById(id))))), []);
    for (const width of [320, 375, 390, 640, 641, 768, 868, 869, 1024, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `page overflow ${width}`);
        const boxes = await page.evaluate(() => Array.from(document.querySelector('.main-grid').children, e => ({ x: e.getBoundingClientRect().x, width: e.getBoundingClientRect().width, top: e.getBoundingClientRect().top, bottom: e.getBoundingClientRect().bottom })));
        assert.equal(boxes[0].width, boxes[1].width, `wide parent ${width}`);
        assert.ok(boxes[1].top >= boxes[0].bottom, `parent position ${width}`);
        assert.equal(boxes.length,3);
        assert.equal(boxes[2].width,boxes[1].width, `unified security width ${width}`);
        if ([390, 1440].includes(width)) await page.screenshot({ path: path.join(output, `profile-${width}.png`), fullPage: true });
        await page.locator('#family-preview-open').click();
        assert.equal(await page.locator('#family-preview').evaluate(e => e.scrollWidth <= e.clientWidth), true, `dialog overflow ${width}`);
        const targets = await page.locator('#family-preview button:visible').evaluateAll(elements => elements.map(e => ({ width: e.getBoundingClientRect().width, height: e.getBoundingClientRect().height })));
        assert.ok(targets.every(e => e.width >= 44 && e.height >= 44), `touch targets ${width}`);
        if ([390, 1440].includes(width)) await page.screenshot({ path: path.join(output, `family-${width}.png`) });
        await page.locator('#family-preview-close').click();
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await page.locator('#family-preview-open').evaluate(e => getComputedStyle(e).transitionDuration), '1e-05s');
    await page.setViewportSize({ width: 320, height: 600 });
    await page.locator('#family-preview-open').click();
    await page.locator('#family-child-name').evaluate(e => { e.textContent = 'Tên hồ sơ rất dài '.repeat(8); });
    assert.equal(await page.locator('#family-preview').evaluate(e => e.scrollWidth <= e.clientWidth), true);
    await page.locator('#family-preview').evaluate(e => { e.scrollTop = e.scrollHeight; });
    assert.equal(await page.locator('#family-preview-close').evaluate(e => { const r = e.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; }), true);
    await page.locator('#family-preview-close').click();
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

test('plans, demo activation and child creation work end to end without network or storage', async () => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [], requests = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => { if (request.url() !== url + '/') requests.push(request.url()); });
    await page.goto(url);
    await page.locator('#family-plans-open').click();
    assert.equal(await page.locator('.family-plan').count(), 4);
    assert.equal(await page.locator('[data-price="month"]').textContent(), '49.000đ');
    await page.screenshot({ path: path.join(output, 'plans-1440.png') });
    for (const [key, name] of [['quarter', 'Gói 3 tháng'], ['halfyear', 'Gói 6 tháng'], ['year', 'Gói 1 năm'], ['trial', 'Dùng thử 1 tháng']]) {
        await page.locator(`[data-family-plan="${key}"]`).click();
        assert.equal(await page.locator('#family-selected-plan').textContent(), 'Standard · ' + name);
        const expectedPrice = { trial: '0đ', quarter: '132.300đ', halfyear: '249.900đ', year: '441.000đ' }[key];
        assert.ok((await page.locator('#family-selected-price').textContent()).startsWith(expectedPrice));
        assert.match(await page.locator('#family-consent-text').textContent(), key === 'trial' ? /tự gia hạn Standard 49.000đ\/tháng/ : /không tự gia hạn/);
        assert.equal(await page.locator('#family-demo-consent').isChecked(), false);
        await page.locator('#family-plan-back').click();
    }
    await page.locator('[data-family-plan="trial"]').click();
    await page.locator('#family-activate-submit').click();
    assert.equal(await page.locator('#family-demo-consent').getAttribute('aria-invalid'), 'true');
    await page.locator('#family-demo-consent').check();
    await page.locator('#family-activate-submit').click();
    assert.equal(await page.locator('#family-parent-status').getAttribute('data-active'), 'true');
    await page.locator('#family-create-form button[type="submit"]').click();
    assert.equal(await page.locator('#family-new-name').getAttribute('aria-invalid'), 'true');
    await page.locator('#family-new-name').fill('Gấu Nhỏ');
    await fillBirth(page,'2012-06-15');
    await page.locator('#family-new-gender').selectOption('other');
    await page.locator('#family-new-password').fill('SamplePass123');
    await page.locator('#family-confirm-password').fill('SamplePass123');
    await page.locator('#family-new-username').fill('bad name');
    await page.locator('#family-create-form button[type="submit"]').click();
    assert.equal(await page.locator('#family-new-username').getAttribute('aria-invalid'), 'true');
    await page.locator('#family-new-username').fill('DEMO_GAU');
    await page.locator('#family-create-form button[type="submit"]').click();
    assert.equal(await page.locator('#family-created-username').textContent(), 'demo_gau');
    assert.equal(await page.locator('#family-new-password').inputValue(), '');
    assert.match(await page.locator('#family-parent-summary-text').textContent(), /1\/3 tài khoản con/);
    await page.locator('#family-onboarding-close').click();
    await page.locator('#family-plans-open').click();
    await page.locator('[data-tier=\"pro\"]').click();
    await page.locator('[data-family-plan="month"]').click();
    await page.locator('#family-demo-consent').check();
    await page.locator('#family-activate-submit').click();
    await page.locator('#family-new-name').fill('Cá Nhỏ');
    await fillBirth(page,'2012-06-15');
    await page.locator('#family-new-gender').selectOption('other');
    await page.locator('#family-new-password').fill('SamplePass456');
    await page.locator('#family-confirm-password').fill('SamplePass456');
    await page.locator('#family-new-username').fill('demo_gau');
    await page.locator('#family-create-form button[type="submit"]').click();
    assert.match(await page.locator('#family-create-error').textContent(), /đã có/);
    await page.locator('#family-new-username').fill('demo_ca');
    await page.locator('#family-create-form button[type="submit"]').click();
    await page.locator('#family-manage-created').click();
    await page.waitForFunction(() => document.getElementById('family-preview').open);
    assert.equal(await page.locator('#family-child-name').textContent(), 'Cá Nhỏ');
    assert.equal(await page.locator('[data-family-child]').count(), 2);
    await page.locator('[data-family-child="0"]').click();
    assert.equal(await page.locator('#family-limit').inputValue(), '0');
    await page.locator('#family-limit').fill('15');
    await page.locator('#family-demo-save').click();
    await page.locator('#family-preview-close').click();
    await page.locator('#family-preview-open').click();
    await page.locator('[data-family-child="0"]').click();
    assert.equal(await page.locator('#family-limit').inputValue(), '15');
    await page.locator('#family-preview-close').click();
    assert.equal(await page.locator('#btn-save').isDisabled(), true);
    await page.locator('#family-plans-open').click();
    await page.locator('[data-family-plan="year"]').click();
    await page.locator('#family-demo-consent').check();
    await page.locator('#family-activate-submit').click();
    await page.locator('#family-create-later').click();
    assert.match(await page.locator('#family-parent-summary-text').textContent(), /Pro · Gói 1 năm · 2\/5 tài khoản con/);
    assert.deepEqual(await page.evaluate(() => [localStorage.length, sessionStorage.length]), [0, 0]);
    assert.deepEqual(errors, []);
    assert.deepEqual(requests, []);
    await page.reload();
    assert.equal(await page.locator('#family-parent-summary').isVisible(), false);
    await page.close();
});

test('onboarding mobile, keyboard, cancel and activated empty state', async () => {
    const page = await browser.newPage();
    await page.goto(url);
    for (const width of [320, 390, 640, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await page.locator('#family-plans-open').click();
        assert.equal(await page.locator('#family-onboarding').evaluate(e => e.scrollWidth <= e.clientWidth), true, `plans overflow ${width}`);
        if (width === 390) await page.screenshot({ path: path.join(output, 'plans-390.png') });
        for (let i = 0; i < 10; i++) {
            await page.keyboard.press('Tab');
            assert.equal(await page.evaluate(() => !!document.activeElement.closest('#family-onboarding')), true);
        }
        await page.keyboard.press('Escape');
        await page.waitForFunction(() => document.activeElement.id === 'family-plans-open');
    }
    await page.setViewportSize({ width: 390, height: 900 });
    await page.locator('#family-plans-open').click();
    await page.locator('[data-family-plan="trial"]').click();
    await page.locator('#family-demo-consent').check();
    await page.locator('#family-activate-submit').click();
    await page.screenshot({ path: path.join(output, 'create-child-390.png') });
    assert.equal(await page.locator('#family-onboarding').evaluate(e => e.scrollWidth <= e.clientWidth), true);
    await page.locator('#family-create-later').click();
    assert.match(await page.locator('#family-parent-summary-text').textContent(), /0\/3 tài khoản con/);
    await page.locator('#family-preview-open').click();
    assert.equal(await page.locator('#family-create-form').isVisible(), true);
    assert.equal(await page.locator('#family-preview').evaluate(e => e.open), false);
    await page.locator('#family-new-name').fill('<img src=x onerror=alert(1)>');
    await fillBirth(page,'2012-06-15');
    await page.locator('#family-new-gender').selectOption('other');
    await page.locator('#family-new-password').fill('SamplePass123');
    await page.locator('#family-confirm-password').fill('SamplePass123');
    await page.locator('#family-create-form button[type="submit"]').click();
    assert.equal(await page.locator('#family-created-message img').count(), 0);
    await page.locator('#family-manage-created').click();
    await page.waitForFunction(() => document.getElementById('family-preview').open);
    assert.equal(await page.locator('#family-child-name img').count(), 0);
    assert.match(await page.locator('#family-child-name').textContent(), /<img/);
    await page.close();
});

test('age ceilings and handwritten chart follow each child and saved settings', async () => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.goto(url);
    await page.locator('#family-preview-open').click();
    assert.deepEqual(await page.locator('#family-age option').evaluateAll(options => options.map(o => o.value)), ['0', '12', '16', '18']);
    assert.deepEqual(await page.locator('#family-week-chart li').evaluateAll(items => items.map(e => e.getAttribute('aria-label'))), ['T2: 15 phút', 'T3: 35 phút', 'T4: 10 phút', 'T5: 45 phút', 'T6: 30 phút', 'T7: 20 phút', 'CN: 25 phút']);
    await page.screenshot({ path: path.join(output, 'management-1440.png') });
    for (const [value, ratings] of [['12', ['00+', '12+']], ['16', ['00+', '12+', '16+']], ['0', ['00+']]]) {
        await page.locator('#family-age').selectOption(value);
        await page.locator('#family-demo-save').click();
        assert.deepEqual(await page.locator('#family-allowed-ratings span').allTextContents(), ratings);
    }
    await page.locator('#family-age').selectOption('16');
    await page.locator('#family-demo-reset').click();
    assert.equal(await page.locator('#family-age').inputValue(), '0');
    await page.locator('[data-family-child="1"]').click();
    assert.equal(await page.locator('#family-age').inputValue(), '12');
    assert.equal(await page.locator('#family-week-chart li').last().getAttribute('aria-label'), 'CN: 40 phút');
    await page.setViewportSize({ width: 390, height: 900 });
    assert.equal(await page.locator('#family-preview').evaluate(e => e.scrollWidth <= e.clientWidth), true);
    await page.screenshot({ path: path.join(output, 'management-390.png') });
    await page.close();
});

test('password confirmation, compact active overview and zero history for new children', async () => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const logs = [];
    page.on('console', message => logs.push(message.text()));
    await page.goto(url);
    await page.locator('#family-guide-toggle').click();
    await page.locator('#family-activate-open').click();
    await page.locator('[data-family-plan="trial"]').click();
    await page.locator('#family-demo-consent').check();
    await page.locator('#family-activate-submit').click();
    await page.locator('#family-new-name').fill('Mèo Mướp');
    await fillBirth(page,'2012-06-15');
    await page.locator('#family-new-gender').selectOption('other');
    await page.locator('#family-create-form button[type="submit"]').click();
    assert.equal(await page.locator('#family-new-password').getAttribute('aria-invalid'), 'true');
    await page.locator('#family-new-password').fill('short');
    await page.locator('#family-create-form button[type="submit"]').click();
    assert.match(await page.locator('#family-create-error').textContent(), /8 đến 64/);
    await page.locator('#family-new-password').fill('DemoOnly-1234');
    await page.locator('#family-confirm-password').fill('DoesNotMatch');
    await page.locator('#family-create-form button[type="submit"]').click();
    assert.equal(await page.locator('#family-confirm-password').getAttribute('aria-invalid'), 'true');
    await page.locator('#family-password-toggle').click();
    assert.equal(await page.locator('#family-new-password').getAttribute('type'), 'text');
    assert.equal(await page.locator('#family-confirm-password').getAttribute('type'), 'text');
    await page.locator('#family-password-toggle').click();
    await page.locator('#family-confirm-password').fill('DemoOnly-1234');
    await page.locator('#family-create-form button[type="submit"]').click();
    assert.equal(await page.locator('#family-new-password').inputValue(), '');
    assert.equal(await page.locator('#family-confirm-password').inputValue(), '');
    assert.equal(await page.locator('#family-new-password').getAttribute('type'), 'password');
    await page.locator('#family-onboarding-close').click();
    await page.waitForFunction(() => document.activeElement === document.getElementById('family-preview-open'));
    assert.equal(await page.locator('#family-preview-open').evaluate(e => e === document.activeElement), true);
    assert.equal(await page.locator('#family-marketing').isVisible(), false);
    assert.equal(await page.locator('#family-guide').isVisible(), false);
    assert.equal(await page.locator('#family-guide-toggle').isVisible(), false);
    assert.equal(await page.locator('#family-title').textContent(), 'Quản lý gia đình');
    assert.match(await page.locator('[data-overview-child="0"]').textContent(), /Mèo Mướp.*0\+.*0\/0/);
    await page.locator('#parent-section').screenshot({ path: path.join(output, 'active-family-1440.png') });
    await page.locator('[data-overview-child="0"]').click();
    assert.equal(await page.locator('#family-child-name').textContent(), 'Mèo Mướp');
    assert.equal(await page.locator('#family-age').inputValue(), '0');
    assert.ok((await page.locator('#family-week-chart li').evaluateAll(items => items.map(e => e.getAttribute('aria-label')))).every(text => text.endsWith(': 0 phút')));
    await page.locator('#family-age').selectOption('12');
    await page.locator('#family-limit').fill('45');
    await page.locator('#family-demo-save').click();
    await page.locator('#family-preview-close').click();
    assert.match(await page.locator('[data-overview-child="0"]').textContent(), /12\+.*0\/45/);
    for (const width of [320, 390, 640, 868, 869, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `active page overflow ${width}`);
        if (width === 390) await page.locator('#parent-section').screenshot({ path: path.join(output, 'active-family-390.png') });
    }
    await page.locator('#family-add-child').click();
    assert.equal(await page.locator('#family-create-form').isVisible(), true);
    await page.locator('#family-onboarding-close').click();
    await page.locator('#family-add-child').click();
    assert.equal(await page.locator('#family-new-password').inputValue(), '');
    assert.equal(logs.some(text => /DemoOnly|Cancelled/.test(text)), false);
    assert.deepEqual(await page.evaluate(() => [localStorage.length, sessionStorage.length]), [0, 0]);
    await page.close();
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


test('eligible account gets Free; direct upgrade preserves children and cancellation preserves tier', async () => {
    const source = html.slice(html.indexOf('function qualifiesForFree('), html.indexOf('const freeEligible ='));
    const eligible = new Function(source + '; return qualifiesForFree;')();
    const today = new Date(2026,9,23);
    for (const [account, expected] of [
        [{loggedIn:true,phoneVerified:true,birthDate:'2008-10-23'},true],
        [{loggedIn:true,phoneVerified:true,birthDate:'2008-10-24'},false],
        [{loggedIn:false,phoneVerified:true,birthDate:'2000-01-01'},false],
        [{loggedIn:true,phoneVerified:false,birthDate:'2000-01-01'},false],
        [{loggedIn:true,phoneVerified:true,birthDate:'2000-02-30'},false],
        [{loggedIn:true,phoneVerified:true,birthDate:'2030-01-01'},false],
        [{loggedIn:true,phoneVerified:true},false]
    ]) assert.equal(eligible(account,today),expected);
    const page = await browser.newPage();
    await page.goto(url);
    assert.equal(await page.locator('#account-plan-badge').textContent(),'Free');
    await page.locator('#family-plans-open').click();
    assert.equal(await page.locator('#family-tier').inputValue(),'standard');
    await page.locator('#family-onboarding-close').click();
    assert.equal(await page.locator('#account-plan-badge').textContent(),'Free');
    await page.locator('#family-start-free').click();
    await page.locator('#family-new-name').fill('Con mẫu');
    await fillBirth(page,'2018-06-15');
    await page.locator('#family-new-gender').selectOption('other');
    await page.locator('#family-new-password').fill('Example1234');
    await page.locator('#family-confirm-password').fill('Example1234');
    await page.locator('#family-create-form button[type="submit"]').click();
    await page.locator('#family-onboarding-close').click();
    await page.locator('#account-upgrade').click();
    await page.locator('[data-family-plan="month"]').click();
    await page.locator('#family-demo-consent').check();
    await page.locator('#family-activate-submit').click();
    assert.equal(await page.locator('#family-onboarding').isVisible(),false);
    assert.equal(await page.locator('#account-plan-badge').textContent(),'Standard');
    assert.match(await page.locator('#family-parent-summary-text').textContent(),/1\/3 tài khoản con/);
    assert.match(await page.locator('#account-upgrade').textContent(),/Đổi gói/);
    assert.match(await page.locator('[data-overview-child="0"]').textContent(),/Con mẫu/);
    await page.close();
});


test('discovery is interactive, opens selected limit and header has no upgrade action', async () => {
    const page = await browser.newPage();
    await page.goto(url);
    assert.equal(await page.locator('.profile-header-card button#account-upgrade').count(),0);
    assert.doesNotMatch(await page.locator('body').innerText(), /demo|mô phỏng|dữ liệu mẫu|tài khoản mẫu/i);
    for (const value of [30,90,60]) {
        await page.locator('[data-discovery-limit="'+value+'"]').click();
        assert.equal(await page.locator('#discovery-remaining').textContent(),String(value-25));
        assert.equal(await page.locator('[data-discovery-limit="'+value+'"]').getAttribute('aria-pressed'),'true');
    }
    await page.locator('[data-discovery-limit="30"]').click();
    await page.locator('#discovery-open').click();
    assert.equal(await page.locator('#family-limit').inputValue(),'30');
    assert.doesNotMatch(await page.locator('#family-preview').innerText(), /demo|mô phỏng|dữ liệu mẫu/i);
    await page.locator('#family-preview-close').click();
    assert.equal(await page.locator('#discovery-open').evaluate(e=>e===document.activeElement),true);
    await page.locator('#family-plans-open').click();
    assert.doesNotMatch(await page.locator('#family-onboarding').innerText(), /demo|mô phỏng|dữ liệu mẫu/i);
    await page.close();
});


test('full category catalog supports accentless search, groups, bulk selection and saved state', async () => {
    const page = await browser.newPage();
    await page.goto(url);
    await page.locator('#family-preview-open').click();
    assert.equal(await page.locator('[data-category]').count(),75);
    const labels = await page.locator('.category-chip-grid label span').allTextContents();
    assert.equal(new Set(labels).size,75);
    for(const label of ['Game Hot','Game Mới','Xếp hình','Game Halloween','Lego','Không chiến','Trang Trí']) assert.ok(labels.includes(label));
    await page.locator('#category-clear').click();
    await page.locator('#category-search').fill('hoc');
    assert.equal(await page.locator('.category-chip-grid label:visible').count(),4);
    await page.locator('#category-select-visible').click();
    assert.deepEqual(await page.locator('[data-category]:checked').evaluateAll(items=>items.map(e=>e.dataset.category)),['learning','math','english','prank']);
    await page.locator('#category-search').fill('DAO VANG');
    assert.equal(await page.locator('.category-chip-grid label:visible').innerText(),'Đào vàng');
    await page.locator('#category-search').fill('khong ton tai');
    assert.equal(await page.locator('#category-empty').isVisible(),true);
    assert.equal(await page.locator('#category-select-visible').isDisabled(),true);
    await page.locator('#category-search').fill('');
    await page.locator('#category-group').selectOption('6');
    assert.equal(await page.locator('.category-chip-grid label:visible').count(),4);
    await page.locator('#category-select-visible').click();
    await page.locator('#category-group').selectOption('all');
    await page.locator('#category-selected-only').click();
    assert.equal(await page.locator('.category-chip-grid label:visible').count(),8);
    await page.locator('#family-demo-save').click();
    await page.locator('#category-clear').click();
    await page.locator('#family-demo-reset').click();
    assert.equal(await page.locator('[data-category]:checked').count(),8);
    for(const width of [320,390,768,1440]) {
        await page.setViewportSize({width,height:900});
        assert.equal(await page.locator('#family-preview').evaluate(e=>e.scrollWidth<=e.clientWidth),true);
        await page.locator('#category-search').scrollIntoViewIfNeeded();
        if([390,1440].includes(width)) await page.screenshot({path:path.join(output,'categories-'+width+'.png')});
    }
    await page.close();
});

