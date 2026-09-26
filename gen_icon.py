from PIL import Image, ImageDraw, ImageFont
import os

size = 256
img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

# 圆形背景 - 浅橙色 #FFD0A8
draw.ellipse([0, 0, size-1, size-1], fill=(255, 208, 168, 255))

# "时"字 - 米白色 #F5EAD6
font = None
font_paths = [
    "C:/Windows/Fonts/msyhbd.ttc",
    "C:/Windows/Fonts/msyh.ttc",
    "C:/Windows/Fonts/simhei.ttf",
    "C:/Windows/Fonts/STHeitiMedium.ttc",
]
for fp in font_paths:
    if os.path.exists(fp):
        try:
            font = ImageFont.truetype(fp, 150)
            break
        except:
            continue

if font is None:
    font = ImageFont.load_default()

text = "时"
bbox = draw.textbbox((0, 0), text, font=font)
tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
x = (size - tw) / 2 - bbox[0]
y = (size - th) / 2 - bbox[1] + 10
draw.text((x, y), text, fill=(245, 234, 214, 255), font=font)

out = os.path.join(os.path.dirname(__file__), "icon-256.ico")
img_resized = img.resize((256, 256), Image.LANCZOS)
img_resized.save(out, format='ICO', sizes=[(256, 256), (128, 128), (64, 64), (48, 48), (32, 32), (16, 16)])
print(f"Icon saved to: {out}")
