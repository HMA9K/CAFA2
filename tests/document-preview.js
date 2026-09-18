
const params=new URLSearchParams(location.search),host=document.getElementById('preview');
if(params.has('mobile')){const frame=document.createElement('iframe');frame.src='document-preview?exam=20260429';frame.title='Voorbeeld op mobiele breedte';host.appendChild(frame);}else{
const exam=window.CAFA2_EXAMS.find(e=>e.id==='cafa2-'+(params.get('exam')||'20260429'))||window.CAFA2_EXAMS[0],q=exam.questions[0],render=window.CafaExamDocument.render;
host.innerHTML='<section><h2 class="preview-label">Uitwerking '+exam.date+' · vraag 1</h2>'+render(exam,'solution',q.solutionHtml,q.solution)+'</section><section><h2 class="preview-label">Vraag 1</h2>'+render(exam,'question',q.promptHtml,q.prompt)+'</section><section><h2 class="preview-label">Sectie 1</h2>'+render(exam,'exam',exam.sections[0].contentHtml)+'</section><section><h2 class="preview-label">Introductie</h2>'+render(exam,'exam',exam.introductionHtml,exam.introduction)+'</section>';
}

document.querySelectorAll(".exam-source-brand img").forEach(img=>img.src="../assets/nyenrode-logo.png");
