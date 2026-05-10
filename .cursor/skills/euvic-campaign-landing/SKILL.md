---
name: euvic-campaign-landing
description: Generates on-brand marketing landing pages (campaign pages, themed promo pages, event/webinar pages) for Euvic. Outputs either a Next.js page inside src/app/campaigns/... OR a standalone single-file HTML deliverable. Supports three intents — Playbook campaign (skeleton + editorial copy), Figma + brand chrome (Figma copy/sections + Euvic Hero 4.1, Inter-first, DiagonalBg rhythm, CTA 4.2), and Figma 1:1 design master (pixel/spec parity from Figma MCP; typography, spacing, colors, hero, chrome from the file — see SKILL § Campaign intent). Figma MCP flow — get_metadata → use_figma (characters) → get_design_context → get_screenshot. Use for new campaign landings, microsites, webinar pages, standalone HTML, or implementation from a Figma URL.
---

# Euvic Campaign Landing Generator

This skill scaffolds marketing landing pages for campaigns. **Playbook** and **Figma + brand chrome** reuse the shipped Euvic system (Hero DNA, Inter-first typography, DiagonalBg rhythm, tokens). **Figma 1:1 (design master)** prioritises the Figma file as the visual spec and uses MCP output for layout, type, colour, and assets — see **Campaign intent** and **Hard rules — applicability**.

## Two delivery modes

Decide up-front, before writing a single line:

| Mode | When to use | Output |
|------|-------------|--------|
| **A. React page** (default) | Campaign lives on `euvic.com/campaigns/<slug>` and is part of the Next.js app. | **Playbook + Figma + brand chrome:** `page.tsx` from `templates/campaign-page.tsx`. **Figma 1:1:** implement frames in `page.tsx` (template optional). |
| **B. Standalone HTML** | Marketing wants a single file they can email, host on a partner CMS, paste into a third-party landing builder, or send via WeTransfer. Typical for cybersecurity or partner webinar one-pagers in this repo. | **Playbook + Figma + brand chrome:** `index.html` from `templates/campaign-landing.html`. **Figma 1:1:** same deliverable shape (single file, base64 assets) but markup/CSS matches Figma frames. |

Both delivery modes (React vs HTML) follow the **same intent** (see below); the markup differs (TSX/Tailwind vs HTML/vanilla CSS). Section blueprints below show the React form for **Playbook**; HTML equivalents are pre-baked into `templates/campaign-landing.html`.

## Campaign intent: Playbook vs Figma

Before **Step 2 — Intake**, pick exactly **one** intent. The **Section Playbook**, default skeleton, and editorial **Copy rules** apply to **Playbook campaign** only.

| Intent | Source of truth | When to use |
|--------|-----------------|-------------|
| **Playbook campaign** | Marketing brief + Section Playbook + `company-facts.md` for legal/firm numbers | Greenfield page, copy in chat/docs, no Figma file as master. |
| **Figma + brand chrome** | Figma: sections + **visible text**. Visuals: **Brand campaign shell** (PageHero 4.1, chevron ribbon, CTA 4.2, Inter-first, DiagonalBg rhythm, tokens, `PageWrapper` / HTML template chrome). | Figma drives **structure and copy**; page still looks like a standard Euvic campaign (nested in site system). |
| **Figma 1:1 (design master)** | Figma: **full design spec** — typography, spacing, colours, radii, effects, hero, nav, footer, icons/assets, breakpoints as in file. Copy: **`use_figma` `characters`**; layout numbers from **`get_design_context`** / Dev Mode (literal `px`/`gap`/fills). **Do not** remap to Playbook Hero, Inter-only, alternating DiagonalBg, or `brand-system` tokens unless they match Figma exactly. | User wants **pixel/spec parity** with the Figma file (e.g. webinar landings, partner one-pagers). Use Figma MCP end-to-end; screenshot-diff before sign-off. |

Default when the user says “from Figma” without qualification: confirm in intake — **brand chrome** vs **1:1 design master**. If they say **1:1**, **as designed**, **pixel perfect**, or **match Figma**, treat as **Figma 1:1**.

### Figma — shared rules (all Figma intents)

These override **Playbook** for **structure and copy**. **Figma 1:1** also follows **§ Figma 1:1 — engineering checklist** below (visual parity).

1. **Verbatim copy.** Every user-visible string must match **`use_figma` / `TextNode.characters`** (after `figma.loadFontAsync` for that node’s font) — spelling, punctuation, line breaks where relevant, diacritics, spaces. **Do not** paraphrase or apply **Playbook copy rules** unless Figma already matches them. **Exception:** legal/firm facts cited on the page → **verbatim** from `company-facts.md`.

2. **No invented sections or labels.** Section order = agreed frames / `node-id` list from **`get_metadata`**. **Do not** add Playbook-only blocks, eyebrow+kicker rows, or headings not present as visible text in that frame. **Layer names** are not public copy unless marketing says so.

3. **`get_design_context` is not canonical for strings.** Use it for **layout**, exported code hints, spacing classes, and **asset URLs**. Strings in that output may be wrong — **overwrite** from **`use_figma`** after reconciliation.

4. **`polish-layer.md`** — opt-in only per user request or visible Figma behaviour. No polish that adds copy or sections missing from Figma.

### Figma 1:1 — engineering checklist (visual parity)

1. **Fonts** — Load every `fontFamily` / weight used in shipped text (Google Fonts, `next/font`, local `@font-face`, or Figma export). **Do not** substitute Inter for a Figma display face.
2. **Spacing & size** — Derive padding, gap, max-width, line-height, and breakpoints from **`get_design_context`** (e.g. `px-[203px]`, `gap-[50px]`) and/or Dev Mode; mirror the agreed frame width (often 1920) unless the user specifies another reference.
3. **Colour & effects** — Use fills, strokes, opacity, shadows, blurs, and radii from Figma layers; **do not** replace with `brand-system` / `globals.css` tokens unless values match.
4. **Hero / nav / footer / forms** — Implement what is in the frames; **do not** inject template Hero 4.1, mandatory chevron ribbon, CTA 4.2 clip-paths, or template nav/footer unless those elements exist in Figma (or user chose **Figma + brand chrome**).
5. **Icons & imagery** — Use MCP/exported raster/SVG from the file. **Do not** swap Figma marks for `icon-library` unless they are the same asset.
6. **Decorative vectors** — Prefer SVG/path from design export; never fake arrows with CSS triangle borders. The **rounded ChevronArrows path from `brand-system.md` is optional for 1:1** — only if the design uses that shape.
7. **Emojis** — If a text layer’s `characters` include emoji, ship them for 1:1; **do not add** emoji Figma does not show.
8. **React `PageWrapper`** — For 1:1 standalone campaign views, implement chrome from Figma. Use shared site wrapper only when the user accepts deviation or the route must inherit global nav/footer.
9. **QA** — **`get_screenshot`** side-by-side with the build at desktop (and mobile if separate frames exist); fix spacing and missing layers before done.

### Figma MCP checklist (order)

After Figma MCP is available and authenticated:

1. Parse URL → `fileKey` + `node-id` (`…?node-id=1-2` → `1:2`).
2. **`get_metadata`** → lock **ordered section frames** before markup.
3. **`use_figma`** → collect **`characters`** for every text node that ships; this list **wins** over `get_design_context` strings.
4. **`get_design_context`** per section (split if too large) → layout + assets. **Figma + brand chrome:** map visuals to repo patterns/tokens where they approximate Figma. **Figma 1:1:** treat output as **spec** — literal spacing, fonts, colours from the design (adapt only to your stack).
5. **`get_screenshot`** → visual QA (1:1 especially: spacing, type scale, missing blocks).
6. Done when: strings match **`use_figma`** audit; sections match metadata list; screenshots match intent (no invented blocks; **1:1:** no systematic remapping to Playbook visuals).

## When to use

Invoke this skill whenever marketing asks for:

- A new campaign landing, webinar/event page, or event site (in any language)
- A single-file HTML deliverable or zip-friendly `index.html`
- "Promo page for X" / "microsite for Y"
- "Themed page aligned with our branding"
- Any new route that is **not** one of the existing product pages (`/ai-transformation`, `/ai-engineering`, `/ai-development`, `/why-euvic`, `/evidences`) or the one-pager routes.

React-mode campaign pages live under `src/app/campaigns/<slug>/page.tsx` so they stay namespaced and never collide with the core nav. HTML deliverables live wherever marketing wants — usually a folder outside the repo (e.g. their OneDrive `Euvic Landings/<campaign-name>/`).

## Hard rules — applicability

Rules apply **by intent**:

| Rule area | Playbook | Figma + brand chrome | Figma 1:1 (design master) |
|-----------|----------|----------------------|---------------------------|
| **Brand campaign shell** (Hero 4.1, chevron ribbon, CTA 4.2, Inter-first, DiagonalBg rhythm, `.btn-premium`, `text-gradient` tokens, template nav/footer) | Yes | Yes | **No** — implement Figma layers |
| **Legal / `company-facts.md`** for cited registry, addresses, headcount | Yes | Yes | Yes |
| **Verbatim Figma copy + no invented sections** (when using any Figma intent) | — | Yes | Yes |
| **Standalone HTML base64 policy** (`assets.md`) | Yes | Yes | Yes |
| **No fake arrows** (CSS `border` triangles); use real SVG/export | Yes | Yes | Yes |

---

## Brand campaign shell (Playbook + Figma + brand chrome only)

Failure on any item below is a defect **for these two intents only**. **Figma 1:1:** skip this entire section unless the matching behaviour exists in Figma.

1. **Page wrapper / chrome.**
   - React mode: wrap in `<PageWrapper>` (Navbar + Footer + ContactModal + `useContact()`, Euvic legal data in footer).
   - HTML mode: navbar + footer from `templates/campaign-landing.html` verbatim (unless user chose **Figma 1:1** — then implement Figma chrome).
2. **Hero DNA — opener.**
   - React: `<PageHero kicker title subtitle />` — two-figure blue hero **with the 5% step** (variant 4.1). **Do NOT** use `<Hero />` or `<HeroVideo />`.
   - HTML: `<section class="hero">` with `hero-figure-left` / `hero-figure-right` clip-paths from variant 4.1.
3. **Hero must include the bottom-right chevron ribbon** — 14 rounded SVG chevrons, `chevron-shimmer`. Mandatory on Hero; skip on other sections.
4. **CTA / registration / mid-page blue sections use variant 4.2 (no step).** Never copy Hero clip-path into those sections.
5. **ChevronArrows** — rounded SVG from `brand-system.md` §6. **Never** plain CSS triangles or random Unicode arrows for brand chevrons.
6. **No emojis** in copy or UI. Use `icon-library.md` SVGs. *(**Figma 1:1:** preserve emoji only if present in Figma `characters`; still do not add new ones.)*
7. **Raster assets base64-inlined** in standalone HTML (logos, photos, favicons per `assets.md`).
8. **Inter** as primary UI/body stack in React/HTML template (variable or Google Fonts link). Other faces only when Figma 1:1 requires them.
9. **Alternating section backgrounds** — white (`#F9FAFD`) → diagonal → white → … Last section before CTA/registration **white** for contrast.
10. **Accent on light sections** → `text-gradient` / `#0E6CAB`. Blue Hero → white text; no `text-gradient` inside `.euvic-hero`.
11. **Buttons** → `.btn-premium`; React CTAs → `useContact()` / `onContactOpen`.
12. **No Marquee / `@keyframes marquee` / text gradients on body copy** (Playbook/house style).
13. **`<AnimatedSection>`** (React) or `class="animate-on-scroll"` (HTML) for reveal blocks **when using campaign template patterns**.
14. **Final block before footer** — `<CTA />` (React) or registration on variant **4.2** (HTML template).

**Figma 1:1** projects may still **opt in** to shared utilities (`PageWrapper`, contact modal) for **euvic.com** routes — document the deviation from the Figma file.

## Workflow

Copy this checklist into a TodoWrite at the start of every campaign:

```
- [ ] 1. Mode — React vs standalone HTML
- [ ] 2. Intent — Playbook vs **Figma + brand chrome** vs **Figma 1:1** (if Figma: URL + `get_metadata` section list locked)
- [ ] 3. Intake — Playbook: brief + hero; Figma: run **Figma MCP checklist** before deep coding
- [ ] 4. Playbook: Section Playbook + alternating bg. Figma + chrome: same; **Figma 1:1:** spacing/type/colour from MCP, no forced DiagonalBg
- [ ] 5. Scaffold — template (`campaign-page.tsx` / `campaign-landing.html`) for Playbook + Figma+chrome; **Figma 1:1** may start from blank section markup if faster to match frames
- [ ] 6. Playbook: PageHero + accent span + chevron ribbon. Figma+chrome: strings from `use_figma` + brand Hero. **Figma 1:1:** hero from design only
- [ ] 7. Playbook: section blueprints order. Figma: one section per agreed frame only
- [ ] 8. CTA — 4.2 + `useContact` for Playbook + Figma+chrome. **Figma 1:1:** form block as designed
- [ ] 9. Emojis — none (Playbook + Figma+chrome). **Figma 1:1:** match layers
- [ ] 10. Inline raster assets as base64 in standalone HTML
- [ ] 11. Polish — `polish-layer.md` only Playbook opt-in or Figma-visible behaviour
- [ ] 12. Verify — Playbook/Figma+chrome: Hero step / CTA no-step. **Figma 1:1:** `get_screenshot` diff
```

**Figma** — always: `get_metadata` → `use_figma` (strings) → `get_design_context` → `get_screenshot`.

### Step 2 — Intake (ask before building)

Collect via AskQuestion or conversation:

0. **Campaign intent** — **Playbook** vs **Figma + brand chrome** vs **Figma 1:1**? For any Figma path: URL + **top-level frames** or explicit ordered `node-id` list (from `get_metadata`).
1. **Mode** — React route or standalone HTML?
2. **Slug** (kebab-case, English). *(Needed for React paths; optional naming for standalone HTML folders.)*
3. **Kicker / Title / Subtitle / CTA** — **Playbook** intake only. **Any Figma intent:** pull from `use_figma`; skip editorial rules for strings.
4. **Sections** — **Playbook:** playbook menu + alternating rhythm below. **Figma:** only frames/node list from (0).
5. **Polish opt-in** — `polish-layer.md`. **Figma:** only if user asks or design shows it; **Figma 1:1:** no invented polish.
6. **Partner brand?** — co-branded assets / base64 as needed.
7. **Factual company claims** — legal data, headcount, etc. → `company-facts.md` verbatim.

## Section Playbook

**Playbook campaign only.** For **Figma** intents, do not select from this menu unless the same content exists as visible layers in the mapped frame.

All snippets assume the imports at the top of `templates/campaign-page.tsx`. Pick 3–6 of these in order, always alternating bg.

### A) Value Props grid (white bg)

```tsx
<section className="relative py-16 md:py-36 bg-[var(--color-bg)] overflow-hidden">
  <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10">
    <AnimatedSection>
      <div className="flex items-center gap-3 mb-4">
        <ChevronArrows count={6} className="opacity-60" />
        <span className="text-xs font-semibold tracking-[4px] uppercase text-[var(--color-footer-bg)]">
          {KICKER}
        </span>
      </div>
      <h2 className="text-[clamp(1.8rem,4vw,3.2rem)] font-bold leading-tight mb-10 md:mb-16">
        {HEADING} <span className="text-gradient">{ACCENT}.</span>
      </h2>
    </AnimatedSection>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {items.map((item, i) => (
        <AnimatedSection key={item.title} delay={0.08 * i}>
          <div className="surface-card h-full p-5 md:p-8 rounded-2xl transition-all duration-500 md:hover:-translate-y-1">
            <div className="text-3xl md:text-5xl font-bold text-gradient mb-3">
              {item.stat}
            </div>
            <h3 className="text-base md:text-lg font-bold mb-2">{item.title}</h3>
            <p className="text-xs md:text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {item.body}
            </p>
          </div>
        </AnimatedSection>
      ))}
    </div>
  </div>
</section>
```

### B) Timeline / weeks (diagonal bg)

```tsx
<section className="relative py-16 md:py-36 overflow-hidden">
  <DiagonalBg />
  <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-10">
    <AnimatedSection>
      <h2 className="text-[clamp(1.8rem,4vw,3.2rem)] font-bold leading-tight mb-10 md:mb-16">
        {TITLE} <span className="text-gradient">{ACCENT}.</span>
      </h2>
    </AnimatedSection>
    <div className="space-y-4 md:space-y-6">
      {phases.map((p, i) => (
        <AnimatedSection key={p.weeks} delay={0.06 * i}>
          <div className="surface-card p-5 md:p-7 rounded-2xl">
            <span className="text-[0.65rem] md:text-xs font-semibold tracking-[3px] uppercase text-[var(--color-euvic)]">
              {p.weeks}
            </span>
            <h3 className="text-base md:text-xl font-bold mt-2 mb-2">{p.title}</h3>
            <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              {p.desc}
            </p>
          </div>
        </AnimatedSection>
      ))}
    </div>
  </div>
</section>
```

### C) Social proof / numbers (white bg)

```tsx
<section className="relative py-16 md:py-36 bg-[var(--color-bg)]">
  <div className="max-w-7xl mx-auto px-5 md:px-10">
    <AnimatedSection>
      <h2 className="text-[clamp(1.8rem,4vw,3.2rem)] font-bold text-center mb-10 md:mb-16">
        {TITLE} <span className="text-gradient">{ACCENT}.</span>
      </h2>
    </AnimatedSection>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
      {numbers.map((n, i) => (
        <AnimatedSection key={n.label} delay={0.06 * i}>
          <div className="surface-card text-center p-4 md:p-6 rounded-2xl">
            <div className="text-2xl md:text-4xl font-bold text-gradient mb-1 md:mb-2">
              {n.value}
            </div>
            <p className="text-xs md:text-sm text-[var(--color-text-secondary)]">
              {n.label}
            </p>
          </div>
        </AnimatedSection>
      ))}
    </div>
  </div>
</section>
```

For stock "Euvic by the numbers" data, pull from `company-facts.md` → `keyNumbers`. Pair with the `count-up` polish pattern (`polish-layer.md` §5) for max impact.

### D) Two-column narrative (diagonal bg)

```tsx
<section className="relative py-16 md:py-36 overflow-hidden">
  <DiagonalBg />
  <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
    <AnimatedSection>
      <div className="flex items-center gap-3 mb-4">
        <ChevronArrows count={6} className="opacity-60" />
        <span className="text-xs font-semibold tracking-[4px] uppercase text-[var(--color-footer-bg)]">
          {KICKER}
        </span>
      </div>
      <h2 className="text-[clamp(1.8rem,4vw,3.2rem)] font-bold leading-tight mb-4 md:mb-6">
        {HEADING} <span className="text-gradient">{ACCENT}.</span>
      </h2>
      <p className="text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed">
        {BODY}
      </p>
    </AnimatedSection>
    <AnimatedSection delay={0.1} direction="right">
      <div className="surface-card rounded-2xl p-6 md:p-8 space-y-3">
        {bullets.map((b) => (
          <div key={b} className="flex items-start gap-3">
            <ChevronArrows count={2} className="mt-1 opacity-60" />
            <p className="text-sm md:text-base text-[var(--color-text-primary)]">{b}</p>
          </div>
        ))}
      </div>
    </AnimatedSection>
  </div>
</section>
```

### E) FAQ (choose variant per rhythm)

```tsx
// White-rhythm slot
<FAQ items={faqItems} variant="white" />
// Diagonal-rhythm slot
<FAQ items={faqItems} variant="diagonal" />
```

### F) Final CTA — React mode (always last before footer)

```tsx
<CTA
  questions={[
    "Can we see examples of similar campaigns?",
    "What does onboarding look like?",
    "How fast can we start?",
  ]}
/>
```

The `<CTA />` component already uses **variant 4.2** (no-step blue). Marketing can swap the `questions` list. It wires into the contact modal automatically.

### G) Registration / final CTA — HTML mode (variant 4.2, no step)

```html
<section class="cta-blue" id="registration">
  <div class="cta-figure-left" aria-hidden="true"></div>
  <div class="cta-figure-right" aria-hidden="true"></div>
  <div class="hero-grid" aria-hidden="true"></div>

  <div class="container" style="max-width:640px;position:relative;z-index:10;">
    <!-- title, event-pills, registration form …
         FULL markup pre-baked in templates/campaign-landing.html -->
  </div>
</section>
```

CSS for variant 4.2 (already defined in the HTML template):

```css
.cta-blue { position: relative; overflow: hidden; padding: 80px 0; }
.cta-figure-left {
  position: absolute; inset: 0; background: #0E6CAB;
  clip-path: polygon(0 0, 40% 0, 62% 100%, 0 100%);
  z-index: 0;
}
.cta-figure-right {
  position: absolute; inset: 0; background: #0870B2;
  clip-path: polygon(40% 0, 100% 0, 100% 100%, 62% 100%);
  z-index: 0;
}
```

## Alternating background rule (strict)

**Playbook + Figma + brand chrome only.** **Figma 1:1:** follow Figma section fills and images; **ignore** this table.

| Slot | Allowed bg |
|------|------------|
| Section 1 (directly under PageHero) | `bg-[var(--color-bg)]` (= `#F9FAFD`) |
| Section 2 | `<DiagonalBg />` inside `relative overflow-hidden` |
| Section 3 | `bg-[var(--color-bg)]` |
| Section 4 | `<DiagonalBg />` |
| … | continue alternating |
| Last section before `<CTA />` / registration | white (so the CTA's blue has contrast) |

Never render two consecutive diagonal sections, and never introduce a third background colour. FAQ's `variant` prop exists precisely so it fits both slots.

## Copy rules

Follow **Campaign intent**. **Playbook** uses the editorial bullets below. **Both Figma intents** use **verbatim** `use_figma` `characters` for campaign copy (see **Figma — shared rules**).

### Playbook campaign (editorial)

- Title cases: `Sentence case with one accented Word.` — one and only one span wrapped in `text-gradient`.
- Never use colons in kickers (`Webinar`, not `Webinar:`).
- Keep paragraphs to ≤ 45 words. Longer = split into bullets.
- Use en-dash (`–`) not hyphen for parentheticals, matching existing copy.

### Playbook + Figma + brand chrome

- Brand name `Euvic` when **authoring** Playbook copy. **Figma:** ship strings as in layers; do not silently "fix" marketing casing. Legal/registry lines → `company-facts.md` when cited.
- **No emojis** in copy or UI — use `icon-library.md`.

### Figma 1:1

- Same legal/registry rule as above.
- **Emoji:** preserve only if present in Figma `characters`; never add decorative emoji absent from the file.

## Output format when scaffolding

### React mode

1. One new file `src/app/campaigns/<slug>/page.tsx` — **Playbook + Figma + brand chrome:** start from `templates/campaign-page.tsx`. **Figma 1:1:** implement frames directly (may omit template Hero/sections if they do not match Figma).
2. (Only if marketing provided assets that don't fit base64) one new folder `public/campaigns/<slug>/` with images referenced via `next/image`. Otherwise inline base64.
3. A `metadata` export with campaign-specific `title` and `description` (the layout's default is generic).
4. Short summary listing: route URL, sections placed, polish patterns applied, any TODOs (missing images, unconfirmed numbers).

### HTML mode

1. One new folder anywhere marketing chooses (typically outside the repo) containing:
   - `index.html` — the entire page, all CSS in `<style>`, all JS in `<script>`, all logos/photos as `data:` URLs.
   - `favicon.ico` (optional; the template inlines a base64 favicon as `<link rel="icon">`).
2. Verify the file opens correctly via `file://` (no missing assets, no console errors).
3. Short summary listing: file path, total page weight (target ≤ 250 KB), sections placed, polish patterns applied.

## Verification

Before claiming done:

### React mode

```bash
npm run lint
curl -sI http://localhost:3000/campaigns/<slug> | head -n 1   # expect HTTP/1.1 200
```

Then call `ReadLints` on the new file. Fix any errors you introduced.

### HTML mode

```bash
# Static check: no external image refs
rg -n 'src="(?!data:)' "<deliverable-path>/index.html" || echo "OK: no external images"
# Emojis — Playbook + Figma+chrome: none. Figma 1:1: skip this grep if design includes emoji in copy
rg -n '[😀-🙏🌀-🗿✅-➿🚀-🛿🤀-🧿🩰-🫶]' "<deliverable-path>/index.html" || echo "OK: no emojis"
open "<deliverable-path>/index.html"
```

**Playbook + Figma + brand chrome:** Hero must show the small white step bottom-left; registration / CTA must **not** use the Hero clip-path. **Figma 1:1:** compare **`get_screenshot`** to the build; do not require template Hero/CTA geometry.

## Reference files

- **Brand tokens, Hero variants 4.1/4.2, ChevronArrows SVG, primitives** → [brand-system.md](brand-system.md).
- **Legal, contact, and company facts (registry IDs, offices, headcount, tagline, board, history)** → [company-facts.md](company-facts.md). Always cite numbers verbatim.
- **Image / logo policy + the pre-encoded Euvic logo** → [assets.md](assets.md) (logo data URL: `assets/euvic-logo.base64.txt`).
- **Brand SVG icon library + emoji-to-icon mapping** → [icon-library.md](icon-library.md).
- **Modern UX patterns to opt into (sticky CTA, count-up, floating labels, scroll progress, tilt, parallax orbs, gradient frame, success state, magnetic CTA)** → [polish-layer.md](polish-layer.md).
- **React scaffold** → [templates/campaign-page.tsx](templates/campaign-page.tsx).
- **HTML scaffold (single-file deliverable)** → [templates/campaign-landing.html](templates/campaign-landing.html).

## Anti-patterns (do not do)

**Playbook + Figma + brand chrome**

- Plain CSS-triangle arrows (`border-*` tricks) instead of real SVG — use paths or exports.
- Putting Hero 4.1 clip-path on CTA / registration — use variant 4.2.
- Forgetting the bottom-right chevron ribbon on template Hero.
- Emojis — use `icon-library.md` instead.
- `<img src="logo.png">` in a standalone deliverable — base64 per `assets.md`.
- Inventing hex colours — use `globals.css` / `brand-system.md` tokens (unless matching Figma for **1:1**).
- Loading campaign rasters from CDN — inline base64 for HTML deliverables.
- Mixing `Hero` / `HeroVideo` (homepage) into campaign template pages.
- Branded React campaigns: bespoke modal instead of `useContact()` — prefer shared `ContactModal` (**unless Figma 1:1** form is the product).
- `text-gradient` on copy inside `.euvic-hero` — remove class there.
- Two consecutive `<DiagonalBg />` sections.
- Forgetting `metadata` export (React SEO).

**Any Figma intent**

- Paraphrasing copy or trusting `get_design_context` strings without **`use_figma` / `characters`** reconciliation.
- Adding Playbook sections, kickers, or headings not present as visible text in the source frame.

**Figma 1:1 (design master)** — also avoid:

- Forcing PageHero 4.1, chevron ribbon, CTA 4.2, DiagonalBg rhythm, Inter-only, or `text-gradient` tokens when Figma differs.
- Replacing Figma icons/illustrations with `icon-library` marks.
- Skipping **`get_screenshot`** visual QA before sign-off.
