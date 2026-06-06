"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  FolderOpen, ChevronRight, CheckCircle2, XCircle,
  CreditCard, Truck, Clock, AlertCircle, Trash2,
} from "lucide-react";

type User = { id: string; name: string | null; email: string; image: string | null };
type Project = {
  id: string; title: string; description: string | null; type: string;
  budget: string | null; deadline: string | null; references: string | null; contact: string | null;
  status: string; paid: boolean; adminNotes: string | null; createdAt: string;
  user: User;
  review: { status: string } | null;
  _count: { columns: number };
};

const STATUS_LABEL: Record<string, string> = {
  pending: "En attente", accepted: "Accepté", active: "En cours",
  completed: "Livré", rejected: "Refusé",
};
const STATUS_COLOR: Record<string, string> = {
  pending: "rgba(250,204,21,0.85)", accepted: "rgba(74,222,128,0.85)",
  active: "rgba(96,165,250,0.85)", completed: "rgba(167,139,250,0.85)", rejected: "rgba(248,113,113,0.85)",
};
const STATUS_BG: Record<string, string> = {
  pending: "rgba(250,204,21,0.08)", accepted: "rgba(74,222,128,0.08)",
  active: "rgba(96,165,250,0.08)", completed: "rgba(167,139,250,0.08)", rejected: "rgba(248,113,113,0.08)",
};
const TYPE_LABEL: Record<string, string> = { web: "Web", visual: "Visuel", other: "Autre" };

function Avatar({ name, image, size = 34 }: { name?: string | null; image?: string | null; size?: number }) {
  if (image) return <img src={image} alt="" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />;
  const initials = (name ?? "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: "linear-gradient(135deg,rgba(60,100,255,0.5),rgba(100,60,255,0.5))",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.33 + "px", fontWeight: 700, color: "white",
    }}>
      {initials}
    </div>
  );
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export function AdminDevis() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/projects")
      .then(r => r.json())
      .then(data => { setProjects(data); setLoading(false); });
  }, []);

  const filtered = filter === "all" ? projects : projects.filter(p => p.status === filter);

  const updateProject = async (id: string, data: Record<string, unknown>) => {
    setSaving(true);
    const res = await fetch(`/api/admin/projects/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
    });
    const updated = await res.json();
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    setSelected(prev => prev?.id === id ? { ...prev, ...updated } : prev);
    setSaving(false);
  };

  const openProject = (p: Project) => { setSelected(p); setNotes(p.adminNotes ?? ""); };

  const deleteProject = async (id: string) => {
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    setProjects(prev => prev.filter(p => p.id !== id));
    setSelected(null);
  };

  const counts = {
    all: projects.length,
    pending: projects.filter(p => p.status === "pending").length,
    accepted: projects.filter(p => p.status === "accepted").length,
    active: projects.filter(p => p.status === "active").length,
    completed: projects.filter(p => p.status === "completed").length,
    rejected: projects.filter(p => p.status === "rejected").length,
  };

  return (
    <div style={{ padding: "32px 40px", maxWidth: "1000px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 800, color: "white", margin: "0 0 4px", letterSpacing: "-0.01em" }}>Devis & Demandes</h1>
        <p style={{ fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.3)", margin: 0 }}>Gérez les demandes entrantes, acceptez, refusez ou marquez comme payé.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
        {(["all", "pending", "accepted", "active", "completed", "rejected"] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: "6px 14px", borderRadius: "8px", border: `1px solid ${filter === s ? "rgba(60,100,255,0.35)" : "rgba(255,255,255,0.07)"}`,
            background: filter === s ? "rgba(60,100,255,0.14)" : "rgba(255,255,255,0.02)",
            fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: filter === s ? 600 : 400,
            color: filter === s ? "rgba(100,140,255,0.9)" : "rgba(255,255,255,0.35)", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "6px",
          }}>
            {s === "all" ? "Tous" : STATUS_LABEL[s]}
            <span style={{
              fontSize: "10px", fontWeight: 700,
              color: s === "pending" ? STATUS_COLOR.pending : "inherit",
            }}>
              {counts[s]}
            </span>
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        {/* List */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", textAlign: "center", padding: "40px 0" }}>Chargement...</p>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <FolderOpen size={24} color="rgba(255,255,255,0.1)" style={{ marginBottom: "10px" }} />
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", margin: 0 }}>Aucun devis</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {filtered.map((p, i) => (
                <motion.button
                  key={p.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => openProject(p)}
                  style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    padding: "12px 14px", borderRadius: "12px", textAlign: "left", width: "100%",
                    border: `1px solid ${selected?.id === p.id ? "rgba(60,100,255,0.3)" : "rgba(255,255,255,0.06)"}`,
                    background: selected?.id === p.id ? "rgba(60,100,255,0.07)" : "rgba(255,255,255,0.02)",
                    cursor: "pointer", fontFamily: "var(--font-poppins)",
                  }}
                >
                  <Avatar name={p.user.name} image={p.user.image} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.85)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {p.title}
                      </p>
                      <span style={{
                        fontSize: "9px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em",
                        color: STATUS_COLOR[p.status], background: STATUS_BG[p.status],
                        padding: "2px 8px", borderRadius: "999px", flexShrink: 0, marginLeft: "8px",
                      }}>
                        {STATUS_LABEL[p.status]}
                      </span>
                    </div>
                    <p style={{ fontSize: "11px", fontWeight: 300, color: "rgba(255,255,255,0.25)", margin: 0 }}>
                      {p.user.name ?? p.user.email} · {TYPE_LABEL[p.type] ?? p.type} · {fmtDate(p.createdAt)}
                    </p>
                  </div>
                  <ChevronRight size={13} color="rgba(255,255,255,0.15)" style={{ flexShrink: 0 }} />
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: "340px", flexShrink: 0,
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px",
                background: "rgba(255,255,255,0.02)", padding: "20px", alignSelf: "flex-start",
                position: "sticky", top: "32px",
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <Avatar name={selected.user.name} image={selected.user.image} size={38} />
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.85)", margin: 0 }}>{selected.user.name ?? "Sans nom"}</p>
                  <p style={{ fontSize: "10px", fontWeight: 300, color: "rgba(255,255,255,0.25)", margin: 0 }}>{selected.user.email}</p>
                </div>
              </div>

              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "white", margin: "0 0 6px", letterSpacing: "-0.01em" }}>{selected.title}</h3>

              <div style={{ display: "flex", gap: "6px", marginBottom: "12px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "6px", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-poppins)" }}>
                  {TYPE_LABEL[selected.type]}
                </span>
                {selected.budget && (
                  <span style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "6px", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-poppins)" }}>
                    {selected.budget}
                  </span>
                )}
                <span style={{
                  fontSize: "10px", padding: "3px 8px", borderRadius: "6px",
                  background: STATUS_BG[selected.status], color: STATUS_COLOR[selected.status], fontFamily: "var(--font-poppins)",
                  fontWeight: 600,
                }}>
                  {STATUS_LABEL[selected.status]}
                </span>
              </div>

              {selected.description && (
                <p style={{ fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, margin: "0 0 12px" }}>
                  {selected.description}
                </p>
              )}

              {/* Extra fields */}
              {(selected.deadline || selected.references || selected.contact) && (
                <div style={{ display: "flex", flexDirection: "column", gap: "7px", padding: "12px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", marginBottom: "14px" }}>
                  {selected.deadline && (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <span style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.2)", width: "70px", flexShrink: 0, paddingTop: "1px" }}>Délai</span>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>{{ urgent: "Urgent (< 2 sem.)", "1mois": "1 mois", "3mois": "2-3 mois", flexible: "Flexible" }[selected.deadline] ?? selected.deadline}</span>
                    </div>
                  )}
                  {selected.contact && (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <span style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.2)", width: "70px", flexShrink: 0, paddingTop: "1px" }}>Contact</span>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>{{ email: "E-mail", discord: "Discord", other: "Peu importe" }[selected.contact] ?? selected.contact}</span>
                    </div>
                  )}
                  {selected.references && (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <span style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.2)", width: "70px", flexShrink: 0, paddingTop: "1px" }}>Réf.</span>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{selected.references}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Admin note */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "10px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.25)", marginBottom: "6px" }}>
                  Note interne
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Note visible par le client dans son espace…"
                  style={{
                    width: "100%", padding: "9px 11px", borderRadius: "9px", resize: "vertical",
                    border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)",
                    color: "white", fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 300,
                    outline: "none", boxSizing: "border-box", lineHeight: 1.6,
                  }}
                />
                <button
                  onClick={() => updateProject(selected.id, { adminNotes: notes })}
                  disabled={saving || notes === (selected.adminNotes ?? "")}
                  style={{
                    marginTop: "6px", padding: "6px 14px", borderRadius: "7px",
                    border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
                    fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 500,
                    color: "rgba(255,255,255,0.45)", cursor: "pointer",
                    opacity: (saving || notes === (selected.adminNotes ?? "")) ? 0.4 : 1,
                  }}
                >
                  {saving ? "Enregistrement…" : "Sauvegarder la note"}
                </button>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <p style={{ fontSize: "10px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.2)", margin: "0 0 4px" }}>Actions</p>

                {selected.status === "pending" && (
                  <>
                    <button onClick={() => updateProject(selected.id, { status: "accepted" })} style={actionBtn("rgba(74,222,128,0.7)")}>
                      <CheckCircle2 size={13} /> Accepter le devis
                    </button>
                    <button onClick={() => updateProject(selected.id, { status: "rejected" })} style={actionBtn("rgba(248,113,113,0.6)")}>
                      <XCircle size={13} /> Refuser
                    </button>
                  </>
                )}

                {selected.status === "accepted" && (
                  <button onClick={() => updateProject(selected.id, { status: "active", paid: true })} style={actionBtn("rgba(96,165,250,0.7)")}>
                    <CreditCard size={13} /> Marquer comme payé → En cours
                  </button>
                )}

                {selected.status === "active" && (
                  <>
                    <button onClick={() => router.push(`/admin/projets/${selected.id}`)} style={actionBtn("rgba(167,139,250,0.7)")}>
                      <CheckCircle2 size={13} /> Gérer le kanban →
                    </button>
                    <button onClick={() => updateProject(selected.id, { status: "completed" })} style={actionBtn("rgba(167,139,250,0.6)")}>
                      <Truck size={13} /> Marquer comme livré
                    </button>
                  </>
                )}

                {selected.status === "rejected" && (
                  <button onClick={() => updateProject(selected.id, { status: "pending" })} style={actionBtn("rgba(255,255,255,0.3)")}>
                    <Clock size={13} /> Remettre en attente
                  </button>
                )}

                {selected.status === "completed" && (
                  <div style={{ padding: "10px", borderRadius: "9px", background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.15)", display: "flex", gap: "8px", alignItems: "center" }}>
                    <AlertCircle size={13} color="rgba(167,139,250,0.6)" />
                    <span style={{ fontSize: "11px", color: "rgba(167,139,250,0.7)", fontFamily: "var(--font-poppins)" }}>
                      Projet livré · Avis demandable depuis Avis
                    </span>
                  </div>
                )}
              </div>

              {/* Danger zone */}
              <div style={{ marginTop: "20px", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                <button
                  onClick={() => { if (confirm("Supprimer ce devis définitivement ?")) deleteProject(selected.id); }}
                  style={{
                    display: "flex", alignItems: "center", gap: "7px", padding: "7px 13px", borderRadius: "8px",
                    border: "1px solid rgba(248,113,113,0.2)", background: "rgba(248,113,113,0.05)",
                    fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 500,
                    color: "rgba(248,113,113,0.55)", cursor: "pointer",
                  }}
                >
                  <Trash2 size={12} /> Supprimer le devis
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function actionBtn(color: string): React.CSSProperties {
  return {
    display: "flex", alignItems: "center", gap: "8px",
    padding: "9px 13px", borderRadius: "9px",
    border: `1px solid ${color.replace("0.7", "0.25").replace("0.6", "0.2").replace("0.3", "0.15")}`,
    background: color.replace("0.7", "0.08").replace("0.6", "0.07").replace("0.3", "0.05"),
    fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 500,
    color: color, cursor: "pointer", width: "100%", textAlign: "left",
  };
}
