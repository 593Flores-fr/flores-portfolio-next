"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const D = "M50,4C51.93,45.93 51.93,45.93 82.53,17.47C54.24,48.49 54.24,48.49 96,50C54.07,51.93 54.07,51.93 82.53,82.53C51.51,54.24 51.51,54.24 50,96C48.07,54.07 48.07,54.07 17.47,82.53C45.76,51.51 45.76,51.51 4,50C45.93,48.07 45.93,48.07 17.47,17.47C48.49,45.76 48.49,45.76 50,4Z";

export function PageLoader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("flo_loaded")) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("flo_loaded", "1");
    }, 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "radial-gradient(60% 60% at 50% 42%, #0d1726 0%, #070a0e 70%)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: "40px",
          }}
        >
          {/* Flower mark */}
          <div style={{ position: "relative", width: 140, height: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{
              position: "absolute", width: 120, height: 120, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(63,134,207,.45) 0%, rgba(63,134,207,0) 68%)",
              animation: "flo-glow 2.6s ease-in-out infinite",
            }} />
            <div style={{ animation: "flo-breathe 2.6s ease-in-out infinite" }}>
              <svg viewBox="0 0 100 100" width={118} height={118} style={{ overflow: "visible", transformOrigin: "50% 50%", animation: "flo-rot 7s linear infinite", filter: "drop-shadow(0 6px 22px rgba(0,0,0,.5))" }}>
                <defs>
                  <linearGradient id="ldSteel" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0" stopColor="#0a1a33"/>
                    <stop offset=".28" stopColor="#173f74"/>
                    <stop offset=".46" stopColor="#3f86cf"/>
                    <stop offset=".54" stopColor="#7cb4e8"/>
                    <stop offset=".64" stopColor="#2f6fb0"/>
                    <stop offset=".82" stopColor="#12325f"/>
                    <stop offset="1" stopColor="#091628"/>
                  </linearGradient>
                  <mask id="ldHole">
                    <path d={D} fill="#fff"/>
                    <circle cx="50" cy="50" r="3" fill="#000"/>
                  </mask>
                </defs>
                <g mask="url(#ldHole)">
                  <path d={D} fill="url(#ldSteel)"/>
                  <path d={D} fill="none" stroke="#bcd8f5" strokeOpacity=".4" strokeWidth=".6"/>
                </g>
              </svg>
            </div>
          </div>

          {/* Label */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <div style={{ fontFamily: "var(--font-six-caps), sans-serif", fontSize: 46, lineHeight: .78, letterSpacing: ".04em", color: "#e7eef6", display: "flex", alignItems: "center", gap: ".06em" }}>
              <span>F</span><span>L</span>
              <svg viewBox="0 0 100 100" style={{ height: ".74em", width: ".52em", flexShrink: 0, overflow: "visible" }}>
                <defs>
                  <linearGradient id="ldSteelLbl" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0" stopColor="#0a1a33"/>
                    <stop offset=".28" stopColor="#173f74"/>
                    <stop offset=".46" stopColor="#3f86cf"/>
                    <stop offset=".54" stopColor="#7cb4e8"/>
                    <stop offset=".64" stopColor="#2f6fb0"/>
                    <stop offset=".82" stopColor="#12325f"/>
                    <stop offset="1" stopColor="#091628"/>
                  </linearGradient>
                  <mask id="ldHoleLbl">
                    <path d={D} fill="#fff"/>
                    <circle cx="50" cy="50" r="3" fill="#000"/>
                  </mask>
                </defs>
                <g mask="url(#ldHoleLbl)">
                  <path d={D} fill="url(#ldSteelLbl)"/>
                  <path d={D} fill="none" stroke="#bcd8f5" strokeOpacity=".35" strokeWidth=".6"/>
                </g>
              </svg>
              <span>R</span><span>E</span><span>S</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-poppins)", fontSize: 10, letterSpacing: ".32em", color: "#5f6b7a", textTransform: "uppercase" }}>
              <span>Chargement</span>
              <span style={{ display: "inline-flex", gap: 3 }}>
                {([0, 0.2, 0.4] as number[]).map((delay, i) => (
                  <span key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: "#7cb4e8", animation: `flo-dots 1.4s ease-in-out ${delay}s infinite` }} />
                ))}
              </span>
            </div>

            <div style={{ position: "relative", width: 160, height: 2, borderRadius: 2, background: "rgba(255,255,255,.07)", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: "40%", height: "100%", borderRadius: 2, background: "linear-gradient(90deg,transparent,#3f86cf,transparent)", animation: "flo-bar 1.8s ease-in-out infinite" }} />
            </div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
