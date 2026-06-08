import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

function isAdmin(email?: string | null) {
  return email === process.env.ADMIN_EMAIL;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
      review: true,
      columns: {
        orderBy: { order: "asc" },
        include: { tasks: { orderBy: { order: "asc" } } },
      },
    },
  });
  if (!project) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  return NextResponse.json(project);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const data: { status?: string; adminNotes?: string | null; paid?: boolean; kanbanNotes?: string | null; kanbanVisible?: boolean; projectSummary?: string | null } = {};
  if ("status" in body) data.status = String(body.status);
  if ("adminNotes" in body) data.adminNotes = body.adminNotes ? String(body.adminNotes) : null;
  if ("paid" in body) data.paid = Boolean(body.paid);
  if ("kanbanNotes" in body) data.kanbanNotes = body.kanbanNotes ? String(body.kanbanNotes) : null;
  if ("kanbanVisible" in body) data.kanbanVisible = Boolean(body.kanbanVisible);
  if ("projectSummary" in body) data.projectSummary = body.projectSummary ? String(body.projectSummary) : null;

  if (Object.keys(data).length > 0) {
    await prisma.project.update({ where: { id }, data });
  }

  // Auto-create default kanban columns when becoming active or forced via initColumns
  if (data.status === "active" || body.initColumns === true) {
    const existingCols = await prisma.kanbanColumn.count({ where: { projectId: id } });
    if (existingCols === 0) {
      const defaultCols = ["À faire", "En cours", "Bloquée", "En review", "Fait"];
      await Promise.all(
        defaultCols.map((title, order) =>
          prisma.kanbanColumn.create({ data: { title, order, projectId: id } })
        )
      );
    }
  }

  // Return full project with relations
  const fullProject = await prisma.project.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
      review: true,
      columns: {
        orderBy: { order: "asc" },
        include: { tasks: { orderBy: { order: "asc" } } },
      },
    },
  });
  return NextResponse.json(fullProject);
}
