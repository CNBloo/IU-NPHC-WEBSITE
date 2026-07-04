import { z } from "zod";

/**
 * Env vars are grouped by feature (Sanity, contact form) and validated
 * lazily via getSanityEnv()/getContactEnv() rather than all at once at
 * import time. This site is built incrementally — Sanity might be
 * configured before Resend, or vice versa — so importing, say, the
 * contact form's Server Action shouldn't crash page rendering just
 * because Sanity secrets aren't set up yet (or the reverse). Each group
 * only throws when a request actually exercises that feature.
 */

const sanityEnvSchema = z.object({
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_SANITY_DATASET: z.string().min(1).default("production"),
  SANITY_API_VERSION: z.string().min(1).default("2025-01-01"),
  SANITY_READ_TOKEN: z.string().min(1),
  SANITY_REVALIDATE_SECRET: z.string().min(1),
});

const contactEnvSchema = z.object({
  RESEND_API_KEY: z.string().min(1),
  CONTACT_RECIPIENT_EMAIL: z.string().email(),
  CONTACT_SENDER_EMAIL: z.string().email(),
});

function parseEnv<Schema extends z.ZodTypeAny>(
  schema: Schema,
  featureName: string,
): z.infer<Schema> {
  const parsed = schema.safeParse(process.env);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `Invalid ${featureName} environment configuration. Check .env.example and your .env.local:\n${issues}`,
    );
  }

  return parsed.data;
}

let sanityEnv: z.infer<typeof sanityEnvSchema> | undefined;
export function getSanityEnv() {
  sanityEnv ??= parseEnv(sanityEnvSchema, "Sanity");
  return sanityEnv;
}

let contactEnv: z.infer<typeof contactEnvSchema> | undefined;
export function getContactEnv() {
  contactEnv ??= parseEnv(contactEnvSchema, "contact form");
  return contactEnv;
}
