import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url),{chromium}=require(process.env.CAFA_PLAYWRIGHT_PATH||'playwright');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'docs/mc-audit/qa');fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{const p=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!p.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}if(!fs.existsSync(p)||!fs.statSync(p).isFile()){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json'})[path.extname(p)]||'application/octet-stream');fs.createReadStream(p).pipe(res);});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+server.address().port;
let browser;
try{
 browser=await chromium.launch({headless:true,...(process.env.CAFA_CHROMIUM_PATH?{executablePath:process.env.CAFA_CHROMIUM_PATH}:{})});
 const context=await browser.newContext({viewport:{width:1366,height:950}});
 await context.route('**/*',r=>r.request().url().startsWith(base)?r.continue():r.abort());
 await context.addInitScript(()=>{
  const k='cafa2-all-120-v1';
  const oldAnswer={choice:0,mode:'mc',marked:true,text:'Bewaarde notitie',checked:true,firstMC:{choice:0,correct:true,at:'2026-09-01T10:00:00Z'}};
  if(!localStorage.getItem(k))localStorage.setItem(k,JSON.stringify({id:k,v:1,font:14,studyMode:'practice',modules:{kap:{current:2,answers:{1:oldAnswer},history:[{attempt:1,finished:true,answers:{1:oldAnswer}}]}}}));
 });
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));page.setDefaultTimeout(15000);
 await page.goto(base+'/index.html#oefenen');await page.locator('#practice-topic-cards .topic-card').first().waitFor();await page.waitForFunction(()=>window.CafaFeedback&&window.CafaExams);
 assert.equal(await page.locator('#practice-topic-cards .topic-card').count(),19);
 assert.equal(await page.locator('#oefenen > .home-body > .topic-grid > .topic-card').count(),4);
 const before=await page.evaluate(()=>CafaPractice.getAnswer('kap',1));assert.equal(before.text,'Bewaarde notitie');assert.equal(before.marked,true);assert.equal(await page.evaluate(()=>CafaPractice.getCompleted()[0].total),30);
 const topics=await page.evaluate(()=>CAFA2_TOPICS.map(t=>({id:t.id,questions:t.questions,frequency:t.frequency})));
 assert.equal(topics.length,19);for(const t of topics){assert.equal(t.frequency.total,11);if(!process.argv.includes('--smoke'))assert.ok(t.questions.length>=10,t.id+' minimum10');}
 await page.locator('a[href="#onderwerp-zeggenschap"]').click();await page.waitForURL('**#kap-1');
 assert.equal(await page.locator('#kap-1 .qnum').innerText(),'1');
 assert.equal(await page.locator('#kap-1 .practice-page-title').innerText(),'Kapitaalbelangen en zeggenschap');
 await page.locator('#kap-1 .nav-left a').last().click();const next=topics[0].questions[1];await page.waitForURL('**#'+next);
 let q=page.locator('#'+next);await q.locator('.option[data-option="1"]').click();
 assert.equal(await q.locator('.cafa-inline-feedback:not([hidden])').count(),0);
 await q.locator('.cafa-check-controls button').first().click();await q.locator('.cafa-inline-feedback:not([hidden])').first().waitFor();
 assert.equal(await q.locator('.correct-model .feedback-pattern').first().evaluate(e=>e.open),false);
 assert.equal(await q.locator('.correct-model').first().evaluate(e=>!!(e.querySelector('.model-caption').compareDocumentPosition(e.querySelector('.feedback-pattern'))&Node.DOCUMENT_POSITION_FOLLOWING)),true);
 assert.equal(await q.locator('.cafa-inline-feedback:not([hidden])').first().evaluate(e=>e.previousElementSibling.matches('.option[data-option="1"]')),true);
 await page.reload();await page.locator('#'+next+' .practice-page-title').waitFor();assert.equal(await page.evaluate(uid=>{const[c,i]=uid.split('-');return CafaPractice.getAnswer(c,+i).choice;},next),1);
 await q.locator('[data-overview]').click();await page.waitForURL('**#onderwerp-overzicht-zeggenschap');assert.equal(await page.locator('#onderwerp-overzicht-zeggenschap .result-row').count(),topics[0].questions.length);
 await page.locator('#onderwerp-overzicht-zeggenschap a[href="#oefenen"]').click();await page.locator('#practice-topic-cards').waitFor();
 await page.locator('[data-start="kap"]').click();await page.locator('.question:target .practice-page-title').waitFor();assert.equal(await page.evaluate(()=>CafaTopics.getState().active),null);
 // Exam mode on an independent topic must hide feedback and finish only that topic.
 await page.evaluate(()=>location.hash='oefenen');await page.locator('select[data-study-mode]').selectOption('exam');
 await page.locator('a[href="#onderwerp-waardering"]').click();await page.locator('.question:target').waitFor();q=page.locator('.question:target');
 await q.locator('.option[data-option="0"]').click();assert.equal(await q.evaluate(e=>e.classList.contains('is-exam')),true);assert.equal(await q.locator('.cafa-check-controls:not([hidden])').count(),0);
 page.once('dialog',d=>d.accept());await q.locator('.practice-finish').click();await page.waitForURL('**#onderwerp-resultaat-waardering');
 assert.equal(await page.evaluate(()=>CafaTopics.getState().topics.waardering.finished),true);
 assert.equal(await page.evaluate(()=>CafaPractice.getModule('kap').finished),false);await page.evaluate(()=>location.hash='resultaat-kap');await page.waitForFunction(()=>CafaTopics.getState().active===null);
 // Additional questions use the same feedback and storage as original questions.
 if(!process.argv.includes('--smoke')){
  await page.evaluate(()=>location.hash='oefenen');await page.locator('select[data-study-mode]').selectOption('practice');
  const special=topics.find(t=>t.id==='belastingen');await page.locator('a[href="#onderwerp-belastingen"]').click();await page.waitForURL('**#'+special.questions[0]);q=page.locator('.question:target');
  await q.locator('[data-direct-check]').first().check();await q.locator('.option[data-option="0"]').click();await q.locator('.cafa-inline-feedback:not([hidden])').first().waitFor();
  await q.locator('.mode-switch label').last().click();await q.locator('.practice-rich-answer').waitFor();await q.locator('.practice-rich-answer [contenteditable=true]').fill('Nieuwe fiscale notitie');
  await page.reload();await page.waitForFunction(()=>window.CafaFeedback);q=page.locator('.question:target');assert.equal(await q.locator('.practice-rich-answer [contenteditable=true]').innerText(),'Nieuwe fiscale notitie');
  await q.locator('.mode-switch label').first().click();await q.locator('.option[data-option="0"]').click();await q.locator('.cafa-inline-feedback:not([hidden])').first().waitFor();
  assert.ok((await q.locator('.theory-content').textContent()).length>200);await page.evaluate(()=>CafaTheme.setMode('dark'));await page.screenshot({path:path.join(out,'new-question-dark.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(out,'new-question-mobile.png'),fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
  await page.setViewportSize({width:1366,height:950});await page.evaluate(()=>CafaTheme.setMode('light'));
  await page.evaluate(()=>location.hash='oefenen');await page.locator('#practice-topic-cards').waitFor();const outside=await page.evaluate(()=>CafaPractice.getAnswer('kap',4));page.once('dialog',d=>d.accept());await page.locator('[data-topic-reset="zeggenschap"]').click();await page.waitForFunction(()=>window.CafaFeedback&&location.hash==='#kap-1');assert.equal(await page.evaluate(()=>CafaPractice.getAnswer('kap',1).choice),null);assert.deepEqual(await page.evaluate(()=>CafaPractice.getAnswer('kap',4)),outside);
  assert.equal(await page.evaluate(()=>CafaTopics.getState().topics.zeggenschap.history.length),1);
  await page.evaluate(()=>location.hash='oefenen');page.once('dialog',d=>d.accept());await page.locator('#oefenen [data-reset="kap"]').click();await page.waitForFunction(()=>window.CafaFeedback);assert.equal(await page.evaluate(()=>CafaTopics.getState().topics.waardering.finished),false);assert.equal(await page.evaluate(()=>CafaTopics.getState().topics.waardering.started),false);
 }
 await page.evaluate(()=>location.hash='oefenen');await page.locator('#practice-topic-cards').waitFor();await page.screenshot({path:path.join(out,'desktop-overview.png'),fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(out,'mobile-overview.png'),fullPage:true});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,'Mobiele horizontale overflow');
 await page.locator('a[href="#onderwerp-slotkoers"]').click();await page.locator('.question:target').waitFor();await page.screenshot({path:path.join(out,'mobile-question.png')});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,'Mobiele vraagoverflow');
 assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(out,'browser-report.json'),JSON.stringify({passed:true,desktop:[1366,950],mobile:[390,844],topics:19,questions:topics.reduce((n,t)=>n+t.questions.length,0),checks:['old progress and notes preserved','topic navigation and overview','canonical answer persistence on reload','pattern first in feedback','feedback immediately below selected option','module/topic separation','exam mode and scoped finish','new question direct feedback and rich answer persistence','dark/light rendering','scoped reset preserves other answers','part reset invalidates topic modes','historical attempt denominator','topic result context exit','mobile overflow'],errors},null,2));
 console.log('Onderwerp-browsercontrole geslaagd.');
}finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
