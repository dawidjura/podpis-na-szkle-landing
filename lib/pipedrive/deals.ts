import {
  getPipedriveV2BaseUrl,
  getPipedriveApiToken,
  getPipedrivePipelineId,
  getPipedriveStageId,
  getPipedriveCompanyDomain,
} from './client';
import { resolveNamedPipelineStage } from './pipeline-resolve';

export interface CreateDealParams {
  title: string;
  personId: number;
  orgId?: number;
}

interface PipedriveDealResponse {
  data?: { id: number };
  error?: string;
}

export interface PipedriveDealListItem {
  id: number;
  title: string;
  person_id: number | null;
}

interface V1DealsListResponse {
  success?: boolean;
  data?: Array<{ id: number; title: string; person_id?: { value?: number } | number | null }>;
  additional_data?: {
    pagination?: { start?: number; limit?: number; more_items_in_collection?: boolean };
  };
}

function extractPersonId(
  raw: { person_id?: { value?: number } | number | null } | number | null | undefined,
): number | null {
  if (raw == null) return null;
  if (typeof raw === "number") return raw;
  if (typeof raw === "object" && typeof raw.value === "number") return raw.value;
  return null;
}

/** Wszystkie deale z lejka (paginacja v1). */
export async function listDealsInPipeline(
  pipelineId: number,
  options?: { titlePrefix?: string },
): Promise<PipedriveDealListItem[]> {
  const domain = getPipedriveCompanyDomain();
  const token = getPipedriveApiToken();
  if (!domain || !token) {
    throw new Error("Brak NEXT_PIPEDRIVE_DOMAIN lub NEXT_PIPEDRIVE_API_TOKEN.");
  }

  const prefix = options?.titlePrefix?.trim();
  const out: PipedriveDealListItem[] = [];
  let start = 0;
  const limit = 500;

  for (;;) {
    const url = `https://${domain}.pipedrive.com/api/v1/deals?pipeline_id=${pipelineId}&status=all_not_deleted&start=${start}&limit=${limit}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { "x-api-token": token },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Pipedrive listDeals HTTP ${res.status}`);
    }

    const json = (await res.json()) as V1DealsListResponse;
    if (!json.success || !Array.isArray(json.data)) {
      throw new Error("Pipedrive listDeals: nieoczekiwana odpowiedź API.");
    }

    for (const deal of json.data) {
      const title = deal.title ?? "";
      if (prefix && !title.startsWith(prefix)) continue;
      out.push({
        id: deal.id,
        title,
        person_id: extractPersonId(deal.person_id),
      });
    }

    const more = json.additional_data?.pagination?.more_items_in_collection;
    if (!more) break;
    start += limit;
  }

  return out;
}

export async function createDeal(params: CreateDealParams): Promise<number | null> {
  const named = await resolveNamedPipelineStage();
  let pipelineId: number;
  let stageId: number | undefined;

  if (named) {
    pipelineId = named.pipelineId;
    stageId = named.stageId;
  } else {
    pipelineId = getPipedrivePipelineId();
    stageId = getPipedriveStageId();
  }
  const baseUrl = getPipedriveV2BaseUrl();
  const token = getPipedriveApiToken();
  const url = `${baseUrl}/deals`;

  const body: Record<string, unknown> = {
    title: params.title,
    person_id: params.personId,
    pipeline_id: pipelineId,
  };
  if (params.orgId != null) body.org_id = params.orgId;
  if (stageId != null) body.stage_id = stageId;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-token': token,
    },
    body: JSON.stringify(body),
  });

  let data: PipedriveDealResponse;
  try {
    data = (await res.json()) as PipedriveDealResponse;
  } catch (parseErr) {
    console.error('[Pipedrive] createDeal response parse error', parseErr);
    return null;
  }
  if (!res.ok || data.error) {
    console.error('[Pipedrive] createDeal failed', { status: res.status, response: data.error ?? data });
    return null;
  }
  return data.data?.id ?? null;
}
