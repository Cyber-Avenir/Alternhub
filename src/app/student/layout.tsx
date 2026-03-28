import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StudentSidebar } from "@/components/layout/StudentSidebar";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");
  if (session.user.role === "ADMIN") redirect("/admin");
  if (session.user.role === "RECRUTEUR") redirect("/recruteur/dashboard");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <StudentSidebar
        user={{
          name: user?.name,
          email: user?.email,
          image: user?.image,
          school: user?.profile?.school,
          searchStatus: user?.searchStatus ?? "SEARCHING",
          subscriptionTier: user?.subscriptionTier ?? "FREE",
        }}
      />
      <main className="pl-64">
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  );
}
