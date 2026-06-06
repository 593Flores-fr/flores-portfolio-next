"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Plus, Trash2, CheckCircle2, Circle,
  Edit2, Check, X, Star,
} from "lucide-react";

type Task = { id: string; title: string; description: string | null; done: boolean; order: number };
type Column = { id: string; title: string; order: number; tasks: Task[] };
type Project = {
  id: string; title: string; status: string; paid: boolean;
  user: { id: string; name: string | null; email: string };
  columns: Column[];
  review: { id: string; status: string } | null;
};

function api(url: string, method: string, body?: unknown) {
  return fetch(url, {
    method, headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  }).then(r => r.json());
}

export function AdminProjetDetail({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [newColTitle, setNewColTitle] = useState("");
  const [addingCol, setAddingCol] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState<Record<string, string>>({});
  const [editingColId, setEditingColId] = useState<string | null>(null);
  const [editColTitle, setEditColTitle] = useState("");
  const [requestingReview, setRequestingReview] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/admin/projects/${projectId}`)
      .then(r => r.json())
      .then(data => { setProject(data); setLoading(false); });
  }, [projectId]);

  if (loading || !project) {
    return <div style={{ padding: "32px 40px", color: "rgba(255,255,255,0.2)", fontSize: "12px" }}>Chargement...</div>;
  }

  // ── Column actions ────────────────────────────────────────────────────────

  const addColumn = async () => {
    if (!newColTitle.trim()) return;
    const col = await api("/api/admin/kanban/columns", "POST", { projectId, title: newColTitle });
    setProject(p => p ? { ...p, columns: [...p.columns, { ...col, tasks: [] }] } : p);
    setNewColTitle(""); setAddingCol(false);
  };

  const deleteColumn = async (colId: string) => {
    await api(`/api/admin/kanban/columns/${colId}`, "DELETE");
    setProject(p => p ? { ...p, columns: p.columns.filter(c => c.id !== colId) } : p);
  };

  const renameColumn = async (colId: string) => {
    if (!editColTitle.trim()) return;
    const col = await api(`/api/admin/kanban/columns/${colId}`, "PATCH", { title: editColTitle });
    setProject(p => p ? { ...p, columns: p.columns.map(c => c.id === colId ? { ...c, title: col.title } : c) } : p);
    setEditingColId(null);
  };

  // ── Task actions ──────────────────────────────────────────────────────────

  const addTask = async (colId: string) => {
    const title = newTaskTitle[colId]?.trim();
    if (!title) return;
    const task = await api("/api/admin/kanban/tasks", "POST", { columnId: colId, title });
    setProject(p => p ? {
      ...p,
      columns: p.columns.map(c => c.id === colId ? { ...c, tasks: [...c.tasks, task] } : c),
    } : p);
    setNewTaskTitle(prev => ({ ...prev, [colId]: "" }));
  };

  const toggleTask = async (colId: string, taskId: string, done: boolean) => {
    const task = await api(`/api/admin/kanban/tasks/${taskId}`, "PATCH", { done: !done });
    setProject(p => p ? {
      ...p,
      columns: p.columns.map(c => c.id === colId ? { ...c, tasks: c.tasks.map(t => t.id === taskId ? task : t) } : c),
    } : p);
  };

  const deleteTask = async (colId: string, taskId: string) => {
    await api(`/api/admin/kanban/tasks/${taskId}`, "DELETE");
    setProject(p => p ? {
      ...p,
      columns: p.columns.map(c => c.id === colId ? { ...c, tasks: c.tasks.filter(t => t.id !== taskId) } : c),
    } : p);
  };

  // ── Review ────────────────────────────────────────────────────────────────

  const requestReview = async () => {
    setRequestingReview(true);
    const review = await api("/api/admin/reviews/request", "POST", { projectId });
    setProject(p => p ? { ...p, review } : p);
    setRequestingReview(false);
  };

  const total = project.columns.flatMap(c => c.tasks).length;
  const done = project.columns.flatMap(c => c.tasks).filter(t => t.done).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const inputStyle: React.CSSProperties = {
    flex: 1, padding: "7px 10px", borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
    color: "white", fontFamily: "var(--font-poppins)", fontSize: "12px", outline: "none",
  };

  return (
    <div style={{ padding: "32px 40px" }}>
      {/* Back */}
      <button onClick={() => router.push("/admin/projets")} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-poppins)", fontSize: "11px", marginBottom: "24px", padding: 0 }}>
        <ArrowLeft size={13} /> Retour aux projets
      </button>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", marginBottom: "8px" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 800, color: "white", margin: "0 0 4px", letterSpacing: "-0.01em" }}>{project.title}</h1>
          <p style={{ fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.3)", margin: 0 }}>
            {project.user.name ?? project.user.email}
          </p>
        </div>

        {/* Review request button */}
        {project.status === "active" || project.status === "completed" ? (
          project.review?.status === "requested" ? (
            <span style={{ fontSize: "11px", color: "rgba(96,165,250,0.6)", padding: "8px 14px", borderRadius: "9px", border: "1px solid rgba(96,165,250,0.15)", background: "rgba(96,165,250,0.06)" }}>
              Avis demandé ✓
            </span>
          ) : project.review?.status === "submitted" || project.review?.status === "approved" ? (
            <span style={{ fontSize: "11px", color: "rgba(74,222,128,0.6)", padding: "8px 14px", borderRadius: "9px", border: "1px solid rgba(74,222,128,0.15)", background: "rgba(74,222,128,0.06)" }}>
              Avis soumis ✓
            </span>
          ) : (
            <button onClick={requestReview} disabled={requestingReview} style={{
              display: "flex", alignItems: "center", gap: "7px", padding: "8px 14px", borderRadius: "9px",
              border: "1px solid rgba(250,204,21,0.25)", background: "rgba(250,204,21,0.07)",
              fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 500,
              color: "rgba(250,204,21,0.7)", cursor: "pointer",
            }}>
              <Star size={13} /> Demander un avis
            </button>
          )
        ) : null}
      </div>

      {/* Progress */}
      {total > 0 && (
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>{done}/{total} tâches terminées</span>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>{pct}%</span>
          </div>
          <div style={{ height: "4px", borderRadius: "99px", background: "rgba(255,255,255,0.06)" }}>
            <div style={{ height: "100%", width: `${pct}%`, borderRadius: "99px", background: "rgba(100,140,255,0.65)", transition: "width 0.4s ease" }} />
          </div>
        </div>
      )}

      {/* Kanban */}
      <div style={{ display: "flex", gap: "14px", overflowX: "auto", paddingBottom: "16px", alignItems: "flex-start" }}>

        {project.columns.map(col => (
          <motion.div
            key={col.id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{
              flex: "0 0 220px", width: "220px",
              border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px",
              background: "rgba(255,255,255,0.02)", padding: "14px",
            }}
          >
            {/* Column header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              {editingColId === col.id ? (
                <div style={{ display: "flex", gap: "5px", flex: 1 }}>
                  <input
                    value={editColTitle}
                    onChange={e => setEditColTitle(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") renameColumn(col.id); if (e.key === "Escape") setEditingColId(null); }}
                    autoFocus
                    style={{ ...inputStyle, fontSize: "11px", padding: "5px 8px" }}
                  />
                  <button onClick={() => renameColumn(col.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(74,222,128,0.7)", display: "flex" }}><Check size={13} /></button>
                  <button onClick={() => setEditingColId(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", display: "flex" }}><X size={13} /></button>
                </div>
              ) : (
                <>
                  <button onClick={() => { setEditingColId(col.id); setEditColTitle(col.title); }} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", padding: 0, flex: 1, textAlign: "left" }}>
                    <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.5)" }}>{col.title}</span>
                    <Edit2 size={10} color="rgba(255,255,255,0.2)" />
                  </button>
                  <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", marginLeft: "4px" }}>{col.tasks.length}</span>
                  <button onClick={() => deleteColumn(col.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(248,113,113,0.4)", display: "flex", marginLeft: "6px" }}>
                    <Trash2 size={12} />
                  </button>
                </>
              )}
            </div>

            {/* Tasks */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "10px" }}>
              <AnimatePresence>
                {col.tasks.map(task => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                    style={{
                      padding: "9px 10px", borderRadius: "9px",
                      border: `1px solid ${task.done ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.06)"}`,
                      background: task.done ? "rgba(74,222,128,0.04)" : "rgba(255,255,255,0.03)",
                      display: "flex", gap: "8px", alignItems: "flex-start",
                    }}
                  >
                    <button onClick={() => toggleTask(col.id, task.id, task.done)} style={{ background: "none", border: "none", cursor: "pointer", padding: "1px 0", flexShrink: 0, display: "flex" }}>
                      {task.done
                        ? <CheckCircle2 size={14} color="rgba(74,222,128,0.7)" />
                        : <Circle size={14} color="rgba(255,255,255,0.2)" />
                      }
                    </button>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: "11px", fontWeight: task.done ? 300 : 500, margin: 0,
                        color: task.done ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.72)",
                        textDecoration: task.done ? "line-through" : "none",
                        lineHeight: 1.4, wordBreak: "break-word",
                      }}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p style={{ fontSize: "10px", fontWeight: 300, color: "rgba(255,255,255,0.2)", margin: "3px 0 0", lineHeight: 1.5 }}>
                          {task.description}
                        </p>
                      )}
                    </div>
                    <button onClick={() => deleteTask(col.id, task.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(248,113,113,0.3)", display: "flex", flexShrink: 0 }}>
                      <Trash2 size={11} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Add task */}
            <div style={{ display: "flex", gap: "5px" }}>
              <input
                value={newTaskTitle[col.id] ?? ""}
                onChange={e => setNewTaskTitle(prev => ({ ...prev, [col.id]: e.target.value }))}
                onKeyDown={e => { if (e.key === "Enter") addTask(col.id); }}
                placeholder="Nouvelle tâche…"
                style={{ ...inputStyle, fontSize: "11px", padding: "6px 9px" }}
              />
              <button onClick={() => addTask(col.id)} style={{
                width: 28, height: 28, borderRadius: "7px", flexShrink: 0,
                background: "rgba(60,100,255,0.5)", border: "1px solid rgba(60,100,255,0.3)",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Plus size={13} color="white" />
              </button>
            </div>
          </motion.div>
        ))}

        {/* Add column */}
        <div style={{ flex: "0 0 180px", width: "180px" }}>
          {addingCol ? (
            <div style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", background: "rgba(255,255,255,0.02)", padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <input
                value={newColTitle}
                onChange={e => setNewColTitle(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") addColumn(); if (e.key === "Escape") setAddingCol(false); }}
                placeholder="Nom de la colonne"
                autoFocus
                style={{ ...inputStyle, fontSize: "12px" }}
              />
              <div style={{ display: "flex", gap: "6px" }}>
                <button onClick={addColumn} style={{ flex: 1, padding: "6px", borderRadius: "7px", background: "rgba(60,100,255,0.5)", border: "1px solid rgba(60,100,255,0.3)", fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 500, color: "white", cursor: "pointer" }}>
                  Créer
                </button>
                <button onClick={() => setAddingCol(false)} style={{ padding: "6px 10px", borderRadius: "7px", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "var(--font-poppins)", fontSize: "11px", color: "rgba(255,255,255,0.3)", cursor: "pointer" }}>
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAddingCol(true)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
                width: "100%", padding: "14px", borderRadius: "14px",
                border: "1px dashed rgba(255,255,255,0.1)", background: "transparent",
                fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 500,
                color: "rgba(255,255,255,0.25)", cursor: "pointer",
              }}
            >
              <Plus size={14} /> Colonne
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
