"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Kanban, CheckCircle2, Circle } from "lucide-react";
import { AdminProjetDetail } from "./admin-projet-detail";

type Project = {
  id: string; title: string; type: string; status: string; paid: boolean; createdAt: string;
  user: { name: string | null; email: string; image: string | null };
  _count: { columns: number };
};

const STATUS_COLOR: Record<string, string> = {
  active: "rgba(96,165,250,0.85)", completed: "rgba(167,139,250,0.85)",
  accepted: "rgba(74,222,128,0.85)", pending: "rgba(250,204,21,0.85)",
};
const STATUS_BG: Record<string, string> = {
  active: "rgba(96,165,250,0.08)", completed: "rgba(167,139,250,0.08)",
  accepted: "rgba(74,222,128,0.08)", pending: "rgba(250,204,21,0.08)",
};
const STATUS_LABEL: Record<string, string> = {
  active: "En cours", completed: "Livré", accepted: "Accepté", pending: "En attente",
};

function Avatar({ name, image, size = 28 }: { name?: string | null; image?: string | null; size?: number }) {
  if (image) return <img src={image} alt="" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />;
  const initials = (name ?? "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg,rgba(60,100,255,0.5),rgba(100,60,255,0.5))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.33 + "px", fontWeight: 700, color: "white" }}>
      {initials}
    </div>
  );
}

export function AdminKanban() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/projects")
      .then(r => r.json())
      .then((data: Project[]) => {
        const filtered = data.filter(p => p.status === "active" || p.status === "completed" || p.status === "accepted");
        setProjects(filtered);
        if (filtered.length > 0) setSelectedId(filtered[0].id);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ display: "flex", height: "100dvh", fontFamily: "var(--font-poppins)" }}>
      {/* ── Left sidebar: project list ── */}
      <div style={{
        width: "260px", flexShrink: 0,
        borderRight: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(6,10,14,0.6)",
        display: "flex", flexDirection: "column",
        overflowY: "auto",
      }}>
        <div style={{ padding: "24px 16px 12px" }}>
          <h2 style={{ fontSize: "13px", fontWeight: 800, color: "rgba(255,255,255,0.75)", margin: "0 0 2px", letterSpacing: "-0.01em" }}>Kanban</h2>
          <p style={{ fontSize: "10px", fontWeight: 300, color: "rgba(255,255,255,0.22)", margin: 0 }}>Sélectionnez un projet</p>
        </div>

        <div style={{ padding: "0 10px 16px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {loading ? (
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", textAlign: "center", padding: "24px 0" }}>Chargement...</p>
          ) : projects.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <Kanban size={20} color="rgba(255,255,255,0.1)" style={{ marginBottom: "8px" }} />
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", margin: 0 }}>Aucun projet actif.</p>
            </div>
          ) : (
            projects.map((p, i) => {
              const active = selectedId === p.id;
              return (
                <motion.button
                  key={p.id}
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setSelectedId(p.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "10px 10px", borderRadius: "10px", textAlign: "left", width: "100%",
                    border: `1px solid ${active ? "rgba(60,100,255,0.28)" : "rgba(255,255,255,0.06)"}`,
                    background: active ? "rgba(60,100,255,0.12)" : "rgba(255,255,255,0.02)",
                    cursor: "pointer", fontFamily: "var(--font-poppins)", transition: "background 0.15s, border-color 0.15s",
                  }}
                >
                  <Avatar name={p.user.name} image={p.user.image} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "12px", fontWeight: 600, color: active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.65)", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.title}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{
                        fontSize: "8px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em",
                        color: STATUS_COLOR[p.status] ?? "rgba(255,255,255,0.35)",
                        background: STATUS_BG[p.status] ?? "transparent",
                        padding: "1px 6px", borderRadius: "999px", flexShrink: 0,
                      }}>
                        {STATUS_LABEL[p.status] ?? p.status}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                        {p._count.columns > 0
                          ? <CheckCircle2 size={9} color="rgba(74,222,128,0.5)" />
                          : <Circle size={9} color="rgba(255,255,255,0.15)" />
                        }
                        <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)" }}>
                          {p._count.columns} col.
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })
          )}
        </div>
      </div>

      {/* ── Right: kanban panel ── */}
      <div style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>
        {selectedId ? (
          <AdminProjetDetail key={selectedId} projectId={selectedId} compact />
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", flexDirection: "column", gap: "12px" }}>
            <Kanban size={28} color="rgba(255,255,255,0.08)" />
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.15)", margin: 0 }}>Sélectionnez un projet dans la liste.</p>
          </div>
        )}
      </div>
    </div>
  );
}
