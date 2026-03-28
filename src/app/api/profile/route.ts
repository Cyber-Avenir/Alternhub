import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const userId = session.user.id!;
  const body = await req.json();

  const profile = await prisma.profile.upsert({
    where: { userId },
    create: {
      userId,
      bio: body.bio,
      school: body.school,
      company: body.company,
      position: body.position,
      location: body.location,
      phone: body.phone,
      linkedinUrl: body.linkedinUrl,
      githubUrl: body.githubUrl,
      portfolioUrl: body.portfolioUrl,
      searchType: body.searchType,
      searchStartDate: body.searchStartDate ? new Date(body.searchStartDate) : undefined,
      searchEndDate: body.searchEndDate ? new Date(body.searchEndDate) : undefined,
      cvUrl: body.cvUrl,
      schoolOfferUrl: body.schoolOfferUrl,
      motivationLetter: body.motivationLetter,
    },
    update: {
      ...(body.bio !== undefined && { bio: body.bio }),
      ...(body.school !== undefined && { school: body.school }),
      ...(body.company !== undefined && { company: body.company }),
      ...(body.position !== undefined && { position: body.position }),
      ...(body.location !== undefined && { location: body.location }),
      ...(body.phone !== undefined && { phone: body.phone }),
      ...(body.linkedinUrl !== undefined && { linkedinUrl: body.linkedinUrl }),
      ...(body.githubUrl !== undefined && { githubUrl: body.githubUrl }),
      ...(body.portfolioUrl !== undefined && { portfolioUrl: body.portfolioUrl }),
      ...(body.searchType !== undefined && { searchType: body.searchType }),
      ...(body.searchStartDate !== undefined && { searchStartDate: body.searchStartDate ? new Date(body.searchStartDate) : null }),
      ...(body.searchEndDate !== undefined && { searchEndDate: body.searchEndDate ? new Date(body.searchEndDate) : null }),
      ...(body.cvUrl !== undefined && { cvUrl: body.cvUrl }),
      ...(body.schoolOfferUrl !== undefined && { schoolOfferUrl: body.schoolOfferUrl }),
      ...(body.motivationLetter !== undefined && { motivationLetter: body.motivationLetter }),
    },
  });

  // Also update searchStatus on user if needed
  if (body.searchStatus) {
    await prisma.user.update({
      where: { id: userId },
      data: { searchStatus: body.searchStatus },
    });
  }

  return NextResponse.json(profile);
}
