# Euvic Company Facts — canonical copy for campaigns

Always quote these **verbatim**. If the campaign brief contradicts a number below, flag it to marketing before shipping — don't silently reconcile.

Source files:
- Legal data & contact → `src/components/Footer.tsx`
- "By the numbers", history, offices, board → `src/app/why-euvic/page.tsx`
- Service pillars & navigation → `src/content/navigation.ts`, `src/app/ai-transformation/page.tsx`

## 1. Legal entity

- Registered name: **Euvic S.A.**
- Address: `ul. Przewozowa 32, 44-100 Gliwice, Poland`
- TIN (NIP): `5272604418`
- National Court Register number (KRS): `0000332547`
- Statistical number (REGON): `141905973`

### Merger notice (required on legal / investor-facing pages)

> We hereby inform you that on 2 January 2026, the merger of **Euvic S.A. and eo Networks S.A.** was completed and officially confirmed by an entry in the National Court Register (KRS).
>
> New registration details following the merger:
> - TIN: 5272604418
> - National Court Register Number: 0000332547
> - Statistical Number: 141905973

For most marketing pages, the footer already renders this — no need to repeat in body copy.

## 2. Contact

- General: `info@euvic.com`
- Phone: `+48 32 279 49 42`
- GDPR page: `https://www.euvic.com/gdpr/`
- Corporate site: `https://www.euvic.com/`

## 3. Social

- Facebook: `https://www.facebook.com/EuvicPoland`
- YouTube: `https://www.youtube.com/@euvic`
- LinkedIn: `https://www.linkedin.com/company/euvic/`

## 4. Headline numbers ("By the numbers" block)

Use in Social proof / Value props sections. These are the authoritative values rendered on `/why-euvic`.

```ts
export const keyNumbers = [
  { value: "6 300+",   label: "IT specialists & engineers" },
  { value: "100+",     label: "Specialized teams" },
  { value: "20+",      label: "Offices worldwide" },
  { value: "2.45B PLN",label: "Group revenue" },
  { value: "25%",      label: "Year-over-year growth" },
  { value: "92%",      label: "Client retention rate" },
];
```

Do not round, restate, or translate (e.g. "6,300+"). Copy the strings exactly as above — spacing included.

## 5. Geographic footprint

Copy claim: "We operate globally."

Countries with offices (use as pill chips / list):

`Poland, USA, UK, Sweden, Germany, Finland, Austria, UAE`

Approved one-liners:
- "Our real strength is the ability to seamlessly integrate global expertise with local market specifics."
- "We deliver solutions for clients across Europe, the United States, and the Middle East."
- "We provide our services on-site, at the client's location, or fully remote. The collaboration model is always your choice."

## 6. Positioning & taglines

- Practice positioning: **"Euvic: AI Practice"** (used as the site `<title>` in `src/app/layout.tsx`).
- One-line pitch:
  > "From strategy through audit to implementation. We help organisations become AI-native."
- Core differentiator line (from `why-euvic`):
  > "We become an extension of your team — not a consultancy that delivers a report and disappears."
- Partner label: **"360° IT Partner"**.

## 7. Service pillars (for cross-sell blocks on campaigns)

From `why-euvic` → "Your 360° IT Partner":

1. **IT Infrastructure & Distribution** — IT Services & Outsourcing, Service Desk, Migrations & Implementations, Cloud & Infrastructure Monitoring, Consulting & Audits, Hardware & Software Distribution.
2. **Software Development & Consulting** — System & Software Architecture, Software Development, Product Discovery & Design, Mobile Applications, Web Apps & Portals, Migrations & Integrations, BI, AI & ML, Quality Assurance, Consulting.
3. **Team Augmentation** — Staff Augmentation, Dedicated Teams, Nearshore / Offshore.
4. **Digital Marketing** — Brand Image & Significance, Media Strategies & Customer Journey, Sales & Traffic Generation, Marketing Automation, SEO & AI-powered Scaling, E-commerce Platforms, Data & Insights.

## 8. AI Practice products (internal link targets)

When a campaign page references AI Practice products, link to the canonical routes:

```ts
export const aiPracticeRoutes = {
  aiTransformation: { title: "AI Transformation", href: "/ai-transformation",
    desc: "Diagnose inefficiencies, build ROI-scored roadmaps" },
  aiDevelopment:    { title: "AI Development",    href: "/ai-development",
    desc: "Validation-first custom AI: business case, PoC, then production systems" },
  aiEngineering:    { title: "AI Engineering",    href: "/ai-engineering",
    desc: "How we build software with AI - installed at your team" },
  whyEuvic:         { title: "Why Euvic",         href: "/why-euvic" },
  evidence:         { title: "Evidence",          href: "/evidences",
    desc: "Real results from real projects, with exact numbers" },
};
```

## 9. Leadership board (optional — use on "about us"-style campaigns)

| Name | Role | Area | Portrait |
|------|------|------|----------|
| Wojciech Wolny | CEO | Sales | `/team/wojciech-wolny.png` |
| Wojciech Kosiński | Vice President | Operations | `/team/wojciech-kosinski.png` |
| Łukasz Czernecki | Vice President | Marketing & PR, HR | `/team/lukasz-czernecki.png` |
| Bogdan Rycharski | Vice President | Finance | `/team/bogdan-rycharski.png` |

Render via `next/image`, round mask, `ring-2 ring-[var(--color-border)]` — see `why-euvic/page.tsx` for the exact card pattern.

## 10. Company history milestones

Use when the campaign needs a credibility/timeline block. Copy verbatim.

```ts
export const history = [
  { num: "01", year: "2005",       desc: "LG Nexera founded - 8 employees" },
  { num: "02", year: "2008",       desc: "Poland's only IT company federation formed - 40 employees" },
  { num: "03", year: "2010",       desc: "First full merger with BIGIT - 100 employees" },
  { num: "04", year: "2012–2015",  desc: "Group formation - stakes in 15 companies, portfolio valuation, LGBS becomes Euvic" },
  { num: "05", year: "2017–2018",  desc: "IT Infrastructure pillar structured, IT.Works SA acquired - 2 000+ employees" },
  { num: "06", year: "2018",       desc: "Euvic Sweden launched - fastest-growing international office" },
  { num: "07", year: "2019–2020",  desc: "Body Leasing, Innovation, and Digital pillars structured" },
  { num: "08", year: "2021–2022",  desc: "Performance and Commerce Transformation pillars launched" },
  { num: "09", year: "2023",       desc: '"Euvic 2030" strategy adopted - targeting $1B revenue' },
  { num: "10", year: "2026",       desc: "Merger with eo Networks S.A. - Euvic IPO on Warsaw Stock Exchange" },
];
```

## 11. Brand voice cheatsheet

- **Plain, evidence-driven, never breathless.** Prefer numbers to adjectives.
- British-leaning spelling: `organisation`, `optimisation`, `analyse`. Match existing copy.
- Lead with the business outcome, follow with the technology — mirroring the homepage: *"The technology behind it happens to be AI."*
- Avoid hype words: "revolutionary", "cutting-edge", "game-changing", "synergy". They do not appear in the codebase for a reason.
- When writing about the customer, second person (`you`, `your team`). When writing about Euvic, first person plural (`we`, `our`).
