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
const out=path.join(root,'docs/mc-audit/qa-journal-columns');fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.CAFA_CHROMIUM_PATH?{executablePath:process.env.CAFA_CHROMIUM_PATH}:{})});
try{
 const page=await browser.newPage({viewport:{width:1672,height:1148}}),errors=[];page.on('pageerror',e=>errors.push(String(e)));page.setDefaultTimeout(60000);
 await page.goto(base+'/index.html#oefenen');await page.waitForFunction(()=>window.CafaFeedback&&window.CafaPracticeCase&&window.CafaJournalTable?.enhance);
 const corpus=await page.evaluate(()=>{
  let tables=0,models=0;const changed=[],missed=[];
  const check=(html,key)=>{
   const box=document.createElement('div');box.innerHTML=html;
   const before=Array.from(box.querySelectorAll('table'),t=>Array.from(t.rows,r=>Array.from(r.cells,c=>c.textContent)));
   CafaJournalTable.enhance(box);CafaJournalTable.enhance(box);
   const after=Array.from(box.querySelectorAll('table'),t=>Array.from(t.rows,r=>Array.from(r.cells,c=>c.textContent)));
   if(JSON.stringify(before)!==JSON.stringify(after))changed.push(key);
   box.querySelectorAll('table').forEach(t=>{
    const h=t.tHead?.rows[0];if(!h)return;
    if(/^Debet/.test(h.cells[1]?.textContent)&&/^Credit/.test(h.cells[2]?.textContent)&&!t.matches('.journal-display-table'))missed.push(key);
    if(t.matches('.journal-display-table')){tables++;if(t.querySelectorAll(':scope > colgroup').length!==1)changed.push(key+' colgroup');}
   });
  };
  Object.values(CAFA2_DATA.modules).flatMap(m=>m.questions).forEach(q=>{check(q.solutionHtml||'',q.key||q.title);(q.options||[]).forEach((o,i)=>check(typeof o==='string'?o:o.html||'',(q.key||q.title)+' option '+i));});
  CAFA2_EXAMS.forEach(e=>e.questions.forEach(q=>{check(q.solutionHtml||'',e.id+'/'+q.id);models++;}));
  return {tables,models,changed,missed};
 });
 assert.deepEqual(corpus.changed,[],'De tabelinhoud en bedragen blijven intact; dubbele toepassing voegt niets toe');
 assert.deepEqual(corpus.missed,[],'Alle debet/credit-modellen met semantische koppen krijgen de gedeelde opmaak');assert.ok(corpus.tables>100);
 const practice=async(key)=>{
  const uid=await page.evaluate(key=>{const q=Object.values(CAFA2_DATA.modules).flatMap(m=>m.questions).find(q=>q.key===key);return q.code+'-'+q.id;},key);
  await page.evaluate(uid=>location.hash=uid,uid);await page.locator('.question:target .practice-case-layout').waitFor();return {q:page.locator('.question:target'),uid};
 };
 const aligned=async(locator)=>{
  const positions=await locator.evaluateAll(tables=>tables.map(t=>Array.from(t.tHead.rows[0].cells,c=>({x:c.getBoundingClientRect().x,width:c.getBoundingClientRect().width,align:getComputedStyle(c).textAlign}))));
  assert.ok(positions.length>1);for(const row of positions)for(let c=0;c<3;c++){
   assert.ok(Math.abs(row[c].x-positions[0][c].x)<1,'De kolommen staan boven elkaar: '+JSON.stringify(positions));
   assert.ok(Math.abs(row[c].width-positions[0][c].width)<1);if(c)assert.equal(row[c].align,'right');
  }
 };
 let {q,uid}=await practice('cafa2-20230411/vraag-7#b');
 const journal=()=>q.locator('.mc-area .option table.journal-display-table');
 assert.equal(await journal().count(),8);await aligned(journal());
 assert.ok(await journal().first().evaluate(t=>t.scrollWidth<=t.clientWidth+1));
 const aid=page.locator('.study-assistant-launch');assert.ok(await aid.evaluate(e=>e.getBoundingClientRect().bottom<document.querySelector('.question:target .mc-area table').getBoundingClientRect().top),'Vraagknop staat boven de tabellen');
 await q.locator('.qbody').evaluate(e=>{e.scrollTop=460;});await page.screenshot({path:path.join(out,'rapallo-desktop.png')});
 await q.locator('.exam-case-resizer').focus();await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowRight');await aligned(journal());await page.screenshot({path:path.join(out,'rapallo-narrow-pane.png')});
 await page.locator('[data-font="1"]').click();await page.locator('[data-font="1"]').click();await aligned(journal());await page.screenshot({path:path.join(out,'rapallo-enlarged.png')});await page.locator('[data-font="0"]').click();
 await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 const scroll=q.locator('.mc-area .journal-display-scroll').first();await scroll.scrollIntoViewIfNeeded();await scroll.evaluate(e=>{e.scrollLeft=e.scrollWidth;});
 assert.ok(await scroll.evaluate(e=>e.scrollLeft>0&&e.querySelector('th:nth-child(3)').getBoundingClientRect().right<=e.getBoundingClientRect().right+1),'Credit is bereikbaar op mobiel');await page.screenshot({path:path.join(out,'rapallo-mobile-credit.png')});
 await page.evaluate(()=>CafaTheme.setMode('dark'));await page.screenshot({path:path.join(out,'rapallo-mobile-dark.png')});
 await page.setViewportSize({width:1672,height:1148});await page.evaluate(()=>CafaTheme.setMode('light'));
 await q.locator('label[for="own-'+uid+'"]').click();await q.locator('[data-journal-row="0"][data-journal-col="0"]').fill('Bank');await q.locator('[data-journal-row="0"][data-journal-col="1"]').fill('220.000');
 await page.reload();await page.waitForFunction(()=>window.CafaFeedback);q=page.locator('.question:target');assert.equal(await q.locator('[data-journal-row="0"][data-journal-col="1"]').inputValue(),'220.000');
 ({q}=await practice('cafa2-20250924/vraag-31'));assert.equal(await journal().count(),8);await aligned(journal());
 await page.evaluate(()=>location.hash='welkom/cafa2-20250924');await page.locator('[data-exam-untimed]').check();await page.locator('[data-exam-action="start"]').click();await page.locator('#exam-case-panel').waitFor();
 const pos=await page.evaluate(()=>CafaExams.getPosition());await page.evaluate(pos=>CafaExams.restorePosition(pos.attempt,30),pos);await page.locator('[data-exam-action="check"]').click();
 const model=page.locator('#cafa-exam-feedback .exam-source-solution');await model.waitFor();assert.equal(await model.locator('.journal-display-with-points').count(),2);await aligned(model.locator('table.journal-display-table'));
 assert.equal(await model.locator('thead.exam-accessible-head').count(),0);assert.equal(await model.locator('.exam-source-points').first().evaluate(e=>getComputedStyle(e).color),'rgb(238, 0, 0)');
 await model.scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,'journal-model-desktop.png')});
 // An ordinary two-sided balance must retain its four different columns.
 assert.equal(await page.locator('#exam-case-panel table.journal-display-table').count(),0);
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>CafaTheme.setMode('dark'));const modelScroll=model.locator('.journal-display-scroll').first();await modelScroll.scrollIntoViewIfNeeded();await modelScroll.evaluate(e=>{e.scrollLeft=e.scrollWidth;});
 assert.ok(await modelScroll.evaluate(e=>e.querySelector('th:last-child').getBoundingClientRect().right<=e.getBoundingClientRect().right+1));assert.equal(await model.locator('.exam-source-points').first().evaluate(e=>getComputedStyle(e).color),'rgb(236, 141, 141)');await page.screenshot({path:path.join(out,'journal-model-mobile-dark.png')});
 assert.deepEqual(errors,[]);console.log(JSON.stringify({result:'Journaalkolommen uitgelijnd in Rapallo en SchierGlas; behouden invoer, rode punten, desktop, versmalde casus, mobiel en donker',corpus}));
}finally{await browser.close();await new Promise(r=>server.close(r));}
