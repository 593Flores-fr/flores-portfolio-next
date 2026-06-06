import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

function isAdmin(email?: string | null) {
  return email === process.env.ADMIN_EMAIL;
}

export async function GET() {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [totalUsers, totalProjects, pendingProjects, totalViews, recentLogins, viewsByPage, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.project.count(),
    prisma.project.count({ where: { status: "pending" } }),
    prisma.pageView.count(),
    prisma.loginEvent.findMany({ orderBy: { createdAt: "desc" }, take: 20, select: { userEmail: true, provider: true, createdAt: true } }),
    prisma.pageView.groupBy({ by: ["page"], _count: { id: true }, orderBy: { _count: { id: "desc" } }, take: 10 }),
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 10, select: { id: true, name: true, email: true, image: true, createdAt: true } }),
  ]);

  // Views last 14 days
  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const viewsLast14 = await prisma.pageView.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true, page: true },
    orderBy: { createdAt: "asc" },
  });

  // Group by day
  const viewsByDay: Record<string, number> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    viewsByDay[d.toISOString().slice(0, 10)] = 0;
  }
  for (const v of viewsLast14) {
    const day = v.createdAt.toISOString().slice(0, 10);
    if (day in viewsByDay) viewsByDay[day]++;
  }

  return NextResponse.json({
    totalUsers, totalProjects, pendingProjects, totalViews,
    recentLogins, recentUsers,
    viewsByPage: viewsByPage.map(v => ({ page: v.page, count: v._count.id })),
    viewsByDay: Object.entries(viewsByDay).map(([date, count]) => ({ date, count })),
  });
}
