import { createDeal } from "@/lib/pipedrive/deals";
import { addDealNote } from "@/lib/pipedrive/notes";
import { createPerson } from "@/lib/pipedrive/persons";
import { isPipedriveConfigured } from "@/lib/pipedrive/client";
import type { WebinarSignupRow } from "@/lib/webinar-signup-types";

/** Zapis do Pipedrive: osoba + szansa powiązana z `person_id` (pipeline/stage z env). */
export async function insertWebinarSignupPipedrive(
  row: WebinarSignupRow
): Promise<void> {
  if (!isPipedriveConfigured()) {
    throw new Error(
      "Missing environment variables: NEXT_PIPEDRIVE_DOMAIN or NEXT_PIPEDRIVE_API_TOKEN."
    );
  }

  const fullName =
    [row.name, row.surname].filter(Boolean).join(" ").trim() || row.email;
  const personId = await createPerson({
    name: fullName,
    email: row.email,
    phone: row.phone_number,
  });
  if (personId == null) {
    throw new Error("Pipedrive: nie udało się utworzyć osoby.");
  }

  const dealTitle = `Podpis na szkle – ${fullName}`;
  const dealId = await createDeal({
    title: dealTitle,
    personId,
  });
  if (dealId == null) {
    throw new Error("Pipedrive: nie udało się utworzyć szansy.");
  }

  const marketingLabel = row.consent_marketing ? "tak" : "nie";
  await addDealNote(
    dealId,
    `Zgoda marketingowa (formularz webinar): ${marketingLabel}.`,
  );
}
