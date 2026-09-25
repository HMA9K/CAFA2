import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {syncAttachments,validateAttachments} from '../../scripts/sync-assistant-store.mjs';
const plan={version:1,storeId:'vs_course',files:[{id:'file-one',filename:'Opgave.pdf'},{id:'file-two',filename:'Uitwerking.pdf'}]};
function api({wrongName=false,fail=false}={}){
  const attached=new Set(['file-one']),writes=[];
  return {writes,fetcher:async(url,options)=>{
    const p=new URL(url).pathname.replace('/v1','');let value;
    if(options.method==='POST'){
      assert.equal(p,'/vector_stores/vs_course/file_batches');
      const data=JSON.parse(options.body);writes.push(data);
      data.file_ids.forEach(id=>attached.add(id));value={id:'vsfb_batch'};
    }else if(p==='/vector_stores/vs_course/files')value={data:[...attached].map(id=>({id,status:'completed'})),has_more:false};
    else if(p.startsWith('/files/')){
      const file=plan.files.find(f=>'/files/'+f.id===p);value={...file,purpose:'assistants',...(wrongName?{filename:'Andere cursus.pdf'}:{})};
    }else if(p==='/vector_stores/vs_course')value={file_counts:{total:attached.size,failed:0,in_progress:0}};
    else value={id:p.split('/').at(-1),status:fail?'failed':'completed'};
    return new Response(JSON.stringify(value),{status:200});
  }};
}
test('documentbankcheck is alleen-lezen en meldt de ontbrekende uitwerking',async()=>{
  const remote=api();const r=await syncAttachments(plan,{key:'test-key-no-secret',...remote});
  assert.deepEqual(r.missing,['Uitwerking.pdf']);assert.equal(remote.writes.length,0);
});

test('publicatie wacht begrensd op gelijktijdig toegevoegde bestanden in dezelfde bank',async()=>{
  const remote=api();let polls=0,waits=0;
  const fetcher=async(url,options)=>{
    if(new URL(url).pathname==='/v1/vector_stores/vs_course')return Response.json({file_counts:{total:3,failed:0,in_progress:++polls<3?1:0}});
    return remote.fetcher(url,options);
  };
  const result=await syncAttachments(plan,{key:'test-key-no-secret',apply:true,fetcher,sleep:async()=>{waits++;},attempts:3});
  assert.equal(result.pending,0);assert.equal(polls,3);assert.equal(waits,2);assert.equal(remote.writes.length,1);
});
test('blijvende indexeerwachttijd of mislukte bestanden geven geen schijnsucces',async()=>{
  for(const counts of [{total:3,failed:0,in_progress:1},{total:3,failed:1,in_progress:0}]){
    const remote=api();const fetcher=async(url,options)=>new URL(url).pathname==='/v1/vector_stores/vs_course'?Response.json({file_counts:counts}):remote.fetcher(url,options);
    await assert.rejects(syncAttachments(plan,{key:'test-key-no-secret',apply:true,fetcher,sleep:async()=>{},attempts:2}),/niet volledig|niet worden geïndexeerd/);
  }
});
test('koppelen bewaart bestaande bestanden en is herhaalbaar zonder duplicaten',async()=>{
  const remote=api();const opts={key:'test-key-no-secret',apply:true,...remote};
  assert.equal((await syncAttachments(plan,opts)).completed,2);
  assert.deepEqual(remote.writes,[{file_ids:['file-two']}]);
  assert.equal((await syncAttachments(plan,opts)).added,0);assert.equal(remote.writes.length,1);
});
test('verkeerde bank of bestandsidentiteit blokkeert voordat er iets wordt gekoppeld',async()=>{
  const remote=api({wrongName:true});
  await assert.rejects(syncAttachments(plan,{key:'test-key-no-secret',storeId:'vs_other',apply:true,...remote}),/wijkt af/);
  await assert.rejects(syncAttachments(plan,{key:'test-key-no-secret',apply:true,...remote}),/identiteit/);
  assert.equal(remote.writes.length,0);
  assert.throws(()=>validateAttachments({...plan,files:[plan.files[0],plan.files[0]]}),/dubbel/);
});
test('mislukte indexering en ruwe providerfouten worden niet als succes weergegeven',async()=>{
  await assert.rejects(syncAttachments(plan,{key:'test-key-no-secret',apply:true,...api({fail:true})}),/niet worden geïndexeerd/);
  await assert.rejects(syncAttachments(plan,{key:'test-key-no-secret',fetcher:async()=>new Response('SECRET INPUT',{status:403})}),e=>/HTTP 403/.test(e.message)&&!e.message.includes('SECRET'));
});

test('alle afwijkende bestanden worden tegelijk gemeld zonder iets te koppelen',async()=>{
  const remote=api({wrongName:true});let checked=0;
  const fetcher=async(url,options)=>{if(new URL(url).pathname.startsWith('/v1/files/'))checked++;return remote.fetcher(url,options);};
  await assert.rejects(syncAttachments(plan,{key:'test-key-no-secret',apply:true,fetcher}),error=>
    error.message.includes('(2)')&&error.message.includes('Opgave.pdf')&&error.message.includes('Uitwerking.pdf'));
  assert.equal(checked,2);assert.equal(remote.writes.length,0);
});

test('dubbele spaties zijn onderdeel van de exacte bestandsidentiteit',async()=>{
  const remote=api();
  const spaced={...plan,files:[plan.files[0],{...plan.files[1],filename:'Uitwerking  .pdf'}]};
  await assert.rejects(syncAttachments(spaced,{key:'test-key-no-secret',apply:true,...remote}),/identiteit/);
  assert.equal(remote.writes.length,0);
});

test('de volledige koppellijst gebruikt de letterlijke namen uit het bronmanifest',async()=>{
  const read=async name=>JSON.parse(await readFile(new URL('../../assistant/'+name,import.meta.url),'utf8'));
  const attachments=await read('source-attachments.json'),manifest=await read('source-manifest.json');
  const names=new Set(Object.values(manifest.groups).flat().map(p=>p.split('/').at(-1)));
  const originals=new Set(Object.values(manifest.groups).flat()),snapshot=await read('source-snapshot.json');
  const derived=await read('source-derived.json');
  for(const file of derived.files){
    assert.ok(originals.has(file.source),'Afgeleid document moet naar een echte oorspronkelijke bron verwijzen');
    assert.equal(snapshot.files.find(x=>x.relative===file.source)?.sourceHash,file.sourceHash,'Genereer de zoekbare versie opnieuw bij een gewijzigde presentatie');
    assert.match(file.uploadHash,/^[a-f0-9]{64}$/);assert.ok(!names.has(file.filename));
    if(file.status==='quarantined')assert.ok(!attachments.files.some(x=>x.filename===file.filename),'Een afgekeurde afgeleide bron mag niet automatisch opnieuw worden gekoppeld');
    else names.add(file.filename);
  }
  validateAttachments(attachments);
  for(const file of attachments.files)assert.ok(names.has(file.filename),`Naam ontbreekt letterlijk in bronmanifest: ${file.filename}`);
});
