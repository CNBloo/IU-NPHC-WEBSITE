import { describe, expect, it } from "vitest";
import { buildEventIcs } from "./ics";

const baseEvent = {
  slug: "fall-kickoff",
  title: "Fall Kickoff",
  startDateTime: "2026-08-25T18:00:00-04:00",
  location: "Neal-Marshall Black Culture Center",
};

describe("buildEventIcs", () => {
  it("produces a single VEVENT wrapped in a VCALENDAR with CRLF endings", () => {
    const ics = buildEventIcs(baseEvent);
    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(1);
    expect(ics).not.toMatch(/(?<!\r)\n/); // no bare LFs
  });

  it("converts the start instant to UTC (18:00 EDT = 22:00Z) with a 1h default end", () => {
    const ics = buildEventIcs(baseEvent);
    expect(ics).toContain("DTSTART:20260825T220000Z");
    expect(ics).toContain("DTEND:20260825T230000Z");
  });

  it("escapes commas, semicolons, backslashes, and newlines in text fields", () => {
    const ics = buildEventIcs({
      ...baseEvent,
      title: "Step; Show, Finale \\ Night",
      location: "Room 101, Building A",
      description: "Line one\nLine two",
    });
    expect(ics).toContain("SUMMARY:Step\\; Show\\, Finale \\\\ Night");
    expect(ics).toContain("LOCATION:Room 101\\, Building A");
    expect(ics).toContain("DESCRIPTION:Line one\\nLine two");
  });

  it("derives a stable UID from the slug and omits absent optional fields", () => {
    const ics = buildEventIcs({
      slug: "mlk-day",
      title: "MLK Day of Service",
      startDateTime: "2026-01-19T09:00:00-05:00",
    });
    expect(ics).toContain("UID:mlk-day@iunphc");
    expect(ics).not.toContain("LOCATION:");
    expect(ics).not.toContain("DESCRIPTION:");
  });

  it("is deterministic for the same event", () => {
    expect(buildEventIcs(baseEvent)).toBe(buildEventIcs(baseEvent));
  });
});
