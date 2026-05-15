const NEXT_DOMAIN = (process.env.NEXT_PIPEDRIVE_DOMAIN ?? '').trim();
const NEXT_TOKEN = process.env.NEXT_PIPEDRIVE_API_TOKEN ?? '';

const PIPEDRIVE_DOMAIN = NEXT_DOMAIN
  .replace(/^https?:\/\//i, '')
  .replace(/\/.*$/, '')
  .replace(/\.pipedrive\.com.*$/i, '')
  .toLowerCase() || NEXT_DOMAIN;

const PIPEDRIVE_PIPELINE_ID = parseInt(process.env.NEXT_PIPEDRIVE_PIPELINE_ID ?? '1', 10) || 1;
const PIPEDRIVE_STAGE_ID = process.env.NEXT_PIPEDRIVE_STAGE_ID
  ? parseInt(process.env.NEXT_PIPEDRIVE_STAGE_ID, 10)
  : undefined;

export function isPipedriveConfigured(): boolean {
  return !!PIPEDRIVE_DOMAIN && !!NEXT_TOKEN;
}

export function getPipedriveV2BaseUrl(): string {
  return `https://${PIPEDRIVE_DOMAIN}.pipedrive.com/api/v2`;
}

export function getPipedriveApiToken(): string {
  return NEXT_TOKEN;
}

export function getPipedrivePipelineId(): number {
  return PIPEDRIVE_PIPELINE_ID;
}

export function getPipedriveStageId(): number | undefined {
  return PIPEDRIVE_STAGE_ID;
}
