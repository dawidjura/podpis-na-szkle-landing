import { ClientSecretCredential } from "@azure/identity";
import { Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";

const TENANT_ID = process.env.MICROSOFT_TENANT_ID ?? "";
const CLIENT_ID = process.env.MICROSOFT_CLIENT_ID ?? "";
const CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET ?? "";

const getCredential = () =>
  new ClientSecretCredential(TENANT_ID, CLIENT_ID, CLIENT_SECRET);

const getAuthProvider = (scopes: string[]) =>
  new TokenCredentialAuthenticationProvider(getCredential(), { scopes });

const getGraphClient = (scopes: string[]) =>
  Client.initWithMiddleware({ authProvider: getAuthProvider(scopes) });

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

function buildParticipantConfirmationHtml(_data: WebinarFormData): string {
  const origin = getPublicOrigin();
  const landingUrl = origin ? `${origin}/` : "";
  const bannerUrl = origin ? `${origin}/assets/NewsletterPotwierdzenieZapisu.png` : "";

  const webinarPageLink = landingUrl
    ? `<a href="${landingUrl}" style="color:#006eb8;text-decoration:underline;">stronie webinaru</a>`
    : "stronie webinaru";

  const bannerRow =
    bannerUrl && landingUrl
      ? `<a href="${landingUrl}" style="text-decoration:none;display:block;line-height:0;">
          <img src="${bannerUrl}" width="600" alt="Potwierdzamy zapis na webinar — Podpis na szkle. EUVIC i GS1 Polska." border="0" style="display:block;width:100%;max-width:600px;height:auto;margin:0;padding:0;border:0;" />
        </a>`
      : bannerUrl
        ? `<img src="${bannerUrl}" width="600" alt="Potwierdzamy zapis na webinar — Podpis na szkle. EUVIC i GS1 Polska." border="0" style="display:block;width:100%;max-width:600px;height:auto;margin:0;padding:0;border:0;" />`
        : "";

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
              <p style="${p}"><strong>„Podpis na szkle – dowód dostawy nie do podważenia”</strong><br />
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
              <p style="${pLast}">Do zobaczenia online,<br />Zespół Euvic &amp; GS1</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendRegistrationEmail(data: WebinarFormData): Promise<void> {
  const client = getGraphClient(["https://graph.microsoft.com/.default"]);

  const fullName = `${data.firstName} ${data.lastName}`;

  await client.api("/users/no-reply@euvic.com/sendMail").post({
    message: {
      subject: "Potwierdzenie zapisu – webinar „Podpis na szkle”",
      body: {
        contentType: "HTML",
        content: buildParticipantConfirmationHtml(data),
      },
      from: {
        emailAddress: { address: "no-reply@euvic.com", name: "Euvic Webinar" },
      },
      toRecipients: [{ emailAddress: { address: data.email, name: fullName } }],
      replyTo: [{ emailAddress: { address: "info@euvic.com", name: "Euvic" } }],
    },
  });
}
