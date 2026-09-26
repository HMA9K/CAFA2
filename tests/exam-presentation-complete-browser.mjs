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
const base=process.env.CAFA_LIVE_URL||'http://127.0.0.1:'+server.address().port,out=path.join(root,'docs/mc-audit/qa-complete-presentation');fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.CAFA_CHROMIUM_PATH?{executablePath:process.env.CAFA_CHROMIUM_PATH}:{})});
try{
 const page=await browser.newPage({viewport:{width:1680,height:1186}}),errors=[];page.on('pageerror',e=>errors.push(String(e)));page.setDefaultTimeout(30000);
 await page.goto(base+'/index.html#oefenen');await page.waitForFunction(()=>window.CafaFeedback&&window.CafaPracticeCase&&window.CafaExams);
 if(!process.env.CAFA_EXAM_ONLY){
 const practice=async(key)=>{
  const uid=await page.evaluate(key=>{const q=Object.values(CAFA2_DATA.modules).flatMap(m=>m.questions).find(q=>q.sourceKey===key);return q.code+'-'+q.id;},key);
  await page.evaluate(uid=>location.hash=uid,uid);await page.locator('.question:target .practice-case-layout').waitFor();
  const q=page.locator('.question:target');assert.equal(await q.locator('.practice-introduction').count(),0);
  assert.equal(await q.locator('.question-nav').getByText('Introductie',{exact:true}).count(),0);return {q,uid};
 };
 let {q,uid}=await practice('cafa2-20250924/vraag-30');
 assert.equal(await q.locator('.task table').count(),0,'Er staat geen tweede lege voorraadmatrix in de vraag');
 assert.equal(await q.locator('.mc-area .option .stock-display-matrix').count(),4);
 let display=q.locator('.mc-area .option .stock-display-matrix').first();
 assert.deepEqual(await display.locator('tbody tr').first().locator('td').allTextContents(),['31-12-2023','240.000','80.000','','','80.000']);
 assert.ok(await display.locator('td').first().evaluate(e=>parseFloat(getComputedStyle(e).paddingRight)>=5));
 assert.ok(await display.locator('td').first().evaluate(e=>getComputedStyle(e).borderRightStyle==='solid'));
 assert.ok(await display.evaluate(e=>e.clientWidth<=e.closest('.qbody').clientWidth),'Alle kolommen passen bij de standaard paneelbreedte');
 await page.screenshot({path:path.join(out,'stock-options-desktop.png')});
 await q.locator('label[for="own-'+uid+'"]').click();await q.locator('[data-stock-cell="r1-c1"]').fill('240.000');
 await page.reload();await page.waitForFunction(()=>window.CafaFeedback);q=page.locator('.question:target');assert.equal(await q.locator('[data-stock-cell="r1-c1"]').inputValue(),'240.000');
 await page.screenshot({path:path.join(out,'stock-input-desktop.png')});
 ({q}=await practice('cafa2-20250924/vraag-31'));
 assert.ok(await q.locator('.mc-area table td').first().evaluate(e=>getComputedStyle(e).borderRightStyle==='solid'));
 await page.screenshot({path:path.join(out,'journal-options-desktop.png')});
 ({q}=await practice('cafa2-20221006/vraag-6'));assert.equal(await q.locator('.exam-source-case pre').count(),0);assert.ok(await q.locator('.exam-source-case li').count()>5);
 await q.locator('.exam-case-panel').evaluate(e=>{e.scrollTop=450;});await page.screenshot({path:path.join(out,'rast-case-desktop.png')});
 ({q}=await practice('cafa2-20231009/vraag-24'));assert.equal(await q.locator('.exam-source-case pre').count(),0);assert.ok(await q.locator('.exam-source-case table').count()>=6);
 await page.screenshot({path:path.join(out,'neige-case-desktop.png')});
 }
 await page.evaluate(()=>location.hash='welkom/cafa2-20250924');await page.locator('[data-exam-untimed]').check();await page.locator('[data-exam-action="start"]').click();await page.locator('#exam-case-panel').waitFor();
 await page.locator('[data-exam-action="check"]').click();const model=page.locator('#cafa-exam-feedback .exam-source-solution');await model.waitFor();
 assert.equal(await model.locator('.exam-purchase-calculation').count(),1);
 assert.equal(await model.locator('td.exam-source-points').filter({hasText:/\(/}).count(),8);
 for(const mark of await model.locator('.exam-source-points').all())assert.equal(await mark.evaluate(e=>getComputedStyle(e).color),'rgb(238, 0, 0)');
 assert.equal(await model.locator('td').first().evaluate(e=>getComputedStyle(e).borderRightStyle),'none');
 assert.ok((await model.textContent()).includes('€ 871.000'));assert.ok((await model.textContent()).includes('(5 punten)'));
 await model.scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,'olbia-answer-model-desktop.png')});
 const pos=await page.evaluate(()=>CafaExams.getPosition());await page.evaluate(pos=>CafaExams.restorePosition(pos.attempt,30),pos);await page.locator('[data-exam-action="check"]').click();
 assert.equal(await model.locator('table').count(),2);assert.equal(await model.locator('thead.exam-accessible-head').count(),0,'Debet en credit blijven zichtbare journaalpostkolommen');
 assert.ok((await model.locator('thead').first().textContent()).includes('Debet (€)'));assert.equal(await model.locator('td.exam-source-points').first().evaluate(e=>getComputedStyle(e).color),'rgb(238, 0, 0)');await model.scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,'exam-journal-model-desktop.png')});
 await page.evaluate(pos=>CafaExams.restorePosition(pos.attempt,14),pos);
 let matrix=page.locator('[data-exam-answer] .stock-matrix');await matrix.waitFor();
 assert.equal(await page.locator('#exam-app .stock-matrix').count(),1,'Alleen de invulmatrix blijft zichtbaar');
 assert.equal(await matrix.locator('thead th').count(),6);assert.ok(await matrix.evaluate(e=>e.clientWidth<=e.parentElement.clientWidth));
 assert.ok(await matrix.evaluate(e=>e.getBoundingClientRect().height<280),'De complete invulmatrix is compact');
 await matrix.locator('[data-stock-cell="r1-c1"]').fill('200.000');await matrix.locator('[data-stock-cell="r1-c2"]').fill('20.000');
 await page.screenshot({path:path.join(out,'exam-stock-desktop.png')});
 const dashboard=page.locator('.question-return-links a').last();await page.waitForFunction(()=>document.querySelector('.question-return-links a:last-child')?.textContent==='Dashboard');assert.ok((await dashboard.getAttribute('href')).endsWith('/index.html#dashboard'));
 await dashboard.click();await page.waitForURL('**#dashboard');assert.ok(await page.evaluate(pos=>CafaExams.getAttempts().some(a=>a.id===pos.attempt&&a.answers['vraag-15'].stockCells['r1-c2']==='20.000'),pos));
 await page.evaluate(pos=>location.hash='tentamen/'+pos.attempt,pos);await matrix.waitFor();assert.equal(await matrix.locator('[data-stock-cell="r1-c2"]').inputValue(),'20.000');
 await page.setViewportSize({width:1366,height:900});await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));assert.ok(await matrix.evaluate(e=>e.clientWidth<=e.parentElement.clientWidth));await page.screenshot({path:path.join(out,'exam-stock-laptop.png')});
 const dimensions=await matrix.evaluate(e=>({matrix:e.getBoundingClientRect().toJSON(),body:e.closest('.exam-question-body').getBoundingClientRect().toJSON(),scrollTop:e.closest('.exam-question-body').scrollTop,label:getComputedStyle(e.closest('.exam-question-body').querySelector('.exam-answer-label')).margin,question:getComputedStyle(e.closest('.exam-question-body').querySelector('.exam-source-question')).padding}));
 assert.ok(dimensions.matrix.bottom<=dimensions.body.bottom,'De complete tabel past ook verticaal op een laptop: '+JSON.stringify(dimensions));
 assert.ok(await matrix.evaluate(e=>{const a=document.querySelector('.study-assistant-launch').getBoundingClientRect(),b=e.getBoundingClientRect();return a.bottom<=b.top||a.top>=b.bottom||a.right<=b.left||a.left>=b.right;}),'De vraagknop bedekt geen voorraadcellen');
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>CafaTheme.setMode('dark'));
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await matrix.locator('[data-stock-cell="r1-c5"]').scrollIntoViewIfNeeded();await matrix.locator('[data-stock-cell="r1-c5"]').fill('16.000');await page.screenshot({path:path.join(out,'exam-stock-mobile-dark.png'),fullPage:true});
 await page.setViewportSize({width:1680,height:1186});await page.evaluate(pos=>CafaExams.restorePosition(pos.attempt,0),pos);await page.locator('[data-exam-action="check"]').click();
 assert.equal(await model.locator('.exam-source-points').first().evaluate(e=>getComputedStyle(e).color),'rgb(236, 141, 141)');await model.scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,'olbia-answer-model-dark.png')});
 assert.equal(errors.length,0,errors.join('\n'));console.log('Presentatiecontrole geslaagd: voorraad- en journaalopties, herladen van invulcellen, Rast/Neige-casus, officieel Olbia-model met rode punten, één compacte tentamenmatrix, Dashboard, laptop en mobiel/donker.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
