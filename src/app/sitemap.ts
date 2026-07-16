import type { MetadataRoute } from "next";
import { getOrganizations } from "@/lib/sanity/queries";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const organizations = await getOrganizations();

  const staticRoutes = [
    "",
    "/about",
    "/organizations",
    "/exec-board",
    "/events",
    "/resources",
    "/contact",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const orgRoutes = organizations.map((org) => ({
    url: `${SITE_URL}/organizations/${org.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...orgRoutes];
}
