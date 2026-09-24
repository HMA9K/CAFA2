"""Browser acceptance tests for question-preserving navigation, display modes and isolated restarts."""
from __future__ import annotations
import asyncio, functools, http.server, json, os, threading
from pathlib import Path
from playwright.async_api import async_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('CAFA_STUDY_OUTPUT','/tmp/cafa2-study-review'));OUT.mkdir(parents=True,exist_ok=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
async def run():
    server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
    threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'
    report={'browsers':{},'errors':[]}
    async with async_playwright() as pw:
      for kind in os.environ.get('CAFA_BROWSERS','chromium,webkit').split(','):
        browser=await getattr(pw,kind).launch(headless=True, **({'executable_path':os.environ['CAFA_CHROMIUM_PATH']} if kind=='chromium' and os.environ.get('CAFA_CHROMIUM_PATH') else {}))
        context=await browser.new_context(viewport={'width':390,'height':844},color_scheme='dark')
        await context.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base) else r.abort())
        page=await context.new_page();page.on('pageerror',lambda e:report['errors'].append(str(e)))
        page.set_default_timeout(12000)
        checks=[]
        async def goto(s):
            await page.goto(base+'/'+s,wait_until='networkidle')
            if s.startswith('index.html'):await page.wait_for_function('!!window.CafaPractice&&!!window.CafaFeedback&&!document.documentElement.classList.contains("cafa-starting")')
        async def hash(h):
            await page.evaluate('(h)=>location.hash=h',h);await page.wait_for_timeout(160)
        async def choose(mode):
            await page.locator('#study-theme-control>summary').click();await page.locator('[data-theme-choice='+mode+']').click()
        async def shot(name):await page.screenshot(path=str(OUT/(kind+'-'+name+'.png')),full_page=False)
        try:
          await goto('samenvatting.html#kapitaalboom')
          assert await page.locator('#kapitaalboom').is_visible()
          assert await page.evaluate('CafaTheme.getMode()')=='auto'
          assert await page.locator('html').get_attribute('data-study-theme')=='dark'
          await page.emulate_media(color_scheme='light');await page.wait_for_function("document.documentElement.dataset.studyTheme === 'light'")
          assert await page.locator('html').get_attribute('data-study-theme')=='light'
          await choose('dark');await page.emulate_media(color_scheme='light')
          assert await page.locator('html').get_attribute('data-study-theme')=='dark'
          law=page.locator('#capital-classify .law-ref[data-law="24c"]').first
          await law.focus();await page.keyboard.press('Enter')
          assert await page.locator('#study-law-popover').is_visible()
          assert 'p. 1' in await page.locator('#study-law-popover').inner_text()
          assert 'Letterlijke wettekst' in await page.locator('#study-law-popover').inner_text()
          assert await page.locator('#study-law-popover mark.law-essence').count()>0
          assert await page.locator('dialog:modal').count()==0
          await page.locator('[data-law-popover-close]').click()
          assert await page.evaluate('document.activeElement.dataset.law')=='24c'
          assert await page.locator('#kapitaalboom select').count()==0
          assert await page.locator('#kapitaalboom details').count()==0
          await page.locator('[data-capital-field=participation][data-capital-value=yes]').first.click()
          await page.locator('[data-capital-stage=value]').click()
          await page.locator('[data-capital-field=influence][data-capital-value=yes]').click()
          await page.locator('[data-capital-field=information][data-capital-value=yes]').click()
          assert 'Nettovermogenswaarde (NVW)' in await page.locator('#capital-value-result').inner_text()
          await page.locator('[data-capital-field=information][data-capital-value=no]').click()
          assert 'Andere vermogensmutatiewaarde' in await page.locator('#capital-value-result').inner_text()
          await page.locator('[data-capital-reset]').click()
          for width in [320,390,430,760,1024,1440]:
            await page.set_viewport_size({'width':width,'height':900})
            for mode in ['light','dark']:
              await page.evaluate('(m)=>CafaTheme.setMode(m)',mode)
              assert not await page.evaluate('document.documentElement.scrollWidth>innerWidth+1'),(width,mode,'flow overflow')
            if width in [390,1440]:await shot('flow-'+str(width))
          await page.set_viewport_size({'width':320,'height':720})
          await page.locator('#study-theme-control>summary').click()
          rect=await page.locator('.study-theme-menu').bounding_box()
          assert rect and rect['x']>=0 and rect['x']+rect['width']<=321,rect
          await shot('theme-menu-320');await page.locator('[data-theme-choice=light]').click()
          await page.locator('#study-tools-menu>summary').click()
          await page.locator('#study-tools-menu a[href$="#wetsartikelen"]').click()
          await page.locator('#study-law-search').fill('389')
          assert await page.locator('[data-law-entry]:visible').count()>=1
          await hash('wet-389');await page.locator('#wet-389').wait_for(state='visible')
          checks.append('Responsive click route, accessible non-modal source popover, literal highlights, article search and automatic/manual themes')
          # Theme sticks within the same tab across full-page navigation.
          await goto('index.html#oefenen')
          assert await page.evaluate('CafaTheme.getMode()')=='light'
          assert await page.locator('[data-reset=kap]:visible').count()==0
          assert await page.locator('[data-reset=val]:visible').count()==0
          await page.locator('[data-start=kap]').click();await hash('kap-12')
          await page.locator('label[for="a-kap-12-0"]').click()
          await page.locator('#kap-12 .cafa-check-controls button').first.click()
          await page.locator('#kap-12 .feedback-note > summary:visible').click()
          assert await page.locator('#kap-12 .study-answer-note:visible').count()>=1
          # Create unrelated data before taking a detour, not by replacing the storage implementation.
          await page.evaluate('CafaPractice.setRichAnswer("val",2,"<p>Andere module blijft bewaard</p>")')
          await page.evaluate('scrollTo(0,450)');await page.wait_for_timeout(100)
          before_y=await page.evaluate('scrollY')
          link=page.locator('#kap-12 a[href^="samenvatting.html#"]:not([data-law]):visible').first
          await link.click();await page.wait_for_load_state('networkidle')
          await page.locator('[data-study-origin]').wait_for(state='visible')
          assert 'oefenvraag 12' in await page.locator('[data-study-origin]').inner_text()
          origin_y=await page.evaluate('JSON.parse(sessionStorage.getItem("cafa2-navigation-v1")).origin.y')
          await page.locator('[data-tool-link=kapitaalboom]').click()
          await page.locator('[data-study-origin]').click();await page.wait_for_load_state('networkidle')
          await page.wait_for_function('!!window.CafaPractice&&!!window.CafaFeedback')
          await page.wait_for_timeout(250)
          assert await page.evaluate('location.hash')=='#kap-12'
          assert await page.evaluate('CafaPractice.getAnswer("kap",12).choice')==0
          assert 'Andere module' in await page.evaluate('CafaPractice.getAnswer("val",2).html')
          assert await page.locator('#kap-12 .study-answer-note:visible').count()>=1,'Feedback restored'
          # The recorded scroll position is the exact position of the source at the moment of clicking.
          assert abs((await page.evaluate('scrollY'))-origin_y)<5,('scroll restoration',origin_y,await page.evaluate('scrollY'))
          await shot('practice-return')
          await hash('oefenen')
          assert await page.locator('[data-reset=kap]:visible').count()==1
          old=await page.evaluate('JSON.stringify(cafaAppTest.getState().modules.val)')
          page.once('dialog',lambda d:d.dismiss())
          await page.locator('[data-reset=kap]:visible').click()
          assert await page.evaluate('CafaPractice.getAnswer("kap",12).choice')==0
          await page.evaluate('window.__studyBeforeRestart=true')
          page.once('dialog',lambda d:d.accept())
          await page.locator('[data-reset=kap]:visible').click()
          await page.wait_for_function('!window.__studyBeforeRestart && !!window.CafaPractice && !!window.CafaFeedback && !document.documentElement.classList.contains("cafa-starting")')
          await page.wait_for_load_state('networkidle')
          assert await page.evaluate('location.hash')=='#kap-1'
          assert await page.evaluate('CafaPractice.getAnswer("kap",12).choice') is None
          assert await page.evaluate('JSON.stringify(cafaAppTest.getState().modules.val)')==old
          assert await page.evaluate('cafaAppTest.getState().modules.kap.history.length')>=1
          checks.append('Practice detour keeps answer/question/feedback; reset cancel and isolated new attempt preserve other topic')
          # Full timed exam. Work at desktop size to exercise the rich text editor and footer.
          await page.set_viewport_size({'width':1440,'height':1000})
          await hash('dashboard')
          assert await page.locator('[data-exam-action=restart]:visible').count()==0
          await hash('welkom/cafa2-20240422')
          await page.locator('[data-exam-extra]').check()
          await page.locator('[data-exam-action=start]').click()
          await page.locator('[data-exam-action=next]').click();await page.locator('[data-exam-action=next]').click()
          attempt=await page.evaluate('CafaExams.getPosition()');aid=attempt['attempt']
          editor=page.locator('#exam-app [contenteditable=true]').first
          if not await editor.is_visible():await page.locator('#exam-app .stock-notes>summary').click()
          await editor.fill('Mijn berekening blijft staan: 3.000.000')
          await page.locator('[data-exam-action=check]').click()
          await page.locator('#cafa-exam-feedback .feedback-note > summary').click()
          assert await page.locator('#cafa-exam-feedback .study-answer-note').is_visible()
          saved=await page.evaluate('(id)=>CafaExams.getAttempts().find(a=>a.id===id)',aid)
          assert saved['extraMinutes']==30
          await page.locator('#exam-app .study-exam-link').click();await page.wait_for_load_state('networkidle')
          assert 'tentamenvraag 3' in await page.locator('[data-study-origin]').inner_text()
          await page.locator('[data-study-origin]').click();await page.wait_for_load_state('networkidle')
          await page.wait_for_function('!!window.CafaExams&&!!window.CafaFeedback')
          now=await page.evaluate('(id)=>CafaExams.getAttempts().find(a=>a.id===id)',aid)
          assert now['currentIndex']==2 and now['answers']==saved['answers']
          assert now['deadlineAt']==saved['deadlineAt'],'Clock unchanged on detour'
          await page.locator('#cafa-exam-feedback .study-answer-note').wait_for(state='visible')
          await hash('welkom/cafa2-20240930');await page.locator('[data-exam-untimed]').check();await page.locator('[data-exam-action=start]').click()
          other_id=(await page.evaluate('CafaExams.getPosition()'))['attempt']
          other_before=await page.evaluate('(id)=>JSON.stringify(CafaExams.getAttempts().find(a=>a.id===id))',other_id)
          await hash('dashboard')
          restart=page.locator('[data-exam-action=restart][data-restart-attempt="'+aid+'"]:visible').first
          page.once('dialog',lambda d:d.dismiss());await restart.click()
          assert (await page.evaluate('CafaExams.getAttempts()'))[0]['id']==aid
          page.once('dialog',lambda d:d.accept());await restart.click()
          current=await page.evaluate('CafaExams.getPosition()')
          assert current['attempt']!=aid and current['index']==0
          all_attempts=await page.evaluate('CafaExams.getAttempts()')
          new=next(a for a in all_attempts if a['id']==current['attempt']);prior=next(a for a in all_attempts if a['id']==aid)
          assert new['answers']=={} and new['extraMinutes']==30
          assert prior['status']=='completed' and prior['finishReason']=='restarted'
          assert prior['answers']==saved['answers']
          assert await page.evaluate('(id)=>JSON.stringify(CafaExams.getAttempts().find(a=>a.id===id))',other_id)==other_before
          await shot('exam-after-restart')
          # Untimed restarts preserve the setting too.
          await hash('dashboard');page.once('dialog',lambda d:d.accept())
          await page.locator('[data-exam-action=restart][data-restart-attempt="'+other_id+'"]:visible').first.click()
          untimed=await page.evaluate('CafaExams.getAttempts().find(a=>a.id===CafaExams.getPosition().attempt)')
          assert untimed['untimed'] is True
          await page.reload(wait_until='networkidle');await page.wait_for_function('!!window.CafaExams')
          assert len(await page.evaluate('CafaExams.getAttempts()'))==4
          checks.append('Timed and untimed exams: exact question and answer return, stable clock, original model plus note, isolated restart and reload')
          for width in [320,390,430,760]:
            await page.set_viewport_size({'width':width,'height':844})
            assert not await page.evaluate('document.documentElement.scrollWidth>innerWidth+1'),('exam overflow',width)
          await shot('exam-mobile')
          fresh=await browser.new_context(color_scheme='dark')
          await fresh.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base) else r.abort())
          p=await fresh.new_page();await p.goto(base+'/samenvatting.html#kapitaalboom');await p.wait_for_function('!!window.CafaTheme')
          assert await p.evaluate('CafaTheme.getMode()')=='auto';await fresh.close()
          checks.append('New browser session defaults to Automatic')
          if kind=='chromium':
            nojs=await browser.new_context(java_script_enabled=False,viewport={'width':390,'height':844})
            p=await nojs.new_page();await p.goto(base+'/samenvatting.html#kapitaalboom')
            assert await p.locator('#kapitaalboom').is_visible();assert await p.locator('#capital-value').is_visible()
            await p.goto(base+'/fallback/kapitaalbelangen.html#kap-1');assert await p.locator('#kap-1').is_visible()
            await nojs.close();checks.append('Script-free flow and existing fallback exercises remain available')
          report['browsers'][kind]=checks
        except Exception as exc:
          import traceback
          traceback.print_exc()
          report['failure']={'browser':kind,'url':page.url,'exception':str(exc),'traceback':traceback.format_exc(),'passed':checks}
          try:
            report['failure']['navigation']=await page.evaluate('sessionStorage.getItem("cafa2-navigation-v1")')
            report['failure']['scroll']=await page.evaluate('({y:scrollY,h:document.documentElement.scrollHeight,body:document.body&&document.body.scrollHeight,viewport:innerHeight})')
            await shot('FAILURE');(OUT/'failed-page.html').write_text(await page.content())
          except Exception:
            pass
          raise
        finally:
          (OUT/'study-results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
          await context.close();await browser.close()
    server.shutdown();assert not report['errors'],report['errors'];print(json.dumps(report,ensure_ascii=False,indent=2))
if __name__=='__main__':asyncio.run(run())
