"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Eye, EyeOff, Check, X, BookImage, Upload, Layers, ChevronUp, ChevronDown,
  AlignLeft, Columns2, GalleryHorizontal, Video, BarChart3,
} from "lucide-react";
import { ImagePickerModal } from "@/components/ui/admin-image-picker";
import { toBlockArray, emptyBlock, type PortfolioBlock } from "@/lib/portfolio-blocks";
import { uploadImage } from "@/lib/upload-client";

type Section = { id: string; name: string; color: string; order: number };

type PortfolioProject = {
  id: string; slug: string; title: string; tag: string;
  description: string; imageSrc: string; logoSrc: string; order: number; published: boolean;
  sectionId: string | null; section?: Section | null; year: string; client: string;
  fullDescription: string; challenge: string;
  images: string[]; mockupImages: string[]; blocks: unknown; tools: string[];
  externalLink: string | null; discordUrl: string | null; accentColor: string;
};

type PickerTarget =
  | { kind: "cover" | "logo" | "gallery" | "mockup" }
  | { kind: "blockImage" | "blockCarousel"; index: number };

const emptyForm = {
  slug: "", title: "", tag: "", description: "", imageSrc: "", logoSrc: "",
  sectionId: "", year: "", client: "", fullDescription: "", challenge: "",
  imagesRaw: "", mockupImagesRaw: "", toolsRaw: "", externalLink: "", discordUrl: "", accentColor: "",
  order: 0, published: true, blocks: [] as PortfolioBlock[],
};

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

// ── Gestion des sections ────────────────────────────────────────────────────────

function SectionRow({ section, isFirst, isLast, onRename, onColor, onMove, onDelete }: {
  section: Section; isFirst: boolean; isLast: boolean;
  onRename: (name: string) => void;
  onColor: (color: string) => void;
  onMove: (dir: "up" | "down") => void;
  onDelete: () => void;
}) {
  const [name, setName] = useState(section.name);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", borderRadius: "8px", background: "rgba(255,255,255,0.02)" }}>
      <input
        type="color"
        value={section.color}
        onChange={e => onColor(e.target.value)}
        style={{ width: 26, height: 26, padding: 0, border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", background: "none", cursor: "pointer", flexShrink: 0 }}
      />
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        onBlur={() => { if (name.trim() && name.trim() !== section.name) onRename(name.trim()); else setName(section.name); }}
        onKeyDown={e => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
        style={{ ...inputStyle, flex: 1, padding: "6px 9px" }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
        <button type="button" onClick={() => onMove("up")} disabled={isFirst} style={{ background: "none", border: "none", cursor: isFirst ? "default" : "pointer", padding: "1px", opacity: isFirst ? 0.2 : 0.6, display: "flex" }}>
          <ChevronUp size={13} color="white" />
        </button>
        <button type="button" onClick={() => onMove("down")} disabled={isLast} style={{ background: "none", border: "none", cursor: isLast ? "default" : "pointer", padding: "1px", opacity: isLast ? 0.2 : 0.6, display: "flex" }}>
          <ChevronDown size={13} color="white" />
        </button>
      </div>
      <button type="button" onClick={onDelete} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex", flexShrink: 0 }}>
        <Trash2 size={13} color="rgba(248,113,113,0.5)" />
      </button>
    </div>
  );
}

function SectionsManagerModal({ open, onClose, sections, onAdd, onRename, onColor, onMove, onDelete }: {
  open: boolean; onClose: () => void; sections: Section[];
  onAdd: (name: string, color: string) => void;
  onRename: (id: string, name: string) => void;
  onColor: (id: string, color: string) => void;
  onMove: (id: string, dir: "up" | "down") => void;
  onDelete: (id: string) => void;
}) {
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#5c5cf5");

  if (!open) return null;

  const submit = () => {
    if (!newName.trim()) return;
    onAdd(newName.trim(), newColor);
    setNewName(""); setNewColor("#5c5cf5");
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9000, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", width: "100%", maxWidth: "420px", padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <p style={{ fontSize: "14px", fontWeight: 700, color: "white", margin: 0 }}>Gérer les sections</p>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: "4px", display: "flex" }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" }}>
          {sections.length === 0 ? (
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", padding: "12px 0", textAlign: "center" }}>Aucune section. Créez-en une ci-dessous.</p>
          ) : (
            sections.map((s, i) => (
              <SectionRow
                key={s.id}
                section={s}
                isFirst={i === 0}
                isLast={i === sections.length - 1}
                onRename={name => onRename(s.id, name)}
                onColor={color => onColor(s.id, color)}
                onMove={dir => onMove(s.id, dir)}
                onDelete={() => onDelete(s.id)}
              />
            ))
          )}
        </div>

        <div style={{ display: "flex", gap: "8px", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <input
            type="color"
            value={newColor}
            onChange={e => setNewColor(e.target.value)}
            style={{ width: 34, height: 34, padding: 0, border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", background: "none", cursor: "pointer", flexShrink: 0 }}
          />
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") submit(); }}
            placeholder="Nouvelle section (ex: Motion Design)"
            style={{ ...inputStyle, flex: 1 }}
          />
          <button
            type="button"
            onClick={submit}
            disabled={!newName.trim()}
            style={{
              padding: "0 14px", borderRadius: "8px", border: "1px solid rgba(60,100,255,0.3)",
              background: "rgba(60,100,255,0.15)", color: "rgba(140,170,255,0.9)",
              cursor: newName.trim() ? "pointer" : "not-allowed", opacity: newName.trim() ? 1 : 0.4,
              display: "flex", alignItems: "center", flexShrink: 0,
            }}
          >
            <Plus size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Éditeur de blocs de présentation ────────────────────────────────────────────

const BLOCK_META: Record<PortfolioBlock["type"], { label: string; icon: React.ReactNode }> = {
  text:        { label: "Texte",         icon: <AlignLeft size={12} /> },
  textImage:   { label: "Texte + Image", icon: <Columns2 size={12} /> },
  carousel:    { label: "Carousel",      icon: <GalleryHorizontal size={12} /> },
  video:       { label: "Vidéo",         icon: <Video size={12} /> },
  stats:       { label: "Stats",         icon: <BarChart3 size={12} /> },
};

const miniBtn: React.CSSProperties = {
  width: 22, height: 22, borderRadius: "5px", border: "none", background: "transparent",
  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
};

function BlocksEditor({ blocks, onChange, onPickImage }: {
  blocks: PortfolioBlock[];
  onChange: (blocks: PortfolioBlock[]) => void;
  onPickImage: (index: number, kind: "blockImage" | "blockCarousel") => void;
}) {
  const update = (i: number, block: PortfolioBlock) => onChange(blocks.map((b, idx) => (idx === i ? block : b)));
  const remove = (i: number) => onChange(blocks.filter((_, idx) => idx !== i));
  const move = (i: number, dir: "up" | "down") => {
    const j = dir === "up" ? i - 1 : i + 1;
    if (j < 0 || j >= blocks.length) return;
    const copy = [...blocks];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    onChange(copy);
  };
  const add = (type: PortfolioBlock["type"]) => onChange([...blocks, emptyBlock(type)]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {blocks.map((b, i) => (
        <div key={i} style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "12px", background: "rgba(255,255,255,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)" }}>
              {BLOCK_META[b.type].icon} {BLOCK_META[b.type].label}
            </span>
            <div style={{ display: "flex", gap: "1px", alignItems: "center" }}>
              <button type="button" onClick={() => move(i, "up")} disabled={i === 0} style={{ ...miniBtn, opacity: i === 0 ? 0.2 : 0.6 }}>
                <ChevronUp size={13} color="white" />
              </button>
              <button type="button" onClick={() => move(i, "down")} disabled={i === blocks.length - 1} style={{ ...miniBtn, opacity: i === blocks.length - 1 ? 0.2 : 0.6 }}>
                <ChevronDown size={13} color="white" />
              </button>
              <button type="button" onClick={() => remove(i)} style={miniBtn}>
                <Trash2 size={13} color="rgba(248,113,113,0.6)" />
              </button>
            </div>
          </div>

          {b.type === "text" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <input value={b.title ?? ""} onChange={e => update(i, { ...b, title: e.target.value })} placeholder="Titre (optionnel)" style={inputStyle} />
              <textarea value={b.text} onChange={e => update(i, { ...b, text: e.target.value })} rows={4} placeholder="Texte…" style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
            </div>
          )}

          {b.type === "textImage" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <input value={b.title ?? ""} onChange={e => update(i, { ...b, title: e.target.value })} placeholder="Titre (optionnel)" style={inputStyle} />
                <textarea value={b.text} onChange={e => update(i, { ...b, text: e.target.value })} rows={5} placeholder="Texte…" style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
                <div style={{ display: "flex", gap: "6px", opacity: (b.imageFormat ?? "standard") === "banniere" ? 0.35 : 1 }}>
                  {(["left", "right"] as const).map(pos => (
                    <button
                      key={pos}
                      type="button"
                      disabled={(b.imageFormat ?? "standard") === "banniere"}
                      onClick={() => update(i, { ...b, imagePosition: pos })}
                      style={{
                        flex: 1, padding: "7px", borderRadius: "6px", cursor: (b.imageFormat ?? "standard") === "banniere" ? "default" : "pointer",
                        border: `1px solid ${b.imagePosition === pos ? "rgba(92,92,245,0.4)" : "rgba(255,255,255,0.1)"}`,
                        background: b.imagePosition === pos ? "rgba(92,92,245,0.12)" : "transparent",
                        fontFamily: "var(--font-poppins)", fontSize: "9px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase",
                        color: b.imagePosition === pos ? "rgba(92,92,245,0.85)" : "rgba(255,255,255,0.35)",
                      }}
                    >
                      Image à {pos === "left" ? "gauche" : "droite"}
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  {([["standard", "4:3"], ["carre", "Carré"], ["large", "16:9"], ["banniere", "Bannière"]] as const).map(([val, lab]) => {
                    const active = (b.imageFormat ?? "standard") === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => update(i, { ...b, imageFormat: val })}
                        style={{
                          flex: 1, padding: "7px 4px", borderRadius: "6px", cursor: "pointer",
                          border: `1px solid ${active ? "rgba(92,92,245,0.4)" : "rgba(255,255,255,0.1)"}`,
                          background: active ? "rgba(92,92,245,0.12)" : "transparent",
                          fontFamily: "var(--font-poppins)", fontSize: "9px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase",
                          color: active ? "rgba(92,92,245,0.85)" : "rgba(255,255,255,0.35)",
                        }}
                      >
                        {lab}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                {b.image && (
                  <div style={{ borderRadius: "8px", overflow: "hidden", height: "110px", background: "rgba(255,255,255,0.04)", marginBottom: "6px" }}>
                    <img src={b.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => onPickImage(i, "blockImage")}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "8px", border: "1px solid rgba(92,92,245,0.25)", background: "rgba(92,92,245,0.07)", cursor: "pointer", fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "rgba(92,92,245,0.8)", borderRadius: "6px" }}
                >
                  <BookImage size={11} /> Bibliothèque
                </button>
              </div>
            </div>
          )}

          {b.type === "carousel" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {b.images.length > 0 && (
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {b.images.map((src, ii) => (
                    <div key={ii} style={{ position: "relative", width: "64px", height: "64px", borderRadius: "6px", overflow: "hidden", background: "rgba(255,255,255,0.04)" }}>
                      <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <button
                        type="button"
                        onClick={() => update(i, { ...b, images: b.images.filter((_, x) => x !== ii) })}
                        style={{ position: "absolute", top: 2, right: 2, width: 16, height: 16, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.7)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        <X size={9} color="white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => onPickImage(i, "blockCarousel")}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "8px", border: "1px solid rgba(92,92,245,0.25)", background: "rgba(92,92,245,0.07)", cursor: "pointer", fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "rgba(92,92,245,0.8)", borderRadius: "6px" }}
              >
                <BookImage size={11} /> Ajouter une image
              </button>
            </div>
          )}

          {b.type === "video" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <input value={b.url} onChange={e => update(i, { ...b, url: e.target.value })} placeholder="URL YouTube, Vimeo ou fichier .mp4" style={inputStyle} />
              <input value={b.caption ?? ""} onChange={e => update(i, { ...b, caption: e.target.value })} placeholder="Légende (optionnel)" style={inputStyle} />
            </div>
          )}

          {b.type === "stats" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {b.items.map((item, ii) => (
                <div key={ii} style={{ display: "flex", gap: "6px" }}>
                  <input value={item.value} onChange={e => update(i, { ...b, items: b.items.map((it, x) => x === ii ? { ...it, value: e.target.value } : it) })} placeholder="500+" style={{ ...inputStyle, width: "90px" }} />
                  <input value={item.label} onChange={e => update(i, { ...b, items: b.items.map((it, x) => x === ii ? { ...it, label: e.target.value } : it) })} placeholder="Membres actifs" style={{ ...inputStyle, flex: 1 }} />
                  <button type="button" onClick={() => update(i, { ...b, items: b.items.filter((_, x) => x !== ii) })} style={miniBtn}>
                    <X size={13} color="rgba(248,113,113,0.6)" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => update(i, { ...b, items: [...b.items, { value: "", label: "" }] })}
                style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-poppins)", fontSize: "9px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "rgba(92,92,245,0.7)", padding: "4px 0" }}
              >
                <Plus size={11} /> Ajouter un chiffre
              </button>
            </div>
          )}
        </div>
      ))}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "6px" }}>
        {(Object.keys(BLOCK_META) as PortfolioBlock["type"][]).map(type => (
          <button
            key={type}
            type="button"
            onClick={() => add(type)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "5px",
              padding: "10px 4px", border: "1px dashed rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.02)",
              cursor: "pointer", borderRadius: "8px", color: "rgba(255,255,255,0.45)",
            }}
          >
            {BLOCK_META[type].icon}
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: "8px", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>{BLOCK_META[type].label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function AdminPortfolio() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PortfolioProject | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<PickerTarget | null>(null);
  const [uploading, setUploading] = useState(false);
  const uploadRef = useRef<HTMLInputElement>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [sectionsModalOpen, setSectionsModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/admin/portfolio").then(r => r.json()).then(data => { setProjects(data); setLoading(false); });
    fetch("/api/admin/portfolio-sections").then(r => r.json()).then(setSections);
  }, []);

  const refreshSections = () => fetch("/api/admin/portfolio-sections").then(r => r.json()).then(setSections);
  const refreshProjects = () => fetch("/api/admin/portfolio").then(r => r.json()).then(setProjects);

  const addSection = async (name: string, color: string) => {
    await fetch("/api/admin/portfolio-sections", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, color }) });
    await refreshSections();
  };
  const renameSection = async (id: string, name: string) => {
    await fetch(`/api/admin/portfolio-sections/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
    await refreshSections();
  };
  const recolorSection = async (id: string, color: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, color } : s));
    await fetch(`/api/admin/portfolio-sections/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ color }) });
  };
  const moveSection = async (id: string, dir: "up" | "down") => {
    const idx = sections.findIndex(s => s.id === id);
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sections.length) return;
    const a = sections[idx], b = sections[swapIdx];
    await Promise.all([
      fetch(`/api/admin/portfolio-sections/${a.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: b.order }) }),
      fetch(`/api/admin/portfolio-sections/${b.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: a.order }) }),
    ]);
    await refreshSections();
  };
  const deleteSection = async (id: string) => {
    if (!window.confirm("Supprimer cette section ? Les projets associés perdront leur section (mais resteront publiés).")) return;
    await fetch(`/api/admin/portfolio-sections/${id}`, { method: "DELETE" });
    await Promise.all([refreshSections(), refreshProjects()]);
  };

  const seed = async () => {
    setSeeding(true);
    const res = await fetch("/api/admin/portfolio/seed", { method: "POST" });
    const data = await res.json();
    if (data.seeded > 0) {
      const updated = await fetch("/api/admin/portfolio").then(r => r.json());
      setProjects(updated);
    }
    setSeeding(false);
  };

  const toFormState = (p: PortfolioProject) => ({
    slug: p.slug, title: p.title, tag: p.tag, description: p.description, imageSrc: p.imageSrc,
    logoSrc: p.logoSrc ?? "",
    sectionId: p.sectionId ?? "", year: p.year ?? "", client: p.client ?? "",
    fullDescription: p.fullDescription ?? "", challenge: p.challenge ?? "",
    imagesRaw: (p.images ?? []).join("\n"),
    mockupImagesRaw: (p.mockupImages ?? []).join("\n"),
    toolsRaw: (p.tools ?? []).join(", "),
    externalLink: p.externalLink ?? "", discordUrl: p.discordUrl ?? "", accentColor: p.accentColor ?? "",
    order: p.order, published: p.published, blocks: toBlockArray(p.blocks),
  });

  // Tags distincts des projets existants, triés par fréquence puis alphabétique
  const usedTags = Array.from(
    projects.reduce((m, p) => {
      const t = p.tag?.trim();
      if (t) m.set(t, (m.get(t) ?? 0) + 1);
      return m;
    }, new Map<string, number>())
  ).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([t]) => t);

  const openCreate = () => { setForm(emptyForm); setEditing(null); setCreating(true); setSaveError(""); };
  const openEdit = (p: PortfolioProject) => { setForm(toFormState(p)); setEditing(p); setCreating(false); setSaveError(""); };
  const closePanel = () => { setEditing(null); setCreating(false); setSaveError(""); };

  const buildPayload = () => ({
    ...form,
    images: form.imagesRaw.split("\n").map(s => s.trim()).filter(Boolean),
    mockupImages: form.mockupImagesRaw.split("\n").map(s => s.trim()).filter(Boolean),
    tools: form.toolsRaw.split(",").map(s => s.trim()).filter(Boolean),
    externalLink: form.externalLink.trim() || null,
    discordUrl: form.discordUrl.trim() || null,
    sectionId: form.sectionId || null,
  });

  const save = async () => {
    setSaving(true);
    setSaveError("");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const payload = buildPayload();
      if (editing) {
        const res = await fetch(`/api/admin/portfolio/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: controller.signal });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || `Échec de la sauvegarde (${res.status})`);
        }
        const updated = await res.json();
        setProjects(p => p.map(x => x.id === editing.id ? updated : x));
        setEditing(updated);
        setForm(toFormState(updated));
      } else {
        const res = await fetch("/api/admin/portfolio", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: controller.signal });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || `Échec de la création (${res.status})`);
        }
        const created = await res.json();
        setProjects(p => [...p, created]);
        closePanel();
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setSaveError(err instanceof DOMException && err.name === "AbortError" ? "Délai dépassé — vérifiez votre connexion et réessayez." : err instanceof Error ? err.message : "Erreur réseau — réessayez.");
    } finally {
      clearTimeout(timeout);
      setSaving(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, "portfolio");
      setForm(f => ({ ...f, imageSrc: url }));
    } catch (err) {
      alert(String(err instanceof Error ? err.message : err));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handlePickerSelect = (url: string) => {
    if (!pickerTarget) return;
    switch (pickerTarget.kind) {
      case "cover":
        setForm(f => ({ ...f, imageSrc: url })); break;
      case "logo":
        setForm(f => ({ ...f, logoSrc: url })); break;
      case "gallery":
        setForm(f => ({ ...f, imagesRaw: f.imagesRaw ? f.imagesRaw.trimEnd() + "\n" + url : url })); break;
      case "mockup":
        setForm(f => ({ ...f, mockupImagesRaw: f.mockupImagesRaw ? f.mockupImagesRaw.trimEnd() + "\n" + url : url })); break;
      case "blockImage": {
        const idx = pickerTarget.index;
        setForm(f => ({
          ...f,
          blocks: f.blocks.map((b, i) => i === idx && b.type === "textImage" ? { ...b, image: url } : b),
        }));
        break;
      }
      case "blockCarousel": {
        const idx = pickerTarget.index;
        setForm(f => ({
          ...f,
          blocks: f.blocks.map((b, i) => i === idx && b.type === "carousel" ? { ...b, images: [...b.images, url] } : b),
        }));
        break;
      }
    }
    setPickerOpen(false);
    setPickerTarget(null);
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
    <div style={{ padding: "32px 40px", maxWidth: "1480px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 800, color: "white", margin: "0 0 4px", letterSpacing: "-0.01em" }}>Portfolio</h1>
          <p style={{ fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.3)", margin: 0 }}>Gérez les projets affichés sur votre page portfolio.</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {projects.length === 0 && (
            <button onClick={seed} disabled={seeding} style={{
              display: "flex", alignItems: "center", gap: "7px", padding: "9px 16px", borderRadius: "10px",
              border: "1px solid rgba(250,204,21,0.25)", background: "rgba(250,204,21,0.07)",
              fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 500,
              color: "rgba(250,204,21,0.75)", cursor: "pointer", opacity: seeding ? 0.5 : 1,
            }}>
              {seeding ? "Import…" : "↓ Importer projets existants"}
            </button>
          )}
          <button onClick={() => setSectionsModalOpen(true)} style={{
            display: "flex", alignItems: "center", gap: "7px", padding: "9px 16px", borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)",
            fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 500,
            color: "rgba(255,255,255,0.5)", cursor: "pointer",
          }}>
            <Layers size={14} /> Sections
          </button>
          <button onClick={openCreate} style={{
            display: "flex", alignItems: "center", gap: "7px", padding: "9px 16px", borderRadius: "10px",
            border: "1px solid rgba(60,100,255,0.3)", background: "rgba(60,100,255,0.12)",
            fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 500,
            color: "rgba(100,140,255,0.9)", cursor: "pointer",
          }}>
            <Plus size={14} /> Nouveau projet
          </button>
        </div>
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
                      {p.section && (
                        <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "10px", padding: "1px 7px", borderRadius: "5px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)" }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: p.section.color, flexShrink: 0 }} />
                          {p.section.name}
                        </span>
                      )}
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
                width: "700px", flexShrink: 0,
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px",
                background: "rgba(255,255,255,0.02)", padding: "24px",
                position: "sticky", top: "32px", maxHeight: "calc(100vh - 80px)", overflowY: "auto",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "white", margin: 0 }}>
                  {editing ? "Modifier le projet" : "Nouveau projet"}
                </p>
                <button onClick={closePanel} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", display: "flex", padding: 0 }}>
                  <X size={15} />
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 16px" }}>
                <Field label="Titre">
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Projet X" style={inputStyle} />
                </Field>
                <Field label="Slug (URL)">
                  <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="projet-x" style={inputStyle} />
                </Field>

                <div style={{ gridColumn: "1 / -1" }}>
                  <Field label="Tag / Catégorie">
                    <input value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} placeholder="Identité visuelle" style={inputStyle} />
                    {usedTags.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                        {usedTags.map(t => {
                          const active = form.tag === t;
                          return (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setForm(f => ({ ...f, tag: active ? "" : t }))}
                              style={{
                                fontSize: "11px", fontWeight: 500, padding: "4px 10px", borderRadius: "6px", cursor: "pointer",
                                background: active ? "rgba(167,139,250,0.15)" : "rgba(255,255,255,0.05)",
                                border: `1px solid ${active ? "rgba(167,139,250,0.5)" : "rgba(255,255,255,0.09)"}`,
                                color: active ? "rgba(167,139,250,0.95)" : "rgba(255,255,255,0.55)",
                                transition: "all 0.15s ease",
                              }}
                            >
                              {t}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </Field>
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <Field label="Description courte">
                    <textarea
                      value={form.description}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      rows={2}
                      placeholder="Description courte du projet…"
                      style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                    />
                  </Field>
                </div>

                {/* ── Image couverture avec picker ── */}
                <div>
                  <label style={{ display: "block", fontSize: "10px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.25)", marginBottom: "8px" }}>
                    Image couverture
                  </label>
                  {form.imageSrc && (
                    <div style={{ borderRadius: "8px", overflow: "hidden", height: "90px", background: "rgba(255,255,255,0.04)", marginBottom: "8px" }}>
                      <img src={form.imageSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "6px" }}>
                    <button
                      type="button"
                      onClick={() => { setPickerTarget({ kind: "cover" }); setPickerOpen(true); }}
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "8px", border: "1px solid rgba(92,92,245,0.25)", background: "rgba(92,92,245,0.07)", cursor: "pointer", fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "rgba(92,92,245,0.8)", borderRadius: "6px" }}
                    >
                      <BookImage size={11} /> Bibliothèque
                    </button>
                    <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "8px", border: "1px dashed rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)", cursor: uploading ? "not-allowed" : "pointer", fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: uploading ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.45)", borderRadius: "6px" }}>
                      <Upload size={11} /> {uploading ? "…" : "Upload"}
                      <input ref={uploadRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleCoverUpload} disabled={uploading} />
                    </label>
                  </div>
                  <input value={form.imageSrc} onChange={e => setForm(f => ({ ...f, imageSrc: e.target.value }))} placeholder="ou coller une URL…" style={{ ...inputStyle, fontSize: "10px", color: "rgba(255,255,255,0.35)" }} />
                </div>

                {/* ── Logo avec picker ── */}
                <div>
                  <label style={{ display: "block", fontSize: "10px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.25)", marginBottom: "8px" }}>
                    Logo (optionnel)
                  </label>
                  {form.logoSrc && (
                    <div style={{ borderRadius: "8px", overflow: "hidden", height: "70px", width: "70px", background: "rgba(255,255,255,0.04)", marginBottom: "8px" }}>
                      <img src={form.logoSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </div>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "6px" }}>
                    <button
                      type="button"
                      onClick={() => { setPickerTarget({ kind: "logo" }); setPickerOpen(true); }}
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "8px", border: "1px solid rgba(92,92,245,0.25)", background: "rgba(92,92,245,0.07)", cursor: "pointer", fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "rgba(92,92,245,0.8)", borderRadius: "6px" }}
                    >
                      <BookImage size={11} /> Bibliothèque
                    </button>
                    <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "8px", border: "1px dashed rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)", cursor: "pointer", fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", borderRadius: "6px" }}>
                      <Upload size={11} /> Upload
                      <input type="file" accept="image/*" style={{ display: "none" }} onChange={async e => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const url = await uploadImage(file, "portfolio-logo");
                          setForm(f => ({ ...f, logoSrc: url }));
                        } catch (err) {
                          alert(String(err instanceof Error ? err.message : err));
                        } finally {
                          e.target.value = "";
                        }
                      }} />
                    </label>
                  </div>
                  <input value={form.logoSrc} onChange={e => setForm(f => ({ ...f, logoSrc: e.target.value }))} placeholder="ou coller une URL…" style={{ ...inputStyle, fontSize: "10px", color: "rgba(255,255,255,0.35)" }} />
                </div>

                {/* Divider */}
                <div style={{ gridColumn: "1 / -1", height: "1px", background: "rgba(255,255,255,0.06)", margin: "4px 0" }} />
                <p style={{ gridColumn: "1 / -1", fontSize: "9px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.2)", margin: 0 }}>Page détail</p>

                <Field label="Section">
                  <select value={form.sectionId} onChange={e => setForm(f => ({ ...f, sectionId: e.target.value }))} style={{ ...inputStyle, appearance: "none", colorScheme: "dark" }}>
                    <option value="">—</option>
                    {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </Field>
                <Field label="Année">
                  <input value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} placeholder="2024" style={inputStyle} />
                </Field>

                <Field label="Client / Projet">
                  <input value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))} placeholder="Nom du client ou du projet" style={inputStyle} />
                </Field>
                <Field label="Outils utilisés (virgule)">
                  <input value={form.toolsRaw} onChange={e => setForm(f => ({ ...f, toolsRaw: e.target.value }))} placeholder="Figma, Illustrator, Next.js" style={inputStyle} />
                </Field>

                <div style={{ gridColumn: "1 / -1" }}>
                  <Field label="Description longue">
                    <textarea value={form.fullDescription} onChange={e => setForm(f => ({ ...f, fullDescription: e.target.value }))} rows={5} placeholder="Contexte, approche, résultat…" style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
                  </Field>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <Field label="Enjeu / Brief">
                    <textarea value={form.challenge} onChange={e => setForm(f => ({ ...f, challenge: e.target.value }))} rows={3} placeholder="Problématique ou objectif du projet…" style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
                  </Field>
                </div>

                {/* ── Blocs de présentation ── */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: "10px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.25)", marginBottom: "10px" }}>
                    Blocs de présentation
                  </label>
                  <BlocksEditor
                    blocks={form.blocks}
                    onChange={blocks => setForm(f => ({ ...f, blocks }))}
                    onPickImage={(index, kind) => { setPickerTarget({ kind, index }); setPickerOpen(true); }}
                  />
                </div>

                {/* ── Galerie avec picker ── */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                    <label style={{ fontSize: "10px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.25)" }}>Images galerie</label>
                    <button type="button" onClick={() => { setPickerTarget({ kind: "gallery" }); setPickerOpen(true); }} style={{ display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-poppins)", fontSize: "9px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "rgba(92,92,245,0.7)", padding: 0 }}>
                      <BookImage size={10} /> + Bibliothèque
                    </button>
                  </div>
                  <textarea value={form.imagesRaw} onChange={e => setForm(f => ({ ...f, imagesRaw: e.target.value }))} rows={4} placeholder={"https://…/img1.jpg\nhttps://…/img2.jpg"} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.8, fontFamily: "monospace", fontSize: "10px" }} />
                </div>

                {/* ── Mockups avec picker ── */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                    <label style={{ fontSize: "10px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.25)" }}>Mockups navigateur</label>
                    <button type="button" onClick={() => { setPickerTarget({ kind: "mockup" }); setPickerOpen(true); }} style={{ display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-poppins)", fontSize: "9px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "rgba(92,92,245,0.7)", padding: 0 }}>
                      <BookImage size={10} /> + Bibliothèque
                    </button>
                  </div>
                  <textarea value={form.mockupImagesRaw} onChange={e => setForm(f => ({ ...f, mockupImagesRaw: e.target.value }))} rows={4} placeholder={"https://…/mockup1.jpg\nhttps://…/mockup2.jpg"} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.8, fontFamily: "monospace", fontSize: "10px" }} />
                </div>

                <Field label="Lien externe (optionnel)">
                  <input value={form.externalLink} onChange={e => setForm(f => ({ ...f, externalLink: e.target.value }))} placeholder="https://…" style={inputStyle} />
                </Field>
                <Field label="Invitation Discord (optionnel)">
                  <input value={form.discordUrl} onChange={e => setForm(f => ({ ...f, discordUrl: e.target.value }))} placeholder="https://discord.gg/…" style={inputStyle} />
                </Field>

                <Field label="Couleur accent (hex)">
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input value={form.accentColor} onChange={e => setForm(f => ({ ...f, accentColor: e.target.value }))} placeholder="#3c64ff" style={{ ...inputStyle, flex: 1 }} />
                    {form.accentColor && <div style={{ width: 28, height: 28, borderRadius: "6px", background: form.accentColor, flexShrink: 0, border: "1px solid rgba(255,255,255,0.1)" }} />}
                  </div>
                </Field>
                <Field label="Ordre d'affichage">
                  <input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} style={inputStyle} />
                </Field>

                <div style={{ gridColumn: "1 / -1", height: "1px", background: "rgba(255,255,255,0.06)", margin: "4px 0" }} />

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

              {saveError && (
                <p style={{
                  marginTop: "14px", marginBottom: 0, padding: "10px 12px", borderRadius: "8px",
                  border: "1px solid rgba(248,113,113,0.25)", background: "rgba(248,113,113,0.08)",
                  fontFamily: "var(--font-poppins)", fontSize: "11px", color: "rgba(248,113,113,0.9)",
                }}>
                  {saveError}
                </p>
              )}

              <button
                onClick={save}
                disabled={saving || !form.title.trim() || !form.slug.trim()}
                style={{
                  marginTop: "12px", width: "100%", padding: "11px", borderRadius: "10px",
                  border: `1px solid ${saved ? "rgba(74,222,128,0.3)" : "rgba(60,100,255,0.3)"}`,
                  background: saved ? "rgba(74,222,128,0.1)" : "rgba(60,100,255,0.2)",
                  fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 600,
                  color: saved ? "rgba(74,222,128,0.9)" : "rgba(140,170,255,0.9)",
                  cursor: (saving || !form.title.trim() || !form.slug.trim()) ? "not-allowed" : "pointer",
                  opacity: (!form.title.trim() || !form.slug.trim()) ? 0.4 : 1,
                  transition: "all 0.3s ease",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
                }}
              >
                {saved ? <><Check size={13} /> Enregistré</> : saving ? "Enregistrement…" : editing ? "Mettre à jour" : "Créer le projet"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Image picker modal */}
      <ImagePickerModal
        open={pickerOpen}
        onClose={() => { setPickerOpen(false); setPickerTarget(null); }}
        onSelect={handlePickerSelect}
      />

      {/* Sections manager modal */}
      <SectionsManagerModal
        open={sectionsModalOpen}
        onClose={() => setSectionsModalOpen(false)}
        sections={sections}
        onAdd={addSection}
        onRename={renameSection}
        onColor={recolorSection}
        onMove={moveSection}
        onDelete={deleteSection}
      />
    </div>
  );
}
