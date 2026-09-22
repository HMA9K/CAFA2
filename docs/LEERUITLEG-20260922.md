# Begrip, voorkennis, tentamenmethodiek en herkenbare navigatie

## Afbakening
Deze revisie verwerkt de feedback op het onderdeel functionele valuta én de daaropvolgende feedback op vennootschap, voorkennis, tentamenaanpak en het logo. De oorspronkelijke 120 vragen, 131 tentamenvragen, antwoordmodellen, normering en opgeslagen pogingen worden niet gewijzigd. Alle vakinhoudelijke toelichting is afgeleid van aangeleverde cursusdocumenten. Er is geen externe juridische actualisering uitgevoerd.

## Functionele valuta
De vraaglijst is vervangen door factor, betekenis, voorbeeld, richting van de aanwijzing en gewicht. Financiering en aangehouden middelen zijn geen zelfstandig doorslaggevende criteria. De vier aanvullende buitenlandse factoren zijn uitgesplitst, met hun richting naar dezelfde of een andere functionele valuta. De conclusie volgt via feit, betekenis, gewicht en conclusie, niet door vakjes te tellen. Vereenvoudigde voorbeelden zijn als zodanig herkenbaar.
Bron: 2026 Syllabus CAFA2 Deel 2 Vreemde valuta, §3, p. 5–6 (RJ 122.106–109); methodische consequentie §4, p. 7. De daadwerkelijke tentamencasus Bora is terug te vinden in de uitwerking 11-04-2023, vraag 20, p. 10.

## Vennootschap verduidelijkt
De keuze benoemt nu VOF/CV zonder rechtspersoonlijkheid, tegenover rechtspersoon, bijvoorbeeld bv/nv. De uitleg benadrukt dat bv/nv óók vennootschappen zijn. Houder en onderneming waarin het belang wordt gehouden blijven afzonderlijke keuzes. Bij art. 2:24a lid 2 is volledig aansprakelijke vennoot verduidelijkt; een commanditair belang is niet zonder meer voldoende. Deelneming volgens art. 2:24c lid 2 kent daarnaast de duurzame functionele band.
Bron: Syllabus Deel 1, p. 4–5 en 12; art. 2:24a en 2:24c BW. Historische uitwerking 09-10-2023, vraag 1b, p. 3 bevat expliciet een correctienoot over de VOF als houder. Die bron nuanceert waarom het rapportagekader niet uit een percentage mag worden afgeleid.

## Voorkennis
Alle zeven hoofdstukken vermelden wat de student vóór dat hoofdstuk moet begrijpen of kunnen. Geen lijst met casusgegevens, benodigde bedragen, documenten of de uitkomst die nog moet worden geleerd. Juridische classificaties zijn bijvoorbeeld niet als voorkennis van het eerste hoofdstuk opgenomen. Het ingangsniveau noemt Beginselen Accountancy, CAFA1 en Comptabele Aspecten Financiering (Onderwijsprogramma 2026, §2, p. 3). De vaardigheidsvertaling per hoofdstuk is een didactische afleiding, geen letterlijk overgenomen programma-eis.

## Tentamenaanpak
Vier overdraagbare methoden verbinden vraagstelling, juridische norm, werklaag, periode, grondslag, berekening en controle. Een onderwerpfilter toont één methode; Alles blijft beschikbaar. Toename/afname, bruto/netto, verschillende rechten, waarderingswijzigingen, dividendherkomst en methodewisseling per deelvraag worden expliciet behandeld. De zeven bestaande concrete voorbeelden zijn behouden als toepassingen naast de methoden.
Onderbouwd met geselecteerde vraagpatronen uit zeven aangeleverde tentamens, niet gepresenteerd als frequentieanalyse of voorspelling:

| Uitwerking | Vragen | PDF-pagina's | Gebruik |
| --- | --- | --- | --- |
| 06-10-2022 | 1–3; 16b; 21–26 | 3–4; 10; 13–14 | Aankoopstaat/resultaatbrug; regulier HK-dividend; valutasystematiek |
| 11-04-2023 | 8–14; 20–23 | 6–7; 10–12 | Verschillende IC-routes binnen één casus; functionele valuta |
| 09-10-2023 | 1b; 16–21; 24–25 | 3; 9–10; 11–13 | VOF als houder; dividendherkomst; koerslagen en eliminaties |
| 22-04-2024 | 9–14; 15–19; 20–22 | 6–8; 9–11; 13 | Valutamethoden; sidestream; eindstand tegenover mutatie |
| 30-09-2024 | 3–4; 9–13 | 4; 7–8 | Aankooplagen en stelselwijziging; wisselende valutamethoden |
| 17-04-2025 | 9–15 | 7–10 | Afwaardering; monetaire positie; deelnemingsverloop |
| 24-09-2025 na normering | 7–14 | 4; 6–8 | Verschillende aandelenrechten; valuta en motivering |

De papieren en uitwerkingen zijn naast elkaar gebruikt bij de nieuwe voorbeelden. Voor Norch is de herkomst van het dividend gecontroleerd in het tentamen 09-10-2023, p. 11–12; de boeking staat in de uitwerking, vraag 18, p. 9. Het oudere model kan casusspecifieke of gecorrigeerde passages bevatten; die worden niet tot universele regel verheven. De ingangsvoorwaarden van een gebruikte formule worden genoemd.

## Logo en gebruik
De samenvatting gebruikt exact hetzelfde C-met-vinkje-SVG als de homepage, met dezelfde mobiele afmetingen en linkerpositie. De kop blijft bovenaan bij scrollen. De terugbalk, tabbladen en hoofdstukbalk zijn op de gemeten kophoogte aangesloten zodat zij elkaar niet overlappen. Nieuwe vergelijkingstabellen krijgen dezelfde mobiele stapeling als de bestaande samenvatting.

## Controle
Node-tests bewaken 40 onderwerpen, 120 oefeningen, 131 historische tentamenvragen, 7 hoofdstukken, bronverwijzingen, rekenvoorbeelden, gedeeld SVG en herhaalbare opbouw. `tests/didactic-clarity-browser.py` test de echte HTTP-app in Chromium en WebKit: nieuwe teksten, filters, VOF/CV-toets, logo, leesbaarheid en geen horizontale pagina-overloop op 320–1440 px. Bestaande regressies voor terugnavigatie, antwoorden, rekenmachine, herstart en klok blijven ongewijzigd.
Lokale componentweergave wordt los benoemd: in deze werkomgeving zijn browser-HTTP-verzoeken geblokkeerd; de lokale visuele controle gebruikt daarom ingesloten bestanden zonder netwerknavigatie. De volledige HTTP-tests draaien in GitHub Actions. Een fysieke iPhone-test wordt niet geclaimd.
