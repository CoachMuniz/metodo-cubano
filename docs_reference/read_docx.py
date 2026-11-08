import zipfile
import xml.etree.ElementTree as ET

def read_docx(path):
    with zipfile.ZipFile(path) as docx:
        tree = ET.fromstring(docx.read('word/document.xml'))
        texts = []
        for elem in tree.iter():
            if elem.tag.endswith('}t'):
                texts.append(elem.text or '')
            elif elem.tag.endswith('}p'):
                texts.append('\n')
        return ''.join(texts)

content = read_docx("docs_reference/012 IMR y Codificacion ejercicios.docx")
with open("docs_reference/docx_text.txt", "w", encoding="utf-8") as f:
    f.write(content)
print(f"Wrote {len(content)} characters to docx_text.txt")
