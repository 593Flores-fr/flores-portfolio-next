"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.75, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const points = [
  {
    num: "01",
    title: "Qui suis-je",
    text: "Autodidacte depuis 5 ans, j'ai tout appris seul — du logo au site web en passant par la cover musicale. Graphiste freelance & membre de V.T.O Studio, je construis des identités visuelles qui ont du caractère.",
  },
  {
    num: "02",
    title: "Ce que je propose",
    text: "Identité visuelle, direction artistique, développement web, cover art, suivi créateurs & artistes. Un seul interlocuteur, six expertises — du concept à la livraison.",
  },
  {
    num: "03",
    title: "Pourquoi bosser avec moi",
    text: "Parce que je m'implique vraiment. Pas de template, pas de copier-coller. Chaque projet est pensé pour vous ressembler et marquer les esprits — avec une réponse sous 24h et un devis gratuit.",
  },
];

export function AboutSection() {
  return (
    <section style={{ background: "#060a0e", padding: "140px 0 140px", overflow: "hidden", position: "relative" }}>
      {/* Fondu haut — raccord avec le hero */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "120px",
        background: "linear-gradient(to bottom, #060a0e 0%, transparent 100%)",
        pointerEvents: "none",
        zIndex: 1,
      }} />

      <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 6vw", position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>

        {/* ── GAUCHE — Image ── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: "relative" }}
        >
          {/* Cadre image principal */}
          <div style={{
            position: "relative",
            borderRadius: "20px",
            overflow: "hidden",
            aspectRatio: "4/5",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
          }}>
            <Image
              src="/images/about.jpg"
              alt="Flores — Allan"
              fill
              style={{ objectFit: "cover", objectPosition: "center top" }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Overlay gradient bas */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(6,10,14,0.7) 0%, transparent 50%)" }} />
          </div>

          {/* Badge flottant */}
          <div style={{
            position: "absolute",
            bottom: "28px",
            left: "28px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 18px",
            borderRadius: "999px",
            background: "rgba(6,10,14,0.85)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px rgba(74,222,128,0.9)", flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", color: "rgba(255,255,255,0.7)", fontWeight: 500, letterSpacing: "0.05em" }}>
              Disponible · Devis gratuit
            </span>
          </div>

          {/* Card stats flottante — haut droite */}
          <div style={{
            position: "absolute",
            top: "28px",
            right: "-24px",
            padding: "16px 20px",
            borderRadius: "16px",
            background: "rgba(6,10,14,0.9)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}>
            {[["30+", "Projets livrés"], ["5+", "Ans d'exp."]].map(([val, label]) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontFamily: "var(--font-six-caps)", fontSize: "2rem", color: "white", lineHeight: 1, letterSpacing: "0.05em" }}>{val}</span>
                <span style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 300 }}>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── DROITE — Texte ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>

          {/* Eyebrow */}
          <motion.p
            custom={0} variants={fadeUp} initial="hidden"
            whileInView="show" viewport={{ once: true, margin: "-100px" }}
            style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.28em", color: "rgba(255,255,255,0.25)", fontWeight: 300, marginBottom: "16px" }}
          >
            A propos
          </motion.p>

          {/* Titre */}
          <motion.h2
            custom={1} variants={fadeUp} initial="hidden"
            whileInView="show" viewport={{ once: true, margin: "-100px" }}
            style={{ fontFamily: "var(--font-poppins)", fontSize: "clamp(2.8rem,4.5vw,5rem)", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.02em", color: "white", marginBottom: "48px" }}
          >
            Créer, c&rsquo;est<br />ce que je fais.
          </motion.h2>

          {/* Points */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {points.map((p, i) => (
              <motion.div
                key={p.num}
                custom={i + 2} variants={fadeUp} initial="hidden"
                whileInView="show" viewport={{ once: true, margin: "-100px" }}
                style={{
                  padding: "28px 0",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  display: "grid",
                  gridTemplateColumns: "40px 1fr",
                  gap: "20px",
                  alignItems: "start",
                }}
              >
                <span style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", color: "rgba(255,255,255,0.2)", fontWeight: 500, letterSpacing: "0.1em", paddingTop: "3px" }}>{p.num}</span>
                <div>
                  <p style={{ fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: "8px", letterSpacing: "0.02em" }}>{p.title}</p>
                  <p style={{ fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 300, color: "rgba(255,255,255,0.38)", lineHeight: 1.85 }}>{p.text}</p>
                </div>
              </motion.div>
            ))}
            {/* Dernier séparateur */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />
          </div>

          {/* CTA */}
          <motion.div
            custom={5} variants={fadeUp} initial="hidden"
            whileInView="show" viewport={{ once: true, margin: "-100px" }}
            style={{ marginTop: "36px" }}
          >
            <Link href="/about" style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              fontFamily: "var(--font-poppins)", fontSize: "12px",
              fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.6)", textDecoration: "none",
              borderBottom: "1px solid rgba(255,255,255,0.15)",
              paddingBottom: "4px",
              transition: "color 0.2s, border-color 0.2s",
            }}>
              En savoir plus sur moi
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 8L8 2M8 2H3M8 2V7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
