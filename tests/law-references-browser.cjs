const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');

const root = path.resolve(__dirname, '..');
const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://local').pathname);
  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    response.writeHead(404); response.end(); return;
  }
  response.setHeader('Content-Type', ({
    '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8', '.json': 'application/json'
  })[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(response);
});

async function checkLawBook(page, opener) {
  assert.match(await opener.innerText(), /Wetboek/);
  await opener.click();
  const book = page.locator('dialog#cafa-law-book');
  await book.waitFor({ state: 'visible' });
  assert.equal(await book.locator('details[data-law-book-entry]').count(), 74,
    'Het algemene Wetboek toont alle 74 opgenomen artikelen.');
  assert.equal(await book.locator('details[data-law-book-entry][open]').count(), 0,
    'Een verwijzing in de vraag mag geen artikel voorselecteren.');
  assert.equal(await page.locator('#study-law-popover:visible').count(), 0,
    'De artikelpopover hoort niet bij het algemene Wetboek.');
  const search = book.locator('input[type="search"]');
  assert.equal(await search.inputValue(), '', 'Het zoekveld begint leeg.');
  await search.fill('389');
  const count = await book.locator('details[data-law-book-entry]:visible').count();
  assert.ok(count >= 1 && count < 74, 'Zoeken moet de volledige artikelenlijst filteren.');
  assert.ok((await book.locator('details[data-law-book-entry]:visible').allInnerTexts())
    .some(text => /2:389/.test(text)), 'Art. 2:389 moet tussen de zoekresultaten staan.');
  await search.fill('');
  assert.equal(await book.locator('details[data-law-book-entry]:visible').count(), 74);
  await page.keyboard.press('Escape');
  assert.equal(await book.isVisible(), false);
}

(async () => {
  let browser;
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    browser = await chromium.launch({ headless: true,
      ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
    const base = 'http://127.0.0.1:' + server.address().port;
    for (const width of [1366, 390]) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      const page = await context.newPage(), errors = [];
      page.on('pageerror', error => errors.push(String(error)));
      page.setDefaultTimeout(15000);

      await page.goto(base + '/index.html#kap-1');
      await page.waitForFunction(() => !!window.CafaPractice && !!window.CafaExams &&
        !document.documentElement.classList.contains('cafa-starting'));
      const mc = page.locator('#kap-1');
      assert.match(await mc.locator('.task').innerText(), /artikel 2:24c lid 1 BW/i);
      assert.equal(await mc.locator('[data-law],a[href*="#wet-"]').count(), 0,
        'Artikelverwijzingen binnen de MC-vraag zijn gewone tekst.');
      const mcBook = mc.locator('.question-nav .nav-right button[data-law-book-open]');
      assert.equal(await mcBook.count(), 1, 'Het Wetboek staat rechtsonder bij de vraagbediening.');
      await mc.locator('.option[data-option="0"]').click();
      await mc.locator('.cafa-check-controls button').first().click();
      assert.equal(await mc.locator('[data-law],a[href*="#wet-"]').count(), 0,
        'Ook na MC-feedback mogen geen artikellinks in de vraag ontstaan.');
      const mcRoute = await page.evaluate(() => location.hash);
      await checkLawBook(page, mcBook);
      assert.equal(await page.evaluate(() => location.hash), mcRoute);
      assert.equal(await page.evaluate(() => CafaPractice.getAnswer('kap', 1).choice), 0);

      await page.goto(base + '/index.html#welkom/cafa2-20250924');
      await page.locator('[data-exam-untimed]').check();
      await page.locator('[data-exam-action="start"]').click();
      await page.locator('body.exam-running').waitFor();
      const examLawIndex = await page.evaluate(() => CafaExams.catalog
        .find(exam => exam.id === 'cafa2-20250924').questions
        .findIndex(question => /artikel 2:24c lid 1 BW/i.test(question.solution)));
      assert.ok(examLawIndex >= 0, 'Er is een officiële uitwerking met art. 2:24c nodig voor deze controle.');
      await page.locator('[data-exam-action="overview"]').click();
      await page.locator(`#exam-info-dialog [data-exam-index="${examLawIndex}"]`).click();
      const examRoute = await page.evaluate(() => location.hash);
      const examBook = page.locator('#exam-app .exam-cirrus-actions button[data-law-book-open]');
      assert.equal(await examBook.count(), 1);
      assert.equal(await page.locator('#exam-app [data-law],#exam-app a[href*="#wet-"]').count(), 0);
      const examAnswer = page.locator('#exam-app [contenteditable="true"]').first();
      await examAnswer.fill('Mijn antwoord blijft bewaard');
      await page.locator('[data-exam-action="check"]').click();
      const examModel = page.locator('#cafa-exam-feedback .exam-source-solution');
      assert.match(await examModel.innerText(), /artikel 2:24c lid 1 BW/i);
      assert.equal(await page.locator('#exam-app [data-law],#exam-app a[href*="#wet-"]').count(), 0,
        'Artikelverwijzingen bij tentamenvragen en hun uitwerking zijn gewone tekst.');
      await checkLawBook(page, examBook);
      assert.equal(await page.evaluate(() => location.hash), examRoute);
      assert.equal(await page.evaluate(() => CafaExams.getPosition().index), examLawIndex);
      assert.match(await page.evaluate(() => Object.values(CafaExams.getAttempts().at(-1).answers)[0].html),
        /Mijn antwoord blijft bewaard/);
      await page.locator('[data-exam-action="submit"]').click();
      await page.locator('[data-exam-confirm-submit]').click();
      await page.locator('.result-group').first().waitFor();
      assert.equal(await page.locator('#exam-app [data-law],#exam-app a[href*="#wet-"]').count(), 0,
        'Ook bij inzage blijven artikelverwijzingen in het antwoordmodel platte tekst.');

      await page.goto(base + '/index.html#welkom/opgaven');
      for (const input of await page.locator('[data-opgave-exam]').all()) {
        if (await input.getAttribute('value') !== 'cafa2-20250924') await input.uncheck();
      }
      await page.locator('[data-exam-action="start-opgave"]').click();
      await page.locator('body.exam-running').waitFor();
      const compositeLawIndex = await page.evaluate(() => CafaExams.getAttempts().at(-1).exam.questions
        .findIndex(question => /artikel 2:24c lid 1 BW/i.test(question.solution)));
      assert.ok(compositeLawIndex >= 0);
      await page.locator('[data-exam-action="overview"]').click();
      await page.locator(`#exam-info-dialog [data-exam-index="${compositeLawIndex}"]`).click();
      const compositeRoute = await page.evaluate(() => location.hash);
      const compositeBook = page.locator('#exam-app .exam-cirrus-actions button[data-law-book-open]');
      assert.equal(await compositeBook.count(), 1);
      const compositeAnswer = page.locator('#exam-app [contenteditable="true"]').first();
      await compositeAnswer.fill('Antwoord uit samengestelde opgave');
      await page.locator('[data-exam-action="check"]').click();
      const compositeModel = page.locator('#cafa-exam-feedback .exam-source-solution');
      assert.match(await compositeModel.innerText(), /artikel 2:24c lid 1 BW/i);
      assert.equal(await page.locator('#exam-app [data-law],#exam-app a[href*="#wet-"]').count(), 0);
      await checkLawBook(page, compositeBook);
      assert.equal(await page.evaluate(() => location.hash), compositeRoute);
      assert.equal(await page.evaluate(() => CafaExams.getPosition().index), compositeLawIndex);
      assert.match(await page.evaluate(() => Object.values(CafaExams.getAttempts().at(-1).answers)[0].html),
        /Antwoord uit samengestelde opgave/);

      await page.goto(base + '/samenvatting.html#kapitaalboom');
      const studyLaw = page.locator('#capital-classify .law-ref[data-law="24c"]').first();
      await studyLaw.click();
      assert.equal(await page.locator('#study-law-popover').isVisible(), true,
        'In het studiemateriaal blijft de bestaande artikelpopover bruikbaar.');

      await page.goto(base + '/fallback/kapitaalbelangen.html#kap-1');
      const fallback = page.locator('#kap-1');
      await fallback.waitFor({ state: 'visible' });
      assert.match(await fallback.locator('.task').innerText(), /artikel 2:24c lid 1 BW/i);
      assert.equal(await fallback.locator('[data-law],a[href*="#wet-"]').count(), 0,
        'Ook de zelfstandige MC-pagina toont platte artikelverwijzingen.');
      await checkLawBook(page, fallback.locator('.question-nav .nav-right button[data-law-book-open]'));
      assert.deepEqual(errors, []);
      await context.close();
    }
    console.log('Wetboek geslaagd: MC, tentamens, samengestelde opgave, inzage en fallback; algemene lijst, zoeken en bewaarde antwoorden op desktop en mobiel.');
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
