import openpyxl

for fname in ["docs_reference/Meso 4 micro.xlsx", "docs_reference/Meso 5 micro1.xlsx"]:
    print("="*60)
    print("FILE:", fname)
    wb = openpyxl.load_workbook(fname, data_only=False)
    sheet = wb.active
    for r in range(80, 95):
        vals = [(openpyxl.utils.get_column_letter(c), sheet.cell(r, c).value) for c in range(1, 40) if sheet.cell(r, c).value is not None]
        if vals:
            print(f"R{r}: {vals[:10]}")
