/**
 * Canonical site origin for absolute URLs (metadata, sitemap, robots).
 * Falls back to localhost so development and CI builds work without env;
 * production sets NEXT_PUBLIC_SITE_URL to the deployed domain.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
