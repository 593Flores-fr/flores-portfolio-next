"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { RealismButton } from "./realism-button";
import { X, Eye, EyeOff, AlertCircle } from "lucide-react";

interface AuthPanelProps {
  onClose?: () => void;
}

export function AuthPanel({ onClose }: AuthPanelProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "9px 12px",
    borderRadius: "9px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    color: "white",
    fontFamily: "var(--font-poppins)",
    fontSize: "12px",
    fontWeight: 300,
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-poppins)",
    fontSize: "10px",
    fontWeight: 500,
    color: "rgba(255,255,255,0.35)",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    display: "block",
    marginBottom: "5px",
  };

  const handleModeSwitch = (m: "login" | "register") => {
    setMode(m);
    setError("");
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Une erreur est survenue");
          setLoading(false);
          return;
        }
        // Auto-login after register
        const result = await signIn("credentials", { email, password, redirect: false });
        if (result?.error) {
          setError("Compte créé, mais connexion automatique échouée. Connectez-vous.");
          setMode("login");
        } else {
          router.push("/espace");
        }
      } else {
        const result = await signIn("credentials", { email, password, redirect: false });
        if (result?.error) {
          setError("Email ou mot de passe incorrect");
        } else {
          router.push("/espace");
        }
      }
    } catch {
      setError("Erreur réseau, veuillez réessayer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: "100%",
        borderRadius: "20px",
        background: "rgba(8,12,24,0.82)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
        padding: "20px 20px 18px",
        position: "relative",
      }}
    >
      {/* Close */}
      {onClose && (
        <button onClick={onClose} style={{ position: "absolute", top: "12px", right: "12px", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", padding: "4px", display: "flex" }}>
          <X size={14} />
        </button>
      )}

      {/* Header */}
      <div style={{ marginBottom: "16px" }}>
        <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "4px" }}>Bienvenue</p>
        <h3 style={{ fontFamily: "var(--font-poppins)", fontSize: "18px", fontWeight: 700, color: "white", letterSpacing: "-0.01em", margin: 0 }}>
          {mode === "login" ? "Se connecter" : "Créer un compte"}
        </h3>
      </div>

      {/* Mention espace partagé */}
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        padding: "10px 12px",
        borderRadius: "10px",
        background: "rgba(60,100,255,0.07)",
        border: "1px solid rgba(60,100,255,0.15)",
        marginBottom: "16px",
      }}>
        <span style={{ fontSize: "14px", flexShrink: 0, marginTop: "1px" }}>💬</span>
        <p style={{
          fontFamily: "var(--font-poppins)",
          fontSize: "11px",
          fontWeight: 300,
          color: "rgba(255,255,255,0.5)",
          lineHeight: 1.65,
          margin: 0,
        }}>
          En vous connectant, vous accédez à un <strong style={{ color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>espace partagé avec moi </strong>pour discuter d&rsquo;un projet, demander un devis ou échanger directement.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "3px", marginBottom: "16px", padding: "3px", borderRadius: "9px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
        {(["login", "register"] as const).map((tab) => (
          <button key={tab} onClick={() => handleModeSwitch(tab)} style={{
            flex: 1, padding: "7px", borderRadius: "6px", border: "none", cursor: "pointer",
            fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 500,
            transition: "all 0.2s ease",
            background: mode === tab ? "rgba(60,100,255,0.25)" : "transparent",
            color: mode === tab ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)",
            borderBottom: mode === tab ? "1px solid rgba(60,100,255,0.4)" : "1px solid transparent",
          }}>
            {tab === "login" ? "Connexion" : "Inscription"}
          </button>
        ))}
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden", marginBottom: "10px" }}
          >
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "8px 12px", borderRadius: "8px",
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
            }}>
              <AlertCircle size={13} color="rgba(239,68,68,0.8)" />
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", color: "rgba(239,68,68,0.85)", margin: 0, fontWeight: 400 }}>
                {error}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <AnimatePresence mode="wait">
        <motion.form key={mode}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          onSubmit={handleSubmit}
        >
          {mode === "register" && (
            <div>
              <label style={labelStyle}>Nom</label>
              <input
                type="text"
                placeholder="Votre nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
              />
            </div>
          )}

          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Mot de passe</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={mode === "register" ? 8 : undefined}
                style={{ ...inputStyle, paddingRight: "36px" }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", display: "flex" }}>
                {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>

          {mode === "login" && (
            <div style={{ textAlign: "right" }}>
              <button type="button" style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-poppins)", fontSize: "10px", color: "rgba(100,140,255,0.7)" }}>
                Mot de passe oublié ?
              </button>
            </div>
          )}

          <div style={{ marginTop: "2px" }}>
            <RealismButton
              text={loading ? "Chargement..." : mode === "login" ? "Se connecter" : "Créer mon compte"}
              type="submit"
              fullWidth
              disabled={loading}
            />
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.08em" }}>OU</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
          </div>

          {/* Discord */}
          <button
            type="button"
            onClick={() => signIn("discord")}
            style={{
              width: "100%", padding: "9px", borderRadius: "9px",
              border: "1px solid rgba(88,101,242,0.3)", background: "rgba(88,101,242,0.1)",
              color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-poppins)", fontSize: "12px",
              fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.114 18.1.128 18.116a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
            </svg>
            Continuer avec Discord
          </button>
        </motion.form>
      </AnimatePresence>

      {/* Accent bottom */}
      <div style={{ position: "absolute", bottom: 0, left: "20%", right: "20%", height: "1px", background: "linear-gradient(to right, transparent, rgba(60,100,255,0.4), transparent)", borderRadius: "999px" }} />
    </motion.div>
  );
}
