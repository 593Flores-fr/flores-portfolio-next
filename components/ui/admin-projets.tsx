"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { MessageSquare, ChevronRight } from "lucide-react";

type Project = {
  id: string; title: string; type: string; status: string; paid: boolean; createdAt: string;
  user: { id: string; name: string | null; email: string; image: string | null };
  _count: { columns: number };
};

const STATUS_COLOR: Record<string, string> = {
  pending: "rgba(250,204,21,0.85)", accepted: "rgba(74,222,128,0.85)",
  active: "rgba(96,165,250,0.85)", completed: "rgba(167,139,250,0.85)",
  rejected: "rgba(248,113,113,0.85)",
};
const STATUS_BG: Record<string, string> = {
  pending: "rgba(250,204,21,0.08)", accepted: "rgba(74,222,128,0.08)",
  active: "rgba(96,165,250,0.08)", completed: "rgba(167,139,250,0.08)",
  rejected: "rgba(248,113,113,0.08)",
};
const STATUS_LABEL: Record<string, string> = {
  pending: "En attente", accepted: "Accepté",
  active: "En cours", completed: "Livré", rejected: "Refusé",
};

function Avatar({ name, image, size = 32 }: { name?: string | null; image?: string | null; size?: number }) {
  if (image) return <img src={image} alt="" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />;
  const initials = (name ?? "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg,rgba(60,100,255,0.5),rgba(100,60,255,0.5))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.33 + "px", fontWeight: 700, color: "white" }}>
      {initials}
    </div>
  );
}

export function AdminProjets() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/projects")
      .then(r => r.json())
      .then((data: Project[]) => {
        setProjects(data);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: "32px 40px", maxWidth: "800px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 800, color: "white", margin: "0 0 4px", letterSpacing: "-0.01em" }}>Projets</h1>
        <p style={{ fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.3)", margin: 0 }}>
          Cliquez sur un projet pour ouvrir la conversation avec le client.
        </p>
      </div>

      {loading ? (
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", padding: "40px 0", textAlign: "center" }}>Chargement...</p>
      ) : projects.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <MessageSquare size={24} color="rgba(255,255,255,0.1)" style={{ marginBottom: "10px" }} />
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", margin: 0 }}>Aucun projet pour l&apos;instant.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {projects.map((p, i) => (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => router.push(`/admin/messages/${p.user.id}`)}
              style={{
                display: "flex", alignItems: "center", gap: "14px",
                padding: "14px 16px", borderRadius: "12px", textAlign: "left", width: "100%",
                border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)",
                cursor: "pointer", fontFamily: "var(--font-poppins)", transition: "background 0.15s",
              }}
            >
              <Avatar name={p.user.name} image={p.user.image} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.85)", margin: 0 }}>{p.title}</p>
                  <span style={{
                    fontSize: "9px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em",
                    color: STATUS_COLOR[p.status] ?? "rgba(255,255,255,0.4)",
                    background: STATUS_BG[p.status] ?? "transparent",
                    padding: "2px 8px", borderRadius: "999px", flexShrink: 0, marginLeft: "8px",
                  }}>
                    {STATUS_LABEL[p.status] ?? p.status}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 300, color: "rgba(255,255,255,0.25)", margin: 0 }}>
                    {p.user.name ?? p.user.email}
                  </p>
                  <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.15)" }}>·</span>
                  <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>
                    {p.type === "web" ? "Web" : p.type === "visual" ? "Visuel" : "Autre"}
                  </span>
                </div>
              </div>
              <ChevronRight size={14} color="rgba(255,255,255,0.15)" style={{ flexShrink: 0 }} />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
