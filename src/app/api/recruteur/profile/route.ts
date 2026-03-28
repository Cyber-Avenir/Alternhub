import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "RECRUTEUR") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();
  const userId = session.user.id!;

  // Check if already exists
  const existing = await prisma.recruteurProfile.findUnique({ where: { userId } });
  if (existing) {
    return NextResponse.json({ error: "Profil déjà créé" }, { status: 400 });
  }

  const profile = await prisma.recruteurProfile.create({
    data: {
      userId,
      companyName: body.companyName,
      companySize: body.companySize,
      industry: body.industry,
      companyWebsite: body.companyWebsite,
      phone: body.phone,
      location: body.location,
      bio: body.bio,
    },
  });

  return NextResponse.json(profile, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "RECRUTEUR") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();
  const userId = session.user.id!;

  const profile = await prisma.recruteurProfile.update({
    where: { userId },
    data: {
      ...(body.companyName && { companyName: body.companyName }),
      ...(body.companySize !== undefined && { companySize: body.companySize }),
      ...(body.industry !== undefined && { industry: body.industry }),
      ...(body.companyWebsite !== undefined && { companyWebsite: body.companyWebsite }),
      ...(body.phone !== undefined && { phone: body.phone }),
      ...(body.location !== undefined && { location: body.location }),
      ...(body.bio !== undefined && { bio: body.bio }),
    },
  });

  return NextResponse.json(profile);
}
