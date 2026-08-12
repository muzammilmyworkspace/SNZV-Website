import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        /*
         * Draft legal text, the API and the authenticated portal stay out.
         *
         * NOTE: /login, /register, /forgot-password and /reset-password are
         * deliberately NOT listed. They carry `noindex` metadata, and a crawler
         * blocked by robots.txt can never fetch the page to read that tag —
         * disallowing them would make the noindex unreadable.
         */
        disallow: [
          "/api/",
          "/portal/",
          "/legal/privacy-policy",
          "/legal/terms",
          "/legal/cookie-policy",
          "/legal/disclaimer",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
