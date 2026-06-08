"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SITE_DEFAULTS } from "@/lib/site-content";
import type { SiteContentMap, ServiceItem } from "@/lib/site-content";

type Service = ServiceItem;

function ServiceRow({ service, index }: { service: Service; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "20px",
        padding: "18px 0",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        opacity: service.soon ? 0.45 : 1,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
          <span style={{
            fontFamily: "var(--font-poppins)",
            fontSize: "13px",
            fontWeight: 600,
            color: "rgba(255,255,255,0.85)",
            letterSpacing: "0.01em",
          }}>
            {service.name}
          </span>
          {service.badge && (
            <span style={{
              fontSize: "9px",
              fontFamily: "var(--font-poppins)",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "rgba(74,222,128,0.9)",
              border: "1px solid rgba(74,222,128,0.3)",
              background: "rgba(74,222,128,0.08)",
              padding: "2px 7px",
              borderRadius: "999px",
            }}>
              {service.badge}
            </span>
          )}
          {service.soon && (
            <span style={{
              fontSize: "9px",
              fontFamily: "var(--font-poppins)",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.25)",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "2px 7px",
              borderRadius: "999px",
            }}>
              Bientôt
            </span>
          )}
        </div>
        <p style={{
          fontFamily: "var(--font-poppins)",
          fontSize: "11px",
          fontWeight: 300,
          color: "rgba(255,255,255,0.28)",
          lineHeight: 1.65,
          margin: 0,
        }}>
          {service.description}
        </p>
      </div>
      <div style={{ flexShrink: 0, textAlign: "right" }}>
        <span style={{
          fontFamily: "var(--font-poppins)",
          fontSize: "12px",
          fontWeight: 600,
          color: service.price === "Sur devis" || service.price === "À venir"
            ? "rgba(255,255,255,0.25)"
            : "rgba(255,255,255,0.7)",
          whiteSpace: "nowrap",
          letterSpacing: "-0.01em",
        }}>
          {service.price}
        </span>
      </div>
    </motion.div>
  );
}

function CategoryPanel({
  number,
  title,
  services,
  delay = 0,
}: {
  number: string;
  title: string;
  services: Service[];
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        flex: 1,
        minWidth: 0,
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px",
        padding: "36px 32px 28px",
        background: "rgba(255,255,255,0.015)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle corner glow */}
      <div style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "200px",
        height: "200px",
        background: "radial-gradient(circle at top right, rgba(60,100,255,0.06), transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <p style={{
          fontFamily: "var(--font-poppins)",
          fontSize: "10px",
          fontWeight: 500,
          color: "rgba(255,255,255,0.18)",
          textTransform: "uppercase",
          letterSpacing: "0.25em",
          marginBottom: "10px",
        }}>
          {number}
        </p>
        <h3 style={{
          fontFamily: "var(--font-poppins)",
          fontSize: "clamp(1.3rem, 2.2vw, 1.7rem)",
          fontWeight: 800,
          color: "white",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          margin: 0,
        }}>
          {title}
        </h3>
      </div>

      {/* Services */}
      <div>
        {services.map((service, i) => (
          <ServiceRow key={service.name} service={service} index={i} />
        ))}
      </div>

      {/* CTA */}
      <div style={{ marginTop: "24px" }}>
        <Link
          href="/contact"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: "var(--font-poppins)",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
            textDecoration: "none",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            paddingBottom: "3px",
            transition: "color 0.2s ease",
          }}
        >
          Démarrer un projet
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
            <path d="M1.5 7.5L7.5 1.5M7.5 1.5H2.5M7.5 1.5V6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </motion.div>
  );
}

export function TarifsSection({ content = SITE_DEFAULTS.tarifs }: { content?: SiteContentMap["tarifs"] }) {
  const devServices = content.devServices;
  const visualServices = content.visualServices;

  return (
    <section id="tarifs" style={{ background: "#060a0e", padding: "120px 0 140px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 6vw" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: "64px" }}
        >
          <p style={{
            fontFamily: "var(--font-poppins)",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.28em",
            color: "rgba(255,255,255,0.25)",
            fontWeight: 300,
            marginBottom: "16px",
          }}>
            Tarifs
          </p>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <h2 style={{
              fontFamily: "var(--font-poppins)",
              fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "white",
              margin: 0,
            }}>
              Aperçu des tarifs.
            </h2>
            <p style={{
              fontFamily: "var(--font-poppins)",
              fontSize: "13px",
              color: "rgba(255,255,255,0.28)",
              fontWeight: 300,
              maxWidth: "320px",
              lineHeight: 1.7,
              margin: 0,
              textAlign: "right",
            }}>
              Chaque projet est unique — ces fourchettes sont là pour vous orienter. Devis gratuit sous 24h.
            </p>
          </div>
        </motion.div>

        {/* Two columns */}
        <div style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
        }}>
          <CategoryPanel
            number="01"
            title={content.devTitle}
            services={devServices}
            delay={0}
          />
          <CategoryPanel
            number="02"
            title={content.visualTitle}
            services={visualServices}
            delay={0.1}
          />
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{
            fontFamily: "var(--font-poppins)",
            fontSize: "11px",
            fontWeight: 300,
            color: "rgba(255,255,255,0.15)",
            textAlign: "center",
            marginTop: "48px",
            letterSpacing: "0.04em",
          }}
        >
          {content.footerNote}
        </motion.p>

      </div>
    </section>
  );
}
