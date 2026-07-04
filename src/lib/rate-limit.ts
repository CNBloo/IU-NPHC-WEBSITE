/**
 * In-memory, IP-keyed token bucket. Deliberately simple for an MVP-scale
 * council site rather than pulling in Vercel KV/Upstash as a dependency.
 *
 * Tradeoff: state lives in the serverless function instance's memory, so it
 * resets on redeploy and isn't shared across concurrent instances under
 * real traffic. Fine at this site's scale; if that ever changes, swap this
 * module for an Upstash Redis-backed limiter without touching call sites.
 */
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function checkRateLimit(key: string): {
  allowed: boolean;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (bucket.count >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return { allowed: true };
}
