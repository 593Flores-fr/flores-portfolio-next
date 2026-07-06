import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    include: {
      review: { select: { status: true, content: true, rating: true } },
      columns: {
        orderBy: { order: "asc" },
        include: { tasks: { orderBy: { order: "asc" } } },
      },
      deliverables: { orderBy: { createdAt: "desc" } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const allowed = await checkRateLimit(`projects:${session.user.id}`, 10, 60 * 60 * 1000);
  if (!allowed) return NextResponse.json({ error: "Trop de demandes, réessayez plus tard." }, { status: 429 });

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
