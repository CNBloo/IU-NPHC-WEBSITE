import type { MetadataRoute } from "next";
import { ORGANIZATIONS } from "@/data/organizations";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
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

  const orgRoutes = ORGANIZATIONS.map((org) => ({
    url: `${SITE_URL}/organizations/${org.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...orgRoutes];
}
