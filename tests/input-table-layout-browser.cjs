const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
 try{
  const page=await browser.newPage({viewport:{width:1200,height:850}});
  const script=fs.readFileSync(path.resolve('js/input-table-layout.js'),'utf8'),css=fs.readFileSync(path.resolve('css/input-table-layout.css'),'utf8');
  const html=`<!doctype html><html><style>body{margin:20px}.journal-scroll{width:850px;max-width:100%;overflow:auto}table{width:100%;border-collapse:collapse}td,th{border:1px solid #777}input{width:100%;box-sizing:border-box}.cae-content{max-width:850px;overflow:auto}${css}</style><body>
   <section class="question" id="example"><div class="journal-scroll"><table><thead><tr><th>Rekening</th><th>Debet</th><th>Credit</th></tr></thead><tbody><tr><td><input value="Voorraad"></td><td><input value="123"></td><td><input></td></tr></tbody></table></div></section>
   <div class="cafa-answer-editor"><div class="cae-content" contenteditable="true"><table><tbody><tr><td>Omschrijving</td><td>Bedrag</td></tr><tr><td>Voorraad</td><td>456</td></tr></tbody></table></div></div>
   <table id="source"><tr><td>Brontekst</td><td>789</td></tr></table><script>${script}</script></body></html>`;
  await page.route('http://table.test/**',route=>route.fulfill({contentType:'text/html',body:html}));await page.goto('http://table.test/#example');
  await page.locator('.input-table-handles').first().waitFor();assert.equal(await page.locator('.input-table-handles').count(),2);
  assert.equal(await page.locator('.input-table-settings').count(),0);assert.equal(await page.locator('#source').getAttribute('class'),null);
  async function drag(locator,dx,dy){const r=await locator.boundingBox();await page.mouse.move(r.x+r.width/2,r.y+Math.min(r.height/2,15));await page.mouse.down();await page.mouse.move(r.x+r.width/2+dx,r.y+Math.min(r.height/2,15)+dy,{steps:12});await page.mouse.up();}
  const table=page.locator('.journal-scroll table'),first=page.locator('.input-table-handles').first();
  const before=await table.locator('th').first().boundingBox();await drag(first.locator('.input-table-column-grip').first(),90,0);
  assert.ok((await table.locator('th').first().boundingBox()).width>before.width+80);
  const widths=await table.locator('th').evaluateAll(cells=>cells.map(c=>c.style.width));
  const rect=await table.boundingBox();await drag(first.locator('.input-table-corner-grip'),-140,48);
  assert.ok((await table.boundingBox()).width<rect.width-120);assert.ok((await table.locator('tbody td').first().boundingBox()).height>70);
  assert.equal(await page.locator('.journal-scroll table input').nth(1).inputValue(),'123');
  const width=await table.evaluate(t=>t.style.width),height=await table.evaluate(t=>t.style.getPropertyValue('--input-table-row-height'));
  await page.reload();await page.locator('.input-table-handles').first().waitFor();
  assert.deepEqual(await table.locator('th').evaluateAll(cells=>cells.map(c=>c.style.width)),widths);assert.equal(await table.evaluate(t=>t.style.width),width);assert.equal(await table.evaluate(t=>t.style.getPropertyValue('--input-table-row-height')),height);
  await page.locator('.cae-content').evaluate(e=>e.innerHTML=e.innerHTML);await page.waitForTimeout(100);
  assert.equal(await page.locator('.input-table-handles').count(),2);assert.equal(await page.locator('.cae-content .input-table-handles').count(),0);assert.ok((await page.locator('.cae-content').innerText()).includes('456'));
  await page.locator('.cae-content table').evaluate(t=>Array.from(t.rows).forEach(row=>row.insertCell().textContent='Nieuw'));await page.waitForTimeout(100);assert.equal(await page.locator('.input-table-column-grip').count(),4);
  // Zoomed pages keep the hit area on the real column border.
  await page.evaluate(()=>document.documentElement.style.zoom='1.2');await page.setViewportSize({width:1300,height:900});await page.waitForTimeout(100);
  const edge=await table.locator('th').first().boundingBox(),grip=await first.locator('.input-table-column-grip').first().boundingBox();assert.ok(Math.abs(grip.x+grip.width/2-edge.x-edge.width)<2);
  await drag(first.locator('.input-table-column-grip').first(),40,0);assert.ok((await table.locator('th').first().boundingBox()).width>edge.width+30);
  await page.evaluate(()=>document.documentElement.style.zoom='1');await page.setViewportSize({width:390,height:850});
  await page.locator('.journal-scroll').evaluate(e=>e.scrollLeft=e.scrollWidth);await page.waitForTimeout(100);
  const corner=await first.locator('.input-table-corner-grip').boundingBox();assert.ok(corner.x+corner.width<=390);
  await first.locator('.input-table-corner-grip').dblclick();assert.equal(await table.evaluate(t=>t.style.width),'');assert.equal(await table.evaluate(t=>t.style.getPropertyValue('--input-table-row-height')),'36px');
  console.log('OK: muis aan kolomranden en tabelhoek, bewaren, behoud invoer, editor-herbouw, nieuwe kolommen, zoom en mobiel scrollen.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
