const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const root=path.resolve(__dirname,'..'),sra=fs.existsSync(path.join(root,'js/mc.js'));
const out=process.env.QA_OUTPUT||path.join(root,sra?'tmp/question-navigation':'docs/mc-audit/qa/navigation');fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{const pathname=decodeURIComponent(new URL(req.url,'http://local').pathname),file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8'})[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);});
(async()=>{let browser;await new Promise(r=>server.listen(0,'127.0.0.1',r));try{
 const base=process.env.TEST_BASE_URL||'http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
 for(const width of [1366,390]){
  const context=await browser.newContext({viewport:{width,height:950}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));page.setDefaultTimeout(15000);
  const main=sra?'#home':'#start',subjects=sra?'#tentamen/mc':'#oefenen',question=sra?'#tentamen/mc/mpu/1':'#kap-1';
  const links=page.locator(sra?'#question-return-links':'.question-return-links'),back=page.locator(sra?'#history-back':'[data-study-back]');
  async function checkQuestion(){await links.getByRole('link',{name:'Home',exact:true}).waitFor();assert.ok(await back.isHidden());assert.equal(await links.getByRole('link',{name:'Home',exact:true}).getAttribute('href'),main);assert.equal(await links.getByRole('link',{name:'Onderwerpen',exact:true}).getAttribute('href'),subjects);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
  await page.goto(base+'/index.html'+question);await page.locator(sra?'.mc-page':'.question:target').waitFor();await checkQuestion();
  if(sra){await page.locator('.mc-option>label').first().click();await page.locator('#mc-check').click();}else{await page.locator('.question:target .option[data-option="0"]').click();}
  const answer=await page.evaluate(sra=>sra?SRAMC.snapshot():CafaPractice.getAnswer('kap',1),sra);
  await links.getByRole('link',{name:'Onderwerpen',exact:true}).click();await page.locator(sra?'.mc-parts':'#practice-topic-cards').waitFor();assert.ok(await links.isHidden());assert.ok(await back.isVisible());
  if(sra){assert.equal(await page.locator('.mc-part-card').count(),4);assert.equal(await page.locator('.mc-part-card[data-group="hoofd-tentamen"]').count(),0);assert.equal(await page.locator('[data-topic="tentamen"]').count(),1);}
  await page.evaluate(hash=>location.hash=hash,question);await checkQuestion();assert.deepEqual(await page.evaluate(sra=>sra?SRAMC.snapshot():CafaPractice.getAnswer('kap',1),sra),answer);
  // The ordinary back control remains on reference pages and restores the question.
  if(sra)await page.evaluate(()=>location.hash='#bronnen');else{await page.locator('#study-tools-menu>summary').click();await page.locator('#study-tools-menu').getByRole('link',{name:'Bronnen',exact:true}).click();}
  await back.waitFor();assert.ok(await links.isHidden());await back.click();await checkQuestion();
  await links.getByRole('link',{name:'Home',exact:true}).click();await page.waitForURL('**'+main);assert.ok(await links.isHidden());
  const examId=await page.evaluate(sra=>(sra?SRACirrus:CafaExams).catalog.find(e=>!e.demo).id,sra);await page.evaluate(id=>location.hash='#welkom/'+id,examId);await page.locator('[data-exam-untimed]').check();await page.locator('[data-exam-action="start"]').click();await page.locator('body.exam-running').waitFor();await checkQuestion();
  const attemptRoute=await page.evaluate(()=>location.hash),editor=page.locator('#exam-app [contenteditable="true"]').first();await editor.fill('Bewaarde proefuitwerking');await page.locator('[data-exam-action="mark"]').click();
  const saved=await page.evaluate(sra=>(sra?SRACirrus:CafaExams).getAttempts().at(-1),sra);assert.ok(JSON.stringify(saved).includes('Bewaarde proefuitwerking'));
  await page.screenshot({path:path.join(out,`${sra?'sra':'cafa2'}-exam-${width}.png`)});
  await links.getByRole('link',{name:'Onderwerpen',exact:true}).click();await page.locator(sra?'.mc-parts':'#practice-topic-cards').waitFor();assert.ok(await back.isVisible());await page.evaluate(hash=>location.hash=hash,attemptRoute);await checkQuestion();assert.ok(await page.locator('#exam-app [contenteditable="true"]').first().innerText().then(s=>s.includes('Bewaarde proefuitwerking')));assert.equal(await page.locator('[data-exam-action="mark"]').getAttribute('aria-pressed'),'true');
  await links.getByRole('link',{name:'Home',exact:true}).click();await page.waitForURL('**'+main);assert.ok(await links.isHidden());
  if(sra&&!process.env.TEST_BASE_URL){await page.goto(base+'/SRA%20interactieve%20samenvatting.html'+question);await checkQuestion();}
  assert.deepEqual(errors,[]);await context.close();
 }
 console.log(JSON.stringify({ok:true,site:sra?'SRA':'CAFA2',viewports:[1366,390],checks:'Directe MC-links, Home, Onderwerpen, Vorige pagina elders, terugkeer uit bronnen, MC-antwoordbehoud, actieve tentamenuitwerking en markering behouden, zelfstandige SRA-versie'}));
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
