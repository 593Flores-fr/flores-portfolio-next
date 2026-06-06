import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PortfolioDetail from "@/components/ui/portfolio-detail";

export default async function PortfolioSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await prisma.portfolioProject.findUnique({
    where: { slug, published: true },
  });
  if (!project) notFound();
  return <PortfolioDetail project={project} />;
}
