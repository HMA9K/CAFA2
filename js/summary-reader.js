(function(){
 'use strict';
 var config=JSON.parse(document.getElementById('reader-map').textContent),views=Array.from(document.querySelectorAll('[data-view]'));
 var current='start',menu=document.getElementById('reader-mobile-menu'),KEY='cafa2-summary-understood-v2',progress={};
 var chapters=config.chapters,viewIds=new Set(views.map(function(v){return v.dataset.view;}));
 function el(tag,text,cls){var n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
 function closeMenu(){if(menu)menu.open=false;}
 function route(){
  var raw;try{raw=decodeURIComponent(location.hash.slice(1));}catch(e){raw='';}
  raw=config.aliases[raw]||raw||'start';
  var target=document.getElementById(raw),view=target&&target.closest('[data-view]');
  if(!view||!viewIds.has(view.dataset.view)){view=document.querySelector('[data-view="start"]');target=view;}
  current=view.dataset.view;views.forEach(function(v){v.hidden=v!==view;});
  for(var n=target;n&&n!==view;n=n.parentElement){if(n.tagName==='DETAILS')n.open=true;}
  var chapter=chapters.find(function(c){return c.id===current;}),index=chapters.indexOf(chapter);
  document.querySelectorAll('[data-chapter-link]').forEach(function(a){if(a.dataset.chapterLink===current)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  document.querySelectorAll('[data-tool-link]').forEach(function(a){if(a.dataset.toolLink===(chapter||current==='start'?'summary':current))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  var title=chapter?chapter.number+'. '+chapter.title:view.querySelector('h1').textContent;
  document.getElementById('reader-current-title').textContent=title;
  var previous=document.getElementById('reader-previous'),next=document.getElementById('reader-next');
  previous.href='#'+(index>0?chapters[index-1].id:'start');previous.setAttribute('aria-disabled',String(current==='start'));
  next.href='#'+(index>=0&&index<chapters.length-1?chapters[index+1].id:chapter?'tentamen':chapters[0].id);
  document.title='CAFA2 · '+view.querySelector('h1').textContent;
  closeMenu();
  if(target!==view)requestAnimationFrame(function(){target.scrollIntoView({block:'start'});});else window.scrollTo(0,0);
 }
 try{var saved=JSON.parse(localStorage.getItem(KEY)||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved))progress=saved;}catch(e){}
 function updateProgress(){
  var count=0;
  chapters.forEach(function(c){var n=c.parts.filter(function(id){return progress[id]===true;}).length,done=n===c.parts.length;if(done)count++;
   document.querySelectorAll('[data-chapter-link="'+c.id+'"]').forEach(function(a){a.classList.toggle('is-understood',done);});
   var b=document.querySelector('[data-chapter-understood="'+c.id+'"]');b.setAttribute('aria-pressed',String(done));b.textContent=done?'Hoofdstuk begrepen · markering verwijderen':'Markeer hoofdstuk als begrepen';
  });
  document.getElementById('study-progress').textContent=count+' van '+chapters.length+' hoofdstukken begrepen. Je eerdere onderwerpmarkeringen zijn behouden.';
 }
 var font=16;try{var f=Number(localStorage.getItem('cafa2-reader-font'));if(f>=10&&f<=24)font=f;}catch(e){}
 function applySize(){document.body.style.setProperty('--reader-font','16px');window.StudyScale.set(font,16,10,24);}
 applySize();
 document.addEventListener('click',function(e){
  var b=e.target.closest('[data-chapter-understood]');if(b){var c=chapters.find(function(c){return c.id===b.dataset.chapterUnderstood;}),done=c.parts.every(function(id){return progress[id]===true;});c.parts.forEach(function(id){if(done)delete progress[id];else progress[id]=true;});try{localStorage.setItem(KEY,JSON.stringify(progress));}catch(error){}updateProgress();}
  var sections=e.target.closest('[data-sections]');if(sections){var page=sections.closest('[data-view]');page.querySelectorAll('.reader-section').forEach(function(d){d.open=sections.dataset.sections==='open';});}
  var size=e.target.closest('[data-font]');if(size){font=Number(size.dataset.font)===0?16:Math.max(10,Math.min(24,font+Number(size.dataset.font)));applySize();try{localStorage.setItem('cafa2-reader-font',String(font));}catch(error){}}
  if(e.target.closest('[data-print]')){closeMenu();window.print();}
  var a=e.target.closest('a[href^="#"]');if(a){closeMenu();if(a.getAttribute('href')===location.hash)route();}
  if(menu&&menu.open&&!menu.contains(e.target))closeMenu();
 });
 document.addEventListener('keydown',function(e){if(e.key==='Escape'&&menu&&menu.open){closeMenu();menu.querySelector('summary').focus();}});
 window.addEventListener('hashchange',route);
 var searchIndex=Array.from(document.querySelectorAll('[data-lesson]')).filter(function(t){return t.dataset.lesson!=='start';}).map(function(t){return{id:t.id,title:t.dataset.topicTitle||(t.querySelector('h1')||{}).textContent||t.id,text:t.textContent.toLocaleLowerCase('nl')};});
 var search=document.getElementById('study-search'),results=document.getElementById('study-search-results');
 search.addEventListener('input',function(){var words=search.value.trim().toLocaleLowerCase('nl').split(/\s+/);results.replaceChildren();if(words.join('').length<2)return;var matches=searchIndex.filter(function(t){return words.every(function(w){return t.text.includes(w);});}).slice(0,12);if(!matches.length){results.append(el('li','Geen passend onderwerp gevonden.'));return;}matches.forEach(function(t){var li=el('li'),a=el('a',t.title);a.href='#'+t.id;li.append(a);results.append(li);});});
 var glossarySearch=document.getElementById('glossary-search'),entries=Array.from(document.querySelectorAll('[data-glossary-entry]'));
 glossarySearch.addEventListener('input',function(){var term=glossarySearch.value.trim().toLocaleLowerCase('nl'),count=0;entries.forEach(function(p){p.hidden=!p.textContent.toLocaleLowerCase('nl').includes(term);if(!p.hidden)count++;});document.getElementById('glossary-count').textContent=count+' van '+entries.length+' begrippen';});
 var printState=null;
 window.addEventListener('beforeprint',function(){printState={details:Array.from(document.querySelectorAll('.reader-section,.study-example,.reader-sources')).map(function(d){return[d,d.open];}),entries:entries.map(function(d){return[d,d.hidden];})};printState.details.forEach(function(v){v[0].open=true;});printState.entries.forEach(function(v){v[0].hidden=false;});views.forEach(function(v){v.hidden=false;});});
 window.addEventListener('afterprint',function(){if(printState){printState.details.forEach(function(v){v[0].open=v[1];});printState.entries.forEach(function(v){v[0].hidden=v[1];});printState=null;}route();});
 updateProgress();route();
   var form=document.getElementById('kernel-form'),status=document.getElementById('kernel-status'),output=document.getElementById('kernel-results');
  function lockShares(){var direction=form.elements.direction.value;form.elements.sellerShare.disabled=direction==='down';form.elements.buyerShare.disabled=direction==='up';if(direction==='down')form.elements.sellerShare.value=100;if(direction==='up')form.elements.buyerShare.value=100;}
  form.elements.direction.addEventListener('change',lockShares);lockShares();
  var libraries;
  form.addEventListener('submit',async function(e){e.preventDefault();if(!form.reportValidity())return;var button=form.querySelector('button[type=submit]');button.disabled=true;status.textContent='Berekening controleren…';
    try{
      if(!libraries)libraries=Promise.all([import('./ic-learning-engine.mjs'),import('../content/summary/helpers.mjs'),import('../content/summary/table-layout.mjs')]);
      var loaded=await libraries,engine=loaded[0],h=loaded[1],input={basis:form.elements.basis.value,direction:form.elements.direction.value};
      ['sellerShare','buyerShare','stock0','stock1','margin','tax','sales'].forEach(function(k){input[k]=Number(form.elements[k].value);});
      ['sellerShare','buyerShare','margin','tax'].forEach(function(k){input[k]/=100;});
      var s=engine.icScenario(input);
      var html='<h2>'+h.esc(s.variant+' · '+s.input.basis)+'</h2>'+h.note('Uitgangspunt van de boekingsset',h.esc(s.precondition))+h.example('Leeg uitwerksjabloon','<div class="ic-stock-table">'+h.table(s.headers,s.blank)+'</div>')+'<div class="ic-stock-table">'+h.table(s.headers,s.rows,'Ingevulde voorraadtabel; bedragen vóór belasting')+'</div>';
      [['1. Interne correctie bij M',s.internal],['2. Geconsolideerde balans',s.balance],['3. Geconsolideerde W&V',s.income]].forEach(function(part){html+='<h3>'+part[0]+'</h3>';var list=part[1].filter(function(j){return j.rows.length;});html+=list.length?list.map(function(j){return h.journal(j.title,j.rows);}).join(''):'<p>Geen interne IC-winstboeking bij deze grondslag of geen winstmutatie.</p>';});
      html+='<h3>4. Controle</h3>'+h.table(['Controle','Bedrag (€)'],[['Bruto winst uit eindvoorraad',s.controls.stockReduction],['Intern resultaatverschil',s.controls.internalResultChange],['Aanvullend meerderheidsresultaat',s.controls.additionalMajorityResultChange],['Resultaatverschil derden',s.controls.thirdResultChange]])+'<p class="source-note">'+h.esc(s.source)+'</p>';
      output.innerHTML=loaded[2].decorateTables(html);status.textContent='Bijgewerkt. Alle winstbedragen in de voorraadtabel zijn vóór belasting; de afzonderlijke boekingen bevatten de belastingcorrecties.';status.classList.remove('kernel-error');
    }catch(error){output.replaceChildren(el('p','Geen nieuwe uitwerking gegenereerd. Pas de invoer aan of raadpleeg de genoemde bronvariant.'));status.textContent=error.message||'De rekentool kon niet worden geladen. De vaste voorbeelden in de hoofdstukken blijven beschikbaar.';status.classList.add('kernel-error');libraries=null;}finally{button.disabled=false;}
  });

}());
