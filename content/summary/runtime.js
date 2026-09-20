(function(){
  'use strict';
  var pages=Array.from(document.querySelectorAll('[data-lesson]'));
  if(!pages.length)return;
  var known=new Map(pages.map(function(p){return[p.dataset.lesson,p];}));
  var aliases={overzicht:'start',kapitaalbelangen:'kwalificatie','vreemde-valuta':'valuta',consolidatie:'proces','consolidatieproces':'proces',nvwhk:'streams','nvw-hk':'streams',vergelijking:'streams',downstream:'downstream-nvw',upstream:'upstream-nvw',sidestream:'sidestream',begrippenlijst:'begrippen','materieel-vast-actief':'mva',tentamenaanpak:'tentamen'};
  var current='start',picker=document.getElementById('lesson-picker'),KEY='cafa2-summary-understood-v2',progress={};
  var searchIndex=pages.filter(function(p){return p.dataset.lesson!=='start';}).map(function(p){return{id:p.dataset.lesson,title:p.querySelector('h1').textContent,text:p.textContent.toLocaleLowerCase('nl')};});
  function el(tag,text,cls){var node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(cls)node.className=cls;return node;}
  function route(){
    var raw;try{raw=decodeURIComponent(location.hash.slice(1));}catch(e){raw='';}
    var target=document.getElementById(raw),id=aliases[raw]||raw;
    if(target&&target.closest('[data-lesson]'))id=target.closest('[data-lesson]').dataset.lesson;
    if(!known.has(id))id='start';current=id;
    pages.forEach(function(p){p.hidden=p.dataset.lesson!==id;});
    document.querySelectorAll('[data-route]').forEach(function(a){if(a.dataset.route===id){a.setAttribute('aria-current','page');var group=a.closest('details');if(group)group.open=true;}else a.removeAttribute('aria-current');});
    if(picker)picker.value=id;
    document.title='CAFA2 · '+known.get(id).querySelector('h1').textContent;
    if(target&&target!==known.get(id))requestAnimationFrame(function(){target.scrollIntoView({block:'start'});});else window.scrollTo(0,0);
  }
  try{var parsed=JSON.parse(localStorage.getItem(KEY)||'{}');if(parsed&&typeof parsed==='object'&&!Array.isArray(parsed))Object.keys(parsed).forEach(function(k){if(known.has(k)&&parsed[k]===true)progress[k]=true;});}catch(e){}
  function showProgress(){var buttons=Array.from(document.querySelectorAll('[data-understood]')),n=0;buttons.forEach(function(b){var done=!!progress[b.dataset.understood];b.setAttribute('aria-pressed',String(done));b.textContent=done?'Begrepen · markering verwijderen':'Markeer als begrepen';if(done)n++;});document.getElementById('study-progress').textContent=n+' van '+buttons.length+' inhoudelijke hoofdstukken als begrepen gemarkeerd. Alleen op dit apparaat.';}
  document.addEventListener('click',function(e){var b=e.target.closest('[data-understood]');if(b){var id=b.dataset.understood;if(progress[id])delete progress[id];else progress[id]=true;try{localStorage.setItem(KEY,JSON.stringify(progress));}catch(error){document.getElementById('study-progress').textContent='Opslaan is in deze browser niet beschikbaar.';return;}showProgress();}if(e.target.closest('[data-print]'))window.print();});
  if(picker)picker.addEventListener('change',function(){location.hash=picker.value;});
  window.addEventListener('hashchange',route);showProgress();route();
  var search=document.getElementById('study-search'),results=document.getElementById('study-search-results');
  search.addEventListener('input',function(){var term=search.value.trim().toLocaleLowerCase('nl');results.replaceChildren();if(term.length<2)return;var words=term.split(/\s+/),matches=searchIndex.filter(function(x){return words.every(function(w){return x.text.includes(w);});}).slice(0,12);if(!matches.length){results.append(el('li','Geen passend hoofdstuk gevonden. Zoek bijvoorbeeld op één begrip.'));return;}matches.forEach(function(x){var li=el('li'),a=el('a',x.title);a.href='#'+x.id;li.append(a);results.append(li);});});
  var glossarySearch=document.getElementById('glossary-search'),entries=Array.from(document.querySelectorAll('[data-glossary-entry]'));
  glossarySearch.addEventListener('input',function(){var term=glossarySearch.value.trim().toLocaleLowerCase('nl'),n=0;entries.forEach(function(p){p.hidden=!p.textContent.toLocaleLowerCase('nl').includes(term);if(!p.hidden)n++;});document.getElementById('glossary-count').textContent=n+' van '+entries.length+' begrippen';});
  var printState=null;
  window.addEventListener('beforeprint',function(){printState={details:Array.from(document.querySelectorAll('.study-example')).map(function(d){return[d,d.open];}),entries:entries.map(function(d){return[d,d.hidden];})};printState.details.forEach(function(v){v[0].open=true;});printState.entries.forEach(function(v){v[0].hidden=false;});pages.forEach(function(p){p.hidden=false;});});
  window.addEventListener('afterprint',function(){if(printState){printState.details.forEach(function(v){v[0].open=v[1];});printState.entries.forEach(function(v){v[0].hidden=v[1];});printState=null;}route();});
  var form=document.getElementById('kernel-form'),status=document.getElementById('kernel-status'),output=document.getElementById('kernel-results');
  function lockShares(){var direction=form.elements.direction.value;form.elements.sellerShare.disabled=direction==='down';form.elements.buyerShare.disabled=direction==='up';if(direction==='down')form.elements.sellerShare.value=100;if(direction==='up')form.elements.buyerShare.value=100;}
  form.elements.direction.addEventListener('change',lockShares);lockShares();
  var libraries;
  form.addEventListener('submit',async function(e){e.preventDefault();if(!form.reportValidity())return;var button=form.querySelector('button[type=submit]');button.disabled=true;status.textContent='Berekening controleren…';
    try{
      if(!libraries)libraries=Promise.all([import('./ic-learning-engine.mjs'),import('../content/summary/helpers.mjs')]);
      var loaded=await libraries,engine=loaded[0],h=loaded[1],input={basis:form.elements.basis.value,direction:form.elements.direction.value};
      ['sellerShare','buyerShare','stock0','stock1','margin','tax','sales'].forEach(function(k){input[k]=Number(form.elements[k].value);});
      ['sellerShare','buyerShare','margin','tax'].forEach(function(k){input[k]/=100;});
      var s=engine.icScenario(input);
      var html='<h2>'+h.esc(s.variant+' · '+s.input.basis)+'</h2>'+h.note('Uitgangspunt van de boekingsset',h.esc(s.precondition))+h.example('Leeg uitwerksjabloon','<div class="ic-stock-table">'+h.table(s.headers,s.blank)+'</div>')+'<div class="ic-stock-table">'+h.table(s.headers,s.rows,'Ingevulde voorraadtabel; bedragen vóór belasting')+'</div>';
      [['1. Interne correctie bij M',s.internal],['2. Geconsolideerde balans',s.balance],['3. Geconsolideerde W&V',s.income]].forEach(function(part){html+='<h3>'+part[0]+'</h3>';var list=part[1].filter(function(j){return j.rows.length;});html+=list.length?list.map(function(j){return h.journal(j.title,j.rows);}).join(''):'<p>Geen interne IC-winstboeking bij deze grondslag of geen winstmutatie.</p>';});
      html+='<h3>4. Controle</h3>'+h.table(['Controle','Bedrag (€)'],[['Bruto winst uit eindvoorraad',s.controls.stockReduction],['Intern resultaatverschil',s.controls.internalResultChange],['Aanvullend meerderheidsresultaat',s.controls.additionalMajorityResultChange],['Resultaatverschil derden',s.controls.thirdResultChange]])+'<p class="source-note">'+h.esc(s.source)+'</p>';
      output.innerHTML=html;status.textContent='Bijgewerkt. Alle winstbedragen in de voorraadtabel zijn vóór belasting; de afzonderlijke boekingen bevatten de belastingcorrecties.';status.classList.remove('kernel-error');
    }catch(error){output.replaceChildren(el('p','Geen nieuwe uitwerking gegenereerd. Pas de invoer aan of raadpleeg de genoemde bronvariant.'));status.textContent=error.message||'De rekentool kon niet worden geladen. De vaste voorbeelden in de hoofdstukken blijven beschikbaar.';status.classList.add('kernel-error');libraries=null;}finally{button.disabled=false;}
  });
}());
