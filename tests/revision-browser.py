"""Isolated browser regression test. Uses only synthetic local browser state."""
from __future__ import annotations
import asyncio
import functools
import http.server
import json
import os
from pathlib import Path
import shutil
import threading
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('CAFA_REVIEW_OUTPUT', '/tmp/cafa2-browser-review'))
OUT.mkdir(parents=True, exist_ok=True)
class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

async def main():
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(QuietHandler, directory=str(ROOT)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f'http://127.0.0.1:{server.server_port}'
    report = {'summary_routes': 0, 'practice_questions': 0, 'widths': [], 'screenshots': [], 'errors': [], 'no_script': False}
    manifest = json.loads((ROOT/'docs/content-revision-manifest.json').read_text())
    async with async_playwright() as pw:
        executable = os.environ.get('CHROMIUM_PATH') or shutil.which('chromium')
        browser = await pw.chromium.launch(headless=True, **({'executable_path': executable} if executable else {}), args=['--no-sandbox'])
        context = await browser.new_context(viewport={'width':1440,'height':1000})
        await context.route('**/*', lambda route: route.continue_() if route.request.url.startswith(base) else route.abort())
        page = await context.new_page()
        page.on('pageerror', lambda error: report['errors'].append(str(error)))
        await page.goto(base+'/samenvatting.html', wait_until='networkidle')
        ids = await page.locator('[data-lesson]').evaluate_all('(xs)=>xs.map(x=>x.dataset.lesson)')
        assert len(ids) == manifest['summary']['pages']
        for lesson in ids:
            await page.evaluate('(x)=>location.hash=x', lesson)
            await page.locator(f'[data-lesson="{lesson}"]').wait_for(state='visible')
            assert await page.locator('[data-lesson]:visible').count() == 1
            report['summary_routes'] += 1
        await page.goto(base+'/samenvatting.html#start')
        await page.locator('#study-search').fill('meegekocht')
        assert await page.locator('#study-search-results a').count() >= 1
        await page.goto(base+'/samenvatting.html#begrippen')
        await page.locator('#glossary-search').fill('monetaire')
        assert 0 < await page.locator('[data-glossary-entry]:visible').count() < manifest['summary']['glossary']
        await page.goto(base+'/samenvatting.html#downstream-nvw')
        await page.locator('[data-understood="downstream-nvw"]').click()
        await page.reload()
        assert await page.locator('[data-understood="downstream-nvw"]').get_attribute('aria-pressed') == 'true'
        await page.goto(base+'/samenvatting.html#kernschema')
        await page.locator('#kernel-form button').click()
        await page.wait_for_function("document.querySelector('#kernel-status').textContent.startsWith('Bijgewerkt')")
        assert '19.200' in await page.locator('#kernel-results').inner_text()
        await page.locator('[name=direction]').select_option('side')
        await page.locator('[name=sellerShare]').fill('90')
        await page.locator('[name=buyerShare]').fill('70')
        await page.locator('[name=basis]').select_option('HK')
        await page.locator('#kernel-form button').click()
        await page.wait_for_function("document.querySelector('#kernel-status').classList.contains('kernel-error')")
        assert 'geen afzonderlijke bronuitwerking' in await page.locator('#kernel-status').inner_text()
        await page.locator('[name=basis]').select_option('NVW')
        await page.locator('#kernel-form button').click()
        await page.wait_for_function("document.querySelector('#kernel-status').textContent.startsWith('Bijgewerkt')")
        for width in [320,390,760,1024,1440,1920]:
            await page.set_viewport_size({'width':width,'height':1000})
            for lesson in ['start','downstream-nvw','valuta-voorraad','consolidatie-hk','begrippen','kernschema']:
                await page.evaluate('(x)=>location.hash=x', lesson)
                target = page.locator(f'[data-lesson="{lesson}"]')
                await target.wait_for(state='visible')
                await target.locator('.study-example').evaluate_all('(xs)=>xs.forEach(x=>x.open=true)')
                overflow = await page.evaluate('document.documentElement.scrollWidth>innerWidth+1')
                assert not overflow, f'Page overflow {width}px {lesson}'
            report['widths'].append(width)
        for width, lesson in [(1440,'start'),(1440,'kernschema'),(1440,'downstream-nvw'),(390,'valuta-voorraad')]:
            await page.set_viewport_size({'width':width,'height':1000})
            await page.evaluate('(x)=>location.hash=x', lesson)
            await page.locator(f'[data-lesson="{lesson}"]').wait_for(state='visible')
            filename=f'summary-{lesson}-{width}.png'
            await page.screenshot(path=str(OUT/filename),full_page=False)
            report['screenshots'].append(filename)
        await page.set_viewport_size({'width':1440,'height':1000})
        await page.goto(base+'/index.html#kap-1', wait_until='networkidle')
        await page.wait_for_function('!!window.CafaExams && !document.documentElement.classList.contains("cafa-starting")')
        for code in ['kap','val','nvw','hk']:
            for number in range(1,31):
                qid=f'{code}-{number}'
                await page.evaluate('(x)=>location.hash=x',qid)
                q=page.locator('#'+qid)
                await q.wait_for(state='visible')
                panel=q.locator('.theory-panel')
                assert await panel.count()==1
                assert await panel.get_attribute('data-guidance-id')==qid
                await panel.evaluate('(x)=>x.open=true')
                assert len(await panel.locator('.theory-content>p').first.inner_text())>120
                assert await q.locator('.learning-pattern p').count()==6
                if number in manifest['modules'][code]['caseTables']:
                    assert await q.locator('.learning-case table').count()>=1
                report['practice_questions']+=1
        for width in [320,390,1024,1440]:
            await page.set_viewport_size({'width':width,'height':1000})
            for qid in ['nvw-6','nvw-25','val-14','hk-24','kap-18']:
                await page.evaluate('(x)=>location.hash=x',qid)
                q=page.locator('#'+qid)
                await q.wait_for(state='visible')
                await q.locator('.theory-panel').evaluate('(x)=>x.open=true')
                assert not await page.evaluate('document.documentElement.scrollWidth>innerWidth+1'),f'Practice overflow {width}px {qid}'
            if width in [390,1440]:
                await page.evaluate("location.hash='nvw-6'")
                await page.locator('#nvw-6').wait_for(state='visible')
                filename=f'practice-nvw6-{width}.png'
                await page.screenshot(path=str(OUT/filename),full_page=False)
                report['screenshots'].append(filename)
        await context.close()
        context=await browser.new_context(java_script_enabled=False,viewport={'width':390,'height':900})
        await context.route('**/*', lambda route: route.continue_() if route.request.url.startswith(base) else route.abort())
        page=await context.new_page()
        await page.goto(base+'/samenvatting.html')
        assert await page.locator('[data-lesson]:visible').count()==manifest['summary']['pages']
        await page.goto(base+'/fallback/consolidatie-nvw.html#nvw-6')
        q=page.locator('#nvw-6')
        await q.wait_for(state='visible')
        await q.locator('.theory-panel summary').click()
        assert await q.locator('.theory-panel').get_attribute('open') is not None
        assert await q.locator('.learning-case table').count()>=1
        assert not await page.evaluate('document.documentElement.scrollWidth>innerWidth+1')
        report['no_script']=True
        await context.close()
        await browser.close()
    server.shutdown()
    assert not report['errors'], report['errors']
    (OUT/'browser-results.json').write_text(json.dumps(report,indent=2))
    print(json.dumps(report,indent=2))

if __name__=='__main__':
    asyncio.run(main())
