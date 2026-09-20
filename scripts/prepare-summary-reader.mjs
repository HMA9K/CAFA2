import fs from 'node:fs';
const edit=(p,f)=>{const s=fs.readFileSync(p,'utf8'),t=f(s);if(s!==t)fs.writeFileSync(p,t);};
edit('scripts/build-learning-revision.mjs',s=>s.includes("await import('./build-summary-reader.mjs');")?s:s+"\n// Build the seven-chapter reader after the complete source and practice build.\nawait import('./build-summary-reader.mjs');\n");
edit('scripts/build-summary-reader.mjs',s=>{
 s=s.replace("return m[0].replace('class=\"summary-page\"'","return m[0].replace(/\\sdata-view=\"[^\"]*\"/,'').replace('class=\"summary-page\"'");
 s=s.replace("'<a data-tool-link=\"'+id+'\" href=\"#'+id+'\">'","'<a data-route=\"'+id+'\" data-tool-link=\"'+id+'\" href=\"#'+id+'\">'");
 s=s.replace('<div class="chapter-intro">\'+paragraphs(c.intro)+\'</div><nav class="reader-jump" aria-label="In dit hoofdstuk">\'+jump+\'</nav>', '<nav class="reader-jump" aria-label="In dit hoofdstuk">\'+jump+\'</nav><div class="chapter-intro">\'+paragraphs(c.intro)+\'</div>');
 if(!s.includes('Ledger descriptions follow syllabus names'))s=s.replace('function clean(html){return html.',`function clean(html){
 // Ledger descriptions follow syllabus names; the surrounding explanation identifies the additional share.
 html=html.replaceAll('Resultaat boekjaar (aanvullend meerderheidsdeel)','Resultaat boekjaar').replaceAll('Resultaat na belastingen (aanvullend meerderheidsdeel)','Resultaat na belastingen').replaceAll('Voorziening belastingen (aanvullend)','Voorziening belastingen');
 return html.`);
 if(!s.includes("const kernelStart="))s=s.replace("write('samenvatting.html',html);",`write('samenvatting.html',html);
// Reuse the previously tested kernel event handling; only navigation is replaced.
const existingRuntime=read('content/summary/runtime.js');
const kernelStart=existingRuntime.indexOf("  var form=document.getElementById('kernel-form')");
const kernelEnd=existingRuntime.lastIndexOf('}());');
if(kernelStart<0||kernelEnd<kernelStart)throw Error('De bestaande IC-rekentool kon niet worden hergebruikt.');
write('js/summary-reader.js',read('content/summary/reader-runtime.js').replace('/* KERNEL_RUNTIME */',existingRuntime.slice(kernelStart,kernelEnd)));
`);
 return s;
});
edit('css/summary-reader.css',s=>s.replace('max-height:calc(100dvh - 100px)','max-height:calc(100dvh - 150px)'));
edit('tests/reader-browser.py',s=>s.includes("get_attribute('open') is None:\n                    await p.locator")?s:s.replace("                await p.locator('#bijzondere-consolidatie--proportionele-methode>summary').click()","                if await p.locator('#bijzondere-consolidatie--proportionele-methode').get_attribute('open') is None:\n                    await p.locator('#bijzondere-consolidatie--proportionele-methode>summary').click()"));
edit('package.json',s=>{const p=JSON.parse(s);if(!p.scripts.test.includes('tests/summary-reader.mjs'))p.scripts.test+=' && node tests/summary-reader.mjs';p.scripts['test:reader-browser']='python tests/reader-browser.py';return JSON.stringify(p,null,2)+'\n';});
console.log('Leesstructuur geïntegreerd; de oefenvraaggegevens en scorelogica zijn niet gewijzigd.');
