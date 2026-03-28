import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const userId = session.user.id!;
  const { skillId, level } = await req.json();

  const existing = await prisma.userSkill.findUnique({
    where: { userId_skillId: { userId, skillId } },
  });

  if (existing) {
    return NextResponse.json({ error: "Compétence déjà ajoutée" }, { status: 409 });
  }

  const userSkill = await prisma.userSkill.create({
    data: { userId, skillId, level: level ?? 1 },
    include: { skill: true },
  });

  return NextResponse.json(userSkill, { status: 201 });
}
