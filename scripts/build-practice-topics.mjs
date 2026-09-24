import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

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
write('data/practice-topics.js',`(function(){\nvar additions=${JSON.stringify(additions)};\nObject.keys(additions).forEach(function(code){var bank=window.CAFA2_DATA.modules[code];additions[code].forEach(function(q){q.sources.forEach(function(s,i){bank.sources[q.refs[i]]=s;});bank.questions.push(q);});});\nwindow.CAFA2_TOPICS=${JSON.stringify(topicData)};\nwindow.CAFA2_TOPIC_GROUPS=${JSON.stringify(topicGroups)};\nwindow.CAFA2_EXAM_FREQUENCY=${JSON.stringify(frequency)};\n})();\n`);

function table(t){return `<div class="table-wrap"><table>${t.caption?`<caption>${esc(t.caption)}</caption>`:''}<thead><tr>${t.headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${t.rows.map(r=>`<tr>${r.map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;}
function option(o){return o.table?table(o.table):`<p class="option-text">${esc(o.text)}</p>`;}
function sources(q){return `<details class="source"><summary>Bron en oorspronkelijke opgave</summary><div class="source-content"><p><strong>Eigen oefenvariant.</strong> De bron levert de getoetste systematiek; namen en bedragen kunnen afwijken.</p>${q.sources.map(s=>`<p>${esc(s.label)} (${esc(s.file)}, PDF p. ${esc(s.pages)})</p>`).join('')}</div></details>`;}
function pattern(q){return `<div class="pattern learning-pattern"><b>Herken het patroon</b>${q.guidance.pattern.map(p=>`<p>${esc(p)}</p>`).join('')}</div>`;}
function model(q){return `${pattern(q)}<div class="model-caption">JUISTE UITWERKING · ANTWOORD ${'ABCD'[q.correct]}</div><div class="option-content">${option(q.options[q.correct])}</div><div class="explanation">${q.explanation.map(p=>`<p>${esc(p)}</p>`).join('')}</div>${sources(q)}`;}
function question(q,c,total){const uid=`${c}-${q.id}`;return `<section class="screen question frame" id="${uid}" data-code="${c}" data-q="${q.id}" data-added="true"><input class="sr-only flagbox" type="checkbox" id="flag-${uid}" aria-label="Markeer vraag ${q.id}"><header class="question-header"><div class="qidentity"><span>VRAAG</span><span class="qnum">${q.id}</span><span class="type-label">${esc(q.type)}</span></div><span class="question-count">${q.id} van ${total}</span></header><div class="qbody"><h2 class="qtitle">${esc(q.title)}</h2><p class="intro">${esc(q.intro)}</p><dl class="facts">${(q.facts||[]).map(([a,b])=>`<div class="fact"><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl>${q.caseTables.map(table).join('')}<p class="task">${esc(q.task)}</p>${sources(q)}<input class="sr-only mode-radio" type="radio" id="mc-${uid}" name="mode-${uid}" value="mc" checked><input class="sr-only mode-radio" type="radio" id="own-${uid}" name="mode-${uid}" value="own"><div class="mode-switch"><label for="mc-${uid}">Meerkeuze</label><label for="own-${uid}">Zelf uitwerken</label></div><form class="mc-area" autocomplete="off" aria-label="Meerkeuzeantwoord op vraag ${q.id}">${q.options.map((_,i)=>`<input type="radio" class="sr-only answer-radio" id="a-${uid}-${i}" name="answer-${uid}" value="${i}" aria-label="Antwoord ${'ABCD'[i]}">`).join('')}<div class="instruction">Kies de juiste uitwerking</div><div class="views js-only" aria-label="Antwoordopties bekijken"><button type="button" data-view="all">Alles</button>${[0,1,2,3].map(i=>`<button type="button" data-view="${i}">${'ABCD'[i]}</button>`).join('')}</div><div class="options">${q.options.map((o,i)=>`<label class="option" id="option-${uid}-${i}" for="a-${uid}-${i}" data-option="${i}"><span class="option-header"><span class="bubble">${'ABCD'[i]}</span><span class="select-hint">Tik om te kiezen</span></span><span class="option-content">${option(o)}</span></label>`).join('')}</div><div class="clear-line"><button class="btn compact" type="reset" data-clear>Verwijder antwoord</button><span class="choice-status js-only" data-choice-status></span></div><details class="review mc-review"><summary>Nakijken</summary><div class="review-content"><p class="no-choice">Kies eerst een antwoord. De uitwerking verschijnt daarna.</p>${q.options.map((o,i)=>`<div class="feedback-part for-${i} ${i===q.correct?'good':'bad'}"><b>${i===q.correct?'Goed':'Niet goed'}</b><p>${esc(o.why)}</p></div>`).join('')}<div class="correct-model">${model(q)}</div><p class="score-note js-only" data-score-note></p></div></details></form><div class="own-area"><div class="instruction">Vul je eigen antwoord in</div><textarea class="own-editor" placeholder="Schrijf hier je antwoord en berekening…" aria-label="Eigen uitwerking" spellcheck="false"></textarea><p class="editor-hint">Vrije uitwerkingen worden niet automatisch inhoudelijk beoordeeld.</p><details class="review own-review"><summary>Vergelijk met de uitwerking</summary><div class="review-content">${model(q)}<div class="self-grades js-only"><span>Mijn zelfbeoordeling:</span><button class="btn compact" type="button" data-self-grade="good">Goed</button><button class="btn compact" type="button" data-self-grade="bad">Opnieuw oefenen</button></div><p class="score-note js-only" data-self-note></p></div></details></div><p class="exam-info">Tentamenstand: de uitwerkingen worden zichtbaar nadat je dit onderdeel voltooit.</p></div><footer class="question-nav"><div class="nav-left"><a class="btn" href="#${c}-${q.id-1}">Vorige</a><a class="btn primary" href="#${q.id<total?c+'-'+(q.id+1):'resultaat-'+c}">Volgende</a></div><div class="nav-right"><span class="auto-score-inline js-only" data-inline-score="${c}"></span><a class="btn" href="#overzicht-${c}" data-overview="${c}">Overzicht</a><label class="flag-label" for="flag-${uid}">Markeren</label><a class="btn extra-nav" href="#resultaat-${c}">Voltooien</a></div></footer></section>`;}
for(const [c,qs]of Object.entries(additions))write(`fragments/practice-additions-${c}.html`,qs.map(q=>question(q,c,30+qs.length)).join('\n'));
const total=120+authored.length;
write('docs/mc-audit/question-counts.json',JSON.stringify({total,existing:120,new:authored.length,topics:topicData.map(t=>({id:t.id,title:t.title,count:t.questions.length,existing:t.questions.filter(id=>+id.split('-')[1]<=30).length,examCount:t.frequency?.count??null}))},null,2)+'\n');
console.log(JSON.stringify({topics:topics.length,total,new:authored.length,counts:topicData.map(t=>[t.id,t.questions.length])}));
