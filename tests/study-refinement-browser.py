"""Acceptance for compact routes, literal anchored sources and the floating calculator.
CAFA_OFFLINE_RENDER=1 renders in about:blank with inline assets and a test memory store;
this mode does not claim cross-page/session coverage. CI uses the real HTTP app.
"""
from __future__ import annotations
import asyncio,functools,http.server,json,os,re,threading
from pathlib import Path
from playwright.async_api import async_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=Path(os.environ.get('CAFA_REFINEMENT_OUTPUT','/tmp/cafa2-refinement-review'));OUT.mkdir(parents=True,exist_ok=True)
OFFLINE=os.environ.get('CAFA_OFFLINE_RENDER')=='1'
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass

def inlined_summary():
 html=(ROOT/'samenvatting.html').read_text()
 html=re.sub(r'<link\b[^>]*href="([^"]+\.css(?:\?[^"]*)?)"[^>]*>',lambda m:'<style>'+(ROOT/m[1].split('?')[0]).read_text()+'</style>',html)
 scripts=[]
 html=re.sub(r'<script\b[^>]*src="([^"]+)"[^>]*>\s*</script>',lambda m:('<script>'+(ROOT/m[1].split('?')[0]).read_text().replace('</script','<\\/script')+'</script>') if not m[1].startswith('https:') else '',html)
 html=re.sub(r'<script>([\s\S]*?)</script>',lambda m:scripts.append(m[0]) or '',html)
 store="<script>['localStorage','sessionStorage'].forEach(function(k){var d={};Object.defineProperty(window,k,{value:{getItem:k=>d[k]||null,setItem:(k,v)=>d[k]=String(v),removeItem:k=>delete d[k],clear:()=>d={}}});});</script>"
 return html.replace('</body>',store+''.join(scripts)+'</body>')

async def run():
 server=None;base=''
 if not OFFLINE:
  server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'
 report={'mode':'offline component rendering' if OFFLINE else 'HTTP application','browsers':{},'errors':[]}
 async with async_playwright() as pw:
  for kind in os.environ.get('CAFA_BROWSERS','chromium,webkit').split(','):
   args={'executable_path':os.environ['CAFA_CHROMIUM_PATH']} if kind=='chromium' and os.environ.get('CAFA_CHROMIUM_PATH') else {}
   browser=await getattr(pw,kind).launch(headless=True,**args)
   context=await browser.new_context(viewport={'width':1440,'height':1000},color_scheme='light')
   if not OFFLINE:await context.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base) else r.abort())
   page=await context.new_page();page.on('pageerror',lambda e:report['errors'].append(str(e)));page.set_default_timeout(10000);checks=[]
   async def view(id):
    if OFFLINE:
     await page.evaluate("id=>{document.querySelectorAll('section[data-view],article[data-view]').forEach(x=>x.hidden=x.id!==id);scrollTo(0,0)}",id)
    else:await page.evaluate('(id)=>location.hash=id',id)
    await page.locator('#'+id).wait_for(state='visible');await page.wait_for_timeout(100)
   async def choice(field,value):await page.locator(f'[data-capital-field="{field}"][data-capital-value="{value}"]').click()
   async def stage(id):await page.locator('[data-capital-stage='+id+']').click()
   async def shot(name):await page.screenshot(path=str(OUT/(kind+'-'+name+'.png')),full_page=False)
   try:
    if OFFLINE:await page.set_content(inlined_summary(),wait_until='load')
    else:await page.goto(base+'/samenvatting.html#kapitaalboom',wait_until='networkidle')
    await view('kapitaalboom')
    assert await page.locator('#kapitaalboom select,#kapitaalboom details').count()==0
    assert await page.locator('#kapitaalboom .route-stage:visible').count()==1
    assert await page.locator('#capital-classify').is_visible()
    await choice('participation','yes');await stage('value')
    await choice('influence','yes');await choice('information','yes')
    assert 'Nettovermogenswaarde (NVW)' in await page.locator('#capital-value-result').inner_text()
    await choice('information','no');assert 'Andere vermogensmutatiewaarde' in await page.locator('#capital-value-result').inner_text()
    await choice('exception','yes');assert 'Gemotiveerde afwijking' in await page.locator('#capital-value-result').inner_text()
    await choice('influence','no');assert 'Verkrijgingsprijs of actuele waarde' in await page.locator('#capital-value-result').inner_text()
    state=await page.evaluate('CafaCapital.getState()');assert 'information' not in state and 'exception' not in state
    await stage('classify');await choice('subsidiary','yes');await choice('group','no');await choice('participation','no')
    state=await page.evaluate('CafaCapital.getState()');assert state['subsidiary']=='yes' and state['group']=='no','Independent classifications preserved'
    await stage('value');assert 'Geen deelneming' in await page.locator('#capital-value-result').inner_text()
    await stage('classify');await choice('holder','person');await stage('value');assert 'Geen waarderingsuitkomst' in await page.locator('#capital-value-result').inner_text()
    await page.locator('[data-capital-reset]').click();await stage('consolidate');await choice('head','group')
    assert 'art. 2:406 lid 1' in await page.locator('#capital-consolidation-result').inner_text()
    await choice('head','part');assert 'art. 2:406 lid 2' in await page.locator('#capital-consolidation-result').inner_text()
    checks.append('All valuation paths update immediately; independent classifications, reset and group-head/part branches')
    # The quoted paragraphs must reconstruct the literal source exactly even with highlighting.
    trigger=page.locator('#capital-consolidation-result [data-law="407"]').first
    await trigger.click();await page.locator('#study-law-popover').wait_for(state='visible')
    assert await page.locator('dialog:modal').count()==0
    assert await page.locator('#study-law-popover').get_attribute('aria-modal')=='false'
    assert await page.locator('.law-essence').count()>0
    assert await page.locator('.law-mark-legend').inner_text() == 'Gearceerd = kern voor deze verwijzing.'
    assert await page.evaluate("Array.from(document.querySelectorAll('#study-law-popover [data-law-paragraph]')).every(p=>p.textContent===CAFA2_STUDY.laws['407'].paragraphs[Number(p.dataset.lawParagraph)])")
    before=await page.locator('#study-law-popover [data-law-paragraph]').count()
    await page.locator('[data-law-full]').click()
    assert await page.locator('#study-law-popover [data-law-paragraph]').count()>=before
    await page.keyboard.press('Escape');assert not await page.locator('#study-law-popover').is_visible()
    assert await page.evaluate('document.activeElement.dataset.law')=='407'
    # Same article, different context: different literal member, not an interpretation.
    await page.locator('[data-capital-reset]').click();await stage('classify');await choice('participation','yes');await stage('value')
    await page.locator('#capital-value-questions [data-law="389"]').first.click()
    assert 'invloed van betekenis' in await page.locator('.law-quote').inner_text()
    await page.keyboard.press('Escape');await choice('influence','yes');await choice('information','no')
    await page.locator('#capital-value-result [data-law="389"]').first.click()
    assert 'onvoldoende gegevens' in await page.locator('.law-quote').inner_text()
    assert 'wettelijke reserve' not in (await page.locator('.law-quote').inner_text()).lower()
    checks.append('Non-modal literal quotation, context-specific members, full-article toggle, exact paragraph identity and keyboard close')
    # Alignment and no overflow, including small phones and dark mode.
    for width in [320,390,430,760,1024,1440]:
     await page.keyboard.press('Escape');await page.set_viewport_size({'width':width,'height':900});await page.locator('[data-capital-reset]').click()
     for mode in ['light','dark']:
      await page.evaluate('(m)=>CafaTheme.setMode(m)',mode)
      assert not await page.evaluate('document.documentElement.scrollWidth>innerWidth+1'),('flow overflow',width,mode)
      law=page.locator('#capital-classify [data-law="24c"]').first;await law.click()
      rect=await page.locator('#study-law-popover').bounding_box();anchor=await law.bounding_box()
      assert rect and rect['x']>=0 and rect['x']+rect['width']<=width+1,(width,rect)
      assert rect['y']+rect['height']<=902,(width,rect)
      assert await page.locator('#study-law-popover').get_attribute('data-placement')=='below'
      assert rect['y']>=anchor['y']+anchor['height']-1
      if width in [390,1440]:await shot('anchored-law-'+str(width)+'-'+mode)
      await page.keyboard.press('Escape')
     if width in [390,1440]:await page.evaluate('scrollTo(0,0)');await shot('capital-route-'+str(width))
    checks.append('320–1440px, light/dark, source window below the clicked ordinary reference, no horizontal overflow')
    # Floating calculator: arithmetic, keyboard isolation, dragging, minimizing and continued reading.
    await page.set_viewport_size({'width':1440,'height':1000});await page.evaluate('CafaTheme.setMode("light")');await view('kapitaalbelangen')
    assert await page.locator('.chapter-orientation').count()==7
    assert await page.locator('#kapitaalbelangen .chapter-orientation').is_visible()
    await shot('chapter-orientation')
    await page.locator('.calculator-toolbar-trigger').click()
    assert await page.locator('#calculator-dialog').is_visible();assert await page.locator('dialog:modal').count()==0
    await page.locator('[data-calc-key="7"]').click();await page.locator('[data-calc-key="+"]').click();await page.locator('[data-calc-key="5"]').click();await page.locator('[data-calc-key="="]').click()
    assert await page.locator('.calc-output').inner_text()=='12'
    await page.locator('.calc-extra > summary').click()
    await page.locator('[data-calc-key="M+"]').click()
    pos=await page.locator('#calculator-dialog').bounding_box();handle=page.locator('.calculator-handle');await handle.focus();await page.keyboard.press('ArrowLeft')
    moved=await page.locator('#calculator-dialog').bounding_box();assert moved['x']<pos['x']
    await page.locator('[data-calc-minimize]').click();assert not await page.locator('.calculator-float-body').is_visible()
    await page.locator('[data-calc-minimize]').click();assert await page.locator('.calculator-float-body').is_visible()
    # Input outside the floater must not be captured by its calculator keyboard handler.
    await page.evaluate("var i=document.createElement('textarea');i.id='calculator-isolation-test';document.body.append(i);i.focus()")
    await page.keyboard.type('345')
    assert await page.locator('#calculator-isolation-test').input_value()=='345'
    assert await page.locator('.calc-output').inner_text()=='12'
    await page.locator('#calculator-isolation-test').evaluate('(x)=>x.remove()')
    await page.set_viewport_size({'width':320,'height':640});await page.wait_for_timeout(100)
    rect=await page.locator('#calculator-dialog').bounding_box();assert rect['x']>=0 and rect['x']+rect['width']<=321,rect
    assert rect['y']>=0 and rect['y']+rect['height']<=641,rect
    await shot('calculator-mobile');await page.locator('[data-calc-close]').click();await page.locator('.calculator-toolbar-trigger').click()
    assert await page.locator('.calc-output').inner_text()=='12';await page.locator('[data-calc-close]').click()
    if not OFFLINE:
     await page.goto(base+'/index.html#oefenen',wait_until='networkidle');await page.wait_for_function('!!window.CafaPractice&&!!window.CafaCalculator')
     await page.locator('.calculator-toolbar-trigger').click();assert await page.locator('.calc-output').inner_text()=='12'
     assert (await page.evaluate('CafaCalculator.getState()'))['memory']==12
     await page.goto(base+'/samenvatting.html#tentamen',wait_until='networkidle')
    else:await view('tentamen')
    checks.append('Floating calculator: result and memory, non-modal reading, keyboard isolation, reposition/minimize/mobile bounds'+(' and cross-page session state' if not OFFLINE else ' (session persistence not tested offline)'))
    await page.set_viewport_size({'width':1440,'height':1000});await page.locator('[data-exam-route-filter=val]').click()
    assert await page.locator('.exam-route-card:visible').count()==2
    assert '81.000' in await page.locator('#exam-route-monetair').inner_text()
    await page.locator('[data-exam-route-filter=kap]').click();assert await page.locator('.exam-route-card:visible').count()==2
    assert 'zichtbaar eigen vermogen' in await page.locator('#exam-route-stelsel').inner_text()
    await shot('exam-routes');await page.locator('[data-exam-route-filter=all]').click();assert await page.locator('.exam-route-card:visible').count()==7
    assert await page.locator('#tentamen .exam-route-source').count()==7
    checks.append('Seven chapter orientations and seven dated/question/page-cited example routes with filter')
    report['browsers'][kind]=checks
   except Exception as e:
    import traceback
    report['failure']={'browser':kind,'message':str(e),'traceback':traceback.format_exc(),'passed':checks};await shot('FAILURE');raise
   finally:
    (OUT/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));await context.close();await browser.close()
 if server:server.shutdown()
 assert not report['errors'],report['errors'];print(json.dumps(report,ensure_ascii=False,indent=2))
if __name__=='__main__':asyncio.run(run())