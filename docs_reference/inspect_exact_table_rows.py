import openpyxl

wb = openpyxl.load_workbook("docs_reference/Meso 4 micro.xlsx", data_only=True)
sheet = wb.active

print("CLASSIC ROWS (AQ to AS - 45a, 45b, 45c and later 68a, 68b, 68c):")
for r in range(91, 106):
    pct_label = sheet.cell(r, 42).value # col AP
    zone_num = sheet.cell(r, 41).value # col AO
    c_45a = sheet.cell(r, 43).value # AQ
    c_45b = sheet.cell(r, 44).value # AR
    c_45c = sheet.cell(r, 45).value # AS
    print(f"R{r:3d} (Zone={zone_num}, Pct={pct_label}): 45a={c_45a}, 45b={c_45b}, 45c={c_45c}")

print("\nPULLS ROWS:")
for r in range(108, 123):
    pct_label = sheet.cell(r, 42).value
    zone_num = sheet.cell(r, 41).value
    c_65a = sheet.cell(r, 43).value
    c_65b = sheet.cell(r, 44).value
    c_65c = sheet.cell(r, 45).value
    print(f"R{r:3d} (Zone={zone_num}, Pct={pct_label}): 65a={c_65a}, 65b={c_65b}, 65c={c_65c}")
