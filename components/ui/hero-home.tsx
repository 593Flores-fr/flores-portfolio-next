"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { HeroCtaPanel } from "./hero-cta-panel";
import { SITE_DEFAULTS } from "@/lib/site-content";
import type { SiteContentMap } from "@/lib/site-content";

declare global {
  interface Window {
    UnicornStudio?: {
      addScene: (config: {
        elementId: string;
        projectId: string;
        production: boolean;
        scale?: number;
        dpi?: number;
        fps?: number;
      }) => Promise<unknown>;
      destroy?: () => void;
    };
  }
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: {
      delay: i * 0.09,
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

function UnicornPanel({ projectId }: { projectId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const id = `unicorn-${projectId}`;
    el.id = id;
    const tryInit = () => {
      if (window.UnicornStudio?.addScene) {
        window.UnicornStudio.addScene({ elementId: id, projectId, production: true, scale: 1, dpi: 1.5, fps: 60 });
      } else {
        setTimeout(tryInit, 100);
      }
    };
    tryInit();
    return () => { window.UnicornStudio?.destroy?.(); };
  }, [projectId]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}

export function HeroHome({ content = SITE_DEFAULTS.hero }: { content?: SiteContentMap["hero"] }) {
  const showAuth = true;

  return (
    // Section sans overflow:hidden — permet au panel d'être positionné librement
    <section style={{ position: "relative", height: "100dvh", background: "#060a0e" }}>

      {/* ── Wrapper contenant l'animation + effets — overflow:hidden ici seulement ── */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>

        {/* SVG clipPath */}
        <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
          <defs>
            <clipPath id="curveLeft" clipPathUnits="objectBoundingBox">
              <path d="M 0,0 L 0.35,0 C 0.40,0.07 0.43,0.17 0.41,0.30 C 0.38,0.42 0.33,0.46 0.36,0.56 C 0.39,0.67 0.43,0.74 0.41,0.84 C 0.38,0.93 0.34,0.97 0.34,1 L 0,1 Z" />
            </clipPath>
          </defs>
        </svg>

        {/* Animation plein écran */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ position: "absolute", inset: 0, zIndex: 1 }}
        >
          <UnicornPanel projectId="ed7SJMvTJEVxfqzypOOQ" />
        </motion.div>

        {/* Blur gauche */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, clipPath: "url(#curveLeft)", backdropFilter: "blur(28px) brightness(0.65)", WebkitBackdropFilter: "blur(28px) brightness(0.65)", background: "rgba(6,10,14,0.18)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 3, clipPath: "url(#curveLeft)", background: "linear-gradient(to right, rgba(6,10,14,0.45) 0%, rgba(6,10,14,0.05) 70%, transparent 100%)", pointerEvents: "none" }} />

        {/* Trait courbe */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 4, pointerEvents: "none" }} viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <path d="M 350,0 C 400,70 430,170 410,300 C 380,420 330,460 360,560 C 390,670 430,740 410,840 C 380,930 340,970 340,1000" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
        </svg>

        {/* Fondu bas */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "220px", background: "linear-gradient(to bottom, transparent 0%, #060a0e 100%)", pointerEvents: "none", zIndex: 6 }} />
      </div>

      {/* ── Texte gauche ── */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "38%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 3vw 0 6vw", zIndex: 10 }}>

        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show" style={{ marginBottom: "2rem" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-poppins)", fontWeight: 500 }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px rgba(74,222,128,0.9)", flexShrink: 0 }} />
            {content.badge}
          </span>
        </motion.div>

        <motion.p custom={1} variants={fadeUp} initial="hidden" animate="show" style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.28em", color: "rgba(255,255,255,0.25)", fontWeight: 300, marginBottom: "8px" }}>
          {content.subtitle}
        </motion.p>

        <motion.h1 custom={2} variants={fadeUp} initial="hidden" animate="show" style={{ fontFamily: "var(--font-six-caps), sans-serif", fontSize: "clamp(7rem, 13vw, 14rem)", fontWeight: 400, lineHeight: 0.92, letterSpacing: "0.05em", color: "white", marginBottom: "1.8rem", textTransform: "uppercase" }}>
          Flores
        </motion.h1>

        <motion.p custom={3} variants={fadeUp} initial="hidden" animate="show" style={{ fontFamily: "var(--font-poppins)", fontSize: "14px", color: "rgba(255,255,255,0.38)", fontWeight: 300, lineHeight: 1.9, maxWidth: "340px", marginBottom: "2.5rem" }}>
          {content.description}
        </motion.p>

        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show" style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "3rem" }}>
          <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "12px 24px", borderRadius: "999px", background: "white", color: "black", fontSize: "12px", fontWeight: 600, fontFamily: "var(--font-poppins)", letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none" }}>
            {content.cta1}
            <span style={{ width: "22px", height: "22px", borderRadius: "50%", background: "rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 7.5L7.5 1.5M7.5 1.5H2.5M7.5 1.5V6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          </Link>
          <Link href="/portfolio" style={{ display: "inline-flex", alignItems: "center", padding: "12px 24px", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)", fontSize: "12px", fontWeight: 500, fontFamily: "var(--font-poppins)", letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none" }}>
            {content.cta2}
          </Link>
        </motion.div>

        {/* Ticker logos clients */}
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="show" style={{ paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", color: "rgba(255,255,255,0.18)", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "14px", fontWeight: 300 }}>
            Ils m&rsquo;ont fait confiance
          </p>
          <div style={{ overflow: "hidden", maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)" }}>
            <div className="logo-ticker" style={{ display: "flex", gap: "32px", width: "max-content" }}>
              {[...Array(2)].flatMap((_, d) =>
                ["client-01.png","client-02.png","client-03.png","client-04.png","client-05.png","client-06.png","client-07.png","client-08.png"].map((img, i) => (
                  <div key={`${d}-${i}`} style={{ width: "160px", height: "84px", flexShrink: 0, opacity: 0.9, filter: "brightness(0) invert(1)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/images/${img}`} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>

        <style>{`
          @keyframes logo-ticker-scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .logo-ticker { animation: logo-ticker-scroll 20s linear infinite; }
          .logo-ticker:hover { animation-play-state: paused; }
        `}</style>
      </div>

      {/* ── CTA panel — centré verticalement dans la zone droite ── */}
      {showAuth && (
        <div style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "70%",
          width: "380px",
          display: "flex",
          alignItems: "center",
          zIndex: 20,
        }}>
          <HeroCtaPanel />
        </div>
      )}

    </section>
  );
}
