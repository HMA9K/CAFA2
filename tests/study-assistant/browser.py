"""Real CAFA2 interface with a mocked service. Run after prepare --apply and build."""
import functools, http.server, json, os, threading, time
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[2]/'dist'
OUT=Path(os.environ.get('ASSISTANT_QA_OUT','/tmp/cafa2-assistant-browser'));OUT.mkdir(parents=True,exist_ok=True)
REVIEW_PROMPT='Kijk mijn ingevulde antwoord na aan de hand van de uitwerking. Geef aan wat klopt, welke fouten of ontbrekende stappen er zijn en hoe ik die kan verbeteren. Geef ook aan hoeveel punten mijn antwoord verdient.'
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
    page=browser.new_page(viewport={'width':1366,'height':950});page.set_default_timeout(int(os.environ.get('ASSISTANT_QA_TIMEOUT_MS','12000')))
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
      if data['message']=='Proeftabel zonder scheidingsregel':
        r.fulfill(json=mock_reply(data,'Rekening | Debet | Credit\nDeelneming | 540.000 |\nAgio | | 280.000\n\nStap | Berekening | Uitkomst\n1 | 2 × 3 | 6\n\nGewone tekst | blijft tekst'));return
      r.fulfill(json=mock_reply(data,'Berekening: '+ 'stap '*1500+'Goodwill = 99.000.') if data['message']=='Test lange uitwerking' else mock_reply(data))
    page.route('**/*',route)
    page.goto(base+'/index.html#kap-1')
    page.wait_for_function('window.CafaExams && window.StudyAssistant && !document.querySelector(".study-assistant-launch").hidden')
    page.locator('.study-assistant-launch').click();page.locator('[data-login]').wait_for(state='visible')
    check('No request before consent and login',page.locator('[data-send]').is_disabled() and not requests)
    page.get_by_role('button',name='Kijk mijn antwoord na',exact=True).click()
    check('Review button does not send before login and consent',not requests and page.locator('#study-message').input_value()==REVIEW_PROMPT)
    page.locator('#study-code').fill('mock-test-code');page.wait_for_timeout(120)
    check('Opening a reserved column keeps the login form and typed input stable',page.locator('#study-code').input_value()=='mock-test-code' and page.locator('.study-assistant-layout').count()==1)
    check('The open column hides its launcher so it cannot cover the input controls',not page.locator('.study-assistant-launch').is_visible())
    page.locator('[data-login] button').click();page.locator('[data-login]').wait_for(state='hidden')
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
        page.wait_for_function('!document.querySelector(".study-assistant-layout")')
    def current_ref(bank,question,kind):
      page.wait_for_function('document.querySelector("#study-assistant").open || !document.querySelector(".study-assistant-launch").hidden')
      if kind=='practice':
        page.wait_for_function('''([bank,q]) => document.querySelector('[data-context-title]').textContent===CAFA2_DATA.modules[bank].title+' · Vraag '+q''',arg=[bank,str(question)])
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
    send('Test lange uitwerking');send('Waar komt die 99.000 vandaan?')
    check('Long previous calculation survives in follow-up context',any(len(m['content'])>6000 and m['content'].endswith('Goodwill = 99.000.') for m in requests[-1]['history']))
    send('Proeftabel zonder scheidingsregel')
    last=page.locator('.study-message').last
    check('Real-model table shape without separators renders as accessible tables',last.locator('table').count()==2 and last.locator('th[scope=col]').count()==6)
    check('Empty debit/credit cells keep their columns and pipe prose stays text',last.locator('table').first.locator('tbody tr').first.locator('td').all_text_contents()==['Deelneming','540.000',''] and last.locator('p').last.inner_text()=='Gewone tekst | blijft tekst')
    page.evaluate("location.hash='kap-2'");page.wait_for_function('document.querySelector("[data-context-title]")?.textContent?.includes("Vraag 2")')
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
    expected_types={'Theorie','Rekenvraag','Journaalpost','Berekening','Methodekeuze','Vergelijking','Herkenning','Foutdiagnose','Afweging','Begrip','Controleberekening','Voorraadtabel'}
    check('All original practice question types remain present alongside new exam types',expected_types <= {sample['type'] for sample in type_samples})
    for sample in type_samples:
      visit('#'+sample['code']+'-'+str(sample['id']))
      current_ref(sample['code'],sample['id'],'practice')
      check(f'Practice type {sample["type"]} opens in its actual route',
            page.evaluate('''([code,id])=>document.querySelector('#'+code+'-'+id)?.querySelector('.type-label')?.textContent.trim()''',
                          [sample['code'],str(sample['id'])])==sample['type'])
      if sample['type']=='Voorraadtabel':
        check('Practice case and question share the primary column beside the assistant',page.locator('.question:target .study-assistant-layout>.practice-case-layout').count()==1)
    visit('#kap-1');page.wait_for_function('document.querySelector("[data-context-title]")?.textContent?.includes("Vraag 1")')
    page.locator('#option-kap-1-1').click()
    before=page.evaluate('JSON.stringify(CafaPractice.getAnswer("kap",1))')
    send('Licht mijn gekozen optie toe.')
    check('Practice choice B reaches the model as zero-based index 1',requests[-1]['studentAnswer']['choice']==1)
    review_before=len(requests);page.get_by_role('button',name='Kijk mijn antwoord na',exact=True).click();page.wait_for_timeout(250)
    check('Review button drafts the complete points request without sending after login and consent',len(requests)==review_before and page.locator('#study-message').input_value()==REVIEW_PROMPT)
    check('Review prompt is focused and can be sent manually',page.locator('#study-message').evaluate('e=>e===document.activeElement') and page.locator('[data-send]').is_enabled())
    edited_review=REVIEW_PROMPT+' Licht de puntenverdeling toe.'
    page.locator('#study-message').fill(edited_review);page.locator('[data-send]').click();page.wait_for_function('document.querySelector("[data-action=stop]").hidden')
    check('Manual send keeps the edited review request and current answer',len(requests)==review_before+1 and requests[-1]['message']==edited_review and requests[-1]['studentAnswer']['choice']==1)
    check('Practice answer remains unchanged after assistant reply',page.evaluate('JSON.stringify(CafaPractice.getAnswer("kap",1))')==before)
    page.locator('label[for="own-kap-1"]').click()
    page.locator('#kap-1 .cae-content').fill('Mijn eigen berekening: 125.000 euro.')
    send('Vergelijk mijn eigen antwoord.')
    check('Current own text is sent from the practice editor','125.000' in requests[-1]['studentAnswer']['text'])
    journal_id=page.evaluate('String(CAFA2_DATA.modules.kap.questions.find(q=>q.type==="Journaalpost").id)')
    check('Real practice journal editor exists',bool(journal_id))
    visit('#kap-'+journal_id);page.wait_for_function('document.querySelector("[data-context-title]")?.textContent?.includes("Vraag '+journal_id+'")')
    page.locator('label[for="own-kap-'+journal_id+'"]').click()
    page.locator('#kap-'+journal_id+' [data-journal-row="0"][data-journal-col="0"]').fill('Deelneming')
    page.locator('#kap-'+journal_id+' [data-journal-row="0"][data-journal-col="1"]').fill('125000')
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
    page.wait_for_function('document.querySelector("[data-context-title]")?.textContent?.includes("Vraag 1")')
    page.locator('[data-consent-check]').check()
    send('Leg mijn eerdere keuze uit.')
    check('Historical MC inline action uses archived answer',requests[-1]['studentAnswer']['choice']==1 and requests[-1]['ref']['questionId']=='1')
    close_panel();page.locator('#exam-app .study-inline-launch').nth(1).click()
    page.wait_for_function('document.querySelector("[data-context-title]")?.textContent?.includes("Vraag 2")')
    check('Reopening from another historic question changes context and conversation',page.locator('.study-message').count()==0)
    close_panel();page.locator('#exam-app .study-inline-launch').nth(0).click()
    page.wait_for_function('document.querySelector("[data-context-title]")?.textContent?.includes("Vraag 1")')
    check('Reopening the same historic question restores its conversation',page.locator('.study-message.is-assistant').count()==1)
    close_panel()

    catalog=page.evaluate('CafaExams.catalog.map(e=>({id:e.id,first:e.questions[0].id, count:e.questions.length}))')
    check('All eleven real full exams are loaded',len(catalog)==11)
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
    page.wait_for_timeout(100)
    case_boxes=page.evaluate('''()=>Object.fromEntries([['case','#exam-case-panel'],['question','.exam-question-body'],['assistant','#study-assistant'],['footer','.exam-footer'],['head','.exam-work-head']].map(([key,selector])=>[key,document.querySelector(selector).getBoundingClientRect().toJSON()]))''')
    check('Full exam has case left, question middle and assistant right',case_boxes['case']['right']<=case_boxes['question']['x'] and case_boxes['question']['right']<=case_boxes['assistant']['x'] and case_boxes['question']['width']>=300)
    check('Full-exam dock avoids the heading and all footer controls',case_boxes['assistant']['y']>=case_boxes['head']['bottom']-1 and case_boxes['assistant']['bottom']<=case_boxes['footer']['y']+1)
    case_scroll=page.locator('#exam-case-panel').evaluate('e=>{e.scrollTop=90;return e.scrollTop}')
    case_settings=page.evaluate('sessionStorage.getItem("cafa2-case-panel-v1")')
    page.locator('.study-assistant-resizer').press('ArrowLeft');page.locator('.study-assistant-resizer').press('Home')
    check('Resizing the assistant preserves the case setting and scroll position',page.evaluate('sessionStorage.getItem("cafa2-case-panel-v1")')==case_settings and abs(page.locator('#exam-case-panel').evaluate('e=>e.scrollTop')-case_scroll)<2)
    page.locator('[data-exam-action="section"]').first.click()
    check('Case can be hidden while the assistant remains open',not page.locator('#exam-case-panel').is_visible() and page.locator('#study-assistant').is_visible())
    page.locator('[data-exam-action="section"]').first.click()
    check('Case can be restored without changing the exam answer',page.locator('#exam-case-panel').is_visible() and page.evaluate('localStorage.getItem(CafaExams.storageKey)')==saved_exam)
    page.screenshot(path=str(OUT/f'exam-three-columns-{engine}.png'))
    page.locator('#exam-app .exam-case-resizer').press('End');page.wait_for_timeout(150)
    check('A case widened to 60 percent still leaves 340 pixels for the answer',page.locator('.exam-question-body').bounding_box()['width']>=339)
    page.set_viewport_size({'width':1024,'height':900});page.wait_for_timeout(200)
    check('A wide case on a tablet stacks the assistant instead of squeezing the question',page.locator('.study-assistant-layout').evaluate('e=>e.classList.contains("is-stacked")') and page.locator('.exam-question-body').bounding_box()['width']>=339)
    page.set_viewport_size({'width':1366,'height':950});page.wait_for_timeout(200)
    page.locator('#exam-app .exam-case-resizer').press('Home');page.locator('#exam-app .exam-case-resizer').press('ArrowRight');page.locator('#exam-app .exam-case-resizer').press('ArrowRight');page.wait_for_timeout(100)
    page.locator('[data-exam-action="overview"]').click()
    page.wait_for_function('document.querySelector("#exam-info-dialog").contains(document.querySelector("#study-assistant"))')
    check('Docked assistant stays usable inside an existing exam modal',page.locator('#study-message').is_enabled() and
          page.locator('#study-assistant').evaluate('e=>e.open && !e.matches(":modal")'))
    modal_head=page.locator('#exam-info-dialog .exam-modal-head').bounding_box();modal_panel=page.locator('#study-assistant').bounding_box()
    check('Modal close controls are above the assistant column',modal_head['y']+modal_head['height']<=modal_panel['y']+1)
    page.locator('#exam-info-dialog [data-close-info]').first.click()
    page.wait_for_function('document.querySelector("#study-assistant").closest(".study-assistant-layout.is-exam")')
    check('Assistant returns to the page when the exam modal closes',page.locator('#study-assistant').is_visible())
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
    page.wait_for_function('document.querySelector("[data-context-title]")?.textContent?.includes("Vraag 2")')
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
    page.wait_for_function('document.querySelector("[data-context-title]")?.textContent?.includes("Vraag 1")')
    send('Waar komt het bedrag uit het antwoordmodel vandaan?')
    check('Completed exam overview inline action pins first result question',requests[-1]['ref']['questionId']=='vraag-1')
    close_panel();visit('#inzage/'+attempt_id+'/vraag/0')
    current_ref(first,'vraag-1','exam')
    page.locator('[data-exam-action="review-question"][data-index="1"]').click()
    page.wait_for_function('location.hash.endsWith("/vraag/1")')
    page.wait_for_function('document.querySelector("[data-context-title]")?.textContent?.includes("Vraag 2")')
    send('Licht de volgende vraag toe.')
    check('Individual review navigation updates question and keeps its own history',
          requests[-1]['ref']['questionId']=='vraag-2' and
          any(m['content']=='Vraag 2 krijgt eigen uitleg.' for m in requests[-1]['history']))
    close_panel()

    # An opgave series stores compound IDs, while the assistant must use the
    # original exam and question IDs for its server-side answer model.
    visit('#welkom/opgaven')
    page.locator('[data-exam-action="start-opgave"]').wait_for(state='visible')
    page.locator('[data-exam-action="start-opgave"]').click()
    page.wait_for_function('location.hash.startsWith("#tentamen/")')
    opgave_id=page.evaluate('CafaExams.getAttempts().at(-1).id')
    opgave=page.evaluate('''id => {const a=CafaExams.getAttempts().find(x=>x.id===id);
      return {kind:a.exam.practiceKind,questions:a.exam.questions.map(q=>({id:q.id,sourceExamId:q.sourceExamId,
        sourceQuestionId:q.sourceQuestionId}))};}''',opgave_id)
    check('Opgave series has compound IDs and original source IDs',
          opgave['kind']=='opgave' and len(opgave['questions'])>2 and
          opgave['questions'][0]['id']!=opgave['questions'][0]['sourceQuestionId'])
    first_source=opgave['questions'][0]
    current_ref(first_source['sourceExamId'],first_source['sourceQuestionId'],'exam')
    close_panel()
    other_index=next(i for i,q in enumerate(opgave['questions']) if q['sourceExamId']!=first_source['sourceExamId'])
    other_source=opgave['questions'][other_index]
    page.evaluate('([id,i])=>CafaExams.restorePosition(id,i)',[opgave_id,other_index])
    page.wait_for_function('(i)=>CafaExams.getPosition()?.index===i',arg=other_index)
    current_ref(other_source['sourceExamId'],other_source['sourceQuestionId'],'exam')
    check('Opgave series keeps separate source conversations',requests[-1]['history']==[])
    close_panel()
    page.locator('[data-exam-action="submit"]').click()
    page.locator('[data-exam-confirm-submit]').click()
    page.wait_for_function('(id)=>location.hash==="#inzage/"+id',arg=opgave_id)
    visit('#inzage/'+opgave_id+'/vraag/'+str(other_index))
    current_ref(other_source['sourceExamId'],other_source['sourceQuestionId'],'exam')
    check('Completed opgave detail uses original exam and question',
          requests[-1]['ref']['bankId']==other_source['sourceExamId'] and
          requests[-1]['ref']['questionId']==other_source['sourceQuestionId'])
    close_panel();visit('#inzage/'+opgave_id)
    page.locator('#exam-app details[data-result-id="'+other_source['id']+'"]').locator('summary').click()
    page.locator('#exam-app details[data-result-id="'+other_source['id']+'"] .study-inline-launch').click()
    send('Licht deze oorspronkelijke uitwerking toe.')
    check('Opgave summary inline action uses the selected original source',
          requests[-1]['ref']['bankId']==other_source['sourceExamId'] and
          requests[-1]['ref']['questionId']==other_source['sourceQuestionId'])
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
      close_panel()
      page.set_viewport_size({'width':width,'height':height});page.wait_for_timeout(200)
      overlap=launcher_overlap();layout_results.append({'width':width,'height':height,**overlap})
      check(f'Exam launcher avoids fixed buttons at {width}x{height}',
            not overlap['conflicts'] and overlap['launcher']['y']>=0 and
            overlap['launcher']['y']+overlap['launcher']['height']<=height+1)
      ensure_open();page.wait_for_timeout(200);rect=page.locator('#study-assistant').bounding_box()
      check(f'Mobile pane fits {width}x{height}',rect['x']>=-1 and rect['x']+rect['width']<=width+1 and rect['y']+rect['height']<=height+1)
      check(f'Mobile input avoids headers and sticky navigation at {width}x{height}',page.locator('#study-message').evaluate('''e=>{const r=e.getBoundingClientRect(),top=document.querySelector('#study-returnbar').getBoundingClientRect();return r.y>=top.bottom && document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)===e;}'''))
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
    page.locator('#calculator-dialog [data-calc-close]').click()
    check('Assistant composer is reachable after closing the floating calculator',page.locator('#study-message').evaluate('''e=>{const r=e.getBoundingClientRect();return document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)===e;}'''))
    close_panel()
    check('Calculator history survives assistant open and close',page.locator('.calc-history-list li').count()>=1)
    page.set_viewport_size({'width':1366,'height':950});page.locator('[data-calc]').click()
    page.locator('#calculator-dialog .study-calculator-launch').click()
    check('Desktop assistant docks without making the page inert',page.locator('#study-assistant').evaluate('(e)=>e.open && !e.matches(":modal") && e.getAttribute("aria-modal")==="false"'))
    panel=page.locator('#study-assistant');separator=page.locator('.study-assistant-resizer')
    draft='Dit concept blijft staan tijdens het aanpassen van de breedte.'
    page.locator('#study-message').fill(draft);message_count=page.locator('.study-message').count()
    page.wait_for_timeout(100)
    def dock_boxes():
      return page.evaluate('''() => {const panel=document.querySelector('#study-assistant'),layout=panel.parentElement;
        const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom};};
        return {panel:rect(panel),primary:rect(layout.querySelector('.study-assistant-primary')),separator:rect(layout.querySelector('.study-assistant-resizer')),
          footer:rect(document.querySelector('#exam-app .exam-footer')),head:rect(document.querySelector('#exam-app .exam-work-head'))};}''')
    boxes=dock_boxes()
    check('Assistant has a reserved column to the right of the question',boxes['primary']['right']<=boxes['separator']['x']+1 and boxes['separator']['right']<=boxes['panel']['x']+1)
    check('Question heading and navigation remain outside the assistant column',boxes['panel']['y']>=boxes['head']['bottom']-1 and boxes['panel']['bottom']<=boxes['footer']['y']+1)
    start=panel.bounding_box();grip=separator.bounding_box()
    page.mouse.move(grip['x']+7,grip['y']+grip['height']/2);page.mouse.down()
    page.mouse.move(grip['x']-83,grip['y']+grip['height']/2,steps=12);page.mouse.up()
    enlarged=panel.bounding_box()
    check('Dragging the separator left enlarges the right column',enlarged['width']>=start['width']+80 and enlarged['x']<start['x'])
    separator.focus();separator.press('ArrowRight');narrower=panel.bounding_box()
    check('Arrow keys resize in the direction of the right-hand separator',narrower['width']<enlarged['width'])
    separator.press('End');boxes=dock_boxes()
    check('The widest assistant leaves a usable question column',boxes['primary']['width']>=400 and boxes['primary']['right']<=boxes['panel']['x'])
    separator.press('Home');normal=panel.bounding_box()
    check('Home restores one third of the study area',abs(normal['width']-page.locator('.study-assistant-layout').bounding_box()['width']/3)<2)
    check('Resizing preserves draft and conversation',page.locator('#study-message').input_value()==draft and page.locator('.study-message').count()==message_count)
    page.locator('#calculator-dialog [data-calc-move]').click()
    page.locator('#calc-expression').fill('4+5');page.locator('#calc-expression').press('Enter')
    check('Calculator stays usable beside the assistant column',panel.evaluate('e=>e.open') and '9' in page.locator('.calc-history-list').inner_text())
    page.locator('#calculator-dialog [data-calc-close]').click()
    check('Assistant input remains reachable after using the calculator',page.locator('#study-message').evaluate('''e=>{const r=e.getBoundingClientRect();return document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)===e;}'''))
    saved_geometry=panel.bounding_box();close_panel()
    check('Closing the assistant restores the full question area',page.locator('.study-assistant-layout').count()==0)
    ensure_open();page.wait_for_timeout(100)
    reopened=panel.bounding_box()
    check('Reopening restores the chosen column width',abs(reopened['width']-saved_geometry['width'])<2)
    page.screenshot(path=str(OUT/f'desktop-column-{engine}.png'))
    page.set_viewport_size({'width':390,'height':260});page.wait_for_timeout(200)
    short=panel.bounding_box();compose=page.locator('.study-compose').bounding_box()
    check('Input fits a short keyboard viewport without covering navigation',short['x']>=0 and short['x']+short['width']<=390 and compose['y']>=0 and compose['y']+compose['height']<=260)
    page.screenshot(path=str(OUT/f'keyboard-column-{engine}.png'))
    page.set_viewport_size({'width':1366,'height':950});page.wait_for_timeout(200)
    desktop_again=panel.bounding_box()
    check('Desktop column width returns after a temporary narrow viewport',abs(desktop_again['width']-saved_geometry['width'])<2)
    page.locator('#study-message').press('Escape')
    page.wait_for_function('!document.querySelector(".study-assistant-layout")')
    check('Escape closes the assistant and releases its reserved column',not panel.evaluate('e=>e.open') and page.locator('.study-assistant-layout').count()==0)
    page.reload();page.wait_for_function('window.StudyAssistant && !document.querySelector(".study-assistant-launch").hidden')
    ensure_open();page.wait_for_timeout(100);after_reload=panel.bounding_box()
    check('Column width persists across a page reload',abs(after_reload['width']-saved_geometry['width'])<2)
    check('Only width is stored in the panel preference',set(page.evaluate('JSON.parse(localStorage.getItem("cafa2-assistant-panel-v1"))'))=={'width'})
    close_panel();page.locator('[data-calc]').click();page.locator('#calculator-dialog .study-calculator-launch').click()
    page.locator('#study-message').press('Escape');page.wait_for_function('!document.querySelector(".study-assistant-layout")')
    page.locator('#calculator-dialog [data-calc-close]').click()
    check('Closing calculator restores the floating assistant launcher',page.locator('.study-assistant-launch').is_visible())
    check('No JavaScript runtime exceptions',not errors)
    (OUT/f'report-{engine}.json').write_text(json.dumps({'passed':True,'engine':engine,'checks':checks,'errors':errors,
       'layout':layout_results,'realQuestions':True,'mockService':True,'realApiCalls':0,
       'keyboard':'short viewport simulation, no physical keyboard'},ensure_ascii=False,indent=2))
    browser.close()
finally:server.shutdown()
