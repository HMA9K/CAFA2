/* Applied before first paint. A new browser session starts in Automatic mode. */
(function () {
  'use strict';
  var key = 'cafa2-display-session-v1', mode = 'auto';
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  try { var stored = sessionStorage.getItem(key); if (['auto','light','dark'].includes(stored)) mode = stored; } catch (_) {}
  function apply() {
    var effective = mode === 'auto' ? (media.matches ? 'dark' : 'light') : mode;
    document.documentElement.dataset.studyTheme = effective;
    document.documentElement.dataset.studyMode = mode;
    document.documentElement.style.colorScheme = effective;
    document.querySelectorAll('[data-theme-choice]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.themeChoice === mode));
    });
    document.querySelectorAll('[data-theme-label]').forEach(function (n) {
      n.textContent = mode === 'auto' ? 'Automatisch' : mode === 'light' ? 'Aan' : 'Uit';
    });
    window.dispatchEvent(new CustomEvent('cafa:theme', {detail:{mode:mode, effective:effective}}));
  }
  window.CafaTheme = {
    getMode:function () { return mode; },
    setMode:function (value) {
      if (!['auto','light','dark'].includes(value)) return;
      mode = value; try { sessionStorage.setItem(key, mode); } catch (_) {}
      apply();
    },
    refresh:apply
  };
  if (media.addEventListener) media.addEventListener('change', apply); else media.addListener(apply);
  apply();
}());
