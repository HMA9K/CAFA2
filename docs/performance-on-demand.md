# CAFA2: oefenvragen laden bij openen

CAFA2 bouwde bij iedere start alle 627 oefenvragen op, inclusief verborgen
antwoordeditors, tabellen, feedback en navigatie. De pagina bevatte daardoor ruim
203.000 DOM-elementen. De DOM is de verzameling pagina-elementen die de browser
bijhoudt. Verborgen elementen vragen ook geheugen en verwerking.

SRA gebruikt voor oefenen één actief vraagscherm. CAFA2 past nu ditzelfde principe
toe: de startpagina bevat geen oefenvraagschermen en tijdens oefenen bestaat alleen
de geopende vraag. Dit verklaart de winst; de gebruikte ontwikkelomgeving is geen
vastgestelde oorzaak.

## Werking

- `scripts/build-practice-screens.mjs` splitst de bestaande bronfragmenten zonder
  de inhoud van vragen te wijzigen. De oorspronkelijke fragmenten blijven de bron.
- `data/practice-screens.json` wijst iedere vraag naar een afzonderlijk fragment.
  `fragments/practice-shell.html` bewaart de overzichten en resultaten.
- `js/practice-screens.js` laadt de gekozen vraag, herstelt de bestaande opgeslagen
  antwoorden en initialiseert de editor, feedback, casus en onderwerpnavigatie.
- Bij wisselen wordt de vorige vraag verwijderd. De cache bewaart maximaal zes
  HTML-teksten, geen verborgen editors of vraagschermen.
- Verouderde laadreacties kunnen een nieuwere route niet vervangen. Een mislukte
  aanvraag heeft een knop om opnieuw te proberen.
- De bestaande volledige afdrukweergave blijft beschikbaar via
  `index.html?afdrukken=alles` en de link in Hulpmiddelen. Deze weergave bouwt bewust
  alle vragen op. Gewoon afdrukken betreft de huidige geladen pagina.
- De dubbele initialisatie-aanvraag van het rekenmachinescript is verwijderd.
  De bestaande rekenmachine blijft behouden.

`npm run build:assistant` bouwt automatisch de losse vraagfragmenten en neemt ze
mee in `dist`. Bij rechtstreeks lokaal serveren van de repository eerst
`npm run build:performance` uitvoeren. De gegenereerde afzonderlijke HTML-bestanden
staan buiten Git; manifest en paginaomhulling worden wel opgenomen.

## Vergelijkende lokale meting

Dezelfde Chromium-versie, computer, viewport en lokale serveropstelling werden
gebruikt voor de gepubliceerde bronversie `4e274b5` en de gewijzigde versie.
Externe metingenscripts waren bij beide geblokkeerd. Dit zijn lokale metingen,
geen nieuwe productiemeting. Netwerk, compressie en apparaat bepalen de uiteindelijke
ervaring op de website. De tijden zijn één vergelijkende meetreeks, geen percentielen.

| Meting | Voor | Na |
|---|---:|---:|
| Interactieve start, `cafa:ready` | 17,54 s | 2,29 s |
| DOM-elementen op de startpagina | 203.756 | 6.789 |
| Opgebouwde oefenvragen bij start | 627 | 0 |
| Vraag 1 openen | 518 ms | 92 ms |
| Vraag 2 openen | 527 ms | 62 ms |
| Terug naar vraag 1 | 601 ms | 42 ms |
| Geladen ongecomprimeerde bronbytes bij start | 16,40 MB | 8,00 MB |

De opstarttijd daalt in deze meting met circa 87%; het aantal DOM-elementen met
circa 97%. Alle vraagdata en tentamenbanken blijven beschikbaar. Het splitsen van
de overige vraagmetadata of later laden van de PDF-runtime kan aanvullende winst
geven, maar is niet nodig voor deze eerste verbetering.

## Validatie

`npm test` controleert onder meer alle 627 afzonderlijke vraagfragmenten tegenover
de oorspronkelijke HTML, behoud van bronvragen en tentamendata, scores, onderwerp-
en bronfilters en de bestaande berekeningen. `npm run test:performance-browser`
controleert dat één vraag is opgebouwd, antwoordkeuze, eerste score, markering,
richtextantwoord en feedback behouden blijven bij wisselen en herladen, plus
casussen, mobiele breedte, snel opeenvolgende routes, terugnavigatie, laadfouten
en de volledige afdrukweergave.

Aanvullende browsercontroles behandelen tentamenvragen, onderwerpselectie, voorraad-
en journaalinvoer, casuspanelen, originele PDF's, donker thema en de assistent.
De assistentdienst is in deze controles gesimuleerd; dit bewijst de koppeling en
contextisolatie, niet de kwaliteit van echte modelantwoorden.

De wijziging blijft op een afzonderlijke beoordelingsbranch. Productie activeren
en samenvoegen met `main` zijn afzonderlijke vervolgstappen.

## Samenloop met editor- en navigatiewijzigingen

Er loopt tegelijk werk aan direct zichtbare nieuwe tabelkolommen, grotere
editoriconen, de volgorde van tentamenknoppen, PDF-knoppen naast Vorige/Volgende
en terugnavigatie vanuit de samenvatting. `index.html` en `js/bootstrap.js`
overlappen met deze optimalisatie. Die bestanden moeten inhoudelijk worden
samengevoegd; één versie volledig over de andere kopiëren verliest wijzigingen.

De editor- en navigatiewijziging `7a6400f` is opgenomen in deze beoordelingsbranch.
Beide scriptversies in `index.html` en de nieuwe PDF-import in de bootstrap
zijn gecombineerd met de nieuwe paginaopbouw.

Voor publicatie de nieuwste `main` ophalen, de goedgekeurde wijzigingen samenvoegen,
vraagfragmenten en `dist` opnieuw bouwen en de editor-, PDF-, terugnavigatie- en
prestatiecontroles op de gecombineerde versie uitvoeren. Controleer direct vóór
publicatie opnieuw de bronversies en stop de publicatievoorbereiding als er nieuwe
wijzigingen zijn die nog niet samen getest zijn.

## Bronnen

- [CAFA2 oorspronkelijke bootstrap](https://github.com/HMA9K/CAFA2/blob/4e274b5/js/bootstrap.js)
- [SRA oefenopbouw](https://sra-2xt.pages.dev/js/mc.js)
- [CAFA2 validatie en browsercontroles](https://github.com/HMA9K/CAFA2/tree/codex/performance-on-demand/tests)
