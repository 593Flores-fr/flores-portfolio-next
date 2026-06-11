import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

function isAdmin(email?: string | null) {
  return email === process.env.ADMIN_EMAIL;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const { id } = await params;
  const { status } = await req.json();

  const report = await prisma.report.update({
    where: { id },
    data: { status },
  });
  return NextResponse.json(report);
}
