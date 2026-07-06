/**
 * Listy odbiorców pre-webinar — pliki JSON w scripts/recipients/.
 *
 * Domyślna lista (po fetch z Pipedrive): registrants.json
 *
 * Format JSON (patrz scripts/recipients/README.md):
 *   - [{ "email": "...", "name": "..." }, ...]
 *   - ["a@x.pl", "b@y.pl", ...]
 *   - { "recipients": [ ... ] }
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export type PreWebinarRecipient = {
  email: string;
  name?: string;
};

export const DEFAULT_RECIPIENTS_FILE = "registrants.json";

const RECIPIENTS_DIR = resolve(__dirname, "recipients");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type RawRecipient = {
  email?: unknown;
  name?: unknown;
  firstName?: unknown;
  lastName?: unknown;
};

function coerceName(raw: RawRecipient): string | undefined {
  if (typeof raw.name === "string" && raw.name.trim()) return raw.name.trim();
  const parts = [raw.firstName, raw.lastName]
    .filter((p): p is string => typeof p === "string" && p.trim().length > 0)
    .map((p) => p.trim());
  return parts.length ? parts.join(" ") : undefined;
}

function normalizeEntry(entry: unknown): PreWebinarRecipient | null {
  if (typeof entry === "string") {
    const email = entry.trim();
    return EMAIL_RE.test(email) ? { email } : null;
  }
  if (entry && typeof entry === "object") {
    const raw = entry as RawRecipient;
    if (typeof raw.email === "string") {
      const email = raw.email.trim();
      if (EMAIL_RE.test(email)) {
        const name = coerceName(raw);
        return name ? { email, name } : { email };
      }
    }
  }
  return null;
}

function parseRecipientsJson(text: string, file: string): PreWebinarRecipient[] {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch (err) {
    throw new Error(
      `Niepoprawny JSON w ${file}: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  let rawList: unknown[];
  if (Array.isArray(data)) {
    rawList = data;
  } else if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as { recipients?: unknown }).recipients)
  ) {
    rawList = (data as { recipients: unknown[] }).recipients;
  } else {
    throw new Error(
      `${file}: oczekiwano tablicy lub { "recipients": [...] }`,
    );
  }

  const seen = new Set<string>();
  const out: PreWebinarRecipient[] = [];
  for (const entry of rawList) {
    const rec = normalizeEntry(entry);
    if (!rec) continue;
    const key = rec.email.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(rec);
  }
  return out;
}

/** Wczytuje listę odbiorców z konkretnego pliku JSON (ścieżka względna lub absolutna). */
export function loadRecipientsFromFile(filePath: string): PreWebinarRecipient[] {
  const abs = resolve(filePath);
  let text: string;
  try {
    text = readFileSync(abs, "utf8");
  } catch {
    throw new Error(`Nie znaleziono pliku z odbiorcami: ${abs}`);
  }
  return parseRecipientsJson(text, abs);
}

/** Domyślna lista: scripts/recipients/registrants.json */
export function getDefaultRecipientsList(): PreWebinarRecipient[] {
  const file = resolve(RECIPIENTS_DIR, DEFAULT_RECIPIENTS_FILE);
  return loadRecipientsFromFile(file);
}

export function getDefaultRecipientsPath(): string {
  return resolve(RECIPIENTS_DIR, DEFAULT_RECIPIENTS_FILE);
}
