import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

function isAdmin(email?: string | null) {
  return email === process.env.ADMIN_EMAIL;
}

export async function GET() {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    where: { messages: { some: {} } },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { content: true, createdAt: true, fromAdmin: true },
      },
      _count: {
        select: { messages: { where: { fromAdmin: false, read: false } } },
      },
    },
    orderBy: { messages: { _count: "desc" } },
  });

  return NextResponse.json(users);
}
