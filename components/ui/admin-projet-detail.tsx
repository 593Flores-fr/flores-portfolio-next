"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, CheckCircle2, Circle, Star, StickyNote, Save, Eye, EyeOff, X } from "lucide-react";

type Task = { id: string; title: string; description: string | null; category: string | null; priority: string; done: boolean; order: number };
type Column = { id: string; title: string; order: number; tasks: Task[] };
type Project = {
  id: string; title: string; status: string; paid: boolean; kanbanNotes: string | null;
  kanbanVisible: boolean;
  user: { id: string; name: string | null; email: string };
  columns: Column[];
  review: { id: string; status: string } | null;
};

const DEFAULT_COLS = ["À faire", "En cours", "Bloquée", "En review", "Fait"];
const COL_COLOR: Record<string, string> = {
  "À faire": "rgba(255,255,255,0.35)",
  "En cours": "rgba(96,165,250,0.8)",
  "Bloquée": "rgba(248,113,113,0.8)",
  "En review": "rgba(250,204,21,0.8)",
  "Fait": "rgba(74,222,128,0.8)",
};
const COL_BG: Record<string, string> = {
  "À faire": "rgba(255,255,255,0.04)",
  "En cours": "rgba(96,165,250,0.08)",
  "Bloquée": "rgba(248,113,113,0.08)",
  "En review": "rgba(250,204,21,0.06)",
  "Fait": "rgba(74,222,128,0.06)",
};

const CATEGORIES = [
  { value: "dev",         label: "Développement",  color: "rgba(96,165,250,1)",  bg: "rgba(96,165,250,0.12)"  },
  { value: "feature",     label: "Fonctionnalité",  color: "rgba(167,139,250,1)", bg: "rgba(167,139,250,0.12)" },
  { value: "idea",        label: "Idée",            color: "rgba(251,146,60,1)",  bg: "rgba(251,146,60,0.12)"  },
  { value: "visual",      label: "Visuel",          color: "rgba(52,211,153,1)",  bg: "rgba(52,211,153,0.12)"  },
  { value: "integration", label: "Intégration",     color: "rgba(232,121,249,1)", bg: "rgba(232,121,249,0.12)" },
];

const PRIORITIES = [
  { value: "faible", label: "Faible", color: "rgba(156,163,175,0.7)", bg: "rgba(156,163,175,0.08)" },
  { value: "moyen", label: "Moyen", color: "rgba(250,204,21,0.8)", bg: "rgba(250,204,21,0.08)" },
  { value: "urgent", label: "Urgent", color: "rgba(248,113,113,0.9)", bg: "rgba(248,113,113,0.1)" },
];

function getCat(v: string | null) { return CATEGORIES.find(c => c.value === v) ?? null; }
function getPrio(v: string) { return PRIORITIES.find(p => p.value === v) ?? PRIORITIES[1]; }

function api(url: string, method: string, body?: unknown) {
  return fetch(url, {
    method, headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  }).then(r => r.json());
}

// ── Task Modal ────────────────────────────────────────────────────────────────

type ModalMode = { type: "new"; columnId: string } | { type: "edit"; task: Task; columnId: string };

function TaskModal({
  mode, columns, onClose, onSave, onDelete,
}: {
  mode: ModalMode;
  columns: Column[];
  onClose: () => void;
  onSave: (data: Partial<Task> & { columnId: string; id?: string }) => Promise<void>;
  onDelete?: (taskId: string) => Promise<void>;
}) {
  const isEdit = mode.type === "edit";
  const [title, setTitle] = useState(isEdit ? mode.task.title : "");
  const [description, setDescription] = useState(isEdit ? (mode.task.description ?? "") : "");
  const [category, setCategory] = useState(isEdit ? (mode.task.category ?? "") : "");
  const [priority, setPriority] = useState(isEdit ? mode.task.priority : "moyen");
  const [columnId, setColumnId] = useState(mode.columnId);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    await onSave({ id: isEdit ? mode.task.id : undefined, title, description: description || null, category: category || null, priority, columnId, done: isEdit ? mode.task.done : false });
    setSaving(false);
    onClose();
  };

  const handleDelete = async () => {
    if (!isEdit || !onDelete) return;
    setDeleting(true);
    await onDelete(mode.task.id);
    setDeleting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          onClick={e => e.stopPropagation()}
          style={{
            width: "100%", maxWidth: "520px",
            background: "#0e1420", borderRadius: "18px",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "28px",
            boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
            fontFamily: "var(--font-poppins)",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "13px", fontWeight: 800, color: "white", textTransform: "uppercase", letterSpacing: "0.12em", margin: 0 }}>
              {isEdit ? "Modifier la tâche" : "Nouvelle tâche"}
            </h3>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", display: "flex", padding: 0 }}>
              <X size={18} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Title */}
            <div>
              <label style={labelStyle}>Titre *</label>
              <input
                value={title} onChange={e => setTitle(e.target.value)}
                placeholder="Titre de la tâche"
                autoFocus
                style={inputStyle}
              />
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>Description</label>
              <textarea
                value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Détails, contexte…"
                rows={3}
                style={{ ...inputStyle, resize: "vertical", minHeight: "72px" }}
              />
            </div>

            {/* Category + Statut */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={labelStyle}>Catégorie / Projet</label>
                <select value={category} onChange={e => setCategory(e.target.value)} style={selectStyle}>
                  <option value="">Aucune</option>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Statut (colonne)</label>
                <select value={columnId} onChange={e => setColumnId(e.target.value)} style={selectStyle}>
                  {columns.map(col => <option key={col.id} value={col.id}>{col.title}</option>)}
                </select>
              </div>
            </div>

            {/* Priority */}
            <div>
              <label style={labelStyle}>Priorité</label>
              <div style={{ display: "flex", gap: "8px" }}>
                {PRIORITIES.map(p => (
                  <button
                    key={p.value} type="button"
                    onClick={() => setPriority(p.value)}
                    style={{
                      flex: 1, padding: "9px 0", borderRadius: "9px", cursor: "pointer",
                      border: `1px solid ${priority === p.value ? p.color + "55" : "rgba(255,255,255,0.07)"}`,
                      background: priority === p.value ? p.bg : "rgba(255,255,255,0.02)",
                      fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: priority === p.value ? 700 : 400,
                      color: priority === p.value ? p.color : "rgba(255,255,255,0.35)",
                      transition: "all 0.15s",
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <div>
              {isEdit && onDelete && (
                <button onClick={handleDelete} disabled={deleting} style={{
                  display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "9px",
                  border: "1px solid rgba(248,113,113,0.2)", background: "rgba(248,113,113,0.07)",
                  fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 500,
                  color: "rgba(248,113,113,0.7)", cursor: "pointer",
                }}>
                  <Trash2 size={12} /> Supprimer
                </button>
              )}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={onClose} style={{
                padding: "8px 16px", borderRadius: "9px", border: "1px solid rgba(255,255,255,0.1)",
                background: "transparent", fontFamily: "var(--font-poppins)", fontSize: "12px",
                color: "rgba(255,255,255,0.4)", cursor: "pointer",
              }}>
                Annuler
              </button>
              <button onClick={handleSave} disabled={!title.trim() || saving} style={{
                padding: "8px 20px", borderRadius: "9px",
                border: "1px solid rgba(250,204,21,0.3)", background: "rgba(250,204,21,0.85)",
                fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 700,
                color: "#0a0a0a", cursor: (!title.trim() || saving) ? "not-allowed" : "pointer",
                opacity: (!title.trim() || saving) ? 0.5 : 1, transition: "opacity 0.15s",
              }}>
                {saving ? "…" : "Enregistrer"}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "9px 12px", borderRadius: "9px",
  border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)",
  color: "white", fontFamily: "var(--font-poppins)", fontSize: "12px",
  outline: "none", boxSizing: "border-box", lineHeight: 1.5,
};
const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: "none", cursor: "pointer", colorScheme: "dark",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(255,255,255,0.2)'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center",
  paddingRight: "28px",
};
const labelStyle: React.CSSProperties = {
  display: "block", fontFamily: "var(--font-poppins)", fontSize: "9px", fontWeight: 600,
  color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: "6px",
};

// ── Main component ────────────────────────────────────────────────────────────

export function AdminProjetDetail({ projectId, compact = false }: { projectId: string; compact?: boolean }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [togglingVisibility, setTogglingVisibility] = useState(false);
  const [requestingReview, setRequestingReview] = useState(false);
  const [modal, setModal] = useState<ModalMode | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/admin/projects/${projectId}`)
      .then(r => r.json())
      .then(data => {
        setProject(data);
        setNotes(data.kanbanNotes ?? "");
        setLoading(false);
        if (data.columns?.length === 0) {
          fetch(`/api/admin/projects/${projectId}`, {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ initColumns: true }),
          }).then(r => r.json()).then(updated => {
            setProject(updated);
            setNotes(updated.kanbanNotes ?? "");
          });
        }
      });
  }, [projectId]);

  const saveNotes = async () => {
    if (!project) return;
    setSavingNotes(true);
    await fetch(`/api/admin/projects/${projectId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kanbanNotes: notes }),
    });
    setSavingNotes(false);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  const handleSaveTask = async (data: Partial<Task> & { columnId: string; id?: string }) => {
    if (data.id) {
      // Edit existing
      const updated = await api(`/api/admin/kanban/tasks/${data.id}`, "PATCH", {
        title: data.title, description: data.description,
        category: data.category, priority: data.priority,
        columnId: data.columnId,
      });
      setProject(p => {
        if (!p) return p;
        const cols = p.columns.map(c => ({
          ...c,
          tasks: c.tasks.filter(t => t.id !== data.id),
        }));
        const targetCol = cols.find(c => c.id === data.columnId);
        if (targetCol) targetCol.tasks = [...targetCol.tasks, updated].sort((a, b) => a.order - b.order);
        return { ...p, columns: cols };
      });
    } else {
      // New task
      const task = await api("/api/admin/kanban/tasks", "POST", {
        columnId: data.columnId, title: data.title,
        description: data.description, category: data.category, priority: data.priority,
      });
      setProject(p => p ? {
        ...p,
        columns: p.columns.map(c => c.id === data.columnId ? { ...c, tasks: [...c.tasks, task] } : c),
      } : p);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    await api(`/api/admin/kanban/tasks/${taskId}`, "DELETE");
    setProject(p => p ? {
      ...p,
      columns: p.columns.map(c => ({ ...c, tasks: c.tasks.filter(t => t.id !== taskId) })),
    } : p);
  };

  const toggleTask = async (colId: string, task: Task) => {
    const updated = await api(`/api/admin/kanban/tasks/${task.id}`, "PATCH", { done: !task.done });
    setProject(p => p ? {
      ...p,
      columns: p.columns.map(c => c.id === colId ? { ...c, tasks: c.tasks.map(t => t.id === task.id ? updated : t) } : c),
    } : p);
  };

  const toggleVisibility = async () => {
    if (!project) return;
    setTogglingVisibility(true);
    const updated = await api(`/api/admin/projects/${projectId}`, "PATCH", { kanbanVisible: !project.kanbanVisible });
    setProject(updated);
    setTogglingVisibility(false);
  };

  const requestReview = async () => {
    setRequestingReview(true);
    const review = await api("/api/admin/reviews/request", "POST", { projectId });
    setProject(p => p ? { ...p, review } : p);
    setRequestingReview(false);
  };

  if (loading || !project) {
    return <div style={{ padding: compact ? "16px" : "32px 40px", color: "rgba(255,255,255,0.2)", fontSize: "12px" }}>Chargement...</div>;
  }

  const allTasks = project.columns.flatMap(c => c.tasks);
  const total = allTasks.length;
  const done = allTasks.filter(t => t.done).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const sortedCols = [...project.columns].sort((a, b) => a.order - b.order);

  return (
    <div style={{ padding: compact ? "20px 24px" : "32px 40px", minHeight: "100%", fontFamily: "var(--font-poppins)" }}>
      {/* Modal */}
      {modal && (
        <TaskModal
          mode={modal}
          columns={sortedCols}
          onClose={() => setModal(null)}
          onSave={handleSaveTask}
          onDelete={modal.type === "edit" ? handleDeleteTask : undefined}
        />
      )}

      {/* Back */}
      {!compact && (
        <button onClick={() => router.push("/admin/projets")} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", fontSize: "11px", marginBottom: "24px", padding: 0 }}>
          <ArrowLeft size={13} /> Retour
        </button>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", marginBottom: "10px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "2px" }}>
            <h1 style={{ fontSize: "18px", fontWeight: 800, color: "white", margin: 0, letterSpacing: "-0.01em" }}>{project.title}</h1>
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontWeight: 300 }}>
              {total} tâche{total !== 1 ? "s" : ""} — {done} terminée{done !== 1 ? "s" : ""}
            </span>
          </div>
          <p style={{ fontSize: "11px", fontWeight: 300, color: "rgba(255,255,255,0.3)", margin: 0 }}>
            {project.user.name ?? project.user.email}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          {/* Visibility toggle */}
          <button onClick={toggleVisibility} disabled={togglingVisibility} style={{
            display: "flex", alignItems: "center", gap: "6px", padding: "7px 13px", borderRadius: "9px",
            border: `1px solid ${project.kanbanVisible ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.1)"}`,
            background: project.kanbanVisible ? "rgba(74,222,128,0.08)" : "rgba(255,255,255,0.04)",
            fontSize: "11px", fontWeight: 500,
            color: project.kanbanVisible ? "rgba(74,222,128,0.8)" : "rgba(255,255,255,0.35)",
            cursor: "pointer",
          }}>
            {project.kanbanVisible ? <Eye size={12} /> : <EyeOff size={12} />}
            {project.kanbanVisible ? "Visible client" : "Masqué"}
          </button>

          {/* Review */}
          {(project.status === "active" || project.status === "completed") && (
            project.review?.status === "requested" ? (
              <span style={{ fontSize: "11px", color: "rgba(96,165,250,0.6)", padding: "7px 13px", borderRadius: "9px", border: "1px solid rgba(96,165,250,0.15)", background: "rgba(96,165,250,0.06)" }}>Avis demandé ✓</span>
            ) : project.review?.status === "submitted" || project.review?.status === "approved" ? (
              <span style={{ fontSize: "11px", color: "rgba(74,222,128,0.6)", padding: "7px 13px", borderRadius: "9px", border: "1px solid rgba(74,222,128,0.15)", background: "rgba(74,222,128,0.06)" }}>Avis soumis ✓</span>
            ) : (
              <button onClick={requestReview} disabled={requestingReview} style={{
                display: "flex", alignItems: "center", gap: "6px", padding: "7px 13px", borderRadius: "9px",
                border: "1px solid rgba(250,204,21,0.25)", background: "rgba(250,204,21,0.07)",
                fontSize: "11px", fontWeight: 500, color: "rgba(250,204,21,0.7)", cursor: "pointer",
              }}>
                <Star size={12} /> Demander un avis
              </button>
            )
          )}

          {/* Nouvelle tâche */}
          <button onClick={() => setModal({ type: "new", columnId: sortedCols[0]?.id ?? "" })} style={{
            display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "9px",
            border: "1px solid rgba(250,204,21,0.35)", background: "rgba(250,204,21,0.85)",
            fontSize: "11px", fontWeight: 700, color: "#0a0a0a", cursor: "pointer",
          }}>
            <Plus size={13} /> Nouvelle tâche
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div style={{ marginBottom: "24px", maxWidth: "400px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ flex: 1, height: "4px", borderRadius: "99px", background: "rgba(255,255,255,0.06)" }}>
              <div style={{ height: "100%", width: `${pct}%`, borderRadius: "99px", background: pct === 100 ? "rgba(74,222,128,0.65)" : "rgba(100,140,255,0.65)", transition: "width 0.4s ease" }} />
            </div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.4)", flexShrink: 0 }}>{pct}%</span>
          </div>
        </div>
      )}

      {/* Main: kanban + notes */}
      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
        {/* Kanban */}
        <div style={{ flex: 1, minWidth: 0, overflowX: "auto" }}>
          <div style={{ display: "flex", gap: "14px", paddingBottom: "16px", alignItems: "flex-start", minWidth: `${sortedCols.length * 220 + (sortedCols.length - 1) * 14}px` }}>
            {sortedCols.map(col => {
              const accent = COL_COLOR[col.title] ?? "rgba(255,255,255,0.35)";
              const bg = COL_BG[col.title] ?? "rgba(255,255,255,0.015)";
              const doneTasks = col.tasks.filter(t => t.done).length;
              return (
                <motion.div
                  key={col.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  style={{ width: "220px", flexShrink: 0, border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", background: bg, padding: "13px" }}
                >
                  {/* Column header */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: accent, flexShrink: 0 }} />
                      <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(255,255,255,0.55)" }}>
                        {col.title}
                      </span>
                      <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", fontWeight: 500, background: "rgba(255,255,255,0.05)", padding: "1px 6px", borderRadius: "999px" }}>
                        {col.tasks.length}
                      </span>
                    </div>
                    <button
                      onClick={() => setModal({ type: "new", columnId: col.id })}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.25)", display: "flex", padding: "2px", borderRadius: "5px" }}
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  {/* Tasks */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "6px" }}>
                    <AnimatePresence>
                      {col.tasks.map(task => {
                        const cat = getCat(task.category);
                        const prio = getPrio(task.priority);
                        return (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
                            onClick={() => setModal({ type: "edit", task, columnId: col.id })}
                            style={{
                              padding: "10px 12px", borderRadius: "10px", cursor: "pointer",
                              border: `1px solid ${task.done ? "rgba(74,222,128,0.2)" : "rgba(255,255,255,0.1)"}`,
                              background: task.done ? "rgba(74,222,128,0.06)" : "rgba(255,255,255,0.05)",
                              transition: "border-color 0.15s, background 0.15s",
                            }}
                          >
                            {/* Category tag */}
                            {cat && (
                              <div style={{ marginBottom: "6px" }}>
                                <span style={{
                                  fontSize: "8px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
                                  color: cat.color, background: cat.bg,
                                  padding: "2px 7px", borderRadius: "999px",
                                }}>
                                  {cat.label}
                                </span>
                              </div>
                            )}

                            {/* Title + check */}
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "7px" }}>
                              <button
                                onClick={e => { e.stopPropagation(); toggleTask(col.id, task); }}
                                style={{ background: "none", border: "none", cursor: "pointer", padding: "1px 0", flexShrink: 0, display: "flex" }}
                              >
                                {task.done
                                  ? <CheckCircle2 size={13} color="rgba(74,222,128,0.7)" />
                                  : <Circle size={13} color="rgba(255,255,255,0.2)" />
                                }
                              </button>
                              <p style={{
                                fontSize: "12px", fontWeight: task.done ? 300 : 600, margin: 0,
                                color: task.done ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.85)",
                                textDecoration: task.done ? "line-through" : "none",
                                lineHeight: 1.4, wordBreak: "break-word",
                              }}>
                                {task.title}
                              </p>
                            </div>

                            {/* Description */}
                            {task.description && (
                              <p style={{ fontSize: "10px", fontWeight: 300, color: "rgba(255,255,255,0.3)", margin: "5px 0 0 20px", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                                {task.description}
                              </p>
                            )}

                            {/* Priority */}
                            <div style={{ marginTop: "8px", display: "flex", justifyContent: "flex-end" }}>
                              <span style={{
                                fontSize: "8px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
                                color: prio.color, background: prio.bg,
                                padding: "2px 7px", borderRadius: "999px",
                              }}>
                                {prio.label}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                    {col.tasks.length === 0 && (
                      <div style={{ padding: "16px 12px", borderRadius: "10px", border: "1px dashed rgba(255,255,255,0.06)", textAlign: "center", fontSize: "10px", color: "rgba(255,255,255,0.12)" }}>
                        Vide
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Side notes */}
        <div style={{
          width: "200px", flexShrink: 0,
          border: "1px solid rgba(250,204,21,0.12)", borderRadius: "14px",
          background: "rgba(250,204,21,0.03)", padding: "14px",
          position: "sticky", top: compact ? "20px" : "32px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "10px" }}>
            <StickyNote size={13} color="rgba(250,204,21,0.55)" />
            <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(250,204,21,0.5)" }}>Notes</span>
          </div>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder={"Consignes, idées…\n\nVisibles uniquement par vous."}
            rows={10}
            style={{
              width: "100%", padding: "9px 10px", borderRadius: "9px", resize: "vertical",
              border: "1px solid rgba(250,204,21,0.1)", background: "rgba(250,204,21,0.04)",
              color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-poppins)", fontSize: "11px",
              fontWeight: 300, outline: "none", boxSizing: "border-box", lineHeight: 1.7,
              minHeight: "140px",
            }}
          />
          <button onClick={saveNotes} disabled={savingNotes} style={{
            marginTop: "8px", width: "100%", padding: "7px 10px", borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
            border: `1px solid ${notesSaved ? "rgba(74,222,128,0.25)" : "rgba(250,204,21,0.2)"}`,
            background: notesSaved ? "rgba(74,222,128,0.07)" : "rgba(250,204,21,0.07)",
            fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 500,
            color: notesSaved ? "rgba(74,222,128,0.7)" : "rgba(250,204,21,0.6)",
            cursor: "pointer", transition: "all 0.2s",
          }}>
            <Save size={11} />
            {notesSaved ? "Sauvegardé ✓" : savingNotes ? "…" : "Sauvegarder"}
          </button>
        </div>
      </div>
    </div>
  );
}
