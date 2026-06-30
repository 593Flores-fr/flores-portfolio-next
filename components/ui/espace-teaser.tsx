"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ScrollFillText } from "@/components/ui/scroll-fill-text";

const ease = [0.22, 1, 0.36, 1] as const;

const pilliers = [
  {
    num: "01",
    title: "Ça commence ici",
    desc: "Formulaire de brief structuré ou réservation d'un premier RDV, directement depuis l'espace. Pas d'email, pas de contact générique. Les bases du projet posées proprement, dès le départ.",
  },
  {
    num: "02",
    title: "Suivi en continu",
    desc: "Avancement visible à chaque étape, kanban partagé, messagerie dédiée au projet. Votre client sait exactement où on en est, sans avoir besoin de demander.",
  },
  {
    num: "03",
    title: "Tout centralisé",
    desc: "Devis signés en ligne, factures téléchargeables, fichiers livrés archivés. Un seul endroit pour tout retrouver, du brief à la livraison finale.",
  },
];

export function EspaceTeaser() {
  return (
    <section style={{ background: "#0e0c0a", padding: "120px 0 140px", position: "relative" }}>
      <div className="vto-sep" style={{ position: "absolute", top: 0, left: "4vw", right: "4vw", opacity: 0.4 }} />

      <div style={{ maxWidth: "1500px", margin: "0 auto", padding: "0 4vw" }}>

        {/* Layout : pitch gauche + 3 cards droite */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start" }}>

          {/* Pitch */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease }}
            style={{ position: "sticky", top: "100px" }}
          >
            {/* Badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
              <div style={{ width: "28px", height: "1px", background: "#5C5CF5" }} />
              <span className="vto-label" style={{ fontSize: "8px", color: "rgba(92,92,245,0.75)", letterSpacing: "4px" }}>
                Espace client · Inclus
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
                Votre projet.<br />
                Votre espace.
              </ScrollFillText>
            </h2>

            {/* Corps */}
            <p style={{
              fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 400,
              color: "rgba(255,255,255,0.48)", maxWidth: "400px", lineHeight: 2,
              margin: "0 0 12px",
            }}>
              Tout commence depuis l&apos;espace : un formulaire adapté pour poser les bases du projet, ou la réservation d&apos;un premier RDV. Pas d&apos;email générique, pas d&apos;aller-retour inutile.
            </p>
            <p style={{
              fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 400,
              color: "rgba(255,255,255,0.32)", maxWidth: "400px", lineHeight: 2,
              margin: "0 0 40px",
            }}>
              Une fois le projet lancé : avancement en temps réel, messagerie dédiée, devis et factures en ligne. Tout simplement la meilleure façon de bosser ensemble.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link href="/espace" className="vto-cta-link vto-cta-link--accent">
                Créer un compte · Se connecter
                <span className="vto-cta-line" />
              </Link>
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: "8px", letterSpacing: "2px", color: "rgba(255,255,255,0.22)", textTransform: "uppercase" }}>
                Connexion Discord disponible
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

            {pilliers.map((p, i) => (
              <motion.div
                key={p.num}
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.55, ease }}
                style={{
                  padding: "36px 44px",
                  borderBottom: i < pilliers.length - 1 ? "1px solid rgba(92,92,245,0.10)" : "none",
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
                    {p.num}
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
