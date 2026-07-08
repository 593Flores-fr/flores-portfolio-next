"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, X } from "lucide-react";

interface AuthPanelProps {
  onClose?: () => void;
}

const inp: React.CSSProperties = {
  width: "100%", padding: "11px 13px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.03)",
  color: "white", fontFamily: "var(--font-poppins)", fontSize: "var(--fs-md)",
  fontWeight: 300, outline: "none", boxSizing: "border-box",
  borderRadius: 0,
};
const lbl: React.CSSProperties = {
  fontFamily: "var(--font-poppins)", fontSize: "var(--fs-2xs)", fontWeight: 600,
  color: "rgba(255,255,255,0.22)", textTransform: "uppercase",
  letterSpacing: "0.2em", display: "block", marginBottom: "6px",
};

export function AuthPanel({ onClose }: AuthPanelProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const switchMode = (m: "login" | "register") => {
    setMode(m); setError(""); setName(""); setEmail(""); setPassword(""); setRememberMe(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      if (mode === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error ?? "Erreur"); setLoading(false); return; }
        const result = await signIn("credentials", { email, password, rememberMe: "false", redirect: false });
        if (result?.error) { setError("Compte créé — connectez-vous."); setMode("login"); }
        else router.push("/espace");
      } else {
        const result = await signIn("credentials", { email, password, rememberMe: String(rememberMe), redirect: false });
        if (result?.error) setError("Email ou mot de passe incorrect");
        else router.push("/espace");
      }
    } catch { setError("Erreur réseau"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ width: "100%", background: "#0e0c0a", border: "1px solid rgba(255,255,255,0.07)", position: "relative" }}>
      {onClose && (
        <button onClick={onClose} style={{ position: "absolute", top: "14px", right: "14px", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: "4px", display: "flex" }}>
          <X size={13} />
        </button>
      )}

      {/* Onglets */}
      <div style={{ display: "flex", gap: "1px", background: "rgba(255,255,255,0.06)" }}>
        {(["login", "register"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => switchMode(tab)}
            style={{
              flex: 1, padding: "14px", border: "none", cursor: "pointer",
              fontFamily: "var(--font-poppins)", fontSize: "var(--fs-xs)", fontWeight: 600,
              letterSpacing: "3px", textTransform: "uppercase",
              background: mode === tab ? "#0e0c0a" : "rgba(255,255,255,0.02)",
              color: mode === tab ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.2)",
              transition: "all 0.2s ease",
              borderBottom: mode === tab ? "1px solid rgba(92,92,245,0.5)" : "1px solid transparent",
            }}
          >
            {tab === "login" ? "Connexion" : "Inscription"}
          </button>
        ))}
      </div>

      <div style={{ padding: "28px 24px 24px" }}>
        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              style={{ overflow: "hidden", marginBottom: "16px" }}
            >
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "var(--fs-sm)", color: "rgba(248,113,113,0.8)", margin: 0, padding: "10px 12px", border: "1px solid rgba(248,113,113,0.18)", background: "rgba(248,113,113,0.05)" }}>
                {error}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <AnimatePresence mode="wait">
          <motion.form
            key={mode}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            {mode === "register" && (
              <div>
                <label style={lbl}>Nom</label>
                <input type="text" placeholder="Votre nom" value={name} onChange={e => setName(e.target.value)} style={inp} />
              </div>
            )}
            <div>
              <label style={lbl}>Email</label>
              <input type="email" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)} required style={inp} />
            </div>
            <div>
              <label style={lbl}>Mot de passe</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={mode === "register" ? 8 : undefined}
                  style={{ ...inp, paddingRight: "36px" }}
                />
                <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", display: "flex" }}>
                  {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>

            {mode === "login" && (
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", userSelect: "none" }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  style={{ width: "12px", height: "12px", accentColor: "rgba(92,92,245,0.85)", cursor: "pointer", flexShrink: 0 }}
                />
                <span style={{ fontFamily: "var(--font-poppins)", fontSize: "var(--fs-xs)", fontWeight: 500, color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em" }}>
                  Se souvenir de moi — 30 jours
                </span>
              </label>
            )}

            {/* Submit — style VTO CTA */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "13px",
                background: loading ? "rgba(92,92,245,0.3)" : "rgba(92,92,245,0.85)",
                border: "1px solid rgba(92,92,245,0.5)",
                fontFamily: "var(--font-poppins)", fontSize: "var(--fs-xs)", fontWeight: 600,
                letterSpacing: "3px", textTransform: "uppercase",
                color: "white", cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.3s ease",
                borderRadius: 0,
              }}
            >
              {loading ? "…" : mode === "login" ? "Se connecter" : "Créer un compte"}
            </button>

            {/* Discord */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
              <span className="vto-label" style={{ fontSize: "var(--fs-2xs)", letterSpacing: "3px" }}>ou</span>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
            </div>

            <button
              type="button"
              onClick={() => signIn("discord")}
              style={{
                width: "100%", padding: "11px",
                border: "1px solid rgba(88,101,242,0.25)", background: "rgba(88,101,242,0.07)",
                fontFamily: "var(--font-poppins)", fontSize: "var(--fs-xs)", fontWeight: 600,
                letterSpacing: "3px", textTransform: "uppercase",
                color: "rgba(255,255,255,0.68)", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                transition: "all 0.2s ease", borderRadius: 0,
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.114 18.1.128 18.116a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
              </svg>
              Discord
            </button>
          </motion.form>
        </AnimatePresence>
      </div>
    </div>
  );
}
