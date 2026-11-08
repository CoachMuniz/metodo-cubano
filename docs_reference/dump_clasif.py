import openpyxl

wb = openpyxl.load_workbook("docs_reference/FORMATO MESO.xlsx", data_only=True)

for sname in ['CLASIF. IMR 1', 'CLASIF IMR 2', 'COD. DE EJER.', 'Repeticiones']:
    sheet = wb[sname]
    print(f"\n==================== SHEET: {sname} ====================")
    for r in range(1, sheet.max_row + 1):
        row_vals = [sheet.cell(r, c).value for c in range(1, sheet.max_column + 1)]
        if any(v is not None for v in row_vals):
            print(f"R{r:2d}: {row_vals[:25]}")
