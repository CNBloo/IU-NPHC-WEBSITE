/**
 * Static placeholder events, same reasoning as the other files in this
 * directory — real events belong in Sanity once Phase 2 CMS wiring
 * resumes. `orgSlug` ties back to src/data/organizations.ts slugs so the
 * organization filter on the Events page has something real to filter by.
 */

export type EventType =
  | "intake"
  | "social"
  | "service"
  | "educational"
  | "philanthropy";

export type PlaceholderEvent = {
  slug: string;
  title: string;
  orgSlug: string | null; // null = council-wide
  eventType: EventType;
  startDateTime: string; // ISO 8601
  location: string;
};

export const EVENTS: PlaceholderEvent[] = [
  {
    slug: "fall-kickoff-interest-meeting",
    title: "Fall Kickoff Interest Meeting",
    orgSlug: null,
    eventType: "educational",
    startDateTime: "2026-08-25T18:00:00-05:00",
    location: "Neal-Marshall Black Culture Center",
  },
  {
    slug: "step-show-showcase",
    title: "Step Show Showcase",
    orgSlug: "omega-psi-phi",
    eventType: "social",
    startDateTime: "2026-09-12T19:00:00-05:00",
    location: "IU Auditorium",
  },
  {
    slug: "community-service-day",
    title: "Community Service Day",
    orgSlug: null,
    eventType: "service",
    startDateTime: "2026-07-19T10:00:00-05:00",
    location: "Bloomington Community Farmers' Market",
  },
  {
    slug: "spring-step-show",
    title: "Spring Step Show",
    orgSlug: "alpha-phi-alpha",
    eventType: "social",
    startDateTime: "2026-04-10T19:00:00-05:00",
    location: "IU Auditorium",
  },
  {
    slug: "mlk-day-of-service",
    title: "MLK Day of Service",
    orgSlug: null,
    eventType: "service",
    startDateTime: "2026-01-19T09:00:00-05:00",
    location: "Neal-Marshall Black Culture Center",
  },
  {
    slug: "fall-probate-show",
    title: "Fall Probate Show",
    orgSlug: "delta-sigma-theta",
    eventType: "social",
    startDateTime: "2025-11-08T19:00:00-05:00",
    location: "Dunn Meadow",
  },
];
