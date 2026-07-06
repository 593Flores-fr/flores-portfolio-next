import { HeroHome } from "@/components/ui/hero-home";
import { AboutSection } from "@/components/ui/about-section";
import { PortfolioTeaser } from "@/components/ui/portfolio-teaser";
import { FeaturesSection } from "@/components/ui/features-section";
import { TarifsTeaser } from "@/components/ui/tarifs-teaser";
import { EspaceTeaser } from "@/components/ui/espace-teaser";
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
      select: { id: true, slug: true, title: true, tag: true, description: true, imageSrc: true, section: { select: { name: true, color: true } } },
    });
  } catch {
    return [];
  }
}

export default async function Home() {
  const [content, featuredProjects] = await Promise.all([
    getSiteContent(),
    getFeaturedProjects(),
  ]);

  return (
    <main>
      <HeroHome content={content.hero} />
      <PortfolioTeaser projects={featuredProjects} />
      <AboutSection content={content.about} />
      <FeaturesSection content={content.features} />
      <TarifsTeaser />
      <EspaceTeaser />
      <Footer content={content.footer} />
    </main>
  );
}
