import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SkillsClient } from "./SkillsClient";

export const metadata = { title: "Mes Compétences" };

export default async function SkillsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");
  const userId = session.user.id!;

  const [userSkills, allSkills] = await Promise.all([
    prisma.userSkill.findMany({
      where: { userId },
      include: { skill: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.skill.findMany({ orderBy: { category: "asc" } }),
  ]);

  return <SkillsClient userSkills={userSkills} allSkills={allSkills} userId={userId} />;
}
