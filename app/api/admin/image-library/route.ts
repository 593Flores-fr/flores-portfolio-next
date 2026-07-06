import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { put, list } from "@vercel/blob";
import { validateUpload, safeLibraryFilename } from "@/lib/upload-validation";

function isAdmin(email?: string | null) {
  return email === process.env.ADMIN_EMAIL;
}

export async function GET() {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { blobs } = await list({ prefix: "library/" });
    return NextResponse.json({
      images: blobs.map(b => ({
        url: b.url,
        name: b.pathname.replace("library/", "").replace(/^\d+-/, ""),
        size: b.size,
        uploadedAt: b.uploadedAt,
      })),
    });
  } catch {
    return NextResponse.json({ images: [] });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { url } = await req.json().catch(() => ({}));
  if (!url) return NextResponse.json({ error: "URL manquante" }, { status: 400 });

  try {
    const { del } = await import("@vercel/blob");
    await del(url);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Suppression échouée" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "BLOB_READ_WRITE_TOKEN manquant — configurez-le dans .env.local depuis le dashboard Vercel → Storage → Blob" }, { status: 503 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });

  const validationError = validateUpload(file, "image");
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

  try {
    const blob = await put(`library/${safeLibraryFilename(file)}`, file, { access: "public" });
    return NextResponse.json({ url: blob.url, name: file.name });
  } catch (e) {
    console.error("[image-library] upload failed:", e);
    return NextResponse.json({ error: "Erreur upload" }, { status: 500 });
  }
}
