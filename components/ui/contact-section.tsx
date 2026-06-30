"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MessageSquare, Kanban, Star } from "lucide-react";

const perks = [
  { icon: MessageSquare, label: "Demande de devis",  desc: "Formulaire structuré · réponse sous 24h" },
  { icon: Kanban,        label: "Suivi en direct",   desc: "Kanban mis à jour par mes soins"         },
  { icon: Star,          label: "Laisser un avis",   desc: "Après livraison · sur invitation"        },
];

export function ContactSection({ discordUrl = "" }: { discordUrl?: string }) {
  return (
    <section style={{ background: "#0e0c0a", padding: "120px 0 140px", position: "relative" }}>
      <div className="vto-sep" style={{ position: "absolute", top: 0, left: "6vw", right: "6vw", opacity: 0.4 }} />

      {/* Ambient glow VTO */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "700px", height: "350px", background: "radial-gradient(ellipse, rgba(92,92,245,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "1500px", margin: "0 auto", padding: "0 4vw" }}>
        <div style={{ display: "flex", gap: "80px", alignItems: "flex-start", flexWrap: "wrap" }}>

          {/* ── Gauche ── */}
          <div style={{ flex: "1 1 400px", minWidth: 0 }}>

            <motion.p
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="vto-label" style={{ marginBottom: "20px" }}
            >
              Espace client
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.05, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontFamily: "var(--font-six-caps), sans-serif", fontSize: "clamp(3rem, 5vw, 5.5rem)", fontWeight: 400, lineHeight: 0.92, letterSpacing: "5px", textTransform: "uppercase", color: "white", margin: "0 0 28px" }}
            >
              Votre projet,<br />
              <span style={{ color: "var(--vto-primary)" }}>un espace dédié.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 400, color: "rgba(255,255,255,0.55)", lineHeight: 1.9, margin: "0 0 44px", maxWidth: "400px" }}
            >
              Créez un compte ou connectez-vous avec Discord pour accéder à votre espace personnel. Démarrez une discussion, soumettez un devis et suivez l&apos;avancement de votre projet.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <Link href="/espace" className="vto-cta-link vto-cta-link--primary vto-cta-link--accent">
                Accéder à mon espace
                <span className="vto-cta-line" />
              </Link>

              <a
                href={discordUrl || "https://discord.com"}
                target="_blank" rel="noopener noreferrer"
                className="vto-cta-link"
                style={{ alignItems: "center" }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.5, flexShrink: 0 }}>
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.114 18.1.128 18.116a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                </svg>
                Via Discord
                <span className="vto-cta-line" />
              </a>
            </motion.div>
          </div>

          {/* ── Droite — feature cards VTO ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.1, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            style={{ flex: "1 1 280px", minWidth: 0, display: "flex", flexDirection: "column", gap: "1px", background: "rgba(255,255,255,0.06)" }}
          >
            {perks.map((perk, i) => {
              const Icon = perk.icon;
              return (
                <motion.div
                  key={perk.label}
                  initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: 0.12 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    display: "flex", alignItems: "center", gap: "18px",
                    padding: "24px 28px",
                    background: "#0e0c0a",
                    transition: "background 0.4s ease",
                    position: "relative", overflow: "hidden",
                  }}
                  className="contact-perk"
                >
                  {/* Accent gauche VTO */}
                  <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: "2px", height: "36px", background: "var(--vto-primary)", opacity: 0.4 }} />

                  <Icon width={16} height={16} color="rgba(92,92,245,0.65)" strokeWidth={1.5} style={{ flexShrink: 0 }} />

                  <div>
                    <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.75)", margin: "0 0 3px", letterSpacing: "0.3px" }}>
                      {perk.label}
                    </p>
                    <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 400, color: "rgba(255,255,255,0.50)", margin: 0, letterSpacing: "0.2px" }}>
                      {perk.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}

            <div style={{ padding: "16px 28px", background: "#0e0c0a" }}>
              <p className="vto-label" style={{ fontSize: "8px", letterSpacing: "3px", color: "rgba(255,255,255,0.30)" }}>
                Connexion Discord ou email · Gratuit · Aucune CB requise
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
