import { ClientSecretCredential } from "@azure/identity";
import { Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";

const getCredential = () =>
  new ClientSecretCredential(
    process.env.MICROSOFT_TENANT_ID ?? "",
    process.env.MICROSOFT_CLIENT_ID ?? "",
    process.env.MICROSOFT_CLIENT_SECRET ?? "",
  );

const getAuthProvider = (scopes: string[]) =>
  new TokenCredentialAuthenticationProvider(getCredential(), { scopes });

export function getGraphClient(scopes: string[] = ["https://graph.microsoft.com/.default"]) {
  return Client.initWithMiddleware({ authProvider: getAuthProvider(scopes) });
}

export const MAIL_FROM_ADDRESS = "no-reply@euvic.com";
export const MAIL_FROM_NAME = "Euvic Webinar";

export interface SendHtmlMailParams {
  to: { address: string; name?: string };
  subject: string;
  html: string;
  replyTo?: { address: string; name?: string };
  attachments?: Array<Record<string, unknown>>;
}

export async function sendHtmlMail(params: SendHtmlMailParams): Promise<void> {
  const client = getGraphClient();

  await client.api(`/users/${MAIL_FROM_ADDRESS}/sendMail`).post({
    message: {
      subject: params.subject,
      body: { contentType: "HTML", content: params.html },
      from: {
        emailAddress: { address: MAIL_FROM_ADDRESS, name: MAIL_FROM_NAME },
      },
      toRecipients: [
        {
          emailAddress: {
            address: params.to.address,
            name: params.to.name ?? params.to.address,
          },
        },
      ],
      replyTo: params.replyTo
        ? [{ emailAddress: { address: params.replyTo.address, name: params.replyTo.name } }]
        : [{ emailAddress: { address: "info@euvic.com", name: "Euvic" } }],
      attachments: params.attachments ?? [],
    },
  });
}
