import fs from 'node:fs';
const p='tests/reader-browser.py';let s=fs.readFileSync(p,'utf8');
if(!s.includes("report['practice_questions']"))s=s.replace("            report['browsers'].append(kind)",`            if kind=='chromium':
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
            report['browsers'].append(kind)`);
fs.writeFileSync(p,s);
fs.writeFileSync('tests/revision-browser.py',`"""Current browser regression suite; includes all practice routes and the new reader."""
from pathlib import Path
import runpy
if __name__ == '__main__':
    runpy.run_path(str(Path(__file__).with_name('reader-browser.py')), run_name='__main__')
`);
