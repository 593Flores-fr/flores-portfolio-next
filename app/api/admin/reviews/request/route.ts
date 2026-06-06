import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

function isAdmin(email?: string | null) {
  return email === process.env.ADMIN_EMAIL;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { projectId } = await req.json();
  if (!projectId) return NextResponse.json({ error: "projectId requis" }, { status: 400 });

  const project = await prisma.project.findUnique({ where: { id: projectId }, include: { review: true } });
  if (!project) return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });

  if (project.review) {
    const updated = await prisma.review.update({
      where: { id: project.review.id },
      data: { status: "requested", requestedAt: new Date() },
    });
    return NextResponse.json(updated);
  }

  const review = await prisma.review.create({
    data: {
      userId: project.userId,
      projectId,
      status: "requested",
      requestedAt: new Date(),
    },
  });
  return NextResponse.json(review, { status: 201 });
}
