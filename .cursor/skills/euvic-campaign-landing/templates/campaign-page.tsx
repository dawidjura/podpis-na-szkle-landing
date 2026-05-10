// Campaign landing page scaffold.
//
// How to use (via the `euvic-campaign-landing` skill):
// 1. Copy this file to `src/app/campaigns/<slug>/page.tsx`.
// 2. Replace every ALL_CAPS placeholder and every `TODO:` comment.
// 3. Keep the section order alternating (white → diagonal → white → …).
// 4. Delete any sections the campaign does not need — do NOT duplicate sections.
// 5. Export `metadata` with campaign-specific title/description.
//
// NEVER:
// - Import Hero or HeroVideo here (homepage-only).
// - Add new fonts, text gradients on copy, Marquee components, or bespoke modals.
// - Invent hex values — use tokens from globals.css / the brand-system.md table.
// - Render two <DiagonalBg /> sections back-to-back.

import type { Metadata } from "next";
import PageWrapper from "@/components/PageWrapper";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import ChevronArrows from "@/components/ChevronArrows";
import DiagonalBg from "@/components/DiagonalBg";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "CAMPAIGN_TITLE | Euvic AI Practice",
  description:
    "CAMPAIGN_META_DESCRIPTION — 1–2 sentences, under 160 chars, plain English.",
};

// ──────────────────────────────────────────────────────────────────────────────
// Content (keep data at the top so marketing can edit without touching JSX)
// ──────────────────────────────────────────────────────────────────────────────

const valueProps = [
  {
    stat: "01",
    title: "FIRST_VALUE_TITLE",
    body: "FIRST_VALUE_BODY — one short sentence, business outcome first.",
  },
  {
    stat: "02",
    title: "SECOND_VALUE_TITLE",
    body: "SECOND_VALUE_BODY.",
  },
  {
    stat: "03",
    title: "THIRD_VALUE_TITLE",
    body: "THIRD_VALUE_BODY.",
  },
];

const phases = [
  {
    weeks: "Week 1",
    title: "PHASE_ONE_TITLE",
    desc: "PHASE_ONE_DESC.",
  },
  {
    weeks: "Week 2",
    title: "PHASE_TWO_TITLE",
    desc: "PHASE_TWO_DESC.",
  },
  {
    weeks: "Weeks 3–4",
    title: "PHASE_THREE_TITLE",
    desc: "PHASE_THREE_DESC.",
  },
];

// TODO: if the campaign uses the authoritative Euvic numbers, pull them from
// .cursor/skills/euvic-campaign-landing/company-facts.md (section 4) instead of
// writing your own.
const numbers = [
  { value: "6 300+", label: "IT specialists & engineers" },
  { value: "20+", label: "Offices worldwide" },
  { value: "92%", label: "Client retention rate" },
];

const faqItems = [
  {
    question: "FAQ_QUESTION_ONE?",
    answer:
      "FAQ_ANSWER_ONE — keep under 45 words, link to /ai-transformation etc. if cross-selling.",
  },
  {
    question: "FAQ_QUESTION_TWO?",
    answer: "FAQ_ANSWER_TWO.",
  },
  {
    question: "FAQ_QUESTION_THREE?",
    answer: "FAQ_ANSWER_THREE.",
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// Page
// ──────────────────────────────────────────────────────────────────────────────

export default function CampaignPage() {
  return (
    <PageWrapper>
      <PageHero
        kicker="CAMPAIGN_KICKER"
        title={
          <>
            <span className="text-white">HERO_TITLE_PREFIX </span>
            <span className="text-gradient italic">HERO_TITLE_ACCENT</span>
            <span className="text-white"> HERO_TITLE_SUFFIX.</span>
          </>
        }
        subtitle="HERO_SUBTITLE — 1–2 sentences, 25–45 words, plain English, no adjectives like 'revolutionary'."
      />

      {/* Slot 1: VALUE PROPS — white bg */}
      <section className="relative py-16 md:py-36 bg-[var(--color-bg)] overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-4">
              <ChevronArrows count={6} className="opacity-60" />
              <span className="text-xs font-semibold tracking-[4px] uppercase text-[var(--color-footer-bg)]">
                VALUE_PROPS_KICKER
              </span>
            </div>
            <h2 className="text-[clamp(1.8rem,4vw,3.2rem)] font-bold leading-tight mb-10 md:mb-16 text-[var(--color-text-primary)]">
              VALUE_PROPS_HEADING{" "}
              <span className="text-gradient">VALUE_PROPS_ACCENT.</span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {valueProps.map((item, i) => (
              <AnimatedSection key={item.title} delay={0.08 * i}>
                <div className="surface-card h-full p-5 md:p-8 rounded-2xl transition-all duration-500 md:hover:-translate-y-1">
                  <div className="text-3xl md:text-5xl font-bold text-gradient mb-3">
                    {item.stat}
                  </div>
                  <h3 className="text-base md:text-lg font-bold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Slot 2: TIMELINE — diagonal bg */}
      <section className="relative py-16 md:py-36 overflow-hidden">
        <DiagonalBg />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, rgba(0,114,206,0.06) 0%, transparent 55%)",
          }}
        />
        <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-10">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-4">
              <ChevronArrows count={6} className="opacity-60" />
              <span className="text-xs font-semibold tracking-[4px] uppercase text-[var(--color-footer-bg)]">
                TIMELINE_KICKER
              </span>
            </div>
            <h2 className="text-[clamp(1.8rem,4vw,3.2rem)] font-bold leading-tight mb-10 md:mb-16">
              TIMELINE_HEADING{" "}
              <span className="text-gradient">TIMELINE_ACCENT.</span>
            </h2>
          </AnimatedSection>

          <div className="space-y-4 md:space-y-6">
            {phases.map((p, i) => (
              <AnimatedSection key={p.weeks} delay={0.06 * i}>
                <div className="surface-card p-5 md:p-7 rounded-2xl">
                  <span className="text-[0.65rem] md:text-xs font-semibold tracking-[3px] uppercase text-[var(--color-euvic)]">
                    {p.weeks}
                  </span>
                  <h3 className="text-base md:text-xl font-bold mt-2 mb-2">
                    {p.title}
                  </h3>
                  <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Slot 3: NUMBERS / SOCIAL PROOF — white bg */}
      <section className="relative py-16 md:py-36 bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <AnimatedSection>
            <h2 className="text-[clamp(1.8rem,4vw,3.2rem)] font-bold leading-tight text-center mb-10 md:mb-16">
              NUMBERS_HEADING{" "}
              <span className="text-gradient">NUMBERS_ACCENT.</span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            {numbers.map((n, i) => (
              <AnimatedSection key={n.label} delay={0.06 * i}>
                <div className="surface-card text-center p-4 md:p-6 rounded-2xl transition-all duration-500 md:hover:-translate-y-1">
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

      {/* Slot 4: FAQ — diagonal bg (pair with the surrounding rhythm) */}
      <FAQ items={faqItems} variant="diagonal" />

      {/* Final CTA — always last before the footer. PageWrapper mounts
          the Footer + ContactModal automatically. */}
      <CTA
        questions={[
          "CTA_QUESTION_ONE?",
          "CTA_QUESTION_TWO?",
          "CTA_QUESTION_THREE?",
        ]}
      />
    </PageWrapper>
  );
}
