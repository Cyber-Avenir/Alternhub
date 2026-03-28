import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'RECRUTEUR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { applicationId, status } = await request.json();

    // Verify the application belongs to this recruiter
    const app = await prisma.pipelineApplication.findUnique({
      where: { id: applicationId },
    });

    if (!app || app.recruteurId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Update status
    const updated = await prisma.pipelineApplication.update({
      where: { id: applicationId },
      data: {
        status,
        statusUpdatedAt: new Date(),
        // Set deadline to 7 days from now when moving to RECRUTEMENT_EN_COURS
        responseDeadline:
          status === 'RECRUTEMENT_EN_COURS'
            ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating status:', error);
    return NextResponse.json(
      { error: 'Failed to update status' },
      { status: 500 }
    );
  }
}
