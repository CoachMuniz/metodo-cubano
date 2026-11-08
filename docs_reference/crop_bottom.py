from PIL import Image

im = Image.open("docs_reference/68b TRADICIONAL.png")
w, h = im.size

# Crop specifically the 2 microcycle section and below
crop_box = (int(0.08 * w), int(0.85 * h), int(0.25 * w), int(0.99 * h))
cropped = im.crop(crop_box)
cropped.save("docs_reference/table_crop_bottom.png")
print("Saved table_crop_bottom.png")
