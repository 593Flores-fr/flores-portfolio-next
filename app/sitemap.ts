import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

const BASE = process.env.NEXT_PUBLIC_URL ?? "https://flores.fr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let projects: { slug: string; updatedAt: Date }[] = [];
  try {
    projects = await prisma.portfolioProject.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });
  } catch {}

  return [
    { url: BASE,                   lastModified: new Date(), changeFrequency: "weekly",  priority: 1   },
    { url: `${BASE}/portfolio`,    lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/about`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/tarif`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    ...projects.map(p => ({
      url: `${BASE}/portfolio/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
