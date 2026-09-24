"""Calculator layout and regression checks. HTTP in CI; offline component checks do not claim cross-page coverage."""
from __future__ import annotations
import asyncio, functools, http.server, json, os, threading, runpy
from pathlib import Path
from playwright.async_api import async_playwright
ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('CAFA_CALCULATOR_OUTPUT', '/tmp/cafa2-calculator-review'))
OUT.mkdir(parents=True, exist_ok=True)
OFFLINE = os.environ.get('CAFA_OFFLINE_RENDER') == '1'
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_): pass
async def run():
    server = None
    if OFFLINE:
        base = ''
    else:
        server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT)))
        threading.Thread(target=server.serve_forever, daemon=True).start()
        base = f'http://127.0.0.1:{server.server_port}'
    report = {'mode': 'offline component checks (no cross-page coverage)' if OFFLINE else 'HTTP', 'browsers': {}}
    async with async_playwright() as pw:
        for name in os.environ.get('CAFA_BROWSERS', 'chromium,webkit').split(','):
            options = {'headless': True}
            if name == 'chromium' and os.environ.get('CAFA_CHROMIUM_PATH'):
                options['executable_path'] = os.environ['CAFA_CHROMIUM_PATH']
            browser = await getattr(pw, name).launch(**options)
            context = await browser.new_context(viewport={'width':1440, 'height':1000}, color_scheme='light')
            if not OFFLINE:
                await context.route('**/*', lambda r: r.continue_() if r.request.url.startswith(base) else r.abort())
            page = await context.new_page()
            page.set_default_timeout(10000)
            errors = []; checks = []
            page.on('pageerror', lambda e: errors.append(str(e)))
            async def visit(path):
                if OFFLINE:
                    helper = runpy.run_path(str(ROOT/'tests/study-refinement-browser.py'))
                    await page.set_content(helper['inlined_summary'](), wait_until='load')
                    await page.evaluate("id=>{document.querySelectorAll('section[data-view],article[data-view]').forEach(x=>x.hidden=x.id!==id);scrollTo(0,0)}", path.split('#')[-1])
                else:
                    await page.goto(base + '/' + path, wait_until='networkidle')
                await page.wait_for_function('!!window.CafaCalculator')
            async def key(k):
                await page.locator(f'[data-calc-key="{k}"]').click()
            try:
                await visit('samenvatting.html#kapitaalbelangen')
                await page.wait_for_selector('.reader-top-tools .calculator-toolbar-trigger')
                assert await page.locator('.calculator-fab').count() == 0
                await page.locator('.calculator-toolbar-trigger').click()
                assert await page.locator('#calculator-dialog').is_visible()
                assert await page.locator('dialog:modal').count() == 0
                assert await page.locator('#calculator-dialog').get_attribute('aria-modal') == 'false'
                rect = await page.locator('#calculator-dialog').bounding_box()
                header = await page.locator('.reader-topbar').bounding_box()
                assert rect['y'] >= header['y'] + header['height'] - 1
                assert rect['y'] < 140, rect
                assert await page.locator('.calc-keys button').all_text_contents() == ['7','8','9','÷','4','5','6','×','1','2','3','−','0','.','(',')','√','ln','exp','^','C','⌫','=','+']
                data = [['2+3*4',14], ['(2+3)*4',20], ['1,5+2.5',4], ['3740*(636-97185/165)',175780],
                        ['8^2',64], ['2^3^2',512], ['-2^2',-4], ['(-2)^2',4], ['2^-2',0.25],
                        ['sqrt(81)',9], ['ln(exp(2))',2], ['exp(0)',1], ['200*25%',50], ['1e3+2',1002], ['10×2÷4',5]]
                values = await page.evaluate('(ds)=>ds.map(([s])=>cafaCalculatorTest.evaluate(s))', data)
                for (_, expected), value in zip(data, values):
                    assert abs(expected-value) < 1e-9, (expected,value)
                invalid = ['1/0', 'sqrt(-1)', 'ln(0)', '2+', 'sqrt(4', 'alert(1)', '2;3', 'exp(9999)', '2**3']
                assert await page.evaluate('(xs)=>xs.every(x=>{try{cafaCalculatorTest.evaluate(x);return false}catch(e){return true}})', invalid)
                checks.append('SRA input/result/keypad layout, topbar opener, non-modal top-right position, arithmetic/function/invalid-input checks')
                field = page.locator('#calc-expression')
                await field.fill('8^2'); await field.press('Enter')
                assert await page.locator('.calc-history-value').last.inner_text() == '= 64'
                assert await field.input_value() == ''
                # Buttons must insert at the caret and replace selected input.
                await field.fill('1+2'); await field.evaluate('(x)=>{x.focus();x.setSelectionRange(2,3)}')
                await key('7'); await key('=')
                assert await field.input_value() == ''
                assert await page.locator('.calc-history-expression').last.inner_text() == '1+7'
                assert await page.locator('.calc-history-value').last.inner_text() == '= 8'
                await field.fill('1/0'); await field.press('Enter')
                assert await field.get_attribute('aria-invalid') == 'true'
                await field.fill('8^2'); await field.press('Enter')
                assert await field.get_attribute('aria-invalid') is None
                await page.locator('.calc-extra > summary').click(); await key('M+')
                assert (await page.evaluate('CafaCalculator.getState()'))['memory'] == 64
                await page.locator('.calc-extra > summary').click()
                await page.locator('#calculator-dialog').screenshot(path=str(OUT/(name+'-calculator.png')))
                for width in [320,390,430,760,1440]:
                    await page.set_viewport_size({'width':width,'height':740})
                    for mode in ['light','dark']:
                        await page.evaluate('(m)=>CafaTheme.setMode(m)',mode)
                        await page.wait_for_timeout(50)
                        r=await page.locator('#calculator-dialog').bounding_box()
                        assert r['x']>=0 and r['x']+r['width']<=width+1 and r['y']>=0 and r['y']+r['height']<=741,(width,mode,r)
                        assert not await page.evaluate('document.documentElement.scrollWidth>innerWidth+1'),(width,mode)
                        if width in [390,1440]:
                            await page.screenshot(path=str(OUT/f'{name}-{width}-{mode}.png'))
                await page.set_viewport_size({'width':1440,'height':1000})
                handle = page.locator('.calculator-handle')
                await handle.focus(); r1 = await page.locator('#calculator-dialog').bounding_box()
                await page.keyboard.press('ArrowRight'); r2 = await page.locator('#calculator-dialog').bounding_box()
                assert r2['x'] > r1['x']
                await page.locator('[data-calc-minimize]').click()
                assert not await page.locator('.calculator-float-body').is_visible()
                await page.locator('[data-calc-close]').click()
                assert await page.locator('.calculator-toolbar-trigger').get_attribute('aria-expanded') == 'false'
                await page.locator('.calculator-toolbar-trigger').click()
                assert await page.locator('.calculator-float-body').is_visible()
                assert await page.locator('.calc-history-value').last.inner_text() == '= 64'
                await page.locator('[data-calc-close]').click()
                checks.append('Typed formula and Enter, caret insertion, error recovery, memory, light/dark mobile bounds, moving, collapse/close/reopen')
                if not OFFLINE:
                    await visit('index.html#kap-12')
                    await page.wait_for_function('!!window.CafaPractice&&!!window.CafaFeedback&&!document.documentElement.classList.contains("cafa-starting")')
                    assert await page.locator('.top-controls .calculator-toolbar-trigger').count()==1
                    assert await page.locator('.calculator-fab').count()==0
                    await page.locator('label[for="a-kap-12-0"]').click()
                    await page.locator('.calculator-toolbar-trigger').click()
                    assert await page.locator('.calc-history-value').last.inner_text()=='= 64'
                    assert (await page.evaluate('CafaCalculator.getState()'))['memory']==64
                    # The page remains editable, and typed answers outside the calculator are not intercepted.
                    await page.evaluate("var x=document.createElement('textarea');x.id='answer-isolation';document.body.prepend(x);x.focus()")
                    await page.keyboard.type('123+4')
                    assert await page.locator('#answer-isolation').input_value()=='123+4'
                    assert await page.locator('.calc-history-value').last.inner_text()=='= 64'
                    await page.locator('#answer-isolation').evaluate('(x)=>x.remove()')
                    await page.locator('[data-calc-close]').click()
                    await page.reload(wait_until='networkidle');await page.wait_for_function('!!window.CafaCalculator&&!!window.CafaPractice')
                    assert await page.locator('#a-kap-12-0').is_checked()
                    checks.append('Same-tab cross-page result/memory preservation, practice answer retention and keyboard isolation')
                assert not errors,errors
                report['browsers'][name]={'passed':checks,'errors':errors}
            except Exception as e:
                import traceback
                report['failure']={'browser':name,'error':str(e),'traceback':traceback.format_exc(),'passed':checks,'pageerrors':errors}
                raise
            finally:
                (OUT/'results.json').write_text(json.dumps(report,indent=2))
                await context.close();await browser.close()
    if server:server.shutdown()
    print(json.dumps(report,indent=2))
if __name__=='__main__':asyncio.run(run())
