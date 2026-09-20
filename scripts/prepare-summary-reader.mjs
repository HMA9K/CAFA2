import fs from 'node:fs';
const edit=(p,f)=>{const s=fs.readFileSync(p,'utf8'),t=f(s);if(s!==t)fs.writeFileSync(p,t);};
edit('scripts/build-learning-revision.mjs',s=>s.includes("await import('./build-summary-reader.mjs');")?s:s+"\n// Build the seven-chapter reader after the complete source and practice build.\nawait import('./build-summary-reader.mjs');\n");
edit('scripts/build-summary-reader.mjs',s=>{
 s=s.replace("return m[0].replace('class=\"summary-page\"'","return m[0].replace(/\\sdata-view=\"[^\"]*\"/,'').replace('class=\"summary-page\"'");
 s=s.replace("'<a data-tool-link=\"'+id+'\" href=\"#'+id+'\">'","'<a data-route=\"'+id+'\" data-tool-link=\"'+id+'\" href=\"#'+id+'\">'");
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
edit('package.json',s=>{const p=JSON.parse(s);if(!p.scripts.test.includes('tests/summary-reader.mjs'))p.scripts.test+=' && node tests/summary-reader.mjs';p.scripts['test:reader-browser']='python tests/reader-browser.py';return JSON.stringify(p,null,2)+'\n';});
console.log('Leesstructuur geïntegreerd; de oefenvraaggegevens en scorelogica zijn niet gewijzigd.');
