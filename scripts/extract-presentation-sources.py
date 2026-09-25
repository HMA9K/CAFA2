"""Read a PPTX and its embedded Excel caches into a searchable companion file.

Never executes workbook formulas, macros or external links; original files stay intact.
The companion keeps slide, sheet and cell provenance and explicitly marks cached values.
Requires openpyxl for read-only workbook inspection.
"""
import argparse
import hashlib
import io
import json
import posixpath
import re
from pathlib import Path
from zipfile import ZipFile
from xml.etree import ElementTree as ET
from openpyxl import load_workbook

NS = {'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
RID = '{' + NS['r'] + '}id'

def readable(value):
    if value is None:
        return ''
    if isinstance(value, float):
        return format(value, '.12g')
    return str(value).replace('\r', '').replace('\n', ' / ').replace('|', '\\|')

def extract(source):
    slides, books = [], {}
    with ZipFile(source) as z:
        parts = sorted((n for n in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml', n)),
                       key=lambda n: int(re.search(r'(\d+)\.xml', n).group(1)))
        for part in parts:
            number = int(re.search(r'(\d+)\.xml', part).group(1))
            xml = ET.fromstring(z.read(part))
            paras = [''.join(t.text or '' for t in p.findall('.//a:t', NS)) for p in xml.findall('.//a:p', NS)]
            relpath = posixpath.join(posixpath.dirname(part), '_rels', posixpath.basename(part) + '.rels')
            rels = {}
            if relpath in z.namelist():
                for rel in ET.fromstring(z.read(relpath)):
                    if rel.get('TargetMode') != 'External':
                        rels[rel.get('Id')] = posixpath.normpath(posixpath.join(posixpath.dirname(part), rel.get('Target', '')))
            tables, seen_targets = [], set()
            for obj in xml.findall('.//p:oleObj', NS):
                target = rels.get(obj.get(RID), '')
                if target in seen_targets:
                    continue  # DrawingML and fallback repeat the same OLE relationship.
                seen_targets.add(target)
                if not target.endswith('.xlsx'):
                    raise ValueError(f'Niet ondersteund ingesloten object bij dia {number}: {obj.get("progId")}')
                raw = z.read(target)
                values = load_workbook(io.BytesIO(raw), data_only=True, read_only=True, keep_links=False)
                formulas = load_workbook(io.BytesIO(raw), data_only=False, read_only=True, keep_links=False)
                sheets = []
                for sheet in values:
                    if sheet.max_row > 500 or sheet.max_column > 100:
                        raise ValueError(f'Werkblad te groot voor gecontroleerde extractie: {sheet.title}')
                    rows = []
                    formula_cells = {c.coordinate: c.value for row in formulas[sheet.title] for c in row if c.data_type == 'f'}
                    for row in sheet:
                        cells = []
                        for cell in row:
                            if not hasattr(cell, 'coordinate'):
                                continue
                            formula = formula_cells.get(cell.coordinate)
                            if cell.value is not None or formula is not None:
                                cells.append({'cell': cell.coordinate, 'value': readable(cell.value),
                                              **({'formula': formula} if formula else {})})
                        if cells:
                            rows.append(cells)
                    sheets.append({'sheet': sheet.title, 'rows': rows})
                values.close(); formulas.close()
                identity = hashlib.sha256(json.dumps(sheets, ensure_ascii=False, sort_keys=True).encode()).hexdigest()
                if identity not in books:
                    books[identity] = {'slides': [], 'sheets': sheets}
                if number not in books[identity]['slides']:
                    books[identity]['slides'].append(number)
                tables.append(identity)
            slides.append({'number': number, 'text': '\n'.join(p for p in paras if p.strip()),
                           'images': len(xml.findall('.//p:pic', NS)), 'tables': tables})
    return slides, books

def companion(source):
    source = Path(source)
    slides, books = extract(source)
    lines = [f'# Doorzoekbare aanvulling bij {source.name}', '',
             f'Origineel bronbestand: {source.name}',
             f'SHA-256 van origineel: {hashlib.sha256(source.read_bytes()).hexdigest()}', '',
             'Deze aanvulling bevat de oorspronkelijke diatekst en opgeslagen waarden/formules uit ingesloten Excel-werkbladen. '
             'Formules zijn niet opnieuw berekend. Een ingesloten werkblad kan meer cellen bevatten dan de zichtbare uitsnede op de dia. '
             'Afbeeldingen en pijlen zijn niet automatisch vertaald naar tekst. Gebruik het origineel voor de visuele indeling. '
             'Dia-aanduidingen verwijzen naar de volgorde in het originele bestand. Titels en jaartallen zijn ongewijzigd overgenomen.', '']
    for slide in slides:
        lines.extend([f'## Dia {slide["number"]}', '', slide['text'], ''])
        if slide['tables']:
            lines.append('Ingesloten berekening(en): ' + ', '.join('werkblad ' + str(list(books).index(key) + 1) for key in dict.fromkeys(slide['tables'])) + '.\n')
    missing = 0
    for index, book in enumerate(books.values(), 1):
        lines.extend([f'## Ingesloten werkblad {index}, gekoppeld aan dia ' + ', '.join(map(str, book['slides'])), ''])
        for sheet in book['sheets']:
            lines.extend([f'### Blad {sheet["sheet"]}', '', 'Elke regel houdt de cellen uit één oorspronkelijke werkbladrij bij elkaar.', ''])
            for cells in sheet['rows']:
                text = []
                for cell in cells:
                    value = cell['value']
                    if cell.get('formula') and not value:
                        value = '[opgeslagen uitkomst ontbreekt]'; missing += 1
                    text.append(cell['cell'] + ': ' + value + (f' (formule: {cell["formula"]})' if cell.get('formula') else ''))
                lines.append('- ' + '; '.join(text))
            lines.append('')
    return '\n'.join(lines), {'slides': len(slides), 'uniqueEmbeddedWorkbooks': len(books),
                              'embeddedInstances': sum(len(s['tables']) for s in slides), 'missingCachedResults': missing}

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source'); parser.add_argument('--output', required=True)
    args = parser.parse_args()
    text, report = companion(args.source)
    target = Path(args.output)
    if target.suffix.lower() != '.md' or target.resolve() == Path(args.source).resolve():
        raise ValueError('Schrijf naar een afzonderlijk Markdown-bestand.')
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(text, encoding='utf-8')
    print(json.dumps(report))
