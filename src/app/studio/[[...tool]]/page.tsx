import type { Metadata, Viewport } from "next";
import Studio from "./Studio";

export const dynamic = "force-static";

// Access control is Sanity's own login — only people invited to the project
// in manage.sanity.io can do anything here. noindex keeps the login screen
// out of search results.
export const metadata: Metadata = {
  title: "Content Studio | IU NPHC",
  robots: { index: false, follow: false },
  referrer: "same-origin",
};

// Mirrors next-sanity's recommended Studio viewport (its own export types
// viewportFit as plain string, which Next's Viewport type rejects).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function StudioPage() {
  return <Studio />;
}
