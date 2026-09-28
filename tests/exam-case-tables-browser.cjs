const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.CASE_URL||'http://127.0.0.1:8870/';
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
 try{
  for(const width of [1440,390]){
   const page=await browser.newPage({viewport:{width,height:900}});
   await page.addInitScript(()=>sessionStorage.setItem('cafa2-assistant-launch-hidden','true'));
   await page.goto(base+'index.html#dashboard');
   await page.waitForFunction(()=>window.CafaExamDocument&&window.CAFA2_CASE_PRESENTATION&&window.CafaExams);
   const checked=await page.evaluate(width=>{
    const host=document.createElement('div');host.style.cssText='width:'+Math.min(680,width-40)+'px;position:absolute;left:10px;top:10px;background:white;z-index:9999';document.body.append(host);
    let sections=0,tables=0;
    for(const exam of CAFA2_EXAMS)for(const section of exam.sections){
     host.innerHTML=CafaExamDocument.render(exam,'case',section.contentHtml);
     const key=exam.id+'/'+section.id;
     for(const table of host.querySelectorAll('table')){
      const wrap=table.closest('.exam-case-table-scroll');if(!wrap)throw Error(key+' table scroll wrapper missing');
      if(wrap.getBoundingClientRect().width>host.getBoundingClientRect().width+1)throw Error(key+' wrapper wider than panel');
      for(const row of table.rows){
       const cols=Array.from(row.cells).reduce((n,c)=>n+c.colSpan,0);
       if(cols!==table.rows[0].cells.length&&row.cells.length!==1)throw Error(key+' misaligned table row');
      }
      if(table.classList.contains('exam-case-balance')){
       if(!table.textContent.includes('Passiva (credit)')&&!/debet/i.test(table.caption.textContent))throw Error(key+' missing liabilities label');
       if(table.textContent.includes('Activa (debet)')&&table.textContent.includes('Passiva (credit)')&&table.textContent.indexOf('Activa (debet)')>table.textContent.indexOf('Passiva (credit)'))throw Error(key+' reversed sides');
      }
      tables++;
     }
     sections++;
    }
    host.remove();return {sections,tables};
   },width);
   assert.equal(checked.sections,44);
   await page.evaluate(()=>{
    const exam=CAFA2_EXAMS.find(e=>e.id==='cafa2-20240930'),attempt=CafaExamEngine.createAttempt(exam,{id:'qa-case',untimed:true});
    const value=JSON.stringify({version:1,attempts:[attempt]});localStorage.setItem(CafaExams.storageKey,value);
    dispatchEvent(new StorageEvent('storage',{key:CafaExams.storageKey,newValue:value}));location.hash='tentamen/'+attempt.id;
   });
   const balance=page.locator('#exam-case-panel .exam-case-balance');await balance.waitFor();
   assert.deepEqual(await balance.locator('.exam-balance-group').allTextContents(),['Activa (debet)','Passiva (credit)']);
   assert.equal(await balance.locator('.exam-source-total').count(),2);
   assert.equal(await balance.locator('tbody tr').count(),9);
   assert.match(await balance.evaluate(t=>getComputedStyle(t).fontFamily),/^Arial,/);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   if(width===390){
    assert.ok(await balance.evaluate(t=>{const w=t.parentElement;w.scrollLeft=w.scrollWidth;return w.scrollLeft>0&&w.scrollLeft+w.clientWidth>=w.scrollWidth-1;}));
   }
   if(process.env.CASE_SCREENSHOT)await balance.screenshot({path:process.env.CASE_SCREENSHOT+'-'+width+'.png'});
   console.log(width+': '+checked.sections+' casussecties, '+checked.tables+' tabellen; Pienza activa/passiva en totalen zichtbaar, Arial, geen pagina-overloop.');
   await page.close();
  }
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
