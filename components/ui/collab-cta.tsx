"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const p = "M50,47 Q40,38 37,24 Q34,12 42,9 Q46,6 50,10 Q54,6 58,9 Q66,12 63,24 Q60,38 50,47Z";
function FloresStar({ size = 320 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: "block" }}>
      <path d={p} fill="white"/>
      <path d={p} fill="white" transform="rotate(72,50,50)"/>
      <path d={p} fill="white" transform="rotate(144,50,50)"/>
      <path d={p} fill="white" transform="rotate(216,50,50)"/>
      <path d={p} fill="white" transform="rotate(288,50,50)"/>
    </svg>
  );
}

const ease = [0.22, 1, 0.36, 1] as const;

const perks = [
  { label: "Réponse rapide", sub: "depuis Mon espace" },
  { label: "Devis gratuit", sub: "sans engagement" },
  { label: "Fichiers sources", sub: "livrés avec le projet" },
];

export function CollabCTA({
  title = "Un projet en tête ?",
  ctaLabel = "Démarrer un projet",
  ctaHref = "/espace",
}: {
  title?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease }}
      style={{ position: "relative", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Dot-grid background */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        pointerEvents: "none",
      }} />

      {/* Halo indigo centre-haut */}
      <div style={{
        position: "absolute", top: "-60px", left: "50%", transform: "translateX(-50%)",
        width: "600px", height: "260px",
        background: "radial-gradient(ellipse, rgba(92,92,245,0.10) 0%, transparent 68%)",
        pointerEvents: "none",
      }} />

      {/* Fleur watermark en fond */}
      <div aria-hidden style={{
        position: "absolute", bottom: "-60px", right: "-60px",
        opacity: 0.045,
        userSelect: "none",
        pointerEvents: "none",
      }}>
        <FloresStar size={320} />
      </div>

      {/* Barre indigo haut */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, rgba(92,92,245,0.55) 30%, rgba(92,92,245,0.55) 70%, transparent)" }} />

      {/* Contenu */}
      <div className="collab-cta-content" style={{ position: "relative", zIndex: 1, padding: "64px 60px 52px" }}>

        {/* Label + titre */}
        <div className="collab-cta-header" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "32px", flexWrap: "wrap", marginBottom: "52px" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(92,92,245,0.8)", boxShadow: "0 0 10px rgba(92,92,245,0.6)", flexShrink: 0, display: "inline-block" }} />
              <p className="vto-label" style={{ fontSize: "var(--fs-2xs)", color: "rgba(92,92,245,0.7)", letterSpacing: "4px", margin: 0 }}>Collaboration</p>
            </div>
            <h2 style={{
              fontFamily: "var(--font-six-caps), sans-serif",
              fontSize: "clamp(3rem, 5.5vw, 5.5rem)",
              fontWeight: 400,
              letterSpacing: "5px",
              textTransform: "uppercase",
              color: "white",
              margin: 0,
              lineHeight: 0.95,
            }}>
              {title}
            </h2>
          </div>

          <Link href={ctaHref} className="vto-cta-link vto-cta-link--primary" style={{ flexShrink: 0 }}>
            {ctaLabel}
            <span className="vto-cta-line" />
          </Link>
        </div>

        {/* Perks strip */}
        <div style={{ display: "flex", gap: "1px", background: "rgba(255,255,255,0.05)", flexWrap: "wrap" }}>
          {perks.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.5, ease }}
              style={{ flex: 1, minWidth: "140px", padding: "16px 24px", background: "rgba(255,255,255,0.012)" }}
            >
              <p style={{ fontFamily: "var(--font-six-caps), sans-serif", fontSize: "clamp(1.2rem, 2vw, 1.6rem)", letterSpacing: "3px", color: "rgba(255,255,255,0.75)", margin: "0 0 4px", textTransform: "uppercase" }}>
                {p.label}
              </p>
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "var(--fs-xs)", color: "rgba(255,255,255,0.42)", letterSpacing: "1px", margin: 0 }}>
                {p.sub}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </motion.div>
  );
}
