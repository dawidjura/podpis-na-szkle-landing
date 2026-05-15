import { insertWebinarSignupPipedrive } from "@/lib/insert-webinar-pipedrive";
import { insertWebinarSignupSupabase } from "@/lib/supabase-admin";
import type { WebinarSignupRow } from "@/lib/webinar-signup-types";

export type { WebinarSignupRow } from "@/lib/webinar-signup-types";

export type WebinarSignupBackend = "pipedrive" | "supabase";

/**
 * Gdzie zapisujemy zapis na webinar:
 * - `ENV=LOCAL` → zawsze Supabase (np. zmienne dla Preview na Vercel).
 * - `ENV=PRODUCTION` → zawsze Pipedrive.
 * - gdy `ENV` jest puste: `VERCEL_ENV=production` → Pipedrive; preview / development / poza Vercel → Supabase.
 *
 * Vercel (Environment Variables): Production → `ENV=PRODUCTION` + Pipedrive; Preview → `ENV=LOCAL` + Supabase.
 */
export function getWebinarSignupBackend(): WebinarSignupBackend {
  const env = (process.env.ENV ?? "").trim().toUpperCase();
  if (env === "LOCAL") return "supabase";
  if (env === "PRODUCTION") return "pipedrive";

  const vercelEnv = (process.env.VERCEL_ENV ?? "").trim().toLowerCase();
  if (vercelEnv === "production") return "pipedrive";
  return "supabase";
}

/** Synonim dla „czy backend to Pipedrive” (CRM produkcyjny). */
export function isWebinarSignupProduction(): boolean {
  return getWebinarSignupBackend() === "pipedrive";
}

export async function insertWebinarSignup(row: WebinarSignupRow): Promise<void> {
  if (getWebinarSignupBackend() === "pipedrive") {
    await insertWebinarSignupPipedrive(row);
    return;
  }
  await insertWebinarSignupSupabase(row);
}
