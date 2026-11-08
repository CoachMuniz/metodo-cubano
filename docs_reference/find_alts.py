import os
import openpyxl

search_dirs = [
    r"G:\Mi unidad\Capacitaciones tomadas\FUP - Curso planificacion CUBA-002\presentaciones",
    r"docs_reference"
]

results = []

for sdir in search_dirs:
    for fname in os.listdir(sdir):
        if fname.endswith(".xlsx"):
            fpath = os.path.join(sdir, fname)
            try:
                wb = openpyxl.load_workbook(fpath, data_only=True)
                for sname in wb.sheetnames:
                    sheet = wb[sname]
                    for r in range(1, min(sheet.max_row+1, 100)):
                        for c in range(1, min(sheet.max_column+1, 50)):
                            val = str(sheet.cell(r, c).value or '')
                            if any(w in val.lower() for w in ['desplazamiento', 'alternativa', 'ondulatori', 'distribución de los micro', 'distribucion de los micro']):
                                results.append(f"{fname} -> [{sname} R{r} C{c}]: {val}")
            except Exception as e:
                pass

with open("docs_reference/alt_search.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(results))

print(f"Done. Found {len(results)} matches.")
