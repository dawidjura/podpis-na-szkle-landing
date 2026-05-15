import { getPipedriveV2BaseUrl, getPipedriveApiToken } from "./client";

export interface CreatePersonParams {
  name: string;
  email?: string;
  phone?: string;
  orgId?: number;
}

interface PipedriveV2PersonResponse {
  data?: { id: number };
  error?: string;
}

export async function createPerson(
  params: CreatePersonParams
): Promise<number | null> {
  const baseUrl = getPipedriveV2BaseUrl();
  const token = getPipedriveApiToken();
  const url = `${baseUrl}/persons`;

  const body: Record<string, unknown> = {
    name: params.name,
  };
  if (params.orgId != null) body.org_id = params.orgId;
  if (params.email) {
    body.emails = [{ value: params.email, primary: true }];
  }
  if (params.phone) {
    body.phones = [{ value: params.phone, primary: true }];
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-token": token,
    },
    body: JSON.stringify(body),
  });

  let data: PipedriveV2PersonResponse;
  try {
    data = (await res.json()) as PipedriveV2PersonResponse;
  } catch (parseErr) {
    console.error("[Pipedrive] createPerson response parse error", parseErr);
    return null;
  }
  if (!res.ok || data.error) {
    console.error("[Pipedrive] createPerson failed", {
      status: res.status,
      response: data.error ?? data,
    });
    return null;
  }
  return data.data?.id ?? null;
}
