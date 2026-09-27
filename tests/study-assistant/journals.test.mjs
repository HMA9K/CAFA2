/** Source column regression and mocked provider validation, not a model-quality evaluation. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {DatabaseSync} from 'node:sqlite';
import {buildCatalog,refKey} from '../../js/study-assistant-schema.mjs';
import {canonicalJournals,journalContract,validatedJournalAnswer,JournalValidationError,cents} from '../../assistant/server/journals.mjs';
import {makeModelRequest,handle} from '../../assistant/server/handler.mjs';
const win={},box=vm.createContext({window:win});
for(const [,src] of fs.readFileSync('index.html','utf8').matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/gi)){
  const file=src.split('?')[0];if(file.startsWith('data/'))new vm.Script(fs.readFileSync(file,'utf8')).runInContext(box,{timeout:5000});
}
const catalog=buildCatalog(win),record=catalog.records['CAFA2:exam:cafa2-20260429:vraag-18'];
const contract=journalContract(record,'Geef de volledige journaalpost voor 5B.'),source=contract.sources.find(s=>s.rows.length===7);
const typed=parts=>JSON.stringify({parts}),sourcePart={type:'source_journal',sourceId:source.id,rowIndices:[]};
const wrong='- Debet: Resultaat na belastingen € 23.040\n- Debet: Belastinglast € 5.760\n- Debet: Aandeel derden € 9.600\n- Credit: Belastinglast € 2.400\n- Credit: Resultaat na belastingen € 5.760\n- Credit: Belastinglast € 1.440\n- Credit: Kostprijs van de omzet € 48.000';
test('2026 opgave 3 vraag 5B houdt zes debetregels en één creditregel',()=>{
  assert.deepEqual(source.rows.map(r=>[r.account,r.debit,r.credit]),[
    ['Resultaat na belastingen','€ 23.040',''],['Belastinglast','€ 5.760',''],['Aandeel derden','€ 9.600',''],
    ['Belastinglast','€ 2.400',''],['Resultaat na belastingen','€ 5.760',''],['Belastinglast','€ 1.440',''],['Aan Kostprijs van de omzet','','€ 48.000']]);
  assert.deepEqual(source.totals,{debit:4800000,credit:4800000,balanced:true});
  const result=validatedJournalAnswer(typed([sourcePart]),contract);
  for(const amount of ['2.400','5.760','1.440'])assert.match(result.answer,new RegExp('\\| (?:Belastinglast|Resultaat na belastingen) \\| € '+amount.replace('.','\\.')+' \\|  \\|'));
  assert.match(result.answer,/48\.000,00 = totaal credit 48\.000,00/);
});
test('de gemelde debet-creditverwisseling kan niet via vrije tekst worden weergegeven',()=>{
  assert.throws(()=>validatedJournalAnswer(typed([{type:'text',text:wrong}]),contract),e=>e.code==='unstructured_journal');
});
test('een brononderdeel kan rekening, bedrag of boekingszijde niet overschrijven',()=>{
  for(const extra of [{rows:[]},{debit:0,credit:48000},{title:'Anders'}])assert.throws(()=>validatedJournalAnswer(typed([{...sourcePart,...extra}]),contract),JournalValidationError);
  assert.throws(()=>validatedJournalAnswer(typed([{type:'derived_journal',title:'Officieel',reason:'Test',rows:[]}]),contract),JournalValidationError);
});
test('onbekende, dubbele en verkeerde vraagregels worden geweigerd',()=>{
  for(const p of [{...sourcePart,sourceId:'other-question'},{...sourcePart,rowIndices:[99]},{...sourcePart,rowIndices:[-1]},{...sourcePart,rowIndices:[1,1]}])
    assert.throws(()=>validatedJournalAnswer(typed([p]),contract),JournalValidationError);
});
test('toelichting op één regel toont een bronfragment zonder valse balansclaim',()=>{
  const result=validatedJournalAnswer(typed([{type:'text',text:'De uitwerking gebruikt hier dezelfde zijde als bij de overige correcties.'},{...sourcePart,rowIndices:[3]}]),contract);
  assert.match(result.answer,/bronfragment/);assert.match(result.answer,/\| Belastinglast \| € 2\.400 \|  \|/);assert.doesNotMatch(result.answer,/totaal credit|23\.040/);
});
test('alle expliciete regelnummers vormen een volledige bronboeking in bronvolgorde',()=>{
  const result=validatedJournalAnswer(typed([{...sourcePart,rowIndices:[6,5,4,3,2,1,0]}]),contract);
  assert.match(result.answer,/volgens de uitwerking/);assert.match(result.answer,/totaal debet/);
  assert.ok(result.answer.indexOf('Resultaat na belastingen')<result.answer.indexOf('Aan Kostprijs van de omzet'));
});
test('alleen een hint blijft mogelijk zonder bronboekingen of volledig antwoord',()=>{
  const result=validatedJournalAnswer(typed([{type:'text',text:'Begin met de nog niet gerealiseerde winst in de voorraad.'}]),contract);
  assert.equal(result.validation.sourceJournals,0);assert.doesNotMatch(result.answer,/48\.000|Rekening/);
});
test('rekeningcodes, vraagverwijzingen en percentages zonder boekingsbedrag zijn gewone uitleg',()=>{
  const result=validatedJournalAnswer(typed([{type:'text',text:'Bij vraag 5 staat rekening 0.. Goodwill aan de debetkant. Het aandeel is 70%.'}]),contract);
  assert.match(result.answer,/debetkant/);
  assert.doesNotThrow(()=>validatedJournalAnswer(typed([{type:'text',text:'Rekening 0.. Goodwill staat debet; het aandeel is 70%.'}]),contract));
});
test('geldbedragen gebruiken Nederlandse decimalen zonder tekens te verbergen',()=>{
  assert.equal(cents('€ 23.040'),2304000);assert.equal(cents('−1.234,50'),-123450);assert.equal(cents(1.01),101);
  for(const value of ['120 × 25%',Infinity,0.001,'unknown'])assert.equal(cents(value),null);
});
test('broninconsistentie blijft zichtbaar en wordt nooit stilzwijgend aangepast',()=>{
  const sources=canonicalJournals('Test\nRekening\tDebet\tCredit\nBank\t100\nAan Opbrengst\t\t90');
  const result=validatedJournalAnswer(typed([{type:'source_journal',sourceId:'J1',rowIndices:[]}]),{sources,derivedAllowed:false});
  assert.match(result.answer,/sluit niet aan/);assert.match(result.answer,/100,00 debet tegenover 90,00 credit/);
});
test('oude uitwerkingen met alleen spaties worden niet op vermoedelijke kolomposities ingelezen',()=>{
  assert.deepEqual(canonicalJournals('                 Debet        Credit\nBank             € 100\nAan Opbrengst                  € 100'),[]);
});
test('voorraadtabel en goodwillberekening worden niet als journaalpost verwerkt',()=>{
  assert.deepEqual(canonicalJournals('Datum\tVoorraad\tBedrag\n2026\t100\t€ 2.000'),[]);
  const r=catalog.records['CAFA2:exam:cafa2-20260429:vraag-1'];assert.equal(journalContract({...r,context:{...r.context,prompt:'Bereken goodwill.',type:'open'},review:{solution:'Stap\tBerekening\tUitkomst\n1\t100 × 80%\t80'}},'Leg de berekening uit.'),null);
});
test('MC-journaalpost komt uit de canonieke juiste optie, ook bij een fout veronderstelde letter',()=>{
  const r=catalog.records['CAFA2:practice:kap:13'],c=journalContract(r,'Waarom is B goed?');
  assert.equal(c.sources[0].title,'Antwoord C');assert.equal(JSON.stringify(c.sources[0].rows.map(x=>Object.values(x))),JSON.stringify(r.context.options[2].journal));
});
const variant=journalContract(record,'Wat als de bedragen anders zijn?');
const derived={type:'derived_journal',title:'Alternatieve boeking',reason:'Nieuwe bedragen in euro volgens de gewijzigde casus.',rows:[{account:'Bank',debit:100,credit:null},{account:'Aan Opbrengst',debit:null,credit:100}]};
test('een toegestane afleiding krijgt een afzonderlijk label en berekende aansluiting',()=>{
  const result=validatedJournalAnswer(typed([derived]),variant);assert.equal(result.validation.derivedJournals,1);assert.match(result.answer,/afleiding/);assert.match(result.answer,/100,00 = totaal credit 100,00/);
  assert.doesNotMatch(result.answer,/volgens de uitwerking/);
});
test('afleiding met onbalans, twee zijden, te veel decimalen of negatieve bedragen wordt geweigerd',()=>{
  for(const patch of [{credit:90},{debit:100},{credit:-100},{credit:100.001}])
    assert.throws(()=>validatedJournalAnswer(typed([{...derived,rows:[derived.rows[0],{...derived.rows[1],...patch}]}]),variant),JournalValidationError);
});
test('modelverzoek levert vaste bronkolommen en een strikt uitvoerschema',()=>{
  const req=makeModelRequest({record,mode:'hint',history:[],answer:{rows:[['Eigen','1','']]},message:'Geef de journaalpost.'},{OPENAI_MODEL:'test-model'});
  assert.equal(req.text.format.strict,true);assert.equal(req.text.format.type,'json_schema');assert.equal(req.store,false);
  const context=JSON.parse(req.input[0].content.split('\n').slice(1).join('\n'));assert.deepEqual(context.sourceJournals,contract.sources);assert.deepEqual(context.studentAnswer.rows,[['Eigen','1','']]);
});
function environment(){const db=new DatabaseSync(':memory:');db.exec(fs.readFileSync('assistant/server/schema.sql','utf8'));return {STUDY_ASSISTANT_ENABLED:'true',OPENAI_MODEL:'test-model',OPENAI_API_KEY:'test-key-never-real',STUDY_ACCESS_CODE:'test-access-code-only',STUDY_SESSION_SECRET:'test-secret-never-real-1234567890123456',STUDY_DB:{prepare(query){return {bind(...args){const values=Object.fromEntries(args.map((v,i)=>['?'+(i+1),v]));return {first:async()=>db.prepare(query).get(values),run:async()=>db.prepare(query).run(values)};}}}}};}
function request(route,body,cookie,signal){return new Request('https://cafa2.pages.dev/api/study-'+route,{method:'POST',signal,headers:{Origin:'https://cafa2.pages.dev','CF-Connecting-IP':'192.0.2.1','Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})},body:JSON.stringify(body)});}
async function chat(responses,{abortOnFirst=false,message='Geef de boeking voor 5B.'}={}){
  const env=environment(),login=await handle({request:request('auth',{code:env.STUDY_ACCESS_CODE}),env},catalog),cookie=login.headers.get('Set-Cookie').split(';')[0],sent=[],abort=new AbortController();
  const response=await handle({request:request('chat',{ref:record.ref,revision:record.revision,mode:'hint',message,history:[],studentAnswer:{text:'Testantwoord'}},cookie,abort.signal),env},catalog,{fetch:async(url,options)=>{
    sent.push(JSON.parse(options.body));if(abortOnFirst)abort.abort();
    return Response.json(responses[Math.min(sent.length-1,responses.length-1)]);
  }});return {response,sent,env};
}
const response=text=>({status:'completed',output:[{type:'message',content:[{type:'output_text',text}]}]});
test('ongeldige journaalpost krijgt precies één herstelpoging en alleen de gevalideerde bron verschijnt',async()=>{
  const {response:r,sent}=await chat([response(wrong),response(typed([sourcePart]))]);assert.equal(r.status,200);assert.equal(sent.length,2);
  const body=await r.json();assert.equal(body.questionKey,refKey(record.ref));assert.equal(body.validation.sourceJournals,1);assert.match(body.answer,/\| Belastinglast \| € 2\.400 \|  \|/);
  assert.doesNotMatch(JSON.stringify(sent[1]),/Credit: Belastinglast/);assert.equal(sent[1].input.at(-1).content,sent[0].input.at(-1).content);
});
test('twee mislukte uitvoercontroles tonen geen ongecontroleerd antwoord of geheim',async()=>{
  const {response:r,sent,env}=await chat([response(typed([{type:'text',text:wrong}]))]);assert.equal(r.status,502);assert.equal(sent.length,2);
  const body=await r.json();assert.equal(body.code,'journal_validation');assert.doesNotMatch(JSON.stringify(body),/48\.000|23\.040/);assert.ok(!JSON.stringify(body).includes(env.OPENAI_API_KEY));
});
test('afgebroken verzoek begint geen herstelpoging',async()=>{
  const {response:r,sent}=await chat([response(wrong)],{abortOnFirst:true});assert.equal(r.status,504);assert.equal(sent.length,1);
});
test('afgebroken JSON wordt niet als gedeeltelijke journaalpost getoond',async()=>{
  const {response:r,sent}=await chat([{...response(typed([sourcePart])),status:'incomplete'},response(typed([sourcePart]))]);assert.equal(r.status,200);assert.equal(sent.length,2);
});
test('weigering wordt zonder ongecontroleerde extra tekst en zonder herstel weergegeven',async()=>{
  const {response:r,sent}=await chat([{status:'completed',output:[{type:'message',content:[{type:'refusal',refusal:'refusal'},{type:'output_text',text:wrong}]}]}]);
  assert.equal(r.status,200);assert.equal(sent.length,1);assert.doesNotMatch((await r.json()).answer,/48\.000/);
});
