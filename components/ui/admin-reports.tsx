"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flag, Bug, Lightbulb, HelpCircle, ExternalLink, CheckCheck, Clock, CircleDot } from "lucide-react";

type Report = {
  id: string;
  title: string;
  type: string;
  description: string;
  url: string | null;
  status: string;
  createdAt: string;
  user: { id: string; name: string | null; email: string; image: string | null };
};

const TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  bug:        { label: "Bug",        icon: Bug,         color: "rgba(248,113,113,0.8)",  bg: "rgba(248,113,113,0.08)" },
  suggestion: { label: "Suggestion", icon: Lightbulb,   color: "rgba(250,204,21,0.8)",   bg: "rgba(250,204,21,0.07)"  },
  autre:      { label: "Autre",      icon: HelpCircle,  color: "rgba(148,163,184,0.7)",  bg: "rgba(148,163,184,0.07)" },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  open:        { label: "Ouvert",      color: "rgba(96,165,250,0.85)",  bg: "rgba(96,165,250,0.08)",  border: "rgba(96,165,250,0.2)"  },
  in_progress: { label: "En cours",    color: "rgba(250,204,21,0.85)",  bg: "rgba(250,204,21,0.07)",  border: "rgba(250,204,21,0.18)" },
  resolved:    { label: "Résolu",      color: "rgba(74,222,128,0.85)",  bg: "rgba(74,222,128,0.07)",  border: "rgba(74,222,128,0.18)" },
};

function Avatar({ name, image, size = 32 }: { name?: string | null; image?: string | null; size?: number }) {
  if (image) return <img src={image} alt="" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />;
  const initials = (name ?? "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: "linear-gradient(135deg,rgba(60,100,255,0.5),rgba(100,60,255,0.5))",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35 + "px", fontWeight: 700, color: "white",
    }}>
      {initials}
    </div>
  );
}

export function AdminReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/admin/reports")
      .then(r => r.json())
      .then(data => { setReports(data); setLoading(false); });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/admin/reports/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const updated = await res.json();
    setReports(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r));
  };

  const counts = {
    all:        reports.length,
    open:       reports.filter(r => r.status === "open").length,
    in_progress: reports.filter(r => r.status === "in_progress").length,
    resolved:   reports.filter(r => r.status === "resolved").length,
  };

  const filtered = activeFilter === "all" ? reports : reports.filter(r => r.status === activeFilter);

  const prioritized = [
    ...filtered.filter(r => r.status === "open"),
    ...filtered.filter(r => r.status === "in_progress"),
    ...filtered.filter(r => r.status === "resolved"),
  ];

  return (
    <div style={{ padding: "32px 40px", maxWidth: "800px" }}>
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 800, color: "white", margin: "0 0 4px", letterSpacing: "-0.01em" }}>Signalements</h1>
        <p style={{ fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.3)", margin: 0 }}>
          Bugs et suggestions remontés par les utilisateurs.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
        {[
          { key: "open",        label: "Ouverts",   count: counts.open,        color: "rgba(96,165,250,0.8)"  },
          { key: "in_progress", label: "En cours",  count: counts.in_progress, color: "rgba(250,204,21,0.75)" },
          { key: "resolved",    label: "Résolus",   count: counts.resolved,    color: "rgba(74,222,128,0.75)" },
        ].map(s => (
          <div key={s.key} style={{ padding: "12px 16px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", minWidth: "90px" }}>
            <p style={{ fontSize: "22px", fontWeight: 800, color: s.color, margin: "0 0 2px", lineHeight: 1 }}>{s.count}</p>
            <p style={{ fontSize: "10px", fontWeight: 300, color: "rgba(255,255,255,0.25)", margin: 0, textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "24px" }}>
        {[
          { key: "all",        label: `Tous (${counts.all})`                 },
          { key: "open",       label: `Ouverts (${counts.open})`             },
          { key: "in_progress",label: `En cours (${counts.in_progress})`     },
          { key: "resolved",   label: `Résolus (${counts.resolved})`         },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            style={{
              padding: "6px 12px", borderRadius: "8px", fontSize: "11px", fontWeight: activeFilter === f.key ? 600 : 400,
              fontFamily: "var(--font-poppins)", cursor: "pointer",
              background: activeFilter === f.key ? "rgba(60,100,255,0.14)" : "transparent",
              border: `1px solid ${activeFilter === f.key ? "rgba(60,100,255,0.3)" : "rgba(255,255,255,0.08)"}`,
              color: activeFilter === f.key ? "rgba(100,140,255,0.9)" : "rgba(255,255,255,0.35)",
              transition: "all 0.15s",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Liste */}
      {loading ? (
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", padding: "40px 0", textAlign: "center" }}>Chargement...</p>
      ) : prioritized.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <Flag size={24} color="rgba(255,255,255,0.1)" style={{ marginBottom: "10px" }} />
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", margin: 0 }}>Aucun signalement pour l&apos;instant.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {prioritized.map((report, i) => {
            const typeConf   = TYPE_CONFIG[report.type]   ?? TYPE_CONFIG.autre;
            const statusConf = STATUS_CONFIG[report.status] ?? STATUS_CONFIG.open;
            const TypeIcon   = typeConf.icon;

            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                style={{
                  padding: "16px 18px", borderRadius: "14px",
                  border: `1px solid ${report.status === "open" ? "rgba(96,165,250,0.15)" : "rgba(255,255,255,0.07)"}`,
                  background: report.status === "open" ? "rgba(96,165,250,0.03)" : "rgba(255,255,255,0.02)",
                }}
              >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                    <div style={{ width: 30, height: 30, borderRadius: "8px", flexShrink: 0, background: typeConf.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <TypeIcon size={14} color={typeConf.color} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.85)", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {report.title}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "10px", fontWeight: 500, color: typeConf.color, background: typeConf.bg, padding: "2px 6px", borderRadius: "999px" }}>
                          {typeConf.label}
                        </span>
                        <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>
                          {new Date(report.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span style={{
                    fontSize: "9px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", flexShrink: 0,
                    color: statusConf.color, background: statusConf.bg,
                    padding: "3px 8px", borderRadius: "999px",
                    border: `1px solid ${statusConf.border}`,
                  }}>
                    {statusConf.label}
                  </span>
                </div>

                {/* Description */}
                <p style={{ fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: "0 0 12px" }}>
                  {report.description}
                </p>

                {/* User + URL */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                    <Avatar name={report.user.name} image={report.user.image} size={22} />
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontWeight: 400 }}>
                      {report.user.name ?? report.user.email}
                    </span>
                  </div>
                  {report.url && (
                    <a href={report.url} target="_blank" rel="noopener noreferrer" style={{
                      display: "flex", alignItems: "center", gap: "4px",
                      fontSize: "10px", color: "rgba(96,165,250,0.6)", textDecoration: "none",
                    }}>
                      <ExternalLink size={11} /> Page concernée
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "8px" }}>
                  {report.status === "open" && (
                    <button onClick={() => updateStatus(report.id, "in_progress")} style={{
                      display: "flex", alignItems: "center", gap: "6px", padding: "7px 12px", borderRadius: "8px",
                      border: "1px solid rgba(250,204,21,0.2)", background: "rgba(250,204,21,0.06)",
                      fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 500,
                      color: "rgba(250,204,21,0.8)", cursor: "pointer",
                    }}>
                      <Clock size={12} /> En cours
                    </button>
                  )}
                  {report.status !== "resolved" && (
                    <button onClick={() => updateStatus(report.id, "resolved")} style={{
                      display: "flex", alignItems: "center", gap: "6px", padding: "7px 12px", borderRadius: "8px",
                      border: "1px solid rgba(74,222,128,0.2)", background: "rgba(74,222,128,0.06)",
                      fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 500,
                      color: "rgba(74,222,128,0.8)", cursor: "pointer",
                    }}>
                      <CheckCheck size={12} /> Résoudre
                    </button>
                  )}
                  {report.status === "resolved" && (
                    <button onClick={() => updateStatus(report.id, "open")} style={{
                      display: "flex", alignItems: "center", gap: "6px", padding: "7px 12px", borderRadius: "8px",
                      border: "1px solid rgba(255,255,255,0.1)", background: "transparent",
                      fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 500,
                      color: "rgba(255,255,255,0.3)", cursor: "pointer",
                    }}>
                      <CircleDot size={12} /> Rouvrir
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
