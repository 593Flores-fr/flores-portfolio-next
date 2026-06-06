import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

function isAdmin(email?: string | null) {
  return email === process.env.ADMIN_EMAIL;
}

export async function GET() {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const projects = await prisma.project.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
      review: { select: { id: true, status: true } },
      _count: { select: { columns: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(projects);
}
