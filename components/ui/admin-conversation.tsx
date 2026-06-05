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
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/admin/messages/${userId}`)
      .then(r => r.json())
      .then(data => {
        setUser(data.user);
        setMessages(data.messages);
        setLoading(false);
      });
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
    <div style={{ minHeight: "100dvh", background: "#060a0e", display: "flex", flexDirection: "column", fontFamily: "var(--font-poppins)" }}>

      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(6,10,14,0.95)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        padding: "0 6vw",
        height: "64px",
        display: "flex", alignItems: "center", gap: "14px",
      }}>
        <button
          onClick={() => router.push("/admin/messages")}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.4)", padding: "6px",
            fontFamily: "var(--font-poppins)", fontSize: "11px",
          }}
        >
          <ArrowLeft size={15} />
          Retour
        </button>

        {user && (
          <>
            <div style={{ width: "1px", height: "20px", background: "rgba(255,255,255,0.08)" }} />
            <Avatar name={user.name} image={user.image} size={32} />
            <div>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.85)", margin: 0, lineHeight: 1.2 }}>
                {user.name ?? "Sans nom"}
              </p>
              <p style={{ fontSize: "10px", fontWeight: 300, color: "rgba(255,255,255,0.25)", margin: 0 }}>
                {user.email}
              </p>
            </div>
          </>
        )}
      </header>

      {/* Messages */}
      <div style={{ flex: 1, maxWidth: "760px", width: "100%", margin: "0 auto", padding: "32px 6vw 120px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {loading ? (
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", textAlign: "center", padding: "40px 0" }}>
            Chargement...
          </p>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  display: "flex",
                  flexDirection: msg.fromAdmin ? "row-reverse" : "row",
                  gap: "10px",
                  alignItems: "flex-end",
                }}
              >
                {msg.fromAdmin ? (
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(135deg, #3a6fff, #7c3aed)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", fontWeight: 700, color: "white",
                  }}>
                    F
                  </div>
                ) : (
                  <Avatar name={user?.name} image={user?.image} size={30} />
                )}
                <div style={{ maxWidth: "75%" }}>
                  <div style={{
                    padding: "11px 15px",
                    borderRadius: msg.fromAdmin ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                    background: msg.fromAdmin
                      ? "linear-gradient(135deg, rgba(58,111,255,0.25), rgba(124,58,237,0.15))"
                      : "rgba(255,255,255,0.06)",
                    border: `1px solid ${msg.fromAdmin ? "rgba(58,111,255,0.25)" : "rgba(255,255,255,0.07)"}`,
                    fontSize: "13px", fontWeight: 300,
                    color: "rgba(255,255,255,0.82)",
                    lineHeight: 1.65,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}>
                    {msg.content}
                  </div>
                  <p style={{
                    fontSize: "10px", color: "rgba(255,255,255,0.2)",
                    margin: "4px 4px 0",
                    textAlign: msg.fromAdmin ? "right" : "left",
                    fontWeight: 300,
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

      {/* Input */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "rgba(6,10,14,0.95)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "16px 6vw 20px",
      }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", display: "flex", gap: "10px", alignItems: "flex-end" }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Répondre au client… (Entrée pour envoyer)"
            rows={1}
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              padding: "12px 14px",
              color: "white",
              fontFamily: "var(--font-poppins)",
              fontSize: "13px", fontWeight: 300,
              lineHeight: 1.6, outline: "none",
              resize: "none", maxHeight: "120px", overflowY: "auto",
            }}
            onInput={e => {
              const t = e.currentTarget;
              t.style.height = "auto";
              t.style.height = Math.min(t.scrollHeight, 120) + "px";
            }}
          />
          <button
            onClick={send}
            disabled={!input.trim() || sending}
            style={{
              width: 44, height: 44, borderRadius: "12px", flexShrink: 0,
              background: input.trim() ? "linear-gradient(135deg, rgba(58,111,255,0.7), rgba(124,58,237,0.6))" : "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              cursor: input.trim() ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s",
            }}
          >
            <Send size={16} color={input.trim() ? "white" : "rgba(255,255,255,0.2)"} />
          </button>
        </div>
      </div>
    </div>
  );
}
