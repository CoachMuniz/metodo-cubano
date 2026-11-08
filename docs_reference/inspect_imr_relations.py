import openpyxl

wb = openpyxl.load_workbook("docs_reference/FORMATO MESO.xlsx", data_only=False)

for sname in ['PLAN MENSUAL', 'PLAN MENSUAL 2', 'MACROCICLO']:
    sheet = wb[sname]
    print(f"\n--- FORMULAS in {sname} ---")
    for r in range(1, min(sheet.max_row+1, 35)):
        for c in range(1, min(sheet.max_column+1, 25)):
            val = str(sheet.cell(r, c).value or '')
            if any(k in val.lower() for k in ['imr', 'arranque', 'envion', 'cuclilla', 'halon']):
                print(f"[{sname} {openpyxl.utils.get_column_letter(c)}{r}]: {val}")
