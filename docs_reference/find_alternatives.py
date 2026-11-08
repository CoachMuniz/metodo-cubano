import openpyxl
import os

files = [
    "docs_reference/FORMATO MESO.xlsx",
    "docs_reference/Meso 4 micro.xlsx",
    "docs_reference/Meso 5 micro1.xlsx",
    "docs_reference/CONTROL DEL MESOCICLO GENERAL.xlsx",
    "docs_reference/lógica detrás de la planilla cubana.xlsx"
]

for f in files:
    print("="*50)
    print("Searching in:", f)
    wb = openpyxl.load_workbook(f, data_only=True)
    for sname in wb.sheetnames:
        sheet = wb[sname]
        for r in range(1, sheet.max_row+1):
            for c in range(1, sheet.max_column+1):
                val = str(sheet.cell(r, c).value or '')
                if any(w in val.lower() for w in ['alternativ', 'variante', 'desplazamiento', 'opcion', 'opción', 'ch-c', 'distribucion', 'distribución', 'imr', 'microciclo']):
                    # Print context if relevant
                    row_vals = [sheet.cell(r, col).value for col in range(1, min(sheet.max_column+1, 20))]
                    non_nulls = [v for v in row_vals if v is not None]
                    if len(non_nulls) >= 3 and any('alternativ' in str(v).lower() or 'micro' in str(v).lower() for v in non_nulls):
                        print(f"[{sname} R{r} C{c}]: {non_nulls[:10]}")
                        break
