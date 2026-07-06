import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { put } from "@vercel/blob";
import prisma from "@/lib/prisma";
import { validateUpload, safeFilename } from "@/lib/upload-validation";

function isAdmin(email?: string | null) { return email === process.env.ADMIN_EMAIL; }

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const projectId = formData.get("projectId") as string | null;
  const notes = formData.get("notes") as string | null;

  if (!file || !projectId) return NextResponse.json({ error: "Champs manquants" }, { status: 400 });

  const validationError = validateUpload(file, "document");
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "BLOB_READ_WRITE_TOKEN manquant" }, { status: 503 });
  }

  const fileType = file.type === "application/pdf" ? "pdf" : file.type.startsWith("image/") ? "image" : "file";

  const existingCount = await prisma.deliverable.count({ where: { projectId, fileName: file.name } });
  const version = existingCount + 1;

  const blob = await put(`deliverables/${projectId}/${safeFilename(file)}`, file, { access: "public" });

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
