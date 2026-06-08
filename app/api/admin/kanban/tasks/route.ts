import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

function isAdmin(email?: string | null) {
  return email === process.env.ADMIN_EMAIL;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { columnId, title, description, category, priority } = await req.json();
  if (!columnId || !title?.trim()) return NextResponse.json({ error: "Champs requis" }, { status: 400 });

  const last = await prisma.kanbanTask.findFirst({ where: { columnId }, orderBy: { order: "desc" } });
  const task = await prisma.kanbanTask.create({
    data: {
      columnId, title: title.trim(),
      description: description?.trim() ?? null,
      category: category ?? null,
      priority: priority ?? "moyen",
      order: (last?.order ?? -1) + 1,
    },
  });
  return NextResponse.json(task, { status: 201 });
}
