const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.EDITOR_URL||'http://127.0.0.1:8870/cafa2/';
const sra=process.env.COURSE==='sra';
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}});page.setDefaultTimeout(45000);
  await page.route('**/*',r=>r.request().url().startsWith(base)?r.continue():r.abort());
  await page.goto(base+'index.html#'+(sra?'tentamen':'dashboard'),{waitUntil:'domcontentloaded'});console.log('dashboard');
  await page.waitForFunction(()=>window.CafaExams||window.SRACirrus);
  await page.evaluate(sra=>{
   const app=sra?SRACirrus:CafaExams,exam=(sra?SRA_CIRRUS_EXAMS:CAFA2_EXAMS).find(e=>e.id===(sra?'20241028':'cafa2-20240422'));
   const a=CafaExamEngine.createAttempt(exam,{id:'qa-editor-columns',untimed:true});a.currentIndex=sra?0:2;
   const value=JSON.stringify({version:1,attempts:[a]});localStorage.setItem(app.storageKey,value);dispatchEvent(new StorageEvent('storage',{key:app.storageKey,newValue:value}));location.hash=(sra?'toets/':'tentamen/')+a.id;
  },sra);
  await page.waitForFunction(()=>window.tinymce?.activeEditor?.initialized && tinymce.activeEditor.getBody()?.isContentEditable);
  const editor=page.frameLocator('#exam-app .tox-edit-area iframe').locator('body');
  await page.evaluate(()=>{const e=tinymce.activeEditor;e.setContent('<table style="width:620px"><tbody><tr><td>Omschrijving</td><td>Bedrag</td></tr><tr><td>Voorraad</td><td>456</td></tr></tbody></table>');e.dispatch('change');});
  const table=editor.locator('table');await table.locator('td').first().click();
  await page.evaluate(()=>tinymce.activeEditor.execCommand('mceTableInsertColAfter'));
  assert.equal(await table.locator('tr').first().locator('td').count(),3);
  assert.ok((await editor.innerText()).includes('456'));
  assert.equal(await page.locator('[data-exam-action="submit"]').evaluate(e=>e===e.parentElement.lastElementChild),true);
  await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.tinymce?.activeEditor?.initialized && tinymce.activeEditor.getBody()?.isContentEditable);
  assert.equal(await table.locator('tr').first().locator('td').count(),3);
  await table.locator('tr').first().locator('td').nth(1).click();await page.evaluate(()=>tinymce.activeEditor.execCommand('mceTableDeleteCol'));
  assert.equal(await table.locator('tr').first().locator('td').count(),2);assert.ok((await editor.innerText()).includes('456'));
  if(!sra){
   await page.locator('.exam-footer .actions [data-original-pdf]').first().waitFor();
   assert.deepEqual(await page.locator('.exam-footer .actions').evaluate(e=>[...e.children].map(c=>c.textContent.trim())),['‹ Vorige','Volgende ›','Tentamen PDF downloadenUitwerking PDF']);
   const hash=await page.evaluate(()=>location.hash);
   await page.getByRole('link',{name:'Uitleg bij deze vraag in de samenvatting'}).click();
   const back=page.locator('[data-study-origin]');await back.waitFor();assert.ok(await back.isVisible());
   await page.setViewportSize({width:390,height:850});assert.ok(await back.isVisible());assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   await back.click();await page.waitForURL('**'+hash);await page.waitForFunction(()=>window.tinymce?.activeEditor?.initialized && tinymce.activeEditor.getBody()?.isContentEditable);assert.ok((await editor.innerText()).includes('456'));
  }
  console.log('OK: visible columns immediately after resize/add, deletion, saved answer, larger icons, footer order and explanation return ('+(sra?'SRA':'CAFA2')+').');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
