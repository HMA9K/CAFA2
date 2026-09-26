# Herstart via tentamenintro en reset op Dashboard

**Opnieuw beginnen** opent eerst de tentamenintroductie. De gebruiker kan daar opnieuw kiezen voor de gewone toetstijd, dertig minuten extra of oefenen zonder tijdslimiet. Het openen, herladen of verlaten van deze introductie maakt geen nieuwe poging aan en vervangt de bestaande antwoorden, positie of klok niet.

Pas na **Toets starten** begint de nieuwe poging bij vraag één, met lege antwoorden en de gekozen tijdinstellingen. Een eerder lopende poging wordt op dat moment bewaard bij Voltooid, inclusief antwoorden, scores en markeringen. Andere pogingen blijven behouden. Een eerder voltooide poging wordt niet gewijzigd. Bij oefenreeksen per onderwerp opent eerst de onderwerp-/tentamenselectie met de eerdere selectie; een oude indeling wordt pas bij de nieuwe start naar de huidige onderwerpindeling omgezet.

Onderaan het tentamendashboard staat **Alle tentamenvoortgang resetten**, naast de back-up en MC-voortgang. Na bevestiging worden alle lopende en voltooide tentamenpogingen op dit apparaat verwijderd. Dit omvat ook de oefenreeksen met tentamenvragen per onderwerp, antwoorden, scores, markeringen en klokken. De afzonderlijke MC-oefenvoortgang blijft behouden. De knop is uitgeschakeld als er niets te resetten is.

Annuleren verandert niets. Bij een opslagfout blijft de bestaande voortgang behouden. Een succesvolle reset blijft na herladen van kracht en wordt via de bestaande opslaggebeurtenis ook in andere tabbladen verwerkt. De reset kan ook een onleesbare tentamenopslag leegmaken zodat weer gestart kan worden.

## Controle

- Volledige regressiecontrole: `node --run test`, met de DOM-controles uitgevoerd met JSDOM.
- Paginagrootte: `node tests/page-scale.cjs`.
- Assistent: `node --run test:assistant`, 109 tests geslaagd.
- Publicatiepakket: `node scripts/build-study-assistant.mjs` en `node scripts/verify-study-assistant-build.mjs`.
- Gerichte browsercontrole: `node tests/exam-restart-reset-browser.mjs`, desktop 1366 × 900 en mobiel 390 × 844, ook in donkere modus.

De controles omvatten herladen van de herstartintro vóór de start, de keuze voor extra tijd, de overgang van zonder tijdslimiet naar een normale klok, behoud van oude/andere pogingen, lege nieuwe antwoorden, reset annuleren en bevestigen, behoud van MC-antwoorden, opslagfouten, reset na herladen en een ander tabblad. Testgegevens zijn anoniem en staan los van de voortgang van een gebruiker. De browsercontrole blokkeert externe meetverzoeken.

Screenshots staan in `docs/mc-audit/qa-exam-restart-reset/`. Deze tonen het anonieme studieprofiel en bevatten geen ingesloten persoonlijke metadata.

De twee overeenkomstige [SRA-vervolgtaken](https://github.com/HMA9K/SRA/blob/main/docs/cafa2-mc-vervolgtaken-2026-09-26.md) blijven openstaand voor de latere uitvoering, vastgelegd in commit `d0a55ca`.

Bronnen: de bestaande CAFA2-tentamenbediening in `js/exams.js`, pogingbeheer in `js/exam-engine.js` en de [tentamenomgeving](https://cafa2.pages.dev/#dashboard). Officiële tentameninhoud en oorspronkelijke antwoordmodellen zijn niet gewijzigd.

## Live publicatie

- Codecommit `661d99e` is gepubliceerd met Cloudflare-deployment `7550ce87-96a3-4725-9c97-f225e214d9f0`, status success.
- Index, bootstrap en tentamenruntime komen op de live website exact overeen met het gecontroleerde publicatiepakket. Bij HTML is uitsluitend de door Cloudflare toegevoegde analyticsbeacon buiten de vergelijking gehouden.
- De volledige gerichte browsercontrole is op de live website geslaagd: eerst intro, herladen vóór de start, extra tijd kiezen, vorige/andere pogingen behouden, reset annuleren/bevestigen, mobiel en MC-antwoorden behouden na herladen. De drie screenshots tonen de live schermen.
- [GitHub-validatie](https://github.com/HMA9K/CAFA2/actions/runs/36254176436) is geslaagd. De 109 assistenttests en de publicatiebouw zijn eveneens geslaagd.
- Vóór publicatie zijn gewijzigde bestanden, screenshotmetadata en commit-identiteit gecontroleerd. De zestien openbare branchtips zijn vergeleken met de voorbereiding; er waren geen onverwachte wijzigingen. De publicatie voegt uitsluitend de gecontroleerde nieuwe commits toe.
