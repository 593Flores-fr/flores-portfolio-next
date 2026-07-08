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
              <span className="vto-label" style={{ fontSize: "var(--fs-2xs)", color: "rgba(92,92,245,0.75)", letterSpacing: "4px" }}>
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
              fontFamily: "var(--font-poppins)", fontSize: "var(--fs-base)", fontWeight: 400,
              color: "rgba(255,255,255,0.48)", maxWidth: "400px", lineHeight: 2,
              margin: "0 0 12px",
            }}>
              {content.paragraph1}
            </p>
            <p style={{
              fontFamily: "var(--font-poppins)", fontSize: "var(--fs-base)", fontWeight: 400,
              color: "rgba(255,255,255,0.48)", maxWidth: "400px", lineHeight: 2,
              margin: "0 0 40px",
            }}>
              {content.paragraph2}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Link href="/espace" className="vto-btn">
                {content.ctaLabel}
                <span className="vto-btn-arrow" aria-hidden>→</span>
              </Link>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-poppins)", fontSize: "var(--fs-sm)", color: "rgba(255,255,255,0.45)" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
                </svg>
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
                    fontFamily: "var(--font-poppins)", fontSize: "var(--fs-xs)", fontWeight: 700,
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
                  fontFamily: "var(--font-poppins)", fontSize: "var(--fs-sm)", fontWeight: 400,
                  color: "rgba(255,255,255,0.48)", lineHeight: 1.85, margin: 0,
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
