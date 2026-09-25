import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {listAssistantDataScripts,assistantInputHashes,practiceAuthoringHash} from '../../scripts/assistant-inputs.mjs';
import {buildCatalog} from '../../js/study-assistant-schema.mjs';
const repositoryRoot=path.resolve(import.meta.dirname,'../..');

test('de gegenereerde MC-vragen komen uit de actuele bronbestanden',async()=>{
  const generated=await readFile(path.join(repositoryRoot,'data/practice-topics.js'),'utf8');
  const sourceHash=practiceAuthoringHash(repositoryRoot);
  assert.ok(generated.includes(`window.CAFA2_PRACTICE_SOURCE_HASH="${sourceHash}";`));
});

test('een nieuw databestand moet zowel in de browser als in de assistentbuild worden geladen',async()=>{
  const root=await mkdtemp(path.join(os.tmpdir(),'cafa2-assistant-inputs-'));
  try{
    await mkdir(path.join(root,'data'));
    await writeFile(path.join(root,'data','basis.js'),'window.CAFA2_DATA = {};');
    let html='<script src="data/basis.js"></script>';
    assert.deepEqual(await listAssistantDataScripts(root,html),['data/basis.js']);
    const before=await assistantInputHashes(root,['data/basis.js']);
    await writeFile(path.join(root,'data','nieuw-tentamen.js'),'window.CAFA2_EXAMS = [];');
    await assert.rejects(()=>listAssistantDataScripts(root,html),/nieuw-tentamen\.js/);
    html+='<script src="data/nieuw-tentamen.js?v=2"></script>';
    assert.deepEqual(await listAssistantDataScripts(root,html),['data/basis.js','data/nieuw-tentamen.js']);
    await writeFile(path.join(root,'data','basis.js'),'window.CAFA2_DATA = {modules:{}};');
    const after=await assistantInputHashes(root,['data/basis.js']);
    assert.notDeepEqual(after,before);
  }finally{await rm(root,{recursive:true,force:true});}
});

test('een later toegevoegde MC-vraag en tentamenvraag krijgen automatisch eigen records',()=>{
  const practice={title:'Kapitaalbelangen',questions:[{id:1,title:'Eerste vraag',type:'mc',task:'Kies een antwoord.',options:[{text:'A'},{text:'B'}],correct:1}]};
  const exam={id:'nieuw-examen',title:'Nieuw tentamen',questions:[{id:'vraag-1',type:'open',prompt:'Bereken het bedrag.',solution:'100'}]};
  const win={CAFA2_DATA:{modules:{kap:practice}},CAFA2_EXAMS:[exam]};
  const before=buildCatalog(win);
  assert.deepEqual(before.counts,{practice:1,exam:1});
  practice.questions.push({id:2,title:'Nieuwe MC-vraag',type:'mc',task:'Welke journaalpost klopt?',options:[{text:'A'},{text:'B'}],correct:0});
  exam.questions.push({id:'vraag-2',type:'open',prompt:'Maak de journaalpost.',solution:'Debet 100, credit 100'});
  const after=buildCatalog(win);
  assert.deepEqual(after.counts,{practice:2,exam:2});
  assert.equal(after.records['CAFA2:practice:kap:2'].review.correct,0);
  assert.match(after.records['CAFA2:exam:nieuw-examen:vraag-2'].review.solution,/Debet 100/);
});
