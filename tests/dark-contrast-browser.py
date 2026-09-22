"""Actual enabled/selected/disabled controls, after complete stylesheet loading.
CI serves the unmodified app over HTTP. CAFA_OFFLINE_LOADER is an optional local
component-fixture module for environments without browser network access.
"""
from pathlib import Path
import functools, http.server, threading, json, os, sys, hashlib
from playwright.sync_api import sync_playwright, expect
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('CAFA_CONTRAST_OUTPUT','/tmp/cafa2-contrast-review'));OUT.mkdir(parents=True,exist_ok=True)
SELECTORS='.btn,.views button,.mode-switch label,.flag-label,.cafa-direct-check,.cae-button,.cae-select,.cae-count,.cae-status,.exam-save-status,.topic-progress,.cafa-choice-icon,.cafa-choice-action,.cafa-home-eyebrow,.study-button,.reader-tabs a,.law-ref'
MEASURE=r'''els => {
 const rgba=s=>{const a=(s.match(/[\d.]+/g)||[]).map(Number);return a.length>=3?[a[0],a[1],a[2],a.length>3?a[3]:1]:[0,0,0,0]};
 const over=(a,b)=>a.slice(0,3).map((v,i)=>v*a[3]+b[i]*(1-a[3]));
 const lum=a=>a.slice(0,3).map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
 return els.filter(e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2&&getComputedStyle(e).visibility!=='hidden'&&e.textContent.trim()&&!e.closest('[hidden],.sr-only')&&(!e.checkVisibility||e.checkVisibility({visibilityProperty:true}));}).map(e=>{
  const s=getComputedStyle(e);let bg=[255,255,255],op=1,path=[];for(let n=e;n;n=n.parentElement)path.unshift(n);
  for(const n of path){const c=getComputedStyle(n);bg=over(rgba(c.backgroundColor),bg);op*=Number(c.opacity);}
  const fg=rgba(s.color);fg[3]*=op;const f=over(fg,bg),l1=lum(f),l2=lum(bg);
  return {text:e.textContent.trim().slice(0,80),tag:e.tagName,cls:typeof e.className==='string'?e.className:'',disabled:e.matches(':disabled,[aria-disabled=true]'),ratio:(Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05),color:s.color,bg:bg.map(Math.round),opacity:op,gradient:s.backgroundImage};
 });}'''
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass

def run():
 offline=os.environ.get('CAFA_OFFLINE_LOADER')
 server=None
 if offline:
  sys.path.insert(0,str(Path(offline).parent));from cafa2_offline_fixture import load
  base=''
 else:
  server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
  threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
 report={'transport':'offline component fixture' if offline else 'HTTP, unmodified app','browsers':{},'errors':[]}
 try:
  with sync_playwright() as pw:
   for name in os.environ.get('CAFA_BROWSERS','chromium,webkit').split(','):
    opts={'executable_path':os.environ['CAFA_CHROMIUM_PATH']} if name=='chromium' and os.environ.get('CAFA_CHROMIUM_PATH') else {}
    browser=getattr(pw,name).launch(headless=True,**opts)
    ctx=browser.new_context(viewport={'width':390,'height':844},color_scheme='dark')
    ctx.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base) and base else r.abort())
    page=ctx.new_page();page.set_default_timeout(12000);page.on('pageerror',lambda e:report['errors'].append(str(e)))
    checks=[];samples=[]
    def hash(h):
     page.evaluate('(h)=>{location.hash=h}',h);page.wait_for_timeout(150)
    def goto(path):
     if offline:
      load(page);hash(path.split('#',1)[1] if '#' in path else 'start')
     else:
      page.goto(base+path,wait_until='networkidle')
      if path.startswith('index'):
       page.wait_for_function('!!window.CafaPractice&&!!window.CafaExams&&!!window.CafaFeedback&&!document.documentElement.classList.contains("cafa-starting")')
    def audit(where,label):
     values=page.locator(where).evaluate_all(MEASURE)
     assert values,('No visible controls',where)
     bad=[v for v in values if v['ratio']<4.5 and v['gradient']=='none']
     samples.append({'label':label,'values':values})
     assert not bad,(label,bad)
    def shot(label):page.screenshot(path=str(OUT/(name+'-'+label+'.png')),full_page=False)
    try:
     goto('index.html#start')
     assert page.locator('html').get_attribute('data-study-theme')=='dark'
     audit('#start .cafa-choice-icon,#start .cafa-choice-action,#start .cafa-home-eyebrow','homepage')
     hash('val-1')
     for key in ['0','1','2','3']:
      expect(page.locator('#val-1 [data-view="'+key+'"]')).to_be_enabled()
     page.locator('label[for="a-val-1-0"]').click()
     expect(page.locator('#val-1 [data-clear]')).to_be_enabled()
     audit('#val-1 :is('+SELECTORS+')','practice: choice selected, filters unselected')
     page.locator('#val-1 [data-view="1"]').click()
     assert page.evaluate('CafaPractice.getAnswer("val",1).choice')==0
     audit('#val-1 .views button','filter selection is not answer selection')
     page.locator('#val-1 [data-view=all]').click()
     page.locator('#val-1 .mode-switch').scroll_into_view_if_needed();shot('practice-dark-390')
     page.locator('label[for="own-val-1"]').click()
     own=page.locator('#val-1 .cae-content');expect(own).to_be_visible()
     row=page.locator('#val-1 button[aria-label="Rij toevoegen"]');expect(row).to_be_disabled()
     audit('#val-1 :is('+SELECTORS+')','exercise editor: no table selected')
     own.fill('Contrastcontrole: 120 + 30 = 150')
     page.locator('#val-1 button[aria-label="Tabel invoegen"]').click()
     page.locator('#val-1 button[aria-label="Tabel invoegen met gekozen afmetingen"]').click()
     page.locator('#val-1 .cae-content td').first.click()
     expect(row).to_be_enabled()
     audit('#val-1 :is('+SELECTORS+')','exercise editor: table controls enabled')
     row.click();assert page.locator('#val-1 .cae-content tr').count()==4
     page.locator('label[for="mc-val-1"]').click()
     hash('oefenen')
     restart=page.locator('#oefenen [data-reset=val]');expect(restart).to_be_visible();expect(restart).to_be_enabled()
     audit('#oefenen :is('+SELECTORS+')','started topic: restart is ENABLED')
     shot('practice-overview-dark-390')
     checks.append('Active practice filters, clear answer, own-work tab, direct check and restart; table tools transition disabled to enabled')
     hash('welkom/cafa2-20240422');page.locator('[data-exam-action=start]').click()
     for action in ['check','pause','next']:expect(page.locator('[data-exam-action='+action+']')).to_be_enabled()
     expect(page.locator('[data-exam-action=previous]')).to_be_disabled()
     audit('#exam-app :is('+SELECTORS+')','exam question 1: enabled actions, previous disabled')
     editor=page.locator('#exam-app .cae-content');editor.fill('Mijn antwoord blijft staan: 150')
     page.locator('[data-exam-action=next]').click();expect(page.locator('[data-exam-action=previous]')).to_be_enabled()
     page.locator('[data-exam-action=previous]').click();expect(page.locator('#exam-app .cae-content')).to_contain_text('Mijn antwoord blijft staan: 150')
     page.locator('[data-exam-action=pause]').click();expect(page.locator('[data-exam-action=resume]')).to_be_visible()
     audit('#exam-app .btn','paused exam')
     page.locator('[data-exam-action=resume]').click()
     for width in [320,390,430,760,1440]:
      page.set_viewport_size({'width':width,'height':1000})
      assert not page.evaluate('document.documentElement.scrollWidth>innerWidth+1')
      audit('#exam-app :is('+SELECTORS+')','exam '+str(width)+'px')
      if width in [390,1440]:
       page.locator('#exam-app .cae-toolbar').scroll_into_view_if_needed();shot('exam-dark-'+str(width))
     page.locator('[data-exam-action=check]').click()
     expect(page.locator('#cafa-exam-feedback')).to_be_visible()
     audit('#exam-app :is('+SELECTORS+')','exam feedback and answer model')
     checks.append('Check/pause/next enabled; previous disabled only on question 1; answers kept through next/previous/pause/resume; 320-1440px')
     hash('dashboard');audit('#exam-app :is('+SELECTORS+')','exam dashboard')
     if not offline:
      goto('samenvatting.html#kapitaalboom')
      audit('#kapitaalboom :is(button,.law-ref)','capital route')
      page.locator('#capital-classify .law-ref').first.click();expect(page.locator('#study-law-popover')).to_be_visible()
      page.locator('[data-law-popover-close]').click()
      goto('index.html#oefenen');expect(page.locator('#oefenen [data-reset=val]')).to_be_enabled()
      checks.append('Real full-page navigation preserves practice progress; capital route and law popover remain usable')
     page.evaluate('CafaTheme.setMode("light")')
     hash('val-1');expect(page.locator('html')).to_have_attribute('data-study-theme','light')
     assert page.locator('#val-1 [data-view="1"]').evaluate('(e)=>getComputedStyle(e).color')=='rgb(68, 65, 89)'
     page.emulate_media(media='print');assert page.locator('html').evaluate('(e)=>getComputedStyle(e).getPropertyValue("--dm-control-text").trim()')==''
     page.emulate_media(media='screen');page.evaluate('CafaTheme.setMode("auto")')
     expect(page.locator('html')).to_have_attribute('data-study-theme','dark')
     checks.append('Light-mode control colours unchanged, dark overrides do not apply to print, automatic mode still follows system')
     report['browsers'][name]={'checks':checks,'measurements':samples}
    except Exception as exc:
     report['failure']={'browser':name,'message':str(exc),'checks':checks,'measurements':samples}
     shot('failure');raise
    finally:ctx.close();browser.close()
  assert not report['errors'],report['errors']
 finally:
  (OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
  if server:server.shutdown()
 print('Contrast and control-state tests passed:', ', '.join(report['browsers']))
if __name__=='__main__':run()
