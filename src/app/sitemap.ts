import type { MetadataRoute } from "next";
import { site } from "@/src/config/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(site.policiesUpdated);
  return [
    { url: site.url, lastModified, changeFrequency: "daily", priority: 1 },
    {
      url: `${site.url}/play`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${site.url}/sign-in`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${site.url}/terms`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.1,
    },
    {
      url: `${site.url}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.1,
    },
  ];
}
