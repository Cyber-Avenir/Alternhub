import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  Target, Zap, Trophy, TrendingUp, Clock, CheckCircle2,
  Circle, AlertCircle, Briefcase, Bell, ArrowRight,
  ChevronRight,
} from "lucide-react";
import { StatsCard } from "@/components/shared/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import {
  getStatusLabel,
  getStatusColor,
  getPriorityColor,
  getPriorityLabel,
  parseTags,
  calculateScore,
  formatDateRelative,
} from "@/lib/utils";
import { ActivityChart } from "./ActivityChart";

export const metadata = { title: "Tableau de bord" };

const CAND_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  WISHLIST:  { label: "Wishlist",    color: "text-slate-600",  bg: "bg-slate-100",  dot: "bg-slate-400" },
  APPLIED:   { label: "Postulé",     color: "text-blue-700",   bg: "bg-blue-100",   dot: "bg-blue-500" },
  INTERVIEW: { label: "Entretien",   color: "text-violet-700", bg: "bg-violet-100", dot: "bg-violet-500" },
  OFFER:     { label: "Offre reçue", color: "text-green-700",  bg: "bg-green-100",  dot: "bg-green-500" },
  REJECTED:  { label: "Refusé",      color: "text-red-700",    bg: "bg-red-100",    dot: "bg-red-500" },
};

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  const userId = session.user.id!;

  const [user, missions, userSkills, candidatures] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    }),
    prisma.mission.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.userSkill.findMany({
      where: { userId },
      include: { skill: true },
    }),
    prisma.candidature.findMany({
      where: { userId },
      orderBy: { lastActionAt: "desc" },
    }),
  ]);

  const completedMissions = missions.filter((m) => m.status === "COMPLETED").length;
  const inProgressMissions = missions.filter((m) => m.status === "IN_PROGRESS").length;
  const score = calculateScore(missions, userSkills.length, candidatures);
  const recentMissions = missions.slice(0, 5);

  // Candidature stats
  const candByStatus = {
    WISHLIST:  candidatures.filter((c) => c.status === "WISHLIST").length,
    APPLIED:   candidatures.filter((c) => c.status === "APPLIED").length,
    INTERVIEW: candidatures.filter((c) => c.status === "INTERVIEW").length,
    OFFER:     candidatures.filter((c) => c.status === "OFFER").length,
    REJECTED:  candidatures.filter((c) => c.status === "REJECTED").length,
  };
  const activeCount = candByStatus.APPLIED + candByStatus.INTERVIEW + candByStatus.OFFER;
  const recentCands = candidatures.slice(0, 3);

  // Smart alerts: candidatures in APPLIED for > 7 days with no update
  const staleAlerts = candidatures.filter((c) => {
    if (c.status !== "APPLIED") return false;
    const daysSince = differenceInDays(new Date(), new Date(c.lastActionAt));
    return daysSince >= 7;
  });

  const today = format(new Date(), "EEEE d MMMM yyyy", { locale: fr });
  const firstName = user?.name?.split(" ")[0] ?? "là";

  // Activity data for last 7 days
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayLabel = format(d, "EEE", { locale: fr });
    const mCount = missions.filter((m) => {
      const mDate = new Date(m.createdAt);
      return (
        mDate.getDate() === d.getDate() &&
        mDate.getMonth() === d.getMonth() &&
        mDate.getFullYear() === d.getFullYear()
      );
    }).length;
    const cCount = candidatures.filter((c) => {
      const cDate = new Date(c.lastActionAt);
      return (
        cDate.getDate() === d.getDate() &&
        cDate.getMonth() === d.getMonth() &&
        cDate.getFullYear() === d.getFullYear()
      );
    }).length;
    return { day: dayLabel, missions: mCount, candidatures: cCount };
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-slate-500 capitalize">{today}</p>
        <h1 className="text-3xl font-bold text-slate-900 mt-1">
          Bonjour, {firstName} 👋
        </h1>
        <p className="text-slate-500 mt-1">
          {user?.profile?.company
            ? `Alternant chez ${user.profile.company} · ${user.profile.position ?? ""}`
            : "Bienvenue sur votre espace AlternHub"}
        </p>
      </div>

      {/* Smart alert banner */}
      {staleAlerts.length > 0 && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
          <Bell className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800">
              {staleAlerts.length === 1
                ? "1 candidature sans réponse depuis 7+ jours"
                : `${staleAlerts.length} candidatures sans réponse depuis 7+ jours`}
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              {staleAlerts.slice(0, 2).map((c) => c.company).join(", ")}
              {staleAlerts.length > 2 ? ` et ${staleAlerts.length - 2} autre(s)` : ""}
              {" "}— Pensez à relancer !
            </p>
          </div>
          <a
            href="/student/candidatures"
            className="shrink-0 rounded-lg bg-amber-100 border border-amber-200 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-200 transition-colors"
          >
            Voir le suivi
          </a>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Missions en cours"
          value={inProgressMissions}
          subtitle={`${missions.length} missions au total`}
          icon={Target}
          color="blue"
        />
        <StatsCard
          title="Missions terminées"
          value={completedMissions}
          subtitle={`${missions.length > 0 ? Math.round((completedMissions / missions.length) * 100) : 0}% du total`}
          icon={CheckCircle2}
          color="green"
        />
        <StatsCard
          title="Candidatures actives"
          value={activeCount}
          subtitle={`${candidatures.length} au total · ${candByStatus.INTERVIEW} entretiens`}
          icon={Briefcase}
          color="violet"
        />
        <StatsCard
          title="AlternScore"
          value={`${score}/100`}
          subtitle="Missions · Compétences · Candidatures"
          icon={Trophy}
          color="orange"
          trend={score > 50 ? { value: 12, label: "ce mois" } : undefined}
        />
      </div>

      {/* Candidature pipeline */}
      {candidatures.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-violet-500" />
              Pipeline de candidatures
            </h2>
            <a href="/student/candidatures" className="text-xs text-primary-600 hover:underline font-medium flex items-center gap-1">
              Gérer le Kanban <ArrowRight className="h-3 w-3" />
            </a>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {(["WISHLIST", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"] as const).map((status) => {
              const cfg = CAND_STATUS_CONFIG[status];
              const count = candByStatus[status];
              const isActive = count > 0;
              return (
                <div
                  key={status}
                  className={`rounded-xl border p-4 text-center transition-all ${
                    isActive
                      ? "border-slate-200 bg-white shadow-sm"
                      : "border-slate-100 bg-slate-50"
                  }`}
                >
                  <div className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${cfg.bg} mb-2`}>
                    <div className={`h-2.5 w-2.5 rounded-full ${cfg.dot}`} />
                  </div>
                  <p className={`text-2xl font-bold ${isActive ? cfg.color : "text-slate-300"}`}>
                    {count}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5 leading-tight">
                    {cfg.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Funnel bar */}
          {activeCount > 0 && (
            <div className="mt-4 rounded-xl bg-white border border-slate-200 p-4">
              <p className="text-xs font-semibold text-slate-500 mb-3">Taux de conversion du pipeline</p>
              <div className="space-y-2">
                {[
                  { label: "Postulé → Entretien", from: candByStatus.APPLIED + candByStatus.INTERVIEW, to: candByStatus.INTERVIEW, color: "bg-violet-500" },
                  { label: "Entretien → Offre", from: candByStatus.INTERVIEW, to: candByStatus.OFFER, color: "bg-green-500" },
                ].map(({ label, from, to, color }) => {
                  const rate = from > 0 ? Math.round((to / from) * 100) : 0;
                  return (
                    <div key={label} className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 w-36 shrink-0">{label}</span>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${color} rounded-full transition-all`}
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700 w-8 text-right">{rate}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Missions */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-base">Missions récentes</CardTitle>
              <a href="/student/missions" className="text-xs text-primary-600 hover:underline font-medium">
                Voir tout →
              </a>
            </CardHeader>
            <CardContent className="p-0">
              {recentMissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <Target className="h-10 w-10 mb-3 opacity-30" />
                  <p className="text-sm">Aucune mission pour l&apos;instant</p>
                  <a href="/student/missions" className="mt-2 text-xs text-primary-600 hover:underline">
                    Ajouter une mission →
                  </a>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentMissions.map((mission) => {
                    const tags = parseTags(mission.tags);
                    return (
                      <div key={mission.id} className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                        <div className="mt-0.5">
                          {mission.status === "COMPLETED" ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : mission.status === "IN_PROGRESS" ? (
                            <Clock className="h-4 w-4 text-blue-500" />
                          ) : mission.status === "CANCELLED" ? (
                            <AlertCircle className="h-4 w-4 text-red-400" />
                          ) : (
                            <Circle className="h-4 w-4 text-slate-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{mission.title}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${getStatusColor(mission.status)}`}>
                              {getStatusLabel(mission.status)}
                            </span>
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${getPriorityColor(mission.priority)}`}>
                              {getPriorityLabel(mission.priority)}
                            </span>
                            {tags.slice(0, 2).map((tag) => (
                              <span key={tag} className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-slate-400 shrink-0">
                          {formatDateRelative(mission.createdAt)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent candidatures */}
          {recentCands.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-violet-500" />
                  Candidatures récentes
                </CardTitle>
                <a href="/student/candidatures" className="text-xs text-primary-600 hover:underline font-medium">
                  Kanban complet →
                </a>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {recentCands.map((cand) => {
                    const cfg = CAND_STATUS_CONFIG[cand.status];
                    const daysSince = differenceInDays(new Date(), new Date(cand.lastActionAt));
                    const isStale = cand.status === "APPLIED" && daysSince >= 7;
                    return (
                      <div key={cand.id} className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50 transition-colors">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${cfg.bg}`}>
                          <div className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{cand.company}</p>
                          {cand.position && (
                            <p className="text-xs text-slate-400 truncate">{cand.position}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {isStale && (
                            <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                              {daysSince}j sans news
                            </span>
                          )}
                          <span className={`text-[10px] font-semibold rounded-full px-2 py-0.5 ${cfg.bg} ${cfg.color}`}>
                            {cfg.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Activity Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary-500" />
                Activité (7 jours)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityChart data={last7Days} />
            </CardContent>
          </Card>

          {/* AlternScore breakdown */}
          <Card className="bg-gradient-to-br from-primary-50 to-violet-50 border-primary-100">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100">
                  <Trophy className="h-4 w-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">AlternScore</p>
                  <p className="text-xs text-slate-500">Votre profil en un chiffre</p>
                </div>
                <span className="ml-auto text-2xl font-extrabold text-primary-700">{score}</span>
              </div>

              <div className="h-2.5 w-full bg-white rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-violet-500 rounded-full transition-all"
                  style={{ width: `${score}%` }}
                />
              </div>

              <div className="space-y-2">
                {[
                  {
                    label: "Missions terminées",
                    value: completedMissions,
                    max: 5,
                    pts: completedMissions * 10,
                    color: "bg-blue-400",
                  },
                  {
                    label: "Compétences tracées",
                    value: userSkills.length,
                    max: 10,
                    pts: Math.min(userSkills.length * 3, 30),
                    color: "bg-violet-400",
                  },
                  {
                    label: "Candidatures actives",
                    value: activeCount,
                    max: 5,
                    pts: Math.min(
                      candByStatus.APPLIED * 2 +
                      candByStatus.INTERVIEW * 5 +
                      candByStatus.OFFER * 10,
                      30
                    ),
                    color: "bg-green-400",
                  },
                ].map(({ label, value, max, pts, color }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-slate-500">{label}</span>
                      <span className="text-[11px] font-bold text-slate-600">+{pts} pts</span>
                    </div>
                    <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} rounded-full transition-all`}
                        style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
                      />
                    </div>
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
                Mes compétences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {userSkills.length === 0 ? (
                <div className="text-center py-4 text-slate-400 text-sm">
                  <a href="/student/skills" className="text-primary-600 hover:underline">
                    Ajouter des compétences →
                  </a>
                </div>
              ) : (
                userSkills.slice(0, 5).map((us) => (
                  <div key={us.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700">{us.skill.name}</span>
                        <span className="text-xs text-slate-400">{us.level}/5</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-500 to-violet-500 rounded-full transition-all"
                          style={{ width: `${(us.level / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
              {userSkills.length > 5 && (
                <a href="/student/skills" className="text-xs text-primary-600 hover:underline block text-center pt-1">
                  +{userSkills.length - 5} autres compétences
                </a>
              )}
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Ajouter une candidature", href: "/student/candidatures", icon: Briefcase, color: "text-violet-600" },
                { label: "Nouvelle mission", href: "/student/missions", icon: Target, color: "text-blue-600" },
                { label: "Simuler mon salaire", href: "/student/simulateur", icon: TrendingUp, color: "text-green-600" },
                { label: "Voir les bons plans", href: "/student/bons-plans", icon: Trophy, color: "text-orange-600" },
              ].map(({ label, href, icon: Icon, color }) => (
                <a
                  key={href}
                  href={href}
                  className="flex items-center gap-3 rounded-lg p-2.5 hover:bg-slate-50 transition-colors group"
                >
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 group-hover:bg-white transition-colors`}>
                    <Icon className={`h-3.5 w-3.5 ${color}`} />
                  </div>
                  <span className="text-sm text-slate-700 flex-1">{label}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-400 transition-colors" />
                </a>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
