(function (root) {
  'use strict';
  if (!root.CAFA2_DATA || !root.CAFA2_DATA.modules) throw new Error('CAFA2-configuratie ontbreekt.');
  root.CAFA2_DATA.modules.hk = {
  "id": "cafa2-verkrijgingsprijs-30-v1",
  "title": "Consolidatie verkrijgingsprijs",
  "subtitle": "Opgave 4 · 30 oefenvragen",
  "stages": [
    {
      "title": "Verkrijgingsprijs en dividend",
      "range": "1–5"
    },
    {
      "title": "Balans en consolidatiegoodwill",
      "range": "6–10"
    },
    {
      "title": "Resultaat en eerste voorraadtabel",
      "range": "11–15"
    },
    {
      "title": "Upstream: eindstand en vrijval",
      "range": "16–20"
    },
    {
      "title": "Downstream: toe- en afname",
      "range": "21–25"
    },
    {
      "title": "Twee aankopen en gecombineerde casus",
      "range": "26–30"
    }
  ],
  "notes": [
    "Eigen oefenvarianten met gewijzigde bedragen en namen, gebaseerd op de genoemde projectbronnen. Geen letterlijke officiële tentamenvragen.",
    "Alleen de in de casus opgegeven belastingtarieven worden gebruikt. Goodwillafschrijving heeft in deze vragen geen belastingeffect.",
    "Deelnemingen staan enkelvoudig tegen verkrijgingsprijs; consolidatie is integraal, tenzij de vraag anders vermeldt.",
    "Elke meerkeuzevraag telt als één oefenpunt. Vrije uitwerkingen worden niet automatisch inhoudelijk beoordeeld."
  ],
  "sources": {
    "basis": {
      "label": "Syllabus CAFA2 (Nyenrode), Deel 3, §2.1–2.2, p. 5–6; §6.1, p. 143–152.",
      "file": "2026 Syllabus CAFA2 Deel 3 Consolideren.pdf",
      "pages": "5–6, 143–152"
    },
    "balans": {
      "label": "Syllabus CAFA2 (Nyenrode), Deel 3, §6.1, p. 144–151: verwerving, consolidatiegoodwill en belang derden.",
      "file": "2026 Syllabus CAFA2 Deel 3 Consolideren.pdf",
      "pages": "144–151"
    },
    "college": {
      "label": "Thieu, slides college 8 (2025), “4. Consolidatie HK”, dia 3 en 7–10: eliminatie op verkrijgingsmoment, belang derden op einddatum en afschrijving goodwill.",
      "file": "Slides College 8 2025 CAFA2 [copyright Nyenrode Business Universiteit] 4. Consolidatie HK.pptx",
      "pages": "dia 3, 7–10"
    },
    "hoza": {
      "label": "Nyenrode, uitwerking tentamen 30-09-2024, opgave 4 Hoza, vraag 21–25, p. 12–14.",
      "file": "20240930 Uitwerking tentamen CAFA2.pdf",
      "pages": "12–14"
    },
    "orvelde": {
      "label": "Nyenrode, uitwerking tentamen 17-04-2025, opgave 4 Orvelde, vraag 23–28, p. 13–15.",
      "file": "20250417 Uitwerking tentamen CAFA2.pdf",
      "pages": "13–15"
    },
    "schier": {
      "label": "Nyenrode, uitwerking tentamen 24-09-2025 na normering, opgave 4 SchierGlas, vraag 24–31, p. 12–14. Nummering in de opgave: vraag 1–6; de uitwerking gebruikt doorlopende nummers.",
      "file": "20250924 Uitwerking tentamen CAFA2 (na normering).pdf",
      "pages": "12–14"
    },
    "boit": {
      "label": "Syllabus CAFA2 (Nyenrode), uitwerkingen Deel 3a, Boit, vraag 1–7, p. 69–71.",
      "file": "2026 Syllabus CAFA2 deel 3a - uitwerking opgaven consolidatie owp.pdf",
      "pages": "69–71"
    },
    "up": {
      "label": "Syllabus CAFA2 (Nyenrode), Deel 3, §6.2.2 en §6.3.2, p. 159–165 en 176–185.",
      "file": "2026 Syllabus CAFA2 Deel 3 Consolideren.pdf",
      "pages": "159–165, 176–185"
    },
    "down": {
      "label": "Syllabus CAFA2 (Nyenrode), Deel 3, §6.2.1 en §6.3.1, p. 153–158 en 166–175.",
      "file": "2026 Syllabus CAFA2 Deel 3 Consolideren.pdf",
      "pages": "153–158, 166–175"
    }
  },
  "questions": [
    {
      "id": 1,
      "stage": 0,
      "title": "Winst zonder dividend",
      "type": "Theorie",
      "intro": "Duin behaalt winst. Haven waardeert haar deelneming tegen verkrijgingsprijs.",
      "facts": [
        [
          "Belang Haven in Duin",
          "75%; Duin wordt integraal geconsolideerd."
        ],
        [
          "Enkelvoudige waardering",
          "Verkrijgingsprijs; geen bijzondere waardevermindering."
        ],
        [
          "Winst Duin",
          "€ 160.000"
        ],
        [
          "Dividend",
          "Er is geen dividend gedeclareerd."
        ]
      ],
      "task": "Wat boekt Haven enkelvoudig uitsluitend vanwege de door Duin behaalde winst?",
      "options": [
        {
          "text": "Resultaat deelneming debet en deelneming credit voor € 120.000.",
          "why": "Dit zou een afwaardering voorstellen; die is niet gegeven."
        },
        {
          "text": "Deelneming debet en reserve deelneming credit voor € 120.000.",
          "why": "De winst leidt hier niet tot een enkelvoudige vermogensmutatie."
        },
        {
          "text": "Deelneming debet en resultaat deelneming credit voor € 120.000.",
          "why": "Dit is de vermogensmutatie bij 75% × € 160.000, niet de verwerking bij verkrijgingsprijs."
        },
        {
          "text": "Geen journaalpost; de behaalde winst wordt niet als vermogensmutatie in de deelneming verwerkt.",
          "why": ""
        }
      ],
      "correct": 3,
      "explanation": [
        "Het winstaandeel wordt bij verkrijgingsprijs niet door een enkelvoudige resultaatboeking aan de deelneming toegevoegd.",
        "De volledige baten en lasten van Duin worden wel in de integrale consolidatie betrokken."
      ],
      "pattern": "Bepaal eerst of de vraag gaat over de enkelvoudige administratie of over consolidatie.",
      "refs": [
        "basis",
        "boit"
      ],
      "related": [
        2,
        5,
        13
      ],
      "variant": true
    },
    {
      "id": 2,
      "stage": 0,
      "title": "De verwerving boeken",
      "type": "Journaalpost",
      "intro": "Haven koopt per 1 januari 2023 een belang in Duin.",
      "facts": [
        [
          "Belang Haven in Duin",
          "75%; Duin wordt integraal geconsolideerd."
        ],
        [
          "Enkelvoudige waardering",
          "Verkrijgingsprijs; geen bijzondere waardevermindering."
        ],
        [
          "Betaalde koopsom per bank",
          "€ 735.000, inclusief € 90.000 goodwill."
        ]
      ],
      "task": "Welke journaalpost maakt Haven van de aankoop in haar eigen administratie?",
      "options": [
        {
          "journal": [
            [
              "0.. Deelneming Duin",
              "€ 645.000",
              ""
            ],
            [
              "1.. Aan Bank",
              "",
              "€ 645.000"
            ]
          ],
          "journalNumeric": [
            [
              "0.. Deelneming Duin",
              645000,
              0
            ],
            [
              "1.. Aan Bank",
              0,
              645000
            ]
          ],
          "why": "De volledige betaalde verkrijgingsprijs moet worden opgenomen."
        },
        {
          "journal": [
            [
              "0.. Deelneming Duin",
              "€ 735.000",
              ""
            ],
            [
              "0.. Goodwill",
              "€ 90.000",
              ""
            ],
            [
              "1.. Aan Bank",
              "",
              "€ 825.000"
            ]
          ],
          "journalNumeric": [
            [
              "0.. Deelneming Duin",
              735000,
              0
            ],
            [
              "0.. Goodwill",
              90000,
              0
            ],
            [
              "1.. Aan Bank",
              0,
              825000
            ]
          ],
          "why": "Goodwill zit al in de koopsom en mag daar niet nog eens bovenop worden geteld."
        },
        {
          "journal": [
            [
              "0.. Deelneming Duin",
              "€ 645.000",
              ""
            ],
            [
              "0.. Goodwill",
              "€ 90.000",
              ""
            ],
            [
              "1.. Aan Bank",
              "",
              "€ 735.000"
            ]
          ],
          "journalNumeric": [
            [
              "0.. Deelneming Duin",
              645000,
              0
            ],
            [
              "0.. Goodwill",
              90000,
              0
            ],
            [
              "1.. Aan Bank",
              0,
              735000
            ]
          ],
          "why": "De goodwill wordt bij deze waardering pas bij consolidatie afzonderlijk zichtbaar."
        },
        {
          "journal": [
            [
              "0.. Deelneming Duin",
              "€ 735.000",
              ""
            ],
            [
              "1.. Aan Bank",
              "",
              "€ 735.000"
            ]
          ],
          "journalNumeric": [
            [
              "0.. Deelneming Duin",
              735000,
              0
            ],
            [
              "1.. Aan Bank",
              0,
              735000
            ]
          ],
          "why": ""
        }
      ],
      "correct": 3,
      "explanation": [
        "De deelneming wordt voor de volledige koopsom van € 735.000 geactiveerd.",
        "Er wordt enkelvoudig geen aparte post goodwill geboekt."
      ],
      "pattern": "Verkrijgingsprijs: de koopsom staat in de deelneming; goodwill wordt bij consolidatie uitgesplitst.",
      "refs": [
        "balans",
        "orvelde"
      ],
      "related": [
        3,
        6
      ],
      "variant": true
    },
    {
      "id": 3,
      "stage": 0,
      "title": "Consolidatiegoodwill bepalen",
      "type": "Rekenvraag",
      "intro": "Haven koopt op 1 januari 2023 75% van Duin.",
      "facts": [
        [
          "Verkrijgingsprijs",
          "€ 735.000"
        ],
        [
          "Eigen vermogen bij verwerving",
          "€ 860.000"
        ],
        [
          "Waarderingsverschillen",
          "Geen; de nettovermogenswaarde is gelijk aan het zichtbare eigen vermogen."
        ]
      ],
      "task": "Hoeveel goodwill is bij de verwerving betaald?",
      "options": [
        {
          "lines": [
            "€ 735.000 − 75% × € 840.000"
          ],
          "result": "€ 105.000",
          "why": "Het eigen vermogen bij verwerving bedraagt € 860.000."
        },
        {
          "lines": [
            "€ 735.000 − 80% × € 860.000"
          ],
          "result": "€ 47.000",
          "why": "Het belang is 75%, niet 80%."
        },
        {
          "lines": [
            "€ 735.000 − 75% × € 860.000"
          ],
          "result": "€ 90.000",
          "why": "",
          "auditExpressions": [
            [
              "735000-.75*860000",
              90000
            ]
          ]
        },
        {
          "lines": [
            "75% × (€ 735.000 − € 860.000)"
          ],
          "result": "€ −93.750",
          "why": "De koopsom heeft al betrekking op het 75%-belang; alleen het eigen vermogen wordt met het belang vermenigvuldigd."
        }
      ],
      "correct": 2,
      "explanation": [
        "Het aandeel in het eigen vermogen is 75% × € 860.000 = € 645.000.",
        "Goodwill: € 735.000 − € 645.000 = € 90.000."
      ],
      "pattern": "Koopsom van het verworven belang minus het aandeel in het eigen vermogen op de verkrijgingsdatum.",
      "refs": [
        "balans",
        "hoza"
      ],
      "related": [
        2,
        8,
        26
      ],
      "variant": true
    },
    {
      "id": 4,
      "stage": 0,
      "title": "Het meegekochte dividend",
      "type": "Journaalpost",
      "intro": "Haven kocht 75% van Duin op 1 januari 2023 inclusief recht op het dividend over 2022.",
      "facts": [
        [
          "Belang Haven in Duin",
          "75%; Duin wordt integraal geconsolideerd."
        ],
        [
          "Enkelvoudige waardering",
          "Verkrijgingsprijs; geen bijzondere waardevermindering."
        ],
        [
          "Dividend over 2022",
          "Duin declareert en betaalt in april 2023 in totaal € 40.000."
        ],
        [
          "Aard dividend",
          "Het betreft volledig meegekocht dividend."
        ]
      ],
      "task": "Welke journaalpost maakt Haven bij ontvangst?",
      "options": [
        {
          "journal": [
            [
              "1.. Bank",
              "€ 30.000",
              ""
            ],
            [
              "9.. Aan Opbrengst deelneming Duin",
              "",
              "€ 30.000"
            ]
          ],
          "journalNumeric": [
            [
              "1.. Bank",
              30000,
              0
            ],
            [
              "9.. Aan Opbrengst deelneming Duin",
              0,
              30000
            ]
          ],
          "why": "Meegekocht dividend vermindert de verkrijgingsprijs; het is hier geen nieuwe dividendopbrengst."
        },
        {
          "journal": [
            [
              "1.. Bank",
              "€ 40.000",
              ""
            ],
            [
              "0.. Aan Deelneming Duin",
              "",
              "€ 40.000"
            ]
          ],
          "journalNumeric": [
            [
              "1.. Bank",
              40000,
              0
            ],
            [
              "0.. Aan Deelneming Duin",
              0,
              40000
            ]
          ],
          "why": "Haven ontvangt 75%, niet het totale door Duin uitgekeerde bedrag."
        },
        {
          "journal": [
            [
              "1.. Bank",
              "€ 30.000",
              ""
            ],
            [
              "0.. Aan Deelneming Duin",
              "",
              "€ 30.000"
            ]
          ],
          "journalNumeric": [
            [
              "1.. Bank",
              30000,
              0
            ],
            [
              "0.. Aan Deelneming Duin",
              0,
              30000
            ]
          ],
          "why": ""
        },
        {
          "journal": [
            [
              "0.. Deelneming Duin",
              "€ 30.000",
              ""
            ],
            [
              "1.. Aan Bank",
              "",
              "€ 30.000"
            ]
          ],
          "journalNumeric": [
            [
              "0.. Deelneming Duin",
              30000,
              0
            ],
            [
              "1.. Aan Bank",
              0,
              30000
            ]
          ],
          "why": "Het dividend wordt ontvangen; bank neemt toe en deelneming neemt af."
        }
      ],
      "correct": 2,
      "explanation": [
        "Ontvangen bedrag: 75% × € 40.000 = € 30.000.",
        "Het meegekochte dividend verlaagt de boekwaarde van de deelneming van € 735.000 naar € 705.000."
      ],
      "pattern": "Onderscheid meegekocht dividend van regulier dividend uit resultaten na verkrijging.",
      "refs": [
        "hoza",
        "orvelde",
        "schier"
      ],
      "related": [
        5,
        6,
        27
      ],
      "variant": true
    },
    {
      "id": 5,
      "stage": 0,
      "title": "Dividend uit winst na aankoop",
      "type": "Journaalpost",
      "intro": "Haven heeft Duin al sinds 1 januari 2023. Het dividend wordt uitgekeerd uit winst die ná die aankoop is behaald.",
      "facts": [
        [
          "Belang Haven in Duin",
          "75%; Duin wordt integraal geconsolideerd."
        ],
        [
          "Enkelvoudige waardering",
          "Verkrijgingsprijs; geen bijzondere waardevermindering."
        ],
        [
          "Regulier dividend Duin",
          "€ 48.000, gedeclareerd en betaald in 2024."
        ],
        [
          "Meegekocht dividend",
          "Niet van toepassing op deze uitkering."
        ]
      ],
      "task": "Welke journaalpost maakt Haven in 2024?",
      "options": [
        {
          "journal": [
            [
              "1.. Bank",
              "€ 36.000",
              ""
            ],
            [
              "0.. Aan Deelneming Duin",
              "",
              "€ 36.000"
            ]
          ],
          "journalNumeric": [
            [
              "1.. Bank",
              36000,
              0
            ],
            [
              "0.. Aan Deelneming Duin",
              0,
              36000
            ]
          ],
          "why": "Je behandelt regulier dividend alsof het meegekocht dividend is."
        },
        {
          "journal": [
            [
              "9.. Opbrengst deelneming Duin",
              "€ 36.000",
              ""
            ],
            [
              "1.. Aan Bank",
              "",
              "€ 36.000"
            ]
          ],
          "journalNumeric": [
            [
              "9.. Opbrengst deelneming Duin",
              36000,
              0
            ],
            [
              "1.. Aan Bank",
              0,
              36000
            ]
          ],
          "why": "De richting is omgekeerd: bank en opbrengst nemen toe."
        },
        {
          "journal": [
            [
              "1.. Bank",
              "€ 48.000",
              ""
            ],
            [
              "9.. Aan Opbrengst deelneming Duin",
              "",
              "€ 48.000"
            ]
          ],
          "journalNumeric": [
            [
              "1.. Bank",
              48000,
              0
            ],
            [
              "9.. Aan Opbrengst deelneming Duin",
              0,
              48000
            ]
          ],
          "why": "Haven ontvangt 75% van het totale dividend."
        },
        {
          "journal": [
            [
              "1.. Bank",
              "€ 36.000",
              ""
            ],
            [
              "9.. Aan Opbrengst deelneming Duin",
              "",
              "€ 36.000"
            ]
          ],
          "journalNumeric": [
            [
              "1.. Bank",
              36000,
              0
            ],
            [
              "9.. Aan Opbrengst deelneming Duin",
              0,
              36000
            ]
          ],
          "why": ""
        }
      ],
      "correct": 3,
      "explanation": [
        "75% × € 48.000 = € 36.000 wordt ontvangen.",
        "Bij verkrijgingsprijs is dit een opbrengst in de enkelvoudige winst-en-verliesrekening."
      ],
      "pattern": "Het soort dividend bepaalt de tegenrekening: deelneming bij meegekocht dividend, opbrengst bij regulier dividend.",
      "refs": [
        "hoza",
        "schier"
      ],
      "related": [
        4,
        11,
        13
      ],
      "variant": true
    },
    {
      "id": 6,
      "stage": 1,
      "title": "Eliminatie van de deelneming",
      "type": "Journaalpost",
      "intro": "De balansconsolidatie wordt per 31 december 2024 opgesteld.",
      "facts": [
        [
          "Belang Haven in Duin",
          "75%; Duin wordt integraal geconsolideerd."
        ],
        [
          "Enkelvoudige waardering",
          "Verkrijgingsprijs; geen bijzondere waardevermindering."
        ],
        [
          "Verkrijging op 1 januari 2023",
          "Koopsom € 735.000; goodwill € 90.000."
        ],
        [
          "Eigen vermogen Duin bij verkrijging",
          "Aandelenkapitaal € 200.000; agio € 60.000; overige reserves € 600.000."
        ],
        [
          "Meegekocht dividend betaald in 2023",
          "Totaal € 40.000 uit de bij aankoop aanwezige overige reserves. Haven heeft € 30.000 afgeboekt van de deelneming."
        ],
        [
          "Boekwaarde deelneming ultimo 2024",
          "€ 705.000."
        ]
      ],
      "task": "Welke eliminatieboeking betreft uitsluitend de deelneming en de activering van goodwill, vóór afschrijving en los van belang derden?",
      "options": [
        {
          "journal": [
            [
              "Aandelenkapitaal Duin",
              "€ 150.000",
              ""
            ],
            [
              "Agio Duin",
              "€ 45.000",
              ""
            ],
            [
              "Overige reserves Duin",
              "€ 450.000",
              ""
            ],
            [
              "Goodwill",
              "€ 60.000",
              ""
            ],
            [
              "Aan Deelneming Duin",
              "",
              "€ 705.000"
            ]
          ],
          "journalNumeric": [
            [
              "Aandelenkapitaal Duin",
              150000,
              0
            ],
            [
              "Agio Duin",
              45000,
              0
            ],
            [
              "Overige reserves Duin",
              450000,
              0
            ],
            [
              "Goodwill",
              60000,
              0
            ],
            [
              "Aan Deelneming Duin",
              0,
              705000
            ]
          ],
          "why": "Het meegekochte dividend verlaagt de relevante reserves, niet de oorspronkelijke goodwill."
        },
        {
          "journal": [
            [
              "Aandelenkapitaal Duin",
              "€ 150.000",
              ""
            ],
            [
              "Agio Duin",
              "€ 45.000",
              ""
            ],
            [
              "Overige reserves Duin",
              "€ 420.000",
              ""
            ],
            [
              "Goodwill",
              "€ 90.000",
              ""
            ],
            [
              "Aan Deelneming Duin",
              "",
              "€ 705.000"
            ]
          ],
          "journalNumeric": [
            [
              "Aandelenkapitaal Duin",
              150000,
              0
            ],
            [
              "Agio Duin",
              45000,
              0
            ],
            [
              "Overige reserves Duin",
              420000,
              0
            ],
            [
              "Goodwill",
              90000,
              0
            ],
            [
              "Aan Deelneming Duin",
              0,
              705000
            ]
          ],
          "why": ""
        },
        {
          "journal": [
            [
              "Aandelenkapitaal Duin",
              "€ 150.000",
              ""
            ],
            [
              "Agio Duin",
              "€ 45.000",
              ""
            ],
            [
              "Overige reserves Duin",
              "€ 450.000",
              ""
            ],
            [
              "Goodwill",
              "€ 90.000",
              ""
            ],
            [
              "Aan Deelneming Duin",
              "",
              "€ 735.000"
            ]
          ],
          "journalNumeric": [
            [
              "Aandelenkapitaal Duin",
              150000,
              0
            ],
            [
              "Agio Duin",
              45000,
              0
            ],
            [
              "Overige reserves Duin",
              450000,
              0
            ],
            [
              "Goodwill",
              90000,
              0
            ],
            [
              "Aan Deelneming Duin",
              0,
              735000
            ]
          ],
          "why": "De afboeking van het meegekochte dividend is niet meegenomen."
        },
        {
          "journal": [
            [
              "Aandelenkapitaal Duin",
              "€ 150.000",
              ""
            ],
            [
              "Agio Duin",
              "€ 45.000",
              ""
            ],
            [
              "Overige reserves Duin",
              "€ 465.000",
              ""
            ],
            [
              "Goodwill",
              "€ 45.000",
              ""
            ],
            [
              "Aan Deelneming Duin",
              "",
              "€ 705.000"
            ]
          ],
          "journalNumeric": [
            [
              "Aandelenkapitaal Duin",
              150000,
              0
            ],
            [
              "Agio Duin",
              45000,
              0
            ],
            [
              "Overige reserves Duin",
              465000,
              0
            ],
            [
              "Goodwill",
              45000,
              0
            ],
            [
              "Aan Deelneming Duin",
              0,
              705000
            ]
          ],
          "why": "Gebruik de gecorrigeerde verkrijgingsbasis; de historische goodwill blijft hier € 90.000."
        }
      ],
      "correct": 1,
      "explanation": [
        "Aandelenkapitaal: 75% × € 200.000 = € 150.000; agio: 75% × € 60.000 = € 45.000.",
        "Overige reserves: 75% × (€ 600.000 − € 40.000) = € 420.000.",
        "Met goodwill € 90.000 bedraagt de eliminatie € 705.000. Afschrijving is een afzonderlijke eliminatie."
      ],
      "pattern": "Het moederdeel volgt de verkrijgingssituatie, rekening houdend met afgeboekt meegekocht dividend.",
      "refs": [
        "hoza",
        "college"
      ],
      "related": [
        4,
        7,
        9,
        27
      ],
      "variant": true
    },
    {
      "id": 7,
      "stage": 1,
      "title": "Belang derden op balansdatum",
      "type": "Journaalpost",
      "intro": "Haven consolideert Duin per 31 december 2024.",
      "facts": [
        [
          "Belang Haven in Duin",
          "75%; Duin wordt integraal geconsolideerd."
        ],
        [
          "Enkelvoudige waardering",
          "Verkrijgingsprijs; geen bijzondere waardevermindering."
        ],
        [
          "Eigen vermogen Duin ultimo 2024",
          "Aandelenkapitaal € 200.000; agio € 60.000; overige reserves € 720.000; resultaat boekjaar € 160.000."
        ],
        [
          "Intercompanywinst en fair value",
          "Niet aan de orde in deze vraag."
        ]
      ],
      "task": "Welke boeking presenteert het belang derden?",
      "options": [
        {
          "journal": [
            [
              "Aandelenkapitaal Duin",
              "€ 150.000",
              ""
            ],
            [
              "Agio Duin",
              "€ 45.000",
              ""
            ],
            [
              "Overige reserves Duin",
              "€ 540.000",
              ""
            ],
            [
              "Resultaat boekjaar Duin",
              "€ 120.000",
              ""
            ],
            [
              "Aan Belang derden",
              "",
              "€ 855.000"
            ]
          ],
          "journalNumeric": [
            [
              "Aandelenkapitaal Duin",
              150000,
              0
            ],
            [
              "Agio Duin",
              45000,
              0
            ],
            [
              "Overige reserves Duin",
              540000,
              0
            ],
            [
              "Resultaat boekjaar Duin",
              120000,
              0
            ],
            [
              "Aan Belang derden",
              0,
              855000
            ]
          ],
          "why": "Dit is het 75%-moederdeel; derden houden 25%."
        },
        {
          "journal": [
            [
              "Aandelenkapitaal Duin",
              "€ 50.000",
              ""
            ],
            [
              "Agio Duin",
              "€ 15.000",
              ""
            ],
            [
              "Overige reserves Duin",
              "€ 150.000",
              ""
            ],
            [
              "Aan Belang derden",
              "",
              "€ 215.000"
            ]
          ],
          "journalNumeric": [
            [
              "Aandelenkapitaal Duin",
              50000,
              0
            ],
            [
              "Agio Duin",
              15000,
              0
            ],
            [
              "Overige reserves Duin",
              150000,
              0
            ],
            [
              "Aan Belang derden",
              0,
              215000
            ]
          ],
          "why": "Dit gebruikt het eigen vermogen bij verkrijging, niet de stand op consolidatiedatum."
        },
        {
          "journal": [
            [
              "Aandelenkapitaal Duin",
              "€ 50.000",
              ""
            ],
            [
              "Agio Duin",
              "€ 15.000",
              ""
            ],
            [
              "Overige reserves Duin",
              "€ 180.000",
              ""
            ],
            [
              "Resultaat boekjaar Duin",
              "€ 40.000",
              ""
            ],
            [
              "Aan Belang derden",
              "",
              "€ 285.000"
            ]
          ],
          "journalNumeric": [
            [
              "Aandelenkapitaal Duin",
              50000,
              0
            ],
            [
              "Agio Duin",
              15000,
              0
            ],
            [
              "Overige reserves Duin",
              180000,
              0
            ],
            [
              "Resultaat boekjaar Duin",
              40000,
              0
            ],
            [
              "Aan Belang derden",
              0,
              285000
            ]
          ],
          "why": ""
        },
        {
          "journal": [
            [
              "Aandelenkapitaal Duin",
              "€ 50.000",
              ""
            ],
            [
              "Agio Duin",
              "€ 15.000",
              ""
            ],
            [
              "Overige reserves Duin",
              "€ 180.000",
              ""
            ],
            [
              "Aan Belang derden",
              "",
              "€ 245.000"
            ]
          ],
          "journalNumeric": [
            [
              "Aandelenkapitaal Duin",
              50000,
              0
            ],
            [
              "Agio Duin",
              15000,
              0
            ],
            [
              "Overige reserves Duin",
              180000,
              0
            ],
            [
              "Aan Belang derden",
              0,
              245000
            ]
          ],
          "why": "Het resultaat boekjaar hoort ook bij het eigen vermogen op balansdatum."
        }
      ],
      "correct": 2,
      "explanation": [
        "Derden houden 25%. Het eigen vermogen ultimo bedraagt € 1.140.000.",
        "25% × € 1.140.000 = € 285.000. De samenstellende vermogensposten worden gedebiteerd."
      ],
      "pattern": "Derden: einddatum. Deelneming: verkrijgingsdatum.",
      "refs": [
        "balans",
        "hoza",
        "college"
      ],
      "related": [
        6,
        12,
        19
      ],
      "variant": true
    },
    {
      "id": 8,
      "stage": 1,
      "title": "De resterende goodwill",
      "type": "Rekenvraag",
      "intro": "Haven betaalt op 1 januari 2023 € 90.000 goodwill.",
      "facts": [
        [
          "Consolidatie",
          "Goodwill wordt alleen in de consolidatie afzonderlijk verwerkt."
        ],
        [
          "Afschrijving",
          "Lineair in vijf jaar; restwaarde nihil."
        ],
        [
          "Balansdatum",
          "31 december 2024; twee volledige jaren verstreken."
        ]
      ],
      "task": "Wat is de boekwaarde goodwill op de geconsolideerde balans?",
      "options": [
        {
          "lines": [
            "€ 90.000 − (€ 90.000 ÷ 5)"
          ],
          "result": "€ 72.000",
          "why": "Je hebt slechts één jaar afgeschreven."
        },
        {
          "lines": [
            "€ 90.000 − 2 × (€ 90.000 ÷ 5)"
          ],
          "result": "€ 54.000",
          "why": "",
          "auditExpressions": [
            [
              "90000-2*(90000/5)",
              54000
            ]
          ]
        },
        {
          "lines": [
            "€ 90.000 − 2,5 × (€ 90.000 ÷ 5)"
          ],
          "result": "€ 45.000",
          "why": "Er zijn twee volledige jaren verstreken, geen tweeënhalf."
        },
        {
          "lines": [
            "75% × [€ 90.000 − 2 × (€ 90.000 ÷ 5)]"
          ],
          "result": "€ 40.500",
          "why": "De gegeven goodwill heeft al betrekking op het verworven belang."
        }
      ],
      "correct": 1,
      "explanation": [
        "Jaarafschrijving: € 90.000 ÷ 5 = € 18.000.",
        "Na twee jaren resteert € 90.000 − € 36.000 = € 54.000."
      ],
      "pattern": "Goodwill niet nogmaals vermenigvuldigen met het deelnemingspercentage.",
      "refs": [
        "orvelde",
        "hoza"
      ],
      "related": [
        3,
        9,
        10,
        26
      ],
      "variant": true
    },
    {
      "id": 9,
      "stage": 1,
      "title": "Goodwill: balanseliminatie",
      "type": "Journaalpost",
      "intro": "Goodwill van € 90.000 is bij verwerving op 1 januari 2023 ontstaan.",
      "facts": [
        [
          "Balansdatum",
          "31 december 2024"
        ],
        [
          "Afschrijving",
          "Vijf jaar lineair; € 18.000 per jaar."
        ],
        [
          "Uitgangspunt consolidatiestaat",
          "De oorspronkelijke goodwill is voor € 90.000 gedebiteerd; afschrijving is nog niet verwerkt."
        ],
        [
          "Belastingeffect goodwill",
          "Geen."
        ]
      ],
      "task": "Welke balanseliminatie verwerkt de afschrijving tot en met eind 2024?",
      "options": [
        {
          "journal": [
            [
              "Afschrijvingskosten goodwill",
              "€ 18.000",
              ""
            ],
            [
              "Aan Goodwill",
              "",
              "€ 18.000"
            ]
          ],
          "journalNumeric": [
            [
              "Afschrijvingskosten goodwill",
              18000,
              0
            ],
            [
              "Aan Goodwill",
              0,
              18000
            ]
          ],
          "why": "Een balanseliminatie bevat alleen balansposten en moet ook de eerdere afschrijving meenemen."
        },
        {
          "journal": [
            [
              "Overige reserves",
              "€ 18.000",
              ""
            ],
            [
              "Resultaat boekjaar",
              "€ 18.000",
              ""
            ],
            [
              "Aan Goodwill",
              "",
              "€ 36.000"
            ]
          ],
          "journalNumeric": [
            [
              "Overige reserves",
              18000,
              0
            ],
            [
              "Resultaat boekjaar",
              18000,
              0
            ],
            [
              "Aan Goodwill",
              0,
              36000
            ]
          ],
          "why": ""
        },
        {
          "journal": [
            [
              "Overige reserves",
              "€ 36.000",
              ""
            ],
            [
              "Aan Goodwill",
              "",
              "€ 36.000"
            ]
          ],
          "journalNumeric": [
            [
              "Overige reserves",
              36000,
              0
            ],
            [
              "Aan Goodwill",
              0,
              36000
            ]
          ],
          "why": "De afschrijving over 2024 hoort bij het resultaat boekjaar."
        },
        {
          "journal": [
            [
              "Resultaat boekjaar",
              "€ 36.000",
              ""
            ],
            [
              "Aan Goodwill",
              "",
              "€ 36.000"
            ]
          ],
          "journalNumeric": [
            [
              "Resultaat boekjaar",
              36000,
              0
            ],
            [
              "Aan Goodwill",
              0,
              36000
            ]
          ],
          "why": "De afschrijving over 2023 hoort bij overige reserves, niet bij het resultaat 2024."
        }
      ],
      "correct": 1,
      "explanation": [
        "De afschrijving over 2023 van € 18.000 wordt ten laste van overige reserves gebracht.",
        "De afschrijving over 2024 van € 18.000 wordt ten laste van resultaat boekjaar gebracht."
      ],
      "pattern": "Balans: eerdere jaren naar reserves, lopend jaar naar resultaat boekjaar.",
      "refs": [
        "hoza",
        "college"
      ],
      "related": [
        8,
        10
      ],
      "variant": true
    },
    {
      "id": 10,
      "stage": 1,
      "title": "Goodwill: winst-en-verliesrekening",
      "type": "Journaalpost",
      "intro": "Haven stelt afzonderlijk de geconsolideerde winst-en-verliesrekening over 2024 op.",
      "facts": [
        [
          "Goodwill bij verkrijging",
          "€ 90.000 op 1 januari 2023"
        ],
        [
          "Afschrijving",
          "Lineair in vijf jaar; restwaarde nihil."
        ],
        [
          "Belastingeffect goodwill",
          "Geen."
        ]
      ],
      "task": "Welke eliminatie verwerkt de afschrijving in de winst-en-verliesrekening over 2024?",
      "options": [
        {
          "journal": [
            [
              "Afschrijvingskosten goodwill",
              "€ 18.000",
              ""
            ],
            [
              "Aan Goodwill",
              "",
              "€ 18.000"
            ]
          ],
          "journalNumeric": [
            [
              "Afschrijvingskosten goodwill",
              18000,
              0
            ],
            [
              "Aan Goodwill",
              0,
              18000
            ]
          ],
          "why": "Goodwill is een balanspost. Deze vraag betreft de afzonderlijke winst-en-verliesrekeningconsolidatie."
        },
        {
          "journal": [
            [
              "Afschrijvingskosten goodwill",
              "€ 36.000",
              ""
            ],
            [
              "Aan Resultaat na belastingen",
              "",
              "€ 36.000"
            ]
          ],
          "journalNumeric": [
            [
              "Afschrijvingskosten goodwill",
              36000,
              0
            ],
            [
              "Aan Resultaat na belastingen",
              0,
              36000
            ]
          ],
          "why": "Alleen de afschrijving van het lopende boekjaar hoort in de winst-en-verliesrekening."
        },
        {
          "journal": [
            [
              "Resultaat na belastingen",
              "€ 18.000",
              ""
            ],
            [
              "Aan Afschrijvingskosten goodwill",
              "",
              "€ 18.000"
            ]
          ],
          "journalNumeric": [
            [
              "Resultaat na belastingen",
              18000,
              0
            ],
            [
              "Aan Afschrijvingskosten goodwill",
              0,
              18000
            ]
          ],
          "why": "Een kostenpost moet hier worden toegevoegd, niet teruggenomen."
        },
        {
          "journal": [
            [
              "Afschrijvingskosten goodwill",
              "€ 18.000",
              ""
            ],
            [
              "Aan Resultaat na belastingen",
              "",
              "€ 18.000"
            ]
          ],
          "journalNumeric": [
            [
              "Afschrijvingskosten goodwill",
              18000,
              0
            ],
            [
              "Aan Resultaat na belastingen",
              0,
              18000
            ]
          ],
          "why": ""
        }
      ],
      "correct": 3,
      "explanation": [
        "De jaarlast is € 90.000 ÷ 5 = € 18.000.",
        "De officiële consolidatiesystematiek debiteert afschrijvingskosten goodwill en crediteert resultaat na belastingen."
      ],
      "pattern": "Bij consolidatie houden balanseliminaties en resultaateliminaties elk hun eigen rekeningen.",
      "refs": [
        "orvelde",
        "basis"
      ],
      "related": [
        9,
        13,
        26
      ],
      "variant": true
    },
    {
      "id": 11,
      "stage": 2,
      "title": "De dividendopbrengst elimineren",
      "type": "Journaalpost",
      "intro": "Haven heeft in 2024 regulier dividend van Duin ontvangen.",
      "facts": [
        [
          "Belang Haven in Duin",
          "75%; Duin wordt integraal geconsolideerd."
        ],
        [
          "Enkelvoudige waardering",
          "Verkrijgingsprijs; geen bijzondere waardevermindering."
        ],
        [
          "Totaal dividend Duin",
          "€ 48.000 uit resultaten na verwerving."
        ],
        [
          "Enkelvoudige verwerking Haven",
          "Opbrengst deelneming is met € 36.000 gecrediteerd."
        ]
      ],
      "task": "Welke eliminatie hoort bij de geconsolideerde winst-en-verliesrekening over 2024?",
      "options": [
        {
          "journal": [
            [
              "Resultaat na belastingen",
              "€ 36.000",
              ""
            ],
            [
              "Aan Opbrengst deelneming Duin",
              "",
              "€ 36.000"
            ]
          ],
          "journalNumeric": [
            [
              "Resultaat na belastingen",
              36000,
              0
            ],
            [
              "Aan Opbrengst deelneming Duin",
              0,
              36000
            ]
          ],
          "why": "Dit zou de dividendopbrengst verhogen in plaats van elimineren."
        },
        {
          "journal": [
            [
              "Opbrengst deelneming Duin",
              "€ 36.000",
              ""
            ],
            [
              "Aan Deelneming Duin",
              "",
              "€ 36.000"
            ]
          ],
          "journalNumeric": [
            [
              "Opbrengst deelneming Duin",
              36000,
              0
            ],
            [
              "Aan Deelneming Duin",
              0,
              36000
            ]
          ],
          "why": "Deelneming is een balanspost en hoort niet in deze resultaateliminatie."
        },
        {
          "journal": [
            [
              "Opbrengst deelneming Duin",
              "€ 48.000",
              ""
            ],
            [
              "Aan Resultaat na belastingen",
              "",
              "€ 48.000"
            ]
          ],
          "journalNumeric": [
            [
              "Opbrengst deelneming Duin",
              48000,
              0
            ],
            [
              "Aan Resultaat na belastingen",
              0,
              48000
            ]
          ],
          "why": "Alleen het door Haven geboekte dividend moet uit de opbrengsten verdwijnen."
        },
        {
          "journal": [
            [
              "Opbrengst deelneming Duin",
              "€ 36.000",
              ""
            ],
            [
              "Aan Resultaat na belastingen",
              "",
              "€ 36.000"
            ]
          ],
          "journalNumeric": [
            [
              "Opbrengst deelneming Duin",
              36000,
              0
            ],
            [
              "Aan Resultaat na belastingen",
              0,
              36000
            ]
          ],
          "why": ""
        }
      ],
      "correct": 3,
      "explanation": [
        "Haven heeft enkelvoudig € 36.000 dividendopbrengst opgenomen.",
        "Die opbrengst wordt geëlimineerd, omdat de baten en lasten van Duin al integraal worden opgenomen."
      ],
      "pattern": "Verwijder het geboekte dividend bij de moeder, niet de totale uitkering van de dochter.",
      "refs": [
        "orvelde",
        "boit"
      ],
      "related": [
        5,
        12,
        13
      ],
      "variant": true
    },
    {
      "id": 12,
      "stage": 2,
      "title": "Het winstaandeel van derden",
      "type": "Journaalpost",
      "intro": "Duin wordt integraal in de winst-en-verliesrekening van Haven opgenomen.",
      "facts": [
        [
          "Belang Haven in Duin",
          "75%; Duin wordt integraal geconsolideerd."
        ],
        [
          "Enkelvoudige waardering",
          "Verkrijgingsprijs; geen bijzondere waardevermindering."
        ],
        [
          "Resultaat na belastingen Duin",
          "€ 160.000"
        ],
        [
          "Intercompanywinst",
          "Geen."
        ]
      ],
      "task": "Welke eliminatie geeft het aandeel derden in de winst weer?",
      "options": [
        {
          "journal": [
            [
              "Resultaat na belastingen",
              "€ 40.000",
              ""
            ],
            [
              "Aan Aandeel derden",
              "",
              "€ 40.000"
            ]
          ],
          "journalNumeric": [
            [
              "Resultaat na belastingen",
              40000,
              0
            ],
            [
              "Aan Aandeel derden",
              0,
              40000
            ]
          ],
          "why": "Deze richting past niet bij het afzonderlijk toerekenen van winst aan derden."
        },
        {
          "journal": [
            [
              "Aandeel derden",
              "€ 120.000",
              ""
            ],
            [
              "Aan Resultaat na belastingen",
              "",
              "€ 120.000"
            ]
          ],
          "journalNumeric": [
            [
              "Aandeel derden",
              120000,
              0
            ],
            [
              "Aan Resultaat na belastingen",
              0,
              120000
            ]
          ],
          "why": "€ 120.000 is het moederdeel van 75%; derden houden 25%."
        },
        {
          "journal": [
            [
              "Aandeel derden",
              "€ 40.000",
              ""
            ],
            [
              "Aan Resultaat na belastingen",
              "",
              "€ 40.000"
            ]
          ],
          "journalNumeric": [
            [
              "Aandeel derden",
              40000,
              0
            ],
            [
              "Aan Resultaat na belastingen",
              0,
              40000
            ]
          ],
          "why": ""
        },
        {
          "journal": [
            [
              "Belang derden",
              "€ 40.000",
              ""
            ],
            [
              "Aan Resultaat na belastingen",
              "",
              "€ 40.000"
            ]
          ],
          "journalNumeric": [
            [
              "Belang derden",
              40000,
              0
            ],
            [
              "Aan Resultaat na belastingen",
              0,
              40000
            ]
          ],
          "why": "Belang derden is de balanspost; in de winst-en-verliesrekening heet de post aandeel derden."
        }
      ],
      "correct": 2,
      "explanation": [
        "Derden hebben recht op 25% × € 160.000 = € 40.000."
      ],
      "pattern": "Gebruik het winstpercentage van derden; corrigeer later zo nodig voor hun aandeel in intercompanywinst.",
      "refs": [
        "orvelde",
        "basis"
      ],
      "related": [
        7,
        19,
        29
      ],
      "variant": true
    },
    {
      "id": 13,
      "stage": 2,
      "title": "Enkelvoudig naar geconsolideerd resultaat",
      "type": "Rekenvraag",
      "intro": "Haven waardeert Duin tegen verkrijgingsprijs en consolideert integraal.",
      "facts": [
        [
          "Belang Haven in Duin",
          "75%; Duin wordt integraal geconsolideerd."
        ],
        [
          "Enkelvoudige waardering",
          "Verkrijgingsprijs; geen bijzondere waardevermindering."
        ],
        [
          "Resultaat Haven na belastingen",
          "€ 250.000, inclusief € 36.000 regulier dividend van Duin."
        ],
        [
          "Resultaat Duin na belastingen",
          "€ 160.000"
        ],
        [
          "Afschrijving consolidatiegoodwill",
          "€ 18.000 in 2024; geen belastingeffect."
        ],
        [
          "Andere correcties",
          "Geen intercompanywinst of overige resultaatverschillen."
        ]
      ],
      "task": "Wat is het geconsolideerde resultaat na belastingen toekomend aan Haven?",
      "options": [
        {
          "lines": [
            "€ 250.000 + 75% × (€ 160.000 − € 36.000 − € 18.000)"
          ],
          "result": "€ 329.500",
          "why": "Ontvangen dividend en de gegeven goodwillafschrijving worden niet nogmaals met 75% vermenigvuldigd."
        },
        {
          "lines": [
            "€ 250.000 + 75% × € 160.000 − € 18.000"
          ],
          "result": "€ 352.000",
          "why": "Het dividend van € 36.000 staat al in het resultaat van Haven en moet worden geëlimineerd."
        },
        {
          "lines": [
            "€ 250.000 + 75% × € 160.000 − € 36.000 − € 18.000"
          ],
          "result": "€ 316.000",
          "why": "",
          "auditExpressions": [
            [
              "250000+.75*160000-36000-18000",
              316000
            ]
          ]
        },
        {
          "lines": [
            "€ 250.000 + 75% × € 160.000 − € 36.000 − 2 × € 18.000"
          ],
          "result": "€ 298.000",
          "why": "De afschrijving over eerdere jaren hoort niet in het resultaat 2024."
        }
      ],
      "correct": 2,
      "explanation": [
        "Begin bij het resultaat van Haven, tel haar aandeel in de winst van Duin erbij op en verwijder het reeds geboekte dividend.",
        "Trek vervolgens de afschrijving over het lopende jaar af. Het resultaat is € 316.000."
      ],
      "pattern": "Moederresultaat + winstaandeel dochters − dividendopbrengst − goodwillafschrijving, daarna eventuele intercompanycorrecties.",
      "refs": [
        "boit",
        "orvelde",
        "college"
      ],
      "related": [
        20,
        30
      ],
      "variant": true
    },
    {
      "id": 14,
      "stage": 2,
      "title": "Wel of geen interne correctie?",
      "type": "Theorie",
      "intro": "Haven en haar dochter Duin leveren goederen aan elkaar.",
      "facts": [
        [
          "Belang Haven in Duin",
          "75%; Duin wordt integraal geconsolideerd."
        ],
        [
          "Enkelvoudige waardering",
          "Verkrijgingsprijs; geen bijzondere waardevermindering."
        ],
        [
          "Intercompanywinst",
          "Een deel is per balansdatum nog niet gerealiseerd."
        ],
        [
          "Waardevermindering deelneming",
          "Niet aan de orde."
        ]
      ],
      "task": "Welke intracomptabele correctie maakt Haven voor de ongerealiseerde intercompanywinst bij deze waarderingsgrondslag?",
      "options": [
        {
          "text": "Geen intracomptabele winstcorrectie; de correctie wordt bij de consolidatie verwerkt.",
          "why": ""
        },
        {
          "text": "Alleen bij downstream wordt een overlopende passiefpost gevormd voor 75% van de winst.",
          "why": "De aangehaalde HK-opgave past geen intracomptabele intercompanycorrectie toe."
        },
        {
          "text": "Bij beide richtingen wordt 100% van de winst op de deelneming afgeboekt.",
          "why": "De deelneming wordt hier niet door zulke vermogensmutaties aangepast."
        },
        {
          "text": "Alleen bij upstream wordt resultaat deelneming tegen deelneming gecorrigeerd.",
          "why": "Dat is de vermogensmutatiesystematiek, niet de hier gebruikte verkrijgingsprijs."
        }
      ],
      "correct": 0,
      "explanation": [
        "In opgave Boit, vraag 3, luidt de uitwerking: geen intracomptabele correctie bij verkrijgingsprijs.",
        "De volledige groepscorrectie komt terug in de consolidatie; de verdeling verschilt bij upstream en downstream."
      ],
      "pattern": "Bij HK eerst vaststellen: interne correctie is niet van toepassing.",
      "refs": [
        "boit",
        "up",
        "down"
      ],
      "related": [
        15,
        21
      ],
      "variant": true
    },
    {
      "id": 15,
      "stage": 2,
      "title": "Upstream: de voorraadtabel",
      "type": "Voorraadtabel",
      "intro": "Haven verwerkt de volgende upstreamleveringen in de consolidatie.",
      "facts": [
        [
          "Belang Haven in Duin",
          "75%; Duin wordt integraal geconsolideerd."
        ],
        [
          "Enkelvoudige waardering",
          "Verkrijgingsprijs; geen bijzondere waardevermindering."
        ],
        [
          "Leveringsrichting",
          "Duin levert aan Haven; Haven verkoopt door aan derden."
        ],
        [
          "Voorraad bij Haven, afkomstig van Duin",
          "Begin boekjaar € 300.000; eind boekjaar € 240.000."
        ],
        [
          "Winstmarge Duin",
          "25% opslag op inkoopprijs, dus € 20 winst per € 100 verkoopprijs."
        ],
        [
          "Winstbelasting",
          "20%. De voorraadtabel toont bedragen vóór belasting."
        ]
      ],
      "task": "Welke voorraadtabel is juist?",
      "options": [
        {
          "table": {
            "headers": [
              "Datum",
              "Voorraad bij koper",
              "Niet-gerealiseerde intercompanywinst (100%)",
              "Interne correctie (75%)",
              "Eliminatie t.l.v. derden (25%)",
              "Eliminatie t.l.v. geconsolideerd resultaat (0%)"
            ],
            "rows": [
              [
                "Begin boekjaar",
                "€ 300.000",
                "€ 60.000",
                "€ 45.000",
                "€ 15.000",
                "€ 0"
              ],
              [
                "Eind boekjaar",
                "€ 240.000",
                "€ 48.000",
                "€ 36.000",
                "€ 12.000",
                "€ 0"
              ],
              [
                "Mutatie",
                "€ -60.000",
                "€ -12.000",
                "€ -9.000",
                "€ -3.000",
                "€ -0"
              ]
            ]
          },
          "why": "De interne correctie is bij verkrijgingsprijs niet van toepassing."
        },
        {
          "table": {
            "headers": [
              "Datum",
              "Voorraad bij koper",
              "Niet-gerealiseerde intercompanywinst (100%)",
              "Interne correctie (0%)",
              "Eliminatie t.l.v. derden (25%)",
              "Eliminatie t.l.v. geconsolideerd resultaat (75%)"
            ],
            "rows": [
              [
                "Begin boekjaar",
                "€ 300.000",
                "€ 75.000",
                "Niet van toepassing",
                "€ 18.750",
                "€ 56.250"
              ],
              [
                "Eind boekjaar",
                "€ 240.000",
                "€ 60.000",
                "Niet van toepassing",
                "€ 15.000",
                "€ 45.000"
              ],
              [
                "Mutatie",
                "€ -60.000",
                "€ -15.000",
                "Niet van toepassing",
                "€ -3.750",
                "€ -11.250"
              ]
            ]
          },
          "why": "25% opslag op kostprijs is 20% van de verkoopprijs."
        },
        {
          "table": {
            "headers": [
              "Datum",
              "Voorraad bij koper",
              "Niet-gerealiseerde intercompanywinst (100%)",
              "Interne correctie (0%)",
              "Eliminatie t.l.v. derden (25%)",
              "Eliminatie t.l.v. geconsolideerd resultaat (75%)"
            ],
            "rows": [
              [
                "Begin boekjaar",
                "€ 300.000",
                "€ 60.000",
                "Niet van toepassing",
                "€ 15.000",
                "€ 45.000"
              ],
              [
                "Eind boekjaar",
                "€ 240.000",
                "€ 48.000",
                "Niet van toepassing",
                "€ 12.000",
                "€ 36.000"
              ],
              [
                "Mutatie",
                "€ -60.000",
                "€ -12.000",
                "Niet van toepassing",
                "€ -3.000",
                "€ -9.000"
              ]
            ]
          },
          "why": ""
        },
        {
          "table": {
            "headers": [
              "Datum",
              "Voorraad bij koper",
              "Niet-gerealiseerde intercompanywinst (100%)",
              "Interne correctie (0%)",
              "Eliminatie t.l.v. derden (0%)",
              "Eliminatie t.l.v. geconsolideerd resultaat (100%)"
            ],
            "rows": [
              [
                "Begin boekjaar",
                "€ 300.000",
                "€ 60.000",
                "Niet van toepassing",
                "Niet van toepassing",
                "€ 60.000"
              ],
              [
                "Eind boekjaar",
                "€ 240.000",
                "€ 48.000",
                "Niet van toepassing",
                "Niet van toepassing",
                "€ 48.000"
              ],
              [
                "Mutatie",
                "€ -60.000",
                "€ -12.000",
                "Niet van toepassing",
                "Niet van toepassing",
                "€ -12.000"
              ]
            ]
          },
          "why": "Bij upstream draagt ook het 25%-belang van derden mee in de correctie."
        }
      ],
      "correct": 2,
      "explanation": [
        "De ongerealiseerde winst neemt af van € 60.000 naar € 48.000, een mutatie van −€ 12.000.",
        "Het moederdeel bedraagt 75%; derden dragen 25%. Er is geen interne correctie."
      ],
      "pattern": "Vóór belasting: verdeel upstreamwinst naar het belang in de verkopende dochter.",
      "refs": [
        "hoza",
        "boit"
      ],
      "related": [
        14,
        16,
        17,
        19
      ],
      "variant": true
    },
    {
      "id": 16,
      "stage": 3,
      "title": "Upstream: eindvoorraad eruit",
      "type": "Journaalpost",
      "intro": "Haven consolideert de upstreamleveringen van Duin.",
      "facts": [
        [
          "Belang Haven in Duin",
          "75%; Duin wordt integraal geconsolideerd."
        ],
        [
          "Enkelvoudige waardering",
          "Verkrijgingsprijs; geen bijzondere waardevermindering."
        ],
        [
          "Leveringsrichting",
          "Duin levert aan Haven; Haven verkoopt door aan derden."
        ],
        [
          "Voorraad bij Haven, afkomstig van Duin",
          "Begin boekjaar € 300.000; eind boekjaar € 240.000."
        ],
        [
          "Winstmarge Duin",
          "25% opslag op inkoopprijs, dus € 20 winst per € 100 verkoopprijs."
        ],
        [
          "Winstbelasting",
          "20%. De voorraadtabel toont bedragen vóór belasting."
        ]
      ],
      "task": "Welke balanseliminatie verwijdert uitsluitend de winst in de eindvoorraad? Laat de beginvoorraadcorrectie nog buiten beschouwing.",
      "options": [
        {
          "journal": [
            [
              "Resultaat boekjaar",
              "€ 36.000",
              ""
            ],
            [
              "Voorziening latente belastingen",
              "€ 9.000",
              ""
            ],
            [
              "Belang derden",
              "€ 12.000",
              ""
            ],
            [
              "Voorziening latente belastingen",
              "€ 3.000",
              ""
            ],
            [
              "Aan Voorraad",
              "",
              "€ 60.000"
            ]
          ],
          "journalNumeric": [
            [
              "Resultaat boekjaar",
              36000,
              0
            ],
            [
              "Voorziening latente belastingen",
              9000,
              0
            ],
            [
              "Belang derden",
              12000,
              0
            ],
            [
              "Voorziening latente belastingen",
              3000,
              0
            ],
            [
              "Aan Voorraad",
              0,
              60000
            ]
          ],
          "why": "Deze bedragen horen bij de beginvoorraad, niet bij de eindvoorraad."
        },
        {
          "journal": [
            [
              "Resultaat boekjaar",
              "€ 38.400",
              ""
            ],
            [
              "Voorziening latente belastingen",
              "€ 9.600",
              ""
            ],
            [
              "Aan Voorraad",
              "",
              "€ 48.000"
            ]
          ],
          "journalNumeric": [
            [
              "Resultaat boekjaar",
              38400,
              0
            ],
            [
              "Voorziening latente belastingen",
              9600,
              0
            ],
            [
              "Aan Voorraad",
              0,
              48000
            ]
          ],
          "why": "Je legt de gehele netto correctie bij de moeder; bij upstream moet ook derden worden gecorrigeerd."
        },
        {
          "journal": [
            [
              "Resultaat boekjaar",
              "€ 36.000",
              ""
            ],
            [
              "Belang derden",
              "€ 12.000",
              ""
            ],
            [
              "Aan Voorraad",
              "",
              "€ 48.000"
            ]
          ],
          "journalNumeric": [
            [
              "Resultaat boekjaar",
              36000,
              0
            ],
            [
              "Belang derden",
              12000,
              0
            ],
            [
              "Aan Voorraad",
              0,
              48000
            ]
          ],
          "why": "De belastinglatentie is vergeten."
        },
        {
          "journal": [
            [
              "Resultaat boekjaar",
              "€ 28.800",
              ""
            ],
            [
              "Voorziening latente belastingen",
              "€ 7.200",
              ""
            ],
            [
              "Belang derden",
              "€ 9.600",
              ""
            ],
            [
              "Voorziening latente belastingen",
              "€ 2.400",
              ""
            ],
            [
              "Aan Voorraad",
              "",
              "€ 48.000"
            ]
          ],
          "journalNumeric": [
            [
              "Resultaat boekjaar",
              28800,
              0
            ],
            [
              "Voorziening latente belastingen",
              7200,
              0
            ],
            [
              "Belang derden",
              9600,
              0
            ],
            [
              "Voorziening latente belastingen",
              2400,
              0
            ],
            [
              "Aan Voorraad",
              0,
              48000
            ]
          ],
          "why": ""
        }
      ],
      "correct": 3,
      "explanation": [
        "Eindwinst: € 240.000 × 20% = € 48.000.",
        "Moeder: 75% × € 48.000 = € 36.000 bruto, dus € 28.800 netto en € 7.200 belasting.",
        "Derden: 25% × € 48.000 = € 12.000 bruto, dus € 9.600 netto en € 2.400 belasting."
      ],
      "pattern": "Balans: eindstand volledig uit voorraad; splits de netto last en belasting per gerechtigde.",
      "refs": [
        "hoza",
        "up"
      ],
      "related": [
        15,
        17,
        22
      ],
      "variant": true
    },
    {
      "id": 17,
      "stage": 3,
      "title": "Upstream: de beginvoorraad invoegen",
      "type": "Journaalpost",
      "intro": "De eindvoorraadcorrectie is al als afzonderlijke eliminatie voorbereid.",
      "facts": [
        [
          "Belang Haven in Duin",
          "75%; Duin wordt integraal geconsolideerd."
        ],
        [
          "Enkelvoudige waardering",
          "Verkrijgingsprijs; geen bijzondere waardevermindering."
        ],
        [
          "Leveringsrichting",
          "Duin levert aan Haven; Haven verkoopt door aan derden."
        ],
        [
          "Voorraad bij Haven, afkomstig van Duin",
          "Begin boekjaar € 300.000; eind boekjaar € 240.000."
        ],
        [
          "Winstmarge Duin",
          "25% opslag op inkoopprijs, dus € 20 winst per € 100 verkoopprijs."
        ],
        [
          "Winstbelasting",
          "20%. De voorraadtabel toont bedragen vóór belasting."
        ]
      ],
      "task": "Welke aanvullende balanseliminatie verwerkt het moederdeel van de winst in de beginvoorraad?",
      "options": [
        {
          "journal": [
            [
              "Overige reserves",
              "€ 45.000",
              ""
            ],
            [
              "Aan Resultaat boekjaar",
              "",
              "€ 45.000"
            ]
          ],
          "journalNumeric": [
            [
              "Overige reserves",
              45000,
              0
            ],
            [
              "Aan Resultaat boekjaar",
              0,
              45000
            ]
          ],
          "why": "Het moederdeel van € 45.000 moet nog na 20% belasting worden bepaald."
        },
        {
          "journal": [
            [
              "Resultaat boekjaar",
              "€ 36.000",
              ""
            ],
            [
              "Aan Overige reserves",
              "",
              "€ 36.000"
            ]
          ],
          "journalNumeric": [
            [
              "Resultaat boekjaar",
              36000,
              0
            ],
            [
              "Aan Overige reserves",
              0,
              36000
            ]
          ],
          "why": "De winst uit de beginvoorraad moet in het resultaat boekjaar terugkomen; de richting is omgekeerd."
        },
        {
          "journal": [
            [
              "Overige reserves",
              "€ 48.000",
              ""
            ],
            [
              "Aan Resultaat boekjaar",
              "",
              "€ 48.000"
            ]
          ],
          "journalNumeric": [
            [
              "Overige reserves",
              48000,
              0
            ],
            [
              "Aan Resultaat boekjaar",
              0,
              48000
            ]
          ],
          "why": "Je gebruikt 100% in plaats van het moederdeel van 75%."
        },
        {
          "journal": [
            [
              "Overige reserves",
              "€ 36.000",
              ""
            ],
            [
              "Aan Resultaat boekjaar",
              "",
              "€ 36.000"
            ]
          ],
          "journalNumeric": [
            [
              "Overige reserves",
              36000,
              0
            ],
            [
              "Aan Resultaat boekjaar",
              0,
              36000
            ]
          ],
          "why": ""
        }
      ],
      "correct": 3,
      "explanation": [
        "Beginwinst bruto: € 300.000 × 20% = € 60.000.",
        "Moederdeel netto: € 60.000 × 75% × 80% = € 36.000.",
        "Overige reserves worden gedebiteerd en resultaat boekjaar wordt gecrediteerd."
      ],
      "pattern": "Invoegen beginvoorraad is een verschuiving tussen eerdere resultaten en het lopende boekjaar.",
      "refs": [
        "hoza",
        "boit"
      ],
      "related": [
        16,
        18,
        23
      ],
      "variant": true
    },
    {
      "id": 18,
      "stage": 3,
      "title": "Upstream: vrijval in het resultaat",
      "type": "Journaalpost",
      "intro": "De upstreamvoorraad neemt af. De eliminatie van doorgeleverde omzet en kostprijs is afzonderlijk geregeld.",
      "facts": [
        [
          "Belang Haven in Duin",
          "75%; Duin wordt integraal geconsolideerd."
        ],
        [
          "Enkelvoudige waardering",
          "Verkrijgingsprijs; geen bijzondere waardevermindering."
        ],
        [
          "Leveringsrichting",
          "Duin levert aan Haven; Haven verkoopt door aan derden."
        ],
        [
          "Voorraad bij Haven, afkomstig van Duin",
          "Begin boekjaar € 300.000; eind boekjaar € 240.000."
        ],
        [
          "Winstmarge Duin",
          "25% opslag op inkoopprijs, dus € 20 winst per € 100 verkoopprijs."
        ],
        [
          "Winstbelasting",
          "20%. De voorraadtabel toont bedragen vóór belasting."
        ]
      ],
      "task": "Welke winst-en-verliesrekeningeliminatie verwerkt uitsluitend de vrijval van € 12.000 intercompanywinst?",
      "options": [
        {
          "journal": [
            [
              "Resultaat na belastingen",
              "€ 9.000",
              ""
            ],
            [
              "Aandeel derden",
              "€ 3.000",
              ""
            ],
            [
              "Aan Kostprijs van de omzet",
              "",
              "€ 12.000"
            ]
          ],
          "journalNumeric": [
            [
              "Resultaat na belastingen",
              9000,
              0
            ],
            [
              "Aandeel derden",
              3000,
              0
            ],
            [
              "Aan Kostprijs van de omzet",
              0,
              12000
            ]
          ],
          "why": "De belastinglast moet afzonderlijk worden meegenomen."
        },
        {
          "journal": [
            [
              "Kostprijs van de omzet",
              "€ 12.000",
              ""
            ],
            [
              "Aan Resultaat na belastingen",
              "",
              "€ 7.200"
            ],
            [
              "Aan Belastinglast",
              "",
              "€ 1.800"
            ],
            [
              "Aan Aandeel derden",
              "",
              "€ 2.400"
            ],
            [
              "Aan Belastinglast",
              "",
              "€ 600"
            ]
          ],
          "journalNumeric": [
            [
              "Kostprijs van de omzet",
              12000,
              0
            ],
            [
              "Aan Resultaat na belastingen",
              0,
              7200
            ],
            [
              "Aan Belastinglast",
              0,
              1800
            ],
            [
              "Aan Aandeel derden",
              0,
              2400
            ],
            [
              "Aan Belastinglast",
              0,
              600
            ]
          ],
          "why": "Dit heeft het effect van een toename; bij afname wordt de kostprijs gecrediteerd."
        },
        {
          "journal": [
            [
              "Resultaat na belastingen",
              "€ 7.200",
              ""
            ],
            [
              "Belastinglast",
              "€ 1.800",
              ""
            ],
            [
              "Aandeel derden",
              "€ 2.400",
              ""
            ],
            [
              "Belastinglast",
              "€ 600",
              ""
            ],
            [
              "Aan Kostprijs van de omzet",
              "",
              "€ 12.000"
            ]
          ],
          "journalNumeric": [
            [
              "Resultaat na belastingen",
              7200,
              0
            ],
            [
              "Belastinglast",
              1800,
              0
            ],
            [
              "Aandeel derden",
              2400,
              0
            ],
            [
              "Belastinglast",
              600,
              0
            ],
            [
              "Aan Kostprijs van de omzet",
              0,
              12000
            ]
          ],
          "why": ""
        },
        {
          "journal": [
            [
              "Resultaat na belastingen",
              "€ 9.600",
              ""
            ],
            [
              "Belastinglast",
              "€ 2.400",
              ""
            ],
            [
              "Aan Kostprijs van de omzet",
              "",
              "€ 12.000"
            ]
          ],
          "journalNumeric": [
            [
              "Resultaat na belastingen",
              9600,
              0
            ],
            [
              "Belastinglast",
              2400,
              0
            ],
            [
              "Aan Kostprijs van de omzet",
              0,
              12000
            ]
          ],
          "why": "Je rekent de vrijval volledig aan de moeder toe; bij upstream deelt derden mee."
        }
      ],
      "correct": 2,
      "explanation": [
        "Vrijval netto: € 12.000 × 80% = € 9.600. Daarvan komt 75% = € 7.200 aan Haven toe en 25% = € 2.400 aan derden.",
        "Door de afname van ongerealiseerde winst wordt de kostprijs van de omzet voor € 12.000 gecrediteerd."
      ],
      "pattern": "Winstvrijval verhoogt het resultaat; bij upstream stijgt ook het winstaandeel van derden.",
      "refs": [
        "up",
        "boit",
        "orvelde"
      ],
      "related": [
        17,
        19,
        20,
        25
      ],
      "variant": true
    },
    {
      "id": 19,
      "stage": 3,
      "title": "Upstream: het uiteindelijke aandeel derden",
      "type": "Rekenvraag",
      "intro": "Duin levert aan Haven en wordt integraal geconsolideerd.",
      "facts": [
        [
          "Belang Haven in Duin",
          "75%; Duin wordt integraal geconsolideerd."
        ],
        [
          "Enkelvoudige waardering",
          "Verkrijgingsprijs; geen bijzondere waardevermindering."
        ],
        [
          "Leveringsrichting",
          "Duin levert aan Haven; Haven verkoopt door aan derden."
        ],
        [
          "Voorraad bij Haven, afkomstig van Duin",
          "Begin boekjaar € 300.000; eind boekjaar € 240.000."
        ],
        [
          "Winstmarge Duin",
          "25% opslag op inkoopprijs, dus € 20 winst per € 100 verkoopprijs."
        ],
        [
          "Winstbelasting",
          "20%. De voorraadtabel toont bedragen vóór belasting."
        ],
        [
          "Enkelvoudig resultaat Duin na belastingen",
          "€ 160.000."
        ]
      ],
      "task": "Welk aandeel derden komt na verwerking van de intercompanywinst in de geconsolideerde winst-en-verliesrekening?",
      "options": [
        {
          "lines": [
            "25% × [€ 160.000 + (€ 60.000 − € 48.000) × 80%]"
          ],
          "result": "€ 42.400",
          "why": "",
          "auditExpressions": [
            [
              ".25*(160000+(60000-48000)*.8)",
              42400
            ]
          ]
        },
        {
          "lines": [
            "25% × [€ 160.000 − (€ 60.000 − € 48.000) × 80%]"
          ],
          "result": "€ 37.600",
          "why": "Bij afname komt winst vrij; de correctie verhoogt het aandeel derden."
        },
        {
          "lines": [
            "25% × [€ 160.000 + (€ 60.000 − € 48.000)]"
          ],
          "result": "€ 43.000",
          "why": "Op de vrijval moet de belastinginvloed worden verwerkt."
        },
        {
          "lines": [
            "25% × [€ 160.000 − € 48.000 × 80%]"
          ],
          "result": "€ 30.400",
          "why": "De winst-en-verliesrekening gebruikt de mutatie, niet alleen de eindstand."
        }
      ],
      "correct": 0,
      "explanation": [
        "Zonder correctie is het aandeel derden 25% × € 160.000 = € 40.000.",
        "Hun aandeel in de vrijval is 25% × € 12.000 × 80% = € 2.400. Totaal € 42.400."
      ],
      "pattern": "Winst-en-verliesrekening: begin- naar eindstand. Balans: eindstand.",
      "refs": [
        "orvelde",
        "boit"
      ],
      "related": [
        12,
        18,
        29
      ],
      "variant": true
    },
    {
      "id": 20,
      "stage": 3,
      "title": "Het resultaat inclusief upstreamvrijval",
      "type": "Rekenvraag",
      "intro": "Haven stelt haar geconsolideerde resultaat op over 2024.",
      "facts": [
        [
          "Belang Haven in Duin",
          "75%; Duin wordt integraal geconsolideerd."
        ],
        [
          "Enkelvoudige waardering",
          "Verkrijgingsprijs; geen bijzondere waardevermindering."
        ],
        [
          "Leveringsrichting",
          "Duin levert aan Haven; Haven verkoopt door aan derden."
        ],
        [
          "Voorraad bij Haven, afkomstig van Duin",
          "Begin boekjaar € 300.000; eind boekjaar € 240.000."
        ],
        [
          "Winstmarge Duin",
          "25% opslag op inkoopprijs, dus € 20 winst per € 100 verkoopprijs."
        ],
        [
          "Winstbelasting",
          "20%. De voorraadtabel toont bedragen vóór belasting."
        ],
        [
          "Resultaat Haven na belasting",
          "€ 250.000, inclusief € 36.000 regulier dividend van Duin."
        ],
        [
          "Resultaat Duin na belasting",
          "€ 160.000"
        ],
        [
          "Afschrijving goodwill 2024",
          "€ 18.000; geen belastingeffect."
        ]
      ],
      "task": "Wat is het geconsolideerde resultaat na belastingen toekomend aan Haven?",
      "options": [
        {
          "lines": [
            "€ 250.000 + 75% × € 160.000 − € 36.000 − € 18.000 + 75% × € 12.000"
          ],
          "result": "€ 325.000",
          "why": "De belastinginvloed op de vrijval ontbreekt."
        },
        {
          "lines": [
            "€ 250.000 + 75% × € 160.000 − € 36.000 − € 18.000 + € 12.000 × 80%"
          ],
          "result": "€ 325.600",
          "why": "Bij upstream is slechts 75% van de netto vrijval voor de moeder."
        },
        {
          "lines": [
            "€ 250.000 + 75% × € 160.000 − € 36.000 − € 18.000 + 75% × € 12.000 × 80%"
          ],
          "result": "€ 323.200",
          "why": "",
          "auditExpressions": [
            [
              "250000+.75*160000-36000-18000+.75*12000*.8",
              323200
            ]
          ]
        },
        {
          "lines": [
            "€ 250.000 + 75% × € 160.000 − € 36.000 − € 18.000 − 75% × € 12.000 × 80%"
          ],
          "result": "€ 308.800",
          "why": "De voorraad neemt af; de correctie verhoogt het resultaat."
        }
      ],
      "correct": 2,
      "explanation": [
        "Zonder intercompanycorrectie is het resultaat € 316.000.",
        "Haven krijgt 75% van de netto vrijval van € 9.600, dus € 7.200 erbij. Totaal € 323.200."
      ],
      "pattern": "Voeg aan de gewone HK-aansluiting alleen het juiste netto moederdeel van de intercompanymutatie toe.",
      "refs": [
        "boit",
        "orvelde"
      ],
      "related": [
        13,
        18,
        30
      ],
      "variant": true
    },
    {
      "id": 21,
      "stage": 4,
      "title": "Downstream: andere verdeling",
      "type": "Voorraadtabel",
      "intro": "Haven levert goederen aan Duin in plaats van omgekeerd.",
      "facts": [
        [
          "Belang Haven in Duin",
          "75%; Duin wordt integraal geconsolideerd."
        ],
        [
          "Enkelvoudige waardering",
          "Verkrijgingsprijs; geen bijzondere waardevermindering."
        ],
        [
          "Leveringsrichting",
          "Haven levert aan Duin; Duin verkoopt door aan derden."
        ],
        [
          "Voorraad bij Duin, afkomstig van Haven",
          "Begin boekjaar € 180.000; eind boekjaar € 240.000."
        ],
        [
          "Winstmarge Haven",
          "20% van de verkoopprijs aan Duin."
        ],
        [
          "Winstbelasting",
          "20%. De voorraadtabel toont bedragen vóór belasting."
        ]
      ],
      "task": "Welke voorraadtabel is juist?",
      "options": [
        {
          "table": {
            "headers": [
              "Datum",
              "Voorraad bij koper",
              "Niet-gerealiseerde intercompanywinst (100%)",
              "Interne correctie (0%)",
              "Eliminatie t.l.v. derden (0%)",
              "Eliminatie t.l.v. geconsolideerd resultaat (100%)"
            ],
            "rows": [
              [
                "Begin boekjaar",
                "€ 180.000",
                "€ 36.000",
                "Niet van toepassing",
                "Niet van toepassing",
                "€ 36.000"
              ],
              [
                "Eind boekjaar",
                "€ 240.000",
                "€ 48.000",
                "Niet van toepassing",
                "Niet van toepassing",
                "€ 48.000"
              ],
              [
                "Mutatie",
                "€ 60.000",
                "€ 12.000",
                "Niet van toepassing",
                "Niet van toepassing",
                "€ 12.000"
              ]
            ]
          },
          "why": ""
        },
        {
          "table": {
            "headers": [
              "Datum",
              "Voorraad bij koper",
              "Niet-gerealiseerde intercompanywinst (100%)",
              "Interne correctie (75%)",
              "Eliminatie t.l.v. derden (0%)",
              "Eliminatie t.l.v. geconsolideerd resultaat (25%)"
            ],
            "rows": [
              [
                "Begin boekjaar",
                "€ 180.000",
                "€ 36.000",
                "€ 27.000",
                "Niet van toepassing",
                "€ 9.000"
              ],
              [
                "Eind boekjaar",
                "€ 240.000",
                "€ 48.000",
                "€ 36.000",
                "Niet van toepassing",
                "€ 12.000"
              ],
              [
                "Mutatie",
                "€ 60.000",
                "€ 12.000",
                "€ 9.000",
                "Niet van toepassing",
                "€ 3.000"
              ]
            ]
          },
          "why": "Bij verkrijgingsprijs is er geen interne correctie."
        },
        {
          "table": {
            "headers": [
              "Datum",
              "Voorraad bij koper",
              "Niet-gerealiseerde intercompanywinst (100%)",
              "Interne correctie (0%)",
              "Eliminatie t.l.v. derden (25%)",
              "Eliminatie t.l.v. geconsolideerd resultaat (75%)"
            ],
            "rows": [
              [
                "Begin boekjaar",
                "€ 180.000",
                "€ 36.000",
                "Niet van toepassing",
                "€ 9.000",
                "€ 27.000"
              ],
              [
                "Eind boekjaar",
                "€ 240.000",
                "€ 48.000",
                "Niet van toepassing",
                "€ 12.000",
                "€ 36.000"
              ],
              [
                "Mutatie",
                "€ 60.000",
                "€ 12.000",
                "Niet van toepassing",
                "€ 3.000",
                "€ 9.000"
              ]
            ]
          },
          "why": "Downstreamwinst wordt niet ten laste van derden geëlimineerd."
        },
        {
          "table": {
            "headers": [
              "Datum",
              "Voorraad bij koper",
              "Niet-gerealiseerde intercompanywinst (100%)",
              "Interne correctie (0%)",
              "Eliminatie t.l.v. derden (0%)",
              "Eliminatie t.l.v. geconsolideerd resultaat (75%)"
            ],
            "rows": [
              [
                "Begin boekjaar",
                "€ 180.000",
                "€ 36.000",
                "Niet van toepassing",
                "Niet van toepassing",
                "€ 27.000"
              ],
              [
                "Eind boekjaar",
                "€ 240.000",
                "€ 48.000",
                "Niet van toepassing",
                "Niet van toepassing",
                "€ 36.000"
              ],
              [
                "Mutatie",
                "€ 60.000",
                "€ 12.000",
                "Niet van toepassing",
                "Niet van toepassing",
                "€ 9.000"
              ]
            ]
          },
          "why": "De volledige downstreamwinst wordt geëlimineerd, niet alleen 75%."
        }
      ],
      "correct": 0,
      "explanation": [
        "Winst beginvoorraad: € 36.000. Winst eindvoorraad: € 48.000. Toename € 12.000.",
        "Bij verkrijgingsprijs is geen interne correctie van toepassing. De downstreamwinst komt volledig ten laste van het geconsolideerde resultaat van de moeder."
      ],
      "pattern": "Downstream HK: 0% intern, 0% derden en 100% ten laste van geconsolideerd resultaat.",
      "refs": [
        "schier",
        "boit",
        "down"
      ],
      "related": [
        14,
        15,
        22,
        24
      ],
      "variant": true
    },
    {
      "id": 22,
      "stage": 4,
      "title": "Downstream: de eindvoorraad",
      "type": "Journaalpost",
      "intro": "Haven consolideert haar leveringen aan Duin.",
      "facts": [
        [
          "Belang Haven in Duin",
          "75%; Duin wordt integraal geconsolideerd."
        ],
        [
          "Enkelvoudige waardering",
          "Verkrijgingsprijs; geen bijzondere waardevermindering."
        ],
        [
          "Leveringsrichting",
          "Haven levert aan Duin; Duin verkoopt door aan derden."
        ],
        [
          "Voorraad bij Duin, afkomstig van Haven",
          "Begin boekjaar € 180.000; eind boekjaar € 240.000."
        ],
        [
          "Winstmarge Haven",
          "20% van de verkoopprijs aan Duin."
        ],
        [
          "Winstbelasting",
          "20%. De voorraadtabel toont bedragen vóór belasting."
        ]
      ],
      "task": "Welke balanseliminatie verwijdert uitsluitend de winst uit de eindvoorraad?",
      "options": [
        {
          "journal": [
            [
              "Resultaat boekjaar",
              "€ 38.400",
              ""
            ],
            [
              "Voorziening latente belastingen",
              "€ 9.600",
              ""
            ],
            [
              "Aan Voorraad",
              "",
              "€ 48.000"
            ]
          ],
          "journalNumeric": [
            [
              "Resultaat boekjaar",
              38400,
              0
            ],
            [
              "Voorziening latente belastingen",
              9600,
              0
            ],
            [
              "Aan Voorraad",
              0,
              48000
            ]
          ],
          "why": ""
        },
        {
          "journal": [
            [
              "Resultaat boekjaar",
              "€ 28.800",
              ""
            ],
            [
              "Voorziening latente belastingen",
              "€ 7.200",
              ""
            ],
            [
              "Belang derden",
              "€ 9.600",
              ""
            ],
            [
              "Voorziening latente belastingen",
              "€ 2.400",
              ""
            ],
            [
              "Aan Voorraad",
              "",
              "€ 48.000"
            ]
          ],
          "journalNumeric": [
            [
              "Resultaat boekjaar",
              28800,
              0
            ],
            [
              "Voorziening latente belastingen",
              7200,
              0
            ],
            [
              "Belang derden",
              9600,
              0
            ],
            [
              "Voorziening latente belastingen",
              2400,
              0
            ],
            [
              "Aan Voorraad",
              0,
              48000
            ]
          ],
          "why": "Dit verdeelt de correctie zoals bij upstream, maar Haven is hier de verkoper."
        },
        {
          "journal": [
            [
              "Resultaat boekjaar",
              "€ 48.000",
              ""
            ],
            [
              "Aan Voorraad",
              "",
              "€ 48.000"
            ]
          ],
          "journalNumeric": [
            [
              "Resultaat boekjaar",
              48000,
              0
            ],
            [
              "Aan Voorraad",
              0,
              48000
            ]
          ],
          "why": "De belastinglatentie ontbreekt."
        },
        {
          "journal": [
            [
              "Resultaat boekjaar",
              "€ 28.800",
              ""
            ],
            [
              "Voorziening latente belastingen",
              "€ 7.200",
              ""
            ],
            [
              "Aan Voorraad",
              "",
              "€ 36.000"
            ]
          ],
          "journalNumeric": [
            [
              "Resultaat boekjaar",
              28800,
              0
            ],
            [
              "Voorziening latente belastingen",
              7200,
              0
            ],
            [
              "Aan Voorraad",
              0,
              36000
            ]
          ],
          "why": "Dit gebruikt de winst in de beginvoorraad; de eindwinst bedraagt € 48.000."
        }
      ],
      "correct": 0,
      "explanation": [
        "De gehele eindwinst van € 48.000 moet uit de voorraad.",
        "De netto correctie van € 38.400 komt voor rekening van de moeder; € 9.600 wordt als belastinglatentie verwerkt."
      ],
      "pattern": "De verkoper is de moeder, dus derden delen niet in deze downstreamcorrectie.",
      "refs": [
        "down",
        "boit"
      ],
      "related": [
        16,
        21,
        23
      ],
      "variant": true
    },
    {
      "id": 23,
      "stage": 4,
      "title": "Downstream: beginvoorraad terug",
      "type": "Journaalpost",
      "intro": "De winst in de eindvoorraad wordt apart geëlimineerd.",
      "facts": [
        [
          "Belang Haven in Duin",
          "75%; Duin wordt integraal geconsolideerd."
        ],
        [
          "Enkelvoudige waardering",
          "Verkrijgingsprijs; geen bijzondere waardevermindering."
        ],
        [
          "Leveringsrichting",
          "Haven levert aan Duin; Duin verkoopt door aan derden."
        ],
        [
          "Voorraad bij Duin, afkomstig van Haven",
          "Begin boekjaar € 180.000; eind boekjaar € 240.000."
        ],
        [
          "Winstmarge Haven",
          "20% van de verkoopprijs aan Duin."
        ],
        [
          "Winstbelasting",
          "20%. De voorraadtabel toont bedragen vóór belasting."
        ]
      ],
      "task": "Welke aanvullende balanseliminatie verwerkt de winst in de beginvoorraad?",
      "options": [
        {
          "journal": [
            [
              "Overige reserves",
              "€ 28.800",
              ""
            ],
            [
              "Aan Resultaat boekjaar",
              "",
              "€ 28.800"
            ]
          ],
          "journalNumeric": [
            [
              "Overige reserves",
              28800,
              0
            ],
            [
              "Aan Resultaat boekjaar",
              0,
              28800
            ]
          ],
          "why": ""
        },
        {
          "journal": [
            [
              "Overige reserves",
              "€ 36.000",
              ""
            ],
            [
              "Aan Resultaat boekjaar",
              "",
              "€ 36.000"
            ]
          ],
          "journalNumeric": [
            [
              "Overige reserves",
              36000,
              0
            ],
            [
              "Aan Resultaat boekjaar",
              0,
              36000
            ]
          ],
          "why": "De beginwinst moet na belasting worden ingevoegd."
        },
        {
          "journal": [
            [
              "Resultaat boekjaar",
              "€ 28.800",
              ""
            ],
            [
              "Aan Overige reserves",
              "",
              "€ 28.800"
            ]
          ],
          "journalNumeric": [
            [
              "Resultaat boekjaar",
              28800,
              0
            ],
            [
              "Aan Overige reserves",
              0,
              28800
            ]
          ],
          "why": "De richting is omgekeerd; de oude winst moet naar het lopende resultaat worden verschoven."
        },
        {
          "journal": [
            [
              "Overige reserves",
              "€ 21.600",
              ""
            ],
            [
              "Aan Resultaat boekjaar",
              "",
              "€ 21.600"
            ]
          ],
          "journalNumeric": [
            [
              "Overige reserves",
              21600,
              0
            ],
            [
              "Aan Resultaat boekjaar",
              0,
              21600
            ]
          ],
          "why": "Je gebruikt 75% van de netto beginwinst; downstream HK komt volledig voor rekening van de moeder."
        }
      ],
      "correct": 0,
      "explanation": [
        "Netto beginwinst: € 180.000 × 20% × 80% = € 28.800.",
        "De gehele netto beginwinst gaat van overige reserves naar resultaat boekjaar."
      ],
      "pattern": "Ook bij het invoegen van de beginvoorraad blijft downstream volledig voor rekening van de moeder.",
      "refs": [
        "boit",
        "down"
      ],
      "related": [
        17,
        22,
        24
      ],
      "variant": true
    },
    {
      "id": 24,
      "stage": 4,
      "title": "Downstream: doorlevering en voorraadgroei",
      "type": "Journaalpost",
      "intro": "De winst-en-verliesrekening wordt in twee delen gecorrigeerd: doorlevering en toename voorraad.",
      "facts": [
        [
          "Belang Haven in Duin",
          "75%; Duin wordt integraal geconsolideerd."
        ],
        [
          "Enkelvoudige waardering",
          "Verkrijgingsprijs; geen bijzondere waardevermindering."
        ],
        [
          "Leveringsrichting",
          "Haven levert aan Duin; Duin verkoopt door aan derden."
        ],
        [
          "Voorraad bij Duin, afkomstig van Haven",
          "Begin boekjaar € 180.000; eind boekjaar € 240.000."
        ],
        [
          "Winstmarge Haven",
          "20% van de verkoopprijs aan Duin."
        ],
        [
          "Winstbelasting",
          "20%. De voorraadtabel toont bedragen vóór belasting."
        ],
        [
          "Leveringen Haven aan Duin in 2024",
          "€ 900.000 tegen onderlinge verkoopprijs."
        ]
      ],
      "task": "Welke combinatie van winst-en-verliesrekeningeliminaties is juist?",
      "options": [
        {
          "journals": [
            {
              "journal": [
                [
                  "Omzet",
                  "€ 900.000",
                  ""
                ],
                [
                  "Aan Kostprijs van de omzet",
                  "",
                  "€ 900.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Omzet",
                  900000,
                  0
                ],
                [
                  "Aan Kostprijs van de omzet",
                  0,
                  900000
                ]
              ],
              "why": "",
              "caption": "Doorlevering"
            },
            {
              "journal": [
                [
                  "Omzet",
                  "€ 60.000",
                  ""
                ],
                [
                  "Aan Kostprijs van de omzet",
                  "",
                  "€ 48.000"
                ],
                [
                  "Aan Resultaat na belastingen",
                  "",
                  "€ 9.600"
                ],
                [
                  "Aan Belastinglast",
                  "",
                  "€ 2.400"
                ]
              ],
              "journalNumeric": [
                [
                  "Omzet",
                  60000,
                  0
                ],
                [
                  "Aan Kostprijs van de omzet",
                  0,
                  48000
                ],
                [
                  "Aan Resultaat na belastingen",
                  0,
                  9600
                ],
                [
                  "Aan Belastinglast",
                  0,
                  2400
                ]
              ],
              "why": "",
              "caption": "Toename voorraad"
            }
          ],
          "why": "De toename van € 60.000 is dubbel in de omzeteliminatie opgenomen."
        },
        {
          "journals": [
            {
              "journal": [
                [
                  "Omzet",
                  "€ 840.000",
                  ""
                ],
                [
                  "Aan Kostprijs van de omzet",
                  "",
                  "€ 840.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Omzet",
                  840000,
                  0
                ],
                [
                  "Aan Kostprijs van de omzet",
                  0,
                  840000
                ]
              ],
              "why": "",
              "caption": "Doorlevering"
            },
            {
              "journal": [
                [
                  "Omzet",
                  "€ 60.000",
                  ""
                ],
                [
                  "Aan Kostprijs van de omzet",
                  "",
                  "€ 48.000"
                ],
                [
                  "Aan Resultaat na belastingen",
                  "",
                  "€ 9.600"
                ],
                [
                  "Aan Belastinglast",
                  "",
                  "€ 2.400"
                ]
              ],
              "journalNumeric": [
                [
                  "Omzet",
                  60000,
                  0
                ],
                [
                  "Aan Kostprijs van de omzet",
                  0,
                  48000
                ],
                [
                  "Aan Resultaat na belastingen",
                  0,
                  9600
                ],
                [
                  "Aan Belastinglast",
                  0,
                  2400
                ]
              ],
              "why": "",
              "caption": "Toename voorraad"
            }
          ],
          "why": ""
        },
        {
          "journals": [
            {
              "journal": [
                [
                  "Omzet",
                  "€ 840.000",
                  ""
                ],
                [
                  "Aan Kostprijs van de omzet",
                  "",
                  "€ 840.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Omzet",
                  840000,
                  0
                ],
                [
                  "Aan Kostprijs van de omzet",
                  0,
                  840000
                ]
              ],
              "why": "",
              "caption": "Doorlevering"
            },
            {
              "journal": [
                [
                  "Omzet",
                  "€ 60.000",
                  ""
                ],
                [
                  "Aan Kostprijs van de omzet",
                  "",
                  "€ 48.000"
                ],
                [
                  "Aan Resultaat na belastingen",
                  "",
                  "€ 7.200"
                ],
                [
                  "Aan Aandeel derden",
                  "",
                  "€ 2.400"
                ],
                [
                  "Aan Belastinglast",
                  "",
                  "€ 2.400"
                ]
              ],
              "journalNumeric": [
                [
                  "Omzet",
                  60000,
                  0
                ],
                [
                  "Aan Kostprijs van de omzet",
                  0,
                  48000
                ],
                [
                  "Aan Resultaat na belastingen",
                  0,
                  7200
                ],
                [
                  "Aan Aandeel derden",
                  0,
                  2400
                ],
                [
                  "Aan Belastinglast",
                  0,
                  2400
                ]
              ],
              "why": "",
              "caption": "Toename voorraad"
            }
          ],
          "why": "Bij downstream deelt derden niet in de eliminatie van de winst van de moeder."
        },
        {
          "journals": [
            {
              "journal": [
                [
                  "Omzet",
                  "€ 852.000",
                  ""
                ],
                [
                  "Aan Kostprijs van de omzet",
                  "",
                  "€ 852.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Omzet",
                  852000,
                  0
                ],
                [
                  "Aan Kostprijs van de omzet",
                  0,
                  852000
                ]
              ],
              "why": "",
              "caption": "Doorlevering"
            },
            {
              "journal": [
                [
                  "Omzet",
                  "€ 48.000",
                  ""
                ],
                [
                  "Aan Kostprijs van de omzet",
                  "",
                  "€ 38.400"
                ],
                [
                  "Aan Resultaat na belastingen",
                  "",
                  "€ 7.680"
                ],
                [
                  "Aan Belastinglast",
                  "",
                  "€ 1.920"
                ]
              ],
              "journalNumeric": [
                [
                  "Omzet",
                  48000,
                  0
                ],
                [
                  "Aan Kostprijs van de omzet",
                  0,
                  38400
                ],
                [
                  "Aan Resultaat na belastingen",
                  0,
                  7680
                ],
                [
                  "Aan Belastinglast",
                  0,
                  1920
                ]
              ],
              "why": "",
              "caption": "Toename voorraad"
            }
          ],
          "why": "De voorraadgroei wordt eerst tegen de onderlinge verkoopprijs bepaald: € 60.000, niet € 48.000."
        }
      ],
      "correct": 1,
      "explanation": [
        "Voorraadtoename tegen onderlinge prijs: € 240.000 − € 180.000 = € 60.000.",
        "Doorlevering: € 900.000 − € 60.000 = € 840.000.",
        "Voorraadgroei bestaat uit kostprijs € 48.000 en winst € 12.000. De winst wordt gesplitst in € 9.600 netto en € 2.400 belasting."
      ],
      "pattern": "Bij voorraadgroei: trek de voorraadmutatie eerst af van de onderlinge omzet voor het doorgeleverde deel.",
      "refs": [
        "schier",
        "down"
      ],
      "related": [
        21,
        23,
        25
      ],
      "variant": true
    },
    {
      "id": 25,
      "stage": 4,
      "title": "Downstream: een jaar later",
      "type": "Journaalpost",
      "intro": "De downstreamvoorraad neemt nu af.",
      "facts": [
        [
          "Belang Haven in Duin",
          "75%; Duin wordt integraal geconsolideerd."
        ],
        [
          "Enkelvoudige waardering",
          "Verkrijgingsprijs; geen bijzondere waardevermindering."
        ],
        [
          "Leveringsrichting",
          "Haven levert aan Duin."
        ],
        [
          "Voorraad tegen onderlinge prijs",
          "Begin 2025 € 240.000; eind 2025 € 180.000."
        ],
        [
          "Winstmarge Haven",
          "20% van de onderlinge verkoopprijs."
        ],
        [
          "Winstbelasting",
          "20%."
        ],
        [
          "Overige eliminaties",
          "De onderlinge omzet is afzonderlijk geëlimineerd."
        ]
      ],
      "task": "Welke winst-en-verliesrekeningeliminatie betreft uitsluitend de vrijval van de intercompanywinst?",
      "options": [
        {
          "journal": [
            [
              "Resultaat na belastingen",
              "€ 9.600",
              ""
            ],
            [
              "Belastinglast",
              "€ 2.400",
              ""
            ],
            [
              "Aan Kostprijs van de omzet",
              "",
              "€ 12.000"
            ]
          ],
          "journalNumeric": [
            [
              "Resultaat na belastingen",
              9600,
              0
            ],
            [
              "Belastinglast",
              2400,
              0
            ],
            [
              "Aan Kostprijs van de omzet",
              0,
              12000
            ]
          ],
          "why": ""
        },
        {
          "journal": [
            [
              "Resultaat na belastingen",
              "€ 7.200",
              ""
            ],
            [
              "Belastinglast",
              "€ 1.800",
              ""
            ],
            [
              "Aan Kostprijs van de omzet",
              "",
              "€ 9.000"
            ]
          ],
          "journalNumeric": [
            [
              "Resultaat na belastingen",
              7200,
              0
            ],
            [
              "Belastinglast",
              1800,
              0
            ],
            [
              "Aan Kostprijs van de omzet",
              0,
              9000
            ]
          ],
          "why": "Je corrigeert slechts 75% van de downstreammutatie."
        },
        {
          "journal": [
            [
              "Resultaat na belastingen",
              "€ 7.200",
              ""
            ],
            [
              "Aandeel derden",
              "€ 2.400",
              ""
            ],
            [
              "Belastinglast",
              "€ 2.400",
              ""
            ],
            [
              "Aan Kostprijs van de omzet",
              "",
              "€ 12.000"
            ]
          ],
          "journalNumeric": [
            [
              "Resultaat na belastingen",
              7200,
              0
            ],
            [
              "Aandeel derden",
              2400,
              0
            ],
            [
              "Belastinglast",
              2400,
              0
            ],
            [
              "Aan Kostprijs van de omzet",
              0,
              12000
            ]
          ],
          "why": "Derden delen niet in de vrijval van downstreamwinst."
        },
        {
          "journal": [
            [
              "Kostprijs van de omzet",
              "€ 12.000",
              ""
            ],
            [
              "Aan Resultaat na belastingen",
              "",
              "€ 9.600"
            ],
            [
              "Aan Belastinglast",
              "",
              "€ 2.400"
            ]
          ],
          "journalNumeric": [
            [
              "Kostprijs van de omzet",
              12000,
              0
            ],
            [
              "Aan Resultaat na belastingen",
              0,
              9600
            ],
            [
              "Aan Belastinglast",
              0,
              2400
            ]
          ],
          "why": "Dit verlaagt de winst; bij afname van ongerealiseerde winst hoort winstvrijval."
        }
      ],
      "correct": 0,
      "explanation": [
        "Winstvrijval: (€ 240.000 − € 180.000) × 20% = € 12.000.",
        "Deze vrijval komt volledig bij de moeder: € 9.600 netto en € 2.400 belasting."
      ],
      "pattern": "Bij afname blijft de onderlinge omzeteliminatie apart; de vrijval gaat via een credit op kostprijs.",
      "refs": [
        "boit",
        "down"
      ],
      "related": [
        18,
        24,
        30
      ],
      "variant": true
    },
    {
      "id": 26,
      "stage": 5,
      "title": "Twee aankopen, twee afschrijvingstermijnen",
      "type": "Rekenvraag",
      "intro": "Kade verwerft haar belang in Zand in twee stappen.",
      "facts": [
        [
          "Eerste aankoop",
          "20% op 1 januari 2022 voor € 370.000. Eigen vermogen op dat moment € 1.400.000."
        ],
        [
          "Tweede aankoop",
          "40% extra op 1 oktober 2024 voor € 900.000. Eigen vermogen op dat moment € 1.800.000."
        ],
        [
          "Waardering en consolidatie",
          "Beide belangen tegen verkrijgingsprijs; de 60%-deelneming wordt integraal geconsolideerd."
        ],
        [
          "Goodwill",
          "Iedere tranche wordt vanaf haar eigen verkrijgingsdatum in vijf jaar lineair afgeschreven. Over delen van een jaar naar tijdsgelang."
        ],
        [
          "Overige verschillen",
          "Geen fair value-correcties; geen belastingeffect goodwill."
        ]
      ],
      "task": "Welke combinatie geeft de goodwillafschrijving over 2024 en de goodwill op de balans per 31 december 2024?",
      "options": [
        {
          "lines": [
            "Afschrijving 2024: € 90.000 ÷ 5 + € 180.000 ÷ 5 × 3/12 = € 27.000",
            "Balans: € 90.000 − 2 × € 18.000 + € 180.000 − € 9.000 = € 225.000"
          ],
          "result": "Jaarlast € 27.000; balans € 225.000",
          "why": "In deze balansberekening ontbreekt de afschrijving van de eerste tranche over 2024."
        },
        {
          "lines": [
            "Goodwill eerste aankoop: € 370.000 − 20% × € 1.400.000 = € 90.000",
            "Goodwill tweede aankoop: € 900.000 − 40% × € 1.800.000 = € 180.000",
            "Afschrijving 2024: € 90.000 ÷ 5 + € 180.000 ÷ 5 × 3/12 = € 27.000",
            "Balans: (€ 90.000 − 3 × € 18.000) + (€ 180.000 − € 9.000) = € 207.000"
          ],
          "result": "Jaarlast € 27.000; balans € 207.000",
          "why": "",
          "auditExpressions": [
            [
              "90000/5+180000/5*3/12",
              27000
            ],
            [
              "90000-3*18000+180000-9000",
              207000
            ]
          ]
        },
        {
          "lines": [
            "Afschrijving 2024: (€ 90.000 + € 180.000) ÷ 5 × 3/12 = € 13.500",
            "Balans: € 90.000 − 2 × € 18.000 + € 180.000 − € 13.500 = € 220.500"
          ],
          "result": "Jaarlast € 13.500; balans € 220.500",
          "why": "De eerste tranche loopt al het hele boekjaar mee."
        },
        {
          "lines": [
            "Afschrijving 2024: € 90.000 ÷ 5 + € 180.000 ÷ 5 = € 54.000",
            "Balans: € 90.000 − 3 × € 18.000 + € 180.000 − € 36.000 = € 180.000"
          ],
          "result": "Jaarlast € 54.000; balans € 180.000",
          "why": "De tweede aankoop is pas op 1 oktober gedaan."
        }
      ],
      "correct": 1,
      "explanation": [
        "Eerste tranche: goodwill € 90.000, jaarafschrijving € 18.000 en drie jaren afschrijving t/m 2024.",
        "Tweede tranche: goodwill € 180.000; in 2024 drie maanden afschrijving, dus € 9.000.",
        "Jaarlast € 27.000. De balans bevat € 36.000 + € 171.000 = € 207.000."
      ],
      "pattern": "Bereken per aankoop afzonderlijk goodwill, tijdsevenredige jaarlast en resterende looptijd.",
      "refs": [
        "schier"
      ],
      "related": [
        8,
        10,
        27
      ],
      "variant": true
    },
    {
      "id": 27,
      "stage": 5,
      "title": "De twee verkrijgingsmomenten elimineren",
      "type": "Journaalpost",
      "intro": "Kade stelt de balansconsolidatie per 31 december 2024 op.",
      "facts": [
        [
          "Eerste aankoop op 1 januari 2022",
          "20% voor € 370.000; goodwill € 90.000."
        ],
        [
          "Vermogen bij de eerste aankoop",
          "Aandelenkapitaal € 500.000; overige reserves € 700.000; resultaat 2021 € 200.000."
        ],
        [
          "Meegekocht dividend uit resultaat 2021",
          "Zand keert € 100.000 uit; Kade ontvangt € 20.000 en verlaagt haar deelneming daarmee. Het resterende resultaat 2021 gaat naar overige reserves."
        ],
        [
          "Tweede aankoop op 1 oktober 2024",
          "40% extra voor € 900.000; goodwill € 180.000."
        ],
        [
          "Vermogen bij tweede aankoop",
          "Aandelenkapitaal € 500.000; overige reserves € 1.100.000; resultaat 2024 t/m aankoop € 200.000."
        ],
        [
          "Enkelvoudige waardering",
          "Verkrijgingsprijs. Boekwaarde eerste tranche € 350.000; tweede tranche € 900.000."
        ]
      ],
      "task": "Welke eliminaties betreffen uitsluitend de twee aankopen en activering van goodwill? Laat goodwillafschrijving en belang derden buiten beschouwing.",
      "options": [
        {
          "journals": [
            {
              "journal": [
                [
                  "Aandelenkapitaal Zand",
                  "€ 100.000",
                  ""
                ],
                [
                  "Overige reserves Zand",
                  "€ 180.000",
                  ""
                ],
                [
                  "Goodwill",
                  "€ 70.000",
                  ""
                ],
                [
                  "Aan Deelneming Zand",
                  "",
                  "€ 350.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Aandelenkapitaal Zand",
                  100000,
                  0
                ],
                [
                  "Overige reserves Zand",
                  180000,
                  0
                ],
                [
                  "Goodwill",
                  70000,
                  0
                ],
                [
                  "Aan Deelneming Zand",
                  0,
                  350000
                ]
              ],
              "why": "",
              "caption": "Aankoop 20%"
            },
            {
              "journal": [
                [
                  "Aandelenkapitaal Zand",
                  "€ 200.000",
                  ""
                ],
                [
                  "Overige reserves Zand",
                  "€ 440.000",
                  ""
                ],
                [
                  "Resultaat boekjaar Zand",
                  "€ 80.000",
                  ""
                ],
                [
                  "Goodwill",
                  "€ 180.000",
                  ""
                ],
                [
                  "Aan Deelneming Zand",
                  "",
                  "€ 900.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Aandelenkapitaal Zand",
                  200000,
                  0
                ],
                [
                  "Overige reserves Zand",
                  440000,
                  0
                ],
                [
                  "Resultaat boekjaar Zand",
                  80000,
                  0
                ],
                [
                  "Goodwill",
                  180000,
                  0
                ],
                [
                  "Aan Deelneming Zand",
                  0,
                  900000
                ]
              ],
              "why": "",
              "caption": "Aankoop 40%"
            }
          ],
          "why": "Het meegekochte dividend verlaagt de relevante reserves, niet de historische goodwill."
        },
        {
          "journals": [
            {
              "journal": [
                [
                  "Aandelenkapitaal Zand",
                  "€ 100.000",
                  ""
                ],
                [
                  "Overige reserves Zand",
                  "€ 180.000",
                  ""
                ],
                [
                  "Goodwill",
                  "€ 90.000",
                  ""
                ],
                [
                  "Aan Deelneming Zand",
                  "",
                  "€ 370.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Aandelenkapitaal Zand",
                  100000,
                  0
                ],
                [
                  "Overige reserves Zand",
                  180000,
                  0
                ],
                [
                  "Goodwill",
                  90000,
                  0
                ],
                [
                  "Aan Deelneming Zand",
                  0,
                  370000
                ]
              ],
              "why": "",
              "caption": "Aankoop 20%"
            },
            {
              "journal": [
                [
                  "Aandelenkapitaal Zand",
                  "€ 200.000",
                  ""
                ],
                [
                  "Overige reserves Zand",
                  "€ 440.000",
                  ""
                ],
                [
                  "Resultaat boekjaar Zand",
                  "€ 80.000",
                  ""
                ],
                [
                  "Goodwill",
                  "€ 180.000",
                  ""
                ],
                [
                  "Aan Deelneming Zand",
                  "",
                  "€ 900.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Aandelenkapitaal Zand",
                  200000,
                  0
                ],
                [
                  "Overige reserves Zand",
                  440000,
                  0
                ],
                [
                  "Resultaat boekjaar Zand",
                  80000,
                  0
                ],
                [
                  "Goodwill",
                  180000,
                  0
                ],
                [
                  "Aan Deelneming Zand",
                  0,
                  900000
                ]
              ],
              "why": "",
              "caption": "Aankoop 40%"
            }
          ],
          "why": "Het meegekochte dividend van € 20.000 is al afgeboekt van de eerste tranche."
        },
        {
          "journals": [
            {
              "journal": [
                [
                  "Aandelenkapitaal Zand",
                  "€ 100.000",
                  ""
                ],
                [
                  "Overige reserves Zand",
                  "€ 160.000",
                  ""
                ],
                [
                  "Goodwill",
                  "€ 90.000",
                  ""
                ],
                [
                  "Aan Deelneming Zand",
                  "",
                  "€ 350.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Aandelenkapitaal Zand",
                  100000,
                  0
                ],
                [
                  "Overige reserves Zand",
                  160000,
                  0
                ],
                [
                  "Goodwill",
                  90000,
                  0
                ],
                [
                  "Aan Deelneming Zand",
                  0,
                  350000
                ]
              ],
              "why": "",
              "caption": "Aankoop 20%"
            },
            {
              "journal": [
                [
                  "Aandelenkapitaal Zand",
                  "€ 200.000",
                  ""
                ],
                [
                  "Overige reserves Zand",
                  "€ 440.000",
                  ""
                ],
                [
                  "Resultaat boekjaar Zand",
                  "€ 80.000",
                  ""
                ],
                [
                  "Goodwill",
                  "€ 180.000",
                  ""
                ],
                [
                  "Aan Deelneming Zand",
                  "",
                  "€ 900.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Aandelenkapitaal Zand",
                  200000,
                  0
                ],
                [
                  "Overige reserves Zand",
                  440000,
                  0
                ],
                [
                  "Resultaat boekjaar Zand",
                  80000,
                  0
                ],
                [
                  "Goodwill",
                  180000,
                  0
                ],
                [
                  "Aan Deelneming Zand",
                  0,
                  900000
                ]
              ],
              "why": "",
              "caption": "Aankoop 40%"
            }
          ],
          "why": ""
        },
        {
          "journals": [
            {
              "journal": [
                [
                  "Aandelenkapitaal Zand",
                  "€ 100.000",
                  ""
                ],
                [
                  "Overige reserves Zand",
                  "€ 160.000",
                  ""
                ],
                [
                  "Goodwill",
                  "€ 90.000",
                  ""
                ],
                [
                  "Aan Deelneming Zand",
                  "",
                  "€ 350.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Aandelenkapitaal Zand",
                  100000,
                  0
                ],
                [
                  "Overige reserves Zand",
                  160000,
                  0
                ],
                [
                  "Goodwill",
                  90000,
                  0
                ],
                [
                  "Aan Deelneming Zand",
                  0,
                  350000
                ]
              ],
              "why": "",
              "caption": "Aankoop 20%"
            },
            {
              "journal": [
                [
                  "Aandelenkapitaal Zand",
                  "€ 200.000",
                  ""
                ],
                [
                  "Overige reserves Zand",
                  "€ 520.000",
                  ""
                ],
                [
                  "Goodwill",
                  "€ 180.000",
                  ""
                ],
                [
                  "Aan Deelneming Zand",
                  "",
                  "€ 900.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Aandelenkapitaal Zand",
                  200000,
                  0
                ],
                [
                  "Overige reserves Zand",
                  520000,
                  0
                ],
                [
                  "Goodwill",
                  180000,
                  0
                ],
                [
                  "Aan Deelneming Zand",
                  0,
                  900000
                ]
              ],
              "why": "",
              "caption": "Aankoop 40%"
            }
          ],
          "why": "Het resultaat tot 1 oktober 2024 behoort nog tot resultaat boekjaar, niet tot overige reserves per eind 2024."
        }
      ],
      "correct": 2,
      "explanation": [
        "Eerste tranche: 20% × [€ 700.000 + (€ 200.000 − € 100.000)] = € 160.000 overige reserves. Samen met € 100.000 kapitaal en € 90.000 goodwill: € 350.000.",
        "Tweede tranche: € 200.000 kapitaal + € 440.000 reserves + € 80.000 resultaat boekjaar + € 180.000 goodwill = € 900.000."
      ],
      "pattern": "Elke aankoop houdt een eigen verkrijgingsbasis. Een vóór verkrijging behaalde winst in het lopende boekjaar wordt daar afzonderlijk geëlimineerd.",
      "refs": [
        "schier",
        "hoza"
      ],
      "related": [
        4,
        6,
        26
      ],
      "variant": true
    },
    {
      "id": 28,
      "stage": 5,
      "title": "Eindcasus: de geconsolideerde voorraad",
      "type": "Rekenvraag",
      "intro": "Moer heeft twee dochters met verschillende goederenstromen.",
      "facts": [
        [
          "Belangen en grondslag",
          "Moer bezit 80% van Delta en 70% van Eko, beide tegen verkrijgingsprijs. Beide dochters worden integraal geconsolideerd."
        ],
        [
          "Upstream: Delta → Moer",
          "Winst beginvoorraad € 50.000; winst eindvoorraad € 70.000, vóór belasting."
        ],
        [
          "Downstream: Moer → Eko",
          "Winst beginvoorraad € 80.000; winst eindvoorraad € 60.000, vóór belasting."
        ],
        [
          "Winstbelasting",
          "20% voor de intercompanycorrecties."
        ],
        [
          "Voorraden ultimo",
          "Moer € 410.000; Delta € 260.000; Eko € 390.000. De genoemde interne voorraden zijn hierin al begrepen."
        ],
        [
          "Resultaten na belastingen",
          "Moer € 500.000; Delta € 200.000; Eko € 180.000."
        ],
        [
          "Regulier dividend uit resultaten na verwerving",
          "Delta keert totaal € 60.000 uit, Eko totaal € 40.000. Moers ontvangen dividend is al in haar resultaat opgenomen."
        ],
        [
          "Goodwillafschrijving lopend jaar",
          "Delta € 12.000; Eko € 18.000. Geen belastingeffect."
        ],
        [
          "Overige correcties",
          "Geen andere resultaat- of voorraadcorrecties."
        ]
      ],
      "task": "Hoeveel bedraagt de geconsolideerde voorraad per einde boekjaar?",
      "options": [
        {
          "lines": [
            "€ 410.000 + € 260.000 + € 390.000 − 80% × € 70.000 − € 60.000"
          ],
          "result": "€ 944.000",
          "why": "Ook upstreamwinst moet voor 100% uit de voorraad; de toerekening is een aparte stap."
        },
        {
          "lines": [
            "€ 410.000 + € 260.000 + € 390.000 − € 70.000 − € 60.000"
          ],
          "result": "€ 930.000",
          "why": "",
          "auditExpressions": [
            [
              "410000+260000+390000-70000-60000",
              930000
            ]
          ]
        },
        {
          "lines": [
            "€ 410.000 + € 260.000 + € 390.000 − (€ 70.000 + € 60.000) × 80%"
          ],
          "result": "€ 956.000",
          "why": "De voorraad wordt bruto gecorrigeerd; de belastinglatentie staat afzonderlijk."
        },
        {
          "lines": [
            "€ 410.000 + € 260.000 + € 390.000 − (€ 70.000 − € 50.000) − (€ 60.000 − € 80.000)"
          ],
          "result": "€ 1.060.000",
          "why": "De balans gebruikt de eindstanden, niet de mutaties."
        }
      ],
      "correct": 1,
      "explanation": [
        "Voorraden samen: € 1.060.000.",
        "Volledig te elimineren eindwinsten: € 70.000 + € 60.000 = € 130.000.",
        "De geconsolideerde voorraad bedraagt € 930.000."
      ],
      "pattern": "Voorraad is altijd een bruto eindstand; percentages voor moeder en derden veranderen de totale voorraadcorrectie niet.",
      "refs": [
        "boit",
        "up",
        "down"
      ],
      "related": [
        16,
        22,
        29,
        30
      ],
      "variant": true
    },
    {
      "id": 29,
      "stage": 5,
      "title": "Eindcasus: het aandeel derden",
      "type": "Rekenvraag",
      "intro": "Gebruik voor deze vraag de onderstaande gegevens van Moer, Delta en Eko.",
      "facts": [
        [
          "Belangen en grondslag",
          "Moer bezit 80% van Delta en 70% van Eko, beide tegen verkrijgingsprijs. Beide dochters worden integraal geconsolideerd."
        ],
        [
          "Upstream: Delta → Moer",
          "Winst beginvoorraad € 50.000; winst eindvoorraad € 70.000, vóór belasting."
        ],
        [
          "Downstream: Moer → Eko",
          "Winst beginvoorraad € 80.000; winst eindvoorraad € 60.000, vóór belasting."
        ],
        [
          "Winstbelasting",
          "20% voor de intercompanycorrecties."
        ],
        [
          "Voorraden ultimo",
          "Moer € 410.000; Delta € 260.000; Eko € 390.000. De genoemde interne voorraden zijn hierin al begrepen."
        ],
        [
          "Resultaten na belastingen",
          "Moer € 500.000; Delta € 200.000; Eko € 180.000."
        ],
        [
          "Regulier dividend uit resultaten na verwerving",
          "Delta keert totaal € 60.000 uit, Eko totaal € 40.000. Moers ontvangen dividend is al in haar resultaat opgenomen."
        ],
        [
          "Goodwillafschrijving lopend jaar",
          "Delta € 12.000; Eko € 18.000. Geen belastingeffect."
        ],
        [
          "Overige correcties",
          "Geen andere resultaat- of voorraadcorrecties."
        ]
      ],
      "task": "Wat is het totale aandeel derden in de geconsolideerde winst-en-verliesrekening?",
      "options": [
        {
          "lines": [
            "Delta: 20% × € 200.000 = € 40.000",
            "Eko: 30% × [€ 180.000 + (€ 80.000 − € 60.000) × 80%] = € 58.800",
            "Totaal: € 40.000 + € 58.800"
          ],
          "result": "€ 98.800",
          "why": "Je corrigeert de verkeerde dochter: upstream raakt derden, downstream niet."
        },
        {
          "lines": [
            "Delta: 20% × (€ 200.000 − € 20.000) = € 36.000",
            "Eko: 30% × € 180.000 = € 54.000",
            "Totaal: € 36.000 + € 54.000"
          ],
          "result": "€ 90.000",
          "why": "De upstreamwinstmutatie moet na belasting worden meegenomen."
        },
        {
          "lines": [
            "Delta: 20% × [€ 200.000 − € 20.000 × 80%] = € 36.800",
            "Eko: 30% × [€ 180.000 + € 20.000 × 80%] = € 58.800",
            "Totaal: € 36.800 + € 58.800"
          ],
          "result": "€ 95.600",
          "why": "De downstreamvrijval bij Eko komt volledig aan de moeder toe."
        },
        {
          "lines": [
            "Delta: 20% × [€ 200.000 − (€ 70.000 − € 50.000) × 80%] = € 36.800",
            "Eko: 30% × € 180.000 = € 54.000",
            "Totaal: € 36.800 + € 54.000"
          ],
          "result": "€ 90.800",
          "why": "",
          "auditExpressions": [
            [
              ".2*(200000-(70000-50000)*.8)+.3*180000",
              90800
            ]
          ]
        }
      ],
      "correct": 3,
      "explanation": [
        "Delta is de verkoper van de upstreamgoederen: haar netto toename van ongerealiseerde winst is € 16.000. Daarvan is 20% = € 3.200 voor derden.",
        "Het gewone aandeel derden is € 40.000 + € 54.000 = € 94.000. Na correctie resteert € 90.800.",
        "Bij de downstreamlevering door Moer wordt derden niet gecorrigeerd."
      ],
      "pattern": "Corrigeer derden uitsluitend waar een verkopende dochter de nog ongerealiseerde winst heeft geboekt.",
      "refs": [
        "boit",
        "orvelde"
      ],
      "related": [
        12,
        19,
        28,
        30
      ],
      "variant": true
    },
    {
      "id": 30,
      "stage": 5,
      "title": "Eindcasus: de volledige resultaataansluiting",
      "type": "Rekenvraag",
      "intro": "Rond de consolidatie van Moer af met dezelfde complete gegevens.",
      "facts": [
        [
          "Belangen en grondslag",
          "Moer bezit 80% van Delta en 70% van Eko, beide tegen verkrijgingsprijs. Beide dochters worden integraal geconsolideerd."
        ],
        [
          "Upstream: Delta → Moer",
          "Winst beginvoorraad € 50.000; winst eindvoorraad € 70.000, vóór belasting."
        ],
        [
          "Downstream: Moer → Eko",
          "Winst beginvoorraad € 80.000; winst eindvoorraad € 60.000, vóór belasting."
        ],
        [
          "Winstbelasting",
          "20% voor de intercompanycorrecties."
        ],
        [
          "Voorraden ultimo",
          "Moer € 410.000; Delta € 260.000; Eko € 390.000. De genoemde interne voorraden zijn hierin al begrepen."
        ],
        [
          "Resultaten na belastingen",
          "Moer € 500.000; Delta € 200.000; Eko € 180.000."
        ],
        [
          "Regulier dividend uit resultaten na verwerving",
          "Delta keert totaal € 60.000 uit, Eko totaal € 40.000. Moers ontvangen dividend is al in haar resultaat opgenomen."
        ],
        [
          "Goodwillafschrijving lopend jaar",
          "Delta € 12.000; Eko € 18.000. Geen belastingeffect."
        ],
        [
          "Overige correcties",
          "Geen andere resultaat- of voorraadcorrecties."
        ]
      ],
      "task": "Wat is het geconsolideerde resultaat na belastingen toekomend aan Moer?",
      "options": [
        {
          "lines": [
            "Moer + winstaandelen: € 500.000 + 80% × € 200.000 + 70% × € 180.000 = € 786.000",
            "Dividend eruit: −80% × € 60.000 −70% × € 40.000 = −€ 76.000",
            "Goodwillafschrijving: −€ 12.000 −€ 18.000 = −€ 30.000",
            "Upstream: −80% × (€ 70.000 − € 50.000) × 80% = −€ 12.800",
            "Downstream: +(€ 80.000 − € 60.000) × 80% = +€ 16.000"
          ],
          "result": "€ 683.200",
          "why": "",
          "auditExpressions": [
            [
              "500000+.8*200000+.7*180000-.8*60000-.7*40000-12000-18000-.8*20000*.8+20000*.8",
              683200
            ]
          ]
        },
        {
          "lines": [
            "€ 786.000 − € 76.000 − € 30.000",
            "Upstream: −80% × € 20.000 × 80% = −€ 12.800",
            "Downstream: +70% × € 20.000 × 80% = +€ 11.200"
          ],
          "result": "€ 678.400",
          "why": "De downstreamvrijval behoort volledig aan Moer toe, niet slechts voor 70%."
        },
        {
          "lines": [
            "€ 786.000 − € 76.000 − € 30.000",
            "Upstream: −80% × € 20.000 = −€ 16.000",
            "Downstream: +€ 20.000 = +€ 20.000"
          ],
          "result": "€ 684.000",
          "why": "De belastinginvloed op de intercompanycorrecties ontbreekt."
        },
        {
          "lines": [
            "€ 786.000 − € 76.000 − € 30.000",
            "Upstream: −€ 20.000 × 80% = −€ 16.000",
            "Downstream: +€ 20.000 × 80% = +€ 16.000"
          ],
          "result": "€ 680.000",
          "why": "Slechts 80% van de upstreamcorrectie is voor Moer; de rest komt voor derden."
        }
      ],
      "correct": 0,
      "explanation": [
        "Moerresultaat en de winstaandelen in dochters bedragen samen € 786.000.",
        "Elimineer € 76.000 dividendopbrengst en trek € 30.000 goodwillafschrijving af.",
        "De upstreamtoename verlaagt Moers resultaat met € 12.800; de downstreamafname verhoogt het met € 16.000.",
        "Uitkomst: € 683.200. Controle: groepsresultaat vóór toerekening € 774.000 minus derden € 90.800 = € 683.200."
      ],
      "pattern": "HK-eindpatroon: moeder + winstaandelen − dividend − goodwill ± netto intercompanymutaties voor de moeder.",
      "refs": [
        "boit",
        "college",
        "orvelde"
      ],
      "related": [
        13,
        20,
        28,
        29
      ],
      "variant": true
    }
  ],
  "code": "hk",
  "opgave": 4
};
})(window);
