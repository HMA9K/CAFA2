import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,writeFile,rm,mkdir,symlink} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
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
  assert.deepEqual(Object.keys(manifest.scanRoots).sort(),Object.keys(manifest.groups).sort());
  assert.equal(Object.values(manifest.groups).reduce((n,items)=>n+items.length,0),116);
  assert.equal(manifest.groups['syllabus-2025'].length,3);
  assert.equal(manifest.groups['syllabus-exercises-2025'].length,12);
  assert.equal(manifest.groups['additional-materials'].length,4);
  assert.equal(manifest.groups['college-exam-pair-2022'].length,2);
  assert.match(manifest.excluded['Thieu Mooren/vragen Hamudi en Karim.docx'],/Persoonlijke vragen/);
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
  const sample={version:1,scanRoots:{slides:['Repetitiecursus/Slides']},
    groups:{slides:['Repetitiecursus/Slides/legacy.ppt','Repetitiecursus/Slides/new.pptx','Repetitiecursus/Slides/missing.pdf']}};
  let plan=await planSources({manifest:sample,sourceRoot:originals,convertedRoot:conversions});
  assert.deepEqual(plan.counts,{selected:3,ready:1,direct:1,converted:0,conversionRequired:1,missing:1,invalid:0,excluded:0,
    unclassified:0,scanIssues:0});
  assert.equal(plan.entries[0].convertedRelative,'Slides/legacy.pdf');
  await writeFile(path.join(conversions,'Slides','legacy.pdf'),'conversie');
  plan=await planSources({manifest:sample,sourceRoot:originals,convertedRoot:conversions});
  assert.deepEqual(plan.counts,{selected:3,ready:2,direct:1,converted:1,conversionRequired:0,missing:1,invalid:0,excluded:0,
    unclassified:0,scanIssues:0});
  assert.equal(plan.entries[0].status,'ready_converted');
  assert.ok(plan.entries[0].flags.includes('conversie-visueel-controleren'));
}));

test('manifest verwerpt padontsnapping en dubbele selectie',async()=>fixture(async folder=>{
  const scanRoots={x:['docs']};
  assert.throws(()=>validateSourceManifest({version:1,scanRoots,groups:{x:['../bron.pdf']}}),/Ongeldig bronpad/);
  assert.throws(()=>validateSourceManifest({version:1,scanRoots,groups:{x:['docs/a.pdf','docs/a.pdf']}}),/Dubbel bronpad/);
  assert.throws(()=>validateSourceManifest({version:1,scanRoots:{x:['../outside']},groups:{x:['docs/a.pdf']}}),/scanmap/i);
  assert.throws(()=>validateSourceManifest({version:1,scanRoots,groups:{x:['other/a.pdf']}}),/buiten de scanmap/);
  await assert.rejects(()=>planSources({manifest:{version:1,scanRoots,groups:{x:['docs/a.pdf']}},sourceRoot:folder,groups:['x','x']}),/dubbel geselecteerd/);
}));

test('nieuw bestand in toegestane scanmap is zichtbaar en blokkeert alle uploads',async()=>fixture(async folder=>{
  const source=path.join(folder,'sources');await mkdir(path.join(source,'docs','nieuw'),{recursive:true});
  await writeFile(path.join(source,'docs','bekend.pdf'),'%PDF-bekend');
  await writeFile(path.join(source,'docs','nieuw','extra.PDF'),'%PDF-nieuw');
  await writeFile(path.join(source,'docs','negeer.txt'),'Geen ondersteund formaat');
  const sample={version:1,scanRoots:{syllabus:['docs']},groups:{syllabus:['docs/bekend.pdf']}};
  const plan=await planSources({manifest:sample,sourceRoot:source,groups:['syllabus']});
  assert.equal(plan.counts.ready,1);
  assert.deepEqual(plan.unclassified,[{group:'syllabus',relative:'docs/nieuw/extra.PDF',status:'unclassified'}]);
  assert.equal(plan.counts.unclassified,1);
  assert.equal(plan.counts.scanIssues,0);
  assert.throws(()=>preflightUpload(plan,{groups:['syllabus'],confirmExternal:true,confirmContent:true}),/geclassificeerd/);
  await assert.rejects(()=>uploadSources(plan,{key:'test-key',fetcher:async()=>{throw new Error('Mag niet aanroepen');}}),/geclassificeerd/);
}));

test('nieuwe bestanden in een niet gekozen groep blijven zichtbaar en blokkeren upload',async()=>fixture(async folder=>{
  const source=path.join(folder,'sources');await mkdir(path.join(source,'docs'),{recursive:true});
  await mkdir(path.join(source,'exams'),{recursive:true});
  await writeFile(path.join(source,'docs','bekend.pdf'),'%PDF-bekend');
  await writeFile(path.join(source,'exams','bekend.pdf'),'%PDF-bekend');
  await writeFile(path.join(source,'exams','nieuw.pdf'),'%PDF-nieuw');
  const sample={version:1,scanRoots:{syllabus:['docs'],exams:['exams']},
    groups:{syllabus:['docs/bekend.pdf'],exams:['exams/bekend.pdf']}};
  const plan=await planSources({manifest:sample,sourceRoot:source,groups:['syllabus']});
  assert.equal(plan.counts.selected,1);
  assert.deepEqual(plan.unclassified.map(item=>item.relative),['exams/nieuw.pdf']);
  assert.throws(()=>preflightUpload(plan,{groups:['syllabus'],confirmExternal:true,confirmContent:true}),/alle brongroepen/);
  const complete=await planSources({manifest:sample,sourceRoot:source});
  assert.throws(()=>preflightUpload(complete,{groups:complete.groups,confirmExternal:true,confirmContent:true}),/geclassificeerd/);
}));

test('symbolische link in bronmap wordt niet gevolgd en blokkeert upload',async()=>fixture(async folder=>{
  const source=path.join(folder,'sources'),outside=path.join(folder,'outside');
  await mkdir(path.join(source,'docs'),{recursive:true});await mkdir(outside);
  await writeFile(path.join(source,'docs','bekend.pdf'),'%PDF-bekend');
  await writeFile(path.join(outside,'extern.pdf'),'%PDF-extern');
  await symlink(outside,path.join(source,'docs','link'),process.platform==='win32'?'junction':'dir');
  const sample={version:1,scanRoots:{syllabus:['docs']},groups:{syllabus:['docs/bekend.pdf']}};
  const plan=await planSources({manifest:sample,sourceRoot:source});
  assert.deepEqual(plan.scanIssues,[{group:'syllabus',relative:'docs/link',status:'symlink'}]);
  assert.equal(plan.counts.unclassified,0);
  assert.throws(()=>preflightUpload(plan,{groups:['syllabus'],confirmExternal:true,confirmContent:true}),/geclassificeerd/);
}));

test('expliciet uitgesloten document is zichtbaar en komt niet in de uploadselectie',async()=>fixture(async folder=>{
  const source=path.join(folder,'sources');await mkdir(path.join(source,'docs'),{recursive:true});
  await writeFile(path.join(source,'docs','bekend.pdf'),'%PDF-bekend');
  await writeFile(path.join(source,'docs','persoonlijk.docx'),'Eigen vragen');
  const sample={version:1,scanRoots:{course:['docs']},groups:{course:['docs/bekend.pdf']},
    excluded:{'docs/persoonlijk.docx':'Persoonlijke aantekeningen'}};
  const plan=await planSources({manifest:sample,sourceRoot:source});
  assert.equal(plan.counts.unclassified,0);
  assert.deepEqual(plan.excluded,[{relative:'docs/persoonlijk.docx',reason:'Persoonlijke aantekeningen'}]);
  assert.deepEqual(plan.entries.map(x=>x.relative),['docs/bekend.pdf']);
  assert.throws(()=>validateSourceManifest({...sample,excluded:{'docs/bekend.pdf':'dubbel'}}),/uitsluiting/);
}));

test('--check geeft exitcode bij nieuw document en slaagt na classificatie',async()=>fixture(async folder=>{
  const source=path.join(folder,'sources'),manifestFile=path.join(folder,'manifest.json');
  await mkdir(path.join(source,'docs'),{recursive:true});
  await writeFile(path.join(source,'docs','bekend.pdf'),'%PDF-bekend');
  await writeFile(path.join(source,'docs','nieuw.pdf'),'%PDF-nieuw');
  const sample={version:1,scanRoots:{course:['docs']},groups:{course:['docs/bekend.pdf']}};
  await writeFile(manifestFile,JSON.stringify(sample));
  const script=path.resolve(here,'../../scripts/prepare-assistant-sources.mjs');
  const args=[script,'--source-root',source,'--manifest',manifestFile,'--check'];
  let result=spawnSync(process.execPath,args,{encoding:'utf8'});
  assert.equal(result.status,1);
  assert.match(result.stdout,/NIET GECLASSIFICEERD course: docs\/nieuw.pdf/);
  assert.match(result.stderr,/Broncontrole faalt/);
  sample.groups.course.push('docs/nieuw.pdf');
  await writeFile(manifestFile,JSON.stringify(sample));
  result=spawnSync(process.execPath,args,{encoding:'utf8'});
  assert.equal(result.status,0,result.stderr);
  assert.match(result.stdout,/0 niet geclassificeerd, 0 scanproblemen/);
  sample.groups.course.push('docs/ontbreekt.pdf');
  await writeFile(manifestFile,JSON.stringify(sample));
  result=spawnSync(process.execPath,args,{encoding:'utf8'});
  assert.equal(result.status,1);
  assert.match(result.stdout,/1 ontbrekend/);
  assert.match(result.stderr,/Broncontrole faalt/);
}));

test('remote upload vereist expliciete groep, rechtencontrole en slidecontrole',()=>{
  const plan={groups:['repetition-slides'],allGroups:['repetition-slides'],counts:{selected:1,ready:1}};
  assert.throws(()=>preflightUpload(plan,{groups:[]}),/--all-groups/);
  assert.throws(()=>preflightUpload(plan,{groups:['repetition-slides']}),/externe verwerking/i);
  assert.throws(()=>preflightUpload(plan,{groups:['repetition-slides'],confirmExternal:true}),/broncontrole/i);
  assert.throws(()=>preflightUpload(plan,{groups:['repetition-slides'],confirmExternal:true,confirmContent:true}),/slide-review/);
  assert.throws(()=>preflightUpload({...plan,allGroups:['repetition-slides','exams']},
    {groups:['repetition-slides'],confirmExternal:true,confirmContent:true,confirmSlides:true}),/alle brongroepen/);
  assert.throws(()=>preflightUpload({...plan,counts:{selected:1,ready:0}},{groups:['repetition-slides'],confirmExternal:true,confirmContent:true,confirmSlides:true}),/Upload geweigerd/);
});

test('upload gebruikt Files en vector-store-indexering pas voor volledig formaatklare selectie',async()=>fixture(async folder=>{
  await mkdir(path.join(folder,'docs'));
  const doc=path.join(folder,'docs','test.pdf');await writeFile(doc,'%PDF-test');
  let plan=await planSources({manifest:{version:1,scanRoots:{sample:[{path:'docs',recursive:false}]},
    groups:{sample:['docs/test.pdf']}},sourceRoot:folder});
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
