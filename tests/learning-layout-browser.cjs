/* Shared navigation, route transitions and answer retention in an isolated context. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.LEARNING_URL,sra=fs.existsSync(path.join(__dirname,'../js/cirrus.js'));
if(!base)throw Error('Geef LEARNING_URL op.');
const out=process.env.QA_OUTPUT||path.join(__dirname,'../tmp/learning-layout');fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH});try{
 const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];page.setDefaultTimeout(120000);page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',r=>r.request().url().startsWith(base)?r.continue():r.abort());
 await page.goto(base+'index.html#'+(sra?'home':'start'),{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.SRACirrus||window.CafaExams);await page.locator('#learning-tools-menu').waitFor({state:'attached'});
 const routes=sra?['home','tentamen','tentamen/mc','tentamen/mc/beginnen/1','leren','les/stratificatie','formules','begrippen','voortgang','bronnen']:['start','dashboard','oefenen','kap-1','voortgang'];
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:width===390?844:900});
  for(const route of routes){
   await page.evaluate(route=>location.hash=route,route);await page.waitForTimeout(250);
   await page.locator('.learning-home').waitFor({state:'visible'});
   const state=await page.evaluate(()=>{const strip=document.querySelector('.learning-page-head'),tools=document.querySelector('.top-controls,.reader-top-tools'),theme=tools.querySelector('.study-theme-control'),calc=tools.querySelector('[data-calc]'),font=tools.querySelector('.font-group');return {home:strip.querySelector('.learning-home').getAttribute('href'),title:strip.querySelector('h1').textContent,order:theme.compareDocumentPosition(calc)&Node.DOCUMENT_POSITION_FOLLOWING,fonts:!font||!!(calc.compareDocumentPosition(font)&Node.DOCUMENT_POSITION_FOLLOWING),crumbs:[...document.querySelectorAll('.study-page-name')].some(n=>n.checkVisibility()),overflow:document.documentElement.scrollWidth>innerWidth+1};});
   assert.equal(state.home,sra?'#home':'#start');assert.ok(state.order);assert.ok(state.fonts);assert.equal(state.crumbs,false);assert.equal(state.overflow,false,route+' '+width);
   if(width===1440&&(route==='kap-1'||route==='tentamen/mc/beginnen/1')){const footer=await page.locator(sra?'.sra-exam-footer':'#kap-1 .question-nav').boundingBox();assert.ok(footer.y+footer.height<=901,'Onderbalk blijft binnen het scherm');}
   if(sra&&width===390&&route==='les/stratificatie'){await page.locator('#menu-toggle').click();assert.equal(await page.locator('body').evaluate(n=>n.classList.contains('menu-open')),true);await page.locator('#menu-toggle').click();}
   const quickLinks=await page.locator('#learning-tools-menu a').allTextContents();assert.ok(quickLinks.indexOf('Voortgang')>quickLinks.indexOf('Begrippen'));
   if(route==='home'||route==='start'){const labels=await page.locator('.study-home-links a').evaluateAll(nodes=>nodes.map(a=>a.querySelector('span').textContent));assert.equal(labels.indexOf('Voortgang'),labels.indexOf('Begrippen')+1);}
   await page.locator('#learning-tools-menu summary').click();assert.equal(await page.locator('#learning-tools-menu').evaluate(n=>n.open),true);await page.keyboard.press('Escape');assert.equal(await page.locator('#learning-tools-menu').evaluate(n=>n.open),false);
   if(route.includes('/1')||route==='kap-1'||route==='home'||route==='start')await page.screenshot({path:path.join(out,route.replaceAll('/','-')+'-'+width+'.png')});
  }
 }
 await page.evaluate(sra=>location.hash=sra?'tentamen/mc/beginnen/1':'kap-1',sra);await page.waitForTimeout(300);
 if(sra){await page.locator('input[name="mc-choice"]').first().check();await page.locator('#mc-check').click();await page.locator('.learning-home').click();await page.evaluate(()=>location.hash='tentamen/mc/beginnen/1');await page.waitForTimeout(300);assert.equal(await page.locator('input[name="mc-choice"]').first().isChecked(),true);assert.equal(await page.locator('#mc-introduction').isVisible(),false);}
 else {const head=page.locator('#kap-1 .question-header');assert.equal(await head.evaluate(n=>n.parentElement.classList.contains('qbody')),true);const toggle=page.locator('#kap-1 .qidentity [data-practice-case]');await toggle.click();assert.equal(await page.locator('#kap-1 .exam-case-panel').isVisible(),false);assert.equal(await head.isVisible(),true);await toggle.click();assert.equal(await page.locator('#kap-1 .exam-case-panel').isVisible(),true);}
 await page.locator('.study-theme-control summary').click();await page.locator('[data-theme-choice="dark"]').click();assert.equal(await page.locator('.learning-home').isVisible(),true);await page.screenshot({path:path.join(out,'dark-mobile.png')});
 if(!sra){await page.goto(base+'samenvatting.html#waardering',{waitUntil:'domcontentloaded'});await page.locator('.learning-home').waitFor();assert.equal(await page.locator('.learning-home').getAttribute('href'),'index.html#start');await page.locator('#learning-tools-menu summary').click();assert.ok(await page.locator('#learning-tools-menu a').count());await page.keyboard.press('Escape');}
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'result.json'),JSON.stringify({course:sra?'SRA':'CAFA2',routes,desktop:true,mobile:true,answerRetention:true,errors},null,2));console.log('Gedeelde leerindeling gecontroleerd: '+(sra?'SRA':'CAFA2'));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
