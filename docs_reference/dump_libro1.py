import openpyxl

for fname in ["docs_reference/Libro1.xlsx", "docs_reference/lógica detrás de la planilla cubana.xlsx"]:
    print("="*60)
    print("FILE:", fname)
    wb = openpyxl.load_workbook(fname, data_only=True)
    print("SHEETS:", wb.sheetnames)
    for sname in wb.sheetnames:
        sheet = wb[sname]
        print(f"Sheet {sname} ({sheet.max_row} x {sheet.max_column})")
        for r in range(1, min(sheet.max_row+1, 30)):
            vals = [sheet.cell(r, c).value for c in range(1, min(sheet.max_column+1, 20))]
            if any(v is not None for v in vals):
                print(f"  R{r}: {[v for v in vals if v is not None][:10]}")
