import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

function isAdmin(email?: string | null) { return email === process.env.ADMIN_EMAIL; }

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { projectId, note, imageUrl } = await req.json();
  if (!projectId) return NextResponse.json({ error: "projectId manquant" }, { status: 400 });
  if (!imageUrl?.trim()) return NextResponse.json({ error: "Image ou URL requise" }, { status: 400 });

  const item = await prisma.moodboardItem.create({
    data: { imageUrl: imageUrl.trim(), note: note?.trim() || null, projectId, fromAdmin: true },
  });

  return NextResponse.json(item, { status: 201 });
}
