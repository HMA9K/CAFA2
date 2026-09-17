(function (root) {
  'use strict';
  if (!root.CAFA2_DATA || !root.CAFA2_DATA.modules) throw new Error('CAFA2-configuratie ontbreekt.');
  root.CAFA2_DATA.modules.val = {
  "id": "cafa2-cirrus-valuta-30-v1",
  "title": "Vreemde valuta",
  "stages": [
    {
      "title": "De basis",
      "subtitle": "Valuta en methode herkennen",
      "range": "1–5"
    },
    {
      "title": "De juiste koers",
      "subtitle": "Eén post, één beslissing",
      "range": "6–10"
    },
    {
      "title": "Meerdere momenten",
      "subtitle": "Splitsen en weer samenvoegen",
      "range": "11–15"
    },
    {
      "title": "Waardering verandert",
      "subtitle": "Afwaarderen en verkopen",
      "range": "16–20"
    },
    {
      "title": "Het koersresultaat",
      "subtitle": "Van monetaire positie naar resultaat",
      "range": "21–25"
    },
    {
      "title": "Alles komt samen",
      "subtitle": "Resultaat, reserve en deelneming",
      "range": "26–30"
    }
  ],
  "sources": {
    "s2def": {
      "label": "Syllabus CAFA2 (Nyenrode), Deel 2, §2–3, p. 4–6; RJ 122.106–122.109.",
      "file": "2026 Syllabus CAFA2 Deel 2 Vreemde valuta.pdf",
      "pages": "4–6"
    },
    "s2method": {
      "label": "Syllabus CAFA2 (Nyenrode), Deel 2, §4, p. 7.",
      "file": "2026 Syllabus CAFA2 Deel 2 Vreemde valuta.pdf",
      "pages": "7"
    },
    "s2temp": {
      "label": "Syllabus CAFA2 (Nyenrode), Deel 2, §4.1, p. 8.",
      "file": "2026 Syllabus CAFA2 Deel 2 Vreemde valuta.pdf",
      "pages": "8"
    },
    "s2mon": {
      "label": "Syllabus CAFA2 (Nyenrode), Deel 2, §4.1, p. 9 en voorbeeld p. 15.",
      "file": "2026 Syllabus CAFA2 Deel 2 Vreemde valuta.pdf",
      "pages": "9, 15"
    },
    "s2close": {
      "label": "Syllabus CAFA2 (Nyenrode), Deel 2, §4.2, p. 9 en voorbeeld p. 16–17.",
      "file": "2026 Syllabus CAFA2 Deel 2 Vreemde valuta.pdf",
      "pages": "9, 16–17"
    },
    "wijo": {
      "label": "Syllabus CAFA2 (Nyenrode), uitwerkingen Deel 2a, Wijo, vraag 2–5, p. 4–8.",
      "file": "2026 Syllabus CAFA2 deel 2a - uitwerking opgaven vreemde valuta owp.pdf",
      "pages": "4–8"
    },
    "corona": {
      "label": "Syllabus CAFA2 (Nyenrode), uitwerkingen Deel 2a, Corona, vraag 3–6, p. 10–12.",
      "file": "2026 Syllabus CAFA2 deel 2a - uitwerking opgaven vreemde valuta owp.pdf",
      "pages": "10–12"
    },
    "md": {
      "label": "Syllabus CAFA2 (Nyenrode), uitwerkingen Deel 2b, M&D, vraag 1–4, p. 40–41.",
      "file": "2026 Syllabus CAFA2 deel 2b - uitwerking opgaven vreemde valuta extra.pdf",
      "pages": "40–41"
    },
    "t25building": {
      "label": "Nyenrode, uitwerking tentamen 24-09-2025 na normering, opgave 2, vraag 9a, p. 6.",
      "file": "20250924 Uitwerking tentamen CAFA2 (na normering).pdf",
      "pages": "6"
    },
    "t25stock": {
      "label": "Nyenrode, uitwerking tentamen 24-09-2025 na normering, opgave 2, vraag 9b–10, p. 6–7.",
      "file": "20250924 Uitwerking tentamen CAFA2 (na normering).pdf",
      "pages": "6–7"
    },
    "t24close": {
      "label": "Nyenrode, uitwerking tentamen 30-09-2024, opgave 2, vraag 11b, p. 8.",
      "file": "20240930 Uitwerking tentamen CAFA2.pdf",
      "pages": "8"
    },
    "t25close": {
      "label": "Nyenrode, uitwerking tentamen 17-04-2025, opgave 2, vraag 13–14, p. 9.",
      "file": "20250417 Uitwerking tentamen CAFA2.pdf",
      "pages": "9"
    },
    "t25mon": {
      "label": "Nyenrode, uitwerking tentamen 17-04-2025, opgave 2, vraag 11, p. 8.",
      "file": "20250417 Uitwerking tentamen CAFA2.pdf",
      "pages": "8"
    },
    "s2sale": {
      "label": "Syllabus CAFA2 (Nyenrode), Deel 2, §4.1, p. 8.",
      "file": "2026 Syllabus CAFA2 Deel 2 Vreemde valuta.pdf",
      "pages": "8"
    },
    "s1nvw": {
      "label": "Syllabus CAFA2 (Nyenrode), Deel 1, §5.1.2, p. 16–17: resultaat en dividend bij NVW.",
      "file": "2026 Syllabus CAFA2 Deel 1 Kapitaalbelangen.pdf",
      "pages": "16–17"
    }
  },
  "questions": [
    {
      "id": 1,
      "stage": 0,
      "title": "Welke valuta bedoelen we?",
      "type": "Theorie",
      "intro": "Een onderneming onderscheidt een lokale valuta, een functionele valuta en een presentatievaluta.",
      "facts": [],
      "task": "Wat is de functionele valuta?",
      "options": [
        {
          "text": "De valuta van de economische omgeving waarin de onderneming actief is.",
          "why": "De economische omgeving is bepalend, niet alleen de vestigingsplaats."
        },
        {
          "text": "De valuta waarin de jaarrekening wordt gepresenteerd.",
          "why": "Dit is de presentatievaluta."
        },
        {
          "text": "De valuta waarin de moeder haar aandelenkapitaal heeft gestort.",
          "why": "De stortingsvaluta bepaalt de functionele valuta niet automatisch."
        },
        {
          "text": "De valuta van het land waarin de onderneming is gevestigd.",
          "why": "Dit is de lokale valuta."
        }
      ],
      "correct": 0,
      "explanation": [
        "De functionele valuta sluit aan op de economische omgeving waarin de onderneming geldmiddelen ontvangt en uitgeeft.",
        "De lokale valuta en de presentatievaluta kunnen daarvan afwijken."
      ],
      "pattern": "Begin bij de economische activiteiten. Bepaal daarna pas welke omrekenmethode nodig is.",
      "refs": [
        "s2def"
      ],
      "related": [
        2,
        3
      ],
      "variant": true
    },
    {
      "id": 2,
      "stage": 0,
      "title": "Gelijke functionele valuta",
      "type": "Theorie",
      "intro": "Noord bv heeft een buitenlandse deelneming in Oslo.",
      "facts": [
        [
          "Functionele valuta Noord",
          "Euro"
        ],
        [
          "Lokale valuta deelneming",
          "Noorse kroon (NOK)"
        ],
        [
          "Functionele valuta deelneming",
          "Euro"
        ],
        [
          "Aan te leveren cijfers",
          "De jaarrekening van de deelneming luidt in NOK."
        ]
      ],
      "task": "Welke omrekenmethode past bij deze situatie?",
      "options": [
        {
          "text": "Tijdstipmethode, omdat de functionele valuta van moeder en deelneming gelijk zijn.",
          "why": ""
        },
        {
          "text": "Slotkoersmethode, omdat de lokale valuta van de deelneming van de euro afwijkt.",
          "why": ""
        },
        {
          "text": "Geen omrekening, omdat de functionele valuta van beide ondernemingen de euro is.",
          "why": ""
        },
        {
          "text": "Slotkoersmethode, omdat beide ondernemingen de euro als functionele valuta hebben.",
          "why": ""
        }
      ],
      "correct": 0,
      "explanation": [
        "De aangeleverde cijfers luiden in NOK en moeten dus worden omgerekend.",
        "De functionele valuta van beide ondernemingen is de euro. De syllabus koppelt die situatie aan de tijdstipmethode."
      ],
      "pattern": "Vergelijk de functionele valuta met elkaar. Alleen naar de lokale valuta kijken is onvoldoende.",
      "refs": [
        "s2method"
      ],
      "related": [
        3,
        6,
        8
      ],
      "variant": true
    },
    {
      "id": 3,
      "stage": 0,
      "title": "Een zelfstandige activiteit",
      "type": "Theorie",
      "intro": "Een Nederlandse moeder met de euro als functionele valuta bezit een Zweedse deelneming.",
      "facts": [
        [
          "Verkoopprijzen en belangrijkste kosten",
          "Worden hoofdzakelijk bepaald en afgewikkeld in SEK."
        ],
        [
          "Financiering",
          "De deelneming trekt zelf lokale financiering aan."
        ],
        [
          "Kasstromen",
          "Voldoende om zelfstandig de verplichtingen te betalen."
        ],
        [
          "Transacties met de moeder",
          "Beperkt."
        ],
        [
          "Presentatie moeder",
          "Euro."
        ]
      ],
      "task": "Wat is de functionele valuta van de Zweedse deelneming, en met welke methode worden haar cijfers in SEK omgerekend voor de jaarrekening van de Nederlandse moeder?",
      "options": [
        {
          "text": "Functionele valuta euro; omrekening met de slotkoersmethode.",
          "why": ""
        },
        {
          "text": "Functionele valuta euro; omrekening met de tijdstipmethode.",
          "why": ""
        },
        {
          "text": "Functionele valuta SEK; omrekening met de slotkoersmethode.",
          "why": ""
        },
        {
          "text": "Functionele valuta SEK; omrekening met de tijdstipmethode.",
          "why": ""
        }
      ],
      "correct": 2,
      "explanation": [
        "Verkoopprijzen en kosten wijzen op SEK. Zelfstandige financiering en kasstromen ondersteunen die beoordeling.",
        "De functionele valuta wijkt af van die van de moeder. Daarom volgt de slotkoersmethode."
      ],
      "pattern": "Eerst de economische omgeving beoordelen, dan de functionele valuta vergelijken en ten slotte de methode kiezen.",
      "refs": [
        "s2def",
        "s2method"
      ],
      "related": [
        1,
        2,
        8
      ],
      "variant": true
    },
    {
      "id": 4,
      "stage": 0,
      "title": "Monetair of niet-monetair?",
      "type": "Theorie",
      "intro": "De jaarrekening wordt omgerekend volgens de tijdstipmethode.",
      "facts": [],
      "task": "Welke combinatie bevat uitsluitend monetaire posten?",
      "options": [
        {
          "text": "Liquide middelen, machines en crediteuren.",
          "why": ""
        },
        {
          "text": "Voorraden, machines en goodwill.",
          "why": ""
        },
        {
          "text": "Debiteuren, liquide middelen en een langlopende lening.",
          "why": ""
        },
        {
          "text": "Debiteuren, voorraden en een langlopende lening.",
          "why": ""
        }
      ],
      "correct": 2,
      "explanation": [
        "Vorderingen en liquide middelen zijn monetaire activa. Schulden, zoals een langlopende lening, zijn monetaire passiva.",
        "Voorraden, machines en goodwill horen niet in deze combinatie van monetaire posten."
      ],
      "pattern": "De monetaire positie bestaat uit monetaire activa min monetaire passiva. Voorraad hoort daar niet in.",
      "refs": [
        "s2temp"
      ],
      "related": [
        5,
        21,
        22
      ],
      "variant": true
    },
    {
      "id": 5,
      "stage": 0,
      "title": "Debiteuren op balansdatum",
      "type": "Rekenvraag",
      "intro": "De balans van Nord wordt volgens de tijdstipmethode omgerekend.",
      "facts": [
        [
          "Debiteuren op 31 december",
          "SEK 480.000"
        ],
        [
          "Koers bij ontstaan vordering",
          "€ 0,0880 per SEK"
        ],
        [
          "Koers op 1 januari",
          "€ 0,0885 per SEK"
        ],
        [
          "Gemiddelde koers",
          "€ 0,0890 per SEK"
        ],
        [
          "Slotkoers 31 december",
          "€ 0,0895 per SEK"
        ]
      ],
      "task": "Welke berekening geeft de boekwaarde van de debiteuren in euro?",
      "options": [
        {
          "lines": [
            "480.000 × 0,0880"
          ],
          "result": "€ 42.240",
          "value": "42240.0000",
          "expression": "480000*0.0880",
          "why": "De ontstaanskoers blijft niet gelden voor de balanswaardering van een monetaire vordering."
        },
        {
          "lines": [
            "480.000 × 0,0885"
          ],
          "result": "€ 42.480",
          "value": "42480.0000",
          "expression": "480000*0.0885",
          "why": "De koers op 1 januari is niet de koers op de gevraagde balansdatum."
        },
        {
          "lines": [
            "480.000 × 0,0895"
          ],
          "result": "€ 42.960",
          "value": "42960.0000",
          "expression": "480000*0.0895",
          "why": ""
        },
        {
          "lines": [
            "480.000 × 0,0890"
          ],
          "result": "€ 42.720",
          "value": "42720.0000",
          "expression": "480000*0.0890",
          "why": "Een monetaire balanspost volgt niet de gemiddelde koers."
        }
      ],
      "correct": 2,
      "explanation": [
        "Debiteuren zijn monetair. De balanswaardering volgt daarom de slotkoers.",
        "SEK 480.000 × € 0,0895 = € 42.960."
      ],
      "pattern": "Monetaire balanspost → bedrag op balansdatum × slotkoers.",
      "refs": [
        "s2temp"
      ],
      "related": [
        4,
        21
      ],
      "variant": true
    },
    {
      "id": 6,
      "stage": 1,
      "title": "Machine: tijdstipmethode",
      "type": "Rekenvraag",
      "intro": "Liva heeft een machine. De balans wordt omgerekend volgens de tijdstipmethode.",
      "facts": [
        [
          "Boekwaarde machine op 1 januari",
          "USD 480.000"
        ],
        [
          "Afschrijving dit jaar",
          "USD 60.000"
        ],
        [
          "Waardering",
          "Historische kosten; geen overige mutaties."
        ],
        [
          "Koers bij aankoop machine",
          "€ 0,910 per USD; aankoop ná verwerving van de deelneming."
        ],
        [
          "Gemiddelde koers",
          "€ 0,912 per USD"
        ],
        [
          "Slotkoers",
          "€ 0,914 per USD"
        ]
      ],
      "task": "Welke berekening geeft de boekwaarde op 31 december?",
      "options": [
        {
          "lines": [
            "(480.000 − 60.000) × 0,914"
          ],
          "result": "€ 383.880",
          "value": "383880.000",
          "expression": "(480000-60000)*0.914",
          "why": "Dit past bij de slotkoersmethode, niet bij de hier gevraagde tijdstipmethode."
        },
        {
          "lines": [
            "(480.000 − 60.000) × 0,910"
          ],
          "result": "€ 382.200",
          "value": "382200.000",
          "expression": "(480000-60000)*0.910",
          "why": ""
        },
        {
          "lines": [
            "(480.000 − 60.000) × 0,912"
          ],
          "result": "€ 383.040",
          "value": "383040.000",
          "expression": "(480000-60000)*0.912",
          "why": "De gemiddelde koers is niet de waarderingskoers van deze machine."
        },
        {
          "lines": [
            "480.000 × 0,910",
            "− 60.000 × 0,912"
          ],
          "result": "€ 382.080",
          "value": "382080.000",
          "expression": "480000*0.910-60000*0.912",
          "why": "De afschrijving volgt hier ook de historische koers."
        }
      ],
      "correct": 1,
      "explanation": [
        "De resterende boekwaarde is USD 420.000.",
        "Zowel de boekwaarde als de afschrijving hoort bij de historische koers van € 0,910.",
        "USD 420.000 × € 0,910 = € 382.200."
      ],
      "pattern": "Een actief tegen historische kosten en de bijbehorende afschrijving volgen dezelfde historische koers.",
      "refs": [
        "s2temp",
        "t25building"
      ],
      "related": [
        7,
        8,
        11
      ],
      "variant": true
    },
    {
      "id": 7,
      "stage": 1,
      "title": "Een machine van vóór de overname",
      "type": "Rekenvraag",
      "intro": "Liva kocht haar machine voordat de moeder de deelneming verwierf. Er zijn geen verschillen in waardering of afschrijving tussen moeder en deelneming.",
      "facts": [
        [
          "Afschrijving in het huidige jaar",
          "USD 60.000"
        ],
        [
          "Koers bij aankoop machine door Liva",
          "€ 0,905 per USD"
        ],
        [
          "Koers bij verwerving van Liva door de moeder",
          "€ 0,910 per USD"
        ],
        [
          "Gemiddelde koers huidige jaar",
          "€ 0,912 per USD"
        ],
        [
          "Slotkoers huidige jaar",
          "€ 0,914 per USD"
        ],
        [
          "Methode",
          "Tijdstipmethode, ten behoeve van de moeder."
        ]
      ],
      "task": "Welke afschrijvingslast wordt in euro opgenomen?",
      "options": [
        {
          "lines": [
            "60.000 × 0,912"
          ],
          "result": "€ 54.720",
          "value": "54720.000",
          "expression": "60000*0.912",
          "why": "De gemiddelde koers hoort hier niet bij de afschrijving."
        },
        {
          "lines": [
            "60.000 × 0,910"
          ],
          "result": "€ 54.600",
          "value": "54600.000",
          "expression": "60000*0.910",
          "why": ""
        },
        {
          "lines": [
            "60.000 × 0,905"
          ],
          "result": "€ 54.300",
          "value": "54300.000",
          "expression": "60000*0.905",
          "why": "Bij dit vóór de overname aanwezige actief gebruik je vanuit de moeder bezien de verwervingskoers."
        },
        {
          "lines": [
            "60.000 × 0,914"
          ],
          "result": "€ 54.840",
          "value": "54840.000",
          "expression": "60000*0.914",
          "why": "De slotkoers is niet de historische koers van dit actief."
        }
      ],
      "correct": 1,
      "explanation": [
        "De machine was al aanwezig bij de verwerving van Liva.",
        "De relevante historische koers is vanuit de moeder bezien daarom de koers op verwervingsdatum: € 0,910.",
        "USD 60.000 × € 0,910 = € 54.600."
      ],
      "pattern": "Vóór de overname aanwezig? Gebruik de koers op verwervingsdatum. Daarna gekocht? Gebruik de eigen aankoopkoers.",
      "refs": [
        "s2temp"
      ],
      "related": [
        6,
        11,
        12
      ],
      "variant": true
    },
    {
      "id": 8,
      "stage": 1,
      "title": "Dezelfde machine, andere methode",
      "type": "Rekenvraag",
      "intro": "Liva heeft opnieuw de onderstaande machine. Nu is de slotkoersmethode van toepassing.",
      "facts": [
        [
          "Boekwaarde machine op 1 januari",
          "USD 480.000"
        ],
        [
          "Afschrijving dit jaar",
          "USD 60.000"
        ],
        [
          "Waardering",
          "Historische kosten; geen overige mutaties."
        ],
        [
          "Koers bij aankoop machine",
          "€ 0,910 per USD; aankoop ná verwerving van de deelneming."
        ],
        [
          "Gemiddelde koers",
          "€ 0,912 per USD"
        ],
        [
          "Slotkoers",
          "€ 0,914 per USD"
        ]
      ],
      "task": "Welke berekening geeft de boekwaarde op 31 december?",
      "options": [
        {
          "lines": [
            "(480.000 − 60.000) × 0,912"
          ],
          "result": "€ 383.040",
          "value": "383040.000",
          "expression": "(480000-60000)*0.912",
          "why": "Voor de balans geldt niet de gemiddelde koers."
        },
        {
          "lines": [
            "480.000 × 0,910",
            "− 60.000 × 0,912"
          ],
          "result": "€ 382.080",
          "value": "382080.000",
          "expression": "480000*0.910-60000*0.912",
          "why": "Je mist dan de omrekening naar de slotkoers."
        },
        {
          "lines": [
            "(480.000 − 60.000) × 0,910"
          ],
          "result": "€ 382.200",
          "value": "382200.000",
          "expression": "(480000-60000)*0.910",
          "why": "Dit was de uitkomst bij de tijdstipmethode."
        },
        {
          "lines": [
            "(480.000 − 60.000) × 0,914"
          ],
          "result": "€ 383.880",
          "value": "383880.000",
          "expression": "(480000-60000)*0.914",
          "why": ""
        }
      ],
      "correct": 3,
      "explanation": [
        "De boekwaarde in USD blijft 420.000.",
        "Bij de slotkoersmethode volgt ook deze niet-monetaire balanspost de slotkoers.",
        "USD 420.000 × € 0,914 = € 383.880."
      ],
      "pattern": "De methode verandert de koerskeuze. Dezelfde machine is niet automatisch hetzelfde eurobedrag.",
      "refs": [
        "s2close"
      ],
      "related": [
        3,
        6,
        9
      ],
      "variant": true
    },
    {
      "id": 9,
      "stage": 1,
      "title": "Winst onder de slotkoersmethode",
      "type": "Rekenvraag",
      "intro": "Liva behaalt gedurende het jaar gelijkmatig haar resultaat.",
      "facts": [
        [
          "Resultaat boekjaar Liva",
          "USD 80.000"
        ],
        [
          "Koers op 1 januari",
          "€ 0,910 per USD"
        ],
        [
          "Gemiddelde koers",
          "€ 0,912 per USD"
        ],
        [
          "Koers op 1 juli",
          "€ 0,913 per USD"
        ],
        [
          "Slotkoers",
          "€ 0,914 per USD"
        ],
        [
          "Methode",
          "Slotkoersmethode."
        ]
      ],
      "task": "Hoeveel bedraagt de winst van Liva in euro?",
      "options": [
        {
          "lines": [
            "80.000 × 0,912"
          ],
          "result": "€ 72.960",
          "value": "72960.000",
          "expression": "80000*0.912",
          "why": ""
        },
        {
          "lines": [
            "80.000 × 0,914"
          ],
          "result": "€ 73.120",
          "value": "73120.000",
          "expression": "80000*0.914",
          "why": "De slotkoers hoort bij de balans. Het verschil met de resultaatkoers wordt afzonderlijk verwerkt."
        },
        {
          "lines": [
            "80.000 × 0,913"
          ],
          "result": "€ 73.040",
          "value": "73040.000",
          "expression": "80000*0.913",
          "why": "De koers op één datum vervangt hier niet de voorgeschreven gemiddelde koers."
        },
        {
          "lines": [
            "80.000 × 0,910"
          ],
          "result": "€ 72.800",
          "value": "72800.000",
          "expression": "80000*0.910",
          "why": "Dit is de beginjaarkoers, niet de gemiddelde koers."
        }
      ],
      "correct": 0,
      "explanation": [
        "Het resultaat wordt hier omgerekend tegen de gemiddelde koers van € 0,912.",
        "USD 80.000 × € 0,912 = € 72.960."
      ],
      "pattern": "Slotkoersmethode: resultaat tegen de gemiddelde koers; balans tegen de slotkoers.",
      "refs": [
        "s2close"
      ],
      "related": [
        8,
        10,
        26
      ],
      "variant": true
    },
    {
      "id": 10,
      "stage": 1,
      "title": "Resultaat boeken bij de moeder",
      "type": "Journaalpost",
      "intro": "De moeder waardeert Liva tegen NVW. Alleen de boeking van het behaalde resultaat wordt gevraagd.",
      "facts": [
        [
          "Belang in Liva",
          "80%"
        ],
        [
          "Resultaat boekjaar Liva",
          "USD 80.000"
        ],
        [
          "Gemiddelde koers",
          "€ 0,912 per USD"
        ],
        [
          "Koers op 1 januari / slotkoers",
          "€ 0,910 / € 0,914 per USD"
        ],
        [
          "Methode",
          "Slotkoersmethode; het resultaat is gelijkmatig behaald."
        ]
      ],
      "task": "Welke journaalpost boekt de moeder voor het resultaat?",
      "options": [
        {
          "journal": [
            [
              "0.. Deelneming Liva",
              "58.368",
              ""
            ],
            [
              "9.. Aan Resultaat deelneming",
              "",
              "58.368"
            ]
          ],
          "journalNumeric": [
            [
              "0.. Deelneming Liva",
              58368,
              0
            ],
            [
              "9.. Aan Resultaat deelneming",
              0,
              58368
            ]
          ],
          "why": "",
          "lines": [
            "80% × 80.000 × 0,912 = € 58.368"
          ]
        },
        {
          "journal": [
            [
              "0.. Deelneming Liva",
              "58.240",
              ""
            ],
            [
              "9.. Aan Resultaat deelneming",
              "",
              "58.240"
            ]
          ],
          "journalNumeric": [
            [
              "0.. Deelneming Liva",
              58240,
              0
            ],
            [
              "9.. Aan Resultaat deelneming",
              0,
              58240
            ]
          ],
          "why": "De beginjaarkoers is niet de juiste koers voor dit resultaat.",
          "lines": [
            "80% × 80.000 × 0,910 = € 58.240"
          ]
        },
        {
          "journal": [
            [
              "0.. Deelneming Liva",
              "58.368",
              ""
            ],
            [
              "0.. Aan Reserve omrekeningsverschillen",
              "",
              "58.368"
            ]
          ],
          "journalNumeric": [
            [
              "0.. Deelneming Liva",
              58368,
              0
            ],
            [
              "0.. Aan Reserve omrekeningsverschillen",
              0,
              58368
            ]
          ],
          "why": "Het behaalde resultaat is geen mutatie van de reserve omrekeningsverschillen.",
          "lines": [
            "80% × 80.000 × 0,912 = € 58.368"
          ]
        },
        {
          "journal": [
            [
              "0.. Deelneming Liva",
              "58.496",
              ""
            ],
            [
              "9.. Aan Resultaat deelneming",
              "",
              "58.496"
            ]
          ],
          "journalNumeric": [
            [
              "0.. Deelneming Liva",
              58496,
              0
            ],
            [
              "9.. Aan Resultaat deelneming",
              0,
              58496
            ]
          ],
          "why": "De slotkoers verhoogt het geboekte resultaat ten onrechte.",
          "lines": [
            "80% × 80.000 × 0,914 = € 58.496"
          ]
        }
      ],
      "correct": 0,
      "explanation": [
        "Omgerekende winst: USD 80.000 × € 0,912 = € 72.960.",
        "Aandeel moeder: 80% × € 72.960 = € 58.368.",
        "Deelneming debet; resultaat deelneming credit."
      ],
      "pattern": "Omrekenen → deelnemingspercentage toepassen → onderscheid maken tussen resultaat en reserve.",
      "refs": [
        "md",
        "t25close"
      ],
      "related": [
        9,
        15,
        25,
        27
      ],
      "variant": true
    },
    {
      "id": 11,
      "stage": 2,
      "title": "Gebouw met een nieuwe aanbouw",
      "type": "Rekenvraag",
      "intro": "Noord breidt haar gebouw uit. De balans wordt omgerekend volgens de tijdstipmethode.",
      "facts": [
        [
          "Gebouw: boekwaarde op 1 januari",
          "USD 900.000"
        ],
        [
          "Afschrijving bestaand gebouw dit jaar",
          "USD 30.000"
        ],
        [
          "Historische koers bestaand gebouw",
          "€ 0,910 per USD"
        ],
        [
          "Nieuwe aanbouw, gekocht en in gebruik op 1 juli",
          "USD 240.000; lineaire afschrijving USD 20.000 per volledig jaar."
        ],
        [
          "Koers op 1 juli",
          "€ 0,920 per USD"
        ],
        [
          "Gemiddelde koers / slotkoers",
          "€ 0,915 / € 0,925 per USD"
        ],
        [
          "Overig",
          "Geen andere mutaties; waardering tegen historische kosten."
        ]
      ],
      "task": "Wat is de boekwaarde van gebouw en aanbouw samen op 31 december?",
      "options": [
        {
          "lines": [
            "(900.000 − 30.000) × 0,910",
            "+ (240.000 − 20.000 × 6/12) × 0,915"
          ],
          "result": "€ 1.002.150",
          "value": "1002150.000",
          "expression": "(900000-30000)*0.910+(240000-20000*6/12)*0.915",
          "why": "De aanbouw volgt de eigen historische koers, niet de gemiddelde koers."
        },
        {
          "lines": [
            "(900.000 − 30.000) × 0,910",
            "+ (240.000 − 20.000) × 0,920"
          ],
          "result": "€ 994.100",
          "value": "994100.000",
          "expression": "(900000-30000)*0.910+(240000-20000)*0.920",
          "why": "Op de aanbouw wordt slechts een halfjaar afgeschreven."
        },
        {
          "lines": [
            "(900.000 − 30.000) × 0,910",
            "+ (240.000 − 20.000 × 6/12) × 0,925"
          ],
          "result": "€ 1.004.450",
          "value": "1004450.000",
          "expression": "(900000-30000)*0.910+(240000-20000*6/12)*0.925",
          "why": "De slotkoers hoort niet bij deze aanbouw tegen historische kosten."
        },
        {
          "lines": [
            "(900.000 − 30.000) × 0,910",
            "+ (240.000 − 20.000 × 6/12) × 0,920"
          ],
          "result": "€ 1.003.300",
          "value": "1003300.000",
          "expression": "(900000-30000)*0.910+(240000-20000*6/12)*0.920",
          "why": ""
        }
      ],
      "correct": 3,
      "explanation": [
        "Bestaand gebouw: USD 870.000 × € 0,910 = € 791.700.",
        "Aanbouw: een halfjaar afschrijving van USD 10.000; resterend USD 230.000 × € 0,920 = € 211.600.",
        "Samen: € 1.003.300."
      ],
      "pattern": "Splits oude en nieuwe activa. Elk deel krijgt zijn eigen historische koers én zijn eigen afschrijvingsperiode.",
      "refs": [
        "t25building",
        "s2temp"
      ],
      "related": [
        6,
        7,
        12
      ],
      "variant": true
    },
    {
      "id": 12,
      "stage": 2,
      "title": "De afschrijving van diezelfde onderdelen",
      "type": "Rekenvraag",
      "intro": "Gebruik opnieuw de gegevens van Noord. Gevraagd wordt nu de afschrijving in de resultatenrekening volgens de tijdstipmethode.",
      "facts": [
        [
          "Gebouw: boekwaarde op 1 januari",
          "USD 900.000"
        ],
        [
          "Afschrijving bestaand gebouw dit jaar",
          "USD 30.000"
        ],
        [
          "Historische koers bestaand gebouw",
          "€ 0,910 per USD"
        ],
        [
          "Nieuwe aanbouw, gekocht en in gebruik op 1 juli",
          "USD 240.000; lineaire afschrijving USD 20.000 per volledig jaar."
        ],
        [
          "Koers op 1 juli",
          "€ 0,920 per USD"
        ],
        [
          "Gemiddelde koers / slotkoers",
          "€ 0,915 / € 0,925 per USD"
        ],
        [
          "Overig",
          "Geen andere mutaties; waardering tegen historische kosten."
        ]
      ],
      "task": "Welke berekening geeft de afschrijvingslast in euro?",
      "options": [
        {
          "lines": [
            "(30.000 + 20.000 × 6/12) × 0,915"
          ],
          "result": "€ 36.600",
          "value": "36600.000",
          "expression": "(30000+20000*6/12)*0.915",
          "why": "De beide afschrijvingsdelen hebben verschillende historische koersen."
        },
        {
          "lines": [
            "30.000 × 0,910",
            "+ (20.000 × 6/12) × 0,920"
          ],
          "result": "€ 36.500",
          "value": "36500.000",
          "expression": "30000*0.910+(20000*6/12)*0.920",
          "why": ""
        },
        {
          "lines": [
            "30.000 × 0,910",
            "+ (20.000 × 6/12) × 0,925"
          ],
          "result": "€ 36.550",
          "value": "36550.000",
          "expression": "30000*0.910+(20000*6/12)*0.925",
          "why": "De afschrijving van de aanbouw volgt niet de slotkoers."
        },
        {
          "lines": [
            "30.000 × 0,910",
            "+ (20.000 × 6/12) × 0,915"
          ],
          "result": "€ 36.450",
          "value": "36450.000",
          "expression": "30000*0.910+(20000*6/12)*0.915",
          "why": "De nieuwe aanbouw volgt niet de gemiddelde koers."
        }
      ],
      "correct": 1,
      "explanation": [
        "Bestaand gebouw: USD 30.000 × € 0,910 = € 27.300.",
        "Aanbouw: USD 10.000 × € 0,920 = € 9.200.",
        "Totale last: € 36.500."
      ],
      "pattern": "Balans en afschrijving gebruiken bij de tijdstipmethode voor hetzelfde actief dezelfde historische koers.",
      "refs": [
        "t25building",
        "s2temp"
      ],
      "related": [
        7,
        11,
        29
      ],
      "variant": true
    },
    {
      "id": 13,
      "stage": 2,
      "title": "Twee voorraadpartijen",
      "type": "Rekenvraag",
      "intro": "De eindvoorraad bestaat uit twee volledig courante partijen. De tijdstipmethode wordt toegepast.",
      "facts": [
        [
          "Partij uit maart",
          "3.000 stuks à USD 40; aankoopkoers € 0,910."
        ],
        [
          "Partij uit september",
          "2.000 stuks à USD 44; aankoopkoers € 0,920."
        ],
        [
          "Slotkoers",
          "€ 0,925 per USD"
        ],
        [
          "Waardering",
          "Historische kosten; geen afwaardering."
        ]
      ],
      "task": "Wat is de eindvoorraad in euro?",
      "options": [
        {
          "lines": [
            "3.000 × 40 × 0,920",
            "+ 2.000 × 44 × 0,920"
          ],
          "result": "€ 191.360",
          "value": "191360.000",
          "expression": "3000*40*0.920+2000*44*0.920",
          "why": "De maartpartij heeft een andere historische koers."
        },
        {
          "lines": [
            "3.000 × 40 × 0,910",
            "+ 2.000 × 44 × 0,920"
          ],
          "result": "€ 190.160",
          "value": "190160.000",
          "expression": "3000*40*0.910+2000*44*0.920",
          "why": ""
        },
        {
          "lines": [
            "(3.000 × 40 + 2.000 × 44) × 0,925"
          ],
          "result": "€ 192.400",
          "value": "192400.000",
          "expression": "(3000*40+2000*44)*0.925",
          "why": "De gehele voorraad tegen slotkoers omrekenen past hier niet."
        },
        {
          "lines": [
            "3.000 × 40 × 0,910",
            "+ 2.000 × 44 × 0,925"
          ],
          "result": "€ 190.600",
          "value": "190600.000",
          "expression": "3000*40*0.910+2000*44*0.925",
          "why": "De septemberpartij volgt de eigen aankoopkoers."
        }
      ],
      "correct": 1,
      "explanation": [
        "Maart: USD 120.000 × € 0,910 = € 109.200.",
        "September: USD 88.000 × € 0,920 = € 80.960.",
        "Samen: € 190.160."
      ],
      "pattern": "Voorraad onder de tijdstipmethode: splits de overgebleven partijen naar hun inkoopmoment.",
      "refs": [
        "s2temp",
        "t25stock"
      ],
      "related": [
        14,
        16,
        18
      ],
      "variant": true
    },
    {
      "id": 14,
      "stage": 2,
      "title": "Eerst de FIFO-lagen vinden",
      "type": "Rekenvraag",
      "intro": "Nova gebruikt FIFO voor de goederenafgifte en de tijdstipmethode voor de omrekening. De gehele eindvoorraad is courant.",
      "facts": [
        [
          "Beginvoorraad",
          "4.000 stuks à USD 40; historische koers € 0,910."
        ],
        [
          "Maart: inkoop",
          "3.000 stuks à USD 42; koers € 0,920."
        ],
        [
          "Mei: verkoop",
          "5.000 stuks."
        ],
        [
          "September: inkoop",
          "2.000 stuks à USD 44; koers € 0,930."
        ],
        [
          "November: verkoop",
          "1.000 stuks."
        ],
        [
          "Slotkoers",
          "€ 0,935 per USD"
        ]
      ],
      "task": "Welke berekening geeft de eindvoorraad in euro?",
      "options": [
        {
          "lines": [
            "1.000 × 42 × 0,920",
            "+ 2.000 × 44 × 0,930"
          ],
          "result": "€ 120.480",
          "value": "120480.000",
          "expression": "1000*42*0.920+2000*44*0.930",
          "why": ""
        },
        {
          "lines": [
            "1.000 × 42 × 0,920",
            "+ 2.000 × 44 × 0,935"
          ],
          "result": "€ 120.920",
          "value": "120920.000",
          "expression": "1000*42*0.920+2000*44*0.935",
          "why": "De historische septemberkoers blijft van toepassing."
        },
        {
          "lines": [
            "1.000 × 42 × 0,930",
            "+ 2.000 × 44 × 0,930"
          ],
          "result": "€ 120.900",
          "value": "120900.000",
          "expression": "1000*42*0.930+2000*44*0.930",
          "why": "De resterende maartstuks hebben hun eigen historische koers."
        },
        {
          "lines": [
            "2.000 × 42 × 0,920",
            "+ 1.000 × 44 × 0,930"
          ],
          "result": "€ 118.200",
          "value": "118200.000",
          "expression": "2000*42*0.920+1000*44*0.930",
          "why": "Bij FIFO zijn na de verkopen nog 1.000 maartstuks over, niet 2.000."
        }
      ],
      "correct": 0,
      "explanation": [
        "De 6.000 verkochte stuks bestaan uit 4.000 beginvoorraad en 2.000 uit maart.",
        "Resteert: 1.000 uit maart en alle 2.000 uit september.",
        "1.000 × USD 42 × € 0,920 + 2.000 × USD 44 × € 0,930 = € 120.480."
      ],
      "pattern": "Eerst het fysieke voorraadverloop, daarna de eurobedragen. Een verkoopmoment maakt geen nieuwe inkoopkoers.",
      "refs": [
        "t25stock",
        "wijo"
      ],
      "related": [
        13,
        18
      ],
      "variant": true
    },
    {
      "id": 15,
      "stage": 2,
      "title": "Dividend in vreemde valuta",
      "type": "Journaalpost",
      "intro": "De moeder houdt Liva tegen NVW. Dividend wordt op dezelfde dag gedeclareerd, betaald en direct in euro ontvangen.",
      "facts": [
        [
          "Dividend voor alle aandeelhouders",
          "USD 40.000"
        ],
        [
          "Belang moeder",
          "80%"
        ],
        [
          "Koers declaratie en betaling",
          "€ 0,920 per USD"
        ],
        [
          "Gemiddelde koers",
          "€ 0,915 per USD"
        ],
        [
          "Slotkoers",
          "€ 0,925 per USD"
        ]
      ],
      "task": "Welke journaalpost hoort bij de dividendontvangst van de moeder?",
      "options": [
        {
          "journal": [
            [
              "1.. Bank",
              "29.440",
              ""
            ],
            [
              "0.. Aan Deelneming Liva",
              "",
              "29.440"
            ]
          ],
          "journalNumeric": [
            [
              "1.. Bank",
              29440,
              0
            ],
            [
              "0.. Aan Deelneming Liva",
              0,
              29440
            ]
          ],
          "why": "",
          "lines": [
            "80% × 40.000 × 0,920 = € 29.440"
          ]
        },
        {
          "journal": [
            [
              "1.. Bank",
              "29.440",
              ""
            ],
            [
              "9.. Aan Resultaat deelneming",
              "",
              "29.440"
            ]
          ],
          "journalNumeric": [
            [
              "1.. Bank",
              29440,
              0
            ],
            [
              "9.. Aan Resultaat deelneming",
              0,
              29440
            ]
          ],
          "why": "Bij NVW wordt het dividend op de deelneming afgeboekt; het is niet opnieuw resultaat.",
          "lines": [
            "80% × 40.000 × 0,920 = € 29.440"
          ]
        },
        {
          "journal": [
            [
              "1.. Bank",
              "29.600",
              ""
            ],
            [
              "0.. Aan Deelneming Liva",
              "",
              "29.600"
            ]
          ],
          "journalNumeric": [
            [
              "1.. Bank",
              29600,
              0
            ],
            [
              "0.. Aan Deelneming Liva",
              0,
              29600
            ]
          ],
          "why": "De slotkoers is niet de koers bij deze ontvangst.",
          "lines": [
            "80% × 40.000 × 0,925 = € 29.600"
          ]
        },
        {
          "journal": [
            [
              "1.. Bank",
              "29.280",
              ""
            ],
            [
              "0.. Aan Deelneming Liva",
              "",
              "29.280"
            ]
          ],
          "journalNumeric": [
            [
              "1.. Bank",
              29280,
              0
            ],
            [
              "0.. Aan Deelneming Liva",
              0,
              29280
            ]
          ],
          "why": "Het dividend volgt de koers op de relevante transactiedatum.",
          "lines": [
            "80% × 40.000 × 0,915 = € 29.280"
          ]
        }
      ],
      "correct": 0,
      "explanation": [
        "De moeder ontvangt 80% van USD 40.000: USD 32.000.",
        "USD 32.000 × € 0,920 = € 29.440.",
        "Bank debet en deelneming credit. De winst was bij NVW al via het resultaat verwerkt."
      ],
      "pattern": "Resultaat verhoogt de deelneming; dividend verlaagt de deelneming. Dividend gebruikt zijn eigen transactiedatum.",
      "refs": [
        "s1nvw",
        "t24close",
        "s2temp"
      ],
      "related": [
        10,
        26,
        30
      ],
      "variant": true
    },
    {
      "id": 16,
      "stage": 3,
      "title": "Voorraad na afwaardering",
      "type": "Rekenvraag",
      "intro": "Op 31 december wordt een restant voorraad afgewaardeerd. De tijdstipmethode geldt.",
      "facts": [
        [
          "Resterende partij",
          "2.000 stuks"
        ],
        [
          "Inkoopprijs per stuk",
          "USD 40"
        ],
        [
          "Koers bij inkoop",
          "€ 0,920 per USD"
        ],
        [
          "Lagere marktwaarde per 31 december",
          "USD 30 per stuk"
        ],
        [
          "Koers bij afwaardering op 31 december",
          "€ 0,935 per USD"
        ],
        [
          "Gemiddelde koers",
          "€ 0,925 per USD"
        ]
      ],
      "task": "Voor welk bedrag staat deze partij na afwaardering op de balans?",
      "options": [
        {
          "lines": [
            "2.000 × 30 × 0,925"
          ],
          "result": "€ 55.500",
          "value": "55500.000",
          "expression": "2000*30*0.925",
          "why": "De gemiddelde koers is niet de koers op het afwaarderingsmoment."
        },
        {
          "lines": [
            "2.000 × 40 × 0,920",
            "− 2.000 × (40 − 30) × 0,935"
          ],
          "result": "€ 54.900",
          "value": "54900.000",
          "expression": "2000*40*0.920-2000*(40-30)*0.935",
          "why": "Deze combinatie laat de resterende lagere waarde niet tegen de afwaarderingskoers staan."
        },
        {
          "lines": [
            "2.000 × 30 × 0,935"
          ],
          "result": "€ 56.100",
          "value": "56100.000",
          "expression": "2000*30*0.935",
          "why": ""
        },
        {
          "lines": [
            "2.000 × 30 × 0,920"
          ],
          "result": "€ 55.200",
          "value": "55200.000",
          "expression": "2000*30*0.920",
          "why": "Voor de lagere waarde gebruik je de koers op het afwaarderingsmoment."
        }
      ],
      "correct": 2,
      "explanation": [
        "Na afwaardering bedraagt de waarde USD 60.000.",
        "Die lagere waarde volgt de koers van 31 december, de datum van afwaardering.",
        "USD 60.000 × € 0,935 = € 56.100."
      ],
      "pattern": "De resterende lagere waarde volgt de koers op het afwaarderingsmoment, niet langer de historische inkoopkoers.",
      "refs": [
        "s2temp",
        "t25stock"
      ],
      "related": [
        17,
        18
      ],
      "variant": true
    },
    {
      "id": 17,
      "stage": 3,
      "title": "En welke last komt in de winst?",
      "type": "Rekenvraag",
      "intro": "Dezelfde partij wordt op 31 december afgewaardeerd. Bepaal nu de afwaarderingslast volgens de tijdstipmethode.",
      "facts": [
        [
          "Resterende partij",
          "2.000 stuks"
        ],
        [
          "Inkoopprijs per stuk",
          "USD 40"
        ],
        [
          "Koers bij inkoop",
          "€ 0,920 per USD"
        ],
        [
          "Lagere marktwaarde per 31 december",
          "USD 30 per stuk"
        ],
        [
          "Koers bij afwaardering op 31 december",
          "€ 0,935 per USD"
        ],
        [
          "Gemiddelde koers",
          "€ 0,925 per USD"
        ]
      ],
      "task": "Welke berekening geeft de totale afwaarderingslast in euro?",
      "options": [
        {
          "lines": [
            "2.000 × (40 − 30) × 0,935"
          ],
          "result": "€ 18.700",
          "value": "18700.000",
          "expression": "2000*(40-30)*0.935",
          "why": "Het hele verschil tegen slotkoers rekent de oorspronkelijke kostprijs niet juist om."
        },
        {
          "lines": [
            "2.000 × 40 × 0,920",
            "− 2.000 × 30 × 0,925"
          ],
          "result": "€ 18.100",
          "value": "18100.000",
          "expression": "2000*40*0.920-2000*30*0.925",
          "why": "De lagere waarde volgt de afwaarderingskoers, niet de gemiddelde koers."
        },
        {
          "lines": [
            "2.000 × (40 − 30) × 0,920"
          ],
          "result": "€ 18.400",
          "value": "18400.000",
          "expression": "2000*(40-30)*0.920",
          "why": "Dit is alleen de daling in USD omgerekend tegen de historische koers. De lagere eindwaarde heeft een andere koers."
        },
        {
          "lines": [
            "2.000 × 40 × 0,920",
            "− 2.000 × 30 × 0,935"
          ],
          "result": "€ 17.500",
          "value": "17500.000",
          "expression": "2000*40*0.920-2000*30*0.935",
          "why": ""
        }
      ],
      "correct": 3,
      "explanation": [
        "Historische kostprijs in euro: 2.000 × USD 40 × € 0,920 = € 73.600.",
        "Lagere waarde in euro: 2.000 × USD 30 × € 0,935 = € 56.100.",
        "Afwaarderingslast: € 73.600 − € 56.100 = € 17.500.",
        "Dezelfde uitkomst volgt uit € 18.400 afwaardering minus € 900 positief koersverschil op de resterende lagere waarde."
      ],
      "pattern": "Afwaarderingslast = oude boekwaarde in euro minus nieuwe lagere waarde in euro.",
      "refs": [
        "s2temp",
        "t25stock"
      ],
      "related": [
        16,
        18
      ],
      "variant": true
    },
    {
      "id": 18,
      "stage": 3,
      "title": "Courant en incourant door elkaar",
      "type": "Rekenvraag",
      "intro": "Nova heeft twee partijen in haar eindvoorraad. Alleen het genoemde deel van partij A wordt ultimo afgewaardeerd. Gebruik de tijdstipmethode.",
      "facts": [
        [
          "Partij A",
          "3.000 stuks à USD 40; historische koers € 0,910."
        ],
        [
          "Afwaardering partij A",
          "Van 1.000 stuks daalt de waarde op 31 december tot USD 28 per stuk."
        ],
        [
          "Partij B",
          "2.000 stuks à USD 44; historische koers € 0,930."
        ],
        [
          "Slotkoers en afwaarderingskoers",
          "€ 0,940 per USD"
        ],
        [
          "Overige voorraad",
          "Volledig courant; geen andere mutaties."
        ]
      ],
      "task": "Welke berekening geeft de gehele eindvoorraad in euro?",
      "options": [
        {
          "lines": [
            "2.000 × 40 × 0,910",
            "+ 1.000 × 28 × 0,910",
            "+ 2.000 × 44 × 0,930"
          ],
          "result": "€ 180.120",
          "value": "180120.000",
          "expression": "2000*40*0.910+1000*28*0.910+2000*44*0.930",
          "why": "Het afgewaardeerde deel volgt de koers op 31 december."
        },
        {
          "lines": [
            "2.000 × 40 × 0,910",
            "+ 1.000 × 28 × 0,940",
            "+ 2.000 × 44 × 0,930"
          ],
          "result": "€ 180.960",
          "value": "180960.000",
          "expression": "2000*40*0.910+1000*28*0.940+2000*44*0.930",
          "why": ""
        },
        {
          "lines": [
            "2.000 × 40 × 0,910",
            "+ 1.000 × 28 × 0,940",
            "+ 2.000 × 44 × 0,940"
          ],
          "result": "€ 181.840",
          "value": "181840.000",
          "expression": "2000*40*0.910+1000*28*0.940+2000*44*0.940",
          "why": "Partij B is niet afgewaardeerd en blijft tegen haar historische koers staan."
        },
        {
          "lines": [
            "2.000 × 40 × 0,910",
            "+ 1.000 × 28 × 0,930",
            "+ 2.000 × 44 × 0,930"
          ],
          "result": "€ 180.680",
          "value": "180680.000",
          "expression": "2000*40*0.910+1000*28*0.930+2000*44*0.930",
          "why": "De koers van partij B is niet de afwaarderingskoers van partij A."
        }
      ],
      "correct": 1,
      "explanation": [
        "Courant deel A: € 72.800.",
        "Afgewaardeerd deel A: € 26.320.",
        "Courante partij B: € 81.840.",
        "Gehele voorraad: € 180.960."
      ],
      "pattern": "Splits eerst naar partij en vervolgens naar courant/afgewaardeerd. Geef elk deel de passende koers.",
      "refs": [
        "t25stock",
        "s2temp"
      ],
      "related": [
        13,
        14,
        16,
        17
      ],
      "variant": true
    },
    {
      "id": 19,
      "stage": 3,
      "title": "Verkoop van een machine",
      "type": "Rekenvraag",
      "intro": "Een machine tegen historische kosten wordt verkocht. Gebruik de tijdstipmethode.",
      "facts": [
        [
          "Boekwaarde direct vóór verkoop",
          "USD 80.000, na verwerking van alle afschrijving."
        ],
        [
          "Historische koers machine",
          "€ 0,910 per USD"
        ],
        [
          "Verkoopopbrengst",
          "USD 81.000, direct ontvangen op verkoopdatum."
        ],
        [
          "Koers op verkoopdatum",
          "€ 0,912 per USD"
        ],
        [
          "Gemiddelde koers",
          "€ 0,911 per USD"
        ]
      ],
      "task": "Welke boekwinst ontstaat in euro?",
      "options": [
        {
          "lines": [
            "81.000 × 0,912",
            "− 80.000 × 0,911"
          ],
          "result": "€ 992",
          "value": "992.000",
          "expression": "81000*0.912-80000*0.911",
          "why": "De afgeboekte boekwaarde blijft tegen de historische koers staan."
        },
        {
          "lines": [
            "(81.000 − 80.000) × 0,912"
          ],
          "result": "€ 912",
          "value": "912.000",
          "expression": "(81000-80000)*0.912",
          "why": "De opbrengst en de historische boekwaarde hebben niet dezelfde koers."
        },
        {
          "lines": [
            "81.000 × 0,912",
            "− 80.000 × 0,910"
          ],
          "result": "€ 1.072",
          "value": "1072.000",
          "expression": "81000*0.912-80000*0.910",
          "why": ""
        },
        {
          "lines": [
            "81.000 × 0,911",
            "− 80.000 × 0,910"
          ],
          "result": "€ 991",
          "value": "991.000",
          "expression": "81000*0.911-80000*0.910",
          "why": "De ontvangst volgt de verkoopdatum, niet de gemiddelde koers."
        }
      ],
      "correct": 2,
      "explanation": [
        "Verkoopopbrengst: USD 81.000 × € 0,912 = € 73.872.",
        "Af te boeken boekwaarde: USD 80.000 × € 0,910 = € 72.800.",
        "Boekwinst: € 73.872 − € 72.800 = € 1.072."
      ],
      "pattern": "Reken opbrengst en boekwaarde afzonderlijk om. Een boekwinst in vreemde valuta maal één koers is hier niet voldoende.",
      "refs": [
        "s2sale"
      ],
      "related": [
        6,
        12,
        24
      ],
      "variant": true
    },
    {
      "id": 20,
      "stage": 3,
      "title": "Afwaardering in euro boeken",
      "type": "Journaalpost",
      "intro": "Een voorraadpartij wordt op 31 december afgewaardeerd. Voor de verwerking in euro geldt de tijdstipmethode. De afwaardering is nog niet in de eurocijfers verwerkt.",
      "facts": [
        [
          "Partij op 31 december",
          "2.000 stuks"
        ],
        [
          "Historische inkoopprijs",
          "USD 40 per stuk"
        ],
        [
          "Koers bij inkoop",
          "€ 0,920 per USD"
        ],
        [
          "Lagere waarde op 31 december",
          "USD 30 per stuk"
        ],
        [
          "Koers op 31 december",
          "€ 0,935 per USD"
        ]
      ],
      "task": "Welke journaalpost verwerkt de afwaardering in de eurocijfers?",
      "options": [
        {
          "journal": [
            [
              "Afwaardering voorraad",
              "18.400",
              ""
            ],
            [
              "Aan Voorraad",
              "",
              "18.400"
            ]
          ],
          "why": "Hier wordt ook de lagere waarde tegen de historische koers omgerekend.",
          "lines": [
            "2.000 × (40 − 30) × 0,920 = € 18.400"
          ]
        },
        {
          "journal": [
            [
              "Afwaardering voorraad",
              "17.500",
              ""
            ],
            [
              "Aan Voorraad",
              "",
              "17.500"
            ]
          ],
          "why": "Oorspronkelijke boekwaarde: 2.000 × USD 40 × € 0,920 = € 73.600.",
          "lines": [
            "2.000 × 40 × 0,920",
            "− 2.000 × 30 × 0,935 = € 17.500"
          ]
        },
        {
          "journal": [
            [
              "Afwaardering voorraad",
              "18.700",
              ""
            ],
            [
              "Aan Voorraad",
              "",
              "18.700"
            ]
          ],
          "why": "Hier wordt de gehele afwaardering tegen de slotkoers berekend.",
          "lines": [
            "2.000 × (40 − 30) × 0,935 = € 18.700"
          ]
        },
        {
          "journal": [
            [
              "Voorraad",
              "17.500",
              ""
            ],
            [
              "Aan Afwaardering voorraad",
              "",
              "17.500"
            ]
          ],
          "why": "Het bedrag klopt, maar de richting is omgekeerd: een afwaardering verlaagt de voorraad.",
          "lines": [
            "2.000 × 40 × 0,920",
            "− 2.000 × 30 × 0,935 = € 17.500"
          ]
        }
      ],
      "correct": 1,
      "explanation": [
        "Lagere waarde: 2.000 × USD 30 × € 0,935 = € 56.100.",
        "De totale afwaarderingslast is € 17.500. Die last wordt gedebiteerd; de voorraad wordt voor hetzelfde bedrag gecrediteerd."
      ],
      "pattern": "Bereken eerst de oorspronkelijke boekwaarde in euro en daarna de lagere waarde in euro. Het verschil vormt de afwaarderingslast.",
      "refs": [
        "s2temp",
        "t25stock"
      ],
      "related": [
        16,
        17,
        18
      ],
      "variant": true
    },
    {
      "id": 21,
      "stage": 4,
      "title": "De monetaire beginpositie",
      "type": "Rekenvraag",
      "intro": "De onderstaande posten staan op 1 januari op de balans. Gebruik de tijdstipmethode.",
      "facts": [
        [
          "Debiteuren",
          "USD 120.000"
        ],
        [
          "Liquide middelen",
          "USD 80.000"
        ],
        [
          "Langlopende lening",
          "USD 360.000"
        ],
        [
          "Crediteuren",
          "USD 140.000"
        ],
        [
          "Voorziening voor geldelijke verplichtingen",
          "USD 6.000"
        ],
        [
          "Voorraad",
          "USD 9.000"
        ]
      ],
      "task": "Welke berekening geeft de monetaire positie op 1 januari in USD?",
      "options": [
        {
          "lines": [
            "120.000 + 80.000",
            "− 360.000 − 140.000"
          ],
          "result": "USD −300.000",
          "value": "-300000",
          "expression": "120000+80000-360000-140000",
          "why": "De geldelijke voorziening hoort hier ook bij de monetaire passiva."
        },
        {
          "lines": [
            "120.000 + 80.000",
            "− 360.000 − 140.000 − 6.000"
          ],
          "result": "USD −306.000",
          "value": "-306000",
          "expression": "120000+80000-360000-140000-6000",
          "why": ""
        },
        {
          "lines": [
            "120.000 + 80.000 + 9.000",
            "− 360.000 − 140.000 − 6.000"
          ],
          "result": "USD −297.000",
          "value": "-297000",
          "expression": "120000+80000+9000-360000-140000-6000",
          "why": "De voorraad is niet monetair."
        },
        {
          "lines": [
            "120.000 + 80.000",
            "− 360.000 − 140.000 − 6.000 − 9.000"
          ],
          "result": "USD −315.000",
          "value": "-315000",
          "expression": "120000+80000-360000-140000-6000-9000",
          "why": "De voorraad wordt niet in de monetaire positie meegenomen."
        }
      ],
      "correct": 1,
      "explanation": [
        "Monetaire activa: USD 120.000 + USD 80.000 = USD 200.000.",
        "Monetaire passiva: USD 360.000 + USD 140.000 + USD 6.000 = USD 506.000.",
        "Monetaire positie: USD 200.000 − USD 506.000 = USD −306.000. De voorraad telt niet mee."
      ],
      "pattern": "Begin steeds met monetaire activa minus monetaire passiva. Negatief betekent dat de monetaire schulden groter zijn.",
      "refs": [
        "s2temp",
        "t25mon"
      ],
      "related": [
        4,
        5,
        22,
        23
      ],
      "variant": true
    },
    {
      "id": 22,
      "stage": 4,
      "title": "Welke mutatie telt echt mee?",
      "type": "Theorie",
      "intro": "Alle onderstaande handelingen worden in dezelfde vreemde valuta afgewikkeld. De lening en de vordering bestaan al.",
      "facts": [
        [
          "Handeling 1",
          "Een bestaande lening wordt uit de bank afgelost."
        ],
        [
          "Handeling 2",
          "Een bestaande debiteur betaalt op de bankrekening."
        ],
        [
          "Handeling 3",
          "Een machine wordt direct per bank gekocht."
        ],
        [
          "Handeling 4",
          "Op de machine wordt afgeschreven."
        ]
      ],
      "task": "Welke handelingen veranderen het saldo van de monetaire positie in vreemde valuta?",
      "options": [
        {
          "text": "Handelingen 3 en 4.",
          "why": "Afschrijving verandert geen monetaire balanspost."
        },
        {
          "text": "Handelingen 2 en 3.",
          "why": "De betaling van de debiteur is een verschuiving tussen twee monetaire activa."
        },
        {
          "text": "Alleen handeling 3.",
          "why": ""
        },
        {
          "text": "Handelingen 1 en 3.",
          "why": "Bij aflossing dalen een monetair actief en een monetaire schuld met hetzelfde bedrag."
        }
      ],
      "correct": 2,
      "explanation": [
        "Aflossing: bank daalt en lening daalt; per saldo geen wijziging.",
        "Ontvangst debiteur: bank stijgt en vordering daalt; per saldo geen wijziging.",
        "Contante aankoop machine: bank daalt, terwijl een niet-monetair actief stijgt; de monetaire positie daalt.",
        "Afschrijving: alleen het niet-monetaire actief en het resultaat veranderen."
      ],
      "pattern": "Een kasstroom is niet automatisch een mutatie van de monetaire positie. Kijk naar beide kanten van de boeking.",
      "refs": [
        "s2mon",
        "corona",
        "t25mon"
      ],
      "related": [
        21,
        23,
        24
      ],
      "variant": true
    },
    {
      "id": 23,
      "stage": 4,
      "title": "Van positie naar koersresultaat",
      "type": "Rekenvraag",
      "intro": "Noord rekent volgens de tijdstipmethode om. De volgende bedragen betreffen de gehele deelneming.",
      "facts": [
        [
          "Monetaire positie op 1 januari",
          "USD −300.000; koers € 0,910."
        ],
        [
          "Verkopen, direct ontvangen",
          "USD 600.000; koers € 0,920."
        ],
        [
          "Inkopen, direct betaald",
          "USD 400.000; koers € 0,915."
        ],
        [
          "Overige kosten, direct betaald",
          "USD 50.000; koers € 0,918."
        ],
        [
          "Slotkoers",
          "€ 0,930 per USD"
        ],
        [
          "Overige mutaties",
          "Geen."
        ]
      ],
      "task": "Welk koersresultaat ontstaat? Een negatieve uitkomst is een verlies.",
      "options": [
        {
          "lines": [
            "Theoretisch: −132.900",
            "Werkelijk: −150.000 × 0,930 = −139.500",
            "Verschil: −132.900 − (−139.500)"
          ],
          "result": "€ 6.600 winst",
          "value": "6600",
          "expression": "-132900-(-139500)",
          "why": "De werkelijke positie is lager dan de theoretische positie. Het is dus een verlies, geen winst."
        },
        {
          "lines": [
            "Theoretisch: −300.000 × 0,910 + 600.000 × 0,918",
            "− 400.000 × 0,915 − 50.000 × 0,918 = −134.100",
            "Werkelijk: −150.000 × 0,930 = −139.500",
            "Verschil: −139.500 − (−134.100)"
          ],
          "result": "€ 5.400 verlies",
          "value": "-5400",
          "expression": "-139500-(-134100)",
          "why": "De verkopen hebben hun eigen koers van € 0,920."
        },
        {
          "lines": [
            "Theoretisch: −300.000 × 0,910 + 600.000 × 0,920",
            "− 400.000 × 0,915 − 50.000 × 0,915 = −132.750",
            "Werkelijk: −150.000 × 0,930 = −139.500",
            "Verschil: −139.500 − (−132.750)"
          ],
          "result": "€ 6.750 verlies",
          "value": "-6750",
          "expression": "-139500-(-132750)",
          "why": "Voor de overige kosten is € 0,918 gegeven, niet € 0,915."
        },
        {
          "lines": [
            "Theoretisch: −300.000 × 0,910 + 600.000 × 0,920",
            "− 400.000 × 0,915 − 50.000 × 0,918 = −132.900",
            "Werkelijk: (−300.000 + 600.000 − 400.000 − 50.000) × 0,930 = −139.500",
            "Verschil: −139.500 − (−132.900)"
          ],
          "result": "€ 6.600 verlies",
          "value": "-6600",
          "expression": "-139500-(-132900)",
          "why": ""
        }
      ],
      "correct": 3,
      "explanation": [
        "De monetaire eindpositie bedraagt USD −150.000.",
        "Beginpositie en mutaties omgerekend tegen hun eigen koers geven theoretisch € −132.900.",
        "Dezelfde eindpositie tegen slotkoers is € −139.500.",
        "Werkelijk minus theoretisch: € −139.500 − (€ −132.900) = € −6.600; een koersverlies."
      ],
      "pattern": "Bouw de theoretische europositie op. Vergelijk daarna met de werkelijke eindpositie tegen slotkoers, inclusief het juiste teken.",
      "refs": [
        "s2mon",
        "t25mon",
        "md"
      ],
      "related": [
        21,
        22,
        24,
        25
      ],
      "variant": true
    },
    {
      "id": 24,
      "stage": 4,
      "title": "Extra mutaties in de monetaire positie",
      "type": "Rekenvraag",
      "intro": "Noord heeft nu enkele aanvullende gebeurtenissen. Gebruik de tijdstipmethode.",
      "facts": [
        [
          "Monetaire positie op 1 januari",
          "USD −300.000; koers € 0,910."
        ],
        [
          "Verkopen, direct ontvangen",
          "USD 600.000; koers € 0,920."
        ],
        [
          "Inkopen, direct betaald",
          "USD 400.000; koers € 0,915."
        ],
        [
          "Overige kosten, direct betaald",
          "USD 50.000; koers € 0,918."
        ],
        [
          "Slotkoers",
          "€ 0,930 per USD"
        ],
        [
          "Aankoop machine, direct betaald",
          "USD 40.000; koers € 0,925."
        ],
        [
          "Aflossing bestaande lening uit de bank",
          "USD 10.000; koers € 0,925."
        ],
        [
          "Afschrijving machine",
          "USD 5.000."
        ],
        [
          "Definitieve afboeking debiteur op 31 december",
          "USD 6.000; geen eerdere voorziening; koers € 0,930."
        ],
        [
          "Overige mutaties",
          "Geen."
        ]
      ],
      "task": "Welk koersresultaat ontstaat over het jaar?",
      "options": [
        {
          "lines": [
            "Basis: −300.000 × 0,910 + 600.000 × 0,920 − 400.000 × 0,915 − 50.000 × 0,918 = −132.900",
            "Theoretisch: −132.900 − 40.000 × 0,925 − 6.000 × 0,930 − 10.000 × 0,925 = −184.730",
            "Werkelijk: (−150.000 − 40.000 − 6.000 − 10.000) × 0,930 = −191.580",
            "Verschil: −191.580 − (−184.730)"
          ],
          "result": "€ 6.850 verlies",
          "value": "-6850",
          "expression": "-191580-(-184730)",
          "why": "De aflossing verandert het saldo van de monetaire positie niet."
        },
        {
          "lines": [
            "Basis: −300.000 × 0,910 + 600.000 × 0,920 − 400.000 × 0,915 − 50.000 × 0,918 = −132.900",
            "Theoretisch: −132.900 − 40.000 × 0,918 − 6.000 × 0,930 = −175.200",
            "Werkelijk: −196.000 × 0,930 = −182.280",
            "Verschil: −182.280 − (−175.200)"
          ],
          "result": "€ 7.080 verlies",
          "value": "-7080",
          "expression": "-182280-(-175200)",
          "why": "De machineaankoop volgt € 0,925, niet de koers voor de overige kosten."
        },
        {
          "lines": [
            "Basis: −300.000 × 0,910 + 600.000 × 0,920 − 400.000 × 0,915 − 50.000 × 0,918 = −132.900",
            "Theoretisch: −132.900 − 40.000 × 0,925 − 6.000 × 0,918 = −175.408",
            "Werkelijk: −196.000 × 0,930 = −182.280",
            "Verschil: −182.280 − (−175.408)"
          ],
          "result": "€ 6.872 verlies",
          "value": "-6872",
          "expression": "-182280-(-175408)",
          "why": "De debiteur wordt op 31 december afgeboekt; die afboeking volgt € 0,930."
        },
        {
          "lines": [
            "Basis: −300.000 × 0,910 + 600.000 × 0,920 − 400.000 × 0,915 − 50.000 × 0,918 = −132.900",
            "Theoretisch: −132.900 − 40.000 × 0,925 − 6.000 × 0,930 = −175.480",
            "Werkelijk: (−150.000 − 40.000 − 6.000) × 0,930 = −182.280",
            "Verschil: −182.280 − (−175.480)"
          ],
          "result": "€ 6.800 verlies",
          "value": "-6800",
          "expression": "-182280-(-175480)",
          "why": ""
        }
      ],
      "correct": 3,
      "explanation": [
        "De beginpositie, verkopen, inkopen en overige kosten geven samen theoretisch € −132.900.",
        "Daar gaan de machineaankoop (€ 37.000) en de debiteurenafboeking (€ 5.580) af: € −175.480.",
        "Aflossing en afschrijving wijzigen het saldo van de monetaire positie niet.",
        "Eindpositie: USD −196.000 × € 0,930 = € −182.280.",
        "Koersverlies: € −182.280 − (€ −175.480) = € −6.800."
      ],
      "pattern": "Voeg alleen echte mutaties van de monetaire positie toe. Een afboeking op slotdatum wijzigt de positie, maar heeft zelf geen koersverschil tot diezelfde datum.",
      "refs": [
        "corona",
        "t25mon",
        "s2mon"
      ],
      "related": [
        22,
        23,
        25
      ],
      "variant": true
    },
    {
      "id": 25,
      "stage": 4,
      "title": "Het koersverlies in resultaat deelneming",
      "type": "Journaalpost",
      "intro": "De buitenlandse jaarrekening is volgens de tijdstipmethode omgerekend. De moeder houdt 80% en waardeert tegen NVW.",
      "facts": [
        [
          "Omgerekend resultaat vóór koersverschillen",
          "€ 90.000"
        ],
        [
          "Koersverlies op monetaire positie",
          "€ 6.800"
        ],
        [
          "Overige correcties",
          "Geen."
        ]
      ],
      "task": "Welke journaalpost verwerkt het resultaat van deze deelneming?",
      "options": [
        {
          "journal": [
            [
              "0.. Deelneming",
              "65.200",
              ""
            ],
            [
              "9.. Aan Resultaat deelneming",
              "",
              "65.200"
            ]
          ],
          "journalNumeric": [
            [
              "0.. Deelneming",
              65200,
              0
            ],
            [
              "9.. Aan Resultaat deelneming",
              0,
              65200
            ]
          ],
          "why": "Het deelnemingspercentage moet ook op het koersverlies worden toegepast.",
          "lines": [
            "80% × 90.000 − 6.800 = € 65.200"
          ]
        },
        {
          "journal": [
            [
              "0.. Deelneming",
              "66.560",
              ""
            ],
            [
              "9.. Aan Resultaat deelneming",
              "",
              "66.560"
            ]
          ],
          "journalNumeric": [
            [
              "0.. Deelneming",
              66560,
              0
            ],
            [
              "9.. Aan Resultaat deelneming",
              0,
              66560
            ]
          ],
          "why": "",
          "lines": [
            "80% × (90.000 − 6.800) = € 66.560"
          ]
        },
        {
          "journal": [
            [
              "0.. Deelneming",
              "66.640",
              ""
            ],
            [
              "9.. Aan Resultaat deelneming",
              "",
              "66.640"
            ]
          ],
          "journalNumeric": [
            [
              "0.. Deelneming",
              66640,
              0
            ],
            [
              "9.. Aan Resultaat deelneming",
              0,
              66640
            ]
          ],
          "why": "Hier wordt het verlies uit de eenvoudigere casus gebruikt; nu is het € 6.800.",
          "lines": [
            "80% × (90.000 − 6.600) = € 66.640"
          ]
        },
        {
          "journal": [
            [
              "0.. Deelneming",
              "66.560",
              ""
            ],
            [
              "0.. Aan Reserve omrekeningsverschillen",
              "",
              "66.560"
            ]
          ],
          "journalNumeric": [
            [
              "0.. Deelneming",
              66560,
              0
            ],
            [
              "0.. Aan Reserve omrekeningsverschillen",
              0,
              66560
            ]
          ],
          "why": "Bij deze tijdstipmethode maakt het monetaire koersverlies deel uit van het resultaat, niet van een aparte reserve.",
          "lines": [
            "80% × (90.000 − 6.800) = € 66.560"
          ]
        }
      ],
      "correct": 1,
      "explanation": [
        "Resultaat na koersverlies: € 90.000 − € 6.800 = € 83.200.",
        "Aandeel moeder: 80% × € 83.200 = € 66.560.",
        "Deelneming debet; resultaat deelneming credit."
      ],
      "pattern": "Bij de tijdstipmethode komt het monetaire koersresultaat eerst in het resultaat van de deelneming. Pas daarna volgt het aandeel van de moeder.",
      "refs": [
        "md",
        "s2temp"
      ],
      "related": [
        10,
        23,
        24,
        27
      ],
      "variant": true
    },
    {
      "id": 26,
      "stage": 5,
      "title": "Reserve met winst én dividend",
      "type": "Rekenvraag",
      "intro": "De jaarrekening van Liva wordt omgerekend met de slotkoersmethode. Gevraagd is het omrekeningsverschil van de gehele deelneming over dit jaar.",
      "facts": [
        [
          "Eigen vermogen op 1 januari",
          "USD 1.000.000"
        ],
        [
          "Resultaat boekjaar",
          "USD 120.000; gebruik de gemiddelde koers."
        ],
        [
          "Dividend",
          "USD 40.000; op 1 juli gedeclareerd en betaald."
        ],
        [
          "Koers op 1 januari",
          "€ 0,910 per USD"
        ],
        [
          "Gemiddelde koers",
          "€ 0,920 per USD"
        ],
        [
          "Koers op 1 juli",
          "€ 0,925 per USD"
        ],
        [
          "Slotkoers",
          "€ 0,930 per USD"
        ],
        [
          "Overige vermogensmutaties",
          "Geen."
        ]
      ],
      "task": "Welke berekening geeft de mutatie van de reserve omrekeningsverschillen?",
      "options": [
        {
          "lines": [
            "1.000.000 × (0,930 − 0,910)",
            "+ 120.000 × (0,930 − 0,920)",
            "− 40.000 × (0,930 − 0,925)"
          ],
          "result": "€ 21.000 positief",
          "value": "21000.000",
          "expression": "1000000*(0.930-0.910)+120000*(0.930-0.920)-40000*(0.930-0.925)",
          "why": ""
        },
        {
          "lines": [
            "1.000.000 × (0,930 − 0,910)",
            "+ 120.000 × (0,930 − 0,920)"
          ],
          "result": "€ 21.200 positief",
          "value": "21200.000",
          "expression": "1000000*(0.930-0.910)+120000*(0.930-0.920)",
          "why": "Het koersverschil op de dividenduitkering ontbreekt."
        },
        {
          "lines": [
            "1.000.000 × (0,930 − 0,910)",
            "+ 120.000 × (0,930 − 0,920)",
            "+ 40.000 × (0,930 − 0,925)"
          ],
          "result": "€ 21.400 positief",
          "value": "21400.000",
          "expression": "1000000*(0.930-0.910)+120000*(0.930-0.920)+40000*(0.930-0.925)",
          "why": "Dividend is een vermogensafname; de component moet met een minteken worden opgenomen."
        },
        {
          "lines": [
            "1.000.000 × (0,930 − 0,910)",
            "+ 120.000 × (0,930 − 0,920)",
            "− 40.000 × (0,930 − 0,920)"
          ],
          "result": "€ 20.800 positief",
          "value": "20800.000",
          "expression": "1000000*(0.930-0.910)+120000*(0.930-0.920)-40000*(0.930-0.920)",
          "why": "Het dividend volgt zijn eigen koers van € 0,925."
        }
      ],
      "correct": 0,
      "explanation": [
        "Beginvermogen: USD 1.000.000 × (€ 0,930 − € 0,910) = € 20.000.",
        "Resultaat: USD 120.000 × (€ 0,930 − € 0,920) = € 1.200.",
        "Dividend: −USD 40.000 × (€ 0,930 − € 0,925) = € −200.",
        "Totaal: € 20.000 + € 1.200 − € 200 = € 21.000 positief."
      ],
      "pattern": "Splits het omrekeningsverschil in beginvermogen, resultaat en dividend. Elke component heeft een eigen koers en eigen teken.",
      "refs": [
        "t24close",
        "s2close"
      ],
      "related": [
        9,
        15,
        27,
        28,
        30
      ],
      "variant": true
    },
    {
      "id": 27,
      "stage": 5,
      "title": "Winst en positieve reserve boeken",
      "type": "Journaalpost",
      "intro": "De moeder houdt 80% van Liva tegen NVW. De slotkoersmethode wordt gebruikt. Het dividend is al geboekt.",
      "facts": [
        [
          "Resultaat gehele Liva",
          "USD 120.000"
        ],
        [
          "Gemiddelde koers",
          "€ 0,920 per USD"
        ],
        [
          "Omrekeningsverschil gehele Liva dit jaar",
          "€ 21.000 positief"
        ],
        [
          "Gevraagde verwerking",
          "Alleen de afsluitingsboeking voor resultaat en omrekeningsverschil."
        ]
      ],
      "task": "Welke samengestelde journaalpost boekt de moeder?",
      "options": [
        {
          "journal": [
            [
              "0.. Deelneming Liva",
              "105.120",
              ""
            ],
            [
              "9.. Aan Resultaat deelneming",
              "",
              "105.120"
            ]
          ],
          "journalNumeric": [
            [
              "0.. Deelneming Liva",
              105120,
              0
            ],
            [
              "9.. Aan Resultaat deelneming",
              0,
              105120
            ]
          ],
          "why": "Het omrekeningsverschil hoort bij de slotkoersmethode niet in resultaat deelneming.",
          "lines": [
            "80% × (120.000 × 0,920 + 21.000) = € 105.120"
          ]
        },
        {
          "journal": [
            [
              "0.. Deelneming Liva",
              "109.320",
              ""
            ],
            [
              "9.. Aan Resultaat deelneming",
              "",
              "88.320"
            ],
            [
              "0.. Aan Reserve omrekeningsverschillen",
              "",
              "21.000"
            ]
          ],
          "journalNumeric": [
            [
              "0.. Deelneming Liva",
              109320,
              0
            ],
            [
              "9.. Aan Resultaat deelneming",
              0,
              88320
            ],
            [
              "0.. Aan Reserve omrekeningsverschillen",
              0,
              21000
            ]
          ],
          "why": "Ook het omrekeningsverschil moet naar het 80%-aandeel worden verwerkt.",
          "lines": [
            "Resultaat: 80% × 120.000 × 0,920 = € 88.320",
            "Reserve: € 21.000"
          ]
        },
        {
          "journal": [
            [
              "0.. Deelneming Liva",
              "105.280",
              ""
            ],
            [
              "9.. Aan Resultaat deelneming",
              "",
              "88.320"
            ],
            [
              "0.. Aan Reserve omrekeningsverschillen",
              "",
              "16.960"
            ]
          ],
          "journalNumeric": [
            [
              "0.. Deelneming Liva",
              105280,
              0
            ],
            [
              "9.. Aan Resultaat deelneming",
              0,
              88320
            ],
            [
              "0.. Aan Reserve omrekeningsverschillen",
              0,
              16960
            ]
          ],
          "why": "Het gegeven omrekeningsverschil bedraagt € 21.000, niet € 21.200.",
          "lines": [
            "Resultaat: € 88.320",
            "Reserve: 80% × 21.200 = € 16.960"
          ]
        },
        {
          "journal": [
            [
              "0.. Deelneming Liva",
              "105.120",
              ""
            ],
            [
              "9.. Aan Resultaat deelneming",
              "",
              "88.320"
            ],
            [
              "0.. Aan Reserve omrekeningsverschillen",
              "",
              "16.800"
            ]
          ],
          "journalNumeric": [
            [
              "0.. Deelneming Liva",
              105120,
              0
            ],
            [
              "9.. Aan Resultaat deelneming",
              0,
              88320
            ],
            [
              "0.. Aan Reserve omrekeningsverschillen",
              0,
              16800
            ]
          ],
          "why": "",
          "lines": [
            "Resultaat: 80% × 120.000 × 0,920 = € 88.320",
            "Reserve: 80% × 21.000 = € 16.800"
          ]
        }
      ],
      "correct": 3,
      "explanation": [
        "Resultaat voor de moeder: 80% × USD 120.000 × € 0,920 = € 88.320.",
        "Positieve reservemutatie voor de moeder: 80% × € 21.000 = € 16.800.",
        "De deelneming neemt door beide samen toe met € 105.120."
      ],
      "pattern": "Positief resultaat én positief omrekeningsverschil verhogen allebei de deelneming, maar krijgen verschillende creditrekeningen.",
      "refs": [
        "t25close",
        "md"
      ],
      "related": [
        10,
        25,
        26,
        28
      ],
      "variant": true
    },
    {
      "id": 28,
      "stage": 5,
      "title": "De koers draait om",
      "type": "Journaalpost",
      "intro": "De functionele valuta van Liva wijkt af van die van de moeder. Gebruik de slotkoersmethode.",
      "facts": [
        [
          "Belang moeder / waardering",
          "80% / NVW"
        ],
        [
          "Eigen vermogen op 1 januari",
          "USD 1.000.000"
        ],
        [
          "Resultaat boekjaar",
          "USD 120.000; gebruik de gemiddelde koers."
        ],
        [
          "Dividend",
          "USD 40.000; op 1 juli gedeclareerd en betaald; al geboekt."
        ],
        [
          "Koers op 1 januari",
          "€ 0,930 per USD"
        ],
        [
          "Gemiddelde koers",
          "€ 0,920 per USD"
        ],
        [
          "Koers op 1 juli",
          "€ 0,915 per USD"
        ],
        [
          "Slotkoers",
          "€ 0,910 per USD"
        ],
        [
          "Overige vermogensmutaties",
          "Geen."
        ]
      ],
      "task": "Welke afsluitingsboeking verwerkt resultaat en omrekeningsverschil bij de moeder?",
      "options": [
        {
          "journal": [
            [
              "0.. Deelneming Liva",
              "71.520",
              ""
            ],
            [
              "0.. Reserve omrekeningsverschillen",
              "16.800",
              ""
            ],
            [
              "9.. Aan Resultaat deelneming",
              "",
              "88.320"
            ]
          ],
          "journalNumeric": [
            [
              "0.. Deelneming Liva",
              71520,
              0
            ],
            [
              "0.. Reserve omrekeningsverschillen",
              16800,
              0
            ],
            [
              "9.. Aan Resultaat deelneming",
              0,
              88320
            ]
          ],
          "why": "",
          "lines": [
            "Resultaat: 80% × 120.000 × 0,920 = € 88.320",
            "Reserve: 80% × [1.000.000 × (0,910 − 0,930) + 120.000 × (0,910 − 0,920) − 40.000 × (0,910 − 0,915)] = € −16.800"
          ]
        },
        {
          "journal": [
            [
              "0.. Deelneming Liva",
              "71.200",
              ""
            ],
            [
              "0.. Reserve omrekeningsverschillen",
              "17.120",
              ""
            ],
            [
              "9.. Aan Resultaat deelneming",
              "",
              "88.320"
            ]
          ],
          "journalNumeric": [
            [
              "0.. Deelneming Liva",
              71200,
              0
            ],
            [
              "0.. Reserve omrekeningsverschillen",
              17120,
              0
            ],
            [
              "9.. Aan Resultaat deelneming",
              0,
              88320
            ]
          ],
          "why": "De dividendcomponent heeft het verkeerde teken.",
          "lines": [
            "Resultaat: € 88.320",
            "Reserve: 80% × [−20.000 − 1.200 + 40.000 × (0,910 − 0,915)] = € −17.120"
          ]
        },
        {
          "journal": [
            [
              "0.. Deelneming Liva",
              "71.680",
              ""
            ],
            [
              "0.. Reserve omrekeningsverschillen",
              "16.640",
              ""
            ],
            [
              "9.. Aan Resultaat deelneming",
              "",
              "88.320"
            ]
          ],
          "journalNumeric": [
            [
              "0.. Deelneming Liva",
              71680,
              0
            ],
            [
              "0.. Reserve omrekeningsverschillen",
              16640,
              0
            ],
            [
              "9.. Aan Resultaat deelneming",
              0,
              88320
            ]
          ],
          "why": "Hier wordt de gemiddelde koers voor het dividend gebruikt.",
          "lines": [
            "Resultaat: € 88.320",
            "Reserve: 80% × [−20.000 − 1.200 − 40.000 × (0,910 − 0,920)] = € −16.640"
          ]
        },
        {
          "journal": [
            [
              "0.. Deelneming Liva",
              "71.360",
              ""
            ],
            [
              "0.. Reserve omrekeningsverschillen",
              "16.960",
              ""
            ],
            [
              "9.. Aan Resultaat deelneming",
              "",
              "88.320"
            ]
          ],
          "journalNumeric": [
            [
              "0.. Deelneming Liva",
              71360,
              0
            ],
            [
              "0.. Reserve omrekeningsverschillen",
              16960,
              0
            ],
            [
              "9.. Aan Resultaat deelneming",
              0,
              88320
            ]
          ],
          "why": "De dividendcomponent van +€ 200 vóór toepassing van het belang ontbreekt.",
          "lines": [
            "Resultaat: € 88.320",
            "Reserve: 80% × (−20.000 − 1.200) = € −16.960"
          ]
        }
      ],
      "correct": 0,
      "explanation": [
        "Beginvermogen: € −20.000; resultaatcomponent: € −1.200; dividendcomponent: € +200.",
        "Omrekeningsverschil gehele Liva: € −21.000; aandeel moeder: € −16.800.",
        "Resultaat deelneming: 80% × USD 120.000 × € 0,920 = € 88.320.",
        "Deelneming stijgt per saldo met € 71.520. De negatieve reserve wordt gedebiteerd."
      ],
      "pattern": "Het rekenpatroon blijft gelijk als de koers daalt. Het teken verandert, niet de methode. Een negatieve reserve hoeft de deelneming per saldo niet te laten dalen.",
      "refs": [
        "t24close",
        "md"
      ],
      "related": [
        26,
        27,
        30
      ],
      "variant": true
    },
    {
      "id": 29,
      "stage": 5,
      "title": "Een complete resultatenberekening",
      "type": "Rekenvraag",
      "intro": "De jaarrekening van Miro wordt voor de moeder omgerekend volgens de tijdstipmethode.",
      "facts": [
        [
          "Omzet",
          "USD 500.000; transacties tegen € 0,920."
        ],
        [
          "Kostprijs van de omzet",
          "USD 300.000; historische inkoopkoers € 0,910."
        ],
        [
          "Afschrijving volgens de deelneming",
          "USD 20.000."
        ],
        [
          "Extra afschrijving volgens grondslagen moeder",
          "USD 4.000; historische koers voor alle afschrijving € 0,900."
        ],
        [
          "Overige kosten",
          "USD 80.000; gelijkmatig over het jaar; gemiddelde koers € 0,915."
        ],
        [
          "Koersverlies op monetaire positie",
          "€ 3.000."
        ],
        [
          "Belang moeder / waardering",
          "80% / NVW"
        ],
        [
          "Overig",
          "Geen belastingen of andere resultaatcorrecties."
        ]
      ],
      "task": "Welk bedrag verantwoordt de moeder als resultaat deelneming?",
      "options": [
        {
          "lines": [
            "Omzet: 460.000; kostprijs: 273.000",
            "Afschrijving: (20.000 + 4.000) × 0,915 = 21.960",
            "Overige kosten: 80.000 × 0,915 = 73.200",
            "80% × (460.000 − 273.000 − 21.960 − 73.200 − 3.000)"
          ],
          "result": "€ 71.072",
          "value": "71072.0",
          "expression": "0.8*(460000-273000-21960-73200-3000)",
          "why": "De afschrijving volgt de historische koers, niet de gemiddelde koers."
        },
        {
          "lines": [
            "Omzet: 460.000; kostprijs: 273.000",
            "Afschrijving: 20.000 × 0,900 = 18.000",
            "Overige kosten: 80.000 × 0,915 = 73.200",
            "80% × (460.000 − 273.000 − 18.000 − 73.200 − 3.000)"
          ],
          "result": "€ 74.240",
          "value": "74240.0",
          "expression": "0.8*(460000-273000-18000-73200-3000)",
          "why": "De extra afschrijving op basis van de grondslagen van de moeder ontbreekt."
        },
        {
          "lines": [
            "Omzet: 500.000 × 0,920 = 460.000",
            "Kostprijs: 300.000 × 0,910 = 273.000",
            "Afschrijving: (20.000 + 4.000) × 0,900 = 21.600",
            "Overige kosten: 80.000 × 0,915 = 73.200",
            "80% × (460.000 − 273.000 − 21.600 − 73.200 − 3.000)"
          ],
          "result": "€ 71.360",
          "value": "71360.0",
          "expression": "0.8*(460000-273000-21600-73200-3000)",
          "why": ""
        },
        {
          "lines": [
            "Omzet: 460.000; kostprijs: 273.000",
            "Afschrijving: 21.600; overige kosten: 73.200",
            "80% × (460.000 − 273.000 − 21.600 − 73.200) − 3.000"
          ],
          "result": "€ 70.760",
          "value": "70760.0",
          "expression": "0.8*(460000-273000-21600-73200)-3000",
          "why": "Het koersverlies behoort tot het resultaat van de gehele deelneming en wordt ook met 80% vermenigvuldigd."
        }
      ],
      "correct": 2,
      "explanation": [
        "Reken elke resultaatpost tegen de passende koers om; gebruik daarbij de afschrijving volgens de moeder.",
        "Resultaat vóór koersverlies: € 460.000 − € 273.000 − € 21.600 − € 73.200 = € 92.200.",
        "Na koersverlies: € 89.200.",
        "Resultaat deelneming bij de moeder: 80% × € 89.200 = € 71.360."
      ],
      "pattern": "Bij de tijdstipmethode niet de totale vreemde-valutawinst met één koers vermenigvuldigen. Werk per post, verwerk correcties en koersresultaat en neem daarna het belang.",
      "refs": [
        "md",
        "corona",
        "s2temp"
      ],
      "related": [
        6,
        12,
        25,
        30
      ],
      "variant": true
    },
    {
      "id": 30,
      "stage": 5,
      "title": "Eindvraag: resultaat, reserve en boekwaarde",
      "type": "Journaalpost",
      "intro": "Miro wordt nu volgens de slotkoersmethode omgerekend. Alle onderstaande gegevens horen bij deze nieuwe casusvariant.",
      "facts": [
        [
          "Belang moeder / waardering",
          "80% / NVW; slotkoersmethode."
        ],
        [
          "Gecorrigeerde NVW gehele Miro op 1 januari",
          "USD 600.000; koers € 0,900."
        ],
        [
          "Omzet / kostprijs van de omzet",
          "USD 500.000 / USD 300.000."
        ],
        [
          "Afschrijving deelneming / extra volgens moeder",
          "USD 20.000 / USD 4.000."
        ],
        [
          "Overige kosten",
          "USD 80.000."
        ],
        [
          "Gemiddelde koers",
          "€ 0,915 per USD; gebruik deze voor alle resultaatposten."
        ],
        [
          "Dividend",
          "USD 30.000; op 1 juli gedeclareerd en betaald tegen € 0,918; al geboekt."
        ],
        [
          "Slotkoers",
          "€ 0,930 per USD"
        ],
        [
          "Overig",
          "Geen belastingen, andere resultaatposten of andere vermogensmutaties."
        ]
      ],
      "task": "Kies de juiste afsluitingsboeking voor resultaat en omrekeningsverschil én de bijbehorende boekwaarde van de deelneming ultimo.",
      "options": [
        {
          "journal": [
            [
              "0.. Deelneming Miro",
              "86.112",
              ""
            ],
            [
              "9.. Aan Resultaat deelneming",
              "",
              "70.272"
            ],
            [
              "0.. Aan Reserve omrekeningsverschillen",
              "",
              "15.840"
            ]
          ],
          "journalNumeric": [
            [
              "0.. Deelneming Miro",
              86112,
              0
            ],
            [
              "9.. Aan Resultaat deelneming",
              0,
              70272
            ],
            [
              "0.. Aan Reserve omrekeningsverschillen",
              0,
              15840
            ]
          ],
          "why": "De dividendcomponent staat met het verkeerde teken in de reserve.",
          "lines": [
            "Winst: 96.000 × 0,915 × 80% = € 70.272",
            "Reserve: [18.000 + 96.000 × 0,015 + 30.000 × 0,012] × 80% = € 15.840",
            "Ultimo: 432.000 + 86.112 − 22.032 = € 496.080"
          ],
          "result": "Deelneming ultimo: € 496.080"
        },
        {
          "journal": [
            [
              "0.. Deelneming Miro",
              "88.512",
              ""
            ],
            [
              "9.. Aan Resultaat deelneming",
              "",
              "73.200"
            ],
            [
              "0.. Aan Reserve omrekeningsverschillen",
              "",
              "15.312"
            ]
          ],
          "journalNumeric": [
            [
              "0.. Deelneming Miro",
              88512,
              0
            ],
            [
              "9.. Aan Resultaat deelneming",
              0,
              73200
            ],
            [
              "0.. Aan Reserve omrekeningsverschillen",
              0,
              15312
            ]
          ],
          "why": "De extra afschrijving volgens de moeder ontbreekt in het resultaat en daarmee ook in de reservemutatie.",
          "lines": [
            "Winst: (500.000 − 300.000 − 20.000 − 80.000) × 0,915 × 80% = € 73.200",
            "Reserve: [18.000 + 100.000 × 0,015 − 30.000 × 0,012] × 80% = € 15.312",
            "Ultimo: 432.000 + 88.512 − 22.032 = € 498.480"
          ],
          "result": "Deelneming ultimo: € 498.480"
        },
        {
          "journal": [
            [
              "0.. Deelneming Miro",
              "85.824",
              ""
            ],
            [
              "9.. Aan Resultaat deelneming",
              "",
              "70.272"
            ],
            [
              "0.. Aan Reserve omrekeningsverschillen",
              "",
              "15.552"
            ]
          ],
          "journalNumeric": [
            [
              "0.. Deelneming Miro",
              85824,
              0
            ],
            [
              "9.. Aan Resultaat deelneming",
              0,
              70272
            ],
            [
              "0.. Aan Reserve omrekeningsverschillen",
              0,
              15552
            ]
          ],
          "why": "De dividendcomponent ontbreekt in de reserve.",
          "lines": [
            "Winst: 96.000 × 0,915 × 80% = € 70.272",
            "Reserve: [18.000 + 96.000 × 0,015] × 80% = € 15.552",
            "Ultimo: 432.000 + 85.824 − 22.032 = € 495.792"
          ],
          "result": "Deelneming ultimo: € 495.792"
        },
        {
          "journal": [
            [
              "0.. Deelneming Miro",
              "85.536",
              ""
            ],
            [
              "9.. Aan Resultaat deelneming",
              "",
              "70.272"
            ],
            [
              "0.. Aan Reserve omrekeningsverschillen",
              "",
              "15.264"
            ]
          ],
          "journalNumeric": [
            [
              "0.. Deelneming Miro",
              85536,
              0
            ],
            [
              "9.. Aan Resultaat deelneming",
              0,
              70272
            ],
            [
              "0.. Aan Reserve omrekeningsverschillen",
              0,
              15264
            ]
          ],
          "why": "",
          "lines": [
            "Winst: (500.000 − 300.000 − 24.000 − 80.000) × 0,915 × 80% = € 70.272",
            "Reserve: [600.000 × (0,930 − 0,900) + 96.000 × (0,930 − 0,915) − 30.000 × (0,930 − 0,918)] × 80% = € 15.264",
            "Ultimo: 432.000 + 85.536 − 22.032 = € 495.504"
          ],
          "result": "Deelneming ultimo: € 495.504"
        }
      ],
      "correct": 3,
      "explanation": [
        "Gecorrigeerde winst: USD 500.000 − USD 300.000 − USD 24.000 − USD 80.000 = USD 96.000.",
        "Resultaat moeder: USD 96.000 × € 0,915 × 80% = € 70.272.",
        "Omrekeningsverschil gehele Miro: € 18.000 + € 1.440 − € 360 = € 19.080. Aandeel moeder: € 15.264.",
        "Afsluitingsboeking: deelneming € 85.536 debet, resultaat € 70.272 credit en reserve € 15.264 credit.",
        "Controle boekwaarde: 80% × (USD 600.000 + USD 96.000 − USD 30.000) × € 0,930 = € 495.504.",
        "Controle via verloop: begin € 432.000 + resultaat € 70.272 + reserve € 15.264 − dividend € 22.032 = € 495.504."
      ],
      "pattern": "Slotkoersmethode: corrigeer naar moedergrondslagen, reken het resultaat om, splits de reserve en controleer de deelneming langs twee routes.",
      "refs": [
        "corona",
        "t24close",
        "t25close",
        "md"
      ],
      "related": [
        15,
        26,
        27,
        28,
        29
      ],
      "variant": true
    }
  ],
  "notice": "Zelfgemaakte oefenvarianten op basis van de projectbronnen. Namen, bedragen en koersen zijn fictief. De berekeningen zijn herberekend; dit zijn geen officiële tentamenvragen of officiële cijferantwoorden.",
  "prior": {
    "label": "Eerdere kliktoets (gecorrigeerd)",
    "correct": 9,
    "answered": 14,
    "wrongIds": [
      4,
      10,
      12,
      13,
      15
    ]
  },
  "subtitle": "Opgave 2 · 30 oefenvragen",
  "notes": [
    "De bestaande 30 valutavragen zijn behouden. Vraag 3 is explicieter geformuleerd; de eerder gerepareerde vraag 20 over afwaardering blijft gehandhaafd.",
    "Het betreft eigen vraagvarianten op basis van de vermelde bronnen, geen letterlijke officiële tentamenvragen.",
    "Eerdere chatregistratie: 9/14 (64,3%) voor de eerste, afzonderlijke 15-vragentoets. Deze nieuwe poging start leeg en overschrijft die score niet.",
    "Elke oefenvraag telt als één goed/fout-vraag. De puntentelling is geen officiële tentamennormering."
  ],
  "code": "val",
  "opgave": 2
};
})(window);
