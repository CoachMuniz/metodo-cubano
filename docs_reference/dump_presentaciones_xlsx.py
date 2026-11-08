import openpyxl

files = [
    r"G:\Mi unidad\Capacitaciones tomadas\FUP - Curso planificacion CUBA-002\presentaciones\014 Macrociclo.xlsx",
    r"G:\Mi unidad\Capacitaciones tomadas\FUP - Curso planificacion CUBA-002\presentaciones\016 meso-micro 4.xlsx",
    r"G:\Mi unidad\Capacitaciones tomadas\FUP - Curso planificacion CUBA-002\presentaciones\017 Meso-micro 5.xlsx",
    r"G:\Mi unidad\Capacitaciones tomadas\FUP - Curso planificacion CUBA-002\presentaciones\5 micros.xlsx"
]

for f in files:
    print("="*60)
    print("FILE:", f)
    wb = openpyxl.load_workbook(f, data_only=True)
    print("Sheets:", wb.sheetnames)
    for sname in wb.sheetnames:
        sheet = wb[sname]
        print(f"  Sheet {sname} ({sheet.max_row} x {sheet.max_column})")
        for r in range(1, min(sheet.max_row+1, 20)):
            row = [sheet.cell(r, c).value for c in range(1, min(sheet.max_column+1, 20))]
            if any(v is not None for v in row):
                print(f"    R{r:2d}: {[v for v in row if v is not None][:8]}")
