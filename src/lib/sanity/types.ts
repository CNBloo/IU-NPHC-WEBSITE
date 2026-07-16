import type { Image, PortableTextBlock } from "sanity";

export type SanityImageWithAlt = Image & { alt: string };

export type OrgColor = {
  label: string;
  hex: string;
  source?: "official" | "approximate";
};

export type SocialLink = { platform: string; url: string };

export type Organization = {
  _id: string;
  name: string;
  chapterDesignation: string;
  slug: string;
  status: "active" | "inactive";
  statusNote?: string;
  colors: OrgColor[];
  logo?: SanityImageWithAlt;
  description?: PortableTextBlock[];
  nationalFounded?: {
    date?: string;
    location?: string;
    founders?: string[];
  };
  iuChartered?: {
    date?: string;
    note?: string;
  };
  socialLinks?: SocialLink[];
  interestFormUrl?: string;
  officialSiteUrl?: string;
};

export type Officer = {
  _id: string;
  name: string;
  position: string;
  organization?: { name: string; slug: string };
  photo?: SanityImageWithAlt;
  bio?: PortableTextBlock[];
  approvedForPublication: boolean;
  email?: string;
  phone?: string;
  order: number;
};

export type EventDoc = {
  _id: string;
  title: string;
  slug: string;
  organization?: { name: string; slug: string };
  eventType: "intake" | "social" | "service" | "educational" | "philanthropy";
  startDateTime: string;
  endDateTime?: string;
  location?: string;
  description?: PortableTextBlock[];
  flyer?: SanityImageWithAlt;
  pastGallery?: SanityImageWithAlt[];
  interestLink?: string;
};

export type Faq = {
  _id: string;
  question: string;
  answer: PortableTextBlock[];
  category: "general" | "intake" | "membership" | "campus-resources";
  order: number;
};

export type SiteSettings = {
  siteName: string;
  tagline?: string;
  missionStatement?: PortableTextBlock[];
  heroImage?: SanityImageWithAlt;
  socialLinks?: SocialLink[];
};
