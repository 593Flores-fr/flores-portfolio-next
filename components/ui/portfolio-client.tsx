"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

type Project = { id: string; slug: string; title: string; tag: string; description: string; imageSrc: string; category: string };

const filters = ["Tous", "Web", "Visuel", "Cover"];

const CAT_ACCENT: Record<string, string> = {
  Web:    "rgba(60,100,255,0.85)",
  Visuel: "rgba(167,139,250,0.85)",
  Cover:  "rgba(251,191,36,0.85)",
};
const CAT_BG: Record<string, string> = {
  Web:    "rgba(60,100,255,0.12)",
  Visuel: "rgba(167,139,250,0.12)",
  Cover:  "rgba(251,191,36,0.12)",
};

function ProjectCard({ p, index, featured }: { p: Project; index: number; featured: boolean }) {
  const [hovered, setHovered] = useState(false);
  const accent = CAT_ACCENT[p.category] ?? "rgba(255,255,255,0.5)";
  const catBg  = CAT_BG[p.category]  ?? "rgba(255,255,255,0.08)";

  return (
    <motion.div
      layout
      key={p.id}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -8 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ gridColumn: featured ? "1 / -1" : "span 1" }}
    >
      <Link href={`/portfolio/${p.slug}`} style={{ textDecoration: "none", display: "block" }}>
        <motion.div
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          animate={{ y: hovered ? -6 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            borderRadius: "16px", overflow: "hidden",
            border: `1px solid ${hovered ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.07)"}`,
            background: "rgba(255,255,255,0.02)",
            display: featured ? "grid" : "flex",
            flexDirection: featured ? undefined : "column",
            gridTemplateColumns: featured ? "58% 1fr" : undefined,
            cursor: "pointer",
            transition: "border-color 0.25s",
          }}
        >
          {/* Image */}
          <div style={{ position: "relative", aspectRatio: featured ? "auto" : "16/10", minHeight: featured ? 340 : undefined, overflow: "hidden", background: "rgba(255,255,255,0.04)", flexShrink: 0 }}>
            {p.imageSrc && (
              <motion.div style={{ position: "absolute", inset: 0 }} animate={{ scale: hovered ? 1.05 : 1 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                <Image src={p.imageSrc} alt={p.title} fill unoptimized={p.imageSrc.startsWith("http")} style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 60vw" />
              </motion.div>
            )}
            <div style={{ position: "absolute", inset: 0, background: featured ? "linear-gradient(to right, transparent 60%, rgba(6,10,14,0.8) 100%)" : "linear-gradient(to top, rgba(6,10,14,0.55) 0%, transparent 60%)" }} />

            {p.category && (
              <div style={{ position: "absolute", top: 16, left: 16, fontSize: "9px", fontFamily: "var(--font-poppins)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: accent, background: catBg, backdropFilter: "blur(8px)", border: `1px solid ${accent.replace("0.85", "0.25")}`, padding: "3px 10px", borderRadius: "999px" }}>
                {p.category}
              </div>
            )}
          </div>

          {/* Content */}
          <div style={{ padding: featured ? "40px 44px" : "22px", display: "flex", flexDirection: "column", justifyContent: featured ? "center" : undefined, flex: 1 }}>
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 400, color: "rgba(255,255,255,0.25)", letterSpacing: "0.08em", margin: "0 0 8px" }}>{p.tag}</p>
            <h3 style={{ fontFamily: "var(--font-poppins)", fontSize: featured ? "clamp(1.6rem,3vw,2.4rem)" : "15px", fontWeight: featured ? 800 : 700, color: "rgba(255,255,255,0.9)", margin: "0 0 12px", letterSpacing: featured ? "-0.02em" : "-0.01em", lineHeight: 1.1 }}>{p.title}</h3>
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: featured ? "14px" : "12px", fontWeight: 300, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, margin: 0, flex: 1 }}>{p.description}</p>

            <motion.div
              animate={{ opacity: hovered ? 1 : 0.5, x: hovered ? 4 : 0 }}
              transition={{ duration: 0.25 }}
              style={{ marginTop: featured ? "28px" : "16px", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 600, color: accent, letterSpacing: "0.04em" }}>
                Voir le projet →
              </span>
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export function PortfolioClient({ initialProjects }: { initialProjects: Project[] }) {
  const [active, setActive] = useState("Tous");

  const shown = active === "Tous" ? initialProjects : initialProjects.filter(p => p.category === active);

  return (
    <div style={{ background: "#060a0e", minHeight: "100dvh", color: "white" }}>
      <header style={{ padding: "24px 6vw", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", fontFamily: "var(--font-poppins)", fontSize: "12px", color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>
          <ArrowLeft size={14} /> Accueil
        </Link>
        <span style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.18)" }}>Portfolio</span>
      </header>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 6vw 160px" }}>
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} style={{ marginBottom: "56px" }}>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.28em", color: "rgba(255,255,255,0.22)", marginBottom: "16px" }}>Portfolio</p>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
            <h1 style={{ fontFamily: "var(--font-poppins)", fontSize: "clamp(2.8rem,5vw,5rem)", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.025em", margin: 0 }}>Quelques réalisations.</h1>
            <Link href="/espace" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "10px", border: "1px solid rgba(60,100,255,0.3)", background: "rgba(60,100,255,0.1)", fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 600, color: "rgba(100,140,255,0.85)", textDecoration: "none" }}>
              Démarrer un projet →
            </Link>
          </div>
        </motion.div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "44px", flexWrap: "wrap" }}>
          {filters.map(f => (
            <motion.button
              key={f}
              onClick={() => setActive(f)}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "7px 16px", borderRadius: "999px", cursor: "pointer",
                border: `1px solid ${active === f ? "rgba(60,100,255,0.4)" : "rgba(255,255,255,0.08)"}`,
                background: active === f ? "rgba(60,100,255,0.15)" : "rgba(255,255,255,0.02)",
                fontFamily: "var(--font-poppins)", fontSize: "12px",
                fontWeight: active === f ? 600 : 400,
                color: active === f ? "rgba(100,140,255,0.9)" : "rgba(255,255,255,0.38)",
                transition: "all 0.18s",
              }}
            >
              {f}
              {f !== "Tous" && (
                <span style={{ marginLeft: "6px", fontSize: "10px", opacity: 0.5 }}>
                  {initialProjects.filter(p => p.category === f).length}
                </span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Grid */}
        <div className="portfolio-grid">
          <AnimatePresence mode="popLayout">
            {shown.map((p, i) => (
              <ProjectCard key={p.id} p={p} index={i} featured={i === 0} />
            ))}
          </AnimatePresence>
        </div>

        {shown.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: "13px", color: "rgba(255,255,255,0.2)" }}>Aucun projet dans cette catégorie.</p>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          style={{ marginTop: "80px", padding: "60px", borderRadius: "20px", border: "1px solid rgba(60,100,255,0.2)", background: "radial-gradient(ellipse at 60% 0%, rgba(60,100,255,0.08) 0%, transparent 70%)", textAlign: "center" }}
        >
          <h2 style={{ fontFamily: "var(--font-poppins)", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 14px" }}>Votre projet ici ?</h2>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "14px", fontWeight: 300, color: "rgba(255,255,255,0.35)", margin: "0 auto 32px", maxWidth: "400px", lineHeight: 1.7 }}>
            Décrivez votre projet depuis votre espace client, je vous réponds sous 24h.
          </p>
          <Link href="/espace" style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "14px 28px", borderRadius: "12px", border: "1px solid rgba(60,100,255,0.35)", background: "rgba(60,100,255,0.6)", fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 600, color: "white", textDecoration: "none" }}>
            Démarrer un projet →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
