import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {root,loadSources} from '../scripts/exam-practice-source.mjs';
const {chromium}=createRequire(import.meta.url)(process.env.CAFA_PLAYWRIGHT_PATH||'playwright');
const {exams,banks}=loadSources();
const models=exams.flatMap(e=>e.questions.map(q=>({key:e.id+'/'+q.id,exam:e,html:q.solutionHtml,plain:q.solution})));
for(const bank of Object.values(banks))for(const q of bank.questions)if(q.solutionHtml)models.push({key:q.key||q.id,exam:{id:q.sourceExamId||'practice'},html:q.solutionHtml});
const oldRenderer=execFileSync('git',['show','HEAD:js/exam-document.js'],{encoding:'utf8'});
const server=http.createServer((req,res)=>{
 const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
 res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'application/javascript','.mjs':'application/javascript','.css':'text/css'})[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base=process.env.CAFA_LIVE_URL||'http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,...(process.env.CAFA_CHROMIUM_PATH?{executablePath:process.env.CAFA_CHROMIUM_PATH}:{})});
try{
 const page=await browser.newPage({viewport:{width:1366,height:1000}}),errors=[];
 page.on('pageerror',e=>errors.push(String(e)));
 await page.setContent('<!doctype html><html lang="nl"><head><base href="'+base+'/"><meta name="viewport" content="width=device-width,initial-scale=1">'+['app','exams','exam-document','journal-display','study-dark'].map(s=>'<link rel="stylesheet" href="css/'+s+'.css">').join('')+'</head><body></body></html>');
 for(const file of ['js/answer-editor.js','js/journal-table.js','js/exam-document.js','data/exam-source-format.js'])await page.addScriptTag({url:base+'/'+file});
 await page.waitForFunction(()=>window.CafaExamDocument&&window.CafaJournalTable);
 const audit=()=>page.evaluate(({models,exams,oldRenderer})=>{
  window.CAFA2_EXAMS=exams;
  const current=window.CafaExamDocument;
  (0,eval)(oldRenderer);const previous=window.CafaExamDocument;window.CafaExamDocument=current;
  const host=document.createElement('div');host.style.cssText='width:960px;max-width:calc(100vw - 40px);margin:20px;';document.body.replaceChildren(host);
  let tables=0,currency=0;const changed=[],overflow=[],missing=[],pageOverflow=[],borderless=[];
  for(const model of models){
   const before=document.createElement('div');before.innerHTML=previous.render(model.exam,'solution',model.html,model.plain);
   host.innerHTML=current.render(model.exam,'solution',model.html,model.plain);
   const tableText=box=>Array.from(box.querySelectorAll('table'),t=>t.textContent);
   if(JSON.stringify(tableText(before))!==JSON.stringify(tableText(host)))changed.push(model.key);
   for(const t of host.querySelectorAll('table')){
    tables++;if(t.matches('.journal-display-with-currency'))currency++;
    if(!t.parentElement.matches('.exam-model-table-scroll,.journal-display-scroll'))missing.push(model.key);
    for(const cell of t.querySelectorAll('th,td'))if(cell.scrollWidth>cell.clientWidth+2)overflow.push({key:model.key,text:cell.textContent,width:cell.clientWidth,content:cell.scrollWidth});
    if(Array.from(t.querySelectorAll('td,th')).some(c=>parseFloat(getComputedStyle(c).borderLeftWidth)<1))borderless.push(model.key);
   }
   if(document.documentElement.scrollWidth>innerWidth+1)pageOverflow.push(model.key);
  }
  return {models:models.length,tables,currency,changed,overflow,missing,pageOverflow,borderless};
 },{models,exams,oldRenderer});
 const result=await audit();
 assert.deepEqual(result.changed,[],'Alle tabelteksten en bedragen blijven gelijk aan de bestaande weergave');
 assert.deepEqual(result.missing,[],'Alle modeltabellen hebben een eigen schuifgebied');
 assert.deepEqual(result.overflow,[],'Geen tabelcel heeft overlappende of afgeknipte inhoud');
 assert.deepEqual(result.pageOverflow,[],'Geen model veroorzaakt horizontale pagina-overloop');
 assert.deepEqual(result.borderless,[],'Alle modeltabellen hebben zichtbare celranden');
 assert.ok(result.currency>=3,'USD/koers-journaalposten gebruiken de gedeelde kolommen');
 const exam=exams.find(e=>e.id==='cafa2-20240422'),q=exam.questions.find(q=>q.id==='vraag-12');
 const show=()=>page.evaluate(({exam,q})=>{document.body.innerHTML='<main style="padding:20px;max-width:960px;margin:auto"><h2>Antwoordmodel</h2>'+CafaExamDocument.render(exam,'solution',q.solutionHtml)+'</main>';},{exam,q});
 await show();
 const positions=await page.locator('.journal-display-with-currency').evaluateAll(ts=>ts.map(t=>Array.from(t.tHead.rows[0].cells,c=>Math.round(c.getBoundingClientRect().x))));
 assert.equal(positions.length,3);assert.deepEqual(positions[0],positions[1]);assert.deepEqual(positions[1],positions[2]);
 const out=path.join(root,'docs/mc-audit/qa-answer-models');fs.mkdirSync(out,{recursive:true});
 await page.screenshot({path:path.join(out,'reiter-desktop.png'),fullPage:true});
 for(const theme of ['light','dark']){
  await page.setViewportSize({width:390,height:844});
  await page.evaluate(theme=>document.documentElement.dataset.studyTheme=theme,theme);
  const mobile=await audit();
  assert.deepEqual(mobile.overflow,[],'Alle modelcellen passen op mobiel in '+theme);
  assert.deepEqual(mobile.pageOverflow,[],'Alle modellen blijven binnen de mobiele pagina in '+theme);
  assert.deepEqual(mobile.changed,[],'Alle modelteksten blijven behouden op mobiel');
  assert.deepEqual(mobile.borderless,[],'Tabelranden blijven zichtbaar in '+theme);
  await show();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Geen horizontale pagina-overloop');
  for(const wrap of await page.locator('.exam-model-table-scroll').all()){
   await wrap.evaluate(e=>e.scrollLeft=e.scrollWidth);
   assert.ok(await wrap.evaluate(e=>e.querySelector('tr:last-child td:last-child').getBoundingClientRect().right<=e.getBoundingClientRect().right+2),'Credit en normering zijn bereikbaar');
  }
  await page.screenshot({path:path.join(out,'reiter-mobile-'+theme+'.png'),fullPage:true});
 }
 const app=await browser.newPage({viewport:{width:1366,height:1000}});
 app.on('pageerror',e=>errors.push(String(e)));
 await app.goto(base+'/index.html#welkom/cafa2-20240422');
 await app.locator('[data-exam-untimed]').check();
 await app.locator('[data-exam-action="start"]').click();
 await app.locator('#exam-case-panel').waitFor();
 const position=await app.evaluate(()=>CafaExams.getPosition());
 await app.evaluate(p=>CafaExams.restorePosition(p.attempt,11),position);
 await app.locator('[data-exam-action="check"]').click();
 const model=app.locator('#cafa-exam-feedback .exam-source-solution');await model.waitFor();
 assert.equal(await model.locator('table').count(),4);
 assert.equal(await model.locator('.journal-display-with-currency').count(),3);
 assert.equal(await model.locator('thead.exam-accessible-head').count(),0);
 await model.scrollIntoViewIfNeeded();await app.screenshot({path:path.join(out,'reiter-in-app.png'),fullPage:true});
 await app.setViewportSize({width:390,height:844});
 await app.evaluate(()=>CafaTheme.setMode('dark'));
 assert.ok(await app.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 for(const wrap of await model.locator('.exam-model-table-scroll').all()){
  await wrap.evaluate(e=>e.scrollLeft=e.scrollWidth);
  assert.ok(await wrap.evaluate(e=>e.querySelector('tr:last-child td:last-child').getBoundingClientRect().right<=e.getBoundingClientRect().right+2));
 }
 assert.deepEqual(errors,[]);console.log(JSON.stringify(result));
}finally{await browser.close();await new Promise(r=>server.close(r));}
