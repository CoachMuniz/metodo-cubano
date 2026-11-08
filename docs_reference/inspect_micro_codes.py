import openpyxl

wb = openpyxl.load_workbook("docs_reference/Meso 4 micro.xlsx", data_only=True)
sheet = wb.active

# Micro 1 is col I (9) to O (15)
# Micro 2 is col P (16) to V (22)
# Micro 3 is col W (23) to AC (29)
# Micro 4 is col AD (30) to AJ (36)

print("MICRO HEADERS:")
print("R9:", [sheet.cell(9, c).value for c in [8, 9, 16, 23, 30]])
print("R10:", [sheet.cell(10, c).value for c in [8, 9, 16, 23, 30]])
print("R11:", [sheet.cell(11, c).value for c in [4, 9, 16, 23, 30]])
print("R23:", [sheet.cell(23, c).value for c in [4, 9, 16, 23, 30]])
print("R35:", [sheet.cell(35, c).value for c in [4, 9, 16, 23, 30]])
print("R47:", [sheet.cell(47, c).value for c in [4, 9, 16, 23, 30]])
print("R59:", [sheet.cell(59, c).value for c in [4, 9, 16, 23, 30]])

# Let's check if the variant code in D11 applies to the whole meso or per micro:
print("D11:", sheet.cell(11, 4).value)
# Does col I11 have a code?
print("I11:", sheet.cell(11, 9).value)
