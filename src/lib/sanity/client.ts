import { createClient, type SanityClient } from "next-sanity";
import { getSanityEnv } from "@/lib/env";

/**
 * Read-only client for public-facing pages. `useCdn: true` serves published
 * content through Sanity's CDN (cheaper, faster) since these reads never
 * need draft content or up-to-the-second freshness — Next's ISR
 * (revalidateTag from the webhook route) handles freshness at our layer.
 *
 * Built lazily so importing this module doesn't validate Sanity env vars
 * until a query actually runs — matches getSanityEnv()'s own laziness.
 */
let client: SanityClient | undefined;
export function sanityClient(): SanityClient {
  if (!client) {
    const env = getSanityEnv();
    client = createClient({
      projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: env.NEXT_PUBLIC_SANITY_DATASET,
      apiVersion: env.SANITY_API_VERSION,
      token: env.SANITY_READ_TOKEN,
      useCdn: true,
      perspective: "published",
    });
  }
  return client;
}
