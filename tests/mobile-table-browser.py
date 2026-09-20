"""Test actual text/table usability, not just absence of whole-page overflow."""
from __future__ import annotations
import asyncio, functools, http.server, json, os, shutil, threading, re
from pathlib import Path
from playwright.async_api import async_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('CAFA_REVIEW_OUTPUT','/tmp/cafa2-mobile-tables'));OUT.mkdir(parents=True,exist_ok=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args): pass

def inline_html():
    # Offline visual test only. CI uses the real HTTP build and dynamic imports.
    html=(ROOT/'samenvatting.html').read_text()
    html=re.sub(r'<link rel="stylesheet" href="([^"]+)"[^>]*>',lambda m:'<style>'+(ROOT/m[1].split('?')[0]).read_text()+'</style>',html)
    html=re.sub(r'<script\b[^>]*src="[^"]+"[^>]*>[\s\S]*?</script>','',html)
    return html.replace('</body>','<script>'+(ROOT/'js/summary-reader.js').read_text()+'</script></body>')

async def run():
    inline=os.environ.get('MOBILE_INLINE')=='1'
    server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{server.server_port}'
    results={'engines':[], 'checks':[], 'page_errors':[], 'dynamic_kernel':False}
    async with async_playwright() as pw:
        for kind in ['chromium']+(['webkit'] if os.environ.get('TEST_WEBKIT')=='1' else []):
            opts={}
            if kind=='chromium' and shutil.which('chromium'):opts={'executable_path':shutil.which('chromium'),'args':['--no-sandbox']}
            browser=await getattr(pw,kind).launch(headless=True,**opts)
            context=await browser.new_context(viewport={'width':390,'height':844})
            await context.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base) else r.abort())
            page=await context.new_page();page.on('pageerror',lambda e:results['page_errors'].append(str(e)))
            if inline:await page.set_content(inline_html())
            else:await page.goto(base+'/samenvatting.html',wait_until='networkidle')
            chapters=json.loads(await page.locator('#reader-map').text_content())['chapters']
            for width in [320,390,430,760,1024]:
                await page.set_viewport_size({'width':width,'height':844})
                for chapter in chapters:
                    await page.evaluate('(x)=>location.hash=x',chapter['id'])
                    await page.locator('[data-view="'+chapter['id']+'"]').wait_for(state='visible')
                    await page.locator('[data-view]:visible details').evaluate_all('(xs)=>xs.forEach(x=>x.open=true)')
                    assert not await page.evaluate('document.documentElement.scrollWidth>innerWidth+1'),f'Page overflow {kind} {width} {chapter["id"]}'
                await page.evaluate("location.hash='kwalificatie'")
                await page.locator('#kwalificatie').wait_for(state='visible')
                prose=page.locator('#kwalificatie .study-table').first
                if width<=760:
                    assert await prose.evaluate('(t)=>getComputedStyle(t).display')=='block'
                    assert await prose.locator('tbody th').first.evaluate('(c)=>getComputedStyle(c).hyphens')=='none'
                    for title in ['Deelneming','Dochtermaatschappij','Groepsmaatschappij']:
                        cell=prose.get_by_role('rowheader',name=title,exact=True)
                        # One complete word must not be split into several physical text lines.
                        assert await cell.evaluate('(c)=>{const r=document.createRange();r.selectNodeContents(c);return r.getClientRects().length}')==1
                    assert await prose.locator('tbody td').first.get_attribute('data-label')=='Toets'
                else:assert await prose.evaluate('(t)=>getComputedStyle(t).display')=='table'
                await page.evaluate("location.hash='voorraadtabel'")
                await page.locator('#voorraadtabel').wait_for(state='visible')
                stock=page.locator('#voorraadtabel .study-table[data-table-kind=stock]').first
                for label in ['Datum','Voorraad','Percentage','31-12-2024','31-12-2025','Toe-/afname']:
                    cell=stock.get_by_text(label,exact=True)
                    assert await cell.evaluate('(c)=>{const r=document.createRange();r.selectNodeContents(c);return r.getClientRects().length}')==1,(kind,width,label)
                    assert await cell.evaluate('(c)=>c.scrollWidth<=c.clientWidth+1'),(kind,width,label,'cell clipping')
                if width<=760:
                    assert await stock.evaluate('(t)=>t.rows[2].getBoundingClientRect().height')<48
                    wrapper=page.locator('#voorraadtabel .study-table-scroll[data-table-kind=stock]').first
                    assert await wrapper.evaluate('(w)=>w.scrollWidth>w.clientWidth')
                    await wrapper.evaluate('(w)=>w.scrollLeft=400')
                    assert await stock.locator('tbody th').first.evaluate('(c)=>getComputedStyle(c).position')=='sticky'
                    rowx=(await stock.locator('tbody th').first.bounding_box())['x']
                    wrapx=(await wrapper.bounding_box())['x'];assert abs(rowx-wrapx)<3
                    await wrapper.evaluate('(w)=>w.scrollLeft=0')
                results['checks'].append([kind,width,'words, dates, cell widths, horizontal scroll'])
            # Zoom/large type and expanded examples must not damage reading text.
            await page.set_viewport_size({'width':320,'height':800})
            await page.evaluate("document.body.style.setProperty('--reader-font','22px');location.hash='kwalificatie'")
            await page.locator('#kwalificatie').wait_for(state='visible')
            assert not await page.evaluate('document.documentElement.scrollWidth>innerWidth+1')
            await page.evaluate("document.body.style.setProperty('--reader-font','16px')")
            if not inline:
                await page.evaluate("location.hash='kernschema'")
                await page.locator('#kernel-form button').click()
                await page.wait_for_function("document.querySelector('#kernel-status').textContent.startsWith('Bijgewerkt')")
                assert await page.locator('#kernel-results table[data-table-kind=stock]').count()==2
                assert await page.locator('#kernel-results table[data-table-kind=journal]').count()>0
                assert '19.200' in await page.locator('#kernel-results').inner_text()
                results['dynamic_kernel']=True
            for topic in ['kwalificatie','voorraadtabel']:
                await page.set_viewport_size({'width':390,'height':844})
                await page.evaluate('(x)=>location.hash=x',topic)
                await page.locator('#'+topic).wait_for(state='visible')
                await page.locator('#'+topic+' .study-table-scroll').first.evaluate('(w)=>w.scrollIntoView({block:"start"})')
                await page.screenshot(path=str(OUT/f'{kind}-{topic}-390.png'))
            # Print layout and content keep real rows and columns.
            await page.emulate_media(media='print')
            assert await page.locator('#kwalificatie table').first.evaluate('(t)=>getComputedStyle(t).display')=='table'
            await context.close()
            if not inline:
                nojs=await browser.new_context(java_script_enabled=False,viewport={'width':390,'height':844})
                await nojs.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base) else r.abort())
                p=await nojs.new_page();await p.goto(base+'/samenvatting.html')
                assert await p.locator('#kwalificatie table').first.evaluate('(t)=>getComputedStyle(t).display')=='block'
                assert not await p.evaluate('document.documentElement.scrollWidth>innerWidth+1')
                await nojs.close()
            results['engines'].append(kind)
            await browser.close()
    server.shutdown()
    assert not results['page_errors'],results['page_errors']
    (OUT/'mobile-table-results.json').write_text(json.dumps(results,indent=2))
    print(json.dumps(results,indent=2))

if __name__=='__main__':asyncio.run(run())
