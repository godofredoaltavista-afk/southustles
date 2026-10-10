# UT Digitall — original assets and typography

Source design: [update portfolio dog](https://www.canva.com/design/DAHWnx-0-bg/tiGkwKMUjFQgnGyeTmeP6Q/edit), inspected read-only on 2026-10-10. Pages 1–11 use a 1920 × 1080 canvas. The original design was not edited or committed.

## Files

All 20 PNG exports supplied in the user's UT Digitall folder are preserved byte-for-byte under `app/UT/assets/originals/` with semantic names. Each has a WebP counterpart with its original dimensions and alpha channel. The JSON manifest records original filename, source page, role, dimensions, alpha range, byte sizes, SHA-256 and sampled opaque colors. Pages 1–11 are preserved as JPG composition references under `assets/references/`.

| Web asset | Canva page | Source PNG / layer | Dimensions |
| --- | --- | --- | --- |
| dna-3d.webp | 9 | update portfolio dog.png | 596 × 484 |
| dna-halftone.webp | 9 | update portfolio dog2.png | 1010 × 821 |
| logo-knot.webp | 3 | update portfolio dog3.png | 375 × 116 |
| logo-abstract.webp | 3 | update portfolio dog4.png | 395 × 99 |
| logo-somos.webp | 3 | update portfolio dog5.png | 499 × 183 |
| abstract-halftone-white.webp | 2 | update portfolio dog6.png | 489 × 448 |
| hero-copy-reference.webp | 2 | update portfolio dog7.png | 769 × 278 |
| birds-halftone.webp | 1, 5 | update portfolio dog8.png | 1920 × 1138 |
| huella-copy-reference.webp | 5 | update portfolio dog9.png | 510 × 414 |
| printer-halftone-black.webp | 4 | update portfolio dog10.png | 791 × 800 |
| brand-footer-reference.webp | 6 | update portfolio dog11.png | 1540 × 480 |
| printer-halftone-white.webp | 6 | update portfolio dog12.png | 701 × 709 |
| knot-3d.webp | 7 | update portfolio dog13.png | 616 × 706 |
| contact-banner-reference.webp | 7 | update portfolio dog14.png | 1805 × 283 |
| knot-halftone-black.webp | 7 | update portfolio dog15.png | 947 × 1085 |
| consulting-copy-reference.webp | 7 | update portfolio dog16.png | 1700 × 437 |
| social-banner-reference.webp | 8 | update portfolio dog17.png | 1230 × 531 |
| laptop.webp | 10 | update portfolio dog18.png | 1123 × 587 |
| abstract-3d.webp | 10 | update portfolio dog19.png | 857 × 740 |
| abstract-halftone-black.webp | 10 | update portfolio dog20.png | 1128 × 974 |

The assets with `reference` in their names contain flattened copy and serve as composition references. Rebuild live text in HTML. The laptop contains an authentic UT slide in its screen; that screen is part of the original mockup.

## Additional layers recovered from Canva

These files were downloaded from the exact media URLs observed on the corresponding original pages, with transparency retained. The browser preview and downloaded output were checked for printer and social composition identity.

| Web asset | Page | Original asset ID | Actual source dimensions |
| --- | --- | --- | --- |
| printer-3d.webp | 4, 6 | MAHWnHipQOU | 286 × 311 |
| social-3d.webp | 8 | MAHWnFoILoU | 299 × 300 |
| social-halftone-black.webp | 8 | MAHWnFoILoU, Canva rendered effect | 299 × 300 |
| knot-halftone-white.webp | 7 | MAHWnA_0q64, Canva rendered white effect | 226 × 259 |
| symbol-geometric.webp | 3, 7, 11 | MAHWnJwzLw4 | 126 × 118 |
| symbol-award.webp | 7, 8, 10 | MAHWnGo_70g | 94 × 97 |
| symbol-target.webp | 7 | MAHWnHyqwoI | 103 × 113 |
| photo-writing.webp | 2 | MAD1uoTtL9g | 2400 × 1141 |
| photo-workspace.webp | 4 | MADGx4815Do, Canva rendered grading | 1280 × 864 |

The Canva original metadata itself reports only 286 × 311 for the color printer, 299 × 300 for the social object and 226 × 259 for the knot. The supplied larger PNGs are rendered exports. No higher native resolution was invented or AI generated. Use the small white halftone knot as a supporting symbol. Downloaded indexed PNGs were decoded to RGBA before WebP conversion; their alpha channels were verified pixel-for-pixel.

The connector denied access to asset MAEK6pdnMyE, but its actual logo variants are already available in the user's original PNG exports. There are no unresolved asset gaps needed for the approved page compositions.

## Fonts and design tokens

The web fonts are self-hosted in `assets/fonts/`. Every file is a complete WOFF2 downloaded from the original official Canva font URL observed in its editor, rather than an approximate substitute.

| Filename | Actual family and variant | Source family ID |
| --- | --- | --- |
| helios-regular.woff2 | Helios Extended Regular | YAEw13FITIg |
| helios-bold.woff2 | Helios Extended Bold | YAEw13FITIg |
| noto-serif-italic.woff2 | Noto Serif Display Italic | YAFdJllHsUM |
| montserrat-regular.woff2 | Montserrat Regular | YADLjI9qxTA |
| montserrat-medium.woff2 | Montserrat Medium | YADLjI9qxTA |
| belleza-regular.woff2 | Belleza Regular | YADK3w_fTc4 |

Belleza is an additional source font discovered in the hero “Dejamos nuestra / huella”, and in “Dejá tu huella / Vuelva pronto”. It is preserved so the hero can match the original. The approved three principal families remain Helios Extended, Noto Serif Display and Montserrat.

Observed exact colors: cream `#f6e3c5`, blue `#2e62ad`, navy radial-gradient endpoint `#051e76`, yellow `#ffd15c`, white `#ffffff`. Do not mistake a sampled raster color in the manifest for an authoritative design token.

Observed font declarations at the original canvas:

- Helios Extended Bold main titles: 99.8857 px size, 104 px line height, −1.99771 px tracking, cream.
- Noto Serif Display Italic connective/editorial words: 60 px size, 84 px line height, white.
- Belleza Regular hero: 146.666 px size, 124 px line height, −2.93332 px tracking, blue.
- Montserrat Regular page 6 brand paragraph: 14.6667 px size, 22 px line height, near-white.
- Montserrat Regular page 7 communication paragraph: 28.3509 px size, 35 px line height, −0.0850527 px tracking, white.

These are Canva's observed CSS values; the element containers have additional source transforms. Preserve hierarchy and proportions when adapting to a responsive website. Element positions, dimensions and exact text are captured in `docs/ut-assets.layout.json`.

## Verification

- All 20 original PNGs have alpha channels and are copied without alteration.
- Every web variant preserves its source dimensions and transparency.
- WOFF2 signatures were checked for all downloaded font files.
- Color printer, social UI with hand and white knot were visually inspected.
- No generative imagery, fabricated client work or unverified photos were added.

Additional delivery files: `huella-perspective.webp` is a byte-for-byte alias of the original perspective text export; `share.jpg` is the original page 7 resized to 1200 × 675; `favicon.svg` embeds the original yellow geometric UT symbol without redrawing it.
