"""HTTP acceptance for source clarification, prerequisites, methods and shared branding."""
import asyncio,functools,http.server,json,os,threading
from pathlib import Path
from playwright.async_api import async_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('CAFA_CLARITY_OUTPUT','/tmp/cafa2-clarity-review'));OUT.mkdir(parents=True,exist_ok=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
async def run():
 server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
 threading.Thread(target=server.serve_forever,daemon=True).start()
 base=f'http://127.0.0.1:{server.server_port}';report={'browsers':{},'pageErrors':[]}
 try:
  async with async_playwright() as pw:
   for kind in os.environ.get('CAFA_BROWSERS','chromium,webkit').split(','):
    args={'executable_path':os.environ['CAFA_CHROMIUM_PATH']} if kind=='chromium' and os.environ.get('CAFA_CHROMIUM_PATH') else {}
    browser=await getattr(pw,kind).launch(headless=True,**args)
    context=await browser.new_context(viewport={'width':390,'height':844},color_scheme='light')
    await context.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base) else r.abort())
    page=await context.new_page();page.set_default_timeout(10000)
    page.on('pageerror',lambda e:report['pageErrors'].append(str(e)))
    await page.goto(base+'/index.html#start',wait_until='networkidle')
    await page.wait_for_function("document.querySelector('.cafa-wordmark svg')")
    home=await page.locator('.cafa-wordmark').evaluate('(e)=>({svg:e.querySelector("svg").outerHTML,x:e.getBoundingClientRect().x,size:getComputedStyle(e).fontSize})')
    await page.goto(base+'/samenvatting.html#functionele-valuta',wait_until='networkidle')
    await page.locator('#functionele-valuta').wait_for(state='visible')
    actual=await page.locator('.reader-brand').evaluate('(e)=>({svg:e.querySelector("svg").outerHTML,x:e.getBoundingClientRect().x,size:getComputedStyle(e).fontSize})')
    assert actual==home,('same homepage logo and placement',actual,home)
    assert 'wat betekent je antwoord' in (await page.locator('#functionele-valuta').inner_text()).lower()
    assert 'Weeg de antwoorden, tel ze niet' in await page.locator('#functionele-valuta').inner_text()
    assert await page.locator('#vreemde-valuta .chapter-orientation').count()==1
    for width in [320,390,430,760,1440]:
     await page.set_viewport_size({'width':width,'height':900})
     for mode in ['light','dark']:
      await page.evaluate('(m)=>CafaTheme.setMode(m)',mode)
      await page.locator('#functionele-valuta').scroll_into_view_if_needed()
      assert not await page.evaluate('document.documentElement.scrollWidth>innerWidth+1'),('currency overflow',width,mode)
      r=await page.locator('.reader-topbar').bounding_box();tabs=await page.locator('.reader-tabs').bounding_box()
      assert abs(r['y'])<1,('logo header remains at top',r)
      assert tabs['y']>=r['height']-1,('tabs do not overlap logo',tabs,r)
      if width==390:await page.screenshot(path=str(OUT/f'{kind}-currency-{mode}-390.png'))
    await page.goto(base+'/samenvatting.html#kapitaalboom',wait_until='networkidle')
    await page.locator('[data-capital-field=target][data-capital-value=partnership]').click()
    assert 'VOF/CV' in await page.locator('#capital-qualifications').inner_text()
    assert 'commanditair vennoot' in await page.locator('#capital-qualifications').inner_text()
    for width in [320,390,1440]:
     await page.set_viewport_size({'width':width,'height':900})
     assert not await page.evaluate('document.documentElement.scrollWidth>innerWidth+1'),('classification overflow',width)
    await page.set_viewport_size({'width':390,'height':900})
    await page.screenshot(path=str(OUT/f'{kind}-vof-390.png'))
    await page.goto(base+'/samenvatting.html#tentamen',wait_until='networkidle')
    for topic in ['kap','val','nvw','hk']:
     await page.locator(f'[data-exam-route-filter={topic}]').click()
     assert await page.locator('.exam-method:visible').count()==1
     assert await page.locator(f'.exam-method[data-exam-method-topic={topic}]').is_visible()
     assert await page.locator('.exam-route-card:visible').count() in [1,2]
     assert not await page.evaluate('document.documentElement.scrollWidth>innerWidth+1'),('method overflow',topic)
    await page.locator('[data-exam-route-filter=val]').click()
    await page.locator('.exam-method[data-exam-method-topic=val] details').first.locator('summary').click()
    assert 'Werkelijke monetaire eindpositie' in await page.locator('.exam-method[data-exam-method-topic=val]').inner_text()
    await page.screenshot(path=str(OUT/f'{kind}-exam-method-390.png'))
    await page.locator('[data-exam-route-filter=all]').click()
    assert await page.locator('.exam-method:visible').count()==4
    assert await page.locator('.exam-route-card:visible').count()==7
    await page.goto(base+'/samenvatting.html#kapitaalbelangen',wait_until='networkidle')
    assert 'die hoef je vooraf nog niet te kennen' in await page.locator('#kapitaalbelangen .chapter-orientation').inner_text()
    await page.screenshot(path=str(OUT/f'{kind}-prerequisites-390.png'))
    report['browsers'][kind]='passed: source explanations, partnership selection, prior knowledge, method filters, responsive layout and homepage-identical sticky logo'
    await context.close();await browser.close()
  assert not report['pageErrors'],report['pageErrors']
 finally:
  server.shutdown();(OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
 print(json.dumps(report,ensure_ascii=False))
if __name__=='__main__':asyncio.run(run())
