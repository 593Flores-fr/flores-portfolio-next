"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { CollabCTA } from "@/components/ui/collab-cta";
import { SITE_DEFAULTS } from "@/lib/site-content";
import type { SiteContentMap } from "@/lib/site-content";

const toolGroups = [
  {
    category: "Design",
    tools: [
      { label: "Ps", bg: "#31A8FF",  name: "Photoshop",   desc: "Retouche photo, compositions et visuels digitaux haute qualité." },
      { label: "Ai", bg: "#FF7C00",  name: "Illustrator", desc: "Création vectorielle : logos, icônes et éléments de charte graphique." },
      { label: "Fg", bg: "#A259FF",  name: "Figma",       desc: "Maquettes UI/UX, prototypage et systèmes de design collaboratifs." },
    ],
  },
  {
    category: "Dev",
    tools: [
      { label: "▲",  bg: "#111",     name: "Next.js",       desc: "Framework React full-stack. App Router, SSR/SSG, performances optimales.", color: "rgba(255,255,255,0.85)" },
      { label: "TS", bg: "#3178C6",  name: "TypeScript",    desc: "Typage statique pour un code robuste, erreurs détectées en amont." },
      { label: "◆",  bg: "#0C344B",  name: "Prisma",        desc: "ORM type-safe. Modélisation de données et migrations simplifiées.", color: "rgba(255,255,255,0.7)" },
      { label: "TW", bg: "#0EA5E9",  name: "Tailwind",      desc: "Utility-first CSS, design system cohérent et itérations ultra-rapides." },
      { label: "FM", bg: "#0055FF",  name: "Framer Motion", desc: "Animations fluides et micro-interactions React, déclaratives et performantes." },
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } }),
};

type Content = SiteContentMap["aboutPage"];

export function AboutPageContent({ content = SITE_DEFAULTS.aboutPage }: { content?: Content }) {
  const parcours = content.parcours;
  const process  = content.process;

  return (
    <div style={{ background: "#0e0c0a", minHeight: "100dvh", color: "white", paddingTop: "64px" }}>

      {/* ── Hero split — texte gauche / image slash droite ── */}
      <div className="about-hero-grid">

        {/* Texte */}
        <motion.div
          initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "100px 6vw 80px 4vw",
            position: "relative",
            zIndex: 2,
          }}
        >
          <p className="vto-label" style={{ marginBottom: "28px" }}>Flores · Allan</p>
          <h1 style={{
            fontFamily: "var(--font-six-caps), sans-serif",
            fontSize: "clamp(3.8rem, 6.5vw, 8rem)",
            fontWeight: 400,
            lineHeight: 0.88,
            letterSpacing: "5px",
            textTransform: "uppercase",
            margin: "0 0 48px",
          }}>
            {content.heroTitle.split("&").map((part, i, arr) => (
              i < arr.length - 1
                ? <span key={i}>{part}<span style={{ color: "var(--vto-primary)" }}>&amp;</span></span>
                : <span key={i}>{part}</span>
            ))}
          </h1>
          <p style={{
            fontFamily: "var(--font-poppins)",
            fontSize: "12px",
            fontWeight: 400,
            color: "rgba(255,255,255,0.60)",
            maxWidth: "400px",
            lineHeight: 2,
            margin: 0,
          }}>
            {content.heroSubtitle.split("\n").map((line, i) => (
              <span key={i}>{line}{i < content.heroSubtitle.split("\n").length - 1 && <br />}</span>
            ))}
          </p>
        </motion.div>

        {/* Image avec bord slash "/" */}
        <motion.div
          initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="about-hero-image"
          style={{
            position: "relative",
            overflow: "hidden",
            clipPath: "polygon(14% 0%, 100% 0%, 100% 100%, 0% 100%)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/about-hero.png"
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 30%",
            }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to right, rgba(14,12,10,0.55) 0%, rgba(14,12,10,0.05) 40%, transparent 70%)",
            zIndex: 2,
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(14,12,10,0.85) 0%, transparent 35%)",
            zIndex: 2,
          }} />
        </motion.div>

      </div>

      <div style={{ maxWidth: "1500px", margin: "0 auto", padding: "80px 4vw 160px" }}>

        {/* ── Parcours ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: "140px" }}
        >
          <div className="vto-sep" style={{ marginBottom: "64px" }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "80px", alignItems: "start" }}>

            {/* Titre gauche — fixe */}
            <div style={{ position: "sticky", top: "80px" }}>
              <p className="vto-label" style={{ marginBottom: "16px" }}>Mon parcours</p>
              <h2 style={{ fontFamily: "var(--font-six-caps), sans-serif", fontSize: "clamp(2.8rem, 4vw, 4.5rem)", fontWeight: 400, lineHeight: 0.92, letterSpacing: "5px", textTransform: "uppercase", margin: 0 }}>
                {content.parcoursHeading.split("\n").map((line, i, arr) => (
                  <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                ))}
              </h2>
            </div>

            {/* Timeline droite */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {parcours.map((p, i) => (
                <motion.div
                  key={p.date}
                  custom={i} variants={fadeUp} initial="hidden" whileInView="show"
                  viewport={{ once: true, margin: "-40px" }}
                  style={{
                    padding: "36px 0",
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    display: "grid",
                    gridTemplateColumns: "96px 1fr",
                    gap: "32px",
                  }}
                >
                  <span className="vto-label" style={{ fontSize: "8px", letterSpacing: "3px", color: "rgba(255,255,255,0.35)", paddingTop: "3px", lineHeight: 1.6 }}>
                    {p.date}
                  </span>
                  <div>
                    <p style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.80)", margin: "0 0 12px", letterSpacing: "0.3px" }}>
                      {p.title}
                    </p>
                    <p style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 400, color: "rgba(255,255,255,0.55)", lineHeight: 1.9, margin: 0 }}>
                      {p.text}
                    </p>
                  </div>
                </motion.div>
              ))}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} />
            </div>

          </div>
        </motion.div>

        {/* ── V.T.O Studio ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: "140px" }}
        >
          <div className="vto-sep" style={{ marginBottom: "64px" }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1px", background: "rgba(255,255,255,0.06)" }}>

            {/* Col 1 — Services */}
            <div style={{ padding: "52px 44px", background: "#0e0c0a", display: "flex", flexDirection: "column" }}>
              <p className="vto-label" style={{ marginBottom: "28px" }}>Ce qu&apos;on fait</p>
              {content.vtoServices.map((item, i) => (
                <motion.div
                  key={item.label}
                  custom={i} variants={fadeUp} initial="hidden" whileInView="show"
                  viewport={{ once: true, margin: "-40px" }}
                  style={{ padding: "16px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.75)", margin: "0 0 5px", letterSpacing: "0.3px" }}>
                    {item.label}
                  </p>
                  <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 400, color: "rgba(255,255,255,0.50)", lineHeight: 1.8, margin: 0 }}>
                    {item.desc}
                  </p>
                </motion.div>
              ))}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} />
            </div>

            {/* Col 2 — Cassette centrée */}
            <div style={{ padding: "52px 44px", background: "#0e0c0a", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <p className="vto-label" style={{ marginBottom: "36px", textAlign: "center" }}>Association</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/vto-cassette.png"
                alt="V.T.O Studio"
                style={{
                  width: "100%",
                  maxWidth: "260px",
                  height: "auto",
                  display: "block",
                  filter: "drop-shadow(0 8px 40px rgba(92,92,245,0.30))",
                }}
              />
            </div>

            {/* Col 3 — Description + liens */}
            <div style={{ padding: "52px 44px", background: "#0e0c0a", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginBottom: "40px", flex: 1 }}>
                <p style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 400, color: "rgba(255,255,255,0.60)", lineHeight: 1.9, margin: 0 }}>
                  {content.vtoDesc1}
                </p>
                <p style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 400, color: "rgba(255,255,255,0.48)", lineHeight: 1.9, margin: 0 }}>
                  {content.vtoDesc2}
                </p>
              </div>

              {/* Liens VTO */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "rgba(255,255,255,0.06)" }}>
                {content.vtoLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-perk"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "16px",
                      padding: "14px 18px",
                      background: "#0e0c0a",
                      textDecoration: "none",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <div>
                      <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.75)", margin: "0 0 2px" }}>{link.label}</p>
                      <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 400, color: "rgba(255,255,255,0.45)", margin: 0 }}>{link.desc}</p>
                    </div>
                    <ExternalLink size={10} color="rgba(255,255,255,0.28)" style={{ flexShrink: 0 }} />
                  </a>
                ))}
              </div>
            </div>

          </div>
        </motion.div>

        {/* ── Processus ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: "120px" }}
        >
          <p className="vto-label" style={{ marginBottom: "16px", textAlign: "center" }}>Processus</p>
          <h2 style={{ fontFamily: "var(--font-six-caps), sans-serif", fontSize: "clamp(2.5rem, 4.5vw, 4.5rem)", fontWeight: 400, lineHeight: 1.0, letterSpacing: "5px", textTransform: "uppercase", marginBottom: "56px", textAlign: "center" }}>
            Comment je travaille.
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "rgba(255,255,255,0.05)" }}>
            {process.map((p, i) => (
              <motion.div
                key={p.num} custom={i} variants={fadeUp} initial="hidden" whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                style={{ padding: "40px 44px", background: "#0e0c0a" }}
              >
                <span className="vto-label" style={{ fontSize: "9px", letterSpacing: "2px", color: "rgba(255,255,255,0.38)", display: "block", marginBottom: "16px" }}>{p.num}</span>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                  <span style={{ fontSize: "18px", lineHeight: 1 }}>{p.emoji}</span>
                  <p style={{ fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.85)", margin: 0, letterSpacing: "0.2px" }}>
                    {p.title}
                  </p>
                </div>

                <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 400, color: "rgba(255,255,255,0.52)", lineHeight: 1.9, margin: 0 }}>
                  {p.text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Stack & outils ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: "120px" }}
        >
          <p className="vto-label" style={{ marginBottom: "16px" }}>Stack &amp; outils</p>
          <h2 style={{ fontFamily: "var(--font-six-caps), sans-serif", fontSize: "clamp(2.5rem, 4.5vw, 4.5rem)", fontWeight: 400, lineHeight: 1.0, letterSpacing: "5px", textTransform: "uppercase", marginBottom: "56px" }}>
            Ce que j&apos;utilise.
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
            {toolGroups.map((group) => (
              <div key={group.category}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px" }}>
                  <p className="vto-label" style={{ fontSize: "8px", letterSpacing: "4px", color: "rgba(255,255,255,0.38)", margin: 0 }}>
                    {group.category}
                  </p>
                  <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.04)" }} />
                </div>

                <div style={{ display: "flex", gap: "1px", background: "rgba(255,255,255,0.05)", flexWrap: "wrap" }}>
                  {group.tools.map((t) => (
                    <div
                      key={t.name}
                      style={{
                        flex: "1 1 200px", minWidth: 0,
                        display: "flex", gap: "14px", alignItems: "flex-start",
                        padding: "20px 22px", background: "#0e0c0a",
                      }}
                    >
                      <div style={{
                        width: 32, height: 32, flexShrink: 0,
                        background: t.bg,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 700,
                        color: t.color ?? "white", letterSpacing: "-0.02em",
                      }}>
                        {t.label}
                      </div>
                      <div>
                        <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.72)", margin: "0 0 4px", letterSpacing: "0.2px" }}>
                          {t.name}
                        </p>
                        <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 400, color: "rgba(255,255,255,0.50)", lineHeight: 1.7, margin: 0 }}>
                          {t.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── CTA ── */}
        <CollabCTA title={content.ctaTitle} ctaLabel="Démarrer un projet" />

      </div>
    </div>
  );
}
