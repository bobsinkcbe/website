# Fonts for Bob's Tattoo

Place your custom brand wordmark font files here.

Recommended filenames:
- brand-wordmark.woff2 (preferred for web)
- brand-wordmark.otf (fallback)

After copying the files into this folder, no further changes are needed: the stylesheet already declares @font-face for `BrandWordmark` and the navbar logo text uses it automatically with fallback to `Pirata One`.

Tips:
- Use WOFF2 for best performance and compression.
- Keep file names exactly as above or update the `@font-face` paths in `css/styles-complete.css` accordingly.
