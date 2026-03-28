import { prisma } from "@/lib/prisma";
import { BonsPlansClient } from "./BonsPlansClient";

export const metadata = { title: "Bons Plans & Aides" };

export default async function BonsPlansPage() {
  const [bonsPlans, aides] = await Promise.all([
    prisma.bonPlan.findMany({ where: { isActive: true }, orderBy: { category: "asc" } }),
    prisma.aide.findMany({ where: { isActive: true }, orderBy: { category: "asc" } }),
  ]);

  return <BonsPlansClient bonsPlans={bonsPlans} aides={aides} />;
}
