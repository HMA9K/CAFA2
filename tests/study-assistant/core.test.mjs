import test from 'node:test';import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';import {readFile} from 'node:fs/promises';
import {buildCatalog,plain,publicOption,refKey} from '../../js/study-assistant-schema.mjs';
import {makeModelRequest,handle,consume} from '../../assistant/server/handler.mjs';
import {createCafa2Adapter} from '../../js/study-assistant-cafa2.mjs';
import {fixtureWindow} from './fixtures.mjs';
const catalog=buildCatalog(fixtureWindow());const ref={course:'CAFA2',kind:'practice',bankId:'kap',questionId:'1'};
const record=catalog.records[refKey(ref)];
const schema=await readFile(new URL('../../assistant/server/schema.sql',import.meta.url),'utf8');
function database(){const sql=new DatabaseSync(':memory:');sql.exec(schema);return {prepare(query){return {bind(...values){return {first:async()=>sql.prepare(query).get(Object.fromEntries(values.map((value,i)=>['?'+(i+1),value])))??null,run:async()=>sql.prepare(query).run(Object.fromEntries(values.map((value,i)=>['?'+(i+1),value])))}}}}};}
function environment(extra={}){return {STUDY_ASSISTANT_ENABLED:'true',OPENAI_API_KEY:'test-api-key-not-a-real-key',OPENAI_MODEL:'test-model',
  STUDY_ACCESS_CODE:'a-valid-test-code-123',STUDY_SESSION_SECRET:'test-session-secret-1234567890123456789',STUDY_DB:database(),...extra};}
const now=Date.UTC(2026,8,24,18,0,0);
function request(route,body,cookie,headers={}){return new Request('https://cafa2.pages.dev/api/study-'+route,{method:body===undefined?'GET':'POST',
  headers:{Origin:'https://cafa2.pages.dev','CF-Connecting-IP':'192.0.2.1',...(body===undefined?{}:{'Content-Type':'application/json'}),...(cookie?{Cookie:cookie}:{}),...headers},body:body===undefined?undefined:JSON.stringify(body)});}
function payload(extra={}){return {ref,revision:record.revision,mode:'hint',message:'Geef een hint.',history:[],studentAnswer:{text:'Mijn testantwoord',choice:1,rows:[],tables:[]},...extra};}
async function login(env,time=now){const response=await handle({request:request('auth',{code:env.STUDY_ACCESS_CODE}),env},catalog,{now:()=>time});assert.equal(response.status,200);return response.headers.get('Set-Cookie').split(';')[0];}
const modelResponse={status:'completed',output:[{type:'message',content:[{type:'output_text',text:'TESTANTWOORD, geen vakinhoudelijke beoordeling.',annotations:[{type:'file_citation',filename:'testbron.txt'}]}]}]};
const fetchOK=async()=>new Response(JSON.stringify(modelResponse),{headers:{'Content-Type':'application/json'}});
test('Catalogus bevat elke oefen- en tentamenvraag uit de fixture',()=>assert.deepEqual(catalog.counts,{practice:8,exam:4}));
test('Vraagverwijzing weigert padmanipulatie en onbekend vak',()=>{assert.throws(()=>refKey({...ref,questionId:'../../secret'}));assert.throws(()=>refKey({...ref,course:'OTHER'}));});
test('HTML-tabellen behouden rij- en kolomscheiding; scripts verdwijnen',()=>{assert.equal(plain('<table><tr><td>100</td><td>20</td></tr></table>'),'100\t20');assert.equal(plain('<script>alert(1)</script><p>A &amp; B &#8364;</p>'),'A & B €');});
test('Opties verliezen ook geneste correctheidsinformatie',()=>assert.deepEqual(publicOption({text:'A',why:'secret',nested:{isCorrect:true,rows:[['1','2']]}}),{text:'A',nested:{rows:[['1','2']]}}));
test('Ook begeleidende hulp krijgt het canonieke antwoordmodel mee',()=>{const value=makeModelRequest({record,mode:'hint',history:[],answer:{},message:'x'},environment());assert.ok(JSON.stringify(value).includes('SECRET_MODEL'));assert.equal(value.store,false);assert.equal(value.max_output_tokens,1800);assert.ok(!value.tools);});
test('Nakijken bevat uitwerking en uitleg',()=>{const value=makeModelRequest({record,mode:'review',history:[],answer:{},message:'x'},environment());assert.ok(JSON.stringify(value).includes('SECRET_MODEL'));});
test('Promptcontract vraagt controle van antwoordletter en herleiding van bedrag',()=>{
  const exam=catalog.records['CAFA2:exam:cafa2-test:vraag-4'];
  for(const [current,message] of [[record,'Waarom is B goed?'],[exam,'Waar komt dit bedrag uit de uitwerking vandaan?']]){
    const value=makeModelRequest({record:current,mode:'hint',history:[],answer:{},message},environment());
    const context=JSON.parse(value.input[0].content.split('\n').slice(1).join('\n'));
    assert.equal(value.input.at(-1).content,message);
    assert.equal(context.review.correct,current.review.correct);
    assert.ok(value.instructions.includes('0=A, 1=B'));
    assert.ok(value.instructions.includes("Corrigeer een onjuiste aanname"));
    assert.ok(value.instructions.includes('Herleid een gevraagd bedrag'));
  }
  assert.equal(record.review.correct,0);
  assert.equal(exam.review.correct,'a');
});
test('Beide stijlen kunnen dezelfde cursusuitwerkingen raadplegen',()=>{const env=environment({OPENAI_TUTOR_VECTOR_STORE_ID:'vs_theory',OPENAI_REVIEW_VECTOR_STORE_ID:'vs_review'});for(const [mode,expected] of [['hint','vs_review'],['review','vs_review']])assert.equal(makeModelRequest({record,mode,history:[],answer:{},message:'x'},env).tools[0].vector_store_ids[0],expected);});
test('Tentamencasus, andere deelvragen en tabel blijven in de context',()=>{const r=catalog.records['CAFA2:exam:cafa2-test:vraag-2'];assert.ok(r.context.caseText.includes('100'));assert.equal(r.context.relatedQuestions.length,3);assert.ok(r.context.prompt.includes('Voorraad'));assert.ok(!JSON.stringify(r.context).includes('SECRET_'));});
test('JournalRows en StockCells gaan niet verloren in de adapter',()=>{const adapter=createCafa2Adapter({});assert.deepEqual(adapter.answerValue({journalRows:[['A','100','']],stockCells:{'1:1':'100'},html:'<p>Mijn tekst</p>'}),{choice:null,optionId:null,text:'Mijn tekst',rows:[['A','100','']],tables:[{kind:'voorraadtabel',cells:{'1:1':'100'}}]});});
test('D1-quota gebruikt een atomische begrensde upsert',async()=>{const db=database();const values=await Promise.allSettled(Array.from({length:20},()=>consume(db,'same',5,99999)));assert.equal(values.filter(v=>v.status==='fulfilled').length,5);assert.equal(values.filter(v=>v.status==='rejected').length,15);});
test('Niet geconfigureerd: geen modelaanroep',async()=>{let calls=0;const env={};let r=await handle({request:request('status'),env},catalog);assert.equal((await r.json()).ready,false);r=await handle({request:request('chat',payload()),env},catalog,{fetch:async()=>{calls++}});assert.equal(r.status,503);assert.equal(calls,0);});
test('Cross-origin verzoek wordt geweigerd',async()=>assert.equal((await handle({request:request('chat',payload(),null,{Origin:'https://evil.invalid'}),env:environment()},catalog)).status,403));
test('Ontbrekende Origin wordt ook bij login geweigerd',async()=>{
  const env=environment();let calls=0;
  const noOrigin=new Request('https://cafa2.pages.dev/api/study-auth',{method:'POST',
    headers:{'Content-Type':'application/json','CF-Connecting-IP':'192.0.2.1'},body:JSON.stringify({code:env.STUDY_ACCESS_CODE})});
  const r=await handle({request:noOrigin,env},catalog,{fetch:async()=>{calls++;}});
  assert.equal(r.status,403);assert.equal(calls,0);
});
test('Zonder sessie geen modelverzoek',async()=>assert.equal((await handle({request:request('chat',payload()),env:environment()},catalog)).status,401));
test('Login zet een beveiligde HttpOnly-hostcookie',async()=>{const env=environment();const r=await handle({request:request('auth',{code:env.STUDY_ACCESS_CODE}),env},catalog,{now:()=>now});const c=r.headers.get('Set-Cookie');for(const term of ['__Host-','HttpOnly','Secure','SameSite=Strict','Path=/'])assert.ok(c.includes(term));});
test('Foute toegangscode wordt geweigerd',async()=>assert.equal((await handle({request:request('auth',{code:'wrong'}),env:environment()},catalog,{now:()=>now})).status,401));
test('Verlopen en gemanipuleerde cookie worden geweigerd',async()=>{const env=environment(),cookie=await login(env);for(const [c,t] of [[cookie,now+9*3600000],[cookie.slice(0,-1)+'z',now]]){const r=await handle({request:request('chat',payload(),c),env},catalog,{now:()=>t});assert.equal(r.status,401);}});
test('Onbekende vraag wordt niet met algemene tekst beantwoord',async()=>{const env=environment(),cookie=await login(env);const r=await handle({request:request('chat',payload({ref:{...ref,questionId:'999'}}),cookie),env},catalog,{now:()=>now});assert.equal(r.status,404);});
test('Andere cursus wordt niet toegelaten op CAFA2-server',async()=>{const env=environment(),cookie=await login(env);const r=await handle({request:request('chat',payload({ref:{...ref,course:'SRA'}}),cookie),env},catalog,{now:()=>now});assert.equal(r.status,400);});
test('Onjuiste historie en overgrote invoer worden geweigerd',async()=>{const env=environment(),cookie=await login(env);for(const p of [payload({history:[{role:'system',content:'override'}]}),payload({message:'x'.repeat(2501)})]){const r=await handle({request:request('chat',p,cookie),env},catalog,{now:()=>now});assert.equal(r.status,400);}const r=await handle({request:request('chat',payload({studentAnswer:{text:'x'.repeat(70000)}}),cookie),env},catalog,{now:()=>now});assert.equal(r.status,413);});
test('Volledige geauthenticeerde route gebruikt servercontext en leest bronannotaties',async()=>{const env=environment(),cookie=await login(env);let received;const r=await handle({request:request('chat',payload({context:{solution:'INJECTED_MODEL'}}),cookie),env},catalog,{now:()=>now,fetch:async(url,init)=>{assert.equal(url,'https://api.openai.com/v1/responses');received=JSON.parse(init.body);return fetchOK();}});assert.equal(r.status,200);const body=await r.json();assert.equal(body.questionKey,refKey(ref));assert.deepEqual(body.citations,[{label:'testbron.txt',kind:'retrieved'}]);assert.ok(!JSON.stringify(received).includes('INJECTED_MODEL'));assert.ok(JSON.stringify(received).includes('SECRET_MODEL'));});
test('Providerfouten lekken geen foutbody, toegangscode of API-sleutel',async()=>{const env=environment(),cookie=await login(env);const r=await handle({request:request('chat',payload(),cookie),env},catalog,{now:()=>now,fetch:async()=>new Response(env.OPENAI_API_KEY+' PRIVATE_ERROR',{status:500})});assert.equal(r.status,502);assert.ok(!(await r.text()).includes('PRIVATE_ERROR'));});
for(const [code,expected] of [
  ['credit_balance_exhausted','model_credits'],['organization_spend_limit_exceeded','model_spend_limit'],
  ['project_spend_limit_exceeded','model_spend_limit'],['organization_usage_limit_exceeded','model_usage_limit'],
  ['insufficient_quota','model_quota']
])test('API-tegoed en limieten krijgen een gerichte melding: '+code,async()=>{
  const env=environment(),cookie=await login(env);
  const r=await handle({request:request('chat',payload(),cookie),env},catalog,{now:()=>now,
    fetch:async()=>Response.json({error:{code,type:'insufficient_quota',message:env.OPENAI_API_KEY+' PRIVATE_ERROR'}},{status:429,headers:{'Retry-After':'60'}})});
  const body=await r.json();assert.equal(r.status,429);assert.equal(body.code,expected);
  assert.equal(r.headers.get('Retry-After'),null);assert.ok(!body.error.includes('PRIVATE_ERROR'));
  assert.ok(!body.error.includes(env.OPENAI_API_KEY));assert.ok(!body.error.includes('Probeer het later opnieuw'));
});
test('Tijdelijke providerlimiet behoudt Retry-After en onthult geen providermelding',async()=>{
  for(const code of ['rate_limit_exceeded','slow_down']){
    const env=environment(),cookie=await login(env);
    const r=await handle({request:request('chat',payload(),cookie),env},catalog,{now:()=>now,
      fetch:async()=>Response.json({error:{code,type:'rate_limit_error',message:'PRIVATE_ERROR'}},{status:429,headers:{'Retry-After':'120'}})});
    assert.equal(r.status,429);assert.equal(r.headers.get('Retry-After'),'120');
    const body=await r.json();assert.equal(body.code,'model_rate_limit');assert.ok(!body.error.includes('PRIVATE_ERROR'));
  }
});
test('Onbekende of onleesbare providerlimiet blijft veilig en verzint geen wachttijd',async()=>{
  for(const body of ['{bad json','X'.repeat(1_000_001),JSON.stringify({error:{code:'toString',message:'PRIVATE_ERROR'}})]){
    const env=environment(),cookie=await login(env);
    const r=await handle({request:request('chat',payload(),cookie),env},catalog,{now:()=>now,fetch:async()=>new Response(body,{status:429})});
    assert.equal(r.status,429);assert.equal(r.headers.get('Retry-After'),null);
    const result=await r.json();assert.equal(result.code,'model_service');assert.ok(!result.error.includes('PRIVATE_ERROR'));
  }
});
test('Eerder afgebroken browserrequest start geen modelaanroep',async()=>{
  const env=environment(),cookie=await login(env),abort=new AbortController();let calls=0;
  const stopped=new Request(request('chat',payload(),cookie),{signal:abort.signal});abort.abort();
  const r=await handle({request:stopped,env},catalog,{now:()=>now,fetch:async()=>{calls++;return fetchOK();}});
  assert.equal(r.status,504);assert.equal(calls,0);
});
test('Onvolledige en ongeldige modelresponsen worden veilig verwerkt',async()=>{
  for(const [body,expected] of [
    [{...modelResponse,status:'incomplete'},200],
    [{...modelResponse,status:'failed'},502],
    [{...modelResponse,output:{type:'message'}},502],
    [{...modelResponse,output:[null,{type:'message',content:[null]}]},502]
  ]){
    const env=environment(),cookie=await login(env);
    const r=await handle({request:request('chat',payload(),cookie),env},catalog,{now:()=>now,fetch:async()=>Response.json(body)});
    assert.equal(r.status,expected);
    if(expected===200)assert.equal((await r.json()).incomplete,true);
  }
});
test('Ongeldige of overgrote model-JSON leidt tot 502 zonder uitvoerlek',async()=>{
  for(const body of ['{bad json','X'.repeat(1_000_001)]){
    const env=environment(),cookie=await login(env);
    const r=await handle({request:request('chat',payload(),cookie),env},catalog,{now:()=>now,fetch:async()=>new Response(body)});
    assert.equal(r.status,502);assert.equal((await r.json()).code,'model_service');
  }
});
test('Globale daglimiet stopt extra modelcalls',async()=>{const env=environment({STUDY_DAILY_LIMIT:'1'}),cookie=await login(env);let calls=0;for(const status of [200,429]){const r=await handle({request:request('chat',payload(),cookie),env},catalog,{now:()=>now,fetch:async()=>{calls++;return fetchOK();}});assert.equal(r.status,status);}assert.equal(calls,1);});
test('Retry-After noemt het werkelijke einde van het quota-interval',async()=>{
  const env=environment({STUDY_DAILY_LIMIT:'1'}),cookie=await login(env);
  const context={now:()=>now,fetch:fetchOK};
  await handle({request:request('chat',payload(),cookie),env},catalog,context);
  const daily=await handle({request:request('chat',payload(),cookie),env},catalog,context);
  assert.equal(daily.status,429);assert.equal(daily.headers.get('Retry-After'),'21600');
  const loginEnv=environment();for(let i=0;i<8;i++)await login(loginEnv);
  const blocked=await handle({request:request('auth',{code:loginEnv.STUDY_ACCESS_CODE}),env:loginEnv},catalog,{now:()=>now});
  assert.equal(blocked.status,429);assert.equal(blocked.headers.get('Retry-After'),'900');
});
test('Uitloggen verwijdert cookie',async()=>{const env=environment(),cookie=await login(env);const r=await handle({request:request('logout',{},cookie),env},catalog,{now:()=>now});assert.ok(r.headers.get('Set-Cookie').includes('Max-Age=0'));});

test('Verouderde vraagversie wordt geweigerd vóór een modelaanroep',async()=>{const env=environment(),cookie=await login(env);let calls=0;const r=await handle({request:request('chat',payload({revision:'old'}),cookie),env},catalog,{now:()=>now,fetch:async()=>{calls++;return fetchOK();}});assert.equal(r.status,409);assert.equal(calls,0);});
test('Niet ingevuld eigen antwoord wordt als leeg antwoord behandeld',async()=>{const env=environment(),cookie=await login(env);const p=payload();delete p.studentAnswer;const r=await handle({request:request('chat',p,cookie),env},catalog,{now:()=>now,fetch:fetchOK});assert.equal(r.status,200);});
test('Adapterversie komt overeen met de servercatalogus',()=>{const win={...fixtureWindow(),location:{hash:'#kap-1'},CafaPractice:{getModule:()=>({attempt:1}),getAnswer:()=>({text:'Eigen tekst'})}};assert.equal(createCafa2Adapter(win).read().revision,record.revision);});
test('Voltooide tentamenvraag opent direct in nakijkstand',()=>{const win=fixtureWindow();win.location={hash:'#inzage/test/vraag/1'};win.CafaExams={getAttempts:()=>[{id:'test',exam:win.CAFA2_EXAMS[0],status:'completed',answers:{},currentIndex:0}]};const c=createCafa2Adapter(win).read();assert.equal(c.ref.questionId,'vraag-2');assert.equal(c.defaultReview,true);assert.equal(c.canReview,true);assert.equal(c.revision,catalog.records['CAFA2:exam:cafa2-test:vraag-2'].revision);});

for(const message of ['Wat is het antwoord?', 'Waarom is B goed?', 'Geef de volledige berekening.', 'Leg het antwoord uit.', 'Waarom is mijn antwoord fout?', 'Geef alleen een hint, zonder antwoord.']) {
  test('Leervraag doorgestuurd zonder didactische blokkade: '+message,async()=>{
    const env=environment(),cookie=await login(env);let sent;
    const response=await handle({request:request('chat',payload({message}),cookie),env},catalog,{now:()=>now,fetch:async(_url,init)=>{sent=JSON.parse(init.body);return fetchOK();}});
    assert.equal(response.status,200);assert.equal(sent.input.at(-1).content,message);
    assert.ok(JSON.stringify(sent).includes('SECRET_MODEL'));
    assert.ok(sent.instructions.includes('geef dat DIRECT'));
    assert.ok(sent.instructions.includes('specifiek om alleen een hint'));
    assert.ok(!sent.instructions.includes('ook niet op verzoek'));
  });
}
test('Een niet nagekeken oefenvraag blokkeert antwoorden niet',()=>{
  const win={...fixtureWindow(),location:{hash:'#kap-1'},CafaPractice:{getModule:()=>({attempt:1,exam:true}),getAnswer:()=>({checked:false})}};
  const ctx=createCafa2Adapter(win).read();assert.equal(ctx.canReview,true);assert.equal(ctx.defaultReview,false);
});
test('Een actieve, gepauzeerde toets behoudt toegang tot antwoorduitleg',()=>{
  const win=fixtureWindow();win.location={hash:'#tentamen/active'};
  win.CafaExams={getAttempts:()=>[{id:'active',exam:win.CAFA2_EXAMS[0],status:'active',pausedAt:123,answers:{},currentIndex:0}]};
  const ctx=createCafa2Adapter(win).read();assert.equal(ctx.canReview,true);assert.equal(ctx.paused,true);
});
test('Voorkeur voor één cursusstore gaat voor oudere configuratievelden',()=>{
  const env=environment({OPENAI_COURSE_VECTOR_STORE_ID:'vs_course',OPENAI_REVIEW_VECTOR_STORE_ID:'vs_review'});
  for(const mode of ['hint','review'])assert.equal(makeModelRequest({record,mode,history:[],answer:{},message:'x'},env).tools[0].vector_store_ids[0],'vs_course');
});
