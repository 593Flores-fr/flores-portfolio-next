"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MessageSquare, Kanban, Star, ArrowRight } from "lucide-react";

const perks = [
  {
    icon: MessageSquare,
    label: "Demande de devis",
    desc: "Formulaire structuré, réponse sous 24h",
  },
  {
    icon: Kanban,
    label: "Suivi en direct",
    desc: "Kanban mis à jour par mes soins",
  },
  {
    icon: Star,
    label: "Laisser un avis",
    desc: "Après livraison, sur invitation",
  },
];

export function ContactSection() {
  return (
    <section
      style={{
        background: "#060a0e",
        padding: "120px 0 140px",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "800px",
          height: "400px",
          background:
            "radial-gradient(ellipse, rgba(60,100,255,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 6vw" }}
      >
        <div
          style={{
            display: "flex",
            gap: "80px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* ── Left column ── */}
          <div style={{ flex: "1 1 400px", minWidth: 0 }}>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "var(--font-poppins)",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.28em",
                color: "rgba(255,255,255,0.25)",
                fontWeight: 300,
                marginBottom: "16px",
              }}
            >
              Espace client
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.05, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "var(--font-poppins)",
                fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.025em",
                color: "white",
                margin: "0 0 24px",
              }}
            >
              Votre projet,<br />
              <span style={{ color: "rgba(100,140,255,0.85)" }}>un espace dédié.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "var(--font-poppins)",
                fontSize: "14px",
                fontWeight: 300,
                color: "rgba(255,255,255,0.35)",
                lineHeight: 1.8,
                margin: "0 0 40px",
                maxWidth: "420px",
              }}
            >
              Créez un compte ou connectez-vous avec Discord pour accéder à votre espace personnel — démarrez une discussion, soumettez un devis et suivez l&apos;avancement de votre projet en temps réel.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}
            >
              <Link
                href="/espace"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 24px",
                  borderRadius: "12px",
                  background: "rgba(60,100,255,0.75)",
                  border: "1px solid rgba(60,100,255,0.4)",
                  fontFamily: "var(--font-poppins)",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "white",
                  textDecoration: "none",
                  letterSpacing: "0.01em",
                  boxShadow: "0 8px 32px rgba(60,100,255,0.2)",
                  transition: "all 0.2s ease",
                }}
              >
                Accéder à mon espace
                <ArrowRight size={14} />
              </Link>

              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 20px",
                  borderRadius: "12px",
                  background: "rgba(88,101,242,0.1)",
                  border: "1px solid rgba(88,101,242,0.25)",
                  fontFamily: "var(--font-poppins)",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.55)",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.7 }}>
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.114 18.1.128 18.116a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                </svg>
                Via Discord
              </a>
            </motion.div>
          </div>

          {/* ── Right column — feature cards ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.1, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            style={{ flex: "1 1 300px", minWidth: 0, display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {perks.map((perk, i) => {
              const Icon = perk.icon;
              return (
                <motion.div
                  key={perk.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: 0.12 + i * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "20px 24px",
                    borderRadius: "14px",
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.02)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      background: "rgba(60,100,255,0.1)",
                      border: "1px solid rgba(60,100,255,0.18)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon
                      width={17}
                      height={17}
                      color="rgba(100,140,255,0.8)"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-poppins)",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.82)",
                        margin: "0 0 3px",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {perk.label}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-poppins)",
                        fontSize: "11px",
                        fontWeight: 300,
                        color: "rgba(255,255,255,0.28)",
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      {perk.desc}
                    </p>
                  </div>
                  {/* Row line accent */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "3px",
                      height: "40%",
                      background: "rgba(60,100,255,0.3)",
                      borderRadius: "0 2px 2px 0",
                    }}
                  />
                </motion.div>
              );
            })}

            {/* Note */}
            <p
              style={{
                fontFamily: "var(--font-poppins)",
                fontSize: "10px",
                fontWeight: 300,
                color: "rgba(255,255,255,0.15)",
                textAlign: "center",
                letterSpacing: "0.06em",
                paddingTop: "4px",
              }}
            >
              Connexion Discord ou email · Gratuit · Aucune CB requise
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
