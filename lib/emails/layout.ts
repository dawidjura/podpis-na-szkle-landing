export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function escAttr(s: string): string {
  return escapeHtml(s);
}

const P =
  "margin:0 0 16px 0;font-family:Segoe UI,Arial,sans-serif;font-size:15px;line-height:1.55;color:#2c3135;";
const P_LAST = P.replace("16px", "0");

export function emailParagraph(text: string, last = false, marginTopPx = 0): string {
  const top = marginTopPx > 0 ? ` margin-top:${marginTopPx}px;` : "";
  return `<p style="${last ? P_LAST : P}${top}">${text}</p>`;
}

export function emailButton(href: string, label: string): string {
  const safeHref = escAttr(href);
  const safeLabel = escapeHtml(label);
  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 20px 0;">
  <tr>
    <td style="border-radius:4px;background:#006eb8;">
      <a href="${safeHref}" target="_blank" rel="noopener noreferrer"
         style="display:inline-block;padding:14px 28px;font-family:Segoe UI,Arial,sans-serif;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">
        ${safeLabel}
      </a>
    </td>
  </tr>
</table>`;
}

const LIST_STYLE =
  "margin:0 0 16px 0;padding:0 0 0 22px;font-family:Segoe UI,Arial,sans-serif;font-size:15px;line-height:1.55;color:#2c3135;";
const LIST_ITEM = "margin:0 0 8px 0;";

export function emailHeading(text: string, marginTopPx = 0): string {
  const top = marginTopPx > 0 ? ` margin-top:${marginTopPx}px;` : "";
  return `<p style="${P.replace("16px", "12px")}${top}"><strong>${text}</strong></p>`;
}

export function emailList(items: string[]): string {
  const lis = items
    .map(
      (item, i) =>
        `<li style="${LIST_ITEM}${i === items.length - 1 ? "margin:0;" : ""}">${item}</li>`,
    )
    .join("");
  return `<ul style="${LIST_STYLE}">${lis}</ul>`;
}

export interface EmailBanner {
  /** src obrazka (cid:… lub URL/data URI). */
  src: string;
  /** Link, na który klika baner (np. strona webinaru). */
  href?: string;
  alt?: string;
}

function bannerRowHtml(banner?: EmailBanner): string {
  if (!banner?.src) return "";
  const img = `<img src="${escAttr(banner.src)}" width="600" alt="${escapeHtml(
    banner.alt ?? "",
  )}" border="0" style="display:block;width:100%;max-width:600px;height:auto;margin:0;padding:0;border:0;" />`;
  const inner = banner.href
    ? `<a href="${escAttr(
        banner.href,
      )}" target="_blank" rel="noopener noreferrer" style="text-decoration:none;display:block;line-height:0;">${img}</a>`
    : img;
  return `<tr><td style="padding:0;background:#ffffff;">${inner}</td></tr>`;
}

export function wrapEmailBody(innerHtml: string, banner?: EmailBanner): string {
  return `<!DOCTYPE html>
<html lang="pl">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f0f0f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f0f0f0;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:4px;overflow:hidden;">
          ${bannerRowHtml(banner)}
          <tr>
            <td style="padding:28px 28px 32px 28px;">
              ${innerHtml}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export const WEBINAR_TITLE =
  "„Podpis na szkle – dowód dostawy nie do podważenia”";
export const WEBINAR_DATE = "2 lipca 2026 | 14:00 | 60 minut";
