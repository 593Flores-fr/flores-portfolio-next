import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    include: {
      review: { select: { status: true } },
      columns: {
        orderBy: { order: "asc" },
        include: { tasks: { orderBy: { order: "asc" } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { title, description, type, budget, deadline, references, contact, phone, callSlots, briefFile, briefFileName } = await req.json();
  if (!title?.trim() || !type) return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });

  const project = await prisma.project.create({
    data: {
      title: title.trim(),
      description: description?.trim() ?? null,
      type,
      budget: budget?.trim() ?? null,
      deadline: deadline?.trim() ?? null,
      references: references?.trim() ?? null,
      contact: contact?.trim() ?? null,
      phone: phone?.trim() ?? null,
      callSlots: callSlots ? JSON.stringify(callSlots) : null,
      briefFile: briefFile ?? null,
      briefFileName: briefFileName ?? null,
      userId: session.user.id,
      status: "pending",
    },
  });
  return NextResponse.json(project, { status: 201 });
}
