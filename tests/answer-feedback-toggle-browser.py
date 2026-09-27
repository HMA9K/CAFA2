"""Check manual feedback toggles without changing answers or first scores."""
import functools, http.server, os, threading
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1] / 'dist'
OUT = Path(os.environ['FEEDBACK_QA_OUT']) if os.environ.get('FEEDBACK_QA_OUT') else None
if OUT:
    OUT.mkdir(parents=True, exist_ok=True)

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
base = os.environ.get('FEEDBACK_QA_URL', f'http://127.0.0.1:{server.server_port}').rstrip('/')

def toggle(page, button, feedback, snapshot):
    button.click()
    expect(feedback).to_be_visible()
    expect(button).to_have_attribute('aria-expanded', 'true')
    state = page.evaluate(snapshot)
    button.click()
    expect(feedback).to_be_hidden()
    expect(button).to_have_attribute('aria-expanded', 'false')
    assert page.evaluate(snapshot) == state, 'Closing changed saved answers or scores'
    button.click()
    expect(feedback).to_be_visible()
    expect(button).to_have_attribute('aria-expanded', 'true')
    assert page.evaluate(snapshot) == state, 'Reopening changed saved answers or scores'

def menu_over_pdf(page, selector, width):
    menu = page.locator(selector)
    menu.locator('summary').click()
    expect(menu.locator('nav')).to_be_visible()
    assert menu.locator('nav').evaluate('''nav=>[...nav.children].every(item=>{
        const r=item.getBoundingClientRect();
        if (!r.width || !r.height) return true;
        const hit=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);
        return item===hit || item.contains(hit);
    })'''), 'PDF covers an open menu item'
    assert page.locator('#exam-original-solutions[open]').count() == 1
    assistant = menu.locator('[data-assistant-menu]')
    expect(assistant).to_be_visible()
    assert assistant.evaluate('e=>e===e.parentElement.lastElementChild')
    menu.locator('a').first.hover()
    if OUT:
        page.screenshot(path=str(OUT / f'pdf-menu-{selector[1:]}-{width}.png'))
    menu.locator('summary').click()

try:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for width in (1366, 390):
            page = browser.new_page(viewport={'width': width, 'height': 900})
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            def route(r):
                if not r.request.url.startswith(base):
                    r.abort()
                elif '/pdf-reader/web/viewer.html?' in r.request.url:
                    r.fulfill(content_type='text/html', body='<body style="background:#ddd">PDF-weergave</body>')
                else:
                    r.continue_()
            page.route('**/*', route)
            page.goto(base + '/index.html#kap-1')
            page.wait_for_function('()=>window.CafaFeedback && document.querySelector("#kap-1[data-feedback-bound]")')
            question = page.locator('#kap-1')
            question.locator('.option[data-option="0"]').click()
            button = question.locator('.cafa-check-controls button').first
            feedback = question.locator('#cafa-feedback-kap-1-mc')
            toggle(page, button, feedback, '()=>JSON.stringify(CafaPractice.getAnswer("kap",1))')
            question.locator('[data-direct-check]').check()
            expect(feedback).to_be_visible()
            button.click()
            expect(feedback).to_be_hidden()
            question.locator('.option[data-option="1"]').click()
            expect(feedback).to_be_visible()
            question.locator('[data-direct-check]').uncheck()
            button.click()
            expect(feedback).to_be_hidden()
            question.locator('label[for="own-kap-1"]').click()
            own = question.locator('.own-area')
            toggle(page, own.locator('.cafa-check-controls button'),
                   own.locator('.cafa-inline-feedback'),
                   '()=>JSON.stringify(CafaPractice.getAnswer("kap",1))')
            question.locator('label[for="mc-kap-1"]').click()
            for theme in ('light', 'dark'):
                page.evaluate('(theme)=>document.documentElement.dataset.studyTheme=theme', theme)
                menu = page.locator('#learning-tools-menu')
                menu.locator('summary').click()
                assert menu.locator('a[href*="afdrukken=alles"]').count() == 0
                assistant = menu.locator('[data-assistant-menu]')
                expect(assistant).to_be_visible()
                assert assistant.evaluate('e=>e===e.parentElement.lastElementChild')
                assert assistant.evaluate('e=>{const s=getComputedStyle(e);return s.backgroundColor==="rgb(80, 67, 99)" && s.textAlign==="center" && Math.abs(e.offsetWidth-e.previousElementSibling.offsetWidth)<2;}')
                if OUT:
                    menu.locator('nav').screenshot(path=str(OUT / f'menu-{theme}-{width}.png'))
                menu.locator('summary').click()
            page.evaluate('''()=>{
                const exam=CafaExams.catalog[0];
                const attempt=CafaExamEngine.createAttempt(exam,{id:'toggle-check',untimed:true});
                const value=JSON.stringify({version:1,attempts:[attempt]});
                localStorage.setItem(CafaExams.storageKey,value);
                dispatchEvent(new StorageEvent('storage',{key:CafaExams.storageKey,newValue:value}));
                location.hash='tentamen/'+attempt.id;
            }''')
            button = page.locator('[data-exam-action="check"]')
            feedback = page.locator('#cafa-exam-feedback')
            button.wait_for(state='visible')
            page.wait_for_function('()=>document.querySelector("#cirrus-tools-menu [data-assistant-menu]")')
            for theme in ('light', 'dark'):
                page.evaluate('(theme)=>document.documentElement.dataset.studyTheme=theme', theme)
                menu = page.locator('#cirrus-tools-menu')
                menu.locator('summary').click()
                assistant = menu.locator('[data-assistant-menu]')
                expect(assistant).to_be_visible()
                assert assistant.evaluate('e=>e===e.parentElement.lastElementChild')
                assert assistant.evaluate('e=>{const s=getComputedStyle(e);return s.backgroundColor==="rgb(80, 67, 99)" && s.textAlign==="center" && Math.abs(e.offsetWidth-e.previousElementSibling.offsetWidth)<2;}')
                if OUT:
                    menu.locator('nav').screenshot(path=str(OUT / f'exam-menu-{theme}-{width}.png'))
                menu.locator('summary').click()
            toggle(page, button, feedback, '()=>JSON.stringify(CafaExams.getAttempts())')
            score = feedback.locator('[data-self-score]')
            if score.count():
                score.fill('1')
                score.dispatch_event('change')
                state = page.evaluate('localStorage.getItem(CafaExams.storageKey)')
                button.click()
                expect(feedback).to_be_hidden()
                button.click()
                expect(score).to_have_value('1')
                assert page.evaluate('localStorage.getItem(CafaExams.storageKey)') == state
            page.locator('#exam-app [data-original-pdf="solutions"]').first.click()
            expect(page.locator('#exam-original-solutions')).to_be_visible()
            menu_over_pdf(page, '#cirrus-tools-menu', width)
            practice_id = page.evaluate('''()=>Object.entries(CAFA2_DATA.modules).flatMap(([code,bank])=>
                bank.questions.flatMap((q,i)=>q.examId==='cafa2-20240422'?[code+'-'+(i+1)]:[]))[0]''')
            page.evaluate('(id)=>location.hash=id', practice_id)
            page.locator(f'#{practice_id} [data-original-pdf="solutions"]').first.wait_for(state='visible')
            if not page.locator('#exam-original-solutions').is_visible():
                page.locator(f'#{practice_id} [data-original-pdf="solutions"]').first.click()
            expect(page.locator('#exam-original-solutions')).to_be_visible()
            menu_over_pdf(page, '#learning-tools-menu', width)
            assert not errors, errors
            print(f'PASS {width}: feedback toggles, saved scores, menu themes, menus above PDF in exam and practice', flush=True)
            page.close()
        browser.close()
finally:
    server.shutdown()
