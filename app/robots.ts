import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        /*
         * Draft legal text and the API stay out.
         *
         * The portal is no longer on this domain, so its paths are not listed
         * here any more — proxy.ts now 308s them to the portal origin, which
         * publishes its own robots.txt disallowing everything. Blocking them
         * here as well would stop a crawler from ever seeing that redirect,
         * leaving the old URLs indexed against this host forever.
         */
        disallow: [
          "/api/",
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
