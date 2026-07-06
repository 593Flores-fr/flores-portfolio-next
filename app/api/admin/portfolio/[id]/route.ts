import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

function isAdmin(email?: string | null) { return email === process.env.ADMIN_EMAIL; }

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const data: Record<string, unknown> = {};
  const keys = ["title", "slug", "tag", "description", "imageSrc", "logoSrc", "sectionId", "year", "client",
    "fullDescription", "challenge", "images", "mockupImages", "blocks", "tools", "externalLink", "discordUrl", "accentColor", "order", "published"];
  for (const key of keys) { if (key in body) data[key] = body[key]; }

  const before = await prisma.portfolioProject.findUnique({ where: { id }, select: { slug: true } });
  const project = await prisma.portfolioProject.update({ where: { id }, data, include: { section: true } });

  revalidatePath("/portfolio");
  revalidatePath("/");
  if (before?.slug) revalidatePath(`/portfolio/${before.slug}`);
  if (project.slug !== before?.slug) revalidatePath(`/portfolio/${project.slug}`);

  return NextResponse.json(project);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const deleted = await prisma.portfolioProject.delete({ where: { id } });

  revalidatePath("/portfolio");
  revalidatePath("/");
  revalidatePath(`/portfolio/${deleted.slug}`);

  return NextResponse.json({ ok: true });
}
