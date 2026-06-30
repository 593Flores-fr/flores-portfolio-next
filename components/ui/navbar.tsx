"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

function FloresStar({ size = 13 }: { size?: number }) {
  const p = "M50,47 Q40,38 37,24 Q34,12 42,9 Q46,6 50,10 Q54,6 58,9 Q66,12 63,24 Q60,38 50,47Z";
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: "block", flexShrink: 0 }}>
      <path d={p} fill="currentColor"/>
      <path d={p} fill="currentColor" transform="rotate(72,50,50)"/>
      <path d={p} fill="currentColor" transform="rotate(144,50,50)"/>
      <path d={p} fill="currentColor" transform="rotate(216,50,50)"/>
      <path d={p} fill="currentColor" transform="rotate(288,50,50)"/>
      <circle cx="50" cy="50" r="10" fill="#0e0c0a"/>
    </svg>
  );
}

const NAV_LINKS = [
  { href: "/",          label: "Accueil"   },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about",     label: "À propos"  },
  { href: "/tarif",     label: "Tarifs"    },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/admin") || pathname.startsWith("/espace")) return null;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <motion.header
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0,
        zIndex: 200,
        height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 4vw",
        background: scrolled ? "rgba(14,12,10,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent",
        transition: "background 0.35s ease, backdrop-filter 0.35s ease, border-color 0.35s ease",
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ textDecoration: "none" }}>
        <span style={{
          fontFamily: "var(--font-six-caps), sans-serif",
          fontSize: "17px",
          color: "rgba(255,255,255,0.55)",
          display: "inline-flex", alignItems: "center",
          transition: "color 0.2s",
        }}>
          {/* letterSpacing ajoute 4px trailing après le L */}
          <span style={{ letterSpacing: "4px" }}>FL</span>
          {/* pas de marge gauche : les 4px trailing de L font office d'espace */}
          <span style={{ display: "inline-flex", alignItems: "center", lineHeight: 0 }}>
            <FloresStar size={11} />
          </span>
          {/* marginLeft = 4px pour équilibrer le spacing côté R */}
          <span style={{ letterSpacing: "4px", marginLeft: "4px" }}>RES</span>
        </span>
      </Link>

      {/* Links */}
      <nav style={{ display: "flex", alignItems: "center", gap: "2px" }}>
        {NAV_LINKS.map(link => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                position: "relative",
                fontFamily: "var(--font-poppins)",
                fontSize: "9px", fontWeight: 600,
                letterSpacing: "3px", textTransform: "uppercase",
                color: active ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.38)",
                textDecoration: "none",
                padding: "6px 14px",
                transition: "color 0.2s",
              }}
              className="navbar-link"
            >
              {link.label}
              {active && (
                <motion.span
                  layoutId="navbar-active"
                  style={{
                    position: "absolute", bottom: "-1px", left: "14px", right: "14px",
                    height: "1px", background: "var(--vto-primary)",
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* CTA */}
      <Link href="/espace" className="vto-cta-link vto-cta-link--accent">
        Mon espace
        <span className="vto-cta-line" />
      </Link>
    </motion.header>
  );
}
