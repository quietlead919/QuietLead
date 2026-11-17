import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const UPDATED = new Date("2026-11-17");

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, changeFrequency: "weekly" | "yearly", priority: number) => ({
    url: `${SITE_URL}${path}`,
    lastModified: UPDATED,
    changeFrequency,
    priority,
  });
  return [
    page("/", "weekly", 1),
    page("/privacy", "yearly", 0.3),
    page("/terms", "yearly", 0.3),
    page("/refunds", "yearly", 0.3),
    page("/cookies", "yearly", 0.3),
    page("/imprint", "yearly", 0.3),
  ];
}
