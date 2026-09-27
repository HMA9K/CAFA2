const assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const sra=process.env.COURSE==='sra',base=process.env.EDITOR_URL||`http://127.0.0.1:8870/${sra?'sra':'cafa2'}/`;
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
 try{for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')console.log(m.text());});await page.goto(base+'index.html#'+(sra?'tentamen':'dashboard'));
  await page.waitForFunction(()=>window.CafaExams||window.SRACirrus);
  await page.evaluate(sra=>{
   const app=sra?SRACirrus:CafaExams,exam=(sra?SRA_CIRRUS_EXAMS:CAFA2_EXAMS).find(e=>e.id===(sra?'20241028':'cafa2-20240422'));
   const attempt=CafaExamEngine.createAttempt(exam,{id:'qa-tinymce',untimed:true});attempt.currentIndex=sra?0:2;
   const value=JSON.stringify({version:1,attempts:[attempt]});localStorage.setItem(app.storageKey,value);dispatchEvent(new StorageEvent('storage',{key:app.storageKey,newValue:value}));location.hash=(sra?'toets/':'tentamen/')+attempt.id;
  },sra);
  await page.waitForFunction(()=>window.tinymce?.activeEditor?.initialized && tinymce.activeEditor.getBody()?.isContentEditable && tinymce.activeEditor.getBody().dataset.editorTheme);
  const native=page.locator('#exam-app .tox-tinymce').first();assert.equal(await native.locator('.tox-menubar').count(),0);assert.equal(await native.locator('.tox-statusbar__path').count(),0);
  assert.equal(await page.locator('#exam-app .cae-toolbar').first().isVisible(),false);
  const body=page.frameLocator('#exam-app .tox-edit-area iframe').locator('body');
  await body.click();const formula='Afwaardering voorraad: 5.000 * 25 * 0.93 ';
  await page.keyboard.type(formula);await page.keyboard.press('Enter');
  assert.ok((await body.innerText()).includes(formula.trim()));assert.equal(await body.locator('em,i').count(),0);
  await page.evaluate(()=>{const e=tinymce.activeEditor;e.selection.select(e.getBody().firstChild,true);e.execCommand('Italic');});
  assert.ok(await body.locator('em,i').count());
  await body.fill('Bestaand antwoord met opmaak');
  await page.evaluate(()=>{const e=tinymce.activeEditor;e.selection.select(e.getBody().firstChild);e.execCommand('Bold');});
  assert.ok(await body.locator('strong').count());
  await page.evaluate(()=>{const e=tinymce.activeEditor;e.selection.select(e.getBody(),true);e.selection.collapse(false);e.execCommand('mceInsertTable',false,{rows:2,columns:2});});
  await body.locator('td').first().click();await page.evaluate(()=>tinymce.activeEditor.execCommand('mceTableInsertColAfter'));
  assert.equal(await body.locator('tr').first().locator('td').count(),3);
  await body.locator('td').first().fill('Voorraad 456');
  await native.locator('.tox-statusbar__resize-handle').hover();const before=await native.boundingBox(),grip=await native.locator('.tox-statusbar__resize-handle').boundingBox();
  await page.mouse.move(grip.x+grip.width/2,grip.y+grip.height/2);await page.mouse.down();await page.mouse.move(grip.x+grip.width/2-60,grip.y+grip.height/2+70,{steps:12});await page.mouse.up();
  const count=await native.locator('.cae-count').boundingBox(),box=await native.boundingBox();assert.ok(count.x>=box.x && count.x+count.width<=box.x+box.width+1);assert.ok(count.y>=box.y && count.y+count.height<=box.y+box.height+1);
  assert.ok((await native.locator('.cae-count').innerText()).includes('Woorden:'));
  const after=await native.boundingBox();assert.ok(after.height>before.height+30);if(width===1440)assert.ok(after.width<before.width-30);
  assert.ok((await body.innerText()).includes('Voorraad 456'));
  if(width===1440){
   await native.evaluate(e=>e.parentElement.parentElement.style.width='50%');
   await page.waitForFunction(()=>tinymce.activeEditor.options.get('max_width')<600);
   await native.evaluate(e=>e.parentElement.parentElement.style.width='100%');
   await page.waitForFunction(()=>tinymce.activeEditor.options.get('max_width')>600);
   await native.locator('.tox-statusbar__resize-handle').hover();const r=await native.locator('.tox-statusbar__resize-handle').boundingBox(),left=(await native.boundingBox()).x;
   await page.mouse.move(r.x+r.width/2,r.y+r.height/2);await page.mouse.down();await page.mouse.move(r.x+1500,r.y+r.height/2,{steps:15});await page.mouse.up();
   const full=await native.boundingBox(),space=await native.evaluate(e=>e.parentElement.parentElement.getBoundingClientRect().width);
   assert.ok(Math.abs(full.width-space)<3);assert.ok(Math.abs(full.x-left)<1);
  }
  await page.evaluate(()=>tinymce.activeEditor.execCommand('mceFullScreen'));assert.ok((await native.boundingBox()).width>=width-2);
  await page.evaluate(()=>tinymce.activeEditor.execCommand('mceFullScreen'));
  await page.evaluate(()=>document.documentElement.setAttribute('data-study-theme','dark'));await page.waitForFunction(()=>tinymce.activeEditor.getBody().dataset.editorTheme==='dark');
  assert.equal(await body.evaluate(b=>getComputedStyle(b).backgroundColor),'rgb(21, 33, 41)');
  assert.equal(await native.locator('.tox-toolbar__primary').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(38, 53, 64)');
  assert.ok((await body.innerText()).includes('Voorraad 456'));
  await page.evaluate(()=>document.documentElement.setAttribute('data-study-theme','light'));await page.waitForFunction(()=>tinymce.activeEditor.getBody().dataset.editorTheme==='light');
  await page.locator('[data-exam-action="next"]').first().click();await page.locator('[data-exam-action="previous"]').first().click();
  await page.waitForFunction(()=>window.tinymce?.activeEditor?.initialized && tinymce.activeEditor.getBody()?.isContentEditable && tinymce.activeEditor.getBody().dataset.editorTheme);await page.waitForFunction(()=>tinymce.activeEditor.getBody().innerText.includes('Voorraad 456'));assert.ok((await body.innerText()).includes('Voorraad 456'));assert.equal(await body.locator('tr').first().locator('td').count(),3);
  await page.reload();await page.waitForFunction(()=>window.tinymce?.activeEditor?.initialized && tinymce.activeEditor.getBody()?.isContentEditable && tinymce.activeEditor.getBody().dataset.editorTheme);await page.waitForFunction(()=>tinymce.activeEditor.getBody().innerText.includes('Voorraad 456'));assert.ok((await body.innerText()).includes('Voorraad 456'));assert.equal(await body.locator('tr').first().locator('td').count(),3);
  assert.ok(await body.locator('strong').count());assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  if(!sra){
   await page.locator('[data-exam-action="check"]').click();
   const model=page.locator('#cafa-exam-feedback');await model.waitFor({state:'visible'});
   await page.waitForFunction(()=>window.tinymce?.activeEditor?.initialized && tinymce.activeEditor.getBody()?.isContentEditable && tinymce.activeEditor.getBody().dataset.editorTheme);
   await body.fill('Voorraad 456 verder oefenen');assert.ok(await model.isVisible());
   await page.goto(base+'index.html#kap-1');await page.locator('label[for="own-kap-1"]').click();
   await page.waitForFunction(()=>window.tinymce?.activeEditor?.initialized && tinymce.activeEditor.getBody()?.isContentEditable && tinymce.activeEditor.getBody().dataset.editorTheme);
   const own=page.frameLocator('#kap-1 .tox-edit-area iframe').locator('body');await own.fill('Eigen oefenantwoord 125.000');
   await page.waitForFunction(()=>CafaPractice.getAnswer('kap',1).text.includes('125.000'));
   await page.reload();await page.waitForFunction(()=>window.tinymce?.activeEditor?.initialized && tinymce.activeEditor.getBody()?.isContentEditable && tinymce.activeEditor.getBody().dataset.editorTheme);assert.ok((await own.innerText()).includes('125.000'));
  }
  await page.evaluate(sra=>{
   const app=sra?SRACirrus:CafaExams,attempts=app.getAttempts(),exam=attempts[0].exam;
   const a=CafaExamEngine.createAttempt(exam,{id:'qa-tinymce-new',untimed:true});a.currentIndex=sra?0:2;
   const value=JSON.stringify({version:1,attempts:attempts.concat(a)});localStorage.setItem(app.storageKey,value);dispatchEvent(new StorageEvent('storage',{key:app.storageKey,newValue:value}));location.hash=(sra?'toets/':'tentamen/')+a.id;
  },sra);
  await page.waitForFunction(()=>window.tinymce?.activeEditor?.initialized && tinymce.activeEditor.getBody()?.isContentEditable && tinymce.activeEditor.getBody().dataset.editorTheme);
  const initial=await native.boundingBox(),available=await native.evaluate(e=>e.parentElement.parentElement.getBoundingClientRect().width);assert.ok(Math.abs(initial.width-available)<3);
  assert.deepEqual(errors,[]);
  if(process.env.QA_OUTPUT){fs.mkdirSync(process.env.QA_OUTPUT,{recursive:true});await page.screenshot({path:process.env.QA_OUTPUT+`/tinymce-${sra?'sra':'cafa2'}-${width}.png`});}
  console.log(sra?'SRA':'CAFA2',width,'menubalk afwezig, opmaak, tabelkolom, resize, thema, vraagwissel en herladen geslaagd');await context.close();
 }}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
