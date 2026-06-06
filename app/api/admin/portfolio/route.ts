import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

function isAdmin(email?: string | null) { return email === process.env.ADMIN_EMAIL; }

export async function GET() {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const projects = await prisma.portfolioProject.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { title, slug, tag, description, imageSrc, category, year, client,
    fullDescription, challenge, images, tools, externalLink, accentColor, published } = body;
  if (!title?.trim() || !slug?.trim()) return NextResponse.json({ error: "title et slug requis" }, { status: 400 });

  const last = await prisma.portfolioProject.findFirst({ orderBy: { order: "desc" } });
  const project = await prisma.portfolioProject.create({
    data: {
      title: title.trim(), slug: slug.trim(),
      tag: tag?.trim() ?? "", description: description?.trim() ?? "",
      imageSrc: imageSrc?.trim() ?? "",
      category: category?.trim() ?? "", year: year?.trim() ?? "",
      client: client?.trim() ?? "", fullDescription: fullDescription?.trim() ?? "",
      challenge: challenge?.trim() ?? "",
      images: images ?? [], tools: tools ?? [],
      externalLink: externalLink?.trim() || null,
      accentColor: accentColor?.trim() ?? "",
      order: body.order !== undefined ? Number(body.order) : (last?.order ?? -1) + 1,
      published: published !== false,
    },
  });
  return NextResponse.json(project, { status: 201 });
}
