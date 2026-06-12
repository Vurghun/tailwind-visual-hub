import type { MetadataRoute } from "next";

import { GUIDES } from "@/lib/guides";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/about", "/contact", "/privacy", "/examples", "/guides"].map(
    (path) => ({
      url: `${SITE.url}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })
  );

  const guidePages = GUIDES.map((g) => ({
    url: `${SITE.url}/guides/${g.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...guidePages];
}
