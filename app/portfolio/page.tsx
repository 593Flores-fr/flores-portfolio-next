"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

type Project = { id: string; slug: string; title: string; tag: string; description: string; imageSrc: string; category: string };

const filters = ["Tous", "Web", "Visuel", "Cover"];

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [active, setActive] = useState("Tous");

  useEffect(() => {
    fetch("/api/portfolio").then(r => r.json()).then(data => setProjects(data));
  }, []);

  const shown = active === "Tous" ? projects : projects.filter(p => p.category === active);

  return (
    <div style={{ background: "#060a0e", minHeight: "100dvh", color: "white" }}>
      <header style={{ padding: "24px 6vw", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", fontFamily: "var(--font-poppins)", fontSize: "12px", color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>
          <ArrowLeft size={14} /> Accueil
        </Link>
        <span style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.18)" }}>Portfolio</span>
      </header>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "80px 6vw 160px" }}>
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} style={{ marginBottom: "64px" }}>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.28em", color: "rgba(255,255,255,0.22)", marginBottom: "16px" }}>Portfolio</p>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
            <h1 style={{ fontFamily: "var(--font-poppins)", fontSize: "clamp(2.8rem,5vw,5rem)", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.025em", margin: 0 }}>Quelques réalisations.</h1>
            <Link href="/espace" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "10px", border: "1px solid rgba(60,100,255,0.3)", background: "rgba(60,100,255,0.1)", fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 600, color: "rgba(100,140,255,0.85)", textDecoration: "none" }}>
              Démarrer un projet →
            </Link>
          </div>
        </motion.div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "48px" }}>
          {filters.map(f => (
            <button key={f} onClick={() => setActive(f)} style={{ padding: "7px 16px", borderRadius: "999px", cursor: "pointer", border: `1px solid ${active === f ? "rgba(60,100,255,0.4)" : "rgba(255,255,255,0.08)"}`, background: active === f ? "rgba(60,100,255,0.15)" : "rgba(255,255,255,0.02)", fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: active === f ? 600 : 400, color: active === f ? "rgba(100,140,255,0.9)" : "rgba(255,255,255,0.38)", transition: "all 0.15s" }}>
              {f}
              {f !== "Tous" && <span style={{ marginLeft: "6px", fontSize: "10px", opacity: 0.5 }}>{projects.filter(p => p.category === f).length}</span>}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
          {shown.map((p, i) => (
            <Link key={p.id} href={`/portfolio/${p.slug}`} style={{ textDecoration: "none" }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)", display: "flex", flexDirection: "column", cursor: "pointer" }}
                whileHover={{ borderColor: "rgba(100,140,255,0.2)", y: -4 }}
              >
                {/* Image */}
                <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", background: "rgba(255,255,255,0.04)", flexShrink: 0 }}>
                  {p.imageSrc && (
                    <Image src={p.imageSrc} alt={p.title} fill style={{ objectFit: "cover", transition: "transform 0.5s ease" }} sizes="(max-width: 768px) 100vw, 50vw"
                      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  )}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(6,10,14,0.5) 0%, transparent 60%)" }} />
                </div>

                {/* Content */}
                <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <h3 style={{ fontFamily: "var(--font-poppins)", fontSize: "15px", fontWeight: 700, color: "rgba(255,255,255,0.88)", margin: 0, letterSpacing: "-0.01em" }}>{p.title}</h3>
                    {p.category && (
                      <span style={{ fontSize: "10px", fontFamily: "var(--font-poppins)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: "999px", flexShrink: 0, marginLeft: "8px" }}>
                        {p.category}
                      </span>
                    )}
                  </div>
                  <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 300, color: "rgba(255,255,255,0.3)", margin: "0 0 4px", letterSpacing: "0.02em" }}>{p.tag}</p>
                  <p style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.42)", lineHeight: 1.65, margin: "8px 0 0", flex: 1 }}>{p.description}</p>
                  <div style={{ marginTop: "14px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 500, color: "rgba(100,140,255,0.5)", letterSpacing: "0.04em" }}>Voir le projet →</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

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
