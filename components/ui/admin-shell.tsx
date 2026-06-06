"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { MessageSquare, FolderOpen, Kanban, Star, LogOut, ShieldCheck } from "lucide-react";

const navItems = [
  { href: "/admin/messages", icon: MessageSquare, label: "Messagerie" },
  { href: "/admin/devis",    icon: FolderOpen,    label: "Devis"      },
  { href: "/admin/projets",  icon: Kanban,        label: "Projets"    },
  { href: "/admin/reviews",  icon: Star,          label: "Avis"       },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <div style={{
      minHeight: "100dvh",
      background: "#060a0e",
      display: "flex",
      fontFamily: "var(--font-poppins)",
    }}>
      {/* ── Sidebar ── */}
      <aside style={{
        width: "220px",
        flexShrink: 0,
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100dvh",
        background: "rgba(6,10,14,0.98)",
      }}>
        {/* Brand */}
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: 32, height: 32, borderRadius: "8px",
              background: "linear-gradient(135deg, rgba(60,100,255,0.7), rgba(100,60,255,0.7))",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <ShieldCheck size={15} color="white" strokeWidth={2} />
            </div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.88)", margin: 0, lineHeight: 1.2 }}>Panel Admin</p>
              <p style={{ fontSize: "10px", fontWeight: 300, color: "rgba(255,255,255,0.22)", margin: 0, letterSpacing: "0.08em" }}>Flores</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "2px" }}>
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "9px 10px", borderRadius: "9px",
                  background: active ? "rgba(60,100,255,0.14)" : "transparent",
                  border: `1px solid ${active ? "rgba(60,100,255,0.25)" : "transparent"}`,
                  textDecoration: "none",
                  transition: "background 0.15s, border-color 0.15s",
                }}
              >
                <Icon size={15} color={active ? "rgba(100,140,255,0.9)" : "rgba(255,255,255,0.28)"} strokeWidth={active ? 2 : 1.5} />
                <span style={{
                  fontSize: "12px",
                  fontWeight: active ? 600 : 400,
                  color: active ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.35)",
                }}>
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            style={{
              display: "flex", alignItems: "center", gap: "9px", width: "100%",
              padding: "9px 10px", borderRadius: "9px",
              background: "transparent", border: "none", cursor: "pointer",
              transition: "background 0.15s",
            }}
          >
            <LogOut size={14} color="rgba(248,113,113,0.5)" />
            <span style={{ fontSize: "12px", fontWeight: 400, color: "rgba(248,113,113,0.5)" }}>
              Déconnexion
            </span>
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
