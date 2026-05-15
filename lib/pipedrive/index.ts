import { createOrganization } from './organizations';
import { createPerson } from './persons';
import { createDeal } from './deals';
import { isPipedriveConfigured } from './client';

export { isPipedriveConfigured } from './client';

export interface PipedriveAuditPayload {
  type: 'audit';
  firstName: string;
  lastName: string;
  domain: string;
  email: string;
  phone?: string;
  privacyAccepted?: boolean;
  auditConsent?: boolean;
}

function getContactPersonName(payload: PipedriveAuditPayload): string {
  const first = payload.firstName?.trim() ?? '';
  const last = payload.lastName?.trim() ?? '';
  if (first || last) return [first, last].filter(Boolean).join(' ');
  const local = payload.email.split('@')[0];
  if (local && local.length > 0) return local;
  return payload.domain;
}

export async function createLeadFromAuditForm(payload: PipedriveAuditPayload): Promise<void> {
  if (!isPipedriveConfigured()) {
    console.warn('[Pipedrive] createLeadFromAuditForm skipped – missing domain or token');
    return;
  }

  try {
    const orgId = await createOrganization({ name: payload.domain });
    if (orgId == null) {
      console.error('[Pipedrive] createLeadFromAuditForm abort – organization not created');
      return;
    }

    const personName = getContactPersonName(payload);
    const personId = await createPerson({
      name: personName,
      email: payload.email,
      phone: payload.phone ?? undefined,
      orgId: orgId ?? undefined,
    });
    if (personId == null) {
      console.error('[Pipedrive] createLeadFromAuditForm abort – person not created');
      return;
    }

    const dealTitle = `Audit: ${payload.domain}`;
    const dealId = await createDeal({
      title: dealTitle,
      personId,
      orgId: orgId ?? undefined,
    });
    if (dealId == null) {
      console.error('[Pipedrive] createLeadFromAuditForm abort – deal not created');
      return;
    }
  } catch (err) {
    console.error('[Pipedrive] createLeadFromAuditForm error', err);
  }
}
