import json

with open("docs_reference/classic_intensity_table.json", "r") as f:
    classic = json.load(f)

with open("docs_reference/pulls_intensity_table.json", "r") as f:
    pulls = json.load(f)

print("Verifying classic entries:")
sum_err = 0
for code, entry in classic.items():
    s = sum(entry["distribution"].values())
    imr_nominal = entry["imr"]
    calc_imr = sum(float(k) * v for k, v in entry["distribution"].items()) / 100.0
    if abs(s - 100.0) > 0.001:
        print(f"Classic {code} sum is not 100%: {s}")
        sum_err += 1

print(f"Total classic sum errors: {sum_err}")

sum_err_pulls = 0
for code, entry in pulls.items():
    s = sum(entry["distribution"].values())
    imr_nominal = entry["imr"]
    calc_imr = sum(float(k) * v for k, v in entry["distribution"].items()) / 100.0
    if abs(s - 100.0) > 0.001:
        print(f"Pulls {code} sum is not 100%: {s}")
        sum_err_pulls += 1

print(f"Total pulls sum errors: {sum_err_pulls}")
