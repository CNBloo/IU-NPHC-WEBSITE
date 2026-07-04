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
  { position: "Council President" },
  { position: "Vice President" },
  { position: "Secretary" },
  { position: "Treasurer" },
  { position: "Programming Chair" },
  { position: "Public Relations Chair" },
];
