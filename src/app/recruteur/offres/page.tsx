import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { OffresRecruteurClient } from "./OffresRecruteurClient";

export const metadata = { title: "Mes Offres" };

export default async function OffresRecruteurPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  const userId = session.user.id!;

  const [offres, skills] = await Promise.all([
    prisma.offre.findMany({
      where: { recruteurId: userId },
      include: { skills: { include: { skill: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.skill.findMany({ orderBy: { name: "asc" } }),
  ]);

  return <OffresRecruteurClient offres={offres} />;
}
