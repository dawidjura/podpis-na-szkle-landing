import { getPipedriveApiToken, getPipedriveCompanyDomain } from "./client";

interface PipedriveNoteResponse {
  success?: boolean;
  error?: string;
}

/** Notatka przy szansie (API v1). */
export async function addDealNote(dealId: number, content: string): Promise<void> {
  const domain = getPipedriveCompanyDomain();
  const token = getPipedriveApiToken();
  const url = `https://${domain}.pipedrive.com/v1/notes`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-token": token,
    },
    body: JSON.stringify({
      deal_id: dealId,
      content,
    }),
  });

  let data: PipedriveNoteResponse;
  try {
    data = (await res.json()) as PipedriveNoteResponse;
  } catch (parseErr) {
    console.error("[Pipedrive] addDealNote response parse error", parseErr);
    return;
  }
  if (!res.ok || data.error || data.success === false) {
    console.error("[Pipedrive] addDealNote failed", {
      status: res.status,
      response: data.error ?? data,
    });
  }
}
