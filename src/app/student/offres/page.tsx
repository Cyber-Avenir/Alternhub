import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { OffresClient } from "./OffresClient";

export const metadata = { title: "Offres d'alternance" };

export default async function OffresPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  const userId = session.user.id!;

  const [offres, userSkills] = await Promise.all([
    prisma.offre.findMany({
      where: { status: "PUBLISHED" },
      include: {
        recruteur: { include: { recruteurProfile: true } },
        skills: { include: { skill: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.userSkill.findMany({
      where: { userId },
      include: { skill: true },
    }),
  ]);

  return <OffresClient offres={offres} userSkills={userSkills} />;
}
