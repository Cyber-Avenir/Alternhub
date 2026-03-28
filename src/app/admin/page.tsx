import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Users, Target, TrendingUp, GraduationCap, CheckCircle2, Clock, UserPlus } from "lucide-react";
import { StatsCard } from "@/components/shared/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials, formatDateRelative } from "@/lib/utils";
import { AdminCharts } from "./AdminCharts";
import { format, subDays, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";

export const metadata = { title: "Administration" };

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  const startOfThisMonth = new Date();
  startOfThisMonth.setDate(1);
  startOfThisMonth.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    totalStudents,
    totalMissions,
    completedMissions,
    newUsersThisMonth,
    recentUsers,
    allUsers,
    dailyMissions,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.mission.count(),
    prisma.mission.count({ where: { status: "COMPLETED" } }),
    prisma.user.count({ where: { createdAt: { gte: startOfThisMonth } } }),
    prisma.user.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { profile: true, _count: { select: { missions: true, skills: true } } },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "asc" },
      select: { createdAt: true },
    }),
    // missions per day for last 7 days
    prisma.mission.findMany({
      where: { createdAt: { gte: subDays(new Date(), 6) } },
      select: { createdAt: true, status: true },
    }),
  ]);

  // Build 7-day chart data
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = startOfDay(subDays(new Date(), 6 - i));
    const nextD = startOfDay(subDays(new Date(), 6 - i - 1));
    const count = dailyMissions.filter((m) => {
      const mDate = new Date(m.createdAt);
      return mDate >= d && mDate < nextD;
    }).length;
    return {
      day: format(d, "EEE", { locale: fr }),
      missions: count,
    };
  });

  // Build user growth data (last 30 days)
  const userGrowth = Array.from({ length: 30 }).map((_, i) => {
    const d = subDays(new Date(), 29 - i);
    const count = allUsers.filter((u) => new Date(u.createdAt) <= d).length;
    return {
      date: format(d, "dd/MM"),
      users: count,
    };
  }).filter((_, i) => i % 5 === 0); // sample every 5 days

  const today = format(new Date(), "EEEE d MMMM yyyy", { locale: fr });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-slate-500 capitalize">{today}</p>
        <h1 className="text-3xl font-bold text-slate-900 mt-1">Tableau de bord Admin</h1>
        <p className="text-slate-500 mt-1">Vue d&apos;ensemble de la plateforme AlternHub</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Utilisateurs totaux"
          value={totalUsers}
          subtitle={`+${newUsersThisMonth} ce mois`}
          icon={Users}
          color="blue"
          trend={{ value: Math.round((newUsersThisMonth / Math.max(totalUsers - newUsersThisMonth, 1)) * 100), label: "ce mois" }}
        />
        <StatsCard
          title="Étudiants actifs"
          value={totalStudents}
          subtitle="En alternance"
          icon={GraduationCap}
          color="violet"
        />
        <StatsCard
          title="Missions créées"
          value={totalMissions}
          subtitle={`${completedMissions} terminées`}
          icon={Target}
          color="green"
        />
        <StatsCard
          title="Taux de complétion"
          value={`${totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0}%`}
          subtitle="Missions terminées"
          icon={TrendingUp}
          color="orange"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary-500" />
              Croissance utilisateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AdminCharts type="users" data={userGrowth} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4 text-green-500" />
              Missions (7 derniers jours)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AdminCharts type="missions" data={last7Days} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Users */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-blue-500" />
            Derniers inscrits
          </CardTitle>
          <a href="/admin/users" className="text-xs text-primary-600 hover:underline font-medium">
            Voir tous les utilisateurs →
          </a>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50 transition-colors">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 text-sm truncate">{user.name ?? "—"}</p>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  {user.profile?.school && (
                    <span className="hidden md:block truncate max-w-[120px]">{user.profile.school}</span>
                  )}
                  <div className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    {user._count.missions}
                  </div>
                  <Badge variant={user.role === "ADMIN" ? "destructive" : "default"} className="text-[10px]">
                    {user.role}
                  </Badge>
                  <span className="text-slate-400">{formatDateRelative(user.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
