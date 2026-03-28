import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "PUBLISHED";

  const offres = await prisma.offre.findMany({
    where: { status },
    include: {
      recruteur: { include: { recruteurProfile: true } },
      skills: { include: { skill: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(offres);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "RECRUTEUR") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();
  const userId = session.user.id!;

  const offre = await prisma.offre.create({
    data: {
      recruteurId: userId,
      title: body.title,
      description: body.description,
      contractType: body.contractType ?? "ALTERNANCE",
      location: body.location,
      remote: body.remote ?? false,
      salary: body.salary,
      duration: body.duration,
      requiredLevel: body.requiredLevel,
      status: body.status ?? "PUBLISHED",
      startDate: body.startDate ? new Date(body.startDate) : undefined,
    },
  });

  // Create skill associations
  if (body.skills && Array.isArray(body.skills)) {
    await prisma.offreSkill.createMany({
      data: body.skills.map((s: { skillId: string; required: boolean; weight: number }) => ({
        offreId: offre.id,
        skillId: s.skillId,
        required: s.required ?? true,
        weight: s.weight ?? 1,
      })),
      skipDuplicates: true,
    });
  }

  return NextResponse.json(offre, { status: 201 });
}
