import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const userId = session.user.id!;

  const offre = await prisma.offre.findUnique({ where: { id: params.id } });
  if (!offre || (offre.recruteurId !== userId && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }

  const updated = await prisma.offre.update({
    where: { id: params.id },
    data: {
      ...(body.status && { status: body.status }),
      ...(body.title && { title: body.title }),
      ...(body.description && { description: body.description }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const userId = session.user.id!;
  const offre = await prisma.offre.findUnique({ where: { id: params.id } });

  if (!offre || (offre.recruteurId !== userId && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }

  await prisma.offre.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
