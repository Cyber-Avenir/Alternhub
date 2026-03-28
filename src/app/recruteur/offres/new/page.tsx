import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { NouvelleOffreClient } from "./NouvelleOffreClient";

export const metadata = { title: "Nouvelle offre" };

export default async function NouvelleOffrePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  const skills = await prisma.skill.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] });
  const ecoles = await prisma.ecole.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });

  return <NouvelleOffreClient skills={skills} ecoles={ecoles} />;
}
