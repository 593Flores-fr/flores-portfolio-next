import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const allowed = await checkRateLimit(`views:${ip}`, 60, 60 * 1000);
    if (!allowed) return NextResponse.json({ error: "Trop de requêtes" }, { status: 429 });

    const body = await req.json().catch(() => ({}));
    const page = typeof body?.page === "string" ? body.page.trim().slice(0, 300) : null;
    if (!page) return NextResponse.json({ error: "page requis" }, { status: 400 });
    await prisma.pageView.create({ data: { page } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
