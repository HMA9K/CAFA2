import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const require=createRequire(import.meta.url),playwright=require(process.env.CAFA_PLAYWRIGHT_PATH||'playwright'),engine=process.env.CAFA_BROWSER||'chromium';
assert.ok(['chromium','webkit'].includes(engine));
const server=http.createServer((req,res)=>{
 const pathname=new URL(req.url,'http://localhost').pathname,p=path.resolve(root,'.'+(pathname==='/'?'/index.html':decodeURIComponent(pathname)));
 if(!p.startsWith(root+path.sep)||!fs.existsSync(p)||!fs.statSync(p).isFile()){res.writeHead(404);res.end();return;}
 res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.pdf':'application/pdf'})[path.extname(p)]||'application/octet-stream');fs.createReadStream(p).pipe(res);
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
try{
 browser=await playwright[engine].launch({headless:true,...(engine==='chromium'&&process.env.CAFA_CHROMIUM_PATH?{executablePath:process.env.CAFA_CHROMIUM_PATH}:{})});
 const page=await browser.newPage({viewport:{width:1366,height:950}}),errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(new URL(r.url()).pathname));
 await page.addInitScript(()=>{localStorage.setItem('skipgc','t');window.performanceReady=null;window.addEventListener('cafa:ready',()=>performanceReady=performance.now());});
 const base='http://127.0.0.1:'+server.address().port;
 await page.route('**/*',request=>request.request().url().startsWith(base)?request.continue():request.abort());
 await page.goto(base);await page.waitForFunction(()=>window.performanceReady!==null);
 assert.equal(await page.locator('.question').count(),0);
 assert.equal(await page.locator('#calculator-dialog').count(),1);
 assert.equal(await page.locator('dialog#calculator-dialog').count(),0);
 assert.equal(requests.filter(p=>p.startsWith('/fragments/questions/')).length,0);
 const home=await page.evaluate(()=>({ready:performanceReady,nodes:document.querySelectorAll('*').length}));assert.ok(home.nodes<12000);
 async function route(id){await page.evaluate(id=>location.hash=id,id);await page.locator('#'+id+'[data-feedback-bound]').waitFor({state:'visible'});assert.equal(await page.locator('.question').count(),1);}
 await route('kap-1');const q=page.locator('#kap-1');await q.locator('.option[data-option="1"]').click();await q.locator('.practice-mark').click();
 await q.locator('.cafa-check-controls button').first().click();await q.locator('.cafa-inline-feedback:not([hidden])').first().waitFor();
 const answer=await page.evaluate(()=>CafaPractice.getAnswer('kap',1));assert.equal(answer.choice,1);assert.equal(answer.marked,true);assert.ok(answer.firstMC);
 await route('kap-2');await route('kap-1');assert.equal(await q.locator('.answer-radio:checked').getAttribute('value'),'1');assert.equal(await q.locator('.practice-mark').getAttribute('aria-pressed'),'true');await q.locator('.cafa-inline-feedback:not([hidden])').first().waitFor();
 await q.locator('label[for="own-kap-1"]').click();const editor=q.locator('.cae-content[contenteditable="true"]');await editor.fill('Controleberekening 25 + 75 = 100');await route('kap-2');await route('kap-1');assert.equal(await editor.innerText(),'Controleberekening 25 + 75 = 100');
 await page.reload();await page.waitForFunction(()=>window.performanceReady!==null);assert.equal(await editor.innerText(),'Controleberekening 25 + 75 = 100');
 await page.evaluate(()=>location.hash='oefenen');await page.locator('#oefenen').waitFor({state:'visible'});assert.equal(await page.locator('.question').count(),0);
 const sample=await page.evaluate(()=>Object.entries(CAFA2_DATA.modules).flatMap(([c,b])=>b.questions.filter(q=>q.sourceType==='exam').slice(0,1).map(q=>c+'-'+q.id)));
 for(const id of sample){await route(id);assert.ok(await page.locator('#'+id+' .exam-case-panel').count());await page.locator('#'+id+' [data-original-pdf]').first().waitFor({state:'attached'});assert.equal(await page.locator('#'+id+' [data-original-pdf]').count(),2);}
 // A stale fetch must never overwrite the newest navigation.
 await page.route('**/fragments/questions/kap-3.html',async request=>{await new Promise(r=>setTimeout(r,180));await request.continue();});
 await page.evaluate(()=>location.hash='kap-3');await page.waitForTimeout(25);await route('kap-4');await page.waitForTimeout(220);assert.equal(await page.locator('.question').getAttribute('id'),'kap-4');
 await page.evaluate(()=>location.hash='kap-5');await page.waitForTimeout(10);await page.evaluate(()=>location.hash='start');await page.waitForTimeout(100);assert.equal(await page.locator('.question').count(),0);
 await page.setViewportSize({width:390,height:844});await route('nvw-1');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.route('**/fragments/questions/kap-6.html',request=>request.fulfill({status:503,body:'tijdelijk niet beschikbaar'}));
 await page.evaluate(()=>location.hash='kap-6');await page.locator('#practice-loading button').waitFor();assert.equal(await page.locator('.question').count(),0);
 await page.unroute('**/fragments/questions/kap-6.html');await page.locator('#practice-loading button').click();await page.locator('#kap-6[data-feedback-bound]').waitFor({state:'visible'});
 await route('kap-7');await page.goBack();await page.locator('#kap-6[data-feedback-bound]').waitFor({state:'visible'});assert.equal(await page.locator('.question').count(),1);
 assert.deepEqual(errors,[]);
 const printPage=await browser.newPage();await printPage.addInitScript(()=>localStorage.setItem('skipgc','t'));
 await printPage.route('**/*',request=>request.request().url().startsWith(base)?request.continue():request.abort());
 await printPage.goto(base+'/?afdrukken=alles');await printPage.waitForFunction(()=>window.CafaFeedback&&!document.documentElement.classList.contains('cafa-starting'),{},{timeout:60000});assert.equal(await printPage.locator('.question').count(),627);await printPage.close();
 console.log(JSON.stringify({engine,home,sourceQuestions:627,connectedQuestions:1,preserved:['choice','firstScore','mark','richAnswer','revealedFeedback','reload','backNavigation','fullPrint'],examCases:sample.length,races:true,loadRetry:true,mobile:true}));
}finally{await browser?.close();server.close();}
