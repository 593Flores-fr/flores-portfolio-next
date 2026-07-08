"use client";

import Link from "next/link";
import { AuthPanel } from "./auth-panel";

export function EspaceGate() {
  return (
    <div style={{
      minHeight: "100dvh",
      background: "#0e0c0a",
      display: "flex",
      flexDirection: "column",
      fontFamily: "var(--font-poppins)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Ambient glow très subtil */}
      <div style={{
        position: "absolute",
        top: "35%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "600px",
        height: "300px",
        background: "radial-gradient(ellipse, rgba(92,92,245,0.05) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Back link */}
      <div style={{ padding: "32px 48px" }}>
        <Link href="/" className="vto-cta-link" style={{ gap: "12px" }}>
          <span className="vto-cta-line" />
          Retour
        </Link>
      </div>

      {/* Content */}
      <div className="espace-gate-content" style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 6vw 80px",
        gap: "80px",
        flexWrap: "wrap",
      }}>
        {/* ── Gauche — copie ── */}
        <div style={{ flex: "1 1 320px", minWidth: 0, maxWidth: "560px" }}>
          <p className="vto-label" style={{ marginBottom: "24px" }}>Espace client</p>

          <h1 style={{
            fontFamily: "var(--font-six-caps), sans-serif",
            fontSize: "clamp(3.5rem, 6vw, 6rem)",
            fontWeight: 400,
            lineHeight: 0.9,
            letterSpacing: "5px",
            textTransform: "uppercase",
            color: "white",
            margin: "0 0 40px",
          }}>
            Votre projet,<br />entre nous.
          </h1>

          <div className="vto-sep" style={{ marginBottom: "40px" }} />

          {/* Feature list — VTO style, toutes les fonctionnalités de l'espace */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "22px 32px" }}>
            {[
              { num: "01", label: "Brief & devis", desc: "Formulaire structuré · Réponse sous 24h" },
              { num: "02", label: "Devis & factures", desc: "Signature en ligne, factures téléchargeables" },
              { num: "03", label: "Suivi de projet", desc: "Kanban partagé, avancement en direct" },
              { num: "04", label: "Messagerie privée", desc: "Échangez directement avec Flores" },
              { num: "05", label: "Livrables à valider", desc: "Approuvez ou demandez une retouche en un clic" },
              { num: "06", label: "Moodboard partagé", desc: "Références et inspirations du projet" },
              { num: "07", label: "Avis & bilan", desc: "Partagez votre expérience en fin de projet" },
              { num: "08", label: "Signalements", desc: "Un souci ? Signalez-le, suivi dans l'espace" },
            ].map(f => (
              <div key={f.num} style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                <span className="vto-label" style={{ fontSize: "var(--fs-2xs)", letterSpacing: "3px", color: "rgba(255,255,255,0.40)", flexShrink: 0, paddingTop: "2px" }}>{f.num}</span>
                <div>
                  <p style={{ fontFamily: "var(--font-poppins)", fontSize: "var(--fs-base)", fontWeight: 600, color: "rgba(255,255,255,0.65)", margin: "0 0 3px", letterSpacing: "0.3px" }}>{f.label}</p>
                  <p style={{ fontFamily: "var(--font-poppins)", fontSize: "var(--fs-sm)", fontWeight: 400, color: "rgba(255,255,255,0.50)", margin: 0, letterSpacing: "0.5px" }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Droite — Auth panel ── */}
        <div className="espace-gate-auth" style={{ flex: "0 0 340px", width: "340px", maxWidth: "100%" }}>
          <AuthPanel />
        </div>
      </div>
    </div>
  );
}
