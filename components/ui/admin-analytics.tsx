"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Eye, FolderOpen, Clock } from "lucide-react";

type Analytics = {
  totalUsers: number; totalProjects: number; pendingProjects: number; totalViews: number;
  recentLogins: { userEmail: string | null; provider: string | null; createdAt: string }[];
  recentUsers: { id: string; name: string | null; email: string; image: string | null; createdAt: string }[];
  viewsByPage: { page: string; count: number }[];
  viewsByDay: { date: string; count: number }[];
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}
function fmtDay(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

function Avatar({ name, image, size = 30 }: { name?: string | null; image?: string | null; size?: number }) {
  if (image) return <img src={image} alt="" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />;
  const initials = (name ?? "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return <div style={{ width: size, height: size, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg,rgba(60,100,255,0.5),rgba(100,60,255,0.5))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.33 + "px", fontWeight: 700, color: "white" }}>{initials}</div>;
}

export function AdminAnalytics() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    fetch("/api/admin/analytics").then(r => r.json()).then(setData);
  }, []);

  if (!data) return <div style={{ padding: "32px 40px", color: "rgba(255,255,255,0.2)", fontSize: "12px" }}>Chargement...</div>;

  const maxViews = Math.max(...data.viewsByDay.map(d => d.count), 1);

  return (
    <div style={{ padding: "32px 40px", maxWidth: "960px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 800, color: "white", margin: "0 0 4px", letterSpacing: "-0.01em" }}>Analytics</h1>
        <p style={{ fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.3)", margin: 0 }}>Visites, connexions et activité.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "32px", flexWrap: "wrap" }}>
        {[
          { icon: Users,     label: "Membres",      value: data.totalUsers,    color: "rgba(100,140,255,0.8)" },
          { icon: Eye,       label: "Vues totales",  value: data.totalViews,    color: "rgba(96,165,250,0.8)" },
          { icon: FolderOpen,label: "Projets",       value: data.totalProjects, color: "rgba(167,139,250,0.8)" },
          { icon: Clock,     label: "Devis en att.", value: data.pendingProjects, color: "rgba(250,204,21,0.8)" },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} style={{ flex: "1 1 140px", padding: "16px 20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <Icon size={14} color={stat.color} />
                <span style={{ fontSize: "10px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.25)" }}>{stat.label}</span>
              </div>
              <p style={{ fontSize: "28px", fontWeight: 800, color: "white", margin: 0, lineHeight: 1 }}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {/* Vues 14j */}
        <div style={{ flex: "2 1 400px", padding: "20px 22px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(255,255,255,0.25)", margin: "0 0 20px" }}>
            Vues — 14 derniers jours
          </p>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "80px" }}>
            {data.viewsByDay.map(d => (
              <div key={d.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", height: "100%" }}>
                <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
                  <div style={{
                    width: "100%", borderRadius: "3px 3px 0 0",
                    height: `${Math.max((d.count / maxViews) * 100, d.count > 0 ? 8 : 2)}%`,
                    background: d.count > 0 ? "rgba(100,140,255,0.55)" : "rgba(255,255,255,0.05)",
                    transition: "height 0.3s ease",
                  }} title={`${d.count} vue${d.count !== 1 ? "s" : ""}`} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
            <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.15)" }}>{fmtDay(data.viewsByDay[0]?.date)}</span>
            <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.15)" }}>{fmtDay(data.viewsByDay[data.viewsByDay.length - 1]?.date)}</span>
          </div>
        </div>

        {/* Top pages */}
        <div style={{ flex: "1 1 200px", padding: "20px 22px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(255,255,255,0.25)", margin: "0 0 16px" }}>Top pages</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {data.viewsByPage.slice(0, 6).map(p => (
              <div key={p.page} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "130px" }}>{p.page}</span>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.6)", flexShrink: 0 }}>{p.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px", flexWrap: "wrap" }}>
        {/* Dernières connexions */}
        <div style={{ flex: "1 1 280px", padding: "20px 22px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(255,255,255,0.25)", margin: "0 0 14px" }}>Dernières connexions</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {data.recentLogins.length === 0 ? (
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.15)" }}>Aucune connexion enregistrée</p>
            ) : data.recentLogins.map((l, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", margin: 0 }}>{l.userEmail ?? "Inconnu"}</p>
                  <span style={{ fontSize: "9px", padding: "1px 6px", borderRadius: "4px", background: l.provider === "discord" ? "rgba(88,101,242,0.15)" : "rgba(255,255,255,0.06)", color: l.provider === "discord" ? "rgba(150,160,255,0.7)" : "rgba(255,255,255,0.25)" }}>
                    {l.provider ?? "credentials"}
                  </span>
                </div>
                <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>{fmtDate(l.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Nouveaux membres */}
        <div style={{ flex: "1 1 280px", padding: "20px 22px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(255,255,255,0.25)", margin: "0 0 14px" }}>Membres récents</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {data.recentUsers.map(u => (
              <div key={u.id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Avatar name={u.name} image={u.image} size={28} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,0.65)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name ?? u.email}</p>
                  <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", margin: 0 }}>{fmtDate(u.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
