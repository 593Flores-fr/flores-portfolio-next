"use client";

import { motion } from "framer-motion";
import { CardStack } from "./card-stack";
import Link from "next/link";

const projects = [
  {
    id: "yevta",
    title: "Yevta",
    tag: "Direction artistique · 2024",
    description: "Identité visuelle complète pour un artiste musical émergent — covers, charte graphique et assets de communication.",
    imageSrc: "/images/01hero.jpg",
    href: "/portfolio/yevta",
  },
  {
    id: "vzx-build",
    title: "VZX Build",
    tag: "Branding & Dev Web · 2024",
    description: "Branding moderne et site vitrine pour un assembleur PC. Identité forte, palette sombre et typographie percutante.",
    imageSrc: "/images/jjj.jpg",
    href: "/portfolio/vzx-build",
  },
  {
    id: "vto-studio",
    title: "V.T.O Studio",
    tag: "Identité visuelle · 2024",
    description: "Direction artistique pour un collectif créatif. Logo, supports de communication et présence digitale cohérente.",
    imageSrc: "/images/vto.jpg",
    href: "/portfolio/vto-studio",
  },
  {
    id: "monica-dlr",
    title: "Monica DLR",
    tag: "Charte graphique · 2024",
    description: "Identité visuelle pour une créatrice & couturière. Logo, univers de marque et visuels réseaux sociaux.",
    imageSrc: "/images/Mdlr.png",
    href: "/portfolio/monica-dlr",
  },
  {
    id: "213-huma",
    title: "213 HUMA",
    tag: "Projet associatif · 2024",
    description: "Direction artistique pour un projet associatif humanitaire. Identité visuelle engagée et supports imprimés.",
    imageSrc: "/images/projects/huma.png",
    href: "/portfolio/213-huma",
  },
  {
    id: "muzey",
    title: "Muzey",
    tag: "Charte graphique · 2024",
    description: "Identité visuelle complète pour un projet musical. Logotype, palette chromatique et assets digitaux.",
    imageSrc: "/images/pdv1.png",
    href: "/portfolio/muzey",
  },
  {
    id: "cover-art",
    title: "Cover Art",
    tag: "Covers musicales · 2021–2024",
    description: "Sélection de covers réalisées pour différents artistes. Illustrations sur mesure pour streaming et éditions physiques.",
    imageSrc: "/images/wuk.png",
    href: "/portfolio/cover-art",
  },
];

export function PortfolioSection() {
  return (
    <section style={{ background: "#060a0e", padding: "120px 0 140px", overflow: "hidden" }}>
      <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 6vw" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: "72px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}
        >
          <div>
            <p style={{
              fontFamily: "var(--font-poppins)", fontSize: "11px",
              textTransform: "uppercase", letterSpacing: "0.28em",
              color: "rgba(255,255,255,0.25)", fontWeight: 300, marginBottom: "16px",
            }}>
              Portfolio
            </p>
            <h2 style={{
              fontFamily: "var(--font-poppins)",
              fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
              fontWeight: 800, lineHeight: 1.05,
              letterSpacing: "-0.02em", color: "white",
            }}>
              Quelques réalisations.
            </h2>
          </div>

          <Link href="/portfolio" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            fontFamily: "var(--font-poppins)", fontSize: "12px",
            fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)", textDecoration: "none",
            borderBottom: "1px solid rgba(255,255,255,0.12)",
            paddingBottom: "3px",
          }}>
            Voir tout le portfolio
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 8L8 2M8 2H3M8 2V7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
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
            items={projects}
            cardWidth={500}
            cardHeight={340}
            overlap={0.45}
            spreadDeg={44}
            activeLiftPx={28}
            activeScale={1.04}
            inactiveScale={0.93}
            autoAdvance={false}
            showDots={true}
            loop={true}
          />
        </motion.div>

      </div>
    </section>
  );
}
