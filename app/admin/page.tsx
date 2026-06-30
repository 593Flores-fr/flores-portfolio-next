import { AdminHome } from "@/components/ui/admin-home";
import prisma from "@/lib/prisma";

export default async function AdminPage() {
  const [
    totalUsers, totalProjects, pendingProjects, activeProjects,
    completedProjects, totalMessages, unreadMessages,
    recentProjects, recentMessages,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.project.count(),
    prisma.project.count({ where: { status: "pending" } }),
    prisma.project.count({ where: { status: "active" } }),
    prisma.project.count({ where: { status: "completed" } }),
    prisma.message.count(),
    prisma.message.count({ where: { read: false, fromAdmin: false } }),
    prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: { id: true, title: true, status: true, type: true, createdAt: true, user: { select: { name: true, email: true } } },
    }),
    prisma.message.findMany({
      where: { fromAdmin: false },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, content: true, createdAt: true, read: true, user: { select: { name: true, email: true } } },
    }),
  ]);

  return (
    <AdminHome
      stats={{ totalUsers, totalProjects, pendingProjects, activeProjects, completedProjects, totalMessages, unreadMessages }}
      recentProjects={recentProjects}
      recentMessages={recentMessages}
    />
  );
}
