# Lichtere tentamenbediening

Tentamenhulpmiddelen lezen de huidige vraag gericht. De assistent leest één poging met de volledige broncontext voor consistente antwoordmodellen. Iedere gewijzigde poging krijgt een afzonderlijk opslagrecord; een klein overzicht verwijst daarna naar de volledig geschreven records. Bij een schrijffout blijft de vorige opgeslagen toestand intact. Bestaande pogingen worden met behoud van hun historische inhoud overgezet. Als onvoldoende migratieruimte beschikbaar is, blijft de oude opslag bruikbaar.

Een ongewijzigde casus blijft bij vraagwisseling behouden. De uitgebreide editor start pas wanneer het invoervak zichtbaar is. De pdf-lezer bewaart standaard drie paginaweergaven, met extra ruimte voor zichtbare pagina’s. Arceringen blijven onafhankelijk daarvan opgeslagen. Identieke kloktekst wordt niet opnieuw geplaatst.

Functionele controle: volledige testsuite met DOM-integratie, assistenttests, migratie en opslagfouten, herstart/reset, herladen, desktop/mobile, casusscroll, teksteditor, PDF-leespositie, arceringskleur en verwijderen, kleinere paginacache en behoud van geopende PDF-contexten. Geen aanvullende snelheidsbenchmark uitgevoerd.

De gepubliceerde wijzigingen aan PDF-paginaknoppen zijn meegenomen. Lettertypen zijn niet gewijzigd.

Bronnen: [tentamencontroller](https://github.com/HMA9K/CAFA2/blob/main/js/exams.js), [pdf-lezer](https://github.com/HMA9K/CAFA2/blob/main/pdf-reader/web/viewer.mjs), [teksteditor](https://github.com/HMA9K/CAFA2/blob/main/js/tinymce-answer-editor.js).
