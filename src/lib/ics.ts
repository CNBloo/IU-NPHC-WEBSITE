/**
 * Minimal RFC 5545 (.ics) builder for "Add to calendar" downloads. Kept as a
 * dependency-free pure function: the format needed here is a single VEVENT,
 * and a pure function is trivially unit-testable (escaping bugs corrupt
 * calendar imports silently).
 */

type IcsEvent = {
  slug: string;
  title: string;
  startDateTime: string; // ISO 8601 with offset
  location?: string;
  description?: string;
};

const DEFAULT_DURATION_MS = 60 * 60 * 1000;

/** Escape per RFC 5545 §3.3.11: backslash, semicolon, comma, and newlines. */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** Format an instant as an iCalendar UTC date-time (YYYYMMDDTHHMMSSZ). */
function toIcsUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

export function buildEventIcs(event: IcsEvent): string {
  const start = new Date(event.startDateTime);
  const end = new Date(start.getTime() + DEFAULT_DURATION_MS);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//IU National Pan-Hellenic Council//Website//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${event.slug}@iunphc`,
    // Deterministic stamp (derived from the event itself, not "now") keeps
    // the download byte-identical across requests and cacheable.
    `DTSTAMP:${toIcsUtc(start)}`,
    `DTSTART:${toIcsUtc(start)}`,
    `DTEND:${toIcsUtc(end)}`,
    `SUMMARY:${escapeText(event.title)}`,
    ...(event.location ? [`LOCATION:${escapeText(event.location)}`] : []),
    ...(event.description
      ? [`DESCRIPTION:${escapeText(event.description)}`]
      : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  // RFC 5545 requires CRLF line endings.
  return lines.join("\r\n") + "\r\n";
}
