"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function PageLoader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("flo_loaded")) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("flo_loaded", "1");
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "#0e0c0a",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            animation: "min-enter 0.55s cubic-bezier(0.22, 1, 0.36, 1) both",
          }}>
            {/* Surtitle */}
            <p style={{
              fontFamily: "var(--font-poppins)",
              fontSize: "7px",
              fontWeight: 500,
              letterSpacing: "5px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
              margin: "0 0 14px",
            }}>
              Studio · 2025
            </p>

            {/* FLORES */}
            <h1 style={{
              fontFamily: "var(--font-six-caps), sans-serif",
              fontSize: "clamp(4.5rem, 9vw, 8.5rem)",
              fontWeight: 400,
              letterSpacing: "12px",
              textTransform: "uppercase",
              color: "white",
              margin: "0 0 16px",
              lineHeight: 1,
            }}>
              FLORES
            </h1>

            {/* Accent line */}
            <div style={{
              width: "32px", height: "1px",
              background: "rgba(92,92,245,0.65)",
              marginBottom: "20px",
            }} />

            {/* Shimmer progress bar */}
            <div style={{
              width: "100px", height: "1px",
              background: "rgba(255,255,255,0.05)",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: 0, left: 0,
                width: "30%", height: "100%",
                background: "rgba(92,92,245,0.5)",
                animation: "min-bar 1.1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
