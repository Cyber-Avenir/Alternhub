"use client";

import { useState } from "react";
import {
  Gift, Search, ExternalLink, Home, Train, UtensilsCrossed,
  Laptop, BookOpen, Landmark, Gamepad2, Sparkles,
  BadgeEuro, Building2, ChevronRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BonPlan, Aide } from "@prisma/client";

// ─── Category Config ───────────────────────────────────────
const PLAN_CATEGORIES: Record<string, { label: string; icon: typeof Gift; color: string; bg: string }> = {
  LOGEMENT:    { label: "Logement",     icon: Home,          color: "text-blue-600",    bg: "bg-blue-50 border-blue-200" },
  TRANSPORT:   { label: "Transport",    icon: Train,         color: "text-green-600",   bg: "bg-green-50 border-green-200" },
  ALIMENTATION:{ label: "Alimentation", icon: UtensilsCrossed, color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
  TECH:        { label: "Tech & Dev",   icon: Laptop,        color: "text-violet-600",  bg: "bg-violet-50 border-violet-200" },
  FORMATION:   { label: "Culture",      icon: BookOpen,      color: "text-rose-600",    bg: "bg-rose-50 border-rose-200" },
  BANQUE:      { label: "Banque",       icon: Landmark,      color: "text-slate-600",   bg: "bg-slate-50 border-slate-200" },
  LOISIRS:     { label: "Loisirs",      icon: Gamepad2,      color: "text-yellow-600",  bg: "bg-yellow-50 border-yellow-200" },
};

const AIDE_CATEGORIES: Record<string, { label: string; icon: typeof Gift; color: string }> = {
  LOGEMENT:  { label: "Logement",  icon: Home,      color: "text-blue-600" },
  PRIME:     { label: "Primes",    icon: BadgeEuro, color: "text-green-600" },
  SOCIAL:    { label: "Social",    icon: Sparkles,  color: "text-violet-600" },
  FORMATION: { label: "Formation", icon: BookOpen,  color: "text-rose-600" },
};

interface Props { bonsPlans: BonPlan[]; aides: Aide[]; }

export function BonsPlansClient({ bonsPlans, aides }: Props) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");

  const planCategories = [...new Set(bonsPlans.map((p) => p.category))];
  const filteredPlans = bonsPlans.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "ALL" || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  const filteredAides = aides.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.description.toLowerCase().includes(search.toLowerCase())
  );

  const totalEco = bonsPlans.filter((p) => p.discount).length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
            <Gift className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Bons Plans & Aides</h1>
            <p className="text-slate-500 text-sm">
              {bonsPlans.length} bons plans · {aides.length} aides financières · données mises à jour régulièrement
            </p>
          </div>
        </div>

        {/* Highlight banner */}
        <div className="mt-4 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 p-5 text-white">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-green-200" />
            <div>
              <p className="font-bold text-lg">
                En tant qu&apos;alternant, vous avez accès à des centaines d&apos;avantages
              </p>
              <p className="text-green-100 text-sm mt-0.5">
                Logement, transport, tech, culture, alimentation... Découvrez tout ce à quoi vous avez droit.
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <div className="rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-center">
              <p className="text-2xl font-bold">{bonsPlans.length}</p>
              <p className="text-xs text-green-100">Bons plans</p>
            </div>
            <div className="rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-center">
              <p className="text-2xl font-bold">{aides.length}</p>
              <p className="text-xs text-green-100">Aides financières</p>
            </div>
            <div className="rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-center">
              <p className="text-2xl font-bold">{totalEco}</p>
              <p className="text-xs text-green-100">Réductions actives</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Rechercher un bon plan, une aide..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Tabs defaultValue="bonsplans">
        <TabsList className="mb-6">
          <TabsTrigger value="bonsplans">
            Bons Plans ({bonsPlans.length})
          </TabsTrigger>
          <TabsTrigger value="aides">
            Aides Financières ({aides.length})
          </TabsTrigger>
        </TabsList>

        {/* ─── BONS PLANS ─── */}
        <TabsContent value="bonsplans">
          {/* Category filter */}
          <div className="flex gap-2 flex-wrap mb-6">
            <button
              onClick={() => setActiveCategory("ALL")}
              className={`rounded-full px-4 py-1.5 text-sm font-medium border transition-all ${
                activeCategory === "ALL"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
              }`}
            >
              Tout voir
            </button>
            {planCategories.map((cat) => {
              const config = PLAN_CATEGORIES[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium border transition-all ${
                    activeCategory === cat
                      ? `${config?.bg ?? "bg-slate-50 border-slate-200"} ${config?.color ?? "text-slate-600"} shadow-sm`
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {config && <config.icon className="h-3.5 w-3.5" />}
                  {config?.label ?? cat}
                </button>
              );
            })}
          </div>

          {/* Plans grid */}
          {filteredPlans.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Gift className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>Aucun bon plan trouvé pour cette recherche</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPlans.map((plan) => {
                const config = PLAN_CATEGORIES[plan.category];
                return (
                  <a
                    key={plan.id}
                    href={plan.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
                  >
                    {/* Category pill */}
                    <div className={`mb-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${config?.bg ?? "bg-slate-50 border-slate-200"} ${config?.color ?? "text-slate-600"}`}>
                      {config && <config.icon className="h-3 w-3" />}
                      {config?.label ?? plan.category}
                    </div>

                    {/* Discount badge */}
                    {plan.discount && (
                      <div className="absolute top-4 right-4 rounded-full bg-green-100 border border-green-200 px-2.5 py-1 text-xs font-bold text-green-700">
                        {plan.discount}
                      </div>
                    )}

                    <h3 className="font-semibold text-slate-900 mb-2 pr-16 leading-tight">
                      {plan.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                      {plan.description}
                    </p>

                    {/* Price info */}
                    {(plan.originalPrice || plan.finalPrice) && (
                      <div className="mt-3 flex items-center gap-2">
                        {plan.originalPrice && (
                          <span className="text-sm text-slate-400 line-through">{plan.originalPrice}</span>
                        )}
                        {plan.finalPrice && (
                          <span className="text-sm font-bold text-green-600">{plan.finalPrice}</span>
                        )}
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-slate-400">{plan.source}</span>
                      <span className="flex items-center gap-1 text-xs font-medium text-primary-600 group-hover:gap-2 transition-all">
                        Accéder <ExternalLink className="h-3 w-3" />
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* ─── AIDES FINANCIÈRES ─── */}
        <TabsContent value="aides">
          {filteredAides.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <BadgeEuro className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>Aucune aide trouvée</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAides.map((aide) => {
                const config = AIDE_CATEGORIES[aide.category];
                return (
                  <div
                    key={aide.id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${config ? "bg-blue-50 border-blue-200" : "bg-slate-50 border-slate-200"}`}>
                        {config ? (
                          <config.icon className={`h-5 w-5 ${config.color}`} />
                        ) : (
                          <Building2 className="h-5 w-5 text-slate-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-bold text-slate-900 text-base">{aide.title}</h3>
                            <p className="text-sm text-primary-600 font-medium mt-0.5">{aide.organisme}</p>
                          </div>
                          {aide.amount && (
                            <div className="shrink-0 rounded-xl bg-green-50 border border-green-200 px-3 py-1.5 text-center">
                              <p className="text-sm font-bold text-green-700 whitespace-nowrap">{aide.amount}</p>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mt-2 leading-relaxed">{aide.description}</p>
                        {aide.eligibility && (
                          <div className="mt-3 rounded-lg bg-blue-50 border border-blue-100 p-3">
                            <p className="text-xs font-semibold text-blue-700 mb-1">Conditions d&apos;éligibilité</p>
                            <p className="text-xs text-blue-600">{aide.eligibility}</p>
                          </div>
                        )}
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            {config && (
                              <span className={`text-xs font-medium ${config.color}`}>
                                {config.label}
                              </span>
                            )}
                          </div>
                          <a
                            href={aide.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-700 transition-colors"
                          >
                            Faire ma demande <ChevronRight className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200 p-4">
            <p className="text-xs text-slate-500">
              <strong>Note :</strong> Les montants et conditions peuvent évoluer. AlternHub met à jour régulièrement ces informations.
              Vérifiez toujours les conditions sur les sites officiels avant de faire votre demande.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
