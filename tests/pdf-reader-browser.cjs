const assert=require('node:assert/strict');const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.PDF_URL||'http://127.0.0.1:8870/cafa2/';
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});try{
 const context=await browser.newContext({viewport:{width:820,height:900}}),page=await context.newPage(),errors=[];
 page.setDefaultTimeout(60000);page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')console.log(m.text());});
 if(!process.env.PDF_URL){const csp=require('node:fs').readFileSync('_headers','utf8').match(/Content-Security-Policy: ([^\r\n]+)/)[1];await page.route('**/pdf-reader/web/viewer.html?*',async r=>{const response=await r.fetch();await r.fulfill({response,headers:{...response.headers(),'Content-Security-Policy':csp}});});}
 const source=new URL('assets/tentamens/20240422/opgaven.pdf',base).href;
 await page.goto(base+'pdf-reader/web/viewer.html?file='+encodeURIComponent(source));
 await page.waitForFunction(()=>window.CafaPdfReader?.ready);console.log('reader ready');await page.waitForFunction(()=>PDFViewerApplication.isInitialViewSet);await page.waitForTimeout(300);
 await page.evaluate(()=>{PDFViewerApplication.pdfViewer.currentScaleValue='1.25';PDFViewerApplication.page=2;});
 const text=page.locator('.page[data-page-number="2"] .textLayer span[role="presentation"]').filter({hasText:/[A-Za-z]{4}/}).first();await text.waitFor();console.log('text ready');await text.scrollIntoViewIfNeeded();
 await page.locator('#cafa-highlight-colour').selectOption('#53FFBC');await page.locator('#cafa-highlight').click();
 await text.waitFor({state:'visible'});await page.waitForTimeout(250);const rect=await text.boundingBox();await page.mouse.move(rect.x+1,rect.y+rect.height/2);await page.mouse.down();await page.mouse.move(rect.x+rect.width-2,rect.y+rect.height/2,{steps:12});await page.mouse.up();
 await page.waitForFunction(()=>PDFViewerApplication.pdfDocument.annotationStorage.size>0);console.log('highlight made');
 await page.locator('#cafa-highlight').click();await page.evaluate(()=>CafaPdfReader.flush());
 assert.equal(await page.locator('#cafa-save-status').innerText(),'Arceringen lokaal opgeslagen');
 console.log('saved');const view=await page.evaluate(()=>({page:PDFViewerApplication.page,scale:PDFViewerApplication.pdfViewer.currentScale}));
 await page.reload();await page.waitForFunction(()=>window.CafaPdfReader?.ready);console.log('reader ready');await page.waitForFunction(()=>PDFViewerApplication.isInitialViewSet);await page.waitForTimeout(300);
 await page.waitForFunction(v=>PDFViewerApplication.page===v.page&&Math.abs(PDFViewerApplication.pdfViewer.currentScale-v.scale)<.01,view);
 const annotations=await page.evaluate(async()=>Array.from(await (await PDFViewerApplication.pdfDocument.getPage(2)).getAnnotations()).filter(a=>a.subtype==='Highlight').map(a=>({color:Array.from(a.color),id:a.id})));
 assert.equal(annotations.length,1);assert.deepEqual(annotations[0].color,[83,255,188]);
 await page.locator('#cafa-highlight').click();const highlight=page.locator('.page[data-page-number="2"] .highlightEditor').first();await highlight.waitFor();await highlight.click();await page.locator('#cafa-highlight-colour').selectOption('#80EBFF');await page.evaluate(()=>CafaPdfReader.flush());const edited=await page.evaluate(async()=>{const bytes=await PDFViewerApplication.pdfDocument.saveDocument();const task=pdfjsLib.getDocument({data:bytes}),doc=await task.promise;const a=(await (await doc.getPage(2)).getAnnotations()).find(a=>a.subtype==='Highlight');await task.destroy();return Array.from(a.color);});assert.deepEqual(edited,[128,235,255]);await page.locator('#cafa-highlight-delete').click();await page.waitForTimeout(500);await page.evaluate(()=>CafaPdfReader.flush());
 await page.reload();await page.waitForFunction(()=>window.CafaPdfReader?.ready);console.log('reader ready');await page.waitForFunction(()=>PDFViewerApplication.isInitialViewSet);await page.waitForTimeout(300);
 assert.equal(await page.evaluate(async()=>(await (await PDFViewerApplication.pdfDocument.getPage(2)).getAnnotations()).filter(a=>a.subtype==='Highlight').length),0);
 await page.setViewportSize({width:350,height:700});assert.ok(await page.locator('#cafa-highlight').isVisible());assert.ok(await page.locator('#cafa-highlight-colour').isVisible());
 assert.deepEqual(errors,[]);console.log('Real mouse highlighting, colour, saved annotations, page/zoom reload, deletion and narrow toolbar passed.');
 await browser.close();
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
