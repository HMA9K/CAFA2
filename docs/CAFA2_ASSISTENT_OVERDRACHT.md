# CAFA2 Assistent: integratie en overdracht

Versie 2026-09-26.4. Repository: HMA9K/CAFA2. Pull-request [#13](https://github.com/HMA9K/CAFA2/pull/13) is op uitdrukkelijk verzoek van de eigenaar samengevoegd naar `main`.

## Aanvulling: knop Kijk mijn antwoord na

De startersknop **Kijk mijn antwoord na** vult de chatbalk met een controleverzoek, inclusief puntenbeoordeling. De tekst kan worden aangepast. Alleen **Versturen** verzendt de tekst, met het dan actuele eigen antwoord en de bestaande vraagcontext. Inloggen en toestemming blijven nodig. Er is geen standwissel of inlevering nodig; opgeslagen antwoord en score blijven behouden. De puntenbeoordeling is feedback in de chat en wordt niet als toetsresultaat opgeslagen.

De knop staat live op [cafa2.pages.dev](https://cafa2.pages.dev), met code `cf2cd37` en deployment `4ac20858-1d4c-4639-85f2-dcdd14c20c62`. De bijbehorende controles en de correctie van de bestaande UI-nulmeting staan bovenaan in [teststatus](CAFA2_ASSISTENT_TESTSTATUS.md). Geen aanvullende configuratie nodig.

## Actueel: assistent in een rechterkolom, 26 september 2026

Op verzoek van de eigenaar krijgt de assistent dezelfde kolomindeling als de casus, aan de rechterkant. De vraag wordt smaller binnen de beschikbare ruimte. Koppen, antwoordvelden, ondernavigatie en modale sluitknoppen worden niet door het paneel bedekt. Een brede casus krijgt extra ruimte; wanneer drie bruikbare kolommen niet passen, staat de assistent boven de vraag in de gewone paginastroom.

De verticale schuifrand bedient de breedte met slepen of pijltoetsen. Home herstelt een derde. × en Escape sluiten het paneel en herstellen de volledige vraagruimte. Alleen de breedte wordt bewaard onder `cafa2-assistant-panel-v1`; deze voorkeur bevat geen gesprek, antwoord of toegangscode. Een tijdelijke smalle viewport overschrijft de desktopvoorkeur niet. De oude vensterpositie wordt niet meer toegepast.

De kolomlogica staat afzonderlijk in `js/study-assistant-panel.mjs`. De bestaande casuskolom en rekenmachine behouden hun eigen bediening. De vakadapter en alle vraagdata, opgeslagen antwoorden, scores en timers blijven behouden. Bij een modaal tentamenvenster wordt de assistent in het inhoudsdeel opgenomen, onder de bestaande sluitknoppen, en bij sluiten weer teruggezet.

Nieuwe browserregressies bewaken het behoud van de logininvoer bij het monteren, verbergen van de launcher tijdens chatten, drie kolommen met een brede casus, bereikbare mobiele chatinvoer, sluiten en herstel van ruimte, breedtevoorkeuren en rekenmachinegebruik. Antwoorden in deze UI-proeven zijn gesimuleerd. Een fysieke telefoon met werkelijk geopend toetsenbord blijft een aparte controle. Zie [teststatus](CAFA2_ASSISTENT_TESTSTATUS.md) voor uitgevoerde proeven en publicatiebewijs.

De rechterkolom is gepubliceerd op [cafa2.pages.dev](https://cafa2.pages.dev). Code [`1c26ad6`](https://github.com/HMA9K/CAFA2/commit/1c26ad6f4b37292bf00cd9dce48d6ffacc2decd5), Cloudflare-deployment `dd614229-2f43-4fdc-a8e9-38c11dd989c7`, geslaagd. [Assistentcontrole](https://github.com/HMA9K/CAFA2/actions/runs/36237658210) en [bestaande validatie](https://github.com/HMA9K/CAFA2/actions/runs/36237658215) zijn geslaagd. Lokaal en in CI slagen 108 Node-tests, twee extractietests, de bestaande regressies en 150 browsercontroles per browser. De live proef bevestigt de rechterkolom, breedtebediening, rekenmachine en bereikbare mobiele invoer. Voor deze wijziging ontbreekt geen configuratie. De recente naslagtegelwijzigingen zijn behouden.

De volgende venstersectie is historisch; de schuifrand van de rechterkolom vervangt de zwevende bediening.

## Eerder: zwevend assistentvenster, 26 september 2026

De assistent heeft dezelfde vensterbediening als de rekenmachine: slepen via de titelbalk, formaat wijzigen met de hoek rechtsonder, verkleinen/herstellen en inklappen/uitklappen. Pijltoetsen bedienen de verplaats- en formaatgrepen; Shift geeft grotere stappen en Home herstelt de standaard. Escape sluit alleen de assistent.

Positie en formaat worden apart opgeslagen onder `cafa2-assistant-window-v1`; dit bevat geen chats, antwoorden of toegangscode. Een smallere viewport begrenst het venster zonder het gekozen desktopformaat te overschrijven. De pagina blijft bedienbaar. Bestaande modale tentamenvensters nemen het zwevende paneel tijdelijk als kind op, zodat beide bruikbaar blijven. Bij sluiten keert het paneel terug naar de pagina. Als vensters elkaar bedekken, kun je de assistent verplaatsen of inklappen.

De vensterlogica staat afzonderlijk in `js/study-assistant-window.mjs`. Vakadapters, vraaginhoud, scores, timers en rekenmachinecode zijn niet gewijzigd. Lokaal slagen 108 Node-tests, twee extractietests, tien regressiescripts en 137 browsercontroles per browser in Chromium en WebKit. De browserantwoorden zijn gesimuleerd; deze ronde voegt geen modelkwaliteitsclaim toe. De build bevat 135 publieke bestanden. Code `0c3186c` is gepubliceerd via deployment `706c09ba-f90c-4a02-8d52-e10c8b75d91a`. Beide Actions-workflows zijn geslaagd en het venster is live gecontroleerd, inclusief echte rekenmachineknoppen en mobiele/verkorte viewport. Zie de [teststatus](CAFA2_ASSISTENT_TESTSTATUS.md) voor de bewijslinks.

## Actueel: gepubliceerd op de gewone CAFA2-site

De afgeronde implementatie staat op [cafa2.pages.dev](https://cafa2.pages.dev). Mergecommit `13a49c6be9c165bc7376e9e8f6abde5ea2b9a620` is succesvol gepubliceerd via Cloudflare-deployment `a75f6b1a-5a89-47f4-bdf8-aa5374266397`. Beide GitHub Actions-workflows op deze mergecommit zijn geslaagd. De assistentworkflow controleert voortaan ook iedere push naar `main`.

De chat is inmiddels ook op de gewone site actief. Na invoer van de productie-API-sleutel door de eigenaar is deployment `5f9c1e58-6a27-4c9f-8880-778c80d2ab3c` vanaf `2957ecc` geslaagd met volledige broncontrole: 38 koppelingen, 115 bestanden, nul fouten en nul lopende indexeringen. De statusroute meldt `ready: true`. Inloggen en één echt modelantwoord zijn gecontroleerd: de assistent corrigeert de verkeerde antwoordletter A naar B bij Kapitaalbelangen vraag 2 en gebruikt twee oorspronkelijke syllabusbestanden. Er ontbreekt geen instelling meer. Geen API-sleutel uitgelezen of in Git opgeslagen. Zie [activering](CAFA2_ASSISTENT_ACTIVEREN.md) en [teststatus](CAFA2_ASSISTENT_TESTSTATUS.md).

De [testsite](https://cafa2-assistent-test.pages.dev) blijft intussen actief met 115 oorspronkelijke bronnen. De afgekeurde afgeleide transcriptie blijft uitgesloten. De bekende methodefout bij de koelcellenopgave en de nog ontbrekende fysieke toetsenbordproef zijn geen onderdeel van de geslaagde kwaliteitscontrole.

De onderstaande secties beschrijven de eerdere implementatie. Uitspraken daarin over een concept-PR of een ongewijzigde productiesite zijn historisch.

## Eerder: documenten, vervolgvragen en publicatiecontrole

De assistent werkt op [de afzonderlijke testsite](https://cafa2-assistent-test.pages.dev). De documentbank bevat 115 oorspronkelijke bronnen, inclusief geconverteerde oude presentaties. Een extra afgeleide tekstversie is na een mislukte inhoudelijke proef ontkoppeld. Alle 40 repetitiebestanden, de bronedities 2025 en 2026 en de aanvullende tentamenpresentaties zijn opgenomen. De laatste 38 koppelingen worden bij publicatie afzonderlijk op identiteit en indexstatus gecontroleerd. Zie [bronstatus](CAFA2_ASSISTENT_BRONSTATUS.md) voor de volledige afbakening, herkomst en het ene nog te beoordelen wetboekoverzicht.

De implementatie is verder uitgewerkt:

- Genummerde vragen over meerdere documenten krijgen afzonderlijke zoekacties voordat het antwoord wordt opgesteld. Samen met eventueel zoeken door het model geldt een maximum van drie zoekacties per bericht. De echte herhaalde proef vindt nu Niedorp-Swaza én Zeevang met juiste methode, koers en journaalpost. Dit bewijst één concrete regressieproef, geen algemene foutloosheid.
- Lange eerdere antwoorden worden niet meer geheel uit de gesprekshistorie verwijderd zodra ze meer dan 6.000 tekens bevatten. De nieuwste context blijft binnen acht berichten en 16.000 tekens behouden; uitzonderlijk lange berichten krijgen een expliciete weglatingsmarkering.
- Een journaalpost of berekening met bekende kolomkoppen wordt ook als tabel getoond als de modeltekst de Markdown-scheidingsregel weglaat. Lege debet- of creditcellen houden hun plaats.
- Nieuwe of gewijzigde lokale bronbytes worden met SHA-256 vergeleken, ook bij ongewijzigde bestandsnaam en bestandsgrootte. De bestaande cataloguscontrole blijft nieuwe MC- en tentameninhoud meenemen via de build. Losse documenten hebben daarnaast een bewuste uploadstap nodig.
- De presentatie-extractie leest opgeslagen berekeningen uit het actieve tabblad, met diatekst, celadressen en formules. De eerste versie nam ook meegekopieerde tabbladen van andere opgaven mee; beide afgeleide zoekversies zijn inmiddels ontkoppeld, omdat de laatste modelproef nog verkeerde bedragen gaf. De originelen blijven beschikbaar. Er zijn twee Python-regressies voor de extractie; zij bewijzen geen modelkwaliteit.
- Cloudflare wacht nu begrensd op nog lopende indexering in dezelfde documentbank. Een tussentijdse build faalde tijdens de upload van de 2025-bronnen; de volgende publicatie slaagde. De nieuwe regressies dekken wachten, blijvend wachten en echte indexeerfouten af.

De recente code staat in `24b0faa`, `d99dbce`, `f337985` en `040222c`. De uiteindelijke test- en deploymentbewijzen staan bovenaan [teststatus](CAFA2_ASSISTENT_TESTSTATUS.md). Geen secrets hoeven opnieuw te worden ingevuld voor de testsite. De oorspronkelijke site volgt nog `main`; deze PR blijft concept. SRA, BELRE3, vraaginhoud, antwoordopslag, scores en timers zijn niet aangepast.

De volgende secties zijn historische statusbeschrijvingen. Gebruik de bovenstaande status en de afzonderlijke bronstatus voor vervolgstappen.

De afsluitende bronselectie `268574f` is gepubliceerd via deployment `d4bc7289-f931-4023-80c8-d0bcdf9c3255`: 115 bestanden, 38 expliciete koppelingen gereed, nul fouten en nul lopende indexeringen. Beide GitHub-workflows zijn geslaagd met 103 Node-tests, twee extractietests en 236 browsercontroles. Eén echte casus blijft inhoudelijk open: de koelcellenberekening van oktober 2022 geeft via de oorspronkelijke uitwerking de juiste bedragen, maar nog een verkeerde methodebenaming. Presenteer deze proef niet als geslaagd. De afgeleide presentatietekst is uit de kennisbank gehouden.

## Eerdere aanvulling: bronkoppeling hersteld

Code `2c9e873` is op 25 september 2026 succesvol gepubliceerd op de testsite: deployment `4ee08a58-1693-4b6e-a9f7-1b1a67b7b8d7`. De bronbank `vs_6ab636fd5e9481919a1535a662158ed4` bevat 95 bestanden; de API-controle meldt 0 mislukte en 0 lopende indexeringen. Alle 18 bestanden uit `assistant/source-attachments.json` hebben status `completed`: acht repetitieopgaven, acht uitwerkingen, het repetitieprogramma en aanvullende literatuur over belastinglatenties. Deze uitvoering voegde geen dubbele bestanden toe (`added: 0`); de 18 bestanden waren bij de hercontrole al gekoppeld.

De mislukte vorige publicatie kwam door twee verkeerd overgenomen bestandsnamen. De dubbele spaties in de originele uitwerkingen van Niedorp-Swaza en Zeevang ontbraken in de koppellijst. Beide namen zijn exact hersteld, zonder bestanden over te slaan of broninhoud te veranderen. De controle verzamelt voortaan alle afwijkende identiteiten vóór enige koppeling. Een nieuwe regressie vergelijkt de volledige koppellijst letterlijk met het bronmanifest, inclusief spaties.

Lokaal slagen 88 Node-tests, de integratie-dry-run, build, deploycontrole en `git diff --check`. De testsite geeft HTTP 200 op `/api/study-status`, met `ready: true` en beide documentvlaggen aan. Deze vlaggen bewijzen de configuratie, niet de kwaliteit van elk antwoord. Zie de actuele sectie in de teststatus voor de afzonderlijke model- en CI-proeven.

Beide GitHub Actions-workflows zijn geslaagd op `2c9e873`; de log bevestigt 88 Node-tests en 230 browsercontroles met gesimuleerde antwoorden. Twee afzonderlijke echte chatverzoeken hebben beide herstelde uitwerkingen teruggevonden: de closing rate-methode en slotkoers bij Niedorp-Swaza en de eerste journaalpost bij Zeevang zijn tegen pagina 1 van de originele PDF's gecontroleerd. Het eerste gecombineerde verzoek vond alleen Niedorp-Swaza; de gerichte vervolgvraag vond Zeevang. Zoeken naar meerdere documenten in één bericht en de consistente beschrijving van gevonden bronnen blijven een expliciet kwaliteitspunt.

De passages hieronder beschrijven eerdere stappen. Uitspraken daarin dat nog geen documenten zijn gekoppeld zijn historische status en worden door deze aanvulling vervangen. De broncontrole is nog niet volledig afgerond voor alle 116 kandidaten: de drie afzonderlijk te beoordelen aanvullende documenten en de oudere/dubbele bronversies blijven open. De oorspronkelijke site `cafa2.pages.dev` is niet omgezet; PR #13 is niet gemerged. Geen secret hoeft opnieuw te worden ingevuld voor deze reparatie.

## Eerdere status: testsite geeft echte modelantwoorden

Na het opwaarderen door de eigenaar geeft [de testsite](https://cafa2-assistent-test.pages.dev) echte antwoorden met `gpt-5.4-mini`. Er zijn 17 geslaagde modelverzoeken uitgevoerd, via de browser en de echte Cloudflare-chatroute. Hints, directe uitwerkingen, een onjuiste antwoordletter, eigen antwoorden, journaalposten, voorraadtabellen, een vraag uit een volledig tentamen en vervolgvragen zijn inhoudelijk beoordeeld. Dit is een beperkte steekproef, geen volledige inhoudscontrole van alle vragen. Zie de [teststatus](CAFA2_ASSISTENT_TESTSTATUS.md) voor resultaten per geval.

De proef vond zichtbare LaTeX-code, ongeschikte tabelkoppen, interne veldnamen en een verwarrende tussenzin bij een getekende correctiesom. De modelinstructies zijn gericht aangepast en de betreffende voorbeelden opnieuw beproefd. Op de uiteindelijke code `aaea2a6` is de tentamenberekening correct en helder; de assistent bevestigt ook eerlijk dat hij de originele repetitieslides niet heeft gelezen. Deployment `7db4b13e-3895-4aea-b0c6-4253e7197383` is geslaagd. Beide GitHub Actions-workflows zijn groen, met 81 Node-tests en 230 browsercontroles; de automatische browserantwoorden zijn gesimuleerd.

Login, beveiligde sessiecookie, status, uitloggen en D1-tellers zijn gecontroleerd. Beide secrets staan al in Cloudflare en hoeven niet opnieuw te worden ingevuld. De eerdere blokkade door ontbrekend API-tegoed is opgelost. De bijbehorende foutafhandeling en zeven regressietests blijven behouden. Geen API-sleutel is uitgelezen, geen bestedingslimiet gewijzigd en geen origineel document geüpload. De oorspronkelijke productiesite en `main` zijn ongewijzigd.

## Eerdere inrichting vóór activering

Op verzoek is [cafa2-assistent-test.pages.dev](https://cafa2-assistent-test.pages.dev) ingericht. Deze afzonderlijke site volgt de werkbranch automatisch, voert de assistentbuild en deploycontrole uit en publiceert `dist`. De eerste deployment van `c33f83a` is geslaagd, inclusief alle vier Functions. De statusroute geeft echte JSON en de browser koppelt het paneel aan de actuele vraag.

Een afzonderlijke D1-testdatabase met EU-jurisdictie, schema, binding en willekeurig sessiegeheim staat klaar. Het voorlopige testmodel is `gpt-5.4-mini`; modelkwaliteit en accounttoegang zijn nog niet getest. `STUDY_ASSISTANT_ENABLED=false`. Alleen `OPENAI_API_KEY` en `STUDY_ACCESS_CODE` moeten voor de eerste modelproef nog rechtstreeks als secrets in Cloudflare worden ingevuld. Zie [activering](CAFA2_ASSISTENT_ACTIVEREN.md) voor de korte handmatige stap.

De toen gepubliceerde codecommit was `b6bc210`, testdeployment `bc07d611-688e-4fe7-afd1-4deb99207a51`. Beide GitHub Actions-workflows zijn geslaagd: [assistentcontrole](https://github.com/HMA9K/CAFA2/actions/runs/36071283868) en [bestaande validatie](https://github.com/HMA9K/CAFA2/actions/runs/36071288614). De afsluitende documentatiecommit publiceerde geen nieuwe code.

Op het bestaande project `cafa2` is uitsluitend deze werkbranch uitgesloten van automatische previews, zodat de oude `exit 0`-fout zich daar niet herhaalt bij een volgende push. De bestaande productiebuild en website volgen nog `main`. Niets is naar `main` gemerged. De repetitiecursus en andere originele documenten zijn nog niet extern geïndexeerd. De eerdere lokale/CI-browserantwoorden waren gesimuleerd; de nieuwe online controle test alleen de uitgezette dienst en echte vraagcontext.

Na de eerste publicatie zijn de wijzigingen van `main` tot en met `1a44e3a` in de werkbranch opgenomen. Alle elf volledige tentamens staan nu in de catalogus: 282 echte tentamenvragen, 3 demovragen en 247 oefenvragen. De nieuwe onderwerpindeling en onafhankelijk scrollende tentamencasus blijven behouden. Het importconflict in `index.html` is opgelost met de actuele scripts plus de assistentmodule. De synthetische opgavereekstests zijn aangepast aan de expliciete bronindeling; een nieuwe regressie controleert alle 282 bronvragen in de vier onderwerpseries, inclusief eigen antwoorden en canonieke revisies. Lokaal slagen 74 Node-tests, de bestaande regressies, build/deploycontrole en 115 browsercontroles per engine in Chromium en WebKit, met gesimuleerde antwoorden.

## Eerdere implementatie- en controlerondes

De assistent is op deze branch in de bestaande CAFA2-pagina geïntegreerd. De dry-run van `scripts/prepare-study-assistant.mjs` is eerst gecontroleerd: precies zeven verwachte bestanden. Daarna is `--apply` uitgevoerd; een tweede dry-run gaf geen wijzigingen. De frontendimports, npm-scripts, ignore-regels en vier Pages Functions staan nu op hun bedoelde plaats. De build levert de publieke `dist` en een afzonderlijke servercatalogus. `main`, de bestaande Pages-instellingen en de productiewebsite zijn niet aangepast.

Alle 247 oefenvragen, 131 echte tentamenvragen en 3 demonstratievragen zijn opnieuw door de canonieke catalogus- en revisietests gehaald. De browserproef gebruikt de echte CAFA2-interface met een gesimuleerde antwoorddienst. De inhoudelijke kwaliteit van een echt model en externe bronpassages zijn hiermee nog niet vastgesteld. Zie [CAFA2_ASSISTENT_TESTSTATUS.md](CAFA2_ASSISTENT_TESTSTATUS.md) voor exacte testresultaten en beperkingen.

Op integratiecommit `d2ccac4` zijn beide GitHub Actions-workflows geslaagd, inclusief 96 browsercontroles in Chromium en 96 in WebKit. De Cloudflare-branchpreview van die commit faalde afzonderlijk: de huidige Pages-build voert `exit 0` uit, zodat de Functions de nog niet gegenereerde servercatalogus niet kunnen vinden. De benodigde preview- en runtime-inrichting staat in het activatiedocument.

Na opname van `main` zijn op codecommit `8a8bbf7` beide workflows opnieuw geslaagd: 65 Node-tests, de actuele tien regressiescripts en 103 browsercontroles in elk van Chromium en WebKit. De Pages-preview van dezelfde commit faalde nog steeds op de ongewijzigde projectbuild. De assistent is daardoor nog niet live. De nieuwe opgavereeks is in de assistentproef meegenomen.

Bij de vervolginventarisatie zijn ook de 40 bestanden van de lokale repetitiecursus gevonden. Zij stonden buiten de eerder bekeken collegemap. Het relatieve bronmanifest omvat nu 116 kandidaatbestanden, waaronder repetitieslides, opgaven, uitwerkingen, syllabi uit 2025 en 2026, tentamens en vier aanvullende cursusdocumenten. De 11 oude `.ppt`-bestanden zijn als PDF in een afzonderlijke lokale stagingmap omgezet. Een persoonlijk document is met reden uitgesloten. De lokale controle vindt 116 van 116 kandidaten gereed, zonder ongeclassificeerde bestanden of scanproblemen. Er is nog geen document geüpload of met File Search verbonden. De huidige productiesite bevat de assistent niet. De branchworkflow controleert ook de gegenereerde catalogus, Functions, routes en openbare uitvoermap; de gedeelde Cloudflare-buildinstelling blijft ongewijzigd.

## Opdracht en afbakening

Werk de voorbereide assistent verder uit en integreer hem in de bestaande CAFA2-leeromgeving, voor alle oefenvraagtypen en alle volledige tentamens. Bouw voort op deze bestanden. Herstructureer de repository niet: dat is een afzonderlijk, later project. Pas SRA en BELRE3 nu niet aan; houd de interface, server en adapterafspraak wel herbruikbaar.

Deze overdracht begon bij `main`-commit `dd813848fcb272e23dd54775642066843e91bfd9`. Latere wijzigingen uit `main` tot en met `f494ae7` zijn in de werkbranch opgenomen om de concept-PR samenvoegbaar te houden. De bestaande rekenmachine-, bronpaneel-, wetboek- en opgavereekswijzigingen blijven behouden. De oude branch `feature/study-assistant` en oudere ZIP-pakketten zijn niet het vertrekpunt.

In de oorspronkelijke overdrachtscommit waren alleen nieuwe bestanden klaargezet. Bij de integratie zijn `index.html`, `package.json` en `.gitignore` gericht aangepast; de vier endpointtemplates zijn naar `functions/api/` gekopieerd. De assistentintegratie wijzigt geen vraagdata, scorelogica, timers of rekenmachinecode. De samenvoeging vanuit `main` neemt de daar intussen gemaakte wijzigingen aan de bestaande leeromgeving mee. De latere testsite-inrichting en echte API-proef staan bovenaan dit document.

## Doorslaggevende gebruikerskeuze: hints zijn geen blokkade

Dit is een oefenomgeving, geen beveiligde examenafname. De leerling mag met de bestaande antwoordknoppen de uitwerking zien. De assistent moet daarom niet moeilijk doen wanneer om een antwoord wordt gevraagd.

| Leervraag of situatie | Vereist gedrag |
| --- | --- |
| 'Hoe begin ik?' / 'Ik snap dit niet' | Eerst een gerichte hint of begripsuitleg, niet ongevraagd de volledige oplossing. |
| 'Wat is het antwoord?' | Direct het antwoord met passende toelichting. Geen verplichte poging, inlevering, bevestiging of standwissel. |
| 'Waarom is B goed?' | Controleer het antwoordmodel en licht de betreffende keuze meteen toe. Als B niet goed is, corrigeer die veronderstelling. |
| 'Waar komt dit bedrag uit de uitwerking vandaan?' | Direct de betreffende berekening en casusgegevens uitleggen. |
| 'Geef de volledige berekening/journaalpost' | De volledige relevante uitwerking geven. |
| 'Vergelijk mijn antwoord met de uitwerking' | Gebruik het actuele eigen antwoord. Bij een leeg antwoord gewoon de oplossing toelichten; verzin geen leerlingfout. |
| 'Alleen een hint, nog geen antwoord' | Respecteer dit, ook als eerder het antwoord is besproken. |
| 'Licht stap 2 toe' na een antwoord | Behoud de gesprekscontext bij dezelfde vraag. |
| Toets loopt, is gepauzeerd of niet nagekeken | Geen didactische blokkade. De assistent verandert de timer niet. |

Dit is ook technisch verwerkt: `makeModelRequest()` krijgt in beide voorkeursstijlen het canonieke antwoordmodel. Er is geen keywordfilter dat de toegang tot uitwerkingen bepaalt. De normale leervraag bepaalt de uitlegstijl via modelinstructies. `canReview` is geen toestemmingstoets meer. De antwoordknop verstuurt, na toegang en privacytoestemming, direct een verzoek om antwoord en uitleg. Gespreksgeschiedenis blijft bij een stijlwissel behouden.

Toegangscode, privacytoestemming en kostenlimieten blijven bestaan. Dat zijn technische waarborgen, geen examenbeveiliging.

## Wat er ligt

| Bestanden | Functie |
| --- | --- |
| `js/study-assistant.mjs` | Chatpaneel, geschiedenis per vraag/poging/revisie, antwoordknop, status, toegang en foutafhandeling. |
| `js/study-assistant-cafa2.mjs` | Alleen-lezen adapter voor CafaPractice en CafaExams; eigen tekst, journalRows, stockCells en voorraadtabelschema. |
| `js/study-assistant-schema.mjs` | Canonieke normalisatie van vraag, casus, opties, uitwerking, bronnen en revisie-ID. |
| `js/study-assistant-render.mjs` | Beperkte Markdownrenderer met tekstnodes en tabellen, geen uitvoerbare model-HTML. |
| `css/study-assistant.css` | Afzonderlijke paneelstijl, mobiel en donkere modus via onder meer data-study-theme. |
| `assistant/server/handler.mjs` | Responses API, sessiecookie, inputcontrole, canonieke servercontext, quota en file_search-aansluiting. |
| `assistant/server/schema.sql` | Technische gebruikstellers, geen chat- of antwoordopslag. |
| `assistant/pages-functions/study-*.js` | Vier endpointtemplates: status, auth, chat en logout. |
| `scripts/prepare-study-assistant.mjs` | Expliciete, herhaalbare integratie. Zonder --apply alleen een overzicht. |
| `scripts/build-study-assistant.mjs` | Genereert servercatalogus in delen en publieke uitvoer in dist. |
| `scripts/assistant-inputs.mjs` en `scripts/build-practice-topics.mjs` | Controleren of nieuwe databestanden door de pagina worden geladen en of gegenereerde MC-vragen overeenkomen met de actuele bron-JSON. |
| `scripts/verify-study-assistant-build.mjs` | Controleert voor deployment catalogus, actualiteit van de vraagdata, vier Functions, routes en scheiding van privébestanden uit dist. |
| `assistant/source-manifest.json` en `scripts/prepare-assistant-sources.mjs` | Relatieve lijst met lokale bronkandidaten, herkenning van nieuwe bestanden in de bronmappen, offline controle en expliciete opt-in voor een volledige externe indexering. Bronbestanden blijven buiten Git. |
| `tests/study-assistant/` | Beveiliging, antwoordgedrag, alle echte vraagrecords en browserproef met mockdienst. |
| `.github/workflows/assistant-handoff.yml` | Controleert de branch zonder deployment of echte modelaanroepen. |

De vragenbank is geen handmatig onderhouden duplicaat: de build leest de actuele `data/`-scripts uit index.html. De huidige gegevens omvatten 247 oefenvragen, 282 echte tentamenvragen en 3 demovragen. De oefenbank bevat 12 benoemde vraagtypen, waaronder Theorie, Reken-/Berekenvraag, Journaalpost, Voorraadtabel, Methodekeuze, Vergelijking, Herkenning en Foutdiagnose.

## Nieuwe vragen en cursusmaterialen

Nieuwe MC-vragen in `content/practice/new-*.json` moeten met `node scripts/build-practice-topics.mjs` naar de bestaande vraagbank worden gegenereerd. De assistentbuild vergelijkt een hash van de actuele auteurdata met die gegenereerde vraagbank en stopt bij een vergeten generatie. Nieuwe tentamenvragen in reeds geladen bestanden komen bij de volgende build direct in de servercatalogus. Een nieuw `data/*.js`-bestand moet ook als script in `index.html` staan; de build weigert een bestand dat daar ontbreekt. De deploycontrole weigert een catalogus waarvan de vraagdata intussen zijn gewijzigd. Deze poorten houden de zichtbare vraag en de servercontext gelijk.

Nieuwe originele PDF-, PPTX-, PPT- en DOCX-bestanden in de aangewezen lokale cursusmappen worden met `node scripts/prepare-assistant-sources.mjs --check` gevonden. De controle stopt bij ongeclassificeerde, ontbrekende of nog niet geconverteerde bronnen. Classificeer een nieuw bestand als kandidaat in `assistant/source-manifest.json` of sluit het daar gemotiveerd uit. Een manifestvermelding geeft de assistent nog geen documentkennis: na rechten- en inhoudscontrole moet de volledige gewenste set opnieuw in een nieuwe CAFA2-vector store worden geïndexeerd en de preview-store-ID worden vervangen. De import vereist daarvoor uitdrukkelijk `--all-groups`. De lokale OneDrive-map kan geen GitHub- of Cloudflare-build starten; voer deze broncontrole uit wanneer daar materiaal wordt toegevoegd. Alle uploads blijven opt-in en buiten de repository.

Nieuwe zelfstandig geschreven theorie op de site is alleen beschikbaar voor de assistent voor zover die in de actuele vraagcontext staat of na gecontroleerde bronindexering teruggevonden wordt. Een aparte samenvattingspagina wordt niet stilzwijgend als gelezen bron gepresenteerd. De bestaande `build:study`- en `build:practice`-procedures blijven nodig wanneer hun auteurbestanden veranderen.

De servercatalogus blijft buiten dist. De bestaande CAFA2-bronbestanden en uitwerkingen die al in de browserdata staan worden hiermee niet ineens privé. Dit project pretendeert geen beveiligde toetsafname te zijn.

## Startprocedure voor Codex

Lees eerst dit document, `docs/CAFA2_ASSISTENT_ACTIVEREN.md` en `docs/CAFA2_ASSISTENT_TESTSTATUS.md`. Respecteer eventuele bestaande AGENTS.md-instructies; maak nu geen nieuwe globale masterstructuur.

Voer vanuit de repository-root uit, met Node.js 22:

```bash
node --test tests/study-assistant/*.test.mjs
node scripts/prepare-study-assistant.mjs
node scripts/prepare-study-assistant.mjs --apply
node scripts/build-study-assistant.mjs
npm test
```

Bekijk daarna de diff. De voorbereidingsprocedure hoort alleen assistentimports, de twee npm-scripts, ignore-regels en vier endpoints toe te voegen. Niet automatisch een oude index.html of hele map uit een ZIP terugplaatsen. Commit geen dist, gegenereerde catalogusdelen, backups of geheimen.

De browserproef vereist Python Playwright en een geïnstalleerde Chromium-browser; WebKit wordt daarnaast in CI gecontroleerd:

```bash
python -m pip install playwright==1.57.0
python -m playwright install chromium webkit
python tests/study-assistant/browser.py
ASSISTANT_BROWSER=webkit python tests/study-assistant/browser.py
```

Een reeds beschikbare Chromium kan via CHROMIUM_PATH worden gekozen. Het testscript start een lokale HTTP-server en simuleert alleen de antwoorddienst. Het gebruikt de echte CAFA2-pagina, niet een nagemaakte voorpagina.

## Uitgevoerde inhoudelijke en technische controle

De CAFA2-adapter onderscheidt nu lege antwoorden van keuze A, koppelt de stabiele optie-ID van tentamens aan de zichtbare antwoordindex en ontleent een historische inzage uitsluitend aan de betreffende poging. Een onderwerpreset begint een eigen gesprek. Journaalpostkolommen en voorraadcellen gaan met het actuele eigen antwoord mee. Bij een expliciete verwijzing naar een eerdere deelvraag in dezelfde casus krijgt het model gericht die eerdere uitwerking. Het antwoordvenster en de historische inzage bieden een knop met de bijbehorende vraagcontext.

De inmiddels aan `main` toegevoegde oefenreeks per tentamenopgave gebruikt samengestelde poging- en vraag-ID's. De assistent zoekt het antwoordmodel voor zo'n vraag via het oorspronkelijke tentamen- en vraag-ID op, maar leest het eigen antwoord onder het samengestelde vraag-ID. Zo blijven ook twee vragen met dezelfde oorspronkelijke vraagnaam uit verschillende tentamens gescheiden. De actieve reeks, historische detailroute en antwoordknop in het resultatenoverzicht zijn getest.

Een routewissel controleert de actuele vraag ook wanneer een modelantwoord sneller terugkomt dan de vertraagde schermverversing. Op mobiel staat de zwevende assistentknop boven de vaste tentamenbalk. Bij een geopende rekenmachine is de assistent vanuit de rekenmachinekop bereikbaar. De server begrenst ook de modelrespons, verwerkt onvolledige en ongeldige antwoorden expliciet en geeft bij quota de werkelijke wachttijd terug. Nieuwe regressietests dekken deze fouten.

## Resterende controles en bronkoppeling

1. Voor gebruik van de bestaande vraagbank ontbreken geen secrets of activeringsinstellingen. De testsite werkt; de limieten blijven 30 verzoeken per UTC-dag en 20 per IP. De proef heeft op 25 september 19 dagtellerplaatsen gebruikt, inclusief twee eerdere afgewezen modelverzoeken. De exacte API-kosten zijn niet gemeten.
2. De 17 echte antwoorden vormen een steekproef. Nog niet inhoudelijk beproefd zijn alle overige vragen, zeer lange gesprekken, ontbrekende antwoordmodellen en uitwerkingen die de limiet van 1.800 uitvoertokens bereiken. De automatische suites blijven gesimuleerde antwoorden gebruiken.
3. Rond de broncontrole af en indexeer de gewenste originele set, inclusief repetitieslides, volgens het activatiedocument. Het manifest bevat 116 lokale kandidaten, waaronder 40 repetitiecursusbestanden; er ontbreken geen bestanden in de laatste lokale inventarisatie. Er is nog geen documentbank. Daarna moet `OPENAI_COURSE_VECTOR_STORE_ID` worden ingesteld en moeten echte File Search-verwijzingen worden gecontroleerd. Bronlabels uit de vragenbank bewijzen geen gelezen bronpassage.
4. Een live overschrijdingsproef van de quota en een fysieke iPhone met geopend toetsenbord blijven afzonderlijke controles. Status, cookie en tellers zijn wel echt getest.

De repository wordt hier niet geherstructureerd. SRA en BELRE3 krijgen later hun eigen adapter en broncatalogus. Pull-request #13 blijft concept; er volgt geen zelfstandige merge naar `main` of productieactivering.

## Acceptatiecriteria

Alle huidige hoofdapp-vragen kunnen hun eigen context aanleveren. Een expliciet antwoordverzoek krijgt geen didactische weigering. Stijlwissels verliezen geen context. Vraagwissels nemen geen gesprek van een andere vraag mee. Een vertraagd antwoord verschijnt nooit bij een nieuwe vraag. Antwoorden, scores, tijd en bestaande broninhoud blijven intact. Ontbrekende backend of bronkennis wordt eerlijk gemeld. Verbruik is begrensd en credentials blijven server-side. Tests en nog ontbrekende controles zijn afzonderlijk benoemd.

SRA en BELRE3 volgen in een latere opdracht via eigen adapters en eigen broncatalogi. De repo-herstructurering blijft eveneens buiten deze opdracht.
