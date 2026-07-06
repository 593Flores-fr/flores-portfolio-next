"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ScrollFillText } from "@/components/ui/scroll-fill-text";
import { hexToRgb } from "@/lib/utils";

type Project = {
  id: string;
  slug: string;
  title: string;
  tag: string;
  description: string;
  imageSrc: string;
  section?: { name: string; color: string } | null;
};

const FALLBACK: Project[] = [
  { id: "1", slug: "yevta",      section: { name: "Visuel", color: "#a78bfa" }, title: "Yevta",        tag: "Direction artistique · 2024", description: "Identité visuelle complète pour un artiste musical émergent. Covers, charte graphique et assets de communication.", imageSrc: "/images/01hero.jpg" },
  { id: "2", slug: "vzx-build",  section: { name: "Web", color: "#5c5cf5" },    title: "VZX Build",    tag: "Branding & Dev Web · 2024",   description: "Branding moderne et site vitrine pour un assembleur PC. Identité forte, palette sombre et typographie percutante.",    imageSrc: "/images/jjj.jpg" },
  { id: "3", slug: "vto-studio", section: { name: "Visuel", color: "#a78bfa" }, title: "V.T.O Studio", tag: "Identité visuelle · 2024",    description: "Direction artistique pour un collectif créatif. Logo, supports de communication et présence digitale cohérente.",         imageSrc: "/images/vto.jpg" },
];

export function PortfolioTeaser({ projects }: { projects?: Project[] }) {
  const items = (projects && projects.length >= 3 ? projects.slice(0, 3) : FALLBACK);
  const [featured, ...rest] = items;

  return (
    <section style={{ background: "#0e0c0a", padding: "120px 0 140px", position: "relative", overflow: "hidden" }}>
      <div className="vto-sep" style={{ position: "absolute", top: 0, left: "4vw", right: "4vw", opacity: 0.4 }} />

      <div style={{ maxWidth: "1500px", margin: "0 auto", padding: "0 4vw" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "24px", marginBottom: "56px" }}
        >
          <div>
            <p className="vto-label" style={{ marginBottom: "16px" }}>Portfolio</p>
            <h2 style={{ fontFamily: "var(--font-six-caps), sans-serif", fontSize: "clamp(3rem, 5.5vw, 5.5rem)", fontWeight: 400, lineHeight: 1.0, letterSpacing: "5px", color: "white", textTransform: "uppercase", margin: 0 }}>
              <ScrollFillText>Quelques réalisations.</ScrollFillText>
            </h2>
          </div>
          <Link href="/portfolio" className="vto-cta-link">
            Voir tout le portfolio
            <span className="vto-cta-line" />
          </Link>
        </motion.div>

        {/* Grille : 1 grande + 2 petites */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "auto", gap: "1px", background: "rgba(255,255,255,0.05)" }}>

          {/* Carte featured — occupe 2 lignes à gauche */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ gridRow: "span 2" }}
          >
            <Link href={`/portfolio/${featured.slug}`} style={{ display: "block", height: "100%", textDecoration: "none" }} className="portfolio-card-link">
              <div style={{ position: "relative", height: "100%", minHeight: "480px", overflow: "hidden", background: "rgba(255,255,255,0.02)" }}>
                {featured.imageSrc && (
                  <Image
                    src={featured.imageSrc} alt={featured.title} fill
                    unoptimized={featured.imageSrc.startsWith("http")}
                    style={{ objectFit: "cover", transition: "transform 0.7s ease" }}
                    sizes="50vw"
                    className="portfolio-card-img"
                  />
                )}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(14,12,10,0.9) 0%, rgba(14,12,10,0.1) 60%)" }} />
                {featured.section?.name && (
                  <div style={{ position: "absolute", top: 20, left: 20 }}>
                    <span className="vto-label" style={{ fontSize: "7px", letterSpacing: "3px", color: "rgba(255,255,255,0.9)", border: `1px solid rgba(${hexToRgb(featured.section.color)},0.35)`, padding: "3px 10px", background: "rgba(0,0,0,0.35)" }}>
                      {featured.section.name}
                    </span>
                  </div>
                )}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "32px" }}>
                  <p className="vto-label" style={{ fontSize: "7px", letterSpacing: "3px", color: "rgba(255,255,255,0.30)", margin: "0 0 10px" }}>{featured.tag}</p>
                  <h3 style={{ fontFamily: "var(--font-six-caps), sans-serif", fontSize: "clamp(2.2rem, 3.5vw, 4rem)", fontWeight: 400, color: "white", letterSpacing: "4px", textTransform: "uppercase", lineHeight: 1.0, margin: "0 0 14px" }}>
                    {featured.title}
                  </h3>
                  <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", color: "rgba(255,255,255,0.45)", lineHeight: 1.8, margin: "0 0 20px" }}>
                    {featured.description}
                  </p>
                  <span className="vto-cta-link portfolio-card-cta" style={{ color: "rgba(255,255,255,0.45)", fontSize: "8px", letterSpacing: "3px" }}>
                    Voir le projet <span className="vto-cta-line" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* 2 cartes secondaires */}
          {rest.slice(0, 2).map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={`/portfolio/${p.slug}`} style={{ display: "block", textDecoration: "none" }} className="portfolio-card-link">
                <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", background: "rgba(255,255,255,0.02)" }}>
                  {p.imageSrc && (
                    <Image
                      src={p.imageSrc} alt={p.title} fill
                      unoptimized={p.imageSrc.startsWith("http")}
                      style={{ objectFit: "cover", transition: "transform 0.7s ease" }}
                      sizes="50vw"
                      className="portfolio-card-img"
                    />
                  )}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(14,12,10,0.8) 0%, rgba(14,12,10,0.05) 60%)" }} />
                  {p.section?.name && (
                    <div style={{ position: "absolute", top: 16, left: 16 }}>
                      <span className="vto-label" style={{ fontSize: "7px", letterSpacing: "3px", color: "rgba(255,255,255,0.9)", border: `1px solid rgba(${hexToRgb(p.section.color)},0.35)`, padding: "2px 8px", background: "rgba(0,0,0,0.35)" }}>
                        {p.section.name}
                      </span>
                    </div>
                  )}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 24px" }}>
                    <p className="vto-label" style={{ fontSize: "7px", letterSpacing: "3px", color: "rgba(255,255,255,0.28)", margin: "0 0 6px" }}>{p.tag}</p>
                    <h3 style={{ fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.88)", margin: 0, letterSpacing: "0.2px" }}>
                      {p.title}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}
