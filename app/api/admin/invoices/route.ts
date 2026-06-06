import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

function isAdmin(email?: string | null) {
  return email === process.env.ADMIN_EMAIL;
}

function nextNumber(type: string, existing: string[]) {
  const prefix = type === "facture" ? "FAC" : "DEV";
  const year = new Date().getFullYear();
  const nums = existing
    .filter(n => n.startsWith(`${prefix}-${year}-`))
    .map(n => parseInt(n.split("-")[2] ?? "0"))
    .filter(n => !isNaN(n));
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
  return `${prefix}-${year}-${String(next).padStart(3, "0")}`;
}

export async function GET() {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
  return NextResponse.json(invoices);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const existing = (await prisma.invoice.findMany({ select: { number: true } })).map(i => i.number);
  const type = body.type ?? "devis";
  const number = nextNumber(type, existing);

  const invoice = await prisma.invoice.create({
    data: {
      number,
      type,
      status: "draft",
      clientName: body.clientName ?? "",
      clientEmail: body.clientEmail ?? "",
      clientAddress: body.clientAddress ?? "",
      items: body.items ?? [],
      taxRate: body.taxRate ?? 0,
      notes: body.notes ?? "",
      issuedAt: new Date(),
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      userId: body.userId ?? null,
    },
  });
  return NextResponse.json(invoice, { status: 201 });
}
