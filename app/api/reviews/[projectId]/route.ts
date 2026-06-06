import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { projectId } = await params;
  const { content, rating } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "Contenu requis" }, { status: 400 });

  const review = await prisma.review.findFirst({
    where: { projectId, userId: session.user.id },
  });
  if (!review) return NextResponse.json({ error: "Aucune demande d'avis pour ce projet" }, { status: 404 });
  if (review.status !== "requested") return NextResponse.json({ error: "Avis déjà soumis ou non demandé" }, { status: 400 });

  const updated = await prisma.review.update({
    where: { id: review.id },
    data: {
      content: content.trim(),
      rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      status: "submitted",
      submittedAt: new Date(),
    },
  });
  return NextResponse.json(updated);
}
