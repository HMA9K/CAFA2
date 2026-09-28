const assert=require('node:assert/strict'),fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const {chromium}=require(process.env.CAFA_PLAYWRIGHT_PATH||'playwright');
const root=path.resolve(__dirname,'..'),sra=process.env.COURSE==='sra';
const fixture='<!doctype html><html><head><link rel="stylesheet" href="css/answer-input-tools.css"></head><body><main id="main"><table id="input-grid"><tr><td><input type="text" id="a"></td><td><input type="text" id="b"></td></tr><tr><td><input type="text" id="c"></td><td><input type="text" id="d"></td></tr></table><textarea id="notes"></textarea></main><script src="js/answer-input-tools.js"></script></body></html>';
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');if(url.pathname==='/__input-fixture'){res.setHeader('Content-Type','text/html');res.end(fixture);return;}
 const file=path.resolve(root,'.'+decodeURIComponent(url.pathname));
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
 res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'application/javascript','.mjs':'application/javascript','.css':'text/css','.json':'application/json','.pdf':'application/pdf','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base=process.env.INPUT_LIVE_URL||'http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,executablePath:process.env.CAFA_CHROMIUM_PATH});
 try{
  const page=await browser.newPage({viewport:{width:1800,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(45000);
  // A local fixture isolates native input behavior from scoring and content.
  await page.goto('http://127.0.0.1:'+server.address().port+'/__input-fixture');await page.waitForFunction(()=>StudyAnswerInput);
  const cases={'5000':'5.000','1234567,89':'1.234.567,89','-5000':'-5.000','5000/100 = 50':'5.000/100 = 50','5000-2500':'5.000-2.500','Bedrag 5000.':'Bedrag 5.000.','31-12-2024':'31-12-2024','2024-12-31':'2024-12-31','5000.25':'5000.25','12345%':'12345%','jaar 2024':'jaar 2024','september 2024':'september 2024','Boekaar 2024':'Boekaar 2024','2024':'2024','2.024':'2024','2014':'2.014','2031':'2.031','2015':'2015','2030':'2030','2024,50':'2.024,50','-2024':'-2.024','jaar 2014':'jaar 2.014','H0 β1 = 0':'H0 β1 = 0','5000 + 6000,50':'5.000 + 6.000,50'};
  for(const [value,expected] of Object.entries(cases))assert.equal(await page.evaluate(v=>StudyAnswerInput.formatted(v).value,value),expected,value);
  for(let year=2015;year<=2030;year++){await page.locator('#a').fill(String(year));assert.equal(await page.locator('#a').inputValue(),String(year));}
  await page.locator('#a').fill('20240');await page.locator('#a').press('End');await page.locator('#a').press('Backspace');assert.equal(await page.locator('#a').inputValue(),'2024');assert.equal(await page.locator('#a').evaluate(e=>e.selectionStart),4);
  await page.locator('#notes').pressSequentially('september 2024, Boekaar 2024, 2024-12-31, 5000');assert.equal(await page.locator('#notes').inputValue(),'september 2024, Boekaar 2024, 2024-12-31, 5.000');
  await page.locator('#a').fill('5000');assert.equal(await page.locator('#a').inputValue(),'5.000');
  await page.locator('#a').press('End');await page.locator('#a').press('0');assert.equal(await page.locator('#a').inputValue(),'50.000');
  await page.locator('#a').press('Backspace');assert.equal(await page.locator('#a').inputValue(),'5.000');
  await page.locator('#a').fill('5000.25');assert.equal(await page.locator('#a').inputValue(),'5000.25');await page.locator('#a').fill('5000');await page.locator('#a').press('End');
  await page.locator('#a').press('ArrowRight');assert.equal(await page.evaluate(()=>document.activeElement.id),'b');
  await page.locator('#b').press('ArrowDown');assert.equal(await page.evaluate(()=>document.activeElement.id),'d');
  await page.locator('#d').press('ArrowLeft');assert.equal(await page.evaluate(()=>document.activeElement.id),'c');
  await page.locator('#c').press('ArrowUp');assert.equal(await page.evaluate(()=>document.activeElement.id),'a');
  await page.locator('#a').evaluate(e=>e.setSelectionRange(2,2));await page.locator('#a').press('ArrowRight');assert.equal(await page.evaluate(()=>document.activeElement.id),'a');
  const toggle=page.locator('.answer-thousands-toggle input[data-answer-thousands]').first();await page.locator('[data-answer-thousands-all]').first().uncheck();await toggle.uncheck();await page.locator('#a').fill('5000');assert.equal(await page.locator('#a').inputValue(),'5000');
  await page.locator('#notes').fill('Berekening 7000,25 op 31-12-2024.');assert.equal(await page.locator('#notes').inputValue(),'Berekening 7000,25 op 31-12-2024.');
  await page.reload();await toggle.waitFor();assert.equal(await toggle.isChecked(),false);await toggle.check();
  // A global default applies to future questions; overrides apply to every input in one question.
  const all=page.locator('[data-answer-thousands-all]').first();await all.check();await toggle.uncheck();
  assert.equal(await page.locator('[data-answer-thousands]').nth(1).isChecked(),false);
  await page.goto('http://127.0.0.1:'+server.address().port+'/__input-fixture#q2');await page.reload();await toggle.waitFor();
  assert.equal(await toggle.isChecked(),false,'Global choice survives a different question');
  await all.uncheck();await toggle.check();await page.locator('#notes').fill('7000');assert.equal(await page.locator('#notes').inputValue(),'7.000');
  await page.reload();await toggle.waitFor();assert.equal(await toggle.isChecked(),true);assert.equal(await all.isChecked(),false,'Question override survives reload');
  await page.goto('http://127.0.0.1:'+server.address().port+'/__input-fixture');await toggle.waitFor();assert.equal(await toggle.isChecked(),false,'Question override does not change global default');
  await toggle.check();assert.equal(await all.isChecked(),true);await page.goto('http://127.0.0.1:'+server.address().port+'/__input-fixture#q2');await page.reload();await toggle.waitFor();assert.equal(await all.isChecked(),true,'Apply to all clears question overrides');

  await page.goto(base+'/index.html#'+(sra?'tentamen':'dashboard'));
  await page.waitForFunction(()=>window.StudyAnswerInput&&(window.CafaExams||window.SRACirrus));
  await page.evaluate(sra=>{
   const app=sra?SRACirrus:CafaExams,exam=(sra?SRA_CIRRUS_EXAMS:CAFA2_EXAMS).find(e=>e.id===(sra?'20241028':'cafa2-20240422'));
   const a=CafaExamEngine.createAttempt(exam,{id:'qa-answer-input',untimed:true});a.currentIndex=sra?0:2;
   const value=JSON.stringify({version:1,attempts:[a]});localStorage.setItem(app.storageKey,value);dispatchEvent(new StorageEvent('storage',{key:app.storageKey,newValue:value}));location.hash=(sra?'toets/':'tentamen/')+a.id;
  },sra);
  await page.waitForFunction(()=>window.tinymce?.activeEditor?.initialized);
  const body=page.frameLocator('#exam-app .tox-edit-area iframe').locator('body');await body.fill('5000');assert.equal(await body.innerText(),'5.000');
  await body.fill('');await body.pressSequentially('september 2024 / Boekaar 2024 / 2024-12-31 / 5000');assert.equal(await body.innerText(),'september 2024 / Boekaar 2024 / 2024-12-31 / 5.000');
  await page.waitForFunction(sra=>{const app=sra?SRACirrus:CafaExams;return app.getAttempts().find(a=>a.id==='qa-answer-input').answers[sra?'vraag-1':'vraag-3']?.html?.includes('5.000');},sra);
  const richToggle=page.locator('.cafa-answer-editor + .answer-thousands-toggle input[data-answer-thousands]');await richToggle.uncheck();await body.fill('5000');assert.equal(await body.innerText(),'5000');await richToggle.check();assert.equal(await body.innerText(),'5.000');
  await page.evaluate(()=>{const e=tinymce.activeEditor;e.setContent('<table><tbody><tr><td>alpha</td><td>beta</td></tr><tr><td>gamma</td><td>delta</td></tr></tbody></table>');e.dispatch('change');});
  const caret=async(i,end)=>page.evaluate(({i,end})=>{const e=tinymce.activeEditor,cell=e.getBody().querySelectorAll('td')[i];e.focus();const r=e.getDoc().createRange();r.selectNodeContents(cell);r.collapse(!end);e.selection.setRng(r);},{i,end});
  const currentCell=()=>page.evaluate(()=>{const n=tinymce.activeEditor.selection.getNode();return n.closest('td')?.textContent;});
  await caret(0,true);await body.press('ArrowRight');assert.equal(await currentCell(),'beta');
  await caret(1,false);await body.press('ArrowLeft');assert.equal(await currentCell(),'alpha');
  await caret(0,true);await body.press('ArrowDown');assert.equal(await currentCell(),'gamma');
  await caret(2,false);await body.press('ArrowUp');assert.equal(await currentCell(),'alpha');
  await page.reload();await page.waitForFunction(()=>window.tinymce?.activeEditor?.initialized);assert.ok((await body.innerText()).includes('delta'));
  if(!sra){
   const journalIndex=await page.evaluate(()=>CafaExams.getAttempts().find(a=>a.id==='qa-answer-input').exam.questions.findIndex(q=>CafaJournalTable.supports(q)));
   await page.evaluate(i=>CafaExams.restorePosition('qa-answer-input',i),journalIndex);
   const debit=page.locator('.journal-table input[data-journal-col="1"]').first();await debit.fill('2024');assert.equal(await debit.inputValue(),'2024');await debit.fill('5000');assert.equal(await debit.inputValue(),'5.000');
   await page.locator('.journal-scroll + .answer-thousands-toggle input[data-answer-thousands-all]').uncheck();await page.locator('.journal-scroll + .answer-thousands-toggle input[data-answer-thousands]').uncheck();await debit.fill('7000');assert.equal(await debit.inputValue(),'7000');
   const journal=page.locator('.journal-table');await journal.locator('[data-journal-row="0"][data-journal-col="0"]').fill('Voorraad');await journal.locator('[data-journal-row="1"][data-journal-col="0"]').fill('Kostprijs');
   await debit.focus();await page.locator('.journal-add').click();assert.equal(await journal.locator('[data-journal-row="2"][data-journal-col="0"]').inputValue(),'Kostprijs');assert.equal(await journal.locator('[data-journal-row="1"][data-journal-col="0"]').inputValue(),'');
   await journal.locator('tbody tr').last().scrollIntoViewIfNeeded();await page.waitForTimeout(100);
   const beforeHeight=(await journal.locator('tbody tr').first().boundingBox()).height,grip=page.locator('.input-table-corner-grip').first(),r=await grip.boundingBox();
   await page.mouse.move(r.x+r.width/2,r.y+r.height/2);await page.mouse.down();await page.mouse.move(r.x+r.width/2,r.y+r.height/2-180,{steps:12});await page.mouse.up();
   assert.ok((await journal.locator('tbody tr').first().boundingBox()).height<beforeHeight-10,'Real exam journal becomes compact');
   const compactHeight=await journal.evaluate(t=>t.style.getPropertyValue('--input-table-row-height'));
   if(process.env.TABLE_SCREENSHOT)await page.locator('.journal-scroll').screenshot({path:process.env.TABLE_SCREENSHOT});
   await page.reload();await page.locator('.journal-table.input-table-adjustable').waitFor();
   assert.equal(await journal.locator('[data-journal-row="2"][data-journal-col="0"]').inputValue(),'Kostprijs');assert.equal(await debit.inputValue(),'7000');assert.equal(await journal.evaluate(t=>t.style.getPropertyValue('--input-table-row-height')),compactHeight,'Compact layout and answers survive reload');
   await page.evaluate(()=>CafaExams.restorePosition('qa-answer-input',13));await page.locator('.stock-matrix input').first().waitFor();
   const amount=page.locator('.stock-matrix input[data-stock-cell^="r"]').first();await amount.fill('5000');assert.equal(await amount.inputValue(),'5.000');
   await page.locator('.stock-notes').evaluate(e=>e.open=true);await page.locator('.stock-notes .tox-edit-area iframe').waitFor();
   assert.equal(await page.locator('.exam-question-body .answer-thousands-toggle input[data-answer-thousands]').count(),2);
   const [pdf]=await Promise.all([page.waitForEvent('download'),page.locator('.exam-footer [data-pdf-download="questions"]').click()]);assert.equal(await pdf.failure(),null);
   await page.locator('.exam-footer [data-original-pdf="solutions"]').click();await page.locator('#exam-original-solutions[open]').waitFor();
  }
  for(const size of [10,14,20,24,14]){
   await page.evaluate(size=>StudyScale.set(size,14,10,24),size);await page.waitForTimeout(180);
   const overflow=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,items:Array.from(document.querySelectorAll('body *')).filter(e=>e.getBoundingClientRect().right>innerWidth+3&&!e.closest('.stock-scroll,.exam-model-table-scroll,.cae-content,.tox-tinymce,.original-pdf-viewer iframe')).slice(0,12).map(e=>({tag:e.tagName,cls:e.className,right:e.getBoundingClientRect().right,width:e.getBoundingClientRect().width}))}));
   assert.ok(overflow.scroll<=overflow.width+2,'Geen pagina-overloop bij schaal '+size+' '+JSON.stringify(overflow));
   if(process.env.INPUT_SCREENSHOT&&size===24)await page.screenshot({path:process.env.INPUT_SCREENSHOT});
   if(!sra){
    assert.equal(await page.locator('.original-pdf-left-viewer').count(),0,'Downloaden opent geen extra casuspaneel');
   }
  }
  if(!sra){await page.evaluate(()=>StudyAssistant.resume());await page.locator('#study-assistant[open]').waitFor();await page.evaluate(()=>StudyScale.set(24,14,10,24));await page.waitForTimeout(250);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'Assistent blijft binnen de pagina');}
  await page.setViewportSize({width:390,height:844});await page.evaluate(()=>StudyScale.set(14,14,10,24));await page.waitForTimeout(200);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'Mobiele pagina blijft binnen viewport');
  if(!sra){await page.goto(base+'/index.html#kap-1');await page.waitForFunction(()=>window.CafaJournalTable&&window.CAFA2_DATA);const uid=await page.evaluate(()=>{for(const [code,m] of Object.entries(CAFA2_DATA.modules)){const i=m.questions.findIndex(q=>CafaJournalTable.supports(q));if(i>=0)return code+'-'+(i+1);}});await page.evaluate(uid=>location.hash=uid,uid);const q=page.locator('#'+uid);await q.locator('label[for="own-'+uid+'"]').click();await q.locator('.stock-notes').evaluate(e=>e.open=true);await q.locator('.tox-edit-area iframe').waitFor();await page.waitForTimeout(100);assert.equal(await q.locator('.answer-thousands-toggle').count(),2,'Journaaltabel en toelichting in opgaven '+JSON.stringify(await q.locator('.answer-thousands-toggle').evaluateAll(es=>es.map(e=>({parent:e.parentElement.className,previous:e.previousElementSibling?.outerHTML.slice(0,220)})))));const field=q.locator('.journal-table input[data-journal-col="1"]').first();await field.fill('5000');assert.equal(await field.inputValue(),'5.000');}
  assert.deepEqual(errors,[]);console.log(JSON.stringify({course:sra?'SRA':'CAFA2',formatting:true,toggles:true,nativeArrows:true,editorArrows:true,savedAnswers:true,scale:true}));
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
