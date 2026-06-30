"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SITE_DEFAULTS } from "@/lib/site-content";
import type { SiteContentMap, ServiceItem } from "@/lib/site-content";

function ServiceRow({ s, index }: { s: ServiceItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: "24px",
        alignItems: "start",
        padding: "22px 0",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        opacity: s.soon ? 0.35 : 1,
      }}
    >
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
          <div style={{ width: "16px", height: "1px", background: "rgba(255,255,255,0.18)", flexShrink: 0 }} />
          <span style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.80)", letterSpacing: "0.2px" }}>
            {s.name}
          </span>
          {s.badge && (
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: "7px", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: "rgba(74,222,128,0.8)", border: "1px solid rgba(74,222,128,0.2)", padding: "2px 7px" }}>
              {s.badge}
            </span>
          )}
          {s.soon && (
            <span className="vto-label" style={{ fontSize: "7px", color: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.08)", padding: "2px 7px" }}>
              Bientôt
            </span>
          )}
        </div>
        <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 400, color: "rgba(255,255,255,0.50)", margin: "0 0 0 26px", lineHeight: 1.75 }}>
          {s.description}
        </p>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <span style={{
          fontFamily: "var(--font-poppins), sans-serif",
          fontSize: "13px",
          fontWeight: 600,
          letterSpacing: "0px",
          color: (s.price === "Sur devis" || s.price === "À venir") ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.88)",
          whiteSpace: "nowrap",
          display: "block",
        }}>
          {s.price}
        </span>
      </div>
    </motion.div>
  );
}

function TarifCol({ number, title, services, delay = 0 }: {
  number: string;
  title: string;
  services: ServiceItem[];
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ flex: 1, minWidth: 0, padding: "48px 48px 44px", background: "#0e0c0a" }}
    >
      <p className="vto-label" style={{ fontSize: "8px", letterSpacing: "4px", color: "rgba(255,255,255,0.40)", marginBottom: "16px" }}>
        {number}
      </p>
      <h3 style={{
        fontFamily: "var(--font-six-caps), sans-serif",
        fontSize: "clamp(2.2rem, 3.5vw, 3.8rem)",
        fontWeight: 400,
        color: "white",
        letterSpacing: "5px",
        textTransform: "uppercase",
        lineHeight: 0.9,
        margin: "0 0 8px",
      }}>
        {title}
      </h3>

      <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "28px 0 0" }} />

      <div>
        {services.map((s, i) => <ServiceRow key={i} s={s} index={i} />)}
      </div>

      <div style={{ marginTop: "32px" }}>
        <Link href="/espace" className="vto-cta-link vto-cta-link--accent">
          Obtenir un devis
          <span className="vto-cta-line" />
        </Link>
      </div>
    </motion.div>
  );
}

export function TarifsSection({ content = SITE_DEFAULTS.tarifs }: { content?: SiteContentMap["tarifs"] }) {
  return (
    <section id="tarifs" style={{ background: "#0e0c0a", padding: "120px 0 140px", position: "relative" }}>
      <div className="vto-sep" style={{ position: "absolute", top: 0, left: "6vw", right: "6vw", opacity: 0.4 }} />

      <div style={{ maxWidth: "1500px", margin: "0 auto", padding: "0 4vw" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: "56px" }}
        >
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "20px", paddingBottom: "32px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div>
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "9px", fontWeight: 500, letterSpacing: "4px", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", margin: "0 0 16px" }}>Tarifs</p>
              <h2 style={{
                fontFamily: "var(--font-six-caps), sans-serif",
                fontSize: "clamp(3rem, 5.5vw, 5.5rem)",
                fontWeight: 400,
                lineHeight: 1.0,
                letterSpacing: "5px",
                textTransform: "uppercase",
                color: "white",
                margin: 0,
              }}>
                Aperçu des tarifs.
              </h2>
            </div>
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 400, color: "rgba(255,255,255,0.30)", maxWidth: "240px", lineHeight: 2, margin: 0, letterSpacing: "0.2px" }}>
              Chaque projet est unique.<br />
              Devis gratuit sous 24h, sans engagement.
            </p>
          </div>
        </motion.div>

        {/* Grille VTO gap:1px */}
        <div style={{ display: "flex", gap: "1px", background: "rgba(255,255,255,0.06)", flexWrap: "wrap" }}>
          <TarifCol number="01" title={content.devTitle}    services={content.devServices}    delay={0}    />
          <TarifCol number="02" title={content.visualTitle} services={content.visualServices} delay={0.06} />
        </div>

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.6 }}
          className="vto-label"
          style={{ fontSize: "8px", letterSpacing: "3px", color: "rgba(255,255,255,0.1)", textAlign: "center", marginTop: "48px" }}
        >
          {content.footerNote}
        </motion.p>
      </div>
    </section>
  );
}
