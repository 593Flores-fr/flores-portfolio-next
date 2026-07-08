"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { CollabCTA } from "@/components/ui/collab-cta";
import { useState } from "react";
import type { SiteContentMap, ServiceItem } from "@/lib/site-content";

type Service = ServiceItem;

const faq = [
  { q: "Comment se passe le paiement ?", a: "Un acompte de 30% est demandé à la commande. Le solde est réglé à la livraison, par virement bancaire ou PayPal." },
  { q: "Combien de temps pour livrer ?", a: "Un logo prend 5–7 jours, un site vitrine 2–4 semaines. Un délai précis est donné lors du devis." },
  { q: "Combien de révisions sont incluses ?", a: "Chaque prestation inclut 2 à 3 allers-retours. Les modifications supplémentaires sont facturées 40€/h." },
  { q: "Vous travaillez avec des auto-entrepreneurs ?", a: "Bien sûr. Tarifs adaptés aux indépendants, artistes et petites structures. Pas de TVA (art. 293B du CGI)." },
  { q: "Les fichiers sources sont-ils fournis ?", a: "Création visuelle : oui (AI, PSD, Figma…). Dev web : code source livré sur GitHub." },
  { q: "Proposez-vous de la maintenance ?", a: "Oui pour les projets web. Forfait mensuel disponible selon vos besoins (mises à jour, contenus, corrections)." },
];

function ServiceRow({ s, i }: { s: Service; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "32px",
        padding: "20px 0",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        opacity: s.soon ? 0.35 : 1,
      }}
    >
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
          <div style={{ width: "16px", height: "1px", background: "rgba(255,255,255,0.18)", flexShrink: 0 }} />
          <span style={{ fontFamily: "var(--font-poppins)", fontSize: "var(--fs-md)", fontWeight: 600, color: "rgba(255,255,255,0.82)", letterSpacing: "0.2px" }}>
            {s.name}
          </span>
          {s.badge && (
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: "var(--fs-2xs)", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: "rgba(74,222,128,0.85)", border: "1px solid rgba(74,222,128,0.22)", padding: "2px 7px" }}>
              {s.badge}
            </span>
          )}
          {s.soon && (
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: "var(--fs-2xs)", fontWeight: 500, letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.08)", padding: "2px 7px" }}>
              Bientôt
            </span>
          )}
        </div>
        <p style={{ fontFamily: "var(--font-poppins)", fontSize: "var(--fs-sm)", fontWeight: 400, color: "rgba(255,255,255,0.50)", margin: "0 0 0 26px", lineHeight: 1.75 }}>
          {s.description}
        </p>
      </div>
      <span style={{
        fontFamily: "var(--font-poppins), sans-serif",
        fontSize: "var(--fs-lg)",
        fontWeight: 600,
        letterSpacing: "0px",
        color: (s.price === "Sur devis" || s.price === "À venir") ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.88)",
        whiteSpace: "nowrap",
        flexShrink: 0,
        textAlign: "right",
      }}>
        {s.price}
      </span>
    </motion.div>
  );
}

function FaqPanel() {
  const [selected, setSelected] = useState(0);
  return (
    <div className="faq-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "rgba(255,255,255,0.06)" }}>

      {/* Gauche : liste des questions */}
      <div style={{ background: "#0e0c0a" }}>
        {faq.map((f, i) => (
          <button
            key={f.q}
            onClick={() => setSelected(i)}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "22px 32px",
              background: selected === i ? "rgba(92,92,245,0.05)" : "transparent",
              borderLeft: selected === i ? "2px solid #5C5CF5" : "2px solid transparent",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              borderTop: "none", borderRight: "none",
              cursor: "pointer", textAlign: "left", gap: "16px",
              fontFamily: "var(--font-poppins)",
              transition: "background 0.2s, border-color 0.2s",
            }}
          >
            <span style={{ fontSize: "var(--fs-md)", fontWeight: selected === i ? 600 : 400, color: selected === i ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.38)", letterSpacing: "0.2px", transition: "color 0.2s" }}>
              {f.q}
            </span>
            {selected === i && (
              <span style={{ fontSize: "var(--fs-sm)", color: "#5C5CF5", flexShrink: 0 }}>→</span>
            )}
          </button>
        ))}
      </div>

      {/* Droite : réponse */}
      <div className="faq-answer" style={{ background: "#0e0c0a", padding: "52px 48px", display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "320px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="vto-label" style={{ fontSize: "var(--fs-2xs)", letterSpacing: "4px", color: "rgba(92,92,245,0.55)", marginBottom: "20px" }}>
              {String(selected + 1).padStart(2, "0")}
            </p>
            <h3 style={{ fontFamily: "var(--font-six-caps), sans-serif", fontSize: "clamp(1.6rem, 2.4vw, 2.4rem)", fontWeight: 400, letterSpacing: "4px", textTransform: "uppercase", color: "white", margin: "0 0 20px", lineHeight: 1 }}>
              {faq[selected].q}
            </h3>
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: "var(--fs-base)", fontWeight: 400, color: "rgba(255,255,255,0.52)", lineHeight: 1.9, margin: 0 }}>
              {faq[selected].a}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}

export function TarifPageContent({ content }: { content: SiteContentMap["tarifs"] }) {
  return (
    <div style={{ background: "#0e0c0a", minHeight: "100dvh", color: "white", paddingTop: "64px" }}>

      <div style={{ maxWidth: "1500px", margin: "0 auto", padding: "80px 4vw 160px" }}>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: "80px", textAlign: "center" }}
        >
          <p className="vto-label" style={{ marginBottom: "20px" }}>Tarifs</p>
          <h1 style={{
            fontFamily: "var(--font-six-caps), sans-serif",
            fontSize: "clamp(3.5rem, 7vw, 7rem)",
            fontWeight: 400,
            lineHeight: 0.9,
            letterSpacing: "5px",
            textTransform: "uppercase",
            margin: "0 0 32px",
          }}>
            Aperçu des tarifs.
          </h1>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "var(--fs-base)", fontWeight: 400, color: "rgba(255,255,255,0.52)", lineHeight: 1.9, margin: "0 auto", letterSpacing: "0.3px", maxWidth: "420px" }}>
            Chaque projet est unique, ces fourchettes sont là pour vous orienter.
            Devis gratuit sous 24h, sans engagement.
          </p>
        </motion.div>

        {/* Grille tarifs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "flex", gap: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "80px", flexWrap: "wrap" }}
        >
          {[
            { num: "01", title: content.devTitle,    services: content.devServices    },
            { num: "02", title: content.visualTitle, services: content.visualServices },
          ].map(({ num, title, services }, pi) => (
            <div key={num} style={{ flex: 1, minWidth: "300px", padding: "48px 48px 44px", background: "#0e0c0a" }}>
              <p className="vto-label" style={{ fontSize: "var(--fs-2xs)", letterSpacing: "4px", color: "rgba(255,255,255,0.40)", marginBottom: "16px" }}>{num}</p>
              <h2 style={{
                fontFamily: "var(--font-six-caps), sans-serif",
                fontSize: "clamp(2.2rem, 3.5vw, 3.8rem)",
                fontWeight: 400,
                letterSpacing: "5px",
                textTransform: "uppercase",
                lineHeight: 0.9,
                margin: "0 0 28px",
              }}>
                {title}
              </h2>
              <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", marginBottom: 0 }} />
              {services.map((s, i) => <ServiceRow key={s.name} s={s} i={i + pi * 0.3} />)}
              <div style={{ marginTop: "32px" }}>
                <Link href="/espace" className="vto-cta-link vto-cta-link--accent">
                  Obtenir un devis
                  <span className="vto-cta-line" />
                </Link>
              </div>
            </div>
          ))}
        </motion.div>

        <p className="vto-label" style={{ fontSize: "var(--fs-2xs)", letterSpacing: "3px", color: "rgba(255,255,255,0.48)", textAlign: "center", marginBottom: "100px" }}>
          {content.footerNote}
        </p>

        {/* FAQ */}
        <div className="vto-sep" style={{ marginBottom: "72px", opacity: 0.4 }} />

        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: "100px" }}
        >
          <p className="vto-label" style={{ marginBottom: "20px" }}>FAQ</p>
          <h2 style={{
            fontFamily: "var(--font-six-caps), sans-serif",
            fontSize: "clamp(2.5rem, 5vw, 5rem)",
            fontWeight: 400,
            letterSpacing: "5px",
            textTransform: "uppercase",
            margin: "0 0 48px",
          }}>
            Questions fréquentes.
          </h2>
          <FaqPanel />
        </motion.div>

        {/* CTA final */}
        <CollabCTA title="Un projet en tête ?" ctaLabel="Demander un devis" />

      </div>
    </div>
  );
}
