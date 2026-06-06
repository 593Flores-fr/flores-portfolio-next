import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { name, image, currentPassword, newPassword } = await req.json();
  const data: Record<string, string> = {};

  if (name?.trim()) data.name = name.trim();
  if (image?.trim()) data.image = image.trim();

  if (newPassword) {
    if (!currentPassword) return NextResponse.json({ error: "Mot de passe actuel requis" }, { status: 400 });
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user?.password) return NextResponse.json({ error: "Impossible de changer le mot de passe (compte OAuth)" }, { status: 400 });
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 400 });
    data.password = await bcrypt.hash(newPassword, 12);
  }

  if (Object.keys(data).length === 0) return NextResponse.json({ error: "Aucune modification" }, { status: 400 });

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data,
    select: { id: true, name: true, image: true, email: true },
  });
  return NextResponse.json(updated);
}
