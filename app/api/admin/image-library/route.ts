import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { list } from "@vercel/blob";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

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

  const body = (await req.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif", "image/avif", "image/bmp"],
        maximumSizeInBytes: 20 * 1024 * 1024,
        addRandomSuffix: false,
      }),
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("[image-library] client upload error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Erreur upload" }, { status: 400 });
  }
}
