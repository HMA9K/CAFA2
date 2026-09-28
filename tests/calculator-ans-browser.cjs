// Controleer echte knoppen, toetsenbordinvoer en blijvend opgeslagen Ans.
const assert=require('node:assert/strict'),fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const repo=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{
  const name=new URL(req.url,'http://localhost').pathname;
  if(name==='/'){res.setHeader('Content-Type','text/html; charset=utf-8');res.end('<!doctype html><html lang="nl"><title>Rekenmachinecontrole</title><div class="top-controls"><button data-calc>Rekenmachine</button></div><script src="/js/calculator-input.js"></script><script src="/js/calculator.js"></script></html>');return;}
  if(!['/js/calculator-input.js','/js/calculator.js'].includes(name)){res.writeHead(404);res.end();return;}
  res.setHeader('Content-Type','application/javascript; charset=utf-8');res.end(fs.readFileSync(path.join(repo,name)));
});
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
  let checks=0;
  try{for(const width of [1366,390]){
    const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage(),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(process.env.CALCULATOR_URL||'http://127.0.0.1:'+server.address().port+'/');
    await page.waitForFunction(()=>!!window.CafaCalculator);
    await page.locator('[data-calc]').first().click();
    const panel=page.locator('#calculator-dialog'),input=panel.locator('[data-calc-input]');
    const key=async k=>{const button=panel.locator(`[data-calc-key="${k}"]`);if(!await button.isVisible())await panel.locator('.calc-extra summary').click();await button.click();};
    const state=()=>page.evaluate(()=>CafaCalculator.getState());
    const result=async expected=>{const s=await state();assert.equal(s.errorShown,false);assert.ok(Math.abs(s.lastValue-expected)<1e-10,JSON.stringify({expected,actual:s.lastValue}));checks++;};
    const type=async text=>{await input.fill(text);await input.press('Enter');};
    const seed=async value=>{await key('C');await type(String(value));};
    // Deleting Ans leaves an editable unary minus, including after reload.
    for(const deleteKey of ['Backspace','Delete','button']){
      await seed(100);await key('-');
      await input.focus();await input.evaluate(e=>e.setSelectionRange(0,3));
      if(deleteKey==='button')await key('back');else await input.press(deleteKey);
      assert.equal(await input.inputValue(),'-','Ans can be removed with '+deleteKey);
      await input.focus();await input.pressSequentially('550');assert.equal(await input.inputValue(),'-550');await input.press('Enter');await result(-550);
    }
    await seed(100);await key('-');await input.focus();await input.evaluate(e=>e.setSelectionRange(3,3));
    for(const expected of ['An-','A-','-']){await input.press('Backspace');assert.equal(await input.inputValue(),expected);}
    await page.reload();await page.waitForFunction(()=>!!window.CafaCalculator);await page.locator('[data-calc]').first().click();
    await input.focus();assert.equal(await input.inputValue(),'-');await input.focus();await input.pressSequentially('5');assert.equal(await input.inputValue(),'-5');await input.press('Enter');await result(-5);
    await key('C');await type('-2^2');await result(-4);
    assert.equal(await panel.locator('[data-calc-key="sign"]').count(),0);
    for(const k of ['Ans','negative'])assert.ok(await panel.locator('.calc-keys').locator(`[data-calc-key="${k}"]`).isVisible());
    for(const [op,rhs,expected] of [['+',5,-21595],['-',5,-21605],['*',8,-172800],['/',8,-2700],['^',2,466560000],['%',null,-216]]){
      await seed(-21600);await key(op);assert.equal(await input.inputValue(),'Ans'+op);
      if(rhs!==null)for(const digit of String(rhs))await key(digit);
      await key('=');await result(expected);
      assert.equal((await state()).history.at(-1).displayExpression,'Ans'+op+(rhs??''));
      await seed(-21600);await input.focus();await input.pressSequentially(op+(rhs??''));assert.equal(await input.inputValue(),'Ans'+op+(rhs??''));await input.press('Enter');await result(expected);
    }
    for(const [value,k,expected] of [[81,'sqrt(',9],[Math.E,'ln(',1],[2,'exp(',Math.exp(2)]]){
      await seed(value);await key(k);assert.equal(await input.inputValue(),k+'Ans)');await key('=');await result(expected);
    }
    await seed(8);await key('reciprocal');await key('=');await result(0.125);
    await seed(8);await key('Ans');assert.equal(await input.inputValue(),'Ans');await key('*');await key('2');await key('=');await result(16);
    await seed(8);await key('*');await key('negative');await key('5');assert.equal(await input.inputValue(),'Ans*(-5)');await key('=');await result(-40);
    await seed(8);await type('sqrt(Ans^2)+ln(exp(Ans))');await result(16);
    await seed(0);await type('-5');await result(-5);await type('+5');await result(0);
    await seed(100);await type('+5');await result(105);await type('Ans-2');await result(103);
    for(const previous of [100,-21600,0]){
      await seed(previous);await key('negative');assert.equal(await input.inputValue(),'-');await input.focus();await input.pressSequentially('5');assert.equal(await input.inputValue(),'-5');await input.press('Enter');await result(-5);
      assert.equal((await state()).history.at(-1).displayExpression,'-5');
      await seed(previous);await key('-');assert.equal(await input.inputValue(),'Ans-');await key('5');await key('=');await result(previous-5);
      await seed(previous);await type('−5');assert.equal((await state()).history.at(-1).displayExpression,'Ans−5');await result(previous-5);
      await seed(previous);await type('(-5)+1');await result(-4);
    }
    const negativeCalculation='-1.600.000+1.350.000+2.850.000-2.000.000';
    await seed(-350000);await key('negative');await type(negativeCalculation);await result(600000);
    assert.equal((await state()).history.at(-1).displayExpression,negativeCalculation);
    await page.reload();await page.waitForFunction(()=>!!window.CafaCalculator);await page.locator('[data-calc]').first().click();
    await key('negative');await type('-2^2');await result(-4);
    await seed(250);await key('negative');await page.reload();await page.waitForFunction(()=>!!window.CafaCalculator);await page.locator('[data-calc]').first().click();
    await input.focus();await input.pressSequentially('550');assert.equal(await input.inputValue(),'-550');await input.press('Enter');await result(-550);
    await seed(250);await input.focus();await input.pressSequentially('+500');assert.equal(await input.inputValue(),'Ans+500');await page.reload();await page.waitForFunction(()=>!!window.CafaCalculator);await page.locator('[data-calc]').first().click();
    assert.equal(await input.inputValue(),'Ans+500');await input.press('Enter');await result(750);
    // Een historische Ans-regel moet het toenmalige antwoord blijven gebruiken.
    await seed(10);await type('Ans-2');const entry=(await state()).history.at(-1);
    await type('200');await panel.locator(`[data-calc-history-id="${entry.id}"] .calc-history-reuse`).click();
    await input.press('Enter');await result(8);
    await page.reload();await page.waitForFunction(()=>!!window.CafaCalculator);await page.locator('[data-calc]').first().click();
    await type('+2');await result(10);await key('C');
    await page.reload();await page.waitForFunction(()=>!!window.CafaCalculator);await page.locator('[data-calc]').first().click();
    await key('-');assert.equal(await input.inputValue(),'-');await key('5');await key('=');await result(-5);
    for(const [seedValue,k] of [[-1,'sqrt('],[0,'ln('],[1000,'exp(']]){
      await seed(seedValue);const count=(await state()).history.length;await key(k);await key('=');
      assert.equal((await state()).errorShown,true);assert.equal((await state()).history.length,count);assert.equal((await state()).lastValue,seedValue);checks++;
    }
    assert.deepEqual(errors,[]);await context.close();
  }}finally{await browser.close();server.close();}
  console.log(JSON.stringify({status:'geslaagd',checks,widths:[1366,390]}));
})().catch(error=>{server.close();console.error(error);process.exit(1);});
