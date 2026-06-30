import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const page = typeof body?.page === "string" ? body.page.trim() : null;
    if (!page) return NextResponse.json({ error: "page requis" }, { status: 400 });
    await prisma.pageView.create({ data: { page } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
