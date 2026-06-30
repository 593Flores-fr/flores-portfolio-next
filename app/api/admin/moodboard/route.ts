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
  const imageUrl = formData.get("imageUrl") as string | null;
  const projectId = formData.get("projectId") as string | null;
  const note = formData.get("note") as string | null;

  if (!projectId) return NextResponse.json({ error: "projectId manquant" }, { status: 400 });
  if (!file && !imageUrl) return NextResponse.json({ error: "Image ou URL requise" }, { status: 400 });

  let finalUrl = imageUrl ?? "";

  if (file) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ error: "BLOB_READ_WRITE_TOKEN manquant" }, { status: 503 });
    }
    const blob = await put(`moodboard/${projectId}/${Date.now()}-${file.name}`, file, { access: "public" });
    finalUrl = blob.url;
  }

  const item = await prisma.moodboardItem.create({
    data: { imageUrl: finalUrl, note: note?.trim() ?? null, projectId, fromAdmin: true },
  });

  return NextResponse.json(item, { status: 201 });
}
