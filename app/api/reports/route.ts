import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const reports = await prisma.report.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(reports);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { title, type, description, url } = await req.json();
  if (!title?.trim() || !description?.trim()) {
    return NextResponse.json({ error: "Titre et description requis" }, { status: 400 });
  }

  const report = await prisma.report.create({
    data: {
      title: title.trim(),
      type: type ?? "bug",
      description: description.trim(),
      url: url?.trim() || null,
      userId: session.user.id,
    },
  });
  return NextResponse.json(report, { status: 201 });
}
