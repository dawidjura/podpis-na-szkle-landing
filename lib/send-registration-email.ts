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

function buildHtmlBody(data: WebinarFormData): string {
  const fullName = `${data.firstName} ${data.lastName}`;
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(90deg, #2b7bba 0%, #006eb1 46%, #256ba1 99%); padding: 24px 32px; border-radius: 8px 8px 0 0;">
        <p style="color: rgba(255,255,255,0.7); font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 6px 0;">Webinar GS1 &amp; Euvic · Podpis na szkle</p>
        <h2 style="color: #ffffff; margin: 0; font-size: 20px;">Nowa rejestracja na webinar</h2>
      </div>
      <div style="background: #f8f9fa; padding: 24px 32px; border: 1px solid #e9ecef; border-top: none; border-radius: 0 0 8px 8px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6c757d; font-size: 14px; width: 120px;">Imię i nazwisko</td>
            <td style="padding: 8px 0; color: #1a1a2e; font-size: 14px; font-weight: 500;">${fullName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6c757d; font-size: 14px;">E-mail</td>
            <td style="padding: 8px 0; color: #1a1a2e; font-size: 14px; font-weight: 500;">
              <a href="mailto:${data.email}" style="color: #0E6CAB;">${data.email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6c757d; font-size: 14px;">Telefon</td>
            <td style="padding: 8px 0; color: #1a1a2e; font-size: 14px; font-weight: 500;">${data.phone}</td>
          </tr>
        </table>
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #dee2e6;">
          <p style="color: #6c757d; font-size: 13px; margin: 0;">Podpis na szkle – dowód dostawy nie do podważenia | 20 czerwca 2026 | 13:00 | 60 minut</p>
        </div>
      </div>
    </div>
  `;
}

export async function sendRegistrationEmail(data: WebinarFormData): Promise<void> {
  const client = getGraphClient(["https://graph.microsoft.com/.default"]);

  const fullName = `${data.firstName} ${data.lastName}`;

  const payload = {
    message: {
      subject: `Rejestracja na webinar – ${fullName}`,
      body: {
        contentType: "HTML",
        content: buildHtmlBody(data),
      },
      from: {
        emailAddress: { address: "no-reply@euvic.com", name: "Euvic Webinar" },
      },
      toRecipients: [
        { emailAddress: { address: "info@euvic.com" } },
      ],
      replyTo: [
        { emailAddress: { address: data.email, name: fullName } },
      ],
    },
  };

  await client.api("/users/no-reply@euvic.com/sendMail").post(payload);
}
