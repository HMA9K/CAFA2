# Originele tentamen-PDF's

De knoppen **Tentamen PDF** en **Uitwerking PDF** openen de bronstukken zonder een nieuwe poging te starten. Ze staan bij de elf oorspronkelijke tentamens op het Dashboard, in hun introductie en tijdens het maken van tentamenvragen. Bij samengestelde onderwerpentoetsen en MC-vragen bepalen de brongegevens van de huidige vraag welk tentamen wordt geopend. Syllabusvragen krijgen geen willekeurige tentamenbron.

Tijdens het maken van een vraag vervangt Tentamen PDF de linker casusweergave. Terug naar casus herstelt de bestaande inhoud. Uitwerking PDF gebruikt het rechterpaneel van de assistent; de assistent wordt gesloten met behoud van diens concept. Terug naar assistent heropent deze. Vraag, antwoord, markering en poging blijven staan. Op het Dashboard verschijnt de opgave links naast de lijst en de uitwerking rechts. Beide documenten hebben een link om het originele document in een nieuw tabblad te bekijken, ook voor browsers zonder ingebouwde PDF-weergave.

De PDF-vensters blijven binnen dezelfde geopende leeromgeving per brontentamen bestaan. Wisselen van vraag uit hetzelfde tentamen houdt beide panelen open. Sluiten en later opnieuw openen gebruikt hetzelfde documentvenster, zodat de gekozen pagina en zoom behouden blijven. Het openen van de rechter PDF verplaatst of herlaadt de linker PDF niet. Terug naar assistent schakelt direct terug zonder introductievenster. Ook na een volledige paginavernieuwing wordt bij opnieuw openen de bewaarde pagina en zoom hersteld.

De documenten zijn geen HTML-transcriptie of nieuwe uitwerking. De oorspronkelijke pagina's, figuren, kleuren en normering blijven behouden. Documentmetadata en persoonlijke annotaties zijn verwijderd uit de publicatiekopieën; de lokale bronnen blijven intact. Alle 22 beschikbare PDF's zijn vergeleken met de lokale bronnen: gelijk aantal pagina's, gelijke paginagrootte, gelijke uitgepakte pagina-inhoud en gelijke tekst. De beschikbaarheid en SHA-256-controlegetallen staan in `data/exam-original-pdfs.mjs`; de resultaten per document staan in `docs/original-pdfs-validation.json`.

## Arceren in de PDF

De ingebouwde browserlezer is vervangen door een lokaal meegeleverde PDF.js-lezer. Kies **Arceren** en selecteer de tekst met de muis. Met **Kleur** kies je geel, groen, blauw, roze of rood. Klik op een bestaande arcering om de kleur te wijzigen of gebruik **Verwijderen**. De oorspronkelijke pagina's, figuren en rode normering blijven behouden.

Een persoonlijke PDF-kopie met arceringen wordt automatisch in IndexedDB in dezelfde browser bewaard. De status onder het document meldt wanneer de arceringen lokaal zijn opgeslagen. Pagina, zoom en positie worden per bronstuk in localStorage bewaard. De opslag is gescheiden per tentamen, vragen/uitwerking en SHA-256 van het bronbestand. Het wijzigen van een bronbestand hergebruikt daardoor geen oude annotaties bij een andere bronversie. De originele PDF op de website blijft ongewijzigd; de link boven de lezer blijft naar dat originele bestand verwijzen. De downloadknop in de lezer levert de persoonlijke kopie op.

Arceringen worden niet naar een server verstuurd en synchroniseren niet tussen browsers of apparaten. Het verwijderen van websitegegevens verwijdert ook deze lokale kopieën. Bij een opslagfout blijft de PDF bruikbaar en meldt de status dat de gebruiker de persoonlijke kopie moet downloaden om markeringen te bewaren. Wacht op de melding van succesvolle opslag voordat je de pagina sluit.

De toetsvoortgang staat los van de PDF-opslag. Het resetten van een toets wist dus geen arceringen. Tijdens vraagwissels en sluiten/heropenen blijven dezelfde documentvensters bestaan; het openen van de uitwerking herlaadt de vragen-PDF niet.

## Volledige beschikbaarheid

Ook de oorspronkelijke opgaven-PDF van 19-04-2021 is aanwezig. Alle elf tentamens hebben daardoor beide originele documenten. Als een toekomstige bron ontbreekt, wordt dat expliciet vermeld; een reconstructie of zelfgemaakte export wordt niet als origineel aangeboden.

## SRA: nog uit te voeren

- Voeg dezelfde knoppen toe aan alle oorspronkelijke Dashboard-tentamens en alle MC-vragen met een echte tentamenbron.
- Koppel originele vragen-PDF's en officiële uitwerkingen, inclusief schema's en rode normering. Verwijder alleen documentmetadata en controleer persoonsgegevens, pagina-inhoud en aantallen vóór publicatie.
- Vervang links de casus en rechts de assistent door de juiste PDF. Houd de vraag en invoer in het midden; herstel casus en assistent zonder verlies van concepten, antwoorden, tijd of markeringen.
- Bewaar per brontentamen de bestaande documentvensters bij vraagwissels en sluiten/heropenen. Behoud pagina en zoom, voorkom herladen van de linker PDF bij het openen van de rechter, en schakel direct terug naar de assistent zonder introductievenster.
- Maak ontbrekende originele bestanden zichtbaar; presenteer geen reconstructie of zelfgemaakte export als oorspronkelijk PDF-bestand.
- Controleer Dashboard, introductie, tentamen, MC, samengestelde toetsen, routewissels, mobiel en directe PDF-links. De bestaande gebruikerstoestemming voor het versturen van assistentvragen blijft behouden.

## Bronnen

- [Catalogus met oorspronkelijke bronbestanden](https://github.com/HMA9K/CAFA2/blob/main/docs/tentamens.md)
- [Bronmanifest en beschikbaarheid](https://github.com/HMA9K/CAFA2/blob/main/data/exam-original-pdfs.mjs)
- [Documentcontrole](https://github.com/HMA9K/CAFA2/blob/main/docs/original-pdfs-validation.json)
