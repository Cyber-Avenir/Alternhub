import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { pipelineApplicationId, content, type = 'TEXT', callLink } =
      await request.json();

    // Verify the user is either the recruiter or the student in this application
    const app = await prisma.pipelineApplication.findUnique({
      where: { id: pipelineApplicationId },
    });

    if (!app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    if (
      session.user.id !== app.recruteurId &&
      session.user.id !== app.studentId
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        pipelineApplicationId,
        senderId: session.user.id,
        type,
        content,
        callLink,
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
