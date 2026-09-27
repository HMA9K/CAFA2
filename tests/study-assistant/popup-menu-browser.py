"""Regression for introductory consent and cloned practice/exam tools menus. Mock service only."""
import functools, http.server, os, threading
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[2]/'dist'
OUT=Path(os.environ.get('ASSISTANT_QA_OUT', str(ROOT.parent.parent/'CAFA2-assistant-popup-QA')))
OUT.mkdir(parents=True,exist_ok=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}'
checks=0
def check(label,value):
    global checks
    assert value,label
    checks+=1;print('PASS',label,flush=True)
try:
  with sync_playwright() as p:
    browser=getattr(p,os.environ.get('ASSISTANT_BROWSER','chromium')).launch(headless=True)
    for width in (1366,390):
      context=browser.new_context(viewport={'width':width,'height':900})
      page=context.new_page();page.set_default_timeout(15000)
      calls=[];errors=[];access={'authenticated':False};page.on('pageerror',lambda error:errors.append(str(error)))
      def route(r):
        if not r.request.url.startswith(base):r.abort();return
        if '/api/study-' not in r.request.url:r.continue_();return
        calls.append(r.request.url.split('/')[-1])
        if calls[-1]=='study-status':r.fulfill(json={'ready':True,'authenticated':access['authenticated'],'course':'CAFA2','knowledge':{}})
        else:
          if calls[-1]=='study-auth':access['authenticated']=True
          if calls[-1]=='study-logout':access['authenticated']=False
          r.fulfill(json={'ok':True})
      page.route('**/*',route)
      page.goto(base+'/index.html#kap-1')
      page.wait_for_function('window.StudyAssistant && window.CafaExams && !document.querySelector(".study-assistant-launch").hidden')
      page.locator('.study-assistant-launch').click()
      intro=page.locator('#study-assistant-intro');intro.wait_for(state='visible')
      check(f'{width}: consent belongs to the existing code popup',intro.locator('[data-consent]').is_visible() and page.locator('#study-assistant [data-consent]').count()==0)
      check(f'{width}: only session status is checked before consent',calls==['study-status'] and intro.locator('button[type=submit]').is_disabled())
      page.evaluate('document.querySelector(".study-intro-form").requestSubmit()')
      check(f'{width}: submitting without consent is blocked',calls==['study-status'] and intro.is_visible())
      check(f'{width}: unauthenticated user can enter the code',intro.locator('#study-intro-code').is_visible())
      intro.locator('#study-intro-code').fill('test-only-access-code')
      intro.locator('[data-consent-check]').check()
      page.screenshot(path=str(OUT/f'consent-popup-{width}.png'))
      intro.locator('button[type=submit]').click()
      page.wait_for_function('document.querySelector("#study-assistant").open && !document.querySelector("[data-action=logout]").hidden')
      check(f'{width}: consent text never appears in the chat',page.locator('#study-assistant [data-consent-check]').count()==0 and 'study-chat' not in calls)
      check(f'{width}: access code submitted exactly once',calls.count('study-auth')==1)
      page.reload()
      page.wait_for_function('window.StudyAssistant && !document.querySelector(".study-assistant-launch").hidden')
      page.locator('.study-assistant-launch').click();intro.wait_for(state='visible')
      check(f'{width}: existing session hides code after reload',not intro.locator('#study-intro-code').is_visible() and intro.locator('[data-access-ready]').is_visible())
      intro.locator('[data-consent-check]').check();intro.locator('button[type=submit]').click()
      page.wait_for_function('document.querySelector("#study-assistant").open && !document.querySelector("[data-action=logout]").hidden')
      page.get_by_role('button',name='Privacy',exact=True).click()
      intro.locator('[data-consent-check]').uncheck()
      check(f'{width}: withdrawing consent disables sending',page.locator('[data-send]').is_disabled() and intro.locator('button[type=submit]').is_disabled())
      page.get_by_role('button',name='Introductie sluiten',exact=True).click()
      page.locator('#study-assistant [data-action=close]').click()
      def open_menu(selector):
        menu=page.locator(selector);menu.locator('summary').click()
        menu.locator('nav').wait_for(state='visible')
        check(f'{width}: {selector} entries are separate readable rows',menu.locator('nav').evaluate('e=>{const rows=[...e.children].filter(x=>!x.hidden).map(x=>x.getBoundingClientRect());return rows.every((r,i)=>r.width>100&&r.height>=30&&(!i||r.top>=rows[i-1].bottom-1));}'))
        check(f'{width}: {selector} fits the viewport',menu.locator('nav').evaluate('e=>{const r=e.getBoundingClientRect();return r.left>=-1&&r.right<=innerWidth+1;}'))
        return menu
      page.wait_for_function('document.querySelector("#learning-tools-menu [data-assistant-menu]")')
      menu=open_menu('#learning-tools-menu')
      check(f'{width}: practice assistant row is the last menu entry',menu.locator('[data-assistant-menu]').is_visible() and menu.locator('[data-assistant-menu]').evaluate('e=>e===e.parentElement.lastElementChild'))
      page.screenshot(path=str(OUT/f'practice-menu-{width}.png'))
      menu.locator('summary').click();page.locator('.study-assistant-launch').click();intro.wait_for(state='visible')
      check(f'{width}: practice launcher opens the code popup with revoked consent',intro.locator('[data-consent]').is_visible() and not intro.locator('[data-consent-check]').is_checked())
      intro.locator('[data-consent-check]').check();intro.locator('button[type=submit]').click()
      page.wait_for_function('document.querySelector("#study-assistant").open')
      page.locator('#study-assistant [data-action=close]').click()
      page.locator('.study-assistant-launch').click();intro.wait_for(state='visible')
      check(f'{width}: accepted consent is hidden on reopening',not intro.locator('[data-consent]').is_visible() and intro.locator('button[type=submit]').is_enabled())
      page.get_by_role('button',name='Introductie sluiten',exact=True).click()
      exam=page.evaluate('CafaExams.catalog[0].id')
      page.evaluate('(id)=>location.hash="#welkom/"+id',exam)
      page.locator('[data-exam-untimed]').check();page.locator('[data-exam-action=start]').click()
      page.wait_for_function('location.hash.startsWith("#tentamen/") && document.querySelector("#cirrus-tools-menu [data-assistant-menu]")')
      saved=page.evaluate('localStorage.getItem(CafaExams.storageKey)')
      menu=open_menu('#cirrus-tools-menu');page.screenshot(path=str(OUT/f'exam-menu-{width}.png'))
      check(f'{width}: exam assistant row is the last menu entry',menu.locator('[data-assistant-menu]').is_visible() and menu.locator('[data-assistant-menu]').evaluate('e=>e===e.parentElement.lastElementChild'))
      menu.locator('[data-assistant-menu]').click();intro.wait_for(state='visible');intro.locator('button[type=submit]').click()
      page.wait_for_function('document.querySelector("#study-assistant").open && document.querySelector("[data-context-title]").textContent.includes("Vraag")')
      check(f'{width}: exam assistant preserves saved answers and score',page.evaluate('localStorage.getItem(CafaExams.storageKey)')==saved)
      check(f'{width}: direct assistant button exists while answering',page.locator('.exam-answer-actions .study-inline-launch').count()==1)
      check(f'{width}: reopening and reload never resubmit the code',calls.count('study-auth')==1)
      page.locator('[data-action=logout]').click();intro.wait_for(state='visible')
      check(f'{width}: logout restores the code field',intro.locator('#study-intro-code').is_visible())
      check(f'{width}: no browser errors or real model calls',not errors and 'study-chat' not in calls)
      context.close()
    browser.close()
  print(f'{checks} checks passed; realApiCalls: 0',flush=True)
finally:server.shutdown()
