/* Compact live decision route. No submit step, no selects, no inferred case facts. */
(function(){
 'use strict';
 var root=document.getElementById('kapitaalboom');if(!root)return;
 var stage='classify';
 var state={holder:'legal',target:'legal'},key='cafa2-capital-route-v2';
 var allowed={holder:['legal'],target:['legal','partnership'],participation:['yes','no','unknown'],subsidiary:['yes','no','unknown'],group:['yes','no','unknown'],influence:['yes','no','unknown'],information:['yes','no','unknown'],exception:['yes','no'],head:['group','part','none','unknown']};
 try{var saved=JSON.parse(sessionStorage.getItem(key)||'null');if(saved)Object.keys(allowed).forEach(function(k){if(allowed[k].includes(saved[k]))state[k]=saved[k];});}catch(_){}
 function law(a,p){return window.CafaStudy?window.CafaStudy.lawRail([{article:a,part:p||''}],'samenvatting.html'):'';}
 function opts(field,items){return '<div class="route-options" role="group" aria-label="'+fieldLabel(field)+'">'+items.map(function(x){return '<button type="button" data-capital-field="'+field+'" data-capital-value="'+x[0]+'" aria-pressed="'+(state[field]===x[0])+'">'+x[1]+'</button>';}).join('')+'</div>';}
 function fieldLabel(f){return {participation:'Deelneming',subsidiary:'Dochtermaatschappij',group:'Groepsmaatschappij',influence:'Invloed van betekenis',information:'Gegevens voor NVW',exception:'Gegronde reden voor afwijking',head:'Consolidatieplicht'}[f]||f;}
 function yesno(f){return opts(f,[['yes','Ja'],['no','Nee'],['unknown','Nog beoordelen']]);}
 function question(f,title,body,a,p,note){return '<div class="route-question" data-route-question="'+f+'"><div><h3>'+title+'</h3><p>'+body+'</p>'+(note?'<p class="route-hint">'+note+'</p>':'')+law(a,p)+'</div>'+yesno(f)+'</div>';}
 function result(title,text,refs){return '<strong>'+title+'</strong><p>'+text+'</p>'+(refs||[]).map(function(r){return law(r[0],r[1]);}).join('');}
 function showStage(next){
  if(['classify','value','consolidate'].includes(next))stage=next;
  root.querySelectorAll('.route-stage').forEach(function(x){x.hidden=x.id!=='capital-'+stage;});
  root.querySelector('.capital-context').hidden=stage!=='classify';
  root.querySelectorAll('[data-capital-stage]').forEach(function(x){x.setAttribute('aria-pressed',String(x.dataset.capitalStage===stage));});
  root.querySelector('[data-capital-previous]').hidden=stage==='classify';
  var nextButton=root.querySelector('[data-capital-next]');nextButton.hidden=stage==='consolidate';nextButton.textContent=stage==='classify'?'Verder naar waardering →':'Verder naar consolidatie →';
  var names={yes:'Ja',no:'Nee',unknown:'Nog beoordelen'};
  root.querySelector('[data-route-status=classify]').textContent=state.participation?'Deelneming: '+names[state.participation]:'Welke relaties?';
  var value=root.querySelector('#capital-value-result strong'),cons=root.querySelector('#capital-consolidation-result strong');
  root.querySelector('[data-route-status=value]').textContent=value?value.textContent:'Kies de grondslag';
  root.querySelector('[data-route-status=consolidate]').textContent=state.head==='group'?'Groepshoofd':state.head==='part'?'Groepsdeel':'Beoordeel afzonderlijk';
 }
 function paint(){
  var natural=false,vennoot=state.target==='partnership',legal=true;
  root.querySelectorAll('.capital-context [data-capital-field]').forEach(function(b){b.setAttribute('aria-pressed',String(state[b.dataset.capitalField]===b.dataset.capitalValue));});
  var q=document.getElementById('capital-qualifications'),v=document.getElementById('capital-value-questions'),vr=document.getElementById('capital-value-result'),c=document.getElementById('capital-consolidation-questions'),cr=document.getElementById('capital-consolidation-result');
  if(natural){
   q.innerHTML=result('Andere houder, andere beoordeling','De wettelijke dochter- en deelnemingsdefinities van art. 2:24a en 2:24c zien niet op een natuurlijke persoon als houder. Trek uit dit schema daarom geen NVW- of consolidatieplicht voor die persoon.',[['24a','lid 1'],['24c','lid 1 en 2']]);
   v.innerHTML='';vr.innerHTML=result('Geen waarderingsuitkomst uit deze route','Stel eerst het toepasselijke verslaggevingskader van de houder vast.');c.innerHTML='';cr.innerHTML=result('Geen automatische consolidatieconclusie','De onderstaande BW-route is gericht op de rapporterende rechtspersoon.');showStage();return;
  }
  q.innerHTML=(vennoot&&!legal?'<div class="route-question"><h3>Deelneming?</h3><p>Art. 2:24c lid 2 noemt een rechtspersoon als houder. Voor deze combinatie geeft deze route geen kwalificatie.</p>'+law('24c','lid 2')+'</div>':question('participation','Deelneming?',vennoot?'Is de rechtspersoon of zijn dochter volledig aansprakelijke vennoot in de VOF/CV, of anderszins vennoot met duurzame verbondenheid ten dienste van de eigen werkzaamheid?':'Kapitaal voor eigen rekening, met duurzame verbondenheid ten dienste van de eigen werkzaamheid?','24c',vennoot?'lid 2':'lid 1',vennoot?'':'Vanaf 20% geplaatst kapitaal bestaat een vermoeden; minder dan 20% sluit een deelneming niet uit.'))+
   (legal?question('subsidiary','Dochtermaatschappij?',vennoot?'Treedt de VOF/CV onder eigen naam op en is de houder of zijn dochter als vennoot volledig aansprakelijk voor haar schulden? Denk aan een VOF-vennoot of een beherend CV-vennoot; commanditair vennoot zijn is op zichzelf niet voldoende.':'Kan de houder, alleen of samen met dochters, meer dan de helft van de stemmen uitoefenen? Of als lid/aandeelhouder meer dan de helft van het bestuur of de commissarissen benoemen/ontslaan?','24a',vennoot?'lid 2':'lid 1',''): '<div class="route-question"><h3>Dochtermaatschappij?</h3><p>Een vennootschap die geen rechtspersoon is, kan niet zelf moeder zijn volgens deze wettelijke definitie.</p>'+law('24a','lid 1')+'</div>')+
   question('group','Groepsmaatschappij?','Economische eenheid én organisatorische verbondenheid?','24b','','Beoordeel het groepsverband los van het aandelenpercentage.');
  // Keep each independent qualification when another changes. Clear only dependent valuation answers.
  var validParticipation=!(vennoot&&!legal),participation=validParticipation?state.participation:null;
  var questions='';
  if(participation!=='yes'&&participation!=='no'){
   questions+=question('participation','Deelneming?','Beantwoord hier eerst de deelnemingstoets. Daarna verschijnt direct de passende waarderingsroute.','24c',vennoot?'lid 2':'lid 1',vennoot?'Bij een VOF/CV: toets of de rechtspersoon of haar dochter volledig aansprakelijke vennoot is, of anderszins duurzaam verbonden is ten dienste van de eigen werkzaamheid.':'Vanaf 20% geplaatst kapitaal bestaat een vermoeden; minder dan 20% sluit een deelneming niet uit.');
  }
  if(participation==='yes'){
   questions+=question('influence','Invloed van betekenis?','Invloed op het zakelijke en financiële beleid?','389','lid 1','Vanaf 20% naar eigen inzicht uit te brengen stemmen wordt deze invloed vermoed.');
   if(state.influence==='yes'){
    questions+=question('information','Genoeg gegevens voor NVW?','Kun je activa, voorzieningen, schulden en resultaat op de grondslagen van de houder bepalen?','389','lid 2 en 3','');
    questions+='<div class="route-exception"><span>Gegronde reden om van art. 2:389 lid 1 af te wijken?</span>'+opts('exception',[['no','Nee'],['yes','Ja, onderbouwd']])+law('389','lid 9')+'</div>';
   }
  }
  v.innerHTML=questions;
  var scope=!legal?' Deze uitkomst geldt alleen als Titel 9 op de rapporterende houder van toepassing is.':'';
  if(participation==='no')vr.innerHTML=result('Geen deelneming: beoordeel als belegging','Beoordeel verkrijgingsprijs of actuele waarde binnen art. 2:384. De bestemming bepaalt bovendien vaste of vlottende activa; geen deelneming betekent niet automatisch vlottend.'+scope,[['384','lid 1'],['364','lid 1 en 2']]);
  else if(participation!=='yes')vr.innerHTML=result('Eerst de deelnemingstoets','Kies hierboven Ja of Nee bij Deelneming. De passende waarderingsroute verschijnt hier.');
  else if(state.influence==='no')vr.innerHTML=result('Verkrijgingsprijs of actuele waarde','Zonder invloed van betekenis is de hoofdregel van art. 2:389 lid 1 niet van toepassing. De syllabus verwijst naar art. 2:384; toets de gekozen grondslag en eventuele waardeverminderingen.'+scope,[['384','lid 1'],['387','lid 2 en 3']]);
  else if(state.influence!=='yes')vr.innerHTML=result('Toets invloed van betekenis','Een deelneming wordt niet alleen vanwege die kwalificatie tegen NVW gewaardeerd.');
  else if(state.exception==='yes')vr.innerHTML=result('Gemotiveerde afwijking van de hoofdregel','Leg de gegronde reden vast in de toelichting en onderbouw de alternatieve grondslag. Onvoldoende gegevens is op zichzelf de afzonderlijke route van lid 3, niet hetzelfde als deze afwijking.'+scope,[['389','lid 9'],['384','lid 1']]);
  else if(state.information==='yes')vr.innerHTML=result('Nettovermogenswaarde (NVW)','Neem je aandeel in het herrekende nettovermogen op. Resultaat en vermogensmutaties werken door in de deelneming; dividend verlaagt de deelnemingswaarde.'+scope,[['389','lid 2']]);
  else if(state.information==='no')vr.innerHTML=result('Andere vermogensmutatiewaarde','Bepaal een waarde volgens Titel 9 en wijzig die met je aandeel in resultaat en uitkeringen. In de syllabus: zichtbaar eigen vermogen. Dus niet automatisch een onveranderlijke verkrijgingsprijs.'+scope,[['389','lid 3']]);
  else vr.innerHTML=result('Vermogensmutatiemethode','Toets de beschikbare gegevens om te kiezen tussen de NVW-route van lid 2 en de route van lid 3.',[['389','lid 2 en 3']]);
  if(!legal){c.innerHTML='';cr.innerHTML=result('Beoordeel eerst de wettelijke houder','Art. 2:406 noemt de rechtspersoon. Leid voor een vennootschap zonder rechtspersoonlijkheid geen consolidatieplicht af uit dit schema.',[['406','lid 1 en 2']]);}
  else{
   c.innerHTML='<div class="route-consolidation"><p>Staat de rechtspersoon aan het hoofd van de groep of van een groepsdeel zoals bedoeld in art. 2:406?</p>'+opts('head',[['group','Groepshoofd'],['part','Groepsdeel'],['none','Geen van beide'],['unknown','Nog beoordelen']])+law('406','lid 1 en 2')+'</div>';
   var title=state.head==='group'?'Consolidatieplicht: art. 2:406 lid 1':state.head==='part'?'Consolidatieplicht groepsdeel: art. 2:406 lid 2':state.head==='none'?'Geen plicht op deze aangegeven grond':'Waardering is niet hetzelfde als consolidatie';
   var text=state.head==='group'||state.head==='part'?'Bepaal de kring: eigen cijfers, dochters in de groep, andere betrokken groepsmaatschappijen en andere rechtspersonen onder overheersende zeggenschap of centrale leiding. Toets daarna de uitzonderingen.':state.head==='none'?'Controleer deze conclusie aan alle criteria van art. 2:406. Alleen “geen dochter” of “geen deelneming” is niet genoeg om consolidatie uit te sluiten.':'Toets plicht en kring afzonderlijk. Een antwoord bij dochter, deelneming of groep vervangt de volledige consolidatietoets niet.';
   cr.innerHTML=result(title,text)+(state.head==='group'||state.head==='part'? '<div class="route-next-checks"><span>Uitzonderingen: </span>'+law('407','lid 1 en 2')+law('408','lid 1, 3 en 4')+'<p>Gezamenlijke bevoegdheden krachtens samenwerking? Toets de mogelijkheid van proportionele consolidatie; alleen 50/50 is niet genoeg.</p>'+law('409','onder a en b')+'</div>':'');
  }
  showStage();
  var names=['participation','subsidiary','group'];names.forEach(function(f){var card=q.querySelector('[data-route-question='+f+']');if(card)card.dataset.answer=state[f]||'unknown';});
 }
 root.addEventListener('click',function(e){
  var step=e.target.closest('[data-capital-stage],[data-capital-next],[data-capital-previous]');if(step){var steps=['classify','value','consolidate'];showStage(step.dataset.capitalStage||steps[steps.indexOf(stage)+(step.hasAttribute('data-capital-next')?1:-1)]);return;}
  var b=e.target.closest('[data-capital-field]');if(b){var f=b.dataset.capitalField,value=b.dataset.capitalValue;if(!allowed[f]||!allowed[f].includes(value))return;state[f]=value;
  if(f==='holder'||f==='target'){['participation','subsidiary','group','influence','information','exception','head'].forEach(function(k){delete state[k];});}
  if(f==='participation'){delete state.influence;delete state.information;delete state.exception;}
  if(f==='influence'){delete state.information;delete state.exception;}
  var y=window.scrollY;paint();var current=root.querySelector('[data-capital-field='+f+'][data-capital-value='+value+']');if(current)current.focus({preventScroll:true});window.scrollTo(0,y);try{sessionStorage.setItem(key,JSON.stringify(state));}catch(_){}return;}
  if(e.target.closest('[data-capital-reset]')){stage='classify';state={holder:'legal',target:'legal'};try{sessionStorage.removeItem(key);}catch(_){}paint();}
 });
 window.CafaCapital={getState:function(){return Object.assign({},state);},render:paint};
 if(window.CafaStudy)paint();else window.addEventListener('DOMContentLoaded',paint,{once:true});
}());
