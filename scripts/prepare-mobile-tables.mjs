/* Install a presentation-only decorator in the existing reader build. */
import fs from 'node:fs';
function edit(path, fn) { const before=fs.readFileSync(path,'utf8'),after=fn(before); if(after!==before)fs.writeFileSync(path,after); }
edit('scripts/build-summary-reader.mjs', source => {
  if (!source.includes("import {decorateTables}")) source = "import {decorateTables} from '../content/summary/table-layout.mjs';\n" + source;
  if (!source.includes('css/summary-tables.css')) {
    const anchor='<script id="reader-map"';
    if (!source.includes(anchor)) throw Error('Reader asset insertion point missing.');
    source=source.replace(anchor,'<link rel="stylesheet" href="css/summary-tables.css?v=mobile4">'+anchor);
  }
  source=source.replace('js/summary-reader.js?v=reader3','js/summary-reader.js?v=mobile4');
  return source.replace("write('samenvatting.html',html);", "write('samenvatting.html',decorateTables(html));");
});
edit('content/summary/runtime.js', source => {
  if (!source.includes("import('../content/summary/table-layout.mjs')")) {
    const anchor="import('../content/summary/helpers.mjs')";
    if (!source.includes(anchor)) throw Error('IC renderer import missing.');
    source=source.replace(anchor,anchor+",import('../content/summary/table-layout.mjs')");
  }
  return source.replace('output.innerHTML=html;', 'output.innerHTML=loaded[2].decorateTables(html);');
});
console.log('Mobile table presentation installed; course content unchanged.');
