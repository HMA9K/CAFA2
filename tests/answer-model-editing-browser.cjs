/* Test the actual exam editor and revealed model in an isolated browser. */
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const base = process.env.MODEL_EDIT_URL;
if (!base) throw Error('Set MODEL_EDIT_URL to the application URL.');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH });
  try {
    const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
    page.setDefaultTimeout(120000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => route.request().url().startsWith(base.replace(/\/$/, '') + '/') ? route.continue() : route.abort());
    await page.goto(base.replace(/\/$/, '') + '/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.CafaExams || window.SRACirrus);
    const sra = await page.evaluate(() => !!window.SRACirrus);
    const kinds = await page.evaluate(() => {
      const questions = (window.SRA_CIRRUS_EXAMS || window.CAFA2_EXAMS).flatMap(exam => exam.questions);
      return ['text', ...(window.CafaJournalTable && questions.some(q => CafaJournalTable.supports(q)) ? ['journal'] : []),
        ...(window.CafaStockTable && questions.some(q => CafaStockTable.template(q)) ? ['stock'] : [])];
    });
    for (const kind of kinds) {
      await page.evaluate(({ kind, sra }) => {
        const app = sra ? SRACirrus : CafaExams, catalog = sra ? SRA_CIRRUS_EXAMS : CAFA2_EXAMS;
        const matches = q => q.type === 'open' && (kind === 'journal' ? CafaJournalTable.supports(q) : kind === 'stock' ? CafaStockTable.template(q) :
          !(window.CafaJournalTable && CafaJournalTable.supports(q)) && !(window.CafaStockTable && CafaStockTable.template(q)));
        const exam = catalog.find(e => e.questions.some(matches));
        const attempt = CafaExamEngine.createAttempt(exam, { id: 'qa-model-' + kind, untimed: true });
        attempt.currentIndex = exam.questions.findIndex(matches);
        const value = JSON.stringify({ version: 1, attempts: [attempt] });
        localStorage.setItem(app.storageKey, value);
        dispatchEvent(new StorageEvent('storage', { key: app.storageKey, newValue: value }));
        location.hash = (sra ? 'toets/' : 'tentamen/') + attempt.id;
      }, { kind, sra });
      const feedback = page.locator(sra ? '[data-exam-feedback]' : '#cafa-exam-feedback');
      await page.locator('[data-exam-action="check"]').click();
      await feedback.waitFor({ state: 'visible' });
      const score = feedback.locator('[data-self-score]');
      await score.fill('1'); await score.dispatchEvent('change');
      await feedback.evaluate(node => { window.qaModelNode = node.firstElementChild; const details = node.querySelector('details'); if (details) details.open = true; });
      const answer = page.locator('[data-exam-answer]');
      const input = kind === 'text' ? answer.locator('[contenteditable="true"]').first() : answer.locator('input:not([type="radio"])').first();
      await input.fill(kind === 'text' ? 'Uitwerking overtypen' : '100');
      await page.waitForTimeout(650);
      assert.equal(await feedback.isVisible(), true, kind + ': model stays visible');
      assert.equal(await feedback.evaluate(node => node.firstElementChild === window.qaModelNode), true, kind + ': model DOM preserved');
      assert.equal(await feedback.evaluate(node => !node.querySelector('details') || node.querySelector('details').open), true);
      assert.equal(await input.evaluate(node => document.activeElement === node), true, kind + ': editing focus preserved');
      assert.equal(await score.inputValue(), '', kind + ': obsolete score cleared');
      assert.equal(await feedback.locator('[data-score-saved]').innerText(), '');
      assert.equal(await page.evaluate(sra => {
        const app = sra ? SRACirrus : CafaExams, a = app.getAttempts()[0], q = a.exam.questions[a.currentIndex];
        return Object.hasOwn(a.scores || {}, q.id);
      }, sra), false);
      if (kind === 'text') {
        // Formatting buttons must not close the model either.
        const format = answer.locator('button').first();
        if (await format.count()) { await format.click(); assert.equal(await feedback.isVisible(), true); }
      }
      await page.locator('[data-exam-action="next"]').click();
      assert.equal(await page.locator(sra ? '[data-exam-feedback]' : '#cafa-exam-feedback').isVisible(), false, 'No model leaks to another question');
      if (sra) {
        await page.locator('[data-exam-action="previous"]').click();
        await feedback.waitFor({ state: 'visible' });
        await page.reload({ waitUntil: 'domcontentloaded' });
        await feedback.waitFor({ state: 'visible' });
        assert.equal(await score.inputValue(), '', 'Invalidated score remains empty after reload');
      }
    }
    assert.deepEqual(errors, []);
    console.log('OK: ' + (sra ? 'SRA' : 'CAFA2') + ' model blijft open tijdens ' + kinds.join(', ') + '; score, focus en vraagisolatie gecontroleerd.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
