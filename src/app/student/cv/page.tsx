import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CVDisplayClient } from "./CVDisplayClient";

export const metadata = { title: "Mon CV" };

export default async function CVPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");
  const userId = session.user.id!;

  const [user, missions, userSkills] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    }),
    prisma.mission.findMany({
      where: { userId, status: { in: ["COMPLETED", "IN_PROGRESS"] } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.userSkill.findMany({
      where: { userId },
      include: { skill: true },
      orderBy: { level: "desc" },
    }),
  ]);

  const skillsByCategory = userSkills.reduce<Record<string, typeof userSkills>>((acc, us) => {
    if (!acc[us.skill.category]) acc[us.skill.category] = [];
    acc[us.skill.category].push(us);
    return acc;
  }, {});

  return (
    <CVDisplayClient
      user={user as any}
      missions={missions as any}
      userSkills={userSkills as any}
      skillsByCategory={skillsByCategory as any}
    />
  );
}
