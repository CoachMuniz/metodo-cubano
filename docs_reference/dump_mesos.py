import openpyxl

for fname in ["docs_reference/Meso 4 micro.xlsx", "docs_reference/Meso 5 micro1.xlsx"]:
    print("="*60)
    print("FILE:", fname)
    wb = openpyxl.load_workbook(fname, data_only=True)
    for sname in wb.sheetnames:
        sheet = wb[sname]
        print(f"Sheet {sname}: {sheet.max_row} rows, {sheet.max_column} cols")
        for r in range(1, min(sheet.max_row+1, 40)):
            vals = [sheet.cell(r, c).value for c in range(1, min(sheet.max_column+1, 25))]
            if any(v is not None for v in vals):
                print(f"  R{r:2d}: {[v for v in vals if v is not None][:10]}")
