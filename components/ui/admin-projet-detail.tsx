"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Plus, Trash2, CheckCircle2, Circle, Star, StickyNote, Save,
} from "lucide-react";

type Task = { id: string; title: string; description: string | null; done: boolean; order: number };
type Column = { id: string; title: string; order: number; tasks: Task[] };
type Project = {
  id: string; title: string; status: string; paid: boolean; kanbanNotes: string | null;
  user: { id: string; name: string | null; email: string };
  columns: Column[];
  review: { id: string; status: string } | null;
};

const DEFAULT_COLS = ["À faire", "En cours", "Bloquée", "En review", "Fait"];
const COL_COLOR: Record<string, string> = {
  "À faire": "rgba(255,255,255,0.25)",
  "En cours": "rgba(96,165,250,0.7)",
  "Bloquée": "rgba(248,113,113,0.7)",
  "En review": "rgba(250,204,21,0.7)",
  "Fait": "rgba(74,222,128,0.7)",
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
  const [newTaskTitle, setNewTaskTitle] = useState<Record<string, string>>({});
  const [requestingReview, setRequestingReview] = useState(false);
  const [notes, setNotes] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/admin/projects/${projectId}`)
      .then(r => r.json())
      .then(data => { setProject(data); setNotes(data.kanbanNotes ?? ""); setLoading(false); });
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

  const requestReview = async () => {
    setRequestingReview(true);
    const review = await api("/api/admin/reviews/request", "POST", { projectId });
    setProject(p => p ? { ...p, review } : p);
    setRequestingReview(false);
  };

  if (loading || !project) {
    return <div style={{ padding: "32px 40px", color: "rgba(255,255,255,0.2)", fontSize: "12px" }}>Chargement...</div>;
  }

  const total = project.columns.flatMap(c => c.tasks).length;
  const done = project.columns.flatMap(c => c.tasks).filter(t => t.done).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  // Sort columns in fixed order
  const sortedCols = [...project.columns].sort((a, b) => a.order - b.order);

  const inputStyle: React.CSSProperties = {
    flex: 1, padding: "6px 9px", borderRadius: "7px",
    border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)",
    color: "white", fontFamily: "var(--font-poppins)", fontSize: "11px", outline: "none",
  };

  return (
    <div style={{ padding: "32px 40px", minHeight: "100%" }}>
      {/* Back */}
      <button onClick={() => router.push("/admin/projets")} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-poppins)", fontSize: "11px", marginBottom: "24px", padding: 0 }}>
        <ArrowLeft size={13} /> Retour aux projets
      </button>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", marginBottom: "12px" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 800, color: "white", margin: "0 0 4px", letterSpacing: "-0.01em" }}>{project.title}</h1>
          <p style={{ fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.3)", margin: 0 }}>
            {project.user.name ?? project.user.email}
          </p>
        </div>

        {(project.status === "active" || project.status === "completed") && (
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
        )}
      </div>

      {/* Progress */}
      {total > 0 && (
        <div style={{ marginBottom: "28px", maxWidth: "500px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>{done}/{total} tâches terminées</span>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>{pct}%</span>
          </div>
          <div style={{ height: "4px", borderRadius: "99px", background: "rgba(255,255,255,0.06)" }}>
            <div style={{ height: "100%", width: `${pct}%`, borderRadius: "99px", background: pct === 100 ? "rgba(74,222,128,0.65)" : "rgba(100,140,255,0.65)", transition: "width 0.4s ease" }} />
          </div>
        </div>
      )}

      {/* Main layout: kanban + side notes */}
      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>

        {/* Kanban columns */}
        <div style={{ flex: 1, minWidth: 0, overflowX: "auto" }}>
          <div style={{ display: "flex", gap: "12px", paddingBottom: "16px", alignItems: "flex-start", minWidth: `${sortedCols.length * 200 + (sortedCols.length - 1) * 12}px` }}>
            {sortedCols.map(col => {
              const accent = COL_COLOR[col.title] ?? "rgba(255,255,255,0.35)";
              return (
                <motion.div
                  key={col.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  style={{
                    width: "200px", flexShrink: 0,
                    border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px",
                    background: "rgba(255,255,255,0.015)", padding: "13px",
                  }}
                >
                  {/* Column header */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: accent, flexShrink: 0 }} />
                      <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(255,255,255,0.45)" }}>
                        {col.title}
                      </span>
                    </div>
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", fontWeight: 500, background: "rgba(255,255,255,0.05)", padding: "1px 6px", borderRadius: "999px" }}>
                      {col.tasks.length}
                    </span>
                  </div>

                  {/* Tasks */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginBottom: "10px", minHeight: "40px" }}>
                    <AnimatePresence>
                      {col.tasks.map(task => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                          style={{
                            padding: "8px 9px", borderRadius: "9px",
                            border: `1px solid ${task.done ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.06)"}`,
                            background: task.done ? "rgba(74,222,128,0.04)" : "rgba(255,255,255,0.025)",
                            display: "flex", gap: "7px", alignItems: "flex-start",
                          }}
                        >
                          <button onClick={() => toggleTask(col.id, task.id, task.done)} style={{ background: "none", border: "none", cursor: "pointer", padding: "1px 0", flexShrink: 0, display: "flex" }}>
                            {task.done
                              ? <CheckCircle2 size={13} color="rgba(74,222,128,0.7)" />
                              : <Circle size={13} color="rgba(255,255,255,0.2)" />
                            }
                          </button>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{
                              fontSize: "11px", fontWeight: task.done ? 300 : 500, margin: 0,
                              color: task.done ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.75)",
                              textDecoration: task.done ? "line-through" : "none",
                              lineHeight: 1.4, wordBreak: "break-word",
                            }}>
                              {task.title}
                            </p>
                          </div>
                          <button onClick={() => deleteTask(col.id, task.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(248,113,113,0.3)", display: "flex", flexShrink: 0, padding: "1px 0" }}>
                            <Trash2 size={10} />
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
                      placeholder="Ajouter…"
                      style={inputStyle}
                    />
                    <button onClick={() => addTask(col.id)} style={{
                      width: 26, height: 26, borderRadius: "6px", flexShrink: 0,
                      background: "rgba(60,100,255,0.45)", border: "1px solid rgba(60,100,255,0.25)",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Plus size={12} color="white" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Side notes panel */}
        <div style={{
          width: "220px", flexShrink: 0,
          border: "1px solid rgba(250,204,21,0.12)", borderRadius: "14px",
          background: "rgba(250,204,21,0.03)", padding: "14px",
          position: "sticky", top: "32px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "10px" }}>
            <StickyNote size={13} color="rgba(250,204,21,0.55)" />
            <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(250,204,21,0.5)" }}>
              Notes & idées
            </span>
          </div>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder={"Consignes, idées, rappels…\n\nVisibles uniquement par vous."}
            rows={12}
            style={{
              width: "100%", padding: "9px 10px", borderRadius: "9px", resize: "vertical",
              border: "1px solid rgba(250,204,21,0.1)", background: "rgba(250,204,21,0.04)",
              color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-poppins)", fontSize: "11px",
              fontWeight: 300, outline: "none", boxSizing: "border-box", lineHeight: 1.7,
              minHeight: "180px",
            }}
          />
          <button
            onClick={saveNotes}
            disabled={savingNotes}
            style={{
              marginTop: "8px", width: "100%", padding: "7px 10px", borderRadius: "8px",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
              border: `1px solid ${notesSaved ? "rgba(74,222,128,0.25)" : "rgba(250,204,21,0.2)"}`,
              background: notesSaved ? "rgba(74,222,128,0.07)" : "rgba(250,204,21,0.07)",
              fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 500,
              color: notesSaved ? "rgba(74,222,128,0.7)" : "rgba(250,204,21,0.6)",
              cursor: "pointer", transition: "all 0.2s",
            }}
          >
            <Save size={11} />
            {notesSaved ? "Sauvegardé ✓" : savingNotes ? "…" : "Sauvegarder"}
          </button>
        </div>
      </div>
    </div>
  );
}
