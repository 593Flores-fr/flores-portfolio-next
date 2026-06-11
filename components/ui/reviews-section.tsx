"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

type Avis = {
  id: string;
  content: string | null;
  rating: number;
  user: { name: string | null; image: string | null };
  project: { title: string };
};

const CARD_W = 360;
const GAP = 20;

function Stars({ n }: { n: number }) {
  return (
    <div style={{ display: "flex", gap: "3px", marginBottom: "18px" }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="13" height="13" viewBox="0 0 14 14">
          <path
            d="M7 1.5l1.3 3.9h4.1l-3.3 2.4 1.3 3.9L7 9.3l-3.4 2.4 1.3-3.9L1.6 5.4h4.1z"
            fill={i <= n ? "#fbbf24" : "rgba(255,255,255,0.1)"}
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
      width: CARD_W, flexShrink: 0, padding: "28px", borderRadius: "16px",
      background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)",
      display: "flex", flexDirection: "column",
    }}>
      <Stars n={r.rating} />
      <p style={{
        fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 300,
        color: "rgba(255,255,255,0.55)", lineHeight: 1.82, margin: "0 0 auto", paddingBottom: "20px",
        display: "-webkit-box", WebkitLineClamp: 6, WebkitBoxOrient: "vertical", overflow: "hidden",
      }}>
        &ldquo;{r.content}&rdquo;
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        {r.user.image ? (
          <Image src={r.user.image} alt={r.user.name ?? "client"} width={32} height={32}
            style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
        ) : (
          <div style={{
            width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, rgba(60,100,255,0.25), rgba(124,58,237,0.25))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "13px", fontWeight: 700, color: "rgba(100,140,255,0.8)",
          }}>{initial}</div>
        )}
        <div>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.65)", margin: 0 }}>
            {r.user.name ?? "Client"}
          </p>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", color: "rgba(255,255,255,0.22)", margin: "2px 0 0", letterSpacing: "0.04em" }}>
            {r.project.title}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Avis[]>([]);

  useEffect(() => {
    fetch("/api/avis")
      .then(r => r.json())
      .then(d => { if (Array.isArray(d) && d.length > 0) setReviews(d); })
      .catch(() => {});
  }, []);

  if (reviews.length === 0) return null;

  // Duplicate for seamless loop — at least 4 copies to fill wide screens
  const copies = Math.max(4, Math.ceil(1800 / ((CARD_W + GAP) * reviews.length)) + 1);
  const items = Array.from({ length: copies }, () => reviews).flat();
  const setWidth = reviews.length * (CARD_W + GAP);
  const duration = reviews.length * 7;

  return (
    <section style={{ background: "#060a0e", padding: "100px 0 120px", overflow: "hidden" }}>
      <style>{`
        @keyframes avis-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-${setWidth}px); }
        }
        .avis-track {
          animation: avis-marquee ${duration}s linear infinite;
          will-change: transform;
        }
        .avis-track:hover { animation-play-state: paused; }
      `}</style>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ maxWidth: "1300px", margin: "0 auto 56px", padding: "0 6vw" }}
      >
        <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.28em", color: "rgba(255,255,255,0.25)", fontWeight: 300, marginBottom: "14px" }}>
          Avis clients
        </p>
        <h2 style={{ fontFamily: "var(--font-poppins)", fontSize: "clamp(2.2rem,4vw,3.5rem)", fontWeight: 800, letterSpacing: "-0.02em", color: "white", margin: 0, lineHeight: 1.05 }}>
          Ce qu&apos;ils en disent.
        </h2>
      </motion.div>

      {/* Marquee */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "160px", background: "linear-gradient(90deg, #060a0e 0%, transparent 100%)", zIndex: 2, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "160px", background: "linear-gradient(270deg, #060a0e 0%, transparent 100%)", zIndex: 2, pointerEvents: "none" }} />
        <div className="avis-track" style={{ display: "flex", gap: `${GAP}px`, paddingLeft: "6vw", width: "max-content" }}>
          {items.map((r, i) => <ReviewCard key={i} r={r} />)}
        </div>
      </div>
    </section>
  );
}
