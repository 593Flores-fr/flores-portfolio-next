"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Eye, EyeOff, Trash2 } from "lucide-react";

type Review = {
  id: string; content: string | null; rating: number; status: string;
  requestedAt: string | null; submittedAt: string | null; createdAt: string;
  user: { name: string | null; email: string; image: string | null };
  project: { id: string; title: string } | null;
};

const STATUS_LABEL: Record<string, string> = {
  requested: "En attente", submitted: "À valider",
  approved: "Publié", hidden: "Masqué",
};
const STATUS_COLOR: Record<string, string> = {
  requested: "rgba(250,204,21,0.7)", submitted: "rgba(96,165,250,0.7)",
  approved: "rgba(74,222,128,0.75)", hidden: "rgba(255,255,255,0.25)",
};
const STATUS_BG: Record<string, string> = {
  requested: "rgba(250,204,21,0.07)", submitted: "rgba(96,165,250,0.07)",
  approved: "rgba(74,222,128,0.07)", hidden: "rgba(255,255,255,0.04)",
};

function Avatar({ name, image, size = 34 }: { name?: string | null; image?: string | null; size?: number }) {
  if (image) return <img src={image} alt="" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />;
  const initials = (name ?? "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg,rgba(60,100,255,0.5),rgba(100,60,255,0.5))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.33 + "px", fontWeight: 700, color: "white" }}>
      {initials}
    </div>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map(n => (
        <Star key={n} size={12} fill={n <= rating ? "rgba(250,204,21,0.8)" : "none"} color={n <= rating ? "rgba(250,204,21,0.8)" : "rgba(255,255,255,0.15)"} />
      ))}
    </div>
  );
}

export function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/reviews").then(r => r.json()).then(data => { setReviews(data); setLoading(false); });
  }, []);

  const update = async (id: string, status: "approved" | "hidden") => {
    const res = await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }),
    });
    const updated = await res.json();
    setReviews(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r));
  };

  const remove = async (id: string) => {
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const byStatus = {
    submitted: reviews.filter(r => r.status === "submitted"),
    approved: reviews.filter(r => r.status === "approved"),
    hidden: reviews.filter(r => r.status === "hidden"),
    requested: reviews.filter(r => r.status === "requested"),
  };

  return (
    <div style={{ padding: "32px 40px", maxWidth: "760px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 800, color: "white", margin: "0 0 4px", letterSpacing: "-0.01em" }}>Avis clients</h1>
        <p style={{ fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.3)", margin: 0 }}>
          Approuvez les avis pour les faire apparaître sur votre portfolio.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "28px", flexWrap: "wrap" }}>
        {[
          { label: "À valider", count: byStatus.submitted.length, color: "rgba(96,165,250,0.7)" },
          { label: "Publiés", count: byStatus.approved.length, color: "rgba(74,222,128,0.7)" },
          { label: "En attente", count: byStatus.requested.length, color: "rgba(250,204,21,0.6)" },
          { label: "Masqués", count: byStatus.hidden.length, color: "rgba(255,255,255,0.25)" },
        ].map(s => (
          <div key={s.label} style={{ padding: "12px 16px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", minWidth: "100px" }}>
            <p style={{ fontSize: "22px", fontWeight: 800, color: s.color, margin: "0 0 2px", lineHeight: 1 }}>{s.count}</p>
            <p style={{ fontSize: "10px", fontWeight: 300, color: "rgba(255,255,255,0.25)", margin: 0, textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", padding: "40px 0", textAlign: "center" }}>Chargement...</p>
      ) : reviews.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <Star size={24} color="rgba(255,255,255,0.1)" style={{ marginBottom: "10px" }} />
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", margin: 0 }}>Aucun avis pour l&apos;instant.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* À valider d'abord */}
          {[...byStatus.submitted, ...byStatus.approved, ...byStatus.requested, ...byStatus.hidden].map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              style={{
                padding: "16px 18px", borderRadius: "14px",
                border: `1px solid ${review.status === "submitted" ? "rgba(96,165,250,0.2)" : "rgba(255,255,255,0.07)"}`,
                background: review.status === "submitted" ? "rgba(96,165,250,0.04)" : "rgba(255,255,255,0.02)",
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Avatar name={review.user.name} image={review.user.image} />
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.82)", margin: 0 }}>{review.user.name ?? review.user.email}</p>
                    <p style={{ fontSize: "10px", fontWeight: 300, color: "rgba(255,255,255,0.22)", margin: "2px 0 0" }}>
                      {review.project?.title ?? "Projet inconnu"}
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{
                    fontSize: "9px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em",
                    color: STATUS_COLOR[review.status], background: STATUS_BG[review.status],
                    padding: "3px 8px", borderRadius: "999px",
                  }}>
                    {STATUS_LABEL[review.status]}
                  </span>
                </div>
              </div>

              {/* Content */}
              {review.content ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <StarRow rating={review.rating} />
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>{review.rating}/5</span>
                  </div>
                  <p style={{ fontSize: "13px", fontWeight: 300, color: "rgba(255,255,255,0.55)", lineHeight: 1.75, margin: "0 0 14px", fontStyle: "italic" }}>
                    &ldquo;{review.content}&rdquo;
                  </p>
                </>
              ) : (
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", margin: "0 0 14px", fontStyle: "italic" }}>
                  Avis demandé, client n&apos;a pas encore répondu.
                </p>
              )}

              {/* Actions */}
              {review.content && (
                <div style={{ display: "flex", gap: "8px" }}>
                  {review.status !== "approved" && (
                    <button onClick={() => update(review.id, "approved")} style={{
                      display: "flex", alignItems: "center", gap: "6px", padding: "7px 12px", borderRadius: "8px",
                      border: "1px solid rgba(74,222,128,0.25)", background: "rgba(74,222,128,0.07)",
                      fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 500,
                      color: "rgba(74,222,128,0.8)", cursor: "pointer",
                    }}>
                      <Eye size={12} /> Publier
                    </button>
                  )}
                  {review.status === "approved" && (
                    <button onClick={() => update(review.id, "hidden")} style={{
                      display: "flex", alignItems: "center", gap: "6px", padding: "7px 12px", borderRadius: "8px",
                      border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
                      fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 500,
                      color: "rgba(255,255,255,0.35)", cursor: "pointer",
                    }}>
                      <EyeOff size={12} /> Masquer
                    </button>
                  )}
                  <button onClick={() => remove(review.id)} style={{
                    display: "flex", alignItems: "center", gap: "6px", padding: "7px 12px", borderRadius: "8px",
                    border: "1px solid rgba(248,113,113,0.15)", background: "transparent",
                    fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 500,
                    color: "rgba(248,113,113,0.5)", cursor: "pointer",
                  }}>
                    <Trash2 size={12} /> Supprimer
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
