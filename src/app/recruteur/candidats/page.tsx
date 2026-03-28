import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CandidatsSwipeClient } from "./CandidatsSwipeClient";

export const metadata = { title: "Explorer les candidats" };

export default async function CandidatsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");
  const userId = session.user.id!;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { recruteurProfile: true },
  });

  const isPremium = user?.subscriptionTier === "PREMIUM" || user?.subscriptionTier === "PRO";

  // Fetch students in active search
  const students = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      searchStatus: "SEARCHING",
    },
    include: {
      profile: { include: { ecole: true } },
      skills: { include: { skill: true }, take: 8 },
      missions: { where: { status: "COMPLETED" }, take: 5 },
    },
    take: 50,
  });

  // Get recruiter's published offres for matching
  const offres = await prisma.offre.findMany({
    where: { recruteurId: userId, status: "PUBLISHED" },
    include: { skills: { include: { skill: true } } },
    take: 10,
  });

  return <CandidatsSwipeClient students={students} offres={offres} isPremium={isPremium} />;
}
