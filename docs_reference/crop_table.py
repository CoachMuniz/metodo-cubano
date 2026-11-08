from PIL import Image

im = Image.open("docs_reference/68b TRADICIONAL.png")
w, h = im.size
print("Size:", w, h)

# The table is in the bottom left
# Approx: x from 0.03*w to 0.25*w, y from 0.55*h to 0.85*h
crop_box = (int(0.03 * w), int(0.55 * h), int(0.25 * w), int(0.85 * h))
cropped = im.crop(crop_box)
cropped.save("docs_reference/table_crop.png")
print("Saved table_crop.png")
