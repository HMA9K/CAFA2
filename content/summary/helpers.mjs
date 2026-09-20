export const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const money=v=>typeof v==='number'?new Intl.NumberFormat('nl-NL',{maximumFractionDigits:2}).format(v):String(v??'');
export function table(headers,rows,caption='') {return '<div class="study-table-scroll" tabindex="0" aria-label="'+esc(caption||'Tabel; horizontaal verschuifbaar')+'"><table class="study-table">'+(caption?'<caption>'+esc(caption)+'</caption>':'')+'<thead><tr>'+headers.map(h=>'<th scope="col">'+esc(h)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map((c,i)=>'<'+(i===0?'th scope="row"':'td')+'>'+esc(money(c))+'</'+(i===0?'th':'td')+'>').join('')+'</tr>').join('')+'</tbody></table></div>';}
export function journal(title,rows) {return '<div class="study-journal"><h4>'+esc(title)+'</h4>'+table(['Rekening','Debet (€)','Credit (€)'],rows)+'</div>';}
export function example(title,html){return '<details class="study-example"><summary>'+esc(title)+'</summary><div class="study-example-body">'+html+'</div></details>';}
export function note(title,html){return '<aside class="study-note"><strong>'+esc(title)+'</strong><p>'+html+'</p></aside>';}
export function flow(items){return '<ol class="study-flow">'+items.map(v=>'<li>'+esc(v)+'</li>').join('')+'</ol>';}
export function lesson(id,group,title,lead,html,sources){return {id,group,title,lead,html,sources};}
