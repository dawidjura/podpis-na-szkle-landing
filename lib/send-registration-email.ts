import { readFileSync } from "fs";
import { join } from "path";
import { ClientSecretCredential } from "@azure/identity";
import { Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";

/** Inline CID — baner wysyłany razem z mailem (Graph), bez zależności od publicznego URL (Vercel Shield, zły SITE_URL itd.). */
const NEWSLETTER_BANNER_CID = "podpis-newsletter-banner";

const TENANT_ID = process.env.MICROSOFT_TENANT_ID ?? "";
const CLIENT_ID = process.env.MICROSOFT_CLIENT_ID ?? "";
const CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET ?? "";

const getCredential = () =>
  new ClientSecretCredential(TENANT_ID, CLIENT_ID, CLIENT_SECRET);

const getAuthProvider = (scopes: string[]) =>
  new TokenCredentialAuthenticationProvider(getCredential(), { scopes });

const getGraphClient = (scopes: string[]) =>
  Client.initWithMiddleware({ authProvider: getAuthProvider(scopes) });

/** Powiadomienia o każdym nowym zapisie (Graph `sendMail` z konta no-reply). */
const WEBINAR_SIGNUP_STAFF_RECIPIENTS = [
  "business+ePOD@euvic.pl",
  "marta.piekarz@euvic.com",
] as const;

export interface WebinarFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

/** Public origin for email images and links. Without it, the banner image is omitted (mail clients need an absolute URL).
 *  With your own domain, set in production (Vercel / hosting env):
 *  - SITE_URL=https://twoja-domena.pl  (recommended, server-only), or
 *  - NEXT_PUBLIC_SITE_URL=https://twoja-domena.pl
 *  VERCEL_URL is used only as fallback (often *.vercel.app, not your custom domain). */
function getPublicOrigin(): string {
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

function loadNewsletterBannerBase64(): string | null {
  try {
    const filePath = join(process.cwd(), "public", "assets", "NewsletterPotwierdzenieZapisu.png");
    return readFileSync(filePath).toString("base64");
  } catch {
    return null;
  }
}

function buildParticipantConfirmationHtml(_data: WebinarFormData, bannerSrc: string, landingUrl: string): string {
  const escAttr = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

  const webinarPageLink = landingUrl
    ? `<a href="${escAttr(landingUrl)}" target="_blank" rel="noopener noreferrer" style="color:#006eb8;text-decoration:underline;">stronie webinaru</a>`
    : "stronie webinaru";

  const bannerImg = bannerSrc
    ? `<img src="${escAttr(bannerSrc)}" width="600" alt="Potwierdzamy zapis na webinar — Podpis na szkle. EUVIC i GS1 Polska." border="0" style="display:block;width:100%;max-width:600px;height:auto;margin:0;padding:0;border:0;" />`
    : "";

  const webinarHref = landingUrl ? escAttr(landingUrl) : "";
  const linkStyle =
    'color:#006eb8;text-decoration:underline;font-weight:inherit;';
  const bannerRow =
    bannerImg && webinarHref
      ? `<a href="${webinarHref}" target="_blank" rel="noopener noreferrer" style="text-decoration:none;display:block;line-height:0;">${bannerImg}</a>`
      : bannerImg;

  const titleLinked =
    webinarHref
      ? `<a href="${webinarHref}" target="_blank" rel="noopener noreferrer" style="${linkStyle}"><strong>„Podpis na szkle – dowód dostawy nie do podważenia”</strong></a>`
      : `<strong>„Podpis na szkle – dowód dostawy nie do podważenia”</strong>`;

  const onlineLinked =
    webinarHref
      ? `Do zobaczenia <a href="${webinarHref}" target="_blank" rel="noopener noreferrer" style="${linkStyle}">online</a>,`
      : "Do zobaczenia online,";

  const p =
    'margin:0 0 16px 0;font-family:Segoe UI,Arial,sans-serif;font-size:15px;line-height:1.55;color:#2c3135;';
  const pLast = p.replace("16px", "0");

  return `<!DOCTYPE html>
<html lang="pl">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f0f0f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f0f0f0;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:4px;overflow:hidden;">
          <tr><td style="padding:0;background:#ffffff;">${bannerRow}</td></tr>
          <tr>
            <td style="padding:28px 28px 32px 28px;">
              <p style="${p}">Dzień dobry,</p>
              <p style="${p}">Dziękujemy za zapis na bezpłatny webinar:</p>
              <p style="${p}">${titleLinked}<br />
              26 czerwca 2026 | 12:00 | 60 minut</p>
              <p style="${p}">Podczas webinaru pokażemy, jak budować wiarygodną dokumentację dostaw i unikać sporów w logistyce.</p>
              <p style="${p}">To wszystko w praktycznej formule:<br />
              30 minut wprowadzenia + 30 minut Q&amp;A</p>
              <p style="${p}">W trakcie spotkania, opowiemy jak:</p>
              <ul style="margin:0 0 16px 0;padding:0 0 0 22px;font-family:Segoe UI,Arial,sans-serif;font-size:15px;line-height:1.55;color:#2c3135;">
                <li style="margin:0 0 8px 0;">skutecznie dokumentować zdarzenia transportowe,</li>
                <li style="margin:0 0 8px 0;">szybciej rozstrzygać reklamacje,</li>
                <li style="margin:0 0 8px 0;">zabezpieczać dowody dostawy,</li>
                <li style="margin:0;">przygotować procesy na e-CMR i cyfrowe dokumenty transportowe.</li>
              </ul>
              <p style="${p}">Porozmawiamy m.in. o podpisie na urządzeniu mobilnym, zdjęciach, geolokalizacji i cyfrowym śladzie zdarzeń w logistyce.</p>
              <p style="${p}">Więcej informacji o agendzie spotkania, prelegentach i szczegółach wydarzenia znajdziesz na ${webinarPageLink}.</p>
              <p style="${p}">Przed spotkaniem prześlemy Ci przypomnienie wraz z linkiem do webinaru.</p>
              <p style="${pLast}">${onlineLinked}<br />Zespół Euvic &amp; GS1</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildStaffSignupNotificationHtml(data: WebinarFormData): string {
  const rows = [
    ["Imię", data.firstName],
    ["Nazwisko", data.lastName],
    ["E-mail", data.email],
    ["Telefon", data.phone],
  ] as const;
  const tr = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;border:1px solid #e0e0e0;font-weight:600;">${escapeHtml(label)}</td>` +
        `<td style="padding:8px 12px;border:1px solid #e0e0e0;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
  return `<!DOCTYPE html>
<html lang="pl">
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:16px;font-family:Segoe UI,Arial,sans-serif;font-size:15px;color:#2c3135;">
  <p style="margin:0 0 12px 0;">Nowy zapis na webinar <strong>„Podpis na szkle”</strong>.</p>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;max-width:560px;">${tr}</table>
</body>
</html>`;
}

/** Powiadomienie dla zespołu o nowym zapisie (osobna wiadomość od potwierdzenia dla uczestnika). */
export async function sendStaffSignupNotification(data: WebinarFormData): Promise<void> {
  const client = getGraphClient(["https://graph.microsoft.com/.default"]);
  const fullName = `${data.firstName} ${data.lastName}`;

  await client.api("/users/no-reply@euvic.com/sendMail").post({
    message: {
      subject: `Nowy zapis na webinar — ${fullName}`,
      body: {
        contentType: "HTML",
        content: buildStaffSignupNotificationHtml(data),
      },
      from: {
        emailAddress: { address: "no-reply@euvic.com", name: "Euvic Webinar" },
      },
      toRecipients: WEBINAR_SIGNUP_STAFF_RECIPIENTS.map((address) => ({
        emailAddress: { address },
      })),
      replyTo: [{ emailAddress: { address: data.email, name: fullName } }],
    },
  });
}

export async function sendRegistrationEmail(data: WebinarFormData): Promise<void> {
  const client = getGraphClient(["https://graph.microsoft.com/.default"]);

  const fullName = `${data.firstName} ${data.lastName}`;

  const origin = getPublicOrigin();
  const landingUrl = origin ? `${origin}/` : "";
  const bannerB64 = loadNewsletterBannerBase64();
  const bannerSrc = bannerB64
    ? `cid:${NEWSLETTER_BANNER_CID}`
    : origin
      ? `${origin}/assets/NewsletterPotwierdzenieZapisu.png`
      : "";

  const attachments = bannerB64
    ? [
        {
          "@odata.type": "#microsoft.graph.fileAttachment",
          name: "NewsletterPotwierdzenieZapisu.png",
          contentType: "image/png",
          contentBytes: bannerB64,
          contentId: NEWSLETTER_BANNER_CID,
          isInline: true,
        },
      ]
    : [];

  await client.api("/users/no-reply@euvic.com/sendMail").post({
    message: {
      subject: "Potwierdzenie zapisu – webinar „Podpis na szkle”",
      body: {
        contentType: "HTML",
        content: buildParticipantConfirmationHtml(data, bannerSrc, landingUrl),
      },
      attachments,
      from: {
        emailAddress: { address: "no-reply@euvic.com", name: "Euvic Webinar" },
      },
      toRecipients: [{ emailAddress: { address: data.email, name: fullName } }],
      replyTo: [{ emailAddress: { address: "info@euvic.com", name: "Euvic" } }],
    },
  });
}
