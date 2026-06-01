"""压缩人格画像图片，目标 < 50KB 每张"""
import os, io
from PIL import Image

img_dir = r"D:\AI文件\sbtest\人格画像"
max_size_kb = 50
max_dim = 400  # 最大边长 400px，足够手机显示

for fname in os.listdir(img_dir):
    if not fname.lower().endswith(('.jpg', '.jpeg', '.png')):
        continue
    path = os.path.join(img_dir, fname)
    orig_size = os.path.getsize(path) / 1024

    img = Image.open(path)
    # 缩小尺寸
    w, h = img.size
    if w > max_dim or h > max_dim:
        ratio = max_dim / max(w, h)
        img = img.resize((int(w * ratio), int(h * ratio)), Image.LANCZOS)

    if img.mode == 'RGBA':
        bg = Image.new('RGB', img.size, (14, 9, 25))
        bg.paste(img, mask=img.split()[3])
        img = bg
    elif img.mode != 'RGB':
        img = img.convert('RGB')

    # 二分查找最优 quality（不破坏原图，用内存 buffer 测试大小）
    lo, hi = 10, 95
    best_q = 10
    for _ in range(12):
        mid = (lo + hi) // 2
        buf = io.BytesIO()
        img.save(buf, 'JPEG', quality=mid, optimize=True)
        sz = len(buf.getvalue()) / 1024
        if sz <= max_size_kb:
            best_q = mid
            lo = mid + 1
        else:
            hi = mid - 1

    img.save(path, 'JPEG', quality=best_q, optimize=True)
    final_size = os.path.getsize(path) / 1024
    print(f'{fname}: {orig_size:.0f}KB → {final_size:.0f}KB (q={best_q})')

print('\n压缩完成！')
