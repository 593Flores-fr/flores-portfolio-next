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
      <div className="vto-sep" style={{ position: "absolute", top: 0, left: 0, right: 0, opacity: 0.5, zIndex: 5 }} />

      {/* ── Bandeau image full width ── */}
      <motion.div
        className="about-banner"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={content.imageSrc || "/images/about.jpg"}
          alt="Flores — Allan"
          fill
          style={{ objectFit: "cover", objectPosition: "center 30%", filter: "grayscale(1)" }}
          sizes="100vw"
        />

        {/* Fondu bas — transition vers le fond de section */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0e0c0a 0%, rgba(14,12,10,0.55) 16%, transparent 48%)", zIndex: 2 }} />
        {/* Assombrissement haut léger */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(14,12,10,0.6) 0%, transparent 32%)", zIndex: 2 }} />

        {/* Badge disponibilité */}
        <div style={{ position: "absolute", bottom: "28px", left: "max(48px, 6vw)", zIndex: 3, display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px rgba(74,222,128,0.9)", flexShrink: 0 }} />
          <span style={{ fontFamily: "var(--font-poppins)", fontSize: "9px", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>
            Disponible
          </span>
        </div>
      </motion.div>

      {/* ── Contenu pleine largeur ── */}
      <div className="about-banner-content">

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
          style={{ fontFamily: "var(--font-six-caps), sans-serif", fontSize: "clamp(3rem, 5.5vw, 6.5rem)", fontWeight: 400, lineHeight: 0.92, letterSpacing: "4px", textTransform: "uppercase", color: "white", marginBottom: "56px", maxWidth: "1100px" }}
        >
          <ScrollFillText>{content.heading}</ScrollFillText>
        </motion.h2>

        {/* Points — 3 colonnes */}
        <div className="about-points-grid">
          {points.map((p, i) => (
            <motion.div
              key={p.num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="vto-label" style={{ fontSize: "9px", letterSpacing: "2px", color: "rgba(255,255,255,0.38)", display: "block", marginBottom: "14px" }}>
                {p.num}
              </span>
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: "10px", letterSpacing: "0.5px" }}>
                {p.title}
              </p>
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 400, color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
                {p.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA VTO */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ marginTop: "48px" }}
        >
          <Link href="/about" className="vto-cta-link vto-cta-link--accent">
            En savoir plus
            <span className="vto-cta-line" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
