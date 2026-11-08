# Search docx_text.txt for keywords
with open("docs_reference/docx_text.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()

print(f"Total lines: {len(lines)}")
for idx, line in enumerate(lines):
    line_s = line.strip().lower()
    if any(k in line_s for k in ["halon", "microciclo", "alternativ", "desplazamiento", "duración", "duracion", "distribución de los micro", "variante"]):
        print(f"L{idx+1}: {line.strip()[:80]}")
