import { insertWebinarSignupPipedrive } from "@/lib/insert-webinar-pipedrive";
import { insertWebinarSignupSupabase } from "@/lib/supabase-admin";
import type { WebinarSignupRow } from "@/lib/webinar-signup-types";

export type { WebinarSignupRow } from "@/lib/webinar-signup-types";

/** `ENV=PRODUCTION` → Pipedrive; `ENV=LOCAL` (lub brak / inna wartość) → Supabase. */
export function isWebinarSignupProduction(): boolean {
  return (process.env.ENV ?? "").trim().toUpperCase() === "PRODUCTION";
}

export async function insertWebinarSignup(row: WebinarSignupRow): Promise<void> {
  if (isWebinarSignupProduction()) {
    await insertWebinarSignupPipedrive(row);
    return;
  }
  await insertWebinarSignupSupabase(row);
}
