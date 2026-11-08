import openpyxl
import os

path1 = r"G:\Mi unidad\Capacitaciones tomadas\FUP - Curso planificacion CUBA-002\1-INTERCAMBIO URUGUAY - BARCELAN--5 al 20-8-2022\2-1-EJEMPLO MACROCICLO ATLETAS URUGUAY 13-14-8-2022\EJEMPLO MACROESTRUCTURA EXCEL 2022.xlsx"

if os.path.exists(path1):
    wb = openpyxl.load_workbook(path1, data_only=True)
    print("Sheets in EJEMPLO MACROESTRUCTURA EXCEL 2022:", wb.sheetnames)
    for sname in wb.sheetnames:
        sheet = wb[sname]
        print(f"Sheet {sname} ({sheet.max_row} x {sheet.max_column})")
        for r in range(1, min(sheet.max_row+1, 25)):
            vals = [sheet.cell(r, c).value for c in range(1, min(sheet.max_column+1, 20))]
            if any(v is not None for v in vals):
                print(f"  R{r}: {[v for v in vals if v is not None][:10]}")
