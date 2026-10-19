import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";
import { pages, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.map((p) => ({
      url: `${site.url}${p.path === "/" ? "" : p.path}`,
      changeFrequency: "monthly" as const,
      priority: p.priority,
    })),
    ...projects.map((p) => ({ url: `${site.url}/work/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
