import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: { status: "approved", content: { not: null } },
      include: {
        user: { select: { name: true, image: true } },
        project: { select: { title: true } },
      },
      orderBy: { submittedAt: "desc" },
    });
    return NextResponse.json(reviews);
  } catch (err) {
    console.error("[api/avis]", err);
    return NextResponse.json([], { status: 500 });
  }
}
