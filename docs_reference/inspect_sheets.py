import openpyxl
import os

files = [
    "docs_reference/CONTROL DEL MESOCICLO GENERAL.xlsx",
    "docs_reference/FORMATO MESO.xlsx",
    "docs_reference/lógica detrás de la planilla cubana.xlsx",
    "docs_reference/Meso 4 micro.xlsx",
    "docs_reference/Meso 5 micro1.xlsx"
]

for f in files:
    if os.path.exists(f):
        print("="*60)
        print("FILE:", f)
        wb = openpyxl.load_workbook(f, data_only=False)
        print("SHEETS:", wb.sheetnames)
        for sname in wb.sheetnames:
            sheet = wb[sname]
            print(f"  Sheet: {sname} (max_row={sheet.max_row}, max_column={sheet.max_column})")
            # print first few non-empty cells
            non_empty = 0
            sample = []
            for r in range(1, min(sheet.max_row+1, 25)):
                row_vals = [sheet.cell(r, c).value for c in range(1, min(sheet.max_column+1, 15))]
                if any(v is not None for v in row_vals):
                    sample.append(f"    R{r}: {row_vals}")
            print("\n".join(sample[:8]))
