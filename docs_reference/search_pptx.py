import zipfile
import xml.etree.ElementTree as ET
import os

pptx_dirs = [
    r"G:\Mi unidad\Capacitaciones tomadas\FUP - Curso planificacion CUBA-002\presentaciones",
    r"G:\Mi unidad\Capacitaciones tomadas\FUP - Curso planificacion CUBA-002\2-MODELOS CONTROL Y PLANIFICASION 2022"
]

out = []

def search_pptx(path):
    res = []
    try:
        with zipfile.ZipFile(path) as z:
            slides = [f for f in z.namelist() if f.startswith('ppt/slides/slide') and f.endswith('.xml')]
            for s in slides:
                tree = ET.fromstring(z.read(s))
                texts = []
                for elem in tree.iter():
                    if elem.tag.endswith('}t'):
                        texts.append(elem.text or '')
                slide_text = ' '.join(texts)
                for kw in ['desplazamiento', 'alternativa', 'imr']:
                    if kw in slide_text.lower():
                        res.append((s, slide_text))
                        break
    except Exception as e:
        res.append(('error', str(e)))
    return res

for pdir in pptx_dirs:
    for fname in os.listdir(pdir):
        if fname.endswith('.pptx'):
            fpath = os.path.join(pdir, fname)
            matches = search_pptx(fpath)
            if matches:
                out.append(f"=== {fname} ({len(matches)} slides) ===")
                for s, txt in matches:
                    out.append(f"[{s}]: {txt}\n")

with open("docs_reference/pptx_matches.txt", "w", encoding="utf-8") as f:
    f.write('\n'.join(out))

print(f"Done. Wrote {len(out)} lines.")
