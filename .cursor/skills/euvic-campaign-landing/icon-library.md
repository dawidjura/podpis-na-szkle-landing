# Euvic Icon Library — on-brand SVG replacements for emojis

**No emojis on Euvic landing pages, ever.** Emojis (🏆, 🔍, ✨, 🎯, ✅, ❌, 🚀, 💡 …) read as informal/consumer and break the brand voice. Every visual marker uses an inline SVG from this library or matches its style.

## Style contract

All icons in this library, and any new icon you add, MUST:

- Use `viewBox="0 0 24 24"`.
- Use `fill="none" stroke="currentColor"` (so the colour follows the surrounding text — `text-[var(--color-euvic)]`, `text-white`, etc.).
- Use `stroke-width="1.5"`, `stroke-linecap="round"`, `stroke-linejoin="round"`.
- Be wrapped in a sized box (Tailwind `w-5 h-5 md:w-6 md:h-6` for inline; `w-8 h-8` for feature cards) — never style icons by raw `width`/`height` attributes when used inside React.
- Be `aria-hidden="true"` if purely decorative; otherwise pair with a sibling label.

This matches the icons already shipped on `why-euvic`, `ai-transformation`, and `Footer.tsx` social icons (which use `currentColor` fill instead — that is the **only** approved exception, for filled platform marks).

## Usage in HTML deliverables

```html
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
     stroke-linecap="round" stroke-linejoin="round"
     class="icon" aria-hidden="true" focusable="false">
  …path…
</svg>
```

Pair with a CSS rule:

```css
.icon { width: 1.25rem; height: 1.25rem; flex-shrink: 0; }
.icon-lg { width: 2rem; height: 2rem; }
.icon-eyebrow { width: 1rem; height: 1rem; opacity: 0.85; }
```

## Usage in React (.tsx)

Drop the SVG straight into JSX (close `path` tags, swap `class` → `className`, `stroke-width` → `strokeWidth`, etc.).

## Emoji → icon mapping (use these instead)

| Emoji you'd reach for | Use this icon (id below) | Common contexts |
|-----------------------|--------------------------|-----------------|
| 🏆 / 🥇 | `award` | Contests, recognition, prizes |
| 🔍 / 🔎 | `search` | Audit, discovery, analysis |
| ✅ / ✔ | `check` (use `check-circle` for filled chip) | Bonus checklists, "what's included" |
| ❌ / ✖ | `x-circle` | What's not included, dismiss |
| 🚀 | `rocket` (line-art) | Launch, kickoff, time-to-value |
| 💡 | `lightbulb` | Insights, tips, ideation |
| 🎯 | `target` | Goals, KPI, focus |
| 📅 / 🗓 | `calendar` | Webinar dates, events |
| ⏰ / 🕐 | `clock` | Duration, time |
| 📧 / ✉ | `mail` | Email contact |
| 📞 / ☎ | `phone` | Phone contact |
| 📍 / 🗺 | `map-pin` | Locations, offices |
| 🛡 / 🔒 | `shield` / `lock` | Security, GDPR, compliance |
| 📊 / 📈 | `bar-chart` / `trend-up` | Stats, results |
| 👥 / 🧑 | `users` | Audience, team |
| 📄 / 📑 | `file` | Reports, downloads |
| ⚠ / ❗ | `alert` | Risk, warnings |
| 🌐 / 🌍 | `globe` | Global presence, online event |
| 💬 / 🗨 | `chat` | Q&A, support |
| ⭐ | `star` (line) | Highlights, top picks |
| ▶ / ▷ | `play` | Video, recording, replay |
| ⬇ / 📥 | `download` | PDF agenda, materials |

If you can't find a 1:1 match, search Lucide-style line iconography first; never fall back to an emoji.

## The icons

### `calendar`

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
  <line x1="16" y1="2" x2="16" y2="6"/>
  <line x1="8" y1="2" x2="8" y2="6"/>
  <line x1="3" y1="10" x2="21" y2="10"/>
</svg>
```

### `clock`

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <circle cx="12" cy="12" r="10"/>
  <polyline points="12 6 12 12 16 14"/>
</svg>
```

### `hourglass` (better than clock for "duration")

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M6 2h12M6 22h12M6 2v4a6 6 0 0 0 12 0V2M6 22v-4a6 6 0 0 1 12 0v4"/>
</svg>
```

### `mail`

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
  <polyline points="22,6 12,13 2,6"/>
</svg>
```

### `phone`

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
</svg>
```

### `map-pin`

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
  <circle cx="12" cy="10" r="3"/>
</svg>
```

### `globe` (good for "online webinar")

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <circle cx="12" cy="12" r="10"/>
  <line x1="2" y1="12" x2="22" y2="12"/>
  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
</svg>
```

### `check`

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <polyline points="20 6 9 17 4 12"/>
</svg>
```

### `check-circle` (the right replacement for `✓` chips)

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <circle cx="12" cy="12" r="10"/>
  <polyline points="8 12 11 15 16 9"/>
</svg>
```

### `x-circle`

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <circle cx="12" cy="12" r="10"/>
  <line x1="15" y1="9" x2="9" y2="15"/>
  <line x1="9" y1="9" x2="15" y2="15"/>
</svg>
```

### `shield`

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
</svg>
```

### `shield-check` (security with confirmation)

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  <polyline points="9 12 11 14 15 10"/>
</svg>
```

### `lock`

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
</svg>
```

### `search`

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <circle cx="11" cy="11" r="8"/>
  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
</svg>
```

### `target`

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <circle cx="12" cy="12" r="10"/>
  <circle cx="12" cy="12" r="6"/>
  <circle cx="12" cy="12" r="2"/>
</svg>
```

### `lightbulb`

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2z"/>
</svg>
```

### `award` (use instead of 🏆)

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <circle cx="12" cy="8" r="6"/>
  <polyline points="8.21 13.89 7 22 12 19 17 22 15.79 13.88"/>
</svg>
```

### `users`

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
  <circle cx="9" cy="7" r="4"/>
  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
</svg>
```

### `bar-chart`

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <line x1="12" y1="20" x2="12" y2="10"/>
  <line x1="18" y1="20" x2="18" y2="4"/>
  <line x1="6" y1="20" x2="6" y2="16"/>
</svg>
```

### `trend-up`

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
  <polyline points="17 6 23 6 23 12"/>
</svg>
```

### `file` / `file-text`

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
  <polyline points="14 2 14 8 20 8"/>
  <line x1="16" y1="13" x2="8" y2="13"/>
  <line x1="16" y1="17" x2="8" y2="17"/>
  <polyline points="10 9 9 9 8 9"/>
</svg>
```

### `download`

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
  <polyline points="7 10 12 15 17 10"/>
  <line x1="12" y1="15" x2="12" y2="3"/>
</svg>
```

### `play`

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <polygon points="5 3 19 12 5 21 5 3"/>
</svg>
```

### `chat` / `message-square`

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
</svg>
```

### `alert-triangle`

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
  <line x1="12" y1="9" x2="12" y2="13"/>
  <line x1="12" y1="17" x2="12.01" y2="17"/>
</svg>
```

### `rocket`

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M5 13l4 4L20 6c-2 0-7 0-11 4-2 2-4 8-4 8z"/>
  <path d="M9 17H5c0-2 2-4 4-4v4z"/>
  <circle cx="14" cy="10" r="1"/>
</svg>
```

### `arrow-right` (general directional, when chevrons are wrong context)

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <line x1="5" y1="12" x2="19" y2="12"/>
  <polyline points="12 5 19 12 12 19"/>
</svg>
```

### `arrow-up-right` (CTA "open external")

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <line x1="7" y1="17" x2="17" y2="7"/>
  <polyline points="7 7 17 7 17 17"/>
</svg>
```

The arrow-up-right replaces the inline `↗` glyph used in `Hero`/`CTA` buttons whenever you need a sharper, brand-controlled arrow. The existing components keep `↗` for backwards compatibility, but new campaign pages should prefer this SVG.
