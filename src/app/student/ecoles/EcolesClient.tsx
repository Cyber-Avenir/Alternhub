"use client";

import { useState } from "react";
import {
  GraduationCap, Search, Star, TrendingUp, Users, Euro,
  ExternalLink, MapPin, Filter, CheckCircle2, ChevronDown,
  Phone, Mail, Lock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const CATEGORY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  INFORMATIQUE: { label: "Informatique",  color: "text-blue-700",   bg: "bg-blue-50 border-blue-200" },
  FINANCE:      { label: "Finance",       color: "text-green-700",  bg: "bg-green-50 border-green-200" },
  COMMERCE:     { label: "Commerce",      color: "text-amber-700",  bg: "bg-amber-50 border-amber-200" },
  DESIGN:       { label: "Design",        color: "text-rose-700",   bg: "bg-rose-50 border-rose-200" },
  INGENIERIE:   { label: "Ingénierie",    color: "text-violet-700", bg: "bg-violet-50 border-violet-200" },
  AUTRE:        { label: "Autre",         color: "text-slate-700",  bg: "bg-slate-50 border-slate-200" },
};

const TYPE_LABELS: Record<string, string> = {
  GRANDE_ECOLE: "Grande École",
  UNIVERSITE:   "Université",
  CFA:          "CFA",
  BTS:          "BTS / BUT",
  MASTER:       "Master spécialisé",
};

interface Ecole {
  id: string;
  name: string;
  city: string | null;
  region: string | null;
  type: string | null;
  category: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  description: string | null;
  tags: string;
  specialities: string;
  successRate: number | null;
  alternanceRate: number | null;
  employmentRate: number | null;
  avgSalary: string | null;
  tuitionFee: string | null;
  duration: string | null;
  levels: string;
  isPremium: boolean;
}

export function EcolesClient({ ecoles }: { ecoles: Ecole[] }) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const categories = [...new Set(ecoles.map((e) => e.category).filter(Boolean))] as string[];

  const filtered = ecoles.filter((e) => {
    const q = search.toLowerCase();
    const matchSearch = !q || e.name.toLowerCase().includes(q) || (e.city?.toLowerCase().includes(q) ?? false) || (e.description?.toLowerCase().includes(q) ?? false);
    const matchCat = categoryFilter === "ALL" || e.category === categoryFilter;
    const matchType = !typeFilter || e.type === typeFilter;
    return matchSearch && matchCat && matchType;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-violet-600">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Écoles & Formations</h1>
            <p className="text-slate-500 text-sm">
              {ecoles.length} établissements · Taux de réussite · Informations vérifiées
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Rechercher une école, une ville..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Tous types</option>
            {Object.entries(TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button
          onClick={() => setCategoryFilter("ALL")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium border transition-all ${
            categoryFilter === "ALL" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
          }`}
        >
          Toutes
        </button>
        {categories.map((cat) => {
          const cfg = CATEGORY_CONFIG[cat];
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium border transition-all ${
                categoryFilter === cat ? `${cfg?.bg} ${cfg?.color} shadow-sm` : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
              }`}
            >
              {cfg?.label ?? cat}
            </button>
          );
        })}
      </div>

      <p className="text-sm text-slate-500 mb-4">{filtered.length} école{filtered.length !== 1 ? "s" : ""} trouvée{filtered.length !== 1 ? "s" : ""}</p>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((ecole) => {
          const cfg = ecole.category ? CATEGORY_CONFIG[ecole.category] : null;
          const tags: string[] = (() => { try { return JSON.parse(ecole.tags); } catch { return []; } })();
          const specialities: string[] = (() => { try { return JSON.parse(ecole.specialities); } catch { return []; } })();
          const levels: string[] = (() => { try { return JSON.parse(ecole.levels); } catch { return []; } })();
          const isExpanded = selected === ecole.id;

          return (
            <div key={ecole.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all">
              <div
                className="p-5 cursor-pointer"
                onClick={() => setSelected(isExpanded ? null : ecole.id)}
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 text-xl font-bold text-slate-600">
                    {ecole.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 leading-tight">{ecole.name}</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      {ecole.city && (
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <MapPin className="h-3 w-3" />{ecole.city}
                        </span>
                      )}
                      {ecole.type && (
                        <span className="text-xs text-slate-400">· {TYPE_LABELS[ecole.type] ?? ecole.type}</span>
                      )}
                    </div>
                  </div>
                  {cfg && (
                    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold ${cfg.bg} ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {ecole.successRate !== null && (
                    <div className="rounded-lg bg-green-50 border border-green-100 p-2 text-center">
                      <p className="text-sm font-bold text-green-700">{ecole.successRate}%</p>
                      <p className="text-[9px] text-green-500">Réussite</p>
                    </div>
                  )}
                  {ecole.alternanceRate !== null && (
                    <div className="rounded-lg bg-blue-50 border border-blue-100 p-2 text-center">
                      <p className="text-sm font-bold text-blue-700">{ecole.alternanceRate}%</p>
                      <p className="text-[9px] text-blue-500">Alternance</p>
                    </div>
                  )}
                  {ecole.employmentRate !== null && (
                    <div className="rounded-lg bg-violet-50 border border-violet-100 p-2 text-center">
                      <p className="text-sm font-bold text-violet-700">{ecole.employmentRate}%</p>
                      <p className="text-[9px] text-violet-500">Emploi 6 mois</p>
                    </div>
                  )}
                </div>

                {ecole.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{ecole.description}</p>
                )}

                {/* Quick tags */}
                {tags.slice(0, 3).length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Expanded */}
              {isExpanded && (
                <div className="border-t border-slate-100 p-5 space-y-4">
                  {ecole.avgSalary && (
                    <div className="flex items-center gap-2">
                      <Euro className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-600">Salaire moyen : <strong>{ecole.avgSalary}</strong></span>
                    </div>
                  )}
                  {ecole.duration && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-600">Durée : <strong>{ecole.duration}</strong></span>
                    </div>
                  )}
                  {ecole.tuitionFee && (
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-600">Frais : <strong>{ecole.tuitionFee}</strong></span>
                    </div>
                  )}
                  {levels.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1.5">Niveaux de formation</p>
                      <div className="flex flex-wrap gap-1.5">
                        {levels.map((l) => (
                          <span key={l} className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-700">{l}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {specialities.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1.5">Spécialités</p>
                      <div className="flex flex-wrap gap-1">
                        {specialities.map((s) => (
                          <span key={s} className="rounded bg-primary-50 border border-primary-100 px-2 py-0.5 text-[11px] text-primary-700">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contact — premium gated */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
                    <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" /> Contact
                    </p>
                    {ecole.isPremium ? (
                      <div className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2">
                        <Lock className="h-4 w-4 text-amber-500" />
                        <span className="text-xs text-amber-700 font-medium">Téléphone & email disponibles avec l&apos;abonnement Premium</span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {ecole.phone && (
                          <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 text-slate-400" />{ecole.phone}
                          </p>
                        )}
                        {ecole.email && (
                          <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5 text-slate-400" />{ecole.email}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {ecole.website && (
                    <a
                      href={ecole.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
                    >
                      Visiter le site officiel <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
