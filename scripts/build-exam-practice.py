"""MC counterparts from the already transcribed exam catalogue. No PDF scanning."""
import json, re, subprocess, os, shutil, hashlib
from pathlib import Path
from bs4 import BeautifulSoup
from html import escape
from exam_practice_format import prompt_parts, solution_parts, display, answer_schema, CONFIG

ROOT=Path(__file__).resolve().parent.parent
NODE=os.environ.get('NODE_BINARY') or shutil.which('node')
if not NODE:raise RuntimeError('Node.js ontbreekt; stel NODE_BINARY in.')
exams=json.loads(subprocess.check_output([str(NODE),str(ROOT/'scripts/exam-practice-source.mjs'),'--json']))
guidance=json.loads((ROOT/'content/practice/topic-guidance.json').read_text(encoding='utf-8'))
overrides=json.loads((ROOT/'content/practice/exam-text-options.json').read_text(encoding='utf-8'))
topic_overrides=json.loads((ROOT/'content/practice/exam-topic-overrides.json').read_text(encoding='utf-8'))

def clean(html):
    soup=BeautifulSoup(html,'html.parser')
    for table in soup.select('table'):
        rows=table.select('tr'); header=next((r for r in rows if r.find('th')),rows[0] if rows else None)
        if header:
            indices=[i for i,c in enumerate(header.find_all(['td','th'],recursive=False)) if re.search(r'punten|normering|score',c.get_text(),re.I)]
            for row in rows:
                cells=row.find_all(['td','th'],recursive=False)
                for i in reversed(indices):
                    if i<len(cells):cells[i].decompose()
    for tag in soup.select('h3,h4,p'):
        text=tag.get_text(' ',strip=True)
        if re.match(r'^(?:Cirrus vraag|Gevraagd|Gevraag |Pagina \d|Normering:|Let op doorwerk)',text,re.I) and len(text)<130 and not re.search(r'\d[.,]\d{3}',text):tag.decompose()
    for node in list(soup.find_all(string=True)):
        if node.parent and node.parent.name not in ['script','style']:
            text=re.sub(r'\((?:½|¼|¾|\d+(?:[,.]\d+)?|1/2)(?:\s*(?:pnt|punten?|g/f|rekening|bedrag)[^()]*)?\)','',str(node))
            text=re.sub(r'(?<!\w)(?:½|¼|¾)[ \t]*(?:rekening[ \t]*\+[ \t]*½[ \t]*bedrag|rekening|bedrag)?','',text)
            text=re.sub(r'(?<![\d.,])(\d) +(?=\d{1,2}\.\d{3})',r'\1',text)
            node.replace_with(text)
    return str(soup)

def topic_for(exam,q,section):
    p=q['prompt'].lower(); s=section['title'].lower(); both=p+' '+s
    if 'vreemde valuta' in s:
        if re.search(r'functionele valuta|niet.zelfstandige|verlengstuk|in lijn|definitie',p):return 'functionele-valuta'
        local=exam['questions']; qs=[x for x in local if x['sectionId']==section['id']]
        pos=next(i for i,x in enumerate(qs) if x['id']==q['id'])
        # The source cases explicitly separate the two prescribed methods.
        if exam['id'] in ['cafa2-20210419','cafa2-20211006','cafa2-20220411','cafa2-20221006','cafa2-20230411','cafa2-20231009']:
            return 'slotkoers' if pos>=len(qs)-3 else 'tijdstip'
        if exam['id']=='cafa2-20260429':return 'slotkoers' if pos>=4 else 'tijdstip'
        if exam['id']=='cafa2-20250924':return 'slotkoers' if pos>=4 else 'tijdstip'
        if exam['id']=='cafa2-20250417':return 'slotkoers' if pos>=4 else 'tijdstip'
        return 'slotkoers' if pos>=3 else 'tijdstip'
    if 'kapitaalbelangen' in s:
        if re.search(r'eigen aandelen|aandelen.*inkoo|10% kapitaalbelang van palau in monserrato',p):return 'eigen-aandelen'
        if 'reserve' in p:return 'reserves'
        if re.search(r'consolid|groepsmaatschappij',p):return 'consolidatiekader'
        if 'goodwill' in p or re.search(r'journaalpost.*(?:verwerving|aangekochte aandelen|aankoop)',p):return 'goodwill'
        if re.search(r'kwalifice|kwalificatie|dochter|deelneming.*criteria|wettelijke criteria',p):return 'zeggenschap'
        return 'waardering'
    if 'goodwill' in p and not re.search(r'eliminatie|aandeel derden',p):return 'goodwill'
    if re.search(r'machine|inpak|vaste activ|gebouw|inventaris',p):return 'vaste-activa'
    if re.search(r'proportioneel|joint venture',p):return 'proportioneel'
    if 'verkrijgingsprijs' in s:return 'downstream-vp' if re.search(r'levering|voorraad|intercompany|intracomptabel',p) else 'basisconsolidatie'
    if re.search(r'levering|voorraad|intercompany|intracomptabel',p):
        if re.search(r'power4you aan chargeit',p):return 'sidestream-afnemend'
        if re.search(r'peperga aan oldemarcke|apeldoornmedical aan clinimed',p):return 'upstream-nvw'
        if re.search(r'moderna aan chargeit|oldemarcke aan westerbles',p):return 'downstream-nvw'
        if re.search(r'onderlinge levering|intercompany',p) and 'sidestream' in section['contentHtml'].lower():return 'sidestream-niet-afnemend'
        return 'downstream-nvw'
    return 'basisconsolidatie'

def amount_options(html,key):
    soup=BeautifulSoup(html,'html.parser'); candidates=[]
    for cell in soup.select('td'):
        t=cell.get_text(' ',strip=True)
        if re.fullmatch(r'(?:[€£$]\s*)?[+\-]?\s*(?:\d{1,3}(?:\.\d{3})+|\d{4,})(?:,\d{1,2})?(?:\s*[+\-])?',t):
            n=float(re.sub(r'[^\d,]','',t).replace(',','.'))
            if n>=1000:
                row=cell.parent.find(['td','th']); label=row.get_text(' ',strip=True) if row else 'uitkomst'
                candidates.append((cell,t,n,label))
    if not candidates:
        for node in soup.find_all(string=True):
            for m in re.finditer(r'(?<![\d.])(?:[€£$]\s*)?\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?(?!\d|\.\d|\s*%)',str(node)):
                n=float(re.sub(r'[^\d,]','',m.group()).replace(',','.'))
                if n>=1000:candidates.append((node,m.group(),n,'uitkomst in de berekening'))
    if not candidates:raise ValueError('Tekstopties vereist: '+key)
    # Change an actual amount, never a year, question number, law reference or mark.
    # Preserve complete multi-part answers, journals, tables and other correct components.
    cell,token,value,label=candidates[-1]
    delta=10**max(0,len(str(int(value)))-2)
    wrong_values=[value+delta,value-delta,value*2]
    if wrong_values[1]<=0:wrong_values[1]=value/2
    options=[{'html':html,'why':'Alle gevraagde onderdelen volgen het oorspronkelijke antwoordmodel. Vergelijk hieronder de berekening en de verwerking.'}]
    for wrong in wrong_values:
        changed=BeautifulSoup(html,'html.parser')
        if getattr(cell,'name',None)=='td':
            cells=soup.select('td'); target=changed.select('td')[cells.index(cell)];target.clear()
            formatted=f'{wrong:,.2f}'.replace(',','_').replace('.',',').replace('_','.')
            if wrong.is_integer() if isinstance(wrong,float) else True:formatted=formatted.removesuffix(',00')
            replacement=re.sub(r'\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?|\d{4,}(?:,\d{1,2})?',formatted,token,count=1)
            target.append(replacement)
        else:
            formatted=f'{wrong:,.0f}'.replace(',','.')
            replacement=re.sub(r'\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?',formatted,token,count=1)
            # Restrict the edit to the selected occurrence in the selected text node.
            nodes=soup.find_all(string=True);target=changed.find_all(string=True)[nodes.index(cell)]
            text=str(target);start=text.rfind(token);target.replace_with(text[:start]+replacement+text[start+len(token):])
        if str(changed)==html:raise ValueError('Ongewijzigde afleider '+key)
        options.append({'html':str(changed),'why':f'Het bedrag bij “{label}” is hier {replacement}; het antwoordmodel geeft {token}. De overige onderdelen veranderen die uitkomst niet. Controleer de volledige berekening hieronder.'})
    return options,{'kind':'amount','label':label,'correctValue':value,'incorrectValues':wrong_values,'sourceToken':token}

records=[];missing=[]
for exam in exams:
    for q in exam['questions']:
        key=exam['id']+'/'+q['id'];section=next(s for s in exam['sections'] if s['id']==q['sectionId'])
        expected=CONFIG.get(key,{}).get('sourceSha256')
        if expected and expected!=hashlib.sha256(q['solutionHtml'].encode()).hexdigest():
            raise ValueError('Financiële kolomindeling vraagt broncontrole: '+key)
        tasks=prompt_parts(q,key)
        try:solutions=solution_parts(q,key,len(tasks))
        except ValueError as err:missing.append(key);print(err);continue
        previous=[x['id'] for x in exam['questions'][:exam['questions'].index(q)] if x['sectionId']==q['sectionId']]
        for i,(task,solution) in enumerate(zip(tasks,solutions)):
            part=chr(97+i) if len(tasks)>1 else ''
            part_key=key+('#'+part if part else '')
            correct_html=clean(display(clean(solution),task,key,i))
            part_q={**q,'prompt':task};topic=topic_for(exam,part_q,section)
            topic=topic_overrides.get(part_key,topic_overrides.get(key,topic))
            if len(tasks)>1 and 'goodwill' in task.lower() and not re.search(r'eigen vermogen|aandeel derden',task,re.I):topic='goodwill'
            if key=='cafa2-20211006/vraag-9':topic='downstream-nvw' if i==0 else 'sidestream-afnemend'
            entry=overrides.get(part_key) or (overrides.get(key) if len(tasks)==1 else None)
            if entry:
                topic=entry.get('topicId',topic)
                options=[{'text':text,'why':entry['why'][j]} for j,text in enumerate(entry['options'])]
                mutation={'kind':'authored-text'}
            else:
                try:options,mutation=amount_options(correct_html,part_key)
                except ValueError:
                    missing.append(part_key);print('TEKSTOPTIES '+part_key+' | '+task+' | '+BeautifulSoup(correct_html,'html.parser').get_text(' ',strip=True));continue
            schema=answer_schema({**q,'_caseHtml':section['contentHtml']},correct_html,key,i)
            journal=bool(re.search(r'journaalpost|eliminatieboeking|correctieboeking|eliminatiepost',task,re.I))
            # The original UID becomes part a; subsequent parts get append-only UIDs.
            registry_key=key if i==0 else part_key
            records.append({'key':registry_key,'sourceKey':key,'part':part,'partCount':len(tasks),'examId':exam['id'],'questionId':q['id'],'sectionId':q['sectionId'],'topicId':topic,'secondaryTopicIds':(['belastingen'] if topic!='belastingen' and 'belasting' in correct_html.lower() and 'consolidatie' in section['title'].lower() else []),'title':exam['date'].split('-')[::-1][0]+'-'+exam['date'].split('-')[1]+'-'+exam['date'].split('-')[0]+' · '+q['title']+(' · Onderdeel '+part if part else ''),'type':'Voorraadtabel' if schema else 'Journaalpost' if journal else 'Tentamenvraag als MC','answerKind':'stock' if schema else 'journal' if journal else 'text','answerSchema':schema,'intro':'Oorspronkelijke tentamenvraag. Kies de juiste uitwerking van dit onderdeel.' if part else 'Oorspronkelijke tentamenvraag. Kies de juiste uitwerking.','task':task,'promptHtml':(q['promptHtml'] if len(tasks)==1 else '<p>'+escape(task).replace('\n','<br>')+'</p>'),'originalPromptHtml':q['promptHtml'],'facts':[],'caseTables':[],'correct':0,'options':options,'solutionHtml':correct_html,'sourceSolutionHtml':q['solutionHtml'],'practiceSolutionHtml':correct_html,'dependencyQuestionIds':previous,'siblingSourceKeys':[key if j==0 else key+'#'+chr(97+j) for j in range(i)],'guidance':{**guidance[topic],'pattern':['Bepaal de waarderingsgrondslag en de verslaggeving waarop de vraag betrekking heeft.','Gebruik de oorspronkelijke casus en open zo nodig de gegevens uit eerdere deelvragen.','Controleer de bedragen, de debet-creditzijde en alleen het gevraagde onderdeel.']},'pattern':'Gebruik de oorspronkelijke casus, de juiste waarderingsgrondslag en de benodigde eerdere uitkomsten.','explanation':['Het oorspronkelijke antwoordmodel staat hieronder. De verkeerde antwoordopties zijn oefenafleiders; zij behoren niet tot het officiële tentamen.'],'refs':[key],'sources':[{'label':exam['date']+' · '+section['title']+' · '+q['title']+(' · Onderdeel '+part if part else ''),'file':'data/exam-'+exam['date'].replace('-','')+'.js','pages':'bestaande tentamenomgeving'}],'mutation':mutation})
if missing:raise ValueError('Nog te schrijven tekstopties: '+', '.join(missing))
folder=ROOT/'content/practice/exam-mc';folder.mkdir(exist_ok=True)
for exam in exams:
    (folder/(exam['id']+'.json')).write_text(json.dumps([r for r in records if r['examId']==exam['id']],ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(f'{sum(len(e["questions"]) for e in exams)} bronvragen omgezet in {len(records)} oefeningen; {sum(r["mutation"]["kind"]=="authored-text" for r in records)} met inhoudelijk geschreven tekstopties.')
