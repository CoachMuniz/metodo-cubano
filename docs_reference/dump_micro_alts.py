import openpyxl

f = r"G:\Mi unidad\Capacitaciones tomadas\FUP - Curso planificacion CUBA-002\presentaciones\016 meso-micro 4.xlsx"
wb = openpyxl.load_workbook(f, data_only=True)

for sname in wb.sheetnames:
    sheet = wb[sname]
    print(f"\n================ SHEET {sname} ================")
    # Print row 70-75
    for r in range(70, 76):
        vals = [(openpyxl.utils.get_column_letter(c), sheet.cell(r, c).value) for c in range(1, 40) if sheet.cell(r, c).value is not None]
        if vals:
            print(f"R{r}: {vals[:12]}")
    # Print IMR of exercises R11, R16, R23, R28, R35, R40
    for r in [11, 16, 23, 28, 35, 40, 47, 52, 59, 64]:
        vals = [(openpyxl.utils.get_column_letter(c), sheet.cell(r, c).value) for c in range(1, 40) if sheet.cell(r, c).value is not None]
        if vals:
            print(f"R{r}: {vals[:8]}")
