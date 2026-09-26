# CAFA2 Assistent: activering na integratie

Bijgewerkt op 26 september 2026, inclusief het rechter assistentpaneel.

## Paneel rechts bedienen

- Open de assistent met **Vraag over deze vraag**.
- Met **Kijk mijn antwoord na** zet je een controleverzoek in de chatbalk klaar, inclusief een vraag naar de verdiende punten. Je kunt de tekst aanpassen en verstuurt hem zelf met **Versturen**. Inloggen en toestemming voor delen blijven nodig. De puntenbeoordeling verschijnt in de chat; je opgeslagen antwoord of score verandert niet.
- De assistent krijgt een eigen kolom rechts. Bij tentamens staat de casus links en de vraag in het midden; de kop en navigatie blijven erbuiten.
- Sleep de verticale schuifrand naar links voor een bredere assistent en naar rechts voor een smallere assistent. De schuifrand werkt ook met pijltoetsen; Home herstelt een derde van de ruimte.
- Gebruik × of Escape om de assistent te verbergen. De vraag krijgt de vrijgekomen ruimte terug.
- De gekozen breedte wordt in deze browser onthouden. Je conceptbericht en gesprek blijven tijdens aanpassen bij dezelfde vraag.
- Op kleine schermen staan assistent en vraag onder elkaar. De chatinvoer houdt ruimte voor de bovenbalk en de navigatie. Bij een kort scherm wordt de chatbediening compacter en staat de navigatie in de gewone paginastroom.
- De rekenmachine blijft als apart zwevend venster bruikbaar. Haar eigen verplaatsing en formaatbediening blijven behouden.

Deze indeling vervangt de eerdere zwevende assistent. De indeling staat live op [cafa2.pages.dev](https://cafa2.pages.dev), code `1c26ad6`, deployment `dd614229-2f43-4fdc-a8e9-38c11dd989c7`. Beide Actions-workflows en de live browsercontrole zijn geslaagd. Er is geen nieuwe instelling of secret nodig. Vernieuw de pagina om de nieuwe indeling te laden. Zie [teststatus](CAFA2_ASSISTENT_TESTSTATUS.md) voor het bewijs.

## Actueel: assistent actief op de gewone site

PR #13 is samengevoegd. [cafa2.pages.dev](https://cafa2.pages.dev) publiceert `main` met de assistentbuild en uitvoermap `dist`. De activeringsdeployment `5f9c1e58-6a27-4c9f-8880-778c80d2ab3c` vanaf `2957ecc2acaf038f05ca7f0c805eab96734b4f85` is geslaagd. De gewone site geeft nu echte modelantwoorden.

**Er ontbreekt geen instelling meer.** De eigenaar heeft `OPENAI_API_KEY` rechtstreeks als secret opgeslagen. Aanwezigheid en type zijn gecontroleerd; de sleutel is niet uitgelezen. De toegangscode en het sessiegeheim stonden al gereed. `STUDY_ASSISTANT_ENABLED=true` is ingesteld en de site is opnieuw gepubliceerd.

### Nu gebruiken

1. Open een oefen- of tentamenvraag op [cafa2.pages.dev](https://cafa2.pages.dev) en open de assistent.
2. Vul de eerder afgesproken toegangscode in en geef toestemming om de vraagcontext te delen.
3. Stel een vraag. Vernieuw de pagina als er nog een oude melding staat dat de assistent niet geactiveerd is.

De statusroute geeft HTTP 200 met `ready: true`. De publicatielog bevestigt 38 gecontroleerde koppelingen, 115 bestanden, nul nieuwe koppelingen, nul mislukte en nul lopende indexeringen. Inloggen en één echt modelantwoord zijn in de productie-browser gecontroleerd: bij Kapitaalbelangen vraag 2 corrigeert de assistent de onjuiste veronderstelling over antwoord A naar B, met uitleg en twee opgehaalde oorspronkelijke syllabusbestanden. Dit is een concrete productieproef, geen volledige nieuwe inhoudsaudit.

### Al ingericht voor productie

- Node.js 22, repository-root, uitvoermap `dist`; `exit 0` is vervangen.
- D1 `cafa2-assistent-production`, EU-jurisdictie, ID `2012e335-1fce-4e7f-8d37-89d0d5ed96f6`, binding `STUDY_DB`; tabel en index uit `assistant/server/schema.sql` bevestigd.
- `STUDY_ACCESS_CODE` en een afzonderlijk willekeurig `STUDY_SESSION_SECRET` als secrets opgeslagen. Geen waarden in de repository.
- `OPENAI_MODEL=gpt-5.4-mini`, `OPENAI_COURSE_VECTOR_STORE_ID=vs_6ab636fd5e9481919a1535a662158ed4`, `STUDY_DAILY_LIMIT=30`, `STUDY_IP_DAILY_LIMIT=20`.
- `OPENAI_API_KEY` als secret en `STUDY_ASSISTANT_ENABLED=true`. Previews blijven uitgeschakeld voor modelaanroepen.

De build controleert de publieke bestanden en canonieke vragen altijd. Online broncontrole vindt plaats zodra de assistent bewust is ingeschakeld:

```sh
node scripts/build-study-assistant.mjs && node scripts/verify-study-assistant-build.mjs && if [ "$STUDY_ASSISTANT_ENABLED" = "true" ]; then node scripts/sync-assistant-store.mjs --apply; else echo "Assistent uitgeschakeld: online broncontrole overgeslagen."; fi
```

Dit maakt ook publicatie van de pagina's mogelijk wanneer de chat bewust wordt uitgezet. Bij de nu ingeschakelde assistent blijven een ontbrekende of ongeldige API-sleutel, verkeerde bronidentiteit en mislukte indexering de build blokkeren. De eerste productiebuild sloeg de online broncontrole over; de activeringsbuild heeft deze volledig uitgevoerd en is geslaagd.

De [testsite](https://cafa2-assistent-test.pages.dev) blijft actief. Beide sites gebruiken dezelfde documentbank, met afzonderlijke gebruikstellers. De limieten zijn niet gewijzigd. Zie [bronstatus](CAFA2_ASSISTENT_BRONSTATUS.md) en [teststatus](CAFA2_ASSISTENT_TESTSTATUS.md). De onderstaande secties zijn historisch.

## Eerdere aanvulling na herstel van twee bronnamen

De documentbank is ingesteld via `OPENAI_COURSE_VECTOR_STORE_ID=vs_6ab636fd5e9481919a1535a662158ed4`. Op 25 september bevestigt de echte API-controle 95 bestanden, zonder mislukte of lopende indexering. Alle 18 regels uit `assistant/source-attachments.json` zijn geïndexeerd, inclusief de uitwerkingen van Niedorp-Swaza en Zeevang. De eerdere fout betrof uitsluitend ontbrekende dubbele spaties in die twee geregistreerde namen. Niets is overgeslagen. Deployment `4ee08a58-1693-4b6e-a9f7-1b1a67b7b8d7` vanaf `2c9e873` is geslaagd.

De bestaande secrets werken ook in de beveiligde buildomgeving en hoeven niet opnieuw te worden ingevuld. De extra synchronisatiestap controleert eerst alle geselecteerde identiteiten, koppelt uitsluitend ontbrekende bestaande uploads en wacht op indexering. Zij uploadt geen lokale documenten en verwijdert niets. In deze hercontrole waren alle 18 al aanwezig, dus `added: 0`. Nieuwe lokale documenten moeten nog steeds bewust door de broncontrole en uploadprocedure. Nieuwe bestandsnamen alleen in de lokale map zijn niet automatisch gekoppeld.

De resterende broncontrole omvat onder meer `Overzicht wetboek.docx`, de wijnpresentatie en de tentamenuitleg van oktober 2022 met ingesloten berekeningstabellen. Oudere/dubbele bronversies vragen een expliciete selectie. De 95 geïndexeerde bestanden betekenen niet dat alle 116 kandidaten inhoudelijk gecontroleerd zijn. Zie de actuele [teststatus](CAFA2_ASSISTENT_TESTSTATUS.md).

## Ingerichte testomgeving

De testsite staat op https://cafa2-assistent-test.pages.dev en volgt automatisch `codex/cafa2-assistant-handoff`. Cloudflare noemt deze branch binnen dit afzonderlijke project **Production**. Dat is de testsite, niet de bestaande website `cafa2.pages.dev`. De testsite is openbaar bereikbaar, met toegangscode voor de chat. Na het opwaarderen door de eigenaar werken echte modelaanroepen: 17 antwoorden zijn ontvangen en inhoudelijk beoordeeld.

| Onderdeel | Ingesteld |
| --- | --- |
| Pages-project | `cafa2-assistent-test`, gekoppeld aan `HMA9K/CAFA2` |
| Branch | `codex/cafa2-assistant-handoff` |
| Build command | `node scripts/build-study-assistant.mjs && node scripts/verify-study-assistant-build.mjs && node scripts/sync-assistant-store.mjs --apply` |
| Output / root / Node.js | `dist` / repository-root / `22` |
| D1 | Aparte database `cafa2-assistent-test`, EU-jurisdictie, binding `STUDY_DB` |
| Schema | `assistant/server/schema.sql` uitgevoerd; tabel en index bevestigd |
| Sessieondertekening | `STUDY_SESSION_SECRET` willekeurig gegenereerd en rechtstreeks als Cloudflare-secret opgeslagen; waarde niet in Git of chat |
| Voorlopig testmodel | `OPENAI_MODEL=gpt-5.4-mini`; accounttoegang bevestigd en een beperkte inhoudelijke steekproef uitgevoerd |
| Activering | `STUDY_ASSISTANT_ENABLED=true`, uitsluitend op de afzonderlijke testsite |
| Toegang en API | `STUDY_ACCESS_CODE` en `OPENAI_API_KEY` door de eigenaar als secrets opgeslagen |
| Testlimieten | `STUDY_DAILY_LIMIT=30`, `STUDY_IP_DAILY_LIMIT=20` |

Eerste geslaagde deployment: `7dee8e44-2d47-4cbd-a119-8030bed341a4`, codecommit `c33f83a`. De log bevestigt Node.js 22.22.0, build plus deploycontrole, geslaagde Function-bundeling en publicatie. `/api/study-status` geeft HTTP 200 en JSON met `course: "CAFA2"`, `knowledge.questions: true` en `ready: false`. De assistent herkent in de echte browser vraag 1 en daarna vraag 2. Dit zijn technische controles zonder modelantwoorden.

Na synchronisatie met `main` tot `1a44e3a` volgden geslaagde automatische deployments van `b5883d8` en `b6bc210`. De laatste is `bc07d611-688e-4fe7-afd1-4deb99207a51`. Deze versie bevat elf volledige tentamens en 282 echte tentamenvragen. De drie POST-routes geven correct 503/JSON met `not_configured` zolang de dienst uitstaat. Ook de context van het nieuw toegevoegde tentamen uit april 2021 is online gecontroleerd.

Het bestaande project `cafa2` behoudt `main`, `exit 0` en output `.`. Alleen de previewbranchselectie is aangepast: include `*`, exclude `codex/cafa2-assistant-handoff`. Daardoor probeert het oude project deze branch niet opnieuw met de verkeerde build te publiceren. Eerdere rode deploymentresultaten blijven historische resultaten. De gewone productiebranch blijft automatisch publiceren.

Bij beide vervolgpushes is op het oude project `is_skipped=true` bevestigd. De bestaande productiedeployment `8022ca96-d53c-4a28-a5df-90b0c660b8d1` bleef actief. Deze controle bevestigt ook de werking van de branchuitsluiting, niet alleen de opgeslagen instelling.

## Nu gebruiken en de volgende stap

**Geen secrets opnieuw invullen.** Beide zijn op 25 september 2026 in Production van het testproject bevestigd. Inloggen, de sessiecookie en uitloggen werken. De testsite is opnieuw gepubliceerd en staat actief.

De eigenaar heeft het API-tegoed opgewaardeerd. Open een vraag op de testsite, open de assistent en stel je vraag. Voor de bestaande vraagbank hoeft niets meer ingesteld te worden. De gebruikslimieten blijven 30 verzoeken per UTC-dag voor de site en 20 per IP. De kwaliteitsproef heeft op 25 september 19 dagtellerplaatsen gebruikt, inclusief twee eerdere verzoeken die wegens tegoed werden afgewezen. De limieten zijn niet verhoogd; exacte API-kosten zijn niet gemeten.

Actuele code: `aaea2a6`, geslaagde deployment `7db4b13e-3895-4aea-b0c6-4253e7197383`. Echte hints, berekeningen, journaalposten, een voorraadtabel, een tentamenvraag, correctie van een verkeerde antwoordletter en vervolgvragen zijn gecontroleerd. Formuleweergave, tabelkeuze en onduidelijke rekenuitleg zijn daarna gericht verbeterd en opnieuw beproefd. Zie [teststatus](CAFA2_ASSISTENT_TESTSTATUS.md) voor de beperkte reikwijdte en CI-resultaten.

De eerdere deployment `04952337-5210-4741-a222-fd1064def0e9` gaf nog `credit_balance_exhausted`. Die blokkade is opgelost. De gerichte foutafhandeling blijft bestaan; zie [OpenAI-foutcodes](https://developers.openai.com/api/docs/guides/error-codes). De documentbank is inmiddels ingesteld; de resterende broncontrole staat bovenaan dit document.

Alleen bij een toekomstige nieuwe omgeving zijn de handmatige secrets `OPENAI_API_KEY` en een `STUDY_ACCESS_CODE` van minimaal 16 tekens opnieuw nodig, rechtstreeks in de beveiligde Cloudflare-instellingen. Plaats ze niet in Git of chat.

De modeldocumentatie bevestigt Responses en File Search voor [GPT-5.4 mini](https://developers.openai.com/api/docs/models/gpt-5.4-mini). Responses werkt binnen het ingestelde API-project. De documentbank is gekoppeld; indexering en inhoudelijke antwoordproeven zijn afzonderlijke controles, vastgelegd in de teststatus.

## Achtergrond: oorspronkelijke Pages-fout op 24 september 2026

Het bestaande Cloudflare Pages-project `cafa2` gebruikte productiebranch `main`, build command `exit 0`, uitvoermap `.` en de repository-root als werkmap. De branchdeployments van `d2ccac4`, `7f48f2e`, `4ec7c76`, `8a8bbf7` en `c33f83a` faalden: Pages voerde `exit 0` uit en kon daarna bij het bundelen van alle vier Functions `../../assistant/server/catalog.generated.mjs` niet vinden. Dat bestand ontstaat pas tijdens de assistentbuild. Die mislukte branchpreviews waren geen runtimeproef. De bestaande productiesite bevat de assistent niet. De afzonderlijke testsite hierboven lost de buildfout op zonder de gedeelde buildinstelling van `main` te wijzigen.

De hieronder beschreven build en D1-inrichting zijn voor `cafa2-assistent-test` uitgevoerd. Verifieer na iedere aanpassing dat `GET /api/study-status` JSON teruggeeft.

De gekozen route is een eigen Git-gekoppeld Pages-project. Zet het bestaande project pas naar de assistentbuild en `dist` om nadat `main` die build bevat en productieactivering uitdrukkelijk is afgesproken. De branchworkflow en de build van de testsite controleren catalogus, vier Functions, routes en de scheiding tussen openbare en privébestanden.

## Eerst integreren en testen

Volg `CAFA2_ASSISTENT_OVERDRACHT.md`. `scripts/prepare-study-assistant.mjs --apply` voegt de frontendimports toe en kopieert de endpointtemplates naar `functions/api/`. De imports in de templates zijn bedoeld voor die uiteindelijke locatie. De build maakt de benodigde servercatalogus en dist.

## Cloudflare Pages

| Instelling | Gewenste waarde na de gecontroleerde integratie |
| --- | --- |
| Framework | None |
| Build command | node scripts/build-study-assistant.mjs && node scripts/verify-study-assistant-build.mjs |
| Output directory | dist |
| Root directory | Bestaande repository-root |
| Node.js | 22 |
| D1-binding | STUDY_DB |

De map functions staat in de repository-root, niet in dist. Controleer eventuele bestaande Wrangler-configuratie, route-excludes en een eigen _worker.js voordat je iets verandert. De voorbereidingsprocedure weigert een bestaande _worker.js of afwijkende endpoints te overschrijven. De ingestelde statische root niet wijzigen voordat de integratie is getest.

Maak een aparte testdatabase; voer `assistant/server/schema.sql` uit en verbind die als STUDY_DB. Gebruik aparte preview- en productie-instellingen. De database bewaart technische tellers en vervaltijden, geen chatteksten of eigen antwoorden.

## Serverconfiguratie

| Naam | Soort | Inhoud |
| --- | --- | --- |
| OPENAI_API_KEY | Secret | Geldige sleutel voor het gekozen OpenAI API-project. |
| OPENAI_MODEL | Variabele | Beschikbaar Responses-model; zelf kiezen en inhoudelijk testen. Er staat geen productiemodel hardcoded. |
| STUDY_ACCESS_CODE | Secret | Willekeurige toegangscode van minimaal 16 tekens voor de beoogde gebruikers. Geen API-sleutel. |
| STUDY_SESSION_SECRET | Secret | Apart willekeurig geheim van minimaal 32 tekens voor sessieondertekening. Niet met gebruikers delen. |
| STUDY_ASSISTANT_ENABLED | Variabele | Eerst false; pas na inrichting en controle true. |
| STUDY_DAILY_LIMIT | Optionele variabele | Standaard 200 verzoeken per UTC-dag voor de omgeving. |
| STUDY_IP_DAILY_LIMIT | Optionele variabele | Standaard 60 verzoeken per UTC-dag per gehashte IP-identificatie. |
| OPENAI_COURSE_VECTOR_STORE_ID | Optionele variabele | Eén CAFA2-store voor theorie en uitwerkingen. |

De bestaande namen OPENAI_REVIEW_VECTOR_STORE_ID en OPENAI_TUTOR_VECTOR_STORE_ID blijven als terugval ondersteund. De voorkeur is COURSE, daarna REVIEW, daarna TUTOR. Beide hulpstijlen kunnen dezelfde bronnen raadplegen: hints zijn een didactische voorkeur, geen geheimhoudingsgrens.

De code begrenst daarnaast sessies op 6 modelverzoeken per minuut en toegangscodepogingen op 8 per 15 minuten per gehashte IP-identificatie. Een collegezaal kan één extern IP-adres delen; stem die limiet bewust af. Stel ook passende API-projectwaarschuwingen in. ChatGPT- en API-gebruik zijn verschillende diensten; geen aanname dat een ChatGPT-abonnement dit betaalt.

Plaats secrets alleen in de daarvoor bedoelde beveiligde runtime-instellingen. Geen sleutels in frontendcode, GitHub, logs, screenshots of chat. De voorbeelden in de tests zijn nepwaarden.

## Originele bronnen

De vraagcatalogus gebruikt de vraagdata en bijbehorende uitwerkingen uit deze repository. Aanvullend is de originele documentbank met 95 bestanden gekoppeld. De afzonderlijke bronmanifest- en importprocedure legt vast welke 116 lokale bestanden in aanmerking komen; manifestregels alleen bewijzen geen indexering of inhoudelijke controle.

Bij toekomstige toevoegingen gelden twee stappen. Nieuwe MC-vragen in `content/practice/new-*.json` moeten eerst met `node scripts/build-practice-topics.mjs` worden gegenereerd; de assistentbuild weigert een verouderde vraagbank. Nieuwe tentamenbestanden in `data/` moeten door `index.html` worden geladen; anders stopt de build. Daarna maakt iedere assistentbuild een actuele servercatalogus. Nieuwe of gewijzigde zelfstandige cursusdocumenten moeten apart door de onderstaande broncontrole en, na de vereiste broncontrole, opnieuw worden geïndexeerd. De lokale bronmap triggert zelf geen Cloudflare-deployment.

Onderstaande tabel is de oorspronkelijke inventarisatie vóór upload, met de toen genoteerde aandachtspunten. De actuele technische indexeringsstatus staat bovenaan:

| Bronset | Aangetroffen bestanden | Nog nodig voor koppeling |
| --- | --- | --- |
| Syllabus 2026 | `2026 Syllabus CAFA2 Deel 1 Kapitaalbelangen.pdf`, `2026 Syllabus CAFA2 Deel 2 Vreemde valuta.pdf`, `2026 Syllabus CAFA2 Deel 3 Consolideren.pdf` | Toestemming voor upload naar uitsluitend een CAFA2-store; controle van tekst en tabellen. |
| Syllabusopgaven 2026 | Deel `1a`, `1b`, `2a`, `2b`, `3a`, `3b`, telkens een bestand met `opgaven` en een met `uitwerking opgaven` onder `Onderwijsmateriaal/Syllabus opgaven/` en `Onderwijsmateriaal/Syllabus uitwerkingen/` | Koppel opgave en uitwerking als paar; controleer bronpassages en rekenstappen. |
| Tentamens met uitwerkingen | De eerdere tien paren plus `20260429` onder `Tentamens/`: samen 22 bestanden. De opgave van `2021-04` is een `.docx`, de overige paren zijn PDF's. | Controleer de officiële status van het paar uit 2026 en per tentamen of opgave, uitwerking en jaartal overeenkomen. |
| Collegeslides | `.pptx`-bestanden onder `Thieu Mooren/`, met bestandsnamen waarin Nyenrode-copyright staat. | Afzonderlijke toestemming en gecontroleerde conversie/tekstcontrole voordat deze extern worden geïndexeerd. |
| Repetitiecursus | 40 bestanden onder de lokale map `Repetitiecursus/`: 10 `.pptx`-presentaties, 11 oude `.ppt`-presentaties, 2 PDF-schema's met journaalposten, 8 opgaven, 8 bijbehorende uitwerkingen en 1 programma-PDF. | Indexeer de slides en opgave-uitwerkingparen als eigen bronset; controleer afbeeldingen en rekenkundige tabellen visueel. De 11 `.ppt`-bestanden zijn lokaal als PDF klaargezet. |
| Materiaal 2025 en aanvullingen | 3 syllabusdelen, 12 opgave- en uitwerkingsbestanden uit 2025, een CAFA2-tentamenpaar uit 2022 in DOCX en 4 aanvullende cursusdocumenten. | Controleer overlap met 2026, de herkomst en rechten van de aanvullende literatuur en wetboekkopie, en de officiële status van het DOCX-tentamenpaar. |

De twaalf syllabusoefenbestanden heten precies:

- `2026 Syllabus CAFA2 deel 1a - opgaven kapitaalbelangen owp.pdf` en `2026 Syllabus CAFA2 deel 1a - uitwerking opgaven kapitaalbelangen owp.pdf`.
- `2026 Syllabus CAFA2 deel 1b - opgaven kapitaalbelangen extra.pdf` en `2026 Syllabus CAFA2 deel 1b - uitwerking opgaven kapitaalbelangen extra.pdf`.
- `2026 Syllabus CAFA2 deel 2a - opgaven vreemde valuta owp.pdf` en `2026 Syllabus CAFA2 deel 2a - uitwerking opgaven vreemde valuta owp.pdf`.
- `2026 Syllabus CAFA2 deel 2b - opgaven vreemde valuta extra.pdf` en `2026 Syllabus CAFA2 deel 2b - uitwerking opgaven vreemde valuta extra.pdf`.
- `2026 Syllabus CAFA2 deel 3a - opgaven consolidatie owp.pdf` en `2026 Syllabus CAFA2 deel 3a - uitwerking opgaven consolidatie owp.pdf`.
- `2026 Syllabus CAFA2 deel 3b - opgaven consolidatie extra.pdf` en `2026 Syllabus CAFA2 deel 3b - uitwerking opgaven consolidatie extra.pdf`.

De bestanden horen niet in de openbare repository. Een lokale bestandsnaam of bronlabel bewijst geen gelezen passage. De bronmanifest noemt alleen relatieve paden; `CAFA2_SOURCE_ROOT` verwijst lokaal naar de CAFA2-studiemap en `CAFA2_CONVERTED_ROOT` optioneel naar een afgeschermde map met de 11 omgezette presentatie-PDF's. De originele bestanden blijven ongewijzigd. Voor een echte File Search-proef zijn de geselecteerde bestanden, toestemming voor externe verwerking, een beveiligd ingestelde API-sleutel en daarna `OPENAI_COURSE_VECTOR_STORE_ID` nodig. Zonder deze bronset kan de assistent al met de bestaande CAFA2-vraagbank werken, mits de serverconfiguratie en modelkwaliteit apart zijn gecontroleerd.

De 11 oude repetitiepresentaties zijn zonder wijziging van de originelen naar 11 PDF's in een afzonderlijke lokale stagingmap omgezet. De 113 PDF-pagina's komen overeen met de 113 bron-dia's en hebben uitleesbare tekst. Een visuele steekproef op drie reken- en journaalpostdia's liet geen afsnijding zien. Dat is geen volledige inhoudscontrole van alle pagina's. Sommige moderne `.pptx`-dia's bevatten belangrijke beeldinhoud; controleer die voor File Search, omdat tekstextractie een schema of tabel kan missen.

De offline broncontrole is vanaf de repository-root te herhalen met de twee lokale mapvariabelen. Met beide mappen beschikbaar zijn 105 bestanden direct in een ondersteund formaat en 11 via de PDF-conversies klaar, samen 116 van 116 kandidaten. Eén persoonlijke vragen-DOCX is expliciet uitgesloten. De controle meldt 0 ongeclassificeerde bestanden en 0 scanproblemen. Zonder de conversiemap meldt zij 11 nog om te zetten presentaties. Nieuwe bestanden in `Onderwijsmateriaal`, `Tentamens`, `Thieu Mooren` of `Repetitiecursus` worden zichtbaar en blokkeren de controle totdat ze in het manifest zijn opgenomen of gemotiveerd zijn uitgesloten. Geen van deze opdrachten uploadt inhoud:

```powershell
$env:CAFA2_SOURCE_ROOT = Read-Host 'Lokale CAFA2-bronmap'
$env:CAFA2_CONVERTED_ROOT = Read-Host 'Lokale map met geconverteerde repetitieslides'
node scripts/prepare-assistant-sources.mjs --check
```

Een externe import wordt pas gestart met `--upload --all-groups` en de controleopties die het script zelf noemt. Dit maakt steeds een **nieuwe volledige** CAFA2-vector store: bij een nieuwe bron moet de eerdere gewenste bronset dus mee, anders raakt de assistent die bronnen kwijt bij het vervangen van de store-ID. De API-sleutel wordt uitsluitend via een beveiligde lokale omgeving of runtime ingesteld; geef hem nooit als commandoregelargument. Het script meldt de nieuwe ID pas na volledige indexering. Controleer daarna de vindplaatsen bij enkele concrete vraag-antwoorden voordat de store-ID in een preview wordt vervangen. Een gedeeltelijke of mislukte import mag de gekoppelde store niet vervangen.

De scan herkent nieuwe paden en ontbrekende of nog te converteren bestanden. Een inhoudelijk vervangen bestand met dezelfde naam wordt niet aan een vorige import vergeleken; plan ook daarvoor bewust een nieuwe volledige indexering. Een nieuw stuk theorie dat alleen op een zelfstandige sitepagina staat, is niet automatisch een gelezen File Search-bron. Voeg het als gecontroleerd brondocument aan de bronset toe als de assistent het buiten de vraagcontext moet kunnen gebruiken.

Voor uitgebreide documentkennis: gebruik alleen bestanden die voor dit doel mogen worden gedeeld, indexeer ze in een CAFA2-vector store en koppel de store-ID. Controleer proefondervindelijk of tabellen en bronlocaties correct worden teruggevonden. Een bestandsnaam is geen bewijs dat een specifieke pagina is gelezen. Controleer ondersteuning van het gekozen bestandsformaat voordat je uploadt; zet slides of scans zo nodig om naar een gecontroleerde representatie. Uploads, opslag en modelcalls mogen niet stilzwijgend worden uitgevoerd.

## Controle en terugzetten

Test status, login, een vraag met eigen antwoord, een antwoordverzoek in hintstijl, een vervolg op de uitwerking, quotum en uitschakeling. GET /api/study-status moet JSON teruggeven, nooit een statische fallbackpagina. Test ook cookiegedrag en D1 op de echte preview, niet alleen met mocks.

Test voor activering in productie ten minste een meerkeuzevraag, berekening, open vraag, journaalpost en voorraadtabel. Doe de bron- en modelkwaliteitscontrole apart van de technische controle. Leg ontbrekende rechten of configuratie precies vast. Niet automatisch mergen of productie activeren.

Uitschakelen: zet STUDY_ASSISTANT_ENABLED op false en pas de runtimewijziging toe volgens de hostingprocedure. De integratie kan via een afzonderlijke revert worden teruggedraaid. Oude kosten of geüploade bronopslag worden hierdoor niet gewist.

## Technische referenties

Geraadpleegd op 24 september 2026:

- OpenAI File Search: https://developers.openai.com/api/docs/guides/tools-file-search
- Cloudflare Pages Functions: https://developers.cloudflare.com/pages/functions/get-started/
- Cloudflare bindings en secrets: https://developers.cloudflare.com/pages/functions/bindings/
- Cloudflare Pages buildconfiguratie: https://developers.cloudflare.com/pages/configuration/build-configuration/
- Cloudflare handmatige Pages-deployment: https://developers.cloudflare.com/pages/get-started/direct-upload/
