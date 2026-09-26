import {question} from './practice-question-renderer.mjs';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {practiceAuthoringHash} from './assistant-inputs.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(read(p));
const exists=p=>fs.existsSync(path.join(root,p));
const write=(p,v)=>{fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),v);};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const files={kap:'kapitaalbelangen',val:'vreemde-valuta',nvw:'consolidatie-nvw',hk:'consolidatie-hk'};
const ctx={window:{}};vm.createContext(ctx);
for(const name of ['config',...Object.values(files)])vm.runInContext(read(`data/${name}.js`),ctx);
const banks=ctx.window.CAFA2_DATA.modules;
const topics=json('content/practice/topics.json');
const topicGroups=json('content/practice/topic-groups.json');
const groupedTopicIds=topicGroups.flatMap(group=>group.topics);
if(groupedTopicIds.length!==topics.length||new Set(groupedTopicIds).size!==topics.length||groupedTopicIds.some(id=>!topics.some(topic=>topic.id===id)))throw Error('Elk onderwerp moet precies een keer in de syllabusindeling staan');
const topicGuidance=json('content/practice/topic-guidance.json');
const mapping=exists('content/practice/existing-map.json')?json('content/practice/existing-map.json'):[];
const registry=exists('content/practice/question-registry.json')?json('content/practice/question-registry.json'):{};
const next={};for(const c of Object.keys(files))next[c]=Math.max(30,...Object.values(registry).filter(x=>x.code===c).map(x=>x.id));
const authored=fs.readdirSync(path.join(root,'content/practice')).filter(f=>/^new-.*\.json$/.test(f)).sort().flatMap(f=>json('content/practice/'+f));
const additions={};for(const c of Object.keys(files))additions[c]=[];
const keys=new Set();
for(const raw of authored){
  if(keys.has(raw.key))throw Error('Dubbele nieuwe vraag: '+raw.key);keys.add(raw.key);
  const topic=topics.find(t=>t.id===raw.topicId);if(!topic)throw Error('Onbekend onderwerp '+raw.topicId);
  if(!raw.options||raw.options.length!==4||!Number.isInteger(raw.correct)||raw.correct<0||raw.correct>3)throw Error('Ongeldige opties '+raw.key);
  if(!raw.sources?.length||!raw.explanation?.length||!raw.pattern?.length||raw.options.some(o=>!o.why))throw Error('Onvolledige uitleg/bron '+raw.key);
  const assigned=registry[raw.key]||(registry[raw.key]={code:topic.group,id:++next[topic.group]});
  const code=assigned.code,id=assigned.id,rotation=(id+Object.keys(files).indexOf(code))%4;
  const options=raw.options.map((_,i)=>raw.options[(i+rotation)%4]);
  const refs=raw.sources.map((_,i)=>`topic-${raw.key}-${i}`);
  const q={...raw,id,options,correct:(raw.correct-rotation+4)%4,refs,related:[],variant:true,stage:0,
    pattern:raw.pattern.join(' '),guidance:{lesson:raw.lesson||topicGuidance[raw.topicId].lesson,title:topicGuidance[raw.topicId].title,rules:raw.rules||topicGuidance[raw.topicId].rules,pattern:raw.pattern},caseTables:raw.caseTables||[]};
  additions[code].push(q);
  mapping.push({questionId:`${code}-${id}`,topicId:raw.topicId,secondaryTopicIds:raw.secondaryTopicIds||[],reason:raw.skill||raw.task});
}
for(const c of Object.keys(files))additions[c].sort((a,b)=>a.id-b.id);
for(const [c,qs]of Object.entries(additions))qs.forEach((q,i)=>{if(q.id!==31+i)throw Error('Niet-aaneengesloten nieuwe IDs '+c+' '+q.id);});
write('content/practice/question-registry.json',JSON.stringify(registry,null,2)+'\n');
const frequency=exists('docs/mc-audit/exam-frequency.json')?json('docs/mc-audit/exam-frequency.json'):{examCount:11,topics:[]};
const topicData=topics.map(t=>({...t,questions:mapping.filter(m=>m.topicId===t.id).map(m=>m.questionId),frequency:frequency.topics?.find(x=>x.topicId===t.id)||null}));
write('data/practice-topics.js',`(function(){\nvar additions=${JSON.stringify(additions)};\nObject.keys(additions).forEach(function(code){var bank=window.CAFA2_DATA.modules[code];additions[code].forEach(function(q){q.sources.forEach(function(s,i){bank.sources[q.refs[i]]=s;});bank.questions.push(q);});});\nwindow.CAFA2_TOPICS=${JSON.stringify(topicData)};\nwindow.CAFA2_TOPIC_GROUPS=${JSON.stringify(topicGroups)};\nwindow.CAFA2_EXAM_FREQUENCY=${JSON.stringify(frequency)};\nwindow.CAFA2_PRACTICE_SOURCE_HASH=${JSON.stringify(practiceAuthoringHash(root))};\n})();\n`);

for(const [c,qs]of Object.entries(additions))write(`fragments/practice-additions-${c}.html`,qs.map(q=>question(q,c,30+qs.length)).join('\n'));
const total=120+authored.length;
write('docs/mc-audit/question-counts.json',JSON.stringify({total,existing:120,new:authored.length,topics:topicData.map(t=>({id:t.id,title:t.title,count:t.questions.length,existing:t.questions.filter(id=>+id.split('-')[1]<=30).length,examCount:t.frequency?.count??null}))},null,2)+'\n');
console.log(JSON.stringify({topics:topics.length,total,new:authored.length,counts:topicData.map(t=>[t.id,t.questions.length])}));
