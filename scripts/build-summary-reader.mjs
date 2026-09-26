import {summaryBrand} from '../content/study/brand.mjs';
import {decorateTables} from '../content/summary/table-layout.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import '../content/summary/addenda.mjs';
import '../content/summary/visuals.mjs';
import kap from '../content/summary/kap.mjs';
import val from '../content/summary/val.mjs';
import cons from '../content/summary/cons.mjs';
import {sources} from '../content/summary/sources.mjs';
import {esc} from '../content/summary/helpers.mjs';
import {chapters,topicTitles} from '../content/summary/reader-chapters.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const write=(p,s)=>fs.writeFileSync(path.join(root,p),s);
const topics=[...kap,...val,...cons],map=new Map(topics.map(t=>[t.id,t]));
const included=chapters.flatMap(c=>c.sections.flatMap(s=>s.parts));
if(included.length!==40||new Set(included).size!==40||included.some(id=>!map.has(id)))throw Error('De hoofdstukindeling moet ieder bestaand onderwerp precies eenmaal bevatten.');
const prior=read('samenvatting.html');
function refs(items){return items.map(s=>{const [key,detail]=s.split('|');if(!sources[key])throw Error('Onbekende bron '+key);return '<p><a href="#source-'+key+'">'+esc(sources[key].file)+'</a> ('+esc(detail||sources[key].note)+')</p>';}).join('');}
const paragraphs=items=>items.map(s=>'<p>'+esc(s)+'</p>').join('');
const nav=chapters.map((c,i)=>'<a class="reader-link" data-chapter-link="'+c.id+'" href="#'+c.id+'"><span class="reader-no">'+(i+1)+'</span><span>'+esc(c.title)+'</span></a>').join('');
function clean(html){
 // Ledger descriptions follow syllabus names; the surrounding explanation identifies the additional share.
 html=html.replaceAll('Resultaat boekjaar (aanvullend meerderheidsdeel)','Resultaat boekjaar').replaceAll('Resultaat na belastingen (aanvullend meerderheidsdeel)','Resultaat na belastingen').replaceAll('Voorziening belastingen (aanvullend)','Voorziening belastingen');
 return html.replaceAll('aanvullend meerderheidsdeel','aanvullende correctie op het geconsolideerde resultaat').replaceAll('aanvullende meerderheidskolom','kolom Eliminatie t.l.v. geconsolideerd resultaat');}
function renderChapter(c,index){
 const jump=c.sections.map((s,j)=>'<a href="#'+c.id+'--'+s.id+'">'+(index+1)+'.'+(j+1)+' '+esc(s.title)+'</a>').join('');
 const sections=c.sections.map((s,j)=>{
  const number=(index+1)+'.'+(j+1);
  return '<details class="reader-section" id="'+c.id+'--'+s.id+'" '+(j===0?'open':'')+'><summary><span class="section-number">'+number+'</span><span>'+esc(s.title)+'</span></summary><div class="section-body"><div class="reader-explanation">'+paragraphs(s.text)+'</div><div class="reader-topic-jumps">'+(s.parts.length>1?s.parts.map(id=>'<a href="#'+id+'">'+esc(topicTitles[id])+'</a>').join(''):'')+'</div>'+s.parts.map(id=>{
   const t=map.get(id);
   return '<div class="reader-topic" id="'+id+'" data-lesson="'+id+'" data-topic-title="'+esc(topicTitles[id])+'"><h3'+(s.parts.length===1?' class="sr-only"':'')+'>'+esc(topicTitles[id])+'</h3>'+clean(t.html)+'<details class="reader-sources"><summary>Bronnen en vindplaatsen</summary>'+refs(t.sources)+'</details></div>';
  }).join('')+'</div></details>';
 }).join('');
 const previous=chapters[index-1],next=chapters[index+1];
 return '<article class="reader-chapter" data-view="'+c.id+'" data-chapter="'+c.id+'" id="'+c.id+'"><header class="lesson-top"><p class="summary-kicker">'+esc(c.phase)+' · Hoofdstuk '+(index+1)+'</p><h1 tabindex="-1">'+esc(c.title)+'</h1><nav class="reader-jump" aria-label="In dit hoofdstuk">'+jump+'</nav><div class="chapter-intro">'+paragraphs(c.intro)+'</div><div class="reader-actions"><button type="button" data-sections="open" class="study-button">Alles uitklappen</button><button type="button" data-sections="close" class="study-button">Alles inklappen</button></div></header>'+sections+'<footer class="reader-chapter-end"><p class="reader-continuation">'+(next?'Hierna: '+esc(next.title)+'. De uitleg bouwt voort op dit hoofdstuk.':'Alle consolidatiemethoden komen samen in de voorraad- en resultaataansluiting. Gebruik de tentamenaanpak om de volledige uitwerking te controleren.')+'</p><button type="button" class="study-button" data-chapter-understood="'+c.id+'" aria-pressed="false">Markeer hoofdstuk als begrepen</button><div class="reader-prevnext">'+(previous?'<a class="study-button" href="#'+previous.id+'">← '+esc(previous.title)+'</a>':'<a class="study-button" href="#start">← Overzicht</a>')+(next?'<a class="study-button primary" href="#'+next.id+'">'+esc(next.title)+' →</a>':'<a class="study-button primary" href="#tentamen">Tentamenaanpak →</a>')+'</div><details class="reader-sources"><summary>Grondslag van dit hoofdstuk</summary>'+refs(c.refs)+'</details></footer></article>';
}
const tools=[['kernschema','IC-kernschema'],['begrippen','Begrippen'],['bronnen','Bronnen'],['tentamen','Tentamenaanpak']];
const toolPages=tools.map(([id])=>{
 const re=new RegExp('<section class="summary-page"(?: data-view="[^"]*")? data-lesson="'+id+'"[\\s\\S]*?<\\/section>');
 const m=prior.match(re);if(!m)throw Error('Bestaand hulpmiddel ontbreekt: '+id);
 return m[0].replace(/\sdata-view="[^"]*"/,'').replace('class="summary-page"','class="summary-page" data-view="'+id+'"');
}).join('');
const overview='<section class="summary-page" data-lesson="start" data-view="start" id="start"><p class="summary-kicker">CAFA2 · Interactieve samenvatting</p><h1 tabindex="-1">Van kapitaalbelang naar geconsolideerde jaarrekening</h1><p class="reader-lead">Zeven hoofdstukken verbinden de begrippen, berekeningen en journaalposten uit de syllabus. De schema’s ondersteunen de uitleg; uitgewerkte voorbeelden laten zien hoe de stappen op elkaar aansluiten.</p><p>Begin bij kapitaalbelangen om de kwalificatie en waardering vast te stellen. Daarna volgen de verwerking bij de moeder en het omrekenen van buitenlandse deelnemingen. Het consolidatieproces brengt deze onderwerpen bij elkaar. De laatste hoofdstukken werken de eliminaties uit bij nettovermogenswaarde, verkrijgingsprijs en de bijzondere consolidatievraagstukken.</p><label for="study-search">Zoek een begrip of onderwerp</label><input class="study-search" id="study-search" type="search" placeholder="Bijvoorbeeld dividend, monetaire positie of sidestream"><ul class="search-results" id="study-search-results"></ul><div class="reader-overview">'+chapters.map((c,i)=>'<a href="#'+c.id+'" class="reader-overview-row"><span class="reader-no">'+(i+1)+'</span><span><strong>'+esc(c.title)+'</strong><small>'+esc(c.sections.map(s=>s.title).join(' · '))+'</small></span><span aria-hidden="true">›</span></a>').join('')+'</div><p class="source-note">Gebaseerd op de aangeleverde CAFA2-syllabi, college-uitwerkingen en tentamenuitwerkingen. Bronverwijzingen blijven bij de betreffende uitleg en voorbeelden staan.</p><div class="reader-tools">'+tools.map(([id,title])=>'<a class="study-button" href="#'+id+'">'+title+'</a>').join('')+'</div></section>';
const meta={chapters:chapters.map((c,i)=>({id:c.id,title:c.title,number:i+1,parts:c.sections.flatMap(s=>s.parts)})),aliases:{overzicht:'start',nvwhk:'streams','nvw-hk':'streams',vergelijking:'streams',consolidatie:'consolidatieproces',downstream:'downstream-nvw',upstream:'upstream-nvw',begrippenlijst:'begrippen','materieel-vast-actief':'mva',tentamenaanpak:'tentamen'}};
const tabs='<a data-tool-link="summary" href="#start">Samenvatting</a>'+tools.filter(([id])=>!['kernschema','begrippen','bronnen'].includes(id)).map(([id,label])=>'<a data-route="'+id+'" data-tool-link="'+id+'" href="#'+id+'">'+label+'</a>').join('');
const json=JSON.stringify(meta).replace(/</g,'\\u003c');
const html='<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#444159"><meta name="color-scheme" content="light"><title>CAFA2 · Interactieve samenvatting</title><link rel="stylesheet" href="css/summary.css?v=reader3"><link rel="stylesheet" href="css/summary-reader.css?v=reader3"><link rel="stylesheet" href="css/summary-tables.css?v=mobile4"><script id="reader-map" type="application/json">'+json+'</script><script defer src="js/summary-reader.js?v=mobile4"></script><script data-goatcounter="https://cafa2.goatcounter.com/count" data-goatcounter-settings=\'{"no_onload":true}\' async src="https://gc.zgo.at/count.js"></script><script defer src="js/page-analytics.js?v=20260926-1"></script></head><body class="cafa-study reader-layout"><a class="reader-skip" href="#reader-main">Naar de inhoud</a><header class="reader-topbar">'+summaryBrand+'<div class="reader-top-tools"><a href="index.html#start">Home</a><button type="button" data-font="-1" aria-label="Tekst kleiner">A−</button><button type="button" data-font="1" aria-label="Tekst groter">A+</button><button type="button" data-print class="reader-desktop-print">Afdrukken</button></div></header><nav class="reader-tabs" aria-label="Studiehulpmiddelen">'+tabs+'</nav><div class="reader-layout-grid"><aside class="reader-sidebar"><p class="side-head">Inhoud</p><nav aria-label="Hoofdstukken">'+nav+'</nav><p id="study-progress" class="reader-progress"></p><a class="reader-practice-link" href="index.html#oefenen">Naar oefenvragen →</a><a class="reader-practice-link" href="index.html#dashboard">Naar tentamens →</a></aside><div class="reader-mobilebar"><details id="reader-mobile-menu"><summary aria-label="Hoofdstukken openen">☰ <span>Inhoud</span></summary><nav aria-label="Mobiele hoofdstukken"><a class="reader-menu-overview" href="#start">Vakoverzicht</a>'+nav+'<button type="button" data-print class="study-button">Afdrukken</button></nav></details><span id="reader-current-title">Vakoverzicht</span><a id="reader-previous" href="#start" aria-label="Vorig hoofdstuk">‹</a><a id="reader-next" href="#kapitaalbelangen" aria-label="Volgend hoofdstuk">›</a></div><main id="reader-main" tabindex="-1"><noscript><p class="nojs-only">Alle hoofdstukken staan hieronder. Via Inhoud kun je direct naar een hoofdstuk; de paragrafen en voorbeelden zijn ook zonder scripts uitklapbaar.</p></noscript>'+overview+chapters.map(renderChapter).join('')+toolPages+'</main></div></body></html>';
write('samenvatting.html',decorateTables(html));
// Reuse the previously tested kernel event handling; only navigation is replaced.
const existingRuntime=read('content/summary/runtime.js');
const kernelStart=existingRuntime.indexOf("  var form=document.getElementById('kernel-form')");
const kernelEnd=existingRuntime.lastIndexOf('}());');
if(kernelStart<0||kernelEnd<kernelStart)throw Error('De bestaande IC-rekentool kon niet worden hergebruikt.');
write('js/summary-reader.js',read('content/summary/reader-runtime.js').replace('/* KERNEL_RUNTIME */',existingRuntime.slice(kernelStart,kernelEnd)));

const stats={chapters:chapters.length,sections:chapters.reduce((n,c)=>n+c.sections.length,0),preservedTopics:included.length,views:chapters.length+5,addedExplanationWords:chapters.flatMap(c=>[...c.intro,...c.sections.flatMap(s=>s.text)]).join(' ').split(/\s+/).length};
write('docs/summary-reader-manifest.json',JSON.stringify(stats,null,2)+'\n');
console.log('Samenvatting leesstructuur: '+JSON.stringify(stats));
