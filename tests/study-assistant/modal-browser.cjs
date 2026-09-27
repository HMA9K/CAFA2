const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
(async()=>{const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});try{
 const page=await browser.newPage({viewport:{width:1366,height:900}});
 await page.route('**/api/study-status',r=>r.fulfill({contentType:'application/json',body:JSON.stringify({course:'CAFA2',ready:true,authenticated:false})}));
 await page.goto((process.env.BASE_URL||'http://127.0.0.1:8870/cafa2/')+'index.html#dashboard',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.CafaExams&&window.StudyAssistant);
 await page.evaluate(()=>{const a=CafaExamEngine.createAttempt(CAFA2_EXAMS[0],{id:'qa-assistant-modal',untimed:true});const value=JSON.stringify({version:1,attempts:[a]});localStorage.setItem(CafaExams.storageKey,value);dispatchEvent(new StorageEvent('storage',{key:CafaExams.storageKey,newValue:value}));location.hash='tentamen/'+a.id;});
 await page.locator('.exam-answer-actions').waitFor();await page.evaluate(()=>StudyAssistant.resume());
 const assistant=page.locator('#study-assistant');await assistant.waitFor({state:'visible'});
 await assistant.locator('[data-chat-form] textarea').fill('Oefenconcept');
 for(const action of ['overview','introduction']){
  await page.locator('[data-exam-action="'+action+'"]').click();
  const modal=page.locator('dialog:modal');await modal.waitFor({state:'visible'});
  await page.waitForFunction(()=>document.getElementById('study-assistant').style.visibility==='hidden');
  assert.equal(await modal.locator('#study-assistant,.study-assistant-layout').count(),0);
  assert.equal(await assistant.evaluate(e=>e.inert),true);
  await modal.locator('[data-close-info]').first().click();await assistant.waitFor({state:'visible'});
  assert.equal(await assistant.locator('[data-chat-form] textarea').inputValue(),'Oefenconcept');
 }
 console.log('Overzicht and introduction exclude the assistant; closing restores the question pane and draft.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
