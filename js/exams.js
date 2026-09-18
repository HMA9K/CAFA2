(function () {
  'use strict';
  var Engine = window.CafaExamEngine, Editor = window.CafaAnswerEditor;
  var host = document.getElementById('exam-app');
  if (!Engine || !Editor || !host) throw new Error('De tentamenomgeving kon niet worden geladen.');
  var KEY = 'cafa2-full-exams-v1', store = {version:1, attempts:[]};
  var editor = null, saveOK = true, corrupt = false, selectedAttempt = null;
  var submitDialog = document.getElementById('exam-submit-dialog');
  var announcedTen = new Set(), catalogErrors = [];
  var reviewTab = 'results', reviewWidth = 38;
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
  function running(examId) { return attempts().filter(function(a){return a.status==='active' && (!examId || a.exam.id===examId);}); }
  function documentHtml(exam,kind,html,plain) { return window.CafaExamDocument ? window.CafaExamDocument.render(exam,kind,html,plain) : '<div class="exam-document">'+rich(html,plain)+'</div>'; }
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
      if(attempt.pausedAt!=null && (!Number.isSafeInteger(attempt.pausedAt)||(!attempt.untimed&&(!Number.isFinite(attempt.pausedSeconds)||attempt.pausedSeconds<0))))throw new Error('Ongeldige pauze');
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
    var indicator=document.querySelector('.exam-save-indicator');
    if(indicator){indicator.hidden=!saveOK;}
    host.querySelectorAll('[data-exam-save]').forEach(function (el) {
      var a=byId(selectedAttempt);
      el.textContent = saveOK ? ('Opgeslagen op dit apparaat.'+(a&&a.untimed?' Je oefent zonder tijdslimiet.':a&&a.pausedAt!=null?' De klok is gepauzeerd.':' De klok loopt door totdat je pauzeert.')) : 'Opslaan lukt niet. Houd deze pagina open en download een back-up van je antwoorden.';
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
    var live = running(), completedExams = attempts().filter(function (a) { return a.status === 'completed'; });
    var completedPractice = window.CafaPractice ? window.CafaPractice.getCompleted() : [];
    var viewName=completed?'Voltooid':'Aankomend';
    var html='<div class="exam-dashboard-title"><h1>Dashboard</h1></div><div class="exam-dashboard-content"><nav class="exam-breadcrumb" aria-label="Kruimelpad"><a href="#dashboard" aria-label="Dashboard"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M1 9 10 1l9 8-2 2-1-1v8h-5v-5H8v5H3v-8l-1 1Z"/></svg></a><span>/</span><span aria-current="page">'+viewName+'</span></nav><div class="exam-dashboard-view"><label class="exam-switch"><span class="sr-only">Toetsen weergeven</span><select data-exam-filter aria-label="Toetsen weergeven"><option value="upcoming"'+(!completed?' selected':'')+'>Aankomend</option><option value="completed"'+(completed?' selected':'')+'>Voltooid</option></select></label></div>';
    if (corrupt) html += '<p class="exam-warning" role="alert">Eerder opgeslagen tentamenpogingen konden niet worden gelezen. Ze zijn niet overschreven. Nieuwe tentamens starten is geblokkeerd om je gegevens te beschermen.</p>';
    if (catalogErrors.length) html += '<p class="exam-warning" role="alert">Een tentamen kon niet worden geladen. De overige toetsen zijn beschikbaar.</p>';
    if (completed) {
      var rows = completedExams.map(function (attempt) {
        return {type:'exam',key:attempt.exam.id,time:attempt.submittedAt,html:'<tr><td><a class="exam-name" href="#inzage/'+encodeURIComponent(attempt.id)+'">'+esc(label(attempt.exam))+'</a><span class="exam-sub">'+(attempt.finishReason==='timeout'?'Tijd verstreken':'Ingeleverd')+' · '+Engine.answeredCount(attempt)+' / '+attempt.exam.questions.length+' beantwoord</span></td><td data-label="Code">'+esc(attempt.exam.date.replace(/-/g,''))+'</td><td data-label="Ingeleverd">'+datetime(attempt.submittedAt)+'</td><td data-label="Percentage juist">'+(totals(attempt,attempt.exam.questions).pending?'Nog niet volledig beoordeeld':num(100*totals(attempt,attempt.exam.questions).score/(totals(attempt,attempt.exam.questions).max||1))+'%')+'</td><td data-label="Cijfer">Niet bekend</td><td data-label="Resultaat">Zelf nakijken</td><td><a class="btn primary" href="#inzage/'+encodeURIComponent(attempt.id)+'">Weergeven</a></td></tr>'};
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
      var ready = catalog.filter(available);
      function examRow(exam,resume) { var target=resume?'#tentamen/'+encodeURIComponent(resume.id):'#welkom/'+encodeURIComponent(exam.id);return '<tr><td><a class="exam-name" href="'+target+'">'+esc(label(exam))+'</a>'+(resume?'<span class="exam-sub">Gestart '+datetime(resume.startedAt)+' · nog '+(resume.pausedAt!=null?'Gepauzeerd · ':'')+Engine.formatTime(Engine.remainingSeconds(resume))+'</span>':'')+'</td><td data-label="Code">'+esc(exam.date.replace(/-/g,''))+'</td><td data-label="Beschikbaar">'+(exam.availableFrom?datetime(exam.availableFrom):'Nu beschikbaar')+'</td><td data-label="Deadline">'+(exam.deadline?datetime(exam.deadline):'Geen deadline')+'</td><td data-label="Duur">'+(exam.durationMinutes+(resume?resume.extraMinutes:0))+' minuten</td><td><a class="btn primary" href="'+target+'">'+(resume?'Toets hervatten':running(exam.id).length?'Nieuwe poging':available(exam)?'Toets starten':'Details bekijken')+'</a></td></tr>'; }
      var today=['<tr><td><a class="exam-name" href="#welkom/practice">CAFA2 oefenvragen</a></td><td data-label="Code">CAFA2-MC</td><td data-label="Beschikbaar">Altijd beschikbaar</td><td data-label="Deadline">Geen deadline</td><td data-label="Duur">Geen tijdslimiet</td><td><a class="btn primary" href="#welkom/practice">Toets starten</a></td></tr>'];
      live.forEach(function(a){today.push(examRow(a.exam,a));});
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
    return documentHtml(exam,'exam',exam.introductionHtml,exam.introduction)+(exam.instructions&&exam.instructions.length?'<ul class="exam-instructions">'+exam.instructions.map(function(s){return '<li>'+esc(s)+'</li>';}).join('')+'</ul>':'');
  }
  function welcome(id) {
    if (id==='practice') {
      host.innerHTML = '<a class="exam-back" href="#dashboard">‹ Dashboard</a>'+head('CAFA2 oefenvragen','Welkom bij de oefenomgeving')+'<div class="exam-paper"><h2>Oefen in je eigen tempo</h2><p class="exam-prose">Je kunt kiezen uit vier onderwerpen, met 30 vragen per onderwerp. Je kiest een meerkeuzeantwoord of werkt je antwoord zelf uit met tekst, tabellen en journaalposten. Je oorspronkelijke MC-score blijft bewaard wanneer je een vraag herhaalt.</p><dl class="exam-details"><div><dt>Vragen</dt><dd>120, verdeeld over 4 onderwerpen</dd></div><div><dt>Duur</dt><dd>Geen tijdslimiet</dd></div><div><dt>Nakijken</dt><dd>Per vraag of na voltooien</dd></div><div><dt>Voortgang</dt><dd>Op dit apparaat</dd></div></dl><p>MC-oefenvragen hebben geen aftelklok. De extra-tijdoptie is hier niet van toepassing.</p><div class="exam-start-actions"><a class="btn primary" href="#start">Toets starten</a><span class="small">Kies daarna een onderwerp.</span></div></div>';
      return;
    }
    var exam = examById(id); if(!exam) return missing();
    var live=running(id);
    host.innerHTML='<a class="exam-back" href="#dashboard">‹ Dashboard</a>'+head(label(exam),'Welkom. Lees eerst de informatie en kies eventueel extra tijd.')+'<div class="exam-paper">'+(exam.demo?'<p class="exam-warning">Demonstratie van de bediening, geen officieel CAFA2-tentamen.</p>':'<p class="notice">Je oefent met een eerder afgenomen tentamen. Datum, zaalregels en algemene uitgangspunten hieronder komen uit het originele voorblad. De oefenklok begint pas als je nu start.</p>')+introduction(exam)+details(exam,false)+(live.length?'<div class="exam-banner"><div><p>Je hebt '+live.length+' lopende poging(en) van dit tentamen. Hervat een poging of start hieronder een nieuwe.</p>'+live.map(function(a){return '<p><a class="btn" href="#tentamen/'+a.id+'">Hervatten · '+datetime(a.startedAt)+' · '+Engine.formatTime(Engine.remainingSeconds(a))+'</a></p>';}).join('')+'</div></div>':'')+'<label class="exam-extra"><input type="checkbox" data-exam-untimed><span><strong>Oefenen zonder tijdslimiet</strong><small>Geen aftelklok en geen automatische inlevering.</small></span></label><label class="exam-extra"><input type="checkbox" data-exam-extra><span><strong>Extra tijd activeren (+30 minuten)</strong><small>Eenmalig vóór de start. Totale toetstijd: <span data-exam-total>'+exam.durationMinutes+'</span> minuten.</small></span></label><p class="small">Elke poging heeft eigen antwoorden en een eigen klok. Bij oefenen met tijd loopt de klok door bij wisselen, sluiten of verversen. Je kunt de toets pauzeren. Bij nul wordt de poging ingeleverd. Je kunt ook per vraag je antwoord controleren.</p><div class="exam-start-actions">'+btn('Toets starten','start',true,'data-exam-id="'+esc(exam.id)+'" '+(!available(exam)||corrupt?'disabled':''))+(available(exam)?'':'<span class="small">'+(exam.availableFrom&&Date.parse(exam.availableFrom)>Date.now()?'Beschikbaar vanaf '+datetime(exam.availableFrom):'De starttermijn is verstreken.')+'</span>')+'</div>'+'</div>';
  }
  function answerFor(attempt,q) { return attempt.answers[q.id] || {}; }
  function answered(attempt,q) { return Engine.answeredCount({exam:{questions:[q]},answers:attempt.answers})>0; }
  function sectionFor(attempt,q) { return (attempt.exam.sections||[]).find(function(s){return s.id===q.sectionId;}); }
  function updateQuestionNav(attempt) {
    host.querySelectorAll('[data-exam-index]').forEach(function(el){var i=Number(el.dataset.examIndex),q=attempt.exam.questions[i];el.classList.toggle('is-answered',answered(attempt,q));el.classList.toggle('is-marked',!!attempt.marked[q.id]);el.setAttribute('aria-label','Vraag '+(i+1)+(answered(attempt,q)?', beantwoord':', niet beantwoord')+(attempt.marked[q.id]?', gemarkeerd':''));});
  }
  function runner(id) {
    var attempt=byId(id); if(!attempt)return missing(); if(attempt.status==='completed'){go('inzage/'+id);return;}
    if(attempt.pausedAt!=null){host.innerHTML=head(label(attempt.exam),'Toets gepauzeerd')+'<div class="exam-paper exam-paused"><h2>Je toets is gepauzeerd</h2><p>Je antwoorden zijn bewaard. De resterende tijd verandert niet tijdens de pauze.</p><p>'+esc(Engine.formatTime(Engine.remainingSeconds(attempt)))+'</p>'+btn('Toets hervatten','resume',true)+' <a class="btn" href="#dashboard">Dashboard</a></div>';return;}
    var i=attempt.currentIndex,q=attempt.exam.questions[i],section=sectionFor(attempt,q);
    host.innerHTML='<h1 class="exam-runner-title">'+esc(label(attempt.exam))+'</h1><div class="frame"><div class="exam-work-head"><div class="exam-question-identity"><span>VRAAG</span><span class="qnum">'+(i+1)+'</span></div><div class="exam-position">VRAAG <strong>'+(i+1)+'</strong> VAN <strong>'+attempt.exam.questions.length+'</strong></div></div><div class="exam-question-body"><div class="exam-question-top"><h2>'+esc(section?section.title:'Volledig tentamen')+'</h2><span class="exam-source-points">'+(q.points!==undefined?'('+q.points+' punten)':'')+'</span></div>'+documentHtml(attempt.exam,'question',q.promptHtml,q.prompt)+'<span class="exam-answer-label">Vul het antwoord in</span><div data-exam-answer></div><div class="exam-answer-actions">'+btn('Antwoord controleren','check')+btn('Pauzeren','pause')+'</div><p class="exam-save-status" data-exam-save></p></div><div class="exam-footer"><div class="actions">'+btn('‹ Vorige','previous',false,i===0?'disabled':'')+btn('Volgende ›','next',false,i===attempt.exam.questions.length-1?'disabled':'')+'</div><div class="exam-cirrus-actions">'+btn('Overzicht','overview')+(section?btn('Sectie','section'):'')+btn('Introductie','introduction')+btn(attempt.marked[q.id]?'Gemarkeerd':'Markeren','mark',false,'aria-pressed="'+!!attempt.marked[q.id]+'"')+btn('Toets voltooien','submit')+'</div></div></div>';

    var answerHost=host.querySelector('[data-exam-answer]');
    if(q.type==='open') {
      if(window.CafaJournalTable&&window.CafaJournalTable.supports(q)){
        var journalHost=document.createElement('div');answerHost.appendChild(journalHost);
        window.CafaJournalTable.mount(journalHost,answerFor(attempt,q).journalRows,function(rows){
          if(attempt.status!=='active'||attempt.pausedAt!=null||Engine.remainingSeconds(attempt)===0){tick();return;}
          attempt.answers[q.id]=Object.assign({},answerFor(attempt,q),{journalRows:rows});invalidateScore(attempt,q);save();
        });
        var journalNotes=document.createElement('details');journalNotes.className='stock-notes';journalNotes.open=!!answerFor(attempt,q).html;
        journalNotes.innerHTML='<summary>Toelichting of berekening toevoegen</summary><div></div>';answerHost.appendChild(journalNotes);answerHost=journalNotes.querySelector('div');
      }
      var stock=window.CafaStockTable&&window.CafaStockTable.template(q);
      if(stock){
        var stockHost=document.createElement('div');answerHost.appendChild(stockHost);
        window.CafaStockTable.mount(stockHost,stock,answerFor(attempt,q).stockCells,function(cells){
          if(attempt.status!=='active'||Engine.remainingSeconds(attempt)===0){tick();return;}
          attempt.answers[q.id]=Object.assign({},answerFor(attempt,q),{stockCells:cells});invalidateScore(attempt,q);save();
        });
        var notes=document.createElement('details');notes.className='stock-notes';notes.open=!!answerFor(attempt,q).html;
        notes.innerHTML='<summary>Toelichting of berekening toevoegen</summary><div data-stock-notes></div>';answerHost.appendChild(notes);answerHost=notes.querySelector('[data-stock-notes]');
      }
      editor=Editor.mount(answerHost,{html:answerFor(attempt,q).html||'',label:'Antwoord op vraag '+(i+1),onChange:function(html){
        if(attempt.status!=='active'||Engine.remainingSeconds(attempt)===0){tick();return;}
        attempt.answers[q.id]=Object.assign({},answerFor(attempt,q),{html:html});invalidateScore(attempt,q);save();
      }});
    } else {
      answerHost.innerHTML='<fieldset class="exam-options"><legend>Kies één antwoord</legend>'+q.options.map(function(option){return '<label><input type="radio" name="exam-answer" value="'+esc(option.id)+'" '+(answerFor(attempt,q).optionId===option.id?'checked':'')+'><span>'+esc(option.text)+'</span></label>';}).join('')+'</fieldset>';
    }
    updateSaveStatus();
  }
  function showModal(title,html,overviewSize) {
    var old=document.getElementById('exam-info-dialog'); if(old)old.remove();
    var dialog=document.createElement('dialog');dialog.id='exam-info-dialog';dialog.className='exam-dialog exam-info-dialog';dialog.setAttribute('aria-labelledby','exam-info-title');
    dialog.innerHTML='<div class="exam-modal-head"><h2 id="exam-info-title">'+esc(title)+'</h2><button type="button" class="btn" data-close-info aria-label="Venster sluiten">Sluiten ×</button></div><div class="exam-modal-body">'+html+'</div>';
    if(overviewSize){dialog.classList.add('compact-overview-dialog');dialog.querySelector('[data-close-info]').textContent='×';dialog.insertAdjacentHTML('beforeend','<div class="compact-overview-footer"><span class="compact-overview-range">1-'+overviewSize+'</span><button type="button" class="btn primary" data-close-info>Sluiten</button></div>');}
    document.body.appendChild(dialog);
    if(window.CafaStockTable)window.CafaStockTable.enhance(dialog);
    dialog.querySelectorAll('[data-close-info]').forEach(function(button){button.addEventListener('click',function(){dialog.close();});});
    dialog.addEventListener('click',function(e){if(e.target===dialog)dialog.close();var target=e.target.closest('[data-exam-index]');if(target){var attempt=byId(selectedAttempt);if(attempt&&attempt.status==='active'){attempt.currentIndex=Number(target.dataset.examIndex);save();dialog.close();route();}}});
    dialog.addEventListener('close',function(){dialog.remove();});
    if(dialog.showModal)dialog.showModal();else{dialog.setAttribute('open','');}
  }
  function overview(attempt) {
    var questions=attempt.exam.questions,total=questions.length;
    var html='<div class="compact-overview-body"><div class="compact-overview-remaining">NOG TE DOEN <strong>'+(total-Engine.answeredCount(attempt))+'</strong></div><ol class="compact-overview-grid" style="--overview-columns:'+Math.ceil(total/10)+'">'+questions.map(function(q,i){
      var done=answered(attempt,q),marked=!!attempt.marked[q.id],current=i===attempt.currentIndex,section=sectionFor(attempt,q),boundary=i>0&&q.sectionId!==questions[i-1].sectionId;
      return '<li class="'+(boundary?'compact-overview-divider':'')+'">'+(boundary?'<span class="sr-only">'+esc(section?section.title:'Volgende opgave')+'</span>':'')+'<button type="button" data-exam-index="'+i+'" class="compact-overview-item '+(done?'is-answered ':'')+(marked?'is-marked ':'')+'"'+(current?' aria-current="step"':'')+' aria-label="Vraag '+(i+1)+', '+esc(q.title||(section?section.title:''))+(done?', beantwoord':', niet beantwoord')+(marked?', gemarkeerd':'')+(current?', huidige vraag':'')+'"><span class="compact-overview-number">'+(i+1)+'</span><span class="compact-overview-state">'+(done?'Beantwoord':'Niet<br>beantwoord')+'</span>'+(marked?'<span class="compact-overview-flag" aria-hidden="true" title="Gemarkeerd">⚑</span>':'')+'</button></li>';
    }).join('')+'</ol></div>';
    showModal('Vraagoverzicht',html,total);
  }
  function invalidateScore(a,q){if(a.scores)delete a.scores[q.id];}
  function scoreFor(a,q){
    if(q.type==='mc'&&q.correctOptionId)return answerFor(a,q).optionId===q.correctOptionId?(q.points||0):0;
    var v=a.scores&&a.scores[q.id];return typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=(q.points||0)?v:null;
  }
  function totals(a,questions){var result={score:0,max:0,pending:0};questions.forEach(function(q){result.max+=q.points||0;var value=scoreFor(a,q);if(value===null)result.pending++;else result.score+=value;});return result;}
  function num(n){return Number(n.toFixed(2)).toLocaleString('nl-NL');}
  function badge(a,q){var score=scoreFor(a,q),max=q.points||0;return '<span class="result-score '+(score===null?'ungraded':score===max?'full':score===0?'zero':'partial')+'">'+(score===null?'Nog beoordelen':'<strong>'+num(score)+'</strong> van '+num(max))+'</span>';}
  function scoreInput(a,q){return q.type==='mc'?'<p>Automatisch beoordeeld: '+badge(a,q)+'</p>':'<label class="self-score">Zelfbeoordeling: punten (0–'+(q.points||0)+') <input type="number" min="0" max="'+(q.points||0)+'" step="any" data-self-score data-attempt="'+esc(a.id)+'" data-question="'+esc(q.id)+'" value="'+(scoreFor(a,q)===null?'':scoreFor(a,q))+'"><span data-score-saved role="status"></span></label>';}
  function ownAnswer(a,q){var answer=answerFor(a,q),html='';
    if(q.type==='mc')return '<div class="exam-review-answer">'+esc((q.options.find(function(o){return o.id===answer.optionId;})||{text:'Niet beantwoord'}).text)+'</div>';
    var stock=window.CafaStockTable&&window.CafaStockTable.template(q);
    if(stock)html+=window.CafaStockTable.render(stock,answer.stockCells||{},true);
    if(window.CafaJournalTable&&window.CafaJournalTable.supports(q))html+=window.CafaJournalTable.render(answer.journalRows,true);
    if(answer.html)html+=Editor.sanitize(answer.html);
    if(!html)html='<em>Niet beantwoord</em>';
    return '<div class="exam-review-answer">'+html+'</div>';
  }
  function splitter(){return '<div class="review-resizer" tabindex="0" role="separator" aria-label="Breedte antwoordmodel aanpassen" aria-orientation="vertical" aria-valuemin="25" aria-valuemax="65" aria-valuenow="'+reviewWidth+'" title="Sleep om de breedte aan te passen, of gebruik de pijltoetsen"><span>⋮</span></div>';}
  function sidebar(a,q){var section=sectionFor(a,q);return '<aside class="review-sidebar"><div class="review-side-tabs" role="tablist" aria-label="Nakijken"><button type="button" role="tab" aria-selected="true" data-review-panel="model">Antwoordmodel</button><button type="button" role="tab" aria-selected="false" data-review-panel="score">Scoring</button>'+(section?'<button type="button" role="tab" aria-selected="false" data-review-panel="section">Sectie</button>':'')+'</div><div class="review-side-content" data-side-panel="model"><h2>ANTWOORDMODEL</h2>'+documentHtml(a.exam,'solution',q.solutionHtml,q.solution||'Er is nog geen antwoordmodel toegevoegd.')+'</div><div class="review-side-content" data-side-panel="score" hidden><h2>SCORING</h2><h3>Puntentotaal</h3>'+badge(a,q)+scoreInput(a,q)+'<p>Open antwoorden beoordeel je zelf aan de hand van het antwoordmodel.</p></div>'+(section?'<div class="review-side-content" data-side-panel="section" hidden><h2>SECTIE</h2><h3>'+esc(section.title)+'</h3>'+documentHtml(a.exam,'exam',section.contentHtml)+'</div>':'')+'</aside>';}
  function comparison(a,q){return '<div class="review-split" style="--review-width:'+reviewWidth+'%"><div class="review-own"><h3>Jouw antwoord</h3>'+ownAnswer(a,q)+'</div>'+splitter()+sidebar(a,q)+'</div>';}
  function checkAnswer(a,q){
    showModal('Antwoord controleren · Vraag '+(a.currentIndex+1),'<p>Vergelijk je antwoord met het model. Bij open vragen ken je zelf punten toe. Je kunt daarna verder oefenen.'+(a.untimed?'':' De klok blijft lopen; sluit dit venster en kies Pauzeren om de klok stil te zetten.')+'</p>'+comparison(a,q));
  }
  function resultSummary(a){var t=totals(a,a.exam.questions),percent=t.max?100*t.score/t.max:0;return '<div class="result-summary"><span class="result-overview-label">OVERZICHT</span><div><span>Percentage: <strong>'+num(percent)+'%</strong></span><span>Totaalscore: <strong>'+num(t.score)+' van '+num(t.max)+'</strong></span></div><p class="small">'+(t.pending?t.pending+' vragen nog te beoordelen. De getoonde score is voorlopig. ':'')+'Open vragen: zelfbeoordeling aan de hand van het antwoordmodel. Meerkeuzevragen: automatische beoordeling.</p></div>';}
  function groupQuestions(a){var sections=(a.exam.sections||[]).slice();if(!sections.length||a.exam.questions.some(function(q){return !q.sectionId;}))sections.push({id:null,title:'Overige vragen'});return sections.map(function(s){return {section:s,questions:a.exam.questions.filter(function(q){return (q.sectionId||null)===s.id;})};});}
  function reviewQuestion(a,index){var i=Math.max(0,Math.min(a.exam.questions.length-1,index)),q=a.exam.questions[i],section=sectionFor(a,q);
    host.innerHTML='<div class="review-feedback-banner">Bekijk je antwoorden en het officiële antwoordmodel</div><nav class="exam-breadcrumb"><a href="#dashboard/voltooid">Voltooid</a><span>/</span><a href="#inzage/'+esc(a.id)+'">Resultaten: '+esc(label(a.exam))+'</a><span>/ Vraag '+(i+1)+'</span></nav><div class="review-detail-layout review-split" style="--review-width:'+reviewWidth+'%"><div class="review-detail-main"><div class="review-toolbar"><label><span class="sr-only">Vraag kiezen</span><select data-review-select data-attempt="'+esc(a.id)+'">'+a.exam.questions.map(function(_,n){return '<option value="'+n+'"'+(n===i?' selected':'')+'>Vraag '+(n+1)+'</option>';}).join('')+'</select></label><div class="actions">'+btn('← Vorige','review-question',true,'data-attempt="'+esc(a.id)+'" data-index="'+(i-1)+'" '+(i===0?'disabled':''))+btn('Volgende →','review-question',true,'data-attempt="'+esc(a.id)+'" data-index="'+(i+1)+'" '+(i===a.exam.questions.length-1?'disabled':''))+'</div></div><details class="review-prompt" open><summary>Vraag '+(i+1)+'</summary>'+documentHtml(a.exam,'question',q.promptHtml,q.prompt)+'</details>'+ownAnswer(a,q)+'</div>'+splitter()+sidebar(a,q)+'</div>';
  }
  function review(id) {
    var parts=id.split('/vraag/'),a=byId(parts[0]);if(!a)return missing();if(a.status==='active'){go('tentamen/'+a.id);return;}
    if(parts.length>1){reviewQuestion(a,Number(parts[1])||0);return;}
    var html='<nav class="exam-breadcrumb"><a href="#dashboard/voltooid">Voltooid</a><span>/ Resultaten</span></nav>'+head(label(a.exam)+' · Resultaten','')+'<div class="exam-results-panel"><div class="result-tabs" role="tablist" aria-label="Resultatenweergave">'+btn('Resultaten','review-tab',false,'role="tab" aria-selected="'+(reviewTab==='results')+'" data-tab="results" data-attempt="'+esc(a.id)+'"')+btn('Scorerapport','review-tab',false,'role="tab" aria-selected="'+(reviewTab==='report')+'" data-tab="report" data-attempt="'+esc(a.id)+'"')+'</div>'+resultSummary(a);
    var groups=groupQuestions(a),all=totals(a,a.exam.questions);
    if(reviewTab==='report'){
      function reportRow(title,t,child){var percent=t.max?100*t.score/t.max:0;return '<tr><th scope="row"'+(child?' class="report-child"':'')+'>'+esc(title)+'</th><td>'+num(t.score)+(t.pending?' *':'')+'</td><td>'+num(t.max)+'</td><td><div class="report-progress-label"><span>Voortgang</span><strong>'+num(percent)+'%</strong></div><div class="report-track" role="meter" aria-label="'+esc(title)+'" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+percent+'"><i style="left:'+percent+'%"></i></div></td></tr>';}
      html+='<div class="report-actions">'+btn('Scorerapport afdrukken','print-report')+'</div><div class="score-report-scroll"><table class="score-report"><thead><tr><th>LEERDOEL</th><th>UW SCORE</th><th>TOTAALSCORE</th><th>NIVEAU VAN BEHEERSING</th></tr></thead><tbody>'+reportRow('CAFA2',all,false)+groups.map(function(g,i){return reportRow('CAFA2 Leerdoel '+(i+1)+' · '+g.section.title,totals(a,g.questions),true);}).join('')+'</tbody></table></div><p class="report-legend">● Uw score'+(all.pending?' · * Voorlopig: niet alle vragen zijn beoordeeld.':'')+'</p>';
    }else{
      html+='<div class="result-answers"><h2>Antwoorden</h2><div class="result-list-head"><strong>RESULTATEN</strong><strong>UW SCORE</strong></div>'+groups.map(function(g){var t=totals(a,g.questions);return '<section class="result-group"><h3>'+esc(g.section.title)+' ('+num(t.max)+' punten)<span class="result-score partial">'+num(t.score)+' van '+num(t.max)+(t.pending?' *':'')+'</span></h3>'+g.questions.map(function(q){var i=a.exam.questions.indexOf(q);return '<details class="result-question exam-review-item" data-result-id="'+esc(q.id)+'"><summary><span class="result-number">'+(i+1)+'</span><span class="result-question-text">'+(/\ba\.\s/.test(q.prompt)&&/\bb\.\s/.test(q.prompt)?esc(q.prompt).replace(/\s+([a-z]\.\s+)/g,'<br>$1'):esc(q.prompt))+'</span>'+badge(a,q)+'</summary><div class="result-expanded">'+btn('Vraag bekijken','review-question',true,'data-attempt="'+esc(a.id)+'" data-index="'+i+'"')+documentHtml(a.exam,'question',q.promptHtml,q.prompt)+comparison(a,q)+'</div></details>';}).join('')+'</section>';}).join('')+'</div>';
    }
    html+='<div class="result-bottom-actions">'+btn('Back-up downloaden','backup')+'<a class="btn" href="#welkom/'+esc(a.exam.id)+'">Opnieuw oefenen</a><span class="small">Ingeleverd '+datetime(a.submittedAt)+' · '+Engine.answeredCount(a)+' van '+a.exam.questions.length+' beantwoord</span></div></div>';
    host.innerHTML=html;
  }
  function practiceReview(id) {
    var item=window.CafaPractice&&window.CafaPractice.getCompleted().find(function(x){return x.id===id;});if(!item)return missing();
    var bank=window.CAFA2_DATA.modules[item.code];
    host.innerHTML='<a class="exam-back" href="#dashboard/voltooid">‹ Voltooide toetsen</a>'+head(item.title,'Eerdere MC-poging · alleen-lezen')+'<div class="exam-paper"><p>'+item.answered+' van '+item.total+' beantwoord.</p><p>'+item.good+' van '+item.auto+' nagekeken MC-antwoorden goed.</p><p>Zelfbeoordeling: '+item.selfGood+' van '+item.self+' goed. Zelfbeoordeling telt niet mee in de MC-score.</p>'+bank.questions.map(function(q){var a=item.answers[q.id]||{};return '<article class="exam-review-item"><h2>Vraag '+q.id+' · '+esc(q.title)+'</h2><p>'+esc(q.task)+'</p><div class="exam-review-answer">'+(a.choice!==null&&a.choice!==undefined?'<p>Gekozen antwoord: '+String.fromCharCode(65+a.choice)+'</p>':'')+(a.html?Editor.sanitize(a.html):a.text?'<p class="exam-prose">'+esc(a.text)+'</p>':'')+(a.rows&&a.rows.some(function(row){return row.some(Boolean);})?'<table><tbody>'+a.rows.map(function(row){return '<tr>'+row.map(function(cell){return '<td>'+esc(cell)+'</td>';}).join('')+'</tr>';}).join('')+'</tbody></table>':'')+(a.firstMC?'<p>Eerste MC-beoordeling: '+(a.firstMC.correct?'goed':'fout')+'</p>':'')+'</div></article>';}).join('')+'<a class="btn" href="#voortgang">Naar MC-voortgang</a></div>';
  }
  function missing() {host.innerHTML=head('Toets niet gevonden','De toets of poging is niet beschikbaar in deze browser.')+'<a class="btn" href="#dashboard">Naar dashboard</a>';}
  var clock=document.createElement('div');clock.className='exam-clock';clock.hidden=true;clock.innerHTML='<div class="exam-time-badge"><span>Totaal resterende tijd:</span> <strong role="timer" aria-label="Resterende toetstijd"></strong></div><span class="exam-save-indicator" aria-label="Antwoorden opgeslagen" title="Antwoorden opgeslagen op dit apparaat"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10" fill="#36823d"/><path d="m5 10 3 3 7-7" fill="none" stroke="white" stroke-width="3"/></svg></span>';document.querySelector('.top-controls').prepend(clock);
  function complete(attempt,reason) {
    if(!attempt||attempt.status!=='active')return;
    var finished=Engine.finishAttempt(attempt,{reason:reason});
    Object.assign(attempt,finished); save();
    var current=location.hash==='#tentamen/'+attempt.id;
    if(current){
      if(submitDialog.open)submitDialog.close();
      var info=document.getElementById('exam-info-dialog');if(info)info.close();
      announce(reason==='timeout'?'De toetstijd is verstreken. Je antwoorden zijn ingeleverd.':'Je tentamen is ingeleverd.');
      go('inzage/'+attempt.id);
    }else if(location.hash.indexOf('#dashboard')===0)dashboard(location.hash==='#dashboard/voltooid');
  }
  function tick() {
    running().filter(function(a){return Engine.remainingSeconds(a)===0;}).forEach(function(a){complete(a,'timeout');});
    var attempt=byId(selectedAttempt);
    clock.hidden=!(attempt&&attempt.status==='active');
    if(!clock.hidden){var seconds=Engine.remainingSeconds(attempt);clock.querySelector('strong').textContent=attempt.pausedAt!=null?'Gepauzeerd':Engine.formatTime(seconds).replace(/ min$/,' minuten');clock.querySelector('.exam-time-badge > span').textContent=attempt.untimed?'Oefenmodus:':'Totaal resterende tijd:';clock.classList.toggle('is-urgent',seconds<=600);if(seconds<=600&&!announcedTen.has(attempt.id)){announcedTen.add(attempt.id);announce('Nog tien minuten of minder. De klok toont nu minuten en seconden.');}}
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
    if(window.CafaStockTable)window.CafaStockTable.enhance(host);
    tick();window.scrollTo(0,0);
  }
  host.addEventListener('change',function(e){
    if(e.target.matches('[data-review-select]')){go('inzage/'+e.target.dataset.attempt+'/vraag/'+e.target.value);return;}
    if(e.target.matches('[data-exam-filter]'))go('dashboard'+(e.target.value==='completed'?'/voltooid':''));
    if(e.target.matches('[data-completed-type]')){completedType=e.target.value;dashboard(true);host.querySelector('[data-completed-type]').focus();}
    if(e.target.matches('[data-completed-attempts]')){completedAttempts=e.target.value;dashboard(true);host.querySelector('[data-completed-attempts]').focus();}
    if(e.target.matches('[data-exam-untimed]')){var extra=host.querySelector('[data-exam-extra]');extra.disabled=e.target.checked;host.querySelector('[data-exam-detail-duration]').textContent=e.target.checked?'Zonder tijdslimiet':(examById(decodeURIComponent(location.hash.slice(8))).durationMinutes+(extra.checked?30:0))+' minuten';}
    if(e.target.matches('[data-exam-extra]')){var exam=examById(decodeURIComponent(location.hash.slice(8)));if(exam){var total=exam.durationMinutes+(e.target.checked?30:0);host.querySelector('[data-exam-total]').textContent=total;host.querySelector('[data-exam-detail-duration]').textContent=total+' minuten';}}
    if(e.target.name==='exam-answer'){var a=byId(selectedAttempt);if(a&&a.status==='active'&&a.pausedAt==null&&Engine.remainingSeconds(a)>0){a.answers[a.exam.questions[a.currentIndex].id]={optionId:e.target.value};save();}else tick();}
  });
  host.addEventListener('click',function(e){
    var button=e.target.closest('[data-exam-action]');if(!button)return;var action=button.dataset.examAction;
    if(action==='backup'){downloadBackup();return;}
    if(action==='start'){
      var exam=examById(button.dataset.examId);if(!exam||corrupt)return;
      try{var a=Engine.createAttempt(exam,{extraTime:!!host.querySelector('[data-exam-extra]:checked'),untimed:!!host.querySelector('[data-exam-untimed]:checked'),id:exam.id+'-'+Date.now()+'-'+Math.random().toString(36).slice(2,7)});attempts().push(a);save();go('tentamen/'+a.id);}catch(error){announce(error.message);showModal('Starten niet mogelijk','<p>'+esc(error.message)+'</p>');}return;
    }
    if(action==='review-tab'){reviewTab=button.dataset.tab;review(button.dataset.attempt);return;}
    if(action==='review-question'){go('inzage/'+button.dataset.attempt+'/vraag/'+button.dataset.index);return;}
    if(action==='print-report'){window.print();return;}
    var attempt=byId(selectedAttempt);if(!attempt||attempt.status!=='active')return;if(Engine.remainingSeconds(attempt)===0){tick();return;}
    if(action==='resume'){Engine.resumeAttempt(attempt);save();route();return;}
    if(attempt.pausedAt!=null)return;
    var q=attempt.exam.questions[attempt.currentIndex];
    if(action==='pause'){Engine.pauseAttempt(attempt);save();route();return;}
    if(action==='check'){checkAnswer(attempt,q);return;}
    if(action==='previous'||action==='next'){attempt.currentIndex=Math.max(0,Math.min(attempt.exam.questions.length-1,attempt.currentIndex+(action==='next'?1:-1)));save();route();}
    if(action==='overview')overview(attempt);
    if(action==='section'){var section=sectionFor(attempt,q);if(section)showModal(section.title,documentHtml(attempt.exam,'exam',section.contentHtml));}
    if(action==='introduction')showModal('Introductie · '+label(attempt.exam),introduction(attempt.exam));
    if(action==='mark'){attempt.marked[q.id]=!attempt.marked[q.id];button.textContent=attempt.marked[q.id]?'Gemarkeerd':'Markeren';button.setAttribute('aria-pressed',String(!!attempt.marked[q.id]));save();}
    if(action==='submit'){document.querySelector('[data-exam-submit-summary]').textContent=Engine.answeredCount(attempt)+' van '+attempt.exam.questions.length+' vragen beantwoord. '+Object.values(attempt.marked).filter(Boolean).length+' vragen gemarkeerd.';if(submitDialog.showModal)submitDialog.showModal();else if(confirm('Je tentamen definitief inleveren?'))complete(attempt,'submitted');}
  });
  function resizeReview(handle,value){reviewWidth=Math.max(25,Math.min(65,value));handle.closest('.review-split').style.setProperty('--review-width',reviewWidth+'%');handle.setAttribute('aria-valuenow',Math.round(reviewWidth));}
  document.addEventListener('pointerdown',function(e){var handle=e.target.closest('.review-resizer');if(!handle)return;e.preventDefault();handle.setPointerCapture(e.pointerId);handle.dataset.dragging='true';});
  document.addEventListener('pointermove',function(e){var handle=e.target.closest('.review-resizer');if(!handle||handle.dataset.dragging!=='true')return;var rect=handle.closest('.review-split').getBoundingClientRect();resizeReview(handle,100*(rect.right-e.clientX)/rect.width);});
  document.addEventListener('pointerup',function(e){var handle=e.target.closest('.review-resizer');if(handle){delete handle.dataset.dragging;if(handle.hasPointerCapture(e.pointerId))handle.releasePointerCapture(e.pointerId);}});
  document.addEventListener('pointercancel',function(e){var handle=e.target.closest('.review-resizer');if(handle)delete handle.dataset.dragging;});
  document.addEventListener('keydown',function(e){var handle=e.target.closest('.review-resizer');if(!handle)return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();resizeReview(handle,reviewWidth+(e.key==='ArrowLeft'?5:-5));}});
  document.addEventListener('click',function(e){var tab=e.target.closest('[data-review-panel]');if(!tab)return;var side=tab.closest('.review-sidebar');side.querySelectorAll('[data-review-panel]').forEach(function(b){b.setAttribute('aria-selected',String(b===tab));});side.querySelectorAll('[data-side-panel]').forEach(function(p){p.hidden=p.dataset.sidePanel!==tab.dataset.reviewPanel;});});
  document.addEventListener('change',function(e){
    if(!e.target.matches('[data-self-score]'))return;
    var a=byId(e.target.dataset.attempt),q=a&&a.exam.questions.find(function(q){return q.id===e.target.dataset.question;});if(!q)return;
    var raw=e.target.value.trim(),score=raw===''?null:Number(raw.replace(',','.'));
    if(score!==null&&(!Number.isFinite(score)||score<0||score>(q.points||0))){e.target.setCustomValidity('Vul een score tussen 0 en '+(q.points||0)+' in.');e.target.reportValidity();return;}
    e.target.setCustomValidity('');a.scores=a.scores||{};if(score===null)delete a.scores[q.id];else a.scores[q.id]=score;save();
    var status=e.target.parentElement.querySelector('[data-score-saved]');if(status)status.textContent='Opgeslagen';
    if(a.status==='completed'){var openIds=Array.from(host.querySelectorAll('details[open][data-result-id]')).map(function(d){return d.dataset.resultId;});review(location.hash.slice(8));host.querySelectorAll('[data-review-panel="score"]').forEach(function(tab){tab.click();});openIds.forEach(function(id){var row=Array.from(host.querySelectorAll('[data-result-id]')).find(function(d){return d.dataset.resultId===id;});if(row)row.open=true;});}
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
