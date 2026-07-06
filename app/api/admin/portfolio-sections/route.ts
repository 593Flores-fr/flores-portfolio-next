import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

function isAdmin(email?: string | null) { return email === process.env.ADMIN_EMAIL; }

export async function GET() {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const sections = await prisma.portfolioSection.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(sections);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { name, color } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "name requis" }, { status: 400 });

  const last = await prisma.portfolioSection.findFirst({ orderBy: { order: "desc" } });
  const section = await prisma.portfolioSection.create({
    data: {
      name: name.trim(),
      color: color?.trim() || "#5c5cf5",
      order: (last?.order ?? -1) + 1,
    },
  });
  return NextResponse.json(section, { status: 201 });
}
