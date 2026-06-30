import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { put } from "@vercel/blob";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });

  const ext = file.name.split(".").pop() ?? "jpg";
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "BLOB_READ_WRITE_TOKEN manquant dans .env.local" }, { status: 503 });
  }

  const blob = await put(`avatars/${session.user.id}-${Date.now()}.${ext}`, file, { access: "public" });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { image: blob.url },
  });

  return NextResponse.json({ image: blob.url });
}
