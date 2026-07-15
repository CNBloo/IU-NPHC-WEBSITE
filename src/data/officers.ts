/**
 * Static placeholder for the council's executive board. Real names and
 * positions, provided by Jose on 2026-07-14 — no photos, bios, or contact
 * info yet (those still require written consent and belong in Sanity, see
 * the officer schema's `approvedForPublication` gate, once Phase 2 CMS
 * wiring resumes).
 */

export type PlaceholderOfficer = {
  name: string;
  position: string;
};

export const OFFICERS: PlaceholderOfficer[] = [
  { name: "Calvin Woods", position: "President" },
  { name: "I'Asia Gaffney", position: "Vice President" },
  { name: "David Young", position: "Second Vice President" },
  { name: "Destinee Chesier", position: "Parliamentarian" },
  { name: "Madison Faulkner", position: "Secretary" },
  { name: "Destiny Abrams", position: "Treasurer" },
  { name: "Ayana Bledsoe", position: "Director of Academics" },
  { name: "Tylan Diggs", position: "Director of Marketing" },
  { name: "Kymri Euell", position: "NPHC Liaison" },
];
