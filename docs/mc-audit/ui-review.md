# Onafhankelijke codereview: onderwerpindeling

Datum: 23 september 2026. Afbakening: `js/practice-topics.js`, wijzigingen in `js/app.js` en `js/bootstrap.js`. Beoordeeld op behoud van voortgang, export/import, modus, deel-/onderwerpnavigatie, historische totalen en herladen/deeplinks. Dit verslag vult de afzonderlijke browserverificatie aan.

## Bevindingen en hercontrole

| Bevinding | Gevolg | Status |
|---|---|---|
| Oude afgeronde poging van 30 vragen bleef een levende antwoordenverzameling; toevoeging van vraag 31 maakte de historische score 31/30 met de oude afsluitdatum. | Historische totalen waren niet meer betrouwbaar. | Opgelost. `cleanModule` archiveert een afgeronde kleinere bank als onafhankelijke snapshot; bestaande antwoorden blijven in de nieuwe poging staan. |
| `resetQuestions` verwijderde de afsluitstatus van een heel deel zonder de afgeronde poging te archiveren. | Opnieuw beginnen met één onderwerp verwijderde het historische dashboardresultaat van het deel. | Opgelost. `archiveCompleted` archiveert ieder geraakt afgerond deel eenmaal, met een diepe kopie van de antwoorden. |
| De actieve onderwerpcontext bleef bewaard op `#voortgang`, `#resultaten` en `#resultaat-kap/val/nvw/hk`. | Via Meer > Voortgang > Resultaten > deelresultaat bleef de tentamenblokkade van een onvoltooid onderwerp actief. Voltooien van het hele deel sloeg daardoor die vragen over bij nakijken; teruglinks konden onverwacht de onderwerpindeling gebruiken. | Opgelost en opnieuw gecontroleerd. De concrete route-/resetcontroles staan hieronder. |
| Een volledige deelreset en de import van een oude losse deelexport lieten de onderwerpstatus `started/exam/finished` staan. | Een leeggemaakt, eerder afgerond onderwerp kon bij een nieuwe tentamenpoging direct als voltooid gelden en feedback tonen. | Opgelost en opnieuw gecontroleerd. De concrete route-/resetcontroles staan hieronder. |

## Uitgevoerde verificatie

Een onafhankelijke Node-VM-harness heeft de volgende toestandswijzigingen rechtstreeks via de actuele `app.js` uitgevoerd:

1. Laden van een oude afgeronde poging met 30 antwoorden: historische score blijft 30/30, datum blijft behouden, nieuwe poging krijgt nummer 2, eigen notities blijven beschikbaar.
2. Invullen van een toegevoegde vraag: het historische aantal blijft 30/30.
3. Wissen van enkele onderwerpvragen: de oude 30/30-poging en haar oorspronkelijke notities blijven intact.
4. Voltooide nieuwe poging van 64 vragen, gevolgd door reset van twee vragen: eenmaal archiveren, totaal blijft 64, pogingnummer wordt verhoogd.
5. Controle van diepe kopieën: het wissen van de levende antwoorden verandert de historische antwoorden niet.

Alle vijf regressiecontroles slaagden na de historische correcties. Een tweede onafhankelijke harness heeft bevestigd dat de onderwerpcontext verdwijnt bij `#voortgang`, `#resultaten`, `#resultaat-kap` en `#dashboard/voltooid`. `resetForModule` zet alleen de geraakte onderwerpen terug naar hun eerste vraag, met `exam/finished/started` op false; de geschiedenis en niet-gerelateerde onderwerpen blijven behouden. De aanroepen vanuit deelreset en de import van een oude losse deelexport zijn in de actuele code gecontroleerd. Er zijn na deze hercontrole geen open materiële bevindingen binnen de afbakening van deze review. De testbank van 64 vragen was een geïsoleerde fixture voor de toestandslogica, geen uitspraak over het definitieve aantal vragen per deel.

Alle 120 oorspronkelijke vragen zijn daarnaast tegen `HEAD` vergeleken op vraag-id, index van het juiste antwoord en antwoordopties. Geen verschil gevonden; opgeslagen keuze-indexen blijven geldig.

De toevoegingsfragmenten worden geladen voordat `app.js` de vraaginteracties bindt. De onderwerpindeling wordt gemonteerd na de bestaande vraagopmaak, en vóór het gereed-signaal. In de gewijzigde bootstrapvolgorde is geen materiële fout gevonden. Visuele layout en echte browserinteractie vallen onder de afzonderlijke browserregressies.

Bronnen: actuele lokale bestanden `js/practice-topics.js`, `js/app.js`, `js/bootstrap.js`, `js/practice-upgrades.js`, `js/study-shell.js`, `fragments/shared.html` en de vier vraagdatabanken; vergelijking met de lokale Git-revisie `HEAD`.

