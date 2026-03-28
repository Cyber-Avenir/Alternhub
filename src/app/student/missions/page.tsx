import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { MissionsClient } from "./MissionsClient";

export const metadata = { title: "Mes Missions" };

export default async function MissionsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");
  const userId = session.user.id!;

  const missions = await prisma.mission.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return <MissionsClient missions={missions} userId={userId} />;
}
