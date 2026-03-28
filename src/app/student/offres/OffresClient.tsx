"use client";

import { useState, useMemo } from "react";
import {
  Search, MapPin, Clock, Euro, Building2, Zap, Target,
  Filter, ChevronDown, ExternalLink, Sparkles, BookmarkPlus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { computeMatchScore, getMatchLabel } from "@/lib/matching";

const CONTRACT_LABELS: Record<string, string> = {
  ALTERNANCE: "Alternance",
  STAGE: "Stage",
  CDI: "CDI",
  CDD: "CDD",
};

const LEVEL_OPTIONS = ["", "BAC+2", "BAC+3", "BAC+4", "BAC+5"];
const CONTRACT_OPTIONS = ["", "ALTERNANCE", "STAGE", "CDI", "CDD"];

interface OffreWithRelations {
  id: string;
  title: string;
  description: string;
  contractType: string;
  location: string | null;
  remote: boolean;
  salary: string | null;
  duration: string | null;
  requiredLevel: string | null;
  tags: string;
  createdAt: Date;
  recruteur: {
    name: string | null;
    recruteurProfile: { companyName: string; companyLogoUrl: string | null } | null;
  };
  skills: {
    required: boolean;
    weight: number;
    skill: { id: string; name: string; category: string };
  }[];
}

interface UserSkillItem {
  skillId: string;
  level: number;
}

interface Props {
  offres: OffreWithRelations[];
  userSkills: { skillId: string; level: number; skill: { name: string } }[];
}

export function OffresClient({ offres, userSkills }: Props) {
  const [search, setSearch] = useState("");
  const [contractFilter, setContractFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"match" | "date">("match");

  const studentSkills: UserSkillItem[] = userSkills.map((us) => ({
    skillId: us.skillId,
    level: us.level,
  }));

  const scoredOffres = useMemo(() => {
    return offres.map((offre) => {
      const offreSkills = offre.skills.map((s) => ({
        skillId: s.skill.id,
        required: s.required,
        weight: s.weight,
      }));
      const matchScore = computeMatchScore(studentSkills, offreSkills);
      return { ...offre, matchScore };
    });
  }, [offres, userSkills]);

  const filtered = useMemo(() => {
    let list = scoredOffres.filter((o) => {
      const q = search.toLowerCase();
      const matches =
        !q ||
        o.title.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q) ||
        (o.recruteur.recruteurProfile?.companyName.toLowerCase().includes(q) ?? false) ||
        (o.location?.toLowerCase().includes(q) ?? false);
      const contract = !contractFilter || o.contractType === contractFilter;
      const level = !levelFilter || o.requiredLevel === levelFilter;
      const remote = !remoteOnly || o.remote;
      return matches && contract && level && remote;
    });

    if (sortBy === "match") {
      list = [...list].sort((a, b) => b.matchScore - a.matchScore);
    } else {
      list = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }, [scoredOffres, search, contractFilter, levelFilter, remoteOnly, sortBy]);

  const topMatches = filtered.filter((o) => o.matchScore >= 60).length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-violet-600">
            <Search className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Offres d&apos;alternance</h1>
            <p className="text-slate-500 text-sm">
              {offres.length} offres disponibles · Score de compatibilité basé sur vos compétences
            </p>
          </div>
        </div>

        {/* Match summary banner */}
        {topMatches > 0 && (
          <div className="mt-4 rounded-2xl bg-gradient-to-r from-primary-600 to-violet-600 p-4 text-white flex items-center gap-4">
            <Sparkles className="h-6 w-6 text-primary-200 shrink-0" />
            <div>
              <p className="font-bold">
                {topMatches} offre{topMatches > 1 ? "s" : ""} correspondant à votre profil à 60%+
              </p>
              <p className="text-primary-200 text-sm mt-0.5">
                Basé sur vos {userSkills.length} compétences renseignées
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Rechercher poste, entreprise, ville..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="relative">
          <select
            value={contractFilter}
            onChange={(e) => setContractFilter(e.target.value)}
            className="appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Tous contrats</option>
            {CONTRACT_OPTIONS.filter(Boolean).map((c) => (
              <option key={c} value={c}>{CONTRACT_LABELS[c]}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Tous niveaux</option>
            {LEVEL_OPTIONS.filter(Boolean).map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>

        <button
          onClick={() => setRemoteOnly((v) => !v)}
          className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
            remoteOnly
              ? "border-primary-500 bg-primary-50 text-primary-700"
              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
          }`}
        >
          🏠 Télétravail
        </button>

        <div className="flex rounded-lg border border-slate-200 overflow-hidden">
          <button
            onClick={() => setSortBy("match")}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              sortBy === "match" ? "bg-primary-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Zap className="h-3.5 w-3.5 inline mr-1" />Match
          </button>
          <button
            onClick={() => setSortBy("date")}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              sortBy === "date" ? "bg-primary-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Clock className="h-3.5 w-3.5 inline mr-1" />Date
          </button>
        </div>
      </div>

      {/* Results */}
      <p className="text-sm text-slate-500 mb-4">{filtered.length} résultat{filtered.length !== 1 ? "s" : ""}</p>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Search className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p>Aucune offre trouvée pour ces critères</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((offre) => {
            const matchInfo = getMatchLabel(offre.matchScore);
            const company = offre.recruteur.recruteurProfile?.companyName ?? offre.recruteur.name ?? "Entreprise";
            const tags: string[] = (() => { try { return JSON.parse(offre.tags); } catch { return []; } })();

            return (
              <Card key={offre.id} className="hover:shadow-md transition-all group">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Company logo */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 text-slate-600 font-bold text-lg">
                      {company.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-primary-600 transition-colors">
                            {offre.title}
                          </h3>
                          <p className="text-sm text-primary-600 font-medium mt-0.5">{company}</p>
                        </div>

                        {/* Match score */}
                        <div className={`shrink-0 rounded-xl border px-3 py-2 text-center ${matchInfo.bg}`}>
                          <p className={`text-xl font-extrabold ${matchInfo.color}`}>{offre.matchScore}%</p>
                          <p className={`text-[10px] font-medium ${matchInfo.color} whitespace-nowrap`}>{matchInfo.label}</p>
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">
                        {offre.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />{offre.location}
                          </span>
                        )}
                        {offre.remote && (
                          <span className="flex items-center gap-1 text-green-600">
                            🏠 Télétravail possible
                          </span>
                        )}
                        {offre.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />{offre.duration}
                          </span>
                        )}
                        {offre.salary && (
                          <span className="flex items-center gap-1">
                            <Euro className="h-3.5 w-3.5" />{offre.salary}
                          </span>
                        )}
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium">
                          {CONTRACT_LABELS[offre.contractType] ?? offre.contractType}
                        </span>
                        {offre.requiredLevel && (
                          <span className="rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 text-xs font-medium">
                            {offre.requiredLevel}
                          </span>
                        )}
                      </div>

                      {/* Description preview */}
                      <p className="mt-3 text-sm text-slate-600 line-clamp-2 leading-relaxed">
                        {offre.description}
                      </p>

                      {/* Skills matching */}
                      {offre.skills.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {offre.skills.slice(0, 5).map((s) => {
                            const studentHas = userSkills.find((us) => us.skillId === s.skill.id);
                            return (
                              <span
                                key={s.skill.id}
                                className={`rounded-full px-2 py-0.5 text-[11px] font-medium border ${
                                  studentHas
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : s.required
                                    ? "bg-red-50 text-red-600 border-red-200"
                                    : "bg-slate-50 text-slate-500 border-slate-200"
                                }`}
                              >
                                {studentHas ? "✓ " : s.required ? "✗ " : ""}{s.skill.name}
                              </span>
                            );
                          })}
                          {offre.skills.length > 5 && (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">
                              +{offre.skills.length - 5}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Tags */}
                      {tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {tags.slice(0, 4).map((tag) => (
                            <span key={tag} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-xs text-slate-400">
                      Publié il y a {Math.ceil((Date.now() - new Date(offre.createdAt).getTime()) / 86400000)} jour{Math.ceil((Date.now() - new Date(offre.createdAt).getTime()) / 86400000) > 1 ? "s" : ""}
                    </span>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-300 transition-colors">
                        <BookmarkPlus className="h-3.5 w-3.5" />
                        Sauvegarder
                      </button>
                      <button className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-primary-700 transition-colors">
                        <Target className="h-3.5 w-3.5" />
                        Postuler
                      </button>
                    </div>
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
