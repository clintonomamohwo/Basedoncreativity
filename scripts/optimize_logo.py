from pathlib import Path
from PIL import Image

ROOT = Path('/home/ubuntu/Basedoncreativity')
PAIRS = [
    (ROOT / 'src/assets/boc_logo.png', ROOT / 'src/assets/boc_logo.webp'),
    (ROOT / 'public/bochq-logo.png', ROOT / 'public/bochq-logo.webp'),
]

for png_path, webp_path in PAIRS:
    with Image.open(png_path) as image:
        rgba_image = image.convert('RGBA')
        rgba_image.save(
            png_path,
            format='PNG',
            optimize=True,
            compress_level=9,
        )
        rgba_image.save(
            webp_path,
            format='WEBP',
            quality=82,
            method=6,
            lossless=False,
        )

print('Optimized logo assets and generated WebP fallbacks.')
