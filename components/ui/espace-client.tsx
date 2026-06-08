"use client";

import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Send, LogOut, MessageSquare, Kanban, Star,
  Settings, PlusCircle, ChevronRight, CheckCircle2,
  Circle, Clock, AlertCircle, Eye, EyeOff, Paperclip, FolderOpen,
  LayoutDashboard, ChevronDown, ChevronUp, Pin,
} from "lucide-react";
import type { Session } from "next-auth";

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = "accueil" | "messages" | "devis" | "projets" | "kanban" | "avis" | "parametres";

type Msg = { id: string; content: string; fromAdmin: boolean; createdAt: string };

type KanbanTask = { id: string; title: string; description?: string | null; done: boolean; order: number; category?: string | null; priority?: string };
type KanbanColumn = { id: string; title: string; order: number; tasks: KanbanTask[] };
type Project = {
  id: string; title: string; description?: string | null; type: string;
  budget?: string | null; status: string; paid: boolean; kanbanVisible: boolean;
  adminNotes?: string | null; projectSummary?: string | null; createdAt: string;
  columns: KanbanColumn[];
  review?: { status: string } | null;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

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
  dev:        { color: "rgba(96,165,250,1)",   bg: "rgba(96,165,250,0.12)"  },
  conception: { color: "rgba(232,121,249,1)",  bg: "rgba(232,121,249,0.12)" },
  redaction:  { color: "rgba(251,146,60,1)",   bg: "rgba(251,146,60,0.12)"  },
  discord:    { color: "rgba(139,92,246,1)",   bg: "rgba(139,92,246,0.12)"  },
  graphisme:  { color: "rgba(52,211,153,1)",   bg: "rgba(52,211,153,0.12)"  },
  autre:      { color: "rgba(156,163,175,1)",  bg: "rgba(156,163,175,0.1)"  },
};
const CAT_LABELS: Record<string, string> = {
  dev: "Dév. du site", conception: "Conception & idée", redaction: "Rédaction",
  discord: "Discord", graphisme: "Graphisme & visuel", autre: "Autre",
};
const PRIO_COLORS: Record<string, string> = {
  faible: "rgba(156,163,175,0.7)", moyen: "rgba(250,204,21,0.8)", urgent: "rgba(248,113,113,0.9)",
};

// ── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({ name, image, size = 36 }: { name?: string | null; image?: string | null; size?: number }) {
  if (image) return <img src={image} alt="" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />;
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
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", border: "none", background: active ? "rgba(60,100,255,0.15)" : "transparent", cursor: "pointer", width: "100%", textAlign: "left", fontFamily: "var(--font-poppins)", transition: "background 0.15s" }}>
      <Icon size={15} color={active ? "rgba(100,140,255,0.9)" : "rgba(255,255,255,0.3)"} strokeWidth={active ? 2 : 1.5} />
      <span style={{ fontSize: "12px", fontWeight: active ? 600 : 400, color: active ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.35)", flex: 1 }}>{label}</span>
      {badge != null && badge > 0 && (
        <span style={{ fontSize: "10px", fontWeight: 600, color: "rgba(96,165,250,0.9)", background: "rgba(96,165,250,0.12)", border: "1px solid rgba(96,165,250,0.2)", borderRadius: "999px", padding: "1px 6px" }}>{badge}</span>
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
  accueil:    { icon: LayoutDashboard, desc: "Vue d'ensemble de votre espace" },
  devis:      { icon: PlusCircle,   desc: "Soumettre une nouvelle demande de devis" },
  projets:    { icon: FolderOpen,   desc: "Consulter vos projets et leur statut" },
  kanban:     { icon: Kanban,       desc: "Suivre l'avancement en temps réel" },
  messages:   { icon: MessageSquare,desc: "Échanger directement avec Flores" },
  avis:       { icon: Star,         desc: "Laisser un avis sur votre projet" },
  parametres: { icon: Settings,     desc: "Gérer votre profil et mot de passe" },
};

function TabAccueil({ user, projects, goTab }: { user: Session["user"]; projects: Project[]; goTab: (t: Tab) => void }) {
  const activeProjects = projects.filter(p => p.status !== "rejected");
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

  const stats = [
    { label: "Projets", value: projects.length, color: "rgba(96,165,250,0.8)", tab: "projets" as Tab },
    { label: "En cours", value: projects.filter(p => p.status === "active").length, color: "rgba(74,222,128,0.8)", tab: "kanban" as Tab },
    { label: "Messages", value: 0, color: "rgba(167,139,250,0.8)", tab: "messages" as Tab },
  ];

  return (
    <div>
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
          <Avatar name={user?.name} image={user?.image} size={48} />
          <div>
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 300, color: "rgba(255,255,255,0.3)", margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.12em" }}>{greeting}</p>
            <h1 style={{ fontFamily: "var(--font-poppins)", fontSize: "22px", fontWeight: 800, color: "white", letterSpacing: "-0.02em", margin: 0 }}>
              {user?.name ?? "Bienvenue"} 👋
            </h1>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {stats.map((s, i) => (
            <motion.button
              key={s.label}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => goTab(s.tab)}
              style={{
                flex: "1 1 100px", padding: "16px 18px", borderRadius: "14px",
                border: `1px solid ${s.color.replace("0.8)", "0.2)")}`,
                background: s.color.replace("0.8)", "0.07)"),
                cursor: "pointer", textAlign: "left", fontFamily: "var(--font-poppins)",
                transition: "border-color 0.2s",
              }}
            >
              <p style={{ fontSize: "28px", fontWeight: 800, color: "white", margin: "0 0 4px", letterSpacing: "-0.03em" }}>{s.value}</p>
              <p style={{ fontSize: "11px", fontWeight: 400, color: s.color, margin: 0, letterSpacing: "0.02em" }}>{s.label}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Active projects */}
      {activeProjects.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.45 }} style={{ marginBottom: "32px" }}>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)", margin: "0 0 12px" }}>Vos projets</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {activeProjects.slice(0, 3).map((p, i) => {
              const total = p.columns.flatMap(c => c.tasks).length;
              const done = p.columns.flatMap(c => c.tasks).filter(t => t.done).length;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.06 }}
                  onClick={() => goTab("projets")}
                  style={{ padding: "14px 16px", borderRadius: "13px", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)", cursor: "pointer", transition: "border-color 0.15s" }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px", marginBottom: "8px" }}>
                    <p style={{ fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.85)", margin: 0 }}>{p.title}</p>
                    <span style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: STATUS_COLOR[p.status], background: STATUS_BG[p.status], padding: "3px 8px", borderRadius: "999px", flexShrink: 0 }}>
                      {STATUS_LABEL[p.status] ?? p.status}
                    </span>
                  </div>
                  {total > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ flex: 1, height: "3px", borderRadius: "99px", background: "rgba(255,255,255,0.06)" }}>
                        <div style={{ height: "100%", width: `${pct}%`, borderRadius: "99px", background: pct === 100 ? "rgba(74,222,128,0.6)" : "rgba(100,140,255,0.6)", transition: "width 0.4s" }} />
                      </div>
                      <span style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>{pct}%</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Quick navigation */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.45 }}>
        <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)", margin: "0 0 12px" }}>Navigation rapide</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {(["devis", "projets", "kanban", "messages", "avis", "parametres"] as Tab[]).map((t, i) => {
            const item = NAV_DESCRIPTIONS[t];
            const Icon = item.icon;
            return (
              <motion.button
                key={t}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38 + i * 0.05 }}
                onClick={() => goTab(t)}
                style={{
                  display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px", borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)",
                  cursor: "pointer", textAlign: "left", fontFamily: "var(--font-poppins)", transition: "border-color 0.15s",
                }}
              >
                <Icon size={15} color="rgba(255,255,255,0.3)" strokeWidth={1.5} />
                <div>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.7)", margin: 0 }}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </p>
                  <p style={{ fontSize: "10px", fontWeight: 300, color: "rgba(255,255,255,0.25)", margin: 0, lineHeight: 1.4 }}>{item.desc}</p>
                </div>
              </motion.button>
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

function TabMessages({ user }: { user: Session["user"] }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/messages").then(r => r.json()),
      fetch("/api/projects").then(r => r.json()),
    ]).then(([msgs, projs]) => {
      setMessages(msgs);
      setProjects((projs as Project[]).filter(p => p.status !== "rejected"));
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

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      <SectionTitle>Messagerie</SectionTitle>
      <SectionSub>Échangez directement avec Flores.</SectionSub>

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
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(255,255,255,0.15)" }}>Échanges</span>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ color: "rgba(255,255,255,0.15)", fontSize: "12px", textAlign: "center", padding: "40px 0" }}>Chargement...</div>
        ) : messages.length === 0 ? (
          <div style={{ color: "rgba(255,255,255,0.15)", fontSize: "12px", textAlign: "center", padding: "48px 0" }}>Aucun message — envoyez le premier !</div>
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
                  <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.18)", margin: "4px 4px 0", textAlign: msg.fromAdmin ? "left" : "right" }}>{fmtDate(msg.createdAt)}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>

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
const PROJECT_TYPES = [{ value: "web", label: "Site web / Application" }, { value: "visual", label: "Création visuelle" }, { value: "other", label: "Autre / Je ne sais pas encore" }];
const DEADLINES = [{ value: "urgent", label: "Urgent (moins de 2 semaines)" }, { value: "1mois", label: "1 mois environ" }, { value: "3mois", label: "2 à 3 mois" }, { value: "flexible", label: "Flexible / Pas de contrainte" }];
const CONTACTS = [{ value: "email", label: "E-mail" }, { value: "discord", label: "Discord" }, { value: "phone", label: "Téléphone" }, { value: "other", label: "Peu importe" }];

function TabDevis({ onSuccess }: { onSuccess: () => void }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
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

  const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 13px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "white", fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 300, outline: "none", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 500, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "6px" };
  const selectStyle: React.CSSProperties = { ...inputStyle, appearance: "none", cursor: "pointer", colorScheme: "dark", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(255,255,255,0.2)'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 13px center" };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true);
    const res = await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, type, description, budget: budget >= 5000 ? "5000€+" : `${budget}€`, deadline, references, contact, phone: contact === "phone" ? phone : undefined, callSlots: contact === "phone" && callSlots.length > 0 ? callSlots : undefined, briefFile: briefFile || undefined, briefFileName: briefFileName || undefined }) });
    setLoading(false);
    if (!res.ok) { const d = await res.json(); setError(d.error ?? "Erreur"); return; }
    setDone(true);
    setTimeout(onSuccess, 1800);
  };

  if (done) return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: "16px" }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CheckCircle2 size={24} color="rgba(74,222,128,0.8)" />
      </div>
      <p style={{ fontFamily: "var(--font-poppins)", fontSize: "15px", fontWeight: 600, color: "white", margin: 0 }}>Demande envoyée !</p>
      <p style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.3)", margin: 0 }}>Je vous réponds sous 24h.</p>
    </motion.div>
  );

  return (
    <div>
      <SectionTitle>Demande de devis</SectionTitle>
      <SectionSub>Décrivez votre projet — je vous réponds sous 24h avec une estimation.</SectionSub>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "560px" }}>
        <div><label style={labelStyle}>Intitulé du projet *</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="ex : Site vitrine restaurant" required style={inputStyle} /></div>
        <div>
          <label style={labelStyle}>Type de prestation *</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {PROJECT_TYPES.map(pt => (
              <label key={pt.value} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 13px", borderRadius: "10px", border: `1px solid ${type === pt.value ? "rgba(60,100,255,0.35)" : "rgba(255,255,255,0.07)"}`, background: type === pt.value ? "rgba(60,100,255,0.1)" : "rgba(255,255,255,0.02)", cursor: "pointer", transition: "all 0.15s" }}>
                <input type="radio" name="type" value={pt.value} checked={type === pt.value} onChange={() => setType(pt.value)} style={{ display: "none" }} />
                <div style={{ width: 14, height: 14, borderRadius: "50%", border: `1.5px solid ${type === pt.value ? "rgba(100,140,255,0.8)" : "rgba(255,255,255,0.2)"}`, background: type === pt.value ? "rgba(100,140,255,0.25)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {type === pt.value && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(100,140,255,0.9)" }} />}
                </div>
                <span style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 400, color: "rgba(255,255,255,0.65)" }}>{pt.label}</span>
              </label>
            ))}
          </div>
        </div>
        <div><label style={labelStyle}>Description du projet</label><textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Décrivez votre projet, vos objectifs, votre cible…" style={{ ...inputStyle, resize: "vertical", minHeight: "90px" }} /></div>
        <div><label style={labelStyle}>Budget envisagé</label><div style={{ padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}><BudgetSlider value={budget} onChange={setBudget} /></div></div>
        <div><label style={labelStyle}>Délai souhaité</label><select value={deadline} onChange={e => setDeadline(e.target.value)} style={selectStyle}><option value="">Sélectionner…</option>{DEADLINES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}</select></div>
        <div><label style={labelStyle}>Références / Inspirations</label><textarea value={references} onChange={e => setReferences(e.target.value)} rows={2} placeholder="Liens, noms de sites, styles appréciés…" style={{ ...inputStyle, resize: "vertical", minHeight: "60px" }} /></div>
        <div>
          <label style={labelStyle}>Brief / Document (optionnel)</label>
          <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 13px", borderRadius: "10px", border: `1px solid ${briefFileName ? "rgba(100,140,255,0.25)" : "rgba(255,255,255,0.07)"}`, background: briefFileName ? "rgba(60,100,255,0.06)" : "rgba(255,255,255,0.02)", cursor: "pointer" }}>
            <Paperclip size={14} color={briefFileName ? "rgba(100,140,255,0.6)" : "rgba(255,255,255,0.25)"} />
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", color: briefFileName ? "rgba(100,140,255,0.8)" : "rgba(255,255,255,0.25)", flex: 1 }}>{briefFileName || "Joindre un PDF ou Word (max 5 Mo)"}</span>
            {briefFileName && <button type="button" onClick={e => { e.preventDefault(); setBriefFile(""); setBriefFileName(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.2)", padding: 0, display: "flex" }}>✕</button>}
            <input type="file" accept=".pdf,.docx,.doc" onChange={handleFile} style={{ display: "none" }} />
          </label>
        </div>
        <div>
          <label style={labelStyle}>Moyen de contact préféré</label>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {CONTACTS.map(c => (
              <button key={c.value} type="button" onClick={() => setContact(c.value)} style={{ padding: "8px 14px", borderRadius: "9px", cursor: "pointer", border: `1px solid ${contact === c.value ? "rgba(60,100,255,0.35)" : "rgba(255,255,255,0.07)"}`, background: contact === c.value ? "rgba(60,100,255,0.12)" : "rgba(255,255,255,0.02)", fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: contact === c.value ? 600 : 400, color: contact === c.value ? "rgba(100,140,255,0.9)" : "rgba(255,255,255,0.4)", transition: "all 0.15s" }}>{c.label}</button>
            ))}
          </div>
          {contact === "phone" && (
            <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Votre numéro de téléphone" style={inputStyle} />
              <div>
                <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 500, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 6px" }}>Créneaux disponibles (optionnel)</p>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {TIME_SLOTS.map(s => <button key={s.value} type="button" onClick={() => toggleSlot(s.value)} style={{ padding: "6px 12px", borderRadius: "8px", cursor: "pointer", border: `1px solid ${callSlots.includes(s.value) ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.06)"}`, background: callSlots.includes(s.value) ? "rgba(74,222,128,0.08)" : "rgba(255,255,255,0.02)", fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: callSlots.includes(s.value) ? 600 : 400, color: callSlots.includes(s.value) ? "rgba(74,222,128,0.85)" : "rgba(255,255,255,0.35)", transition: "all 0.15s" }}>{s.label}</button>)}
                </div>
              </div>
            </div>
          )}
        </div>
        {error && <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 13px", borderRadius: "10px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}><AlertCircle size={13} color="rgba(239,68,68,0.8)" /><span style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", color: "rgba(239,68,68,0.85)" }}>{error}</span></div>}
        <button type="submit" disabled={loading || !title || !type} style={{ padding: "11px 24px", borderRadius: "10px", border: "1px solid rgba(60,100,255,0.35)", background: "rgba(60,100,255,0.65)", fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 600, color: "white", cursor: (loading || !title || !type) ? "not-allowed" : "pointer", opacity: (loading || !title || !type) ? 0.5 : 1, transition: "opacity 0.2s", alignSelf: "flex-start" }}>
          {loading ? "Envoi…" : "Envoyer ma demande →"}
        </button>
      </form>
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

  useEffect(() => {
    fetch("/api/projects").then(r => r.json()).then(data => { setProjects(data); setLoading(false); });
  }, []);

  if (selected) return (
    <div>
      <button onClick={() => setSelected(null)} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-poppins)", fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: "20px", padding: 0 }}>← Retour</button>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "6px" }}>
        <SectionTitle>{selected.title}</SectionTitle>
        <span style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: STATUS_COLOR[selected.status], background: STATUS_BG[selected.status], padding: "4px 10px", borderRadius: "999px", fontFamily: "var(--font-poppins)", flexShrink: 0 }}>{STATUS_LABEL[selected.status] ?? selected.status}</span>
      </div>
      <SectionSub>{fmtDateShort(selected.createdAt)} · {selected.type === "web" ? "Web" : selected.type === "visual" ? "Visuel" : "Autre"}{selected.budget ? ` · ${selected.budget}` : ""}</SectionSub>
      {selected.description && (
        <div style={{ padding: "14px 16px", borderRadius: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: "16px" }}>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: 0 }}>{selected.description}</p>
        </div>
      )}
      {selected.adminNotes && (
        <div style={{ padding: "14px 16px", borderRadius: "12px", background: "rgba(60,100,255,0.05)", border: "1px solid rgba(60,100,255,0.15)", marginBottom: "16px" }}>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(100,140,255,0.6)", margin: "0 0 6px" }}>Note de Flores</p>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0 }}>{selected.adminNotes}</p>
        </div>
      )}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
        <button onClick={onMessage} style={{ display: "flex", alignItems: "center", gap: "7px", padding: "9px 14px", borderRadius: "9px", border: "1px solid rgba(60,100,255,0.25)", background: "rgba(60,100,255,0.08)", fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 500, color: "rgba(100,140,255,0.8)", cursor: "pointer" }}>
          <MessageSquare size={13} /> Contacter l'admin
        </button>
      </div>
      {!selected.paid && (
        <div style={{ marginTop: "16px", padding: "14px 16px", borderRadius: "12px", background: "rgba(250,204,21,0.04)", border: "1px solid rgba(250,204,21,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <Clock size={13} color="rgba(250,204,21,0.5)" />
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
              {selected.status === "pending" ? "En attente de réponse — je vous reviens sous 24h." : selected.status === "accepted" ? "Devis accepté — en attente de paiement pour démarrer." : "Projet en attente."}
            </span>
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
        <div style={{ color: "rgba(255,255,255,0.15)", fontSize: "12px", textAlign: "center", padding: "40px 0" }}>Chargement...</div>
      ) : projects.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <div style={{ width: 48, height: 48, borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Kanban size={20} color="rgba(255,255,255,0.15)" />
          </div>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.25)", margin: 0 }}>Aucun projet pour l'instant</p>
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
    fetch("/api/projects").then(r => r.json()).then((data: Project[]) => {
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
    <div>
      <SectionTitle>Kanban</SectionTitle>
      <SectionSub>Consultez l&apos;avancement de votre projet en temps réel. Cliquez sur une tâche pour en discuter.</SectionSub>

      {loading ? (
        <div style={{ color: "rgba(255,255,255,0.15)", fontSize: "12px", textAlign: "center", padding: "40px 0" }}>Chargement...</div>
      ) : activeProjects.length === 0 ? (
        <div style={{ textAlign: "center", padding: "56px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
          <div style={{ width: 56, height: 56, borderRadius: "14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Kanban size={22} color="rgba(255,255,255,0.12)" />
          </div>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.3)", margin: 0 }}>Aucun kanban disponible</p>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", color: "rgba(255,255,255,0.15)", margin: 0 }}>Le kanban apparaîtra dès que Flores l&apos;aura activé sur votre projet.</p>
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
                <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
                  {sortedCols.map(col => {
                    const accent = COL_COLOR[col.title] ?? "rgba(255,255,255,0.35)";
                    return (
                      <div key={col.id} style={{ flex: "0 0 200px", minWidth: "200px" }}>
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
                                style={{ padding: "10px 12px", borderRadius: "10px", background: task.done ? "rgba(74,222,128,0.04)" : "rgba(255,255,255,0.03)", border: `1px solid ${task.done ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.06)"}`, cursor: "pointer", transition: "border-color 0.15s" }}
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

  useEffect(() => { fetch("/api/projects").then(r => r.json()).then(data => { setProjects(data); setLoading(false); }); }, []);

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

  if (loading) return <div style={{ color: "rgba(255,255,255,0.15)", fontSize: "12px", textAlign: "center", padding: "40px 0" }}>Chargement...</div>;

  return (
    <div>
      <SectionTitle>Avis</SectionTitle>
      <SectionSub>Partagez votre expérience — votre avis peut apparaître sur le portfolio.</SectionSub>
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
            <div key={p.id} style={{ padding: "14px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.65)", margin: 0 }}>{p.title}</p>
                <span style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", color: p.review?.status === "approved" ? "rgba(74,222,128,0.7)" : "rgba(250,204,21,0.6)" }}>{p.review?.status === "approved" ? "✓ Publié" : "En attente de validation"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {!reviewableProject && submittedProjects.length === 0 && !loading && (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <Star size={24} color="rgba(255,255,255,0.1)" style={{ marginBottom: "12px" }} />
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.2)", margin: 0 }}>Aucune invitation à laisser un avis pour l'instant.<br />Je vous contacterai à la fin de votre projet.</p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: PARAMÈTRES
// ─────────────────────────────────────────────────────────────────────────────

function TabParametres({ user }: { user: Session["user"] }) {
  const [name, setName] = useState(user?.name ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 13px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "white", fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 300, outline: "none", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 500, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "6px" };

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
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Avatar name={user?.name} image={user?.image} size={52} />
          <div>
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.75)", margin: "0 0 3px" }}>{user?.name}</p>
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 300, color: "rgba(255,255,255,0.25)", margin: 0 }}>{user?.email}</p>
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
      <div style={{ marginTop: "40px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <button onClick={() => signOut({ callbackUrl: "/" })} style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 500, color: "rgba(248,113,113,0.55)", padding: 0 }}>
          <LogOut size={13} /> Se déconnecter
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function EspaceClient({ user }: { user: Session["user"] }) {
  const [tab, setTab] = useState<Tab>("accueil");
  const [projects, setProjects] = useState<Project[]>([]);
  const [msgPrefill, setMsgPrefill] = useState("");

  useEffect(() => {
    fetch("/api/projects").then(r => r.json()).then(setProjects).catch(() => {});
  }, []);

  const goMessages = () => setTab("messages");
  const goTab = (t: Tab) => setTab(t);

  const navItems: { id: Tab; icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>; label: string }[] = [
    { id: "accueil",    icon: LayoutDashboard, label: "Accueil"           },
    { id: "devis",      icon: PlusCircle,      label: "Demande de devis"  },
    { id: "projets",    icon: FolderOpen,      label: "Mes projets"       },
    { id: "kanban",     icon: Kanban,          label: "Kanban"            },
    { id: "messages",   icon: MessageSquare,   label: "Messagerie"        },
    { id: "avis",       icon: Star,            label: "Avis"              },
    { id: "parametres", icon: Settings,        label: "Paramètres"        },
  ];

  return (
    <div style={{ minHeight: "100dvh", background: "#060a0e", display: "flex", flexDirection: "column", fontFamily: "var(--font-poppins)" }}>
      {/* Top bar */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(6,10,14,0.92)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", padding: "0 6vw", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Avatar name={user?.name} image={user?.image} size={32} />
          <div>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.85)", margin: 0, lineHeight: 1.2 }}>{user?.name ?? "Utilisateur"}</p>
            <p style={{ fontSize: "10px", fontWeight: 300, color: "rgba(255,255,255,0.25)", margin: 0, textTransform: "uppercase", letterSpacing: "0.1em" }}>Espace client</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "6px 12px", fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 500, color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>← Site</Link>
          <button onClick={() => signOut({ callbackUrl: "/" })} style={{ display: "flex", alignItems: "center", gap: "7px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 500, color: "rgba(255,255,255,0.4)" }}>
            <LogOut size={13} />
          </button>
        </div>
      </header>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", maxWidth: "1100px", width: "100%", margin: "0 auto", padding: "0 6vw" }}>
        {/* Sidebar */}
        <aside style={{ width: "200px", flexShrink: 0, paddingTop: "32px", paddingRight: "20px", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
          <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {navItems.map(item => <NavItem key={item.id} icon={item.icon} label={item.label} active={tab === item.id} onClick={() => setTab(item.id)} />)}
          </nav>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, minWidth: 0, padding: "32px 0 32px 32px", display: "flex", flexDirection: "column" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              style={{ flex: 1, display: "flex", flexDirection: "column" }}
            >
              {tab === "accueil"    && <TabAccueil user={user} projects={projects} goTab={goTab} />}
              {tab === "devis"      && <TabDevis onSuccess={() => setTab("projets")} />}
              {tab === "projets"    && <TabProjets onRequestDevis={() => setTab("devis")} onMessage={goMessages} />}
              {tab === "kanban"     && <TabKanban goMessages={goMessages} setMsgPrefill={setMsgPrefill} />}
              {tab === "messages"   && <TabMessagesWithPrefill user={user} prefill={msgPrefill} clearPrefill={() => setMsgPrefill("")} />}
              {tab === "avis"       && <TabAvis />}
              {tab === "parametres" && <TabParametres user={user} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// Wrapper to handle message prefill from kanban task click
function TabMessagesWithPrefill({ user, prefill, clearPrefill }: { user: Session["user"]; prefill: string; clearPrefill: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [input, setInput] = useState(prefill);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (prefill) {
      setInput(prefill);
      clearPrefill();
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [prefill]);

  useEffect(() => {
    Promise.all([
      fetch("/api/messages").then(r => r.json()),
      fetch("/api/projects").then(r => r.json()),
    ]).then(([msgs, projs]) => {
      setMessages(msgs);
      setProjects((projs as Project[]).filter(p => p.status !== "rejected"));
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

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      <SectionTitle>Messagerie</SectionTitle>
      <SectionSub>Échangez directement avec Flores.</SectionSub>

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px", paddingBottom: "16px" }}>
        {!loading && projectsWithSummary.map(p => <ProjectSummaryPanel key={p.id} project={p} />)}
        {!loading && projectsWithoutSummary.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "8px" }}>
            {projectsWithoutSummary.map(p => (
              <div key={p.id} style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.65)" }}>{p.title}</span>
                  <span style={{ fontSize: "9px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: STATUS_COLOR[p.status], background: STATUS_BG[p.status], padding: "2px 7px", borderRadius: "999px" }}>{STATUS_LABEL[p.status] ?? p.status}</span>
                </div>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "4px 0" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(255,255,255,0.15)" }}>Échanges</span>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
            </div>
          </div>
        )}
        {loading ? <div style={{ color: "rgba(255,255,255,0.15)", fontSize: "12px", textAlign: "center", padding: "40px 0" }}>Chargement...</div>
          : messages.length === 0 ? <div style={{ color: "rgba(255,255,255,0.15)", fontSize: "12px", textAlign: "center", padding: "48px 0" }}>Aucun message — envoyez le premier !</div>
          : (
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
                    <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.18)", margin: "4px 4px 0", textAlign: msg.fromAdmin ? "left" : "right" }}>{fmtDate(msg.createdAt)}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        <div ref={bottomRef} />
      </div>

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
    </div>
  );
}
