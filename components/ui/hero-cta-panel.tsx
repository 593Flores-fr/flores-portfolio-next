"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MessageSquare, Kanban, Star, ArrowRight } from "lucide-react";

const perks = [
  { icon: MessageSquare, text: "Demande de devis sous 24h" },
  { icon: Kanban,        text: "Suivi de projet en direct" },
  { icon: Star,          text: "Espace dédié & messagerie" },
];

export function HeroCtaPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: "100%",
        borderRadius: "20px",
        background: "rgba(8,12,24,0.72)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
        padding: "28px 28px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Corner accent */}
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: "180px", height: "180px",
        background: "radial-gradient(circle at top right, rgba(60,100,255,0.1), transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Label */}
      <p style={{
        fontFamily: "var(--font-poppins)",
        fontSize: "10px", fontWeight: 500,
        textTransform: "uppercase", letterSpacing: "0.25em",
        color: "rgba(255,255,255,0.22)", margin: "0 0 14px",
      }}>
        Espace client
      </p>

      {/* Headline */}
      <h3 style={{
        fontFamily: "var(--font-poppins)",
        fontSize: "22px", fontWeight: 800,
        color: "white", letterSpacing: "-0.02em",
        lineHeight: 1.15, margin: "0 0 8px",
      }}>
        Votre projet,<br />
        <span style={{ color: "rgba(100,140,255,0.85)" }}>un espace dédié.</span>
      </h3>

      <p style={{
        fontFamily: "var(--font-poppins)",
        fontSize: "12px", fontWeight: 300,
        color: "rgba(255,255,255,0.3)", lineHeight: 1.75,
        margin: "0 0 22px",
      }}>
        Créez un compte pour suivre l&rsquo;avancement de votre projet, échanger et gérer vos devis directement depuis votre espace personnel.
      </p>

      {/* Perks */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
        {perks.map(({ icon: Icon, text }) => (
          <div key={text} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: 28, height: 28, borderRadius: "8px", flexShrink: 0,
              background: "rgba(60,100,255,0.1)", border: "1px solid rgba(60,100,255,0.18)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon size={13} color="rgba(100,140,255,0.8)" strokeWidth={1.5} />
            </div>
            <span style={{
              fontFamily: "var(--font-poppins)", fontSize: "12px",
              fontWeight: 400, color: "rgba(255,255,255,0.55)",
            }}>
              {text}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/espace"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          width: "100%", padding: "12px 20px", borderRadius: "12px",
          background: "rgba(60,100,255,0.7)", border: "1px solid rgba(60,100,255,0.4)",
          fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 600,
          color: "white", textDecoration: "none", letterSpacing: "0.01em",
          boxShadow: "0 6px 24px rgba(60,100,255,0.2)",
          marginBottom: "10px",
        }}
      >
        Accéder à mon espace
        <ArrowRight size={14} />
      </Link>

      <p style={{
        fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 300,
        color: "rgba(255,255,255,0.15)", textAlign: "center",
        letterSpacing: "0.04em", margin: 0,
      }}>
        Gratuit · Connexion Discord ou email
      </p>

      {/* Bottom accent line */}
      <div style={{
        position: "absolute", bottom: 0, left: "20%", right: "20%",
        height: "1px",
        background: "linear-gradient(to right, transparent, rgba(60,100,255,0.4), transparent)",
        borderRadius: "999px",
      }} />
    </motion.div>
  );
}
