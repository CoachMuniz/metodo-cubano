import openpyxl
import json

wb = openpyxl.load_workbook("docs_reference/FORMATO MESO.xlsx", data_only=True)

# 1. Parse 'I.M.R - 3ª VERSION'
sheet1 = wb['I.M.R - 3ª VERSION']
print("Sheet 1 max_row:", sheet1.max_row, "max_column:", sheet1.max_column)

# Let's inspect rows around IMR 50 to 95
# Print all non-empty rows with their values
rows_data = []
for r in range(1, sheet1.max_row + 1):
    vals = [sheet1.cell(r, c).value for c in range(1, 20)]
    if any(v is not None for v in vals):
        rows_data.append((r, vals))

print(f"Total non-empty rows in sheet1: {len(rows_data)}")
for r, vals in rows_data[:30]:
    print(f"R{r:2d}: {[v for v in vals if v is not None][:10]}")
