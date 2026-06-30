"use client";

import Link from "next/link";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

type HeroContent = {
  badge?: string;
  subtitle?: string;
  description?: string;
  cta1?: string;
  cta2?: string;
  graphismeImage?: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

function LineReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div style={{ overflow: "hidden", lineHeight: 1 }}>
      <motion.div
        initial={{ y: "105%" }}
        animate={{ y: 0 }}
        transition={{ delay, duration: 0.85, ease }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function HeroHome({ content }: { content?: HeroContent }) {
  const bgImg = content?.graphismeImage || "/images/about.jpg";
  const badge = content?.badge || "Disponible · Devis gratuit";
  const description = content?.description || "Identité visuelle, direction artistique & développement web — des créations qui vous ressemblent vraiment.";
  const cta1 = content?.cta1 || "Voir mes projets";
  const cta2 = content?.cta2 || "Prendre contact";

  // Liquid fill sur "Freelance." dès le premier scroll
  const { scrollY } = useScroll();
  const spring = useSpring(scrollY, { stiffness: 35, damping: 14, mass: 1 });
  const freelanceBgPos = useTransform(spring, [0, 380], ["100% 0%", "0% 0%"]);

  return (
    <section style={{ position: "relative", height: "100dvh", minHeight: "600px", background: "#0e0c0a", overflow: "hidden" }}>

      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={bgImg}
        alt=""
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center 25%",
          opacity: 0.62,
          filter: "saturate(0.75) brightness(0.65)",
        }}
      />

      {/* Overlay directionnel */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(100deg, rgba(14,12,10,0.96) 0%, rgba(14,12,10,0.80) 38%, rgba(14,12,10,0.35) 65%, rgba(14,12,10,0.10) 100%)" }} />
      {/* Fondu bas */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(14,12,10,1) 0%, transparent 28%)" }} />

      {/* ── Contenu ── */}
      <div className="hero-layout" style={{
        position: "relative", zIndex: 5,
        height: "100%",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 4vw",
        paddingTop: "64px",
        gap: "40px",
      }}>

        {/* Gauche : badge + titre + description */}
        <div style={{ display: "flex", flexDirection: "column" }}>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            style={{ marginBottom: "36px" }}
          >
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              fontFamily: "var(--font-poppins)", fontSize: "9px", fontWeight: 600,
              letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.55)",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px rgba(74,222,128,0.9)", flexShrink: 0 }} />
              {badge}
            </span>
          </motion.div>

          {/* Titre */}
          <h1 style={{
            fontFamily: "var(--font-six-caps), sans-serif",
            fontSize: "clamp(5rem, 11vw, 13rem)",
            fontWeight: 400, letterSpacing: "5px", textTransform: "uppercase",
            color: "white", margin: "0 0 48px",
            lineHeight: 0.92,
          }}>
            <LineReveal delay={0.05}>Designer</LineReveal>
            <LineReveal delay={0.15}>
              <motion.span style={{
                display: "block",
                background: "linear-gradient(to right, #5C5CF5 50%, white 50%)",
                backgroundSize: "200% 100%",
                backgroundPosition: freelanceBgPos,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }}>
                Freelance.
              </motion.span>
            </LineReveal>
          </h1>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.65, ease }}
            style={{
              borderLeft: "2px solid rgba(92,92,245,0.35)",
              paddingLeft: "16px",
            }}
          >
            <p className="hero-description" style={{
              fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 400,
              color: "rgba(255,255,255,0.68)", lineHeight: 1.85, margin: 0,
              whiteSpace: "nowrap",
            }}>
              {description}
            </p>
          </motion.div>
        </div>

        {/* Droite : CTAs empilés */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.65, ease }}
          className="hero-ctas-right"
          style={{ display: "flex", flexDirection: "column", gap: "22px", alignItems: "flex-end", flexShrink: 0 }}
        >
          <Link href="/portfolio" className="vto-cta-link vto-cta-link--accent">
            {cta1}
            <span className="vto-cta-line" />
          </Link>
          <Link href="/espace" className="vto-cta-link">
            {cta2}
            <span className="vto-cta-line" />
          </Link>
        </motion.div>

      </div>

      {/* Scroll hint — absolue en bas */}
      <div style={{
        position: "absolute", bottom: "28px", left: "4vw", zIndex: 5,
        display: "flex", alignItems: "center", gap: "16px",
      }}>
        <motion.div
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
          style={{ transformOrigin: "top" }}
          transition={{ delay: 0.7, duration: 0.6, ease }}
        >
          <div style={{ width: "1px", height: "32px", background: "rgba(255,255,255,0.15)" }} />
        </motion.div>
        <motion.span
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.5 }}
          className="vto-label"
          style={{ fontSize: "7px", letterSpacing: "4px", color: "rgba(255,255,255,0.25)" }}
        >
          Scroll pour découvrir
        </motion.span>
      </div>

    </section>
  );
}
