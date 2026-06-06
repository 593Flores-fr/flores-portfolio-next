import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

function isAdmin(email?: string | null) { return email === process.env.ADMIN_EMAIL; }

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const data: Record<string, unknown> = {};
  for (const key of ["title", "slug", "tag", "description", "imageSrc", "order", "published"] as const) {
    if (key in body) data[key] = body[key];
  }
  const project = await prisma.portfolioProject.update({ where: { id }, data });
  return NextResponse.json(project);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  await prisma.portfolioProject.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
