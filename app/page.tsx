import { HeroHome } from "@/components/ui/hero-home";
import { AboutSection } from "@/components/ui/about-section";
import { FeaturesSection } from "@/components/ui/features-section";
import { PortfolioSection } from "@/components/ui/portfolio-section";
import { TarifsSection } from "@/components/ui/tarifs-section";

export default function Home() {
  return (
    <main>
      <HeroHome />
      <AboutSection />
      <FeaturesSection />
      <PortfolioSection />
      <TarifsSection />
    </main>
  );
}
