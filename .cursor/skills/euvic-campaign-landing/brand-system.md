# Euvic Brand System — extracted from this repo

Canonical source: `src/app/globals.css`, `src/app/layout.tsx`, and the component files under `src/components/`. Never copy values from the Figma file or `.com` site — this file is the truth for the landing codebase.

**Figma-driven implementation (exception).** When the task is explicitly a **Figma-fidelity build** (see `euvic-campaign-landing` skill → **Campaign intent: Playbook vs Figma-fidelity**), treat the **agreed Figma file** as the source of truth for **page structure and all visible user copy** in that deliverable. For **visual styling**, still **map** colours, radii, spacing, and type roles from Figma nodes to the **nearest** token or pattern in this document and `globals.css` — do not introduce arbitrary one-off hexes or extra fonts. The rule above (“never copy values from the Figma file”) still means: do not treat random Figma files or the public `.com` site as canonical for **repo-wide** tokens; only the **campaign file the user locked** plus this document govern that build.

## 1. Typography

- Font family: **Inter** (via `next/font/google` in `src/app/layout.tsx`, exposed as CSS var `--font-body`, aliased to `--font-sans` in Tailwind's `@theme`).
- `body` stack: `var(--font-body), "Inter", system-ui, sans-serif`.
- OpenType features enabled globally: `"ss01", "cv11"`.
- Do not import additional fonts. Marketing-supplied display faces must be declined or converted to Inter with weight/tracking adjustments.

### Type scale (fluid, via `clamp`)

| Role | CSS |
|------|-----|
| PageHero H1 | `text-[clamp(1.625rem,3.8vw,3.25rem)] font-bold leading-[1.14] tracking-tight text-balance` |
| Homepage Hero H1 | `text-[clamp(1.75rem,4.2vw,3.5rem)] font-bold leading-[1.12] tracking-tight text-balance` |
| Section H2 | `text-[clamp(1.8rem,4vw,3.2rem)] font-bold leading-tight` |
| CTA H2 | `text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.1]` |
| Card H3 | `text-base md:text-lg font-bold` (or `text-xl md:text-2xl` for features) |
| Body | `text-sm md:text-base` or `text-base md:text-lg` for lead paragraphs |
| Kicker / eyebrow | `text-[0.65rem] md:text-xs font-semibold tracking-[4px] md:tracking-[5px] uppercase` |
| Footnote / source | `text-[0.65rem] md:text-xs italic` |

Paragraphs of length ≥ 2 lines get `text-pretty`; titles get `text-balance`.

## 2. Colour tokens (defined in `@theme` in `globals.css`)

| Token | Hex | Use |
|-------|-----|-----|
| `--color-bg` | `#F9FAFD` | Default / "white" section bg (NOT pure white). |
| `--color-bg-card` | `#ffffff` | `surface-card` fill. |
| `--color-bg-dark` | `#323639` | Dark gray text on lights; same as footer. |
| `--color-bg-hero` | `#003B73` | Reserved hero blue fallback. |
| `--color-euvic` | `#0072CE` | Primary brand blue — icons, inline accents, borders. |
| `--color-euvic-light` | `#3d94db` | Gradient / hover. |
| `--color-euvic-dark` | `#005ba3` | Deeper variant. |
| `--color-euvic-glow` | `rgba(0,114,206,0.12)` | Soft glow behind accents. |
| `--color-euvic-cyan` | `#00b8d4` | Accent on pillars/tags (rare). |
| `--color-text-primary` | `#1a1a2e` | Body headings on light bg. |
| `--color-text-secondary` | `#4a5568` | Body paragraphs on light bg. |
| `--color-text-dim` | `#718096` | Meta / sources / footnotes. |
| `--color-text-on-dark` | `#ffffff` | Text on blue/footer. |
| `--color-text-on-dark-secondary` | `#b0bdd0` | Muted on dark. |
| `--color-text-on-dark-dim` | `#8494ab` | Legal / tertiary on dark. |
| `--color-footer-bg` | `#323639` | Footer + kicker grey. |
| `--color-border` | `rgba(0,0,0,0.08)` | Card borders. |
| `--color-border-hover` | `rgba(0,114,206,0.3)` | Card hover border. |
| `--color-section-gray` | `#f7f8fa` | Secondary light tint (rare). |

### Raw hexes that appear in JSX (allowed)

| Hex | Where | Meaning |
|-----|-------|---------|
| `#0E6CAB` | PageHero left figure, CTA left figure, Hero left figure, Navbar scrolled (`glass-panel`), `.text-gradient` accent color | Primary "Euvic" hero/surface blue. |
| `#0870B2` | Right figure on PageHero / Hero / CTA; CTA outer bg | Slightly darker hero blue. |
| `#003B73` | Hero button text on white; legacy dark hero fallback | Deep brand blue. |
| `#F3F3F3` / `#F1F1F1` | `DiagonalBg` left/right figures (default) | Neutral gray diagonal. |

Do not invent new hexes for campaigns. If marketing hands you a brand-off hex, round it to the nearest token above.

## 3. Section background rhythm

Pages alternate one of two motifs:

### Motif A — "White" section

```tsx
<section className="relative py-16 md:py-36 bg-[var(--color-bg)] overflow-hidden">
  …
</section>
```

### Motif B — Diagonal gray section

```tsx
<section className="relative py-16 md:py-36 overflow-hidden">
  <DiagonalBg />
  {/* content wrapped in z-10 */}
</section>
```

`DiagonalBg` (see `src/components/DiagonalBg.tsx`) is two polygons splitting at `55% 0 → 73% 100%`, colours `#F3F3F3` / `#F1F1F1`. Never render it outside an `overflow-hidden relative` wrapper.

## 4. Hero DNA (two-figure blue) — two variants

The two-figure blue motif comes in **two clip-path variants**. Pick the right one for the section type — using the wrong one is the most common reason a generated landing "looks broken".

### 4.1 — Hero variant (with the 5% step)

Used **only** in `Hero.tsx` / `PageHero.tsx` (i.e. the page-opening hero canvas). The left figure intentionally falls 5% short of the bottom, creating a small "step" that reads as the hero "anchoring" the page above whatever comes next.

- Left figure: `backgroundColor: "#0E6CAB"`, `clipPath: "polygon(0 0, 40% 0, 60.9% 95%, 0 95%)"` — ends 5% before bottom.
- Right figure: `backgroundColor: "#0870B2"`, `clipPath: "polygon(40% 0, 100% 0, 100% 100%, 62% 100%)"` — extends to bottom.
- Shared diagonal exact: from `(40% 0)` to `(60.9% 95%)`. Must not leak a white seam.

### 4.2 — CTA / section-blue variant (no step)

Used by **every other blue-canvas section** — registration / CTA / quote / mid-page banner. **No step.** Both figures extend all the way to the bottom along the same diagonal.

- Left figure: `backgroundColor: "#0E6CAB"`, `clipPath: "polygon(0 0, 40% 0, 62% 100%, 0 100%)"`.
- Right figure: `backgroundColor: "#0870B2"`, `clipPath: "polygon(40% 0, 100% 0, 100% 100%, 62% 100%)"`.
- Shared diagonal exact: from `(40% 0)` to `(62% 100%)` — derived from the Hero diagonal so the visual tilt stays consistent.

> **Anti-pattern:** copying the Hero clip-path into a registration / CTA section. The 5% step exposes a slim white triangle in the bottom-left and reads as a layout bug. This was the #1 issue in the cyberbezpieczenstwo landing.

### 4.3 — Shared bits (both variants)

- Grid overlay: `<div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" />` (CTA/PageHero) or `opacity-20` (Hero).
- Decorative chevrons in the bottom-right of the **Hero only** (skip on CTA-style sections):
  ```tsx
  <ChevronArrows
    className="animate-chevron-shimmer"
    color="rgba(255,255,255,0.4)"
    secondColor="rgba(255,255,255,0.85)"
    count={14}
  />
  ```
  Placement: `absolute bottom-8 md:bottom-12 right-8 md:right-16 opacity-70 pointer-events-none hidden md:block z-10`.

Global CSS in `globals.css` forces every `h1`, `h1 span`, and `p` inside a `.euvic-hero` container to pure white and strips italic. Plan copy accordingly — no manual accent colour will survive.

Campaign pages use `PageHero` only (variant 4.1) for the opener and the CTA-style variant (4.2) for any mid-/end-page blue blocks.

## 5. Named classes / primitives

| Class | Source | Purpose |
|-------|--------|---------|
| `.surface-card` | `globals.css` | White card on light bg, auto borders + shadow + hover lift. Prefer over custom shadows. |
| `.surface-card-dark` | `globals.css` | Glass card for blue bg / CTA. |
| `.glass-panel` | `globals.css` | Solid `#0E6CAB` — used by Navbar on scroll. Don't misuse for cards. |
| `.btn-premium` | `globals.css` | Pill button with hover lift + glow. Required on all CTAs. |
| `.text-gradient` | `globals.css` | Solid Euvic blue (`#0E6CAB`) accent on light bg. (The historical gradient was removed; keep the class name for consistency.) |
| `.bg-grid` | `globals.css` | Subtle grid overlay (white on blue). Use inside the hero canvas, opacity 15–20%. |
| `.glow-line` | `globals.css` | Thin horizontal shimmer divider. Optional. |
| `.animate-chevron-shimmer` | `globals.css` | Chevron decorative pulse. |
| `.animate-float` | `globals.css` | 7.2s float for medallions. Use sparingly. |

## 6. Decorative component primitives

### `<ChevronArrows />`

Props: `{ count?: number; color?: string; secondColor?: string; className?: string }`.

The shape **MUST** be the rounded chevron defined in `src/components/ChevronArrows.tsx`. Plain CSS triangles (`border-left: 5px solid currentColor`) are an anti-pattern and read as wireframe-grade — they're the second most common defect in generated landings.

#### Source SVG (verbatim — copy into HTML deliverables)

Each chevron is one of these `<svg>` elements. They line up in a flex row with `gap: 10px`.

```html
<svg width="14" height="18" viewBox="0 0 13.2 18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path
    d="M 1.6 1.6 Q 0 2.7 0 4.4 L 0 13.6 Q 0 15.3 1.6 16.4 L 11.6 10.6 Q 13.2 9.7 13.2 9 Q 13.2 8.3 11.6 7.4 Z"
    fill="currentColor"
  />
</svg>
```

For React, use the existing component (`@/components/ChevronArrows`). For HTML deliverables, build a row of N chevrons inside a `.chevron-arrows` flex container, each with its own `<svg>`. To get the two-tone effect, alternate the colour by selecting `:nth-child(2n)` (see `templates/campaign-landing.html`).

Default placements used across the codebase:

- **Kicker row** (inside an `AnimatedSection` above an H2): 6 chevrons, single tone, `color="var(--color-text-dim)"`, opacity 0.6.
- **Inside blue hero, next to the kicker**: 6 chevrons, `color="rgba(255,255,255,0.75)"`.
- **Decorative ribbon — bottom-right corner of Hero only (mandatory)**: 14 chevrons, two-tone (`rgba(255,255,255,0.4)` + `rgba(255,255,255,0.85)`), with `animate-chevron-shimmer`. Skip on CTA / blue mid-page sections.
- **List bullets** (e.g. "What you'll learn"): 2 chevrons, `color="var(--color-euvic-blue)"`, opacity 0.6.

Never replace these with Unicode arrows (›, →), CSS triangles, or custom paths.

### `<AnimatedSection />`

Props: `{ delay?: number; direction?: "up" | "left" | "right" | "none"; className?: string }`. Wraps any block that should animate in on scroll. Uses `whileInView` with `once: true`, `amount: "some"`, `margin: "0px 0px -5% 0px"` — configured to fire as soon as the block peeks into the viewport (don't reconfigure this).

### `<DiagonalBg />`

Props: `{ left?: string; right?: string; className?: string }`. Leave defaults unless marketing demands. Must be the first child of a `relative overflow-hidden` section.

### `<PageHero />`

Props: `{ kicker: string; title: React.ReactNode; subtitle: string }`. The only hero allowed on campaign pages.

`title` accepts JSX so you can wrap your accent word in `<span className="text-gradient italic">`, but remember the global CSS will render it white + non-italic (deliberate). If the campaign wants a second-line softer sub-phrase, use `<span className="text-white/75 font-light">` — as done on `why-euvic`.

### `<CTA />`

Props: `{ questions?: string[]; onContactOpen?: (prefill?: string) => void }`. Falls back to `useContact()` context. Campaign pages should pass 3 questions specific to the campaign's desired conversation.

### `<FAQ />`

Props: `{ items?: {question: string, answer: string}[]; variant?: "white" | "diagonal" }`. Pass `variant` that fits the section rhythm around it.

## 7. Motion tokens

Defined as CSS vars in `@theme`:

- `--motion-ease-premium: cubic-bezier(0.16, 1, 0.3, 1)` — hero & headline entries.
- `--motion-ease-soft: cubic-bezier(0.22, 1, 0.36, 1)` — scroll / card reveals.
- `--motion-duration-fast: 260ms` — hovers.
- `--motion-duration-medium: 460ms` — reveals.
- `--motion-duration-slow: 720ms` — hero intro.

Framer Motion uses the tuple `[0.22, 1, 0.36, 1]` (see `PageHero.tsx`); use that value for any bespoke transitions.

## 8. Page wrapper contract

Every campaign page is a single default-exported React component that returns:

```tsx
<PageWrapper>
  <PageHero ... />
  {/* alternating sections */}
  <CTA ... />
</PageWrapper>
```

`PageWrapper` provides `ContactContext` via `useContact()`. Any button anywhere inside can do:

```tsx
const { openContact } = useContact();
<button className="btn-premium …" onClick={() => openContact("I want to join the X webinar")}>…</button>
```

The `prefill` string lands in the contact modal's message field.

## 9. Logo & images — always inline as base64 in deliverables

The full policy lives in `assets.md`. Cliff-notes:

- **HTML deliverables (single-file campaign landings)**: every raster asset MUST be embedded as a `data:image/...;base64,…` URL inside `src=""`. No external file references — they break the moment the file is forwarded by email or moved between OneDrive folders.
- **Pre-encoded Euvic logo** lives at `assets/euvic-logo.base64.txt` (≈40 KB). Read that file and paste the entire data URL into the `<img src="…">` of the navbar and footer. **Never inline that 40 KB string into `SKILL.md` or any other reference file** — keep it isolated.
- For dark backgrounds (Hero, Footer, Navbar) keep the `style="filter: brightness(0) invert(1);"` trick — same convention used in `Footer.tsx` and `Navbar.tsx`.
- **React deliverables that ship as a page inside `src/app/`**: `next/image` from `public/` is fine. Use base64 only when the page must remain portable (one-off marketing artefact).
- **Decorative SVGs** (chevrons, icons, dividers) → inline `<svg>` markup, NOT base64.
- **Backgrounds** → CSS gradients / `clip-path` polygons. No raster backgrounds.
- Speaker / partner photos → encode and inline (see `assets.md` for the exact `base64` command). Downscale to ≤200 KB per image first.
- `next/image` example for in-app pages:
  ```tsx
  <Image src="/euvic-logo.png" alt="Euvic" width={100} height={30} priority className="h-6 w-auto brightness-0 invert" />
  ```
- Campaign imagery for in-app pages goes under `public/campaigns/<slug>/...`. Always supply meaningful `alt`.
- Client logos live in `public/clients/` and are already consumed by `SocialProof`. Reuse that component rather than rebuilding a marquee.

## 10. Responsive breakpoints

This project uses Tailwind defaults:

- `md:` → `≥ 768px`
- `lg:` → `≥ 1024px` (used rarely)

Container width convention: `max-w-7xl mx-auto px-5 md:px-10` for full-width sections, `max-w-3xl` for text-heavy narrative, `max-w-4xl` for hero title, `max-w-5xl` for timeline-like blocks.

## 11. Iconography — no emojis, ever

Every visual marker is an inline `<svg>` from the brand icon library at `icon-library.md`. Emojis (🏆, 🔍, ✅, ✨, 🎯, 🚀 …) read as informal/consumer and break the brand voice — they're banned on every Euvic surface.

The icon library covers calendar/clock/mail/check/award/shield/lock/search/target/lightbulb/users/chart/file/download/play/chat/alert/rocket/arrow plus 1:1 emoji-replacement mapping. Style contract: 24×24 viewBox, `stroke="currentColor"`, `stroke-width="1.5"`, rounded caps/joins. Matches the icons already shipped on `why-euvic`, `ai-transformation`, and the Footer.

If you can't find a 1:1 mapping, source another Lucide-style line icon and conform it to the contract. Never fall back to an emoji "to save time".

## 12. Accessibility guardrails

- All decorative chevrons / figures are `aria-hidden` or `pointer-events-none`.
- Hero background video (`HeroVideo.tsx`) is `playsInline`, `muted`, `loop`, and carries an `aria-label`. If a campaign requests a video, mirror those attributes.
- Animations respect `prefers-reduced-motion` via the media query at the end of `globals.css` — don't add new `@keyframes` without similar guards.
- Ensure contrast: body text on `#F9FAFD` uses `--color-text-secondary` (#4a5568) or darker; on blue bg use `text-white` or `text-white/80`.
