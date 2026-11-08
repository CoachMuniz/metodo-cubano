import openpyxl

wb = openpyxl.load_workbook("docs_reference/Meso 4 micro.xlsx", data_only=True)
sheet = wb.active

# Let's see columns from AQ (col 43) to ET (col 150)
print("Row 91 (codes):")
codes_classic = []
for c in range(43, 151):
    val = sheet.cell(91, c).value
    if val:
        codes_classic.append((openpyxl.utils.get_column_letter(c), val))
print(f"Total classic codes: {len(codes_classic)}")
print(f"First 10: {codes_classic[:10]}")
print(f"Last 10: {codes_classic[-10:]}")

print("\nRow 108 (pulls codes):")
codes_pulls = []
for c in range(43, 151):
    val = sheet.cell(108, c).value
    if val:
        codes_pulls.append((openpyxl.utils.get_column_letter(c), val))
print(f"Total pulls codes: {len(codes_pulls)}")
print(f"First 10: {codes_pulls[:10]}")
print(f"Last 10: {codes_pulls[-10:]}")
