import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'RECRUTEUR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all candidatures for this recruiter's offers
    const candidatures = await prisma.candidature.findMany({
      where: {
        offre: {
          recruteurId: session.user.id,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            searchStatus: true,
            profile: {
              select: {
                bio: true,
                school: true,
                location: true,
                linkedinUrl: true,
                ecole: {
                  select: {
                    name: true,
                    city: true,
                  },
                },
              },
            },
            skills: {
              include: {
                skill: {
                  select: {
                    name: true,
                    category: true,
                  },
                },
              },
            },
            missions: {
              select: {
                title: true,
                status: true,
              },
            },
          },
        },
        offre: {
          select: {
            id: true,
            title: true,
            skills: {
              include: {
                skill: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });

    return NextResponse.json(candidatures);
  } catch (error) {
    console.error('Error fetching applicants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applicants' },
      { status: 500 }
    );
  }
}
