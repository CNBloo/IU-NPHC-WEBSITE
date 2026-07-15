/**
 * Static placeholder for the council's executive board. Deliberately has no
 * fabricated names, photos, or emails — real officer info (and the
 * publication-approval gate on contact info) belongs in Sanity once Phase 2
 * CMS wiring resumes. This just proves out the page layout and the "only
 * show contact info if approved for publication" pattern from the schema.
 */

export type PlaceholderOfficer = {
  position: string;
};

export const OFFICERS: PlaceholderOfficer[] = [
  { position: "President" },
  { position: "Vice President" },
  { position: "Second Vice President" },
  { position: "Parliamentarian" },
  { position: "Secretary" },
  { position: "Treasurer" },
  { position: "Director of Academics" },
  { position: "Director of Marketing" },
  { position: "NPHC Liaison" },
];
