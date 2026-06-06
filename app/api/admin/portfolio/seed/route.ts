import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

function isAdmin(email?: string | null) { return email === process.env.ADMIN_EMAIL; }

const DEFAULT_PROJECTS = [
  {
    slug: "yevta", title: "Yevta", order: 0,
    tag: "Direction artistique · 2024", category: "Visuel", year: "2024",
    description: "Identité visuelle complète pour un artiste musical émergent — covers, charte graphique et assets de communication.",
    imageSrc: "/images/01hero.jpg",
    tools: ["Photoshop", "Illustrator"],
  },
  {
    slug: "vzx-build", title: "VZX Build", order: 1,
    tag: "Branding & Dev Web · 2024", category: "Web", year: "2024",
    description: "Branding moderne et site vitrine pour un assembleur PC. Identité forte, palette sombre et typographie percutante.",
    imageSrc: "/images/jjj.jpg",
    tools: ["Figma", "Next.js", "TypeScript"],
  },
  {
    slug: "vto-studio", title: "V.T.O Studio", order: 2,
    tag: "Identité visuelle · 2024", category: "Visuel", year: "2024",
    description: "Direction artistique pour un collectif créatif. Logo, supports de communication et présence digitale cohérente.",
    imageSrc: "/images/vto.jpg",
    tools: ["Illustrator", "Photoshop"],
  },
  {
    slug: "monica-dlr", title: "Monica DLR", order: 3,
    tag: "Charte graphique · 2024", category: "Visuel", year: "2024",
    description: "Identité visuelle pour une créatrice & couturière. Logo, univers de marque et visuels réseaux sociaux.",
    imageSrc: "/images/Mdlr.png",
    tools: ["Illustrator", "Photoshop"],
  },
  {
    slug: "213-huma", title: "213 HUMA", order: 4,
    tag: "Projet associatif · 2024", category: "Visuel", year: "2024",
    description: "Direction artistique pour un projet associatif humanitaire. Identité visuelle engagée et supports imprimés.",
    imageSrc: "/images/projects/huma.png",
    tools: ["Illustrator", "InDesign"],
  },
  {
    slug: "muzey", title: "Muzey", order: 5,
    tag: "Charte graphique · 2024", category: "Visuel", year: "2024",
    description: "Identité visuelle complète pour un projet musical. Logotype, palette chromatique et assets digitaux.",
    imageSrc: "/images/pdv1.png",
    tools: ["Illustrator", "Photoshop"],
  },
  {
    slug: "cover-art", title: "Cover Art", order: 6,
    tag: "Covers musicales · 2021–2024", category: "Cover", year: "2021–2024",
    description: "Sélection de covers réalisées pour différents artistes. Illustrations sur mesure pour streaming et éditions physiques.",
    imageSrc: "/images/wuk.png",
    tools: ["Photoshop", "Illustrator"],
  },
];

export async function POST() {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const results = [];
  for (const p of DEFAULT_PROJECTS) {
    const exists = await prisma.portfolioProject.findUnique({ where: { slug: p.slug } });
    if (!exists) {
      const created = await prisma.portfolioProject.create({
        data: {
          ...p,
          tag: p.tag, description: p.description, imageSrc: p.imageSrc,
          category: p.category, year: p.year, client: "",
          fullDescription: "", challenge: "",
          images: [], tools: p.tools,
          accentColor: "", published: true,
        },
      });
      results.push(created);
    }
  }
  return NextResponse.json({ seeded: results.length, skipped: DEFAULT_PROJECTS.length - results.length });
}
