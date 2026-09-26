"""Reviewed layout repairs for ambiguous columns and question-part boundaries.

Amounts and account names come from the existing exam catalogue. Where the 2023
transcription attached a number to a neighbouring question, the matching working
is explicitly reassembled here; source HTML stays attached to every MC record.
"""
import json, subprocess
from pathlib import Path
from html import escape
root=Path(__file__).resolve().parent.parent
exams=json.loads(subprocess.check_output(['node',str(root/'scripts/exam-practice-source.mjs'),'--json']))
config={}
def entry(key,**kwargs):config.setdefault('cafa2-'+key,{}).update(kwargs)
def table(headers,rows,caption=''):
    return '<div class="table-wrap"><table class="practice-answer-table">'+('<caption>'+escape(caption)+'</caption>' if caption else '')+'<thead><tr>'+''.join('<th scope="col">'+escape(str(x))+'</th>' for x in headers)+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+escape(str(x))+'</td>' for x in r)+'</tr>' for r in rows)+'</tbody></table></div>'
def jp(rows,caption='Journaalpost'):
    return table(['Omschrijving grootboekrekening','Debet (€)','Credit (€)'],rows,caption)
def calc(rows,caption='Berekening'):return table(['Omschrijving','Bedrag (€)'],rows,caption)
def p(text):return '<p>'+escape(text)+'</p>'
def prompts(key,subjects):
    date,qid=key.split('/');q=next(q for e in exams if date in e['id'] for q in e['questions'] if q['id']==qid)
    lead=q['prompt'].split('betrekking tot:')[0] if 'betrekking tot:' in q['prompt'] else q['prompt'].split('gemaakt:')[0]
    return [lead+'\nOnderdeel '+chr(97+i)+': '+s for i,s in enumerate(subjects)]

for key,subjects,starts in [
 ('20210419/vraag-13',['het eigen vermogen van ApeldoornMedical','de onderlinge leveringen van goederen'],[r'GEVRAAGD 5\.A',r'GEVRAAGD 5\.B']),
 ('20210419/vraag-14',['het resultaat deelneming ApeldoornMedical','de onderlinge leveringen van goederen'],[r'GEVRAAGD 6\.A',r'GEVRAAGD 6\.B']),
 ('20210419/vraag-21',['de goodwill','het eigen vermogen van Modern en het belang derden','de onderlinge leveringen van goederen'],[r'GEVRAAGD 4\.A',r'GEVRAAGD 4\.B\.1',r'GEVRAAGD 4\.C\.1']),
 ('20210419/vraag-28',['resultaat deelneming Helena','uitgekeerd dividend','omrekeningsverschillen. Geef ook B of WV aan'],[r'^a\. Resultaat',r'^b\. Uitgekeerde',r'^c\. Omrekenings'])]:
    entry(key,prompts=prompts(key,subjects),starts=starts)

for key,starts in {
 '20211006/vraag-16':[r'Gevraagd 3\.A\.I\s',r'Gevraagd 3\.A\.II',r'Gevraagd 3\.B\.',r'Gevraagd 3\.C\.I'],
 '20220411/vraag-12':[r'GEVRAAGD 4A',r'GEVRAAGD 4B'],
 '20220411/vraag-14':[r'GEVRAAGD 6\.A',r'GEVRAAGD 6\.B\.1',r'GEVRAAGD 6\.C'],
 '20220411/vraag-18':[r'^\s*4\.A\. Deelneming',r'^\s*4\.B\. Afschrijving'],
 '20221006/vraag-14':[r'GEVRAAGD 14\.A\.1',r'GEVRAAGD 14\.B\.1'],
 '20221006/vraag-20':[r'^a\. Eliminatie - deelneming',r'^b\. Eliminatie',r'^c\. Eliminatie'],
}.items():entry(key,starts=starts)
entry('20240930/vraag-1',nodeStarts=[r'^Deelneming$',r'^Waardering$'])
entry('20240930/vraag-17',nodeStarts=[r'^Eliminatie: resultaat van',r'^Eliminatie: managementfee',r'^Eliminatie: intercompanyleveringen'])

# Bookings with visually ambiguous direction in the old text columns.
entry('20220411/vraag-12',display=[
 jp([['Deelnemingen','690.000',''],['Resultaat uit deelnemingen','','690.000']])+p('70% × € 600.000 + 60% × € 450.000 = € 690.000.'),
 jp([['Te vorderen dividend / Bank','105.000',''],['Deelnemingen','','105.000']])+p('70% × € 150.000 = € 105.000.')])

# April 2023: displaced PDF text columns in the already imported HTML.
entry('20230411/vraag-2',display=[calc([
 ['Zichtbaar eigen vermogen','1.950.000'],['Fout in administratie','+60.000'],['Gecorrigeerd eigen vermogen','2.010.000'],
 ['Fair value gebouw','+500.000'],['Fair value onderhanden projecten','+130.000'],['Voorziening groot onderhoud','−80.000'],
 ['Nettovermogenswaarde','2.560.000'],['Aandeel 80%','2.048.000'],['Betaald','2.500.000'],['Goodwill','452.000']])])
entry('20230411/vraag-3',display=[jp([['Deelneming Cavola','2.048.000',''],['Goodwill','452.000',''],['Aandelenkapitaal','','1.000.000'],['Agio','','500.000'],['Bank','','1.000.000']])+p('10.000 uitgegeven aandelen Moneglia × € 100 nominaal = € 1.000.000 kapitaal. Reële waarde € 150: agio € 500.000. Bijbetaling € 1.000.000. De bronbedragen bij deze journaalpost waren in de bestaande transcriptie onder vraag 4 terechtgekomen.')])
entry('20230411/vraag-4',display=[calc([['Resultaat Cavola volgens eigen grondslagen','500.000'],['Extra afschrijving gebouw','−25.000'],['Voorziening groot onderhoud','+80.000'],['Onderhanden projecten','−30.000'],['Gecorrigeerd resultaat','525.000'],['Aandeel 80%','420.000']])])
entry('20230411/vraag-5',prompts=[
 'Geef de journaalpost van het resultaat deelneming Cavola in de enkelvoudige jaarrekening van Moneglia over 2022.',
 'Geef de journaalpost van het ontvangen dividend van Cavola in de enkelvoudige jaarrekening van Moneglia over 2022.',
 'Geef de journaalpost van de afschrijving goodwill Cavola in de enkelvoudige jaarrekening van Moneglia over 2022.'],display=[
 jp([['Deelneming Cavola','420.000',''],['Resultaat deelneming Cavola','','420.000']]),
 jp([['Bank','140.000',''],['Deelneming Cavola','','140.000']]),
 jp([['Afschrijvingskosten goodwill','45.200',''],['Goodwill Cavola','','45.200']])+p('€ 452.000 goodwill uit vraag 2 / 10 jaar volgens de casus = € 45.200. Het bedrag ontbrak naast de rekeningen in de bestaande transcriptie.')])
entry('20230411/vraag-7',prompts=[
 'Geef de journaalposten die Rapallo maakt van de inkoop van haar eigen aandelen.',
 'Geef de journaalposten die Toane maakt van de door Rapallo ingekochte eigen aandelen.'],display=[
 jp([['Overige reserves','220.000',''],['Bank','','220.000']]),
 jp([['Bank','220.000',''],['Deelneming Rapallo','','190.000'],['Resultaat deelneming','','30.000']], 'Verkoop aandelen aan Rapallo')+
 jp([['Overige reserves (alternatief: resultaat deelneming Rapallo)','14.000',''],['Deelneming Rapallo','','14.000']], 'Aanpassing resterend belang')+
 p('Toane: 60% × € 760.000 − € 190.000 = € 266.000; na inkoop 46,67% × € 540.000 = € 252.000. Afname € 14.000. Beide debetrekeningen zijn volgens het bronmodel toegestaan.')])
entry('20230411/vraag-11',prompts=[
 'Geef de intracomptabele journaalpost inzake de sidestreamleveringen van Gieterij aan Assemblage.',
 'Geef de intracomptabele journaalposten inzake de downstreamleveringen van Bruggeman aan Assemblage.'],display=[
 jp([['Resultaat deelnemingen','11.200',''],['Deelneming in Gieterij','','11.200']])+p('80% × € 14.000 = € 11.200.'),
 jp([['Overlopende passiva','18.000',''],['Gerealiseerde winst door transacties met deelnemingen','','18.000'],['Belastinglast','3.600',''],['Voorziening belastingen','','3.600']])+p('20% × € 18.000 = € 3.600.')])
entry('20230411/vraag-12',prompts=[
 'Geef de eliminatieboeking voor de doorlevering aan derden in de geconsolideerde winst-en-verliesrekening over 2022.',
 'Geef de eliminatieboeking voor de toename van de voorraad in de geconsolideerde winst-en-verliesrekening over 2022.'],display=[
 jp([['Netto omzet','500.000',''],['Kostprijs netto omzet','','500.000']]),
 jp([['Netto omzet','100.000',''],['Kostprijs netto omzet','','80.000'],['Resultaat na belastingen','','11.200'],['Belastinglast','','2.800'],['Aandeel derden','','4.800'],['Belastinglast','','1.200']])+p('Bij aandeel derden staat in de transcriptie D. De toename van de niet-gerealiseerde winst vereist hier credit: € 80.000 + € 11.200 + € 2.800 + € 4.800 + € 1.200 = € 100.000. Deze herkenbare bronafwijking is expliciet gecorrigeerd; het oorspronkelijke model blijft bij Bron beschikbaar.')])
entry('20230411/vraag-13',prompts=[
 'Geef de eliminatieboeking voor de winst in de eindvoorraad bij de geconsolideerde balans over 2022.',
 'Geef de eliminatieboeking voor het invoegen van de winst in de beginvoorraad bij de geconsolideerde balans over 2022.'],display=[
 jp([['Overlopende passiva','108.000',''],['Resultaat boekjaar','9.600',''],['Voorziening belastingen','2.400',''],['Voorraden','','120.000']]),
 jp([['Overige reserves','11.200',''],['Resultaat boekjaar','','11.200']])])
entry('20230411/vraag-14',display=[
 jp([['Lening o/g Bruggeman','225.000',''],['Lening u/g Gieterij','','225.000']])+p('€ 250.000 − € 25.000 = € 225.000.'),
 jp([['Rentebaten Bruggeman','4.791,66',''],['Rentekosten Gieterij','','4.791,66']])+p('2% × € 250.000 × 7/12 + 2% × € 225.000 × 5/12. De bedragen voor de vragen 12, 13 en 14 waren samengevoegd in de bestaande transcriptie; zij zijn hier aan hun bijbehorende rekeningen gekoppeld.')])
entry('20230411/vraag-16',display=[
 jp([['Aandelenkapitaal','50.000',''],['Agio','100.000',''],['Overige reserves','850.000',''],['Goodwill','200.000',''],['Deelneming','','1.200.000']], 'Verwerving 25% belang')+
 jp([['Aandelenkapitaal','110.000',''],['Agio','220.000',''],['Overige reserves','2.310.000',''],['Goodwill','360.000',''],['Deelneming','','3.000.000']], 'Verwerving 55% belang'),
 jp([['Overige reserves','272.000',''],['Resultaat boekjaar','72.000',''],['Goodwill','','344.000']])+p('Oude goodwill € 200.000 ten laste van reserves; goodwill nieuwe verwerving € 360.000 / 5 jaar = € 72.000 per jaar.')])
entry('20230411/vraag-18',display=[
 jp([['Dividendopbrengst','240.000',''],['Resultaat na belastingen','','240.000']]),
 jp([['Omzet','2.600.000',''],['Kostprijs','','2.600.000']], 'Doorlevering in het boekjaar')+
 jp([['Resultaat na belastingen','10.240',''],['Belastinglast','2.560',''],['Aandeel derden','2.560',''],['Belastinglast','640',''],['Kostprijs','','16.000']], 'Vrijval winst in afname voorraad')+
 p('De bronkop noemt “toename voorraad”; de voorraadtabel toont een afname. De bedragen en boekingsrichting volgen het bronmodel.')])
entry('20230411/vraag-25',prompts=[
 'Geef de journaalpost voor het resultaat deelneming van Alten over 2022.',
 'Geef de journaalpost voor het uitgekeerde dividend dat Alten over 2022 ontvangt.'],display=[
 jp([['Deelneming (bron: Bora)','46.250',''],['Reserve omrekeningsverschillen','','29.750'],['Resultaat deelneming','','16.500']])+p('Resultaat: 150.000 × € 0,11 = € 16.500. De oorspronkelijke vraag noemt Store; het bronmodel noemt Bora. Deze bronafwijking is behouden.'),
 jp([['Bank','2.500',''],['Deelneming','','2.500']])+p('25.000 × € 0,10 = € 2.500.')])

# October 2023 journals, rejoined with their recorded debet/credit amounts.
entry('20231009/vraag-2',display=[jp([['Deelneming Gela bv','3.850.000',''],['Goodwill','2.870.000',''],['Aandelenkapitaal','','5.000.000'],['Agio','','1.720.000']])+p('Deelneming 70% × € 5.500.000; goodwill € 6.720.000 − € 3.850.000; aandelenkapitaal 20.000 × € 250; agio saldopost.')])
entry('20231009/vraag-7',display=[
 jp([['Bank','40.000',''],['Deelneming Patti','','40.000']])+p('50/75 × € 60.000 = € 40.000.'),
 jp([['Bank','20.000',''],['Resultaat deelneming Patti / Dividendopbrengst','','20.000']])+p('25/75 × € 60.000 = € 20.000.')])
entry('20231009/vraag-10',display=[jp([['Overlopende passiva','7.000',''],['Gerealiseerde winst op leveringen aan Seal-it','','7.000'],['Belastinglast','1.400',''],['Voorziening belastingen','','1.400']])+p('20% × € 7.000 = € 1.400.')])
entry('20231009/vraag-11',display=[jp([['Deelneming in Seal-it','156.800',''],['Resultaat deelneming in Seal-it','','156.800']])+p('70% × € 224.000 = € 156.800.')])
entry('20231009/vraag-12',prompts=[
 'Geef de eliminatieboeking voor het resultaat deelneming in de geconsolideerde winst-en-verliesrekening over 2022.',
 'Geef de eliminatieboeking voor de onderling doorberekende directiekosten over 2022.',
 'Geef de eliminatieboeking voor de onderlinge rente over 2022.',
 'Geef de eliminatieboekingen voor de intercompanyleveringen over 2022.'],display=[
 jp([['Resultaat deelneming in Seal-it','156.800',''],['Aandeel derden','67.200',''],['Resultaat na belastingen Seal-it','','224.000']]),
 jp([['Doorberekende directiekosten aan Seal-it','200.000',''],['Directiekosten Seal-it','','200.000']]),
 jp([['Rente lening u/g Gluton','105.000',''],['Rentekosten lening o/g','','105.000']]),
 jp([['Omzet','4.500.000',''],['Kostprijs omzet','','4.500.000']], 'Doorlevering')+
 jp([['Gerealiseerde winst op leveringen aan Seal-it','7.000',''],['Resultaat na belastingen','2.400',''],['Belastinglast','600',''],['Kostprijs omzet','','10.000']], 'Afname intercompanywinst')])
entry('20231009/vraag-17',display=[jp([['Deelneming in Roon','5.800.000',''],['Bank','','3.800.000'],['Langlopende lening DGF','','2.000.000']])])
entry('20231009/vraag-18',display=[jp([['Bank','360.000',''],['Deelneming in Roon','','360.000']])])
entry('20231009/vraag-20',display=[
 jp([['Aandelenkapitaal','300.000',''],['Agio','420.000',''],['Overige reserves','3.960.000',''],['Goodwill','760.000',''],['Deelneming','','5.440.000']]),
 jp([['Aandelenkapitaal','200.000',''],['Agio','280.000',''],['Overige reserves','2.640.000',''],['Resultaat boekjaar 2022','48.000',''],['Belang derden','','3.168.000']]),
 jp([['Resultaat boekjaar','152.000',''],['Goodwill','','152.000']]),
 jp([['Resultaat boekjaar','25.920',''],['Voorziening latente belastingen','6.480',''],['Belang derden','17.280',''],['Voorziening latente belastingen','4.320',''],['Voorraad','','54.000']])])
entry('20231009/vraag-23',display=[jp([['Deelneming TCC','239.000',''],['Reserve omrekeningsverschillen','','70.250'],['Resultaat deelneming','','168.750']])+calc([['Eigen vermogen begin: 3.550.000 × (1,14 − 1,12)','71.000'],['Dividend: −100.000 × (1,14 − 1,11)','−3.000'],['Resultaat: 150.000 × (1,14 − 1,125)','2.250'],['Totaal omrekeningsverschil','70.250']])])

# Explicit stock matrices when their columns were flattened in the catalogue.
stockheaders=['Datum','Voorraad bij afnemer','Niet-gerealiseerde intercompanywinst','Interne correctie','Eliminatie aandeel derden','Eliminatie geconsolideerd resultaat']
for key,rows,caption in [
 ('20230411/vraag-8',[['31-12-2021','250.000','50.000','35.000','15.000','0'],['31-12-2022','350.000','70.000','49.000','21.000','0'],['Toename','100.000','20.000','14.000','6.000','0']],'Gieterij aan Assemblage, sidestream niet afnemend'),
 ('20230411/vraag-9',[['31-12-2021','350.000','140.000','126.000','0','14.000'],['31-12-2022','300.000','120.000','108.000','0','12.000'],['Afname','50.000','20.000','18.000','0','2.000']],'Bruggeman aan Assemblage, downstream'),
 ('20230411/vraag-17',[['31-12-2021','400.000','40.000','0','8.000','32.000'],['31-12-2022','240.000','24.000','0','4.800','19.200'],['Afname','160.000','16.000','0','3.200','12.800']],'Norch aan Langeloo, upstream'),
 ('20231009/vraag-8',[['31-12-2021','90.000','15.000','10.500','0','4.500'],['31-12-2022','30.000','5.000','3.500','0','1.500'],['Afname','60.000','10.000','7.000','0','3.000']],'Gluton aan Seal-it, downstream'),
 ('20231009/vraag-19',[['31-12-2021','0','0','0','0','0'],['31-12-2022','540.000','54.000','0','21.600','32.400'],['Toename','540.000','54.000','0','21.600','32.400']],'Roon aan Norch, upstream')]:
    entry(key,display=[table(stockheaders,rows,caption)],schemas=[{'headers':stockheaders,'rows':[[r[0]]+['']*5 for r in rows]}])


entry('20210419/vraag-10',display=[jp([['Resultaat deelneming ApeldoornMedical','7.680',''],['Deelneming in ApeldoornMedical','','7.680']])+p('€ 9.600 × (100% − 20%) = € 7.680.')])
entry('20211006/vraag-11',display=[jp([['Resultaat deelnemingen','363.600',''],['Aandeel derden','178.000',''],['Resultaat na belastingen Power4You','','221.600'],['Resultaat na belastingen ChargeIT','','320.000']])+p('Aandeel derden = 25% × € 200.000 + 40% × € 320.000 = € 178.000.')])
entry('20211006/vraag-23',display=[jp([['Resultaat deelneming','56.500',''],['Reserve omrekeningsverschillen','1.260',''],['Deelneming','','57.760']])+calc([['Vermogen 31-12-2019: £ 730.000 × (1,11 − 1,12)','−7.300'],['Dividend: −£ 50.000 × (1,11 − 1,20)','+4.500'],['Resultaat: −£ 50.000 × (1,11 − 1,13)','+1.000'],['Totaal omrekeningsverschil','−1.800'],['Aandeel 70%','−1.260']])+p('De journaalpost is met de bronbedragen weergegeven. De controleberekening in hetzelfde model gebruikt voor het resultaat het aandeel 70% (€ 39.550); die afwijking is niet stilzwijgend verwerkt in deze bronjournaalpost.')])
entry('20221006/vraag-10',display=[jp([['Niet-gerealiseerde boekwinst verkochte machine','13.500',''],['Overlopende passiva','','13.500'],['Voorziening belastingen','2.700',''],['Belastinglast','','2.700']])+p('20% × € 13.500 = € 2.700.')])
entry('20221006/vraag-20',display=[
 jp([['Geplaatst kapitaal','40.000',''],['Agioreserve','80.000',''],['Overige reserves','160.000',''],['Goodwill','220.000',''],['Deelneming in Predore','','500.000']], 'Deelneming')+
 jp([['Geplaatst kapitaal','60.000',''],['Agioreserve','120.000',''],['Overige reserves','300.000',''],['Resultaat boekjaar','150.000',''],['Belang derden','','630.000']], 'Belang derden')+p('Het model accepteert ook één gecombineerde journaalpost met dezelfde totalen.'),
 jp([['Overige reserves','44.000',''],['Resultaat boekjaar','44.000',''],['Goodwill','','88.000']]),
 jp([['Resultaat boekjaar','20.000',''],['Overige reserves','','20.000']])])
entry('20221006/vraag-26',display=[jp([['Deelneming Kröne Blatten','218.720',''],['Resultaat deelneming','','171.080'],['Reserve omrekenverschillen','','47.640']])+p('Resultaat deelneming: CHF 182.000 × € 0,94 = € 171.080.')])
entry('20211006/vraag-9',display=[
 table(stockheaders,[['31-12-2019','320.000','64.000','38.400','0','25.600'],['31-12-2020','480.000','96.000','57.600','0','38.400'],['Toename','160.000','32.000','19.200','0','12.800']],'Moderna aan ChargeIT')+p('Interne correctie 60%, aandeel derden 0%, geconsolideerd resultaat 40%. Doorlevering volgens het model: € 4.000.000 − € 160.000 = € 3.840.000. De ingevulde matrix is uit de casusbedragen en deze verdeling opgebouwd; het bestaande antwoordmodel bevatte alleen de doorleveringsberekening.'),
 table(stockheaders,[['31-12-2019','760.000','228.000','136.800','57.000','34.200'],['31-12-2020','600.000','180.000','108.000','45.000','27.000'],['Afname','160.000','48.000','28.800','12.000','7.200']],'Power4You aan ChargeIT')+p('Interne correctie 60%, aandeel derden 25%, geconsolideerd resultaat 15%. Het belang neemt af van 75% bij de leverancier naar 60% bij de afnemer. De matrix is uit de casusbedragen opgebouwd; de bron noemt bij de doorlevering € 2.400.000.')])
# Stock tables with empty zero columns or a year wrapped onto the next line.
for key,rows,caption,zero in [
 ('20210419/vraag-9',[['31-12-2019','160.000','32.000','19.200','12.800','0'],['31-12-2020','240.000','48.000','28.800','19.200','0'],['Toename','80.000','16.000','9.600','6.400','0']],'ApeldoornMedical aan Clinimed',False),
 ('20210419/vraag-15',[['31-12-2019','0','0','0','0','0'],['31-12-2020','21.000','3.000','1.800','0','1.200'],['Toename','21.000','3.000','1.800','0','1.200']],'Inpakmachine Clinimed aan ApeldoornMedical',False),
 ('20211006/vraag-14',[['31-12-2019','500.000','100.000','0','0','100.000'],['31-12-2020','400.000','80.000','0','0','80.000'],['Afname','100.000','20.000','0','0','20.000']],'Baldetti aan Vinsanto',False),
 ('20220411/vraag-15',[['31-12-2020','600.000','120.000','0','48.000','72.000'],['31-12-2021','800.000','160.000','0','64.000','96.000'],['Toename','200.000','40.000','0','16.000','24.000']],'Bisseling aan Energizer',False),
 ('20221006/vraag-9',[['31-12-2019','0','0','0','0','0'],['31-12-2020','60.000','15.000','13.500','0','1.500'],['Toename','60.000','15.000','13.500','0','1.500']],'Machine Molina aan Domenico',True),
 ('20221006/vraag-11',[['31-12-2020','60.000','15.000','13.500','0','1.500'],['31-12-2021','40.000','10.000','9.000','0','1.000'],['Afname','−20.000','−5.000','−4.500','0','−500']],'Machine Molina aan Domenico',True),
 ('20221006/vraag-12',[['31-12-2020','160.000','16.000','14.400','0','1.600'],['31-12-2021','180.000','18.000','16.200','0','1.800'],['Toename','20.000','2.000','1.800','0','200']],'Goederen Molina aan Domenico',True),
 ('20221006/vraag-17',[['31-12-2020','200.000','75.000','0','45.000','30.000'],['31-12-2021','160.000','60.000','0','36.000','24.000'],['Afname','40.000','15.000','0','9.000','6.000']],'Predore aan Collina',False)]:
    headers=stockheaders[:4]+[stockheaders[5]] if zero else stockheaders
    if zero:rows=[r[:4]+[r[5]] for r in rows]
    entry(key,display=[table(headers,rows,caption)],schemas=[{'headers':headers,'rows':[[r[0]]+['']*(len(headers)-1) for r in rows]}])

# Real tables for temporal/closing-rate calculations whose source columns were separated.
fxheaders=['Omschrijving / datum','Bedrag in NOK','Koers (€ per NOK)','Bedrag in €']
entry('20230411/vraag-10',display=[calc([['Deelneming Gieterij: 70% × € 4.000.000','2.800.000'],['Intracomptabele correctie: 80% × € 35.000','−28.000'],['Boekwaarde Gieterij','2.772.000'],['Boekwaarde Assemblage: 90% × € 6.000.000','5.400.000'],['Totaal deelnemingen','8.172.000']])])
entry('20230411/vraag-15',display=[calc([['Verwerving 25%: € 1.200.000 − 25% × € 4.000.000','200.000'],['Verwerving 55%: € 3.000.000 − 55% × € 4.800.000','360.000'],['Totale goodwill','560.000']])])
entry('20230411/vraag-21',display=[
 table(fxheaders,[['Machines','300.000','0,11','33.000']]),
 table(['Inkoopdatum','Aantal','Prijs (NOK)','Bedrag (NOK)','Koers','Bedrag (€)'],[['10-01-2022','10.000','2,00','20.000','0,13','2.600'],['01-09-2022','60.000','4,75','285.000','0,12','34.200'],['Totaal','70.000','','305.000','','36.800']])])
entry('20230411/vraag-22',display=[
 table(['Inkoopdatum','Aantal','Prijs (NOK)','Bedrag (NOK)','Koers','Bedrag (€)'],[['Beginvoorraad','50.000','4,00','200.000','0,11','22.000'],['10-01-2022','50.000','4,50','225.000','0,10','22.500'],['Totaal','100.000','','425.000','','44.500']]),
 calc([['Afwaardering: 10.000 × (NOK 4,50 − NOK 2,00) × € 0,10','2.500'],['Koersverschil: NOK 20.000 × (€ 0,10 − € 0,13)','−600'],['Totaal','1.900']]),
 table(fxheaders,[['Afschrijving machines','100.000','0,11','11.000']])])
entry('20230411/vraag-23',display=[table(fxheaders,[['Monetaire posten begin: 300.000 + 100.000 − 450.000','−50.000','0,11','−5.500'],['Inkoop 10-01-2022','−270.000','0,10','−27.000'],['Verkoop 20-04-2022','700.000','0,10','70.000'],['Inkoop 01-09-2022','−285.000','0,12','−34.200'],['Verkoop 13-11-2022','375.000','0,12','45.000'],['Overige kosten','−350.000','0,11','−38.500'],['Theoretische eindstand','120.000','','9.800'],['Werkelijke eindstand: 275.000 + 205.000 − 360.000','120.000','0,13','15.600'],['Koerswinst','','','5.800']])])
entry('20230411/vraag-24',display=[calc([['Eigen vermogen begin: 1.375.000 × (0,13 − 0,11)','27.500'],['Dividend: −25.000 × (0,13 − 0,10)','−750'],['Resultaat: 150.000 × (0,13 − 0,11)','3.000'],['Positief omrekeningsverschil','29.750']])])
entry('20231009/vraag-22',display=[table(['Omschrijving','Bedrag (GBP)','Koers','Bedrag (€)'],[['Machines per 31-12-2022','660.000','1,14','752.400']])+p('De casus vermeldt GBP 660.000. In de berekeningsregel van het bronmodel staat abusievelijk GBP 660.000.000; de gegeven uitkomst € 752.400 sluit aan op het casusbedrag.')])
entry('20231009/vraag-24',prompts=[
 'Geef een gespecificeerde berekening van de boekwaarde van de gebouwen van Genser per 31 december 2022 in euro’s.',
 'Geef een gespecificeerde berekening van de boekwaarde van de vervoermiddelen van Genser per 31 december 2022 in euro’s.',
 'Geef een gespecificeerde berekening van de boekwaarde van de voorraad van Genser per 31 december 2022 in euro’s.'],display=[
 table(fxheaders,[['Gebouwen begin 31-12-2021','860.000','0,11','94.600'],['Afschrijving bestaande gebouwen','−40.000','0,11','−4.400'],['Boekwaarde bestaande gebouwen','820.000','','90.200'],['Aankoop loods 01-07-2022','200.000','0,12','24.000'],['Afschrijving loods','−10.000','0,12','−1.200'],['Boekwaarde loods','190.000','','22.800'],['Totale boekwaarde 31-12-2022','1.010.000','','113.000']]),
 table(fxheaders,[['Boekwaarde begin 31-12-2021','1.440.000','0,11','158.400'],['Afschrijving','−480.000','0,11','−52.800'],['Afboeking vrachtwagen','−160.000','0,11','−17.600'],['Boekwaarde 31-12-2022','800.000','','88.000']]),
 table(['Inkoopdatum / mutatie','Aantal','Prijs (NOK)','Bedrag (NOK)','Koers','Bedrag (€)'],[['02-01-2022','20.000','4,50','90.000','0,10','9.000'],['Beschadigde voorraad 31-12-2022','10.000','1,50','15.000','0,13','1.950'],['15-08-2022','80.000','5,00','400.000','0,12','48.000'],['Totaal','110.000','','505.000','','58.950']])])
entry('20231009/vraag-25',display=[table(fxheaders,[['Monetaire posten begin: 100.000 + 76.000 − 380.000 − 375.000','−579.000','0,11','−63.690'],['Inkoop 02-01-2022','−360.000','0,10','−36.000'],['Verkoop 15-02-2022','1.650.000','0,10','165.000'],['Inkoop 15-08-2022','−400.000','0,12','−48.000'],['Verkoop 30-11-2022','640.000','0,12','76.800'],['Aankoop loods 01-07-2022','−200.000','0,12','−24.000'],['Overige kosten','−475.000','0,11','−52.250'],['Theoretische eindstand','276.000','','17.860'],['Werkelijke eindstand: 130.000 + 651.000 − 380.000 − 125.000','276.000','0,13','35.880'],['Positief koersverschil','','','18.020']])])
entry('20211006/vraag-10',display=[jp([['Niet-gerealiseerde winst door transacties met ChargeIT','19.200',''],['Overlopende passiva','','19.200']],'Downstream')+jp([['Voorziening belastingen','4.800',''],['Belastinglast','','4.800']],'Winstbelasting')+jp([['Deelnemingen','21.600',''],['Resultaat deelnemingen','','21.600']],'Sidestream afnemend')+p('Het bronmodel vermeldt aan de creditzijde belastinglast € 4.880. Bij 25% van € 19.200 hoort € 4.800, overeenkomstig de debetzijde. Deze bronafwijking is expliciet gecorrigeerd.')])
root.joinpath('content/practice/exam-structure-overrides.json').write_text(json.dumps(config,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(len(config),'gereviewde opmaak- en onderdeelregels')
