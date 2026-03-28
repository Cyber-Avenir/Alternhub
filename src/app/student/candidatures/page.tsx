import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CandidaturesClient } from "./CandidaturesClient";

export const metadata = { title: "Mes Candidatures" };

export default async function CandidaturesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");
  const userId = session.user.id!;

  const candidatures = await prisma.candidature.findMany({
    where: { userId },
    orderBy: { lastActionAt: "desc" },
  });

  return <CandidaturesClient candidatures={candidatures} userId={userId} />;
}
