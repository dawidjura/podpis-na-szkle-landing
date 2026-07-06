import { readFileSync } from "fs";
import { join } from "path";

export const PRE_WEBINAR_BANNER_FILENAME = "Webinar przypomnienie.png";
export const PRE_WEBINAR_BANNER_CID = "podpis-prewebinar-banner";
export const PRE_WEBINAR_BANNER_ALT =
  "Przypominamy o webinarze — Podpis na szkle. EUVIC i GS1 Polska.";

export function loadPreWebinarBannerBase64(): string | null {
  try {
    const filePath = join(
      process.cwd(),
      "public",
      "assets",
      PRE_WEBINAR_BANNER_FILENAME,
    );
    return readFileSync(filePath).toString("base64");
  } catch {
    return null;
  }
}

export interface PreWebinarBannerForSend {
  src: string;
  attachments: Array<Record<string, unknown>>;
}

/** Inline CID (Graph) lub publiczny URL — jak mail potwierdzający zapis. */
export function getPreWebinarBannerForSend(origin: string): PreWebinarBannerForSend {
  const b64 = loadPreWebinarBannerBase64();
  if (b64) {
    return {
      src: `cid:${PRE_WEBINAR_BANNER_CID}`,
      attachments: [
        {
          "@odata.type": "#microsoft.graph.fileAttachment",
          name: PRE_WEBINAR_BANNER_FILENAME,
          contentType: "image/png",
          contentBytes: b64,
          contentId: PRE_WEBINAR_BANNER_CID,
          isInline: true,
        },
      ],
    };
  }
  const base = origin.replace(/\/$/, "");
  return {
    src: base
      ? `${base}/assets/${encodeURIComponent(PRE_WEBINAR_BANNER_FILENAME)}`
      : "",
    attachments: [],
  };
}

/** Podgląd HTML w przeglądarce (data URI). */
export function getPreWebinarBannerSrcForPreview(origin: string): string {
  const b64 = loadPreWebinarBannerBase64();
  if (b64) return `data:image/png;base64,${b64}`;
  const base = origin.replace(/\/$/, "");
  return base
    ? `${base}/assets/${encodeURIComponent(PRE_WEBINAR_BANNER_FILENAME)}`
    : "";
}
