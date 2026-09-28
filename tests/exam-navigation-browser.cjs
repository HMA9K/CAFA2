const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const root = path.resolve(__dirname, '..');
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://local').pathname);
  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404); res.end(); return;
  }
  res.setHeader('Content-Type', ({ '.html':'text/html', '.js':'application/javascript', '.mjs':'application/javascript', '.css':'text/css', '.json':'application/json' })[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async () => {
  let browser;
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base=process.env.TEST_BASE_URL || `http://127.0.0.1:${server.address().port}`;
  try {
    browser = await chromium.launch({headless:true, ...(process.env.CHROMIUM_PATH ? {executablePath:process.env.CHROMIUM_PATH} : {})});
    for (const width of [1366, 390]) {
    const page = await browser.newPage({viewport:{width,height:900}});
    page.setDefaultTimeout(15000);
    const errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    await page.addInitScript(()=>localStorage.setItem('skipgc','t'));
    await page.route('**/*', route => route.request().url().startsWith(base+'/')?route.continue():route.abort());
    await page.goto(base+'/index.html#oefenen', {waitUntil:'domcontentloaded'});
    await page.waitForFunction(() => window.CafaFeedback && window.CafaExams && !document.documentElement.classList.contains('cafa-starting'));
    const ids = ['cafa2-20250924', 'cafa2-20240422'];
    await page.evaluate(ids => {
      const attempts = ids.map(id => CafaExamEngine.createAttempt(CafaExams.catalog.find(e => e.id === id), {id:'qa-navigation-'+id, untimed:true}));
      attempts.forEach((a,i)=>{a.answers[a.exam.questions[0].id]={html:'<p>Controleantwoord '+i+'</p>'};a.marked[a.exam.questions[0].id]=true;});
      const value = JSON.stringify({version:1, attempts});
      localStorage.setItem(CafaExams.storageKey, value);
      dispatchEvent(new StorageEvent('storage', {key:CafaExams.storageKey, newValue:value}));
      location.hash = 'tentamen/' + attempts[0].id;
    }, ids);
    await page.locator('.exam-position').waitFor();
    await page.evaluate(() => location.hash = 'tentamen/qa-navigation-cafa2-20240422');
    await page.waitForFunction(() => CafaExams.getPosition()?.examId === 'cafa2-20240422');
    await page.locator('[data-exam-action="overview"]').click();
    await page.locator('#exam-info-dialog').waitFor();
    await page.goBack();
    await page.waitForFunction(() => CafaExams.getPosition()?.examId === 'cafa2-20250924');
    assert.equal(await page.locator('#exam-info-dialog').count(), 0,
      'Een vraagoverzicht uit een ander tentamen mag niet blijven staan na terugnavigeren.');
    await page.goForward();
    await page.waitForFunction(() => CafaExams.getPosition()?.examId === 'cafa2-20240422');
    const before = await page.evaluate(() => CafaExams.getAttempts());
    for (const index of [1, 17, 23, 0]) {
      await page.locator('[data-exam-action="overview"]').click();
      await page.locator('#exam-info-dialog [data-exam-index="'+index+'"]').click();
      const result=await page.evaluate(()=>{
        const p=CafaExams.getPosition(),ctx=CafaExams.getQuestionContext(p.attempt,p.index);
        return {position:p,caseKey:document.getElementById('exam-case-panel').dataset.caseKey,sectionId:ctx.question.sectionId};
      });
      assert.equal(result.position.examId,'cafa2-20240422');
      assert.equal(result.position.index,index);
      assert.equal(result.caseKey,result.position.attempt+':'+result.sectionId);
    }
    await page.locator('[data-exam-action="next"]').click();
    await page.locator('[data-exam-action="previous"]').click();
    const after=await page.evaluate(()=>CafaExams.getAttempts());
    assert.deepEqual(after,before,'Antwoorden, markeringen en andere pogingen blijven bewaard.');
    await page.reload({waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>window.CafaExams?.getPosition()?.examId==='cafa2-20240422'&&window.CafaFeedback&&!document.documentElement.classList.contains('cafa-starting'));
    assert.deepEqual(await page.evaluate(()=>CafaExams.getAttempts()),before);
    console.log('Tentamennavigatie '+width+'px: terug/vooruit, overzicht, vorige/volgende, casus en opslag geslaagd.');
    assert.deepEqual(errors, []);
    await page.close();
    }
  } catch (error) {
    console.error(error.stack);
    throw error;
  } finally {
    if (browser) await browser.close();
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
