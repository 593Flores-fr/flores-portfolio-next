import { HeroHome } from "@/components/ui/hero-home";
import { AboutSection } from "@/components/ui/about-section";
import { PortfolioTeaser } from "@/components/ui/portfolio-teaser";
import { TarifsTeaser } from "@/components/ui/tarifs-teaser";
import { EspaceTeaser } from "@/components/ui/espace-teaser";
import { ReviewsSection } from "@/components/ui/reviews-section";
import { Footer } from "@/components/ui/footer";
import prisma from "@/lib/prisma";
import { SITE_DEFAULTS } from "@/lib/site-content";
import type { SiteContentMap } from "@/lib/site-content";

export const revalidate = 60;

async function getSiteContent(): Promise<SiteContentMap> {
  try {
    const sections = await prisma.siteContent.findMany();
    const result = { ...SITE_DEFAULTS } as SiteContentMap;
    for (const s of sections) {
      const key = s.section as keyof SiteContentMap;
      if (key in result) {
        (result[key] as object) = { ...((result[key] as object) ?? {}), ...(s.data as object) };
      }
    }
    return result;
  } catch {
    return SITE_DEFAULTS;
  }
}

async function getFeaturedProjects() {
  try {
    return await prisma.portfolioProject.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      take: 3,
      select: { id: true, slug: true, title: true, tag: true, description: true, imageSrc: true, category: true },
    });
  } catch {
    return [];
  }
}

async function getReviews() {
  try {
    return await prisma.review.findMany({
      where: { status: "approved", content: { not: null } },
      select: {
        id: true, content: true, rating: true,
        user: { select: { name: true, image: true } },
        project: { select: { title: true } },
      },
      orderBy: { submittedAt: "desc" },
    });
  } catch {
    return [];
  }
}

export default async function Home() {
  const [content, reviews, featuredProjects] = await Promise.all([
    getSiteContent(),
    getReviews(),
    getFeaturedProjects(),
  ]);

  return (
    <main>
      <HeroHome content={content.hero} />
      <PortfolioTeaser projects={featuredProjects} />
      <AboutSection content={content.about} />
      <TarifsTeaser />
      <EspaceTeaser />
      <ReviewsSection initialReviews={reviews} />
      <Footer content={content.footer} />
    </main>
  );
}
