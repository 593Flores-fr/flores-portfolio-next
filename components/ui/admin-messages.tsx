"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

type ClientRow = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  messages: { content: string; createdAt: string; fromAdmin: boolean }[];
  _count: { messages: number };
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}j`;
  if (h > 0) return `${h}h`;
  if (m > 0) return `${m}min`;
  return "maintenant";
}

function Avatar({ name, image, size = 40 }: { name?: string | null; image?: string | null; size?: number }) {
  if (image) return <img src={image} alt="" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover" }} />;
  const initials = (name ?? "?").split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: "linear-gradient(135deg, rgba(60,100,255,0.5), rgba(100,60,255,0.5))",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-poppins)", fontSize: size * 0.33 + "px", fontWeight: 700, color: "white",
    }}>
      {initials}
    </div>
  );
}

export function AdminMessages() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/messages")
      .then(r => r.json())
      .then(data => { setClients(data); setLoading(false); });
  }, []);

  return (
    <div style={{ padding: "32px 40px", maxWidth: "680px", fontFamily: "var(--font-poppins)" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 800, color: "white", margin: "0 0 4px", letterSpacing: "-0.01em" }}>Messagerie</h1>
        <p style={{ fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.3)", margin: 0 }}>Conversations avec vos clients.</p>
      </div>
      <div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
          {[
            { label: "Clients", value: clients.length },
            { label: "Non lus", value: clients.reduce((s, c) => s + c._count.messages, 0) },
          ].map(stat => (
            <div key={stat.label} style={{
              padding: "14px 20px", borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)", flex: 1, minWidth: "120px",
            }}>
              <p style={{ fontSize: "24px", fontWeight: 800, color: "white", margin: 0, lineHeight: 1 }}>
                {stat.value}
              </p>
              <p style={{ fontSize: "11px", fontWeight: 300, color: "rgba(255,255,255,0.3)", margin: "4px 0 0", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", textAlign: "center", padding: "40px 0" }}>
            Chargement...
          </p>
        ) : clients.length === 0 ? (
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", textAlign: "center", padding: "40px 0" }}>
            Aucun message client pour l&apos;instant.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {clients.map((client, i) => (
              <motion.button
                key={client.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => router.push(`/admin/messages/${client.id}`)}
                style={{
                  display: "flex", alignItems: "center", gap: "14px",
                  padding: "14px 16px", borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.02)",
                  cursor: "pointer", textAlign: "left", width: "100%",
                  transition: "background 0.15s",
                }}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.045)" }}
              >
                {/* Avatar + unread dot */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <Avatar name={client.name} image={client.image} size={42} />
                  {client._count.messages > 0 && (
                    <div style={{
                      position: "absolute", top: -2, right: -2,
                      width: 16, height: 16, borderRadius: "50%",
                      background: "rgba(74,222,128,0.9)",
                      border: "2px solid #060a0e",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "9px", fontWeight: 700, color: "#060a0e",
                    }}>
                      {client._count.messages > 9 ? "9+" : client._count.messages}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.85)", margin: 0 }}>
                      {client.name ?? "Sans nom"}
                    </p>
                    {client.messages[0] && (
                      <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", flexShrink: 0, marginLeft: "8px" }}>
                        {timeAgo(client.messages[0].createdAt)}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: "11px", fontWeight: 300, color: "rgba(255,255,255,0.3)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {client.messages[0]
                      ? (client.messages[0].fromAdmin ? "Vous : " : "") + client.messages[0].content
                      : client.email}
                  </p>
                </div>

                <ChevronRight size={14} color="rgba(255,255,255,0.15)" style={{ flexShrink: 0 }} />
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
