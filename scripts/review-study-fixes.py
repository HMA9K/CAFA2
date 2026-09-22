"""Idempotent regression fixes applied during the one-time study source migration."""
from pathlib import Path
root = Path(__file__).resolve().parents[1]
p = root / 'js/study-shell.js'
s = p.read_text()
s = s.replace("if (p.question && p.question.kind === 'practice' && !window.CafaPractice) return false;", "if (p.question && p.question.kind === 'practice' && (!window.CafaPractice || !window.CafaFeedback || document.documentElement.classList.contains('cafa-starting'))) return false;")
s = s.replace("if (p.question && p.question.kind === 'exam' && !window.CafaExams) return false;", "if (p.question && p.question.kind === 'exam' && (!window.CafaExams || !window.CafaFeedback || document.documentElement.classList.contains('cafa-starting'))) return false;")
s = s.replace("document.querySelector('.question:target, [data-view]:not([hidden])')", "(document.querySelector('.question:target') || document.querySelector('.summary-page[data-view]:not([hidden]),.reader-chapter[data-view]:not([hidden])'))")
s = s.replace('if(p.detailState){var r=', "if(p.detailState&&!(p.question&&p.question.kind==='practice')){var r=")
if 'function settleReadingPosition' not in s:
    helper = '''  function settleReadingPosition(position) {
    var target = here(), interrupted = false, events = ['pointerdown', 'touchstart', 'wheel', 'keydown'];
    function stop() { interrupted = true; events.forEach(function(type) { window.removeEventListener(type, stop, true); }); }
    function apply() {
      if (interrupted || here() !== target) return stop();
      window.scrollTo(0, position.y || 0);
      (position.panes || []).forEach(function(v) { var el = document.querySelector(v.selector); if (el) el.scrollTop = v.y; });
      previous = snapshot();
    }
    events.forEach(function(type) { window.addEventListener(type, stop, {capture: true, passive: true}); });
    apply();
    // WebKit may perform its native fragment jump after the first rendering frames.
    // These bounded retries are cancelled as soon as the reader interacts or navigates.
    [60, 160, 320].forEach(function(delay) { setTimeout(apply, delay); });
    setTimeout(stop, 400);
  }
'''
    s = s.replace('  function applyPending() {', helper + '  function applyPending() {')
    s = s.replace('        window.scrollTo(0, p.y || 0);', '        settleReadingPosition(p);')
p.write_text(s)
p = root / 'js/answer-feedback.js'
s = p.read_text()
if "'cafa-detail-'" not in s:
    s = s.replace('function preparePractice(question) {\n    var mcRecord', "function preparePractice(question) {\n    each('details', question, function(d, index) { if (!d.id) d.id = 'cafa-detail-' + question.id + '-' + index; });\n    var mcRecord")
p.write_text(s)
p = root / 'js/bootstrap.js'
s = p.read_text().replace("if (/^#(?:kap|val|nvw|hk)-[0-9]+$/.test(initialHash) && document.getElementById(initialHash.slice(1)) && !document.querySelector('.question:target')) {", "var initialTarget = document.getElementById(initialHash.slice(1));\n    if (initialTarget && initialTarget.classList.contains('screen') && !initialTarget.matches(':target')) {")
p.write_text(s)
p = root / 'tests/study-upgrade-browser.py'
s = p.read_text().replace("page.locator('#option-kap-12-0').click()", "page.locator('label[for=\"a-kap-12-0\"]').click()")
s = s.replace("'#kap-12 a[href^=\"samenvatting.html#\"]'", "'#kap-12 a[href^=\"samenvatting.html#\"]:not([data-law]):visible'")
s = s.replace("except Exception:\n          await shot('FAILURE');", "except Exception as exc:\n          import traceback\n          report['failure']={'browser':kind,'url':page.url,'exception':str(exc),'traceback':traceback.format_exc(),'passed':checks,'navigation':await page.evaluate('sessionStorage.getItem(\"cafa2-navigation-v1\")'),'scroll':await page.evaluate('({y:scrollY,h:document.documentElement.scrollHeight,body:document.body.scrollHeight,viewport:innerHeight})')}\n          await shot('FAILURE');")
p.write_text(s)
