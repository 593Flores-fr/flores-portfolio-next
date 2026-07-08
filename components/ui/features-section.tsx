"use client";

import React from "react";
import { motion } from "framer-motion";
import { Palette, Globe, Music, Printer, Users, Sparkles } from "lucide-react";
import { SITE_DEFAULTS } from "@/lib/site-content";
import type { SiteContentMap } from "@/lib/site-content";

type Feature = { title: string; description: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> };
const ICONS = [Palette, Sparkles, Globe, Music, Printer, Users];

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <div className="feature-card" style={{ padding: "36px 32px 40px", height: "100%" }}>
      {/* Icône VTO primary color */}
      <div className="feature-icon-wrap" style={{ marginBottom: "32px" }}>
        <feature.icon style={{ width: "18px", height: "18px", strokeWidth: 1, color: "var(--vto-primary)", display: "block" }} aria-hidden />
      </div>

      {/* Tag VTO */}
      <p className="vto-label" style={{ fontSize: "var(--fs-2xs)", letterSpacing: "3px", color: "rgba(255,255,255,0.40)", marginBottom: "10px" }}>
        {feature.title}
      </p>

      {/* Titre Six Caps */}
      <h3 style={{ fontFamily: "var(--font-six-caps), sans-serif", fontSize: "clamp(2rem, 2.5vw, 2.6rem)", fontWeight: 400, color: "white", letterSpacing: "3px", textTransform: "uppercase", lineHeight: 1, marginBottom: "16px" }}>
        {feature.title}
      </h3>

      <p style={{ fontFamily: "var(--font-poppins)", fontSize: "var(--fs-base)", fontWeight: 400, color: "rgba(255,255,255,0.7)", lineHeight: 1.85, margin: 0 }}>
        {feature.description}
      </p>

      {/* Ligne décorative bas — VTO */}
      <div className="feature-foot-line" style={{ marginTop: "28px", height: "1px", background: "var(--vto-primary)", opacity: 0.2, transition: "opacity 0.4s ease, transform 0.4s ease", transformOrigin: "left" }} />
    </div>
  );
}

export function FeaturesSection({ content = SITE_DEFAULTS.features }: { content?: SiteContentMap["features"] }) {
  const features: Feature[] = content.items.map((item, i) => ({ ...item, icon: ICONS[i] ?? Palette }));

  return (
    <section style={{ background: "#0e0c0a", padding: "120px 0 140px", position: "relative" }}>
      <div className="vto-sep" style={{ position: "absolute", top: 0, left: "6vw", right: "6vw", opacity: 0.4 }} />

      <div style={{ maxWidth: "1500px", margin: "0 auto", padding: "0 4vw" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: "64px" }}
        >
          <p className="vto-label" style={{ marginBottom: "20px" }}>{content.eyebrow}</p>
          <h2 style={{ fontFamily: "var(--font-six-caps), sans-serif", fontSize: "clamp(3rem, 5.5vw, 5.5rem)", fontWeight: 400, lineHeight: 1.0, letterSpacing: "5px", color: "white", textTransform: "uppercase", marginBottom: "16px" }}>
            {content.title}
          </h2>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "var(--fs-base)", color: "rgba(255,255,255,0.52)", fontWeight: 400, maxWidth: "380px", lineHeight: 1.85 }}>
            {content.subtitle}
          </p>
        </motion.div>

        {/* Grille VTO — gap 1px comme séparateur */}
        <div className="features-grid" style={{ background: "rgba(255,255,255,0.07)" }}>
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="features-grid-item"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <FeatureCard feature={feature} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
