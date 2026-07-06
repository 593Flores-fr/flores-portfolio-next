import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

function isAdmin(email?: string | null) { return email === process.env.ADMIN_EMAIL; }

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { projectId, notes, fileUrl, fileName, contentType } = await req.json();
  if (!projectId || !fileUrl || !fileName) return NextResponse.json({ error: "Champs manquants" }, { status: 400 });

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });

  const fileType = contentType === "application/pdf" ? "pdf" : typeof contentType === "string" && contentType.startsWith("image/") ? "image" : "file";

  const existingCount = await prisma.deliverable.count({ where: { projectId, fileName } });
  const version = existingCount + 1;

  const deliverable = await prisma.deliverable.create({
    data: {
      fileName,
      fileUrl,
      fileType,
      version,
      notes: notes?.trim() || null,
      projectId,
      status: "pending",
    },
  });

  return NextResponse.json(deliverable, { status: 201 });
}
