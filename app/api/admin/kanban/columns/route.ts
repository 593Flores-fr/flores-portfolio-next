import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

function isAdmin(email?: string | null) {
  return email === process.env.ADMIN_EMAIL;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { projectId, title } = await req.json();
  if (!projectId || !title?.trim()) return NextResponse.json({ error: "Champs requis" }, { status: 400 });

  const last = await prisma.kanbanColumn.findFirst({ where: { projectId }, orderBy: { order: "desc" } });
  const column = await prisma.kanbanColumn.create({
    data: { projectId, title: title.trim(), order: (last?.order ?? -1) + 1 },
    include: { tasks: true },
  });
  return NextResponse.json(column, { status: 201 });
}
