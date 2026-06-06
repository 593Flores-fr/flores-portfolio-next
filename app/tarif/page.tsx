"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

type Service = { name: string; description: string; price: string; badge?: string; soon?: boolean };

const devServices: Service[] = [
  { name: "Site vitrine", description: "Présentation professionnelle de votre activité — responsive, SEO soigné, zéro template. Design sur mesure, domaine + hébergement inclus si besoin.", price: "À partir de 500€" },
  { name: "Portfolio artiste", description: "Vitrine dédiée à votre univers créatif, animations soignées et identité forte. Parfait pour les musiciens, photographes, illustrateurs.", price: "À partir de 350€" },
  { name: "Landing page", description: "Page unique optimisée conversion pour un produit, un événement ou une campagne. Design impactant, chargement ultra-rapide.", price: "À partir de 250€" },
  { name: "Application web", description: "Outil sur mesure, tableau de bord, espace client, SaaS — architecture pensée pour durer. Stack moderne : Next.js, TypeScript, PostgreSQL.", price: "Sur devis" },
  { name: "Portfolio commercial", description: "Site catalogue, galerie produits ou landing page optimisée conversion.", price: "Bientôt", soon: true },
];

const visualServices: Service[] = [
  { name: "Identité visuelle complète", description: "Logo (vectoriel, toutes déclinaisons), charte graphique, palette, typographies, mockups — tout ce qui forge une marque reconnaissable.", price: "À partir de 250€" },
  { name: "Logo seul", description: "Création d'un logotype professionnel livré en formats SVG, PNG, PDF. 2 propositions + révisions incluses.", price: "À partir de 120€" },
  { name: "Affiches & flyers", description: "Supports print percutants pour vos événements, concerts ou campagnes. Format au choix, impression-ready.", price: "À partir de 50€" },
  { name: "Covers musicales", description: "Cover single/EP/album, tracklist visuelle, CV de presse — calibrés pour toutes les plateformes (Spotify, Apple Music, Deezer…).", price: "À partir de 80€" },
  { name: "Accompagnement streamers", description: "Overlays, alerts, panels, thumbnails, logo — un pack complet pour ne plus vous soucier de l'image. Mis à jour selon vos besoins.", price: "À partir de 99€/mois", badge: "Nouveau" },
];

const faq = [
  { q: "Comment se passe le paiement ?", a: "Un acompte de 30% est demandé à la commande. Le solde est réglé à la livraison. Je travaille par virement bancaire ou PayPal." },
  { q: "Combien de temps pour livrer ?", a: "Cela dépend du projet. Un logo prend 5-7 jours, un site vitrine 2-4 semaines. Je vous donne un délai précis lors du devis." },
  { q: "Puis-je modifier le résultat ?", a: "Oui. Chaque prestation inclut 2 à 3 allers-retours de révisions. Les modifications supplémentaires sont facturées au taux horaire (40€/h)." },
  { q: "Vous travaillez avec des auto-entrepreneurs ?", a: "Bien sûr ! Mes tarifs sont adaptés aux indépendants, artistes et petites structures. Pas de TVA facturable (art. 293B du CGI)." },
  { q: "Les fichiers sources sont-ils inclus ?", a: "Pour la création visuelle : oui, les fichiers sources (AI, PSD, Figma…) sont livrés. Pour le dev web : le code source est disponible sur GitHub." },
  { q: "Vous proposez de la maintenance ?", a: "Oui, pour les projets web. Un forfait de maintenance mensuel est disponible selon vos besoins (mises à jour, contenus, corrections)." },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-poppins)", textAlign: "left" }}>
        <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{q}</span>
        {open ? <ChevronUp size={15} color="rgba(255,255,255,0.3)" /> : <ChevronDown size={15} color="rgba(255,255,255,0.3)" />}
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{ overflow: "hidden" }}
      >
        <p style={{ fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 300, color: "rgba(255,255,255,0.42)", lineHeight: 1.75, paddingBottom: "20px", margin: 0 }}>{a}</p>
      </motion.div>
    </div>
  );
}

export default function TarifPage() {
  return (
    <div style={{ background: "#060a0e", minHeight: "100dvh", color: "white" }}>
      <header style={{ padding: "24px 6vw", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", fontFamily: "var(--font-poppins)", fontSize: "12px", color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>
          <ArrowLeft size={14} /> Accueil
        </Link>
        <span style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.18)" }}>Tarifs</span>
      </header>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "80px 6vw 160px" }}>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} style={{ marginBottom: "80px" }}>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.28em", color: "rgba(255,255,255,0.22)", marginBottom: "16px" }}>Tarifs</p>
          <h1 style={{ fontFamily: "var(--font-poppins)", fontSize: "clamp(2.8rem,5vw,5rem)", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.025em", margin: "0 0 24px" }}>Aperçu des tarifs.</h1>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "15px", fontWeight: 300, color: "rgba(255,255,255,0.38)", maxWidth: "480px", lineHeight: 1.75, margin: 0 }}>
            Chaque projet est unique — ces fourchettes sont là pour vous orienter.<br />
            Devis gratuit sous 24h, sans engagement.
          </p>
        </motion.div>

        {/* Service panels */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "100px" }}>
          {[
            { num: "01", title: "Développement Web", services: devServices },
            { num: "02", title: "Création Visuelle", services: visualServices },
          ].map(({ num, title, services }, pi) => (
            <motion.div key={num} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: pi * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ padding: "36px 32px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.015)", position: "relative", overflow: "hidden" }}
            >
              <div style={{ position: "absolute", top: 0, right: 0, width: "200px", height: "200px", background: "radial-gradient(circle at top right, rgba(60,100,255,0.06), transparent 70%)", pointerEvents: "none" }} />
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "10px", fontWeight: 500, color: "rgba(255,255,255,0.18)", textTransform: "uppercase", letterSpacing: "0.25em", marginBottom: "10px" }}>{num}</p>
              <h2 style={{ fontFamily: "var(--font-poppins)", fontSize: "clamp(1.3rem,2.2vw,1.7rem)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1, margin: "0 0 28px" }}>{title}</h2>
              <div>
                {services.map((s, i) => (
                  <div key={s.name} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "20px", padding: "18px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", opacity: s.soon ? 0.45 : 1 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                        <span style={{ fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{s.name}</span>
                        {s.badge && <span style={{ fontSize: "9px", fontFamily: "var(--font-poppins)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(74,222,128,0.9)", border: "1px solid rgba(74,222,128,0.3)", background: "rgba(74,222,128,0.08)", padding: "2px 7px", borderRadius: "999px" }}>{s.badge}</span>}
                        {s.soon && <span style={{ fontSize: "9px", fontFamily: "var(--font-poppins)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.25)", border: "1px solid rgba(255,255,255,0.1)", padding: "2px 7px", borderRadius: "999px" }}>Bientôt</span>}
                      </div>
                      <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 300, color: "rgba(255,255,255,0.28)", lineHeight: 1.65, margin: 0 }}>{s.description}</p>
                    </div>
                    <span style={{ fontFamily: "var(--font-poppins)", fontSize: "12px", fontWeight: 600, color: s.price.startsWith("À partir") ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)", whiteSpace: "nowrap", flexShrink: 0 }}>{s.price}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", fontWeight: 300, color: "rgba(255,255,255,0.15)", textAlign: "center", marginBottom: "100px", letterSpacing: "0.04em" }}>
          Tarifs HT · TVA non applicable selon art. 293B du CGI · Acompte 30% à la commande
        </p>

        {/* FAQ */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} style={{ marginBottom: "100px" }}>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.28em", color: "rgba(255,255,255,0.22)", marginBottom: "16px" }}>FAQ</p>
          <h2 style={{ fontFamily: "var(--font-poppins)", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 48px" }}>Questions fréquentes.</h2>
          <div style={{ maxWidth: "720px" }}>
            {faq.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          style={{ padding: "60px", borderRadius: "20px", border: "1px solid rgba(60,100,255,0.2)", background: "radial-gradient(ellipse at 60% 0%, rgba(60,100,255,0.08) 0%, transparent 70%)", textAlign: "center" }}
        >
          <h2 style={{ fontFamily: "var(--font-poppins)", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 14px" }}>
            Un projet en tête ?
          </h2>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: "14px", fontWeight: 300, color: "rgba(255,255,255,0.35)", margin: "0 auto 32px", maxWidth: "400px", lineHeight: 1.7 }}>
            Devis gratuit sous 24h. Décrivez votre projet depuis votre espace client et je vous reviens rapidement.
          </p>
          <Link href="/espace" style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "14px 28px", borderRadius: "12px", border: "1px solid rgba(60,100,255,0.35)", background: "rgba(60,100,255,0.6)", fontFamily: "var(--font-poppins)", fontSize: "13px", fontWeight: 600, color: "white", textDecoration: "none" }}>
            Demander un devis →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
