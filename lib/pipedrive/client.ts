function readEnv(key: string): string {
  return (process.env[key] ?? "").trim();
}

/** Akceptuje `euvicsa` albo pełny URL `https://euvicsa.pipedrive.com`. */
export function normalizePipedriveDomain(raw: string): string {
  let d = raw.trim();
  if (!d) return "";

  d = d.replace(/^https?:\/\//i, "");
  d = d.replace(/\/.*$/, "");
  d = d.replace(/\.pipedrive\.com.*$/i, "");
  return d.toLowerCase();
}

function getDomainRaw(): string {
  return readEnv("NEXT_PIPEDRIVE_DOMAIN");
}

function getTokenRaw(): string {
  return readEnv("NEXT_PIPEDRIVE_API_TOKEN");
}

export function getPipedriveCompanyDomain(): string {
  return normalizePipedriveDomain(getDomainRaw());
}

export function isPipedriveConfigured(): boolean {
  return !!getPipedriveCompanyDomain() && !!getTokenRaw();
}

export function getPipedriveV2BaseUrl(): string {
  return `https://${getPipedriveCompanyDomain()}.pipedrive.com/api/v2`;
}

export function getPipedriveApiToken(): string {
  return getTokenRaw();
}

export function getPipedrivePipelineId(): number {
  const n = parseInt(readEnv("NEXT_PIPEDRIVE_PIPELINE_ID") || "1", 10);
  return Number.isFinite(n) ? n : 1;
}

export function getPipedriveStageId(): number | undefined {
  const raw = readEnv("NEXT_PIPEDRIVE_STAGE_ID");
  if (!raw) return undefined;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? n : undefined;
}
