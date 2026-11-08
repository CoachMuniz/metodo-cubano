import openpyxl

wb = openpyxl.load_workbook("docs_reference/Meso 4 micro.xlsx", data_only=False)
sheet = wb.active

for r in [11, 12, 23, 24, 35, 36, 47, 48, 59, 60]:
    row_vals = [(openpyxl.utils.get_column_letter(c), sheet.cell(r, c).value) for c in range(1, 15) if sheet.cell(r, c).value is not None]
    print(f"R{r:2d}: {row_vals}")
