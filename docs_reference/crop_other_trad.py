from PIL import Image

for fname in ["75C TRADICIONAL.png", "68b propuesto.png"]:
    im = Image.open(f"docs_reference/{fname}")
    w, h = im.size
    crop_box = (int(0.03 * w), int(0.55 * h), int(0.28 * w), int(0.99 * h))
    cropped = im.crop(crop_box)
    cropped.save(f"docs_reference/{fname}_crop.png")
    print(f"Saved {fname}_crop.png")
