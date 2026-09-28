const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.PDF_URL||'http://127.0.0.1:8870/cafa2/';
(async()=>{
 const {originalPdfs}=await import('../data/exam-original-pdfs.mjs');
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
 try{
  for(const width of [1440,390]){
   const page=await browser.newPage({viewport:{width,height:900}}),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.addInitScript(()=>sessionStorage.setItem('cafa2-assistant-launch-hidden','true'));
   await page.route('**/*',r=>r.request().url().startsWith(base)?r.continue():r.abort());
   await page.goto(base+'index.html#dashboard',{waitUntil:'commit'});
   await page.waitForFunction(()=>window.CafaExams&&document.querySelector('[data-pdf-download]'));
   const id='cafa2-20240422',source=originalPdfs[id];
   async function download(link,kind){
    const hash=await page.evaluate(()=>location.hash),saved=await page.evaluate(()=>localStorage.getItem(CafaExams.storageKey));
    const [file]=await Promise.all([page.waitForEvent('download'),link.click()]);
    assert.equal(await file.failure(),null);
    assert.equal(file.suggestedFilename(),'CAFA2-'+source.date+'-'+(kind==='questions'?'tentamen':'uitwerking')+'.pdf');
    const data=fs.readFileSync(await file.path());assert.equal(data.subarray(0,5).toString(),'%PDF-');
    assert.equal(crypto.createHash('sha256').update(data).digest('hex'),source[kind].sha256);
    assert.equal(await page.evaluate(()=>location.hash),hash);
    assert.equal(await page.evaluate(()=>localStorage.getItem(CafaExams.storageKey)),saved);
    assert.equal(await page.locator('.original-pdf-viewer iframe').count(),0);
    assert.equal(await page.locator('.original-pdf-dashboard-layout,.original-pdf-left').count(),0);
   }
   assert.equal(await page.locator('[data-pdf-download]').count(),22);
   for(const kind of ['questions','solutions'])await download(page.locator('[data-pdf-download="'+kind+'"][data-pdf-exam="'+id+'"]'),kind);
   for(const [examId,record] of Object.entries(originalPdfs)){
    await page.evaluate(id=>location.hash='welkom/'+id,examId);
    const link=page.locator('.exam-paper [data-pdf-download="questions"]');await link.waitFor();
    assert.equal(await link.innerText(),'Tentamen PDF downloaden');assert.equal(await link.getAttribute('href'),record.questions.url);
    assert.equal(await page.locator('.exam-paper [data-original-pdf="solutions"]').count(),1);
    assert.equal(await page.locator('[data-original-pdf="questions"]').count(),0);
   }
   await page.evaluate(id=>location.hash='welkom/'+id,id);await page.locator('.exam-paper [data-pdf-exam="'+id+'"]').first().waitFor();
   await download(page.locator('.exam-paper [data-pdf-download="questions"]'),'questions');
   await page.evaluate(id=>{
    const exam=CAFA2_EXAMS.find(e=>e.id===id),a=CafaExamEngine.createAttempt(exam,{id:'qa-download',untimed:true});
    const value=JSON.stringify({version:1,attempts:[a]});localStorage.setItem(CafaExams.storageKey,value);
    dispatchEvent(new StorageEvent('storage',{key:CafaExams.storageKey,newValue:value}));location.hash='tentamen/'+a.id;
   },id);
   const answer=page.locator('#exam-app [data-exam-answer]');
   await answer.frameLocator('.tox-edit-area iframe').locator('body[contenteditable="true"]').waitFor();
   await answer.frameLocator('.tox-edit-area iframe').locator('body').fill('Berekening blijft bewaard.');
   await page.waitForFunction(()=>CafaExams.getAttempts()[0].answers['vraag-1']?.html?.includes('Berekening blijft bewaard.'));
   const caseContent=await page.locator('#exam-case-panel').innerHTML();
   const saved=await page.evaluate(()=>localStorage.getItem(CafaExams.storageKey));let unexpectedDownloads=0;
   page.on('download',()=>unexpectedDownloads++);
   const readerButton=page.locator('.exam-footer [data-original-pdf="questions"]');
   assert.equal(await readerButton.innerText(),'Tentamen PDF');await readerButton.click();
   const reader=page.locator('.original-pdf-left-viewer:visible iframe');await reader.waitFor();
   assert.ok(decodeURIComponent(await reader.getAttribute('src')).includes(source.questions.url));
   assert.equal(await page.locator('.exam-footer [data-pdf-download="questions"]').count(),0);
   assert.equal(await page.evaluate(()=>localStorage.getItem(CafaExams.storageKey)),saved);
   await page.locator('.original-pdf-left-viewer [data-pdf-close="questions"]').click();
   assert.equal(await page.locator('#exam-case-panel').innerHTML(),caseContent);
   assert.equal(await answer.frameLocator('iframe').locator('body').innerText(),'Berekening blijft bewaard.');
   const uid=await page.evaluate(id=>{for(const [code,bank] of Object.entries(CAFA2_DATA.modules)){const i=bank.questions.findIndex(q=>q.examId===id);if(i>=0)return code+'-'+(i+1);}},id);
   assert.ok(uid);await page.evaluate(uid=>location.hash=uid,uid);
   await page.locator('#'+uid+' [data-original-pdf="questions"]').click();await reader.waitFor();
   assert.ok(decodeURIComponent(await reader.getAttribute('src')).includes(source.questions.url));
   assert.equal(unexpectedDownloads,0,'De tentamen- en oefenknoppen openen de reader, zonder download');
   assert.equal(await page.locator('#'+uid+' [data-original-pdf="solutions"]').count(),1);
   assert.deepEqual(errors,[]);await page.close();
   console.log(width+': dashboard and introduction downloads; exam and practice PDF readers; sources and answers preserved.');
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
