import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

function isAdmin(email?: string | null) {
  return email === process.env.ADMIN_EMAIL;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({ where: { id }, include: { user: { select: { id: true, name: true, email: true } } } });
  if (!invoice) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  return NextResponse.json(invoice);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const body = await req.json();
  const data: Record<string, unknown> = {};
  const allowed = ["status", "clientName", "clientEmail", "clientAddress", "items", "taxRate", "notes", "dueDate", "type", "userId"];
  for (const key of allowed) {
    if (key in body) {
      if (key === "dueDate") data.dueDate = body.dueDate ? new Date(body.dueDate) : null;
      else data[key] = body[key];
    }
  }
  const invoice = await prisma.invoice.update({ where: { id }, data });
  return NextResponse.json(invoice);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  await prisma.invoice.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
