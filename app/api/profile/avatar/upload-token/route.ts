import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

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
    console.error("[avatar] client upload error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Erreur upload" }, { status: 400 });
  }
}
