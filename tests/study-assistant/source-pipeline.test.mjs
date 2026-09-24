import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {planSources,preflightUpload,uploadSources,validateSourceManifest} from '../../scripts/prepare-assistant-sources.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
const manifest=JSON.parse(await readFile(path.resolve(here,'../../assistant/source-manifest.json'),'utf8'));

async function fixture(fn){
  const folder=await mkdtemp(path.join(tmpdir(),'cafa2-sources-test-'));
  try{return await fn(folder);}
  finally{
    if(path.dirname(folder)!==tmpdir()||!path.basename(folder).startsWith('cafa2-sources-test-'))throw new Error('Onveilige tijdelijke map.');
    await rm(folder,{recursive:true,force:true});
  }
}

test('manifest heeft expliciete originele bronsets, inclusief repetitieslides en 2026-tentamenpaar',()=>{
  validateSourceManifest(manifest);
  assert.equal(Object.values(manifest.groups).reduce((n,items)=>n+items.length,0),95);
  assert.equal(manifest.groups['repetition-slides'].filter(x=>x.endsWith('.ppt')).length,11);
  assert.equal(manifest.groups['repetition-slides'].filter(x=>x.endsWith('.pptx')).length,10);
  assert.equal(manifest.groups['repetition-slides'].filter(x=>x.endsWith('.pdf')).length,2);
  assert.equal(manifest.groups.exams.length,22);
  assert.ok(manifest.groups.exams.some(x=>x.includes('20260429 Tentamen')));
  assert.ok(Object.values(manifest.groups).flat().every(x=>!path.isAbsolute(x)&&!x.includes('Overige/')));
});

test('ontbrekende en geconverteerde oude slides worden onderscheiden',async()=>fixture(async folder=>{
  const originals=path.join(folder,'originals'),conversions=path.join(folder,'converted');
  await mkdir(path.join(originals,'Repetitiecursus','Slides'),{recursive:true});
  await mkdir(path.join(conversions,'Slides'),{recursive:true});
  await writeFile(path.join(originals,'Repetitiecursus','Slides','legacy.ppt'),'origineel');
  await writeFile(path.join(originals,'Repetitiecursus','Slides','new.pptx'),'presentatie');
  const sample={version:1,groups:{slides:['Repetitiecursus/Slides/legacy.ppt','Repetitiecursus/Slides/new.pptx','Repetitiecursus/Slides/missing.pdf']}};
  let plan=await planSources({manifest:sample,sourceRoot:originals,convertedRoot:conversions});
  assert.deepEqual(plan.counts,{selected:3,ready:1,direct:1,converted:0,conversionRequired:1,missing:1,invalid:0});
  assert.equal(plan.entries[0].convertedRelative,'Slides/legacy.pdf');
  await writeFile(path.join(conversions,'Slides','legacy.pdf'),'conversie');
  plan=await planSources({manifest:sample,sourceRoot:originals,convertedRoot:conversions});
  assert.deepEqual(plan.counts,{selected:3,ready:2,direct:1,converted:1,conversionRequired:0,missing:1,invalid:0});
  assert.equal(plan.entries[0].status,'ready_converted');
  assert.ok(plan.entries[0].flags.includes('conversie-visueel-controleren'));
}));

test('manifest verwerpt padontsnapping en dubbele selectie',async()=>fixture(async folder=>{
  assert.throws(()=>validateSourceManifest({version:1,groups:{x:['../bron.pdf']}}),/Ongeldig bronpad/);
  assert.throws(()=>validateSourceManifest({version:1,groups:{x:['a.pdf','a.pdf']}}),/Dubbel bronpad/);
  await assert.rejects(()=>planSources({manifest:{version:1,groups:{x:['a.pdf']}},sourceRoot:folder,groups:['x','x']}),/dubbel geselecteerd/);
}));

test('remote upload vereist expliciete groep, rechtencontrole en slidecontrole',()=>{
  const plan={groups:['repetition-slides'],counts:{selected:1,ready:1}};
  assert.throws(()=>preflightUpload(plan,{groups:[]}),/expliciete --group/);
  assert.throws(()=>preflightUpload(plan,{groups:['repetition-slides']}),/externe verwerking/i);
  assert.throws(()=>preflightUpload(plan,{groups:['repetition-slides'],confirmExternal:true}),/broncontrole/i);
  assert.throws(()=>preflightUpload(plan,{groups:['repetition-slides'],confirmExternal:true,confirmContent:true}),/slide-review/);
  assert.throws(()=>preflightUpload({...plan,counts:{selected:1,ready:0}},{groups:['repetition-slides'],confirmExternal:true,confirmContent:true,confirmSlides:true}),/Upload geweigerd/);
});

test('upload gebruikt Files en vector-store-indexering pas voor volledig formaatklare selectie',async()=>fixture(async folder=>{
  const doc=path.join(folder,'test.pdf');await writeFile(doc,'%PDF-test');
  let plan=await planSources({manifest:{version:1,groups:{sample:['test.pdf']}},sourceRoot:folder});
  const requests=[];
  const fakeFetch=async(url,options)=>{
    requests.push({url,options});
    const id=requests.length;
    return new Response(JSON.stringify(id===1?{id:'vs_test'}:id===2?{id:'file_test'}:id===3?{id:'file_test',status:'in_progress'}:{id:'file_test',status:'completed'}),{status:200,headers:{'Content-Type':'application/json'}});
  };
  assert.deepEqual(await uploadSources(plan,{key:'test-key',fetcher:fakeFetch}),{storeId:'vs_test',completed:1});
  assert.deepEqual(requests.map(x=>new URL(x.url).pathname),['/v1/vector_stores','/v1/files','/v1/vector_stores/vs_test/files','/v1/vector_stores/vs_test/files/file_test']);
  assert.equal(requests[1].options.body.get('purpose'),'assistants');
  assert.equal(requests[1].options.body.get('file').name,'test.pdf');
  assert.deepEqual(JSON.parse(requests[2].options.body),{file_id:'file_test'});
  plan.counts.ready=0;
  await assert.rejects(()=>uploadSources(plan,{key:'test-key',fetcher:fakeFetch}),/niet volledig formaatklaar/);
  assert.equal(requests.length,4);
}));
