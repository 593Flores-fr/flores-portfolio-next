"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowLeft, ExternalLink, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { toBlockArray, resolveVideoEmbed, type PortfolioBlock, type TextImageBlock } from "@/lib/portfolio-blocks";

type Project = {
  id: string; slug: string; title: string; tag: string;
  description: string; imageSrc: string; logoSrc?: string | null; section?: { name: string } | null; year: string;
  client: string; fullDescription: string; challenge: string;
  images: unknown; mockupImages: unknown; blocks?: unknown; tools: unknown; externalLink: string | null; discordUrl?: string | null; accentColor: string;
};

function DiscordIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.114 18.1.128 18.116a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
    </svg>
  );
}

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

function TextBlockView({ title, text }: { title?: string; text: string }) {
  return (
    <div style={{ maxWidth: "760px" }}>
      {title && (
        <h3 style={{ fontFamily: "var(--font-six-caps)", fontSize: "clamp(1.8rem,2.6vw,2.6rem)", letterSpacing: "3px", textTransform: "uppercase", color: "white", margin: "0 0 20px", lineHeight: 1.05 }}>
          {title}
        </h3>
      )}
      <p style={{ fontSize: "15px", fontWeight: 300, color: "rgba(255,255,255,0.6)", lineHeight: 1.9, margin: 0, whiteSpace: "pre-line" }}>
        {text}
      </p>
    </div>
  );
}

function TextImageBlockView({ block, projectTitle }: { block: TextImageBlock; projectTitle: string }) {
  const imageFirst = block.imagePosition === "left";
  const format = block.imageFormat ?? "standard";

  // Bannière : texte au-dessus, image pleine largeur en dessous
  if (format === "banniere") {
    return (
      <div>
        {(block.title || block.text) && (
          <div style={{ maxWidth: "760px", marginBottom: "36px" }}>
            {block.title && (
              <h3 style={{ fontFamily: "var(--font-six-caps)", fontSize: "clamp(1.8rem,2.6vw,2.6rem)", letterSpacing: "3px", textTransform: "uppercase", color: "white", margin: "0 0 20px", lineHeight: 1.05 }}>
                {block.title}
              </h3>
            )}
            {block.text && (
              <p style={{ fontSize: "15px", fontWeight: 300, color: "rgba(255,255,255,0.6)", lineHeight: 1.9, margin: 0, whiteSpace: "pre-line" }}>
                {block.text}
              </p>
            )}
          </div>
        )}
        <div style={{ position: "relative", aspectRatio: "21/9", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }}>
          {block.image && (
            <Image src={block.image} alt={block.title || projectTitle} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 1200px" />
          )}
        </div>
      </div>
    );
  }

  const aspect = format === "carre" ? "1/1" : format === "large" ? "16/9" : "4/3";
  return (
    <div className="pd-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "56px", alignItems: "center" }}>
      <div className="pd-split-text" style={{ order: imageFirst ? 2 : 1 }}>
        {block.title && (
          <h3 style={{ fontFamily: "var(--font-six-caps)", fontSize: "clamp(1.8rem,2.6vw,2.6rem)", letterSpacing: "3px", textTransform: "uppercase", color: "white", margin: "0 0 20px", lineHeight: 1.05 }}>
            {block.title}
          </h3>
        )}
        <p style={{ fontSize: "15px", fontWeight: 300, color: "rgba(255,255,255,0.6)", lineHeight: 1.9, margin: 0, whiteSpace: "pre-line" }}>
          {block.text}
        </p>
      </div>
      <div className={format === "standard" ? "pd-split-image" : "pd-split-image pd-split-image--fixed"} style={{ order: imageFirst ? 1 : 2, position: "relative", aspectRatio: aspect, borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }}>
        {block.image && (
          <Image src={block.image} alt={block.title || projectTitle} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 50vw" />
        )}
      </div>
    </div>
  );
}

function CarouselBlockView({ images, title, accentRgb }: { images: string[]; title: string; accentRgb: string }) {
  const [index, setIndex] = useState(0);
  if (images.length === 0) return null;
  return (
    <div>
      <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", aspectRatio: "16/9", background: "rgba(255,255,255,0.03)" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            style={{ position: "absolute", inset: 0 }}
          >
            <Image src={images[index]} alt={`${title} — ${index + 1}`} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 1100px" />
          </motion.div>
        </AnimatePresence>
        {images.length > 1 && (
          <>
            <button
              onClick={() => setIndex(i => (i - 1 + images.length) % images.length)}
              aria-label="Image précédente"
              style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: "38px", height: "38px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(6,10,14,0.6)", backdropFilter: "blur(6px)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}
            >
              <ChevronLeft size={18} color="white" />
            </button>
            <button
              onClick={() => setIndex(i => (i + 1) % images.length)}
              aria-label="Image suivante"
              style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", width: "38px", height: "38px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(6,10,14,0.6)", backdropFilter: "blur(6px)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}
            >
              <ChevronRight size={18} color="white" />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginTop: "16px" }}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Aller à l'image ${i + 1}`}
              style={{ width: i === index ? "20px" : "6px", height: "6px", borderRadius: "3px", border: "none", cursor: "pointer", background: i === index ? `rgba(${accentRgb},0.9)` : "rgba(255,255,255,0.15)", transition: "all 0.25s ease" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function VideoBlockView({ url, caption }: { url: string; caption?: string }) {
  if (!url) return null;
  const embed = resolveVideoEmbed(url);
  return (
    <div>
      <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", aspectRatio: "16/9", background: "#000" }}>
        {embed ? (
          <iframe
            src={embed}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
          />
        ) : (
          <video src={url} controls style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }} />
        )}
      </div>
      {caption && (
        <p style={{ fontSize: "var(--fs-base)", color: "rgba(255,255,255,0.5)", marginTop: "14px", textAlign: "center" }}>{caption}</p>
      )}
    </div>
  );
}

function StatsBlockView({ items, accentRgb }: { items: { value: string; label: string }[]; accentRgb: string }) {
  if (items.length === 0) return null;
  return (
    <div className="pd-stats-grid" style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(items.length, 4)}, 1fr)`, gap: "1px", background: "rgba(255,255,255,0.06)" }}>
      {items.map((it, i) => (
        <div key={i} style={{ padding: "36px 20px", background: "#060a0e", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-six-caps)", fontSize: "clamp(2.2rem,3.5vw,3.5rem)", color: `rgba(${accentRgb},0.9)`, margin: "0 0 8px", letterSpacing: "2px", lineHeight: 1 }}>
            {it.value}
          </p>
          <p style={{ fontSize: "var(--fs-sm)", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)", margin: 0 }}>
            {it.label}
          </p>
        </div>
      ))}
    </div>
  );
}

function BlockView({ block, projectTitle, accentRgb }: { block: PortfolioBlock; projectTitle: string; accentRgb: string }) {
  switch (block.type) {
    case "text": return <TextBlockView title={block.title} text={block.text} />;
    case "textImage": return <TextImageBlockView block={block} projectTitle={projectTitle} />;
    case "carousel": return <CarouselBlockView images={block.images} title={projectTitle} accentRgb={accentRgb} />;
    case "video": return <VideoBlockView url={block.url} caption={block.caption} />;
    case "stats": return <StatsBlockView items={block.items} accentRgb={accentRgb} />;
    default: return null;
  }
}

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
  const mockupImages = toStringArray(project.mockupImages);
  const tools = toStringArray(project.tools);
  const blocks = toBlockArray(project.blocks);

  return (
    <div style={{ background: "#060a0e", minHeight: "100dvh", color: "white", fontFamily: "var(--font-poppins)" }}>

      {/* ── Nav secondaire — sous la navbar globale (64px) ── */}
      <nav style={{
        position: "fixed", top: "64px", left: 0, right: 0, zIndex: 40,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 6vw",
        background: "linear-gradient(to bottom, rgba(6,10,14,0.75) 0%, transparent 100%)",
      }}>
        <Link href="/portfolio" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", fontFamily: "var(--font-poppins)", fontSize: "var(--fs-md)", fontWeight: 500, color: "rgba(255,255,255,0.55)" }}>
          <ArrowLeft size={14} /> Portfolio
        </Link>
        {project.externalLink && (
          <a href={project.externalLink} target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: "6px", textDecoration: "none", fontFamily: "var(--font-poppins)", fontSize: "var(--fs-base)", fontWeight: 500, color: `rgba(${accentRgb},0.7)` }}>
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
            {/* Logo */}
            {project.logoSrc && (
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: "relative", height: "56px", width: "180px", marginBottom: "24px" }}
              >
                <Image src={project.logoSrc} alt={`Logo ${project.title}`} fill style={{ objectFit: "contain", objectPosition: "left" }} />
              </motion.div>
            )}

            {/* Category + year */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}
            >
              {project.section?.name && (
                <span style={{
                  fontSize: "var(--fs-sm)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em",
                  color: `rgba(${accentRgb},0.9)`, border: `1px solid rgba(${accentRgb},0.3)`,
                  background: `rgba(${accentRgb},0.08)`, padding: "4px 12px", borderRadius: "999px",
                }}>
                  {project.section.name}
                </span>
              )}
              {project.year && (
                <span style={{ fontSize: "var(--fs-base)", color: "rgba(255,255,255,0.45)", fontWeight: 300 }}>{project.year}</span>
              )}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="pd-title"
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
              style={{ fontSize: "14px", fontWeight: 300, color: "rgba(255,255,255,0.55)", maxWidth: "560px", lineHeight: 1.7, margin: 0 }}
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
          <span style={{ fontSize: "var(--fs-xs)", textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.35)", writingMode: "vertical-rl" }}>Scroll</span>
        </motion.div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "100px 6vw 160px" }}>

        {/* Overview — description + meta */}
        <div className="pd-overview" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "80px", marginBottom: "120px", alignItems: "start" }}>

          {/* Left: full description */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            <p style={{ fontSize: "var(--fs-base)", textTransform: "uppercase", letterSpacing: "0.25em", color: `rgba(${accentRgb},0.6)`, marginBottom: "20px" }}>
              Présentation
            </p>
            <p style={{ fontSize: "16px", fontWeight: 300, color: "rgba(255,255,255,0.65)", lineHeight: 1.9, margin: 0, whiteSpace: "pre-line" }}>
              {project.fullDescription || project.description}
            </p>
          </motion.div>

          {/* Right: meta card */}
          <motion.div
            variants={fadeUp} custom={1} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="pd-meta"
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
              project.section?.name ? { label: "Catégorie", value: project.section.name } : null,
              project.tag ? { label: "Type", value: project.tag } : null,
            ].filter(Boolean).map((row, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "12px 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none", gap: "16px" }}>
                <span style={{ fontSize: "var(--fs-sm)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.55)", flexShrink: 0 }}>{row!.label}</span>
                <span style={{ fontSize: "var(--fs-md)", fontWeight: 400, color: "rgba(255,255,255,0.62)", textAlign: "right", lineHeight: 1.5 }}>{row!.value}</span>
              </div>
            ))}
            {tools.length > 0 && (
              <div style={{ paddingTop: "16px" }}>
                <span style={{ fontSize: "var(--fs-sm)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.55)", display: "block", marginBottom: "10px" }}>Outils</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {tools.map(t => (
                    <span key={t} style={{ fontSize: "var(--fs-sm)", padding: "3px 10px", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.55)" }}>{t}</span>
                  ))}
                </div>
              </div>
            )}
            {project.externalLink && (
              <a href={project.externalLink} target="_blank" rel="noopener noreferrer" style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                marginTop: "20px", padding: "11px 18px", borderRadius: "12px",
                border: `1px solid rgba(${accentRgb},0.3)`, background: `rgba(${accentRgb},0.1)`,
                fontFamily: "var(--font-poppins)", fontSize: "var(--fs-md)", fontWeight: 600,
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
            <p style={{ fontSize: "var(--fs-base)", textTransform: "uppercase", letterSpacing: "0.25em", color: `rgba(${accentRgb},0.6)`, marginBottom: "24px" }}>
              Enjeu & Brief
            </p>
            <div className="pd-challenge" style={{ padding: "48px", borderRadius: "20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: `rgba(${accentRgb},0.6)`, borderRadius: "4px 0 0 4px" }} />
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "18px", fontWeight: 300, color: "rgba(255,255,255,0.6)", lineHeight: 1.85, margin: 0, fontStyle: "italic", whiteSpace: "pre-line" }}>
                &ldquo;{project.challenge}&rdquo;
              </p>
            </div>
          </motion.div>
        )}

        {/* Blocs de présentation */}
        {blocks.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "120px", marginBottom: "120px" }}>
            {blocks.map((block, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
                <BlockView block={block} projectTitle={project.title} accentRgb={accentRgb} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Gallery */}
        {images.length > 0 && (
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} style={{ marginBottom: "120px" }}>
            <p style={{ fontSize: "var(--fs-base)", textTransform: "uppercase", letterSpacing: "0.25em", color: `rgba(${accentRgb},0.6)`, marginBottom: "28px" }}>
              Visuels
            </p>
            <div className="pd-gallery" style={{ display: "grid", gridTemplateColumns: images.length === 1 ? "1fr" : images.length === 2 ? "1fr 1fr" : "repeat(auto-fit, minmax(340px, 1fr))", gap: "16px" }}>
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

        {/* Mockup browser frames */}
        {mockupImages.length > 0 && (
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} style={{ marginBottom: "120px" }}>
            <p style={{ fontSize: "var(--fs-base)", textTransform: "uppercase", letterSpacing: "0.25em", color: `rgba(${accentRgb},0.6)`, marginBottom: "28px" }}>
              Interface & aperçu
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
              {mockupImages.map((src, i) => (
                <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
                  {/* Browser chrome */}
                  <div style={{ borderRadius: "14px", border: "1px solid rgba(255,255,255,0.09)", overflow: "hidden", boxShadow: `0 40px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(${accentRgb},0.06)` }}>
                    <div style={{ padding: "10px 16px", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ display: "flex", gap: "5px", flexShrink: 0 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,97,97,0.5)" }} />
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,200,97,0.5)" }} />
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(97,205,97,0.5)" }} />
                      </div>
                      <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: "6px", padding: "4px 12px", fontSize: "var(--fs-sm)", color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-poppins)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {project.externalLink ? project.externalLink.replace(/^https?:\/\//, "") : project.slug + ".fr"}
                      </div>
                    </div>
                    <div style={{ position: "relative", overflow: "hidden", lineHeight: 0 }}>
                      <Image
                        src={src}
                        alt={`${project.title} — aperçu ${i + 1}`}
                        width={1600}
                        height={900}
                        style={{ width: "100%", height: "auto", display: "block" }}
                        sizes="100vw"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Discord CTA */}
        {project.discordUrl && (
          <motion.a
            href={project.discordUrl} target="_blank" rel="noopener noreferrer"
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px",
              padding: "36px 44px", marginBottom: "120px", borderRadius: "20px", textDecoration: "none",
              border: "1px solid rgba(88,101,242,0.25)",
              background: "linear-gradient(135deg, rgba(88,101,242,0.10) 0%, rgba(6,10,14,0) 100%)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
              <div style={{
                width: "52px", height: "52px", borderRadius: "14px", flexShrink: 0,
                background: "rgba(88,101,242,0.15)", border: "1px solid rgba(88,101,242,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(120,138,255,0.95)",
              }}>
                <DiscordIcon size={26} />
              </div>
              <div>
                <p style={{ fontSize: "15px", fontWeight: 700, color: "white", margin: "0 0 4px" }}>
                  Rejoindre la communauté {project.title}
                </p>
                <p style={{ fontSize: "var(--fs-md)", fontWeight: 300, color: "rgba(255,255,255,0.5)", margin: 0 }}>
                  Échangez avec les membres et suivez les actualités du projet sur Discord.
                </p>
              </div>
            </div>
            <span style={{
              display: "flex", alignItems: "center", gap: "8px", flexShrink: 0,
              padding: "12px 22px", borderRadius: "12px",
              border: "1px solid rgba(88,101,242,0.4)", background: "rgba(88,101,242,0.85)",
              fontFamily: "var(--font-poppins)", fontSize: "var(--fs-md)", fontWeight: 600, color: "white",
            }}>
              Rejoindre le serveur <ArrowRight size={14} />
            </span>
          </motion.a>
        )}

        {/* Separator + CTA */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "24px", paddingTop: "60px", borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <Link href="/portfolio" style={{
            display: "flex", alignItems: "center", gap: "8px", textDecoration: "none",
            fontFamily: "var(--font-poppins)", fontSize: "var(--fs-md)", fontWeight: 500,
            color: "rgba(255,255,255,0.45)",
          }}>
            <ArrowLeft size={13} /> Retour au portfolio
          </Link>

          <Link href="/espace" style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            padding: "13px 26px", borderRadius: "12px",
            border: `1px solid rgba(${accentRgb},0.35)`,
            background: `rgba(${accentRgb},0.12)`,
            fontFamily: "var(--font-poppins)", fontSize: "var(--fs-lg)", fontWeight: 600,
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
