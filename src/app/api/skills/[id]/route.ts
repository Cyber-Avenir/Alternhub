import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const userId = session.user.id!;
  const { level } = await req.json();

  const userSkill = await prisma.userSkill.findUnique({ where: { id: params.id } });
  if (!userSkill || userSkill.userId !== userId) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }

  const updated = await prisma.userSkill.update({
    where: { id: params.id },
    data: { level },
    include: { skill: true },
  });

  return NextResponse.json(updated);
}
