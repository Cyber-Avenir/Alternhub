import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const userId = session.user.id!;
  const body = await req.json();

  const mission = await prisma.mission.create({
    data: {
      userId,
      title: body.title,
      description: body.description ?? null,
      status: body.status ?? "IN_PROGRESS",
      priority: body.priority ?? "MEDIUM",
      impact: body.impact ?? null,
      tags: body.tags ?? "[]",
    },
  });

  return NextResponse.json(mission, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const userId = session.user.id!;
  const missions = await prisma.mission.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(missions);
}
