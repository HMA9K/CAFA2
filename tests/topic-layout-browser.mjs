import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const require=createRequire(import.meta.url);
const {chromium}=require(process.env.CAFA_PLAYWRIGHT_PATH||'playwright');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const server=http.createServer((req,res)=>{
  const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
  res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json'})[path.extname(file)]||'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+server.address().port;
let browser;
try{
  browser=await chromium.launch({headless:true,...(process.env.CAFA_CHROMIUM_PATH?{executablePath:process.env.CAFA_CHROMIUM_PATH}:{})});
  const page=await browser.newPage({viewport:{width:1366,height:950}}),errors=[];
  page.on('pageerror',error=>errors.push(String(error)));
  await page.route('**/*',route=>route.request().url().startsWith(base)?route.continue():route.abort());
  await page.goto(base+'/index.html#oefenen');
  await page.waitForFunction(()=>window.CafaFeedback&&window.CafaExams);
  const groups=JSON.parse(fs.readFileSync(path.join(root,'content/practice/topic-groups.json'),'utf8'));
  assert.deepEqual(await page.locator('#practice-topic-cards .topic-group').evaluateAll(elements=>elements.map(element=>element.dataset.topicGroup)),groups.map(group=>group.id));
  assert.deepEqual(await page.locator('#practice-topic-cards .topic-detail-card').evaluateAll(elements=>elements.map(element=>element.dataset.topic)),groups.flatMap(group=>group.topics));
  assert.deepEqual(await page.locator('#practice-topic-cards .topic-n').allTextContents(),Array.from({length:19},(_,i)=>String(i+1)));
  const geometry=()=>page.evaluate(()=>({scrollY,scrollHeight:document.documentElement.scrollHeight,cards:Array.from(document.querySelectorAll('#practice-topic-cards .topic-detail-card'),element=>{const r=element.getBoundingClientRect();return[r.x,r.y,r.width,r.height];})}));
  const settle=()=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  const buttons=page.locator('#practice-topic-cards .topic-exam-toggle');
  let toggles=0;
  for(const width of [1366,870,390]){
    await page.setViewportSize({width,height:950});
    for(const fontSize of [14,24]){
      await page.evaluate(size=>document.documentElement.style.setProperty('--base',size+'px'),fontSize);
      await settle();
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,`No horizontal overflow at ${width}px / ${fontSize}px text`);
      // A long list near the top, a middle row, and the bottom reproduce both
      // equal-height grid growth and viewport scroll anchoring regressions.
      const indices=await buttons.evaluateAll(elements=>{let longest=0;elements.forEach((element,index)=>{if(+element.textContent.split(' ')[0]>+elements[longest].textContent.split(' ')[0])longest=index;});return[longest,9,elements.length-1];});
      for(const index of indices){
        const button=buttons.nth(index),codes=page.locator('#'+await button.getAttribute('aria-controls'));
        await button.evaluate(element=>element.scrollIntoView({block:'center'}));
        await settle();
        const before=await geometry();
        assert.equal(await codes.evaluate(element=>getComputedStyle(element).visibility),'hidden');
        await button.click();await settle();
        assert.equal(await button.getAttribute('aria-expanded'),'true');
        assert.equal(await codes.evaluate(element=>getComputedStyle(element).visibility),'visible');
        assert.deepEqual(await geometry(),before,`Opening frequency keeps cards and scroll still at ${width}px / ${fontSize}px text`);
        assert.equal(await codes.evaluate(element=>element.scrollHeight<=element.clientHeight+1),true,'All exam codes fit without clipping');
        await button.press('Space');await settle();
        assert.equal(await button.getAttribute('aria-expanded'),'false');
        assert.deepEqual(await geometry(),before,'Closing with the keyboard keeps the page still');
        await button.press('Enter');await settle();
        assert.equal(await button.getAttribute('aria-expanded'),'true');
        assert.deepEqual(await geometry(),before,'Opening with the keyboard keeps the page still');
        await button.click();await settle();
        assert.deepEqual(await geometry(),before,'Closing frequency keeps the page still');
        toggles+=4;
      }
    }
  }
  assert.deepEqual(errors,[]);
  console.log(`Topic layout passed: syllabus groups, 19 numbered cards, ${toggles} stable pointer/keyboard toggles, desktop/tablet/mobile, 14px/24px text, no clipping or horizontal overflow.`);
}finally{
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
