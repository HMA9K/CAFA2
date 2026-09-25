import test from 'node:test';
import assert from 'node:assert/strict';
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
