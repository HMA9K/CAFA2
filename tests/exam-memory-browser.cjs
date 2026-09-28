const assert=require('node:assert/strict'),fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const {chromium}=require(process.env.CAFA_PLAYWRIGHT_PATH||'playwright');
const root=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{
 const pathname=new URL(req.url,'http://localhost').pathname,file=path.resolve(root,'.'+decodeURIComponent(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
 res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.pdf':'application/pdf','.wasm':'application/wasm'})[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch({headless:true,executablePath:process.env.CAFA_CHROMIUM_PATH});
  const page=await browser.newPage({viewport:{width:1800,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(45000);
  const base='http://127.0.0.1:'+server.address().port;
  await page.addInitScript(()=>{
   localStorage.setItem('skipgc','t');window.qaCalls={};
   const raf=requestAnimationFrame;window.requestAnimationFrame=function(fn){const key=fn.name||'anonymous';qaCalls[key]=(qaCalls[key]||0)+1;return raf.call(window,fn);};
  });
  await page.route('**/*',r=>r.request().url().startsWith(base)?r.continue():r.abort());
  await page.goto(base);await page.waitForFunction(()=>window.CafaExams&&window.CafaFeedback&&window.StudyAssistant);
  await page.waitForTimeout(500);await page.evaluate(()=>qaCalls={});await page.waitForTimeout(1000);
  const home=await page.evaluate(()=>({...qaCalls}));console.log(JSON.stringify({homeIdleFrames:home}));
  await page.evaluate(()=>location.hash='kap-1');await page.locator('#kap-1[data-feedback-bound]').waitFor({state:'visible'});
  await page.waitForTimeout(500);await page.evaluate(()=>qaCalls={});await page.waitForTimeout(1000);
  const practice=await page.evaluate(()=>({...qaCalls}));console.log(JSON.stringify({practiceIdleFrames:practice}));
  await page.evaluate(()=>{
   const ids=['cafa2-20240422','cafa2-20231009','cafa2-20240930'];
   const attempts=ids.map((id,i)=>{const a=CafaExamEngine.createAttempt(CAFA2_EXAMS.find(e=>e.id===id),{id:'qa-memory-'+i,untimed:true});a.currentIndex=i===0?17:0;return a;});
   const value=JSON.stringify({version:1,attempts});localStorage.setItem(CafaExams.storageKey,value);dispatchEvent(new StorageEvent('storage',{key:CafaExams.storageKey,newValue:value}));
  });
  const samples=[];
  for(let i=0;i<3;i++){
   await page.evaluate(i=>location.hash='tentamen/qa-memory-'+i,i);
   await page.locator('.exam-footer [data-original-pdf="questions"]').click();
   await page.locator('.exam-footer [data-original-pdf="solutions"]').click();
   await page.waitForFunction(()=>[...document.querySelectorAll('.original-pdf-viewer:not([inert]) iframe')].every(f=>f.contentWindow.CafaPdfReader?.ready));
   await page.waitForTimeout(400);
   if(i===0){
    assert.equal(await page.evaluate(()=>window.tinymce?.get().length||0),0,'Closed notes do not initialize the rich editor');
    await page.locator('#exam-app .stock-notes > summary').click();
    await page.waitForFunction(()=>window.tinymce?.get().some(e=>e.initialized));
    await page.frameLocator('#exam-app .tox-edit-area iframe').locator('body').fill('Bewaarde toelichting');
    await page.locator('#exam-app .stock-notes > summary').click();
    await page.locator('[data-journal-row="0"][data-journal-col="0"]').fill('Netto omzet');
    await page.locator('[data-journal-row="0"][data-journal-col="1"]').fill('1250000');
    await page.locator('[data-exam-action="next"]').click();await page.locator('[data-exam-action="previous"]').click();
    assert.equal(await page.locator('[data-journal-row="0"][data-journal-col="0"]').inputValue(),'Netto omzet');
    await page.waitForFunction(()=>window.tinymce?.get().some(e=>e.initialized&&e.getContent().includes('Bewaarde toelichting')));
    const frame=page.frameLocator('.original-pdf-left-viewer:not([inert]) iframe');
    await frame.locator('body').evaluate(()=>PDFViewerApplication.page=10);
    const text=frame.locator('.page[data-page-number="10"] .textLayer span[role="presentation"]').filter({hasText:/[A-Za-z]{4}/}).first();
    await text.waitFor();await text.scrollIntoViewIfNeeded();await frame.locator('#cafa-highlight').click();await page.waitForTimeout(250);
    const rect=await text.boundingBox();await page.mouse.move(rect.x+1,rect.y+rect.height/2);await page.mouse.down();await page.mouse.move(rect.x+rect.width-2,rect.y+rect.height/2,{steps:12});await page.mouse.up();
    await page.waitForFunction(()=>document.querySelector('.original-pdf-left-viewer:not([inert]) iframe').contentWindow.PDFViewerApplication.pdfDocument.annotationStorage.size>0);
    await frame.locator('#cafa-highlight').click();
    // Eviction must finish saving even if the user navigates immediately.
   }
   await page.evaluate(()=>qaCalls={});await page.waitForTimeout(1000);
   samples.push(await page.evaluate(()=>{
    const frames=[...document.querySelectorAll('.original-pdf-viewer iframe')];
    return {pdfContexts:frames.length,canvasBytes:frames.reduce((sum,f)=>sum+[...f.contentDocument.querySelectorAll('canvas')].reduce((s,c)=>s+c.width*c.height*4,0),0),idleFrames:{...qaCalls}};
   }));console.log(JSON.stringify(samples.at(-1)));
  }
  await page.evaluate(()=>location.hash='tentamen/qa-memory-0');
  await page.locator('.exam-footer [data-original-pdf="questions"]').click();
  const frame=page.frameLocator('.original-pdf-left-viewer:not([inert]) iframe');
  await page.waitForFunction(()=>{const w=document.querySelector('.original-pdf-left-viewer:not([inert]) iframe')?.contentWindow;return w?.CafaPdfReader?.ready&&w.PDFViewerApplication.isInitialViewSet&&w.PDFViewerApplication.page===10;});
  const annotations=await frame.locator('body').evaluate(async()=>(await (await PDFViewerApplication.pdfDocument.getPage(10)).getAnnotations()).filter(a=>a.subtype==='Highlight').length);
  assert.equal(annotations,1,'Annotations and page must survive eviction and reopening');
  assert.equal(await page.locator('[data-journal-row="0"][data-journal-col="0"]').inputValue(),'Netto omzet');
  if(!process.env.CAFA_MEMORY_BASELINE){
   for(const calls of [home,practice])assert.ok(Object.values(calls).reduce((s,n)=>s+n,0)<12,'Idle screens must settle');
   assert.ok(samples.every(s=>s.pdfContexts<=2),'Previous exams must release their PDF contexts');
  }
  assert.deepEqual(errors,[]);
  // Controlled saves cover a reopened reader and a failed annotation transaction.
  const fixture=await browser.newPage({viewport:{width:1800,height:1000}});fixture.setDefaultTimeout(45000);
  await fixture.addInitScript(()=>localStorage.setItem('skipgc','t'));
  await fixture.route('**/*',r=>{
   if(!r.request().url().startsWith(base))return r.abort();
   if(r.request().url().includes('/pdf-reader/web/viewer.html?'))return r.fulfill({contentType:'text/html',body:'<p>Testdocument</p><script>window.qaPending=false;window.qaBlock=false;window.CafaPdfReader={ready:true,get pending(){return qaPending;},flush(){return qaBlock?new Promise(resolve=>window.qaRelease=resolve):Promise.resolve();}};</script>'});
   return r.continue();
  });
  await fixture.goto(base+'/#dashboard');await fixture.waitForFunction(()=>window.CafaExams&&document.querySelector('[data-original-pdf]'));
  const open=async(id,kind)=>{await fixture.locator('[data-pdf-exam="'+id+'"][data-original-pdf="'+kind+'"]:visible').first().click();};
  await open('cafa2-20240422','questions');await open('cafa2-20240422','solutions');
  await fixture.waitForFunction(()=>document.querySelector('.original-pdf-left-viewer iframe')?.contentWindow.CafaPdfReader);
  await fixture.evaluate(()=>{qaOldReader=document.querySelector('.original-pdf-left-viewer iframe');qaOldReader.contentWindow.qaBlock=true;qaOldReader.contentWindow.qaPending=true;});
  await open('cafa2-20231009','questions');await fixture.waitForFunction(()=>qaOldReader.contentWindow.qaRelease);
  await open('cafa2-20231009','solutions');await open('cafa2-20240422','questions');
  await fixture.evaluate(()=>{qaOldReader.contentWindow.qaPending=false;qaOldReader.contentWindow.qaRelease();});
  await fixture.waitForFunction(()=>document.querySelectorAll('.original-pdf-viewer iframe').length===2);
  assert.equal(await fixture.evaluate(()=>qaOldReader.isConnected&&!qaOldReader.parentElement.inert),true,'Reopening during save protects the same browsing context');
  await fixture.evaluate(()=>{qaOldReader.contentWindow.qaBlock=false;qaOldReader.contentWindow.qaPending=true;});
  await open('cafa2-20240930','questions');await fixture.waitForTimeout(150);
  assert.equal(await fixture.evaluate(()=>qaOldReader.isConnected),true,'Unsaved annotations must remain accessible after a failed save');
  await fixture.evaluate(()=>qaOldReader.contentWindow.qaPending=false);await open('cafa2-20240930','solutions');
  await fixture.waitForFunction(()=>document.querySelectorAll('.original-pdf-viewer iframe').length===2);
  assert.equal(await fixture.evaluate(()=>qaOldReader.isConnected),false,'Successful saving makes the older reader releasable');
  await fixture.clock.install();
  await fixture.evaluate(()=>{qaIdle=document.querySelector('.original-pdf-left-viewer iframe');qaIdle.contentWindow.qaPending=true;});
  await fixture.locator('.original-pdf-left-viewer [data-pdf-close="questions"]').evaluate(e=>e.click());
  await fixture.locator('#exam-original-solutions [data-pdf-close="solutions"]:visible').click();
  await fixture.clock.fastForward(60001);
  await fixture.waitForFunction(()=>document.querySelectorAll('.original-pdf-viewer iframe').length===1);
  assert.equal(await fixture.evaluate(()=>qaIdle.isConnected),true,'Idle eviction keeps unsaved annotations accessible');
  await fixture.evaluate(()=>qaIdle.contentWindow.qaPending=false);
  await fixture.clock.fastForward(60001);
  await fixture.waitForFunction(()=>document.querySelectorAll('.original-pdf-viewer iframe').length===0);
  await open('cafa2-20240930','questions');
  await fixture.waitForFunction(()=>document.querySelector('.original-pdf-left-viewer iframe')?.contentWindow.CafaPdfReader?.ready);
  await fixture.close();
  console.log(JSON.stringify({home,practice,samples,annotationsPreserved:true,answerPreserved:true,errors}));
 }finally{await browser?.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
