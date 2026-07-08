"use client";

import Link from "next/link";
import { SITE_DEFAULTS } from "@/lib/site-content";
import type { SiteContentMap } from "@/lib/site-content";

const navLinks = [
  { label: "Accueil",       href: "/"          },
  { label: "Portfolio",     href: "/portfolio" },
  { label: "À propos",     href: "/about"     },
  { label: "Tarifs",        href: "/tarif"     },
  { label: "Espace client", href: "/espace"   },
];


export function Footer({ content = SITE_DEFAULTS.footer }: { content?: SiteContentMap["footer"] }) {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "#0e0c0a", borderTop: "1px solid rgba(255,255,255,0.04)", fontFamily: "var(--font-poppins)" }}>
      <div className="footer-inner" style={{
        maxWidth: "1500px", margin: "0 auto", padding: "0 4vw",
        height: "44px", display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: "20px",
      }}>

        {/* Copyright */}
        <p className="vto-label" style={{ fontSize: "var(--fs-2xs)", letterSpacing: "3px", color: "rgba(255,255,255,0.42)", margin: 0, whiteSpace: "nowrap" }}>
          © {year} {content.brandName}
        </p>

        {/* Nav links — centre */}
        <nav className="footer-nav" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {navLinks.map((l, i) => (
            <span key={l.label} style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              {i > 0 && <span className="footer-sep" style={{ width: "1px", height: "8px", background: "rgba(255,255,255,0.08)", display: "block" }} />}
              <Link
                href={l.href}
                style={{
                  fontFamily: "var(--font-poppins)",
                  fontSize: "var(--fs-2xs)", fontWeight: 500,
                  letterSpacing: "2.5px", textTransform: "uppercase",
                  color: "rgba(255,255,255,0.4)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                className="footer-nav-link"
              >
                {l.label}
              </Link>
            </span>
          ))}
        </nav>

        {/* Mention légale */}
        <p className="vto-label hide-mobile" style={{ fontSize: "var(--fs-2xs)", letterSpacing: "3px", color: "rgba(255,255,255,0.18)", margin: 0, whiteSpace: "nowrap" }}>
          {content.legalNote}
        </p>

      </div>
    </footer>
  );
}
