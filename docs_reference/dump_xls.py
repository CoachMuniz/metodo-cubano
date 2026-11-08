import xlrd

for fname in ["docs_reference/003 Carga real - Int. mesociclo - pronostico dep..xls"]:
    print("="*60)
    print("FILE:", fname)
    book = xlrd.open_workbook(fname)
    print("Sheets:", book.sheet_names())
    for sname in book.sheet_names():
        sh = book.sheet_by_name(sname)
        print(f"\nSheet {sname} ({sh.nrows} x {sh.ncols})")
        for r in range(min(sh.nrows, 35)):
            row = [sh.cell_value(r, c) for c in range(min(sh.ncols, 20))]
            if any(v != '' for v in row):
                print(f"  R{r:2d}: {[v for v in row if v != ''][:10]}")
