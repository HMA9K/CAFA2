(function () {
  'use strict';
  if (window.CafaStudy) return;
  var data = window.CAFA2_STUDY || {laws:{},guides:{},notes:{}};
  var navKey = 'cafa2-navigation-v1', path = location.pathname;
  var nav = {stack:[], origin:null, pending:null}, suppress = false, previous = null;
  var bar, back, originButton, questionLinks, scheduled = false, lawOpener = null;
  function read() { try { var n = JSON.parse(sessionStorage.getItem(navKey) || '{}'); if (Array.isArray(n.stack)) nav = n; } catch (_) {} }
  function persist() { try { sessionStorage.setItem(navKey, JSON.stringify(nav)); } catch (_) {} }
  function escape(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function localURL(value) {
    try {
      var u = new URL(value, location.href);
      if (u.origin !== location.origin || u.search) return null;
      if (!/\/(?:index(?:\.html)?|samenvatting(?:\.html)?|kapitaalbelangen(?:\.html)?|fallback\/[\w-]+(?:\.html)?)?$/.test(u.pathname)) return null;
      return u;
    } catch (_) { return null; }
  }
  function label() {
    var m = location.hash.match(/^#(kap|val|nvw|hk)-(\d+)$/);
    if (m) return 'oefenvraag ' + m[2];
    if (window.CafaExams && window.CafaExams.getPosition) {
      var e = window.CafaExams.getPosition(); if (e) return 'tentamenvraag ' + (e.index + 1);
    }
    var h = document.querySelector('[data-view]:not([hidden]) h1, #exam-app:not([hidden]) h1');
    return h ? h.textContent.trim() : (location.hash === '#oefenen' ? 'oefenvragen' : 'vorige pagina');
  }
  function snapshot() {
    var snap = {url:location.pathname + location.hash, label:label(), y:window.scrollY, details:[], panes:[], detailState:null,examFeedback:!!(document.getElementById("cafa-exam-feedback")&&!document.getElementById("cafa-exam-feedback").hidden)};
    var activeRoot=(document.querySelector('.question:target') || document.querySelector('.summary-page[data-view]:not([hidden]),.reader-chapter[data-view]:not([hidden])'));
    if(activeRoot&&activeRoot.id)snap.detailState={root:activeRoot.id,values:Array.from(activeRoot.querySelectorAll('details')).map(function(d){return d.open;})};
    document.querySelectorAll('details[open][id]').forEach(function(d){snap.details.push(d.id);});
    document.querySelectorAll('.review-side-content, .exam-modal-body, .reader-sidebar').forEach(function(p,i){ if(p.scrollTop) snap.panes.push([i,p.scrollTop]); });
    var m = location.hash.match(/^#(kap|val|nvw|hk)-(\d+)$/);
    if (m) snap.question = {kind:'practice',code:m[1],index:Number(m[2])-1};
    if (window.CafaExams && window.CafaExams.getPosition) {
      var e = window.CafaExams.getPosition(); if(e) snap.question={kind:'exam',attempt:e.attempt,index:e.index};
    }
    return snap;
  }
  function same(a,b){return a && b && a.url===b.url && JSON.stringify(a.question||null)===JSON.stringify(b.question||null);}
  function push(snap) {
    if (!snap || !localURL(snap.url)) return;
    if (!same(nav.stack[nav.stack.length-1], snap)) nav.stack.push(snap);
    else nav.stack[nav.stack.length-1] = snap;
    nav.stack = nav.stack.slice(-60); persist();
  }
  function rememberDestination(target) {
    var current = snapshot(); push(current); suppress = true;
    if (current.question && /samenvatting\.html|kapitaalbelangen\.html/.test(target.pathname)) nav.origin = current;
    nav.pending = null; persist(); previous = current;
  }
  function restore(target) {
    if (!target || !localURL(target.url)) return;
    nav.pending = target; persist(); suppress = true;
    var u = localURL(target.url);
    if (u.pathname !== location.pathname) { location.assign(u.href); return; }
    if (u.hash !== location.hash) location.hash = u.hash; else applyPending();
  }
  function settleReadingPosition(position) {
    var target = location.pathname + location.hash, interrupted = false;
    var events = ['pointerdown', 'touchstart', 'wheel', 'keydown'];
    function stop() { interrupted = true; events.forEach(function(type) { window.removeEventListener(type, stop, true); }); }
    function apply() {
      if (interrupted || location.pathname + location.hash !== target) return stop();
      window.scrollTo(0, Number(position.y) || 0);
      var panes = document.querySelectorAll('.review-side-content, .exam-modal-body, .reader-sidebar');
      (position.panes || []).forEach(function(pair) { if (panes[pair[0]]) panes[pair[0]].scrollTop = pair[1]; });
      previous = snapshot();
    }
    events.forEach(function(type) { window.addEventListener(type, stop, {capture: true, passive: true}); });
    apply();
    // WebKit native fragment positioning may run after the first rendering frames.
    // Bounded retries stop on any reader gesture or another navigation.
    [60, 160, 320].forEach(function(delay) { setTimeout(apply, delay); });
    setTimeout(stop, 400);
  }
  function applyPending() {
    var p = nav.pending;
    if (!p || p.url !== location.pathname + location.hash) return false;
    // The application loads its fragments asynchronously; never clear a restoration too early.
    if (p.question && p.question.kind === 'practice' && (!window.CafaPractice || !window.CafaFeedback || document.documentElement.classList.contains('cafa-starting'))) return false;
    if (p.question && p.question.kind === 'exam' && (!window.CafaExams || !window.CafaFeedback || document.documentElement.classList.contains('cafa-starting'))) return false;
    nav.pending = null; persist();
    if (p.question && p.question.kind === 'exam') window.CafaExams.restorePosition(p.question.attempt,p.question.index);
    if(p.detailState&&!(p.question&&p.question.kind==='practice')){var r=document.getElementById(p.detailState.root);if(r)r.querySelectorAll('details').forEach(function(d,i){if(typeof p.detailState.values[i]==='boolean')d.open=p.detailState.values[i];});}
    (p.details||[]).forEach(function(id){var d=document.getElementById(id); if(d&&d.tagName==='DETAILS')d.open=true;});
    requestAnimationFrame(function(){requestAnimationFrame(function(){
      if(p.examFeedback){var check=document.querySelector("#exam-app [data-exam-action=check]");if(check&&check.getAttribute("aria-expanded")!=="true")check.click();}
      (p.details||[]).forEach(function(id){var d=document.getElementById(id);if(d&&d.tagName==='DETAILS')d.open=true;});
      settleReadingPosition(p);
      var panes=document.querySelectorAll('.review-side-content, .exam-modal-body, .reader-sidebar');
      (p.panes||[]).forEach(function(pair){if(panes[pair[0]])panes[pair[0]].scrollTop=pair[1];});
      previous=snapshot();
    });});
    return true;
  }
  function updateBar() {
    if (!bar) return;
    var cur=snapshot();
    var hasOrigin=nav.origin && localURL(nav.origin.url) && !same(nav.origin,cur) && !cur.question;
    var top=nav.stack[nav.stack.length-1];
    var onQuestion=!!cur.question || !!document.querySelector('.question:target');
    var onResults=/^#(?:resultaat-(?:kap|val|nvw|hk)$|onderwerp-(?:resultaat|overzicht)-|resultaten$|inzage\/|mc-inzage\/)/.test(location.hash);
    questionLinks.hidden=!(onQuestion||onResults);
    bar.classList.toggle('has-result-links',onResults);
    back.hidden = onQuestion || !top || same(top,cur);
    originButton.hidden = onQuestion || onResults || !hasOrigin;
    if(hasOrigin){originButton.textContent='← Terug naar '+nav.origin.label;originButton.title='Hervat precies waar je was gebleven. Je antwoorden blijven bewaard.';}
    if(top)back.title='Terug naar '+top.label;
    bar.hidden=false;
    document.documentElement.style.setProperty('--study-return-h',bar.getBoundingClientRect().height+'px');
  }
  function scheduleUpdate() {
    if(scheduled)return;scheduled=true;
    requestAnimationFrame(function(){scheduled=false;updateBar();applyPending();previous=snapshot();});
  }
  function closeTools(restoreFocus) {
    var menu=document.getElementById('study-tools-menu');
    if(menu&&menu.open){menu.open=false;if(restoreFocus)menu.querySelector('summary').focus();}
  }
  function mountTools() {
    document.querySelectorAll('.cafa-wordmark small, .brand small, .reader-brand small').forEach(function(el){el.textContent='LEER- EN OEFENOMGEVING';});
    if(!bar||document.getElementById('study-tools-menu'))return;
    var base=/\/fallback\//.test(path)?'../':'';
    var practice=/\/(?:index\.html)?$/.test(path)?'':base+'index.html';
    var menu=document.createElement('details');menu.id='study-tools-menu';menu.className='study-tools-menu';
    menu.innerHTML='<summary aria-label="Hulpmiddelen openen">Meer <span aria-hidden="true">⌄</span></summary><nav aria-label="Studiehulpmiddelen"><a href="'+base+'samenvatting.html#kernschema">IC-kernschema</a><a href="'+practice+'#voortgang">Voortgang</a><a href="'+base+'samenvatting.html#begrippen">Begrippen</a><a href="'+base+'samenvatting.html#bronnen">Bronnen</a><a href="'+base+'samenvatting.html#wetsartikelen">Wetsartikelen</a></nav>';
    bar.append(menu);
    menu.addEventListener('click',function(e){if(e.target.closest('a'))closeTools(false);});
  }
  function mountControls() {
    if(!document.getElementById('study-theme-control')) {
      var tools=document.querySelector('.reader-top-tools, .top-controls');
      if(tools){var control=document.createElement('details');control.id='study-theme-control';control.className='study-theme-control';
        control.innerHTML='<summary aria-label="Lichtmodus wijzigen"><span aria-hidden="true">◐</span><span class="study-theme-word">Lichtmodus</span><span data-theme-label>Automatisch</span></summary><div class="study-theme-menu"><p>Lichtmodus</p><div role="group" aria-label="Lichtmodus"><button type="button" data-theme-choice="light" aria-pressed="false">Aan <small>Licht</small></button><button type="button" data-theme-choice="dark" aria-pressed="false">Uit <small>Donker</small></button><button type="button" data-theme-choice="auto" aria-pressed="true">Automatisch <small>Volg apparaat</small></button></div><p class="study-theme-hint">Automatisch is de standaard. Een handmatige keuze geldt voor deze browsersessie.</p></div>';
        tools.prepend(control);if(window.CafaTheme)window.CafaTheme.refresh();}
    }
    if(!bar){
      var header=document.querySelector('.reader-topbar, .topbar');
      if(header){bar=document.createElement('nav');bar.id='study-returnbar';bar.setAttribute('aria-label','Terug naar je leeractiviteit');bar.hidden=true;
        back=document.createElement('button');back.type='button';back.className='study-back';back.textContent='← Vorige pagina';back.setAttribute('aria-label','Vorige pagina');back.dataset.studyBack='';
        originButton=document.createElement('button');originButton.type='button';originButton.className='study-origin';originButton.dataset.studyOrigin='';
        questionLinks=document.createElement('span');questionLinks.className='question-return-links';questionLinks.hidden=true;
        var mainPath=/\/(?:index(?:\.html)?)?$/.test(path)?'':(/\/fallback\//.test(path)?'../':'')+'index.html';
        questionLinks.innerHTML='<a href="'+mainPath+'#start">Home</a><a href="'+mainPath+'#oefenen">Onderwerpen</a>';
        bar.append(back,originButton,questionLinks);header.after(bar);
        function measure(){document.documentElement.style.setProperty('--study-top-h',header.getBoundingClientRect().height+'px');}
        if(window.ResizeObserver)new ResizeObserver(measure).observe(header);measure();}
    }
    var tabs=document.querySelector('.reader-tabs');
    if(tabs&&bar&&tabs.parentElement!==bar){
      bar.append(tabs);bar.classList.add('study-inline-navigation');
      document.body.classList.add('study-inline-reader');
    }
    mountTools();updateBar();
  }
  function sourceLocation(a){var law=data.laws[a];return law?'Studiekopie Boek 2 BW, p. '+(law.pages||law.page)+'.':'';}
  function lawRail(refs,base){return '<div class="law-rail" aria-label="Wetsartikelen">'+(refs||[]).map(function(r){var law=data.laws[r.article];if(!law)return '';return '<a class="law-ref" data-law="'+escape(r.article)+'" data-law-part="'+escape(r.part)+'" href="'+escape(base||'samenvatting.html')+'#wet-'+escape(r.article)+'">art. 2:'+escape(r.article)+(r.part?' '+escape(r.part):'')+' BW<span>p. '+escape(law.pages||law.page)+'</span></a>';}).join('')+'</div>';}
  function showLaw(article,part,opener) { if(window.CafaLaw)window.CafaLaw.open(article,part,opener); }
  function enrichRules() {
    document.querySelectorAll('.theory-panel[data-guidance-id]').forEach(function(panel){
      if(panel.dataset.studyAdded)return;
      var parts=panel.dataset.guidanceId.split('-'),q=window.CAFA2_DATA&&window.CAFA2_DATA.modules[parts[0]]&&window.CAFA2_DATA.modules[parts[0]].questions[Number(parts[1])-1];
      if(!q||!q.guidance)return;var g=data.guides[q.guidance.lesson];if(!g)return;
      panel.dataset.studyAdded='true';(panel.querySelector('.theory-sources')||panel.querySelector('.theory-content')).insertAdjacentHTML('beforeend',lawRail(g.refs,(/\/fallback\//.test(path)?'../':'')+'samenvatting.html'));
    });
  }
  function annotateLawText(root) {
    if(!root)return;
    var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[],n;
    while((n=walker.nextNode())) {
      if(!n.parentElement||n.parentElement.closest('a,button,script,style,textarea,input,select,[contenteditable],.law-verbatim,.study-law-body,.law-popover'))continue;
      if(/(?:art\.?|artikel)\s*2:\s*\d+/i.test(n.textContent))nodes.push(n);
    }
    nodes.forEach(function(text){
      var re=/\b(?:art\.?|artikel)\s*2:\s*(\d+[a-z]*)(?:\s+(?:lid|leden)\s+\d+(?:\s*(?:en|of|t\/m|,|[-–])\s*\d+)*(?:\s+onder\s+[a-z](?:\s+(?:en|of)\s+[a-z])?)?)?(?:\s+BW)?/gi,last=0,m,frag=document.createDocumentFragment();
      while((m=re.exec(text.textContent))){if(!data.laws[m[1]])continue;frag.append(document.createTextNode(text.textContent.slice(last,m.index)));var a=document.createElement('a');a.className='law-inline';a.dataset.law=m[1];var part=m[0].match(/(?:lid|leden)[\s\S]*?(?=\s+BW|$)/i);a.dataset.lawPart=part?part[0]:'';a.href=(/\/fallback\//.test(path)?'../':'')+'samenvatting.html#wet-'+m[1];a.title=sourceLocation(m[1]);a.textContent=m[0];frag.append(a);last=m.index+m[0].length;}
      if(last){frag.append(document.createTextNode(text.textContent.slice(last)));text.replaceWith(frag);}
    });
  }
  function mountLawSearch(){var input=document.getElementById('study-law-search');if(!input||input.dataset.bound)return;input.dataset.bound='true';input.addEventListener('input',function(){var term=input.value.toLocaleLowerCase('nl').trim(),count=0;document.querySelectorAll('[data-law-entry]').forEach(function(d){d.hidden=!d.textContent.toLocaleLowerCase('nl').includes(term);if(!d.hidden)count++;});document.getElementById('law-search-count').textContent=count+' artikelen gevonden';});}
  window.CafaStudy={
    examNote:function(exam,id){return data.notes[exam]&&data.notes[exam][id]?data.notes[exam][id].html:'';},
    examLink:function(exam,id){var n=data.notes[exam]&&data.notes[exam][id];return n?'<a class="study-exam-link" href="samenvatting.html#'+escape(n.lesson)+'">Uitleg bij deze vraag in de samenvatting →</a>':'';},
    clearReturn:function(code){nav.origin=null;nav.pending=null;nav.stack=nav.stack.filter(function(s){return !s.question||s.question.code!==code;});persist();},
    refresh:function(){mountControls();enrichRules();scheduleUpdate();},
    lawRail:lawRail
  };
  read();nav.stack=nav.stack.filter(function(s){return s&&localURL(s.url);});
  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-theme-choice]');if(b){window.CafaTheme.setMode(b.dataset.themeChoice);document.getElementById('study-theme-control').open=false;return;}
        if(e.target.closest('[data-study-origin]')){var o=nav.origin;nav.origin=null;nav.stack=[];persist();restore(o);return;}
    if(e.target.closest('[data-study-back]')){var p=nav.stack.pop();persist();restore(p);return;}
    var law=e.target.closest('[data-law]');if(law){e.preventDefault();e.stopImmediatePropagation();showLaw(law.dataset.law,law.dataset.lawPart,law);return;}
    var a=e.target.closest('a[href]');if(!a||a.target==='_blank'||a.hasAttribute('download')||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||e.button!==0)return;
    // These are modal triggers, not navigation to a new page.
    if(a.hasAttribute('data-overview')||a.hasAttribute('data-calc'))return;
    var u=localURL(a.href);if(!u||u.pathname+u.hash===location.pathname+location.hash)return;
    if(a.hasAttribute('data-law-directory')&&window.CafaLaw)window.CafaLaw.close(false);
    rememberDestination(u);
  },true);
  document.addEventListener('click',function(e){if(!e.target.closest('#study-tools-menu'))closeTools(false);var t=document.getElementById('study-theme-control');if(t&&t.open&&!t.contains(e.target))t.open=false;});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){closeTools(true);var t=document.getElementById('study-theme-control');if(t&&t.open){t.open=false;t.querySelector('summary').focus();}}});
  window.addEventListener('hashchange',function(){
    closeTools(false);
    if(!suppress&&!nav.pending&&previous&&previous.url!==location.pathname+location.hash)push(previous);
    suppress=false;scheduleUpdate();
  });
  window.addEventListener('popstate',function(){suppress=true;});
  window.addEventListener('scroll',function(){if(previous)previous.y=window.scrollY;},{passive:true});
  window.addEventListener('pagehide',function(){persist();});
  window.addEventListener('pageshow',function(){read();scheduleUpdate();});
  window.addEventListener('cafa:ready',function(){mountControls();enrichRules();annotateLawText(document.getElementById('app-content'));scheduleUpdate();});
  window.addEventListener('cafa:exam-route',function(){annotateLawText(document.getElementById('exam-app'));scheduleUpdate();});
  window.addEventListener('cafa:practice-change',scheduleUpdate);
  function init(){mountControls();mountLawSearch();annotateLawText(document.getElementById('reader-main'));enrichRules();scheduleUpdate();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
}());
