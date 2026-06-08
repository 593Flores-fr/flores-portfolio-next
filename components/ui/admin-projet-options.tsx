"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Kanban, FileText, Settings2, MessageSquare, Save, CheckCircle2 } from "lucide-react";
import { AdminProjetDetail } from "./admin-projet-detail";

type Project = {
  id: string; title: string; type: string; status: string; paid: boolean;
  kanbanVisible: boolean; projectSummary: string | null;
  user: { id: string; name: string | null; email: string; image: string | null };
};

const STATUS_OPTS = [
  { value: "pending",   label: "En attente",  color: "rgba(250,204,21,0.8)"   },
  { value: "accepted",  label: "Accepté",     color: "rgba(74,222,128,0.8)"  },
  { value: "active",    label: "En cours",    color: "rgba(96,165,250,0.8)"  },
  { value: "completed", label: "Livré",       color: "rgba(167,139,250,0.8)" },
  { value: "rejected",  label: "Refusé",      color: "rgba(248,113,113,0.8)" },
];

type Mode = "overview" | "kanban" | "resume" | "status";

function Avatar({ name, image, size = 36 }: { name?: string | null; image?: string | null; size?: number }) {
  if (image) return <img src={image} alt="" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />;
  const initials = (name ?? "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg,rgba(60,100,255,0.5),rgba(100,60,255,0.5))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.33 + "px", fontWeight: 700, color: "white" }}>
      {initials}
    </div>
  );
}

export function AdminProjetOptions({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>("overview");

  // Summary editor
  const [summary, setSummary] = useState("");
  const [savingSummary, setSavingSummary] = useState(false);
  const [summarySaved, setSummarySaved] = useState(false);

  // Status editor
  const [status, setStatus] = useState("");
  const [paid, setPaid] = useState(false);
  const [kanbanVisible, setKanbanVisible] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [statusSaved, setStatusSaved] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetch(`/api/admin/projects/${projectId}`)
      .then(r => r.json())
      .then(data => {
        setProject(data);
        setSummary(data.projectSummary ?? "");
        setStatus(data.status);
        setPaid(data.paid);
        setKanbanVisible(data.kanbanVisible);
        setLoading(false);
      });
  }, [projectId]);

  const saveSummary = async () => {
    setSavingSummary(true);
    await fetch(`/api/admin/projects/${projectId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectSummary: summary }),
    });
    setSavingSummary(false);
    setSummarySaved(true);
    setTimeout(() => setSummarySaved(false), 2000);
    setProject(p => p ? { ...p, projectSummary: summary } : p);
  };

  const saveStatus = async () => {
    setSavingStatus(true);
    await fetch(`/api/admin/projects/${projectId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, paid, kanbanVisible }),
    });
    setSavingStatus(false);
    setStatusSaved(true);
    setTimeout(() => setStatusSaved(false), 2000);
    setProject(p => p ? { ...p, status, paid, kanbanVisible } : p);
  };

  if (loading) return <div style={{ padding: "32px 40px", color: "rgba(255,255,255,0.2)", fontSize: "12px", fontFamily: "var(--font-poppins)" }}>Chargement...</div>;
  if (!project) return null;

  if (mode === "kanban") {
    return (
      <div style={{ padding: "20px 0 0" }}>
        <button onClick={() => setMode("overview")} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-poppins)", fontSize: "11px", marginBottom: "0", padding: "0 40px 0" }}>
          <ArrowLeft size={13} /> Retour aux options
        </button>
        <AdminProjetDetail projectId={projectId} compact />
      </div>
    );
  }

  const currentStatus = STATUS_OPTS.find(s => s.value === (project.status));

  return (
    <div style={{ padding: "32px 40px", maxWidth: "680px", fontFamily: "var(--font-poppins)" }}>
      {/* Back */}
      <button onClick={() => router.push("/admin/projets")} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", fontSize: "11px", marginBottom: "28px", padding: 0 }}>
        <ArrowLeft size={13} /> Projets
      </button>

      {/* Project header */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "32px", padding: "18px 20px", borderRadius: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <Avatar name={project.user.name} image={project.user.image} size={40} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: "16px", fontWeight: 800, color: "white", margin: "0 0 3px", letterSpacing: "-0.01em" }}>{project.title}</h1>
          <p style={{ fontSize: "11px", fontWeight: 300, color: "rgba(255,255,255,0.3)", margin: 0 }}>
            {project.user.name ?? project.user.email} · {project.type === "web" ? "Web" : project.type === "visual" ? "Visuel" : "Autre"}
          </p>
        </div>
        {currentStatus && (
          <span style={{
            fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
            color: currentStatus.color, background: currentStatus.color.replace("0.8)", "0.1)"),
            padding: "4px 10px", borderRadius: "999px", flexShrink: 0,
          }}>
            {currentStatus.label}
          </span>
        )}
      </div>

      {/* 3 option cards */}
      <AnimatePresence mode="wait">
        {mode === "overview" && (
          <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

            {/* Kanban */}
            <OptionCard
              icon={<Kanban size={20} color="rgba(96,165,250,0.7)" />}
              title="Kanban du projet"
              desc="Gérer les tâches, colonnes, priorités et catégories. Activer/désactiver la visibilité client."
              accent="rgba(96,165,250,0.15)"
              border="rgba(96,165,250,0.2)"
              onClick={() => setMode("kanban")}
            />

            {/* Résumé */}
            <OptionCard
              icon={<FileText size={20} color="rgba(250,204,21,0.7)" />}
              title="Résumé du projet"
              desc={project.projectSummary ? "Modifier le panel résumé épinglé en haut de la conversation client." : "Créer un panel résumé épinglé en haut de la conversation client."}
              accent="rgba(250,204,21,0.1)"
              border="rgba(250,204,21,0.18)"
              badge={project.projectSummary ? "Défini" : undefined}
              onClick={() => setMode("resume")}
            />

            {/* État */}
            <OptionCard
              icon={<Settings2 size={20} color="rgba(167,139,250,0.7)" />}
              title="État du projet"
              desc="Modifier le statut, le paiement, la visibilité du kanban pour le client."
              accent="rgba(167,139,250,0.1)"
              border="rgba(167,139,250,0.18)"
              onClick={() => setMode("status")}
            />

            {/* Messages */}
            <button
              onClick={() => router.push(`/admin/messages/${project.user.id}`)}
              style={{
                display: "flex", alignItems: "center", gap: "12px", padding: "16px 18px", borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)",
                cursor: "pointer", width: "100%", textAlign: "left", transition: "border-color 0.15s",
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: "12px", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <MessageSquare size={20} color="rgba(255,255,255,0.35)" />
              </div>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.7)", margin: "0 0 2px" }}>Messagerie client</p>
                <p style={{ fontSize: "11px", fontWeight: 300, color: "rgba(255,255,255,0.3)", margin: 0 }}>Ouvrir la conversation avec {project.user.name ?? project.user.email}.</p>
              </div>
            </button>
          </motion.div>
        )}

        {/* Resume editor */}
        {mode === "resume" && (
          <motion.div key="resume" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <button onClick={() => setMode("overview")} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", fontSize: "11px", marginBottom: "20px", padding: 0 }}>
              <ArrowLeft size={12} /> Retour
            </button>
            <h2 style={{ fontSize: "14px", fontWeight: 700, color: "white", margin: "0 0 6px" }}>Résumé du projet</h2>
            <p style={{ fontSize: "11px", fontWeight: 300, color: "rgba(255,255,255,0.3)", margin: "0 0 16px" }}>
              Ce résumé apparaît comme un panel épinglé en haut de la messagerie client. Remplis-le au fil de vos échanges.
            </p>
            <textarea
              value={summary}
              onChange={e => setSummary(e.target.value)}
              rows={12}
              placeholder={"Exemple :\n\n📌 Objectif : Site vitrine pour restaurant\n📦 Livraison : fin juillet\n🎨 Style : épuré, moderne, couleurs sombres\n📱 Pages : Accueil, Menu, Contact\n🔗 Refs : [url1], [url2]\n\n— Infos complémentaires notées au fil des échanges —"}
              style={{
                width: "100%", padding: "12px 14px", borderRadius: "12px", resize: "vertical",
                border: "1px solid rgba(250,204,21,0.15)", background: "rgba(250,204,21,0.04)",
                color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-poppins)", fontSize: "12px",
                fontWeight: 300, outline: "none", boxSizing: "border-box", lineHeight: 1.75, minHeight: "200px",
              }}
            />
            <button onClick={saveSummary} disabled={savingSummary} style={{
              marginTop: "12px", display: "flex", alignItems: "center", gap: "7px", padding: "9px 20px", borderRadius: "10px",
              border: `1px solid ${summarySaved ? "rgba(74,222,128,0.3)" : "rgba(250,204,21,0.3)"}`,
              background: summarySaved ? "rgba(74,222,128,0.08)" : "rgba(250,204,21,0.08)",
              fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 600,
              color: summarySaved ? "rgba(74,222,128,0.8)" : "rgba(250,204,21,0.8)",
              cursor: "pointer", transition: "all 0.2s",
            }}>
              {summarySaved ? <><CheckCircle2 size={13} /> Sauvegardé</> : <><Save size={13} /> {savingSummary ? "…" : "Sauvegarder"}</>}
            </button>
          </motion.div>
        )}

        {/* Status editor */}
        {mode === "status" && (
          <motion.div key="status" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <button onClick={() => setMode("overview")} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", fontSize: "11px", marginBottom: "20px", padding: 0 }}>
              <ArrowLeft size={12} /> Retour
            </button>
            <h2 style={{ fontSize: "14px", fontWeight: 700, color: "white", margin: "0 0 20px" }}>État du projet</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <p style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(255,255,255,0.25)", margin: "0 0 10px" }}>Statut</p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {STATUS_OPTS.map(s => (
                    <button key={s.value} onClick={() => setStatus(s.value)} style={{
                      padding: "8px 16px", borderRadius: "9px", cursor: "pointer",
                      border: `1px solid ${status === s.value ? s.color.replace("0.8)", "0.3)") : "rgba(255,255,255,0.08)"}`,
                      background: status === s.value ? s.color.replace("0.8)", "0.1)") : "rgba(255,255,255,0.02)",
                      fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: status === s.value ? 700 : 400,
                      color: status === s.value ? s.color : "rgba(255,255,255,0.4)",
                      transition: "all 0.15s",
                    }}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <ToggleBtn label="Paiement reçu" active={paid} color="rgba(74,222,128,0.8)" onClick={() => setPaid(v => !v)} />
                <ToggleBtn label="Kanban visible client" active={kanbanVisible} color="rgba(96,165,250,0.8)" onClick={() => setKanbanVisible(v => !v)} />
              </div>
            </div>

            <button onClick={saveStatus} disabled={savingStatus} style={{
              marginTop: "20px", display: "flex", alignItems: "center", gap: "7px", padding: "9px 20px", borderRadius: "10px",
              border: `1px solid ${statusSaved ? "rgba(74,222,128,0.3)" : "rgba(100,140,255,0.3)"}`,
              background: statusSaved ? "rgba(74,222,128,0.08)" : "rgba(60,100,255,0.1)",
              fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 600,
              color: statusSaved ? "rgba(74,222,128,0.8)" : "rgba(100,140,255,0.8)",
              cursor: "pointer", transition: "all 0.2s",
            }}>
              {statusSaved ? <><CheckCircle2 size={13} /> Sauvegardé</> : <><Save size={13} /> {savingStatus ? "…" : "Sauvegarder"}</>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OptionCard({ icon, title, desc, accent, border, badge, onClick }: {
  icon: React.ReactNode; title: string; desc: string;
  accent: string; border: string; badge?: string; onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.005 }}
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: "14px", padding: "16px 18px", borderRadius: "14px",
        border: `1px solid ${border}`, background: accent,
        cursor: "pointer", width: "100%", textAlign: "left", transition: "border-color 0.15s",
        fontFamily: "var(--font-poppins)",
      }}
    >
      <div style={{ width: 40, height: 40, borderRadius: "12px", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
          <p style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.85)", margin: 0 }}>{title}</p>
          {badge && (
            <span style={{ fontSize: "8px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(74,222,128,0.8)", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)", padding: "1px 7px", borderRadius: "999px" }}>
              {badge}
            </span>
          )}
        </div>
        <p style={{ fontSize: "11px", fontWeight: 300, color: "rgba(255,255,255,0.3)", margin: 0, lineHeight: 1.5 }}>{desc}</p>
      </div>
      <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "18px", flexShrink: 0 }}>›</span>
    </motion.button>
  );
}

function ToggleBtn({ label, active, color, onClick }: { label: string; active: boolean; color: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", borderRadius: "10px",
      border: `1px solid ${active ? color.replace("0.8)", "0.25)") : "rgba(255,255,255,0.08)"}`,
      background: active ? color.replace("0.8)", "0.08)") : "rgba(255,255,255,0.02)",
      fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: active ? 600 : 400,
      color: active ? color : "rgba(255,255,255,0.35)", cursor: "pointer", transition: "all 0.15s",
    }}>
      <div style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${active ? color : "rgba(255,255,255,0.2)"}`, background: active ? color.replace("0.8)", "0.3)") : "transparent", transition: "all 0.15s" }} />
      {label}
    </button>
  );
}
