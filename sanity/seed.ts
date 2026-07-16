/**
 * One-time seed script: pre-creates the 8 active + 1 inactive NPHC chapter
 * documents in Sanity, reusing the research already done in
 * src/data/organizations.ts (colors, national founders, IU charter dates,
 * official site URLs) so nobody has to hand-type that into Studio.
 *
 * Run once a Sanity project exists and you're logged in locally:
 *
 *   npx sanity exec sanity/seed.ts --with-user-token
 *
 * `--with-user-token` uses your own logged-in Sanity CLI session to write —
 * no separate write-scoped token needs to be created or stored anywhere.
 * Alternatively, set SANITY_SEED_TOKEN in .env.local to an editor-scoped
 * token (used ONLY by this script, never by the app, never set on Vercel).
 * Safe to re-run: each org is upserted (createOrReplace) against a
 * deterministic _id, so running it twice just re-applies the same data
 * rather than creating duplicates.
 *
 * WARNING: once officers have edited organizations in Studio, re-running
 * this script OVERWRITES their edits with the static data below. Never
 * re-run after editor handoff — see HANDOFF.md.
 */
import { createClient } from "@sanity/client";
import { ORGANIZATIONS } from "../src/data/organizations";

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

async function seed() {
  for (const org of ORGANIZATIONS) {
    const doc = {
      _id: `organization-${org.slug}`,
      _type: "organization",
      name: org.orgName,
      chapterDesignation: org.chapterDesignation,
      slug: { _type: "slug", current: org.slug },
      status: org.status,
      statusNote: org.statusNote,
      colors: org.colors.map((c) => ({
        _type: "color",
        _key: c.label.toLowerCase().replace(/\s+/g, "-"),
        label: c.label,
        hex: c.hex,
        source: c.source,
      })),
      nationalFounded: {
        _type: "object",
        date: org.nationalFounded.date,
        location: org.nationalFounded.location,
        founders: org.nationalFounded.founders,
      },
      iuChartered: org.iuChartered
        ? {
            _type: "object",
            date: org.iuChartered.date,
            note: org.iuChartered.note,
          }
        : undefined,
      officialSiteUrl: org.officialSiteUrl,
    };

    await client.createOrReplace(doc);
    console.log(`Seeded: ${org.chapterDesignation} — ${org.orgName}`);
  }

  console.log(`\nDone. Seeded ${ORGANIZATIONS.length} organizations.`);
  console.log(
    "Logos, descriptions, social links, and interest form URLs were left blank — add those in Studio.",
  );
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
