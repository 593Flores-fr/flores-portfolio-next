import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { projectId } = await params;
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!project) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  if (project.userId !== session.user.id) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const items = await prisma.moodboardItem.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(items);
}
