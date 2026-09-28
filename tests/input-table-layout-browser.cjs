const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const sra=process.env.COURSE==='sra';
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
 try{
  const page=await browser.newPage({viewport:{width:1200,height:850}});
  const script=fs.readFileSync(path.resolve('js/input-table-layout.js'),'utf8'),css=fs.readFileSync(path.resolve('css/input-table-layout.css'),'utf8'),examCss=fs.readFileSync(path.resolve(sra?'css/cirrus.css':'css/exam-experience.css'),'utf8');
  const html=`<!doctype html><html><style>${examCss}body{margin:20px}.journal-scroll{width:850px;max-width:100%;overflow:auto}table{width:100%;border-collapse:collapse}td,th{border:1px solid #777}input{width:100%;box-sizing:border-box}.cae-content{max-width:850px;overflow:auto}${css}</style><body class="${sra?'cirrus-mode':''}">
   <section class="question" id="example"><div class="journal-scroll"><table class="journal-table"><thead><tr><th>Rekening</th><th>Debet</th><th>Credit</th></tr></thead><tbody><tr><td><input value="Voorraad"></td><td><input value="123"></td><td><input></td></tr></tbody></table></div></section>
   <div class="cafa-answer-editor"><div class="cae-content" contenteditable="true"><table><tbody><tr><td>Omschrijving</td><td>Bedrag</td></tr><tr><td>Voorraad</td><td>456</td></tr></tbody></table></div></div>
   <table id="source"><tr><td>Brontekst</td><td>789</td></tr></table><script>${script}</script></body></html>`;
  await page.route('http://table.test/**',route=>route.fulfill({contentType:'text/html',body:html}));await page.goto('http://table.test/#example');
  await page.locator('.input-table-handles').first().waitFor();assert.equal(await page.locator('.input-table-handles').count(),2);
  assert.equal(await page.locator('.input-table-settings').count(),0);assert.equal(await page.locator('#source').getAttribute('class'),null);
  async function drag(locator,dx,dy){const r=await locator.boundingBox();await page.mouse.move(r.x+r.width/2,r.y+Math.min(r.height/2,15));await page.mouse.down();await page.mouse.move(r.x+r.width/2+dx,r.y+Math.min(r.height/2,15)+dy,{steps:12});await page.mouse.up();}
  const table=page.locator('.journal-scroll table'),first=page.locator('.input-table-handles').first();
  const defaultHeight=await table.evaluate(t=>t.style.getPropertyValue('--input-table-row-height')),originalRowHeight=(await table.locator('tbody tr').first().boundingBox()).height;
  const font=await table.locator('input').first().evaluate(e=>getComputedStyle(e).fontSize);
  await drag(first.locator('.input-table-corner-grip'),0,-60);
  assert.ok((await table.locator('tbody tr').first().boundingBox()).height<originalRowHeight-15,'Real journal padding shrinks with upward dragging');
  assert.equal(await table.locator('input').first().evaluate(e=>getComputedStyle(e).fontSize),font,'Compacting retains font size');
  await first.locator('.input-table-corner-grip').dblclick();
  const before=await table.locator('th').first().boundingBox();await drag(first.locator('.input-table-column-grip').first(),90,0);
  assert.ok((await table.locator('th').first().boundingBox()).width>before.width+80);
  const firstWidth=(await table.locator('th').first().boundingBox()).width,lastWidth=(await table.locator('th').last().boundingBox()).width,totalWidth=(await table.boundingBox()).width;
  await drag(first.locator('.input-table-last-grip'),70,0);
  assert.ok((await table.locator('th').last().boundingBox()).width>lastWidth+60);
  assert.ok((await table.boundingBox()).width>totalWidth+60);
  assert.ok(Math.abs((await table.locator('th').first().boundingBox()).width-firstWidth)<2);
  const widths=await table.locator('th').evaluateAll(cells=>cells.map(c=>c.style.width));
  await page.locator('.journal-scroll').evaluate(e=>e.scrollLeft=e.scrollWidth);await page.waitForTimeout(100);
  const rect=await table.boundingBox();await drag(first.locator('.input-table-corner-grip'),-140,48);
  assert.ok((await table.boundingBox()).width<rect.width-120);assert.ok((await table.locator('tbody td').first().boundingBox()).height>70);
  assert.equal(await page.locator('.journal-scroll table input').nth(1).inputValue(),'123');
  const width=await table.evaluate(t=>t.style.width),height=await table.evaluate(t=>t.style.getPropertyValue('--input-table-row-height'));
  await page.reload();await page.locator('.input-table-handles').first().waitFor();
  assert.deepEqual(await table.locator('th').evaluateAll(cells=>cells.map(c=>c.style.width)),widths);assert.equal(await table.evaluate(t=>t.style.width),width);assert.equal(await table.evaluate(t=>t.style.getPropertyValue('--input-table-row-height')),height);
  await page.locator('.cae-content').evaluate(e=>e.innerHTML=e.innerHTML);await page.waitForTimeout(100);
  assert.equal(await page.locator('.input-table-handles').count(),2);assert.equal(await page.locator('.cae-content .input-table-handles').count(),0);assert.ok((await page.locator('.cae-content').innerText()).includes('456'));
  await page.locator('.cae-content table').evaluate(t=>Array.from(t.rows).forEach(row=>row.insertCell().textContent='Nieuw'));await page.waitForTimeout(100);assert.equal(await page.locator('.input-table-column-grip').count(),6);
  // Zoomed pages keep the hit area on the real column border.
  await page.evaluate(()=>document.documentElement.style.zoom='1.2');await page.setViewportSize({width:1300,height:900});await page.waitForTimeout(100);
  const edge=await table.locator('th').first().boundingBox(),grip=await first.locator('.input-table-column-grip').first().boundingBox();assert.ok(Math.abs(grip.x+grip.width/2-edge.x-edge.width)<2);
  await drag(first.locator('.input-table-column-grip').first(),40,0);assert.ok((await table.locator('th').first().boundingBox()).width>edge.width+30);
  await page.evaluate(()=>document.documentElement.style.zoom='1');await page.setViewportSize({width:390,height:850});
  await page.locator('.journal-scroll').evaluate(e=>e.scrollLeft=e.scrollWidth);await page.waitForTimeout(100);
  const corner=await first.locator('.input-table-corner-grip').boundingBox();assert.ok(corner.x+corner.width<=390);
  await first.locator('.input-table-corner-grip').dblclick();assert.equal(await table.evaluate(t=>t.style.width),'');assert.equal(await table.evaluate(t=>t.style.getPropertyValue('--input-table-row-height')),defaultHeight);
  await page.setViewportSize({width:1200,height:850});
  await page.evaluate(()=>{const wrap=document.createElement('div');wrap.className='stock-scroll';wrap.style.cssText='width:1100px;border:1px solid gray;overflow:auto';wrap.innerHTML='<table class="stock-matrix"><thead><tr>'+['Datum','Voorraad','Winst','Intern','Derden','Resultaat'].map(s=>'<th>'+s+'</th>').join('')+'</tr></thead><tbody><tr>'+Array(6).fill('<td><input></td>').join('')+'</tr></tbody></table>';document.body.prepend(wrap);});
  await page.waitForTimeout(150);
  const stock=page.locator('.stock-matrix'),cells=await stock.locator('th').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().width));
  assert.ok(Math.max(...cells)-Math.min(...cells)<2);assert.ok((await stock.boundingBox()).width<=812);
  assert.equal(await page.locator('.stock-scroll').evaluate(e=>getComputedStyle(e).borderTopWidth),'0px');
  assert.equal(await stock.evaluate(e=>getComputedStyle(e).borderRightWidth),'1px');
  if(!sra){
  await page.addScriptTag({content:fs.readFileSync(path.resolve('js/journal-table.js'),'utf8')});
  await page.evaluate(()=>{const host=document.querySelector('#example');host.innerHTML='';window.journalChanges=[];CafaJournalTable.mount(host,Array.from({length:8},(_,i)=>['Rekening '+(i+1),String((i+1)*100),'','']),rows=>journalChanges.push(rows));});
  const journal=page.locator('#example .journal-table');
  await journal.locator('[data-journal-row="1"][data-journal-col="1"]').focus();await page.locator('#example .journal-add').click();
  assert.deepEqual(await page.evaluate(()=>journalChanges.at(-1).map(r=>r[0])),['Rekening 1','Rekening 2','','Rekening 3','Rekening 4','Rekening 5','Rekening 6','Rekening 7','Rekening 8']);
  assert.equal(await page.evaluate(()=>document.activeElement.dataset.journalRow),'2');assert.equal(await page.evaluate(()=>document.activeElement.dataset.journalCol),'1');
  await page.locator('#source td').first().click();await page.locator('#example .journal-add').click();
  assert.equal(await journal.locator('tbody tr').count(),10);assert.equal(await page.evaluate(()=>journalChanges.at(-1)[9][0]),'');
  assert.equal(await page.evaluate(()=>document.activeElement.dataset.journalRow),'9');
  await journal.locator('[data-journal-row="9"][data-journal-col="3"]').focus();await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(()=>document.activeElement.className),'btn journal-add');await page.keyboard.press('Enter');assert.equal(await journal.locator('tbody tr').count(),11);
  assert.equal(await page.evaluate(()=>journalChanges.at(-1).filter(r=>r[0].startsWith('Rekening')).length),8,'Adding rows retains every original answer');
  }
  console.log('OK: muis aan kolomranden en tabelhoek, bewaren, behoud invoer, editor-herbouw, nieuwe kolommen, zoom en mobiel scrollen.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
