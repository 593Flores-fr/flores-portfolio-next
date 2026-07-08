"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fermer le menu sur changement de route
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Bloquer le scroll quand le menu est ouvert
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  if (pathname.startsWith("/admin") || pathname.startsWith("/espace")) return null;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
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
          background: scrolled || menuOpen ? "rgba(14,12,10,0.96)" : "transparent",
          backdropFilter: scrolled || menuOpen ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled || menuOpen ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent",
          transition: "background 0.35s ease, backdrop-filter 0.35s ease, border-color 0.35s ease",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }} onClick={() => setMenuOpen(false)}>
          <span style={{
            fontFamily: "var(--font-six-caps), sans-serif",
            fontSize: "17px",
            color: "rgba(255,255,255,0.7)",
            display: "inline-flex", alignItems: "center",
            transition: "color 0.2s",
          }}>
            <span style={{ letterSpacing: "4px" }}>FL</span>
            <span style={{ display: "inline-flex", alignItems: "center", lineHeight: 0 }}>
              <FloresStar size={11} />
            </span>
            <span style={{ letterSpacing: "4px", marginLeft: "4px" }}>RES</span>
          </span>
        </Link>

        {/* Links — hidden on mobile via CSS */}
        <nav className="navbar-links" style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          {NAV_LINKS.map(link => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  position: "relative",
                  fontFamily: "var(--font-poppins)",
                  fontSize: "var(--fs-xs)", fontWeight: 600,
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

        {/* CTA — hidden on mobile via CSS */}
        {session?.user ? (
          <Link href="/espace" className="navbar-cta" style={{ display: "flex", alignItems: "center", gap: "9px", textDecoration: "none" }}>
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name ?? ""}
                width={26}
                height={26}
                style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
              />
            ) : (
              <span style={{
                width: 26, height: 26, borderRadius: "50%",
                background: "rgba(92,92,245,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-poppins)", fontSize: "var(--fs-sm)", fontWeight: 700,
                color: "rgba(255,255,255,0.8)", flexShrink: 0,
              }}>
                {(session.user.name ?? session.user.email ?? "?").charAt(0).toUpperCase()}
              </span>
            )}
            <span style={{
              fontFamily: "var(--font-poppins)", fontSize: "var(--fs-xs)", fontWeight: 600,
              letterSpacing: "2px", textTransform: "uppercase",
              color: "rgba(255,255,255,0.65)",
            }}>
              {session.user.name?.split(" ")[0] ?? "Mon espace"}
            </span>
          </Link>
        ) : (
          <Link href="/espace" className="navbar-cta vto-cta-link vto-cta-link--accent">
            Mon espace
            <span className="vto-cta-line" />
          </Link>
        )}

        {/* Hamburger — visible only on mobile via CSS */}
        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          style={{
            display: "none", // overridden by CSS on mobile
            background: "none", border: "none", cursor: "pointer",
            padding: "8px", gap: "5px", flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <motion.span
            animate={{ width: menuOpen ? "20px" : "20px", rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }}
            style={{ display: "block", height: "1px", background: "rgba(255,255,255,0.6)", transformOrigin: "center" }}
          />
          <motion.span
            animate={{ opacity: menuOpen ? 0 : 1, width: menuOpen ? "12px" : "14px" }}
            style={{ display: "block", height: "1px", background: "rgba(255,255,255,0.6)" }}
          />
          <motion.span
            animate={{ width: "20px", rotate: menuOpen ? -45 : 0, y: menuOpen ? -6 : 0 }}
            style={{ display: "block", height: "1px", background: "rgba(255,255,255,0.6)", transformOrigin: "center" }}
          />
        </button>
      </motion.header>

      {/* Mobile menu overlay — controlled by CSS + state */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="navbar-mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    fontFamily: "var(--font-six-caps), sans-serif",
                    fontSize: "clamp(2rem, 10vw, 3rem)",
                    letterSpacing: "6px",
                    textTransform: "uppercase",
                    color: isActive(link.href) ? "white" : "rgba(255,255,255,0.35)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: NAV_LINKS.length * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {session?.user ? (
                <Link
                  href="/espace"
                  onClick={() => setMenuOpen(false)}
                  style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none", marginTop: "8px" }}
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name ?? ""}
                      width={32}
                      height={32}
                      style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                    />
                  ) : (
                    <span style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: "rgba(92,92,245,0.35)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--font-poppins)", fontSize: "var(--fs-lg)", fontWeight: 700,
                      color: "rgba(255,255,255,0.8)", flexShrink: 0,
                    }}>
                      {(session.user.name ?? session.user.email ?? "?").charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span style={{
                    fontFamily: "var(--font-poppins)", fontSize: "var(--fs-base)", fontWeight: 600,
                    letterSpacing: "3px", textTransform: "uppercase",
                    color: "rgba(255,255,255,0.6)",
                  }}>
                    {session.user.name?.split(" ")[0] ?? "Mon espace"}
                  </span>
                </Link>
              ) : (
                <Link
                  href="/espace"
                  onClick={() => setMenuOpen(false)}
                  className="vto-cta-link vto-cta-link--accent"
                  style={{ marginTop: "8px" }}
                >
                  Mon espace
                  <span className="vto-cta-line" />
                </Link>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
