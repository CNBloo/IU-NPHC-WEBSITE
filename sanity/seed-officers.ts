/**
 * One-time seed script: pre-creates the 9 executive board documents with the
 * real names/positions Jose provided on 2026-07-14 (src/data/officers.ts).
 * Photos, bios, and contact info are deliberately left blank — those need
 * written consent from each officer and belong in Studio once available
 * (see the officer schema's `approvedForPublication` gate).
 *
 * Run once a Sanity project exists and you're logged in locally:
 *
 *   npx sanity exec sanity/seed-officers.ts --with-user-token
 *
 * Safe to re-run: each officer is upserted (createOrReplace) against a
 * deterministic _id, so running it twice just re-applies the same data
 * rather than creating duplicates.
 *
 * WARNING: once officers have edited their own entries in Studio (added a
 * photo, bio, or approved contact info), re-running this script OVERWRITES
 * those edits. Never re-run after editor handoff — see HANDOFF.md.
 */
import { createClient } from "@sanity/client";
import { OFFICERS } from "../src/data/officers";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

if (!projectId) {
  throw new Error(
    "NEXT_PUBLIC_SANITY_PROJECT_ID is not set — copy .env.example to .env.local and fill in your Sanity project ID first.",
  );
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.SANITY_API_VERSION ?? "2025-01-01",
  token: process.env.SANITY_SEED_TOKEN,
  useCdn: false,
});

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function seed() {
  for (const [index, officer] of OFFICERS.entries()) {
    const doc = {
      _id: `officer-${slugify(officer.name)}`,
      _type: "officer",
      name: officer.name,
      position: officer.position,
      approvedForPublication: false,
      order: index,
    };

    await client.createOrReplace(doc);
    console.log(`Seeded: ${officer.position} — ${officer.name}`);
  }

  console.log(`\nDone. Seeded ${OFFICERS.length} officers.`);
  console.log(
    "Photos, bios, and contact info were left blank — add those in Studio once officers give written consent.",
  );
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
