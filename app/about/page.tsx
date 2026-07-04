import type { Metadata } from "next";
import { AboutPageContent } from "./about-content";
import { mergeSiteContent } from "@/lib/site-content";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "À propos",
  description: "Allan — graphiste freelance autodidacte depuis 5 ans, membre de V.T.O Studio. Identité visuelle, direction artistique & développement web, des créations qui ont un caractère propre.",
  openGraph: {
    title: "À propos — Flores",
    description: "Autodidacte depuis 5 ans, membre de V.T.O Studio. Identité visuelle, DA & dev web.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

async function getReviews() {
  try {
    return await prisma.review.findMany({
      where: { status: "approved", content: { not: null } },
      select: {
        id: true, content: true, rating: true,
        user: { select: { name: true, image: true } },
        project: { select: { title: true } },
      },
      orderBy: { submittedAt: "desc" },
    });
  } catch {
    return [];
  }
}

export default async function AboutPage() {
  const [row, reviews] = await Promise.all([
    prisma.siteContent.findUnique({ where: { section: "aboutPage" } }),
    getReviews(),
  ]);
  const content = mergeSiteContent("aboutPage", row?.data);
  return <AboutPageContent content={content} reviews={reviews} />;
}
