import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page introuvable",
  description: "Cette page n'existe pas ou a été déplacée.",
};

export default function NotFound() {
  return (
    <div style={{
      background: "#060a0e",
      minHeight: "100dvh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-poppins)",
      color: "white",
      padding: "0 6vw",
      textAlign: "center",
    }}>
      <p style={{
        fontSize: "11px",
        textTransform: "uppercase",
        letterSpacing: "0.28em",
        color: "rgba(255,255,255,0.22)",
        marginBottom: "20px",
        fontWeight: 300,
      }}>
        Erreur 404
      </p>

      <h1 style={{
        fontFamily: "var(--font-six-caps), sans-serif",
        fontSize: "clamp(5rem, 12vw, 10rem)",
        fontWeight: 400,
        lineHeight: 0.9,
        color: "white",
        marginBottom: "28px",
        letterSpacing: "0.02em",
      }}>
        PAGE<br />INTROUVABLE
      </h1>

      <p style={{
        fontSize: "14px",
        fontWeight: 300,
        color: "rgba(255,255,255,0.35)",
        maxWidth: "340px",
        lineHeight: 1.75,
        marginBottom: "44px",
      }}>
        Cette page n&apos;existe pas ou a été déplacée.
      </p>

      <Link href="/" style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 28px",
        borderRadius: "999px",
        background: "white",
        color: "black",
        fontSize: "12px",
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        textDecoration: "none",
      }}>
        Retour à l&apos;accueil
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
          <path d="M1.5 7.5L7.5 1.5M7.5 1.5H2.5M7.5 1.5V6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Link>
    </div>
  );
}
