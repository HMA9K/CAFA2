(function () {
  'use strict';
  var counter = document.querySelector('script[data-goatcounter]');
  if (!counter) return;
  var course = counter.dataset.goatcounter.indexOf('cafa2.') !== -1 ? 'CAFA2' : 'SRA';
  var productionHost = course === 'CAFA2' ? 'cafa2.pages.dev' : 'sra-2xt.pages.dev';
  // Preview deployments and downloaded copies must not pollute production statistics.
  function status(value) { document.documentElement.setAttribute('data-study-analytics-state', value); }
  if (location.hostname !== productionHost) { status('preview'); return; }
  status('waiting');
  var lastPath = null, pending = null;

  function pagePath() {
    var path = location.pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
    var hash = location.hash;
    if (hash === '#toggle-goatcounter') return null;
    // Attempt timestamps are local session details; group attempts by the exam.
    hash = hash.replace(/-\d{13}(?:-[a-z0-9]+)?(?=\/|$)/g, '');
    if (!hash && path === '/') hash = course === 'CAFA2' ? '#start' : '#home';
    if (!hash && path === '/samenvatting') hash = '#start';
    return path + hash;
  }

  function pageTitle() {
    var host = document.querySelector('#main');
    if (!host) {
      if (document.body.classList.contains('exam-surface')) host = document.querySelector('#exam-app');
      if (!host) {
        var target;
        try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch (e) {}
        host = target && (target.closest('[data-view], .screen') || target);
      }
      if (!host) host = document.querySelector('[data-view]:not([hidden]), #start');
    }
    var heading = host && host.querySelector('h1, h2');
    return heading ? course + ' · ' + heading.textContent.replace(/\s+/g, ' ').trim() : document.title;
  }

  function countPage() {
    pending = null;
    if (document.readyState === 'loading' || document.visibilityState === 'hidden') { status('waiting for visible page'); return; }
    // CAFA2 loads its screens asynchronously; wait for the rendered route.
    if (document.querySelector('#app-content #load-status')) { status('waiting for route'); return; }
    var gc = window.goatcounter, path = pagePath();
    if (!path || path === lastPath) return;
    if (!gc || typeof gc.count !== 'function') { status('waiting for GoatCounter'); return; }
    try {
      // Keep GoatCounter's own browser exclusion and local/bot filters intact.
      var reason = gc.filter && gc.filter();
      if (reason) { status('excluded: ' + reason); return; }
      gc.count({ path: path, title: pageTitle() });
      lastPath = path;
      status('sent: ' + path);
    } catch (e) {
      status('browser storage unavailable');
    }
  }

  function schedule() {
    if (pending !== null) clearTimeout(pending);
    pending = setTimeout(countPage, 0);
  }
  counter.addEventListener('load', schedule);
  counter.addEventListener('error', function () { status('GoatCounter could not load'); });
  document.addEventListener('DOMContentLoaded', schedule);
  document.addEventListener('visibilitychange', schedule);
  window.addEventListener('hashchange', schedule);
  window.addEventListener('popstate', schedule);
  window.addEventListener('cafa:ready', schedule);
  window.addEventListener('cafa:exam-route', schedule);
  schedule();
})();
