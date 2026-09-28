// Controleer dezelfde bediening in een afzonderlijke CAFA2- of SRA-browsercontext.
const assert=require('node:assert/strict'),fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const root=path.resolve(process.env.CONTROL_REPO||path.join(__dirname,'..'));
const out=path.resolve(process.env.QA_OUTPUT||path.join(root,'tmp/answer-controls'));fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{
  const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=path.resolve(root,'.'+(name==='/'?'/index.html':name));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
  res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'application/javascript','.mjs':'application/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png'})[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
});
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port;
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});const reports=[];
  try{for(const width of [1366,390]){
    const page=await browser.newPage({viewport:{width,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.addInitScript(()=>sessionStorage.setItem('cafa2-assistant-launch-hidden','true'));
    await page.route('**/*',r=>r.request().url().startsWith(base+'/')?r.continue():r.abort());
    await page.goto(base+'/'+encodeURI(process.env.CONTROL_ENTRY||'index.html'));await page.waitForFunction(()=>!!(window.CafaExams||window.SRACirrus));
    const sra=await page.evaluate(()=>!!window.SRACirrus),course=sra?'sra':'cafa2';
    const missing=await page.evaluate(sra=>{
      if(sra){const ids=new Set(SRA.lessons.map(l=>l.id));return SRA_CIRRUS_EXAMS.flatMap(e=>e.questions.filter(q=>!ids.has(SRAExamStudy.lesson(e,q))).map(q=>e.id+'/'+q.id));}
      return CAFA2_EXAMS.flatMap(e=>e.questions.filter(q=>!CafaStudy.examLink(e.id,q.id)).map(q=>e.id+'/'+q.id));
    },sra);assert.deepEqual(missing,[],'Alle tentamenvragen verwijzen naar een beschikbaar onderwerp');
    const kinds=await page.evaluate(()=>{const qs=(window.SRA_CIRRUS_EXAMS||window.CAFA2_EXAMS).flatMap(e=>e.questions);return ['text',...(window.CafaJournalTable&&qs.some(q=>CafaJournalTable.supports(q))?['journal']:[]),...(window.CafaStockTable&&qs.some(q=>CafaStockTable.template(q))?['stock']:[]),...(qs.some(q=>q.type==='mc')?['mc']:[])];});
    for(const kind of kinds){
      await page.evaluate(({kind,sra})=>{
        const app=sra?SRACirrus:CafaExams,catalog=sra?SRA_CIRRUS_EXAMS:CAFA2_EXAMS;
        const match=q=>kind==='mc'?q.type==='mc':q.type==='open'&&(kind==='journal'?CafaJournalTable.supports(q):kind==='stock'?CafaStockTable.template(q):!(window.CafaJournalTable&&CafaJournalTable.supports(q))&&!(window.CafaStockTable&&CafaStockTable.template(q)));
        const exam=catalog.find(e=>e.questions.some(match)),attempt=CafaExamEngine.createAttempt(exam,{id:'qa-controls-'+kind,untimed:true});attempt.currentIndex=exam.questions.findIndex(match);
        const value=JSON.stringify({version:1,attempts:[attempt]});localStorage.setItem(app.storageKey,value);dispatchEvent(new StorageEvent('storage',{key:app.storageKey,newValue:value}));location.hash=(sra?'toets/':'tentamen/')+attempt.id;
      },{kind,sra});
      const answer=page.locator('[data-exam-answer]'),actions=page.locator('.exam-answer-actions'),button=actions.locator('[data-exam-action="check"]'),feedback=page.locator(sra?'[data-exam-feedback]':'#cafa-exam-feedback');
      await button.waitFor();
      if(kind==='mc')await answer.locator('input[type="radio"]').first().check();
      if(kind==='text'){
        await answer.locator('.has-tinymce').waitFor();
        await answer.frameLocator('iframe').locator('body').fill('Berekening 125000');
        await page.waitForFunction(sra=>Object.values((sra?SRACirrus:CafaExams).getAttempts()[0].answers).some(a=>/125\.?000/.test(a.html||'')),sra);
      }
      if(kind==='journal'||kind==='stock'){const field=answer.locator('input:not([type="checkbox"]):not([type="radio"])').first();await field.fill('125000');await field.dispatchEvent('change');}
      const snapshot=()=>page.evaluate(sra=>JSON.stringify((sra?SRACirrus:CafaExams).getAttempts()[0].answers),sra);
      const saved=await snapshot();
      const details=answer.locator('.stock-notes').first();
      if(await details.count()){
        await details.evaluate(e=>e.open=false);const summary=details.locator('summary');await summary.scrollIntoViewIfNeeded();
        const r=await details.boundingBox(),s=await summary.boundingBox();assert.ok(s.width<r.width-10);
        await page.mouse.click(s.x+s.width+10,s.y+s.height/2);assert.equal(await details.evaluate(e=>e.open),false,'Witte ruimte mag de toelichting niet openen');
        await summary.focus();await summary.press('Enter');assert.equal(await details.evaluate(e=>e.open),true);await summary.press('Enter');assert.equal(await details.evaluate(e=>e.open),false);
      }
      await button.click();await feedback.waitFor({state:'visible'});assert.equal(await snapshot(),saved);
      assert.equal(await actions.evaluate(e=>e.nextElementSibling.matches('#cafa-exam-feedback,[data-exam-feedback]')),true);
      if(!sra)await actions.locator('.study-inline-launch').waitFor();
      const help=actions.locator('a.study-exam-link');await help.waitFor();
      assert.equal(await help.evaluate(e=>e.previousElementSibling?.matches('[data-exam-action="pause"]')),true,'Uitleg staat direct na Pauzeren');
      if(!sra)assert.equal(await help.evaluate(e=>e.nextElementSibling?.matches('.study-inline-launch')),true,'Assistent volgt op de uitlegknop');
      if(!sra&&kind==='journal'){
        assert.ok(await feedback.locator('table').count(),'Journaalpost heeft echte tabelcellen');
        assert.match(await feedback.innerText(),/Debet.*Credit/s);assert.match(await feedback.innerText(),/7\.680/);
        assert.match(await feedback.innerText(),/½ punt voor de rekening/);
      }
      const count=await actions.locator('button,a').count();
      for(const theme of ['light','dark']){
        await page.evaluate(theme=>window.CafaTheme?CafaTheme.setMode(theme):window.SRATheme?SRATheme.setMode(theme):document.documentElement.dataset.studyTheme=theme,theme);
        await actions.scrollIntoViewIfNeeded();
        const a=await actions.boundingBox(),f=await feedback.boundingBox();assert.ok(a.y+a.height<=f.y+1);assert.equal(await actions.locator('button,a').count(),count);
        const fonts=await actions.locator('button').evaluateAll(xs=>xs.map(x=>getComputedStyle(x).fontFamily));assert.ok(fonts.every(font=>font.includes('Arial')));
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
        if(kind==='journal'||(sra&&kind==='text')){
          await actions.evaluate(e=>{for(let pane=e.parentElement;pane;pane=pane.parentElement){if(pane.scrollHeight>pane.clientHeight&&/auto|scroll/.test(getComputedStyle(pane).overflowY)){pane.scrollTop+=e.getBoundingClientRect().top-pane.getBoundingClientRect().top-110;return;}}e.scrollIntoView({block:'center'});});
          const row=await actions.boundingBox(),body=await page.locator('.exam-question-body').boundingBox();
          const x=Math.max(0,body.x),y=Math.max(0,row.y-85);
          await page.screenshot({path:path.join(out,course+'-'+width+'-'+theme+'.png'),clip:{x,y,width:Math.min(width-x,body.width),height:Math.min(550,900-y)}});
        }
        reports.push({course,width,kind,theme,fonts,actionsBeforeModel:true,notes:await details.count()});
      }
      const route=await page.evaluate(()=>location.hash);
      await help.click();
      const back=page.locator(sra?'[data-exam-study-return] a':'[data-study-origin]');await back.waitFor({state:'visible'});
      if(sra){assert.match(await page.evaluate(()=>location.hash),/^#les\//);await page.reload();await back.waitFor({state:'visible'});await page.screenshot({path:path.join(out,'sra-return-'+width+'.png'),fullPage:false});}
      await back.click();await button.waitFor();await feedback.waitFor({state:'visible'});
      assert.equal(await page.evaluate(()=>location.hash),route);assert.equal(await snapshot(),saved,'Terug naar de vraag behoudt invoer en antwoordmodel');
      if(!sra){await button.click();assert.equal(await feedback.isVisible(),false);await button.click();await feedback.waitFor({state:'visible'});assert.equal(await snapshot(),saved);}
      await page.locator('[data-exam-action="next"]').click();await page.waitForTimeout(80);assert.equal(await feedback.isVisible(),false);
    }
    assert.deepEqual(errors,[]);await page.close();
  }}finally{await browser.close();server.close();}
  fs.writeFileSync(path.join(out,'controls-'+(reports[0]?.course||'unknown')+'.json'),JSON.stringify({status:'geslaagd',reports},null,2));console.log(JSON.stringify({status:'geslaagd',checks:reports.length,reports}));
})().catch(e=>{server.close();console.error(e);process.exit(1);});
