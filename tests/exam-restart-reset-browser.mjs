import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {createRequire} from 'node:module';
import {root} from '../scripts/exam-practice-source.mjs';
const {chromium}=createRequire(import.meta.url)(process.env.CAFA_PLAYWRIGHT_PATH||'playwright');
const server=http.createServer((req,res)=>{
 const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
 res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'application/javascript','.mjs':'application/javascript','.css':'text/css'})[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base=process.env.CAFA_LIVE_URL||'http://127.0.0.1:'+server.address().port;
const out=path.join(root,'docs/mc-audit/qa-exam-restart-reset');fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.CAFA_CHROMIUM_PATH?{executablePath:process.env.CAFA_CHROMIUM_PATH}:{})});
try{
 const page=await browser.newPage({viewport:{width:1366,height:900}}),errors=[];page.on('pageerror',e=>errors.push(String(e)));page.setDefaultTimeout(60000);
 await page.route('**/*',route=>route.request().url().startsWith(base+'/')?route.continue():route.abort());
 await page.goto(base+'/index.html#dashboard');await page.waitForFunction(()=>window.CafaExams&&window.CafaFeedback&&window.CafaPractice);
 const before=await page.evaluate(()=>{
  const e=CAFA2_EXAMS.find(e=>e.id==='cafa2-20250924'),other=CAFA2_EXAMS.find(e=>e.id==='cafa2-20240930');
  const a=CafaExamEngine.createAttempt(e,{id:'restart-browser-original'});a.currentIndex=2;a.answers[e.questions[0].id]={html:'<p>Bewaard tentamenantwoord</p>'};a.scores={[e.questions[0].id]:1};a.marked={[e.questions[0].id]:true};
  const b=CafaExamEngine.createAttempt(other,{id:'restart-browser-other',untimed:true});
  const c=CafaExamEngine.finishAttempt(CafaExamEngine.createAttempt(e,{id:'restart-browser-completed'}),{reason:'submitted'});
  const raw=JSON.stringify({version:1,attempts:[a,b,c]});localStorage.setItem(CafaExams.storageKey,raw);window.dispatchEvent(new StorageEvent('storage',{key:CafaExams.storageKey,newValue:raw}));
  CafaPractice.setRichAnswer('kap',1,'<p>MC-antwoord behouden</p>');return {attempts:CafaExams.getAttempts(),mc:CafaPractice.getAnswer('kap',1)};
 });
 await page.locator('[data-restart-attempt="restart-browser-original"]').click();await page.locator('[data-exam-extra]').waitFor();
 assert.deepEqual(await page.evaluate(()=>CafaExams.getAttempts()),before.attempts);assert.equal(await page.evaluate(()=>CafaExams.getPosition()),null);
 assert.match(page.url(),/welkom\/cafa2-20250924\/opnieuw\/restart-browser-original$/);
 await page.locator('[data-exam-extra]').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,'restart-introduction-desktop.png')});
 // Reload the introduction before choosing the new time settings.
 await page.reload();await page.waitForFunction(()=>window.CafaExams&&window.CafaFeedback);assert.deepEqual(await page.evaluate(()=>CafaExams.getAttempts()),before.attempts);
 const mcBeforeReset=await page.evaluate(()=>CafaPractice.getAnswer('kap',1));assert.equal(mcBeforeReset.html,before.mc.html);
 await page.locator('[data-exam-extra]').check();assert.equal(await page.locator('[data-exam-detail-duration]').textContent(),'210 minuten');
 await page.locator('[data-exam-action="start"]').click();await page.locator('#exam-case-panel').waitFor();
 const after=await page.evaluate(()=>CafaExams.getAttempts());assert.equal(after.length,4);
 assert.equal(after[0].status,'completed');assert.equal(after[0].finishReason,'restarted');assert.deepEqual(after[0].answers,before.attempts[0].answers);assert.deepEqual(after[0].scores,before.attempts[0].scores);assert.deepEqual(after[0].marked,before.attempts[0].marked);
 assert.deepEqual(after[1],before.attempts[1]);assert.deepEqual(after[2],before.attempts[2]);assert.equal(after[3].extraMinutes,30);assert.equal(after[3].currentIndex,0);assert.deepEqual(after[3].answers,{});assert.equal(after[3].deadlineAt-after[3].startedAt,210*60000);
 await page.evaluate(()=>location.hash='dashboard');await page.locator('[data-exam-action="reset-exams"]').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,'dashboard-reset-desktop.png')});
 const reset=async accept=>{
  const waiting=page.waitForEvent('dialog'),click=page.locator('[data-exam-action="reset-exams"]').click(),dialog=await waiting;
  assert.match(dialog.message(),/lopende en voltooide/);assert.match(dialog.message(),/MC-oefenvoortgang blijft behouden/);
  if(accept)await dialog.accept();else await dialog.dismiss();await click;
 };
 await reset(false);assert.deepEqual(await page.evaluate(()=>CafaExams.getAttempts()),after);
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>CafaTheme.setMode('dark'));
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.locator('[data-exam-action="reset-exams"]').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,'dashboard-reset-mobile.png')});
 await reset(true);assert.deepEqual(await page.evaluate(()=>CafaExams.getAttempts()),[]);assert.deepEqual(await page.evaluate(()=>CafaPractice.getAnswer('kap',1)),mcBeforeReset);
 assert.equal(await page.locator('[data-exam-action="reset-exams"]').isDisabled(),true);assert.equal(await page.locator('[data-exam-action="restart"]').count(),0);
 await page.reload();await page.waitForFunction(()=>window.CafaExams&&window.CafaFeedback);assert.deepEqual(await page.evaluate(()=>CafaExams.getAttempts()),[]);assert.deepEqual(await page.evaluate(()=>CafaPractice.getAnswer('kap',1)),mcBeforeReset);
 assert.equal(await page.locator('[data-exam-action="reset-exams"]').isDisabled(),true);assert.deepEqual(errors,[]);
 console.log('Live-interfacecontrole geslaagd: eerst intro, opnieuw +30 minuten kiezen, behoud van vorige/andere pogingen, reset annuleren/bevestigen, mobiel, herladen en MC-voortgang behouden.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
