import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { offreId } = await request.json();

    // Get the offre
    const offre = await prisma.offre.findUnique({
      where: { id: offreId },
      select: { title: true, recruteurId: true },
    });

    if (!offre) {
      return NextResponse.json({ error: 'Offre not found' }, { status: 404 });
    }

    // Check if student already has a candidature for this offer
    const existing = await prisma.candidature.findFirst({
      where: {
        userId: session.user.id,
        offreId: offreId,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Already applied to this offer' },
        { status: 409 }
      );
    }

    // Create Candidature (student-side)
    const candidature = await prisma.candidature.create({
      data: {
        userId: session.user.id,
        company: 'Unknown',
        role: offre.title,
        contractType: 'ALTERNANCE',
        status: 'APPLIED',
        appliedAt: new Date(),
        offreId: offreId,
      },
    });

    return NextResponse.json(candidature);
  } catch (error) {
    console.error('Error applying to offre:', error);
    return NextResponse.json({ error: 'Failed to apply' }, { status: 500 });
  }
}
