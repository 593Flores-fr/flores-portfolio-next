"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MessageSquare, Circle } from "lucide-react";

type UserRow = {
  id: string; name: string | null; email: string; image: string | null;
  messages: { content: string; createdAt: string; fromAdmin: boolean }[];
  _count: { messages: number };
};

type ProjectUser = {
  id: string; name: string | null; email: string; image: string | null;
  title: string; status: string;
};

function Avatar({ name, image, size = 36 }: { name?: string | null; image?: string | null; size?: number }) {
  if (image) return <img src={image} alt="" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />;
  const initials = (name ?? "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg,rgba(60,100,255,0.5),rgba(100,60,255,0.5))", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-poppins)", fontSize: size * 0.33 + "px", fontWeight: 700, color: "white" }}>
      {initials}
    </div>
  );
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffH = (now.getTime() - d.getTime()) / 3600000;
  if (diffH < 24) return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  if (diffH < 48) return "Hier";
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

export function AdminMessages() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [projectUsers, setProjectUsers] = useState<ProjectUser[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/messages").then(r => r.json()),
      fetch("/api/admin/projects").then(r => r.json()),
    ]).then(([msgs, projs]) => {
      setUsers(Array.isArray(msgs) ? msgs : []);
      const msgIds = new Set((Array.isArray(msgs) ? msgs : []).map((u: UserRow) => u.id));
      const seen = new Set<string>();
      const newUsers: ProjectUser[] = [];
      for (const p of (Array.isArray(projs) ? projs : [])) {
        if (!msgIds.has(p.user.id) && !seen.has(p.user.id)) {
          seen.add(p.user.id);
          newUsers.push({ id: p.user.id, name: p.user.name, email: p.user.email, image: p.user.image, title: p.title, status: p.status });
        }
      }
      setProjectUsers(newUsers);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ padding: "32px 40px", maxWidth: "700px", fontFamily: "var(--font-poppins)" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 800, color: "white", margin: "0 0 4px", letterSpacing: "-0.01em" }}>Messagerie</h1>
        <p style={{ fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.3)", margin: 0 }}>Conversations avec vos clients.</p>
      </div>

      {loading ? (
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", textAlign: "center", padding: "40px 0" }}>Chargement...</p>
      ) : (
        <>
          {users.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "24px" }}>
              {users.map((u, i) => {
                const last = u.messages[0];
                const unread = u._count.messages;
                return (
                  <motion.button
                    key={u.id}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => router.push(`/admin/messages/${u.id}`)}
                    style={{
                      display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", borderRadius: "13px", textAlign: "left", width: "100%",
                      border: `1px solid ${unread > 0 ? "rgba(96,165,250,0.2)" : "rgba(255,255,255,0.07)"}`,
                      background: unread > 0 ? "rgba(96,165,250,0.04)" : "rgba(255,255,255,0.02)",
                      cursor: "pointer", fontFamily: "var(--font-poppins)",
                    }}
                  >
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <Avatar name={u.name} image={u.image} size={38} />
                      {unread > 0 && (
                        <div style={{ position: "absolute", top: -2, right: -2, width: 16, height: 16, borderRadius: "50%", background: "rgba(96,165,250,0.9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: 700, color: "white", border: "2px solid #060a0e" }}>
                          {unread > 9 ? "9+" : unread}
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                        <p style={{ fontSize: "13px", fontWeight: unread > 0 ? 700 : 500, color: "rgba(255,255,255,0.85)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {u.name ?? u.email}
                        </p>
                        {last && <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", flexShrink: 0 }}>{fmtDate(last.createdAt)}</span>}
                      </div>
                      {last && (
                        <p style={{ fontSize: "11px", fontWeight: 300, color: unread > 0 ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.3)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {last.fromAdmin ? "Vous : " : ""}{last.content}
                        </p>
                      )}
                    </div>
                    <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "18px", flexShrink: 0 }}>›</span>
                  </motion.button>
                );
              })}
            </div>
          )}

          {projectUsers.length > 0 && (
            <div>
              <p style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(255,255,255,0.2)", margin: "0 0 12px" }}>Sans échange</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {projectUsers.map((u, i) => (
                  <motion.button
                    key={u.id}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => router.push(`/admin/messages/${u.id}`)}
                    style={{
                      display: "flex", alignItems: "center", gap: "14px", padding: "12px 16px", borderRadius: "13px", textAlign: "left", width: "100%",
                      border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.015)",
                      cursor: "pointer", fontFamily: "var(--font-poppins)",
                    }}
                  >
                    <Avatar name={u.name} image={u.image} size={32} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,0.55)", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name ?? u.email}</p>
                      <p style={{ fontSize: "10px", fontWeight: 300, color: "rgba(255,255,255,0.22)", margin: 0 }}>{u.title}</p>
                    </div>
                    <Circle size={10} color="rgba(255,255,255,0.15)" />
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {users.length === 0 && projectUsers.length === 0 && (
            <div style={{ textAlign: "center", padding: "56px 0" }}>
              <div style={{ width: 48, height: 48, borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                <MessageSquare size={20} color="rgba(255,255,255,0.15)" />
              </div>
              <p style={{ fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.2)", margin: 0 }}>Aucune conversation pour l&apos;instant.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
