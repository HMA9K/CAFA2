# CAFA2: gekoppelde documenten en nieuwe bronnen

Bijgewerkt op 25 september 2026. Dit beschrijft de bronselectie voor de afzonderlijke testsite.

## Beschikbaar

De documentbank bevat **115 oorspronkelijke bronbestanden, waarvan elf oude presentaties als PDF**. Dit is dus niet hetzelfde als alle 116 kandidaten uit het lokale bronmanifest. De actuele indexcontrole meldt nul mislukte en nul lopende indexeringen.

Beschikbaar zijn de syllabi, opgaven en uitwerkingen uit 2025 en 2026, de tentamenbronnen, alle 40 bestanden uit de repetitiecursus, de aanvullende literatuur over belastinglatenties en de aanvullende presentaties. De jaartallen blijven in de bestandsnamen staan. De 2025-versies zijn behouden ondanks grote overlap met 2026: bijna gelijke tekst is geen bewijs dat edities volledig uitwisselbaar zijn.

De laatste toevoegingen en de beproefde aanvulling zijn:

- `PRESENTATIE CAFA 2 Voorjaar 2026 WIJNCURSUS.pptx`: bevat ook CAFA2-theorie en boekingen. Het titelblad noemt 17 april 2025; de bestandsnaam noemt 2026. Dit verschil mag niet stilzwijgend worden gladgestreken.
- `Slides Uitwerking Tentamen 2022 okt 6 copyright Nyenrode Business Universiteit].pptx`: 42 dia's. Het titelblad noemt 10 oktober 2022; de bestandsnaam noemt 6 oktober. Bewaar deze bronvermelding.
- `TENTAMEN CAFA2 20221006 (1).docx` en `UITWERKINGEN tentamen CAFA2 20221006.docx`: ook opgenomen naast de eerder gekoppelde PDF-versies. Hun tekst is niet volledig identiek.
- **Niet actief gekoppeld:** `CAFA2 Tentamenuitleg oktober 2022 - diatekst en ingesloten berekeningen.md`: automatisch uit de presentatie uitgelezen diatekst plus 19 unieke ingesloten Excel-werkboeken, gebruikt op 23 posities. Per berekening staan dia, werkblad, celadres, formule en opgeslagen celwaarde vermeld. Er waren in deze bron geen ontbrekende opgeslagen formule-uitkomsten.
- Zestien bestanden uit de editie 2025: drie theoriedelen, zes opgavensyllabi, zes uitwerkingssyllabi en het onderwijsprogramma.

De afgeleide tekst wordt gemaakt met `scripts/extract-presentation-sources.py`. Deze voert geen formules, macro's of externe koppelingen uit. Opgeslagen celwaarden kunnen ouder zijn dan de formule. Een ingesloten werkboek kan meer cellen bevatten dan de zichtbare uitsnede op een dia. Pijlen, afbeeldingen en kleurmarkeringen zijn niet inhoudelijk getranscribeerd. De Windows-renderproef van de EMF-afbeeldingen leverde geen betrouwbare visuele controle op. Dat blijft een beperking; tekstextractie is geen bewijs dat elke afbeelding correct is gelezen.

De oorspronkelijke presentatie en de afgeleide versie blijven afzonderlijk herkenbaar. `assistant/source-derived.json` bevat herkomst en SHA-256-controlesommen, geen broninhoud. De afgeleide tekst staat lokaal in de aparte map `CAFA2-assistant-sources/prepared` buiten de actieve documentbank, niet in Git.

De zoekbare presentatie is na een echte modelproef aangepast: alleen het actieve Excel-tabblad wordt uitgelezen. De eerdere versie bevatte ook meegekopieerde tabbladen van andere opgaven en is uit de documentbank ontkoppeld. Diatekst staat nu opnieuw bij het werkblad; gehele bedragen krijgen ook hun Nederlandse schrijfwijze, zodat bijvoorbeeld `340.250` als zoekterm past. De afsluitende modelproef bleef echter de verkeerde bedragen combineren. Daarom zijn beide afgeleide versies ontkoppeld en staat deze bron op `quarantined`. De koppellijst en CI voorkomen heropname zonder bewuste herbeoordeling. Nodig voor heropname: een gecontroleerde transcriptie die de temporal- en closing-rate-berekeningen per dia scheidt, gevolgd door een geslaagde echte modelproef. De oorspronkelijke documenten blijven beschikbaar.

## Bewust nog niet als cursusbron opgenomen

`Onderwijsmateriaal/Overzicht wetboek.docx` is een ongedateerd qua herkomst, niet als officiële cursuspublicatie herkenbaar overzicht met de aanduiding geldig in 2025 en kopieerartefacten. Er is geen onderbouwde controle van zijn wetsverwijzingen. Nodig voor opname: de oorspronkelijke, gedateerde cursusversie met herkomst, of inhoudelijke verificatie van dit overzicht. Het wordt niet als gezaghebbende wetsbron aangeboden. Het bronmanifest bewaart het als te beoordelen kandidaat.

`Thieu Mooren/vragen Hamudi en Karim.docx` was al uitgesloten als persoonlijk document en telt niet mee in de 116 kandidaten.

## Nieuwe en gewijzigde materialen

| Toevoeging | Hoe krijgt de assistent die mee? |
| --- | --- |
| Nieuwe MC-vragen of gewijzigde auteurdata | De build controleert de bronhash. Na hergeneratie van de vraagbank ontstaat bij publicatie automatisch een nieuwe servercatalogus. Vergeten hergeneratie stopt de build. |
| Nieuwe volledige tentamens | Geladen tentamenbestanden gaan mee in de catalogus. De controles signaleren vergeten data-imports en verouderde catalogusinhoud. |
| Nieuwe PDF, Word of presentatie in de beheerde bronmappen | De lokale broncontrole meldt onbekende bestanden. Classificeer ze, controleer inhoud en editie, upload naar dezelfde documentbank en registreer de exacte uploadidentiteit. |
| Gewijzigde inhoud onder dezelfde bestandsnaam | `check-assistant-source-revisions.mjs --check` vergelijkt de werkelijke bytes met de opgeslagen SHA-256-controlesommen. Ook veranderingen van dezelfde bestandsgrootte vallen op. Daarna is herindexering nodig. |
| Gewijzigde presentatie met ingesloten berekeningen | Maak ook de afgeleide tekst opnieuw, controleer deze en werk herkomst, controlesommen en uploadidentiteit bij. |

Een lokale map is niet rechtstreeks verbonden met Cloudflare. Nieuwe losse documenten worden dus **niet vanzelf geüpload door een Git-push**. De vraagbank synchroniseert wel via de build; losse documenten vereisen de beschreven bronstap. Er draait geen achtergrondmonitor op de computer.

Voor de beheerder, met `CAFA2_SOURCE_ROOT` en `CAFA2_CONVERTED_ROOT` ingesteld volgens het manifest:

```powershell
npm run check:assistant-sources
```

Gebruik de in `assistant/source-manifest.json` vermelde namen van de omgevingsvariabelen. Alternatief zonder omgevingsvariabelen:

```powershell
node scripts/prepare-assistant-sources.mjs --check --source-root "PAD_NAAR_CAFA2" --converted-root "PAD_NAAR_REPETITIE_PDFS"
node scripts/check-assistant-source-revisions.mjs --check --source-root "PAD_NAAR_CAFA2" --converted-root "PAD_NAAR_REPETITIE_PDFS"
```

`--check` verandert niets. Leg pas na controle bewust een nieuwe inventarisatie vast met `--record`. De momentopname bevestigt geen upload of inhoudelijke goedkeuring. `source-attachments.json` bewaart de gecontroleerde bestands-ID's en letterlijke namen; de beveiligde Cloudflare-build verifieert deze, koppelt ontbrekende uploads en wacht begrensd op indexering. Bestanden met een foutstatus blokkeren publicatie. Secrets blijven uitsluitend in Cloudflare.

Technische bron: [OpenAI Vector Store Search](https://developers.openai.com/api/reference/resources/vector_stores/methods/search).
