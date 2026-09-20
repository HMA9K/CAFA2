/* Presentation metadata only. Headers, cells, amounts and source text are untouched.
   This decorator handles the simple semantic tables produced by helpers.mjs,
   both in the static reader and in the interactive IC calculation. */
import {esc} from './helpers.mjs';

const plain = html => String(html).replace(/<[^>]*>/g, '').replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').trim();
export const isValue = text => /^(?:[€$]\s*)?[−–-]?\s*\d[\d\s.,]*(?:\s*%)?$/.test(text)
  || /^\d{1,2}-\d{1,2}-\d{4}$/.test(text);

export function tableKind(headers, rows) {
  if (headers.length === 3 && /^Debet/.test(headers[1]) && /^Credit/.test(headers[2])) return 'journal';
  if (headers.length === 6 && headers[0] === 'Datum' && /voorraad/i.test(headers[1]) && /winst/i.test(headers[2])) return 'stock';
  const cells = rows.flatMap(row => row.slice(1)).filter(Boolean);
  const values = cells.filter(isValue).length;
  // Explanatory comparisons get full-width rows on a phone, not narrower columns.
  // Numeric comparisons and journal entries must keep their horizontal relationships.
  if (cells.filter(cell => cell.length >= 55).length >= 2 && values < cells.length / 3) return 'prose';
  return 'data';
}

export function decorateTables(html) {
  if (typeof html !== 'string') throw new TypeError('Expected generated HTML.');
  return html.replace(/<div class="study-table-scroll"[^>]*><table class="study-table"[^>]*>[\s\S]*?<\/table><\/div>/g, block => {
    if (block.includes('data-table-kind=')) return block;
    const head = block.match(/<thead>([\s\S]*?)<\/thead>/);
    const body = block.match(/<tbody>([\s\S]*?)<\/tbody>/);
    if (!head || !body) return block;
    const headers = Array.from(head[1].matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/g), m => plain(m[1]));
    const rows = Array.from(body[1].matchAll(/<tr>([\s\S]*?)<\/tr>/g), m =>
      Array.from(m[1].matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/g), c => plain(c[1])));
    if (!headers.length || rows.some(row => row.length !== headers.length)) return block;
    const kind = tableKind(headers, rows);
    let result = block.replace('<div class="study-table-scroll"', '<div class="study-table-scroll" data-table-kind="'+kind+'"')
      .replace('<table class="study-table"', '<table class="study-table" data-table-kind="'+kind+'" role="table"')
      .replace('<thead>', '<thead role="rowgroup">').replace('<tbody>', '<tbody role="rowgroup">')
      .replaceAll('<tr>', '<tr role="row">').replaceAll('scope="col"', 'scope="col" role="columnheader"')
      .replaceAll('scope="row"', 'scope="row" role="rowheader"');
    result = result.replace(/<tbody role="rowgroup">([\s\S]*?)<\/tbody>/, (_, content) => {
      const formatted = content.replace(/<tr role="row">([\s\S]*?)<\/tr>/g, (_, row) => {
        let column = 0;
        return '<tr role="row">'+row.replace(/<(th|td)([^>]*)>([\s\S]*?)<\/\1>/g, (_, tag, attrs, text) => {
          const label = headers[column++];
          if (tag === 'td') attrs += ' role="cell" data-label="'+esc(label)+'"';
          if (isValue(plain(text))) attrs += ' data-cell-value="true"';
          return '<'+tag+attrs+'>'+text+'</'+tag+'>';
        })+'</tr>';
      });
      return '<tbody role="rowgroup">'+formatted+'</tbody>';
    });
    return result;
  });
}
