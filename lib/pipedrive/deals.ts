import {
  getPipedriveV2BaseUrl,
  getPipedriveApiToken,
  getPipedrivePipelineId,
  getPipedriveStageId,
} from './client';

export interface CreateDealParams {
  title: string;
  personId: number;
  orgId?: number;
}

interface PipedriveDealResponse {
  data?: { id: number };
  error?: string;
}

export async function createDeal(params: CreateDealParams): Promise<number | null> {
  const pipelineId = getPipedrivePipelineId();
  const stageId = getPipedriveStageId();
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
