const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');

const root = path.resolve(__dirname, '..');
const output = process.env.QA_OUTPUT;
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://local').pathname);
  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404); res.end(); return;
  }
  res.setHeader('Content-Type', ({ '.html': 'text/html', '.js': 'application/javascript', '.mjs': 'application/javascript', '.css': 'text/css', '.json': 'application/json' })[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});

(async () => {
  let browser;
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = 'http://127.0.0.1:' + server.address().port;
  try {
    browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
    for (const width of [1888, 1366, 768, 390, 320]) {
      for (const theme of ['light', 'dark']) {
        const context = await browser.newContext({ viewport: { width, height: 844 }, colorScheme: theme });
        await context.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
        const page = await context.newPage();
        await page.goto(base + '/samenvatting.html#start');
        const menu = page.locator('#learning-tools-menu');
        await menu.locator('summary').click();
        assert.equal(await menu.evaluate(node => node.open), true);
        for (const link of await menu.locator('nav > a').all()) {
          assert.equal(await link.evaluate(node => {
            const r = node.getBoundingClientRect();
            const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
            return r.x >= 0 && r.right <= innerWidth && r.y >= 0 && r.bottom <= innerHeight && node.contains(hit);
          }), true, `Menu link is visible and clickable at ${width}/${theme}: ${await link.textContent()}`);
        }
        if (output && theme === 'light' && [1366, 390].includes(width)) {
          fs.mkdirSync(output, { recursive: true });
          await page.screenshot({ path: path.join(output, `dropdown-${width}.png`) });
        }
        await page.keyboard.press('Escape');
        assert.equal(await menu.evaluate(node => node.open), false);
        assert.equal(await menu.locator('summary').evaluate(node => node === document.activeElement), true);
        await menu.locator('summary').click();
        await page.locator('#reader-main').click({ position: { x: 5, y: 5 } });
        assert.equal(await menu.evaluate(node => node.open), false);
        await menu.locator('summary').click();
        await menu.locator('a[href$="#kernschema"]').click();
        await page.locator('#kernschema').waitFor({ state: 'visible' });
        assert.equal(await menu.evaluate(node => node.open), false);
        await page.evaluate(() => window.scrollTo(0, 300));
        await menu.locator('summary').click();
        assert.equal(await menu.locator('a[href$="#kernschema"]').evaluate(node => {
          const r = node.getBoundingClientRect();
          return node.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
        }), true, 'Menu remains clickable after scrolling');
        console.log(`PASS ${width}/${theme}: links, Escape, outside click, navigation and scroll; font ${await menu.evaluate(node => getComputedStyle(node).fontFamily)}`);
        await context.close();
      }
    }
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
