#!/usr/bin/env npx tsx
/**
 * Pobiera zapisanych uczestników z lejka Pipedrive → scripts/recipients/registrants.json
 *
 *   npm run mail:pre:fetch
 */
import "./load-env";
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { isPipedriveConfigured } from "../lib/pipedrive/client";
import { listDealsInPipeline } from "../lib/pipedrive/deals";
import { getPerson } from "../lib/pipedrive/persons";
import { resolveNamedPipelineStage } from "../lib/pipedrive/pipeline-resolve";
import type { PreWebinarRecipient } from "./prewebinar-recipients";

const DEAL_TITLE_PREFIX = "Podpis na szkle";
const DEFAULT_PIPELINE_NAME = "Webinar";
const OUTPUT = resolve(__dirname, "recipients", "registrants.json");

async function main(): Promise<void> {
  if (!isPipedriveConfigured()) {
    throw new Error(
      "Brak NEXT_PIPEDRIVE_DOMAIN lub NEXT_PIPEDRIVE_API_TOKEN w .env",
    );
  }

  const placement = await resolveNamedPipelineStage();
  if (!placement) {
    throw new Error(
      'Nie znaleziono lejka/stage w Pipedrive (NEXT_PIPEDRIVE_PIPELINE_NAME / STAGE_NAME).',
    );
  }

  const pipelineName =
    process.env.NEXT_PIPEDRIVE_PIPELINE_NAME?.trim() || DEFAULT_PIPELINE_NAME;

  console.log(
    `[fetch] pipeline="${pipelineName}" id=${placement.pipelineId}, filtr tytułu: "${DEAL_TITLE_PREFIX}"`,
  );

  const deals = await listDealsInPipeline(placement.pipelineId, {
    titlePrefix: DEAL_TITLE_PREFIX,
  });
  console.log(`[fetch] deale po filtrze: ${deals.length}`);

  const personCache = new Map<number, PreWebinarRecipient | null>();
  const seenEmails = new Set<string>();
  const recipients: PreWebinarRecipient[] = [];
  let skippedNoPerson = 0;
  let skippedNoEmail = 0;

  for (const deal of deals) {
    if (deal.person_id == null) {
      skippedNoPerson++;
      continue;
    }

    let person = personCache.get(deal.person_id);
    if (person === undefined) {
      const info = await getPerson(deal.person_id);
      if (!info?.email) {
        personCache.set(deal.person_id, null);
        person = null;
      } else {
        person = { email: info.email, name: info.name };
        personCache.set(deal.person_id, person);
      }
    }

    if (!person) {
      skippedNoEmail++;
      continue;
    }

    const key = person.email.trim().toLowerCase();
    if (seenEmails.has(key)) continue;
    seenEmails.add(key);
    recipients.push(person);
  }

  const payload = {
    fetchedAt: new Date().toISOString(),
    source: {
      pipeline: pipelineName,
      pipelineId: placement.pipelineId,
    },
    count: recipients.length,
    stats: {
      dealsMatched: deals.length,
      skippedNoPerson,
      skippedNoEmail,
      uniquePersons: personCache.size,
    },
    recipients,
  };

  mkdirSync(resolve(__dirname, "recipients"), { recursive: true });
  writeFileSync(OUTPUT, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  console.log(`[fetch] zapisano ${recipients.length} odbiorców → ${OUTPUT}`);
  if (skippedNoPerson || skippedNoEmail) {
    console.log(
      `[fetch] pominięto: ${skippedNoPerson} bez person_id, ${skippedNoEmail} bez email`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
