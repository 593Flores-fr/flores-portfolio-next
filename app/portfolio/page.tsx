import type { Metadata } from "next";
import { Suspense } from "react";
import { PortfolioClient } from "@/components/ui/portfolio-client";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Réalisations de Flores : identité visuelle, direction artistique, sites web, covers musicales. Projets pour artistes, collectifs et structures indépendantes.",
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: "Portfolio — Flores",
    description: "Identité visuelle, DA, sites web, covers musicales — pour artistes, collectifs et structures indépendantes.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio — Flores",
    description: "Identité visuelle, DA, sites web, covers musicales — pour artistes, collectifs et structures indépendantes.",
    images: ["/opengraph-image"],
  },
};

export const revalidate = 60;

export default async function PortfolioPage() {
  type ProjectRow = { id: string; slug: string; title: string; tag: string; description: string; imageSrc: string; section: { id: string; name: string; color: string } | null };
  let projects: ProjectRow[] = [];
  let sections: { id: string; name: string; color: string }[] = [];

  try {
    [projects, sections] = await Promise.all([
      prisma.portfolioProject.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
        select: { id: true, slug: true, title: true, tag: true, description: true, imageSrc: true, section: { select: { id: true, name: true, color: true } } },
      }),
      prisma.portfolioSection.findMany({ orderBy: { order: "asc" } }),
    ]);
  } catch (err) {
    console.error("[portfolio] DB fetch failed:", err);
  }

  return (
    <Suspense>
      <PortfolioClient initialProjects={projects} sections={sections} />
    </Suspense>
  );
}
