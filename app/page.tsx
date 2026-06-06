import { HeroHome } from "@/components/ui/hero-home";
import { AboutSection } from "@/components/ui/about-section";
import { FeaturesSection } from "@/components/ui/features-section";
import { PortfolioSection } from "@/components/ui/portfolio-section";
import { TarifsSection } from "@/components/ui/tarifs-section";
import { ContactSection } from "@/components/ui/contact-section";
import { Footer } from "@/components/ui/footer";

export default function Home() {
  return (
    <main>
      <HeroHome />
      <AboutSection />
      <FeaturesSection />
      <PortfolioSection />
      <TarifsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
