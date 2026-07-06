"use client";

import { useEffect, useRef, useState } from "react";
import { signOut, signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Send, LogOut, MessageSquare, Kanban, Star,
  Settings, PlusCircle, ChevronRight, CheckCircle2,
  Circle, Clock, AlertCircle, Eye, EyeOff, Paperclip, FolderOpen,
  LayoutDashboard, ChevronDown, ChevronUp, Pin, Shield, Bug, Camera,
  ImageIcon, FileSignature, LayoutGrid,
} from "lucide-react";
import type { Session } from "next-auth";
import { useIsMobile } from "@/lib/hooks";
import { uploadAvatar } from "@/lib/upload-client";

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = "accueil" | "messages" | "devis" | "projets" | "kanban" | "galerie" | "moodboard" | "avis" | "signalements" | "parametres";

type Report = {
  id: string; title: string; type: string; description: string;
  url?: string | null; status: string; createdAt: string;
};

type Msg = { id: string; content: string; fromAdmin: boolean; createdAt: string };

type KanbanTask = { id: string; title: string; description?: string | null; done: boolean; order: number; category?: string | null; priority?: string };
type KanbanColumn = { id: string; title: string; order: number; tasks: KanbanTask[] };
type Deliverable = { id: string; fileName: string; fileUrl: string; fileType: string; version: number; notes?: string | null; status: string; approvedAt?: string | null; createdAt: string };
type MoodboardItem = { id: string; imageUrl: string; note?: string | null; fromAdmin: boolean; createdAt: string };
type Project = {
  id: string; title: string; description?: string | null; type: string;
  budget?: string | null; status: string; paid: boolean; kanbanVisible: boolean;
  adminNotes?: string | null; projectSummary?: string | null; signedAt?: string | null; createdAt: string;
  columns: KanbanColumn[];
  deliverables: Deliverable[];
  review?: { status: string; content?: string | null; rating?: number } | null;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

async function safeFetch<T>(url: string, fallback: T): Promise<T> {
  try {
    const r = await fetch(url);
    if (!r.ok) return fallback;
    const text = await r.text();
    if (!text) return fallback;
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}
function fmtDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

const STATUS_LABEL: Record<string, string> = {
  pending: "En attente", accepted: "Accepté", active: "En cours", completed: "Livré", rejected: "Refusé",
};
const STATUS_COLOR: Record<string, string> = {
  pending: "rgba(250,204,21,0.85)", accepted: "rgba(74,222,128,0.85)",
  active: "rgba(96,165,250,0.85)", completed: "rgba(167,139,250,0.85)", rejected: "rgba(248,113,113,0.85)",
};
const STATUS_BG: Record<string, string> = {
  pending: "rgba(250,204,21,0.08)", accepted: "rgba(74,222,128,0.08)",
  active: "rgba(96,165,250,0.08)", completed: "rgba(167,139,250,0.08)", rejected: "rgba(248,113,113,0.08)",
};

const CAT_COLORS: Record<string, { color: string; bg: string }> = {
  dev:         { color: "rgba(96,165,250,1)",  bg: "rgba(96,165,250,0.12)"  },
  feature:     { color: "rgba(167,139,250,1)", bg: "rgba(167,139,250,0.12)" },
  idea:        { color: "rgba(251,146,60,1)",  bg: "rgba(251,146,60,0.12)"  },
  visual:      { color: "rgba(52,211,153,1)",  bg: "rgba(52,211,153,0.12)"  },
  integration: { color: "rgba(232,121,249,1)", bg: "rgba(232,121,249,0.12)" },
};
const CAT_LABELS: Record<string, string> = {
  dev: "Développement", feature: "Fonctionnalité", idea: "Idée",
  visual: "Visuel", integration: "Intégration",
};
const PRIO_COLORS: Record<string, string> = {
  faible: "rgba(156,163,175,0.7)", moyen: "rgba(250,204,21,0.8)", urgent: "rgba(248,113,113,0.9)",
};

// ── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({ name, image, size = 36 }: { name?: string | null; image?: string | null; size?: number }) {
  if (image) return <Image src={image} alt="" width={size} height={size} style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />;
  const initials = (name ?? "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg, rgba(60,100,255,0.6), rgba(100,60,255,0.6))", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-poppins)", fontSize: size * 0.36 + "px", fontWeight: 700, color: "white" }}>
      {initials}
    </div>
  );
}

// ── Nav item ──────────────────────────────────────────────────────────────────

function NavItem({ active, icon: Icon, label, badge, onClick }: {
  active: boolean; icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  label: string; badge?: number; onClick: () => void;
}) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: "10px",
      padding: "9px 16px", border: "none",
      borderLeft: active ? "2px solid rgba(255,255,255,0.35)" : "2px solid transparent",
      background: active ? "rgba(255,255,255,0.03)" : "transparent",
      cursor: "pointer", width: "100%", textAlign: "left",
      fontFamily: "var(--font-poppins)", transition: "all 0.15s ease",
    }}>
      <Icon size={14} color={active ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.22)"} strokeWidth={active ? 2 : 1.5} />
      <span style={{ fontSize: "11px", fontWeight: active ? 600 : 400, color: active ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.3)", flex: 1, letterSpacing: "0.2px" }}>{label}</span>
      {badge != null && badge > 0 && (
        <span style={{ fontSize: "9px", fontWeight: 600, color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.07)", padding: "1px 6px", letterSpacing: "1px" }}>{badge}</span>
      )}
    </button>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontFamily: "var(--font-poppins)", fontSize: "18px", fontWeight: 700, color: "white", letterSpacing: "-0.01em", margin: "0 0 4px" }}>{children}</h2>;
}
function SectionSub({ children }: { children: React.ReactNode }) {
  return <p style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.3)", margin: "0 0 28px", lineHeight: 1.65 }}>{children}</p>;
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: ACCUEIL (dashboard)
// ─────────────────────────────────────────────────────────────────────────────

const NAV_DESCRIPTIONS: Record<Tab, { icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>; desc: string }> = {
  accueil:      { icon: LayoutDashboard,  desc: "Vue d'ensemble de votre espace" },
  devis:        { icon: PlusCircle,       desc: "Soumettre une nouvelle demande de devis" },
  projets:      { icon: FolderOpen,       desc: "Consulter vos projets et leur statut" },
  kanban:       { icon: Kanban,           desc: "Suivre l'avancement en temps réel" },
  galerie:      { icon: ImageIcon,        desc: "Livrables et approbations en ligne" },
  moodboard:    { icon: LayoutGrid,       desc: "Références et inspirations partagées" },
  messages:     { icon: MessageSquare,    desc: "Échanger directement avec Flores" },
  signalements: { icon: Bug,              desc: "Signaler un bug ou faire une suggestion" },
  avis:         { icon: Star,             desc: "Laisser un avis sur votre projet" },
  parametres:   { icon: Settings,         desc: "Gérer votre profil et mot de passe" },
};

function TabAccueil({ user, projects, goTab }: { user: Session["user"]; projects: Project[]; goTab: (t: Tab) => void }) {
  const activeProjects = projects.filter(p => p.status !== "rejected");
  const inProgress = projects.filter(p => p.status === "active");
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";
  const hasProjects = activeProjects.length > 0;

  const stats = [
    { label: "Projets", value: projects.length, color: "rgba(96,165,250,0.8)", tab: "projets" as Tab },
    { label: "En cours", value: inProgress.length, color: "rgba(74,222,128,0.8)", tab: "kanban" as Tab },
    { label: "Messages", value: 0, color: "rgba(167,139,250,0.8)", tab: "messages" as Tab },
  ];

  const quickActions: { id: Tab; icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>; label: string; desc: string }[] = [
    { id: "devis",    icon: PlusCircle,    label: "Demande de devis",  desc: "Soumettre un nouveau brief" },
    { id: "projets",  icon: FolderOpen,    label: "Mes projets",       desc: "Suivre vos demandes" },
    { id: "galerie",  icon: ImageIcon,     label: "Livrables",         desc: "Approuver les fichiers" },
    { id: "kanban",   icon: Kanban,        label: "Kanban",            desc: "Avancement en temps réel" },
    { id: "messages", icon: MessageSquare, label: "Messagerie",        desc: "Écrire à Flores" },
  ];

  return (
    <div className="espace-accueil-grid" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "40px", alignItems: "start", height: "100%" }}>

      {/* Colonne principale */}
      <div>
        {/* Greeting */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
            <Avatar name={user?.name} image={user?.image} size={52} />
            <div>
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 300, color: "rgba(255,255,255,0.28)", margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.14em" }}>{greeting}</p>
              <h1 style={{ fontFamily: "var(--font-poppins)", fontSize: "24px", fontWeight: 800, color: "white", letterSpacing: "-0.02em", margin: 0 }}>
                {user?.name ?? "Bienvenue"} 👋
              </h1>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "10px" }}>
            {stats.map((s, i) => (
              <motion.button
                key={s.label}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => goTab(s.tab)}
                style={{
                  flex: "1 1 80px", padding: "16px 18px",
                  border: `1px solid ${s.color.replace("0.8)", "0.18)")}`,
                  background: s.color.replace("0.8)", "0.06)"),
                  cursor: "pointer", textAlign: "left", fontFamily: "var(--font-poppins)",
                  transition: "border-color 0.2s",
                }}
              >
                <p style={{ fontSize: "28px", fontWeight: 800, color: "white", margin: "0 0 4px", letterSpacing: "-0.03em" }}>{s.value}</p>
                <p style={{ fontSize: "10px", fontWeight: 500, color: s.color, margin: 0, letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.label}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Projets actifs */}
        {hasProjects ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.45 }} style={{ marginBottom: "32px" }}>
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: "9px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)", margin: "0 0 12px" }}>Vos projets</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {activeProjects.slice(0, 3).map((p, i) => {
                const total = p.columns.flatMap(c => c.tasks).length;
                const done = p.columns.flatMap(c => c.tasks).filter(t => t.done).length;
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.22 + i * 0.06 }}
                    onClick={() => goTab("projets")}
                    style={{ padding: "16px 18px", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)", cursor: "pointer", transition: "border-color 0.15s" }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px", marginBottom: total > 0 ? "12px" : 0 }}>
                      <div>
                        <p style={{ fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.85)", margin: "0 0 3px" }}>{p.title}</p>
                        <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 300, color: "rgba(255,255,255,0.28)", margin: 0 }}>{p.type}</p>
                      </div>
                      <span style={{ fontSize: "8px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: STATUS_COLOR[p.status], background: STATUS_BG[p.status], padding: "3px 10px", flexShrink: 0 }}>
                        {STATUS_LABEL[p.status] ?? p.status}
                      </span>
                    </div>
                    {total > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ flex: 1, height: "2px", background: "rgba(255,255,255,0.06)" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "rgba(74,222,128,0.6)" : "rgba(92,92,245,0.6)", transition: "width 0.4s" }} />
                        </div>
                        <span style={{ fontFamily: "var(--font-poppins)", fontSize: "9px", color: "rgba(255,255,255,0.28)", flexShrink: 0 }}>{pct}%</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* Onboarding — pas encore de projet */
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.45 }} style={{ marginBottom: "28px" }}>
            <div style={{ border: "1px solid rgba(92,92,245,0.2)", background: "rgba(92,92,245,0.04)", padding: "32px 36px", marginBottom: "12px", position: "relative", overflow: "hidden" }}>
              <span aria-hidden style={{ position: "absolute", bottom: "-16px", right: "24px", fontFamily: "var(--font-six-caps), sans-serif", fontSize: "clamp(5rem, 8vw, 9rem)", color: "rgba(92,92,245,0.06)", lineHeight: 1, pointerEvents: "none", userSelect: "none", letterSpacing: "4px" }}>DÉMARRER</span>
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "9px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(92,92,245,0.55)", margin: "0 0 10px" }}>Pas encore de projet</p>
              <h2 style={{ fontFamily: "var(--font-poppins)", fontSize: "18px", fontWeight: 800, color: "white", letterSpacing: "-0.02em", margin: "0 0 10px" }}>Prêt à démarrer ?</h2>
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 300, color: "rgba(255,255,255,0.42)", lineHeight: 1.8, margin: "0 0 22px", maxWidth: "400px" }}>
                Décrivez votre projet en quelques minutes. Flores vous répond sous 24h avec une proposition personnalisée.
              </p>
              <button onClick={() => goTab("devis")} style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", border: "1px solid rgba(92,92,245,0.5)", background: "rgba(92,92,245,0.15)", fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.85)", cursor: "pointer", letterSpacing: "0.5px", transition: "background 0.2s" }}>
                <PlusCircle size={13} /> Faire une demande de devis
              </button>
            </div>

            {/* 3 étapes */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1px", background: "rgba(255,255,255,0.05)" }}>
              {[
                { num: "01", title: "Brief",   desc: "Décrivez votre projet via le formulaire." },
                { num: "02", title: "Devis",   desc: "Recevez une proposition sous 24h." },
                { num: "03", title: "Suivi",   desc: "Avancement visible ici, en temps réel." },
              ].map((step, i) => (
                <motion.div key={step.num} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 + i * 0.07 }} style={{ background: "#0e0c0a", padding: "20px 22px" }}>
                  <p style={{ fontFamily: "var(--font-poppins)", fontSize: "8px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(92,92,245,0.45)", margin: "0 0 8px" }}>{step.num}</p>
                  <p style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.75)", margin: "0 0 5px" }}>{step.title}</p>
                  <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 300, color: "rgba(255,255,255,0.28)", margin: 0, lineHeight: 1.6 }}>{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Colonne droite */}
      <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.45 }} style={{ display: "flex", flexDirection: "column", gap: "12px", position: "sticky", top: "36px" }}>

        {/* Accès rapide */}
        <div style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.01)" }}>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "8px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.18)", margin: 0, padding: "16px 18px 12px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>Accès rapide</p>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {quickActions.map((a, i) => {
              const Icon = a.icon;
              return (
                <button key={a.id} onClick={() => goTab(a.id)} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 18px", background: "transparent", border: "none", borderBottom: i < quickActions.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", cursor: "pointer", textAlign: "left", transition: "background 0.15s" }}>
                  <Icon size={13} color="rgba(255,255,255,0.25)" strokeWidth={1.5} />
                  <div>
                    <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.65)", margin: 0 }}>{a.label}</p>
                    <p style={{ fontFamily: "var(--font-poppins)", fontSize: "9px", fontWeight: 300, color: "rgba(255,255,255,0.22)", margin: 0, lineHeight: 1.4 }}>{a.desc}</p>
                  </div>
                  <ChevronRight size={12} color="rgba(255,255,255,0.12)" style={{ marginLeft: "auto", flexShrink: 0 }} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Contact rapide */}
        <div style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.01)", padding: "20px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(74,222,128,0.7)", flexShrink: 0 }} />
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.55)", margin: 0 }}>Flores est disponible</p>
          </div>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 300, color: "rgba(255,255,255,0.28)", lineHeight: 1.7, margin: "0 0 14px" }}>
            Une question sur votre projet ? Réponse généralement sous quelques heures.
          </p>
          <button onClick={() => goTab("messages")} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "9px 14px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.55)", cursor: "pointer", letterSpacing: "0.5px", transition: "background 0.2s" }}>
            <MessageSquare size={12} /> Ouvrir la messagerie
          </button>
        </div>

        {/* Autres sections */}
        <div style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.01)" }}>
          {(["signalements", "avis", "parametres"] as Tab[]).map((t, i) => {
            const item = NAV_DESCRIPTIONS[t];
            const Icon = item.icon;
            return (
              <button key={t} onClick={() => goTab(t)} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "11px 18px", background: "transparent", border: "none", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none", cursor: "pointer", textAlign: "left" }}>
                <Icon size={12} color="rgba(255,255,255,0.2)" strokeWidth={1.5} />
                <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 500, color: "rgba(255,255,255,0.38)", margin: 0 }}>{t.charAt(0).toUpperCase() + t.slice(1)}</p>
                <ChevronRight size={11} color="rgba(255,255,255,0.1)" style={{ marginLeft: "auto" }} />
              </button>
            );
          })}
        </div>

      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: MESSAGES
// ─────────────────────────────────────────────────────────────────────────────

function ProjectSummaryPanel({ project }: { project: Project }) {
  const [open, setOpen] = useState(true);
  if (!project.projectSummary) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
      style={{ marginBottom: "8px", borderRadius: "12px", border: "1px solid rgba(250,204,21,0.18)", background: "rgba(250,204,21,0.04)", overflow: "hidden" }}
    >
      <button
        onClick={() => setOpen(v => !v)}
        style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "10px 14px", background: "none", border: "none", cursor: "pointer" }}
      >
        <Pin size={12} color="rgba(250,204,21,0.6)" />
        <span style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(250,204,21,0.65)", flex: 1, textAlign: "left" }}>
          Résumé du projet — {project.title}
        </span>
        {open ? <ChevronUp size={13} color="rgba(250,204,21,0.5)" /> : <ChevronDown size={13} color="rgba(250,204,21,0.5)" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "0 14px 14px" }}>
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
                {project.projectSummary}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function TabMessages({ user }: { user: Session["user"] }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      safeFetch<Msg[]>("/api/messages", []),
      safeFetch<Project[]>("/api/projects", []),
      safeFetch<Report[]>("/api/reports", []),
    ]).then(([msgs, projs, reps]) => {
      setMessages(msgs);
      setProjects(projs.filter(p => p.status !== "rejected"));
      setReports(reps);
      setLoading(false);
    });
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    const content = input.trim();
    if (!content || sending) return;
    setSending(true); setInput("");
    const res = await fetch("/api/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content }) });
    if (res.ok) { const msg = await res.json(); setMessages(p => [...p, msg]); }
    setSending(false);
  };

  const projectsWithSummary = projects.filter(p => p.projectSummary);
  const projectsWithoutSummary = projects.filter(p => !p.projectSummary);
  const hasContext = projects.length > 0 || reports.length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      <SectionTitle>Messagerie</SectionTitle>
      <SectionSub>Échangez directement avec Flores.</SectionSub>

      {/* Gate — no context */}
      {!loading && !hasContext && messages.length === 0 && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", textAlign: "center", padding: "32px 0" }}>
          <div style={{ width: 52, height: 52, borderRadius: "14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MessageSquare size={20} color="rgba(255,255,255,0.12)" />
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.5)", margin: "0 0 6px" }}>Aucun contexte de discussion</p>
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 300, color: "rgba(255,255,255,0.2)", margin: 0, lineHeight: 1.6 }}>
              Pour ouvrir une discussion, soumettez d&apos;abord<br />un devis ou un signalement.
            </p>
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px", paddingBottom: "16px" }}>

        {/* Pinned project summaries */}
        {!loading && projectsWithSummary.map(p => <ProjectSummaryPanel key={p.id} project={p} />)}

        {/* Regular project cards (no summary) */}
        {!loading && projectsWithoutSummary.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "8px" }}>
            {projectsWithoutSummary.map(p => (
              <div key={p.id} style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.65)" }}>{p.title}</span>
                  <span style={{ fontSize: "9px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: STATUS_COLOR[p.status], background: STATUS_BG[p.status], padding: "2px 7px", borderRadius: "999px", flexShrink: 0 }}>
                    {STATUS_LABEL[p.status] ?? p.status}
                  </span>
                  <span style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>
                    {p.type === "web" ? "Web" : p.type === "visual" ? "Visuel" : "Autre"}{p.budget ? ` · ${p.budget}` : ""}
                  </span>
                </div>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "4px 0" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(255,255,255,0.38)" }}>Échanges</span>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ color: "rgba(255,255,255,0.40)", fontSize: "12px", textAlign: "center", padding: "40px 0" }}>Chargement...</div>
        ) : messages.length === 0 ? (
          <div style={{ color: "rgba(255,255,255,0.40)", fontSize: "12px", textAlign: "center", padding: "48px 0" }}>Aucun message — envoyez le premier !</div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div key={msg.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                style={{ display: "flex", flexDirection: msg.fromAdmin ? "row" : "row-reverse", gap: "10px", alignItems: "flex-end" }}
              >
                {msg.fromAdmin ? (
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#3a6fff,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "white", flexShrink: 0 }}>F</div>
                ) : (
                  <div style={{ flexShrink: 0 }}><Avatar name={user?.name} image={user?.image} size={28} /></div>
                )}
                <div style={{ maxWidth: "75%" }}>
                  <div style={{ padding: "10px 14px", whiteSpace: "pre-wrap", wordBreak: "break-word", borderRadius: msg.fromAdmin ? "14px 14px 14px 3px" : "14px 14px 3px 14px", background: msg.fromAdmin ? "rgba(60,100,255,0.12)" : "rgba(255,255,255,0.07)", border: `1px solid ${msg.fromAdmin ? "rgba(60,100,255,0.2)" : "rgba(255,255,255,0.07)"}`, fontSize: "13px", fontWeight: 300, color: "rgba(255,255,255,0.82)", lineHeight: 1.65 }}>
                    {msg.content}
                  </div>
                  <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.38)", margin: "4px 4px 0", textAlign: msg.fromAdmin ? "left" : "right" }}>{fmtDate(msg.createdAt)}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>

      {hasContext && (
        <div style={{ paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
            <textarea
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Votre message… (Entrée pour envoyer)"
              rows={1}
              style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "10px 12px", color: "white", fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 300, lineHeight: 1.5, outline: "none", resize: "none", maxHeight: "100px", overflowY: "auto" }}
              onInput={e => { const t = e.currentTarget; t.style.height = "auto"; t.style.height = Math.min(t.scrollHeight, 100) + "px"; }}
            />
            <button onClick={send} disabled={!input.trim() || sending} style={{ width: 40, height: 40, borderRadius: "10px", flexShrink: 0, border: "1px solid rgba(255,255,255,0.08)", background: input.trim() ? "rgba(60,100,255,0.7)" : "rgba(255,255,255,0.04)", cursor: input.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Send size={15} color={input.trim() ? "white" : "rgba(255,255,255,0.2)"} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: DEVIS
// ─────────────────────────────────────────────────────────────────────────────

function BudgetSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const pct = ((value - 100) / (5000 - 100)) * 100;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <span style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", color: "rgba(255,255,255,0.22)" }}>100€</span>
        <span style={{ fontFamily: "var(--font-poppins)", fontSize: "14px", fontWeight: 700, color: "white" }}>{value >= 5000 ? "5 000€ +" : `${value.toLocaleString("fr-FR")} €`}</span>
        <span style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", color: "rgba(255,255,255,0.22)" }}>5 000€+</span>
      </div>
      <div style={{ position: "relative", paddingBottom: "16px" }}>
        <div style={{ height: "5px", borderRadius: "99px", background: "rgba(255,255,255,0.07)", position: "relative", overflow: "visible" }}>
          <div style={{ position: "absolute", left: 0, width: `${pct}%`, height: "100%", background: "linear-gradient(90deg, rgba(60,100,255,0.6), rgba(100,140,255,0.85))", borderRadius: "99px", pointerEvents: "none", transition: "width 0.05s" }} />
          <div style={{ position: "absolute", left: `calc(${pct}% - 7px)`, top: "-5px", width: "14px", height: "14px", borderRadius: "50%", background: "rgba(100,140,255,0.9)", border: "2px solid rgba(255,255,255,0.15)", pointerEvents: "none", transition: "left 0.05s" }} />
        </div>
        <input type="range" min={100} max={5000} step={50} value={value} onChange={e => onChange(Number(e.target.value))} style={{ position: "absolute", inset: 0, width: "100%", opacity: 0, cursor: "pointer", height: "24px", top: "-5px" }} />
      </div>
    </div>
  );
}

const TIME_SLOTS = [{ value: "9h-12h", label: "Matin  9h–12h" }, { value: "14h-17h", label: "Après-midi  14h–17h" }, { value: "17h-19h", label: "Soir  17h–19h" }, { value: "flexible", label: "Flexible" }];
const DEADLINES = [{ value: "urgent", label: "Urgent (moins de 2 semaines)" }, { value: "1mois", label: "1 mois environ" }, { value: "3mois", label: "2 à 3 mois" }, { value: "flexible", label: "Flexible / Pas de contrainte" }];
const CONTACTS = [{ value: "email", label: "E-mail" }, { value: "discord", label: "Discord" }, { value: "phone", label: "Téléphone" }, { value: "other", label: "Peu importe" }];

function CustomSelect({ value, onChange, options, placeholder = "Sélectionner…" }: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find(o => o.value === value);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const base: React.CSSProperties = { fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 300 };

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          ...base, width: "100%", padding: "10px 13px",
          border: `1px solid ${open ? "rgba(92,92,245,0.35)" : "rgba(255,255,255,0.08)"}`,
          background: "rgba(255,255,255,0.04)",
          color: selected ? "white" : "rgba(255,255,255,0.25)",
          outline: "none", textAlign: "left", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          transition: "border-color 0.15s",
        }}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <ChevronDown
          size={13}
          color="rgba(255,255,255,0.25)"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100,
              background: "#161414", border: "1px solid rgba(255,255,255,0.1)",
              overflow: "hidden",
            }}
          >
            {options.map((o, i) => (
              <button
                key={o.value}
                type="button"
                onClick={() => { onChange(o.value); setOpen(false); }}
                style={{
                  ...base, width: "100%", padding: "10px 14px",
                  background: value === o.value ? "rgba(92,92,245,0.1)" : "transparent",
                  border: "none",
                  borderBottom: i < options.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  borderLeft: value === o.value ? "2px solid rgba(92,92,245,0.55)" : "2px solid transparent",
                  color: value === o.value ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
                  fontWeight: value === o.value ? 500 : 300,
                  textAlign: "left", cursor: "pointer", transition: "background 0.1s",
                  display: "block",
                }}
              >
                {o.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const BRIEF_TYPES = [
  { value: "web", label: "Site web / App", desc: "Vitrine, portfolio, SaaS, outil sur mesure", emoji: "🌐" },
  { value: "visual", label: "Création visuelle", desc: "Logo, charte, cover art, print, réseaux sociaux", emoji: "🎨" },
  { value: "other", label: "Autre / Je ne sais pas encore", desc: "Décrivez votre projet librement", emoji: "💡" },
];

function TabDevis({ onSuccess }: { onSuccess: () => void }) {
  const [step, setStep] = useState(1);
  const TOTAL = 3;

  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [budget, setBudget] = useState(500);
  const [deadline, setDeadline] = useState("");
  const [references, setReferences] = useState("");

  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const [callSlots, setCallSlots] = useState<string[]>([]);
  const [briefFile, setBriefFile] = useState("");
  const [briefFileName, setBriefFileName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 13px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "white", fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 300, outline: "none", boxSizing: "border-box" as const };
  const labelStyle: React.CSSProperties = { display: "block", fontFamily: "var(--font-poppins)", fontSize: "9px", fontWeight: 600, color: "rgba(255,255,255,0.28)", textTransform: "uppercase" as const, letterSpacing: "0.18em", marginBottom: "8px" };

  const toggleSlot = (v: string) => setCallSlots(prev => prev.includes(v) ? prev.filter(s => s !== v) : [...prev, v]);
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("Fichier trop lourd (max 5 Mo)"); return; }
    setBriefFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setBriefFile(reader.result as string);
    reader.readAsDataURL(file);
  };

  const canNext = step === 1 ? (!!type && !!title.trim()) : step === 2 ? !!deadline : true;

  const handleSubmit = async () => {
    setError(""); setLoading(true);
    const res = await fetch("/api/projects", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), type, description: description.trim() || null, budget: budget >= 5000 ? "5000€+" : `${budget}€`, deadline, references: references.trim() || null, contact: contact || null, phone: contact === "phone" ? phone : undefined, callSlots: contact === "phone" && callSlots.length > 0 ? callSlots : undefined, briefFile: briefFile || undefined, briefFileName: briefFileName || undefined }),
    });
    setLoading(false);
    if (!res.ok) { const d = await res.json(); setError(d.error ?? "Erreur"); return; }
    setDone(true);
    setTimeout(onSuccess, 2000);
  };

  if (done) return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: "16px", textAlign: "center" }}>
      <div style={{ width: 60, height: 60, background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CheckCircle2 size={26} color="rgba(74,222,128,0.8)" />
      </div>
      <div>
        <p style={{ fontFamily: "var(--font-poppins)", fontSize: "18px", fontWeight: 800, color: "white", margin: "0 0 6px", letterSpacing: "-0.02em" }}>Demande envoyée.</p>
        <p style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.3)", margin: 0 }}>Flores vous répond sous 24h avec une proposition.</p>
      </div>
    </motion.div>
  );

  return (
    <div style={{ maxWidth: "620px" }}>
      {/* Header + progress */}
      <div style={{ marginBottom: "32px" }}>
        <p style={{ fontFamily: "var(--font-poppins)", fontSize: "9px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(92,92,245,0.55)", margin: "0 0 8px" }}>
          Étape {step} sur {TOTAL}
        </p>
        <div style={{ display: "flex", gap: "4px", marginBottom: "20px" }}>
          {Array.from({ length: TOTAL }, (_, i) => (
            <div key={i} style={{ flex: 1, height: "2px", background: i < step ? "rgba(92,92,245,0.7)" : "rgba(255,255,255,0.08)", transition: "background 0.3s" }} />
          ))}
        </div>
        <h2 style={{ fontFamily: "var(--font-six-caps), sans-serif", fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 400, letterSpacing: "4px", textTransform: "uppercase", color: "white", margin: 0, lineHeight: 1 }}>
          {step === 1 ? "Votre projet." : step === 2 ? "Budget & délai." : "Pour vous contacter."}
        </h2>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}>

          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <p style={labelStyle}>Quel type de projet ?</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {BRIEF_TYPES.map(t => (
                    <button key={t.value} type="button" onClick={() => setType(t.value)} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", border: `1px solid ${type === t.value ? "rgba(92,92,245,0.45)" : "rgba(255,255,255,0.07)"}`, background: type === t.value ? "rgba(92,92,245,0.08)" : "rgba(255,255,255,0.02)", cursor: "pointer", textAlign: "left", transition: "all 0.15s", borderLeft: type === t.value ? "3px solid rgba(92,92,245,0.6)" : "3px solid transparent" }}>
                      <span style={{ fontSize: "20px", flexShrink: 0 }}>{t.emoji}</span>
                      <div>
                        <p style={{ fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 600, color: type === t.value ? "white" : "rgba(255,255,255,0.6)", margin: "0 0 2px" }}>{t.label}</p>
                        <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 300, color: "rgba(255,255,255,0.3)", margin: 0 }}>{t.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p style={labelStyle}>Nommez votre projet *</p>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder={type === "web" ? "ex : Site vitrine restaurant" : type === "visual" ? "ex : Logo pour une marque de streetwear" : "ex : Refonte de mon image de marque"} style={inputStyle} />
              </div>
              <div>
                <p style={labelStyle}>Décrivez-le en quelques mots</p>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder={type === "web" ? "Cible visée, fonctionnalités souhaitées, ton de la marque…" : type === "visual" ? "Univers souhaité, concurrents à éviter, valeurs de la marque…" : "Décrivez librement votre besoin, votre contexte, vos objectifs…"} style={{ ...inputStyle, resize: "vertical" as const, minHeight: "80px" }} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
              <div>
                <p style={labelStyle}>Budget envisagé</p>
                <div style={{ padding: "14px 16px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
                  <BudgetSlider value={budget} onChange={setBudget} />
                </div>
              </div>
              <div>
                <p style={labelStyle}>Délai souhaité *</p>
                <CustomSelect value={deadline} onChange={setDeadline} options={DEADLINES} />
              </div>
              <div>
                <p style={labelStyle}>Références ou inspirations</p>
                <textarea value={references} onChange={e => setReferences(e.target.value)} rows={2} placeholder="Liens, noms de projets, styles qui vous parlent…" style={{ ...inputStyle, resize: "vertical" as const, minHeight: "60px" }} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
              <div>
                <p style={labelStyle}>Comment préférez-vous être contacté ?</p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" as const }}>
                  {CONTACTS.map(c => (
                    <button key={c.value} type="button" onClick={() => setContact(c.value)} style={{ padding: "9px 16px", border: `1px solid ${contact === c.value ? "rgba(92,92,245,0.4)" : "rgba(255,255,255,0.07)"}`, background: contact === c.value ? "rgba(92,92,245,0.1)" : "rgba(255,255,255,0.02)", fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: contact === c.value ? 600 : 300, color: contact === c.value ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)", cursor: "pointer", transition: "all 0.15s" }}>{c.label}</button>
                  ))}
                </div>
                {contact === "phone" && (
                  <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Votre numéro" style={inputStyle} />
                    <div>
                      <p style={labelStyle}>Créneaux disponibles</p>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" as const }}>
                        {TIME_SLOTS.map(s => <button key={s.value} type="button" onClick={() => toggleSlot(s.value)} style={{ padding: "7px 12px", border: `1px solid ${callSlots.includes(s.value) ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.06)"}`, background: callSlots.includes(s.value) ? "rgba(74,222,128,0.07)" : "transparent", fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: callSlots.includes(s.value) ? 600 : 300, color: callSlots.includes(s.value) ? "rgba(74,222,128,0.85)" : "rgba(255,255,255,0.35)", cursor: "pointer", transition: "all 0.15s" }}>{s.label}</button>)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <p style={labelStyle}>Brief ou document (optionnel)</p>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 14px", border: `1px solid ${briefFileName ? "rgba(92,92,245,0.25)" : "rgba(255,255,255,0.07)"}`, background: briefFileName ? "rgba(92,92,245,0.06)" : "rgba(255,255,255,0.02)", cursor: "pointer" }}>
                  <Paperclip size={13} color={briefFileName ? "rgba(92,92,245,0.6)" : "rgba(255,255,255,0.25)"} />
                  <span style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", color: briefFileName ? "rgba(92,92,245,0.8)" : "rgba(255,255,255,0.25)", flex: 1 }}>{briefFileName || "PDF, Word ou image (max 5 Mo)"}</span>
                  {briefFileName && <button type="button" onClick={e => { e.preventDefault(); setBriefFile(""); setBriefFileName(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.2)", padding: 0 }}>✕</button>}
                  <input type="file" accept=".pdf,.docx,.doc,.jpg,.jpeg,.png" onChange={handleFile} style={{ display: "none" }} />
                </label>
              </div>

              {/* Recap */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "20px" }}>
                <p style={labelStyle}>Récapitulatif</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {[
                    { k: "Type", v: BRIEF_TYPES.find(t => t.value === type)?.label ?? type },
                    { k: "Projet", v: title },
                    { k: "Budget", v: budget >= 5000 ? "5 000€+" : `${budget}€` },
                    { k: "Délai", v: DEADLINES.find(d => d.value === deadline)?.label ?? deadline },
                  ].map(row => (
                    <div key={row.k} style={{ display: "flex", gap: "12px", fontFamily: "var(--font-poppins)", fontSize: "11px" }}>
                      <span style={{ color: "rgba(255,255,255,0.28)", minWidth: "60px", fontWeight: 500, textTransform: "uppercase" as const, letterSpacing: "0.08em", fontSize: "9px", paddingTop: "1px" }}>{row.k}</span>
                      <span style={{ color: "rgba(255,255,255,0.65)" }}>{row.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* Error */}
      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 13px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)", marginTop: "16px" }}>
          <AlertCircle size={12} color="rgba(239,68,68,0.8)" />
          <span style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", color: "rgba(239,68,68,0.85)" }}>{error}</span>
        </div>
      )}

      {/* Nav */}
      <div style={{ display: "flex", gap: "10px", marginTop: "28px", alignItems: "center" }}>
        {step > 1 && (
          <button type="button" onClick={() => setStep(s => s - 1)} style={{ padding: "10px 18px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>
            ← Retour
          </button>
        )}
        {step < TOTAL ? (
          <button type="button" onClick={() => setStep(s => s + 1)} disabled={!canNext} style={{ padding: "10px 22px", border: `1px solid ${canNext ? "rgba(92,92,245,0.5)" : "rgba(255,255,255,0.08)"}`, background: canNext ? "rgba(92,92,245,0.2)" : "rgba(255,255,255,0.03)", fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 600, color: canNext ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.2)", cursor: canNext ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
            Continuer →
          </button>
        ) : (
          <button type="button" onClick={handleSubmit} disabled={loading} style={{ padding: "11px 24px", border: "1px solid rgba(92,92,245,0.5)", background: "rgba(92,92,245,0.65)", fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 600, color: "white", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1, transition: "opacity 0.2s" }}>
            {loading ? "Envoi…" : "Envoyer ma demande →"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: GALERIE DE LIVRABLES
// ─────────────────────────────────────────────────────────────────────────────

const DLVR_STATUS_LABEL: Record<string, string> = { pending: "En attente", approved: "Approuvé", revision: "Révision demandée" };
const DLVR_STATUS_COLOR: Record<string, string> = { pending: "rgba(250,204,21,0.8)", approved: "rgba(74,222,128,0.8)", revision: "rgba(248,113,113,0.8)" };
const DLVR_STATUS_BG: Record<string, string> = { pending: "rgba(250,204,21,0.07)", approved: "rgba(74,222,128,0.07)", revision: "rgba(248,113,113,0.07)" };

function TabGalerie({ projects }: { projects: Project[] }) {
  const [selectedProject, setSelectedProject] = useState<string>(projects[0]?.id ?? "");
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [localProjects, setLocalProjects] = useState(projects);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setLocalProjects(projects); }, [projects]);

  const project = localProjects.find(p => p.id === selectedProject);
  const deliverables = project?.deliverables ?? [];

  const handleAction = async (deliverableId: string, action: "approve" | "request_revision") => {
    setLoadingAction(deliverableId);
    const res = await fetch(`/api/deliverables/${deliverableId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }),
    });
    setLoadingAction(null);
    if (!res.ok) return;
    const updated = await res.json();
    setLocalProjects(prev => prev.map(p => ({
      ...p,
      deliverables: p.deliverables.map(d => d.id === deliverableId ? { ...d, status: updated.status, approvedAt: updated.approvedAt } : d),
    })));
  };

  const activeProjects = localProjects.filter(p => p.status !== "rejected" && p.deliverables.length > 0);

  if (activeProjects.length === 0) {
    return (
      <div>
        <SectionTitle>Livrables</SectionTitle>
        <SectionSub>Retrouvez ici tous les fichiers que je vous envoie, avec possibilité d&apos;approbation en ligne.</SectionSub>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "60px", gap: "12px", opacity: 0.4 }}>
          <FolderOpen size={36} color="rgba(255,255,255,0.3)" strokeWidth={1} />
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.3)", margin: 0 }}>Aucun livrable pour l&apos;instant</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionTitle>Livrables</SectionTitle>
      <SectionSub>Approuvez ou demandez une révision directement ici. Chaque approbation est horodatée.</SectionSub>

      {activeProjects.length > 1 && (
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "24px" }}>
          {activeProjects.map(p => (
            <button key={p.id} onClick={() => setSelectedProject(p.id)} style={{ padding: "7px 14px", border: `1px solid ${selectedProject === p.id ? "rgba(92,92,245,0.45)" : "rgba(255,255,255,0.07)"}`, background: selectedProject === p.id ? "rgba(92,92,245,0.1)" : "transparent", fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: selectedProject === p.id ? 600 : 300, color: selectedProject === p.id ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.35)", cursor: "pointer" }}>
              {p.title}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {deliverables.length === 0 ? (
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.25)", margin: 0 }}>Aucun livrable pour ce projet.</p>
        ) : deliverables.map(d => (
          <motion.div key={d.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 18px", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
            {/* Preview ou icône */}
            <div style={{ width: 44, height: 44, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
              {d.fileType === "image" ? (
                <Image src={d.fileUrl} alt={d.fileName} width={44} height={44} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: "18px" }}>{d.fileType === "pdf" ? "📄" : "📦"}</span>
              )}
            </div>

            {/* Infos */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.82)", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.fileName}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontFamily: "var(--font-poppins)", fontSize: "9px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em", color: DLVR_STATUS_COLOR[d.status] ?? "rgba(255,255,255,0.4)", background: DLVR_STATUS_BG[d.status] ?? "transparent", padding: "2px 8px" }}>
                  {DLVR_STATUS_LABEL[d.status] ?? d.status}
                </span>
                {d.version > 1 && <span style={{ fontFamily: "var(--font-poppins)", fontSize: "9px", color: "rgba(255,255,255,0.25)" }}>v{d.version}</span>}
                {d.approvedAt && <span style={{ fontFamily: "var(--font-poppins)", fontSize: "9px", color: "rgba(74,222,128,0.5)" }}>✓ {fmtDateShort(d.approvedAt)}</span>}
              </div>
              {d.notes && <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 300, color: "rgba(255,255,255,0.3)", margin: "4px 0 0", lineHeight: 1.5 }}>{d.notes}</p>}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
              <a href={d.fileUrl} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 12px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 500, color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>
                <Eye size={11} /> Voir
              </a>
              {d.status === "pending" && (
                <>
                  <button onClick={() => handleAction(d.id, "approve")} disabled={loadingAction === d.id} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 12px", border: "1px solid rgba(74,222,128,0.3)", background: "rgba(74,222,128,0.07)", fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 600, color: "rgba(74,222,128,0.85)", cursor: "pointer", transition: "all 0.15s" }}>
                    <CheckCircle2 size={11} /> Approuver
                  </button>
                  <button onClick={() => handleAction(d.id, "request_revision")} disabled={loadingAction === d.id} style={{ padding: "6px 12px", border: "1px solid rgba(248,113,113,0.25)", background: "rgba(248,113,113,0.06)", fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 500, color: "rgba(248,113,113,0.7)", cursor: "pointer" }}>
                    Révision
                  </button>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: PROJETS
// ─────────────────────────────────────────────────────────────────────────────

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} onClick={onOpen} style={{ padding: "18px 20px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)", cursor: "pointer", transition: "border-color 0.2s" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "10px" }}>
        <div>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.85)", margin: "0 0 4px" }}>{project.title}</p>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 300, color: "rgba(255,255,255,0.25)", margin: 0 }}>{fmtDateShort(project.createdAt)}</p>
        </div>
        <span style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: STATUS_COLOR[project.status], background: STATUS_BG[project.status], border: `1px solid ${STATUS_COLOR[project.status]}22`, padding: "3px 9px", borderRadius: "999px", flexShrink: 0, fontFamily: "var(--font-poppins)" }}>
          {STATUS_LABEL[project.status] ?? project.status}
        </span>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <span style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", color: "rgba(100,140,255,0.5)", display: "flex", alignItems: "center", gap: "4px" }}>Voir <ChevronRight size={11} /></span>
      </div>
    </motion.div>
  );
}

function TabProjets({ onRequestDevis, onMessage }: { onRequestDevis: () => void; onMessage: () => void }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Project | null>(null);
  const [signing, setSigning] = useState(false);
  const [signedNow, setSignedNow] = useState(false);

  useEffect(() => {
    safeFetch<Project[]>("/api/projects", []).then(data => { setProjects(data); setLoading(false); });
  }, []);

  const handleSign = async (projectId: string) => {
    setSigning(true);
    const res = await fetch(`/api/projects/${projectId}/sign`, { method: "POST" });
    setSigning(false);
    if (!res.ok) return;
    const { signedAt } = await res.json();
    setSelected(prev => prev ? { ...prev, signedAt } : prev);
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, signedAt } : p));
    setSignedNow(true);
    setTimeout(() => setSignedNow(false), 3000);
  };

  if (selected) return (
    <div style={{ maxWidth: "640px" }}>
      <button onClick={() => setSelected(null)} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-poppins)", fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: "20px", padding: 0 }}>← Retour aux projets</button>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "6px" }}>
        <SectionTitle>{selected.title}</SectionTitle>
        <span style={{ fontSize: "9px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: STATUS_COLOR[selected.status], background: STATUS_BG[selected.status], padding: "4px 10px", fontFamily: "var(--font-poppins)", flexShrink: 0 }}>{STATUS_LABEL[selected.status] ?? selected.status}</span>
      </div>
      <SectionSub>{fmtDateShort(selected.createdAt)} · {selected.type === "web" ? "Web" : selected.type === "visual" ? "Visuel" : "Autre"}{selected.budget ? ` · ${selected.budget}` : ""}</SectionSub>

      {selected.description && (
        <div style={{ padding: "14px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: "16px" }}>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: 0 }}>{selected.description}</p>
        </div>
      )}

      {selected.adminNotes && (
        <div style={{ padding: "14px 16px", background: "rgba(92,92,245,0.04)", border: "1px solid rgba(92,92,245,0.15)", marginBottom: "16px" }}>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "9px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(92,92,245,0.55)", margin: "0 0 6px" }}>Note de Flores</p>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0 }}>{selected.adminNotes}</p>
        </div>
      )}

      {/* Signature de devis */}
      {selected.status === "accepted" && !selected.signedAt && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ padding: "20px 22px", border: "1px solid rgba(92,92,245,0.3)", background: "rgba(92,92,245,0.05)", marginBottom: "16px" }}>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "9px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(92,92,245,0.6)", margin: "0 0 8px" }}>Devis accepté · En attente de signature</p>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: "0 0 16px" }}>
            Signez le devis en ligne pour valider votre commande et permettre à Flores de démarrer le projet.
          </p>
          <button onClick={() => handleSign(selected.id)} disabled={signing} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", border: "1px solid rgba(92,92,245,0.5)", background: "rgba(92,92,245,0.18)", fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.9)", cursor: signing ? "not-allowed" : "pointer", opacity: signing ? 0.6 : 1, transition: "all 0.2s" }}>
            <FileSignature size={14} /> {signing ? "Signature en cours…" : "Je signe et valide ce devis"}
          </button>
        </motion.div>
      )}

      {(selected.signedAt || signedNow) && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", border: "1px solid rgba(74,222,128,0.2)", background: "rgba(74,222,128,0.05)", marginBottom: "16px" }}>
          <CheckCircle2 size={14} color="rgba(74,222,128,0.7)" />
          <span style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", color: "rgba(74,222,128,0.7)" }}>
            Devis signé le {fmtDateShort(selected.signedAt!)}
          </span>
        </motion.div>
      )}

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
        <button onClick={onMessage} style={{ display: "flex", alignItems: "center", gap: "7px", padding: "9px 14px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,0.45)", cursor: "pointer" }}>
          <MessageSquare size={13} /> Contacter Flores
        </button>
      </div>

      {!selected.paid && !selected.signedAt && selected.status === "pending" && (
        <div style={{ marginTop: "16px", padding: "12px 16px", background: "rgba(250,204,21,0.03)", border: "1px solid rgba(250,204,21,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <Clock size={12} color="rgba(250,204,21,0.45)" />
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", color: "rgba(255,255,255,0.28)" }}>En attente de réponse. Flores vous répond sous 24h.</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "4px" }}>
        <SectionTitle>Mes projets</SectionTitle>
        <button onClick={onRequestDevis} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "9px", border: "1px solid rgba(60,100,255,0.25)", background: "rgba(60,100,255,0.1)", fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 600, color: "rgba(100,140,255,0.8)", cursor: "pointer" }}>
          <PlusCircle size={13} /> Nouveau devis
        </button>
      </div>
      <SectionSub>Retrouvez toutes vos demandes et leur statut.</SectionSub>
      {loading ? (
        <div style={{ color: "rgba(255,255,255,0.40)", fontSize: "12px", textAlign: "center", padding: "40px 0" }}>Chargement...</div>
      ) : projects.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <div style={{ width: 48, height: 48, borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Kanban size={20} color="rgba(255,255,255,0.15)" />
          </div>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.25)", margin: 0 }}>Aucun projet pour l&apos;instant</p>
          <button onClick={onRequestDevis} style={{ padding: "9px 18px", borderRadius: "9px", border: "1px solid rgba(60,100,255,0.3)", background: "rgba(60,100,255,0.12)", fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 600, color: "rgba(100,140,255,0.8)", cursor: "pointer" }}>Faire une demande de devis</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {projects.map(p => <ProjectCard key={p.id} project={p} onOpen={() => setSelected(p)} />)}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: KANBAN (client read-only)
// ─────────────────────────────────────────────────────────────────────────────

const COL_COLOR: Record<string, string> = {
  "À faire": "rgba(255,255,255,0.35)", "En cours": "rgba(96,165,250,0.8)",
  "Bloquée": "rgba(248,113,113,0.8)", "En review": "rgba(250,204,21,0.8)", "Fait": "rgba(74,222,128,0.8)",
};

function TabKanban({ goMessages, setMsgPrefill }: { goMessages: () => void; setMsgPrefill: (v: string) => void }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    safeFetch<Project[]>("/api/projects", []).then(data => {
      setProjects(data);
      setLoading(false);
      const first = data.find(p => p.kanbanVisible);
      if (first) setSelectedId(first.id);
    });
  }, []);

  const activeProjects = projects.filter(p => p.kanbanVisible);
  const selected = projects.find(p => p.id === selectedId);

  const handleTaskClick = (task: KanbanTask) => {
    setMsgPrefill(`[Tâche : ${task.title}] `);
    goMessages();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "16px", flexShrink: 0 }}>
        <div>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "15px", fontWeight: 700, color: "white", margin: 0, letterSpacing: "-0.01em" }}>Kanban</p>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 300, color: "rgba(255,255,255,0.25)", margin: 0 }}>Cliquez sur une tâche pour en discuter avec Flores.</p>
        </div>
      </div>

      {loading ? (
        <div style={{ color: "rgba(255,255,255,0.40)", fontSize: "12px", textAlign: "center", padding: "40px 0" }}>Chargement...</div>
      ) : activeProjects.length === 0 ? (
        <div style={{ textAlign: "center", padding: "56px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
          <div style={{ width: 56, height: 56, borderRadius: "14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Kanban size={22} color="rgba(255,255,255,0.12)" />
          </div>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.3)", margin: 0 }}>Aucun kanban disponible</p>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", color: "rgba(255,255,255,0.45)", margin: 0 }}>Le kanban apparaîtra dès que Flores l&apos;aura activé sur votre projet.</p>
        </div>
      ) : (
        <>
          {activeProjects.length > 1 && (
            <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
              {activeProjects.map(p => (
                <button key={p.id} onClick={() => setSelectedId(p.id)} style={{ padding: "7px 14px", borderRadius: "9px", cursor: "pointer", border: `1px solid ${selectedId === p.id ? "rgba(60,100,255,0.35)" : "rgba(255,255,255,0.07)"}`, background: selectedId === p.id ? "rgba(60,100,255,0.12)" : "rgba(255,255,255,0.02)", fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: selectedId === p.id ? 600 : 400, color: selectedId === p.id ? "rgba(100,140,255,0.9)" : "rgba(255,255,255,0.4)" }}>
                  {p.title}
                </button>
              ))}
            </div>
          )}
          {selected && (() => {
            const allTasks = selected.columns.flatMap(c => c.tasks);
            const total = allTasks.length;
            const done = allTasks.filter(t => t.done).length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            const sortedCols = [...selected.columns].sort((a, b) => a.order - b.order);
            return (
              <>
                {total > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                    <span style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>{done}/{total} tâches terminées</span>
                    <div style={{ flex: 1, height: "4px", borderRadius: "99px", background: "rgba(255,255,255,0.06)" }}>
                      <div style={{ height: "100%", width: `${pct}%`, borderRadius: "99px", background: pct === 100 ? "rgba(74,222,128,0.6)" : "rgba(100,140,255,0.6)", transition: "width 0.4s" }} />
                    </div>
                    <span style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.45)" }}>{pct}%</span>
                  </div>
                )}
                <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "16px", flex: 1 }}>
                  {sortedCols.map(col => {
                    const accent = COL_COLOR[col.title] ?? "rgba(255,255,255,0.35)";
                    return (
                      <div key={col.id} style={{ flex: "0 0 260px", minWidth: "260px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: accent }} />
                          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "rgba(255,255,255,0.45)", margin: 0 }}>
                            {col.title}
                          </p>
                          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)", padding: "1px 6px", borderRadius: "999px" }}>{col.tasks.length}</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          {col.tasks.map(task => {
                            const cat = task.category ? { label: CAT_LABELS[task.category], ...CAT_COLORS[task.category] } : null;
                            const prioColor = task.priority ? PRIO_COLORS[task.priority] : PRIO_COLORS.moyen;
                            return (
                              <motion.div
                                key={task.id}
                                whileHover={{ scale: 1.01 }}
                                onClick={() => handleTaskClick(task)}
                                style={{ padding: "10px 12px", borderRadius: "10px", background: task.done ? "rgba(74,222,128,0.06)" : "rgba(255,255,255,0.05)", border: `1px solid ${task.done ? "rgba(74,222,128,0.2)" : "rgba(255,255,255,0.1)"}`, cursor: "pointer", transition: "border-color 0.15s" }}
                              >
                                {cat && (
                                  <div style={{ marginBottom: "5px" }}>
                                    <span style={{ fontSize: "8px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: cat.color, background: cat.bg, padding: "2px 6px", borderRadius: "999px" }}>{cat.label}</span>
                                  </div>
                                )}
                                <div style={{ display: "flex", gap: "7px", alignItems: "flex-start" }}>
                                  {task.done ? <CheckCircle2 size={12} color="rgba(74,222,128,0.6)" style={{ marginTop: "1px", flexShrink: 0 }} /> : <Circle size={12} color="rgba(255,255,255,0.15)" style={{ marginTop: "1px", flexShrink: 0 }} />}
                                  <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: task.done ? 300 : 500, color: task.done ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.75)", margin: 0, textDecoration: task.done ? "line-through" : "none", lineHeight: 1.4 }}>{task.title}</p>
                                </div>
                                {task.description && <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 300, color: "rgba(255,255,255,0.25)", margin: "4px 0 0 19px", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{task.description}</p>}
                                {task.priority && task.priority !== "moyen" && (
                                  <div style={{ marginTop: "6px", display: "flex", justifyContent: "flex-end" }}>
                                    <span style={{ fontSize: "8px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: prioColor, padding: "1px 6px", borderRadius: "999px", background: prioColor.replace("0.9)", "0.08)").replace("0.7)", "0.08)") }}>{task.priority}</span>
                                  </div>
                                )}
                              </motion.div>
                            );
                          })}
                          {col.tasks.length === 0 && (
                            <div style={{ padding: "14px 12px", borderRadius: "9px", border: "1px dashed rgba(255,255,255,0.05)", textAlign: "center", fontSize: "10px", color: "rgba(255,255,255,0.12)" }}>Vide</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            );
          })()}
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: MOODBOARD
// ─────────────────────────────────────────────────────────────────────────────

function TabMoodboard({ projects }: { projects: Project[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [items, setItems] = useState<MoodboardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const withDeliverables = projects.filter(p => p.status !== "rejected");

  useEffect(() => {
    const first = withDeliverables[0]?.id ?? null;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (first && !selectedId) setSelectedId(first);
  }, [projects]);

  useEffect(() => {
    if (!selectedId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    safeFetch<MoodboardItem[]>(`/api/moodboard/${selectedId}`, []).then(data => {
      setItems(data);
      setLoading(false);
    });
  }, [selectedId]);

  return (
    <div>
      <SectionTitle>Moodboard</SectionTitle>
      <SectionSub>Références visuelles et inspirations partagées par Flores pour votre projet.</SectionSub>

      {/* Project selector */}
      {withDeliverables.length > 1 && (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
          {withDeliverables.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              style={{
                padding: "6px 16px", border: "none", cursor: "pointer",
                fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: selectedId === p.id ? 600 : 400,
                color: selectedId === p.id ? "white" : "rgba(255,255,255,0.35)",
                background: selectedId === p.id ? "rgba(92,92,245,0.18)" : "rgba(255,255,255,0.03)",
                borderBottom: selectedId === p.id ? "1px solid rgba(92,92,245,0.5)" : "1px solid transparent",
                transition: "all 0.15s",
              }}
            >
              {p.title}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", cursor: "zoom-out" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: "6px" }} onClick={e => e.stopPropagation()} />
        </div>
      )}

      {loading ? (
        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", textAlign: "center", padding: "40px 0" }}>Chargement…</div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "52px 0" }}>
          <LayoutGrid size={26} color="rgba(255,255,255,0.08)" style={{ marginBottom: "14px" }} />
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.2)", margin: 0, lineHeight: 1.65 }}>
            Aucune image pour l&apos;instant.<br />Flores partage ici les références de votre projet.
          </p>
        </div>
      ) : (
        <div style={{ columns: "3 180px", gap: "10px" }}>
          {items.map(item => (
            <div
              key={item.id}
              onClick={() => setLightbox(item.imageUrl)}
              style={{ breakInside: "avoid", marginBottom: "10px", cursor: "zoom-in", position: "relative", overflow: "hidden", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageUrl}
                alt={item.note ?? ""}
                style={{ width: "100%", display: "block", objectFit: "cover", transition: "transform 0.3s ease" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              />
              {item.note && (
                <div style={{ padding: "8px 10px", fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 300, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
                  {item.note}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: AVIS

// ─────────────────────────────────────────────────────────────────────────────

function StarRating({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button" onClick={() => onChange(n)} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}>
          <Star size={20} fill={n <= value ? "rgba(250,204,21,0.8)" : "none"} color={n <= value ? "rgba(250,204,21,0.8)" : "rgba(255,255,255,0.15)"} />
        </button>
      ))}
    </div>
  );
}

function TabAvis() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => { safeFetch<Project[]>("/api/projects", []).then(data => { setProjects(data); setLoading(false); }); }, []);

  const reviewableProject = projects.find(p => p.review?.status === "requested");
  const submittedProjects = projects.filter(p => p.review?.status === "submitted" || p.review?.status === "approved");

  const handleSubmit = async (e: React.FormEvent) => {
    if (!reviewableProject) return;
    e.preventDefault(); setError(""); setSubmitting(true);
    const res = await fetch(`/api/reviews/${reviewableProject.id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content, rating }) });
    setSubmitting(false);
    if (!res.ok) { const d = await res.json(); setError(d.error ?? "Erreur"); return; }
    setDone(true);
  };

  if (loading) return <div style={{ color: "rgba(255,255,255,0.40)", fontSize: "12px", textAlign: "center", padding: "40px 0" }}>Chargement...</div>;

  return (
    <div>
      <SectionTitle>Avis</SectionTitle>
      <SectionSub>Partagez votre expérience avec Flores.</SectionSub>
      {reviewableProject && !done && (
        <div style={{ marginBottom: "32px" }}>
          <div style={{ padding: "12px 16px", borderRadius: "10px", background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.15)", marginBottom: "20px" }}>
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", color: "rgba(96,165,250,0.7)", margin: 0 }}>Vous êtes invité à laisser un avis pour <strong style={{ color: "rgba(255,255,255,0.65)" }}>{reviewableProject.title}</strong></p>
          </div>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div><label style={{ display: "block", fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 500, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "8px" }}>Note</label><StarRating value={rating} onChange={setRating} /></div>
            <div><label style={{ display: "block", fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 500, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "6px" }}>Votre avis *</label>
              <textarea value={content} onChange={e => setContent(e.target.value)} rows={5} required placeholder="Décrivez votre expérience…" style={{ width: "100%", padding: "10px 13px", borderRadius: "10px", resize: "vertical", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "white", fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 300, outline: "none", lineHeight: 1.6, boxSizing: "border-box" }} />
            </div>
            {error && <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", color: "rgba(239,68,68,0.8)", margin: 0 }}>{error}</p>}
            <button type="submit" disabled={submitting || !content.trim()} style={{ padding: "11px 24px", borderRadius: "10px", border: "1px solid rgba(100,140,255,0.3)", background: "rgba(60,100,255,0.6)", fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 600, color: "white", cursor: (submitting || !content.trim()) ? "not-allowed" : "pointer", opacity: (submitting || !content.trim()) ? 0.5 : 1, alignSelf: "flex-start" }}>
              {submitting ? "Envoi…" : "Soumettre mon avis →"}
            </button>
          </form>
        </div>
      )}
      {done && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ padding: "20px", borderRadius: "12px", background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.15)", display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <CheckCircle2 size={18} color="rgba(74,222,128,0.7)" />
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 400, color: "rgba(255,255,255,0.55)", margin: 0 }}>Merci ! Votre avis est en cours de validation.</p>
        </motion.div>
      )}
      {submittedProjects.length > 0 && (
        <div>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(255,255,255,0.2)", margin: "0 0 14px" }}>Avis soumis</p>
          {submittedProjects.map(p => (
            <div key={p.id} style={{ padding: "18px 20px", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: p.review?.content ? "12px" : 0 }}>
                <div>
                  <p style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.65)", margin: "0 0 6px" }}>{p.title}</p>
                  {p.review?.rating != null && (
                    <div style={{ display: "flex", gap: "3px" }}>
                      {[1,2,3,4,5].map(n => (
                        <Star key={n} size={12} fill={n <= (p.review?.rating ?? 0) ? "rgba(250,204,21,0.8)" : "none"} color={n <= (p.review?.rating ?? 0) ? "rgba(250,204,21,0.8)" : "rgba(255,255,255,0.12)"} />
                      ))}
                    </div>
                  )}
                </div>
                <span style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 600, color: p.review?.status === "approved" ? "rgba(74,222,128,0.7)" : "rgba(250,204,21,0.6)", flexShrink: 0, marginLeft: "12px" }}>
                  {p.review?.status === "approved" ? "✓ Validé" : "En attente"}
                </span>
              </div>
              {p.review?.content && (
                <p style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.7, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "12px" }}>
                  {p.review.content}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
      {!reviewableProject && submittedProjects.length === 0 && !loading && (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <Star size={24} color="rgba(255,255,255,0.1)" style={{ marginBottom: "12px" }} />
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.2)", margin: 0 }}>Aucune invitation à laisser un avis pour l&apos;instant.<br />Je vous contacterai à la fin de votre projet.</p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: PARAMÈTRES
// ─────────────────────────────────────────────────────────────────────────────

function DiscordLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: "rgba(173,179,255,0.9)", flexShrink: 0 }}>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.014.043.031.055a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
    </svg>
  );
}

function TabParametres({ user }: { user: Session["user"] }) {
  const [name, setName] = useState(user?.name ?? "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.image ?? null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [discordLinked, setDiscordLinked] = useState<boolean | null>(null);

  const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 13px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "white", fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 300, outline: "none", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 500, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "6px" };

  useEffect(() => {
    safeFetch<{ discordId?: string }>("/api/profile", {}).then(d => setDiscordLinked(!!d?.discordId));
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    setError(""); setSuccess("");
    try {
      const imageUrl = await uploadAvatar(file);
      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });
      if (!res.ok) throw new Error("Erreur lors de l'upload.");
      const d = await res.json();
      setAvatarUrl(d.image);
      setSuccess("Photo de profil mise à jour.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'upload.");
    } finally {
      setAvatarUploading(false);
      e.target.value = "";
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setSuccess(""); setLoading(true);
    const body: Record<string, string> = {};
    if (name !== user?.name) body.name = name;
    if (newPassword) { body.currentPassword = currentPassword; body.newPassword = newPassword; }
    if (Object.keys(body).length === 0) { setLoading(false); setError("Aucune modification"); return; }
    const res = await fetch("/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setLoading(false);
    if (!res.ok) { const d = await res.json(); setError(d.error ?? "Erreur"); return; }
    setSuccess("Modifications enregistrées."); setCurrentPassword(""); setNewPassword("");
  };

  return (
    <div>
      <SectionTitle>Paramètres</SectionTitle>
      <SectionSub>Modifiez votre profil et vos informations de connexion.</SectionSub>
      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "480px" }}>

        {/* Avatar + identity */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ position: "relative", display: "inline-block", flexShrink: 0 }}>
            <Avatar name={user?.name} image={avatarUrl} size={56} />
            <label style={{
              position: "absolute", bottom: -2, right: -2,
              width: 22, height: 22, borderRadius: "50%",
              background: "rgba(60,100,255,0.85)", border: "2px solid #0e0c0a",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: avatarUploading ? "not-allowed" : "pointer",
            }}>
              <Camera size={11} color="white" />
              <input type="file" accept="image/*,image/webp,image/avif" style={{ display: "none" }} onChange={handleAvatarUpload} disabled={avatarUploading} />
            </label>
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.75)", margin: "0 0 3px" }}>{user?.name}</p>
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 300, color: "rgba(255,255,255,0.25)", margin: 0 }}>{user?.email}</p>
            {avatarUploading && <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", color: "rgba(96,165,250,0.6)", margin: "4px 0 0" }}>Upload en cours…</p>}
          </div>
        </div>

        <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />

        <div><label style={labelStyle}>Nom affiché</label><input type="text" value={name} onChange={e => setName(e.target.value)} style={inputStyle} /></div>

        <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />
        <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.25)", margin: "0 -4px", textTransform: "uppercase", letterSpacing: "0.14em" }}>Changer le mot de passe</p>
        <div><label style={labelStyle}>Mot de passe actuel</label><input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="••••••••" style={inputStyle} autoComplete="current-password" /></div>
        <div><label style={labelStyle}>Nouveau mot de passe</label>
          <div style={{ position: "relative" }}>
            <input type={showNew ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="8 caractères minimum" minLength={8} style={{ ...inputStyle, paddingRight: "38px" }} autoComplete="new-password" />
            <button type="button" onClick={() => setShowNew(v => !v)} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", display: "flex" }}>
              {showNew ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
          </div>
        </div>

        {error && <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", color: "rgba(239,68,68,0.8)", margin: 0 }}>{error}</p>}
        {success && <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", color: "rgba(74,222,128,0.75)", margin: 0 }}>✓ {success}</p>}
        <button type="submit" disabled={loading} style={{ padding: "11px 24px", borderRadius: "10px", border: "1px solid rgba(60,100,255,0.3)", background: "rgba(60,100,255,0.6)", fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 600, color: "white", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.5 : 1, alignSelf: "flex-start" }}>
          {loading ? "Enregistrement…" : "Sauvegarder"}
        </button>
      </form>

      {/* Comptes liés */}
      <div style={{ marginTop: "36px", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.05)", maxWidth: "480px" }}>
        <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.18em", margin: "0 0 14px" }}>Comptes liés</p>
        {discordLinked === null ? (
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", color: "rgba(255,255,255,0.15)" }}>Chargement…</p>
        ) : discordLinked ? (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", borderRadius: "12px", border: "1px solid rgba(88,101,242,0.3)", background: "rgba(88,101,242,0.07)" }}>
            <DiscordLogo />
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 600, color: "rgba(173,179,255,0.9)", margin: 0 }}>Discord</p>
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 300, color: "rgba(173,179,255,0.45)", margin: "2px 0 0" }}>Compte associé</p>
            </div>
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 700, color: "rgba(74,222,128,0.75)", letterSpacing: "0.1em" }}>✓ LIÉ</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => signIn("discord", { callbackUrl: "/espace" })}
            style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid rgba(88,101,242,0.22)", background: "rgba(88,101,242,0.06)", cursor: "pointer", textAlign: "left", transition: "border-color 0.15s, background 0.15s" }}
          >
            <DiscordLogo />
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 600, color: "rgba(173,179,255,0.8)", margin: 0 }}>Lier mon compte Discord</p>
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 300, color: "rgba(173,179,255,0.35)", margin: "2px 0 0" }}>Connectez-vous via Discord pour lier les deux comptes</p>
            </div>
            <ChevronRight size={14} color="rgba(173,179,255,0.4)" />
          </button>
        )}
      </div>

      {/* Déconnexion */}
      <div style={{ marginTop: "28px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.05)", maxWidth: "480px" }}>
        <button onClick={() => signOut({ callbackUrl: "/" })} style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 500, color: "rgba(248,113,113,0.55)", padding: 0 }}>
          <LogOut size={13} /> Se déconnecter
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: SIGNALEMENTS
// ─────────────────────────────────────────────────────────────────────────────

const REPORT_TYPES = [
  { value: "bug",        label: "Bug / Dysfonctionnement" },
  { value: "suggestion", label: "Suggestion d'amélioration" },
  { value: "autre",      label: "Autre" },
];
const REPORT_STATUS_LABEL: Record<string, string> = {
  open: "Ouvert", seen: "Vu", resolved: "Résolu", closed: "Fermé",
};
const REPORT_STATUS_COLOR: Record<string, string> = {
  open: "rgba(250,204,21,0.85)", seen: "rgba(96,165,250,0.85)",
  resolved: "rgba(74,222,128,0.85)", closed: "rgba(156,163,175,0.7)",
};

function TabSignalements({ onGoMessages }: { onGoMessages: () => void }) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("bug");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 13px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "white", fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 300, outline: "none", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 500, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "6px" };

  useEffect(() => {
    safeFetch<Report[]>("/api/reports", []).then(data => { setReports(data); setLoading(false); });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setSubmitting(true);
    const res = await fetch("/api/reports", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, type, description, url: url || undefined }) });
    setSubmitting(false);
    if (!res.ok) { const d = await res.json(); setError(d.error ?? "Erreur"); return; }
    const created = await res.json();
    setReports(prev => [created, ...prev]);
    setTitle(""); setType("bug"); setDescription(""); setUrl(""); setDone(true);
    setTimeout(() => setDone(false), 3000);
  };

  return (
    <div>
      <SectionTitle>Signalements</SectionTitle>
      <SectionSub>Signalez un bug ou proposez une amélioration sur le site. Chaque signalement ouvre une discussion.</SectionSub>

      {/* Form */}
      <div style={{ marginBottom: "36px", padding: "20px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
        <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.16em", color: "rgba(255,255,255,0.2)", margin: "0 0 16px" }}>Nouveau signalement</p>
        {done && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 13px", borderRadius: "9px", background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.18)", marginBottom: "14px" }}>
            <CheckCircle2 size={13} color="rgba(74,222,128,0.7)" />
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", color: "rgba(74,222,128,0.8)" }}>Signalement envoyé — vous pouvez maintenant en discuter via la messagerie.</span>
          </motion.div>
        )}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div><label style={labelStyle}>Résumé *</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="ex : Le formulaire de contact ne s'envoie pas" required style={inputStyle} /></div>
          <div>
            <label style={labelStyle}>Type</label>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {REPORT_TYPES.map(t => (
                <button key={t.value} type="button" onClick={() => setType(t.value)} style={{ padding: "7px 13px", borderRadius: "8px", cursor: "pointer", border: `1px solid ${type === t.value ? "rgba(60,100,255,0.35)" : "rgba(255,255,255,0.07)"}`, background: type === t.value ? "rgba(60,100,255,0.12)" : "rgba(255,255,255,0.02)", fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: type === t.value ? 600 : 400, color: type === t.value ? "rgba(100,140,255,0.9)" : "rgba(255,255,255,0.4)", transition: "all 0.15s" }}>{t.label}</button>
              ))}
            </div>
          </div>
          <div><label style={labelStyle}>Description *</label><textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Décrivez le problème ou la suggestion en détail…" required style={{ ...inputStyle, resize: "vertical", minHeight: "72px" }} /></div>
          <div><label style={labelStyle}>URL concernée (optionnel)</label><input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://…" style={inputStyle} /></div>
          {error && <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", color: "rgba(239,68,68,0.8)", margin: 0 }}>{error}</p>}
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button type="submit" disabled={submitting || !title || !description} style={{ padding: "10px 20px", borderRadius: "9px", border: "1px solid rgba(60,100,255,0.3)", background: "rgba(60,100,255,0.6)", fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 600, color: "white", cursor: (submitting || !title || !description) ? "not-allowed" : "pointer", opacity: (submitting || !title || !description) ? 0.5 : 1 }}>
              {submitting ? "Envoi…" : "Envoyer →"}
            </button>
            {done && <button type="button" onClick={onGoMessages} style={{ padding: "10px 14px", borderRadius: "9px", border: "1px solid rgba(74,222,128,0.25)", background: "rgba(74,222,128,0.07)", fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 600, color: "rgba(74,222,128,0.8)", cursor: "pointer" }}>Ouvrir la messagerie →</button>}
          </div>
        </form>
      </div>

      {/* List */}
      {!loading && reports.length > 0 && (
        <div>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(255,255,255,0.2)", margin: "0 0 12px" }}>Mes signalements</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {reports.map(r => (
              <div key={r.id} style={{ padding: "14px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px", marginBottom: "4px" }}>
                  <p style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.75)", margin: 0 }}>{r.title}</p>
                  <span style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: REPORT_STATUS_COLOR[r.status], flexShrink: 0, fontFamily: "var(--font-poppins)" }}>{REPORT_STATUS_LABEL[r.status] ?? r.status}</span>
                </div>
                <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 300, color: "rgba(255,255,255,0.25)", margin: 0 }}>
                  {REPORT_TYPES.find(t => t.value === r.type)?.label ?? r.type} · {new Date(r.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE MORE MENU
// ─────────────────────────────────────────────────────────────────────────────

function MobileMoreMenu({
  navItems, currentTab, onSelect, active,
}: {
  navItems: { id: Tab; icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>; label: string }[];
  currentTab: Tab; onSelect: (t: Tab) => void; active: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 59 }}
        />
      )}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          style={{
            position: "fixed", bottom: "68px", right: "8px", zIndex: 61,
            background: "rgba(20,18,16,0.97)",
            border: "1px solid rgba(255,255,255,0.09)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderRadius: "14px",
            overflow: "hidden",
            minWidth: "180px",
          }}
        >
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onSelect(item.id); setOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  width: "100%", padding: "12px 18px",
                  background: isActive ? "rgba(255,255,255,0.04)" : "none",
                  border: "none", borderLeft: isActive ? "2px solid rgba(255,255,255,0.3)" : "2px solid transparent",
                  cursor: "pointer",
                }}
              >
                <Icon size={14} color={isActive ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.3)"} strokeWidth={isActive ? 2 : 1.5} />
                <span style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: isActive ? 600 : 400, color: isActive ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.4)" }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </motion.div>
      )}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: "3px",
          background: "none", border: "none", cursor: "pointer",
          borderTop: active || open ? "2px solid rgba(255,255,255,0.35)" : "2px solid transparent",
          transition: "border-color 0.15s",
        }}
      >
        <ChevronUp
          size={16}
          color={active || open ? "rgba(255,255,255,0.78)" : "rgba(255,255,255,0.22)"}
          strokeWidth={active || open ? 2 : 1.5}
        />
        <span style={{
          fontFamily: "var(--font-poppins)",
          fontSize: "8px", fontWeight: active || open ? 600 : 400,
          letterSpacing: "0.5px",
          color: active || open ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.22)",
        }}>
          Plus
        </span>
      </button>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function EspaceClient({ user, isAdmin = false }: { user: Session["user"]; isAdmin?: boolean }) {
  const [tab, setTab] = useState<Tab>("accueil");
  const [projects, setProjects] = useState<Project[]>([]);
  const [msgPrefill, setMsgPrefill] = useState("");
  const isMobile = useIsMobile();

  useEffect(() => {
    safeFetch<Project[]>("/api/projects", []).then(setProjects);
  }, []);

  const goMessages = () => setTab("messages");
  const goTab = (t: Tab) => setTab(t);

  const navItems: { id: Tab; icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>; label: string }[] = [
    { id: "accueil",      icon: LayoutDashboard,  label: "Accueil"           },
    { id: "devis",        icon: PlusCircle,        label: "Demande de devis"  },
    { id: "projets",      icon: FolderOpen,        label: "Mes projets"       },
    { id: "kanban",       icon: Kanban,            label: "Kanban"            },
    { id: "galerie",      icon: ImageIcon,         label: "Livrables"         },
    { id: "moodboard",   icon: LayoutGrid,        label: "Moodboard"         },
    { id: "messages",     icon: MessageSquare,     label: "Messagerie"        },
    { id: "signalements", icon: Bug,               label: "Signalements"      },
    { id: "avis",         icon: Star,              label: "Avis"              },
    { id: "parametres",   icon: Settings,          label: "Paramètres"        },
  ];

  // 5 onglets principaux visibles en permanence dans la barre mobile
  const mobileNavPrimary = navItems.slice(0, 5);

  return (
    <div style={{ height: "100dvh", overflow: "hidden", background: "#0e0c0a", display: "flex", flexDirection: "column", fontFamily: "var(--font-poppins)" }}>
      {/* Top bar */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(14,12,10,0.96)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", padding: "0 4vw", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Avatar name={user?.name} image={user?.image} size={28} />
          <div>
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.72)", margin: 0, lineHeight: 1.2 }}>{user?.name ?? "Utilisateur"}</p>
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: "8px", fontWeight: 400, letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.40)", margin: 0 }}>Espace client</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {!isMobile && (
            <Link href="/" className="vto-cta-link" style={{ fontSize: "9px", letterSpacing: "2px" }}>← Retour au site</Link>
          )}
          {isAdmin && !isMobile && (
            <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: "6px", border: "1px solid rgba(255,255,255,0.08)", padding: "5px 12px", fontFamily: "var(--font-poppins)", fontSize: "9px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", textDecoration: "none", transition: "border-color 0.2s" }}>
              <Shield size={11} /> Admin
            </Link>
          )}
          <button onClick={() => signOut({ callbackUrl: "/" })} style={{ display: "flex", alignItems: "center", gap: "7px", background: "none", border: "1px solid rgba(255,255,255,0.06)", padding: "5px 10px", cursor: "pointer" }}>
            <LogOut size={12} color="rgba(248,113,113,0.4)" />
          </button>
        </div>
      </header>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", width: "100%", overflow: "hidden" }}>
        {/* Sidebar — masquée sur mobile via CSS */}
        <aside className="espace-sidebar" style={{ width: "220px", flexShrink: 0, paddingTop: "32px", paddingRight: "12px", paddingLeft: "24px", borderRight: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column" }}>
          <nav style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
            {navItems.map(item => <NavItem key={item.id} icon={item.icon} label={item.label} active={tab === item.id} onClick={() => setTab(item.id)} />)}
          </nav>
          {isAdmin && (
            <div style={{ paddingBottom: "20px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: "9px", padding: "9px 16px", borderLeft: "2px solid rgba(255,255,255,0.12)", textDecoration: "none" }}>
                <Shield size={13} color="rgba(255,255,255,0.3)" />
                <span style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 500, color: "rgba(255,255,255,0.35)", letterSpacing: "0.3px" }}>Panel Admin</span>
              </Link>
            </div>
          )}
        </aside>

        {/* Main content */}
        <main style={{
          flex: 1, minWidth: 0, overflowY: "auto",
          padding: tab === "kanban"
            ? (isMobile ? "16px 16px 0" : "20px 24px 0 28px")
            : (isMobile ? "20px 16px 16px" : "36px 48px 48px 40px"),
          display: "flex", flexDirection: "column",
          paddingBottom: isMobile ? "72px" : undefined,
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              style={{ flex: 1, display: "flex", flexDirection: "column" }}
            >
              {tab === "accueil"      && <TabAccueil user={user} projects={projects} goTab={goTab} />}
              {tab === "devis"        && <TabDevis onSuccess={() => setTab("projets")} />}
              {tab === "projets"      && <TabProjets onRequestDevis={() => setTab("devis")} onMessage={goMessages} />}
              {tab === "kanban"       && <TabKanban goMessages={goMessages} setMsgPrefill={setMsgPrefill} />}
              {tab === "galerie"      && <TabGalerie projects={projects} />}
              {tab === "moodboard"   && <TabMoodboard projects={projects} />}
              {tab === "messages"     && <TabMessagesWithPrefill user={user} prefill={msgPrefill} clearPrefill={() => setMsgPrefill("")} />}
              {tab === "signalements" && <TabSignalements onGoMessages={goMessages} />}
              {tab === "avis"         && <TabAvis />}
              {tab === "parametres"   && <TabParametres user={user} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ── Barre de navigation mobile (bottom tab bar) ── */}
      {isMobile && (
        <nav style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 60,
          height: "60px",
          background: "rgba(14,12,10,0.97)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          display: "flex", alignItems: "stretch",
        }}>
          {mobileNavPrimary.map(item => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                style={{
                  flex: 1, display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: "3px",
                  background: "none", border: "none", cursor: "pointer",
                  borderTop: active ? "2px solid rgba(255,255,255,0.35)" : "2px solid transparent",
                  transition: "border-color 0.15s",
                }}
              >
                <Icon
                  size={16}
                  color={active ? "rgba(255,255,255,0.78)" : "rgba(255,255,255,0.22)"}
                  strokeWidth={active ? 2 : 1.5}
                />
                <span style={{
                  fontFamily: "var(--font-poppins)",
                  fontSize: "8px", fontWeight: active ? 600 : 400,
                  letterSpacing: "0.5px",
                  color: active ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.22)",
                }}>
                  {item.label.split(" ")[0]}
                </span>
              </button>
            );
          })}
          {/* Bouton "Plus" pour accéder aux autres onglets */}
          <MobileMoreMenu
            navItems={navItems.slice(5)}
            currentTab={tab}
            onSelect={t => setTab(t)}
            active={navItems.slice(5).some(i => i.id === tab)}
          />
        </nav>
      )}
    </div>
  );
}

// Wrapper to handle message prefill from kanban task click
function TabMessagesWithPrefill({ user, prefill, clearPrefill }: { user: Session["user"]; prefill: string; clearPrefill: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [input, setInput] = useState(prefill);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (prefill) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInput(prefill);
      clearPrefill();
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [prefill]);

  useEffect(() => {
    Promise.all([
      safeFetch<Msg[]>("/api/messages", []),
      safeFetch<Project[]>("/api/projects", []),
      safeFetch<Report[]>("/api/reports", []),
    ]).then(([msgs, projs, reps]) => {
      setMessages(msgs);
      setProjects(projs.filter(p => p.status !== "rejected"));
      setReports(reps);
      setLoading(false);
    });
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    const content = input.trim();
    if (!content || sending) return;
    setSending(true); setInput("");
    const res = await fetch("/api/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content }) });
    if (res.ok) { const msg = await res.json(); setMessages(p => [...p, msg]); }
    setSending(false);
  };

  const projectsWithSummary = projects.filter(p => p.projectSummary);
  const projectsWithoutSummary = projects.filter(p => !p.projectSummary);
  const hasContext = projects.length > 0 || reports.length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      <SectionTitle>Messagerie</SectionTitle>
      <SectionSub>Échangez directement avec Flores.</SectionSub>

      {!loading && !hasContext && messages.length === 0 && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", textAlign: "center", padding: "32px 0" }}>
          <div style={{ width: 52, height: 52, borderRadius: "14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MessageSquare size={20} color="rgba(255,255,255,0.12)" />
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.5)", margin: "0 0 6px" }}>Aucun contexte de discussion</p>
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 300, color: "rgba(255,255,255,0.2)", margin: 0, lineHeight: 1.6 }}>
              Pour ouvrir une discussion, soumettez d&apos;abord<br />un devis ou un signalement.
            </p>
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px", paddingBottom: "16px" }}>
        {!loading && projectsWithSummary.map(p => <ProjectSummaryPanel key={p.id} project={p} />)}
        {!loading && projectsWithoutSummary.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "8px" }}>
            {projectsWithoutSummary.map(p => (
              <div key={p.id} style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.65)" }}>{p.title}</span>
                  <span style={{ fontSize: "9px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: STATUS_COLOR[p.status], background: STATUS_BG[p.status], padding: "2px 7px", borderRadius: "999px", flexShrink: 0 }}>{STATUS_LABEL[p.status] ?? p.status}</span>
                  <span style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>
                    {p.type === "web" ? "Web" : p.type === "visual" ? "Visuel" : "Autre"}{p.budget ? ` · ${p.budget}` : ""}
                  </span>
                </div>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "4px 0" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(255,255,255,0.38)" }}>Échanges</span>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
            </div>
          </div>
        )}
        {loading ? (
          <div style={{ color: "rgba(255,255,255,0.40)", fontSize: "12px", textAlign: "center", padding: "40px 0" }}>Chargement...</div>
        ) : messages.length === 0 ? (
          <div style={{ color: "rgba(255,255,255,0.40)", fontSize: "12px", textAlign: "center", padding: "48px 0" }}>Aucun message — envoyez le premier !</div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                style={{ display: "flex", flexDirection: msg.fromAdmin ? "row" : "row-reverse", gap: "10px", alignItems: "flex-end" }}>
                {msg.fromAdmin ? (
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#3a6fff,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "white", flexShrink: 0 }}>F</div>
                ) : <div style={{ flexShrink: 0 }}><Avatar name={user?.name} image={user?.image} size={28} /></div>}
                <div style={{ maxWidth: "75%" }}>
                  <div style={{ padding: "10px 14px", whiteSpace: "pre-wrap", wordBreak: "break-word", borderRadius: msg.fromAdmin ? "14px 14px 14px 3px" : "14px 14px 3px 14px", background: msg.fromAdmin ? "rgba(60,100,255,0.12)" : "rgba(255,255,255,0.07)", border: `1px solid ${msg.fromAdmin ? "rgba(60,100,255,0.2)" : "rgba(255,255,255,0.07)"}`, fontSize: "13px", fontWeight: 300, color: "rgba(255,255,255,0.82)", lineHeight: 1.65 }}>
                    {msg.content}
                  </div>
                  <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.38)", margin: "4px 4px 0", textAlign: msg.fromAdmin ? "left" : "right" }}>{fmtDate(msg.createdAt)}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>

      {hasContext && (
        <div style={{ paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
            <textarea
              ref={inputRef}
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Votre message… (Entrée pour envoyer)"
              rows={1}
              style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "10px 12px", color: "white", fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 300, lineHeight: 1.5, outline: "none", resize: "none", maxHeight: "100px", overflowY: "auto" }}
              onInput={e => { const t = e.currentTarget; t.style.height = "auto"; t.style.height = Math.min(t.scrollHeight, 100) + "px"; }}
            />
            <button onClick={send} disabled={!input.trim() || sending} style={{ width: 40, height: 40, borderRadius: "10px", flexShrink: 0, border: "1px solid rgba(255,255,255,0.08)", background: input.trim() ? "rgba(60,100,255,0.7)" : "rgba(255,255,255,0.04)", cursor: input.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Send size={15} color={input.trim() ? "white" : "rgba(255,255,255,0.2)"} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
