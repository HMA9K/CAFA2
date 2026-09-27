(function () {
  'use strict';
  var original = window.CafaAnswerEditor;
  if (!original) return;
  var script = document.currentScript;
  var base = new URL('../vendor/tinymce/', script && script.src || new URL('js/tinymce-answer-editor.js', document.baseURI));
  var loading;
  function load() {
    if (window.tinymce) return Promise.resolve(window.tinymce);
    if (!loading) loading = new Promise(function (resolve, reject) {
      var element = document.createElement('script');
      element.src = new URL('tinymce.min.js', base).href;
      element.onload = function () { resolve(window.tinymce); };
      element.onerror = function () { loading = null; reject(new Error('Editor niet geladen')); };
      document.head.appendChild(element);
    });
    return loading;
  }
  var contentStyle = 'body{font:14px/1.55 Arial,sans-serif;margin:12px;color:#252b34;background:#fff;overflow-wrap:anywhere}p{margin:0 0 .6em}table{border-collapse:collapse;table-layout:fixed;max-width:100%}body table td,body table th{border:1px solid #afb7c0;min-width:30px;padding:6px;vertical-align:top;overflow-wrap:anywhere}th{background:#f4f6f8}body[data-editor-theme=dark]{background:#152129;color:#e0ebf2}body[data-editor-theme=dark] td,body[data-editor-theme=dark] th{border-color:#667681}body[data-editor-theme=dark] th{background:#263540}';
  function mount(container, options) {
    options = options || {};
    var fallback = original.mount(container, options);
    if (options.readOnly) return fallback;
    var target = container.querySelector('.cae-content'), wrapper = target.closest('.cafa-answer-editor');
    var editor = null, disposed = false, initialized = false, last = fallback.getHTML(), observer;
    function sync() {
      if (!initialized || disposed || !editor) return;
      var value = original.sanitize(editor.getContent());
      if (value === last) return;
      last = value; fallback.setHTML(value);
      if (typeof options.onChange === 'function') options.onChange(value);
    }
    function theme() {
      var dark = document.documentElement.getAttribute('data-study-theme') === 'dark';
      wrapper.dataset.editorTheme = dark ? 'dark' : 'light';
      if (editor && initialized) editor.getBody().dataset.editorTheme = dark ? 'dark' : 'light';
    }
    function availableWidth() { return Math.max(220, Math.floor(container.getBoundingClientRect().width || 600)); }
    function savedSize() {
      try { return JSON.parse(sessionStorage.getItem('learning-answer-editor-size-v1') || 'null'); } catch (_) { return null; }
    }
    var size = savedSize();
    load().then(function (tiny) {
      if (disposed || !target.isConnected) return;
      var width = availableWidth();
      return tiny.init({
        target: target, base_url: base.href.replace(/\/$/, ''), suffix: '.min', license_key: 'gpl',
        menubar: false, promotion: false, resize: 'both', height: size ? Math.max(220, Math.min(900, size.height)) : 360,
        width: size ? Math.min(width, Math.max(220, size.width)) : '100%', min_height: 220, min_width: Math.min(260, width), max_width: width,
        language: 'nl', language_url: new URL('langs/nl.js', base).href,
        plugins: 'table lists charmap fullscreen',
        toolbar: 'undo redo | blocks | bold italic underline subscript superscript | bullist numlist | alignleft aligncenter alignright | table charmap | removeformat fullscreen',
        toolbar_mode: 'sliding', contextmenu: 'table',
        table_toolbar: 'tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol | tablemergecells tablesplitcells tabledelete',
        table_resize_bars: true, table_sizing_mode: 'relative', table_default_attributes: {border: '1'},
        table_default_styles: {'border-collapse': 'collapse', width: '100%'},
        block_formats: 'Normale tekst=p;Kop=h2;Tussenkop=h3;Vaste breedte=pre',
        skin: 'oxide', content_css: false, content_style: contentStyle,
        browser_spellcheck: true, paste_data_images: false, automatic_uploads: false,
        valid_elements: 'p[style],div[style],br,strong,b,em,i,u,s,strike,sub,sup,h2[style],h3[style],h4[style],ul,ol[type|start],li,blockquote,pre,code,table[style],colgroup,col[style],thead,tbody,tfoot,tr,td[style|colspan|rowspan],th[style|colspan|rowspan|scope],caption,span[style]',
        setup: function (instance) {
          editor = instance;
          instance.on('init', function () {
            if (disposed || !target.isConnected) { instance.remove(); return; }
            instance.setContent(fallback.getHTML());
            last = original.sanitize(instance.getContent()); initialized = true;
            wrapper.classList.add('has-tinymce'); theme();
            instance.getBody().setAttribute('aria-label', options.label || 'Vul je antwoord in');
            observer = new MutationObserver(theme); observer.observe(document.documentElement, {attributes: true, attributeFilter: ['data-study-theme']});
          });
          instance.on('input change Undo Redo blur', sync);
          instance.on('ResizeEditor', function () {
            var rect = instance.getContainer().getBoundingClientRect();
            try { sessionStorage.setItem('learning-answer-editor-size-v1', JSON.stringify({width: rect.width, height: rect.height})); } catch (_) {}
          });
        }
      });
    }).catch(function () {
      if (!disposed) wrapper.querySelector('.cae-status').textContent = 'De eenvoudige editor blijft beschikbaar.';
    });
    return {
      getHTML: function () { return initialized && editor ? original.sanitize(editor.getContent()) : fallback.getHTML(); },
      setHTML: function (value) { last = original.sanitize(value); fallback.setHTML(last); if (initialized && editor) editor.setContent(last); },
      focus: function () { if (initialized && editor) editor.focus(); else fallback.focus(); },
      destroy: function () { if (disposed) return; sync(); disposed = true; if (observer) observer.disconnect(); if (editor) editor.remove(); fallback.destroy(); }
    };
  }
  window.CafaAnswerEditor = {mount: mount, sanitize: original.sanitize};
})();
