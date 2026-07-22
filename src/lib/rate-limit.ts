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
// Every unique IP that hits this (including one-off bots/scanners) leaves a
// bucket behind until it happens to reset. Without a bound, a public form
// endpoint can grow this map indefinitely for the life of the instance.
// Cheap fix: once it gets big, sweep out anything already expired.
const SWEEP_THRESHOLD = 500;

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function sweepExpired(now: number): void {
  for (const [key, bucket] of buckets) {
    if (now >= bucket.resetAt) {
      buckets.delete(key);
    }
  }
}

/** Test-only escape hatch to observe map size without exporting the map itself. */
export function _bucketCount(): number {
  return buckets.size;
}

export function checkRateLimit(key: string): {
  allowed: boolean;
  retryAfterSeconds?: number;
} {
  const now = Date.now();

  if (buckets.size >= SWEEP_THRESHOLD) {
    sweepExpired(now);
  }

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
