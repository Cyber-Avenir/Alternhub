import { prisma } from "@/lib/prisma";
import { EcolesClient } from "./EcolesClient";

export const metadata = { title: "Écoles" };

export default async function EcolesPage() {
  const ecoles = await prisma.ecole.findMany({
    where: { isActive: true },
    orderBy: [{ successRate: "desc" }, { name: "asc" }],
  });

  return <EcolesClient ecoles={ecoles} />;
}
