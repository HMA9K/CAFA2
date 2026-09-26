"""Display and part extraction from existing exam records, without reading PDFs."""
import re, json
from html import escape
from pathlib import Path
from bs4 import BeautifulSoup

ROOT=Path(__file__).resolve().parent.parent
CONFIG=json.loads((ROOT/'content/practice/exam-structure-overrides.json').read_text(encoding='utf-8'))
for key,entry in json.loads((ROOT/'content/practice/exam-financial-presentation.json').read_text(encoding='utf-8')).items():
    CONFIG[key]={**CONFIG.get(key,{}),**entry}
AMOUNT=re.compile(r'(?<![\d.,])(?:[€£$][ \t]*)?[+−-]?[ \t]*(?:\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?|\d+(?:,\d{1,2})?)(?![\d.])')

def table(headers,rows,caption=''):
    return '<div class="table-wrap"><table class="practice-answer-table">'+('<caption>'+escape(caption)+'</caption>' if caption else '')+'<thead><tr>'+''.join('<th scope="col">'+escape(x)+'</th>' for x in headers)+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+escape(str(x))+'</td>' for x in row)+'</tr>' for row in rows)+'</tbody></table></div>'

def lines(html):
    soup=BeautifulSoup(html,'html.parser')
    for br in soup.find_all('br'):br.replace_with('\n')
    for p in soup.find_all(['p','h3','h4','li']):p.append('\n')
    return soup.get_text().strip()

def prompt_parts(q,key):
    cfg=CONFIG.get(key,{})
    if cfg.get('prompts'):return cfg['prompts']
    text=q['prompt']; marks=list(re.finditer(r'(?<!\w)([a-e])[.)]\s+',text))
    if len(marks)<2 or ''.join(m[1] for m in marks)!='abcde'[:len(marks)]:return [text]
    lead=text[:marks[0].start()].strip()
    suffix=''
    # A final instruction belongs to all parts, not only the last one.
    end=re.search(r'(?:Motiveer|Geef daarbij|Geef hierbij|Dit onderdeel).*$',text[marks[-1].end():],re.S)
    if end:suffix=end[0]
    parts=[]
    for i,m in enumerate(marks):
        part=text[m.end():marks[i+1].start() if i+1<len(marks) else len(text)].strip()
        if suffix:part=part.replace(suffix,'').strip()
        part=re.sub(r'\(\d+(?:[.,]\d+)? punten?\)\s*$','',part).strip()
        parts.append(lead+'\nOnderdeel '+m[1]+': '+part+('\n'+suffix if suffix else ''))
    return parts

def solution_parts(q,key,count):
    cfg=CONFIG.get(key,{})
    if cfg.get('solutions'):return cfg['solutions']
    if cfg.get('display'):return cfg['display']
    if count==1:return [q['solutionHtml']]
    soup=BeautifulSoup(q['solutionHtml'],'html.parser')
    if cfg.get('starts'):
        text=lines(q['solutionHtml']); starts=[]
        for pat in cfg['starts']:
            found=re.search(pat,text,re.M|re.I)
            if not found:raise ValueError('Start ontbreekt '+key+' '+pat)
            starts.append(found.start())
        return ['<pre>'+escape(text[p:starts[i+1] if i+1<len(starts) else len(text)])+'</pre>' for i,p in enumerate(starts)]
    # Recent transcriptions have real headings and tables. Keep those intact.
    nodes=list(soup.children); marks=[]
    if cfg.get('nodeStarts'):
        positions=[]
        for pattern in cfg['nodeStarts']:
            matches=[i for i,n in enumerate(nodes) if getattr(n,'name',None) and re.search(pattern,n.get_text(' ',strip=True),re.I)]
            if not matches:raise ValueError('HTML-start ontbreekt '+key+' '+pattern)
            positions.append(matches[0])
        return [''.join(str(n) for n in nodes[p:positions[i+1] if i+1<count else len(nodes)]) for i,p in enumerate(positions)]
    for i,n in enumerate(nodes):
        if getattr(n,'name',None) not in ['h3','h4','table','p','div']:continue
        t=n.get_text(' ',strip=True)
        m=re.match(r'^(?:\d+\s*[.]?\s*)?([A-E])[.\s]+',t,re.I)
        if len(marks)<count and m and m[1].lower()=='abcde'[len(marks)]:marks.append(i)
    if len(marks)==count:
        prefix=''.join(str(n) for n in nodes[:marks[0]])
        return [prefix+''.join(str(n) for n in nodes[p:marks[i+1] if i+1<count else len(nodes)]) for i,p in enumerate(marks)]
    text=lines(q['solutionHtml']); candidates=[]
    # Choose a complete sequence from the answer, after any repeated question.
    pattern=r'^\s*(?:Gevraagd?\s*\d+\s*[.]?\s*|\d+[.]\s*)?([A-E])[.)\s]+|^\s*(?:Gevraagd?\s*)?\d+([A-E])[.\s]'
    for m in re.finditer(pattern,text,re.M|re.I):
        letter=(m[1] or m[2]).lower();candidates.append((letter,m.start()))
    sequences=[]
    for j,(letter,pos) in enumerate(candidates):
        if letter!='a':continue
        positions=[pos];current=1
        for l,p in candidates[j+1:]:
            if current<count and l=='abcde'[current]:positions.append(p);current+=1
            elif l=='a' and current<count:break
            if current==count:break
        if len(positions)==count:sequences.append(positions)
    if not sequences:raise ValueError('Onderdeelselectie nodig '+key)
    starts=sequences[-1]
    return ['<pre>'+escape(text[p:starts[i+1] if i+1<count else len(text)])+'</pre>' for i,p in enumerate(starts)]

def outside_amounts(line):
    # Amounts inside calculation parentheses are explanations, not table cells.
    masked=re.sub(r'\([^)]*\)',lambda m:' '*len(m[0]),line)
    return list(AMOUNT.finditer(masked))

def structured_pre(text,journal=False):
    text=re.sub(r'^\s*Cirrus vraag[^\n]*\n','',text)
    if re.match(r'^\s*\d+[.]\s*(?:Geef|Bereken|Stel|Motiveer)',text,re.I):
        paragraph=re.search(r'\n\s*\n',text)
        if paragraph:text=text[paragraph.end():]
    out=[];rows=[];headers=[];pending=None;notes=[]
    def flush():
        nonlocal rows,headers,notes
        if rows:out.append(table(headers,rows));rows=[];headers=[]
        out.extend(notes);notes=[]
    for raw in text.splitlines():
        line=raw.strip()
        if not line:continue
        if re.fullmatch(r'[\s\-_=]+',line):continue
        if re.match(r'^(?:Cirrus vraag|Gevraagd?|GEVRAAGD|Pagina \d)',line,re.I):flush();continue
        if re.search(r'\b(?:Db|Debet)\s+(?:Cr|Credit)\b',line,re.I):flush();continue
        if re.match(r'^\d+[.]\s*(?:Geef|Bereken|Stel|Motiveer)',line,re.I):flush();continue
        if journal and (re.match(r'^(?:\(|\d+[ \t]*[%×x*]|jp\b|Berekening\b|Geef\b|Stel\b|Eliminatie\s*-)',line,re.I) or (not pending and re.match(r'^[€£$]\s*\d',line)) or '=' in line and not re.search(r'^(?:Aan|D[ -]|Cr[ -]|[DC]\s)',line,re.I)):
            notes.append('<p>'+escape(line)+'</p>');continue
        raw=re.sub(r'(?<![\d.])1/2(?!\d)','   ',raw)
        amounts=outside_amounts(raw)
        amounts=[m for m in amounts if abs(float(re.sub(r'[^\d,.-]','',m[0]).replace('.','').replace(',','.')) or 0)>=10 or re.search(r'[€£$]',m[0]) or m[0].strip()=='0']
        if amounts:
            # Stop before any grade printed after the last monetary value.
            trailing=raw[amounts[-1].end():].strip()
            if trailing and re.search(r'[A-Za-z]',trailing):amounts=[]
        if amounts and not journal and re.match(r'^(?:Toe/?afname|Toename|Afname|Mutatie)|^\d{2}-\d{2}-\d{4}',line,re.I) and len(amounts)>=5 and 'intercompany' in text.lower():
            if headers and len(headers)!=6:flush()
            headers=['Datum','Voorraad / actief','Niet-gerealiseerde intercompanywinst','Interne correctie','Eliminatie aandeel derden','Eliminatie geconsolideerd resultaat']
            label=raw[:amounts[-5].start()].strip();rows.append([label]+[m[0].strip() for m in amounts[-5:]]);continue
        if amounts and journal:
            if journal:
                if headers and len(headers)!=3:flush()
                headers=['Omschrijving grootboekrekening','Debet','Credit']
                value=amounts[-1][0].strip();label=raw[:amounts[-1].start()].strip()
                if not label and pending:label=pending;pending=None
                if not label:flush();out.append('<p>'+escape(line)+'</p>');continue
                credit=bool(re.match(r'^(?:Aan\b|Cr[ -]|C\s|\d+(?:[.]{2,}|[ ]+)[ ]*(?:Aan\b))',label,re.I))
                label=re.sub(r'^(?:D[ -]|Cr[ -]|[DC]\s+)','',label,flags=re.I).strip()
                rows.append([label,'' if credit else value,value if credit else ''])
            continue
        if journal and re.match(r'^(?:Aan\s+|Cr[ -])',line,re.I) and not amounts:pending=line;continue
        if journal and rows:
            notes.append('<p>'+escape(line)+'</p>');continue
        flush();out.append('<p>'+escape(line)+'</p>')
    flush()
    return ''.join(out)

def display(html,prompt,key,part):
    cfg=CONFIG.get(key,{})
    if cfg.get('display'):
        return cfg['display'][part]
    soup=BeautifulSoup(html,'html.parser')
    journal=bool(re.search(r'journaalpost|eliminatieboeking|correctieboeking|eliminatiepost',prompt,re.I))
    for pre in list(soup.find_all('pre')):
        pre.replace_with(BeautifulSoup(structured_pre(pre.get_text(),journal),'html.parser'))
    # The 2023 catalogue has positioned columns flattened into separate paragraphs.
    # Explicit overrides are used for those journals; non-journal calculations use line tables.
    if not soup.find('table') and not soup.find('pre') and '<br' in html:
        soup=BeautifulSoup(structured_pre(lines(str(soup)),journal),'html.parser')
    return str(soup)

def answer_schema(q,display_html,key,part):
    cfg=CONFIG.get(key,{})
    if cfg.get('schemas'):return cfg['schemas'][part]
    if not re.search(r'\bStel\b.*\btabel\b|\bStel\b.*voorraadtabel',q['prompt'],re.I|re.S):return None
    prompt=BeautifulSoup(q['promptHtml']+' '+q.get('_caseHtml',''),'html.parser')
    source=next((t for t in prompt.select('table') if len(t.select('thead th'))==6 and re.search('datum',t.select('thead th')[0].get_text(),re.I)),None)
    if source is None:
        source=next((t for t in BeautifulSoup(display_html,'html.parser').select('table') if len(t.select('thead th'))==6),None)
        if source is None:return None
        headers=[x.get_text(' ',strip=True) for x in source.select('thead th')]
        rows=[[r.find(['td','th']).get_text(' ',strip=True)]+['']*(len(headers)-1) for r in source.select('tbody tr')]
    else:
        headers=[x.get_text(' ',strip=True) for x in source.select('thead th')]
        rows=[[c.get_text(' ',strip=True) for c in r.find_all(['td','th'],recursive=False)] for r in source.select('tbody tr')]
    return {'headers':headers,'rows':rows}
