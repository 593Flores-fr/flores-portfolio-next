"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ScrollFillText } from "@/components/ui/scroll-fill-text";
import { SITE_DEFAULTS } from "@/lib/site-content";
import type { SiteContentMap } from "@/lib/site-content";

const VisualIdentite = () => (
  <svg aria-hidden width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="90" cy="90" r="80" stroke="white" strokeWidth="0.6" opacity="0.18"/>
    <circle cx="90" cy="90" r="56" stroke="white" strokeWidth="0.5" opacity="0.12"/>
    <circle cx="90" cy="90" r="28" stroke="white" strokeWidth="0.5" opacity="0.14"/>
    <line x1="10" y1="90" x2="170" y2="90" stroke="white" strokeWidth="0.4" opacity="0.10"/>
    <line x1="90" y1="10" x2="90" y2="170" stroke="white" strokeWidth="0.4" opacity="0.10"/>
    <line x1="33" y1="33" x2="147" y2="147" stroke="white" strokeWidth="0.3" opacity="0.07"/>
    <line x1="147" y1="33" x2="33" y2="147" stroke="white" strokeWidth="0.3" opacity="0.07"/>
    <rect x="74" y="74" width="32" height="32" stroke="white" strokeWidth="0.6" fill="none" opacity="0.22"/>
    <circle cx="90" cy="90" r="3" fill="white" opacity="0.22"/>
    <circle cx="90" cy="10" r="2" fill="white" opacity="0.12"/>
    <circle cx="90" cy="170" r="2" fill="white" opacity="0.12"/>
    <circle cx="10" cy="90" r="2" fill="white" opacity="0.12"/>
    <circle cx="170" cy="90" r="2" fill="white" opacity="0.12"/>
  </svg>
);

const VisualWeb = () => (
  <svg aria-hidden width="200" height="155" viewBox="0 0 200 155" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="196" height="151" rx="5" stroke="white" strokeWidth="0.6" opacity="0.18"/>
    <line x1="2" y1="26" x2="198" y2="26" stroke="white" strokeWidth="0.5" opacity="0.14"/>
    <circle cx="14" cy="14" r="4" stroke="white" strokeWidth="0.5" opacity="0.16"/>
    <circle cx="26" cy="14" r="4" stroke="white" strokeWidth="0.5" opacity="0.16"/>
    <circle cx="38" cy="14" r="4" stroke="white" strokeWidth="0.5" opacity="0.16"/>
    <rect x="54" y="9" width="92" height="10" rx="2" stroke="white" strokeWidth="0.4" fill="none" opacity="0.10"/>
    <line x1="18" y1="45" x2="75" y2="45" stroke="white" strokeWidth="0.6" opacity="0.18"/>
    <line x1="26" y1="59" x2="140" y2="59" stroke="white" strokeWidth="0.5" opacity="0.12"/>
    <line x1="26" y1="72" x2="115" y2="72" stroke="white" strokeWidth="0.5" opacity="0.12"/>
    <line x1="34" y1="85" x2="100" y2="85" stroke="white" strokeWidth="0.4" opacity="0.09"/>
    <line x1="34" y1="98" x2="125" y2="98" stroke="white" strokeWidth="0.4" opacity="0.09"/>
    <line x1="26" y1="111" x2="88" y2="111" stroke="white" strokeWidth="0.5" opacity="0.12"/>
    <line x1="18" y1="124" x2="65" y2="124" stroke="white" strokeWidth="0.6" opacity="0.18"/>
    <rect x="148" y="42" width="36" height="28" rx="2" stroke="white" strokeWidth="0.4" fill="none" opacity="0.09"/>
    <rect x="148" y="80" width="36" height="54" rx="2" stroke="white" strokeWidth="0.4" fill="none" opacity="0.09"/>
  </svg>
);

const VisualArtiste = () => (
  <svg aria-hidden width="210" height="160" viewBox="0 0 210 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Égaliseur audio — 17 barres de hauteurs variées, ancrées en bas */}
    {[38, 72, 52, 98, 130, 80, 150, 108, 136, 70, 115, 90, 56, 100, 44, 80, 60].map((h, i) => (
      <rect key={i} x={4 + i * 12} y={160 - h} width={8} height={h} fill="white" opacity={0.07 + (i % 3) * 0.025} rx={1}/>
    ))}
    {/* Ligne de base */}
    <line x1="2" y1="160" x2="208" y2="160" stroke="white" strokeWidth="0.4" opacity="0.12"/>
    {/* Reflet haut (doubles barres fantômes) */}
    {[38, 72, 52, 98, 130, 80, 150, 108, 136, 70, 115, 90, 56, 100, 44, 80, 60].map((h, i) => (
      <rect key={"ghost-" + i} x={4 + i * 12} y={0} width={8} height={Math.round(h * 0.18)} fill="white" opacity={0.03} rx={1}/>
    ))}
  </svg>
);

const VISUALS = [<VisualIdentite key="identite" />, <VisualWeb key="web" />, <VisualArtiste key="artiste" />];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

export function TarifsTeaser({ content = SITE_DEFAULTS.tarifsTeaser }: { content?: SiteContentMap["tarifsTeaser"] }) {
  return (
    <section style={{ background: "#0e0c0a", padding: "120px 0 140px", position: "relative" }}>
      <div className="vto-sep" style={{ position: "absolute", top: 0, left: "4vw", right: "4vw", opacity: 0.4 }} />

      <div style={{ maxWidth: "1500px", margin: "0 auto", padding: "0 4vw" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "24px", marginBottom: "64px" }}
        >
          <div>
            <p className="vto-label" style={{ marginBottom: "16px" }}>{content.eyebrow}</p>
            <h2 style={{ fontFamily: "var(--font-six-caps), sans-serif", fontSize: "clamp(3rem, 5.5vw, 5.5rem)", fontWeight: 400, lineHeight: 1.0, letterSpacing: "5px", color: "white", textTransform: "uppercase", margin: "0 0 20px" }}>
              <ScrollFillText>{content.title}</ScrollFillText>
            </h2>
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 400, color: "rgba(255,255,255,0.48)", maxWidth: "360px", lineHeight: 1.9, margin: 0 }}>
              {content.subtitle}
            </p>
          </div>
          <Link href="/tarif" className="vto-cta-link vto-cta-link--primary">
            {content.ctaLabel}
            <span className="vto-cta-line" />
          </Link>
        </motion.div>

        {/* 3 catégories */}
        <div className="tarifs-teaser-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "rgba(255,255,255,0.05)" }}>
          {content.categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              custom={i} variants={fadeUp} initial="hidden" whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              className="tarifs-teaser-col"
              style={{ padding: "44px 40px", background: "#0e0c0a", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}
            >
              {/* Visuel décoratif en fond */}
              <div style={{ position: "absolute", bottom: "-8px", right: "16px", pointerEvents: "none", userSelect: "none", zIndex: 0 }}>
                {VISUALS[i % VISUALS.length]}
              </div>

              <p className="vto-label" style={{ fontSize: "8px", letterSpacing: "4px", color: "rgba(255,255,255,0.28)", marginBottom: "20px" }}>{String(i + 1).padStart(2, "0")}</p>
              <h3 style={{ fontFamily: "var(--font-six-caps), sans-serif", fontSize: "clamp(2rem, 2.8vw, 3rem)", fontWeight: 400, letterSpacing: "4px", textTransform: "uppercase", color: "white", lineHeight: 1.0, margin: "0 0 20px" }}>
                {cat.title}
              </h3>
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 400, color: "rgba(255,255,255,0.50)", lineHeight: 1.9, margin: "0 0 32px", flex: 1 }}>
                {cat.desc}
              </p>

              {/* Ancre tarifaire */}
              <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "24px", position: "relative", zIndex: 1 }}>
                <span style={{ fontFamily: "var(--font-poppins)", fontSize: "8px", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.28)" }}>À partir de</span>
                <span style={{ fontFamily: "var(--font-six-caps), sans-serif", fontSize: "clamp(2.2rem, 3vw, 3.2rem)", letterSpacing: "4px", color: "rgba(255,255,255,0.82)", lineHeight: 1 }}>{cat.from}</span>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", position: "relative", zIndex: 1, maxWidth: "55%" }}>
                {cat.tags.map(tag => (
                  <span key={tag} style={{
                    fontFamily: "var(--font-poppins)", fontSize: "8px", fontWeight: 500,
                    letterSpacing: "2px", textTransform: "uppercase",
                    color: "rgba(255,255,255,0.32)", border: "1px solid rgba(255,255,255,0.08)",
                    padding: "3px 8px",
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
