import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const userId = session.user.id!;
  const body = await req.json();

  const mission = await prisma.mission.findUnique({ where: { id: params.id } });
  if (!mission || mission.userId !== userId) {
    return NextResponse.json({ error: "Mission introuvable" }, { status: 404 });
  }

  const updated = await prisma.mission.update({
    where: { id: params.id },
    data: {
      ...(body.status && { status: body.status }),
      ...(body.title && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.priority && { priority: body.priority }),
      ...(body.impact !== undefined && { impact: body.impact }),
      ...(body.tags !== undefined && { tags: body.tags }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const userId = session.user.id!;
  const mission = await prisma.mission.findUnique({ where: { id: params.id } });
  if (!mission || mission.userId !== userId) {
    return NextResponse.json({ error: "Mission introuvable" }, { status: 404 });
  }

  await prisma.mission.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
