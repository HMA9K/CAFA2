(function (root) {
  'use strict';
  var fragmentPaths = [
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
    return loadScript('js/app.js');
  }).then(function () {
    return loadScript('js/calculator.js');
  }).catch(function (error) {
    var status = document.getElementById('load-status');
    if (status) status.textContent = 'De interactieve versie kon niet laden. Open een onderwerp via een van de knoppen hieronder.';
    if (root.console) console.error(error);
  });
})(window);
