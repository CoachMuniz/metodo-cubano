import openpyxl
import json

wb = openpyxl.load_workbook("docs_reference/Meso 4 micro.xlsx", data_only=True)
sheet = wb.active

# 1. Classic Table: cols AQ (43) to ET (150)
# Rows:
# 91: code (e.g. 45a)
# 93: imr (e.g. 45)
# 94: variant ('a', 'b', 'c')
# 95: 50%
# 96: 60%
# 97: 65%
# 98: 70%
# 99: 75%
# 100: 80%
# 101: 85%
# 102: 90%
# 104: 95%

classic_intensities = [50, 60, 65, 70, 75, 80, 85, 90, 95]
classic_rows = [95, 96, 97, 98, 99, 100, 101, 102, 104]

classic_table = {}

for c in range(43, 151):
    code = sheet.cell(91, c).value
    if not code:
        continue
    code = str(code).strip()
    imr_val = sheet.cell(93, c).value
    var_val = sheet.cell(94, c).value
    
    dist = {}
    for intensity, row_idx in zip(classic_intensities, classic_rows):
        val = sheet.cell(row_idx, c).value
        if val is None or val == '-' or val == ' ' or val == '':
            dist[str(intensity)] = 0.0
        else:
            dist[str(intensity)] = float(val)
    
    total = sum(dist.values())
    classic_table[code] = {
        "imr": int(imr_val) if imr_val is not None else int(code[:-1]),
        "variant": str(var_val).strip() if var_val else code[-1],
        "code": code,
        "distribution": dist,
        "total": total
    }

# 2. Pulls Table: cols AQ (43) to ET (150)
# Rows:
# 108: code (e.g. 65a)
# 110: imr (e.g. 65)
# 111: variant ('a', 'b', 'c')
# 112: 70%
# 113: 80%
# 114: 85%
# 115: 90%
# 116: 95%
# 117: 100%
# 118: 105%
# 119: 110%
# 121: 115%

pulls_intensities = [70, 80, 85, 90, 95, 100, 105, 110, 115]
pulls_rows = [112, 113, 114, 115, 116, 117, 118, 119, 121]

pulls_table = {}

for c in range(43, 151):
    code = sheet.cell(108, c).value
    if not code:
        continue
    code = str(code).strip()
    imr_val = sheet.cell(110, c).value
    var_val = sheet.cell(111, c).value
    
    dist = {}
    for intensity, row_idx in zip(pulls_intensities, pulls_rows):
        val = sheet.cell(row_idx, c).value
        if val is None or val == '-' or val == ' ' or val == '':
            dist[str(intensity)] = 0.0
        else:
            dist[str(intensity)] = float(val)
            
    total = sum(dist.values())
    pulls_table[code] = {
        "imr": int(imr_val) if imr_val is not None else int(code[:-1]),
        "variant": str(var_val).strip() if var_val else code[-1],
        "code": code,
        "distribution": dist,
        "total": total
    }

print(f"Extracted {len(classic_table)} classic table entries.")
print(f"Extracted {len(pulls_table)} pulls table entries.")

with open("docs_reference/classic_intensity_table.json", "w", encoding="utf-8") as f:
    json.dump(classic_table, f, indent=2)

with open("docs_reference/pulls_intensity_table.json", "w", encoding="utf-8") as f:
    json.dump(pulls_table, f, indent=2)

print("Saved JSON files successfully!")
