import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const revalidate = 3600;

export async function GET() {
  const projects = await prisma.portfolioProject.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    select: {
      id: true, slug: true, title: true, tag: true, description: true, imageSrc: true,
      section: { select: { id: true, name: true, color: true } },
    },
  });
  return NextResponse.json(projects);
}
