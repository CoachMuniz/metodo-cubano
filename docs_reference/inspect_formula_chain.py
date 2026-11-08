import openpyxl

wb = openpyxl.load_workbook("docs_reference/Meso 4 micro.xlsx", data_only=False)
sheet = wb.active

print("ARRANQUE FORMULA CHAIN in Meso 4 micro:")
for r in range(11, 23):
    print(f"\nRow {r}:")
    for c in [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]:
        col_letter = openpyxl.utils.get_column_letter(c)
        val = sheet.cell(r, c).value
        print(f"  {col_letter}{r}: {val}")
