import openpyxl

for f in ["docs_reference/Meso 5 micro1.xlsx", r"G:\Mi unidad\Capacitaciones tomadas\FUP - Curso planificacion CUBA-002\presentaciones\017 Meso-micro 5.xlsx"]:
    print("="*60)
    print("FILE:", f)
    wb = openpyxl.load_workbook(f, data_only=True)
    for sname in wb.sheetnames:
        sheet = wb[sname]
        print(f"Sheet {sname}")
        for r in range(70, 76):
            vals = [(openpyxl.utils.get_column_letter(c), sheet.cell(r, c).value) for c in range(1, 50) if sheet.cell(r, c).value is not None]
            if vals:
                print(f"  R{r}: {vals[:15]}")
