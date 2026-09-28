# Invoer en paginaschaal

## Gebruik

- Bedragen krijgen tijdens het typen een punt per duizendtal, bijvoorbeeld 5000 naar 5.000. Komma-decimalen en tekens blijven behouden.
- Onder elk antwoordvak, elke invoertabel en de aanvullende toelichting staat een afzonderlijk vinkje. Uitzetten stopt automatische opmaak; bestaande punten blijven staan. De instelling wordt per vraag en invoervak bewaard.
- In tabellen verplaatst links of omhoog aan het begin van de cel de cursor naar de vorige cel of bovenliggende cel. Rechts of omlaag aan het einde gaat naar de volgende of onderliggende cel. Een selectie of cursor midden in de tekst behoudt de normale bediening. Dit werkt ook in zelf ingevoegde tabellen.
- In CAFA2 berekenen de PDF- en assistentpanelen hun positie met dezelfde paginaschaal als het antwoordvak. Editorafmetingen worden onafhankelijk van de vergroting opgeslagen.

## Controle

Browsercontrole: Nederlandse bedragen, decimalen, datums, percentages, typen, wissen, plakken, afzonderlijke vinkjes, vier pijlrichtingen, eigen editortabel, herladen en opgeslagen antwoorden. Paginaschaal getest van 10 tot 24 en mobiele breedte van 390 pixels. Het lettertype blijft Arial.

Geautomatiseerde browsercontrole: `node tests/answer-input-tools-browser.cjs`; voor SRA met `COURSE=sra`. Daarnaast zijn de bestaande volledige projecttests uitgevoerd.

## Projectbronnen

- [CAFA2 broncode](https://github.com/HMA9K/CAFA2)
- [SRA broncode](https://github.com/HMA9K/SRA)
