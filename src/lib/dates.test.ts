import { describe, expect, it } from "vitest";
import { formatEventDateTime, splitUpcomingAndPast } from "./dates";

// Intl may emit a narrow no-break space before AM/PM depending on ICU version.
const normalize = (s: string) => s.replace(/ /g, " ");

describe("formatEventDateTime", () => {
  it("renders Bloomington wall-clock time during EST (winter)", () => {
    expect(normalize(formatEventDateTime("2026-01-19T09:00:00-05:00"))).toBe(
      "January 19, 2026 at 9:00 AM",
    );
  });

  it("renders Bloomington wall-clock time during EDT (summer)", () => {
    expect(normalize(formatEventDateTime("2026-08-25T18:00:00-04:00"))).toBe(
      "August 25, 2026 at 6:00 PM",
    );
  });

  it("converts instants supplied in other zones to Bloomington time", () => {
    // 23:00 UTC on July 19 is 7 PM in Indianapolis (EDT, UTC-4).
    expect(normalize(formatEventDateTime("2026-07-19T23:00:00Z"))).toBe(
      "July 19, 2026 at 7:00 PM",
    );
  });
});

describe("splitUpcomingAndPast", () => {
  const at = (iso: string) => new Date(iso).getTime();
  const events = [
    { slug: "a", startDateTime: "2026-08-25T18:00:00-04:00" },
    { slug: "b", startDateTime: "2026-01-19T09:00:00-05:00" },
    { slug: "c", startDateTime: "2026-09-12T19:00:00-04:00" },
    { slug: "d", startDateTime: "2025-11-08T19:00:00-05:00" },
  ];

  it("splits around the injected now, soonest-first upcoming and newest-first past", () => {
    const { upcoming, past } = splitUpcomingAndPast(
      events,
      at("2026-07-13T12:00:00-04:00"),
    );
    expect(upcoming.map((e) => e.slug)).toEqual(["a", "c"]);
    expect(past.map((e) => e.slug)).toEqual(["b", "d"]);
  });

  it("counts an event starting exactly now as upcoming", () => {
    const { upcoming, past } = splitUpcomingAndPast(
      events,
      at("2026-08-25T18:00:00-04:00"),
    );
    expect(upcoming.map((e) => e.slug)).toContain("a");
    expect(past.map((e) => e.slug)).not.toContain("a");
  });

  it("orders chronologically across mixed UTC offsets, not by string comparison", () => {
    // 18:30 UTC precedes 15:00 -04:00 (=19:00 UTC) as an instant, even though
    // "15:00" sorts before "18:30" as a string.
    const mixed = [
      { slug: "later", startDateTime: "2026-08-25T15:00:00-04:00" },
      { slug: "earlier", startDateTime: "2026-08-25T18:30:00Z" },
    ];
    const { upcoming } = splitUpcomingAndPast(mixed, at("2026-08-01T00:00:00Z"));
    expect(upcoming.map((e) => e.slug)).toEqual(["earlier", "later"]);
  });
});
