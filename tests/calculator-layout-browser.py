"""Calculator history, text placement and growing window regression; no model requests."""
import functools,http.server,os,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]/'dist'
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
base=os.environ.get('CALCULATOR_URL',f'http://127.0.0.1:{server.server_port}/index.html#kap-1')
HELP='Duizendtallen met punten mogelijk; decimalen met komma of punt mogelijk; spaties worden genegeerd. Kopiëren en plakken mogelijk.'
checks=0

def check(label,value):
 global checks
 assert value,label
 checks+=1;print('PASS',label,flush=True)
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True)
  for width in (1366,390):
   context=browser.new_context(viewport={'width':width,'height':1200 if width==1366 else 844})
   page=context.new_page();page.set_default_timeout(15000)
   page.route('**/api/study-*',lambda r:r.abort())
   page.goto(base);page.wait_for_function('()=>window.CafaCalculator && window.StudyAssistant')
   page.locator('[data-calc]').first.click();panel=page.locator('#calculator-dialog')
   page.wait_for_function('()=>!document.querySelector("#calculator-dialog").hidden')
   check(f'{width}: no assistant button in calculator',panel.locator('.study-calculator-launch').count()==0)
   check(f'{width}: exact help directly below input, only once',panel.locator('#calc-input-help').inner_text()==HELP and panel.locator('[data-calc-input]').evaluate('e=>e.nextElementSibling.id==="calc-input-help"') and panel.locator('.calc-help').count()==1)
   page.evaluate('()=>{for(let i=1;i<=30;i++){document.querySelector("[data-calc-input]").value=i+"*2";CafaCalculator.perform("=");}}')
   box=panel.locator('.calc-history');small=box.evaluate('e=>e.clientHeight')
   if width==1366:
    panel.locator('[data-calc-resize]').focus()
    for _ in range(30):panel.locator('[data-calc-resize]').press('ArrowDown')
    check('taller calculator shows more rows',box.evaluate('e=>e.clientHeight')>small+200)
    check('history fills added height instead of empty controls',panel.locator('.calc-controls').evaluate('e=>e.getBoundingClientRect().bottom-e.lastElementChild.getBoundingClientRect().bottom')<=12)
   out=Path(os.environ.get('QA_OUTPUT',str(ROOT.parent.parent/'calculator-layout-QA')));out.mkdir(parents=True,exist_ok=True)
   page.screenshot(path=str(out/f'calculator-expanded-{width}.png'))
   panel.locator('[data-calc-compact]').click()
   check(f'{width}: compact calculator remains within viewport',panel.evaluate('e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1;}'))
   check(f'{width}: all 24 basic keys fit in compact controls',panel.locator('.calc-controls').evaluate('e=>{const r=e.getBoundingClientRect();return [...e.querySelectorAll(".calc-keys button")].every(b=>b.getBoundingClientRect().bottom<=r.bottom+1);}'))
   page.evaluate('()=>{document.querySelector("[data-calc-input]").value="123";CafaCalculator.perform("M+");}')
   panel.locator('[data-calc-clear-history]').click()
   state=page.evaluate('()=>CafaCalculator.getState()')
   check(f'{width}: clear all keeps input and memory',len(state['history'])==0 and state['formula']=='123' and state['memory']==123)
   check(f'{width}: empty state and disabled clear button',panel.locator('.calc-history-empty').is_visible() and panel.locator('[data-calc-clear-history]').is_disabled())
   page.reload();page.wait_for_function('()=>window.CafaCalculator');page.locator('[data-calc]').first.click()
   check(f'{width}: history remains cleared after reload',page.evaluate('()=>CafaCalculator.getState().history.length')==0)
   panel.locator('[data-calc-input]').fill('1 250,5 * 2');panel.locator('[data-calc-input]').press('Enter')
   check(f'{width}: spaces and decimal comma accepted',page.evaluate('()=>CafaCalculator.getState().history.at(-1).value')==2501)
   context.close()
  browser.close()
 print(f'{checks} checks passed; no model requests',flush=True)
finally:server.shutdown()
