export type ServiceItem = {
  name: string;
  description: string;
  price: string;
  badge?: string;
  soon?: boolean;
};

export type SiteContentMap = {
  hero: {
    badge: string;
    subtitle: string;
    description: string;
    cta1: string;
    cta2: string;
  };
  about: {
    badge: string;
    heading: string;
    imageSrc: string;
    points: { num: string; title: string; text: string }[];
    stats: { val: string; label: string }[];
  };
  features: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { title: string; description: string }[];
  };
  tarifs: {
    footerNote: string;
    devTitle: string;
    visualTitle: string;
    devServices: ServiceItem[];
    visualServices: ServiceItem[];
  };
  footer: {
    brandName: string;
    brandDesc: string;
    discordUrl: string;
    instagramUrl: string;
    behanceUrl: string;
    legalNote: string;
  };
};

export const SITE_DEFAULTS: SiteContentMap = {
  hero: {
    badge: "Disponible · Devis gratuit",
    subtitle: "Graphiste & Dev Web · France",
    description: "Identité visuelle, direction artistique & développement web — des créations qui vous ressemblent vraiment.",
    cta1: "Démarrer un projet",
    cta2: "Voir les projets",
  },
  about: {
    badge: "Disponible · Devis gratuit",
    heading: "Créer, c'est ce que je fais.",
    imageSrc: "/images/about.jpg",
    points: [
      { num: "01", title: "Qui suis-je", text: "Autodidacte depuis 5 ans, j'ai tout appris seul — du logo au site web en passant par la cover musicale. Graphiste freelance & membre de V.T.O Studio, je construis des identités visuelles qui ont du caractère." },
      { num: "02", title: "Ce que je propose", text: "Identité visuelle, direction artistique, développement web, cover art, suivi créateurs & artistes. Un seul interlocuteur, six expertises — du concept à la livraison." },
      { num: "03", title: "Pourquoi bosser avec moi", text: "Parce que je m'implique vraiment. Pas de template, pas de copier-coller. Chaque projet est pensé pour vous ressembler et marquer les esprits — avec une réponse sous 24h et un devis gratuit." },
    ],
    stats: [
      { val: "30+", label: "Projets livrés" },
      { val: "5+", label: "Ans d'exp." },
    ],
  },
  features: {
    eyebrow: "Ce que je propose",
    title: "Identité. Web. Création.",
    subtitle: "Six expertises, un seul interlocuteur — du concept à la livraison.",
    items: [
      { title: "Identité Visuelle", description: "Logo, charte graphique, papeterie et assets de marque — tout ce qui forge une image reconnaissable et durable." },
      { title: "Direction Artistique", description: "Concept, univers visuel, cohérence globale — je définis et pilote l'image créative de bout en bout." },
      { title: "Développement Web", description: "Sites vitrines sur mesure, responsive, SEO soigné. Zéro template — chaque ligne de code est pensée pour vous." },
      { title: "Cover Art", description: "Pochettes single, EP, album — des visuels musicaux percutants calibrés pour toutes les plateformes de streaming." },
      { title: "Print & Supports", description: "Affiches, flyers, cartes de visite, packaging — des supports imprimés qui marquent les esprits." },
      { title: "Suivi Créateurs", description: "Thumbnails, overlays, packs stream, assets réseaux — un accompagnement long terme pour les créateurs de contenu." },
    ],
  },
  tarifs: {
    footerNote: "Tarifs HT · TVA non applicable selon art. 293B du CGI · Acompte 30% à la commande",
    devTitle: "Développement Web",
    visualTitle: "Création Visuelle",
    devServices: [
      { name: "Site vitrine", description: "Présentation professionnelle de votre activité — responsive, SEO soigné, zéro template.", price: "À partir de 500€" },
      { name: "Portfolio artiste", description: "Vitrine dédiée à votre univers créatif, animations soignées et identité forte.", price: "À partir de 350€" },
      { name: "Portfolio commercial", description: "Site catalogue, galerie produits ou landing page optimisée conversion.", price: "À venir", soon: true },
      { name: "Application web", description: "Outil sur mesure, tableau de bord, SaaS — architecture pensée pour durer.", price: "Sur devis" },
    ],
    visualServices: [
      { name: "Identité visuelle", description: "Logo, charte graphique, palette, typographies — tout ce qui forge une marque reconnaissable.", price: "À partir de 250€" },
      { name: "Affiches & flyers", description: "Supports print percutants pour vos événements, concerts ou campagnes.", price: "À partir de 50€" },
      { name: "Pour les artistes", description: "Cover single/EP/album, tracklist visuelle, CV de presse — calibrés pour toutes les plateformes.", price: "À partir de 80€" },
      { name: "Accompagnement streamers", description: "Overlays, alerts, panels, thumbnails, logo — un pack complet pour ne plus vous soucier de l'image.", price: "À partir de 99€/mois", badge: "Nouveau" },
    ],
  },
  footer: {
    brandName: "Flores",
    brandDesc: "Graphiste freelance & développeur web. Identité visuelle, direction artistique, sites sur mesure.",
    discordUrl: "https://discord.com",
    instagramUrl: "https://instagram.com",
    behanceUrl: "https://behance.net",
    legalNote: "TVA non applicable · Art. 293B du CGI",
  },
};

export function mergeSiteContent<K extends keyof SiteContentMap>(
  section: K,
  data: unknown,
): SiteContentMap[K] {
  if (!data || typeof data !== "object") return SITE_DEFAULTS[section];
  return { ...SITE_DEFAULTS[section], ...(data as Partial<SiteContentMap[K]>) };
}
