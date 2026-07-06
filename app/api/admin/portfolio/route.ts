import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { describePrismaError } from "@/lib/prisma-error";

function isAdmin(email?: string | null) { return email === process.env.ADMIN_EMAIL; }

export async function GET() {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const projects = await prisma.portfolioProject.findMany({ orderBy: { order: "asc" }, include: { section: true } });
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { title, slug, tag, description, imageSrc, logoSrc, sectionId, year, client,
    fullDescription, challenge, images, mockupImages, blocks, tools, externalLink, discordUrl, accentColor, published } = body;
  if (!title?.trim() || !slug?.trim()) return NextResponse.json({ error: "title et slug requis" }, { status: 400 });

  try {
    const last = await prisma.portfolioProject.findFirst({ orderBy: { order: "desc" } });
    const created = await prisma.portfolioProject.create({
      data: {
        title: title.trim(), slug: slug.trim(),
        tag: tag?.trim() ?? "", description: description?.trim() ?? "",
        imageSrc: imageSrc?.trim() ?? "", logoSrc: logoSrc?.trim() ?? "",
        sectionId: sectionId || null, year: year?.trim() ?? "",
        client: client?.trim() ?? "", fullDescription: fullDescription?.trim() ?? "",
        challenge: challenge?.trim() ?? "",
        images: images ?? [], mockupImages: mockupImages ?? [], blocks: blocks ?? [], tools: tools ?? [],
        externalLink: externalLink?.trim() || null,
        discordUrl: discordUrl?.trim() || null,
        accentColor: accentColor?.trim() ?? "",
        order: body.order !== undefined ? Number(body.order) : (last?.order ?? -1) + 1,
        published: published !== false,
      },
    });
    // Neon HTTP adapter ne supporte pas les transactions : create() + include échoue,
    // donc on fait create() puis un findUnique séparé pour récupérer la relation.
    const project = await prisma.portfolioProject.findUnique({ where: { id: created.id }, include: { section: true } }) ?? created;

    revalidatePath("/portfolio");
    revalidatePath("/");

    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: describePrismaError(err, "admin/portfolio POST") }, { status: 500 });
  }
}
