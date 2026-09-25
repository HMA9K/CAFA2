/**
 * Inventory local CAFA2 source candidates. The default run is read-only and offline.
 * Remote ingestion requires --upload, --all-groups, review flags and an API key.
 * Each upload creates a new complete store; never replace a configured store ID with a partial set.
 * Source bytes and credentials must never be committed to this repository.
 */
import {openAsBlob} from 'node:fs';
import {readFile,readdir,realpath,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const DEFAULT_MANIFEST=new URL('../assistant/source-manifest.json',import.meta.url);
const API='https://api.openai.com/v1';
const MAX_BYTES=512*1024*1024;
const MIME={'.pdf':'application/pdf','.pptx':'application/vnd.openxmlformats-officedocument.presentationml.presentation','.docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document'};
const DISCOVERABLE=new Set([...Object.keys(MIME),'.ppt']);

function plain(value){return value!==null && typeof value==='object' && !Array.isArray(value);}
function validRelative(value){
  return typeof value==='string' && !!value && !value.includes('\\') && !value.includes('\0')
    && !path.posix.isAbsolute(value) && !/^[a-z]:/i.test(value)
    && value.split('/').every(part=>part!=='' && part!=='.' && part!=='..');
}
function scanRoot(value){
  const root=typeof value==='string'?{path:value,recursive:true}:value;
  if(!plain(root)||!validRelative(root.path)||
     (root.recursive!==undefined&&typeof root.recursive!=='boolean'))
    throw new Error('Ongeldige bron-scanmap.');
  return {path:root.path,recursive:root.recursive!==false};
}
function coveredBy(relative,root){
  if(!relative.startsWith(root.path+'/'))return false;
  return root.recursive||!relative.slice(root.path.length+1).includes('/');
}
export function validateSourceManifest(manifest){
  if(!plain(manifest)||manifest.version!==1||!plain(manifest.groups)||!plain(manifest.scanRoots))
    throw new Error('Ongeldig bronmanifest of ontbrekende scanRoots.');
  const seen=new Set();
  for(const [group,files] of Object.entries(manifest.groups)){
    if(!/^[a-z0-9-]+$/.test(group)||!Array.isArray(files)||!files.length)throw new Error(`Ongeldige brongroep: ${group}`);
    const rawRoots=manifest.scanRoots[group];
    if(!Array.isArray(rawRoots)||!rawRoots.length)throw new Error(`Scanmap ontbreekt voor brongroep: ${group}`);
    const roots=rawRoots.map(scanRoot);
    for(const relative of files){
      if(!validRelative(relative)||!['.pdf','.pptx','.ppt','.docx'].includes(path.posix.extname(relative).toLowerCase()))
        throw new Error(`Ongeldig bronpad: ${relative}`);
      if(!roots.some(root=>coveredBy(relative,root)))
        throw new Error(`Bron valt buiten de scanmap van ${group}: ${relative}`);
      if(seen.has(relative))throw new Error(`Dubbel bronpad: ${relative}`);
      seen.add(relative);
    }
  }
  for(const group of Object.keys(manifest.scanRoots))
    if(!Object.hasOwn(manifest.groups,group))throw new Error(`Scanmap zonder brongroep: ${group}`);
  if(manifest.excluded!==undefined){
    if(!plain(manifest.excluded))throw new Error('Ongeldige expliciete bronuitsluitingen.');
    const allRoots=Object.values(manifest.scanRoots).flat().map(scanRoot);
    for(const [relative,reason] of Object.entries(manifest.excluded)){
      if(!validRelative(relative)||!DISCOVERABLE.has(path.posix.extname(relative).toLowerCase())||
         !allRoots.some(root=>coveredBy(relative,root))||seen.has(relative)||
         typeof reason!=='string'||!reason.trim())
        throw new Error(`Ongeldige expliciete bronuitsluiting: ${relative}`);
      seen.add(relative);
    }
  }
  if(manifest.reviewFlags!==undefined){
    if(!plain(manifest.reviewFlags))throw new Error('Ongeldige broncontrolemarkeringen.');
    for(const [relative,flags] of Object.entries(manifest.reviewFlags))
      if(!seen.has(relative)||!Array.isArray(flags)||flags.some(x=>typeof x!=='string'||!/^[a-z0-9-]+$/.test(x)))
        throw new Error(`Ongeldige broncontrolemarkering: ${relative}`);
  }
  return manifest;
}

function inside(root,target){const rel=path.relative(root,target);return rel===''||(!rel.startsWith('..'+path.sep)&&rel!=='..'&&!path.isAbsolute(rel));}
async function inspect(root,relative){
  if(!root)return {status:'missing_root'};
  const target=path.resolve(root,...relative.split('/'));
  if(!inside(root,target))return {status:'outside_root'};
  try{
    const real=await realpath(target);
    if(!inside(await realpath(root),real))return {status:'outside_root'};
    const info=await stat(real);
    if(!info.isFile()||info.size===0)return {status:'empty'};
    if(info.size>MAX_BYTES)return {status:'too_large',size:info.size};
    return {status:'ready',absolute:real,size:info.size};
  }catch(error){if(error?.code==='ENOENT')return {status:'missing'};throw error;}
}
function convertedRelative(relative){
  if(!relative.startsWith('Repetitiecursus/Slides/')||!relative.toLowerCase().endsWith('.ppt'))return null;
  return relative.slice('Repetitiecursus/'.length).replace(/\.ppt$/i,'.pdf');
}
async function discoverSources(manifest,sourceRoot){
  const unclassified=new Map(),scanIssues=new Map();
  const issue=(group,relative,status)=>{
    scanIssues.set(group+':'+relative+':'+status,{group,relative,status});
  };
  const approved=new Set([...Object.values(manifest.groups).flat(),...Object.keys(manifest.excluded||{})]);
  let canonicalRoot;
  try{canonicalRoot=await realpath(sourceRoot);}
  catch(error){
    if(error?.code==='ENOENT'){
      issue('all','', 'missing_source_root');
      return {unclassified:[],scanIssues:[...scanIssues.values()]};
    }
    throw error;
  }
  const scans=Object.entries(manifest.scanRoots).flatMap(([group,roots])=>
    roots.map(root=>({group,...scanRoot(root)}))).sort((a,b)=>b.path.length-a.path.length);
  for(const scan of scans){
    const absolute=path.resolve(sourceRoot,...scan.path.split('/'));
    if(!inside(sourceRoot,absolute)){issue(scan.group,scan.path,'outside_root');continue;}
    let real;
    try{real=await realpath(absolute);}
    catch(error){
      if(error?.code==='ENOENT'){issue(scan.group,scan.path,'missing_scan_root');continue;}
      throw error;
    }
    if(!inside(canonicalRoot,real)){issue(scan.group,scan.path,'outside_root');continue;}
    if(!(await stat(real)).isDirectory()){issue(scan.group,scan.path,'not_directory');continue;}
    async function walk(directory){
      for(const item of await readdir(directory,{withFileTypes:true})){
        const child=path.join(directory,item.name);
        const relative=path.relative(canonicalRoot,child).replaceAll(path.sep,'/');
        if(item.isSymbolicLink()){issue(scan.group,relative,'symlink');continue;}
        let resolved;
        try{resolved=await realpath(child);}
        catch(error){
          if(error?.code==='ENOENT'){issue(scan.group,relative,'vanished');continue;}
          throw error;
        }
        if(!inside(canonicalRoot,resolved)){issue(scan.group,relative,'outside_root');continue;}
        if(item.isDirectory()){
          if(scan.recursive)await walk(resolved);
        }else if(item.isFile()&&DISCOVERABLE.has(path.extname(item.name).toLowerCase())&&!approved.has(relative)){
          if(!unclassified.has(relative))unclassified.set(relative,{group:scan.group,relative,status:'unclassified'});
        }
      }
    }
    await walk(real);
  }
  return {unclassified:[...unclassified.values()].sort((a,b)=>a.relative.localeCompare(b.relative)),
    scanIssues:[...scanIssues.values()].sort((a,b)=>a.relative.localeCompare(b.relative))};
}
export async function planSources({manifest,sourceRoot,convertedRoot,groups}={}){
  validateSourceManifest(manifest);
  if(!sourceRoot)throw new Error('Geef CAFA2_SOURCE_ROOT of --source-root op.');
  const allGroups=Object.keys(manifest.groups);
  const chosen=groups?.length?groups:allGroups;
  if(new Set(chosen).size!==chosen.length)throw new Error('Een brongroep is dubbel geselecteerd.');
  for(const group of chosen)if(!Object.hasOwn(manifest.groups,group))throw new Error(`Onbekende brongroep: ${group}`);
  const root=path.resolve(sourceRoot),converted=convertedRoot?path.resolve(convertedRoot):null;
  const entries=[];
  for(const group of chosen){
    for(const relative of manifest.groups[group]){
      const original=await inspect(root,relative);
      const ext=path.posix.extname(relative).toLowerCase();
      const entry={group,relative,flags:manifest.reviewFlags?.[relative]||[],status:original.status,size:original.size||0};
      if(original.status!=='ready'){entries.push(entry);continue;}
      entry.sourceAbsolute=original.absolute;
      if(ext==='.ppt'){
        entry.convertedRelative=convertedRelative(relative);
        const convertedFile=entry.convertedRelative?await inspect(converted,entry.convertedRelative):{status:'missing'};
        if(convertedFile.status==='ready'){
          entry.status='ready_converted';entry.uploadAbsolute=convertedFile.absolute;entry.uploadRelative=entry.convertedRelative;
          entry.size=convertedFile.size;entry.flags=[...entry.flags,'conversie-visueel-controleren'];
        }else{
          entry.status='conversion_required';entry.conversionStatus=convertedFile.status;
        }
      }else if(MIME[ext]){
        entry.status='ready';entry.uploadAbsolute=original.absolute;entry.uploadRelative=relative;
      }else entry.status='unsupported';
      entries.push(entry);
    }
  }
  const discovery=await discoverSources(manifest,root);
  const excluded=Object.entries(manifest.excluded||{}).map(([relative,reason])=>({relative,reason}));
  const counts={selected:entries.length,ready:0,direct:0,converted:0,conversionRequired:0,missing:0,invalid:0,
    excluded:excluded.length,
    unclassified:discovery.unclassified.length,scanIssues:discovery.scanIssues.length};
  for(const entry of entries){
    if(entry.status==='ready'){counts.ready++;counts.direct++;}
    else if(entry.status==='ready_converted'){counts.ready++;counts.converted++;}
    else if(entry.status==='conversion_required')counts.conversionRequired++;
    else if(entry.status==='missing')counts.missing++;
    else counts.invalid++;
  }
  return {groups:chosen,allGroups,entries,excluded,counts,...discovery};
}

function parseArgs(args){
  const options={groups:[]};
  for(let i=0;i<args.length;i++){
    const key=args[i];
    if(['--source-root','--converted-root','--manifest','--group'].includes(key)){
      const value=args[++i];if(!value||value.startsWith('--'))throw new Error(`Waarde ontbreekt voor ${key}.`);
      if(key==='--group')options.groups.push(value);
      else options[{'--source-root':'sourceRoot','--converted-root':'convertedRoot','--manifest':'manifestPath'}[key]]=value;
    }else if(['--upload','--all-groups','--check','--confirm-external-processing','--confirm-slide-review','--confirm-content-review','--json','--help'].includes(key))
      options[{'--upload':'upload','--all-groups':'allGroups','--check':'check','--confirm-external-processing':'confirmExternal','--confirm-slide-review':'confirmSlides','--confirm-content-review':'confirmContent','--json':'json','--help':'help'}[key]]=true;
    else throw new Error(`Onbekende optie: ${key}`);
  }
  return options;
}
export function preflightUpload(plan,options){
  if(!options.groups.length)throw new Error('Kies voor upload expliciet --all-groups.');
  if(!Array.isArray(plan.allGroups)||plan.groups.length!==plan.allGroups.length||
     !plan.allGroups.every(group=>plan.groups.includes(group)))
    throw new Error('Een nieuwe vector store moet alle brongroepen bevatten. Gebruik --all-groups.');
  if(!options.confirmExternal)throw new Error('Externe verwerking vereist --confirm-external-processing na rechtencontrole.');
  if(!options.confirmContent)throw new Error('Broncontrole vereist --confirm-content-review.');
  if(plan.groups.some(group=>group.includes('slides'))&&!options.confirmSlides)
    throw new Error('Slides vereisen --confirm-slide-review na visuele en tekstcontrole.');
  if(plan.counts.unclassified||plan.counts.scanIssues)
    throw new Error('Nieuwe of onveilige bronbestanden moeten eerst worden geclassificeerd.');
  if(plan.counts.ready!==plan.counts.selected)throw new Error('Upload geweigerd: ontbrekende, ongeschikte of nog niet geconverteerde bronbestanden.');
  if(typeof process.env.OPENAI_API_KEY!=='string'||process.env.OPENAI_API_KEY.length<12)
    throw new Error('OPENAI_API_KEY ontbreekt in de lokale omgeving.');
}
function publicEntry(entry){const {group,relative,flags,status,size,convertedRelative,conversionStatus}=entry;return {group,relative,status,size,flags,...(convertedRelative?{convertedRelative}:{}),...(conversionStatus?{conversionStatus}:{})};}
function showPlan(plan,asJson,upload){
  if(asJson){console.log(JSON.stringify({groups:plan.groups,counts:plan.counts,entries:plan.entries.map(publicEntry),
    excluded:plan.excluded,unclassified:plan.unclassified,scanIssues:plan.scanIssues},null,2));return;}
  console.log(`Broncontrole: ${plan.counts.selected} geselecteerd, ${plan.counts.direct} direct formaatklaar, ${plan.counts.converted} via conversie, ${plan.counts.conversionRequired} conversie nodig, ${plan.counts.missing} ontbrekend, ${plan.counts.invalid} ongeldig, ${plan.counts.excluded} expliciet uitgesloten, ${plan.counts.unclassified} niet geclassificeerd, ${plan.counts.scanIssues} scanproblemen.`);
  for(const entry of plan.entries){
    const target=entry.convertedRelative?` -> ${entry.convertedRelative}`:'';
    const flags=entry.flags.length?` [controle: ${entry.flags.join(', ')}]`:'';
    console.log(`${entry.status.padEnd(20)} ${entry.group}: ${entry.relative}${target}${flags}`);
  }
  for(const entry of plan.excluded)console.log(`UITGESLOTEN ${entry.relative}: ${entry.reason}`);
  for(const entry of plan.unclassified)console.log(`NIET GECLASSIFICEERD ${entry.group}: ${entry.relative}`);
  for(const entry of plan.scanIssues)console.log(`SCANPROBLEEM ${entry.group}: ${entry.relative} [${entry.status}]`);
  if(upload)console.log('Upload maakt een nieuwe volledige vector store. Vervang OPENAI_COURSE_VECTOR_STORE_ID pas nadat alle brongroepen volledig zijn geindexeerd.');
  if(!upload)console.log('Dry-run: geen netwerkverzoeken en geen broninhoud gekopieerd.');
}

async function api(fetcher,key,method,endpoint,body,form=false){
  const response=await fetcher(API+endpoint,{method,headers:{Authorization:`Bearer ${key}`,...(form?{}:{'Content-Type':'application/json'})},body:form?body:JSON.stringify(body),redirect:'error',signal:AbortSignal.timeout(180000)});
  if(!response.ok)throw new Error(`OpenAI API-verzoek ${method} ${endpoint.split('?')[0]} gaf HTTP ${response.status}.`);
  const result=await response.json();if(!plain(result))throw new Error('OpenAI API gaf ongeldige JSON.');return result;
}
export async function uploadSources(plan,{key,fetcher=fetch}={}){
  if(plan.counts.ready!==plan.counts.selected)throw new Error('De bronselectie is niet volledig formaatklaar.');
  if(!Array.isArray(plan.allGroups)||plan.groups.length!==plan.allGroups.length||
     !plan.allGroups.every(group=>plan.groups.includes(group)))
    throw new Error('Een nieuwe vector store moet alle brongroepen bevatten.');
  if(plan.counts.unclassified||plan.counts.scanIssues)throw new Error('Nieuwe of onveilige bronbestanden moeten eerst worden geclassificeerd.');
  const store=await api(fetcher,key,'POST','/vector_stores',{name:`CAFA2 study sources ${new Date().toISOString().slice(0,10)}`});
  if(typeof store.id!=='string'||!store.id.startsWith('vs_'))throw new Error('De aangemaakte vector store heeft geen geldige ID.');
  let completed=0;
  try{
    for(const entry of plan.entries){
      const form=new FormData();form.append('purpose','assistants');
      const mime=MIME[path.extname(entry.uploadRelative).toLowerCase()];
      form.append('file',await openAsBlob(entry.uploadAbsolute,{type:mime}),path.basename(entry.uploadRelative));
      const uploaded=await api(fetcher,key,'POST','/files',form,true);
      if(typeof uploaded.id!=='string'||!/^file[-_]/.test(uploaded.id))throw new Error('Het bestand heeft geen geldige File-ID.');
      await api(fetcher,key,'POST',`/vector_stores/${encodeURIComponent(store.id)}/files`,{file_id:uploaded.id});
      let ready=false;
      for(let attempt=0;attempt<90;attempt++){
        const state=await api(fetcher,key,'GET',`/vector_stores/${encodeURIComponent(store.id)}/files/${encodeURIComponent(uploaded.id)}`);
        if(state.status==='completed'){ready=true;break;}
        if(state.status==='failed'||state.status==='cancelled')throw new Error(`Indexering mislukt: ${entry.relative}`);
        if(attempt<89)await new Promise(resolve=>setTimeout(resolve,2000));
      }
      if(!ready)throw new Error(`Indexering niet afgerond binnen drie minuten: ${entry.relative}`);
      completed++;console.log(`Geïndexeerd ${completed}/${plan.entries.length}: ${entry.relative}`);
    }
  }catch(error){throw new Error(`${error.message} De gedeeltelijke vector store blijft bestaan: ${store.id}. Controleer of verwijder deze in het API-project.`);}
  return {storeId:store.id,completed};
}

export async function main(args=process.argv.slice(2)){
  const options=parseArgs(args);
  if(options.help){console.log('Gebruik: node scripts/prepare-assistant-sources.mjs --source-root MAP [--converted-root MAP] [--group GROEP] [--json] [--check]. Upload alleen met --upload --all-groups en de toepasselijke --confirm-* opties; dit maakt een nieuwe volledige vector store.');return;}
  if(options.upload&&options.json)throw new Error('--json is alleen beschikbaar bij een dry-run.');
  if(options.upload&&options.check)throw new Error('--check en --upload kunnen niet samen worden gebruikt.');
  if(options.allGroups&&options.groups.length)throw new Error('Gebruik --all-groups of --group, niet beide.');
  const manifest=validateSourceManifest(JSON.parse(await readFile(options.manifestPath||DEFAULT_MANIFEST,'utf8')));
  const sourceRoot=options.sourceRoot||process.env[manifest.sourceRootEnv];
  const convertedRoot=options.convertedRoot||process.env[manifest.convertedRootEnv];
  const selectedGroups=options.allGroups?Object.keys(manifest.groups):options.groups;
  const plan=await planSources({manifest,sourceRoot,convertedRoot,groups:selectedGroups});
  showPlan(plan,options.json,options.upload);
  if(options.check&&(plan.counts.unclassified||plan.counts.scanIssues||plan.counts.ready!==plan.counts.selected))
    throw new Error('Broncontrole faalt: classificeer nieuwe bestanden, verhelp scanproblemen en lever ontbrekende conversies of bronnen aan.');
  if(!options.upload)return plan;
  preflightUpload(plan,{...options,groups:selectedGroups});
  const result=await uploadSources(plan,{key:process.env.OPENAI_API_KEY});
  console.log(`Volledig geïndexeerd: ${result.completed} bestanden. Stel OPENAI_COURSE_VECTOR_STORE_ID=${result.storeId} in de beveiligde previewconfiguratie in.`);
  return result;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))
  main().catch(error=>{console.error(error.message);process.exitCode=1;});
