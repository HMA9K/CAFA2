/** Bounded independent retrieval for explicitly numbered document questions.
 * Only the current message is split; decimal amounts and ordinary hints are unchanged.
 */
export function documentQueries(message){
  if(!/origine|document|bestand|bronn|brone|slides?|repetitie|\.(?:pdf|pptx|docx|md)\b/i.test(message))return [];
  const parts=message.split(/(?:^|\s)\d{1,2}[.)]\s+/).map(s=>s.trim());
  if(parts.length<3)return [];
  return parts.slice(1,4).map(part=>part.slice(0,1000));
}
export function sourcePassages(result){
  if(!Array.isArray(result?.data))throw new Error('Zoekresultaten ontbreken.');
  return result.data.slice(0,2).flatMap(item=>{
    if(typeof item.filename!=='string'||typeof item.file_id!=='string'||!Array.isArray(item.content))return [];
    const text=item.content.filter(c=>c.type==='text'&&typeof c.text==='string').map(c=>c.text).join('\n').slice(0,3500);
    return text?[{filename:item.filename.slice(0,300),text}]:[];
  });
}
