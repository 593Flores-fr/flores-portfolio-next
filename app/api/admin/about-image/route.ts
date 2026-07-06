import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { auth } from "@/auth";

function isAdmin(email?: string | null) {
  return email === process.env.ADMIN_EMAIL;
}

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif", "image/avif", "image/bmp"];
const MAX_BYTES = 20 * 1024 * 1024; // 20 Mo

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = (await req.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ALLOWED_TYPES,
        maximumSizeInBytes: MAX_BYTES,
        addRandomSuffix: false,
      }),
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("[about-image] client upload error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Erreur upload" }, { status: 400 });
  }
}
