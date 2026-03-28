import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RecruteurSidebar } from "@/components/layout/RecruteurSidebar";

export default async function RecruteurLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");
  if (session.user.role === "ADMIN") redirect("/admin");
  if (session.user.role === "STUDENT") redirect("/student/dashboard");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { recruteurProfile: true },
  });

  // If no recruiter profile yet, redirect to onboarding
  if (!user?.recruteurProfile) {
    redirect("/recruteur/onboarding");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <RecruteurSidebar
        user={{
          name: user?.name,
          email: user?.email,
          image: user?.image,
          companyName: user?.recruteurProfile?.companyName,
          subscriptionTier: user?.subscriptionTier ?? "FREE",
          offreQuota: user?.recruteurProfile?.offreQuota,
          cvViewQuota: user?.recruteurProfile?.cvViewQuota,
        }}
      />
      <main className="pl-64">
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  );
}
