import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const userId = session.user.id!;

  const body = await req.json();
  const item = await prisma.candidature.findUnique({ where: { id: params.id } });
  if (!item || item.userId !== userId) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }

  const updated = await prisma.candidature.update({
    where: { id: params.id },
    data: {
      ...(body.status && { status: body.status }),
      ...(body.notes !== undefined && { notes: body.notes }),
      ...(body.salary !== undefined && { salary: body.salary }),
      lastActionAt: new Date(),
      // auto-set appliedAt when moving from WISHLIST
      ...(body.status && body.status !== "WISHLIST" && !item.appliedAt && {
        appliedAt: new Date(),
      }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const userId = session.user.id!;

  const item = await prisma.candidature.findUnique({ where: { id: params.id } });
  if (!item || item.userId !== userId) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }

  await prisma.candidature.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
