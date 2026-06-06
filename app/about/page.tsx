"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

const tools = [
  { name: "Photoshop",   category: "Design" },
  { name: "Illustrator", category: "Design" },
  { name: "Figma",       category: "Design" },
  { name: "After Effects", category: "Motion" },
  { name: "Premiere Pro",  category: "Motion" },
  { name: "Next.js",     category: "Dev" },
  { name: "TypeScript",  category: "Dev" },
  { name: "Prisma",      category: "Dev" },
  { name: "Tailwind",    category: "Dev" },
  { name: "Framer Motion", category: "Dev" },
];

const CAT_COLOR: Record<string, string> = {
  Design: "rgba(167,139,250,0.7)",
  Motion: "rgba(96,165,250,0.7)",
  Dev:    "rgba(74,222,128,0.7)",
};

const process = [
  { num: "01", title: "Écoute & cadrage", text: "Un brief approfondi pour comprendre votre univers, vos contraintes et vos ambitions. Rien de générique." },
  { num: "02", title: "Concept & maquette", text: "Je propose une direction artistique claire — moodboard, wireframe ou prototype — avant de coder ou dessiner." },
  { num: "03", title: "Création & itérations", text: "Livraisons régulières, retours intégrés rapidement. Vous voyez le projet avancer en temps réel depuis votre espace." },
  { num: "04", title: "Livraison & suivi", text: "Fichiers sources, code déployé, documentation légère. Je reste disponible après la livraison." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }),
};

export default function AboutPage() {
  return (
    <div style={{ background: "#060a0e", minHeight: "100dvh", color: "white" }}>

      {/* Minimal header */}
      <header style={{ padding: "24px 6vw", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", fontFamily: "var(--font-poppins)", fontSize: "12px", color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>
          <ArrowLeft size={14} /> Accueil
        </Link>
        <span style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.18)" }}>
          À propos
        </span>
      </header>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "80px 6vw 160px" }}>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }} style={{ marginBottom: "100px" }}>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.28em", color: "rgba(255,255,255,0.22)", marginBottom: "20px" }}>
            Flores · Allan
          </p>
          <h1 style={{ fontFamily: "var(--font-poppins)", fontSize: "clamp(3rem,6vw,6rem)", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.025em", margin: "0 0 28px" }}>
            Graphiste freelance<br />
            <span style={{ color: "rgba(100,140,255,0.85)" }}>&</span> développeur web.
          </h1>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "16px", fontWeight: 300, color: "rgba(255,255,255,0.4)", maxWidth: "520px", lineHeight: 1.75, margin: 0 }}>
            Autodidacte depuis 5 ans, membre de V.T.O Studio. Je conçois des identités visuelles et des expériences web qui ont un caractère propre.
          </p>
        </motion.div>

        {/* Photo + stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", marginBottom: "120px", alignItems: "center" }}>
          <motion.div initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <div style={{ position: "relative", borderRadius: "20px", overflow: "hidden", aspectRatio: "4/5", border: "1px solid rgba(255,255,255,0.07)" }}>
              <Image src="/images/about.jpg" alt="Allan" fill style={{ objectFit: "cover", objectPosition: "center top" }} sizes="50vw" />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(6,10,14,0.65) 0%, transparent 50%)" }} />
            </div>
          </motion.div>
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {[
              { value: "30+", label: "Projets livrés", desc: "Identités visuelles, sites web, covers, overlays…" },
              { value: "5+",  label: "Ans d'expérience", desc: "100% autodidacte, apprentissage constant." },
              { value: "24h", label: "Délai de réponse", desc: "Devis gratuit, réponse rapide, suivi en direct." },
            ].map((s, i) => (
              <motion.div key={s.label} custom={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                <span style={{ fontFamily: "var(--font-six-caps)", fontSize: "3.5rem", color: "rgba(100,140,255,0.7)", lineHeight: 1, letterSpacing: "0.05em", flexShrink: 0 }}>{s.value}</span>
                <div>
                  <p style={{ fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.8)", margin: "0 0 4px" }}>{s.label}</p>
                  <p style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.32)", margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Process */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} style={{ marginBottom: "100px" }}>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.28em", color: "rgba(255,255,255,0.22)", marginBottom: "16px" }}>Processus</p>
          <h2 style={{ fontFamily: "var(--font-poppins)", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: "56px" }}>
            Comment je travaille.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0" }}>
            {process.map((p, i) => (
              <motion.div key={p.num} custom={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                style={{ padding: "32px 36px 32px 0", borderTop: "1px solid rgba(255,255,255,0.06)", borderRight: i % 2 === 0 ? "1px solid rgba(255,255,255,0.06)" : "none", paddingRight: i % 2 === 0 ? "48px" : "0", paddingLeft: i % 2 === 1 ? "48px" : "0" }}
              >
                <span style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 500, color: "rgba(100,140,255,0.6)", letterSpacing: "0.12em", display: "block", marginBottom: "12px" }}>{p.num}</span>
                <p style={{ fontFamily: "var(--font-poppins)", fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.85)", margin: "0 0 10px" }}>{p.title}</p>
                <p style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.35)", lineHeight: 1.75, margin: 0 }}>{p.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tools */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} style={{ marginBottom: "100px" }}>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.28em", color: "rgba(255,255,255,0.22)", marginBottom: "16px" }}>Stack & outils</p>
          <h2 style={{ fontFamily: "var(--font-poppins)", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: "48px" }}>
            Ce que j'utilise.
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {tools.map((t, i) => (
              <motion.div key={t.name} custom={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                style={{ display: "flex", alignItems: "center", gap: "7px", padding: "8px 14px", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: CAT_COLOR[t.category], flexShrink: 0 }} />
                <span style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,0.65)" }}>{t.name}</span>
              </motion.div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "16px", marginTop: "20px" }}>
            {Object.entries(CAT_COLOR).map(([cat, color]) => (
              <div key={cat} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
                <span style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{cat}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          style={{ padding: "60px", borderRadius: "20px", border: "1px solid rgba(60,100,255,0.2)", background: "radial-gradient(ellipse at 60% 0%, rgba(60,100,255,0.08) 0%, transparent 70%)", textAlign: "center" }}
        >
          <h2 style={{ fontFamily: "var(--font-poppins)", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 16px" }}>Travaillons ensemble.</h2>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "14px", fontWeight: 300, color: "rgba(255,255,255,0.35)", margin: "0 auto 32px", maxWidth: "400px", lineHeight: 1.7 }}>
            Devis gratuit sous 24h, suivi en direct depuis votre espace client.
          </p>
          <Link href="/espace" style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "14px 28px", borderRadius: "12px", border: "1px solid rgba(60,100,255,0.35)", background: "rgba(60,100,255,0.6)", fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 600, color: "white", textDecoration: "none" }}>
            Démarrer un projet →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
