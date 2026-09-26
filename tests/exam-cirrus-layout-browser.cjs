/* Browsercontrole van de gepubliceerde tentamenindeling in een afzonderlijke browsercontext. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const courseName=fs.existsSync(path.join(__dirname,'../js/cirrus.js'))?'sra':'cafa2',base=process.env.CIRRUS_URL;
if(!base)throw Error('Geef CIRRUS_URL op voor een lokale of gepubliceerde applicatie.');
const out=process.env.QA_OUTPUT||path.join(__dirname,'../tmp/cirrus-layout');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
 try{
  const page=await browser.newPage({viewport:{width:1366,height:900}}),errors=[],reports=[];
  page.setDefaultTimeout(60000);page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>r.request().url().startsWith(base.replace(/\/$/,'')+'/')?r.continue():r.abort());
  for(const course of [courseName]){
   await page.setViewportSize({width:1366,height:900});
   await page.goto(base.replace(/\/$/,'')+'/index.html#'+(course==='sra'?'tentamen':'dashboard'),{waitUntil:'domcontentloaded'});

   await page.waitForFunction(()=>window.CafaExams||window.SRACirrus);
   assert.equal(await page.evaluate(()=>location.hash.includes('voorbeeld')),false);
   await page.evaluate(sra=>{const app=sra?SRACirrus:CafaExams,catalog=sra?SRA_CIRRUS_EXAMS:CAFA2_EXAMS,e=catalog.find(e=>e.id===(sra?'20241028':'cafa2-20240422')),a=CafaExamEngine.createAttempt(e,{id:'qa-cirrus-layout',untimed:true});a.currentIndex=sra?0:2;const value=JSON.stringify({version:1,attempts:[a]});localStorage.setItem(app.storageKey,value);dispatchEvent(new StorageEvent('storage',{key:app.storageKey,newValue:value}));location.hash=(sra?'toets/':'tentamen/')+a.id;},course==='sra');
   await page.locator('.cirrus-work-pane').waitFor();
   await page.locator('#cirrus-tools-menu summary').click();assert.equal(await page.locator('#cirrus-tools-menu').evaluate(e=>e.open),true);await page.keyboard.press('Escape');assert.equal(await page.locator('#cirrus-tools-menu').evaluate(e=>e.open),false);
   const colors=await page.evaluate(()=>{const bar=document.querySelector('.topbar'),title=document.querySelector('.exam-runner-title'),tools=document.querySelector('.top-controls'),theme=tools.querySelector('.study-theme-control'),clock=tools.querySelector('.exam-clock'),calc=tools.querySelector('[data-calc]');return {bar:getComputedStyle(bar).backgroundColor,title:getComputedStyle(title).color,order:theme.nextElementSibling===clock&&clock.nextElementSibling===calc};});assert.equal(colors.bar,colors.title);assert.equal(colors.title,'rgb(68, 65, 89)');assert.equal(colors.order,true);
   const button=page.locator('.exam-question-identity [data-exam-action="section"]');
   if(await page.locator('#exam-case-panel').evaluate(n=>n.hidden))await button.click();
   const state=()=>page.evaluate(()=>{
    const r=s=>document.querySelector(s).getBoundingClientRect().toJSON(),weight=s=>getComputedStyle(document.querySelector(s)).fontWeight;
    return {head:r('.exam-work-head'),prompt:r('#exam-app .exam-source-question'),footer:r('.exam-footer'),panel:r('#exam-case-panel'),pageHead:r('.cirrus-page-head'),mainWeight:weight('.cirrus-main-instruction'),breadcrumbsVisible:[...document.querySelectorAll('.study-page-name')].some(e=>e.getBoundingClientRect().height>0),overflow:document.documentElement.scrollWidth>innerWidth+1,marked:!document.querySelector('.cirrus-question-flag').hidden};
   });
   let current=await state();assert.equal(current.breadcrumbsVisible,false);assert.equal(current.overflow,false);assert.equal(current.mainWeight,'700');assert.ok(Math.abs(current.head.x-current.prompt.x)<1);assert.ok(current.footer.bottom<=900);assert.ok(current.panel.x<current.head.x);
   const editor=page.locator('#exam-app [data-exam-answer] [contenteditable="true"]').first();await editor.fill('Controleantwoord behouden');
   await button.click();assert.equal(await editor.innerText(),'Controleantwoord behouden');current=await state();assert.ok(Math.abs(current.head.x-current.prompt.x)<1);
   await page.screenshot({path:path.join(out,course+'-cirrus-casus-dicht.png')});await button.click();
   await page.locator('[data-exam-action="mark"]').click();await page.locator('.cirrus-question-flag').waitFor();
   await page.screenshot({path:path.join(out,course+'-cirrus-casus-open.png')});
   await page.locator('[data-exam-action="overview"]').click();await page.locator('.compact-overview-item.is-marked .compact-overview-state').filter({hasText:'Gemarkeerd'}).waitFor();
   await page.screenshot({path:path.join(out,course+'-cirrus-overzicht.png')});await page.locator('[data-close-info]').first().click();
   await page.locator('.cirrus-float-trigger').click();await page.locator('.cirrus-case-float').waitFor();
   const beforeFloat=await page.locator('.cirrus-case-float').boundingBox();await page.locator('[data-float-size]').click();const large=await page.locator('.cirrus-case-float').boundingBox();assert.ok(large.width>beforeFloat.width);
   await page.screenshot({path:path.join(out,course+'-cirrus-zwevende-casus.png')});await page.locator('[data-float-size]').click();
   const move=page.locator('.cirrus-float-move');await move.focus();const beforeMove=await page.locator('.cirrus-case-float').boundingBox();await page.keyboard.press('ArrowLeft');const afterMove=await page.locator('.cirrus-case-float').boundingBox();assert.ok(afterMove.x<beforeMove.x);
   await page.locator('[data-float-close]').first().click();assert.equal(await editor.innerText(),'Controleantwoord behouden');assert.equal(await page.locator('#exam-case-panel').evaluate(n=>n.hidden),false);
   const handle=page.locator('.exam-case-resizer');await handle.focus();const caseWidth=await page.locator('#exam-case-panel').evaluate(e=>e.clientWidth);await page.keyboard.press('ArrowRight');assert.ok(await page.locator('#exam-case-panel').evaluate(e=>e.clientWidth)>caseWidth);
   const calc=course==='sra'?'#calculator':'#calculator-dialog';
   await page.locator(course==='sra'?'#calc-open':'[data-calc]').first().click();const input=page.locator(calc+' [data-calc-input]');
   for(const [expression,expected] of [['200',200],['*0.8',160],['1.000,50+0.5',1001],['1.234.567',1234567],['0.8',0.8],['Ans*0,8',0.64]]){
    await input.fill(expression);await input.press('Enter');const last=await page.evaluate(sra=>(sra?SRACalculator:CafaCalculator).getState(),course==='sra');assert.ok(Math.abs(last.lastValue-expected)<1e-10,expression);assert.equal(last.errorShown,false);
   }
   await input.fill('1.23.456');await input.press('Enter');assert.equal(await page.evaluate(sra=>(sra?SRACalculator:CafaCalculator).getState().errorShown,course==='sra'),true);
   await input.fill('2^3');await input.press('Enter');
   await page.locator(calc+' [data-calc-compact]').click();const size=await page.locator(calc).boundingBox();assert.equal(size.width,240);assert.equal(size.height,500);
   const plus=await page.locator(calc+' .calc-keys').locator('[data-calc-key="+"],[data-key="+"]').boundingBox();assert.ok(plus.y+plus.height<size.y+size.height);
   await page.screenshot({path:path.join(out,course+'-cirrus-rekenmachine.png')});await page.locator(calc+' [data-calc-close]').click();
   if(course==='cafa2'){const help=page.locator('.cirrus-summary-link');assert.equal(await help.count(),1);assert.equal(await help.evaluate(e=>e.parentElement.classList.contains('exam-answer-actions')),true);}
   // Controleer een bestaande SRA-vraag met meerdere alinea's en onderdelen.
   if(course==='sra'){
    await page.evaluate(()=>{const e=SRA_CIRRUS_EXAMS.find(e=>e.id==='20221031'),a=CafaExamEngine.createAttempt(e,{id:'qa-meerdelig',untimed:true});a.currentIndex=14;const value=JSON.stringify({version:1,attempts:[...SRACirrus.getAttempts(),a]});localStorage.setItem(SRACirrus.storageKey,value);dispatchEvent(new StorageEvent('storage',{key:SRACirrus.storageKey,newValue:value}));location.hash='toets/'+a.id;});
    await page.locator('.exam-question-identity .qnum').filter({hasText:'15'}).waitFor();await page.locator('.cirrus-work-pane').waitFor();
    const parts=await page.locator('#exam-app .exam-source-question').evaluate(e=>({main:e.querySelectorAll('.cirrus-main-instruction').length,paragraphs:[...e.querySelectorAll(':scope>p')].map(n=>getComputedStyle(n).fontWeight)}));assert.equal(parts.main,1);assert.ok(parts.paragraphs.length>1);assert.equal(parts.paragraphs[0],'700');assert.ok(parts.paragraphs.slice(1).every(w=>w==='400'));assert.equal(await page.locator('#cirrus-tools-menu').count(),1);
    assert.equal(await page.locator('.cirrus-supplemental').evaluate(e=>getComputedStyle(e).fontWeight),'400');
    const images=page.locator('#exam-case-panel img');for(let n=0;n<await images.count();n++)await images.nth(n).evaluate(img=>{img.loading='eager';return img.complete?Promise.resolve():new Promise(resolve=>{img.addEventListener('load',resolve,{once:true});img.addEventListener('error',resolve,{once:true});});});assert.ok(await images.evaluateAll(items=>items.every(img=>img.naturalWidth>0)));
    await page.screenshot({path:path.join(out,'sra-cirrus-meerdelige-vraag.png')});
   }
   // Preserve viewport layout and the floating case at both page-scale limits.
   for(const font of [10,24]){
    await page.evaluate(font=>StudyScale.set(font,14,10,24),font);await page.waitForTimeout(150);
    const footer=await page.locator('.exam-footer').boundingBox();assert.ok(footer.y+footer.height<=901);
    await page.locator('.cirrus-float-trigger').click();await page.locator('[data-float-size]').click();
    const floating=await page.locator('.cirrus-case-float').boundingBox();assert.ok(floating.x>=0&&floating.y>=0&&floating.x+floating.width<=1367&&floating.y+floating.height<=901);
    await page.locator('[data-float-close]').first().click();
   }
   await page.evaluate(()=>StudyScale.set(14,14,10,24));
   await page.setViewportSize({width:390,height:844});if(!(await page.locator('#exam-case-panel').evaluate(e=>e.hidden)))await button.click();
   assert.equal((await state()).overflow,false);assert.equal(await page.locator('.cirrus-page-nav a').nth(1).innerText(),'Dashboard');
   await page.screenshot({path:path.join(out,course+'-cirrus-mobiel.png')});
   await page.evaluate(()=>document.documentElement.dataset.studyTheme='dark');assert.equal((await state()).overflow,false);await page.screenshot({path:path.join(out,course+'-cirrus-mobiel-donker.png')});await page.evaluate(()=>document.documentElement.dataset.studyTheme='light');
   await page.locator('.cirrus-float-trigger').click();const mobileFloat=await page.locator('.cirrus-case-float').boundingBox();assert.ok(mobileFloat.width<=390);await page.locator('[data-float-close]').first().click();
   reports.push({course,status:'geslaagd',desktop:current,calculator:size,mobile:'geen horizontale pagina-overloop'});console.log(course+': Cirrus-indeling, casus, markeringen, invoer, rekenmachine en mobiel geslaagd.');
  }
  assert.deepEqual(errors,[]);const reportFile=path.join(out,'controle.json');let previous=[];try{previous=JSON.parse(fs.readFileSync(reportFile,'utf8')).reports||[];}catch(_){}const merged=previous.filter(p=>!reports.some(r=>r.course===p.course)).concat(reports);fs.writeFileSync(reportFile,JSON.stringify({status:'geslaagd',reports:merged},null,2));
 }finally{await browser.close();}
})();
