const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.STOCK_URL||'http://127.0.0.1:8870/cafa2/';
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}});page.setDefaultTimeout(120000);
  await page.route('**/*',r=>r.request().url().startsWith(base)?r.continue():r.abort());
  await page.goto(base+'index.html#oefenen',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.CafaPractice&&window.CafaStockTable);
  const question=await page.evaluate(()=>{
   for(const [code,bank] of Object.entries(CAFA2_DATA.modules)){
    const index=bank.questions.findIndex(q=>q.type==='Voorraadtabel'&&q.answerSchema&&JSON.stringify(q).includes('Zwolle'));
    if(index>=0)return {code,id:index+1,route:code+'-'+(index+1)};
   }
   throw Error('Source question Zwolle not found');
  });
  await page.evaluate(q=>location.hash=q.route,question);
  await page.locator('#'+question.route+' label[for="own-'+question.route+'"]').click();
  const table=page.locator('#'+question.route+' .practice-rich-answer .stock-matrix');
  await table.waitFor();
  assert.equal(await table.locator('.stock-percentage-row input').count(),3);
  assert.equal(await table.locator('.stock-percentage-row td').nth(1).innerText(),'100%');
  await table.locator('[data-stock-cell="r0-c1"]').fill('250.000');
  for(const [column,value] of [[3,'70%'],[4,'0%'],[5,'30%']])await table.locator('[data-stock-cell="p-c'+column+'"]').fill(value);
  for(const width of [1440,390]){
   await page.setViewportSize({width,height:900});
   const aligned=await table.evaluate(t=>{
    const names=[...t.querySelectorAll('thead input')].map(e=>e.getBoundingClientRect().top);
    const percentages=[...t.querySelectorAll('.stock-percentage-row input')].map(e=>e.getBoundingClientRect().top);
    return {names:Math.max(...names)-Math.min(...names),percentages:Math.max(...percentages)-Math.min(...percentages)};
   });
   assert.ok(aligned.names<1,'Name inputs aligned');assert.ok(aligned.percentages<1,'Percentage inputs aligned');
  }
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('#'+question.route+' label[for="own-'+question.route+'"]').click();await table.waitFor();
  assert.equal(await table.locator('[data-stock-cell="r0-c1"]').inputValue(),'250.000');
  assert.equal(await table.locator('[data-stock-cell="p-c3"]').inputValue(),'70%');
  assert.equal(await table.locator('[data-stock-cell="p-c5"]').inputValue(),'30%');
  const rendered=await page.evaluate(q=>{
   const schema=CafaStockTable.template(CAFA2_DATA.modules[q.code].questions[q.id-1]);
   const cells=CafaPractice.getAnswer(q.code,q.id).stockCells;
   const container=document.createElement('div');container.innerHTML=CafaStockTable.render(schema,cells,true);
   const existing={headers:schema.headers,rows:[['','','100%','…%','…%','…%'],...schema.rows]};
   const other=document.createElement('div');other.innerHTML=CafaStockTable.render(existing,{},false);
   return {review:container.textContent,amount:container.querySelectorAll('tbody tr')[1].cells[1].textContent,existingPercentFields:other.querySelectorAll('input[aria-label^="Percentage"]').length};
  },question);
  assert.match(rendered.review,/70%/);assert.match(rendered.review,/30%/);assert.equal(rendered.amount,'250.000');
  assert.equal(rendered.existingPercentFields,3,'Existing percentage rows are not duplicated');
  console.log('OK: three percentage fields, aligned header inputs, preserved amount keys, saved percentages after reload, readonly review and existing rows.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
