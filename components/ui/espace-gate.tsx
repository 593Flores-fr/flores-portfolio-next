"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { AuthPanel } from "./auth-panel";
import { MessageSquare, Kanban, Star, Settings, ArrowLeft } from "lucide-react";

const features = [
  { icon: MessageSquare, label: "Demande de devis", desc: "Formulaire structuré, réponse sous 24h" },
  { icon: Kanban, label: "Suivi de projet", desc: "Kanban mis à jour en direct" },
  { icon: Star, label: "Avis client", desc: "Laissez un avis après livraison" },
  { icon: Settings, label: "Paramètres", desc: "Pseudo, avatar, mot de passe" },
];

export function EspaceGate() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#060a0e",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-poppins)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: "absolute",
        top: "30%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "700px",
        height: "400px",
        background: "radial-gradient(ellipse, rgba(60,100,255,0.09) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Back link */}
      <div style={{ padding: "24px 6vw" }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "11px",
            fontWeight: 500,
            color: "rgba(255,255,255,0.3)",
            textDecoration: "none",
            letterSpacing: "0.04em",
            transition: "color 0.2s",
          }}
        >
          <ArrowLeft size={12} />
          Retour au site
        </Link>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 6vw 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "64px",
            alignItems: "center",
            maxWidth: "1000px",
            width: "100%",
            flexWrap: "wrap",
          }}
        >
          {/* ── Left — copy ── */}
          <div style={{ flex: "1 1 340px", minWidth: 0 }}>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: "10px",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.25em",
                color: "rgba(255,255,255,0.22)",
                marginBottom: "12px",
              }}
            >
              Espace client
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.025em",
                color: "white",
                margin: "0 0 20px",
              }}
            >
              Votre projet,<br />
              <span style={{ color: "rgba(100,140,255,0.85)" }}>entre nous.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: "13px",
                fontWeight: 300,
                color: "rgba(255,255,255,0.32)",
                lineHeight: 1.8,
                margin: "0 0 32px",
                maxWidth: "380px",
              }}
            >
              Créez un compte ou connectez-vous avec Discord pour accéder à votre espace personnel et gérer vos projets avec moi.
            </motion.p>

            {/* Feature list */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "36px" }}
            >
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      opacity: 0.9,
                    }}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: "8px",
                      background: "rgba(60,100,255,0.1)",
                      border: "1px solid rgba(60,100,255,0.15)",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <Icon width={14} height={14} color="rgba(100,140,255,0.75)" strokeWidth={1.5} />
                    </div>
                    <div>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
                        {f.label}
                      </span>
                      <span style={{ fontSize: "11px", fontWeight: 300, color: "rgba(255,255,255,0.25)", marginLeft: "8px" }}>
                        — {f.desc}
                      </span>
                    </div>
                  </div>
                );
              })}
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setShowAuth(true)}
              style={{
                padding: "12px 28px",
                borderRadius: "12px",
                background: "rgba(60,100,255,0.75)",
                border: "1px solid rgba(60,100,255,0.4)",
                fontSize: "13px",
                fontWeight: 600,
                color: "white",
                cursor: "pointer",
                letterSpacing: "0.01em",
                boxShadow: "0 8px 32px rgba(60,100,255,0.2)",
                fontFamily: "var(--font-poppins)",
              }}
            >
              Accéder à l&apos;espace
            </motion.button>
          </div>

          {/* ── Right — Auth panel ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            style={{ flex: "0 0 340px", width: "340px" }}
          >
            <AuthPanel />
          </motion.div>
        </div>
      </div>

      {/* Mobile auth modal */}
      <AnimatePresence>
        {showAuth && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAuth(false)}
            style={{
              position: "fixed", inset: 0, zIndex: 100,
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "24px",
            }}
          >
            <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: "360px" }}>
              <AuthPanel onClose={() => setShowAuth(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
