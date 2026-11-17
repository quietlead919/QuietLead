import type { MetadataRoute } from "next";
import { INDEXABLE, SITE_URL } from "@/lib/site";

// Production: crawl everything public. Preview/branch deployments: block all crawlers.
export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/checkout/", "/unsubscribe", "/delete-my-data"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
