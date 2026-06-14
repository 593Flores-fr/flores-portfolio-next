"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Layers, User, Tag, KeyRound } from "lucide-react";

const items = [
  { id: "home",      label: "Accueil",   href: "/",          icon: Home },
  { id: "portfolio", label: "Portfolio", href: "/portfolio", icon: Layers },
  { id: "about",     label: "About",     href: "/about",     icon: User },
  { id: "tarifs",    label: "Tarifs",    href: "/tarif",     icon: Tag },
  { id: "espace",    label: "Espace",    href: "/espace",    icon: KeyRound },
];

function DockItem({
  item,
  hovered,
  onEnter,
  onLeave,
  isActive,
}: {
  item: typeof items[number];
  hovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
  isActive: boolean;
}) {
  const Icon = item.icon;

  return (
    <div className="dock-item-outer" style={{ position: "relative" }} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              bottom: "calc(100% + 10px)",
              left: "50%",
              transform: "translateX(-50%)",
              pointerEvents: "none",
              zIndex: 10,
            }}
          >
            <div style={{
              padding: "4px 10px",
              borderRadius: "7px",
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.07)",
              color: "white",
              fontFamily: "var(--font-poppins)",
              fontSize: "11px",
              fontWeight: 500,
              whiteSpace: "nowrap",
              letterSpacing: "0.02em",
            }}>
              {item.label}
            </div>
            {/* Arrow */}
            <div style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%) rotate(45deg)",
              width: "6px",
              height: "6px",
              background: "rgba(0,0,0,0.75)",
              borderRight: "1px solid rgba(255,255,255,0.07)",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <Link href={item.href} style={{ textDecoration: "none" }}>
        <motion.div
          animate={{
            y: hovered ? -6 : 0,
            scale: hovered ? 1.12 : 1,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: (isActive || hovered)
              ? "rgba(60,100,255,0.18)"
              : "rgba(255,255,255,0.05)",
            border: `1px solid ${(isActive || hovered) ? "rgba(60,100,255,0.35)" : "rgba(255,255,255,0.08)"}`,
            cursor: "pointer",
            boxShadow: (isActive || hovered) ? "0 0 0 1px rgba(60,100,255,0.15), 0 4px 20px rgba(60,100,255,0.12)" : "none",
            transition: "background 0.2s, border-color 0.2s, box-shadow 0.2s",
            backdropFilter: "blur(2px)",
          }}
        >
          <Icon
            size={18}
            color={(isActive || hovered) ? "rgba(120,155,255,0.95)" : "rgba(255,255,255,0.38)"}
            strokeWidth={(isActive || hovered) ? 2 : 1.6}
          />
        </motion.div>
      </Link>

      {/* Active dot */}
      {isActive && (
        <div className="dock-active-dot" style={{
          position: "absolute",
          bottom: "-8px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "4px",
          height: "4px",
          borderRadius: "50%",
          background: "rgba(100,140,255,0.7)",
        }} />
      )}
      {/* Mobile label */}
      <span className={`dock-item-label${isActive ? " active" : ""}`}>{item.label}</span>
    </div>
  );
}

export function Dock() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const pathname = usePathname();

  if (pathname.startsWith("/admin") || pathname.startsWith("/espace")) return null;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div style={{
      position: "fixed",
      bottom: "28px",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 999,
    }}>
      {/* Container */}
      <motion.div
        className="dock-container"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 16px",
          borderRadius: "20px",
          background: "rgba(6,10,14,0.7)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.09)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {items.map(item => (
          <DockItem
            key={item.id}
            item={item}
            hovered={hoveredId === item.id}
            isActive={isActive(item.href)}
            onEnter={() => setHoveredId(item.id)}
            onLeave={() => setHoveredId(null)}
          />
        ))}
      </motion.div>

      {/* Reflection */}
      <div style={{
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        height: "30px",
        overflow: "hidden",
        pointerEvents: "none",
        opacity: 0.18,
        transform: "scaleY(-1)",
        maskImage: "linear-gradient(to top, transparent 20%, black 100%)",
        WebkitMaskImage: "linear-gradient(to top, transparent 20%, black 100%)",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 16px",
          borderRadius: "20px",
          background: "rgba(6,10,14,0.5)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}>
          {items.map(item => {
            const Icon = item.icon;
            return (
              <div key={item.id} style={{ width: "44px", height: "44px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.04)" }}>
                <Icon size={18} color="rgba(255,255,255,0.3)" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
