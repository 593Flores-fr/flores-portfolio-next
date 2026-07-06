"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ScrollFillText } from "@/components/ui/scroll-fill-text";
import { SITE_DEFAULTS } from "@/lib/site-content";
import type { SiteContentMap } from "@/lib/site-content";

const ease = [0.22, 1, 0.36, 1] as const;

export function EspaceTeaser({ content = SITE_DEFAULTS.espaceTeaser }: { content?: SiteContentMap["espaceTeaser"] }) {
  return (
    <section style={{ background: "#0e0c0a", padding: "120px 0 140px", position: "relative" }}>
      <div className="vto-sep" style={{ position: "absolute", top: 0, left: "4vw", right: "4vw", opacity: 0.4 }} />

      <div style={{ maxWidth: "1500px", margin: "0 auto", padding: "0 4vw" }}>

        {/* Layout : pitch gauche + 3 cards droite */}
        <div className="espace-teaser-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start" }}>

          {/* Pitch */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease }}
            className="espace-teaser-sticky"
            style={{ position: "sticky", top: "100px" }}
          >
            {/* Badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
              <div style={{ width: "28px", height: "1px", background: "#5C5CF5" }} />
              <span className="vto-label" style={{ fontSize: "8px", color: "rgba(92,92,245,0.75)", letterSpacing: "4px" }}>
                {content.badge}
              </span>
            </div>

            {/* Titre */}
            <h2 style={{
              fontFamily: "var(--font-six-caps), sans-serif",
              fontSize: "clamp(3.2rem, 5.8vw, 6rem)",
              fontWeight: 400, lineHeight: 1.0,
              letterSpacing: "5px", textTransform: "uppercase",
              color: "white", margin: "0 0 28px",
            }}>
              <ScrollFillText>
                {content.title.split("\n").map((line, i, arr) => (
                  <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                ))}
              </ScrollFillText>
            </h2>

            {/* Corps */}
            <p style={{
              fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 400,
              color: "rgba(255,255,255,0.48)", maxWidth: "400px", lineHeight: 2,
              margin: "0 0 12px",
            }}>
              {content.paragraph1}
            </p>
            <p style={{
              fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 400,
              color: "rgba(255,255,255,0.32)", maxWidth: "400px", lineHeight: 2,
              margin: "0 0 40px",
            }}>
              {content.paragraph2}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link href="/espace" className="vto-cta-link vto-cta-link--accent">
                {content.ctaLabel}
                <span className="vto-cta-line" />
              </Link>
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: "8px", letterSpacing: "2px", color: "rgba(255,255,255,0.22)", textTransform: "uppercase" }}>
                {content.discordNote}
              </span>
            </div>
          </motion.div>

          {/* 3 cards — panneau accentué */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease }}
            style={{
              border: "1px solid rgba(92,92,245,0.18)",
              borderTop: "2px solid rgba(92,92,245,0.55)",
              background: "rgba(92,92,245,0.028)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Halo d'ambiance */}
            <div style={{
              position: "absolute", top: 0, right: 0,
              width: "260px", height: "260px",
              background: "radial-gradient(ellipse at top right, rgba(92,92,245,0.07) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            {content.pilliers.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.55, ease }}
                style={{
                  padding: "36px 44px",
                  borderBottom: i < content.pilliers.length - 1 ? "1px solid rgba(92,92,245,0.10)" : "none",
                  position: "relative",
                }}
              >
                {/* Badge numéro */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                  <span style={{
                    fontFamily: "var(--font-poppins)", fontSize: "9px", fontWeight: 700,
                    letterSpacing: "3px", color: "rgba(92,92,245,0.9)",
                    background: "rgba(92,92,245,0.12)",
                    border: "1px solid rgba(92,92,245,0.22)",
                    padding: "3px 10px",
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 style={{
                  fontFamily: "var(--font-six-caps), sans-serif",
                  fontSize: "clamp(1.6rem, 2.4vw, 2.2rem)",
                  fontWeight: 400, letterSpacing: "4px", textTransform: "uppercase",
                  color: "white", margin: "0 0 16px", lineHeight: 1,
                }}>
                  {p.title}
                </h3>
                <p style={{
                  fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 400,
                  color: "rgba(255,255,255,0.38)", lineHeight: 1.85, margin: 0,
                  maxWidth: "420px",
                }}>
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

        </div>

      </div>
    </section>
  );
}
