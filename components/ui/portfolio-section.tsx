"use client";

import { motion } from "framer-motion";
import { CardStack, type CardStackItem } from "./card-stack";
import Link from "next/link";
import { useIsMobile } from "@/lib/hooks";

const FALLBACK: CardStackItem[] = [
  { id: "yevta",      title: "Yevta",        tag: "Direction artistique · 2024", description: "Identité visuelle complète pour un artiste musical émergent. Covers, charte graphique et assets de communication.", imageSrc: "/images/01hero.jpg",         href: "/portfolio/yevta" },
  { id: "vzx-build",  title: "VZX Build",    tag: "Branding & Dev Web · 2024",   description: "Branding moderne et site vitrine pour un assembleur PC. Identité forte, palette sombre et typographie percutante.",    imageSrc: "/images/jjj.jpg",             href: "/portfolio/vzx-build" },
  { id: "vto-studio", title: "V.T.O Studio", tag: "Identité visuelle · 2024",    description: "Direction artistique pour un collectif créatif. Logo, supports de communication et présence digitale cohérente.",         imageSrc: "/images/vto.jpg",             href: "/portfolio/vto-studio" },
  { id: "monica-dlr", title: "Monica DLR",   tag: "Charte graphique · 2024",     description: "Identité visuelle pour une créatrice & couturière. Logo, univers de marque et visuels réseaux sociaux.",                imageSrc: "/images/Mdlr.png",            href: "/portfolio/monica-dlr" },
  { id: "213-huma",   title: "213 HUMA",     tag: "Projet associatif · 2024",    description: "Direction artistique pour un projet associatif humanitaire. Identité visuelle engagée et supports imprimés.",             imageSrc: "/images/projects/huma.png",   href: "/portfolio/213-huma" },
  { id: "muzey",      title: "Muzey",        tag: "Charte graphique · 2024",     description: "Identité visuelle complète pour un projet musical. Logotype, palette chromatique et assets digitaux.",                   imageSrc: "/images/pdv1.png",            href: "/portfolio/muzey" },
  { id: "cover-art",  title: "Cover Art",    tag: "Covers musicales · 2021–2024",description: "Sélection de covers réalisées pour différents artistes. Illustrations sur mesure pour streaming et éditions physiques.", imageSrc: "/images/wuk.png",             href: "/portfolio/cover-art" },
];

export function PortfolioSection({ projects }: { projects?: CardStackItem[] }) {
  const items = projects && projects.length > 0 ? projects : FALLBACK;
  const isMobile = useIsMobile();

  return (
    <section id="portfolio" style={{ background: "#0e0c0a", padding: "120px 0 140px", overflow: "hidden", position: "relative" }}>
      <div className="vto-sep" style={{ position: "absolute", top: 0, left: "6vw", right: "6vw", opacity: 0.4 }} />

      <div style={{ maxWidth: "1500px", margin: "0 auto", padding: "0 4vw" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: "72px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "24px" }}
        >
          <div>
            <p className="vto-label" style={{ marginBottom: "16px" }}>Portfolio</p>
            <h2 style={{ fontFamily: "var(--font-six-caps), sans-serif", fontSize: "clamp(3rem, 5.5vw, 5.5rem)", fontWeight: 400, lineHeight: 1.0, letterSpacing: "5px", color: "white", textTransform: "uppercase", margin: 0 }}>
              Quelques réalisations.
            </h2>
          </div>

          <Link href="/portfolio" className="vto-cta-link">
            Voir tout le portfolio
            <span className="vto-cta-line" />
          </Link>
        </motion.div>

        {/* Card Stack */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <CardStack
            items={items}
            cardWidth={isMobile ? Math.min(320, typeof window !== "undefined" ? window.innerWidth - 48 : 320) : 500}
            cardHeight={isMobile ? 240 : 340}
            overlap={isMobile ? 0.35 : 0.45}
            spreadDeg={isMobile ? 28 : 44}
            activeLiftPx={28}
            activeScale={1.04}
            inactiveScale={isMobile ? 0.88 : 0.93}
            autoAdvance={false}
            showDots={true}
            loop={true}
          />
        </motion.div>

      </div>
    </section>
  );
}
