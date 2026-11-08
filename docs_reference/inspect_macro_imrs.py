import openpyxl

wb = openpyxl.load_workbook("docs_reference/FORMATO MESO.xlsx", data_only=True)
sheet = wb["MACROCICLO"]

for r in range(13, 21):
    vals = [(openpyxl.utils.get_column_letter(c), sheet.cell(r, c).value) for c in range(1, 15) if sheet.cell(r, c).value is not None]
    print(f"R{r:2d}: {vals}")
