# Polish layer — modern UX patterns for campaign landings

These are **opt-in** modernisation patterns. The base template already looks clean and on-brand; this layer adds the "wow" details that make a landing feel premium and current. Pick 3–5 patterns per page, never all of them at once (visual noise kills conversion).

## When to apply

| Campaign type | Recommended patterns |
|---------------|----------------------|
| Webinar / event registration | sticky CTA, scroll progress, count-up stats, floating-label form, success state |
| Lead magnet (whitepaper, audit) | tilt cards, stagger reveal, marquee gradient border on the offer card, sticky CTA |
| Service / solution explainer | parallax orbs in Hero, magnetic CTA, count-up KPIs, scroll-reveal stagger |
| Partner co-branded launch | dual-logo intro animation, parallax orbs, tilt speaker cards, stagger timeline |

## Pattern catalogue

Each pattern is plug-and-play — drop the CSS into the `<style>` block, the markup where indicated, and (if needed) the JS at the bottom of the page. All patterns respect `prefers-reduced-motion: reduce`.

---

### 1. Hero parallax orbs (subtle depth)

Two soft, blurred radial gradients drifting slowly behind the Hero figures. Adds depth without competing with the headline.

**CSS**
```css
.hero-orb {
  position: absolute; border-radius: 50%; filter: blur(60px);
  opacity: 0.35; pointer-events: none; z-index: 1;
  animation: orb-drift 22s ease-in-out infinite;
}
.hero-orb-1 {
  width: 480px; height: 480px;
  background: radial-gradient(circle, #4FA8E0 0%, transparent 70%);
  top: -120px; left: -80px;
}
.hero-orb-2 {
  width: 600px; height: 600px;
  background: radial-gradient(circle, #003B73 0%, transparent 70%);
  bottom: -200px; right: -120px;
  animation-delay: -8s; animation-duration: 28s;
}
@keyframes orb-drift {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%      { transform: translate(40px, -30px) scale(1.08); }
}
@media (prefers-reduced-motion: reduce) {
  .hero-orb { animation: none; }
}
```

**Markup** — add inside the Hero section, after the figures, before the grid:
```html
<div class="hero-orb hero-orb-1" aria-hidden="true"></div>
<div class="hero-orb hero-orb-2" aria-hidden="true"></div>
```

---

### 2. Animated chevrons in Hero bottom-right corner

Mandatory now — see `brand-system.md`. The decorative ribbon of 14 chevrons in the bottom-right of every Hero, with a left-to-right shimmer that loops every ~5s.

**CSS**
```css
.chevron-ribbon {
  position: absolute; bottom: 32px; right: 32px;
  display: inline-flex; gap: 10px; z-index: 5;
  pointer-events: none;
}
@media (max-width: 767px) { .chevron-ribbon { display: none; } }
.chevron-ribbon svg {
  width: 14px; height: 18px; flex-shrink: 0;
  fill: rgba(255,255,255,0.35);
  animation: chevron-shimmer 5s ease-in-out infinite;
}
.chevron-ribbon svg:nth-child(2n) { fill: rgba(255,255,255,0.65); }
.chevron-ribbon svg:nth-child(n) { animation-delay: calc(var(--i) * 0.08s); }
@keyframes chevron-shimmer {
  0%, 100% { opacity: 0.6; transform: translateX(0); }
  50%      { opacity: 1;   transform: translateX(2px); }
}
```

Use `style="--i:1"`, `--i:2`, … on each chevron for cascading shimmer. Full markup in `templates/campaign-landing.html`.

---

### 3. Scroll progress bar

Thin Euvic-blue bar fixed at the top of the viewport that fills as the user scrolls. Builds urgency, signals length.

**CSS**
```css
.scroll-progress {
  position: fixed; top: 0; left: 0; height: 3px; width: 0;
  background: linear-gradient(90deg, #0E6CAB, #4FA8E0);
  z-index: 100; transition: width 0.05s linear;
  pointer-events: none;
}
```

**Markup** (very first child of `<body>`):
```html
<div class="scroll-progress" id="scroll-progress" aria-hidden="true"></div>
```

**JS**
```js
const progress = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  progress.style.width = pct + '%';
}, { passive: true });
```

---

### 4. Sticky CTA bar (appears after Hero)

Pinned bottom bar that materialises after the user scrolls past the Hero, so the registration CTA is always one click away.

**CSS**
```css
.sticky-cta {
  position: fixed; left: 50%; bottom: 24px;
  transform: translate(-50%, 120%);
  display: inline-flex; align-items: center; gap: 16px;
  padding: 12px 20px 12px 24px; border-radius: 999px;
  background: rgba(14, 108, 171, 0.96);
  color: #fff; box-shadow: 0 10px 40px rgba(0,0,0,0.18);
  backdrop-filter: blur(12px);
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  z-index: 40; font-size: 0.9rem; font-weight: 500;
}
.sticky-cta.is-visible { transform: translate(-50%, 0); }
.sticky-cta a {
  background: #fff; color: #0E6CAB;
  padding: 8px 18px; border-radius: 999px;
  font-weight: 600; text-decoration: none;
  transition: transform 0.2s;
}
.sticky-cta a:hover { transform: translateY(-1px); }
@media (max-width: 600px) {
  .sticky-cta { left: 16px; right: 16px; transform: translate(0, 120%); }
  .sticky-cta.is-visible { transform: translate(0, 0); }
}
```

**Markup** (just before `</body>`):
```html
<div class="sticky-cta" id="sticky-cta" aria-hidden="true">
  <span>Webinar Apr 8, 2026, 12:00 — free.</span>
  <a href="#registration">Register</a>
</div>
```

**JS**
```js
const stickyCta = document.getElementById('sticky-cta');
const heroEl    = document.getElementById('hero');
const heroObserver = new IntersectionObserver(([e]) => {
  stickyCta.classList.toggle('is-visible', !e.isIntersecting);
}, { threshold: 0.1 });
heroObserver.observe(heroEl);
```

---

### 5. Count-up stats (numbers animate from 0)

For headline numbers (years, attendees, KPIs). Triggers when the stat block scrolls into view.

**Markup**
```html
<div class="stat" data-count-to="2400" data-suffix="+">0</div>
<div class="stat-label">specialists in the group</div>
```

**JS**
```js
const easeOut = t => 1 - Math.pow(1 - t, 3);
function countUp(el) {
  const target = parseInt(el.dataset.countTo, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1600;
  const start = performance.now();
  function tick(now) {
    const t = Math.min(1, (now - start) / duration);
    el.textContent = Math.round(target * easeOut(t)).toLocaleString('pl-PL') + suffix;
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { countUp(e.target); statObserver.unobserve(e.target); }
  });
}, { threshold: 0.4 });
document.querySelectorAll('[data-count-to]').forEach(el => statObserver.observe(el));
```

---

### 6. Floating-label form inputs

Modern label that sits inside the input and floats up when focused/filled. Replaces the placeholder-only style.

**CSS**
```css
.field { position: relative; }
.field input {
  width: 100%; padding: 22px 18px 10px;
  border: 1px solid var(--color-border);
  border-radius: 12px; background: #fff;
  font: 0.95rem var(--font-body); color: var(--color-text-primary);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.field input:focus {
  outline: none; border-color: var(--color-euvic);
  box-shadow: 0 0 0 4px rgba(0,114,206,0.12);
}
.field label {
  position: absolute; left: 18px; top: 16px;
  color: var(--color-text-dim); font-size: 0.95rem;
  transition: transform 0.2s ease, color 0.2s ease, font-size 0.2s ease;
  pointer-events: none; transform-origin: 0 0;
}
.field input:focus + label,
.field input:not(:placeholder-shown) + label {
  transform: translateY(-10px) scale(0.78);
  color: var(--color-euvic);
}
```

**Markup**
```html
<div class="field">
  <input id="email" type="email" placeholder=" " required />
  <label for="email">Email address</label>
</div>
```

The trailing space in `placeholder=" "` keeps `:placeholder-shown` working for the float-up trigger.

---

### 7. 3D tilt on hover (cards)

Subtle perspective tilt on speaker / agenda / value-prop cards as the cursor moves across them.

**CSS** (the card needs `transform-style: preserve-3d`):
```css
.tilt {
  transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform; transform-style: preserve-3d;
}
@media (prefers-reduced-motion: reduce) { .tilt { transition: none; } }
```

**JS** — attach to every `.tilt` element:
```js
document.querySelectorAll('.tilt').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform =
      `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateZ(2px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});
```

Keep amplitudes low (≤6° / ≤4°) — anything more reads as gimmicky.

---

### 8. Stagger reveal (children animate sequentially)

When a grid scrolls into view, children fade-in one after another (~80 ms apart).

**CSS**
```css
.stagger > * {
  opacity: 0; transform: translateY(20px);
  transition: opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}
.stagger.is-visible > * {
  opacity: 1; transform: translateY(0);
}
.stagger.is-visible > *:nth-child(1) { transition-delay: 0ms; }
.stagger.is-visible > *:nth-child(2) { transition-delay: 80ms; }
.stagger.is-visible > *:nth-child(3) { transition-delay: 160ms; }
.stagger.is-visible > *:nth-child(4) { transition-delay: 240ms; }
.stagger.is-visible > *:nth-child(5) { transition-delay: 320ms; }
.stagger.is-visible > *:nth-child(6) { transition-delay: 400ms; }
.stagger.is-visible > *:nth-child(n+7) { transition-delay: 480ms; }
@media (prefers-reduced-motion: reduce) {
  .stagger > * { opacity: 1; transform: none; transition: none; }
}
```

The existing `IntersectionObserver` for `.animate-on-scroll` already handles the `.is-visible` toggle — just add the `.stagger` class to the grid wrapper.

---

### 9. Marquee gradient border (highlight one offer)

A rotating-gradient outline that draws attention to the bonus / audit / lead-magnet card. Use sparingly — at most one card per page.

**CSS**
```css
.gradient-frame { position: relative; isolation: isolate; }
.gradient-frame::before {
  content: ""; position: absolute; inset: -2px;
  border-radius: 18px; padding: 2px;
  background: conic-gradient(from 0deg,
    #0E6CAB, #4FA8E0, #003B73, #0870B2, #0E6CAB);
  animation: gradient-spin 8s linear infinite;
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  z-index: -1;
}
@keyframes gradient-spin { to { transform: rotate(1turn); } }
@media (prefers-reduced-motion: reduce) {
  .gradient-frame::before { animation: none; }
}
```

Wrap the offer card in `<div class="surface-card gradient-frame">…</div>`.

---

### 10. Form success state with check animation

After submit, replace the form with a confirmation card that scales-in with an animated check-circle.

**CSS**
```css
.form-success { display: none; text-align: center; padding: 32px 24px; }
.form-success.is-visible { display: block; animation: pop-in 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
@keyframes pop-in { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
.success-check { width: 72px; height: 72px; margin: 0 auto 16px; color: #16a34a; }
.success-check circle { stroke-dasharray: 188; stroke-dashoffset: 188; animation: draw-circle 0.6s ease forwards; }
.success-check polyline { stroke-dasharray: 36; stroke-dashoffset: 36; animation: draw-check 0.4s 0.5s ease forwards; }
@keyframes draw-circle { to { stroke-dashoffset: 0; } }
@keyframes draw-check  { to { stroke-dashoffset: 0; } }
```

**Markup**
```html
<div class="form-success" id="form-success">
  <svg class="success-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="8 12 11 15 16 9"/>
  </svg>
  <h3 style="font-size:1.25rem;font-weight:700;margin-bottom:8px;">Thank you for registering.</h3>
  <p style="color:var(--color-text-secondary);font-size:0.95rem;">We will email the webinar link no later than 24 hours before the start.</p>
</div>
```

**JS** (intercept form submit):
```js
document.getElementById('registration-form').addEventListener('submit', (e) => {
  e.preventDefault();
  document.getElementById('registration-form').style.display = 'none';
  document.getElementById('form-success').classList.add('is-visible');
});
```

For real campaigns the marketing team will swap the local handler for a Marketo / HubSpot endpoint — keep the success markup the same.

---

### 11. Magnetic CTA button

Primary CTA gently follows the cursor when nearby. Adds a sense of physicality to the most important click target.

**JS**
```js
document.querySelectorAll('.btn-magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top  - r.height / 2;
    btn.style.transform = `translate(${(x * 0.18).toFixed(1)}px, ${(y * 0.22).toFixed(1)}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});
```

Add `class="btn-magnetic"` to the Hero's primary CTA (and only that one).

---

## Composition guidelines

- **Hero**: orbs (1) + chevron ribbon (2) + magnetic CTA (11) — that's the wow combo.
- **Sections grid**: stagger reveal (8) is almost always worth it.
- **Stats / numbers row**: count-up (5) is non-negotiable.
- **One offer / bonus card**: gradient frame (9) — use exactly once per page.
- **Form**: floating labels (6) + success state (10) for any registration page.
- **Always-on**: scroll progress (3) + sticky CTA (4) for high-intent campaign pages.
- **Tilt (7)**: only on speaker cards or premium product cards. Skip on dense lists.

When in doubt, fewer animations = more premium. The Hero alone with a clean entrance and the chevron shimmer already feels brand-grade.
