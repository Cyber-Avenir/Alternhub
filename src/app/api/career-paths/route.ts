import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const userId = session.user.id!;
  const body = await req.json();

  const path = await prisma.careerPath.create({
    data: {
      userId,
      title: body.title,
      company: body.company,
      role: body.role,
      type: body.type ?? "ALTERNANCE",
      startDate: new Date(body.startDate),
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      isCurrent: body.isCurrent ?? true,
      description: body.description,
      skills: JSON.stringify(body.skills ?? []),
    },
  });

  return NextResponse.json(path, { status: 201 });
}
