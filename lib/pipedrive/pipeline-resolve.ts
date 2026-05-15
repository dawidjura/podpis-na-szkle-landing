import { getPipedriveApiToken, getPipedriveCompanyDomain } from './client';

const DEFAULT_PIPELINE_NAME = 'Webinar';
const DEFAULT_STAGE_NAME = 'Rejestracja';

interface V1Stage {
  id: number;
  name: string;
}

interface V1Pipeline {
  id: number;
  name: string;
  active?: boolean;
  stages?: V1Stage[];
}

interface V1PipelinesResponse {
  success?: boolean;
  data?: V1Pipeline[];
}

interface V1StagesResponse {
  success?: boolean;
  data?: V1Stage[];
}

let resolvedPlacement: { pipelineId: number; stageId: number } | null = null;
/** Po nieudanym dopasowaniu (przy poprawnej odpowiedzi API) nie pytaj w kółko. */
let namedResolutionExhausted = false;

function norm(s: string): string {
  return s.trim().toLowerCase();
}

async function fetchStagesForPipeline(
  domain: string,
  token: string,
  pipelineId: number,
): Promise<V1Stage[]> {
  const url = `https://${domain}.pipedrive.com/api/v1/stages?pipeline_id=${pipelineId}&limit=500`;
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'x-api-token': token },
      cache: 'no-store',
    });
    if (!res.ok) {
      console.error('[Pipedrive] resolve stages HTTP error', { status: res.status, pipelineId });
      return [];
    }
    const json = (await res.json()) as V1StagesResponse;
    if (!json.success || !Array.isArray(json.data)) {
      console.error('[Pipedrive] resolve stages unexpected body', json);
      return [];
    }
    return json.data;
  } catch (err) {
    console.error('[Pipedrive] resolve stages network error', err);
    return [];
  }
}

/**
 * Jednorazowo dopasowuje lejek i etap po nazwie.
 * Lista `pipelines` zwykle nie zawiera tablicy etapów — wtedy pobieramy `GET /v1/stages?pipeline_id=…`.
 */
export async function resolveNamedPipelineStage(): Promise<{
  pipelineId: number;
  stageId: number;
} | null> {
  if (resolvedPlacement) return resolvedPlacement;
  if (namedResolutionExhausted) return null;

  const pipelineTarget = norm(process.env.NEXT_PIPEDRIVE_PIPELINE_NAME ?? DEFAULT_PIPELINE_NAME);
  const stageTarget = norm(process.env.NEXT_PIPEDRIVE_STAGE_NAME ?? DEFAULT_STAGE_NAME);
  const domain = getPipedriveCompanyDomain();
  const token = getPipedriveApiToken();

  if (!domain || !token) {
    return null;
  }

  const url = `https://${domain}.pipedrive.com/api/v1/pipelines`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'GET',
      headers: { 'x-api-token': token },
      cache: 'no-store',
    });
  } catch (err) {
    console.error('[Pipedrive] resolve pipelines network error', err);
    return null;
  }

  if (!res.ok) {
    console.error('[Pipedrive] resolve pipelines HTTP error', res.status);
    return null;
  }

  let json: V1PipelinesResponse;
  try {
    json = (await res.json()) as V1PipelinesResponse;
  } catch (parseErr) {
    console.error('[Pipedrive] resolve pipelines JSON error', parseErr);
    return null;
  }

  if (!json.success || !Array.isArray(json.data)) {
    console.error('[Pipedrive] resolve pipelines unexpected body', json);
    namedResolutionExhausted = true;
    return null;
  }

  const pipelines = json.data.filter((p) => p.active !== false);
  const pipeline = pipelines.find((p) => norm(p.name) === pipelineTarget);

  if (!pipeline) {
    const names = json.data.map((p) => p.name).join(', ');
    console.warn(
      `[Pipedrive] Brak lejka "${pipelineTarget}". Dostępne nazwy (wszystkie z API): ${names || '(pusto)'}`,
    );
    namedResolutionExhausted = true;
    return null;
  }

  let stages: V1Stage[] = pipeline.stages?.length ? pipeline.stages : [];
  if (!stages.length) {
    stages = await fetchStagesForPipeline(domain, token, pipeline.id);
  }

  if (!stages.length) {
    console.warn(
      `[Pipedrive] Lejek "${pipeline.name}" (id ${pipeline.id}) nie ma etapów w odpowiedzi API.`,
    );
    namedResolutionExhausted = true;
    return null;
  }

  const stage = stages.find((s) => norm(s.name) === stageTarget);
  if (!stage) {
    const stageNames = stages.map((s) => s.name).join(', ');
    console.warn(
      `[Pipedrive] W lejku "${pipeline.name}" brak etapu "${stageTarget}". Etapy API: ${stageNames}`,
    );
    namedResolutionExhausted = true;
    return null;
  }

  resolvedPlacement = { pipelineId: pipeline.id, stageId: stage.id };
  return resolvedPlacement;
}
