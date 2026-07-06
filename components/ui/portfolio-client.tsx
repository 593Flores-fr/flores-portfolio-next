"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { CollabCTA } from "@/components/ui/collab-cta";
import { hexToRgb } from "@/lib/utils";

type Section = { id: string; name: string; color: string };
type Project = { id: string; slug: string; title: string; tag: string; description: string; imageSrc: string; section: Section | null };

function ProjectCard({ p, index, featured }: { p: Project; index: number; featured: boolean }) {
  const accent = `rgba(${hexToRgb(p.section?.color)},0.9)`;

  return (
    <motion.div
      layout
      key={p.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: index * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ gridColumn: featured ? "1 / -1" : "span 1" }}
    >
      <Link href={`/portfolio/${p.slug}`} style={{ textDecoration: "none", display: "block" }} className="portfolio-card-link">
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.05)",
            background: "#0e0c0a",
            display: featured ? "grid" : "flex",
            flexDirection: featured ? undefined : "column",
            gridTemplateColumns: featured ? "58% 1fr" : undefined,
            cursor: "pointer",
            transition: "border-color 0.3s ease",
            overflow: "hidden",
          }}
        >
          {/* Image */}
          <div style={{ position: "relative", aspectRatio: featured ? "auto" : "16/10", minHeight: featured ? 320 : undefined, overflow: "hidden", background: "rgba(255,255,255,0.02)", flexShrink: 0 }}>
            {p.imageSrc && (
              <Image
                src={p.imageSrc} alt={p.title} fill
                style={{ objectFit: "cover", transition: "transform 0.6s ease" }}
                sizes="(max-width: 768px) 100vw, 60vw"
                className="portfolio-card-img"
              />
            )}
            <div style={{ position: "absolute", inset: 0, background: featured ? "linear-gradient(to right, transparent 55%, rgba(14,12,10,0.85) 100%)" : "linear-gradient(to top, rgba(14,12,10,0.6) 0%, transparent 55%)" }} />

            {p.section?.name && (
              <div style={{ position: "absolute", top: 16, left: 16 }}>
                <span className="vto-label" style={{ fontSize: "8px", letterSpacing: "3px", color: "rgba(255,255,255,0.9)", border: `1px solid ${accent.replace("0.9", "0.35")}`, padding: "3px 10px", background: "rgba(0,0,0,0.35)" }}>
                  {p.section.name}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div style={{ padding: featured ? "44px 48px" : "24px", display: "flex", flexDirection: "column", justifyContent: featured ? "center" : undefined, flex: 1 }}>
            <p className="vto-label" style={{ fontSize: "8px", letterSpacing: "3px", color: "rgba(255,255,255,0.2)", margin: "0 0 10px" }}>{p.tag}</p>
            <h3 style={{
              fontFamily: featured ? "var(--font-six-caps), sans-serif" : "var(--font-poppins)",
              fontSize: featured ? "clamp(2rem, 3vw, 3.5rem)" : "13px",
              fontWeight: featured ? 400 : 600,
              color: "rgba(255,255,255,0.88)",
              margin: "0 0 14px",
              letterSpacing: featured ? "4px" : "0.2px",
              textTransform: featured ? "uppercase" : "none",
              lineHeight: featured ? 1.0 : 1.2,
            }}>
              {p.title}
            </h3>
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 400, color: "rgba(255,255,255,0.32)", lineHeight: 1.85, margin: 0, flex: 1 }}>
              {p.description}
            </p>

            <div style={{ marginTop: featured ? "32px" : "20px" }}>
              <span className="vto-cta-link portfolio-card-cta" style={{ color: "rgba(255,255,255,0.38)", fontSize: "8px", letterSpacing: "3px" }}>
                Voir le projet
                <span className="vto-cta-line" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function PortfolioClient({ initialProjects, sections }: { initialProjects: Project[]; sections: Section[] }) {
  const filters = ["Tous", ...sections.map(s => s.name)];
  const searchParams = useSearchParams();
  const [active, setActive] = useState(() => {
    const cat = searchParams.get("cat");
    return filters.includes(cat ?? "") ? (cat as string) : "Tous";
  });

  useEffect(() => {
    const cat = searchParams.get("cat");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (cat && filters.includes(cat)) setActive(cat);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const shown = active === "Tous" ? initialProjects : initialProjects.filter(p => p.section?.name === active);

  return (
    <div style={{ background: "#0e0c0a", minHeight: "100dvh", color: "white", paddingTop: "64px" }}>

      <div style={{ maxWidth: "1500px", margin: "0 auto", padding: "80px 4vw 160px" }}>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: "56px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}
        >
          <div>
            <p className="vto-label" style={{ marginBottom: "16px" }}>Portfolio</p>
            <h1 style={{ fontFamily: "var(--font-six-caps), sans-serif", fontSize: "clamp(3rem, 6vw, 6rem)", fontWeight: 400, lineHeight: 0.92, letterSpacing: "5px", textTransform: "uppercase", margin: 0 }}>
              Quelques réalisations.
            </h1>
          </div>
          <Link href="/espace" className="vto-cta-link vto-cta-link--primary">
            Démarrer un projet
            <span className="vto-cta-line" />
          </Link>
        </motion.div>

        {/* Filters — VTO flat tabs */}
        <div style={{ display: "flex", gap: "1px", background: "rgba(255,255,255,0.05)", marginBottom: "52px", width: "fit-content", flexWrap: "wrap" }}>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActive(f)}
              style={{
                padding: "10px 20px", cursor: "pointer", border: "none",
                background: active === f ? "rgba(92,92,245,0.12)" : "#0e0c0a",
                fontFamily: "var(--font-poppins)", fontSize: "9px", letterSpacing: "4px",
                textTransform: "uppercase",
                color: active === f ? "var(--vto-primary)" : "rgba(255,255,255,0.50)",
                transition: "all 0.2s ease",
              }}
            >
              {f}
              {f !== "Tous" && (
                <span style={{ marginLeft: "6px", opacity: 0.45 }}>
                  {initialProjects.filter(p => p.section?.name === f).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="portfolio-grid">
          <AnimatePresence mode="popLayout">
            {shown.map((p, i) => (
              <ProjectCard key={p.id} p={p} index={i} featured={i === 0 && active === "Tous"} />
            ))}
          </AnimatePresence>
        </div>

        {shown.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "80px 0" }}>
            <p className="vto-label" style={{ color: "rgba(255,255,255,0.40)" }}>Aucun projet dans cette catégorie.</p>
          </motion.div>
        )}

        {/* CTA bottom */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginTop: "100px" }}
        >
          <CollabCTA title="Votre projet ici ?" ctaLabel="Démarrer un projet" />
        </motion.div>

      </div>
    </div>
  );
}
