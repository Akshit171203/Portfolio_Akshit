import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  return [
    { url: base, priority: 1 },
    { url: `${base}/work`, priority: 0.9 },
    { url: `${base}/about`, priority: 0.8 },
    { url: `${base}/contact`, priority: 0.7 },
    ...projects.map((p) => ({ url: `${base}/work/${p.slug}`, priority: 0.6 })),
  ];
}
