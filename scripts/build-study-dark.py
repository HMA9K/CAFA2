"""Compile a scoped dark palette for the pre-existing, literal-colour stylesheets.
Only paint declarations are mirrored; no layout, visibility or content is changed.
"""
from pathlib import Path
import re, colorsys
import tinycss2
ROOT=Path(__file__).resolve().parents[1]
FILES=['app.css','answer-editor.css','practice-upgrades.css','exams.css','stock-table.css','exam-document.css','exam-experience.css','question-overview.css','startup.css','results-refinement.css','home.css','theory-panels.css','learning-content.css','answer-feedback.css','summary.css','summary-reader.css','summary-tables.css']
SCOPE='html[data-study-theme=dark]'

def color(value,kind):
    v=value.lstrip('#')
    if len(v) in (3,4):v=''.join(c*2 for c in v)
    if len(v) not in (6,8):return value
    rgb=[int(v[i:i+2],16)/255 for i in (0,2,4)];alpha=v[6:]
    h,l,s=colorsys.rgb_to_hls(*rgb)
    if kind=='background':
        if l>.72:
            if s<.13:r=(.071,.117,.146) if l<.96 else (.083,.129,.160)
            else:r=colorsys.hls_to_rgb(h,.13,min(.34,s*.75))
        elif s>.48 and l>.20:
            r=colorsys.hls_to_rgb(h,min(.38,max(.28,l)),min(.80,s))
        else:r=(.13,.17,.22)
    elif kind=='border':
        r=colorsys.hls_to_rgb(h,.32,min(s,.45)) if s>.15 else (.23,.29,.33)
    elif kind=='shadow':r=(.005,.01,.016)
    else:
        if s>.18:r=colorsys.hls_to_rgb(h,.74,min(s,.72))
        elif l>.9:r=(.94,.97,.99)
        elif l<.25:r=(.88,.92,.95)
        else:r=(.68,.74,.79)
    return '#'+''.join(f'{round(n*255):02x}' for n in r)+alpha

def paint(value,kind):
    if kind=='text':
        # Legacy tokens are used both as fills and text. A dark fill must stay
        # dark, but its text uses the semantic foreground, even without a hex.
        value=re.sub(r'var\(\s*--purple(?:\s*,[^()]*)?\s*\)', 'var(--study-ink)', value)
        value=re.sub(r'var\(\s*--(?:green|green-dark)(?:\s*,[^()]*)?\s*\)', 'var(--study-accent)', value)
    value=re.sub(r'#[0-9a-fA-F]{3,8}\b',lambda m:color(m[0],kind),value)
    value=re.sub(r'\b(white|black)\b',lambda m:color('#ffffff' if m[0]=='white' else '#000000',kind),value)
    # RGB literals are rare here. Preserve alpha where possible.
    def rgba(m):
        parts=[x.strip() for x in m[2].split(',')]
        if len(parts) not in (3,4):return m[0]
        try:
            values=[round(float(x[:-1])*2.55) if x.endswith('%') else round(float(x)) for x in parts[:3]]
            v=color('#'+''.join(f'{max(0,min(n,255)):02x}' for n in values),kind)
            return ('rgba('+','.join(str(int(v[i:i+2],16)) for i in (1,3,5))+','+parts[3]+')') if len(parts)==4 else v
        except ValueError:return m[0]
    return re.sub(r'\b(rgb|rgba)\(([^)]*)\)',rgba,value)

def scoped(selector):
    if selector.startswith(':root'):return selector.replace(':root',SCOPE,1)
    if re.match(r'^html\b',selector):return re.sub(r'^html',SCOPE,selector,count=1)
    return SCOPE+' '+selector

def compile_rules(rules):
    out=[]
    for rule in rules:
        if rule.type=='qualified-rule':
            sel=tinycss2.serialize(rule.prelude).strip()
            decls=[]
            for d in tinycss2.parse_declaration_list(rule.content,skip_comments=True,skip_whitespace=True):
                if d.type!='declaration':continue
                p=d.lower_name
                if p.startswith('--'):
                    # Shared variables are set explicitly below.
                    continue
                if p not in ['color','background','background-color','border','border-color','border-top','border-bottom','border-left','border-right','border-top-color','border-bottom-color','border-left-color','border-right-color','outline','outline-color','box-shadow','text-shadow','fill','stroke','text-decoration-color','caret-color']:continue
                v=tinycss2.serialize(d.value).strip()
                if not re.search(r'#[0-9a-fA-F]{3}|\b(?:white|black|rgba?)\b',v) and not (p=='color' and re.search(r'var\(\s*--(?:purple|green|green-dark)(?:\s*[,)]|\s*$)',v)):continue
                kind='background' if p.startswith('background') else 'border' if p.startswith(('border','outline')) else 'shadow' if 'shadow' in p else 'text'
                changed=paint(v,kind)
                decls.append(p+':'+changed+('!important' if d.important else ''))
            if decls:
                # No selectors here contain comma functions; use token depth for generality.
                sels=[];chunk=[];depth=0
                for tok in rule.prelude:
                    if tok.type=='literal' and tok.value==',':sels.append(tinycss2.serialize(chunk).strip());chunk=[]
                    else:chunk.append(tok)
                sels.append(tinycss2.serialize(chunk).strip())
                out.append(','.join(scoped(s) for s in sels)+'{'+(';'.join(decls))+'}')
        elif rule.type=='at-rule' and rule.content and rule.lower_at_keyword in ('media','supports','layer'):
            pre=tinycss2.serialize(rule.prelude).strip()
            if 'print' in pre:continue
            compiled=compile_rules(tinycss2.parse_rule_list(rule.content,skip_comments=True,skip_whitespace=True))
            if compiled:out.append('@'+rule.lower_at_keyword+' '+pre+'{'+compiled+'}')
    return '\n'.join(out)

pieces=['/* Generated paint-only overrides. Source: scripts/build-study-dark.py. */']
for f in FILES:
    path=ROOT/'css'/f
    if path.exists():pieces.append('/* '+f+' */\n'+compile_rules(tinycss2.parse_stylesheet(path.read_text(),skip_comments=True,skip_whitespace=True)))
pieces.append('''html[data-study-theme=dark]{--ink:#e1eaf0;--text:#e1eaf0;--muted:#a8b8c4;--line:#354852;--paper:#152129;--wash:#10191f;--bg:#10191f;--purple:#283143;--green:#13856a;--green-dark:#07543c;--bad:#f0aaa7}
html[data-study-theme=dark] body{background:#10191f;color:#e1eaf0}
html[data-study-theme=dark] .law-ref{background:#28223b;border-color:#655581;color:#d7c4fa}
html[data-study-theme=dark] .law-ref:hover{background:#392e50;border-color:#b8a2df}
html[data-study-theme=dark] .law-inline{background:#302540;color:#d7c4fa;text-decoration-color:#9680b7}
html[data-study-theme=dark] .study-answer-note{background:#1d2230;color:#e0e6ef;border-left-color:#b09add}
html[data-study-theme=dark] .study-answer-note .study-note-caption{color:#cfbbef}
html[data-study-theme=dark] .study-origin{background:#15362e;border-color:#376453;color:#adf0d5}
html[data-study-theme=dark] .study-law-body .law-selected{background:#282438;color:#ede6fa}
html[data-study-theme=dark] .capital-decision{background:#14312c;border-color:#456e64}
html[data-study-theme=dark] .capital-lane{--lane:#74d5b7}
html[data-study-theme=dark] .lane-dochter{--lane:#b8a1de}
html[data-study-theme=dark] .lane-groep{--lane:#8dbbdc}
html[data-study-theme=dark] .capital-presumption{background:#1b342f;color:#b8d7cc}
html[data-study-theme=dark] .capital-outcome{background:#18342e;border-color:#5cbb97}
html[data-study-theme=dark] .capital-outcome.is-no{background:#342e20;border-color:#bd9852}
html[data-study-theme=dark] .capital-outcome p{color:#bbd4cc}
html[data-study-theme=dark] .capital-outcome.is-no p{color:#ded0af}
html[data-study-theme=dark] .capital-path-label{background:#18372e;color:#b3e4d1}
html[data-study-theme=dark] .capital-path-label.is-no{background:#382f1f;color:#e1c78d}
html[data-study-theme=dark] .wizard-sign{background:#193c30;color:#8ce1bf}
html[data-study-theme=dark] .capital-wizard{border-color:#466b5d}
html[data-study-theme=dark] input,html[data-study-theme=dark] select,html[data-study-theme=dark] textarea,html[data-study-theme=dark] [contenteditable=true]{color:#e0e9f0;background-color:#13212a;caret-color:#c6efe1}
html[data-study-theme=dark] .btn.primary,html[data-study-theme=dark] .study-button.primary{background:#07674a;border-color:#299576;color:#fff}
html[data-study-theme=dark] .study-theme-menu button{color:var(--study-ink);background:var(--study-wash)}
@media print{html[data-study-theme=dark] body{background:#fff!important;color:#111!important}html[data-study-theme=dark] .reader-layout [data-view]{color:#111!important}}
''')
pieces.append((ROOT/'content/study/dark-contrast.css').read_text())
with (ROOT/'css/study-dark.css').open('w', encoding='utf-8', newline='\n') as output:
    output.write('@media screen {\n'+'\n'.join(pieces)+'\n}\n')
print('Dark paint rules:',sum(p.count('{') for p in pieces))
