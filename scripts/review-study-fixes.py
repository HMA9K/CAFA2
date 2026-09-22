"""Idempotent regression fixes applied during the one-time study source migration."""
from pathlib import Path
root = Path(__file__).resolve().parents[1]
p = root / 'js/study-shell.js'
s = p.read_text()
s = s.replace("if (p.question && p.question.kind === 'practice' && !window.CafaPractice) return false;", "if (p.question && p.question.kind === 'practice' && (!window.CafaPractice || !window.CafaFeedback || document.documentElement.classList.contains('cafa-starting'))) return false;")
s = s.replace("if (p.question && p.question.kind === 'exam' && !window.CafaExams) return false;", "if (p.question && p.question.kind === 'exam' && (!window.CafaExams || !window.CafaFeedback || document.documentElement.classList.contains('cafa-starting'))) return false;")
s = s.replace("document.querySelector('.question:target, [data-view]:not([hidden])')", "(document.querySelector('.question:target') || document.querySelector('.summary-page[data-view]:not([hidden]),.reader-chapter[data-view]:not([hidden])'))")
# The feedback renderer moves panels next to the selected option. DOM-index restoration is
# not stable across that move; exercises restore named details instead.
s = s.replace('if(p.detailState){var r=', "if(p.detailState&&!(p.question&&p.question.kind==='practice')){var r=")
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
s = s.replace("except Exception:\n          await shot('FAILURE');", "except Exception as exc:\n          import traceback\n          report['failure']={'browser':kind,'url':page.url,'exception':str(exc),'traceback':traceback.format_exc(),'passed':checks,'navigation':await page.evaluate('sessionStorage.getItem(\"cafa2-navigation-v1\")')}\n          await shot('FAILURE');")
p.write_text(s)
