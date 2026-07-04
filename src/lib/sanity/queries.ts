import { sanityClient } from "./client";
import type { EventDoc, Faq, Officer, Organization, SiteSettings } from "./types";

/**
 * Every query tags its fetch with the document type's name. The Phase 3
 * webhook route (/api/revalidate) calls revalidateTag with the type name
 * from Sanity's webhook payload, so editing an event in Studio only
 * invalidates event pages, not the whole site.
 */

const organizationProjection = /* groq */ `{
  _id,
  name,
  chapterDesignation,
  "slug": slug.current,
  status,
  statusNote,
  colors,
  logo,
  description,
  nationalFounded,
  iuChartered,
  socialLinks,
  interestFormUrl,
  officialSiteUrl,
}`;

export async function getOrganizations(): Promise<Organization[]> {
  return sanityClient().fetch(
    `*[_type == "organization"] | order(chapterDesignation asc) ${organizationProjection}`,
    {},
    { next: { tags: ["organization"] } },
  );
}

export async function getOrganizationBySlug(
  slug: string,
): Promise<Organization | null> {
  return sanityClient().fetch(
    `*[_type == "organization" && slug.current == $slug][0] ${organizationProjection}`,
    { slug },
    { next: { tags: ["organization"] } },
  );
}

const officerProjection = /* groq */ `{
  _id,
  name,
  position,
  "organization": organization->{name, "slug": slug.current},
  photo,
  bio,
  approvedForPublication,
  email,
  phone,
  order,
}`;

export async function getOfficers(): Promise<Officer[]> {
  return sanityClient().fetch(
    `*[_type == "officer"] | order(order asc) ${officerProjection}`,
    {},
    { next: { tags: ["officer"] } },
  );
}

const eventProjection = /* groq */ `{
  _id,
  title,
  "slug": slug.current,
  "organization": organization->{name, "slug": slug.current},
  eventType,
  startDateTime,
  endDateTime,
  location,
  description,
  flyer,
  pastGallery,
  interestLink,
}`;

export async function getUpcomingEvents(limit?: number): Promise<EventDoc[]> {
  const range = limit ? `[0...${limit}]` : "";
  return sanityClient().fetch(
    `*[_type == "event" && startDateTime >= now()] | order(startDateTime asc) ${range} ${eventProjection}`,
    {},
    { next: { tags: ["event"] } },
  );
}

export async function getPastEvents(): Promise<EventDoc[]> {
  return sanityClient().fetch(
    `*[_type == "event" && startDateTime < now()] | order(startDateTime desc) ${eventProjection}`,
    {},
    { next: { tags: ["event"] } },
  );
}

export async function getFaqs(): Promise<Faq[]> {
  return sanityClient().fetch(
    `*[_type == "faq"] | order(category asc, order asc)`,
    {},
    { next: { tags: ["faq"] } },
  );
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return sanityClient().fetch(
    `*[_type == "siteSettings"][0]`,
    {},
    { next: { tags: ["siteSettings"] } },
  );
}
