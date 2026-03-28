"use client";

import { useState } from "react";
import { Plus, Eye, Edit2, Trash2, CheckCircle2, Clock, Archive, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OffreItem {
  id: string;
  title: string;
  contractType: string;
  location: string | null;
  status: string;
  viewCount: number;
  salary: string | null;
  duration: string | null;
  requiredLevel: string | null;
  createdAt: Date;
  skills: { required: boolean; skill: { name: string } }[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  PUBLISHED: { label: "Publiée",    color: "text-green-700",  bg: "bg-green-100",  icon: CheckCircle2 },
  DRAFT:     { label: "Brouillon",  color: "text-amber-700",  bg: "bg-amber-100",  icon: Clock },
  CLOSED:    { label: "Fermée",     color: "text-slate-600",  bg: "bg-slate-100",  icon: Archive },
};

interface Props { offres: OffreItem[] }

export function OffresRecruteurClient({ offres }: Props) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/offres/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    window.location.reload();
  }

  async function deleteOffre(id: string) {
    if (!confirm("Supprimer cette offre ?")) return;
    await fetch(`/api/offres/${id}`, { method: "DELETE" });
    window.location.reload();
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mes Offres</h1>
          <p className="text-slate-500 text-sm mt-1">{offres.length} offre{offres.length !== 1 ? "s" : ""} créée{offres.length !== 1 ? "s" : ""}</p>
        </div>
        <a
          href="/recruteur/offres/new"
          className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Nouvelle offre
        </a>
      </div>

      {offres.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 mb-4">
            <Plus className="h-8 w-8" />
          </div>
          <p className="font-medium text-slate-600">Aucune offre pour l&apos;instant</p>
          <p className="text-sm mt-1">Publiez votre première offre d&apos;alternance</p>
          <a href="/recruteur/offres/new" className="mt-4 rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 transition-colors">
            Créer une offre
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {offres.map((offre) => {
            const cfg = STATUS_CONFIG[offre.status] ?? STATUS_CONFIG.DRAFT;
            const Icon = cfg.icon;

            return (
              <Card key={offre.id} className="hover:shadow-md transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${cfg.bg}`}>
                      <Icon className={`h-5 w-5 ${cfg.color}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-slate-900">{offre.title}</h3>
                          <div className="flex flex-wrap gap-2 mt-1 text-xs text-slate-500">
                            <span className="rounded-full bg-slate-100 px-2 py-0.5">{offre.contractType}</span>
                            {offre.location && <span>{offre.location}</span>}
                            {offre.duration && <span>· {offre.duration}</span>}
                            {offre.requiredLevel && <span className="rounded-full bg-blue-50 text-blue-700 px-2 py-0.5">{offre.requiredLevel}</span>}
                            {offre.salary && <span>· {offre.salary}</span>}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
                            {cfg.label}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <Eye className="h-3.5 w-3.5" />{offre.viewCount}
                          </span>

                          {/* Menu */}
                          <div className="relative">
                            <button
                              onClick={() => setActiveMenu(activeMenu === offre.id ? null : offre.id)}
                              className="rounded-lg p-1.5 hover:bg-slate-100 transition-colors"
                            >
                              <MoreHorizontal className="h-4 w-4 text-slate-400" />
                            </button>
                            {activeMenu === offre.id && (
                              <div className="absolute right-0 top-8 z-10 w-44 rounded-xl bg-white border border-slate-200 shadow-lg overflow-hidden">
                                {offre.status !== "PUBLISHED" && (
                                  <button onClick={() => updateStatus(offre.id, "PUBLISHED")} className="w-full px-4 py-2.5 text-left text-sm text-green-600 hover:bg-green-50 font-medium">
                                    ✓ Publier
                                  </button>
                                )}
                                {offre.status !== "DRAFT" && (
                                  <button onClick={() => updateStatus(offre.id, "DRAFT")} className="w-full px-4 py-2.5 text-left text-sm text-amber-600 hover:bg-amber-50 font-medium">
                                    Mettre en brouillon
                                  </button>
                                )}
                                {offre.status !== "CLOSED" && (
                                  <button onClick={() => updateStatus(offre.id, "CLOSED")} className="w-full px-4 py-2.5 text-left text-sm text-slate-600 hover:bg-slate-50 font-medium">
                                    Fermer l&apos;offre
                                  </button>
                                )}
                                <div className="border-t border-slate-100" />
                                <button onClick={() => deleteOffre(offre.id)} className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 font-medium">
                                  Supprimer
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {offre.skills.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {offre.skills.slice(0, 6).map((s) => (
                            <span key={s.skill.name} className={`rounded-full px-2 py-0.5 text-[11px] font-medium border ${
                              s.required ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-slate-50 text-slate-500 border-slate-200"
                            }`}>
                              {s.skill.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-xs text-slate-400">
                      Créée le {new Date(offre.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                    <a
                      href={`/recruteur/offres/${offre.id}/edit`}
                      className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <Edit2 className="h-3.5 w-3.5" /> Modifier
                    </a>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
