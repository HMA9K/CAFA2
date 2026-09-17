(function () {
  'use strict';
  var Engine = window.CafaExamEngine, Editor = window.CafaAnswerEditor;
  var host = document.getElementById('exam-app');
  if (!Engine || !Editor || !host) throw new Error('De tentamenomgeving kon niet worden geladen.');
  var KEY = 'cafa2-full-exams-v1', store = {version:1, attempts:[]};
  var editor = null, saveOK = true, corrupt = false, selectedAttempt = null;
  var submitDialog = document.getElementById('exam-submit-dialog');
  var announcedTen = new Set(), catalogErrors = [];
  var completedType = 'all', completedAttempts = 'all';
  var catalog = (window.CAFA2_EXAMS || []).filter(function (exam) {
    var result = Engine.validateExam(exam);
    if (!result.valid) catalogErrors.push((exam && exam.id || 'Onbekend') + ': ' + result.errors.join(' '));
    return result.valid;
  });
  var demo = window.CAFA2_EXAM_DEMO;
  catalog.sort(function(a,b){return b.date.localeCompare(a.date);});
  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g,function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function rich(html, plain) { return html ? Editor.sanitize(html) : '<p class="exam-prose">' + esc(plain || '') + '</p>'; }
  function date(value) { return value ? new Date(value.length === 10 ? value + 'T12:00:00' : value).toLocaleDateString('nl-NL',{day:'2-digit',month:'2-digit',year:'numeric'}) : 'Niet vastgelegd'; }
  function datetime(value) { return value ? new Date(value).toLocaleString('nl-NL',{dateStyle:'short',timeStyle:'short'}) : 'Niet vastgelegd'; }
  function label(exam) { return exam.demo ? exam.title : exam.title + ' · ' + date(exam.date); }
  function link(hash) { return '#' + hash; }
  function announce(message) { document.getElementById('exam-announcement').textContent = message; }
  function attempts() { return store.attempts; }
  function active() { return attempts().find(function (attempt) { return attempt.status === 'active'; }); }
  function byId(id) { return attempts().find(function (attempt) { return attempt.id === id; }); }
  function examById(id) { return catalog.find(function (exam) { return exam.id === id; }) || (demo && demo.id === id ? demo : null); }
  function loadState(raw) {
    var parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.attempts)) throw new Error('Onbekend formaat');
    parsed.attempts.forEach(function (attempt) {
      if (!attempt || !Engine.validateExam(attempt.exam).valid || !/^[\w.-]+$/.test(attempt.id) ||
          !Number.isSafeInteger(attempt.startedAt) || !Number.isSafeInteger(attempt.deadlineAt) ||
          attempt.deadlineAt <= attempt.startedAt || !['active','completed'].includes(attempt.status) ||
          !attempt.answers || typeof attempt.answers !== 'object' || Array.isArray(attempt.answers)) throw new Error('Ongeldige poging');
      attempt.currentIndex = Math.max(0,Math.min(attempt.exam.questions.length - 1, Math.floor(Number(attempt.currentIndex) || 0)));
      attempt.marked = attempt.marked && typeof attempt.marked === 'object' ? attempt.marked : {};
      attempt.exam.questions.forEach(function (q) {
        var answer = attempt.answers[q.id];
        if (answer && typeof answer.html === 'string') answer.html = Editor.sanitize(answer.html);
      });
    });
    return parsed;
  }
  try { var saved = localStorage.getItem(KEY); if (saved) store = loadState(saved); }
  catch (error) { corrupt = true; saveOK = false; }
  function save() {
    if (corrupt) { updateSaveStatus(); return false; }
    try { localStorage.setItem(KEY,JSON.stringify(store)); saveOK = true; }
    catch (error) { saveOK = false; }
    updateSaveStatus();
    return saveOK;
  }
  function updateSaveStatus() {
    host.querySelectorAll('[data-exam-save]').forEach(function (el) {
      el.textContent = saveOK ? 'Opgeslagen op dit apparaat. De klok loopt ook door als je de pagina sluit.' : 'Opslaan lukt niet. Houd deze pagina open en download een back-up van je antwoorden.';
      el.classList.toggle('is-error',!saveOK);
    });
  }
  function downloadBackup() {
    var blob = new Blob([JSON.stringify(store,null,2)],{type:'application/json'}), url = URL.createObjectURL(blob);
    var a = document.createElement('a'); a.href=url; a.download='CAFA2-tentamenpogingen.json'; a.click();
    setTimeout(function () { URL.revokeObjectURL(url); },1000);
  }
  function dropEditor() { if (editor) { editor.destroy(); editor = null; } }
  function go(hash) { if (location.hash === '#' + hash) route(); else location.hash = hash; }
  function btn(text,action,primary,extra) { return '<button type="button" class="btn' + (primary?' primary':'') + '" data-exam-action="' + action + '" ' + (extra || '') + '>' + text + '</button>'; }
  function head(title,sub) { return '<div class="exam-page-head"><div><div class="exam-eyebrow">CAFA2 · oefenomgeving</div><h1>' + esc(title) + '</h1>' + (sub?'<p>'+esc(sub)+'</p>':'') + '</div></div>'; }
  function available(exam) { var now = Date.now(); return (!exam.availableFrom || now >= Date.parse(exam.availableFrom)) && (!exam.deadline || now < Date.parse(exam.deadline)); }
  function table(rows,kind,toolbar) {
    var columns = kind==='completed' ? ['Toetsnaam','Code','Ingeleverd','Percentage juist','Cijfer','Resultaat'] : kind==='reviews' ? ['Toetsnaam','Code','Begint','Eindtijd','Percentage juist','Cijfer','Resultaat'] : ['Toetsnaam','Code','Beschikbaar','Deadline','Duur'];
    return '<div class="exam-table-wrap">'+(toolbar||'')+'<table class="exam-table exam-table-'+kind+'"><thead><tr>'+columns.map(function(title){return '<th scope="col">'+title+'</th>';}).join('')+'<th scope="col"><span class="sr-only">Actie</span></th></tr></thead><tbody>'+(rows.length?rows.join(''):'<tr><td class="exam-empty-cell" colspan="'+(columns.length+1)+'">'+(kind==='reviews'?'Geen geplande inzages':kind==='completed'?'Geen voltooide toetsen':'Geen toetsen')+'</td></tr>')+'</tbody></table></div>';
  }
  function dashboard(completed) {
    var live = active(), completedExams = attempts().filter(function (a) { return a.status === 'completed'; });
    var completedPractice = window.CafaPractice ? window.CafaPractice.getCompleted() : [];
    var viewName=completed?'Voltooid':'Aankomend';
    var html='<div class="exam-dashboard-title"><h1>Dashboard</h1></div><div class="exam-dashboard-content"><nav class="exam-breadcrumb" aria-label="Kruimelpad"><a href="#dashboard" aria-label="Dashboard"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M1 9 10 1l9 8-2 2-1-1v8h-5v-5H8v5H3v-8l-1 1Z"/></svg></a><span>/</span><span aria-current="page">'+viewName+'</span></nav><div class="exam-dashboard-view"><label class="exam-switch"><span class="sr-only">Toetsen weergeven</span><select data-exam-filter aria-label="Toetsen weergeven"><option value="upcoming"'+(!completed?' selected':'')+'>Aankomend</option><option value="completed"'+(completed?' selected':'')+'>Voltooid</option></select></label></div>';
    if (corrupt) html += '<p class="exam-warning" role="alert">Eerder opgeslagen tentamenpogingen konden niet worden gelezen. Ze zijn niet overschreven. Nieuwe tentamens starten is geblokkeerd om je gegevens te beschermen.</p>';
    if (catalogErrors.length) html += '<p class="exam-warning" role="alert">Een tentamen kon niet worden geladen. De overige toetsen zijn beschikbaar.</p>';
    if (completed) {
      var rows = completedExams.map(function (attempt) {
        return {type:'exam',key:attempt.exam.id,time:attempt.submittedAt,html:'<tr><td><a class="exam-name" href="#inzage/'+encodeURIComponent(attempt.id)+'">'+esc(label(attempt.exam))+'</a><span class="exam-sub">'+(attempt.finishReason==='timeout'?'Tijd verstreken':'Ingeleverd')+' · '+Engine.answeredCount(attempt)+' / '+attempt.exam.questions.length+' beantwoord</span></td><td data-label="Code">'+esc(attempt.exam.date.replace(/-/g,''))+'</td><td data-label="Ingeleverd">'+datetime(attempt.submittedAt)+'</td><td data-label="Percentage juist">Niet beoordeeld</td><td data-label="Cijfer">Niet bekend</td><td data-label="Resultaat">Zelf nakijken</td><td><a class="btn primary" href="#inzage/'+encodeURIComponent(attempt.id)+'">Weergeven</a></td></tr>'};
      }).concat(completedPractice.map(function (item) {
        var target = item.href || '#mc-inzage/' + encodeURIComponent(item.id);
        var percent=item.auto?Math.round(1000*item.good/item.auto)/10:null;
        return {type:'practice',key:item.code,time:item.submittedAt || 0,html:'<tr><td><a class="exam-name" href="'+esc(target)+'">'+esc(item.title)+'</a><span class="exam-sub">Poging '+esc(item.attempt||1)+' · '+item.answered+' / '+item.total+' beantwoord</span></td><td data-label="Code">'+esc((item.code||'MC').toUpperCase())+'</td><td data-label="Ingeleverd">'+datetime(item.submittedAt)+'</td><td data-label="Percentage juist">'+(percent===null?'Niet beoordeeld':percent.toLocaleString('nl-NL')+'%<span class="exam-sub">Alleen nagekeken MC</span>')+'</td><td data-label="Cijfer">Niet bekend</td><td data-label="Resultaat">'+item.good+' / '+item.auto+' nagekeken MC goed</td><td><a class="btn primary" href="'+esc(target)+'">Weergeven</a></td></tr>'};
      })).sort(function(a,b){return new Date(b.time)-new Date(a.time);});
      var seen=new Set();
      rows=rows.filter(function(row){if(completedType!=='all'&&completedType!==row.type)return false;var key=row.type+':'+row.key;if(completedAttempts==='latest'&&seen.has(key))return false;seen.add(key);return true;});
      var toolbar='<div class="exam-results-filters"><label>Weergeven <select data-completed-type><option value="all">Alles</option><option value="exam">Tentamens</option><option value="practice">MC-oefenvragen</option></select></label><label>Filteren op: <select data-completed-attempts><option value="all">Alle pogingen</option><option value="latest">Laatste poging per toets</option></select></label></div>';
      html+='<section class="exam-section"><h2>Geplande inzages</h2>'+table([],'reviews')+'</section><section class="exam-section"><h2>Voltooide toetsen</h2>'+table(rows.map(function(r){return r.html;}),'completed',toolbar)+'</section>';
    } else {
      var ready = catalog.filter(function(exam){return available(exam) && !completedExams.some(function(a){return a.exam.id===exam.id;}) && (!live||live.exam.id!==exam.id);});
      function examRow(exam,resume) { var target=resume?'#tentamen/'+encodeURIComponent(live.id):'#welkom/'+encodeURIComponent(exam.id);return '<tr><td><a class="exam-name" href="'+target+'">'+esc(label(exam))+'</a>'+(resume?'<span class="exam-sub">Bezig · nog '+Engine.formatTime(Engine.remainingSeconds(live))+'</span>':'')+'</td><td data-label="Code">'+esc(exam.date.replace(/-/g,''))+'</td><td data-label="Beschikbaar">'+(exam.availableFrom?datetime(exam.availableFrom):'Nu beschikbaar')+'</td><td data-label="Deadline">'+(exam.deadline?datetime(exam.deadline):'Geen deadline')+'</td><td data-label="Duur">'+(exam.durationMinutes+(resume?live.extraMinutes:0))+' minuten</td><td><a class="btn primary" href="'+target+'">'+(resume?'Toets hervatten':available(exam)?'Toets starten':'Details bekijken')+'</a></td></tr>'; }
      var today=['<tr><td><a class="exam-name" href="#welkom/practice">CAFA2 oefenvragen</a></td><td data-label="Code">CAFA2-MC</td><td data-label="Beschikbaar">Altijd beschikbaar</td><td data-label="Deadline">Geen deadline</td><td data-label="Duur">Geen tijdslimiet</td><td><a class="btn primary" href="#welkom/practice">Toets starten</a></td></tr>'];
      if(live)today.push(examRow(live.exam,true));
      today=today.concat(ready.map(function(exam){return examRow(exam,false);}));
      html+='<section class="exam-section"><h2>Vandaag</h2>'+table(today,'upcoming')+'</section>';
      var soon = catalog.filter(function(exam){return exam.availableFrom && Date.parse(exam.availableFrom)>Date.now() && Date.parse(exam.availableFrom)<=Date.now()+30*86400000;});
      html += '<section class="exam-section"><h2>Volgende 30 dagen</h2>'+(soon.length?table(soon.map(function(exam){return examRow(exam,false);}),'upcoming'):'<div class="exam-empty-row">Geen toetsen</div>')+'</section>';
    }
    html += '<footer class="exam-dashboard-help"><p class="exam-local-note">Oefenomgeving. Je antwoorden en pogingen blijven in deze browser, op dit apparaat. Bewaar zelf een back-up; je voortgang wordt niet tussen apparaten gesynchroniseerd.</p><div class="actions">'+btn('Back-up downloaden','backup')+'<a class="btn" href="#voortgang">MC-voortgang</a></div></footer></div>';
    host.innerHTML = html;
    if(completed){host.querySelector('[data-completed-type]').value=completedType;host.querySelector('[data-completed-attempts]').value=completedAttempts;}
  }
  function details(exam, extra) {
    var entries = [['Vragen',exam.questions.length],['Duur',(exam.durationMinutes+(extra?30:0))+' minuten'],['Opgaven',exam.sections?exam.sections.length:'Niet van toepassing'],['Max. score',exam.maxScore!==undefined?exam.maxScore+' punten':'Niet van toepassing'],['Cesuur',exam.passPoints!==undefined?exam.passPoints+' punten':'Niet van toepassing'],['Poging',attempts().filter(function(a){return a.exam.id===exam.id;}).length+1]];
    return '<dl class="exam-details">'+entries.map(function(e){return '<div><dt>'+esc(e[0])+'</dt><dd'+(e[0]==='Duur'?' data-exam-detail-duration':'')+'>'+esc(e[1])+'</dd></div>';}).join('')+'</dl>';
  }
  function introduction(exam) {
    return '<div class="exam-document">'+rich(exam.introductionHtml,exam.introduction)+(exam.instructions&&exam.instructions.length?'<ul class="exam-instructions">'+exam.instructions.map(function(s){return '<li>'+esc(s)+'</li>';}).join('')+'</ul>':'')+'</div>';
  }
  function welcome(id) {
    if (id==='practice') {
      host.innerHTML = '<a class="exam-back" href="#dashboard">‹ Dashboard</a>'+head('CAFA2 oefenvragen','Welkom bij de oefenomgeving')+'<div class="exam-paper"><h2>Oefen in je eigen tempo</h2><p class="exam-prose">Je kunt kiezen uit vier onderwerpen, met 30 vragen per onderwerp. Je kiest een meerkeuzeantwoord of werkt je antwoord zelf uit met tekst, tabellen en journaalposten. Je oorspronkelijke MC-score blijft bewaard wanneer je een vraag herhaalt.</p><dl class="exam-details"><div><dt>Vragen</dt><dd>120, verdeeld over 4 onderwerpen</dd></div><div><dt>Duur</dt><dd>Geen tijdslimiet</dd></div><div><dt>Nakijken</dt><dd>Per vraag of na voltooien</dd></div><div><dt>Voortgang</dt><dd>Op dit apparaat</dd></div></dl><p>MC-oefenvragen hebben geen aftelklok. De extra-tijdoptie is hier niet van toepassing.</p><div class="exam-start-actions"><a class="btn primary" href="#start">Toets starten</a><span class="small">Kies daarna een onderwerp.</span></div></div>';
      return;
    }
    var exam = examById(id); if(!exam) return missing();
    var live=active(), own=live&&live.exam.id===id;
    host.innerHTML='<a class="exam-back" href="#dashboard">‹ Dashboard</a>'+head(label(exam),'Welkom. Lees eerst de informatie en kies eventueel extra tijd.')+'<div class="exam-paper">'+(exam.demo?'<p class="exam-warning">Demonstratie van de bediening, geen officieel CAFA2-tentamen.</p>':'<p class="notice">Je oefent met een eerder afgenomen tentamen. Datum, zaalregels en algemene uitgangspunten hieronder komen uit het originele voorblad. De oefenklok begint pas als je nu start.</p>')+introduction(exam)+details(exam,false)+(own?'<div class="exam-banner"><p>Deze poging is al gestart. De oorspronkelijke eindtijd blijft gelden.</p><a class="btn primary" href="#tentamen/'+live.id+'">Toets hervatten</a></div>':live?'<p class="exam-warning">Er loopt nog een ander tentamen. Lever dat eerst in voordat je een nieuwe toets start.</p><a class="btn" href="#tentamen/'+live.id+'">Naar lopende toets</a>':'<label class="exam-extra"><input type="checkbox" data-exam-extra><span><strong>Extra tijd activeren (+30 minuten)</strong><small>Eenmalig vóór de start. Totale toetstijd: <span data-exam-total>'+exam.durationMinutes+'</span> minuten.</small></span></label><p class="small">De tijd loopt door bij sluiten of verversen. Bij nul wordt je poging automatisch ingeleverd en blijven je antwoorden beschikbaar.</p><div class="exam-start-actions">'+btn('Toets starten','start',true,'data-exam-id="'+esc(exam.id)+'" '+(!available(exam)||corrupt?'disabled':''))+(available(exam)?'':'<span class="small">'+(exam.availableFrom&&Date.parse(exam.availableFrom)>Date.now()?'Beschikbaar vanaf '+datetime(exam.availableFrom):'De starttermijn is verstreken.')+'</span>')+'</div>')+'</div>';
  }
  function answerFor(attempt,q) { return attempt.answers[q.id] || {}; }
  function answered(attempt,q) { return Engine.answeredCount({exam:{questions:[q]},answers:attempt.answers})>0; }
  function sectionFor(attempt,q) { return (attempt.exam.sections||[]).find(function(s){return s.id===q.sectionId;}); }
  function updateQuestionNav(attempt) {
    host.querySelectorAll('[data-exam-index]').forEach(function(el){var i=Number(el.dataset.examIndex),q=attempt.exam.questions[i];el.classList.toggle('is-answered',answered(attempt,q));el.classList.toggle('is-marked',!!attempt.marked[q.id]);el.setAttribute('aria-label','Vraag '+(i+1)+(answered(attempt,q)?', beantwoord':', niet beantwoord')+(attempt.marked[q.id]?', gemarkeerd':''));});
  }
  function runner(id) {
    var attempt=byId(id); if(!attempt)return missing(); if(attempt.status==='completed'){go('inzage/'+id);return;}
    var i=attempt.currentIndex,q=attempt.exam.questions[i],section=sectionFor(attempt,q);
    host.innerHTML='<h1 class="exam-runner-title">'+esc(label(attempt.exam))+'</h1><div class="frame"><div class="exam-work-head"><div class="exam-question-identity"><span>VRAAG</span><span class="qnum">'+(i+1)+'</span></div><div class="exam-position">VRAAG <strong>'+(i+1)+'</strong> VAN <strong>'+attempt.exam.questions.length+'</strong></div></div><div class="exam-question-body"><div class="exam-question-top"><h2>'+esc(section?section.title:'Volledig tentamen')+'</h2><span class="small">'+(q.points!==undefined?q.points+' punten':'')+'</span></div><div class="exam-document">'+rich(q.promptHtml,q.prompt)+'</div><span class="exam-answer-label">Vul het antwoord in</span><div data-exam-answer></div><p class="exam-save-status" data-exam-save></p></div><div class="exam-footer"><div class="actions">'+btn('‹ Vorige','previous',false,i===0?'disabled':'')+btn('Volgende ›','next',false,i===attempt.exam.questions.length-1?'disabled':'')+'</div><div class="exam-cirrus-actions">'+btn('Overzicht','overview')+(section?btn('Sectie','section'):'')+btn('Introductie','introduction')+btn(attempt.marked[q.id]?'Gemarkeerd':'Markeren','mark',false,'aria-pressed="'+!!attempt.marked[q.id]+'"')+btn('Toets voltooien','submit')+'</div></div></div>';
    if(q.sourceQuestion)host.querySelector('.exam-question-top').insertAdjacentHTML('afterend','<p class="small">Bronnummering: '+esc(q.sourceQuestion)+'</p>');
    var answerHost=host.querySelector('[data-exam-answer]');
    if(q.type==='open') {
      editor=Editor.mount(answerHost,{html:answerFor(attempt,q).html||'',label:'Antwoord op vraag '+(i+1),onChange:function(html){
        if(attempt.status!=='active'||Engine.remainingSeconds(attempt)===0){tick();return;}
        attempt.answers[q.id]={html:html};save();
      }});
    } else {
      answerHost.innerHTML='<fieldset class="exam-options"><legend>Kies één antwoord</legend>'+q.options.map(function(option){return '<label><input type="radio" name="exam-answer" value="'+esc(option.id)+'" '+(answerFor(attempt,q).optionId===option.id?'checked':'')+'><span>'+esc(option.text)+'</span></label>';}).join('')+'</fieldset>';
    }
    updateSaveStatus();
  }
  function showModal(title,html) {
    var old=document.getElementById('exam-info-dialog'); if(old)old.remove();
    var dialog=document.createElement('dialog');dialog.id='exam-info-dialog';dialog.className='exam-dialog exam-info-dialog';dialog.setAttribute('aria-labelledby','exam-info-title');
    dialog.innerHTML='<div class="exam-modal-head"><h2 id="exam-info-title">'+esc(title)+'</h2><button type="button" class="btn" data-close-info aria-label="Venster sluiten">Sluiten ×</button></div><div class="exam-modal-body">'+html+'</div>';
    document.body.appendChild(dialog);
    dialog.querySelector('[data-close-info]').addEventListener('click',function(){dialog.close();});
    dialog.addEventListener('click',function(e){if(e.target===dialog)dialog.close();var target=e.target.closest('[data-exam-index]');if(target){var attempt=byId(selectedAttempt);if(attempt&&attempt.status==='active'){attempt.currentIndex=Number(target.dataset.examIndex);save();dialog.close();route();}}});
    dialog.addEventListener('close',function(){dialog.remove();});
    if(dialog.showModal)dialog.showModal();else{dialog.setAttribute('open','');}
  }
  function overview(attempt) {
    var groups=(attempt.exam.sections||[]).slice();
    if(!groups.length||attempt.exam.questions.some(function(q){return !q.sectionId;}))groups.push({id:null,title:groups.length?'Overige vragen':'Alle vragen'});
    showModal('Vragenoverzicht','<p class="cafa-overview-summary">'+Engine.answeredCount(attempt)+' van '+attempt.exam.questions.length+' beantwoord · '+Object.values(attempt.marked).filter(Boolean).length+' gemarkeerd. Klik op een vraag om verder te gaan.</p>'+groups.map(function(section){return '<section class="exam-overview-section"><h3>'+esc(section.title)+'</h3><ol class="cafa-overview-list">'+attempt.exam.questions.map(function(q,i){if((q.sectionId||null)!==section.id)return '';var done=answered(attempt,q),marked=!!attempt.marked[q.id],current=i===attempt.currentIndex;return '<li><button type="button" data-exam-index="'+i+'" class="cafa-overview-item '+(done?'answered is-answered ':'')+(marked?'marked is-marked ':'')+(current?'current is-current':'')+'"'+(current?' aria-current="step"':'')+' aria-label="Vraag '+(i+1)+', '+esc(q.title||section.title)+(done?', beantwoord':', niet beantwoord')+(marked?', gemarkeerd':'')+(current?', huidige vraag':'')+'"><span class="cafa-overview-number">'+(i+1)+'</span><span class="cafa-overview-content"><span class="cafa-overview-title">'+esc(q.title||'Vraag '+(i+1))+'</span><span class="cafa-overview-meta">'+(q.type==='mc'?'Meerkeuzevraag':'Open vraag')+(q.points!==undefined?' · '+q.points+' punten':'')+(current?' · Huidige vraag':'')+'</span></span><span class="cafa-overview-state">'+(done?'Beantwoord':'Niet beantwoord')+'</span><span class="cafa-overview-mark">Gemarkeerd</span></button></li>';}).join('')+'</ol></section>';}).join(''));
  }
  function review(id) {
    var attempt=byId(id);if(!attempt)return missing();if(attempt.status==='active'){go('tentamen/'+id);return;}
    var html='<a class="exam-back" href="#dashboard/voltooid">‹ Voltooide toetsen</a>'+head(label(attempt.exam),'Je poging is ingeleverd. Antwoorden zijn alleen-lezen.')+'<div class="exam-paper"><div class="exam-banner"><div><strong>'+(attempt.finishReason==='timeout'?'De tijd is verstreken':'Tentamen voltooid')+'</strong><p>'+datetime(attempt.submittedAt)+' · '+Engine.answeredCount(attempt)+' van '+attempt.exam.questions.length+' beantwoord</p></div><span class="exam-pill">'+(attempt.exam.durationMinutes+attempt.extraMinutes)+' minuten beschikbaar</span></div><p>Open antwoorden worden niet automatisch beoordeeld. Vergelijk je uitwerking met het officiële antwoordmodel. Er wordt geen cijfer of slagingsuitslag berekend.</p><div class="actions">'+btn('Back-up downloaden','backup')+(examById(attempt.exam.id)?'<a class="btn" href="#welkom/'+encodeURIComponent(attempt.exam.id)+'">Opnieuw oefenen</a>':'')+'</div>';
    if(attempt.exam.sourceNotes&&attempt.exam.sourceNotes.length)html+='<details class="exam-warning"><summary>Opmerkingen bij het officiële antwoordmodel</summary><ul>'+attempt.exam.sourceNotes.map(function(note){return '<li>'+esc(note)+'</li>';}).join('')+'</ul></details>';
    attempt.exam.questions.forEach(function(q,i){var answer=answerFor(attempt,q),section=sectionFor(attempt,q);html+='<article class="exam-review-item"><span class="exam-eyebrow">'+esc(section?section.title:'')+'</span><h2>Vraag '+(i+1)+(q.points!==undefined?' · '+q.points+' punten':'')+'</h2>'+((q.sourceQuestion||q.originalNumber)?'<p class="small">Bronnummering: '+esc(q.sourceQuestion||q.title)+'</p>':'')+'<div class="exam-document">'+rich(q.promptHtml,q.prompt)+'</div>'+(section?'<details class="exam-review-case"><summary>Sectie: '+esc(section.title)+'</summary><div class="exam-document">'+Editor.sanitize(section.contentHtml)+'</div></details>':'')+'<h3>Jouw antwoord</h3><div class="exam-review-answer">'+(q.type==='open'?(answer.html?Editor.sanitize(answer.html):'<em>Niet beantwoord</em>'):esc((q.options.find(function(o){return o.id===answer.optionId;})||{text:'Niet beantwoord'}).text))+'</div>';
      if(q.type==='mc'&&q.correctOptionId)html+='<p>'+(!answer.optionId?'Niet beantwoord.':answer.optionId===q.correctOptionId?'Goed.':'Niet juist.')+' Juiste antwoord: '+esc(q.options.find(function(o){return o.id===q.correctOptionId;}).text)+'</p>';
      html+='<details class="exam-solution"><summary>Oplossing / antwoordmodel</summary><div class="exam-document">'+rich(q.solutionHtml,q.solution||'Er is nog geen antwoordmodel toegevoegd.')+'</div></details></article>';});
    host.innerHTML=html+'</div>';
  }
  function practiceReview(id) {
    var item=window.CafaPractice&&window.CafaPractice.getCompleted().find(function(x){return x.id===id;});if(!item)return missing();
    var bank=window.CAFA2_DATA.modules[item.code];
    host.innerHTML='<a class="exam-back" href="#dashboard/voltooid">‹ Voltooide toetsen</a>'+head(item.title,'Eerdere MC-poging · alleen-lezen')+'<div class="exam-paper"><p>'+item.answered+' van '+item.total+' beantwoord.</p><p>'+item.good+' van '+item.auto+' nagekeken MC-antwoorden goed.</p><p>Zelfbeoordeling: '+item.selfGood+' van '+item.self+' goed. Zelfbeoordeling telt niet mee in de MC-score.</p>'+bank.questions.map(function(q){var a=item.answers[q.id]||{};return '<article class="exam-review-item"><h2>Vraag '+q.id+' · '+esc(q.title)+'</h2><p>'+esc(q.task)+'</p><div class="exam-review-answer">'+(a.choice!==null&&a.choice!==undefined?'<p>Gekozen antwoord: '+String.fromCharCode(65+a.choice)+'</p>':'')+(a.html?Editor.sanitize(a.html):a.text?'<p class="exam-prose">'+esc(a.text)+'</p>':'')+(a.rows&&a.rows.some(function(row){return row.some(Boolean);})?'<table><tbody>'+a.rows.map(function(row){return '<tr>'+row.map(function(cell){return '<td>'+esc(cell)+'</td>';}).join('')+'</tr>';}).join('')+'</tbody></table>':'')+(a.firstMC?'<p>Eerste MC-beoordeling: '+(a.firstMC.correct?'goed':'fout')+'</p>':'')+'</div></article>';}).join('')+'<a class="btn" href="#voortgang">Naar MC-voortgang</a></div>';
  }
  function missing() {host.innerHTML=head('Toets niet gevonden','De toets of poging is niet beschikbaar in deze browser.')+'<a class="btn" href="#dashboard">Naar dashboard</a>';}
  var clock=document.createElement('div');clock.className='exam-clock';clock.hidden=true;clock.innerHTML='<span>Resterende tijd</span><strong role="timer" aria-label="Resterende toetstijd"></strong>';document.querySelector('.top-controls').appendChild(clock);
  function complete(attempt,reason) {
    if(!attempt||attempt.status!=='active')return;
    var finished=Engine.finishAttempt(attempt,{reason:reason});
    Object.assign(attempt,finished); save();
    if(submitDialog.open)submitDialog.close();
    var info=document.getElementById('exam-info-dialog');if(info)info.close();
    announce(reason==='timeout'?'De toetstijd is verstreken. Je antwoorden zijn ingeleverd.':'Je tentamen is ingeleverd.');
    if(location.hash.indexOf('#tentamen/')===0)go('inzage/'+attempt.id);else if(location.hash.indexOf('#dashboard')===0)dashboard(location.hash==='#dashboard/voltooid');
  }
  function tick() {
    var attempt=active();
    if(attempt&&Engine.remainingSeconds(attempt)===0){complete(attempt,'timeout');attempt=null;}
    var examSurface=/^#(?:tentamen|welkom|inzage)\//.test(location.hash)&&location.hash!=='#welkom/practice';
    clock.hidden=!(attempt&&examSurface);
    if(attempt){var seconds=Engine.remainingSeconds(attempt);clock.querySelector('strong').textContent=Engine.formatTime(seconds);clock.classList.toggle('is-urgent',seconds<=600);if(seconds<=600&&!announcedTen.has(attempt.id)){announcedTen.add(attempt.id);announce('Nog tien minuten of minder. De klok toont nu minuten en seconden.');}}
  }
  function route() {
    dropEditor(); var parts=location.hash.slice(1).split('/'),kind=parts[0],id;
    try{id=decodeURIComponent(parts.slice(1).join('/'));}catch(e){id='';}
    var isExam=['dashboard','welkom','tentamen','inzage','mc-inzage'].includes(kind);
    host.hidden=!isExam;document.body.classList.toggle('exam-surface',isExam);document.body.classList.toggle('exam-dashboard',kind==='dashboard');document.body.classList.toggle('exam-running',kind==='tentamen');selectedAttempt=kind==='tentamen'?id:null;
    if(!isExam){tick();return;}
    if(kind==='dashboard')dashboard(id==='voltooid');
    if(kind==='welkom')welcome(id);
    if(kind==='tentamen')runner(id);
    if(kind==='inzage')review(id);
    if(kind==='mc-inzage')practiceReview(id);
    tick();window.scrollTo(0,0);
  }
  host.addEventListener('change',function(e){
    if(e.target.matches('[data-exam-filter]'))go('dashboard'+(e.target.value==='completed'?'/voltooid':''));
    if(e.target.matches('[data-completed-type]')){completedType=e.target.value;dashboard(true);host.querySelector('[data-completed-type]').focus();}
    if(e.target.matches('[data-completed-attempts]')){completedAttempts=e.target.value;dashboard(true);host.querySelector('[data-completed-attempts]').focus();}
    if(e.target.matches('[data-exam-extra]')){var exam=examById(decodeURIComponent(location.hash.slice(8)));if(exam){var total=exam.durationMinutes+(e.target.checked?30:0);host.querySelector('[data-exam-total]').textContent=total;host.querySelector('[data-exam-detail-duration]').textContent=total+' minuten';}}
    if(e.target.name==='exam-answer'){var a=byId(selectedAttempt);if(a&&a.status==='active'&&Engine.remainingSeconds(a)>0){a.answers[a.exam.questions[a.currentIndex].id]={optionId:e.target.value};save();}else tick();}
  });
  host.addEventListener('click',function(e){
    var button=e.target.closest('[data-exam-action]');if(!button)return;var action=button.dataset.examAction;
    if(action==='backup'){downloadBackup();return;}
    if(action==='start'){
      var exam=examById(button.dataset.examId);if(!exam||active()||corrupt)return;
      try{var a=Engine.createAttempt(exam,{extraTime:!!host.querySelector('[data-exam-extra]:checked'),id:exam.id+'-'+Date.now()+'-'+Math.random().toString(36).slice(2,7)});attempts().push(a);save();go('tentamen/'+a.id);}catch(error){announce(error.message);showModal('Starten niet mogelijk','<p>'+esc(error.message)+'</p>');}return;
    }
    var attempt=byId(selectedAttempt);if(!attempt||attempt.status!=='active')return;if(Engine.remainingSeconds(attempt)===0){tick();return;}
    var q=attempt.exam.questions[attempt.currentIndex];
    if(action==='previous'||action==='next'){attempt.currentIndex=Math.max(0,Math.min(attempt.exam.questions.length-1,attempt.currentIndex+(action==='next'?1:-1)));save();route();}
    if(action==='overview')overview(attempt);
    if(action==='section'){var section=sectionFor(attempt,q);if(section)showModal(section.title,'<div class="exam-document">'+Editor.sanitize(section.contentHtml)+'</div>');}
    if(action==='introduction')showModal('Introductie · '+label(attempt.exam),introduction(attempt.exam));
    if(action==='mark'){attempt.marked[q.id]=!attempt.marked[q.id];button.textContent=attempt.marked[q.id]?'Gemarkeerd':'Markeren';button.setAttribute('aria-pressed',String(!!attempt.marked[q.id]));save();}
    if(action==='submit'){document.querySelector('[data-exam-submit-summary]').textContent=Engine.answeredCount(attempt)+' van '+attempt.exam.questions.length+' vragen beantwoord. '+Object.values(attempt.marked).filter(Boolean).length+' vragen gemarkeerd.';if(submitDialog.showModal)submitDialog.showModal();else if(confirm('Je tentamen definitief inleveren?'))complete(attempt,'submitted');}
  });
  document.querySelector('[data-exam-cancel-submit]').addEventListener('click',function(){submitDialog.close();});
  document.querySelector('[data-exam-confirm-submit]').addEventListener('click',function(){complete(byId(selectedAttempt),'submitted');});
  window.addEventListener('hashchange',route);
  window.addEventListener('cafa:practice-change',function(){if(location.hash.indexOf('#dashboard')===0)dashboard(location.hash==='#dashboard/voltooid');});
  document.addEventListener('visibilitychange',tick);
  window.addEventListener('storage',function(e){if(e.key!==KEY||!e.newValue)return;try{store=loadState(e.newValue);route();announce('Tentamenpoging bijgewerkt vanuit een ander tabblad.');}catch(error){announce('Voortgang uit het andere tabblad kon niet worden gelezen.');}});
  window.addEventListener('beforeunload',function(e){if(!saveOK&&active()){e.preventDefault();e.returnValue='';}});
  // Expired attempts are completed even when the learner reopens the dashboard later.
  attempts().filter(function(a){return a.status==='active'&&Engine.remainingSeconds(a)===0;}).forEach(function(a){Object.assign(a,Engine.finishAttempt(a,{reason:'timeout'}));});
  if(!corrupt)save();
  if(!location.hash)history.replaceState(null,'','#dashboard');
  route();setInterval(tick,1000);
  window.CafaExams={catalog:catalog,getAttempts:function(){return JSON.parse(JSON.stringify(attempts()));},storageKey:KEY};
}());
