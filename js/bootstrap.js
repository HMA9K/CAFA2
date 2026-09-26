(function (root) {
  'use strict';
  var fragmentPaths = [
    'fragments/exams.html',
    'fragments/home.html',
    'fragments/kapitaalbelangen.html',
    'fragments/vreemde-valuta.html',
    'fragments/consolidatie-nvw.html',
    'fragments/consolidatie-hk.html',
    'fragments/practice-additions-kap.html',
    'fragments/practice-additions-val.html',
    'fragments/practice-additions-nvw.html',
    'fragments/practice-additions-hk.html',
    'fragments/exam-practice-20210419.html',
'fragments/exam-practice-20211006.html',
'fragments/exam-practice-20220411.html',
'fragments/exam-practice-20221006.html',
'fragments/exam-practice-20230411.html',
'fragments/exam-practice-20231009.html',
'fragments/exam-practice-20240422.html',
'fragments/exam-practice-20240930.html',
'fragments/exam-practice-20250417.html',
'fragments/exam-practice-20250924.html',
'fragments/exam-practice-20260429.html',
    'fragments/shared.html'
  ];
  function getText(url) {
    return fetch(url, { credentials: 'same-origin' }).then(function (response) {
      if (!response.ok) throw new Error(url + ' kon niet worden geladen (' + response.status + ').');
      return response.text();
    });
  }
  function loadStyle(href) {
    return new Promise(function (resolve, reject) {
      var link = document.createElement('link');
      link.rel = 'stylesheet'; link.href = href;
      link.onload = resolve;
      link.onerror = function () { reject(new Error(href + ' kon niet worden geladen.')); };
      document.head.appendChild(link);
    });
  }
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = function () { reject(new Error(src + ' kon niet worden geladen.')); };
      document.body.appendChild(script);
    });
  }
  Promise.all(fragmentPaths.concat('fragments/dialogs.html').map(getText)).then(function (parts) {
    var data = root.CAFA2_DATA;
    if (!data || !data.modules || Object.keys(data.modules).length !== 4) {
      throw new Error('Niet alle vier vraagmodules zijn geladen.');
    }
    document.getElementById('app-content').innerHTML = parts.slice(0, -1).join('');
    document.getElementById('dialog-content').innerHTML = parts[parts.length - 1];
    var brand = document.querySelector('.brand');
    brand.href = '#start';
    brand.classList.add('cafa-wordmark');
    brand.setAttribute('aria-label', 'CAFA2 hoofdpagina');
    brand.innerHTML = '<svg viewBox="0 0 38 44" aria-hidden="true"><path fill="currentColor" d="M32 12 26 17C23 10 9 12 9 25c0 13 15 17 21 6l6 4C26 51 2 45 2 25 2 5 23 2 32 12Z"/><path fill="#ff720c" d="M3 5h12v12H3Z"/><path fill="none" stroke="#444159" stroke-width="2.7" d="m5 10 3 3 6-7"/></svg><span>afa2</span><small>LEER- EN OEFENOMGEVING</small>';
    var profile=document.createElement('div');profile.className='cafa-profile';
    profile.innerHTML='<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="20" fill="#f4f4f5"/><circle cx="20" cy="15" r="7" fill="#444159"/><path d="M8 31c1-10 23-10 24 0a17 17 0 0 1-24 0Z" fill="#444159"/></svg><span>Anoniem</span>';
    document.querySelector('.top-controls').appendChild(profile);
    return loadScript('js/app.js');
  }).then(function () {
    return loadScript('js/calculator.js?v=20260922-3');
  }).then(function () {
    return loadScript('js/practice-upgrades.js?v=20260926-nav3');
  }).then(function () {
    if (root.CafaTopics) root.CafaTopics.mount();
    return loadScript('js/practice-case-panel.js?v=20260926-columns1');
  }).then(function () {
    return loadScript('js/exams.js?v=20260926-complete3');
  }).then(function () {
    return loadScript('js/theory-panels.js?v=20260924-sources1');
  }).then(function () {
    return loadStyle('css/answer-feedback.css?v=20260924-disclosures1');
  }).then(function () {
    return loadScript('js/answer-feedback.js?v=20260924-opgaven1');
  }).then(function () {
    if (!root.CafaExams) throw new Error('Het dashboard kon niet worden gestart.');
    if (root.CafaStartup) root.CafaStartup.finish();
    window.dispatchEvent(new CustomEvent('cafa:ready'));
    // Restore an existing question deep link after asynchronous fragments exist.
    // Replace the URL without adding a second navigation-history entry.
    var initialHash = location.hash;
    var initialTarget = document.getElementById(initialHash.slice(1));
    if (initialTarget && initialTarget.classList.contains('screen') && !initialTarget.matches(':target')) {
      history.replaceState(history.state, '', location.pathname + location.search);
      location.replace(initialHash);
    }

  }).catch(function (error) {
    if (root.CafaStartup) root.CafaStartup.fail();
    var status = document.getElementById('load-status');
    if (status) status.textContent = 'De interactieve versie kon niet laden. Open een onderwerp via een van de knoppen hieronder.';
    if (!status) {
      var message = document.createElement('p');
      message.className = 'notice';
      message.setAttribute('role', 'alert');
      message.textContent = 'Een onderdeel kon niet laden. Ververs de pagina. Je opgeslagen antwoorden blijven behouden.';
      document.getElementById('app-content').prepend(message);
    }
    if (root.console) console.error(error);
  });
})(window);
