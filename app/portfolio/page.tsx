import type { Metadata } from "next";
import { PortfolioClient } from "@/components/ui/portfolio-client";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Réalisations de Flores : identité visuelle, direction artistique, sites web, covers musicales. Projets pour artistes, collectifs et structures indépendantes.",
};

export const revalidate = 60;

export default async function PortfolioPage() {
  let projects: { id: string; slug: string; title: string; tag: string; description: string; imageSrc: string; category: string }[] = [];

  try {
    projects = await prisma.portfolioProject.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      select: { id: true, slug: true, title: true, tag: true, description: true, imageSrc: true, category: true },
    });
  } catch (err) {
    console.error("[portfolio] DB fetch failed:", err);
  }

  return <PortfolioClient initialProjects={projects} />;
}
