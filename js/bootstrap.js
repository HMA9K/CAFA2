(function (root) {
  'use strict';
  var fragmentPaths = [
    'fragments/exams.html',
    'fragments/home.html',
    'fragments/kapitaalbelangen.html',
    'fragments/vreemde-valuta.html',
    'fragments/consolidatie-nvw.html',
    'fragments/consolidatie-hk.html',
    'fragments/shared.html'
  ];
  function getText(url) {
    return fetch(url, { credentials: 'same-origin' }).then(function (response) {
      if (!response.ok) throw new Error(url + ' kon niet worden geladen (' + response.status + ').');
      return response.text();
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
    brand.href = '#dashboard';
    brand.classList.add('cafa-wordmark');
    brand.setAttribute('aria-label', 'CAFA2 dashboard');
    brand.innerHTML = '<svg viewBox="0 0 38 44" aria-hidden="true"><path fill="currentColor" d="M32 12 26 17C23 10 9 12 9 25c0 13 15 17 21 6l6 4C26 51 2 45 2 25 2 5 23 2 32 12Z"/><path fill="#ff720c" d="M3 5h12v12H3Z"/><path fill="none" stroke="#444159" stroke-width="2.7" d="m5 10 3 3 6-7"/></svg><span>afa2</span><small>OEFENOMGEVING</small>';
    return loadScript('js/app.js');
  }).then(function () {
    return loadScript('js/calculator.js');
  }).then(function () {
    return loadScript('js/practice-upgrades.js');
  }).then(function () {
    return loadScript('js/exams.js');
  }).catch(function (error) {
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
