import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { services } from "@/data/services";
import { articles } from "@/data/insights";

/**
 * Legal pages are deliberately excluded — they are unreviewed drafts and are
 * marked noindex until a legal advisor signs them off.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const corePages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/study-abroad`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/global-careers`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/business-setup`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/destinations`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/insights`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.9 },
    {
      url: `${SITE_URL}/legal/image-credits`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  const core: MetadataRoute.Sitemap = corePages.map((e) => ({
    ...e,
    lastModified: now,
  }));

  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${SITE_URL}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/insights/${a.slug}`,
    lastModified: new Date(a.updated),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...core, ...servicePages, ...articlePages];
}
