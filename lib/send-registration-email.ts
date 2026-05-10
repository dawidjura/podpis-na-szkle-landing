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

function buildParticipantConfirmationHtml(data: WebinarFormData): string {
  const fullName = `${data.firstName} ${data.lastName}`;
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(90deg, #2b7bba 0%, #006eb1 46%, #256ba1 99%); padding: 24px 32px; border-radius: 8px 8px 0 0;">
        <p style="color: rgba(255,255,255,0.7); font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 6px 0;">Euvic &amp; GS1 Polska</p>
        <h2 style="color: #ffffff; margin: 0; font-size: 20px;">Potwierdzenie zapisu na webinar</h2>
      </div>
      <div style="background: #f8f9fa; padding: 24px 32px; border: 1px solid #e9ecef; border-top: none; border-radius: 0 0 8px 8px;">
        <p style="color: #1a1a2e; font-size: 16px; line-height: 1.5; margin: 0 0 16px 0;">Dzień dobry ${data.firstName},</p>
        <p style="color: #1a1a2e; font-size: 15px; line-height: 1.55; margin: 0 0 16px 0;">
          dziękujemy za rejestrację. Zapisaliśmy Cię na webinar <strong>Podpis na szkle – dowód dostawy nie do podważenia</strong>.
        </p>
        <div style="background: #fff; border: 1px solid #dee2e6; border-radius: 8px; padding: 16px 20px; margin: 16px 0;">
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #6c757d;">Termin</p>
          <p style="margin: 0; font-size: 15px; color: #1a1a2e; font-weight: 600;">20 czerwca 2026 · godz. 13:00 · 60 minut</p>
        </div>
        <p style="color: #6c757d; font-size: 14px; line-height: 1.5; margin: 16px 0 0 0;">
          Link do transmisji lub dalsze informacje organizacyjne prześlemy na ten adres e-mail przed wydarzeniem.
          Jeśli masz pytania, odpowiedz na tę wiadomość lub napisz na
          <a href="mailto:info@euvic.com" style="color: #0E6CAB;">info@euvic.com</a>.
        </p>
        <p style="color: #adb5bd; font-size: 12px; margin: 24px 0 0 0; border-top: 1px solid #dee2e6; padding-top: 16px;">
          Zapis: ${fullName} · ${data.email}
        </p>
      </div>
    </div>
  `;
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
