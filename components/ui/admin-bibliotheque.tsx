"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Trash2, Copy, Check, X, BookImage } from "lucide-react";

type LibraryImage = {
  url: string;
  name: string;
  size?: number;
  uploadedAt?: string;
};

function fmtSize(bytes?: number) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function fmtDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export function AdminBibliotheque() {
  const [images, setImages] = useState<LibraryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/image-library");
      const data = await res.json();
      setImages(data.images ?? []);
    } catch {
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true); setUploadError("");
    let failed = 0;
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/admin/image-library", { method: "POST", body: fd });
        const data = await res.json().catch(() => ({}));
        if (!data.url) failed++;
        setUploadError(data.error ?? "");
      } catch {
        failed++;
      }
    }
    await fetchImages();
    setUploading(false);
    e.target.value = "";
    if (failed > 0) setUploadError(`${failed} fichier(s) n'ont pas pu être uploadés.`);
  };

  const handleCopy = async (url: string) => {
    await navigator.clipboard.writeText(url).catch(() => {});
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDelete = async (url: string) => {
    setDeleting(url);
    const res = await fetch("/api/admin/image-library", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
    if (res.ok) {
      setImages(prev => prev.filter(img => img.url !== url));
      if (selected === url) setSelected(null);
    }
    setDeleting(null);
    setConfirmDelete(null);
  };

  const selectedImg = images.find(img => img.url === selected);
  const hasBlobToken = true; // check via error response

  return (
    <div style={{ padding: "36px 40px", maxWidth: "1200px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "32px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <BookImage size={16} color="rgba(96,165,250,0.7)" />
            <h1 style={{ fontFamily: "var(--font-six-caps), sans-serif", fontSize: "2.2rem", fontWeight: 400, letterSpacing: "5px", textTransform: "uppercase", color: "white", margin: 0, lineHeight: 1 }}>
              Bibliothèque
            </h1>
          </div>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 300, color: "rgba(255,255,255,0.28)", margin: 0 }}>
            {images.length} image{images.length !== 1 ? "s" : ""} · stockées sur Vercel Blob
          </p>
        </div>

        <label style={{
          display: "inline-flex", alignItems: "center", gap: "9px",
          padding: "11px 22px", cursor: uploading ? "not-allowed" : "pointer",
          border: "1px solid rgba(96,165,250,0.3)", background: "rgba(96,165,250,0.08)",
          fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 600,
          letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(96,165,250,0.9)",
          transition: "border-color 0.2s",
          opacity: uploading ? 0.5 : 1,
        }}>
          <Upload size={13} />
          {uploading ? "Upload en cours…" : "Ajouter des images"}
          <input type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {uploadError && (
        <motion.div
          initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", border: "1px solid rgba(239,68,68,0.25)", background: "rgba(239,68,68,0.06)", marginBottom: "20px" }}
        >
          <X size={13} color="rgba(239,68,68,0.7)" />
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", color: "rgba(239,68,68,0.8)", margin: 0 }}>{uploadError}</p>
          <button onClick={() => setUploadError("")} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "rgba(239,68,68,0.5)", padding: 0 }}>
            <X size={13} />
          </button>
        </motion.div>
      )}

      <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>

        {/* Grid */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1px", background: "rgba(255,255,255,0.05)" }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ aspectRatio: "16/9", background: "#0e0c0a", opacity: 0.4 + i * 0.05 }} />
              ))}
            </div>
          ) : images.length === 0 ? (
            <div style={{ padding: "80px 40px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)" }}>
              <BookImage size={28} color="rgba(255,255,255,0.1)" style={{ marginBottom: "16px" }} />
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.2)", margin: "0 0 6px" }}>
                Bibliothèque vide
              </p>
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", color: "rgba(255,255,255,0.12)", margin: 0 }}>
                Utilisez le bouton ci-dessus pour uploader vos premières images.
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1px", background: "rgba(255,255,255,0.05)" }}>
              <AnimatePresence>
                {images.map(img => (
                  <motion.div
                    key={img.url}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    style={{ position: "relative", aspectRatio: "16/9", background: "#0e0c0a", cursor: "pointer", overflow: "hidden" }}
                    onClick={() => setSelected(img.url === selected ? null : img.url)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "opacity 0.15s" }} />

                    {/* Selection overlay */}
                    {selected === img.url && (
                      <div style={{ position: "absolute", inset: 0, background: "rgba(96,165,250,0.25)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(96,165,250,0.6)" }}>
                        <Check size={20} color="white" strokeWidth={2.5} />
                      </div>
                    )}

                    {/* Hover toolbar */}
                    <div style={{ position: "absolute", top: 0, right: 0, padding: "6px", display: "flex", gap: "4px", opacity: selected === img.url ? 1 : 0.7 }}>
                      <button
                        onClick={e => { e.stopPropagation(); handleCopy(img.url); }}
                        style={{ width: 24, height: 24, borderRadius: "4px", background: "rgba(0,0,0,0.65)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                        title="Copier l'URL"
                      >
                        {copied === img.url ? <Check size={11} color="rgba(74,222,128,0.9)" /> : <Copy size={11} color="rgba(255,255,255,0.7)" />}
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); setConfirmDelete(img.url); }}
                        style={{ width: 24, height: 24, borderRadius: "4px", background: "rgba(0,0,0,0.65)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                        title="Supprimer"
                      >
                        <Trash2 size={11} color="rgba(248,113,113,0.8)" />
                      </button>
                    </div>

                    {/* Name label */}
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "4px 6px", background: "rgba(0,0,0,0.55)", fontFamily: "var(--font-poppins)", fontSize: "7px", color: "rgba(255,255,255,0.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {img.name}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {selectedImg && (
            <motion.div
              initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.22 }}
              style={{ width: "260px", flexShrink: 0, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.015)", padding: "20px" }}
            >
              <button onClick={() => setSelected(null)} style={{ float: "right", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", padding: 0 }}>
                <X size={14} />
              </button>
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.22)", margin: "0 0 14px", clear: "both" }}>
                Détails
              </p>
              {/* Preview */}
              <div style={{ aspectRatio: "16/9", background: "rgba(255,255,255,0.03)", marginBottom: "14px", overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedImg.url} alt={selectedImg.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>

              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", margin: "0 0 4px", wordBreak: "break-word" }}>
                {selectedImg.name}
              </p>
              {selectedImg.size && (
                <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", color: "rgba(255,255,255,0.25)", margin: "0 0 2px" }}>{fmtSize(selectedImg.size)}</p>
              )}
              {selectedImg.uploadedAt && (
                <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", color: "rgba(255,255,255,0.2)", margin: "0 0 16px" }}>{fmtDate(selectedImg.uploadedAt)}</p>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <button
                  onClick={() => handleCopy(selectedImg.url)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", padding: "10px", border: "1px solid rgba(96,165,250,0.2)", background: "rgba(96,165,250,0.06)", cursor: "pointer", fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "rgba(96,165,250,0.8)", transition: "border-color 0.15s" }}
                >
                  {copied === selectedImg.url ? <><Check size={11} />Copié !</> : <><Copy size={11} />Copier l&apos;URL</>}
                </button>

                {confirmDelete === selectedImg.url ? (
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      onClick={() => handleDelete(selectedImg.url)}
                      disabled={deleting === selectedImg.url}
                      style={{ flex: 1, padding: "9px", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.1)", cursor: "pointer", fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 700, color: "rgba(239,68,68,0.85)", letterSpacing: "1px", textTransform: "uppercase" }}
                    >
                      {deleting === selectedImg.url ? "…" : "Confirmer"}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      style={{ padding: "9px 12px", border: "1px solid rgba(255,255,255,0.08)", background: "none", cursor: "pointer", fontFamily: "var(--font-poppins)", fontSize: "10px", color: "rgba(255,255,255,0.3)" }}
                    >
                      Non
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(selectedImg.url)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", padding: "10px", border: "1px solid rgba(239,68,68,0.14)", background: "transparent", cursor: "pointer", fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase", color: "rgba(239,68,68,0.5)", transition: "border-color 0.15s" }}
                  >
                    <Trash2 size={11} />Supprimer
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Blob token notice */}
      {uploadError.includes("BLOB_READ_WRITE_TOKEN") && (
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: "24px", padding: "16px 20px", border: "1px solid rgba(250,204,21,0.2)", background: "rgba(250,204,21,0.05)" }}
        >
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 600, color: "rgba(250,204,21,0.8)", margin: "0 0 6px" }}>
            Configuration requise
          </p>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", color: "rgba(255,255,255,0.35)", margin: 0, lineHeight: 1.7 }}>
            Ajoutez <code style={{ background: "rgba(255,255,255,0.05)", padding: "1px 5px", borderRadius: "3px", fontSize: "10px" }}>BLOB_READ_WRITE_TOKEN</code> dans votre <code style={{ background: "rgba(255,255,255,0.05)", padding: "1px 5px", borderRadius: "3px", fontSize: "10px" }}>.env.local</code>.
            Récupérez-le depuis le dashboard Vercel → Storage → Blob → votre store → &ldquo;Show secret&rdquo;.
          </p>
        </motion.div>
      )}
    </div>
  );
}
