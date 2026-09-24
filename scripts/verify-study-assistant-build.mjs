/** Verify the deployable Pages asset boundary after build-study-assistant.mjs. */
import {readFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {listAssistantDataScripts,assistantInputHashes,practiceAuthoringHash} from './assistant-inputs.mjs';

const root=process.cwd();
const output=path.resolve(root,process.argv[2]||'dist');
if(output===root||!output.startsWith(root+path.sep))throw new Error('De publieke uitvoermap moet een afzonderlijke map binnen de repository zijn.');

const catalog=(await import(pathToFileURL(path.join(root,'assistant/server/catalog.generated.mjs')).href)).default;
if(catalog.course!=='CAFA2'||!catalog.counts?.practice||!catalog.counts?.exam||
   Object.keys(catalog.records||{}).length!==catalog.counts.practice+catalog.counts.exam)
  throw new Error('De servercatalogus ontbreekt of is onvolledig.');
const sourceHtml=await readFile(path.join(root,'index.html'),'utf8');
const scripts=await listAssistantDataScripts(root,sourceHtml);
const currentHashes=await assistantInputHashes(root,scripts);
if(JSON.stringify(catalog.inputHashes)!==JSON.stringify(currentHashes))
  throw new Error('De servercatalogus is verouderd ten opzichte van de actuele vraag- en tentamendata. Bouw de assistent opnieuw.');
if(catalog.authoringHashes?.practice!==practiceAuthoringHash(root))
  throw new Error('De servercatalogus is verouderd ten opzichte van de nieuwe MC-brondata. Genereer de vraagbank en bouw de assistent opnieuw.');

for(const route of ['auth','chat','logout','status']){
  const handler=await import(pathToFileURL(path.join(root,`functions/api/study-${route}.js`)).href);
  if(typeof handler.onRequest!=='function')throw new Error(`Pages Function study-${route} ontbreekt.`);
}

const html=await readFile(path.join(output,'index.html'),'utf8');
if(!html.includes('src="js/study-assistant.mjs'))throw new Error('De assistent ontbreekt in de publieke HTML.');
const routes=JSON.parse(await readFile(path.join(output,'_routes.json'),'utf8'));
const matches=(pattern,pathname)=>new RegExp('^'+pattern.split('*').map(part=>part.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('.*')+'$').test(pathname);
for(const name of ['auth','chat','logout','status']){
  const pathname=`/api/study-${name}`;
  if(!routes.include?.some(pattern=>matches(pattern,pathname))||routes.exclude?.some(pattern=>matches(pattern,pathname)))
    throw new Error(`Pages-route ${pathname} wordt niet uitgevoerd.`);
}

const forbiddenDirectory=new Set(['assistant','functions','scripts','tests','docs','node_modules','.git','.github']);
const forbiddenFile=/^(?:catalog\.generated\.mjs|schema\.sql|package(?:-lock)?\.json|\.env.*|\.dev\.vars.*|.*\.(?:pem|key|sqlite|db))$/i;
let publicFiles=0;
async function checkDirectory(directory){
  for(const entry of await readdir(directory,{withFileTypes:true})){
    const full=path.join(directory,entry.name);
    const relative=path.relative(output,full).replaceAll(path.sep,'/');
    if(entry.isSymbolicLink())throw new Error(`Symbolische link in publieke uitvoer: ${relative}`);
    if(forbiddenDirectory.has(entry.name)||forbiddenFile.test(entry.name))
      throw new Error(`Privébestand in publieke uitvoer: ${relative}`);
    if(entry.isDirectory())await checkDirectory(full);
    else if(entry.isFile())publicFiles++;
  }
}
await checkDirectory(output);
console.log(JSON.stringify({output:path.relative(root,output),publicFiles,counts:catalog.counts,routes:4}));
