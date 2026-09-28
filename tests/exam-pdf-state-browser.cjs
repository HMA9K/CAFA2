const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.PDF_URL||'http://127.0.0.1:8870/cafa2/';
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}}),loads=new Map(),errors=[];
  page.setDefaultTimeout(120000);page.on('pageerror',e=>errors.push(e.message));
  // A same-origin viewer fixture exposes browsing-context state. The separate
  // original-PDF test checks the actual source assets and PDF.js viewer layout.
  await page.route('**/*',async route=>{
   const url=route.request().url();if(!url.startsWith(base))return route.abort();
   if(url.includes('/pdf-reader/web/viewer.html?')){
    loads.set(url,(loads.get(url)||0)+1);
    return route.fulfill({contentType:'text/html',body:'<label>Pagina <input id="page" value="1"></label><label>Zoom <input id="zoom" value="100"></label><div style="height:3000px">Document</div>'});
   }
   return route.continue();
  });
  await page.goto(base+'index.html#dashboard',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.CafaExams&&window.StudyAssistant);
  console.log('PDF state: application ready');
  await page.evaluate(()=>{
   const exam=CAFA2_EXAMS.find(e=>e.id==='cafa2-20240422'),a=CafaExamEngine.createAttempt(exam,{id:'qa-pdf-state',untimed:true});
   const value=JSON.stringify({version:1,attempts:[a]});localStorage.setItem(CafaExams.storageKey,value);
   dispatchEvent(new StorageEvent('storage',{key:CafaExams.storageKey,newValue:value}));location.hash='tentamen/'+a.id;
  });
  const button=kind=>page.locator('.exam-footer [data-original-pdf="'+kind+'"]');
  const left=page.frameLocator('.original-pdf-left-viewer:visible iframe');
  const right=page.frameLocator('#exam-original-solutions .original-pdf-viewer:not([inert]) iframe');
  await button('questions').click();await left.locator('#page').fill('7');await left.locator('#zoom').fill('125');
  await button('solutions').click();await right.locator('#page').fill('5');await right.locator('#zoom').fill('150');
  console.log('PDF state: both viewers ready');
  await page.waitForTimeout(350);await left.locator('body').evaluate(()=>scrollTo(0,400));
  const scroll=await left.locator('body').evaluate(()=>scrollY);
  assert.equal(await left.locator('#page').inputValue(),'7');assert.equal(await left.locator('#zoom').inputValue(),'125');
  await page.locator('[data-exam-action="next"]').click();
  await page.waitForTimeout(350);
  assert.equal(await left.locator('#page').inputValue(),'7');assert.equal(await right.locator('#page').inputValue(),'5');
  assert.equal(await left.locator('#zoom').inputValue(),'125');assert.equal(await right.locator('#zoom').inputValue(),'150');
  assert.equal(await left.locator('body').evaluate(()=>scrollY),scroll);
  console.log('PDF state: next question retained');
  // Closing and reopening either panel must preserve the same browsing context.
  await button('questions').click();await button('questions').click();
  assert.equal(await left.locator('#page').inputValue(),'7');
  console.log('PDF state: left toggle retained');
  await page.locator('[data-pdf-assistant]').click();await page.locator('#study-assistant[open]').waitFor();
  assert.equal(await page.locator('#study-assistant-intro[open]').count(),0);
  await page.locator('#study-assistant textarea').fill('Concept blijft bewaard');
  await button('solutions').click();assert.equal(await right.locator('#page').inputValue(),'5');
  await page.locator('[data-pdf-assistant]').click();await page.locator('#study-assistant[open]').waitFor();
  assert.equal(await page.locator('#study-assistant-intro[open]').count(),0);
  assert.equal(await page.locator('#study-assistant textarea').inputValue(),'Concept blijft bewaard');
  await button('solutions').click();
  console.log('PDF state: assistant return retained');
  await page.setViewportSize({width:390,height:844});await page.waitForTimeout(350);
  assert.equal(await right.locator('#zoom').inputValue(),'150');
  await page.setViewportSize({width:1440,height:900});await page.waitForTimeout(350);
  console.log('PDF state: viewport retained');
  assert.equal(await left.locator('#zoom').inputValue(),'125');
  await page.evaluate(()=>location.hash='dashboard');await page.locator('a.exam-name').first().waitFor();
  assert.equal(await page.locator('#exam-original-solutions[open]').count(),0);
  const questions=await page.evaluate(()=>Object.entries(CAFA2_DATA.modules).flatMap(([code,bank])=>bank.questions.flatMap(q=>q.examId==='cafa2-20240422'?[code+'-'+q.id]:[])));
  for(const id of questions.slice(0,2)){
   await page.evaluate(id=>location.hash=id,id);await page.locator('#'+id+' [data-original-pdf]').first().waitFor();
   if(id===questions[0]){
    await page.locator('#'+id+' [data-original-pdf="questions"]').click();
    await page.locator('#'+id+' [data-original-pdf="solutions"]').click();
   }
   assert.equal(await left.locator('#page').inputValue(),'7');assert.equal(await right.locator('#page').inputValue(),'5');
  }
  assert.equal(loads.size,2);assert.ok([...loads.values()].every(n=>n===1),'Each PDF loads exactly once');
  assert.deepEqual(errors,[]);
  console.log('OK: one load per PDF; page, zoom and scroll retained across exam/MC navigation, panel toggles and resizing; direct assistant return and draft preserved.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
