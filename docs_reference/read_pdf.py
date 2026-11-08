import pypdf

reader = pypdf.PdfReader(r"G:\Mi unidad\Capacitaciones tomadas\FUP - Curso planificacion CUBA-002\1-EXAMEN FINAL INTERCAMBIO Facundo Costa.pdf")
print("Num pages:", len(reader.pages))

full_text = []
for i, page in enumerate(reader.pages):
    txt = page.extract_text() or ''
    full_text.append(f"--- PAGE {i+1} ---\n{txt}")

with open("docs_reference/examen_facundo.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(full_text))

print("Wrote examen_facundo.txt")
