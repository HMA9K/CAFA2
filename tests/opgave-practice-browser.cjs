const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');

const root = path.resolve(__dirname, '..');
const output = process.env.QA_OUTPUT || path.join(root, '..', 'CAFA2-opgave-QA');
fs.mkdirSync(output, { recursive: true });
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://local').pathname);
  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404); res.end(); return;
  }
  res.setHeader('Content-Type', ({ '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' })[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});

(async () => {
  let browser;
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
    const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:' + server.address().port;
    for (const width of [1366, 390]) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(String(error)));
      await page.goto(base + (width === 1366 ? '/index.html#dashboard' : '/#dashboard'));
      await page.locator('a[href="#welkom/opgaven"]').first().waitFor();
      assert.equal(await page.locator('a[href="#welkom/opgaven"]').count(), 2);
      await page.locator('a[href="#welkom/opgaven"]').first().click();
      await page.locator('[data-opgave-exam]').first().waitFor();
      assert.equal(await page.locator('[data-opgave-exam]').count(), 5);
      assert.match(await page.locator('[data-opgave-summary]').innerText(), /5 tentamens geselecteerd · 39 vragen/);
      await page.locator('[data-exam-action="start-opgave"]').click();
      await page.locator('body.exam-running').waitFor();
      assert.ok(await page.locator('.study-exam-link').count(), 'De bronvraag houdt haar link naar de uitleg.');
      await page.locator('[data-exam-action="introduction"]').click();
      assert.match(await page.locator('#exam-info-title').innerText(), /Examen 20260429/);
      assert.match(await page.locator('#exam-info-dialog .exam-modal-body').innerText(), /Algemene uitgangspunten alle opgaven in dit tentamen/);
      await page.locator('#exam-info-dialog [data-close-info]').last().click();
      await page.locator('[data-exam-action="overview"]').click();
      await page.locator('#exam-info-dialog.compact-overview-dialog').waitFor();
      assert.equal(await page.locator('.compact-overview-group h3').count(), 5);
      assert.equal(await page.locator('.compact-overview-group .compact-overview-item').count(), 39);
      await page.screenshot({ path: path.join(output, 'overview-all-' + width + '.png') });
      await page.locator('#exam-info-dialog [data-close-info]').last().click();
      await page.goto(base + (width === 1366 ? '/index.html#welkom/opgaven' : '/#welkom/opgaven'));
      await page.locator('[data-opgave-exam]').first().waitFor();
      await page.locator('[name="opgave-number"][value="3"]').check();
      assert.match(await page.locator('[data-opgave-summary]').innerText(), /5 tentamens geselecteerd · 36 vragen/);
      await page.locator('[data-opgave-exam][value="cafa2-20260429"]').uncheck();
      await page.locator('[data-opgave-exam][value="cafa2-20250417"]').uncheck();
      assert.match(await page.locator('[data-opgave-summary]').innerText(), /3 tentamens geselecteerd · 22 vragen/);
      await page.screenshot({ path: path.join(output, 'intro-' + width + '.png'), fullPage: true });
      await page.locator('[data-exam-action="start-opgave"]').click();
      await page.locator('body.exam-running').waitFor();
      const attempt = await page.evaluate(() => CafaExams.getAttempts().at(-1));
      assert.equal(attempt.exam.practiceKind, 'opgave');
      assert.equal(attempt.exam.opgaveNumber, 3);
      assert.deepEqual(attempt.exam.sourceExamIds, ['cafa2-20250924', 'cafa2-20240930', 'cafa2-20240422']);
      assert.equal(attempt.exam.questions.length, 22);
      assert.equal(attempt.untimed, true);
      assert.match(await page.locator('.exam-question-top').innerText(), /20250924/);
      const answer = page.locator('#exam-app [contenteditable="true"]').first();
      const answerDetails = answer.locator('xpath=ancestor::details[1]');
      if (await answerDetails.count() && !await answerDetails.evaluate(element => element.open)) await answerDetails.locator('summary').click();
      await answer.fill('Mijn uitwerking voor de eerste bron');
      await page.locator('[data-exam-action="overview"]').click();
      await page.locator('#exam-info-dialog.compact-overview-dialog').waitFor();
      assert.deepEqual(await page.locator('.compact-overview-group h3').allInnerTexts(), ['Examen 20250924', 'Examen 20240930', 'Examen 20240422']);
      assert.equal(await page.locator('.compact-overview-group .compact-overview-item').count(), 22);
      await page.screenshot({ path: path.join(output, 'overview-' + width + '.png') });
      const secondIndex = attempt.exam.questions.findIndex(q => q.sourceCode === '20240930');
      await page.locator('#exam-info-dialog [data-exam-index="' + secondIndex + '"]').click();
      await page.locator('.exam-question-top').getByText('20240930').waitFor();
      assert.equal(await page.evaluate(() => CafaExams.getAttempts().at(-1).currentIndex), secondIndex);
      await page.reload();
      await page.locator('body.exam-running').waitFor();
      const reloaded = await page.evaluate(() => CafaExams.getAttempts().at(-1));
      assert.match(reloaded.answers[attempt.exam.questions[0].id].html, /Mijn uitwerking voor de eerste bron/);
      assert.equal(reloaded.currentIndex, secondIndex);
      await page.locator('[data-exam-action="submit"]').click();
      await page.locator('[data-exam-confirm-submit]').click();
      await page.locator('.result-group').first().waitFor();
      assert.equal(await page.locator('.result-group').count(), 3);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      assert.deepEqual(errors, []);
      await context.close();
    }
    console.log('Opgave-browsercontrole geslaagd: dashboard, selectie, opgavegroepen, antwoorden, herladen en resultaten op desktop en mobiel.');
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
