"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type Avis = {
  id: string;
  content: string | null;
  rating: number;
  user: { name: string | null; image: string | null };
  project: { title: string };
};

const CARD_W = 340;
const GAP = 1;

function Stars({ n }: { n: number }) {
  return (
    <div style={{ display: "flex", gap: "3px", marginBottom: "20px" }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="11" height="11" viewBox="0 0 14 14">
          <path
            d="M7 1.5l1.3 3.9h4.1l-3.3 2.4 1.3 3.9L7 9.3l-3.4 2.4 1.3-3.9L1.6 5.4h4.1z"
            fill={i <= n ? "rgba(251,191,36,0.9)" : "rgba(255,255,255,0.06)"}
          />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ r }: { r: Avis }) {
  const initial = (r.user.name ?? "C")[0].toUpperCase();
  return (
    <div style={{
      width: CARD_W, flexShrink: 0, padding: "28px 32px",
      background: "#0e0c0a",
      border: "1px solid rgba(255,255,255,0.05)",
      display: "flex", flexDirection: "column",
    }}>
      <Stars n={r.rating} />
      <p style={{
        fontFamily: "var(--font-poppins)", fontSize: "var(--fs-base)", fontWeight: 400,
        color: "rgba(255,255,255,0.72)", lineHeight: 1.9, margin: "0 0 auto", paddingBottom: "20px",
        display: "-webkit-box", WebkitLineClamp: 5, WebkitBoxOrient: "vertical", overflow: "hidden",
      }}>
        &ldquo;{r.content}&rdquo;
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingTop: "18px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        {r.user.image ? (
          <Image src={r.user.image} alt={r.user.name ?? "client"} width={28} height={28}
            style={{ objectFit: "cover", flexShrink: 0, border: "1px solid rgba(255,255,255,0.07)" }} />
        ) : (
          <div style={{
            width: 28, height: 28, flexShrink: 0,
            background: "rgba(92,92,245,0.12)",
            border: "1px solid rgba(92,92,245,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-poppins)", fontSize: "var(--fs-base)", fontWeight: 700,
            color: "var(--vto-primary)",
          }}>{initial}</div>
        )}
        <div>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "var(--fs-base)", fontWeight: 600, color: "rgba(255,255,255,0.6)", margin: 0, letterSpacing: "0.2px" }}>
            {r.user.name ?? "Client"}
          </p>
          <p className="vto-label" style={{ fontSize: "var(--fs-2xs)", letterSpacing: "3px", color: "rgba(255,255,255,0.40)", margin: "3px 0 0" }}>
            {r.project.title}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ReviewsSection({ initialReviews = [] }: { initialReviews?: Avis[] }) {
  if (initialReviews.length === 0) return null;

  const copies = Math.max(4, Math.ceil(1800 / ((CARD_W + GAP) * initialReviews.length)) + 1);
  const items = Array.from({ length: copies }, () => initialReviews).flat();
  const setWidth = initialReviews.length * (CARD_W + GAP);
  const duration = initialReviews.length * 8;

  return (
    <section style={{ background: "#0e0c0a", padding: "100px 0 120px", overflow: "hidden", position: "relative" }}>
      <div className="vto-sep" style={{ position: "absolute", top: 0, left: "6vw", right: "6vw", opacity: 0.4 }} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ maxWidth: "1500px", margin: "0 auto 52px", padding: "0 4vw" }}
      >
        <p className="vto-label" style={{ marginBottom: "16px" }}>Avis clients</p>
        <h2 style={{ fontFamily: "var(--font-six-caps), sans-serif", fontSize: "clamp(2.5rem, 4.5vw, 4.5rem)", fontWeight: 400, letterSpacing: "5px", textTransform: "uppercase", color: "white", margin: 0, lineHeight: 1.0 }}>
          Ce qu&apos;ils en disent.
        </h2>
      </motion.div>

      {/* Marquee */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "120px", background: "linear-gradient(90deg, #0e0c0a 0%, transparent 100%)", zIndex: 2, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "120px", background: "linear-gradient(270deg, #0e0c0a 0%, transparent 100%)", zIndex: 2, pointerEvents: "none" }} />
        <div
          className="avis-track"
          style={{
            ["--marquee-end" as string]: `-${setWidth}px`,
            ["--marquee-dur" as string]: `${duration}s`,
            display: "flex", gap: `${GAP}px`, paddingLeft: "4vw", width: "max-content",
          }}
        >
          {items.map((r, i) => <ReviewCard key={i} r={r} />)}
        </div>
      </div>
    </section>
  );
}
