import { getPipedriveV2BaseUrl, getPipedriveApiToken } from './client';

export interface CreateOrganizationParams {
  name: string;
}

interface PipedriveV2OrganizationResponse {
  data?: { id: number };
  error?: string;
}

export async function createOrganization(params: CreateOrganizationParams): Promise<number | null> {
  const baseUrl = getPipedriveV2BaseUrl();
  const token = getPipedriveApiToken();
  const url = `${baseUrl}/organizations`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-token': token,
    },
    body: JSON.stringify({ name: params.name }),
  });

  let data: PipedriveV2OrganizationResponse;
  try {
    data = (await res.json()) as PipedriveV2OrganizationResponse;
  } catch (parseErr) {
    console.error('[Pipedrive] createOrganization response parse error', parseErr);
    return null;
  }
  if (!res.ok || data.error) {
    console.error('[Pipedrive] createOrganization failed', { status: res.status, response: data.error ?? data });
    return null;
  }
  return data.data?.id ?? null;
}
