"""Real CAFA2 interface with a mocked service. Run after prepare --apply and build."""
import functools, http.server, json, os, threading, time
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[2]/'dist'
OUT=Path(os.environ.get('ASSISTANT_QA_OUT','/tmp/cafa2-assistant-browser'));OUT.mkdir(parents=True,exist_ok=True)
checks=[];requests=[];errors=[]
state={'ready':True,'authenticated':False,'fail':False,'delay_once':False}
delayed_release=threading.Event()

def mock_reply(data, answer='**Technische testreactie, geen modelantwoord.**\n\n| Kolom | Bedrag |\n| --- | --- |\n| Test | 100 |\n<img src=x onerror="alert(1)">'):
    return {'questionKey':':'.join(data['ref'][k] for k in ['course','kind','bankId','questionId']),
            'mode':data['mode'],'answer':answer,'citations':[],'references':[],'incomplete':False}

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
    def do_POST(self):
        if self.path!='/api/study-chat':self.send_error(404);return
        try:
            data=json.loads(self.rfile.read(int(self.headers['Content-Length'])))
            if not delayed_release.wait(15):self.send_error(504);return
            body=json.dumps(mock_reply(data,'DELAYED_REPLY: hoort alleen bij de oude vraag.')).encode()
            self.send_response(200);self.send_header('Content-Type','application/json')
            self.send_header('Content-Length',str(len(body)));self.end_headers();self.wfile.write(body)
        except (BrokenPipeError,ConnectionResetError,ConnectionAbortedError):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}'
def check(label,value):
    assert value,label
    checks.append(label);print('PASS',label,flush=True)
try:
  with sync_playwright() as p:
    executable=os.environ.get('CHROMIUM_PATH')
    engine=os.environ.get('ASSISTANT_BROWSER','chromium').lower()
    if engine not in ('chromium','webkit'):raise ValueError('ASSISTANT_BROWSER must be chromium or webkit')
    browser_type=getattr(p,engine)
    browser=browser_type.launch(headless=True,**({'executable_path':executable} if executable and engine=='chromium' else {}),
                                **({'args':['--no-sandbox']} if engine=='chromium' else {}))
    page=browser.new_page(viewport={'width':1366,'height':950});page.set_default_timeout(12000)
    page.on('pageerror',lambda e:errors.append(str(e)))
    def route(r):
      if not r.request.url.startswith(base): r.abort();return
      if '/api/study-' not in r.request.url: r.continue_();return
      action=r.request.url.split('/')[-1]
      if action=='study-status':r.fulfill(json={'ready':state['ready'],'authenticated':state['authenticated'],'course':'CAFA2','knowledge':{'theoryFiles':False,'reviewFiles':False}});return
      if action=='study-auth':state['authenticated']=True;r.fulfill(json={'ok':True});return
      if action=='study-logout':state['authenticated']=False;r.fulfill(json={'ok':True});return
      data=r.request.post_data_json;requests.append(data)
      if state['fail']:r.fulfill(status=503,json={'error':'Gesimuleerde serverfout.'});return
      if state['delay_once']:
        state['delay_once']=False;r.continue_();return
      r.fulfill(json=mock_reply(data))
    page.route('**/*',route)
    page.goto(base+'/index.html#kap-1')
    page.wait_for_function('window.CafaExams && window.StudyAssistant && !document.querySelector(".study-assistant-launch").hidden')
    page.locator('.study-assistant-launch').click();page.locator('[data-login]').wait_for(state='visible')
    check('No request before consent and login',page.locator('[data-send]').is_disabled() and not requests)
    page.locator('#study-code').fill('mock-test-code');page.locator('[data-login] button').click();page.locator('[data-login]').wait_for(state='hidden')
    page.locator('[data-consent-check]').check()
    def send(text):
      before=len(requests);page.locator('#study-message').fill(text);page.locator('[data-send]').click()
      page.wait_for_function('document.querySelector("[data-action=stop]").hidden')
      assert len(requests)==before+1
    def visit(route):
      page.evaluate('(route) => { location.hash=route; }',route)
      page.wait_for_function('(route) => location.hash===route',arg=route)
    def ensure_open():
      if not page.locator('#study-assistant').evaluate('(e)=>e.open'):
        page.locator('.study-assistant-launch').click()
        page.locator('#study-assistant').wait_for(state='visible')
    def close_panel():
      if page.locator('#study-assistant').evaluate('(e)=>e.open'):
        page.locator('#study-assistant [data-action=close]').click()
        page.wait_for_function('!document.querySelector("#study-assistant").open')
    def current_ref(bank,question,kind):
      page.wait_for_function('!document.querySelector(".study-assistant-launch").hidden')
      ensure_open();send('Toon de actuele vraagcontext.')
      check(f'{kind} {bank} {question} uses its own question',requests[-1]['ref']=={'course':'CAFA2','kind':kind,'bankId':bank,'questionId':str(question)})
    storage=page.evaluate('JSON.stringify({...localStorage})')
    send('Hoe begin ik?')
    check('Current real practice question sent in hint style',requests[-1]['ref']['questionId']=='1' and requests[-1]['mode']=='hint')
    check('Safe table rendering without executable HTML',page.locator('.study-messages table').count()==1 and page.locator('.study-messages img').count()==0)
    send('Waarom is B goed?')
    check('Answer question in hint style is transmitted without forced switching',requests[-1]['mode']=='hint' and requests[-1]['history'][0]['content']=='Hoe begin ik?')
    before=len(requests);page.locator('[data-answer-prompt]').click();page.wait_for_function('document.querySelector("[data-action=stop]").hidden')
    check('One-click answer request works without checking or submitting exam',len(requests)==before+1 and requests[-1]['message'].startswith('Geef het antwoord'))
    page.locator('[data-mode]').select_option('review');send('Licht stap 2 toe.')
    check('Same-question conversation survives style changes',any(m['content']=='Hoe begin ik?' for m in requests[-1]['history']))
    check('Assistant leaves stored answers and scores unchanged',page.evaluate('JSON.stringify({...localStorage})')==storage)
    page.screenshot(path=str(OUT/f'desktop-{engine}.png'))
    page.evaluate("location.hash='kap-2'");page.wait_for_function('document.querySelector("[data-context-title]").textContent.includes("Vraag 2")')
    check('Question navigation isolates chat history',page.locator('.study-message').count()==0)
    send('Geef het antwoord.');check('New question uses its own context',requests[-1]['ref']['questionId']=='2' and requests[-1]['history']==[])
    state['fail']=True;send('Leg dit uit.')
    check('Failure preserves the question for retry',page.locator('#study-message').input_value()=='Leg dit uit.')
    state['fail']=False
    # Every main practice bank is reached through the real hash router.
    for code in ('kap','val','nvw','hk'):
      visit('#'+code+'-1');current_ref(code,'1','practice')
    type_samples=page.evaluate('''() => { const seen=new Map();
      for(const [code,bank] of Object.entries(CAFA2_DATA.modules))
        for(const q of bank.questions)if(!seen.has(q.type))seen.set(q.type,{type:q.type,code,id:q.id});
      return [...seen.values()]; }''')
    check('All twelve named practice question types are present',len(type_samples)==12)
    for sample in type_samples:
      visit('#'+sample['code']+'-'+str(sample['id']))
      current_ref(sample['code'],sample['id'],'practice')
      check(f'Practice type {sample["type"]} opens in its actual route',
            page.evaluate('''([code,id])=>document.querySelector('#'+code+'-'+id)?.querySelector('.type-label')?.textContent.trim()''',
                          [sample['code'],str(sample['id'])])==sample['type'])
    visit('#kap-1');page.wait_for_function('document.querySelector("[data-context-title]").textContent.includes("Vraag 1")')
    page.locator('#option-kap-1-1').click()
    before=page.evaluate('JSON.stringify(CafaPractice.getAnswer("kap",1))')
    send('Licht mijn gekozen optie toe.')
    check('Practice choice B reaches the model as zero-based index 1',requests[-1]['studentAnswer']['choice']==1)
    check('Practice answer remains unchanged after assistant reply',page.evaluate('JSON.stringify(CafaPractice.getAnswer("kap",1))')==before)
    page.locator('label[for="own-kap-1"]').click()
    page.locator('#kap-1 .cae-content').fill('Mijn eigen berekening: 125.000 euro.')
    send('Vergelijk mijn eigen antwoord.')
    check('Current own text is sent from the practice editor','125.000' in requests[-1]['studentAnswer']['text'])
    journal_id=page.evaluate('document.querySelector(".question .entry-table")?.closest(".question")?.dataset.q')
    check('Real practice journal editor exists',bool(journal_id))
    visit('#kap-'+journal_id);page.wait_for_function('document.querySelector("[data-context-title]").textContent.includes("Vraag '+journal_id+'")')
    page.locator('label[for="own-kap-'+journal_id+'"]').click()
    page.locator('#kap-'+journal_id+' .entry-table tbody tr:first-child input').nth(0).fill('Deelneming')
    page.locator('#kap-'+journal_id+' .entry-table tbody tr:first-child input').nth(1).fill('125000')
    send('Controleer mijn journaalpost.')
    check('Practice journal row and debit amount reach the model',requests[-1]['studentAnswer']['rows'][0][:2]==['Deelneming','125000'])

    # Topic selection reuses a real question but keeps a distinct conversation.
    topic=page.evaluate('''() => CafaTopics.topics.find(t=>t.questions.includes('kap-1'))''')
    check('A real topic route contains the answered practice question',bool(topic))
    close_panel()
    page.evaluate('(id)=>{location.hash="#onderwerp-"+id}',topic['id'])
    page.wait_for_function('(uid)=>location.hash==="#"+uid',arg=topic['questions'][0])
    page.wait_for_function('(id)=>CafaTopics.getState().active===id',arg=topic['id'])
    target=topic['questions'][0].split('-')
    current_ref(target[0],target[1],'practice')
    check('Topic selection separates conversation from the ordinary part',requests[-1]['history']==[])
    close_panel();visit('#oefenen')
    page.locator('[data-topic-reset="'+topic['id']+'"]').wait_for(state='visible')
    page.once('dialog',lambda dialog:dialog.accept())
    with page.expect_navigation(wait_until='load'):
      page.locator('[data-topic-reset="'+topic['id']+'"]').click()
    page.wait_for_function('''(uid)=>performance.getEntriesByType('navigation').at(-1)?.type==='reload'
      && window.CafaTopics && window.CafaPractice && location.hash==='#'+uid''',arg=topic['questions'][0])
    check('Topic reset clears the selected practice answer',page.evaluate('CafaPractice.getAnswer("kap",1).choice') is None)

    # A completed MC attempt is seeded in browser storage from a real question bank.
    # This tests the historic read-only route without changing application code.
    close_panel()
    page.evaluate('''() => { const s=cafaAppTest.getState(),m=s.modules.kap;
      m.history.push({at:new Date().toISOString(),attempt:1,finished:true,finishedAt:new Date().toISOString(),
        questionCount:CAFA2_DATA.modules.kap.questions.length,answers:{1:{choice:1,mode:'mc',text:'Oude poging'}}});
      m.attempt=2;localStorage.setItem(s.id,JSON.stringify(s)); }''')
    page.reload();page.wait_for_function('window.CafaExams && window.StudyAssistant')
    visit('#mc-inzage/practice-kap-1')
    page.wait_for_function('document.querySelectorAll("#exam-app .study-inline-launch").length > 1')
    page.locator('#exam-app .study-inline-launch').nth(0).click()
    page.wait_for_function('document.querySelector("[data-context-title]").textContent.includes("Vraag 1")')
    page.locator('[data-consent-check]').check()
    send('Leg mijn eerdere keuze uit.')
    check('Historical MC inline action uses archived answer',requests[-1]['studentAnswer']['choice']==1 and requests[-1]['ref']['questionId']=='1')
    close_panel();page.locator('#exam-app .study-inline-launch').nth(1).click()
    page.wait_for_function('document.querySelector("[data-context-title]").textContent.includes("Vraag 2")')
    check('Reopening from another historic question changes context and conversation',page.locator('.study-message').count()==0)
    close_panel();page.locator('#exam-app .study-inline-launch').nth(0).click()
    page.wait_for_function('document.querySelector("[data-context-title]").textContent.includes("Vraag 1")')
    check('Reopening the same historic question restores its conversation',page.locator('.study-message.is-assistant').count()==1)
    close_panel()

    catalog=page.evaluate('CafaExams.catalog.map(e=>({id:e.id,first:e.questions[0].id, count:e.questions.length}))')
    check('All five real full exams are loaded',len(catalog)==5)
    exam_attempts={}
    for item in catalog:
      visit('#welkom/'+item['id']);page.locator('[data-exam-untimed]').check()
      page.locator('[data-exam-action="start"]').click()
      page.wait_for_function('location.hash.startsWith("#tentamen/")')
      attempt=page.evaluate('CafaExams.getAttempts().at(-1)')
      exam_attempts[item['id']]=attempt['id']
      current_ref(item['id'],item['first'],'exam')
      check(f'Full exam {item["id"]} retains its question count',len(attempt['exam']['questions'])==item['count'])
      close_panel()
    first=catalog[0]['id'];attempt_id=exam_attempts[first]
    visit('#tentamen/'+attempt_id)
    page.wait_for_function('document.querySelector("[data-exam-answer] .cae-content")')
    page.locator('[data-exam-answer] .cae-content').fill('Mijn tentamenantwoord: 123.456 euro.')
    page.wait_for_function('CafaExams.getAttempts().find(a=>a.id===location.hash.slice(10))?.answers["vraag-1"]?.html?.includes("123.456")')
    saved_exam=page.evaluate('localStorage.getItem(CafaExams.storageKey)')
    ensure_open();send('Vergelijk mijn eigen antwoord met het model.')
    check('Current full-exam rich answer reaches the model','123.456' in requests[-1]['studentAnswer']['text'])
    check('Assistant does not change saved full-exam answers or scores',page.evaluate('localStorage.getItem(CafaExams.storageKey)')==saved_exam)
    page.locator('[data-exam-action="check"]').click()
    check('Inline answer feedback remains available beside assistant',page.locator('#cafa-exam-feedback').is_visible() and page.locator('#study-assistant').evaluate('(e)=>e.open'))
    close_panel()
    page.locator('#cafa-exam-feedback .study-inline-launch').wait_for(state='visible')
    page.locator('#cafa-exam-feedback .study-inline-launch').click()
    check('Inline answer window opens the same full-exam conversation',
          page.locator('.study-message.is-assistant').count()>=1 and
          page.locator('[data-context-title]').inner_text().endswith('Vraag 1'))
    close_panel()

    def move_exam(question_id):
      idx=page.evaluate('([id,q])=>CafaExams.getAttempts().find(a=>a.id===id).exam.questions.findIndex(x=>x.id===q)',[attempt_id,question_id])
      assert idx>=0,(attempt_id,question_id)
      page.evaluate('([id,i])=>CafaExams.restorePosition(id,i)',[attempt_id,idx])
      page.wait_for_function('(i)=>CafaExams.getPosition()?.index===i',arg=idx)
      page.wait_for_timeout(140)
      return idx
    journal_q=page.evaluate('''id => { const a=CafaExams.getAttempts().find(x=>x.id===id);
      return a.exam.questions.find(q=>CafaJournalTable.supports(q))?.id; }''',attempt_id)
    stock_q=page.evaluate('''id => { const a=CafaExams.getAttempts().find(x=>x.id===id);
      return a.exam.questions.find(q=>CafaStockTable.template(q))?.id; }''',attempt_id)
    check('Full exam has actual journal and stock table questions',bool(journal_q and stock_q))
    move_exam(journal_q)
    page.locator('[data-journal-row="0"][data-journal-col="0"]').fill('Deelnemingen')
    page.locator('[data-journal-row="0"][data-journal-col="1"]').fill('84000')
    ensure_open();send('Controleer deze journaalpost.')
    check('Full-exam journal columns are sent in order',requests[-1]['studentAnswer']['rows'][0][:2]==['Deelnemingen','84000'])
    close_panel();move_exam(stock_q)
    stock_cell=page.locator('[data-stock-cell]').first
    stock_key=stock_cell.get_attribute('data-stock-cell');stock_cell.fill('37,5%')
    ensure_open();send('Leg mijn voorraadtabel uit.')
    check('Full-exam stock cell and percentage reach the model',requests[-1]['studentAnswer']['tables'][0]['cells'][stock_key]=='37,5%')
    close_panel()

    # A response is held in the local HTTP mock while the learner changes question
    # without changing the #tentamen/<attempt> hash.
    move_exam('vraag-1');ensure_open();before=len(requests)
    state['delay_once']=True;page.locator('#study-message').fill('Vertraagde vraag over vraag 1.')
    page.locator('[data-send]').click()
    page.wait_for_function('!document.querySelector("[data-action=stop]").hidden')
    check('Delayed request started for original full-exam question',len(requests)==before+1 and requests[-1]['ref']['questionId']=='vraag-1')
    move_exam('vraag-2')
    page.wait_for_function('document.querySelector("[data-context-title]").textContent.includes("Vraag 2")')
    delayed_release.set();time.sleep(.25)
    check('Delayed reply does not appear on another question',not page.locator('.study-messages').inner_text().find('DELAYED_REPLY')>=0)
    check('Same-exam question switch clears old conversation',page.locator('.study-message').count()==0)
    send('Vraag 2 krijgt eigen uitleg.')
    check('New full-exam question has separate history',requests[-1]['ref']['questionId']=='vraag-2' and requests[-1]['history']==[])
    close_panel()

    # Complete one real exam through its confirmation dialog and inspect both
    # the summary and individual answer-model route.
    page.locator('[data-exam-action="submit"]').click()
    page.locator('[data-exam-confirm-submit]').click()
    page.wait_for_function('(id)=>location.hash==="#inzage/"+id',arg=attempt_id)
    page.wait_for_function('document.querySelectorAll("#exam-app .study-inline-launch").length>0')
    page.locator('#exam-app details[data-result-id]').first.locator('summary').click()
    page.locator('#exam-app details[open] .study-inline-launch').first.click()
    page.wait_for_function('document.querySelector("[data-context-title]").textContent.includes("Vraag 1")')
    send('Waar komt het bedrag uit het antwoordmodel vandaan?')
    check('Completed exam overview inline action pins first result question',requests[-1]['ref']['questionId']=='vraag-1')
    close_panel();visit('#inzage/'+attempt_id+'/vraag/0')
    current_ref(first,'vraag-1','exam')
    page.locator('[data-exam-action="review-question"][data-index="1"]').click()
    page.wait_for_function('location.hash.endsWith("/vraag/1")')
    send('Licht de volgende vraag toe.')
    check('Individual review navigation updates question and keeps its own history',
          requests[-1]['ref']['questionId']=='vraag-2' and
          any(m['content']=='Vraag 2 krijgt eigen uitleg.' for m in requests[-1]['history']))
    close_panel()

    # The demonstration exam supplies the multiple-choice option-id editor.
    visit('#welkom/demo-omgeving')
    page.locator('[data-exam-action="start"]').click()
    demo_id=page.evaluate('CafaExams.getAttempts().at(-1).id')
    page.evaluate('([id,i])=>CafaExams.restorePosition(id,i)',[demo_id,2])
    page.locator('input[name="exam-answer"]').first.check()
    timer_before=page.evaluate('''id=>{const a=CafaExams.getAttempts().find(x=>x.id===id);
      return JSON.stringify({startedAt:a.startedAt,deadlineAt:a.deadlineAt,pausedAt:a.pausedAt,
        pausedSeconds:a.pausedSeconds,status:a.status,answers:a.answers,scores:a.scores});}''',demo_id)
    ensure_open();send('Waarom is deze optie goed?')
    check('Demo MC uses stable option ID, not practice choice index',requests[-1]['studentAnswer']['optionId']=='door' and requests[-1]['ref']['questionId']=='navigatie')
    check('Assistant does not change a running exam timer, answer, or score',page.evaluate('''id=>{const a=CafaExams.getAttempts().find(x=>x.id===id);
      return JSON.stringify({startedAt:a.startedAt,deadlineAt:a.deadlineAt,pausedAt:a.pausedAt,
        pausedSeconds:a.pausedSeconds,status:a.status,answers:a.answers,scores:a.scores});}''',demo_id)==timer_before)
    close_panel()
    def launcher_overlap():
      return page.evaluate('''() => {const a=document.querySelector('.study-assistant-launch').getBoundingClientRect();
        const buttons=[...document.querySelectorAll('#exam-app .exam-footer button')];
        return {launcher:{x:a.x,y:a.y,width:a.width,height:a.height},
          conflicts:buttons.map(b=>{const r=b.getBoundingClientRect();return {text:b.textContent.trim(),
            area:Math.max(0,Math.min(a.right,r.right)-Math.max(a.left,r.left)) *
                 Math.max(0,Math.min(a.bottom,r.bottom)-Math.max(a.top,r.top))};}).filter(x=>x.area>0)};}''')
    layout_results=[]
    for width,height in [(390,844),(320,740),(430,932),(740,390)]:
      page.set_viewport_size({'width':width,'height':height});page.wait_for_timeout(200)
      overlap=launcher_overlap();layout_results.append({'width':width,'height':height,**overlap})
      check(f'Exam launcher avoids fixed buttons at {width}x{height}',
            not overlap['conflicts'] and overlap['launcher']['y']>=0 and
            overlap['launcher']['y']+overlap['launcher']['height']<=height+1)
      ensure_open();rect=page.locator('#study-assistant').bounding_box()
      check(f'Mobile pane fits {width}x{height}',rect['x']>=-1 and rect['x']+rect['width']<=width+1 and rect['y']+rect['height']<=height+1)
    page.set_viewport_size({'width':390,'height':400});page.locator('#study-message').focus();page.wait_for_timeout(150)
    compose=page.locator('.study-compose').bounding_box()
    check('Composer remains visible with a simulated short keyboard viewport',compose['y']>=0 and compose['y']+compose['height']<=401)
    page.set_viewport_size({'width':390,'height':844})
    page.evaluate("CafaTheme.setMode('dark')")
    page.wait_for_timeout(100)
    check('Actual CAFA2 dark-mode control styles chat',page.locator('#study-assistant').evaluate("e=>getComputedStyle(e).getPropertyValue('--sa-bg').trim()")=='#201d2b')
    page.screenshot(path=str(OUT/f'mobile-dark-{engine}.png'))
    page.evaluate("CafaTheme.setMode('light')")
    check('Actual CAFA2 light-mode control restores chat colors',page.locator('#study-assistant').evaluate("e=>getComputedStyle(e).getPropertyValue('--sa-bg').trim()")=='#fff')
    close_panel();page.locator('[data-calc]').click()
    page.locator('#calc-expression').fill('1+2');page.locator('#calc-expression').press('Enter')
    check('Calculator history works before opening assistant',page.locator('.calc-history-list li').count()>=1)
    page.locator('#calculator-dialog .study-calculator-launch').wait_for(state='visible')
    check('Open calculator exposes a dedicated assistant button',not page.locator('.study-assistant-launch').is_visible())
    page.locator('#calculator-dialog .study-calculator-launch').click()
    page.wait_for_function('document.querySelector("#study-assistant").open')
    check('Assistant composer remains on top with calculator open',page.locator('#study-message').evaluate('''e=>{const r=e.getBoundingClientRect();return document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)===e;}'''))
    close_panel()
    check('Calculator history survives assistant open and close',page.locator('.calc-history-list li').count()>=1)
    page.set_viewport_size({'width':1366,'height':950})
    page.locator('#calculator-dialog .study-calculator-launch').click()
    check('Desktop assistant opens modally above the calculator',page.locator('#study-assistant').evaluate('(e)=>e.open && e.matches(":modal")'))
    close_panel();page.locator('#calculator-dialog [data-calc-close]').click()
    check('Closing calculator restores the floating assistant launcher',page.locator('.study-assistant-launch').is_visible())
    check('No JavaScript runtime exceptions',not errors)
    (OUT/f'report-{engine}.json').write_text(json.dumps({'passed':True,'engine':engine,'checks':checks,'errors':errors,
       'layout':layout_results,'realQuestions':True,'mockService':True,'realApiCalls':0,
       'keyboard':'short viewport simulation, no physical keyboard'},ensure_ascii=False,indent=2))
    browser.close()
finally:server.shutdown()
