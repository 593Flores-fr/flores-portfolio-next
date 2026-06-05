import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  const messages = await prisma.message.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(messages);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  const { content } = await req.json();
  if (!content?.trim()) {
    return NextResponse.json({ error: "Message vide" }, { status: 400 });
  }
  const message = await prisma.message.create({
    data: { content: content.trim(), userId: session.user.id, fromAdmin: false },
  });
  return NextResponse.json(message, { status: 201 });
}
