import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { checkRateLimit } from "./rate-limit";

// The bucket map is module-level state shared across tests, so every test
// uses its own key and the clock is faked to control window expiry.
let keyCounter = 0;
const uniqueKey = () => `test-ip-${keyCounter++}`;

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("checkRateLimit", () => {
  it("allows a first request on a fresh key", () => {
    expect(checkRateLimit(uniqueKey()).allowed).toBe(true);
  });

  it("allows 5 requests in a window, then blocks with a retry hint", () => {
    const key = uniqueKey();
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit(key).allowed).toBe(true);
    }
    const sixth = checkRateLimit(key);
    expect(sixth.allowed).toBe(false);
    expect(sixth.retryAfterSeconds).toBeGreaterThan(0);
    expect(sixth.retryAfterSeconds).toBeLessThanOrEqual(60);
  });

  it("resets the bucket after the window elapses", () => {
    const key = uniqueKey();
    for (let i = 0; i < 5; i++) checkRateLimit(key);
    expect(checkRateLimit(key).allowed).toBe(false);

    vi.advanceTimersByTime(60_001);
    expect(checkRateLimit(key).allowed).toBe(true);
  });

  it("counts the retry-after down as time passes inside the window", () => {
    const key = uniqueKey();
    for (let i = 0; i < 5; i++) checkRateLimit(key);

    vi.advanceTimersByTime(45_000);
    const blocked = checkRateLimit(key);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeLessThanOrEqual(15);
  });

  it("tracks keys independently", () => {
    const throttled = uniqueKey();
    const other = uniqueKey();
    for (let i = 0; i < 6; i++) checkRateLimit(throttled);
    expect(checkRateLimit(throttled).allowed).toBe(false);
    expect(checkRateLimit(other).allowed).toBe(true);
  });
});
