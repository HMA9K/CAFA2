/** Attach explicitly reviewed, already uploaded files to an existing course store.
 * No uploads, removals, credentials or document contents in the repository/output.
 * Default is a read-only check; --apply is an explicit, idempotent attachment step.
 */
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const API='https://api.openai.com/v1';
export function validateAttachments(plan){
  if(plan?.version!==1||!/^vs_[a-zA-Z0-9]+$/.test(plan.storeId||'')||!Array.isArray(plan.files)||!plan.files.length)
    throw new Error('Ongeldige expliciete bronkoppeling.');
  const ids=new Set(),names=new Set();
  for(const file of plan.files){
    if(!/^file[-_][a-zA-Z0-9]+$/.test(file?.id||'')||typeof file.filename!=='string'||!file.filename.trim()||
      /[\x00-\x1f/\\]/.test(file.filename)||ids.has(file.id)||names.has(file.filename))
      throw new Error('Ongeldig of dubbel bestand in de bronkoppeling.');
    ids.add(file.id);names.add(file.filename);
  }
}
export async function syncAttachments(plan,{key,storeId=plan?.storeId,apply=false,fetcher=fetch,
  sleep=ms=>new Promise(r=>setTimeout(r,ms)),attempts=60}={}){
  validateAttachments(plan);
  if(storeId!==plan.storeId)throw new Error('De ingestelde documentbank wijkt af van de gecontroleerde selectie.');
  if(typeof key!=='string'||key.length<12)throw new Error('OPENAI_API_KEY ontbreekt in deze beveiligde uitvoeromgeving.');
  async function api(method,endpoint,body){
    let response;
    try{response=await fetcher(API+endpoint,{method,headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},
      ...(body?{body:JSON.stringify(body)}:{}),redirect:'error',signal:AbortSignal.timeout(30000)});}
    catch{throw new Error(`Documentbank niet bereikbaar bij ${method}.`);}
    if(!response.ok)throw new Error(`Documentbank gaf HTTP ${response.status} bij ${method}.`);
    try{return await response.json();}catch{throw new Error('Documentbank gaf ongeldige JSON.');}
  }
  const current=new Map();let after='';
  for(let page=0;page<100;page++){
    const result=await api('GET',`/vector_stores/${storeId}/files?limit=100${after?'&after='+encodeURIComponent(after):''}`);
    if(!Array.isArray(result.data))throw new Error('Bestandenlijst ontbreekt.');
    for(const f of result.data)current.set(f.id,f);
    if(!result.has_more)break;
    if(!result.last_id||result.last_id===after||page===99)throw new Error('Onvolledige bestandenlijst.');
    after=result.last_id;
  }
  // Verify every identity before the first mutation. A stale ID must never attach another file.
  for(const f of plan.files){
    const actual=await api('GET',`/files/${f.id}`);
    if(actual.id!==f.id||actual.filename!==f.filename||actual.purpose!=='assistants')
      throw new Error(`Bestandsidentiteit komt niet overeen: ${f.filename}`);
    const status=current.get(f.id)?.status;
    if(status==='failed'||status==='cancelled')throw new Error(`Indexering mislukt: ${f.filename}`);
  }
  const missing=plan.files.filter(f=>!current.has(f.id));
  if(!apply)return {missing:missing.map(f=>f.filename),attached:plan.files.length-missing.length,
    pending:plan.files.filter(f=>current.get(f.id)?.status==='in_progress').length,total:current.size};
  let batch;
  if(missing.length){
    batch=await api('POST',`/vector_stores/${storeId}/file_batches`,{file_ids:missing.map(f=>f.id)});
    if(!/^vsfb_[a-zA-Z0-9]+$/.test(batch.id||''))throw new Error('Ongeldige indexeerbatch.');
  }
  for(let attempt=0;attempt<attempts;attempt++){
    const states=await Promise.all(plan.files.map(f=>api('GET',`/vector_stores/${storeId}/files/${f.id}`)));
    if(states.some(f=>f.status==='failed'||f.status==='cancelled'))throw new Error('Ten minste één bestand kon niet worden geïndexeerd.');
    if(states.every((f,i)=>f.id===plan.files[i].id&&f.status==='completed')){
      const store=await api('GET',`/vector_stores/${storeId}`);
      return {storeId,added:missing.length,completed:states.length,total:store.file_counts?.total,
        failed:store.file_counts?.failed,pending:store.file_counts?.in_progress};
    }
    if(attempt+1<attempts)await sleep(2000);
  }
  throw new Error('Indexering nog niet volledig afgerond; bestaande documentbank blijft behouden.');
}
async function main(){
  const args=process.argv.slice(2);
  if(args.some(a=>!['--apply','--check'].includes(a)))throw new Error('Gebruik --check of --apply.');
  const plan=JSON.parse(await readFile(new URL('../assistant/source-attachments.json',import.meta.url),'utf8'));
  const result=await syncAttachments(plan,{key:process.env.OPENAI_API_KEY,
    storeId:process.env.OPENAI_COURSE_VECTOR_STORE_ID,apply:args.includes('--apply')});
  console.log('Bronkoppeling: '+JSON.stringify(result));
  if(result.missing?.length||result.pending||result.failed)process.exitCode=1;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))
  main().catch(error=>{console.error(error.message);process.exitCode=1;});
