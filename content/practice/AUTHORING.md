# MC-vragen per onderwerp

De gebruiker heeft 19 onderwerpen goedgekeurd in topics.json. De tentamens zijn leidend; per onderwerp minimaal 10 verschillende vragen in totaal. Root bepaalt targets na de inventarisatie. Bestaande 120 vragen behouden hun IDs en scores; aanvullingen krijgen nieuwe IDs binnen de bestaande vier delen.

Nieuwe bestanden: content/practice/new-<batch>.json, elk een array van vragen. Schrijf deze zelfstandig als vakinhoudelijke oefenvarianten, met voldoende gegevens en precies één juist antwoord. Geen opvulling met uitsluitend andere bedragen. Wissel herkenning, berekening, journaalpost, foutdiagnose, vergelijking, balansstand/jaarresultaat en eerste/vervolgjaar af waar de bron dit ondersteunt.

Schema:

```json
{
  "key": "unieke-stabiele-vraagcode",
  "topicId": "een-topic-id-uit-topics",
  "title": "Korte concrete titel",
  "type": "Berekening",
  "intro": "Zelfstandige casuscontext, geen verwijzing naar vorige vraag.",
  "facts": [["Gegeven", "Waarde en eenheid"]],
  "task": "Precies welke grootheid, welk tijdstip en welke jaarrekening wordt gevraagd?",
  "options": [
    {"text": "Antwoord A", "why": "Specifieke uitleg voor deze optie."},
    {"text": "Antwoord B", "why": "Specifieke fout en reden."},
    {"text": "Antwoord C", "why": "Specifieke fout en reden."},
    {"text": "Antwoord D", "why": "Specifieke fout en reden."}
  ],
  "correct": 0,
  "explanation": ["Stap 1 met tussenberekening.", "Stap 2 en aansluiting/controle."],
  "pattern": ["Herken: beslissende casuskenmerken.", "Aanpak: overdraagbare werkwijze.", "Controle: valkuil of controleverband."],
  "sources": [{"file":"exacte bronbestandsnaam.pdf","pages":"PDF-pagina's","label":"Tentamen datum, opgave X, vraag Y, p. Z; eigen oefenvariant","examId":"YYYYMMDD"}],
  "difficulty": "basis",
  "skill": "korte unieke getoetste vaardigheid",
  "check": {"description":"Onafhankelijke rekencontrole indien berekening","actual": 12000, "expected":12000}
}
```

Voor een journaalpost/table mag een option `table: {headers:[...],rows:[[...],...]}` gebruiken in plaats van text. Gebruik hiervoor echte bedragen en debet/creditkolommen; alle vier opties dezelfde vorm. caseTables is optioneel (zelfde structuur met caption/note). `check` is alleen behulpzaam bij werkelijk zelfstandig berekende expected versus formule-uitkomst; spiegel geen identieke literalen als schijncontrole.

De opties blijven geordend zoals geschreven; root roteert nieuwe vragen deterministisch zodat de juiste positie evenwichtig varieert. Voeg geen antwoordletters aan waarom/uitleg toe. Alle juiste opties krijgen ook een inhoudelijke why. Bronnen horen zowel oorspronkelijke examenvraag als bijpassende syllabus te noemen als beschikbaar. Noem nooit een examenvraag als basis zonder die daadwerkelijk te lezen. Syllabus-only is toegestaan bij een onderwerp dat niet in de 11 tentamens voorkomt; dat wordt zichtbaar vermeld.

Vaktechnische grenzen: geen actuele wet claims toevoegen, gebruik aangeleverde syllabus en wetkopie. Belastingpercentages zijn casusgegevens. Sidestream NVW afnemend/NIET afnemend zijn aparte topics; geen automatische VP-sidestream. Proportioneel heeft eigen topic. Vaste-actieftransacties worden niet als voorraadvragen ingedeeld. Laat belastingeffecten niet dubbel meetellen als losse primaire onderwerpvraag tenzij juist dát wordt gevraagd.
