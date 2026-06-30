import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });

  if (!project) return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
  if (project.userId !== session.user.id) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  if (project.signedAt) return NextResponse.json({ error: "Déjà signé" }, { status: 409 });

  if (!["pending", "accepted"].includes(project.status)) {
    return NextResponse.json({ error: "Ce projet ne peut pas être signé" }, { status: 400 });
  }

  const updated = await prisma.project.update({
    where: { id },
    data: { signedAt: new Date() },
  });

  return NextResponse.json({ signedAt: updated.signedAt });
}
