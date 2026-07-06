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

interface PipedriveV2PersonGetResponse {
  data?: {
    id: number;
    name?: string;
    emails?: Array<{ value?: string; primary?: boolean }>;
  };
  error?: string;
}

export interface PipedrivePersonInfo {
  id: number;
  name: string;
  email: string | null;
}

export async function getPerson(
  personId: number,
): Promise<PipedrivePersonInfo | null> {
  const baseUrl = getPipedriveV2BaseUrl();
  const token = getPipedriveApiToken();
  const url = `${baseUrl}/persons/${personId}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { "x-api-token": token },
    cache: "no-store",
  });

  let data: PipedriveV2PersonGetResponse;
  try {
    data = (await res.json()) as PipedriveV2PersonGetResponse;
  } catch (parseErr) {
    console.error("[Pipedrive] getPerson response parse error", parseErr);
    return null;
  }
  if (!res.ok || data.error || !data.data) {
    console.error("[Pipedrive] getPerson failed", {
      status: res.status,
      personId,
      response: data.error ?? data,
    });
    return null;
  }

  const emails = data.data.emails ?? [];
  const primary = emails.find((e) => e.primary && e.value?.trim());
  const fallback = emails.find((e) => e.value?.trim());
  const email = (primary?.value ?? fallback?.value ?? "").trim() || null;

  return {
    id: data.data.id,
    name: (data.data.name ?? "").trim() || email || `person-${personId}`,
    email,
  };
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
