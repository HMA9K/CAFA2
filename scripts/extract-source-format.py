"""Extract source typography and the unchanged logo from the supplied exam PDFs.
Usage: python scripts/extract-source-format.py /path/to/source-pdfs
Requires PyMuPDF. Run from repository root. Source PDFs are not published.
"""
from pathlib import Path
import fitz, json, re, sys
formats = {}
for path in sorted(Path(sys.argv[1]).glob('*.pdf')):
    if not re.match(r'20\d{6} ', path.name):
        continue
    document = fitz.open(path)
    kind = 'solution' if 'uitwerking' in path.name.lower() else 'exam'
    entry = formats.setdefault('cafa2-' + path.name[:8], {})
    runs = {}
    for page in document:
        for block in page.get_text('dict')['blocks']:
            for line in block.get('lines', []):
                for span in line['spans']:
                    text = re.sub(r'\s+', ' ', span['text']).strip()
                    red = ((span['color'] >> 16) & 255) > 150 and ((span['color'] >> 8) & 255) < 70
                    bold = 'bold' in span['font'].lower()
                    if len(text) >= 10 and (bold or red) and not re.fullmatch(r'[\d\W]+', text):
                        runs[text] = dict(text=text, bold=bold, red=red)
    entry[kind] = sorted(runs.values(), key=lambda span: -len(span['text']))
    if path.name.startswith('20260429 Tentamen'):
        image = document.extract_image(document[0].get_images()[0][0])
        Path('assets/nyenrode-logo.' + image['ext']).write_bytes(image['image'])
Path('data/exam-source-format.js').write_text('/* Typography extracted from the ten user-provided source PDFs. */\nwindow.CAFA2_SOURCE_FORMAT = ' + json.dumps(formats, ensure_ascii=False, separators=(',', ':')) + ';\n')
