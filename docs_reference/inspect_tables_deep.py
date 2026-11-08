import openpyxl

wb = openpyxl.load_workbook("docs_reference/Meso 4 micro.xlsx", data_only=False)
sheet = wb.active

print("--- ROWS 65-80, COLS 1-40 ---")
for r in range(65, 80):
    vals = [(openpyxl.utils.get_column_letter(c), sheet.cell(r, c).value) for c in range(1, 40) if sheet.cell(r, c).value is not None]
    if vals:
        print(f"R{r}: {vals[:10]}")

print("\n--- TABLE AT AQ91:ET104 ---")
for r in range(90, 106):
    vals = [(openpyxl.utils.get_column_letter(c), sheet.cell(r, c).value) for c in range(40, 100) if sheet.cell(r, c).value is not None]
    if vals:
        print(f"R{r}: {vals[:12]}")
