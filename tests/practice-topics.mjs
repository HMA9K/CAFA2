import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'),json=p=>JSON.parse(read(p));
const codes={kap:'kapitaalbelangen',val:'vreemde-valuta',nvw:'consolidatie-nvw',hk:'consolidatie-hk'},ctx={window:{}};vm.createContext(ctx);
for(const f of ['config',...Object.values(codes)])vm.runInContext(read('data/'+f+'.js'),ctx);
const originals=JSON.parse(JSON.stringify(ctx.window.CAFA2_DATA.modules));
vm.runInContext(read('data/practice-topics.js'),ctx);
const banks=ctx.window.CAFA2_DATA.modules,topics=ctx.window.CAFA2_TOPICS;
const groups=JSON.parse(JSON.stringify(ctx.window.CAFA2_TOPIC_GROUPS));
assert.deepEqual(groups,json('content/practice/topic-groups.json'),'Published syllabus groups match their source');
const grouped=groups.flatMap(group=>group.topics);
assert.equal(grouped.length,19);assert.equal(new Set(grouped).size,19);
assert.deepEqual([...grouped].sort(),Array.from(topics,topic=>topic.id).sort(),'Every existing topic remains reachable exactly once');
const added=Object.values(banks).flatMap(b=>b.questions.filter(q=>q.id>30));
const raw=fs.readdirSync(new URL('../content/practice/',import.meta.url)).filter(f=>/^new-.*\.json$/.test(f)).flatMap(f=>json('content/practice/'+f));
assert.equal(topics.length,19);assert.equal(added.length,127);assert.equal(raw.length,127);
const primary=topics.flatMap(t=>Array.from(t.questions));assert.equal(primary.length,247);assert.equal(new Set(primary).size,247,'Elke vraag precies één primair onderwerp');
const registry=json('content/practice/question-registry.json'),positions=[0,0,0,0];
let calculations=0;
for(const [code,b]of Object.entries(banks)){
 assert.deepEqual(JSON.parse(JSON.stringify(b.questions.slice(0,30))),originals[code].questions,'Bestaande vragen behouden inhoud en volgorde');
 const fragment=read('fragments/practice-additions-'+code+'.html');
 assert.ok(Buffer.byteLength(fragment)<900000);
 for(const [i,q]of b.questions.entries()){
  const uid=code+'-'+q.id;assert.equal(q.id,i+1);assert.ok(primary.includes(uid));
  if(q.id<=30)continue;
  assert.ok(fragment.includes('id="'+uid+'"'));assert.equal(registry[q.key].id,q.id);assert.equal(registry[q.key].code,code);
  const source=raw.find(x=>x.key===q.key);assert.ok(source);assert.deepEqual(JSON.parse(JSON.stringify(q.options[q.correct])),source.options[source.correct],'Optie en waarom moeten samen roteren');
  positions[q.correct]++;assert.equal(q.options.length,4);assert.ok(q.options.every(o=>o.why.length>25));
  assert.equal(q.guidance.pattern.length,3);assert.ok(q.guidance.rules.length>80);assert.ok(q.guidance.lesson);
  assert.ok(q.sources.every(s=>s.file&&s.pages&&s.label));assert.equal(new Set(q.options.map(o=>JSON.stringify(o.text||o.table))).size,4);
  if(q.check){assert.ok(Math.abs(q.check.actual-q.check.expected)<.005,q.key);calculations++;}
 }
}
for(const t of topics){assert.ok(t.questions.length>=10,t.id);assert.equal(t.frequency.total,11);assert.equal(t.frequency.count,t.frequency.exams.length);assert.equal(new Set(t.frequency.exams.map(e=>e.id)).size,t.frequency.count);}
assert.ok(positions.every(n=>n>=25&&n<=38),'Geen voorspelbare juiste antwoordpositie');
const f=json('docs/mc-audit/exam-frequency.json');assert.equal(f.exams.length,11);assert.equal(new Set(f.exams.map(e=>e.id)).size,11);
const frequencyHtml=read('tentamenfrequentie.html');for(const t of topics)assert.ok(frequencyHtml.includes(t.title));
console.log(`Onderwerpen gevalideerd: 247 vragen, 19 onderwerpen, 11 unieke tentamens, ${calculations} rekencontroles, antwoordposities ${positions.join('/')}.`);
