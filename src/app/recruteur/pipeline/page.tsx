import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import PipelineClient from './PipelineClient';
import { PageHeader } from '@/components/ui/page-header';

export default async function PipelinePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect('/auth/login');
  if (session.user.role !== 'RECRUTEUR') redirect('/student/dashboard');

  // Fetch all pipeline applications for this recruiter's offers
  const pipelineApps = await prisma.pipelineApplication.findMany({
    where: {
      recruteurId: session.user.id,
    },
    include: {
      student: {
        select: {
          name: true,
          email: true,
          profile: {
            select: {
              bio: true,
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
            select: {
              skillId: true,
              level: true,
              skill: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
      offre: {
        select: {
          title: true,
        },
      },
      messages: {
        select: {
          id: true,
          createdAt: true,
        },
      },
    },
    orderBy: [{ statusUpdatedAt: 'desc' }, { appliedAt: 'desc' }],
  });

  return (
    <div>
      <PageHeader
        title="Pipeline de Recrutement"
        description="Gérez vos candidatures et suivez le statut de vos entretiens"
      />

      <div className="mt-8">
        <PipelineClient applications={pipelineApps} />
      </div>
    </div>
  );
}
