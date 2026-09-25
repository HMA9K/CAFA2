/** Detect new, removed and replaced local source bytes, including unchanged filenames.
 * The snapshot is an inventory baseline, not a claim of upload or content approval.
 * Only --record writes metadata; --check never refreshes the baseline automatically.
 */
import {createHash} from 'node:crypto';
import {createReadStream} from 'node:fs';
import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {planSources,validateSourceManifest} from './prepare-assistant-sources.mjs';

export async function fingerprint(file){
  const hash=createHash('sha256');for await(const bytes of createReadStream(file))hash.update(bytes);return hash.digest('hex');
}
export async function snapshotSources(plan){
  if(plan.counts.ready!==plan.counts.selected||plan.counts.unclassified||plan.counts.scanIssues)
    throw new Error('Maak eerst de broninventarisatie volledig; er zijn ontbrekende of ongeclassificeerde bestanden.');
  const files=[];
  for(const entry of plan.entries){
    files.push({relative:entry.relative,sourceHash:await fingerprint(entry.sourceAbsolute),
      uploadHash:await fingerprint(entry.uploadAbsolute)});
  }
  return {version:1,files:files.sort((a,b)=>a.relative.localeCompare(b.relative))};
}
export function compareSnapshots(previous,current){
  function entries(snapshot){
    if(snapshot?.version!==1||!Array.isArray(snapshot.files)||!snapshot.files.length)throw new Error('Ongeldige bronmomentopname.');
    const map=new Map();
    for(const f of snapshot.files){
      if(typeof f.relative!=='string'||!f.relative||f.relative.startsWith('/')||/[\\\x00]/.test(f.relative)||
        f.relative.split('/').some(x=>!x||x==='.'||x==='..'||x.includes(':'))||map.has(f.relative)||
        !/^[a-f0-9]{64}$/.test(f.sourceHash)||!/^[a-f0-9]{64}$/.test(f.uploadHash))throw new Error('Ongeldige bronmomentopname.');
      map.set(f.relative,f);
    }return map;
  }
  const before=entries(previous),after=entries(current),added=[],changed=[],removed=[];
  for(const [relative,f] of after){const old=before.get(relative);if(!old)added.push(relative);
    else if(f.sourceHash!==old.sourceHash||f.uploadHash!==old.uploadHash)changed.push(relative);}
  for(const relative of before.keys())if(!after.has(relative))removed.push(relative);
  return {added,changed,removed};
}
async function main(){
  const args=process.argv.slice(2),options={};
  for(let i=0;i<args.length;i++){
    if(['--source-root','--converted-root','--state'].includes(args[i])){const key=args[i],value=args[++i];if(!value||value.startsWith('--'))throw new Error('Argumentwaarde ontbreekt.');options[key]=value;}
    else if(['--record','--check'].includes(args[i]))options[args[i]]=true;
    else throw new Error('Gebruik --check of --record, met --source-root, --converted-root en optioneel --state.');
  }
  if(options['--record']&&options['--check'])throw new Error('Kies --record of --check.');
  const manifest=validateSourceManifest(JSON.parse(await readFile(new URL('../assistant/source-manifest.json',import.meta.url),'utf8')));
  const plan=await planSources({manifest,sourceRoot:options['--source-root']||process.env[manifest.sourceRootEnv],
    convertedRoot:options['--converted-root']||process.env[manifest.convertedRootEnv]});
  const current=await snapshotSources(plan),target=options['--state']||new URL('../assistant/source-snapshot.json',import.meta.url);
  if(options['--record']){compareSnapshots(current,current);await writeFile(target,JSON.stringify(current,null,2)+'\n');
    console.log(`Bronmomentopname vastgelegd: ${current.files.length} bestanden. Dit bevestigt geen upload of inhoudelijke goedkeuring.`);return;}
  let previous;try{previous=JSON.parse(await readFile(target,'utf8'));}catch{throw new Error('Bronmomentopname ontbreekt of is ongeldig. Leg een gecontroleerd startpunt vast met --record.');}
  const result=compareSnapshots(previous,current);console.log(JSON.stringify(result));
  if(result.added.length||result.changed.length||result.removed.length){console.error('Broninhoud gewijzigd: controleer de indexering en werk daarna bewust de momentopname bij.');process.exitCode=1;}
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(e=>{console.error(e.message);process.exitCode=1;});
