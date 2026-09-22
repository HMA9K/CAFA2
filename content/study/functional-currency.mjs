/* Didactic interpretation of Syllabus CAFA2 Deel 2, pp. 5–7. Not a verbatim RJ extract. */
import {table as T, note as N} from '../summary/helpers.mjs';
export const functionalCurrencyHtml =
'<p>Met deze factoren zoek je niet alleen uit <em>in welke munt de factuur staat</em>, maar <strong>welke munt de opbrengsten en kosten economisch bepaalt</strong>. Het antwoord op iedere vraag is een aanwijzing voor een valuta. Je combineert die aanwijzingen tot één gemotiveerde conclusie; één antwoord bepaalt de functionele valuta niet automatisch.</p>'+
'<h4 class="currency-subhead">1. Welke munt bepaalt de onderneming economisch?</h4>'+
T(['Factor','Betekenis en voorbeeld: wat betekent je antwoord?','Gewicht en bron'],[
 ['Verkoopprijzen en prijsbepalende markt',
  'Onderzoek welke munt de prijs stuurt en in welk land concurrentie en regelgeving het prijsniveau bepalen. De factuurmunt is vaak een aanwijzing, maar niet het eindcriterium. Worden verkoopprijzen vastgesteld in USD en verandert het eurobedrag alleen mee met de dollarkoers? Dan wijst dit op USD, ook bij facturering in euro’s. Worden prijzen juist bepaald door concurrenten en marktregels in de eurozone, dan wijst dat op EUR.',
  'Primair: dit weegt het zwaarst mee. RJ 122.106, onder a; syllabus p. 5.'],
 ['Arbeid, materialen en overige kosten',
  'Zoek de munt die de belangrijkste productiekosten bepaalt, niet de munt van één kleine kostenpost. Zijn lonen, materialen en overige belangrijke kosten hoofdzakelijk in SEK bepaald? Dat wijst op SEK. Zijn die kosten hoofdzakelijk in EUR bepaald, dan wijst dit op EUR.',
  'Primair: dit weegt het zwaarst mee. RJ 122.106, onder b; syllabus p. 5.'],
 ['Financiering',
  'Bekijk in welke munt leningen en ingebracht eigen vermogen worden aangetrokken. Het gaat om de financieringsvaluta, niet alleen om het land van de bank. Een lening in EUR ondersteunt EUR als functionele valuta; een lening in USD ondersteunt USD. Een eurolening bewijst echter niet dat de onderneming economisch in euro’s werkt.',
  'Aanvullende aanwijzing, geen doorslag op zichzelf. RJ 122.107; syllabus p. 5.'],
 ['Aangehouden middelen',
  'Kijk in welke munt geld uit de bedrijfsactiviteiten gewoonlijk wordt bewaard nadat het is ontvangen. Blijven verkoopontvangsten normaal op een USD-rekening staan, dan ondersteunt dat USD. Worden ze gewoonlijk naar EUR omgezet en in EUR aangehouden, dan ondersteunt dat EUR. Eén toevallig banksaldo is niet hetzelfde als deze vaste werkwijze.',
  'Aanvullende aanwijzing, geen doorslag op zichzelf. RJ 122.107; syllabus p. 5.']])+
'<p class="study-note-source">De voorbeelden hierboven zijn vereenvoudigde toepassingen van de factoren, geen letterlijke RJ-tekst of afzonderlijke tentamencasus (Syllabus Deel 2, §3, p. 5–6).</p>'+
'<h4 class="currency-subhead">2. Is de buitenlandse activiteit afhankelijk van de moeder?</h4>'+
'<p>Hier betekent <strong>de rechtspersoon</strong> de rapporterende onderneming, in de gebruikelijke CAFA2-casus de moeder. De buitenlandse activiteit is bijvoorbeeld haar deelneming of filiaal. RJ 122.108 geeft extra aanwijzingen voor de vraag of hun functionele valuta gelijk zijn. Hieronder veronderstellen we dat de moeder EUR als functionele valuta heeft.</p>'+
T(['Wat beoordeel je?','Aanwijzing voor dezelfde valuta: EUR','Aanwijzing voor een andere functionele valuta'],[
 ['Zelfstandigheid: kan de buitenlandse eenheid haar bedrijfsactiviteiten in belangrijke mate zelfstandig uitvoeren?',
  'Zij is vooral een verlengstuk van de moeder. Dat wijst op dezelfde economische omgeving en ondersteunt EUR.',
  'Zij werkt in belangrijke mate zelfstandig. Dat ondersteunt een andere functionele valuta; welke munt dat is, volgt uit de prijs- en kostenfactoren.'],
 ['Onderlinge transacties: is handel met de moeder een belangrijk onderdeel van haar activiteiten?',
  'Ja. De sterke verwevenheid met de moeder ondersteunt dezelfde functionele valuta.',
  'Nee, zij handelt hoofdzakelijk buiten de moederrelatie. Dat ondersteunt een eigen economische omgeving.'],
 ['Beschikbaarheid van kasstromen: beïnvloeden ontvangsten rechtstreeks de kasstromen van de moeder en zijn ze onmiddellijk overdraagbaar?',
  'Ja. Het geld staat economisch direct ter beschikking van de moeder; dat ondersteunt EUR.',
  'Nee. De ontvangsten blijven bij de buitenlandse eenheid voor haar eigen bedrijfsvoering. Dat wijst eerder op zelfstandigheid.'],
 ['Zelf kunnen betalen: zijn de eigen kasstromen voldoende voor bestaande en verwachte verplichtingen, zonder geld van de moeder?',
  'Nee, de eenheid is daarvoor van geld van de moeder afhankelijk. Dat wijst eerder op een verlengstuk.',
  'Ja. Zij kan haar eigen verplichtingen dragen; dat ondersteunt een andere functionele valuta.']])+
'<p class="study-note-source">RJ 122.108, onder a–d, zoals uitgelegd in Syllabus Deel 2, §3, p. 6. “Wijst op” is een aanwijzing, geen automatische keuze. Zelfstandig betekent dus niet zonder meer: lokale valuta.</p>'+
N('3. Weeg de antwoorden, tel ze niet','Bij tegenstrijdige aanwijzingen krijgen <strong>verkoopprijzen en kosten uit RJ 122.106 het meeste gewicht</strong>. Kies de valuta die de economische gevolgen het meest getrouw weergeeft. Je telt dus niet hoeveel vakjes bij EUR of USD staan en kiest ook niet de munt die de gunstigste winst oplevert (RJ 122.109; syllabus p. 6).')+
'<div class="currency-worked"><h4>Van feiten naar een gemotiveerd antwoord</h4><p><strong>Vereenvoudigde casus:</strong> een onderneming heeft haar belangrijke verkoopprijzen én productiekosten in USD. Zij is met een eurolening gefinancierd en houdt een deel van haar geld in EUR aan.</p><p><strong>Conclusie:</strong> de prijs- en kostenfactoren wijzen op USD. De eurolening en aangehouden euro’s zijn tegenaanwijzingen, maar wegen minder zwaar. Op deze gegevens is USD daarom de functionele valuta. De motivering verbindt dus telkens <strong>feit → betekenis → gewicht → conclusie</strong>.</p><p>Pas daarna kies je de omrekenmethode. Bij een moeder met EUR als functionele en presentatievaluta leidt deze USD-uitkomst in de syllabus naar de <a href="#slotkoersmethode">slotkoersmethode</a>. Zou de buitenlandse functionele valuta ook EUR zijn en de administratie in een andere munt luiden, dan volgt de <a href="#tijdstipmethode">tijdstipmethode</a>. Die keuze bepaalt zowel de koersen per post als de verwerking van het omrekeningsverschil in resultaat of reserve.</p><p class="study-note-source">RJ 122.106–109; Syllabus Deel 2, §3–4, p. 5–7. Voor de accountant is de onderbouwing belangrijk omdat een onjuiste valutakeuze doorwerkt in de waardering, het resultaat uit deelneming en de consolidatie.</p></div>';
