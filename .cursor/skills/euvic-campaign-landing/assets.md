# Image & logo policy — always inline, always base64

The marketing team ships campaign landings as **single-file deliverables** (HTML zipped, or a single `.tsx` file inside the Next.js app). External assets break the moment a file is forwarded by email, opened from OneDrive, or moved between folders. **Never reference an image by relative path** in a deliverable; always inline as a `data:` URL.

## Hard rules

1. **Logos** (Euvic, partner brands) → base64 `data:image/png;base64,…` URL inside the `src=""` attribute.
2. **Photos** (speakers, customers, products) → base64 if ≤200 KB each; if larger, downscale first (target longest edge 800 px @ 75% JPEG quality).
3. **Decorative SVGs** (chevrons, icons, divider shapes) → inline `<svg>` element (NOT base64). See `icon-library.md`.
4. **Backgrounds** → use CSS gradients / `clip-path` polygons. Avoid raster background images.
5. **Favicons** for HTML deliverables → inline `link rel="icon"` with a base64 PNG.
6. **No `next/image`** in HTML deliverables, obviously. In `.tsx` deliverables that live inside `src/app/`, prefer `next/image` for files that are already in `public/`; only fall back to base64 when the page is a one-off marketing artefact that must be portable.

## How to embed

### HTML

```html
<img
  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA…"
  alt="Euvic"
  style="height:28px;width:auto;filter:brightness(0) invert(1);"
/>
```

The `filter:brightness(0) invert(1)` trick keeps the logo white on dark backgrounds (Hero / Footer) without needing a separate white asset — same convention used in `Footer.tsx` and `Navbar.tsx`.

### React (.tsx)

Define the data URL once at module top, then pass it to a normal `img` (not `next/image` — base64 is incompatible with the loader).

```tsx
const EUVIC_LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA…";
…
<img src={EUVIC_LOGO} alt="Euvic" className="h-7 invert" />
```

## Pre-encoded assets

| Asset | File | Size |
|-------|------|------|
| Euvic master logo (PNG, transparent bg) | `assets/euvic-logo.base64.txt` | ~40 KB encoded |

**Workflow when you need the logo:** read `assets/euvic-logo.base64.txt`, copy the entire `data:image/png;base64,…` string into the deliverable. Do **not** hard-code the long string into `SKILL.md` or paste it into chat — keep it isolated to the asset file so the skill stays small in context.

## Encoding new assets on the fly

For partner logos and speaker headshots that come with each campaign:

```bash
# macOS / Linux
{
  printf 'data:image/png;base64,'
  base64 -i path/to/logo.png   # macOS
  # or: base64 -w0 path/to/logo.png   # Linux
} > assets/<name>.base64.txt
```

For JPGs swap the prefix to `data:image/jpeg;base64,`. For SVGs you almost never need base64 — paste the SVG markup directly.

## Size budget

A campaign HTML page should stay **under ~250 KB total** to keep paste-into-Outlook workflows snappy. Rough budget:

- HTML + CSS + JS: 30–60 KB
- Euvic logo (base64): 40 KB
- Partner logo (base64): 20–60 KB
- 3–4 speaker photos (base64, downscaled): 40–80 KB total
- Inline SVG icons: <5 KB total

If you blow the budget, downscale photos before encoding. Never reference `unsplash.com` or any other CDN — campaigns are sometimes opened on intranet machines without external network access.
