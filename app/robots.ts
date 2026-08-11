import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Draft legal text and the enquiry endpoint stay out of the index.
        disallow: ["/api/", "/legal/privacy-policy", "/legal/terms", "/legal/cookie-policy", "/legal/disclaimer"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
