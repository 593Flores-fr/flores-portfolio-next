import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

function isAdmin(email?: string | null) {
  return email === process.env.ADMIN_EMAIL;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  const { userId } = await params;

  // Mark client messages as read
  await prisma.message.updateMany({
    where: { userId, fromAdmin: false, read: false },
    data: { read: true },
  });

  const messages = await prisma.message.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, image: true },
  });

  const projects = await prisma.project.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, title: true, status: true, type: true, budget: true, description: true, createdAt: true },
  });

  return NextResponse.json({ user, messages, projects });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  const { userId } = await params;
  const { content } = await req.json();

  if (!content?.trim()) {
    return NextResponse.json({ error: "Message vide" }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: { content: content.trim(), userId, fromAdmin: true, read: true },
  });

  return NextResponse.json(message, { status: 201 });
}
