"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { ArrowLeft, ExternalLink, ArrowRight } from "lucide-react";

type Project = {
  id: string; slug: string; title: string; tag: string;
  description: string; imageSrc: string; category: string; year: string;
  client: string; fullDescription: string; challenge: string;
  images: unknown; tools: unknown; externalLink: string | null; accentColor: string;
};

function resolveAccent(color?: string) {
  if (!color) return "rgba(60,100,255,1)";
  if (color.startsWith("#")) return color;
  return color || "rgba(60,100,255,1)";
}

function toStringArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.filter((x): x is string => typeof x === "string");
  return [];
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }),
};

export default function PortfolioDetail({ project }: { project: Project }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const yImg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const accent = resolveAccent(project.accentColor);
  const accentRgb = accent.startsWith("#")
    ? parseInt(accent.slice(1, 3), 16) + "," + parseInt(accent.slice(3, 5), 16) + "," + parseInt(accent.slice(5, 7), 16)
    : "60,100,255";

  const images = toStringArray(project.images);
  const tools = toStringArray(project.tools);

  return (
    <div style={{ background: "#060a0e", minHeight: "100dvh", color: "white", fontFamily: "var(--font-poppins)" }}>

      {/* ── Nav ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 6vw",
        background: "linear-gradient(to bottom, rgba(6,10,14,0.9) 0%, transparent 100%)",
      }}>
        <Link href="/portfolio" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,0.45)" }}>
          <ArrowLeft size={14} /> Portfolio
        </Link>
        {project.externalLink && (
          <a href={project.externalLink} target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: "6px", textDecoration: "none", fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 500, color: `rgba(${accentRgb},0.7)` }}>
            Voir le projet <ExternalLink size={12} />
          </a>
        )}
      </nav>

      {/* ── Hero ── */}
      <div ref={heroRef} style={{ position: "relative", height: "100dvh", overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
        {/* Background image with parallax */}
        {project.imageSrc && (
          <motion.div style={{ position: "absolute", inset: "-20%", y: yImg }}>
            <Image src={project.imageSrc} alt={project.title} fill style={{ objectFit: "cover" }} priority sizes="100vw" />
          </motion.div>
        )}
        {/* Gradient overlays */}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, #060a0e 0%, rgba(6,10,14,0.55) 50%, rgba(6,10,14,0.2) 100%)` }} />
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 20% 80%, rgba(${accentRgb},0.12) 0%, transparent 60%)` }} />

        {/* Hero content */}
        <motion.div style={{ position: "relative", zIndex: 2, padding: "0 6vw 80px", width: "100%", opacity: opacityHero }}>
          <div style={{ maxWidth: "900px" }}>
            {/* Category + year */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}
            >
              {project.category && (
                <span style={{
                  fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em",
                  color: `rgba(${accentRgb},0.9)`, border: `1px solid rgba(${accentRgb},0.3)`,
                  background: `rgba(${accentRgb},0.08)`, padding: "4px 12px", borderRadius: "999px",
                }}>
                  {project.category}
                </span>
              )}
              {project.year && (
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontWeight: 300 }}>{project.year}</span>
              )}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              style={{
                fontFamily: "var(--font-six-caps)", fontSize: "clamp(5rem,14vw,14rem)",
                fontWeight: 400, lineHeight: 0.88, letterSpacing: "0.04em",
                color: "white", margin: "0 0 24px",
                textTransform: "uppercase",
              }}
            >
              {project.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              style={{ fontSize: "14px", fontWeight: 300, color: "rgba(255,255,255,0.45)", maxWidth: "560px", lineHeight: 1.7, margin: 0 }}
            >
              {project.description}
            </motion.p>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          style={{ position: "absolute", bottom: "28px", right: "6vw", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: "1px", height: "32px", background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.3))" }}
          />
          <span style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)", writingMode: "vertical-rl" }}>Scroll</span>
        </motion.div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "100px 6vw 160px" }}>

        {/* Overview — description + meta */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "80px", marginBottom: "120px", alignItems: "start" }}>

          {/* Left: full description */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.25em", color: `rgba(${accentRgb},0.6)`, marginBottom: "20px" }}>
              Présentation
            </p>
            <p style={{ fontSize: "16px", fontWeight: 300, color: "rgba(255,255,255,0.65)", lineHeight: 1.9, margin: 0, whiteSpace: "pre-line" }}>
              {project.fullDescription || project.description}
            </p>
          </motion.div>

          {/* Right: meta card */}
          <motion.div
            variants={fadeUp} custom={1} initial="hidden" whileInView="show" viewport={{ once: true }}
            style={{
              padding: "28px", borderRadius: "20px",
              border: `1px solid rgba(${accentRgb},0.12)`,
              background: `linear-gradient(135deg, rgba(${accentRgb},0.04) 0%, rgba(6,10,14,0) 100%)`,
              position: "sticky", top: "100px",
            }}
          >
            {[
              { label: "Projet", value: project.title },
              project.client ? { label: "Client", value: project.client } : null,
              project.year ? { label: "Année", value: project.year } : null,
              project.category ? { label: "Catégorie", value: project.category } : null,
              project.tag ? { label: "Type", value: project.tag } : null,
            ].filter(Boolean).map((row, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "12px 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none", gap: "16px" }}>
                <span style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.22)", flexShrink: 0 }}>{row!.label}</span>
                <span style={{ fontSize: "12px", fontWeight: 400, color: "rgba(255,255,255,0.62)", textAlign: "right", lineHeight: 1.5 }}>{row!.value}</span>
              </div>
            ))}
            {tools.length > 0 && (
              <div style={{ paddingTop: "16px" }}>
                <span style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.22)", display: "block", marginBottom: "10px" }}>Outils</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {tools.map(t => (
                    <span key={t} style={{ fontSize: "10px", padding: "3px 10px", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.45)" }}>{t}</span>
                  ))}
                </div>
              </div>
            )}
            {project.externalLink && (
              <a href={project.externalLink} target="_blank" rel="noopener noreferrer" style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                marginTop: "20px", padding: "11px 18px", borderRadius: "12px",
                border: `1px solid rgba(${accentRgb},0.3)`, background: `rgba(${accentRgb},0.1)`,
                fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 600,
                color: `rgba(${accentRgb},0.9)`, textDecoration: "none",
              }}>
                Voir le projet <ExternalLink size={13} />
              </a>
            )}
          </motion.div>
        </div>

        {/* Challenge / Brief */}
        {project.challenge && (
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            style={{ marginBottom: "120px" }}
          >
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.25em", color: `rgba(${accentRgb},0.6)`, marginBottom: "24px" }}>
              Enjeu & Brief
            </p>
            <div style={{ padding: "48px", borderRadius: "20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: `rgba(${accentRgb},0.6)`, borderRadius: "4px 0 0 4px" }} />
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "18px", fontWeight: 300, color: "rgba(255,255,255,0.6)", lineHeight: 1.85, margin: 0, fontStyle: "italic", whiteSpace: "pre-line" }}>
                &ldquo;{project.challenge}&rdquo;
              </p>
            </div>
          </motion.div>
        )}

        {/* Gallery */}
        {images.length > 0 && (
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} style={{ marginBottom: "120px" }}>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.25em", color: `rgba(${accentRgb},0.6)`, marginBottom: "28px" }}>
              Visuels
            </p>
            <div style={{ display: "grid", gridTemplateColumns: images.length === 1 ? "1fr" : images.length === 2 ? "1fr 1fr" : "repeat(auto-fit, minmax(340px, 1fr))", gap: "16px" }}>
              {images.map((src, i) => (
                <motion.div
                  key={i}
                  custom={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                  style={{
                    position: "relative", borderRadius: "16px", overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.07)",
                    aspectRatio: i === 0 && images.length >= 3 ? "16/9" : images.length === 1 ? "16/7" : "4/3",
                    background: "rgba(255,255,255,0.03)",
                    ...(i === 0 && images.length >= 3 ? { gridColumn: "1 / -1" } : {}),
                  }}
                >
                  <Image src={src} alt={`${project.title} — visuel ${i + 1}`} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 50vw" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Separator + CTA */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "24px", paddingTop: "60px", borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <Link href="/portfolio" style={{
            display: "flex", alignItems: "center", gap: "8px", textDecoration: "none",
            fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 500,
            color: "rgba(255,255,255,0.3)",
          }}>
            <ArrowLeft size={13} /> Retour au portfolio
          </Link>

          <Link href="/espace" style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            padding: "13px 26px", borderRadius: "12px",
            border: `1px solid rgba(${accentRgb},0.35)`,
            background: `rgba(${accentRgb},0.12)`,
            fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 600,
            color: `rgba(${accentRgb === "60,100,255" ? "100,140,255" : accentRgb},0.95)`,
            textDecoration: "none",
          }}>
            Démarrer un projet similaire <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
