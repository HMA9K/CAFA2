"""Real CAFA2 interface with a mocked service. Run after prepare --apply and build."""
import functools, http.server, json, os, threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[2]/'dist'
OUT=Path(os.environ.get('ASSISTANT_QA_OUT','/tmp/cafa2-assistant-browser'));OUT.mkdir(parents=True,exist_ok=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}'
checks=[];requests=[];errors=[];state={'ready':True,'authenticated':False,'fail':False}
def check(label,value):
    assert value,label
    checks.append(label);print('PASS',label,flush=True)
try:
  with sync_playwright() as p:
    executable=os.environ.get('CHROMIUM_PATH')
    browser=p.chromium.launch(headless=True,**({'executable_path':executable} if executable else {}),args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1366,'height':950});page.set_default_timeout(12000)
    page.on('pageerror',lambda e:errors.append(str(e)))
    def route(r):
      if not r.request.url.startswith(base): r.abort();return
      if '/api/study-' not in r.request.url: r.continue_();return
      action=r.request.url.split('/')[-1]
      if action=='study-status':r.fulfill(json={'ready':state['ready'],'authenticated':state['authenticated'],'course':'CAFA2','knowledge':{'theoryFiles':False,'reviewFiles':False}});return
      if action=='study-auth':state['authenticated']=True;r.fulfill(json={'ok':True});return
      if action=='study-logout':state['authenticated']=False;r.fulfill(json={'ok':True});return
      data=r.request.post_data_json;requests.append(data)
      if state['fail']:r.fulfill(status=503,json={'error':'Gesimuleerde serverfout.'});return
      r.fulfill(json={'questionKey':':'.join(data['ref'][k] for k in ['course','kind','bankId','questionId']),'mode':data['mode'],'answer':'**Technische testreactie, geen modelantwoord.**\n\n| Kolom | Bedrag |\n| --- | --- |\n| Test | 100 |\n<img src=x onerror="alert(1)">','citations':[],'references':[],'incomplete':False})
    page.route('**/*',route)
    page.goto(base+'/index.html#kap-1')
    page.wait_for_function('window.CafaExams && window.StudyAssistant && !document.querySelector(".study-assistant-launch").hidden')
    page.locator('.study-assistant-launch').click();page.locator('[data-login]').wait_for(state='visible')
    check('No request before consent and login',page.locator('[data-send]').is_disabled() and not requests)
    page.locator('#study-code').fill('mock-test-code');page.locator('[data-login] button').click();page.locator('[data-login]').wait_for(state='hidden')
    page.locator('[data-consent-check]').check()
    def send(text):
      before=len(requests);page.locator('#study-message').fill(text);page.locator('[data-send]').click()
      page.wait_for_function('document.querySelector("[data-action=stop]").hidden')
      assert len(requests)==before+1
    storage=page.evaluate('JSON.stringify({...localStorage})')
    send('Hoe begin ik?')
    check('Current real practice question sent in hint style',requests[-1]['ref']['questionId']=='1' and requests[-1]['mode']=='hint')
    check('Safe table rendering without executable HTML',page.locator('.study-messages table').count()==1 and page.locator('.study-messages img').count()==0)
    send('Waarom is B goed?')
    check('Answer question in hint style is transmitted without forced switching',requests[-1]['mode']=='hint' and requests[-1]['history'][0]['content']=='Hoe begin ik?')
    before=len(requests);page.locator('[data-answer-prompt]').click();page.wait_for_function('document.querySelector("[data-action=stop]").hidden')
    check('One-click answer request works without checking or submitting exam',len(requests)==before+1 and requests[-1]['message'].startswith('Geef het antwoord'))
    page.locator('[data-mode]').select_option('review');send('Licht stap 2 toe.')
    check('Same-question conversation survives style changes',any(m['content']=='Hoe begin ik?' for m in requests[-1]['history']))
    check('Assistant leaves stored answers and scores unchanged',page.evaluate('JSON.stringify({...localStorage})')==storage)
    page.screenshot(path=str(OUT/'desktop.png'))
    page.evaluate("location.hash='kap-2'");page.wait_for_function('document.querySelector("[data-context-title]").textContent.includes("Vraag 2")')
    check('Question navigation isolates chat history',page.locator('.study-message').count()==0)
    send('Geef het antwoord.');check('New question uses its own context',requests[-1]['ref']['questionId']=='2' and requests[-1]['history']==[])
    state['fail']=True;send('Leg dit uit.')
    check('Failure preserves the question for retry',page.locator('#study-message').input_value()=='Leg dit uit.')
    state['fail']=False
    for width,height in [(390,844),(320,740),(740,390)]:
      page.set_viewport_size({'width':width,'height':height});page.wait_for_timeout(160)
      rect=page.locator('#study-assistant').bounding_box()
      check(f'Mobile pane fits {width}x{height}',rect['x']>=-1 and rect['x']+rect['width']<=width+1 and rect['y']+rect['height']<=height+1)
    page.set_viewport_size({'width':390,'height':844});page.evaluate("document.documentElement.setAttribute('data-study-theme','dark')")
    page.wait_for_timeout(100)
    check('Actual CAFA2 dark-theme attribute styles chat',page.locator('#study-assistant').evaluate("e=>getComputedStyle(e).getPropertyValue('--sa-bg').trim()")=='#201d2b')
    page.screenshot(path=str(OUT/'mobile-dark.png'))
    check('No JavaScript runtime exceptions',not errors)
    (OUT/'report.json').write_text(json.dumps({'passed':True,'checks':checks,'errors':errors,'realQuestions':True,'mockService':True,'realApiCalls':0},ensure_ascii=False,indent=2))
    browser.close()
finally:server.shutdown()
