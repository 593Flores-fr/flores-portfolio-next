"use client";

import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, LogOut, MessageSquare } from "lucide-react";
import type { Session } from "next-auth";

type Msg = {
  id: string;
  content: string;
  fromAdmin: boolean;
  createdAt: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

function Avatar({ name, image }: { name?: string | null; image?: string | null }) {
  if (image) return <img src={image} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />;
  const initials = (name ?? "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: 36, height: 36, borderRadius: "50%",
      background: "linear-gradient(135deg, rgba(60,100,255,0.6), rgba(100,60,255,0.6))",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 700, color: "white",
      flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

export function EspaceClient({ user }: { user: Session["user"] }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/messages")
      .then(r => r.json())
      .then(data => { setMessages(data); setLoading(false); });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const content = input.trim();
    if (!content || sending) return;
    setSending(true);
    setInput("");
    const res = await fetch("/api/messages", {
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
    <div style={{
      minHeight: "100dvh",
      background: "#060a0e",
      display: "flex",
      flexDirection: "column",
      fontFamily: "var(--font-poppins)",
    }}>
      {/* ── Top bar ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(6,10,14,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        padding: "0 6vw",
        height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Avatar name={user?.name} image={user?.image} />
          <div>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.88)", margin: 0, lineHeight: 1.2 }}>
              {user?.name ?? "Utilisateur"}
            </p>
            <p style={{ fontSize: "10px", fontWeight: 300, color: "rgba(255,255,255,0.3)", margin: 0, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Espace client
            </p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          style={{
            display: "flex", alignItems: "center", gap: "7px",
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px", padding: "7px 14px", cursor: "pointer",
            fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 500,
            color: "rgba(255,255,255,0.4)", transition: "all 0.2s",
          }}
        >
          <LogOut size={13} />
          Déconnexion
        </button>
      </header>

      {/* ── Content ── */}
      <div style={{ flex: 1, maxWidth: "760px", width: "100%", margin: "0 auto", padding: "40px 6vw 120px", display: "flex", flexDirection: "column", gap: "8px" }}>

        {/* Intro card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            padding: "20px 24px",
            borderRadius: "16px",
            background: "rgba(60,100,255,0.06)",
            border: "1px solid rgba(60,100,255,0.14)",
            marginBottom: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <MessageSquare size={16} color="rgba(100,140,255,0.7)" strokeWidth={1.5} />
            <p style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.7)", margin: 0 }}>
              Espace partagé
            </p>
          </div>
          <p style={{ fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.38)", lineHeight: 1.75, margin: 0 }}>
            Bienvenue <strong style={{ color: "rgba(255,255,255,0.65)", fontWeight: 600 }}>{user?.name?.split(" ")[0]}</strong>. Utilisez cet espace pour me décrire votre projet, poser une question ou demander un devis. Je réponds sous 24h.
          </p>
        </motion.div>

        {/* Messages thread */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.15)", fontSize: "12px" }}>
            Chargement...
          </div>
        ) : messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: "center", padding: "48px 0", color: "rgba(255,255,255,0.15)", fontSize: "12px" }}
          >
            Aucun message pour l&apos;instant — envoyez le premier !
          </motion.div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  display: "flex",
                  flexDirection: msg.fromAdmin ? "row" : "row-reverse",
                  gap: "10px",
                  alignItems: "flex-end",
                }}
              >
                {/* Avatar */}
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
                  <div style={{ width: 30, height: 30, flexShrink: 0 }}>
                    <Avatar name={user?.name} image={user?.image} />
                  </div>
                )}

                {/* Bubble */}
                <div style={{ maxWidth: "75%" }}>
                  <div style={{
                    padding: "11px 15px",
                    borderRadius: msg.fromAdmin ? "16px 16px 16px 4px" : "16px 16px 4px 16px",
                    background: msg.fromAdmin
                      ? "rgba(60,100,255,0.12)"
                      : "rgba(255,255,255,0.07)",
                    border: `1px solid ${msg.fromAdmin ? "rgba(60,100,255,0.2)" : "rgba(255,255,255,0.07)"}`,
                    fontSize: "13px",
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.82)",
                    lineHeight: 1.65,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}>
                    {msg.content}
                  </div>
                  <p style={{
                    fontSize: "10px", color: "rgba(255,255,255,0.2)", margin: "4px 4px 0",
                    textAlign: msg.fromAdmin ? "left" : "right",
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

      {/* ── Input bar ── */}
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
            placeholder="Décrivez votre projet… (Entrée pour envoyer, Shift+Entrée pour sauter une ligne)"
            rows={1}
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              padding: "12px 14px",
              color: "white",
              fontFamily: "var(--font-poppins)",
              fontSize: "13px",
              fontWeight: 300,
              lineHeight: 1.6,
              outline: "none",
              resize: "none",
              maxHeight: "120px",
              overflowY: "auto",
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
              background: input.trim() ? "rgba(60,100,255,0.7)" : "rgba(255,255,255,0.05)",
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
