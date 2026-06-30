import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { put } from "@vercel/blob";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const projectId = formData.get("projectId") as string | null;
  const notes = formData.get("notes") as string | null;

  if (!file || !projectId) return NextResponse.json({ error: "Champs manquants" }, { status: 400 });

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "BLOB_READ_WRITE_TOKEN manquant" }, { status: 503 });
  }

  const ext = file.name.split(".").pop() ?? "bin";
  const fileType = ["jpg", "jpeg", "png", "gif", "webp", "avif", "svg"].includes(ext.toLowerCase())
    ? "image"
    : ext.toLowerCase() === "pdf"
    ? "pdf"
    : "file";

  const existingCount = await prisma.deliverable.count({ where: { projectId, fileName: file.name } });
  const version = existingCount + 1;

  const blob = await put(`deliverables/${projectId}/${Date.now()}-${file.name}`, file, { access: "public" });

  const deliverable = await prisma.deliverable.create({
    data: {
      fileName: file.name,
      fileUrl: blob.url,
      fileType,
      version,
      notes: notes?.trim() ?? null,
      projectId,
      status: "pending",
    },
  });

  return NextResponse.json(deliverable, { status: 201 });
}
