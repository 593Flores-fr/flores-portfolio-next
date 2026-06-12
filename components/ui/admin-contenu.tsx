"use client";

import { useEffect, useState, useCallback } from "react";
import { Save, Check, ChevronDown, ChevronRight, Globe, Type, Link as LinkIcon, Image } from "lucide-react";
import type { SiteContentMap, ServiceItem } from "@/lib/site-content";
import { SITE_DEFAULTS } from "@/lib/site-content";

type Section = keyof SiteContentMap;

const SECTION_LABELS: Record<Section, string> = {
  hero: "Accueil — Hero",
  about: "Section À propos",
  features: "Section Services",
  tarifs: "Section Tarifs",
  footer: "Footer & Réseaux",
};

function useAutoResize(ref: React.RefObject<HTMLTextAreaElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  });
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 10px", borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)",
  color: "white", fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 300,
  outline: "none", boxSizing: "border-box",
};
const taStyle: React.CSSProperties = {
  ...inputStyle, resize: "none", lineHeight: 1.6, overflow: "hidden",
};
const labelStyle: React.CSSProperties = {
  display: "block", fontFamily: "var(--font-poppins)", fontSize: "9px", fontWeight: 600,
  color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.16em", marginBottom: "5px",
};

function AutoTextarea({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = { current: null as HTMLTextAreaElement | null };
  useAutoResize(ref as React.RefObject<HTMLTextAreaElement>);
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={1}
      style={taStyle}
      onInput={e => {
        const t = e.currentTarget;
        t.style.height = "auto";
        t.style.height = t.scrollHeight + "px";
      }}
    />
  );
}

function SectionPanel({ title, children, defaultOpen = false }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", overflow: "hidden" }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 18px", background: "rgba(255,255,255,0.02)", border: "none",
          cursor: "pointer", fontFamily: "var(--font-poppins)",
        }}
      >
        <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>{title}</span>
        {open ? <ChevronDown size={14} color="rgba(255,255,255,0.3)" /> : <ChevronRight size={14} color="rgba(255,255,255,0.3)" />}
      </button>
      {open && (
        <div style={{ padding: "18px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", gap: "14px" }}>
          {children}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

// ── Hero editor ────────────────────────────────────────────────────────────────

function HeroEditor({ value, onChange }: {
  value: SiteContentMap["hero"];
  onChange: (v: SiteContentMap["hero"]) => void;
}) {
  const set = (key: keyof SiteContentMap["hero"]) => (val: string) =>
    onChange({ ...value, [key]: val });
  return (
    <>
      <Field label="Badge disponibilité">
        <input style={inputStyle} value={value.badge} onChange={e => set("badge")(e.target.value)} />
      </Field>
      <Field label="Sous-titre (ex: Graphiste & Dev Web · France)">
        <input style={inputStyle} value={value.subtitle} onChange={e => set("subtitle")(e.target.value)} />
      </Field>
      <Field label="Description">
        <AutoTextarea value={value.description} onChange={set("description")} />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <Field label="Bouton principal">
          <input style={inputStyle} value={value.cta1} onChange={e => set("cta1")(e.target.value)} />
        </Field>
        <Field label="Bouton secondaire">
          <input style={inputStyle} value={value.cta2} onChange={e => set("cta2")(e.target.value)} />
        </Field>
      </div>
    </>
  );
}

// ── About editor ───────────────────────────────────────────────────────────────

function AboutEditor({ value, onChange }: {
  value: SiteContentMap["about"];
  onChange: (v: SiteContentMap["about"]) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const setField = (key: keyof SiteContentMap["about"]) => (val: string) =>
    onChange({ ...value, [key]: val });
  const setPoint = (i: number, field: "title" | "text") => (val: string) => {
    const pts = [...value.points];
    pts[i] = { ...pts[i], [field]: val };
    onChange({ ...value, points: pts });
  };
  const setStat = (i: number, field: "val" | "label") => (val: string) => {
    const stats = [...value.stats];
    stats[i] = { ...stats[i], [field]: val };
    onChange({ ...value, stats });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/about-image", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) setField("imageSrc")(data.url);
    setUploading(false);
  };

  return (
    <>
      <Field label="Badge flottant">
        <input style={inputStyle} value={value.badge} onChange={e => setField("badge")(e.target.value)} />
      </Field>
      <Field label="Titre section">
        <input style={inputStyle} value={value.heading} onChange={e => setField("heading")(e.target.value)} />
      </Field>
      <Field label="Photo">
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {value.imageSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value.imageSrc} alt="" style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)" }} />
          )}
          <label style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            padding: "9px 14px", borderRadius: "8px", cursor: uploading ? "not-allowed" : "pointer",
            border: "1px dashed rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.03)",
            fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 500,
            color: uploading ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.5)",
          }}>
            {uploading ? "Upload en cours…" : "📎 Choisir une image"}
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} disabled={uploading} />
          </label>
          <input style={{ ...inputStyle, fontSize: "10px", color: "rgba(255,255,255,0.35)" }} value={value.imageSrc ?? ""} onChange={e => setField("imageSrc")(e.target.value)} placeholder="/images/about.jpg ou URL externe" />
        </div>
      </Field>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <label style={labelStyle}>Points bio (3)</label>
        {value.points.map((pt, i) => (
          <div key={i} style={{ padding: "12px", borderRadius: "10px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", color: "rgba(255,255,255,0.2)", fontWeight: 500 }}>Point {pt.num}</span>
            <Field label="Titre">
              <input style={inputStyle} value={pt.title} onChange={e => setPoint(i, "title")(e.target.value)} />
            </Field>
            <Field label="Texte">
              <AutoTextarea value={pt.text} onChange={setPoint(i, "text")} />
            </Field>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <label style={labelStyle}>Stats flottantes</label>
        {value.stats.map((stat, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "8px" }}>
            <Field label="Valeur">
              <input style={inputStyle} value={stat.val} onChange={e => setStat(i, "val")(e.target.value)} />
            </Field>
            <Field label="Label">
              <input style={inputStyle} value={stat.label} onChange={e => setStat(i, "label")(e.target.value)} />
            </Field>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Features editor ────────────────────────────────────────────────────────────

function FeaturesEditor({ value, onChange }: {
  value: SiteContentMap["features"];
  onChange: (v: SiteContentMap["features"]) => void;
}) {
  const setField = (key: keyof SiteContentMap["features"]) => (val: string) =>
    onChange({ ...value, [key]: val });
  const setItem = (i: number, field: "title" | "description") => (val: string) => {
    const items = [...value.items];
    items[i] = { ...items[i], [field]: val };
    onChange({ ...value, items });
  };
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <Field label="Eyebrow">
          <input style={inputStyle} value={value.eyebrow} onChange={e => setField("eyebrow")(e.target.value)} />
        </Field>
        <Field label="Titre">
          <input style={inputStyle} value={value.title} onChange={e => setField("title")(e.target.value)} />
        </Field>
      </div>
      <Field label="Sous-titre">
        <input style={inputStyle} value={value.subtitle} onChange={e => setField("subtitle")(e.target.value)} />
      </Field>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label style={labelStyle}>Cartes services (6)</label>
        {value.items.map((item, i) => (
          <div key={i} style={{ padding: "12px", borderRadius: "10px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: "8px" }}>
            <Field label={`Service ${i + 1} — Titre`}>
              <input style={inputStyle} value={item.title} onChange={e => setItem(i, "title")(e.target.value)} />
            </Field>
            <Field label="Description">
              <AutoTextarea value={item.description} onChange={setItem(i, "description")} />
            </Field>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Service row mini-editor ────────────────────────────────────────────────────

function ServiceEditor({ services, onChange }: {
  services: ServiceItem[];
  onChange: (v: ServiceItem[]) => void;
}) {
  const set = (i: number, field: keyof ServiceItem) => (val: string | boolean) => {
    const copy = [...services];
    copy[i] = { ...copy[i], [field]: val } as ServiceItem;
    onChange(copy);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {services.map((svc, i) => (
        <div key={i} style={{ padding: "12px", borderRadius: "10px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <Field label="Nom">
              <input style={inputStyle} value={svc.name} onChange={e => set(i, "name")(e.target.value)} />
            </Field>
            <Field label="Prix">
              <input style={inputStyle} value={svc.price} onChange={e => set(i, "price")(e.target.value)} />
            </Field>
          </div>
          <Field label="Description">
            <AutoTextarea value={svc.description} onChange={v => set(i, "description")(v)} />
          </Field>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
              <input type="checkbox" checked={!!svc.badge} onChange={e => set(i, "badge")(e.target.checked ? "Nouveau" : "")}
                style={{ accentColor: "rgba(74,222,128,0.8)" }} />
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>Badge "Nouveau"</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
              <input type="checkbox" checked={!!svc.soon} onChange={e => set(i, "soon")(e.target.checked)}
                style={{ accentColor: "rgba(250,204,21,0.8)" }} />
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>Bientôt</span>
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}

function TarifsEditor({ value, onChange }: {
  value: SiteContentMap["tarifs"];
  onChange: (v: SiteContentMap["tarifs"]) => void;
}) {
  return (
    <>
      <Field label="Note de bas de page">
        <input style={inputStyle} value={value.footerNote} onChange={e => onChange({ ...value, footerNote: e.target.value })} />
      </Field>
      <div>
        <label style={labelStyle}>Développement Web — Services</label>
        <ServiceEditor services={value.devServices} onChange={v => onChange({ ...value, devServices: v })} />
      </div>
      <div>
        <label style={labelStyle}>Création Visuelle — Services</label>
        <ServiceEditor services={value.visualServices} onChange={v => onChange({ ...value, visualServices: v })} />
      </div>
    </>
  );
}

// ── Footer editor ──────────────────────────────────────────────────────────────

function FooterEditor({ value, onChange }: {
  value: SiteContentMap["footer"];
  onChange: (v: SiteContentMap["footer"]) => void;
}) {
  const set = (key: keyof SiteContentMap["footer"]) => (val: string) =>
    onChange({ ...value, [key]: val });
  return (
    <>
      <Field label="Nom marque">
        <input style={inputStyle} value={value.brandName} onChange={e => set("brandName")(e.target.value)} />
      </Field>
      <Field label="Description marque">
        <AutoTextarea value={value.brandDesc} onChange={set("brandDesc")} />
      </Field>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <label style={labelStyle}>Liens réseaux sociaux</label>
        <Field label="Discord — URL">
          <input style={inputStyle} value={value.discordUrl} onChange={e => set("discordUrl")(e.target.value)} placeholder="https://discord.gg/..." />
        </Field>
        <Field label="Instagram — URL">
          <input style={inputStyle} value={value.instagramUrl} onChange={e => set("instagramUrl")(e.target.value)} placeholder="https://instagram.com/..." />
        </Field>
        <Field label="Behance — URL">
          <input style={inputStyle} value={value.behanceUrl} onChange={e => set("behanceUrl")(e.target.value)} placeholder="https://behance.net/..." />
        </Field>
      </div>
      <Field label="Mention légale bas de page">
        <input style={inputStyle} value={value.legalNote} onChange={e => set("legalNote")(e.target.value)} />
      </Field>
    </>
  );
}

// ── Root component ─────────────────────────────────────────────────────────────

export function AdminContenu() {
  const [content, setContent] = useState<SiteContentMap>(SITE_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Section | null>(null);
  const [saved, setSaved] = useState<Section | null>(null);

  useEffect(() => {
    fetch("/api/admin/site-content")
      .then(r => r.json())
      .then(data => { setContent(data); setLoading(false); });
  }, []);

  const save = async (section: Section) => {
    setSaving(section);
    await fetch("/api/admin/site-content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, data: content[section] }),
    });
    setSaving(null);
    setSaved(section);
    setTimeout(() => setSaved(null), 2200);
  };

  const setSection = useCallback(<K extends Section>(section: K) => (val: SiteContentMap[K]) => {
    setContent(prev => ({ ...prev, [section]: val }));
  }, []);

  function SaveBtn({ section }: { section: Section }) {
    const isSaving = saving === section;
    const isSaved = saved === section;
    return (
      <button
        onClick={() => save(section)}
        disabled={!!saving}
        style={{
          display: "flex", alignItems: "center", gap: "6px",
          padding: "8px 14px", borderRadius: "8px",
          border: `1px solid ${isSaved ? "rgba(74,222,128,0.3)" : "rgba(60,100,255,0.25)"}`,
          background: isSaved ? "rgba(74,222,128,0.08)" : "rgba(60,100,255,0.12)",
          fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 600,
          color: isSaved ? "rgba(74,222,128,0.85)" : "rgba(100,140,255,0.85)",
          cursor: saving ? "not-allowed" : "pointer",
          opacity: saving && !isSaving ? 0.5 : 1,
        }}
      >
        {isSaved ? <Check size={12} /> : <Save size={12} />}
        {isSaved ? "Enregistré ✓" : isSaving ? "Sauvegarde…" : "Sauvegarder"}
      </button>
    );
  }

  if (loading) {
    return <div style={{ padding: "40px", color: "rgba(255,255,255,0.2)", fontSize: "12px" }}>Chargement…</div>;
  }

  const sections: { key: Section; icon: React.ReactNode; editor: React.ReactNode }[] = [
    {
      key: "hero",
      icon: <Type size={13} />,
      editor: <HeroEditor value={content.hero} onChange={setSection("hero")} />,
    },
    {
      key: "about",
      icon: <Image size={13} />,
      editor: <AboutEditor value={content.about} onChange={setSection("about")} />,
    },
    {
      key: "features",
      icon: <Globe size={13} />,
      editor: <FeaturesEditor value={content.features} onChange={setSection("features")} />,
    },
    {
      key: "tarifs",
      icon: <LinkIcon size={13} />,
      editor: <TarifsEditor value={content.tarifs} onChange={setSection("tarifs")} />,
    },
    {
      key: "footer",
      icon: <LinkIcon size={13} />,
      editor: <FooterEditor value={content.footer} onChange={setSection("footer")} />,
    },
  ];

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 800, color: "white", margin: "0 0 6px", letterSpacing: "-0.01em" }}>
          Contenu du site
        </h1>
        <p style={{ fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.3)", margin: 0 }}>
          Modifiez les textes, tarifs et liens affichés sur votre site. Chaque section se sauvegarde indépendamment.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "760px" }}>
        {sections.map(({ key, editor }) => (
          <div key={key}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.16em" }}>
                {SECTION_LABELS[key]}
              </span>
              <SaveBtn section={key} />
            </div>
            <SectionPanel title={SECTION_LABELS[key]} defaultOpen={key === "hero"}>
              {editor}
            </SectionPanel>
          </div>
        ))}
      </div>
    </div>
  );
}
