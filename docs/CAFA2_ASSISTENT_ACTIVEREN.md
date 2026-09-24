# CAFA2 Assistent: activering na integratie

Dit is een voorbereidingsdocument. Geen account, productie-instelling, secret of originele bron is door deze overdracht aangemaakt of gewijzigd.

## Eerst integreren en testen

Volg `CAFA2_ASSISTENT_OVERDRACHT.md`. `scripts/prepare-study-assistant.mjs --apply` voegt de frontendimports toe en kopieert de endpointtemplates naar `functions/api/`. De imports in de templates zijn bedoeld voor die uiteindelijke locatie. De build maakt de benodigde servercatalogus en dist.

## Cloudflare Pages

| Instelling | Gewenste waarde na de gecontroleerde integratie |
| --- | --- |
| Framework | None |
| Build command | node scripts/build-study-assistant.mjs |
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

Er zijn nog geen oorspronkelijke syllabi, slides of tentamen-PDF's voor deze assistent geüpload. De huidige catalogus gebruikt de bestaande vraagdata en bijbehorende uitwerkingen uit deze repository.

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
