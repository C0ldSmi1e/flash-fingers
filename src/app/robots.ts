import type { MetadataRoute } from "next";
import { site } from "@/src/config/constants";

// Account-only pages and the JSON API carry nothing worth indexing.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/me", "/reset-password"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
