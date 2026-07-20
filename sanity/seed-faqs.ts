/**
 * One-time seed script: loads the 4 FAQs originally drafted as placeholder
 * content (src/data/faqs.ts) into Sanity as real starting content. These are
 * general factual statements (not chapter-specific claims), reviewed and
 * kept from the Phase 1 placeholder page — Jose asked to keep them as-is.
 *
 * Run once a Sanity project exists and you're logged in locally:
 *
 *   npx sanity exec sanity/seed-faqs.ts --with-user-token
 *
 * Safe to re-run: each FAQ is upserted (createOrReplace) against a
 * deterministic _id.
 *
 * WARNING: once officers have edited these in Studio, re-running this
 * script OVERWRITES those edits. Never re-run after editor handoff.
 */
import { createClient } from "@sanity/client";
import { FAQS } from "../src/data/faqs";

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

const CATEGORIES: Record<string, string> = {
  "What is membership intake?": "intake",
  "Does the IU National Pan-Hellenic Council itself conduct intake?": "intake",
  "How do I find out about interest meetings?": "intake",
  "Is hazing tolerated?": "general",
};

function slugify(question: string) {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function seed() {
  for (const [index, faq] of FAQS.entries()) {
    const doc = {
      _id: `faq-${slugify(faq.question)}`,
      _type: "faq",
      question: faq.question,
      answer: [
        {
          _type: "block",
          _key: "answer",
          style: "normal",
          children: [{ _type: "span", _key: "span", text: faq.answer }],
        },
      ],
      category: CATEGORIES[faq.question] ?? "general",
      order: index,
    };

    await client.createOrReplace(doc);
    console.log(`Seeded: ${faq.question}`);
  }

  console.log(`\nDone. Seeded ${FAQS.length} FAQs.`);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
