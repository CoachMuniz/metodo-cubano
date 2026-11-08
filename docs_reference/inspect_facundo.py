import openpyxl

wb = openpyxl.load_workbook("docs_reference/Planificación de Macrociclos (Facundo).xlsm", data_only=True)
print("SHEETS in Planificación de Macrociclos (Facundo):", wb.sheetnames)

for sname in wb.sheetnames:
    sheet = wb[sname]
    print(f"\nSheet {sname}: {sheet.max_row} rows, {sheet.max_column} cols")
    # check first few rows
    for r in range(1, min(sheet.max_row+1, 20)):
        row_vals = [sheet.cell(r, c).value for c in range(1, min(sheet.max_column+1, 20))]
        if any(v is not None for v in row_vals):
            print(f"  R{r:2d}: {[v for v in row_vals if v is not None][:10]}")
