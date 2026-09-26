"""Relocate already transcribed case tables and remove duplicate flattened copies."""
import json, subprocess, re, hashlib
from pathlib import Path
from html import escape
from bs4 import BeautifulSoup
ROOT=Path(__file__).resolve().parent.parent
exams=json.loads(subprocess.check_output(['node',str(ROOT/'scripts/exam-practice-source.mjs'),'--json']))
result={}
def present(exam,section):
    soup=BeautifulSoup(section['contentHtml'],'html.parser');tables={};blocks=[]
    for t in list(soup.select('table')):
        heading=t.find_previous_sibling('h3')
        if not heading:raise ValueError('Bijschrift ontbreekt')
        title=heading.get_text(' ',strip=True)
        caption=soup.new_tag('caption');caption.string=title;t.insert(0,caption)
        t['class']=['practice-answer-table'];tables[title]='<div class="table-wrap">'+str(t)+'</div>'
        heading.decompose();t.decompose()
    text='\n\n'.join(n.get_text('\n',strip=True) for n in soup.children if getattr(n,'name',None))
    def relocate(start,end,table_title,after=''):
        nonlocal text
        a=text.index(start,text.index(after)+len(after) if after else 0);b=text.index(end,a+len(start))
        marker='§TABLE'+str(len(blocks))+'§';blocks.append(tables.pop(table_title))
        text=text[:a]+'\n'+marker+'\n'+text[b:]
    if exam['id']=='cafa2-20230411':
        relocate('\nMoneglia bv','Toelichting:','Organisatieschema, dezelfde relaties in tabelvorm')
        relocate('\nAandelenkapitaal\nAgioreserve\nOverige reserves\nResultaat boekjaar\nTotaal','Specifiek ten behoeve van de overname','Eigen vermogen Cavola per 31 december 2021')
        relocate('\nAandelenkapitaal\nOverige reserves\nResultaat boekjaar\nTotaal','Aandeelhouders van Rapallo','Eigen vermogen Rapallo per 31 december 2022')
    else:
        relocate('\nDhr. Voorn sr.','Toelichting:','Organisatieschema, dezelfde relaties in tabelvorm')
        relocate('\nNoto bv','Gela waardeert haar kapitaalbelang in Patti','Aandelen Patti per aandeelhouder','Het aandelenkapitaal van Patti is als volgt verdeeld:')
    if tables:raise ValueError('Tabel niet geplaatst: '+str(tables.keys()))
    html=[];paragraph=[];mode='p';in_list=False
    def flush():
        nonlocal paragraph,in_list
        if not paragraph:return
        if mode=='li':
            if not in_list:html.append('<ul>');in_list=True
        elif in_list:html.append('</ul>');in_list=False
        html.append('<'+mode+'>'+escape(' '.join(paragraph))+'</'+mode+'>');paragraph=[]
    for raw in text.splitlines():
        line=raw.strip()
        if not line:flush();continue
        if line.startswith('§TABLE'):
            flush()
            if in_list:html.append('</ul>');in_list=False
            html.append(blocks[int(re.search(r'\d+',line)[0])]);continue
        heading=bool(re.match(r'^OPGAVE\b',line))
        sub=bool(re.match(r'^(?:Toelichting:|Gevraagd:?|Aanvullende informatie.*:|Specifiek.*:|Nadere.*:)$',line) or re.fullmatch(r'(?:Cavola|Rapallo|Gela|Noto|Patti) bv',line))
        bullet=re.match(r'^[•\-]\s*(.*)',line)
        paragraph_start=line.startswith(('De financiering van','Moneglia kwalificeert','Begin 2023 koopt','Gela waardeert','Aandeelhouders van','Beide aandeelhouders','Toane waardeert'))
        fresh=heading or sub or bullet or paragraph_start or re.match(r'^(?:NB\s*\d?:|\d+[.]\s|[a-b][.]\s)',line)
        if fresh:
            flush();mode='h3' if heading else 'h4' if sub else 'li' if bullet else 'p'
            paragraph=[bullet[1]] if bullet and bullet[1] else [] if bullet else [line]
            if heading or sub:flush();mode='p'
        else:paragraph.append(line)
    flush()
    if in_list:html.append('</ul>')
    output=''.join(html)
    # Every financial value and percentage in the original remains available.
    original=set(re.findall(r'\d+(?:[.,]\d+)*(?:%)?',BeautifulSoup(section['contentHtml'],'html.parser').get_text(' ',strip=True)))
    shown=set(re.findall(r'\d+(?:[.,]\d+)*(?:%)?',BeautifulSoup(output,'html.parser').get_text(' ',strip=True)))
    if not original<=shown:raise ValueError('Casuswaarde verloren: '+str(original-shown))
    return {'sourceSha256':hashlib.sha256(section['contentHtml'].encode()).hexdigest(),'html':output}
for e in exams:
    if e['id'] in ['cafa2-20230411','cafa2-20231009']:
        s=next(s for s in e['sections'] if s['id']=='opgave-1')
        result[e['id']]={'opgave-1':present(e,s)}
ROOT.joinpath('content/practice/exam-case-presentation.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
ROOT.joinpath('data/exam-case-presentation.js').write_text('window.CAFA2_CASE_PRESENTATION='+json.dumps(result,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
print('Casuspresentatie:',len(result),'casussen, bestaande tabellen op oorspronkelijke positie, zonder dubbele tekst')
