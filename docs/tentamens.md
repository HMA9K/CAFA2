# Volledige CAFA2-tentamens

## Opgenomen bronbestanden

- `20240422 Tentamen CAFA2.pdf` en `20240422 Uitwerking tentamen CAFA2.pdf`
- `20240930 Tentamen CAFA2.pdf` en `20240930 Uitwerking tentamen CAFA2.pdf`
- `20250417 Tentamen CAFA2.pdf` en `20250417 Uitwerking tentamen CAFA2.pdf`
- `20250924 Tentamen CAFA2.pdf` en `20250924 Uitwerking tentamen CAFA2 (na normering).pdf`
- `20260429 Tentamen CAFA2 def 2 (1).pdf` en `20260429 Uitwerking Tentamen CAFA2 (1).pdf`

Alle vijf voorbladen vermelden 180 minuten, 100 punten en een grens van 54/55 punten. De oefenomgeving biedt vooraf een eenmalige keuze voor 30 minuten extra. De oorspronkelijke afnamedatum is een label, geen toekomstige beschikbaarheidsdatum. Historische zaalregels worden als broninformatie weergegeven, niet als vereisten voor deze oefensite.

| Tentamen | Vragen | Opgaven | Punten |
|---|---:|---:|---:|
| 22-04-2024 | 24 | 4 | 100 |
| 30-09-2024 | 25 | 4 | 100 |
| 17-04-2025 | 28 | 4 | 100 |
| 24-09-2025 | 31 | 4 | 100 |
| 29-04-2026 | 23 | 4 | 100 |

Er zijn 131 tentamenvragen en daarnaast 120 aparte MC-oefenvragen. Bij 24-09-2025 is de doorlopende nummering uit het officiële antwoordmodel gevolgd, met behoud van de papieren bronnummering. In de andere tentamens staat de oorspronkelijke vraagnummering eveneens bij de vraag.

## Bediening

Het dashboard opent met **Aankomend**: de ongetimede MC-oefenvragen en beschikbare volledige tentamens. Een gemaakte poging staat onder **Voltooid**. Vanaf de inzage kan een nieuwe poging worden gestart zonder de oude te verwijderen.

### Tentamenvragen per opgave

Direct onder de MC-oefenvragen staat een oefenreeks per opgave. Op de introductiepagina kiest de gebruiker Opgave 1, 2, 3 of 4 en vervolgens de gewenste tentamendata. Standaard zijn alle vijf de tentamens geselecteerd. De gekozen opgaven volgen elkaar van nieuw naar oud, zonder tijdslimiet. De aantallen voor alle vijf samen zijn 39, 28, 36 en 28 vragen voor respectievelijk Opgave 1 tot en met 4.

Elk oorspronkelijk voorblad met algemene uitgangspunten, elke broncasus, vraag, uitwerking en puntwaarde blijft intact. Tijdens een vraag opent **Introductie** het voorblad van het bijbehorende tentamen. De samengestelde poging krijgt unieke vraag- en sectie-ID's, met de oorspronkelijke ID en examencode als bronmetadata. Antwoorden op gelijk genummerde vragen uit verschillende tentamens blijven daardoor gescheiden. Het vraagoverzicht gebruikt dezelfde vraagknoppen, met een kleine examencode boven elke groep. Lopende en voltooide reeksen blijven als afzonderlijke pogingen in de bestaande lokale tentamenopslag bewaard.

De welkomstpagina bevat de introductie en algemene uitgangspunten van de eerste drie bronpagina's. De klok begint pas bij de definitieve knop **Toets starten** op die pagina. Tot de laatste tien minuten worden afgeronde hele minuten getoond; vanaf 10:00 worden minuten en seconden getoond. Verversen of sluiten pauzeert de klok niet. Bij nul wordt automatisch ingeleverd. Als de browser gesloten was, gebeurt dit bij terugkomst met het oorspronkelijke eindtijdstip.

**Overzicht** toont alle vragen met antwoordstatus en markeringen. **Sectie** toont alle casusinformatie van uitsluitend de huidige opgave, inclusief alle delen, aanvullende gegevens en tabellen. **Introductie** opent opnieuw het voorblad. **Markeren** wijzigt de markering zonder het antwoord te veranderen. **Toets voltooien** vraagt bevestiging en vergrendelt daarna de poging. De uitwerkingen zijn alleen in de inzage zichtbaar.

De editor ondersteunt tekstopmaak, koppen, lijsten, uitlijning, sub- en superscript, symbolen, tabellen, rij- en kolombewerking, ongedaan maken, opnieuw en een groter antwoordvenster. Open antwoorden worden niet automatisch beoordeeld. Er wordt geen cijfer of officiële uitslag gesuggereerd.

## Opslag en grenzen

MC-voortgang gebruikt de bestaande opslag. Volledige tentamenpogingen gebruiken `cafa2-full-exams-v1` in `localStorage`. Elke poging bevat een kopie van het gebruikte tentamen, antwoorden, markeringen en de absolute eindtijd. Een latere inhoudsupdate verandert een begonnen of voltooide poging niet. Maak zelf een back-up via het dashboard of de inzage. Wissen van browsergegevens verwijdert lokale voortgang. Apparaten synchroniseren niet onderling. Gebruik bij voorkeur één tabblad per toets.

Dit is een volledig statische oefenomgeving, geen beveiligde examenafname. Antwoordmodellen staan in de openbare broncode, hoewel de interface ze pas na inleveren toont. De klok is afhankelijk van de apparaatklok. Voor formele examens zijn een server, authenticatie en servergestuurde tijd/opslag nodig.

## Een volgend tentamen toevoegen

1. Lees het volledige tentamen, voorblad en antwoordmodel. Controleer tabellen visueel tegen de pdf.
2. Maak een bestand `data/exam-YYYYMMDD.js` met `window.CAFA2_EXAMS.push(exam)`.
3. Voeg het script toe in `index.html`, na `data/exams.js` en vóór `js/bootstrap.js`.
4. Werk `tests/exam-content.mjs` bij met verwachte aantallen, punten en kenmerkende casusgegevens.
5. Draai `npm test` en controleer op test de sectiewissels, uitwerkingen, timer, invoer en herladen.

Formaat:

```js
{
  id: 'cafa2-YYYYMMDD', title: 'CAFA2', date: 'YYYY-MM-DD',
  durationMinutes: 180, // letterlijk uit het voorblad
  maxScore: 100, passPoints: 55,
  introduction: 'Volledige voorbladtekst en algemene uitgangspunten',
  introductionHtml: '<p>Dezelfde inhoud, inclusief de benodigde opmaak.</p>',
  sections: [{id:'opgave-1',title:'Opgave 1 · Bedrijfsnaam',contentHtml:'<p>Volledige casus, zonder antwoorden.</p>'}],
  questions: [{
    id:'vraag-1', title:'Opgave 1 · Vraag 1', number:1,
    sectionId:'opgave-1', type:'open', points:5,
    prompt:'Volledige vraagtekst', promptHtml:'<p>Volledige vraagtekst</p>',
    solution:'Volledig officieel antwoord', solutionHtml:'<p>Volledig officieel antwoord</p>'
  }]
}
```

`availableFrom` en `deadline` zijn optionele ISO-tijdstippen met tijdzone. Ze bepalen het startvenster, niet de duur van een reeds begonnen poging. Zonder deze velden blijft het oude tentamen beschikbaar om mee te oefenen. `date` is altijd de oorspronkelijke tentamendatum.

HTML wordt via een beperkte lijst veilige elementen opgeschoond. Gebruik paragrafen, koppen, lijsten en echte HTML-tabellen. Scripts, externe media, eventhandlers en URL-attributen worden niet toegestaan. Corrigeer inconsistenties in officiële modellen niet stilzwijgend: behoud de bron en geef een aparte bronopmerking.

## Aanvullende lokale regressietests

De optionele DOM-tests gebruiken een geïnstalleerde `jsdom` buiten de statische website:

```bash
JSDOM_PATH=/absoluut/pad/naar/jsdom/lib/api.js node tests/exam-ui.mjs
JSDOM_PATH=/absoluut/pad/naar/jsdom/lib/api.js node tests/answer-editor.mjs
JSDOM_PATH=/absoluut/pad/naar/jsdom/lib/api.js node tests/full-site.mjs
JSDOM_PATH=/absoluut/pad/naar/jsdom/lib/api.js node tests/opgave-practice.mjs
```

De gewone `npm test` heeft geen externe dependencies.
