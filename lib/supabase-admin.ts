import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: { url: string; key: string; client: SupabaseClient } | null = null;

/** Server-side client with service role permissions — use only in API Routes / Server Actions. */
export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Missing environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  }
  if (cached?.url === url && cached?.key === serviceKey) {
    return cached.client;
  }
  const client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  cached = { url, key: serviceKey, client };
  return client;
}

export type WebinarSignupRow = {
  name: string;
  surname: string;
  phone_number: string;
  email: string;
};

export async function insertWebinarSignup(row: WebinarSignupRow): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("webinar_signups").insert(row);
  if (error) {
    throw error;
  }
}
