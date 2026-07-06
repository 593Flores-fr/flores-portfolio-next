import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { put } from "@vercel/blob";
import { validateUpload, safeFilename } from "@/lib/upload-validation";

function isAdmin(email?: string | null) {
  return email === process.env.ADMIN_EMAIL;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });

  const validationError = validateUpload(file, "image");
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

  const { searchParams } = new URL(req.url);
  const folder = searchParams.get("folder") ?? "about";

  const blob = await put(`${folder}/${safeFilename(file)}`, file, { access: "public" });
  return NextResponse.json({ url: blob.url });
}
