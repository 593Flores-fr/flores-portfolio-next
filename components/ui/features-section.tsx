"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";
import {
  Palette,
  Globe,
  Music,
  Printer,
  Users,
  Sparkles,
} from "lucide-react";
import { SITE_DEFAULTS } from "@/lib/site-content";
import type { SiteContentMap } from "@/lib/site-content";

// ── Types ─────────────────────────────────────────────────────────────────────

type Feature = {
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const ICONS = [Palette, Sparkles, Globe, Music, Printer, Users];

// ── Grid pattern ──────────────────────────────────────────────────────────────

function GridPattern({
  width,
  height,
  x,
  y,
  squares,
  ...props
}: React.ComponentProps<"svg"> & {
  width: number;
  height: number;
  x: string;
  y: string;
  squares?: number[][];
}) {
  const patternId = React.useId();
  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern id={patternId} width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}>
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${patternId})`} />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([sx, sy], i) => (
            <rect strokeWidth="0" key={i} width={width + 1} height={height + 1} x={sx * width} y={sy * height} />
          ))}
        </svg>
      )}
    </svg>
  );
}

function genDeterministicPattern(seed: string, length = 5): number[][] {
  // Hash stable basé sur le titre — identique serveur/client
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash = hash & hash;
  }
  return Array.from({ length }, (_, i) => [
    (Math.abs(hash * (i + 3)) % 4) + 7,
    (Math.abs(hash * (i + 7)) % 6) + 1,
  ]);
}

// ── Feature Card ──────────────────────────────────────────────────────────────

function FeatureCard({ feature, className, style }: { feature: Feature; className?: string; style?: React.CSSProperties }) {
  const squares = React.useMemo(() => genDeterministicPattern(feature.title), [feature.title]);

  return (
    <div
      className={cn("relative overflow-hidden p-7 cursor-default transition-colors duration-300 hover:bg-white/[0.04]", className)}
      style={{
        borderTop: "1px solid rgba(255,255,255,0.07)",
        borderRight: "1px solid rgba(255,255,255,0.07)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        borderLeft: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(255,255,255,0.02)",
        ...style,
      }}
    >
      {/* Grid pattern background */}
      <div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full"
        style={{ maskImage: "linear-gradient(white, transparent)" }}>
        <div className="absolute inset-0 opacity-100"
          style={{
            background: "linear-gradient(to right, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
            maskImage: "radial-gradient(farthest-side at top, white, transparent)",
          }}>
          <GridPattern
            width={20} height={20} x="-12" y="4"
            squares={squares}
            className="absolute inset-0 h-full w-full"
            style={{
              fill: "rgba(255,255,255,0.04)",
              stroke: "rgba(255,255,255,0.12)",
              mixBlendMode: "overlay",
            }}
          />
        </div>
      </div>

      {/* Icon */}
      <motion.div whileHover={{ scale: 1.15 }} transition={{ duration: 0.2 }} style={{ display: "inline-block" }}>
        <feature.icon
          className="text-white/50"
          style={{ width: "22px", height: "22px", strokeWidth: 1 }}
          aria-hidden
        />
      </motion.div>

      {/* Content */}
      <h3 style={{
        fontFamily: "var(--font-poppins)",
        fontSize: "14px",
        fontWeight: 600,
        color: "rgba(255,255,255,0.85)",
        marginTop: "40px",
        marginBottom: "8px",
        letterSpacing: "0.01em",
      }}>
        {feature.title}
      </h3>
      <p style={{
        fontFamily: "var(--font-poppins)",
        fontSize: "12px",
        fontWeight: 300,
        color: "rgba(255,255,255,0.35)",
        lineHeight: 1.75,
      }}>
        {feature.description}
      </p>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export function FeaturesSection({ content = SITE_DEFAULTS.features }: { content?: SiteContentMap["features"] }) {
  const features: Feature[] = content.items.map((item, i) => ({
    ...item,
    icon: ICONS[i] ?? Palette,
  }));

  return (
    <section style={{ background: "#060a0e", padding: "120px 0 140px" }}>
      <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 6vw" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: "64px" }}
        >
          <p style={{
            fontFamily: "var(--font-poppins)", fontSize: "11px",
            textTransform: "uppercase", letterSpacing: "0.28em",
            color: "rgba(255,255,255,0.25)", fontWeight: 300, marginBottom: "20px",
          }}>
            {content.eyebrow}
          </p>
          <h2 style={{
            fontFamily: "var(--font-poppins)",
            fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
            fontWeight: 800, lineHeight: 1.05,
            letterSpacing: "-0.02em", color: "white",
            marginBottom: "16px",
          }}>
            {content.title}
          </h2>
          <p style={{
            fontFamily: "var(--font-poppins)", fontSize: "14px",
            color: "rgba(255,255,255,0.3)", fontWeight: 300,
            maxWidth: "420px", margin: "0 auto", lineHeight: 1.75,
          }}>
            {content.subtitle}
          </p>
        </motion.div>

        {/* Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ backgroundColor: "rgba(255,255,255,0.045)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: "flex",
                borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none",
                borderRight: (i + 1) % 3 !== 0 ? "1px solid rgba(255,255,255,0.07)" : "none",
              }}
            >
              <FeatureCard
                feature={feature}
                className="flex-1"
                style={{
                  borderRadius: 0,
                  borderTop: "none",
                  borderBottom: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  background: "transparent",
                }}
              />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
