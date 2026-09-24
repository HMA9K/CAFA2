const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const root=path.resolve(__dirname,'..'),out=process.env.QA_OUTPUT; if(out)fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{const pathname=decodeURIComponent(new URL(req.url,'http://local').pathname),file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8'})[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);});
(async()=>{let browser;await new Promise(r=>server.listen(0,'127.0.0.1',r));try{
 const base=process.env.TEST_BASE_URL||'http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
 for(const width of [1366,390]){
  const context=await browser.newContext({viewport:{width,height:950}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));page.setDefaultTimeout(15000);
  await page.goto(base+'/index.html#oefenen');await page.waitForFunction(()=>window.CafaFeedback&&window.CafaExams&&!document.documentElement.classList.contains('cafa-starting'));
  const audit=await page.evaluate(()=>Array.from(document.querySelectorAll('.question .review-content')).map(box=>{const model=box.querySelector('.correct-model')||box,pattern=model.querySelector('.feedback-pattern'),caption=model.querySelector('.model-caption');return {patterns:box.querySelectorAll('.pattern').length,wrapped:box.querySelectorAll('.feedback-pattern > .pattern').length,notes:box.querySelectorAll('.study-answer-note').length,wrappedNotes:box.querySelectorAll('.feedback-note > .study-answer-note').length,closed:!box.querySelector('.feedback-disclosure[open]'),order:!pattern||!!(caption.compareDocumentPosition(pattern)&Node.DOCUMENT_POSITION_FOLLOWING)};}));
  assert.equal(audit.length,494);for(const row of audit){assert.equal(row.patterns,row.wrapped);assert.equal(row.notes,row.wrappedNotes);assert.ok(row.closed&&row.order);}
  await page.locator('a[href="#onderwerp-zeggenschap"]').click();await page.waitForURL('**#kap-1');const q=page.locator('#kap-1');
  assert.equal(await q.getByRole('link',{name:'Alle onderwerpen',exact:true}).count(),0);await q.getByRole('link',{name:'Vragenoverzicht van dit onderwerp'}).click();await page.waitForURL('**#onderwerp-overzicht-zeggenschap');await page.evaluate(()=>location.hash='#kap-1');
  await q.locator('.option[data-option="0"]').click();await q.locator('.cafa-check-controls button').first().click();const feedback=q.locator('.cafa-inline-feedback').first(),pattern=feedback.locator('.feedback-pattern'),note=feedback.locator('.feedback-note');
  assert.ok(await feedback.locator('.model-caption').isVisible());assert.ok(await pattern.locator('.pattern').isHidden());assert.ok(await note.locator('.study-answer-note').isHidden());
  await pattern.locator('summary').focus();await page.keyboard.press('Enter');assert.ok(await pattern.locator('.pattern').isVisible());await page.keyboard.press('Enter');assert.ok(await pattern.locator('.pattern').isHidden());
  await note.locator('summary').click();assert.ok(await note.locator('.study-answer-note').isVisible());await note.locator('summary').click();
  if(out)await feedback.screenshot({path:path.join(out,'cafa2-feedback-'+width+'.png')});
  await q.locator('[data-direct-check]').check();await page.evaluate(()=>location.hash='#kap-2');const q2=page.locator('#kap-2');await q2.locator('.option[data-option="1"]').click();await q2.locator('.cafa-inline-feedback').first().waitFor();assert.equal(await q2.locator('.feedback-disclosure[open]').count(),0);
  // Full exams show their original model before an optional, closed explanation.
  const examId=await page.evaluate(()=>CafaExams.catalog.find(e=>!e.demo).id);await page.evaluate(id=>location.hash='#welkom/'+id,examId);await page.locator('[data-exam-untimed]').check();await page.locator('[data-exam-action="start"]').click();await page.locator('[data-exam-action="check"]').click();
  const examNote=page.locator('#cafa-exam-feedback .feedback-note');assert.ok(await examNote.locator('.study-answer-note').isHidden());await examNote.locator('summary').click();assert.ok(await examNote.locator('.study-answer-note').isVisible());
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);await context.close();
 }
 console.log(JSON.stringify({ok:true,viewports:[1366,390],reviewPanels:494,checks:'Antwoord eerst, beide toelichtingen standaard dicht, muis en toetsenbord, direct nakijken, volledige tentamens, geen dubbele Alle onderwerpen-link'}));
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
