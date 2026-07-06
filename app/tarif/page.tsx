import type { Metadata } from "next";
import { TarifPageContent } from "./tarif-content";
import prisma from "@/lib/prisma";
import { SITE_DEFAULTS } from "@/lib/site-content";
import type { SiteContentMap } from "@/lib/site-content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Tarifs",
  description: "Tarifs des prestations de Flores : identité visuelle, logo, site vitrine, covers musicales, accompagnement streamers. Devis gratuit sous 24h, sans engagement.",
  alternates: { canonical: "/tarif" },
  openGraph: {
    title: "Tarifs — Flores",
    description: "Identité visuelle, site vitrine, covers & plus. Devis gratuit sous 24h.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tarifs — Flores",
    description: "Identité visuelle, site vitrine, covers & plus. Devis gratuit sous 24h.",
    images: ["/opengraph-image"],
  },
};

async function getTarifsContent(): Promise<SiteContentMap["tarifs"]> {
  try {
    const row = await prisma.siteContent.findUnique({ where: { section: "tarifs" } });
    if (!row?.data) return SITE_DEFAULTS.tarifs;
    return { ...SITE_DEFAULTS.tarifs, ...(row.data as object) };
  } catch {
    return SITE_DEFAULTS.tarifs;
  }
}

export default async function TarifPage() {
  const content = await getTarifsContent();
  return <TarifPageContent content={content} />;
}
