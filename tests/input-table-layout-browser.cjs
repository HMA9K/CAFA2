const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
 try{
  const page=await browser.newPage({viewport:{width:1200,height:800}});
  const script=fs.readFileSync(path.resolve('js/input-table-layout.js'),'utf8');
  const css=fs.readFileSync(path.resolve('css/input-table-layout.css'),'utf8');
  const html=`<!doctype html><html><style>table{width:100%;border-collapse:collapse}td,th{border:1px solid #777}input{width:100%}${css}</style><body>
   <section class="question" id="example"><div class="journal-scroll"><table><thead><tr><th>Rekening</th><th>Debet</th><th>Credit</th></tr></thead><tbody><tr><td><input value="Voorraad"></td><td><input value="123"></td><td><input></td></tr></tbody></table></div></section>
   <div class="cafa-answer-editor"><div class="cae-content" contenteditable="true"><table><tbody><tr><td>Omschrijving</td><td>Bedrag</td></tr><tr><td>Voorraad</td><td>456</td></tr></tbody></table></div></div>
   <table id="source"><tr><td>Brontekst</td><td>789</td></tr></table><script>${script}</script></body></html>`;
  await page.route('http://table.test/**',route=>route.fulfill({contentType:'text/html',body:html}));
  await page.goto('http://table.test/#example');
  assert.equal(await page.locator('.input-table-settings').count(),2);
  assert.equal(await page.locator('#source').getAttribute('class'),null);
  const panel=page.locator('.journal-scroll .input-table-settings');await panel.locator('summary').click();
  await panel.locator('input').first().fill('50');await panel.locator('input').first().press('Tab');
  await panel.getByLabel('Rijhoogte (px)').fill('70');await panel.getByLabel('Rijhoogte (px)').press('Tab');
  assert.equal(await page.locator('.journal-scroll th').first().evaluate(e=>e.style.width),'50%');
  assert.ok((await page.locator('.journal-scroll tbody td').first().boundingBox()).height>=70);
  assert.equal(await page.locator('.journal-scroll table input').nth(1).inputValue(),'123');
  await page.reload();
  assert.equal(await page.locator('.journal-scroll th').first().evaluate(e=>e.style.width),'50%');
  assert.equal(await page.locator('.journal-scroll table').evaluate(e=>e.style.getPropertyValue('--input-table-row-height')),'70px');
  // Rebuilding an editor table leaves one settings panel, outside the saved answer.
  await page.locator('.cae-content').evaluate(e=>e.innerHTML=e.innerHTML);
  await page.waitForTimeout(100);
  assert.equal(await page.locator('.cafa-answer-editor>.input-table-settings').count(),1);
  assert.equal(await page.locator('.cae-content .input-table-settings').count(),0);
  assert.ok((await page.locator('.cae-content').innerText()).includes('456'));
  await page.locator('.cae-content table').evaluate(t=>Array.from(t.rows).forEach(row=>row.insertCell().textContent='Nieuw'));
  await page.waitForTimeout(100);
  assert.equal(await page.locator('.cafa-answer-editor .input-table-settings-fields input').count(),4);
  await page.setViewportSize({width:390,height:800});await panel.locator('summary').click();
  assert.ok((await panel.boundingBox()).width<=390);
  await panel.getByRole('button',{name:'Standaard herstellen'}).click();
  assert.equal(await page.locator('.journal-scroll table').evaluate(e=>e.style.getPropertyValue('--input-table-row-height')),'36px');
  console.log('OK: verstelbare kolommen en rijen, behoud invoer, herladen, editor-herbouw, bronisolatie en mobiel.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
