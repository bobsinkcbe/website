#!/usr/bin/env python3
"""
Scrape og:image thumbnails from Instagram permalinks and save local tiles.
- Reads assets/instagram.json (array of permalinks or {permalinks: []}).
- Downloads thumbnail for each link to assets/images/instagram/.
- Writes assets/instagram.json as { "items": [ { "image": <local>, "url": <permalink> }, ... ] }.

No Instagram token needed. Uses a desktop User-Agent. Works for public posts.
"""
import json
import os
import re
import sys
import time
import html
from urllib.parse import urlparse
from urllib.request import Request, urlopen

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JSON_PATH = os.path.join(ROOT, 'assets', 'instagram.json')
IMG_DIR = os.path.join(ROOT, 'assets', 'images', 'instagram')

UA = (
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
    '(KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
)

META_IMG_RE = re.compile(
    r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']',
    re.IGNORECASE,
)


def read_permalinks(path: str):
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    if isinstance(data, list):
        return [str(x).strip() for x in data if x]
    if isinstance(data, dict):
        if isinstance(data.get('permalinks'), list):
            return [str(x).strip() for x in data['permalinks'] if x]
        if isinstance(data.get('items'), list):
            # Already items
            return []
    return []


def fetch_html(url: str) -> str:
    req = Request(url, headers={'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9'})
    with urlopen(req, timeout=20) as resp:
        charset = resp.headers.get_content_charset() or 'utf-8'
        return resp.read().decode(charset, errors='ignore')


def download_image(url: str, out_path: str):
    req = Request(url, headers={'User-Agent': UA, 'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8'})
    with urlopen(req, timeout=30) as resp:
        if resp.status != 200:
            raise RuntimeError(f'Bad status: {resp.status}')
        data = resp.read()
    with open(out_path, 'wb') as f:
        f.write(data)


def code_from_permalink(url: str) -> str:
    # Handles /p/<code>/, /reel/<code>/, /tv/<code>/
    try:
        parts = urlparse(url)
        seg = [s for s in parts.path.split('/') if s]
        if len(seg) >= 2:
            return seg[1]
    except Exception:
        pass
    return str(int(time.time()*1000))


def main():
    if not os.path.exists(JSON_PATH):
        print('Missing assets/instagram.json')
        sys.exit(1)

    permalinks = read_permalinks(JSON_PATH)
    if not permalinks:
        print('No permalinks to process or already items present.')
        sys.exit(0)

    os.makedirs(IMG_DIR, exist_ok=True)

    items = []
    for url in permalinks:
        try:
            html_text = fetch_html(url)
            m = META_IMG_RE.search(html_text)
            if not m:
                print(f'No og:image for {url}')
                continue
            img_url = html.unescape(m.group(1))
            # Choose extension
            ext = '.jpg'
            lower = img_url.lower()
            if '.png' in lower:
                ext = '.png'
            elif '.webp' in lower:
                ext = '.webp'
            code = code_from_permalink(url)
            filename = f'og_{code}{ext}'
            out_path = os.path.join(IMG_DIR, filename)
            public_path = f'assets/images/instagram/{filename}'
            if not os.path.exists(out_path):
                download_image(img_url, out_path)
                # Tiny delay to be polite
                time.sleep(0.3)
            items.append({'image': public_path, 'url': url})
            print(f'Downloaded: {public_path}')
        except Exception as e:
            print(f'Error processing {url}: {e}')

    if items:
        out = {'items': items}
        with open(JSON_PATH, 'w', encoding='utf-8') as f:
            json.dump(out, f, indent=2)
        print(f'Wrote {len(items)} items to assets/instagram.json')
    else:
        print('No items written')


if __name__ == '__main__':
    main()
