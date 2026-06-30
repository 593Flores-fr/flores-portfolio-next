"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  MessageSquare, FolderOpen, Kanban, Users, Star, LogOut,
  ShieldCheck, BarChart2, Image, ArrowUpLeft, Receipt, Globe, Flag, BookImage, LayoutDashboard,
} from "lucide-react";

const navItems = [
  { href: "/admin",              icon: LayoutDashboard, label: "Accueil"       },
  { href: "/admin/devis",        icon: FolderOpen,      label: "Devis"         },
  { href: "/admin/projets",      icon: Users,           label: "Projets"       },
  { href: "/admin/kanban",       icon: Kanban,          label: "Kanban"        },
  { href: "/admin/messages",     icon: MessageSquare,   label: "Messagerie"    },
  { href: "/admin/reviews",      icon: Star,            label: "Avis"          },
  { href: "/admin/factures",     icon: Receipt,         label: "Factures"      },
  { href: "/admin/portfolio",    icon: Image,           label: "Portfolio"     },
  { href: "/admin/bibliotheque", icon: BookImage,       label: "Bibliothèque"  },
  { href: "/admin/contenu",      icon: Globe,           label: "Contenu site"  },
  { href: "/admin/analytics",    icon: BarChart2,       label: "Analytics"     },
  { href: "/admin/signalements", icon: Flag,            label: "Signalements"  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Accueil exact match; all others prefix match
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(href + "/");

  return (
    <div style={{ minHeight: "100dvh", background: "#0e0c0a", display: "flex", fontFamily: "var(--font-poppins)" }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: "240px", flexShrink: 0,
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100dvh",
        background: "#0e0c0a",
        overflowY: "auto",
      }}>
        {/* Brand */}
        <div style={{ padding: "24px 22px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
            <ShieldCheck size={15} color="rgba(255,255,255,0.18)" strokeWidth={1.5} />
            <div>
              <p style={{ fontFamily: "var(--font-six-caps), sans-serif", fontSize: "20px", letterSpacing: "5px", color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1, textTransform: "uppercase" }}>FLORES</p>
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "8px", fontWeight: 400, letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.18)", margin: 0 }}>Panel Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, paddingTop: "10px", paddingBottom: "10px", display: "flex", flexDirection: "column" }}>
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "10px 22px",
                  borderLeft: active ? "2px solid rgba(255,255,255,0.4)" : "2px solid transparent",
                  background: active ? "rgba(255,255,255,0.035)" : "transparent",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                }}
              >
                <Icon
                  size={15}
                  color={active ? "rgba(255,255,255,0.78)" : "rgba(255,255,255,0.24)"}
                  strokeWidth={active ? 2 : 1.5}
                />
                <span style={{
                  fontSize: "12px", fontWeight: active ? 600 : 400,
                  color: active ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.32)",
                  letterSpacing: "0.2px",
                }}>
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 22px", textDecoration: "none", borderLeft: "2px solid transparent" }}>
            <ArrowUpLeft size={14} color="rgba(255,255,255,0.2)" />
            <span style={{ fontSize: "11px", fontWeight: 400, color: "rgba(255,255,255,0.22)", fontFamily: "var(--font-poppins)" }}>Retour au site</span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "12px 22px", background: "transparent", border: "none", cursor: "pointer", borderLeft: "2px solid transparent" }}
          >
            <LogOut size={14} color="rgba(248,113,113,0.45)" />
            <span style={{ fontSize: "11px", fontWeight: 400, color: "rgba(248,113,113,0.45)", fontFamily: "var(--font-poppins)" }}>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* ── Content ── */}
      <main style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
