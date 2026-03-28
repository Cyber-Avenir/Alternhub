import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Target, Users, Zap, TrendingUp, Award } from "lucide-react";
import { StatsChart } from "./StatsChart";

export const metadata = { title: "Statistiques" };

export default async function StatsPage() {
  const [
    totalUsers,
    totalMissions,
    missionsByStatus,
    totalSkills,
    topSkills,
    missionsByPriority,
    usersWithMissions,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.mission.count(),
    prisma.mission.groupBy({ by: ["status"], _count: { status: true } }),
    prisma.userSkill.count(),
    prisma.userSkill.groupBy({
      by: ["skillId"],
      _count: { skillId: true },
      orderBy: { _count: { skillId: "desc" } },
      take: 8,
    }),
    prisma.mission.groupBy({ by: ["priority"], _count: { priority: true } }),
    prisma.user.findMany({
      where: { role: "STUDENT" },
      include: { _count: { select: { missions: true } } },
      orderBy: { missions: { _count: "desc" } },
      take: 5,
    }),
  ]);

  // Get skill names for top skills
  const skillIds = topSkills.map((s) => s.skillId);
  const skillNames = await prisma.skill.findMany({
    where: { id: { in: skillIds } },
  });

  const topSkillsWithNames = topSkills.map((ts) => ({
    name: skillNames.find((s) => s.id === ts.skillId)?.name ?? "?",
    count: ts._count.skillId,
  }));

  const statusData = missionsByStatus.map((s) => ({
    name:
      s.status === "TODO"
        ? "À faire"
        : s.status === "IN_PROGRESS"
        ? "En cours"
        : s.status === "COMPLETED"
        ? "Terminées"
        : "Annulées",
    value: s._count.status,
    status: s.status,
  }));

  const priorityData = missionsByPriority.map((p) => ({
    name:
      p.priority === "LOW"
        ? "Faible"
        : p.priority === "MEDIUM"
        ? "Normale"
        : p.priority === "HIGH"
        ? "Haute"
        : "Urgente",
    value: p._count.priority,
  }));

  const avgMissionsPerUser = totalUsers > 0 ? (totalMissions / totalUsers).toFixed(1) : 0;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Statistiques</h1>
        <p className="text-slate-500 mt-1">Analyse complète de la plateforme AlternHub</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total utilisateurs</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{totalUsers}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total missions</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{totalMissions}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center">
              <Target className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Compétences tracées</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{totalSkills}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-violet-100 flex items-center justify-center">
              <Zap className="h-5 w-5 text-violet-600" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Missions / Utilisateur</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{avgMissionsPerUser}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {/* Missions by Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary-500" />
              Missions par statut
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StatsChart type="bar" data={statusData} color="#6366f1" dataKey="value" nameKey="name" />
            <div className="mt-4 grid grid-cols-2 gap-2">
              {statusData.map((s) => (
                <div key={s.name} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                  <span className="text-xs text-slate-600">{s.name}</span>
                  <span className="text-sm font-bold text-slate-800">{s.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Skills */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4 text-violet-500" />
              Compétences les plus populaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topSkillsWithNames.map((skill, i) => (
                <div key={skill.name} className="flex items-center gap-3">
                  <span className="w-5 text-xs font-bold text-slate-400">#{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">{skill.name}</span>
                      <span className="text-xs text-slate-400">{skill.count} étudiants</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-primary-600 rounded-full"
                        style={{
                          width: `${(skill.count / (topSkillsWithNames[0]?.count ?? 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Students */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="h-4 w-4 text-orange-500" />
            Top étudiants (par nombre de missions)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {usersWithMissions.map((user, i) => (
              <div key={user.id} className="flex items-center gap-4 px-6 py-3">
                <span className="w-6 text-sm font-bold text-slate-400">#{i + 1}</span>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 text-sm">{user.name ?? user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-violet-500 rounded-full"
                      style={{
                        width: `${(user._count.missions / (usersWithMissions[0]?._count.missions ?? 1)) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-700 w-8 text-right">
                    {user._count.missions}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
