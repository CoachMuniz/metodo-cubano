import openpyxl

wb = openpyxl.load_workbook("docs_reference/Meso 4 micro.xlsx", data_only=False)
sheet = wb.active

print("TITLE / HEADER:")
for r in range(1, 12):
    row_vals = [(c, sheet.cell(r, c).value) for c in range(1, 45) if sheet.cell(r, c).value is not None]
    if row_vals:
        print(f"R{r}: {row_vals}")

print("\nFORMULAS in R21 (Subtotal) and nearby:")
for r in [11, 12, 13, 21, 22, 23, 33, 34]:
    row_vals = [(c, sheet.cell(r, c).value) for c in range(1, 45) if sheet.cell(r, c).value is not None]
    print(f"R{r}: {row_vals}")
