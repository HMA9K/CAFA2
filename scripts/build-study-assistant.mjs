/** Run from the CAFA2 repository root. Builds the site and a server-only question catalog. */
import {readFile,writeFile,mkdir,readdir,cp,rm} from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {buildCatalog} from '../js/study-assistant-schema.mjs';
const root=process.cwd();
const html=await readFile(path.join(root,'index.html'),'utf8');
if (!html.includes('study-assistant.mjs')) throw new Error('Installeer eerst de assistent in index.html.');
const scripts=[...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)]
  .map(m=>m[1].split('?')[0]).filter(s=>s.startsWith('data/'));
if (!scripts.length) throw new Error('Geen CAFA2-databestanden gevonden.');
const window={};const sandbox=vm.createContext({window,console});
const inputHashes={};
for (const script of scripts) {
  const full=path.resolve(root,script);
  if(!full.startsWith(path.join(root,'data')+path.sep))throw new Error('Onveilig datapad.');
  const code=await readFile(full,'utf8');
  inputHashes[script]=createHash('sha256').update(code).digest('hex');
  // Only trusted, version-controlled CAFA2 source files run here; this is not an upload endpoint.
  new vm.Script(code,{filename:script}).runInContext(sandbox,{timeout:5000});
}
const catalog=buildCatalog(window);catalog.inputHashes=inputHashes;
await mkdir(path.join(root,'assistant/server'),{recursive:true});
// Respect the repository's 900 kB/file ceiling, even when case text is repeated.
const partsDir=path.join(root,'assistant/server/catalog-parts');
await rm(partsDir,{recursive:true,force:true});await mkdir(partsDir,{recursive:true});
const chunks=[];let chunk={},bytes=0;
for(const [key,record] of Object.entries(catalog.records)){
  const size=Buffer.byteLength(JSON.stringify({[key]:record}));
  if(size>750000)throw new Error('Een vraagcontext is te groot: '+key);
  if(bytes+size>750000&&bytes){chunks.push(chunk);chunk={};bytes=0;}
  chunk[key]=record;bytes+=size;
}
if(bytes)chunks.push(chunk);
for(let i=0;i<chunks.length;i++)await writeFile(path.join(partsDir,'part-'+i+'.mjs'),'export default '+JSON.stringify(chunks[i])+';\n');
const {records,...metadata}=catalog;
const loader=chunks.map((_,i)=>`import p${i} from './catalog-parts/part-${i}.mjs';`).join('\n')+
  '\nexport default {...'+JSON.stringify(metadata)+',records:Object.assign(Object.create(null),'+chunks.map((_,i)=>'p'+i).join(',')+')};\n';
await writeFile(path.join(root,'assistant/server/catalog.generated.mjs'),loader);
const out=path.join(root,'dist');await rm(out,{recursive:true,force:true});await mkdir(out);
const excluded=new Set(['dist','node_modules','.git','.github','assistant','functions','scripts','tests','docs','coverage','test-results','playwright-report']);
const forbiddenFile=/^(?:\.env|\.dev\.vars|wrangler\.|package(?:-lock)?\.json|.*\.(?:pem|key|sqlite|db)$)/i;
async function copyPublic(dir,target) {
  await mkdir(target,{recursive:true});
  for(const item of await readdir(dir,{withFileTypes:true})) {
    if(item.isSymbolicLink() || item.name.startsWith('.') || excluded.has(item.name) || forbiddenFile.test(item.name))continue;
    const src=path.join(dir,item.name),dst=path.join(target,item.name);
    if(item.isDirectory())await copyPublic(src,dst);
    else if(/\.(?:html|css|js|mjs|json|svg|png|jpe?g|gif|webp|ico|woff2?|ttf|otf|txt|pdf)$/i.test(item.name) || ['_headers','_redirects','_routes.json'].includes(item.name))await cp(src,dst);
  }
}
await copyPublic(root,out);
// Preserve any unrelated existing function routes; broaden execution if a project already has routes.
let routes={version:1,include:['/api/study-*'],exclude:[]};
try { const existing=JSON.parse(await readFile(path.join(root,'_routes.json'),'utf8'));routes={...existing,include:[...new Set([...(existing.include||[]),'/api/study-*'])]}; }
catch(error){if(error.code!=='ENOENT')throw error;}
for(const pattern of routes.exclude||[]){
 const escaped=pattern.split('*').map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('.*');
 if(new RegExp('^'+escaped+'$').test('/api/study-status'))throw new Error('Bestaande _routes.json sluit de assistent uit. Pas de exclude-regel aan: '+pattern);
}
await writeFile(path.join(out,'_routes.json'),JSON.stringify(routes,null,2));
console.log(JSON.stringify({course:catalog.course,counts:catalog.counts,types:catalog.types,output:'dist',serverCatalog:'assistant/server/catalog.generated.mjs'},null,2));
