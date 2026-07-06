#!/usr/bin/env npx tsx
/**
 * Wysyłka maili pre-webinar z listy JSON (domyślnie registrants.json).
 *
 * Domyślnie DRY-RUN. Wysyłka tylko z --send.
 *
 *   npm run mail:pre:fetch
 *   npm run mail:pre:preview
 *   npm run mail:pre:self
 *   npx tsx scripts/send-prewebinar.ts --send
 */
import "./load-env";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { getAutologinJoinUrl } from "../lib/clickmeeting-register";
import {
  PRE_WEBINAR_BANNER_ALT,
  getPreWebinarBannerForSend,
} from "../lib/emails/pre-webinar-banner";
import {
  PRE_WEBINAR_LANDING_URL,
  PRE_WEBINAR_SUBJECT,
  buildPreWebinarReminderHtml,
} from "../lib/emails/pre-webinar-reminder";
import { sendHtmlMail } from "../lib/mailing/graph";
import { getPublicOrigin } from "../lib/mailing/site-url";
import {
  getDefaultRecipientsList,
  getDefaultRecipientsPath,
  loadRecipientsFromFile,
  type PreWebinarRecipient,
} from "./prewebinar-recipients";

const FAILURES_PATH = resolve(__dirname, "recipients", "send-failures.json");

interface SendFailure {
  email: string;
  name?: string;
  stage: "autologin" | "send";
  error: string;
}

function formatError(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

function writeFailuresReport(report: {
  runAt: string;
  subject: string;
  sourceList: string;
  stats: { ok: number; fail: number; total: number };
  failures: SendFailure[];
}): void {
  mkdirSync(resolve(__dirname, "recipients"), { recursive: true });
  writeFileSync(FAILURES_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
}

interface CliOptions {
  send: boolean;
  self: string | null;
  only: string[];
  limit: number | null;
  throttleMs: number;
  noAutologin: boolean;
  list: string | null;
}

function parseArgs(argv: string[]): CliOptions {
  const opts: CliOptions = {
    send: false,
    self: null,
    only: [],
    limit: null,
    throttleMs: 2000,
    noAutologin: false,
    list: null,
  };

  for (const arg of argv) {
    if (arg === "--send") opts.send = true;
    else if (arg === "--no-autologin") opts.noAutologin = true;
    else if (arg.startsWith("--list=")) {
      opts.list = arg.slice("--list=".length).trim() || null;
    } else if (arg.startsWith("--self=")) {
      opts.self = arg.slice("--self=".length).trim().toLowerCase() || null;
    } else if (arg.startsWith("--only=")) {
      opts.only = arg
        .slice("--only=".length)
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
    } else if (arg.startsWith("--limit=")) {
      const n = parseInt(arg.slice("--limit=".length), 10);
      if (Number.isFinite(n) && n > 0) opts.limit = n;
    } else if (arg.startsWith("--throttle-ms=")) {
      const n = parseInt(arg.slice("--throttle-ms=".length), 10);
      if (Number.isFinite(n) && n >= 0) opts.throttleMs = n;
    }
  }

  return opts;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function filterRecipients(
  list: PreWebinarRecipient[],
  opts: CliOptions,
): PreWebinarRecipient[] {
  let out = list;
  if (opts.only.length) {
    out = out.filter((r) => opts.only.includes(r.email.trim().toLowerCase()));
  }
  if (opts.limit != null) out = out.slice(0, opts.limit);
  return out;
}

async function main(): Promise<void> {
  const opts = parseArgs(process.argv.slice(2));
  const origin = getPublicOrigin() || "https://podpis-na-szkle.euvic.io";
  const bannerPack = getPreWebinarBannerForSend(origin);
  const banner = {
    src: bannerPack.src,
    href: PRE_WEBINAR_LANDING_URL,
    alt: PRE_WEBINAR_BANNER_ALT,
  };

  let recipients: PreWebinarRecipient[];
  let listPath: string;

  if (opts.self) {
    recipients = [{ email: opts.self, name: "Test" }];
    listPath = `--self (${opts.self})`;
    console.log(`[pre-webinar] tryb --self → tylko ${opts.self}`);
  } else {
    listPath = opts.list ?? getDefaultRecipientsPath();
    const source = opts.list
      ? loadRecipientsFromFile(opts.list)
      : getDefaultRecipientsList();
    console.log(`[pre-webinar] lista: ${listPath}`);
    recipients = filterRecipients(source, opts);
  }

  console.log(
    `[pre-webinar] send=${opts.send} count=${recipients.length} throttle=${opts.throttleMs}ms`,
  );

  if (!recipients.length) {
    console.log(
      `Lista pusta — uruchom npm run mail:pre:fetch lub wklej odbiorców do ${getDefaultRecipientsPath()} (patrz scripts/recipients/README.md), albo użyj --self=adres`,
    );
    return;
  }

  if (!opts.send) {
    console.log("[pre-webinar] DRY-RUN — brak wysyłki. Dodaj --send aby wysłać.");
    for (const r of recipients.slice(0, 15)) {
      console.log(`  - ${r.email}${r.name ? ` (${r.name})` : ""}`);
    }
    if (recipients.length > 15) {
      console.log(`  ... i ${recipients.length - 15} więcej`);
    }
    return;
  }

  let ok = 0;
  let fail = 0;
  const failures: SendFailure[] = [];

  for (const recipient of recipients) {
    const email = recipient.email.trim().toLowerCase();
    try {
      let joinUrl: string | undefined;
      if (!opts.noAutologin) {
        try {
          joinUrl = await getAutologinJoinUrl({
            email,
            name: recipient.name,
          });
        } catch (err) {
          fail++;
          failures.push({
            email,
            name: recipient.name,
            stage: "autologin",
            error: formatError(err),
          });
          console.error(`[fail] ${email} (autologin)`, err);
          if (opts.throttleMs > 0) await sleep(opts.throttleMs);
          continue;
        }
      }

      const html = buildPreWebinarReminderHtml({ joinUrl, banner });

      await sendHtmlMail({
        to: { address: email, name: recipient.name ?? email },
        subject: PRE_WEBINAR_SUBJECT,
        html,
        attachments: bannerPack.attachments,
      });

      ok++;
      console.log(`[ok] ${email}`);
    } catch (err) {
      fail++;
      failures.push({
        email,
        name: recipient.name,
        stage: "send",
        error: formatError(err),
      });
      console.error(`[fail] ${email} (send)`, err);
    }

    if (opts.throttleMs > 0) await sleep(opts.throttleMs);
  }

  console.log(`[pre-webinar] done: ${ok} ok, ${fail} fail`);

  if (failures.length) {
    writeFailuresReport({
      runAt: new Date().toISOString(),
      subject: PRE_WEBINAR_SUBJECT,
      sourceList: listPath,
      stats: { ok, fail, total: recipients.length },
      failures,
    });
    console.log(`[pre-webinar] błędy zapisane → ${FAILURES_PATH}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
