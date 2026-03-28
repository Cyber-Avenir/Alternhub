import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  Briefcase, Users, Eye, TrendingUp, Plus, ArrowRight,
  Clock, Star, CheckCircle2, AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/shared/StatsCard";

export const metadata = { title: "Tableau de bord Recruteur" };

export default async function RecruteurDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  const userId = session.user.id!;

  const offres = await prisma.offre.findMany({
    where: { recruteurId: userId },
    orderBy: { createdAt: "desc" },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { recruteurProfile: true },
  });

  const published = offres.filter((o) => o.status === "PUBLISHED").length;
  const totalViews = offres.reduce((s, o) => s + o.viewCount, 0);
  const recentOffres = offres.slice(0, 5);

  const companyName = user?.recruteurProfile?.companyName ?? "votre entreprise";
  const tier = user?.subscriptionTier ?? "FREE";

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-slate-500">Espace recruteur</p>
        <h1 className="text-3xl font-bold text-slate-900 mt-1">
          Bonjour 👋
        </h1>
        <p className="text-slate-500 mt-1">{companyName} · Plan {tier}</p>
      </div>

      {/* Upgrade banner for FREE */}
      {tier === "FREE" && (
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-rose-600 to-orange-600 p-5 text-white flex items-center gap-4">
          <Star className="h-8 w-8 text-rose-200 shrink-0" />
          <div className="flex-1">
            <p className="font-bold text-lg">Passez au plan Pro</p>
            <p className="text-rose-100 text-sm mt-0.5">
              Publiez jusqu&apos;à 20 offres, accédez aux CV complets et aux coordonnées des candidats
            </p>
          </div>
          <a
            href="/recruteur/abonnement"
            className="shrink-0 rounded-xl bg-white px-4 py-2 text-sm font-bold text-rose-700 hover:bg-rose-50 transition-colors"
          >
            Voir les plans
          </a>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard title="Offres publiées" value={published} subtitle={`${offres.length} au total`} icon={Briefcase} color="blue" />
        <StatsCard title="Vues totales" value={totalViews} subtitle="Sur toutes vos offres" icon={Eye} color="green" />
        <StatsCard title="Candidats matchés" value={0} subtitle="En attente de candidatures" icon={Users} color="violet" />
        <StatsCard title="Quota offres" value={`${published}/${user?.recruteurProfile?.offreQuota ?? 3}`} subtitle="Offres actives max" icon={TrendingUp} color="orange" />
      </div>

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Mes offres */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base">Mes offres récentes</CardTitle>
            <a href="/recruteur/offres" className="text-xs text-rose-600 hover:underline font-medium">
              Tout voir →
            </a>
          </CardHeader>
          <CardContent className="p-0">
            {recentOffres.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Briefcase className="h-10 w-10 mb-3 opacity-30" />
                <p className="text-sm">Aucune offre publiée</p>
                <a href="/recruteur/offres/new" className="mt-2 flex items-center gap-1 text-xs text-rose-600 hover:underline font-medium">
                  <Plus className="h-3 w-3" /> Publier votre première offre
                </a>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentOffres.map((offre) => {
                  const statusConfig = offre.status === "PUBLISHED"
                    ? { color: "text-green-600", bg: "bg-green-50", label: "Publiée", icon: CheckCircle2 }
                    : offre.status === "DRAFT"
                    ? { color: "text-amber-600", bg: "bg-amber-50", label: "Brouillon", icon: Clock }
                    : { color: "text-slate-500", bg: "bg-slate-50", label: offre.status, icon: AlertCircle };
                  const SIcon = statusConfig.icon;

                  return (
                    <div key={offre.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${statusConfig.bg}`}>
                        <SIcon className={`h-4 w-4 ${statusConfig.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{offre.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-400">{offre.contractType}</span>
                          {offre.location && <span className="text-xs text-slate-400">· {offre.location}</span>}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-medium text-slate-600">{offre.viewCount} vues</p>
                        <span className={`text-[10px] font-semibold ${statusConfig.color}`}>{statusConfig.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                href: "/recruteur/offres/new",
                icon: Plus,
                label: "Publier une offre d'alternance",
                desc: "Trouvez votre futur alternant",
                color: "text-rose-600",
                bg: "bg-rose-50",
              },
              {
                href: "/recruteur/candidats",
                icon: Users,
                label: "Explorer les profils étudiants",
                desc: "Swipez les candidats correspondants",
                color: "text-violet-600",
                bg: "bg-violet-50",
              },
              {
                href: "/recruteur/pipeline",
                icon: TrendingUp,
                label: "Pipeline de recrutement",
                desc: "Suivez vos candidatures en cours",
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
            ].map(({ href, icon: Icon, label, desc, color, bg }) => (
              <a
                key={href}
                href={href}
                className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </a>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
