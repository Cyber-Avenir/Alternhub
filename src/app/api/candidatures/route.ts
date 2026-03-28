import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const userId = session.user.id!;
  const body = await req.json();

  const candidature = await prisma.candidature.create({
    data: {
      userId,
      company: body.company,
      role: body.role,
      location: body.location || null,
      contractType: body.contractType || "ALTERNANCE",
      status: body.status || "WISHLIST",
      source: body.source || null,
      url: body.url || null,
      salary: body.salary || null,
      notes: body.notes || null,
      contactName: body.contactName || null,
      contactEmail: body.contactEmail || null,
      appliedAt: body.status !== "WISHLIST" ? new Date() : null,
      lastActionAt: new Date(),
    },
  });

  return NextResponse.json(candidature, { status: 201 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const userId = session.user.id!;

  const candidatures = await prisma.candidature.findMany({
    where: { userId },
    orderBy: { lastActionAt: "desc" },
  });

  return NextResponse.json(candidatures);
}
