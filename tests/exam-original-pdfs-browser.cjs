const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.PDF_URL||'http://127.0.0.1:8870/cafa2/';
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[],pdfLoads=new Map();
  page.on('request',request=>{if(request.url().includes('/assets/tentamens/')&&request.url().includes('.pdf'))pdfLoads.set(request.url(),(pdfLoads.get(request.url())||0)+1);});
  page.setDefaultTimeout(120000);page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>r.request().url().startsWith(base)?r.continue():r.abort());
  await page.goto(base+'index.html#dashboard',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.CafaExams&&document.querySelector('[data-original-pdf]'));
  const button=(kind,id='cafa2-20240422')=>page.locator('[data-original-pdf="'+kind+'"][data-pdf-exam="'+id+'"]:visible');
  const resumeAssistant=async()=>{await page.locator('[data-pdf-assistant]').click();
   await page.locator('#study-assistant[open]').waitFor();assert.equal(await page.locator('#study-assistant-intro[open]').count(),0);};
  assert.equal(await page.locator('[data-original-pdf]').count(),22);
  assert.equal(await button('questions','cafa2-20210419').isDisabled(),false);
  console.log('Dashboard loaded'); const initial=await page.evaluate(()=>localStorage.getItem(CafaExams.storageKey));
  await button('questions').click();await page.locator('.original-pdf-left-viewer iframe').waitFor();
  await button('solutions').click();await page.locator('#exam-original-solutions[open] iframe').waitFor();await page.waitForFunction(()=>[...document.querySelectorAll('.original-pdf-viewer iframe')].every(f=>f.contentWindow.CafaPdfReader?.ready));
  assert.equal(await page.locator('.study-assistant-launch').isVisible(),false);
  assert.equal(await page.evaluate(()=>localStorage.getItem(CafaExams.storageKey)),initial);
  await page.locator('[data-pdf-close="questions"]').click();assert.equal(await page.locator('#exam-original-solutions[open]').count(),1);
  await page.locator('[data-pdf-close="solutions"]').click();
  assert.equal(await page.locator('body.original-pdf-open').count(),0);
  assert.equal(await page.locator('.original-pdf-dashboard-layout').count(),0);
  console.log('Dashboard previews passed'); await page.evaluate(()=>{
   const exam=CAFA2_EXAMS.find(e=>e.id==='cafa2-20240422'),a=CafaExamEngine.createAttempt(exam,{id:'qa-original-pdfs',untimed:true});
   const value=JSON.stringify({version:1,attempts:[a]});localStorage.setItem(CafaExams.storageKey,value);
   dispatchEvent(new StorageEvent('storage',{key:CafaExams.storageKey,newValue:value}));location.hash='tentamen/'+a.id;
  });
  await page.locator('.exam-footer .actions [data-original-pdf]').first().waitFor();
  const editor=page.locator('#exam-app [contenteditable="true"]').first();await editor.fill('Controleantwoord blijft bewaard.');
  await page.locator('[data-exam-action="mark"]').click();
  await page.waitForTimeout(600);
  const before=await page.evaluate(()=>localStorage.getItem(CafaExams.storageKey));
  const original=await page.locator('#exam-case-panel .exam-source-document').innerHTML();
  await page.locator('[data-exam-action="section"]').first().click();
  await button('questions').click();assert.equal(await page.locator('#exam-case-panel').isVisible(),true);
  await button('solutions').click();
  const geometry=await page.evaluate(()=>{
   const l=document.querySelector('#exam-case-panel').getBoundingClientRect(),q=document.querySelector('.cirrus-work-pane').getBoundingClientRect(),r=document.querySelector('#exam-original-solutions').getBoundingClientRect();return {left:l.width,question:q.width,right:r.width,overlap:q.right>r.left+2};
  });assert.ok(geometry.left>100&&geometry.question>200&&geometry.right>=300);assert.equal(geometry.overlap,false);
  if(process.env.PDF_SCREENSHOT)await page.screenshot({path:process.env.PDF_SCREENSHOT});
  assert.equal(await editor.innerText(),'Controleantwoord blijft bewaard.');assert.equal(await page.evaluate(()=>localStorage.getItem(CafaExams.storageKey)),before);
  await page.locator('[data-pdf-close="questions"]').click();assert.equal(await page.locator('#exam-case-panel .exam-source-document').innerHTML(),original);
  await resumeAssistant();
  const draft=page.locator('#study-assistant textarea');await draft.fill('Bewaar dit concept.');
  await button('solutions').click();assert.equal(await page.locator('#study-assistant[open]').count(),0);
  await resumeAssistant();assert.equal(await draft.inputValue(),'Bewaar dit concept.');
  await page.locator('#study-assistant [data-action="close"]').click();
  console.log('Exam and assistant draft passed'); const ids=await page.evaluate(()=>Object.entries(CAFA2_DATA.modules).flatMap(([code,bank])=>bank.questions.flatMap((q,i)=>q.examId==='cafa2-20240422'?[code+'-'+(i+1)]:[])));assert.ok(ids.length>0);
  await page.evaluate(id=>location.hash=id,ids[0]);await page.locator('#'+ids[0]+' [data-original-pdf]').first().waitFor();
  assert.equal(await page.locator('#'+ids[0]+' [data-original-pdf]').count(),2);
  await button('questions').click();await button('solutions').click();await page.locator('#exam-original-solutions[open] iframe').waitFor();
  assert.match(decodeURIComponent(await page.locator('.original-pdf-left-viewer:visible iframe').getAttribute('src')),/20240422\/opgaven\.pdf/);
  console.log('MC panes open'); await page.setViewportSize({width:390,height:844});
  await page.waitForTimeout(400);assert.ok(await page.locator('#exam-original-solutions a[target="_blank"]').isVisible());
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));
  await page.evaluate(()=>location.hash='dashboard');await page.locator('a.exam-name').first().waitFor();
  assert.equal(await page.locator('#exam-original-solutions[open]').count(),0);assert.equal(await page.locator('.original-pdf-left').count(),0);
  console.log('Mobile and route cleanup passed'); for(const id of await page.evaluate(()=>CafaExams.catalog.map(e=>e.id))){
   await page.evaluate(id=>location.hash='welkom/'+id,id);await page.locator('.exam-paper [data-pdf-exam="'+id+'"]').first().waitFor();
  }
  assert.ok([...pdfLoads.values()].every(n=>n===1),'PDF documents are not reloaded on layout or route changes');
  assert.deepEqual(errors,[]);console.log('Dashboard, eleven introductions, exam, MC, desktop/mobile, original source, answers, marking, assistant draft and PDF load retention: passed.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
