"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users, FolderOpen, MessageSquare, Clock, TrendingUp,
  CheckCircle2, ArrowRight, Zap, BookImage, Globe, BarChart2,
} from "lucide-react";

type Stats = {
  totalUsers: number;
  totalProjects: number;
  pendingProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalMessages: number;
  unreadMessages: number;
};

type RecentProject = {
  id: string; title: string; status: string; type: string; createdAt: Date;
  user: { name: string | null; email: string };
};

type RecentMessage = {
  id: string; content: string; createdAt: Date; read: boolean;
  user: { name: string | null; email: string };
};

const STATUS_COLOR: Record<string, string> = {
  pending:   "rgba(250,204,21,0.85)",
  accepted:  "rgba(74,222,128,0.85)",
  active:    "rgba(96,165,250,0.85)",
  completed: "rgba(167,139,250,0.85)",
  rejected:  "rgba(248,113,113,0.85)",
};
const STATUS_BG: Record<string, string> = {
  pending:   "rgba(250,204,21,0.07)",
  accepted:  "rgba(74,222,128,0.07)",
  active:    "rgba(96,165,250,0.07)",
  completed: "rgba(167,139,250,0.07)",
  rejected:  "rgba(248,113,113,0.07)",
};
const STATUS_LABEL: Record<string, string> = {
  pending: "En attente", accepted: "Accepté", active: "En cours",
  completed: "Livré", rejected: "Refusé",
};

function fmtDate(d: Date | string) {
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}
function fmtTime(d: Date | string) {
  return new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

const ease = [0.22, 1, 0.36, 1] as const;

export function AdminHome({ stats, recentProjects, recentMessages }: {
  stats: Stats;
  recentProjects: RecentProject[];
  recentMessages: RecentMessage[];
}) {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";
  const dateStr = now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

  const kpis = [
    {
      label: "Projets actifs",
      value: stats.activeProjects,
      total: stats.totalProjects,
      icon: FolderOpen,
      color: "rgba(96,165,250,0.9)",
      bg: "rgba(96,165,250,0.07)",
      border: "rgba(96,165,250,0.18)",
      href: "/admin/projets",
    },
    {
      label: "Devis en attente",
      value: stats.pendingProjects,
      total: null,
      icon: Clock,
      color: "rgba(250,204,21,0.9)",
      bg: "rgba(250,204,21,0.07)",
      border: "rgba(250,204,21,0.18)",
      href: "/admin/devis",
    },
    {
      label: "Messages non lus",
      value: stats.unreadMessages,
      total: stats.totalMessages,
      icon: MessageSquare,
      color: "rgba(167,139,250,0.9)",
      bg: "rgba(167,139,250,0.07)",
      border: "rgba(167,139,250,0.18)",
      href: "/admin/messages",
    },
    {
      label: "Clients",
      value: stats.totalUsers,
      total: null,
      icon: Users,
      color: "rgba(52,211,153,0.9)",
      bg: "rgba(52,211,153,0.07)",
      border: "rgba(52,211,153,0.18)",
      href: "/admin/projets",
    },
  ];

  const quickActions = [
    { label: "Nouveau devis",      desc: "Répondre aux demandes",    href: "/admin/devis",        icon: FolderOpen,    color: "rgba(250,204,21,0.7)"   },
    { label: "Messagerie",          desc: "Répondre aux clients",     href: "/admin/messages",     icon: MessageSquare, color: "rgba(167,139,250,0.7)"  },
    { label: "Bibliothèque",        desc: "Gérer les images",         href: "/admin/bibliotheque", icon: BookImage,     color: "rgba(96,165,250,0.7)"   },
    { label: "Contenu site",        desc: "Textes et visuels",        href: "/admin/contenu",      icon: Globe,         color: "rgba(52,211,153,0.7)"   },
    { label: "Analytics",           desc: "Trafic et visites",        href: "/admin/analytics",    icon: BarChart2,     color: "rgba(232,121,249,0.7)"  },
    { label: "Projets livrés",      desc: `${stats.completedProjects} projets`,  href: "/admin/projets", icon: CheckCircle2, color: "rgba(74,222,128,0.7)" },
  ];

  return (
    <div style={{ padding: "40px 48px 60px" }}>

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        style={{ marginBottom: "44px" }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 400, letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", margin: "0 0 10px" }}>
              {greeting} — {dateStr}
            </p>
            <h1 style={{ fontFamily: "var(--font-six-caps), sans-serif", fontSize: "clamp(2.5rem, 4vw, 4rem)", fontWeight: 400, letterSpacing: "6px", textTransform: "uppercase", color: "white", margin: 0, lineHeight: 1 }}>
              Studio Flores.
            </h1>
          </div>
          {stats.pendingProjects > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4, ease }}
              style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 18px", border: "1px solid rgba(250,204,21,0.25)", background: "rgba(250,204,21,0.06)", borderRadius: "2px" }}
            >
              <Zap size={13} color="rgba(250,204,21,0.8)" />
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 600, color: "rgba(250,204,21,0.85)", margin: 0 }}>
                {stats.pendingProjects} devis{stats.pendingProjects > 1 ? "" : ""} en attente de réponse
              </p>
              <Link href="/admin/devis" style={{ display: "flex", alignItems: "center", color: "rgba(250,204,21,0.6)", textDecoration: "none" }}>
                <ArrowRight size={13} />
              </Link>
            </motion.div>
          )}
        </div>
        <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", marginTop: "24px" }} />
      </motion.div>

      {/* ── KPI Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "32px" }}>
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.06, duration: 0.45, ease }}
            >
              <Link href={kpi.href} style={{ display: "block", padding: "28px 26px", background: "#0e0c0a", textDecoration: "none", transition: "background 0.15s" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
                  <div style={{ width: 34, height: 34, borderRadius: "8px", background: kpi.bg, border: `1px solid ${kpi.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={15} color={kpi.color} />
                  </div>
                  {kpi.total !== null && (
                    <span style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", color: "rgba(255,255,255,0.2)", fontWeight: 400 }}>
                      / {kpi.total}
                    </span>
                  )}
                </div>
                <p style={{ fontFamily: "var(--font-poppins)", fontSize: "36px", fontWeight: 800, color: "white", margin: "0 0 6px", lineHeight: 1, letterSpacing: "-0.02em" }}>
                  {kpi.value}
                </p>
                <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 500, color: "rgba(255,255,255,0.28)", margin: 0, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                  {kpi.label}
                </p>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* ── Main body : 2 colonnes ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "0", alignItems: "start" }}>

        {/* ── GAUCHE : Projets récents ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45, ease }}
          style={{ padding: "28px 32px 28px 0", minWidth: 0, borderRight: "1px solid rgba(255,255,255,0.06)", paddingRight: "32px" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.22)", margin: 0 }}>
              Projets récents
            </p>
            <Link href="/admin/projets" style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", color: "rgba(255,255,255,0.2)", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
              Tout voir <ArrowRight size={10} />
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "rgba(255,255,255,0.05)", marginBottom: "20px" }}>
            {recentProjects.length === 0 ? (
              <div style={{ padding: "32px 24px", background: "#0e0c0a", textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", color: "rgba(255,255,255,0.15)" }}>Aucun projet</p>
              </div>
            ) : recentProjects.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.36 + i * 0.04, duration: 0.35, ease }}>
                <Link href="/admin/projets" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 20px", background: "#0e0c0a", textDecoration: "none", transition: "background 0.12s" }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: STATUS_COLOR[p.status] ?? "rgba(255,255,255,0.2)", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.85)", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.title}
                    </p>
                    <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 400, color: "rgba(255,255,255,0.25)", margin: 0 }}>
                      {p.user.name ?? p.user.email} · {p.type}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                    <span style={{ fontFamily: "var(--font-poppins)", fontSize: "8px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: STATUS_COLOR[p.status], background: STATUS_BG[p.status], padding: "3px 10px", borderRadius: "999px" }}>
                      {STATUS_LABEL[p.status] ?? p.status}
                    </span>
                    <span style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", color: "rgba(255,255,255,0.18)" }}>{fmtDate(p.createdAt)}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {stats.totalProjects > 0 && (
            <div style={{ padding: "14px 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>Projets livrés</span>
                <span style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 600, color: "rgba(167,139,250,0.7)" }}>{stats.completedProjects} / {stats.totalProjects}</span>
              </div>
              <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "99px", overflow: "hidden" }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.round((stats.completedProjects / stats.totalProjects) * 100)}%` }} transition={{ delay: 0.7, duration: 0.8, ease }} style={{ height: "100%", background: "rgba(167,139,250,0.55)", borderRadius: "99px" }} />
              </div>
            </div>
          )}

          {/* Accès rapide 3×2 */}
          <div>
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.22)", margin: "0 0 14px" }}>Accès rapide</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "rgba(255,255,255,0.06)" }}>
              {quickActions.map((a, i) => {
                const Icon = a.icon;
                return (
                  <motion.div key={a.label} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.04, duration: 0.3, ease }}>
                    <Link href={a.href} style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "16px 14px", background: "#0e0c0a", textDecoration: "none", transition: "background 0.12s" }}>
                      <Icon size={14} color={a.color} />
                      <div>
                        <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", margin: "0 0 2px" }}>{a.label}</p>
                        <p style={{ fontFamily: "var(--font-poppins)", fontSize: "9px", color: "rgba(255,255,255,0.2)", margin: 0 }}>{a.desc}</p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ── DROITE : Messages ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36, duration: 0.45, ease }}
          style={{ padding: "28px 0 28px 28px", minWidth: 0, display: "flex", flexDirection: "column", gap: "28px" }}
        >
          {/* Messages récents */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.22)", margin: 0 }}>
                Messages
                {stats.unreadMessages > 0 && (
                  <span style={{ marginLeft: "8px", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 16, height: 16, borderRadius: "50%", background: "rgba(167,139,250,0.75)", fontSize: "9px", fontWeight: 700, color: "white", verticalAlign: "middle" }}>
                    {stats.unreadMessages}
                  </span>
                )}
              </p>
              <Link href="/admin/messages" style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", color: "rgba(255,255,255,0.2)", textDecoration: "none", display: "flex", alignItems: "center" }}>
                <ArrowRight size={10} />
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "rgba(255,255,255,0.05)" }}>
              {recentMessages.length === 0 ? (
                <div style={{ padding: "20px", background: "#0e0c0a" }}>
                  <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", color: "rgba(255,255,255,0.15)", margin: 0, textAlign: "center" }}>Aucun message</p>
                </div>
              ) : recentMessages.map((m, i) => (
                <motion.div key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.04 }}>
                  <Link href="/admin/messages" style={{ display: "flex", gap: "10px", padding: "11px 14px", background: "#0e0c0a", textDecoration: "none", borderLeft: m.read ? "2px solid transparent" : "2px solid rgba(167,139,250,0.5)", transition: "background 0.12s" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                        <span style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.72)" }}>{m.user.name ?? m.user.email.split("@")[0]}</span>
                        <span style={{ fontFamily: "var(--font-poppins)", fontSize: "9px", color: "rgba(255,255,255,0.18)" }}>{fmtTime(m.createdAt)}</span>
                      </div>
                      <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 300, color: "rgba(255,255,255,0.3)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.content}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stat livrés */}
          <div style={{ padding: "14px 16px", border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.012)", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: 28, height: 28, borderRadius: "7px", background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <TrendingUp size={12} color="rgba(52,211,153,0.8)" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.6)", margin: "0 0 1px" }}>{stats.completedProjects} projet{stats.completedProjects !== 1 ? "s" : ""} livré{stats.completedProjects !== 1 ? "s" : ""}</p>
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "9px", color: "rgba(255,255,255,0.2)", margin: 0 }}>depuis l&apos;ouverture du studio</p>
            </div>
            <Link href="/admin/projets" style={{ color: "rgba(52,211,153,0.45)", display: "flex", flexShrink: 0 }}><ArrowRight size={13} /></Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
