import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { describePrismaError } from "@/lib/prisma-error";

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

  try {
    const before = await prisma.portfolioProject.findUnique({ where: { id }, select: { slug: true } });
    // Neon HTTP adapter ne supporte pas les transactions : update() + include échoue,
    // donc on fait update() puis un findUnique séparé pour récupérer la relation.
    const updated = await prisma.portfolioProject.update({ where: { id }, data });
    const project = await prisma.portfolioProject.findUnique({ where: { id }, include: { section: true } }) ?? updated;

    revalidatePath("/portfolio");
    revalidatePath("/");
    if (before?.slug) revalidatePath(`/portfolio/${before.slug}`);
    if (updated.slug !== before?.slug) revalidatePath(`/portfolio/${updated.slug}`);

    return NextResponse.json(project);
  } catch (err) {
    return NextResponse.json({ error: describePrismaError(err, "admin/portfolio/[id] PATCH") }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  try {
    const deleted = await prisma.portfolioProject.delete({ where: { id } });

    revalidatePath("/portfolio");
    revalidatePath("/");
    revalidatePath(`/portfolio/${deleted.slug}`);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: describePrismaError(err, "admin/portfolio/[id] DELETE") }, { status: 500 });
  }
}
