"use client";

import Link from "next/link";
import { SITE_DEFAULTS } from "@/lib/site-content";
import type { SiteContentMap } from "@/lib/site-content";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Portfolio", href: "/#portfolio" },
  { label: "Tarifs", href: "/#tarifs" },
  { label: "Espace client", href: "/espace" },
];

const SOCIAL_ICONS = {
  discord: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.114 18.1.128 18.116a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
    </svg>
  ),
  instagram: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  behance: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029H23.7zM15.971 13c-.17-1.954 1.271-2.429 2.343-2.429 1.07 0 2.33.375 2.33 2.429h-4.673zM7.25 2a2.25 2.25 0 0 0-2.25 2.25v15.5A2.25 2.25 0 0 0 7.25 22H12v-2H7.25a.25.25 0 0 1-.25-.25V4.25a.25.25 0 0 1 .25-.25H12V2H7.25zM2 9.5A.5.5 0 0 1 2.5 9h3a.5.5 0 0 1 0 1h-3A.5.5 0 0 1 2 9.5zm0 3a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5z" />
    </svg>
  ),
};

export function Footer({ content = SITE_DEFAULTS.footer }: { content?: SiteContentMap["footer"] }) {
  const year = new Date().getFullYear();

  const socials = [
    { label: "Discord",   href: content.discordUrl,   icon: SOCIAL_ICONS.discord   },
    { label: "Instagram", href: content.instagramUrl, icon: SOCIAL_ICONS.instagram },
    { label: "Behance",   href: content.behanceUrl,   icon: SOCIAL_ICONS.behance   },
  ];

  return (
    <footer
      style={{
        background: "#060a0e",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "48px 0 32px",
        fontFamily: "var(--font-poppins)",
      }}
    >
      <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 6vw" }}>
        {/* ── Main row ── */}
        <div
          style={{
            display: "flex", alignItems: "flex-start", justifyContent: "space-between",
            gap: "40px", flexWrap: "wrap", marginBottom: "40px",
          }}
        >
          {/* Brand */}
          <div style={{ flex: "1 1 200px", minWidth: 0 }}>
            {/* Flores logotype */}
            <div style={{ fontFamily: "var(--font-six-caps), sans-serif", fontSize: "30px", lineHeight: 0.78, display: "inline-flex", alignItems: "center", gap: "0.045em", color: "#F4F6F8", marginBottom: "10px" }}>
              <span>F</span><span>L</span>
              <svg viewBox="0 0 100 100" style={{ height: "0.74em", width: "0.52em", flexShrink: 0, overflow: "visible" }}>
                <defs>
                  <linearGradient id="footSteel" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0" stopColor="#0a1a33"/>
                    <stop offset=".28" stopColor="#173f74"/>
                    <stop offset=".46" stopColor="#3f86cf"/>
                    <stop offset=".54" stopColor="#7cb4e8"/>
                    <stop offset=".64" stopColor="#2f6fb0"/>
                    <stop offset=".82" stopColor="#12325f"/>
                    <stop offset="1" stopColor="#091628"/>
                  </linearGradient>
                  <mask id="footHole">
                    <path d="M50,4C51.93,45.93 51.93,45.93 82.53,17.47C54.24,48.49 54.24,48.49 96,50C54.07,51.93 54.07,51.93 82.53,82.53C51.51,54.24 51.51,54.24 50,96C48.07,54.07 48.07,54.07 17.47,82.53C45.76,51.51 45.76,51.51 4,50C45.93,48.07 45.93,48.07 17.47,17.47C48.49,45.76 48.49,45.76 50,4Z" fill="#fff"/>
                    <circle cx="50" cy="50" r="3" fill="#000"/>
                  </mask>
                </defs>
                <g mask="url(#footHole)">
                  <path d="M50,4C51.93,45.93 51.93,45.93 82.53,17.47C54.24,48.49 54.24,48.49 96,50C54.07,51.93 54.07,51.93 82.53,82.53C51.51,54.24 51.51,54.24 50,96C48.07,54.07 48.07,54.07 17.47,82.53C45.76,51.51 45.76,51.51 4,50C45.93,48.07 45.93,48.07 17.47,17.47C48.49,45.76 48.49,45.76 50,4Z" fill="url(#footSteel)"/>
                  <path d="M50,4C51.93,45.93 51.93,45.93 82.53,17.47C54.24,48.49 54.24,48.49 96,50C54.07,51.93 54.07,51.93 82.53,82.53C51.51,54.24 51.51,54.24 50,96C48.07,54.07 48.07,54.07 17.47,82.53C45.76,51.51 45.76,51.51 4,50C45.93,48.07 45.93,48.07 17.47,17.47C48.49,45.76 48.49,45.76 50,4Z" fill="none" stroke="#bcd8f5" strokeOpacity=".35" strokeWidth=".6"/>
                </g>
              </svg>
              <span>R</span><span>E</span><span>S</span>
            </div>
            <p style={{ fontSize: "11px", fontWeight: 300, color: "rgba(255,255,255,0.25)", lineHeight: 1.65, margin: 0, maxWidth: "220px" }}>
              {content.brandDesc}
            </p>
          </div>

          {/* Nav */}
          <nav style={{ display: "flex", flexDirection: "column", gap: "10px", flex: "0 0 auto" }}>
            <p style={{ fontSize: "9px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.22em", color: "rgba(255,255,255,0.18)", margin: "0 0 4px" }}>
              Navigation
            </p>
            {navLinks.map((l) => (
              <Link
                key={l.label} href={l.href}
                style={{ fontSize: "12px", fontWeight: 400, color: "rgba(255,255,255,0.38)", textDecoration: "none", transition: "color 0.2s", letterSpacing: "0.01em" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Socials */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: "0 0 auto" }}>
            <p style={{ fontSize: "9px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.22em", color: "rgba(255,255,255,0.18)", margin: "0 0 4px" }}>
              Réseaux
            </p>
            {socials.map((s) => (
              <a
                key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: "9px", fontSize: "12px", fontWeight: 400, color: "rgba(255,255,255,0.35)", textDecoration: "none", transition: "color 0.2s", letterSpacing: "0.01em" }}
              >
                <span style={{ opacity: 0.6 }}>{s.icon}</span>
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "20px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: "10px",
          }}
        >
          <p style={{ fontSize: "10px", fontWeight: 300, color: "rgba(255,255,255,0.15)", margin: 0, letterSpacing: "0.04em" }}>
            © {year} {content.brandName} — Tous droits réservés
          </p>
          <p style={{ fontSize: "10px", fontWeight: 300, color: "rgba(255,255,255,0.12)", margin: 0, letterSpacing: "0.04em" }}>
            {content.legalNote}
          </p>
        </div>
      </div>
    </footer>
  );
}
