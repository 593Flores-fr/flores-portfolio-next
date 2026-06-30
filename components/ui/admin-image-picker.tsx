"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Upload, Check } from "lucide-react";

type LibraryImage = {
  url: string;
  name: string;
  uploadedAt: string;
};

export function ImagePickerModal({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}) {
  const [images, setImages] = useState<LibraryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/image-library");
      const data = await res.json();
      setImages(data.images ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchImages();
      setSelected(null);
    }
  }, [open, fetchImages]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/image-library", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) await fetchImages();
      else alert(data.error ?? "Upload échoué");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleConfirm = () => {
    if (selected) { onSelect(selected); onClose(); }
  };

  if (!open) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9000,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px",
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: "#111", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "2px", width: "100%", maxWidth: "900px",
        maxHeight: "85vh", display: "flex", flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "18px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div>
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 700, color: "white", margin: 0 }}>
              Bibliothèque d&apos;images
            </p>
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", color: "rgba(255,255,255,0.3)", margin: "2px 0 0" }}>
              {images.length} image{images.length !== 1 ? "s" : ""} — cliquez pour sélectionner
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {/* Upload */}
            <label style={{
              display: "inline-flex", alignItems: "center", gap: "7px",
              padding: "8px 16px", cursor: uploading ? "not-allowed" : "pointer",
              border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)",
              fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 600,
              letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.6)",
              transition: "border-color 0.2s, color 0.2s",
            }}>
              <Upload size={12} />
              {uploading ? "Upload…" : "Ajouter"}
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleUpload} disabled={uploading} />
            </label>

            <button
              onClick={onClose}
              style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: "4px" }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div style={{ flex: 1, overflow: "auto", padding: "20px" }}>
          {loading ? (
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: "60px" }}>
              Chargement…
            </p>
          ) : images.length === 0 ? (
            <div style={{ textAlign: "center", marginTop: "60px" }}>
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", color: "rgba(255,255,255,0.2)", marginBottom: "16px" }}>
                Aucune image dans la bibliothèque.
              </p>
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", color: "rgba(255,255,255,0.12)" }}>
                Utilisez &laquo; Ajouter &raquo; pour uploader votre première image.
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "8px" }}>
              {images.map(img => (
                <button
                  key={img.url}
                  onClick={() => setSelected(img.url === selected ? null : img.url)}
                  style={{
                    background: "none", border: `2px solid ${selected === img.url ? "var(--vto-primary)" : "rgba(255,255,255,0.06)"}`,
                    borderRadius: "2px", cursor: "pointer", padding: 0,
                    position: "relative", overflow: "hidden", aspectRatio: "16/9",
                    transition: "border-color 0.15s",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                  {selected === img.url && (
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "rgba(92,92,245,0.25)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Check size={20} color="white" strokeWidth={2.5} />
                    </div>
                  )}
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    padding: "4px 6px",
                    background: "rgba(0,0,0,0.55)",
                    fontFamily: "var(--font-poppins)", fontSize: "7px",
                    color: "rgba(255,255,255,0.5)",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {img.name}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: "14px 24px", borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex", justifyContent: "flex-end", gap: "10px", flexShrink: 0,
        }}>
          <button onClick={onClose} style={{
            background: "none", border: "1px solid rgba(255,255,255,0.1)",
            padding: "8px 18px", cursor: "pointer",
            fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 600,
            letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)",
          }}>
            Annuler
          </button>
          <button onClick={handleConfirm} disabled={!selected} style={{
            border: "none", padding: "8px 22px", cursor: selected ? "pointer" : "not-allowed",
            fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 600,
            letterSpacing: "2px", textTransform: "uppercase",
            background: selected ? "rgba(92,92,245,0.8)" : "rgba(255,255,255,0.06)",
            color: selected ? "white" : "rgba(255,255,255,0.2)",
            transition: "background 0.2s, color 0.2s",
          }}>
            Sélectionner
          </button>
        </div>
      </div>
    </div>
  );
}
