import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Target, Zap, Search } from "lucide-react";
import { getInitials, formatDate } from "@/lib/utils";

export const metadata = { title: "Gestion des utilisateurs" };

export default async function UsersPage({
  searchParams,
}: {
  searchParams: { q?: string; role?: string };
}) {
  const { q = "", role = "ALL" } = searchParams;

  const users = await prisma.user.findMany({
    where: {
      ...(q && {
        OR: [
          { name: { contains: q } },
          { email: { contains: q } },
        ],
      }),
      ...(role !== "ALL" && { role }),
    },
    include: {
      profile: true,
      _count: { select: { missions: true, skills: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalStudents = await prisma.user.count({ where: { role: "STUDENT" } });
  const totalAdmins = await prisma.user.count({ where: { role: "ADMIN" } });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Utilisateurs</h1>
        <p className="text-slate-500 mt-1">
          {users.length} utilisateurs · {totalStudents} étudiants · {totalAdmins} admins
        </p>
      </div>

      {/* Filters */}
      <form method="GET" className="mb-6 flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Rechercher par nom ou email..."
            className="flex h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          name="role"
          defaultValue={role}
          className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="ALL">Tous les rôles</option>
          <option value="STUDENT">Étudiants</option>
          <option value="ADMIN">Admins</option>
        </select>
        <button
          type="submit"
          className="h-9 rounded-lg bg-primary-600 px-4 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
        >
          Filtrer
        </button>
      </form>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    École / Entreprise
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Missions
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Compétences
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Inscrit le
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-slate-900 text-sm">{user.name ?? "—"}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {user.profile?.school && (
                          <p className="text-slate-700">{user.profile.school}</p>
                        )}
                        {user.profile?.company && (
                          <p className="text-slate-500 text-xs">{user.profile.company}</p>
                        )}
                        {!user.profile?.school && !user.profile?.company && (
                          <span className="text-slate-400">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-sm font-medium text-slate-700">
                        <Target className="h-3.5 w-3.5 text-slate-400" />
                        {user._count.missions}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-sm font-medium text-slate-700">
                        <Zap className="h-3.5 w-3.5 text-slate-400" />
                        {user._count.skills}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={user.role === "ADMIN" ? "destructive" : "default"}
                        className="text-xs"
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <Users className="h-10 w-10 mb-3 opacity-20" />
                <p>Aucun utilisateur trouvé</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
