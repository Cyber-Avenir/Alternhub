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

    // Get the offre and its recruiter
    const offre = await prisma.offre.findUnique({
      where: { id: offreId },
      select: { recruteurId: true },
    });

    if (!offre) {
      return NextResponse.json({ error: 'Offre not found' }, { status: 404 });
    }

    // Check if student already applied
    const existing = await prisma.pipelineApplication.findUnique({
      where: {
        offreId_studentId: {
          offreId,
          studentId: session.user.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Already applied to this offer' },
        { status: 409 }
      );
    }

    // Create PipelineApplication
    const pipelineApp = await prisma.pipelineApplication.create({
      data: {
        offreId,
        studentId: session.user.id,
        recruteurId: offre.recruteurId,
        status: 'INITIAL',
      },
    });

    return NextResponse.json(pipelineApp);
  } catch (error) {
    console.error('Error applying to offre:', error);
    return NextResponse.json({ error: 'Failed to apply' }, { status: 500 });
  }
}
