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
    graphismeImage: string;
    webImage: string;
  };
  about: {
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
  portfolioTeaser: {
    eyebrow: string;
    title: string;
    ctaLabel: string;
  };
  tarifsTeaser: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaLabel: string;
    categories: { title: string; desc: string; tags: string[]; from: string }[];
  };
  espaceTeaser: {
    badge: string;
    title: string;
    paragraph1: string;
    paragraph2: string;
    ctaLabel: string;
    discordNote: string;
    pilliers: { title: string; desc: string }[];
  };
  aboutPage: {
    heroTitle: string;
    heroSubtitle: string;
    parcoursHeading: string;
    parcours: { date: string; title: string; text: string }[];
    vtoDesc1: string;
    vtoDesc2: string;
    vtoLinks: { label: string; desc: string; href: string }[];
    vtoServices: { label: string; desc: string }[];
    process: { num: string; emoji: string; title: string; text: string }[];
    ctaTitle: string;
    ctaDesc: string;
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
    description: "Identité visuelle, direction artistique & développement web. Des créations qui vous ressemblent vraiment.",
    cta1: "Démarrer un projet",
    cta2: "Voir les projets",
    graphismeImage: "/images/about.jpg",
    webImage: "",
  },
  about: {
    heading: "Votre image, pas un template.",
    imageSrc: "/images/about.jpg",
    points: [
      { num: "01", title: "Le constat", text: "Trop de sites et de visuels se ressemblent. Je construis des identités qui ont du caractère — pensées pour vous, jamais copiées d'un modèle." },
      { num: "02", title: "Ce que vous obtenez", text: "Un seul interlocuteur pour tout : identité visuelle, direction artistique, développement web, cover art. Du concept à la livraison, sans jongler entre prestataires." },
      { num: "03", title: "Comment ça se passe", text: "Devis gratuit sous 24h, échange direct, zéro jargon. Autodidacte depuis 5 ans et membre de V.T.O Studio, je m'implique comme si le projet était le mien." },
    ],
    stats: [
      { val: "30+", label: "Projets livrés" },
      { val: "5+", label: "Ans d'exp." },
    ],
  },
  features: {
    eyebrow: "Ce que je propose",
    title: "Identité. Web. Création.",
    subtitle: "Six expertises, un seul interlocuteur. Du concept à la livraison.",
    items: [
      { title: "Identité Visuelle", description: "Logo, charte graphique, papeterie et assets de marque. Tout ce qui forge une image reconnaissable et durable." },
      { title: "Direction Artistique", description: "Concept, univers visuel, cohérence globale. Je définis et pilote l'image créative de bout en bout." },
      { title: "Développement Web", description: "Sites vitrines sur mesure, responsive, SEO soigné. Zéro template, chaque ligne de code est pensée pour vous." },
      { title: "Cover Art", description: "Pochettes single, EP, album. Des visuels musicaux percutants calibrés pour toutes les plateformes de streaming." },
      { title: "Print & Supports", description: "Affiches, flyers, cartes de visite, packaging. Des supports imprimés qui marquent les esprits." },
      { title: "Suivi Créateurs", description: "Thumbnails, overlays, packs stream, assets réseaux. Un accompagnement long terme pour les créateurs de contenu." },
    ],
  },
  portfolioTeaser: {
    eyebrow: "Portfolio",
    title: "Quelques réalisations.",
    ctaLabel: "Voir tout le portfolio",
  },
  tarifsTeaser: {
    eyebrow: "Tarifs",
    title: "Ce que je propose.",
    subtitle: "Devis gratuit sous 24h, sans engagement. Chaque projet est unique, les tarifs sont là pour vous orienter.",
    ctaLabel: "Voir les tarifs détaillés",
    categories: [
      {
        title: "Identité visuelle",
        desc: "Logo, charte graphique, direction artistique. Tout ce qui construit une image de marque reconnaissable et durable.",
        tags: ["Logo", "Charte", "DA", "Print"],
        from: "200€",
      },
      {
        title: "Développement web",
        desc: "Sites vitrines, portfolios, applications sur mesure. Du design à la mise en ligne, zéro template.",
        tags: ["Site vitrine", "Portfolio", "Next.js", "Sur mesure"],
        from: "500€",
      },
      {
        title: "Créations pour artistes",
        desc: "Covers, visuels streaming, packs stream, identité d'artiste. Pour les créateurs qui veulent une image à leur niveau.",
        tags: ["Cover art", "Streaming", "Pack stream", "Presse"],
        from: "80€",
      },
    ],
  },
  espaceTeaser: {
    badge: "Espace client · Inclus",
    title: "Votre projet.\nVotre espace.",
    paragraph1: "Tout commence depuis l'espace : un formulaire adapté pour poser les bases du projet, ou la réservation d'un premier RDV. Pas d'email générique, pas d'aller-retour inutile.",
    paragraph2: "Une fois le projet lancé : avancement en temps réel, messagerie dédiée, devis et factures en ligne. Tout simplement la meilleure façon de bosser ensemble.",
    ctaLabel: "Créer un compte · Se connecter",
    discordNote: "Connexion Discord disponible",
    pilliers: [
      { title: "Ça commence ici", desc: "Formulaire de brief structuré ou réservation d'un premier RDV, directement depuis l'espace. Pas d'email, pas de contact générique. Les bases du projet posées proprement, dès le départ." },
      { title: "Suivi en continu", desc: "Avancement visible à chaque étape, kanban partagé, messagerie dédiée au projet. Votre client sait exactement où on en est, sans avoir besoin de demander." },
      { title: "Tout centralisé", desc: "Devis signés en ligne, factures téléchargeables, fichiers livrés archivés. Un seul endroit pour tout retrouver, du brief à la livraison finale." },
    ],
  },
  aboutPage: {
    heroTitle: "Graphiste & Dev Web.",
    heroSubtitle: "Pas d'école, pas de diplôme.\nUne curiosité obsessionnelle et cinq ans\nà apprendre en faisant.",
    parcoursHeading: "Autodidacte\n& guidé par\nla passion.",
    parcours: [
      { date: "2019",      title: "Les premières heures",    text: "Tout a commencé avec Photoshop et des covers Soundcloud. Pas d'école, pas de formation. Juste une curiosité obsessionnelle et des heures à déconstruire ce qui me semblait beau pour comprendre pourquoi ça fonctionnait." },
      { date: "2020 – 21", title: "Le vecteur, l'identité", text: "Illustrator, la charte graphique, les logos. J'ai commencé à prendre des commandes pour des artistes, des streamers, des petites structures. Chaque projet m'apprenait quelque chose que je n'avais pas cherché." },
      { date: "2022 – 23", title: "Le saut vers le code",   text: "Pour aller au bout d'une vision, il fallait aussi savoir la construire. HTML, CSS, puis React, puis Next.js. Le design et le développement sont devenus les deux faces d'un même geste." },
      { date: "2024 →",    title: "Ce projet",              text: "Ce portfolio, c'est la décision de structurer ce que je fais et d'aller chercher les projets qui m'intéressent vraiment : identités visuelles, sites vitrine, expériences interactives. Freelance, pleinement." },
    ],
    vtoDesc1: "V.T.O Studio est un collectif créatif indépendant. Graphistes, développeurs, motion designers qui partagent une même exigence : faire des choses qui ont de la gueule et qui durent.",
    vtoDesc2: "J'en fais partie comme graphiste et développeur freelance associé. Ce n'est pas une agence, c'est un réseau de gens sérieux qui travaillent bien et qui se recommandent.",
    vtoLinks: [
      { label: "Professionnels", desc: "Site dédié aux entreprises & structures", href: "https://vto-studio.fr" },
      { label: "Artistes",       desc: "Site dédié aux créateurs & musiciens",    href: "https://vto-studio.fr/artistes" },
      { label: "Discord",        desc: "Rejoindre la communauté VTO",             href: "https://discord.gg/vto" },
    ],
    vtoServices: [
      { label: "Direction artistique", desc: "Identités visuelles, chartes graphiques, systèmes de design." },
      { label: "Clips & vidéo",        desc: "Réalisation de clips, teasers, court-métrages pour les artistes." },
      { label: "Motion design",        desc: "Animations, génériques, effets visuels. After Effects sur mesure." },
      { label: "Expériences web",      desc: "Sites vitrine, portfolios, apps. Développement sur mesure." },
      { label: "Accompagnement",       desc: "Conseils, audits créatifs, refonte d'image." },
    ],
    process: [
      { num: "01", emoji: "🎙️", title: "On se parle",             text: "Tout commence par un échange, pas un formulaire générique. Je veux comprendre qui vous êtes, ce que vous faites, pourquoi ce projet maintenant. Le brief se construit ensemble." },
      { num: "02", emoji: "🧠", title: "Je réfléchis, je propose", text: "Avant de toucher à quoi que ce soit, je pose une direction. Moodboard, références, architecture. Vous validez la vision avant que je commence. Aucune surprise en cours de route." },
      { num: "03", emoji: "⚡", title: "On construit ensemble",    text: "Je livre par étapes, pas en une fois. Chaque rendu est visible depuis votre espace client. Vous commentez, je corrige vite. C'est collaboratif, pas une boîte noire." },
      { num: "04", emoji: "📦", title: "Livré, propre, documenté", text: "Fichiers sources organisés, code déployé ou exporté, explication de ce qui a été fait. Vous repartez avec quelque chose qui vous appartient vraiment. Je reste joignable après." },
    ],
    ctaTitle: "Travaillons ensemble.",
    ctaDesc: "Devis gratuit sous 24h, suivi en direct depuis votre espace client.",
  },
  tarifs: {
    footerNote: "Tarifs HT · TVA non applicable selon art. 293B du CGI · Acompte 30% à la commande",
    devTitle: "Développement Web",
    visualTitle: "Création Visuelle",
    devServices: [
      { name: "Site vitrine", description: "Présentation professionnelle de votre activité. Responsive, SEO soigné, zéro template.", price: "À partir de 500€" },
      { name: "Portfolio artiste", description: "Vitrine dédiée à votre univers créatif, animations soignées et identité forte.", price: "À partir de 350€" },
      { name: "Portfolio commercial", description: "Site catalogue, galerie produits ou landing page optimisée conversion.", price: "À venir", soon: true },
      { name: "Application web", description: "Outil sur mesure, tableau de bord, SaaS. Architecture pensée pour durer.", price: "Sur devis" },
    ],
    visualServices: [
      { name: "Identité visuelle", description: "Logo, charte graphique, palette, typographies. Tout ce qui forge une marque reconnaissable.", price: "À partir de 250€" },
      { name: "Affiches & flyers", description: "Supports print percutants pour vos événements, concerts ou campagnes.", price: "À partir de 50€" },
      { name: "Pour les artistes", description: "Cover single/EP/album, tracklist visuelle, CV de presse. Calibrés pour toutes les plateformes.", price: "À partir de 80€" },
      { name: "Accompagnement streamers", description: "Overlays, alerts, panels, thumbnails, logo. Un pack complet pour ne plus vous soucier de l'image.", price: "À partir de 99€/mois", badge: "Nouveau" },
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
