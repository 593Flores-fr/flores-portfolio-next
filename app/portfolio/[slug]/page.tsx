import { cache } from "react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PortfolioDetail from "@/components/ui/portfolio-detail";

export const revalidate = 300;

const getProject = cache(async (slug: string) => {
  return prisma.portfolioProject.findUnique({
    where: { slug, published: true },
    include: { section: true },
  });
});

export async function generateStaticParams() {
  const projects = await prisma.portfolioProject.findMany({ where: { published: true }, select: { slug: true } });
  return projects.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};

  const title = project.title;
  const description = project.description || `${project.title} — ${project.tag || "projet"} réalisé par Flores.`;
  const images = project.imageSrc ? [{ url: project.imageSrc, width: 1200, height: 630, alt: project.title }] : undefined;

  return {
    title,
    description,
    alternates: { canonical: `/portfolio/${project.slug}` },
    openGraph: { title, description, type: "article", images },
    twitter: { card: "summary_large_image", title, description, images: images?.map(i => i.url) },
  };
}

export default async function PortfolioSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();
  return <PortfolioDetail project={project} />;
}
