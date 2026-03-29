import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'RECRUTEUR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { studentId, offreId } = await request.json();

    // Verify the offre belongs to this recruiter
    const offre = await prisma.offre.findUnique({
      where: { id: offreId },
      select: { recruteurId: true },
    });

    if (!offre || offre.recruteurId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if already in pipeline
    const existing = await prisma.pipelineApplication.findUnique({
      where: {
        offreId_studentId: {
          offreId,
          studentId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Already in pipeline' },
        { status: 409 }
      );
    }

    // Create PipelineApplication
    const pipelineApp = await prisma.pipelineApplication.create({
      data: {
        offreId,
        studentId,
        recruteurId: session.user.id,
        status: 'INITIAL',
        responseDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json(pipelineApp);
  } catch (error) {
    console.error('Error adding to pipeline:', error);
    return NextResponse.json(
      { error: 'Failed to add to pipeline' },
      { status: 500 }
    );
  }
}
