"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ScrollFillText } from "@/components/ui/scroll-fill-text";
import { SITE_DEFAULTS } from "@/lib/site-content";
import type { SiteContentMap } from "@/lib/site-content";

export function AboutSection({ content = SITE_DEFAULTS.about }: { content?: SiteContentMap["about"] }) {
  const points = content.points;

  return (
    <section id="about" style={{ background: "#0e0c0a", overflow: "hidden", position: "relative" }}>
      {/* Séparateur VTO haut — full width */}
      <div className="vto-sep" style={{ position: "absolute", top: 0, left: 0, right: 0, opacity: 0.5 }} />

      <div className="about-editorial-grid">

        {/* ── Gauche — Image full bleed ── */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: "relative", overflow: "hidden" }}
        >
          {/* Blur overlay VTO en haut */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "160px", zIndex: 2,
            backgroundImage: `url(${content.imageSrc || "/images/about.jpg"})`,
            backgroundSize: "cover", backgroundPosition: "center top",
            filter: "blur(14px) brightness(0.08) saturate(0.4)",
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)",
            transform: "scale(1.12)",
            pointerEvents: "none",
          }} />

          <Image
            src={content.imageSrc || "/images/about.jpg"}
            alt="Flores — Allan"
            fill
            unoptimized={!!content.imageSrc?.startsWith("http")}
            style={{ objectFit: "cover", objectPosition: "center top" }}
            sizes="50vw"
          />

          {/* Overlay gradient bas */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(14,12,10,0.85) 0%, transparent 45%)", zIndex: 3 }} />
          {/* Overlay gradient droite — fondu vers le fond */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 70%, rgba(14,12,10,0.6) 100%)", zIndex: 3 }} />

          {/* Badge disponibilité bas */}
          <div style={{ position: "absolute", bottom: "32px", left: "32px", zIndex: 4, display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px rgba(74,222,128,0.9)", flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: "9px", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.50)" }}>
              Disponible
            </span>
          </div>
        </motion.div>

        {/* ── Droite — Texte ── */}
        <div className="about-editorial-text">

          <motion.p
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="vto-label"
            style={{ marginBottom: "24px" }}
          >
            À propos
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.06, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontFamily: "var(--font-six-caps), sans-serif", fontSize: "clamp(3rem, 4.5vw, 5.5rem)", fontWeight: 400, lineHeight: 0.92, letterSpacing: "4px", textTransform: "uppercase", color: "white", marginBottom: "52px" }}
          >
            <ScrollFillText>{content.heading}</ScrollFillText>
          </motion.h2>

          {/* Points — style VTO avec tiret */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {points.map((p, i) => (
              <motion.div
                key={p.num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                style={{ padding: "24px 0", borderTop: "1px solid rgba(255,255,255,0.05)", display: "grid", gridTemplateColumns: "32px 1fr", gap: "20px" }}
              >
                <span className="vto-label" style={{ fontSize: "9px", letterSpacing: "2px", color: "rgba(255,255,255,0.38)", paddingTop: "2px" }}>
                  {p.num}
                </span>
                <div>
                  <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.75)", marginBottom: "8px", letterSpacing: "0.5px" }}>
                    {p.title}
                  </p>
                  <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 400, color: "rgba(255,255,255,0.58)", lineHeight: 1.9 }}>
                    {p.text}
                  </p>
                </div>
              </motion.div>
            ))}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} />
          </div>

          {/* CTA VTO */}
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{ marginTop: "36px" }}
          >
            <Link href="/about" className="vto-cta-link vto-cta-link--accent">
              En savoir plus
              <span className="vto-cta-line" />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
