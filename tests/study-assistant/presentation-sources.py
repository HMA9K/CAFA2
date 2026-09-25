"""Synthetic OPC fixture: cached workbook values must survive PPTX extraction."""
import importlib.util
import io
import tempfile
import unittest
from openpyxl import Workbook
from pathlib import Path
from zipfile import ZipFile

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('presentation_sources', ROOT / 'scripts/extract-presentation-sources.py')
module = importlib.util.module_from_spec(spec); spec.loader.exec_module(module)

def zip_bytes(files):
    out = io.BytesIO()
    with ZipFile(out, 'w') as z:
        for name, data in files.items(): z.writestr(name, data)
    return out.getvalue()

def fixture():
    workbook = zip_bytes({
        '[Content_Types].xml': '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/></Types>',
        'xl/workbook.xml': '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Berekening" sheetId="1" r:id="rId1"/></sheets></workbook>',
        'xl/_rels/workbook.xml.rels': '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>',
        'xl/worksheets/sheet1.xml': '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><dimension ref="A1:C2"/><sheetData><row r="1"><c r="A1" t="inlineStr"><is><t>Goodwill</t></is></c><c r="B1"><f>100+50</f><v>150</v></c></row><row r="2"><c r="C2"><f>B1*2</f><v></v></c></row></sheetData></worksheet>'
    })
    slide = '<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><a:p><a:r><a:t>Vraag 1</a:t></a:r></a:p><p:oleObj r:id="rId1" progId="Excel.Sheet.12"/><p:oleObj r:id="rId1" progId="Excel.Sheet.12"/></p:sld>'
    rel = '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Target="../embeddings/calc.xlsx"/></Relationships>'
    return zip_bytes({'ppt/slides/slide1.xml': slide, 'ppt/slides/slide2.xml': slide,
                      'ppt/slides/_rels/slide1.xml.rels': rel, 'ppt/slides/_rels/slide2.xml.rels': rel,
                      'ppt/embeddings/calc.xlsx': workbook})

class PresentationSources(unittest.TestCase):
    def test_unrelated_tabs_are_excluded_and_amounts_remain_searchable(self):
        book=Workbook();book.active['A1']='Andere opgave die niet bij de dia hoort'
        sheet=book.create_sheet('Geselecteerde berekening');sheet['A1']='Koelcellen';sheet['B1']=340250;book.active=1
        output=io.BytesIO();book.save(output)
        with ZipFile(io.BytesIO(fixture())) as z:
            parts={name:z.read(name) for name in z.namelist()}
        parts['ppt/embeddings/calc.xlsx']=output.getvalue()
        with tempfile.TemporaryDirectory() as directory:
            source=Path(directory)/'selected.pptx';source.write_bytes(zip_bytes(parts))
            text,_=module.companion(source)
            self.assertNotIn('Andere opgave die niet bij de dia hoort',text)
            self.assertIn('B1: 340250 (340.250)',text)
            self.assertIn('Bijbehorende oorspronkelijke diatekst, dia 1:\nVraag 1',text)

    def test_cached_values_formulas_and_provenance_without_duplicate_fallback(self):
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / 'test.pptx'; source.write_bytes(fixture())
            original = source.read_bytes()
            text, report = module.companion(source)
            self.assertEqual(report, {'slides': 2, 'uniqueEmbeddedWorkbooks': 1, 'embeddedInstances': 2, 'missingCachedResults': 1})
            self.assertIn('gekoppeld aan dia 1, 2', text)
            self.assertIn('B1: 150 (formule: =100+50)', text)
            self.assertIn('C2: [opgeslagen uitkomst ontbreekt]', text)
            self.assertEqual(text.count('A1: Goodwill'), 1)
            self.assertEqual(source.read_bytes(), original)

if __name__ == '__main__': unittest.main()
