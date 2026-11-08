import openpyxl

wb = openpyxl.load_workbook("docs_reference/FORMATO MESO.xlsx", data_only=True)
sheet = wb["rutinas"]
print("=== SHEET: rutinas ===")
for r in range(1, sheet.max_row+1):
    vals = [sheet.cell(r, c).value for c in range(1, sheet.max_column+1)]
    if any(v is not None for v in vals):
        print(f"R{r:2d}: {[v for v in vals if v is not None][:15]}")
