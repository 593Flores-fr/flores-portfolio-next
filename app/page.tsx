import { HeroHome } from "@/components/ui/hero-home";
import { AboutSection } from "@/components/ui/about-section";
import { FeaturesSection } from "@/components/ui/features-section";
import { PortfolioSection } from "@/components/ui/portfolio-section";
import type { CardStackItem } from "@/components/ui/card-stack";
import { ReviewsSection } from "@/components/ui/reviews-section";
import { TarifsSection } from "@/components/ui/tarifs-section";
import { ContactSection } from "@/components/ui/contact-section";
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

async function getFeaturedProjects(): Promise<CardStackItem[]> {
  try {
    const rows = await prisma.portfolioProject.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      take: 7,
      select: { id: true, slug: true, title: true, tag: true, description: true, imageSrc: true },
    });
    return rows.map(p => ({
      id: p.id,
      title: p.title,
      tag: p.tag,
      description: p.description,
      imageSrc: p.imageSrc,
      href: `/portfolio/${p.slug}`,
    }));
  } catch {
    return [];
  }
}

async function getReviews() {
  try {
    return await prisma.review.findMany({
      where: { status: "approved", content: { not: null } },
      select: {
        id: true,
        content: true,
        rating: true,
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
  const [content, reviews, featuredProjects] = await Promise.all([getSiteContent(), getReviews(), getFeaturedProjects()]);

  return (
    <main>
      <HeroHome content={content.hero} />
      <AboutSection content={content.about} />
      <FeaturesSection content={content.features} />
      <PortfolioSection projects={featuredProjects} />
      <ReviewsSection initialReviews={reviews} />
      <TarifsSection content={content.tarifs} />
      <ContactSection discordUrl={content.footer.discordUrl} />
      <Footer content={content.footer} />
    </main>
  );
}
