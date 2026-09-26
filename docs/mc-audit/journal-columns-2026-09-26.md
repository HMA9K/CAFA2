# Vaste kolommen bij journaalposten

Lange rekeningnamen veranderden de breedte van Debet en Credit per tabel. Daardoor stonden opeenvolgende boekingen binnen dezelfde MC-optie, en de boekingen in andere opties, niet boven elkaar.

De gedeelde presentatie herkent rekeningomschrijving, Debet en Credit aan hun kolomkoppen. Journaalposten krijgen vaste kolombreedtes: 60% voor de rekening en 20% per bedragkolom. Modellen met punten gebruiken 48%, 18%, 18% en 16%. Lange omschrijvingen breken binnen hun eigen kolom af. Bedragkoppen en bedragen staan rechts uitgelijnd. Cellen zijn compacter. Op smalle schermen kan iedere tabel horizontaal verschuiven; de minimumbreedte groeit mee met de tekstgrootte.

Dit geldt voor MC-opties, bijbehorende uitwerkingen en tentamenmodellen. De afzonderlijke invultabel blijft opgeslagen antwoorden gebruiken. Gewone balansen met Debet/Bedrag/Credit/Bedrag worden niet als journaalpost ingedeeld. Op desktop staat de vraagknop boven journaalposten zodat deze geen bedragen bedekt. Eerder verborgen debet-/creditkoppen in oudere bronmodellen zijn weer zichtbaar.

## Controle

- `node --run test`: de volledige bestaande regressiecontrole is geslaagd.
- `node scripts/build-study-assistant.mjs` en `node scripts/verify-study-assistant-build.mjs`: publicatiepakket gecontroleerd.
- `node tests/journal-display-browser.mjs`: geslaagd op 1672 × 1148 en 390 × 844, met een versmald casuspaneel en donkere modus.
- Rapallo, 11 april 2023 vraag 7 onderdeel b: alle acht MC-tabellen hebben dezelfde kolomgrenzen, inclusief de lange alternatieve rekeningomschrijving.
- SchierGlas, 24 september 2025 vraag 31: MC-opties en het tentamenmodel met afzonderlijke rode puntenkolom zijn gecontroleerd.
- Eigen journaalinvoer blijft bewaard na herladen. Credit en punten zijn op mobiel bereikbaar door horizontaal te verschuiven.
- 1.264 tabelinstanties uit MC-uitwerkingen, MC-opties en 282 oorspronkelijke tentamenmodellen zijn gecontroleerd: celinhoud blijft identiek, debet-/creditindelingen worden herkend en herhaald toepassen voegt geen dubbele kolomgroepen toe.

De schermafbeeldingen staan in `docs/mc-audit/qa-journal-columns/`. Deze tonen het anonieme studieprofiel en bevatten geen ingesloten persoonlijke metadata.

Dezelfde eis staat in [SRA als openstaande taak](https://github.com/HMA9K/SRA/blob/main/docs/cafa2-mc-vervolgtaken-2026-09-26.md). Die taak is bedoeld voor de latere SRA-uitvoering.

Bronnen: bestaande CAFA2-vraagbank en officiële transcripties in `data/` en `content/practice/exam-mc/`; de [CAFA2-oefenomgeving](https://cafa2.pages.dev/index.html#oefenen).
