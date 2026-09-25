/** Explicit, idempotent integration. Dry-run by default; never changes deployment settings. */
import {readFile,writeFile,mkdir,readdir,copyFile} from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd(),apply=process.argv.includes('--apply');
const exists=async p=>{try{return await readFile(p,'utf8');}catch(e){if(e.code==='ENOENT')return null;throw e;}};
if(await exists(path.join(root,'_worker.js'))!==null)throw Error('Bestaande _worker.js: integreer de endpoints eerst met deze Worker.');
const original=await readFile(path.join(root,'index.html'),'utf8');
let html=original;
if(!html.includes('css/study-assistant.css')){const link='<link rel="stylesheet" href="css/study-assistant.css?v=20260924-2">';html=html.includes('<!-- study-upgrade:styles -->')?html.replace('<!-- study-upgrade:styles -->',link+'<!-- study-upgrade:styles -->'):html.replace(/<\/head>/i,link+'\n</head>');}
if(!html.includes('src="js/study-assistant.mjs'))html=html.replace(/<\/body>/i,'<script type="module" src="js/study-assistant.mjs?v=20260924-2"></script>\n</body>');
if(!html.includes('src="js/study-assistant.mjs'))throw Error('Geen geldige HTML-body gevonden.');
const pack=JSON.parse(await readFile(path.join(root,'package.json'),'utf8'));
pack.scripts={...pack.scripts,'build:assistant':'node scripts/build-study-assistant.mjs','test:assistant':'node --test tests/study-assistant/*.test.mjs'};
let ignore=await exists(path.join(root,'.gitignore'))||'';
for(const line of ['dist/','.env*','.dev.vars*','assistant/server/catalog.generated.mjs','assistant/server/catalog-parts/','.study-source-results*.json','.study-assistant-backup/'])if(!ignore.split(/\r?\n/).includes(line))ignore+='\n'+line;
const writes=new Map([['index.html',html],['package.json',JSON.stringify(pack,null,2)+'\n'],['.gitignore',ignore.trim()+'\n']]);
for(const name of await readdir(path.join(root,'assistant/pages-functions'))){
 const target='functions/api/'+name,content=await readFile(path.join(root,'assistant/pages-functions',name),'utf8');
 const existing=await exists(path.join(root,target));
 if(existing!==null&&existing!==content)throw Error('Bestaand endpoint niet overschrijven: '+target);
 writes.set(target,content);
}
const changed=[];const backup=path.join(root,'.study-assistant-backup',new Date().toISOString().replace(/[:.]/g,'-'));
for(const [name,content] of writes){const target=path.join(root,name),previous=await exists(target);if(previous===content)continue;changed.push(name);
 if(apply){if(previous!==null){await mkdir(path.dirname(path.join(backup,name)),{recursive:true});await copyFile(target,path.join(backup,name));}await mkdir(path.dirname(target),{recursive:true});await writeFile(target,content);}}
console.log(JSON.stringify({applied:apply,changed,backup:apply?backup:null},null,2));
console.log('Geen publicatie, geen secrets, geen modelaanroepen. Builduitvoer voor Cloudflare moet later bewust op dist worden ingesteld.');
