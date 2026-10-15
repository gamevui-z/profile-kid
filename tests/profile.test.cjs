const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const output = path.join(__dirname, '..', 'test-results');
let browser, server, url;

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
    assert.match(await page.locator('#family-feedback').textContent(), /Chưa áp dụng/);
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
    await page.locator('#link-change-email').click();
    assert.match(await page.locator('#toast-message').textContent(), /liên kết xác thực/);
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
        assert.equal(boxes[2].top === boxes[3].top, width >= 869, `login/social columns ${width}`);
        if ([390, 1440].includes(width)) await page.screenshot({ path: path.join(output, `profile-${width}.png`), fullPage: true });
        await page.locator('#family-preview-open').click();
        assert.equal(await page.locator('#family-preview').evaluate(e => e.scrollWidth <= e.clientWidth), true, `dialog overflow ${width}`);
        const targets = await page.locator('#family-preview button').evaluateAll(elements => elements.map(e => ({ width: e.getBoundingClientRect().width, height: e.getBoundingClientRect().height })));
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

