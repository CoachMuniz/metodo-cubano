import openpyxl

wb = openpyxl.load_workbook("docs_reference/Meso 4 micro.xlsx", data_only=True)
sheet = wb.active

print("Searching non-empty regions in Meso (12)...")
blocks = {}
for r in range(1, sheet.max_row+1):
    for c in range(1, sheet.max_column+1):
        v = sheet.cell(r, c).value
        if v is not None:
            r_block = (r // 20) * 20
            c_block = (c // 20) * 20
            blocks[(r_block, c_block)] = blocks.get((r_block, c_block), 0) + 1

for k, count in sorted(blocks.items()):
    print(f"Block R{k[0]}-{k[0]+19}, C{k[1]}-{k[1]+19}: {count} non-empty cells")
