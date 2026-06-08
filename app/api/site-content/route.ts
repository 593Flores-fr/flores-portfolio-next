import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { SITE_DEFAULTS } from "@/lib/site-content";

export async function GET() {
  const sections = await prisma.siteContent.findMany();
  const result: Record<string, unknown> = { ...SITE_DEFAULTS };
  for (const s of sections) {
    result[s.section] = { ...((result[s.section] as object) ?? {}), ...(s.data as object) };
  }
  return NextResponse.json(result, {
    headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
  });
}
