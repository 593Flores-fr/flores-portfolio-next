"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit2, Eye, EyeOff, GripVertical, Check, X } from "lucide-react";

type PortfolioProject = {
  id: string; slug: string; title: string; tag: string;
  description: string; imageSrc: string; order: number; published: boolean;
};

const emptyForm = { slug: "", title: "", tag: "", description: "", imageSrc: "", order: 0, published: true };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "10px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.25)", marginBottom: "5px" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 11px", borderRadius: "8px", boxSizing: "border-box",
  border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)",
  color: "white", fontFamily: "var(--font-poppins)", fontSize: "12px", outline: "none",
};

export function AdminPortfolio() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PortfolioProject | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/portfolio").then(r => r.json()).then(data => { setProjects(data); setLoading(false); });
  }, []);

  const openCreate = () => { setForm(emptyForm); setEditing(null); setCreating(true); };
  const openEdit = (p: PortfolioProject) => { setForm({ slug: p.slug, title: p.title, tag: p.tag, description: p.description, imageSrc: p.imageSrc, order: p.order, published: p.published }); setEditing(p); setCreating(false); };
  const closePanel = () => { setEditing(null); setCreating(false); };

  const save = async () => {
    setSaving(true);
    if (editing) {
      const res = await fetch(`/api/admin/portfolio/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const updated = await res.json();
      setProjects(p => p.map(x => x.id === editing.id ? updated : x));
      setEditing(updated);
    } else {
      const res = await fetch("/api/admin/portfolio", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const created = await res.json();
      setProjects(p => [...p, created]);
      closePanel();
    }
    setSaving(false);
  };

  const deleteProject = async (id: string) => {
    setDeleting(id);
    await fetch(`/api/admin/portfolio/${id}`, { method: "DELETE" });
    setProjects(p => p.filter(x => x.id !== id));
    if (editing?.id === id) closePanel();
    setDeleting(null);
  };

  const togglePublished = async (p: PortfolioProject) => {
    const res = await fetch(`/api/admin/portfolio/${p.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ published: !p.published }) });
    const updated = await res.json();
    setProjects(prev => prev.map(x => x.id === p.id ? updated : x));
  };

  return (
    <div style={{ padding: "32px 40px", maxWidth: "960px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 800, color: "white", margin: "0 0 4px", letterSpacing: "-0.01em" }}>Portfolio</h1>
          <p style={{ fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.3)", margin: 0 }}>Gérez les projets affichés sur votre page portfolio.</p>
        </div>
        <button onClick={openCreate} style={{
          display: "flex", alignItems: "center", gap: "7px", padding: "9px 16px", borderRadius: "10px",
          border: "1px solid rgba(60,100,255,0.3)", background: "rgba(60,100,255,0.12)",
          fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 500,
          color: "rgba(100,140,255,0.9)", cursor: "pointer",
        }}>
          <Plus size={14} /> Nouveau projet
        </button>
      </div>

      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
        {/* List */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", padding: "40px 0", textAlign: "center" }}>Chargement...</p>
          ) : projects.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.15)", margin: 0 }}>Aucun projet portfolio. Créez-en un.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[...projects].sort((a, b) => a.order - b.order).map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    padding: "12px 14px", borderRadius: "12px",
                    border: `1px solid ${editing?.id === p.id ? "rgba(60,100,255,0.3)" : "rgba(255,255,255,0.06)"}`,
                    background: editing?.id === p.id ? "rgba(60,100,255,0.06)" : "rgba(255,255,255,0.02)",
                    cursor: "pointer", opacity: p.published ? 1 : 0.45,
                  }}
                  onClick={() => openEdit(p)}
                >
                  {/* Thumb */}
                  <div style={{ width: "44px", height: "44px", borderRadius: "8px", flexShrink: 0, overflow: "hidden", background: "rgba(255,255,255,0.05)" }}>
                    {p.imageSrc ? <img src={p.imageSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.85)", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</p>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <span style={{ fontSize: "10px", padding: "1px 7px", borderRadius: "5px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)" }}>{p.tag}</span>
                      <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>#{p.order}</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                    <button
                      onClick={e => { e.stopPropagation(); togglePublished(p); }}
                      title={p.published ? "Dépublier" : "Publier"}
                      style={{ width: 28, height: 28, borderRadius: "7px", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      {p.published ? <Eye size={13} color="rgba(74,222,128,0.6)" /> : <EyeOff size={13} color="rgba(255,255,255,0.2)" />}
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); deleteProject(p.id); }}
                      disabled={deleting === p.id}
                      style={{ width: 28, height: 28, borderRadius: "7px", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <Trash2 size={13} color="rgba(248,113,113,0.45)" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Form panel */}
        <AnimatePresence>
          {(creating || editing) && (
            <motion.div
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: "320px", flexShrink: 0,
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px",
                background: "rgba(255,255,255,0.02)", padding: "20px",
                position: "sticky", top: "32px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "white", margin: 0 }}>
                  {editing ? "Modifier" : "Nouveau projet"}
                </p>
                <button onClick={closePanel} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", display: "flex", padding: 0 }}>
                  <X size={15} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Field label="Titre">
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Projet X" style={inputStyle} />
                </Field>
                <Field label="Slug (URL)">
                  <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="projet-x" style={inputStyle} />
                </Field>
                <Field label="Tag / Catégorie">
                  <input value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} placeholder="Identité visuelle" style={inputStyle} />
                </Field>
                <Field label="Description">
                  <textarea
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={3}
                    placeholder="Description courte du projet…"
                    style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                  />
                </Field>
                <Field label="Image (URL)">
                  <input value={form.imageSrc} onChange={e => setForm(f => ({ ...f, imageSrc: e.target.value }))} placeholder="https://…" style={inputStyle} />
                </Field>
                {form.imageSrc && (
                  <div style={{ borderRadius: "8px", overflow: "hidden", height: "100px", background: "rgba(255,255,255,0.04)" }}>
                    <img src={form.imageSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                <Field label="Ordre d'affichage">
                  <input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} style={{ ...inputStyle, width: "80px" }} />
                </Field>
                <Field label="Visibilité">
                  <button
                    onClick={() => setForm(f => ({ ...f, published: !f.published }))}
                    style={{
                      display: "flex", alignItems: "center", gap: "7px", padding: "7px 12px", borderRadius: "8px", cursor: "pointer",
                      border: `1px solid ${form.published ? "rgba(74,222,128,0.25)" : "rgba(255,255,255,0.1)"}`,
                      background: form.published ? "rgba(74,222,128,0.07)" : "rgba(255,255,255,0.03)",
                      fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 500,
                      color: form.published ? "rgba(74,222,128,0.8)" : "rgba(255,255,255,0.3)",
                    }}
                  >
                    {form.published ? <Eye size={13} /> : <EyeOff size={13} />}
                    {form.published ? "Publié" : "Masqué"}
                  </button>
                </Field>
              </div>

              <button
                onClick={save}
                disabled={saving || !form.title.trim() || !form.slug.trim()}
                style={{
                  marginTop: "18px", width: "100%", padding: "10px", borderRadius: "10px",
                  border: "1px solid rgba(60,100,255,0.3)", background: "rgba(60,100,255,0.2)",
                  fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 600,
                  color: "rgba(140,170,255,0.9)", cursor: "pointer",
                  opacity: (saving || !form.title.trim() || !form.slug.trim()) ? 0.4 : 1,
                }}
              >
                {saving ? "Enregistrement…" : editing ? "Mettre à jour" : "Créer le projet"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
