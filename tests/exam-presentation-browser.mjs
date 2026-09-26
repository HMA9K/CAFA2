import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {createRequire} from 'node:module';
import {root} from '../scripts/exam-practice-source.mjs';
const {chromium}=createRequire(import.meta.url)(process.env.CAFA_PLAYWRIGHT_PATH||'playwright');
const server=http.createServer((req,res)=>{
 const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
 res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'application/javascript','.mjs':'application/javascript','.css':'text/css'})[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base=process.env.CAFA_LIVE_URL||'http://127.0.0.1:'+server.address().port,out=path.join(root,'docs/mc-audit/qa-financial-presentation');fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.CAFA_CHROMIUM_PATH?{executablePath:process.env.CAFA_CHROMIUM_PATH}:{})});
try{
 const page=await browser.newPage({viewport:{width:1672,height:1148}}),errors=[];page.on('pageerror',e=>errors.push(String(e)));page.setDefaultTimeout(30000);
 await page.goto(base+'/index.html#oefenen');await page.waitForFunction(()=>window.CafaFeedback&&window.CafaPracticeCase);
 await page.locator('[data-practice-source]').selectOption('exam');
 await page.evaluate(()=>location.hash='onderwerp-waardering');await page.waitForFunction(()=>document.querySelector('.question:target .practice-case-layout'));
 const ids=await page.evaluate(()=>Object.values(CAFA2_DATA.modules).flatMap(m=>m.questions).filter(q=>q.sourceKey==='cafa2-20210419/vraag-2'||q.sourceKey==='cafa2-20230411/vraag-7'||q.sourceKey==='cafa2-20211006/vraag-19').map(q=>({key:q.sourceKey,uid:q.code+'-'+q.id})));
 const toren=ids.find(x=>x.key.endsWith('20210419/vraag-2')).uid;
 await page.evaluate(id=>location.hash=id,toren);let q=page.locator('.question:target');
 assert.equal(await q.locator('.mc-area .option table').count(),4);
 for(const option of await q.locator('.mc-area .option').all()){
  assert.deepEqual(await option.locator('thead th').allTextContents(),['Omschrijving','100% (€)','35% (€)']);
  assert.equal(await option.locator('tbody tr').count(),8);
  assert.ok((await option.locator('tbody tr').first().locator('td').allTextContents())[0].includes('2020'));
  assert.equal(await option.locator('tbody td').filter({hasText:/^2020$/}).count(),0);
 }
 await page.screenshot({path:path.join(out,'toren-desktop.png'),fullPage:true});
 await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.screenshot({path:path.join(out,'toren-mobile.png'),fullPage:true});
 const torenScroll=q.locator('.mc-area .option .table-wrap').first();await torenScroll.evaluate(e=>{e.scrollLeft=e.scrollWidth;});
 assert.ok(await torenScroll.evaluate(e=>e.scrollLeft>0&&e.querySelector('th:last-child').getBoundingClientRect().right<=e.getBoundingClientRect().right+1),'De 35%-kolom is op mobiel bereikbaar door de tabel te verschuiven');
 await torenScroll.scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,'toren-mobile-35procent.png')});
 await page.setViewportSize({width:1672,height:1148});await page.evaluate(()=>location.hash='onderwerp-eigen-aandelen');
 const moneglia=ids.find(x=>x.key.endsWith('20230411/vraag-7')).uid;await page.evaluate(id=>location.hash=id,moneglia);q=page.locator('.question:target');
 const panel=q.locator('.exam-case-panel');await panel.waitFor();
 assert.equal(await panel.locator('table').count(),3);assert.equal(await panel.locator('p').filter({hasText:/^\d+%$/}).count(),0);
 const text=await panel.locator('.exam-source-case').textContent();assert.equal((text.match(/€ 1\.950\.000/g)||[]).length,1);assert.equal((text.match(/€ 760\.000/g)||[]).length,1);
 assert.ok(text.includes('3 van de 5 bestuurders')&&text.includes('volledig aansprakelijk'));
 assert.ok((await panel.locator('h3').first().textContent()).startsWith('OPGAVE'));
 await page.screenshot({path:path.join(out,'moneglia-desktop.png'),fullPage:true});
 await panel.evaluate(e=>{e.scrollTop=e.scrollHeight;});await page.screenshot({path:path.join(out,'moneglia-rapallo-desktop.png'),fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>CafaTheme.setMode('dark'));assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.screenshot({path:path.join(out,'moneglia-mobile-dark.png'),fullPage:true});
 const journalScroll=q.locator('.mc-area .option .table-wrap').first();await journalScroll.evaluate(e=>{e.scrollLeft=e.scrollWidth;});
 assert.ok(await journalScroll.evaluate(e=>e.querySelector('th:last-child').getBoundingClientRect().right<=e.getBoundingClientRect().right+1),'De creditkolom blijft op mobiel bereikbaar');
 await journalScroll.scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,'moneglia-mobile-credit.png')});
 await page.setViewportSize({width:1672,height:1148});await page.evaluate(id=>location.hash=id,ids.find(x=>x.key.endsWith('20211006/vraag-19')).uid);q=page.locator('.question:target');
 assert.ok((await q.locator('.mc-area .option table').first().locator('thead').textContent()).includes('GBP'));assert.ok(!(await q.locator('.mc-area').textContent()).includes('Interne correctie'));
 await page.evaluate(()=>location.hash='welkom/cafa2-20230411');await page.locator('[data-exam-untimed]').check();await page.locator('[data-exam-action="start"]').click();await page.locator('#exam-case-panel').waitFor();
 assert.equal(await page.locator('#exam-case-panel table').count(),3,'De tentamenomgeving gebruikt dezelfde opgeschoonde casus');assert.equal(await page.locator('#exam-case-panel p').filter({hasText:/^\d+%$/}).count(),0);
 assert.equal(errors.length,0,errors.join('\n'));
 console.log('Visuele presentatiecontrole geslaagd: Toren in echte 100%/35%-kolommen, Moneglia zonder dubbele bronblokken, GBP-kolommen en dezelfde casus in MC/tentamen; desktop, mobiel en donker.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
