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
  if ("name" in body) data.name = String(body.name).trim();
  if ("color" in body) data.color = String(body.color).trim();
  if ("order" in body) data.order = Number(body.order);

  try {
    const section = await prisma.portfolioSection.update({ where: { id }, data });
    return NextResponse.json(section);
  } catch {
    return NextResponse.json({ error: "Une section porte déjà ce nom" }, { status: 409 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  await prisma.portfolioSection.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
