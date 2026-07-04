/**
 * Static placeholder FAQ content, same reasoning as src/data/organizations.ts —
 * real FAQ content should live in Sanity once Phase 2 CMS wiring resumes.
 */

export type Faq = {
  question: string;
  answer: string;
};

export const FAQS: Faq[] = [
  {
    question: "What is membership intake?",
    answer:
      "Membership intake is the formal process each NPHC organization uses to select and induct new members. Every organization runs its own intake process independently, on its own timeline, following its national organization's requirements.",
  },
  {
    question: "Does the IU National Pan-Hellenic Council itself conduct intake?",
    answer:
      "No. The council coordinates and represents the chapters as a group, but each member organization runs its own intake process. If you're interested in joining a specific organization, reach out to that chapter directly using the contact info on its Member Organizations page.",
  },
  {
    question: "How do I find out about interest meetings?",
    answer:
      "Each organization announces its own interest meetings, typically at the start of a semester. Check the Events page and each organization's official national and chapter social media for the most current announcements.",
  },
  {
    question: "Is hazing tolerated?",
    answer:
      "No. Every NPHC member organization and Indiana University maintain zero-tolerance anti-hazing policies. If you experience or witness hazing, report it to the Office of Sorority and Fraternity Life or IU's Dean of Students Office.",
  },
];
