"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Printer, Eye, X, FileText, Receipt } from "lucide-react";

type LineItem = { description: string; qty: number; unitPrice: number };
type Invoice = {
  id: string; number: string; type: string; status: string;
  clientName: string; clientEmail: string; clientAddress: string;
  items: LineItem[]; taxRate: number; notes: string;
  issuedAt: string; dueDate: string | null;
  user?: { id: string; name: string | null; email: string } | null;
};
type ClientUser = { id: string; name: string | null; email: string };

const STATUS_LABEL: Record<string, string> = { draft: "Brouillon", sent: "Envoyé", paid: "Payé", cancelled: "Annulé" };
const STATUS_COLOR: Record<string, string> = { draft: "rgba(255,255,255,0.3)", sent: "rgba(96,165,250,0.8)", paid: "rgba(74,222,128,0.8)", cancelled: "rgba(248,113,113,0.7)" };

const emptyForm = (): { type: string; clientName: string; clientEmail: string; clientAddress: string; items: LineItem[]; taxRate: number; notes: string; dueDate: string; userId: string } => ({
  type: "devis", clientName: "", clientEmail: "", clientAddress: "",
  items: [{ description: "", qty: 1, unitPrice: 0 }],
  taxRate: 0, notes: "Tarifs HT · TVA non applicable selon art. 293B du CGI · Acompte 30% à la commande.",
  dueDate: "", userId: "",
});

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 11px", borderRadius: "8px", boxSizing: "border-box",
  border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)",
  color: "white", fontFamily: "var(--font-poppins)", fontSize: "12px", outline: "none",
};
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "10px", fontWeight: 500, textTransform: "uppercase",
  letterSpacing: "0.12em", color: "rgba(255,255,255,0.25)", marginBottom: "5px",
};

function fmt(n: number) { return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €"; }
function fmtDate(iso: string) { return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }); }

// ── Print-optimized invoice ──────────────────────────────────────────────────

function InvoicePrint({ invoice }: { invoice: Invoice }) {
  const subtotal = invoice.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const tax = subtotal * (invoice.taxRate / 100);
  const total = subtotal + tax;

  return (
    <div id="invoice-print" style={{ fontFamily: "var(--font-poppins)", color: "#111", background: "white", padding: "48px", minWidth: "640px" }}>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #invoice-print, #invoice-print * { visibility: visible !important; }
          #invoice-print { position: fixed; top: 0; left: 0; width: 100%; padding: 32px; box-sizing: border-box; }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px" }}>
        <div>
          <p style={{ fontSize: "24px", fontWeight: 800, margin: "0 0 4px", letterSpacing: "-0.02em" }}>Flores</p>
          <p style={{ fontSize: "11px", color: "#555", margin: 0 }}>Allan — Graphiste & Développeur Web</p>
          <p style={{ fontSize: "11px", color: "#555", margin: 0 }}>flores@example.com · flores-fr.com</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 4px", color: invoice.type === "facture" ? "#1a1aff" : "#333" }}>
            {invoice.type === "facture" ? "FACTURE" : "DEVIS"}
          </p>
          <p style={{ fontSize: "13px", fontWeight: 600, margin: 0, color: "#333" }}>{invoice.number}</p>
          <p style={{ fontSize: "11px", color: "#777", margin: "4px 0 0" }}>Émis le {fmtDate(invoice.issuedAt)}</p>
          {invoice.dueDate && <p style={{ fontSize: "11px", color: "#777", margin: 0 }}>Échéance : {fmtDate(invoice.dueDate)}</p>}
        </div>
      </div>

      {/* Separator */}
      <div style={{ height: "1px", background: "#ddd", marginBottom: "32px" }} />

      {/* Client */}
      <div style={{ marginBottom: "32px" }}>
        <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em", color: "#888", margin: "0 0 8px" }}>Facturer à</p>
        <p style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 3px" }}>{invoice.clientName || "—"}</p>
        {invoice.clientEmail && <p style={{ fontSize: "12px", color: "#555", margin: 0 }}>{invoice.clientEmail}</p>}
        {invoice.clientAddress && <p style={{ fontSize: "12px", color: "#555", margin: 0, whiteSpace: "pre-line" }}>{invoice.clientAddress}</p>}
      </div>

      {/* Items table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "24px" }}>
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            {["Description", "Qté", "Prix unit.", "Total"].map(h => (
              <th key={h} style={{ padding: "10px 12px", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#666", fontWeight: 600, textAlign: h === "Description" ? "left" : "right", borderBottom: "1px solid #e5e5e5" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {invoice.items.filter(i => i.description).map((item, idx) => (
            <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "10px 12px", fontSize: "12px" }}>{item.description}</td>
              <td style={{ padding: "10px 12px", fontSize: "12px", textAlign: "right" }}>{item.qty}</td>
              <td style={{ padding: "10px 12px", fontSize: "12px", textAlign: "right" }}>{fmt(item.unitPrice)}</td>
              <td style={{ padding: "10px 12px", fontSize: "12px", textAlign: "right", fontWeight: 600 }}>{fmt(item.qty * item.unitPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "32px" }}>
        <div style={{ width: "220px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
            <span style={{ fontSize: "12px", color: "#666" }}>Sous-total HT</span>
            <span style={{ fontSize: "12px" }}>{fmt(subtotal)}</span>
          </div>
          {invoice.taxRate > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
              <span style={{ fontSize: "12px", color: "#666" }}>TVA ({invoice.taxRate}%)</span>
              <span style={{ fontSize: "12px" }}>{fmt(tax)}</span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "2px solid #111", marginTop: "4px" }}>
            <span style={{ fontSize: "14px", fontWeight: 700 }}>TOTAL</span>
            <span style={{ fontSize: "14px", fontWeight: 700 }}>{fmt(total)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div style={{ padding: "14px 16px", background: "#f8f8f8", borderRadius: "8px", borderLeft: "3px solid #ddd" }}>
          <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#888", margin: "0 0 6px" }}>Notes</p>
          <p style={{ fontSize: "11px", color: "#555", margin: 0, lineHeight: 1.6, whiteSpace: "pre-line" }}>{invoice.notes}</p>
        </div>
      )}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export function AdminFactures() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<ClientUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Invoice | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/admin/invoices").then(r => r.json()).then(data => { setInvoices(data); setLoading(false); });
    fetch("/api/admin/projects").then(r => r.json()).then((data: { user: ClientUser }[]) => {
      const seen = new Set<string>();
      const unique: ClientUser[] = [];
      for (const p of data) { if (!seen.has(p.user.id)) { seen.add(p.user.id); unique.push(p.user); } }
      setClients(unique);
    });
  }, []);

  const filtered = filter === "all" ? invoices : invoices.filter(i => i.type === filter || i.status === filter);

  const openCreate = () => { setForm(emptyForm()); setSelected(null); setCreating(true); setPreview(false); };
  const openEdit = (inv: Invoice) => { setSelected(inv); setCreating(false); setPreview(false); setForm({ type: inv.type, clientName: inv.clientName, clientEmail: inv.clientEmail, clientAddress: inv.clientAddress, items: inv.items, taxRate: inv.taxRate, notes: inv.notes, dueDate: inv.dueDate ? inv.dueDate.slice(0, 10) : "", userId: inv.user?.id ?? "" }); };
  const closePanel = () => { setSelected(null); setCreating(false); setPreview(false); };

  const save = async () => {
    setSaving(true);
    const payload = { ...form, userId: form.userId || null };
    if (creating) {
      const res = await fetch("/api/admin/invoices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const created = await res.json();
      setInvoices(prev => [created, ...prev]);
      setSelected(created);
      setCreating(false);
    } else if (selected) {
      const res = await fetch(`/api/admin/invoices/${selected.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const updated = await res.json();
      setInvoices(prev => prev.map(i => i.id === selected.id ? updated : i));
      setSelected(updated);
    }
    setSaving(false);
  };

  const deleteInvoice = async (id: string) => {
    await fetch(`/api/admin/invoices/${id}`, { method: "DELETE" });
    setInvoices(prev => prev.filter(i => i.id !== id));
    if (selected?.id === id) closePanel();
  };

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/admin/invoices/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    const updated = await res.json();
    setInvoices(prev => prev.map(i => i.id === id ? updated : i));
    if (selected?.id === id) setSelected(updated);
  };

  const setItem = (idx: number, field: keyof LineItem, value: string | number) => {
    setForm(f => ({ ...f, items: f.items.map((it, i) => i === idx ? { ...it, [field]: value } : it) }));
  };
  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { description: "", qty: 1, unitPrice: 0 }] }));
  const removeItem = (idx: number) => setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));

  const subtotal = form.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const tax = subtotal * (form.taxRate / 100);
  const total = subtotal + tax;

  const activeInvoice: Invoice | null = selected ?? (creating ? null : null);

  return (
    <div style={{ padding: "32px 40px", maxWidth: "1100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 800, color: "white", margin: "0 0 4px", letterSpacing: "-0.01em" }}>Devis & Factures</h1>
          <p style={{ fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.3)", margin: 0 }}>Créez et gérez vos documents commerciaux.</p>
        </div>
        <button onClick={openCreate} style={{ display: "flex", alignItems: "center", gap: "7px", padding: "9px 16px", borderRadius: "10px", border: "1px solid rgba(60,100,255,0.3)", background: "rgba(60,100,255,0.12)", fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 500, color: "rgba(100,140,255,0.9)", cursor: "pointer" }}>
          <Plus size={14} /> Nouveau document
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {[["all", "Tous"], ["devis", "Devis"], ["facture", "Factures"], ["draft", "Brouillons"], ["sent", "Envoyés"], ["paid", "Payés"]].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} style={{ padding: "5px 12px", borderRadius: "7px", cursor: "pointer", border: `1px solid ${filter === v ? "rgba(60,100,255,0.35)" : "rgba(255,255,255,0.07)"}`, background: filter === v ? "rgba(60,100,255,0.12)" : "rgba(255,255,255,0.02)", fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: filter === v ? 600 : 400, color: filter === v ? "rgba(100,140,255,0.9)" : "rgba(255,255,255,0.3)" }}>
            {l}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
        {/* List */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", textAlign: "center", padding: "40px 0" }}>Chargement...</p>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <Receipt size={24} color="rgba(255,255,255,0.1)" style={{ marginBottom: "10px" }} />
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.15)", margin: 0 }}>Aucun document.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
              {filtered.map((inv, i) => (
                <motion.div key={inv.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  onClick={() => openEdit(inv)}
                  style={{ display: "flex", alignItems: "center", gap: "12px", padding: "11px 14px", borderRadius: "12px", cursor: "pointer", border: `1px solid ${selected?.id === inv.id ? "rgba(60,100,255,0.3)" : "rgba(255,255,255,0.06)"}`, background: selected?.id === inv.id ? "rgba(60,100,255,0.06)" : "rgba(255,255,255,0.02)" }}
                >
                  <div style={{ width: 34, height: 34, borderRadius: "8px", background: inv.type === "facture" ? "rgba(100,140,255,0.12)" : "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {inv.type === "facture" ? <Receipt size={14} color="rgba(100,140,255,0.7)" /> : <FileText size={14} color="rgba(255,255,255,0.35)" />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <p style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.85)", margin: 0 }}>{inv.number}</p>
                      <span style={{ fontSize: "9px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: STATUS_COLOR[inv.status] ?? "rgba(255,255,255,0.3)", background: (STATUS_COLOR[inv.status] ?? "rgba(255,255,255,0.3)").replace("0.8", "0.08").replace("0.7", "0.08").replace("0.3", "0.05"), padding: "2px 7px", borderRadius: "999px" }}>
                        {STATUS_LABEL[inv.status] ?? inv.status}
                      </span>
                    </div>
                    <p style={{ fontSize: "10px", fontWeight: 300, color: "rgba(255,255,255,0.25)", margin: 0 }}>
                      {inv.clientName || "Sans client"} · {(() => { const s = inv.items.reduce((a, x) => a + x.qty * x.unitPrice, 0); return fmt(s); })()}
                    </p>
                  </div>
                  <button onClick={e => { e.stopPropagation(); if (confirm("Supprimer ?")) deleteInvoice(inv.id); }} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex" }}>
                    <Trash2 size={12} color="rgba(248,113,113,0.35)" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Detail / Form panel */}
        <AnimatePresence>
          {(creating || selected) && (
            <motion.div
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: "400px", flexShrink: 0, border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", background: "rgba(255,255,255,0.02)", position: "sticky", top: "32px", maxHeight: "calc(100dvh - 80px)", overflowY: "auto" }}
            >
              {/* Panel header */}
              <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(6,10,14,0.95)", backdropFilter: "blur(12px)", zIndex: 2 }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <p style={{ fontSize: "12px", fontWeight: 700, color: "white", margin: 0 }}>
                    {creating ? "Nouveau document" : selected?.number}
                  </p>
                  {!creating && selected && (
                    <span style={{ fontSize: "9px", padding: "2px 7px", borderRadius: "999px", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      {STATUS_LABEL[selected.status]}
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  {!creating && selected && (
                    <button onClick={() => setPreview(!preview)} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 10px", borderRadius: "7px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", fontFamily: "var(--font-poppins)", fontSize: "10px", color: "rgba(255,255,255,0.45)", cursor: "pointer" }}>
                      <Eye size={11} /> {preview ? "Éditer" : "Aperçu"}
                    </button>
                  )}
                  {!creating && selected && !preview && (
                    <button onClick={() => window.print()} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 10px", borderRadius: "7px", border: "1px solid rgba(100,140,255,0.25)", background: "rgba(60,100,255,0.1)", fontFamily: "var(--font-poppins)", fontSize: "10px", color: "rgba(100,140,255,0.8)", cursor: "pointer" }}>
                      <Printer size={11} /> Imprimer
                    </button>
                  )}
                  <button onClick={closePanel} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", display: "flex" }}>
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Preview mode */}
              {!creating && selected && preview ? (
                <div style={{ padding: "16px", transform: "scale(0.75)", transformOrigin: "top left", width: "133%" }}>
                  <InvoicePrint invoice={{ ...selected, items: form.items }} />
                </div>
              ) : (
                <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: "14px" }}>
                  {/* Type + Status */}
                  <div style={{ display: "flex", gap: "10px" }}>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>Type</label>
                      <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={{ ...inputStyle, appearance: "none" }}>
                        <option value="devis">Devis</option>
                        <option value="facture">Facture</option>
                      </select>
                    </div>
                    {!creating && selected && (
                      <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Statut</label>
                        <select value={selected.status} onChange={e => updateStatus(selected.id, e.target.value)} style={{ ...inputStyle, appearance: "none" }}>
                          <option value="draft">Brouillon</option>
                          <option value="sent">Envoyé</option>
                          <option value="paid">Payé</option>
                          <option value="cancelled">Annulé</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Link to client */}
                  <div>
                    <label style={labelStyle}>Client (compte)</label>
                    <select value={form.userId} onChange={e => {
                      const u = clients.find(c => c.id === e.target.value);
                      setForm(f => ({ ...f, userId: e.target.value, clientName: u?.name ?? f.clientName, clientEmail: u?.email ?? f.clientEmail }));
                    }} style={{ ...inputStyle, appearance: "none" }}>
                      <option value="">— Sélectionner (optionnel)</option>
                      {clients.map(c => <option key={c.id} value={c.id}>{c.name ?? c.email}</option>)}
                    </select>
                  </div>

                  {/* Client info */}
                  <div>
                    <label style={labelStyle}>Nom du client</label>
                    <input value={form.clientName} onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))} placeholder="Prénom Nom / Société" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input value={form.clientEmail} onChange={e => setForm(f => ({ ...f, clientEmail: e.target.value }))} placeholder="client@email.com" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Adresse (optionnel)</label>
                    <textarea value={form.clientAddress} onChange={e => setForm(f => ({ ...f, clientAddress: e.target.value }))} rows={2} placeholder="Rue, Ville, CP…" style={{ ...inputStyle, resize: "vertical" }} />
                  </div>

                  {/* Dates */}
                  <div>
                    <label style={labelStyle}>Date d'échéance</label>
                    <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} style={inputStyle} />
                  </div>

                  {/* Line items */}
                  <div>
                    <label style={labelStyle}>Prestations</label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {form.items.map((item, idx) => (
                        <div key={idx} style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          <input value={item.description} onChange={e => setItem(idx, "description", e.target.value)} placeholder="Description" style={{ ...inputStyle, flex: 2 }} />
                          <input type="number" value={item.qty} onChange={e => setItem(idx, "qty", parseFloat(e.target.value) || 0)} min={0} style={{ ...inputStyle, width: "52px", flex: "none" }} title="Quantité" />
                          <input type="number" value={item.unitPrice} onChange={e => setItem(idx, "unitPrice", parseFloat(e.target.value) || 0)} min={0} step={0.01} style={{ ...inputStyle, width: "76px", flex: "none" }} title="Prix unitaire (€)" />
                          <button onClick={() => removeItem(idx)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(248,113,113,0.4)", display: "flex", flexShrink: 0 }}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                      <button onClick={addItem} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 10px", borderRadius: "7px", border: "1px dashed rgba(255,255,255,0.1)", background: "transparent", fontFamily: "var(--font-poppins)", fontSize: "11px", color: "rgba(255,255,255,0.3)", cursor: "pointer" }}>
                        <Plus size={11} /> Ajouter une ligne
                      </button>
                    </div>
                  </div>

                  {/* Tax + Totals */}
                  <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>TVA (%)</label>
                      <input type="number" value={form.taxRate} onChange={e => setForm(f => ({ ...f, taxRate: parseFloat(e.target.value) || 0 }))} min={0} max={100} style={inputStyle} />
                    </div>
                    <div style={{ flex: 2, padding: "10px 12px", borderRadius: "9px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "rgba(255,255,255,0.35)", marginBottom: "4px" }}>
                        <span>HT</span><span>{fmt(subtotal)}</span>
                      </div>
                      {form.taxRate > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "rgba(255,255,255,0.35)", marginBottom: "4px" }}>
                          <span>TVA</span><span>{fmt(tax)}</span>
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 700, color: "white" }}>
                        <span>Total</span><span>{fmt(total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label style={labelStyle}>Mentions / Notes</label>
                    <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }} />
                  </div>

                  {/* Save */}
                  <button onClick={save} disabled={saving} style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid rgba(60,100,255,0.3)", background: "rgba(60,100,255,0.2)", fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 600, color: "rgba(140,170,255,0.9)", cursor: "pointer", opacity: saving ? 0.5 : 1 }}>
                    {saving ? "Enregistrement…" : creating ? "Créer le document" : "Sauvegarder"}
                  </button>
                </div>
              )}

              {/* Hidden print content */}
              {!creating && selected && (
                <div style={{ display: "none" }}>
                  <InvoicePrint invoice={{ ...selected, items: form.items }} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
