import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

function isAdmin(email?: string | null) {
  return email === process.env.ADMIN_EMAIL;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const data: Record<string, unknown> = {};
  if ("title" in body) data.title = body.title.trim();
  if ("description" in body) data.description = body.description?.trim() ?? null;
  if ("done" in body) data.done = Boolean(body.done);
  if ("category" in body) data.category = body.category ?? null;
  if ("priority" in body) data.priority = body.priority ?? "moyen";
  if ("columnId" in body) data.columnId = body.columnId;

  const task = await prisma.kanbanTask.update({ where: { id }, data });
  return NextResponse.json(task);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  await prisma.kanbanTask.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
