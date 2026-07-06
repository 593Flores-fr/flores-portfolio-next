import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { imageUrl } = await req.json();
  if (!imageUrl?.trim()) return NextResponse.json({ error: "Image manquante" }, { status: 400 });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { image: imageUrl.trim() },
  });

  return NextResponse.json({ image: imageUrl.trim() });
}
