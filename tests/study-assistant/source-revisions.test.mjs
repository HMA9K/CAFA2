import test from 'node:test';import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';import {tmpdir} from 'node:os';import path from 'node:path';
import {fingerprint,compareSnapshots,snapshotSources} from '../../scripts/check-assistant-source-revisions.mjs';
import {planSources} from '../../scripts/prepare-assistant-sources.mjs';
const file=(relative,sourceHash='a'.repeat(64),uploadHash=sourceHash)=>({relative,sourceHash,uploadHash});
const snapshot=files=>({version:1,files});
test('een echt bronplan levert bruikbare hashes zonder absolute paden in de momentopname',async()=>{
  const dir=await mkdtemp(path.join(tmpdir(),'cafa-source-plan-'));try{
    await mkdir(path.join(dir,'docs'));await writeFile(path.join(dir,'docs','opgave.pdf'),'testdocument');
    const plan=await planSources({manifest:{version:1,groups:{course:['docs/opgave.pdf']},scanRoots:{course:['docs']}},sourceRoot:dir});
    const result=await snapshotSources(plan);assert.equal(result.files.length,1);
    assert.equal(result.files[0].sourceHash,result.files[0].uploadHash);assert.ok(!JSON.stringify(result).includes(dir));
  }finally{await rm(dir,{recursive:true,force:true});}
});
test('vervangen broninhoud onder dezelfde naam en bestandsgrootte wordt gevonden',async()=>{
  const dir=await mkdtemp(path.join(tmpdir(),'cafa-source-revision-'));try{
    const target=path.join(dir,'opgave.pdf');await writeFile(target,'bedrag 100');const before=await fingerprint(target);
    await writeFile(target,'bedrag 200');const after=await fingerprint(target);
    assert.deepEqual(compareSnapshots(snapshot([file('opgave.pdf',before)]),snapshot([file('opgave.pdf',after)])),{added:[],changed:['opgave.pdf'],removed:[]});
  }finally{await rm(dir,{recursive:true,force:true});}
});
test('ook een gewijzigde slideconversie, nieuwe bron en verwijderde bron worden afzonderlijk gemeld',()=>{
  const before=snapshot([file('slides.ppt'),file('oud.pdf')]);
  const after=snapshot([file('slides.ppt','a'.repeat(64),'b'.repeat(64)),file('nieuw.pdf')]);
  assert.deepEqual(compareSnapshots(before,after),{added:['nieuw.pdf'],changed:['slides.ppt'],removed:['oud.pdf']});
  assert.deepEqual(compareSnapshots(after,after),{added:[],changed:[],removed:[]});
});
test('een beschadigde of dubbele momentopname kan geen schone controle opleveren',()=>{
  const good=snapshot([file('opgave.pdf')]);for(const bad of [snapshot([]),snapshot([file('../opgave.pdf')]),snapshot([file('opgave.pdf','oops')]),snapshot([file('opgave.pdf'),file('opgave.pdf')])])
    assert.throws(()=>compareSnapshots(bad,good),/Ongeldige/);
});
