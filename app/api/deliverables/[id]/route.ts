import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

// Client: approve a deliverable
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { id } = await params;
  const deliverable = await prisma.deliverable.findUnique({
    where: { id },
    include: { project: { select: { userId: true } } },
  });

  if (!deliverable) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  if (deliverable.project.userId !== session.user.id) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const { action } = await req.json();

  if (action === "approve") {
    const updated = await prisma.deliverable.update({
      where: { id },
      data: { status: "approved", approvedAt: new Date() },
    });
    return NextResponse.json(updated);
  }

  if (action === "request_revision") {
    const updated = await prisma.deliverable.update({
      where: { id },
      data: { status: "revision" },
    });
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
}
