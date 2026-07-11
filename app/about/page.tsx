import type { Metadata } from "next";
import { AboutPageContent } from "./about-content";
import { mergeSiteContent } from "@/lib/site-content";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "À propos",
  description: "Allan — graphiste freelance autodidacte depuis 5 ans, membre de V.T.O Studio. Identité visuelle, direction artistique & développement web, des créations qui ont un caractère propre.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "À propos — Flores",
    description: "Autodidacte depuis 5 ans, membre de V.T.O Studio. Identité visuelle, DA & dev web.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "À propos — Flores",
    description: "Autodidacte depuis 5 ans, membre de V.T.O Studio. Identité visuelle, DA & dev web.",
    images: ["/opengraph-image"],
  },
};

export default async function AboutPage() {
  const row = await prisma.siteContent.findUnique({ where: { section: "aboutPage" } });
  const content = mergeSiteContent("aboutPage", row?.data);
  return <AboutPageContent content={content} />;
}
