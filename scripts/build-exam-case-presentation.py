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
def prose(text, blocks=None):
    """Unwrap PDF line breaks while retaining headings, questions and bullets."""
    blocks=blocks or [];out=[];pending=[];mode='p';listed=False
    def flush():
        nonlocal pending,listed
        if not pending:return
        if mode=='li' and not listed:out.append('<ul>');listed=True
        if mode!='li' and listed:out.append('</ul>');listed=False
        out.append('<'+mode+'>'+escape(' '.join(pending))+'</'+mode+'>');pending=[]
    for raw in text.splitlines():
        line=raw.strip()
        if not line:flush();continue
        if line.startswith('§TABLE'):
            flush()
            if listed:out.append('</ul>');listed=False
            out.append(blocks[int(re.search(r'\d+',line)[0])]);continue
        heading=line.startswith('OPGAVE ')
        sub=bool(re.match(r'^(?:Gevraagd:?|Toelichting:|Nadere.*:|Aanvullende.*:|Specifiek.*:|Kapitaalbelang.*|Bijlage.*|Gebouwen|Vervoermiddelen|Machine|Lening u/g|Voorraad en verkopen|Crediteuren|Overige kosten)$',line))
        bullet=re.match(r'^(?:[•\-]|o)\s+(.*)',line)
        # A PDF paragraph may start immediately after a bullet without a blank line.
        paragraph=bool(re.match(r'^(?:De bij de|Vanaf begin|Langeloo heeft|Roon importeert|Gluton maakt|Van Store|Veronderstel|Uit de nettowinst|Het koersverloop|Op de respectievelijke|Algemeen geldt|Voor zowel|Alten bezit|Op 1 januari|Per 31 december|Door de schade|Nader onderzoek|De functionele)',line))
        fresh=heading or sub or bullet or paragraph or re.match(r'^(?:NB\s*\d?[:.]|\d+\.\s|[a-d]\.\s)',line)
        if fresh:
            flush();mode='h3' if heading else 'h4' if sub else 'li' if bullet else 'p';pending=[bullet[1] if bullet else line]
            if heading or sub:flush();mode='p'
        else:pending.append(line)
    flush()
    if listed:out.append('</ul>')
    return ''.join(out)

def table(title,headers,rows):
    return '<table><caption>'+escape(title)+'</caption><thead><tr>'+''.join('<th scope="col">'+escape(h)+'</th>' for h in headers)+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+escape(str(v))+'</td>' for v in row)+'</tr>' for row in rows)+'</tbody></table>'

def legacy(exam,section):
    """Explicit column mappings for the six remaining flat 2023 source cases."""
    soup=BeautifulSoup(section['contentHtml'],'html.parser');existing={};blocks=[]
    for t in list(soup.select('table')):
        heading=t.find_previous_sibling('h3');title=heading.get_text(' ',strip=True)
        caption=soup.new_tag('caption');caption.string=title;t.insert(0,caption)
        existing[title]=str(t);heading.decompose();t.decompose()
    text='\n'.join(n.get_text('\n',strip=True) for n in soup.children if getattr(n,'name',None))
    def replace(start,end,html,after=''):
        nonlocal text
        a=text.index(start,text.index(after)+len(after) if after else 0);b=text.index(end,a+len(start)) if end else len(text)
        marker='§TABLE'+str(len(blocks))+'§';blocks.append(html);text=text[:a]+'\n'+marker+'\n'+text[b:]
    def stock():
        nonlocal text
        while '\nDatum\n' in text:
            a=text.index('\nDatum\n');b=re.search(r'\nNB[:.]',text[a:]);assert b
            region=text[a:a+b.start()];dates=re.findall(r'31-12-20\d\d',region)
            headers=['Datum','Voorraad bij ….','Niet-gerealiseerde intercompany winst in voorraad bij….','Interne correctie bij…','Eliminatie t.l.v. aandeel derden','Eliminatie t.l.v. geconsolideerd resultaat']
            replace('\nDatum\n',text[a+b.start():].splitlines()[1],table('Voorraadtabel',headers,[[d,'','','','',''] for d in dates]+[['Toe/afname','','','','','']]))
    def rates(currency,periods,values,after,end):
        replace(periods[0],end,table('Koersverloop '+currency,['Periode','Koers'],[[p,currency+' 1 = € '+v] for p,v in zip(periods,values)]),after)
    dates=['Post','31-12-2022','31-12-2021']
    periods=['Tot en met 1 januari 2021','2 januari 2021 t/m 1 januari 2022','2 januari 2022 t/m 30 juni 2022','1 juli t/m 30 december 2022','31 december 2022','Gemiddelde koers 2022']
    key=exam['id']+'/'+section['id']
    if key=='cafa2-20230411/opgave-2':
        # The existing source summary belongs with the delivery information.
        marker='§TABLE0§';blocks.append(existing.pop('Voorraden bij Assemblage en daarin begrepen winst'))
        text=text.replace('Nadere gegevens over 2022:','Nadere gegevens over 2022:\n'+marker,1)
    elif key=='cafa2-20230411/opgave-3':
        replace('\n1-1-2015','De bij de verkrijging betaalde goodwill',table('Eigen vermogen Norch',['Post','1-1-2015','1-1-2021','31-12-2022'],[
            ['Aandelenkapitaal','€ 200.000','€ 200.000','€ 200.000'],['Agio','€ 400.000','€ 400.000','€ 400.000'],['Overige reserves','€ 3.400.000','€ 4.200.000','€ 4.600.000'],['Resultaat boekjaar','','','€ 800.000'],['Totaal','€ 4.000.000','€ 4.800.000','€ 6.000.000']]))
    elif key=='cafa2-20230411/opgave-4':
        replace('Balans Bora ultimo','Nadere toelichting Bora:',table('Balans Bora (bedragen x NOK 1)',dates,[
            ['Activa','',''],['Machine','300.000','400.000'],['Lening u/g','275.000','300.000'],['Voorraad','305.000','200.000'],['Liquide middelen','205.000','100.000'],['Totaal activa','1085.000','1.000.000'],['Passiva','',''],['Aandelenkapitaal','200.000','200.000'],['Overige reserves','350.000','350.000'],['Resultaat boekjaar','175.000',''],['Crediteuren','360.000','450.000'],['Totaal','1.085.000','1.000.000']])+table('Winst-en-verliesrekening Bora over 2022 (bedragen x NOK 1)',['Post','Kosten / winst','Omzet'],[
            ['Kostprijs van de omzet','425.000',''],['Afschrijving machine','100.000',''],['Afwaardering voorraad','25.000',''],['Overige kosten','350.000',''],['Winst','175.000',''],['Omzet','','1.075.000'],['Totaal','1.075.000','1.075.000']]))
        rates('NOK',periods,['0,09','0,11','0,10','0,12','0,13','0,11'],'Het koersverloop','Veronderstel')
        replace('Balans Store ultimo','Veronderstel dat Alten',table('Balans Store (bedragen x NOK 1)',dates,[
            ['Activa','1.500.000','1.450.000'],['Passiva','',''],['Aandelenkapitaal','100.000','100.000'],['Overige reserves','1.250.000','1.100.000'],['Resultaat boekjaar','150.000','175.000'],['Schulden','','75.000'],['Totaal','1.500.000','1.450.000']]))
        rates('NOK',periods,['0,09','0,11','0,10','0,12','0,13','0,11'],'Van Store','Gevraagd:')
    elif key=='cafa2-20231009/opgave-2':
        replace('Verloop van de aantallen vaten','Gluton maakt',existing.pop('Verloop vaten bij Seal-it in 2022'))
        replace('\n050','Nadere gegevens:',table('Grootboekrekeningen Gluton',['Nummer','Rekening'],list(zip(['050','075','180','920','940','941','980'],['Deelneming in Seal-it','Voorziening belastingen','Overlopende passiva','Resultaat deelneming in Seal-it','Niet-gerealiseerde winst op leveringen aan Seal-it','Gerealiseerde winst op leveringen aan Seal-it','Belastinglast']))))
        replace('Vennootschappelijke winst-en-verliesrekening Gluton',None,table('Vennootschappelijke winst-en-verliesrekening Gluton bv (x € 1) over 2022',['Post','Kosten / winst','Opbrengsten'],[
            ['Kostprijs omzet','3.750.000',''],['Diverse overige kosten','1.051.800',''],['Belastinglast','32.000',''],['Winst (na belastingen)','128.000',''],['Omzet','','4.500.000'],['Doorberekende directiekosten aan Seal-it','','200.000'],['Rente lening u/g','','105.000'],['Resultaat deelneming in Seal-it','','156.800'],['Totaal','4.961.800','4.961.800']])+table('Vennootschappelijke winst-en-verliesrekening Seal-it bv (x € 1) over 2022',['Post','Kosten / winst','Opbrengsten'],[
            ['Kostprijs omzet','4.560.000',''],['Directiekosten','200.000',''],['Diverse overige kosten','175.000',''],['Rentekosten lening o/g','105.000',''],['Belastinglast','56.000',''],['Winst (na belastingen)','224.000',''],['Omzet','','5.320.000'],['Totaal','5.320.000','5.320.000']]))
    elif key=='cafa2-20231009/opgave-3':
        replace('\n31-12-2021','De bij de verkrijging betaalde goodwill',existing.pop('Eigen vermogen Roon per 31 december 2021'))
    elif key=='cafa2-20231009/opgave-4':
        replace('\nActiva','De post machines betreft',table('Balansposten TCC (x GBP 1)',dates,[['Activa: Machines','660.000','600.000'],['Passiva: Aandelenkapitaal','2.500.000','2.500.000'],['Overige reserves','950.000','800.000'],['Resultaat boekjaar','150.000','250.000']]))
        replace('Het verloop van de post machines','Uit de nettowinst',table('Verloop machines over 2022 (GBP)',['Post','Bedrag'],[['Stand 31 december 2021','600.000'],['Af: afschrijving','-150.000'],['Stand na afschrijving','450.000'],['Bij: investering d.d. 1 april 2022','240.000'],['Af: afschrijving','-30.000'],['Boekwaarde nieuwe machine','210.000'],['Stand 31 december 2022','660.000']]))
        p=['Tot en met 1 januari 2022','2 januari 2022 t/m 30 juni 2022','1 juli t/m 30 december 2022','31 december 2022','Gemiddelde koers 2022']
        rates('GBP',p,['1.12','1,11','1,13','1,14','1,125'],'Het koersverloop van de Engelse Pond','Gevraagd:')
        replace('Balans Genser','Nadere toelichting Genser:',table('Balans Genser (bedragen x NOK 1)',dates,[
            ['Activa','',''],['Gebouwen','1.010.000','860.000'],['Vervoermiddelen','800.000','1.440.000'],['Lening u/g','130.000','100.000'],['Voorraad','505.000','300.000'],['Liquide middelen','651.000','76.000'],['Totaal activa','3.096.000','2.776.000'],['Passiva','',''],['Aandelenkapitaal','750.000','750.000'],['Overige reserves','1.271.000','1.271.000'],['Resultaat boekjaar','570.000',''],['Langlopende lening','380.000','380.000'],['Crediteuren','125.000','375.000'],['Totaal','3.096.000','2.776.000']])+table('Winst-en-verliesrekening Genser over 2022 (bedragen x NOK 1)',['Post','Kosten / winst','Omzet'],[
            ['Kostprijs van de omzet','525.000',''],['Afschrijving gebouwen','50.000',''],['Afschrijving vervoermiddelen','480.000',''],['Afwaardering vervoermiddelen','160.000',''],['Afwaardering voorraad','30.000',''],['Overige kosten, rentebaten en -lasten','475.000',''],['Winst','570.000',''],['Omzet','','2.290.000'],['Totaal','2.290.000','2.290.000']]))
        rates('NOK',p,['0,11','0,10','0,12','0,13','0,11'],'Het koersverloop van de Noorse Kroon','Gevraagd:')
    if existing:raise ValueError('Ongeplaatste brongegevens: '+str(existing))
    stock()
    return prose(text,blocks)

def native(section):
    soup=BeautifulSoup(section['contentHtml'],'html.parser')
    for pre in list(soup.select('pre')):
        if not pre.parent:continue
        texts=[pre.get_text()];following=pre.find_next_sibling()
        while following and following.name=='pre':
            texts.append(following.get_text());next_node=following.find_next_sibling();following.decompose();following=next_node
        pre.replace_with(BeautifulSoup(prose('\n'.join(texts)),'html.parser'))
    for p in list(soup.find_all('p',recursive=False)):
        text=p.get_text(' ',strip=True)
        if text.startswith('OPGAVE '):p.name='h3'
        elif re.match(r'^Deel\s+[\dIV]+[:.]',text):
            # Separate a heading from the following prose when the source joined it.
            m=re.match(r'^(Deel\s+[\dIV]+[:.]\s+.*?\(hierna [^)]+\))\s+(.+)$',text)
            if m:
                h=soup.new_tag('h4');h.string=m[1];p.insert_before(h);p.clear();p.string=m[2]
            elif len(text)<160:p.name='h4'
    return str(soup)

for e in exams:
    result[e['id']]={}
    for s in e['sections']:
        if e['id'] in ['cafa2-20230411','cafa2-20231009']:
            output=present(e,s)['html'] if s['id']=='opgave-1' else legacy(e,s)
        else:output=native(s)
        original=set(re.findall(r'\d+(?:[.,]\d+)*(?:%)?',BeautifulSoup(s['contentHtml'],'html.parser').get_text(' ',strip=True)))
        shown=set(re.findall(r'\d+(?:[.,]\d+)*(?:%)?',BeautifulSoup(output,'html.parser').get_text(' ',strip=True)))
        if not original<=shown:raise ValueError(e['id']+'/'+s['id']+' Casuswaarde verloren: '+str(original-shown))
        if '<pre' in output:raise ValueError('Vaste tekstbreedte bleef behouden')
        result[e['id']][s['id']]={'sourceSha256':hashlib.sha256(s['contentHtml'].encode()).hexdigest(),'html':output}
ROOT.joinpath('content/practice/exam-case-presentation.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
ROOT.joinpath('data/exam-case-presentation.js').write_text('window.CAFA2_CASE_PRESENTATION='+json.dumps(result,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
print('Casuspresentatie:',sum(len(s) for s in result.values()),'casussen met brongebonden alinea’s, opsommingen en tabellen')
