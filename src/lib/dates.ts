/**
 * All event times on this site are Bloomington local time. Formatting must
 * always pin `timeZone`: the server (wherever the deployment region is) and
 * the visitor's browser can each sit in a different zone, and an unpinned
 * toLocaleString would render a different wall-clock time in each — including
 * a server/client mismatch on the same page load.
 */
const EVENT_TIME_ZONE = "America/Indiana/Indianapolis";

export function formatEventDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: EVENT_TIME_ZONE,
  });
}

/**
 * Past vs. upcoming is always derived from the event's start instant — never
 * stored — so an event needs no editing to move into the past section.
 * `now` is injectable for tests; sorting compares epoch instants rather than
 * ISO strings so mixed UTC offsets still order chronologically.
 */
export function splitUpcomingAndPast<T extends { startDateTime: string }>(
  events: readonly T[],
  now: number = Date.now(),
): { upcoming: T[]; past: T[] } {
  const startOf = (e: T) => new Date(e.startDateTime).getTime();
  const upcoming = events
    .filter((e) => startOf(e) >= now)
    .sort((a, b) => startOf(a) - startOf(b));
  const past = events
    .filter((e) => startOf(e) < now)
    .sort((a, b) => startOf(b) - startOf(a));
  return { upcoming, past };
}
