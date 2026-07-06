/** Public origin for email links and redirects. */
export function getPublicOrigin(): string {
  const normalize = (raw: string | undefined) => {
    const u = raw?.trim();
    if (!u) return "";
    return u.replace(/\/$/, "");
  };
  const siteUrl = normalize(process.env.SITE_URL);
  if (siteUrl) return siteUrl;
  const nextPublic = normalize(process.env.NEXT_PUBLIC_SITE_URL);
  if (nextPublic) return nextPublic;
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "")}`;
  return "";
}

export function getMaterialsCdnUrl(): string {
  return (process.env.MATERIALS_CDN_URL ?? "").trim().replace(/\/$/, "");
}

export const DEFAULT_REWARD_PDF =
  "/assets/2026-01-02-klauzula-EUV-dla-osob-rejestrujacych-sie-na-wydarzenia.pdf";

export function getRewardPdfPath(): string {
  const path = (process.env.REWARD_PDF_PATH ?? process.env.NEXT_PUBLIC_REWARD_PDF_PATH ?? "").trim();
  if (path) return path.startsWith("/") ? path : `/${path}`;
  return DEFAULT_REWARD_PDF;
}

export function getWebinarJoinUrl(): string {
  const url = process.env.CLICKMEETING_WEBINAR_URL?.trim();
  if (!url) return "";
  return url.replace(/\/$/, "");
}
