import openpyxl
import json

wb = openpyxl.load_workbook("docs_reference/FORMATO MESO.xlsx", data_only=True)

print("ALL SHEETS in FORMATO MESO:", wb.sheetnames)

for sname in wb.sheetnames:
    sheet = wb[sname]
    print(f"\n==================== SHEET: {sname} ====================")
    for r in range(1, min(sheet.max_row + 1, 60)):
        row_vals = [sheet.cell(r, c).value for c in range(1, min(sheet.max_column + 1, 30))]
        if any(v is not None for v in row_vals):
            # compress consecutive Nones
            print(f"R{r:2d}: {[v for v in row_vals if v is not None][:12]}")
