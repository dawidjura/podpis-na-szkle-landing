#!/usr/bin/env npx tsx
/**
 * Podgląd maila pre-webinar (zero wysyłki).
 *   npm run mail:pre:preview
 */
import "./load-env";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import {
  PRE_WEBINAR_BANNER_ALT,
  getPreWebinarBannerSrcForPreview,
} from "../lib/emails/pre-webinar-banner";
import { buildPreWebinarReminderHtml, PRE_WEBINAR_LANDING_URL } from "../lib/emails/pre-webinar-reminder";
import { getPublicOrigin } from "../lib/mailing/site-url";

function main(): void {
  const origin = getPublicOrigin() || "https://podpis-na-szkle.euvic.io";
  const banner = {
    src: getPreWebinarBannerSrcForPreview(origin),
    href: PRE_WEBINAR_LANDING_URL,
    alt: PRE_WEBINAR_BANNER_ALT,
  };

  const html = buildPreWebinarReminderHtml({
    joinUrl: "https://example.clickmeeting.com/demo-autologin",
    banner,
  });

  const dir = join(process.cwd(), "out", "preview");
  mkdirSync(dir, { recursive: true });
  const path = join(dir, "prewebinar.html");
  writeFileSync(path, html, "utf8");

  console.log("Podgląd zapisany (zero wysyłki):");
  console.log(`  ${path}`);
}

main();
