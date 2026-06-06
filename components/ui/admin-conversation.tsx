"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send } from "lucide-react";

type Msg = { id: string; content: string; fromAdmin: boolean; createdAt: string };
type User = { id: string; name: string | null; email: string; image: string | null };

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

function Avatar({ name, image, size = 30 }: { name?: string | null; image?: string | null; size?: number }) {
  if (image) return <img src={image} alt="" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />;
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

export function AdminConversation({ userId }: { userId: string }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch(`/api/admin/messages/${userId}`)
      .then(r => {
        if (!r.ok) throw new Error("Erreur " + r.status);
        return r.json();
      })
      .then(data => {
        setUser(data.user ?? null);
        setMessages(Array.isArray(data.messages) ? data.messages : []);
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const content = input.trim();
    if (!content || sending) return;
    setSending(true);
    setInput("");
    const res = await fetch(`/api/admin/messages/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (res.ok) {
      const msg = await res.json();
      setMessages(prev => [...prev, msg]);
    }
    setSending(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", fontFamily: "var(--font-poppins)" }}>
      {/* Header */}
      <div style={{
        padding: "20px 28px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(6,10,14,0.6)",
        backdropFilter: "blur(12px)",
        display: "flex", alignItems: "center", gap: "14px",
        flexShrink: 0,
      }}>
        <button
          onClick={() => router.push("/admin/messages")}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.35)", padding: 0,
            fontFamily: "var(--font-poppins)", fontSize: "11px",
          }}
        >
          <ArrowLeft size={14} /> Retour
        </button>

        {user && (
          <>
            <div style={{ width: "1px", height: "18px", background: "rgba(255,255,255,0.07)" }} />
            <Avatar name={user.name} image={user.image} size={30} />
            <div>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.85)", margin: 0, lineHeight: 1.2 }}>
                {user.name ?? "Sans nom"}
              </p>
              <p style={{ fontSize: "10px", fontWeight: 300, color: "rgba(255,255,255,0.25)", margin: 0 }}>{user.email}</p>
            </div>
          </>
        )}
      </div>

      {/* Messages — scrollable area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {loading ? (
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", textAlign: "center", padding: "40px 0" }}>Chargement...</p>
        ) : error ? (
          <p style={{ fontSize: "12px", color: "rgba(248,113,113,0.6)", textAlign: "center", padding: "40px 0" }}>Erreur lors du chargement.</p>
        ) : messages.length === 0 ? (
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", textAlign: "center", padding: "40px 0" }}>Aucun message.</p>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  display: "flex",
                  flexDirection: msg.fromAdmin ? "row-reverse" : "row",
                  gap: "10px",
                  alignItems: "flex-end",
                }}
              >
                {msg.fromAdmin ? (
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(135deg, #3a6fff, #7c3aed)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "10px", fontWeight: 700, color: "white",
                  }}>F</div>
                ) : (
                  <Avatar name={user?.name} image={user?.image} size={28} />
                )}
                <div style={{ maxWidth: "72%" }}>
                  <div style={{
                    padding: "10px 14px",
                    borderRadius: msg.fromAdmin ? "14px 4px 14px 14px" : "4px 14px 14px 14px",
                    background: msg.fromAdmin
                      ? "linear-gradient(135deg, rgba(58,111,255,0.2), rgba(124,58,237,0.12))"
                      : "rgba(255,255,255,0.06)",
                    border: `1px solid ${msg.fromAdmin ? "rgba(58,111,255,0.2)" : "rgba(255,255,255,0.07)"}`,
                    fontSize: "13px", fontWeight: 300,
                    color: "rgba(255,255,255,0.82)",
                    lineHeight: 1.65, whiteSpace: "pre-wrap", wordBreak: "break-word",
                  }}>
                    {msg.content}
                  </div>
                  <p style={{
                    fontSize: "10px", color: "rgba(255,255,255,0.18)",
                    margin: "3px 4px 0", textAlign: msg.fromAdmin ? "right" : "left",
                  }}>
                    {formatDate(msg.createdAt)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input — pinned to bottom of this container */}
      <div style={{
        padding: "12px 28px 20px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(6,10,14,0.4)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Répondre… (Entrée pour envoyer)"
            rows={1}
            style={{
              flex: 1, background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px",
              padding: "10px 12px", color: "white",
              fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 300,
              lineHeight: 1.5, outline: "none", resize: "none", maxHeight: "100px", overflowY: "auto",
            }}
            onInput={e => {
              const t = e.currentTarget;
              t.style.height = "auto";
              t.style.height = Math.min(t.scrollHeight, 100) + "px";
            }}
          />
          <button
            onClick={send} disabled={!input.trim() || sending}
            style={{
              width: 40, height: 40, borderRadius: "10px", flexShrink: 0,
              background: input.trim() ? "linear-gradient(135deg, rgba(58,111,255,0.7), rgba(124,58,237,0.6))" : "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.07)",
              cursor: input.trim() ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Send size={15} color={input.trim() ? "white" : "rgba(255,255,255,0.2)"} />
          </button>
        </div>
      </div>
    </div>
  );
}
