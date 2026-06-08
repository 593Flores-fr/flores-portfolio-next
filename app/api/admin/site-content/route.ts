import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { SITE_DEFAULTS } from "@/lib/site-content";

function isAdmin(email?: string | null) {
  return email === process.env.ADMIN_EMAIL;
}

export async function GET() {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const sections = await prisma.siteContent.findMany();
  const result: Record<string, unknown> = { ...SITE_DEFAULTS };
  for (const s of sections) {
    result[s.section] = { ...((result[s.section] as object) ?? {}), ...(s.data as object) };
  }
  return NextResponse.json(result);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { section, data } = await req.json();
  if (!section || typeof data !== "object") {
    return NextResponse.json({ error: "section et data requis" }, { status: 400 });
  }

  const record = await prisma.siteContent.upsert({
    where: { section },
    update: { data },
    create: { section, data },
  });
  return NextResponse.json(record);
}
