import { HeroHome } from "@/components/ui/hero-home";
import { AboutSection } from "@/components/ui/about-section";
import { FeaturesSection } from "@/components/ui/features-section";
import { PortfolioSection } from "@/components/ui/portfolio-section";
import { TarifsSection } from "@/components/ui/tarifs-section";
import { ContactSection } from "@/components/ui/contact-section";
import { Footer } from "@/components/ui/footer";
import prisma from "@/lib/prisma";
import { SITE_DEFAULTS } from "@/lib/site-content";
import type { SiteContentMap } from "@/lib/site-content";

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

export default async function Home() {
  const content = await getSiteContent();

  return (
    <main>
      <HeroHome content={content.hero} />
      <AboutSection content={content.about} />
      <FeaturesSection content={content.features} />
      <PortfolioSection />
      <TarifsSection content={content.tarifs} />
      <ContactSection />
      <Footer content={content.footer} />
    </main>
  );
}
