import os
import json
from pathlib import Path

# Configuration
ROOT = Path(__file__).resolve().parents[1]
GALLERY_DIR = ROOT / 'assets' / 'images' / 'gallery'
MANIFEST_PATH = ROOT / 'assets' / 'gallery-manifest.json'

# Category folders to include
CANONICAL_CATEGORIES = [
    'animal', 'big', 'couples', 'realism', 'religious',
    'sleeve', 'small', 'students_work', 'fineline'
]

# Allow legacy folder alias 'thineline' to map into 'fineline'
ALIASES = {
    'fineline': ['fineline', 'thineline'],
    # Map BIG category folders (case variants) and legacy 'buddha' into canonical 'big'
    'big': ['big', 'BIG', 'buddha']
}

# Allowed image extensions
EXTS = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.JPG', '.JPEG', '.PNG', '.WEBP', '.GIF'}

def scan_category(cat: str):
    images = []
    folders = ALIASES.get(cat, [cat])
    for folder_name in folders:
        folder = GALLERY_DIR / folder_name
        if not folder.is_dir():
            continue
        for name in sorted(os.listdir(folder)):
            p = folder / name
            if p.is_file() and p.suffix in EXTS:
                # Construct src using actual folder on disk for correct path
                images.append(f"/assets/images/gallery/{folder_name}/{name}")
    return images


def build_manifest():
    manifest = { 'generatedAt': None, 'categories': {} }
    for cat in CANONICAL_CATEGORIES:
        manifest['categories'][cat] = scan_category(cat)
    return manifest


def main():
    manifest = build_manifest()
    # Use UTC timestamp string
    from datetime import datetime, timezone
    manifest['generatedAt'] = datetime.now(timezone.utc).isoformat()
    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(MANIFEST_PATH, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
    print(f"Wrote {MANIFEST_PATH}.")

if __name__ == '__main__':
    main()
