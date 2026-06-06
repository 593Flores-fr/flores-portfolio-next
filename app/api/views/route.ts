import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { page } = await req.json();
  if (!page) return NextResponse.json({ error: "page requis" }, { status: 400 });
  await prisma.pageView.create({ data: { page } });
  return NextResponse.json({ ok: true });
}
