from __future__ import annotations
import asyncio, functools, http.server, json, os, shutil, threading
from pathlib import Path
from playwright.async_api import async_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('CAFA_REVIEW_OUTPUT','/tmp/cafa2-reader-review'));OUT.mkdir(parents=True,exist_ok=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args): pass

def serve(directory):
    s=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(directory)))
    threading.Thread(target=s.serve_forever,daemon=True).start()
    return s,f'http://127.0.0.1:{s.server_port}'

async def run():
    server,base=serve(ROOT)
    report={'chapters':7,'topic_links_checked':0,'widths':[],'browsers':[],'page_errors':[],'screenshots':[]}
    async with async_playwright() as pw:
        kinds=['chromium']
        if os.environ.get('TEST_WEBKIT')=='1':kinds.append('webkit')
        for kind in kinds:
            args={}
            if kind=='chromium':
                exe=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium')
                if exe:args['executable_path']=exe
                args['args']=['--no-sandbox']
            browser=await getattr(pw,kind).launch(headless=True,**args)
            context=await browser.new_context(viewport={'width':1440,'height':1000})
            await context.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base) else r.abort())
            page=await context.new_page();page.on('pageerror',lambda e:report['page_errors'].append(str(e)))
            await page.goto(base+'/samenvatting.html',wait_until='networkidle')
            await page.wait_for_function("document.querySelectorAll('[data-view]:not([hidden])').length===1")
            mapping=await page.locator('#reader-map').text_content();config=json.loads(mapping)
            for chapter in config['chapters']:
                await page.evaluate('(id)=>location.hash=id',chapter['id'])
                await page.locator('[data-view="'+chapter['id']+'"]').wait_for(state='visible')
                for part in chapter['parts']:
                    await page.evaluate('(id)=>location.hash=id',part)
                    await page.locator('#'+part).wait_for(state='visible')
                    assert await page.locator('[data-view]:visible').count()==1
                    assert await page.locator('#'+part).evaluate('(n)=>n.closest("details.reader-section").open')
                    report['topic_links_checked']+=1
            await page.evaluate("location.hash='start'")
            await page.locator('#study-search').fill('meegekocht')
            assert await page.locator('#study-search-results a').count()>0
            await page.locator('#study-search-results a').first.click()
            assert await page.locator('[data-view]:visible').count()==1
            await page.evaluate("location.hash='begrippen'")
            await page.locator('#glossary-search').fill('monetaire')
            assert 0<await page.locator('[data-glossary-entry]:visible').count()<81
            await page.evaluate("location.hash='source-S1'")
            await page.locator('#source-S1').wait_for(state='visible')
            await page.evaluate("location.hash='kapitaalbelangen'")
            await page.locator('[data-chapter-understood=kapitaalbelangen]').click()
            await page.reload(wait_until='networkidle')
            assert await page.locator('[data-chapter-understood=kapitaalbelangen]').get_attribute('aria-pressed')=='true'
            assert await page.evaluate('JSON.parse(localStorage.getItem("cafa2-summary-understood-v2")).dochter') is True
            await page.locator('[data-view=kapitaalbelangen] [data-sections=close]').click()
            assert await page.locator('[data-view=kapitaalbelangen] .reader-section[open]').count()==0
            await page.locator('[data-view=kapitaalbelangen] [data-sections=open]').click()
            assert await page.locator('[data-view=kapitaalbelangen] .reader-section[open]').count()==3
            await page.evaluate("location.hash='kernschema'")
            await page.locator('#kernel-form button').click()
            await page.wait_for_function("document.querySelector('#kernel-status').textContent.startsWith('Bijgewerkt')")
            assert '19.200' in await page.locator('#kernel-results').inner_text()
            for width in ([320,390,430,760,1024,1440] if kind=='chromium' else [390,430]):
                await page.set_viewport_size({'width':width,'height':844})
                for part in ['start','dividend','proportioneel','downstream-nvw','consolidatie-hk','kernschema']:
                    await page.evaluate('(id)=>location.hash=id',part)
                    await page.locator('#'+part).wait_for(state='visible')
                    await page.locator('[data-view]:visible .study-example').evaluate_all('(xs)=>xs.forEach(x=>x.open=true)')
                    assert not await page.evaluate('document.documentElement.scrollWidth>innerWidth+1'),f'{kind} page overflow {width} {part}'
                report['widths'].append([kind,width])
            await page.set_viewport_size({'width':390,'height':844})
            await page.evaluate("location.hash='proportioneel'")
            await page.locator('#proportioneel').wait_for(state='visible')
            await page.locator('#reader-mobile-menu>summary').click()
            assert await page.locator('#reader-mobile-menu nav [data-chapter-link]').count()==7
            assert await page.locator('#lesson-picker').count()==0
            rect=await page.locator('#reader-mobile-menu nav').bounding_box()
            assert rect and rect['x']>=0 and rect['x']+rect['width']<=391 and rect['y']+rect['height']<=844
            filename=kind+'-mobile-menu.png';await page.screenshot(path=str(OUT/filename));report['screenshots'].append(filename)
            await page.locator('#reader-mobile-menu [data-chapter-link=vreemde-valuta]').click()
            assert await page.locator('#reader-mobile-menu').get_attribute('open') is None
            await page.locator('[data-view=vreemde-valuta]').wait_for(state='visible')
            for width,part in [(390,'dividend'),(390,'proportioneel'),(1440,'kapitaalbelangen'),(1440,'downstream-nvw')]:
                await page.set_viewport_size({'width':width,'height':1000 if width>760 else 844})
                await page.evaluate('(id)=>location.hash=id',part)
                await page.locator('#'+part).wait_for(state='visible')
                filename=f'{kind}-{part}-{width}.png';await page.screenshot(path=str(OUT/filename));report['screenshots'].append(filename)
            # New typography controls affect reading text, not the exam interface.
            await page.set_viewport_size({'width':320,'height':700})
            await page.evaluate("location.hash='dividend'")
            for _ in range(6):await page.locator('[data-font="1"]').click()
            assert not await page.evaluate('document.documentElement.scrollWidth>innerWidth+1')
            if kind=='chromium':
                await page.set_viewport_size({'width':1440,'height':1000})
                await page.goto(base+'/index.html#kap-1',wait_until='networkidle')
                await page.wait_for_function("!!window.CafaPractice && !document.documentElement.classList.contains('cafa-starting')")
                checked=0
                for code in ['kap','val','nvw','hk']:
                    for number in range(1,31):
                        qid=f'{code}-{number}'
                        await page.evaluate('(id)=>location.hash=id',qid)
                        q=page.locator('#'+qid)
                        await q.wait_for(state='visible')
                        assert await q.locator('.theory-panel').get_attribute('data-guidance-id')==qid
                        assert await q.locator('.learning-pattern p').count()==6
                        checked+=1
                report['practice_questions']=checked
                await page.evaluate("location.hash='kap-1'")
                await page.locator('#kap-1').wait_for(state='visible')
                await page.locator('#option-kap-1-0').click()
                await page.reload(wait_until='networkidle')
                await page.wait_for_function("!!window.CafaPractice && !document.documentElement.classList.contains('cafa-starting')")
                assert await page.evaluate("window.CafaPractice.getAnswer('kap',1).choice")==0
                report['answer_persistence']=True
            report['browsers'].append(kind)
            await context.close()
            if kind=='chromium':
                nojs=await browser.new_context(java_script_enabled=False,viewport={'width':390,'height':844})
                await nojs.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base) else r.abort())
                p=await nojs.new_page();await p.goto(base+'/samenvatting.html#proportioneel')
                if await p.locator('#bijzondere-consolidatie--proportionele-methode').get_attribute('open') is None:
                    await p.locator('#bijzondere-consolidatie--proportionele-methode>summary').click()
                assert await p.locator('#proportioneel').is_visible()
                assert not await p.evaluate('document.documentElement.scrollWidth>innerWidth+1')
                report['script_free_reader']=True;await nojs.close()
            await browser.close()
    server.shutdown()
    assert not report['page_errors'],report['page_errors']
    (OUT/'reader-results.json').write_text(json.dumps(report,indent=2))
    print(json.dumps(report,indent=2))

if __name__=='__main__':asyncio.run(run())
