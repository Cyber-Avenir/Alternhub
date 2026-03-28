"use client";

import { useState } from "react";
import {
  TrendingUp, Target, Users, Star, Clock, Euro, ChevronRight,
  Plus, Briefcase, CheckCircle2, Quote, Zap, Trophy, ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CareerPathRecord {
  id: string;
  title: string;
  company: string | null;
  role: string | null;
  type: string;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
  description: string | null;
  skills: string;
}

interface CareerData {
  id: string;
  name: string;
  icon: string;
  avgSalary: string;
  successRate: number;
  timeToJob: string;
  keySkills: string[];
  topCompanies: string[];
  testimonials: { name: string; school: string; text: string; role: string }[];
}

interface Props {
  careerPaths: CareerPathRecord[];
  userSkills: { skillId: string; level: number; skill: { name: string; category: string } }[];
  candidatures: { status: string }[];
  missions: { status: string }[];
  careerData: CareerData[];
}

const TYPE_COLORS: Record<string, string> = {
  ALTERNANCE: "bg-primary-100 text-primary-700 border-primary-200",
  STAGE: "bg-blue-100 text-blue-700 border-blue-200",
  CDI: "bg-green-100 text-green-700 border-green-200",
  PROJET: "bg-violet-100 text-violet-700 border-violet-200",
};

function formatPeriod(start: Date, end: Date | null, isCurrent: boolean): string {
  const s = new Date(start);
  const startStr = s.toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
  if (isCurrent) return `${startStr} – Présent`;
  if (!end) return startStr;
  const e = new Date(end);
  const endStr = e.toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
  return `${startStr} – ${endStr}`;
}

export function CarriereClient({ careerPaths, userSkills, candidatures, missions, careerData }: Props) {
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const [addingPath, setAddingPath] = useState(false);
  const [newPath, setNewPath] = useState({ title: "", company: "", role: "", type: "ALTERNANCE", startDate: "", description: "" });
  const [saving, setSaving] = useState(false);

  // KPIs
  const activeApplications = candidatures.filter((c) => ["APPLIED", "INTERVIEW", "OFFER"].includes(c.status)).length;
  const offres = candidatures.filter((c) => c.status === "OFFER").length;
  const completedMissions = missions.filter((m) => m.status === "COMPLETED").length;
  const skillCount = userSkills.length;

  const selectedData = careerData.find((c) => c.id === selectedCareer);

  // Match user skills to a career path
  function careerMatchScore(career: CareerData): number {
    const userSkillNames = userSkills.map((s) => s.skill.name.toLowerCase());
    const matches = career.keySkills.filter((k) => userSkillNames.includes(k.toLowerCase())).length;
    return Math.round((matches / career.keySkills.length) * 100);
  }

  async function handleAddPath(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/career-paths", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newPath, startDate: new Date(newPath.startDate).toISOString(), isCurrent: true }),
      });
      setAddingPath(false);
      setNewPath({ title: "", company: "", role: "", type: "ALTERNANCE", startDate: "", description: "" });
      window.location.reload();
    } catch {
      setSaving(false);
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-primary-600">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Ma Carrière</h1>
            <p className="text-slate-500 text-sm">Suivez votre parcours · KPIs · Suggestions de route</p>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Candidatures actives", value: activeApplications, icon: Briefcase, color: "text-primary-600", bg: "bg-primary-50" },
          { label: "Offres reçues", value: offres, icon: Star, color: "text-green-600", bg: "bg-green-50" },
          { label: "Missions réalisées", value: completedMissions, icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Compétences tracées", value: skillCount, icon: Zap, color: "text-violet-600", bg: "bg-violet-50" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`rounded-2xl border border-slate-200 ${bg} p-5`}>
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-white mb-3`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 font-medium mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Timeline */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">Mon parcours</h2>
            <button
              onClick={() => setAddingPath(true)}
              className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Ajouter
            </button>
          </div>

          {/* Add form */}
          {addingPath && (
            <form onSubmit={handleAddPath} className="mb-4 rounded-2xl border border-primary-200 bg-primary-50 p-4 space-y-3">
              <input
                required
                placeholder="Intitulé (ex: Alternant Dev Web)"
                value={newPath.title}
                onChange={(e) => setNewPath({ ...newPath, title: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  placeholder="Entreprise"
                  value={newPath.company}
                  onChange={(e) => setNewPath({ ...newPath, company: e.target.value })}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  placeholder="Rôle / Poste"
                  value={newPath.role}
                  onChange={(e) => setNewPath({ ...newPath, role: e.target.value })}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newPath.type}
                  onChange={(e) => setNewPath({ ...newPath, type: e.target.value })}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {["ALTERNANCE", "STAGE", "CDI", "PROJET"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <input
                  required
                  type="date"
                  value={newPath.startDate}
                  onChange={(e) => setNewPath({ ...newPath, startDate: e.target.value })}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <textarea
                placeholder="Description de vos missions, réalisations..."
                value={newPath.description}
                onChange={(e) => setNewPath({ ...newPath, description: e.target.value })}
                rows={2}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="rounded-lg bg-primary-600 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-700 transition-colors disabled:opacity-50">
                  {saving ? "Enregistrement..." : "Ajouter"}
                </button>
                <button type="button" onClick={() => setAddingPath(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                  Annuler
                </button>
              </div>
            </form>
          )}

          {careerPaths.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center text-slate-400">
              <TrendingUp className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Aucune expérience renseignée</p>
              <p className="text-xs mt-1">Ajoutez votre parcours pour calibrer les recommandations</p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200" />
              <div className="space-y-4">
                {careerPaths.map((cp) => {
                  const skills: string[] = (() => { try { return JSON.parse(cp.skills); } catch { return []; } })();
                  return (
                    <div key={cp.id} className="relative flex gap-4 pl-12">
                      <div className={`absolute left-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                        cp.isCurrent ? "border-primary-500 bg-primary-100" : "border-slate-300 bg-white"
                      }`}>
                        {cp.isCurrent && <div className="h-2 w-2 rounded-full bg-primary-500" />}
                      </div>
                      <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div>
                            <p className="font-semibold text-slate-900">{cp.title}</p>
                            {cp.company && <p className="text-sm text-primary-600 font-medium">{cp.company}</p>}
                          </div>
                          <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold ${TYPE_COLORS[cp.type] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
                            {cp.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mb-2">
                          {formatPeriod(cp.startDate, cp.endDate, cp.isCurrent)}
                        </p>
                        {cp.description && <p className="text-sm text-slate-600 leading-relaxed">{cp.description}</p>}
                        {skills.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {skills.map((s) => (
                              <span key={s} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">{s}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Career Paths suggestions */}
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-4">Suggestions de routes</h2>
          <p className="text-sm text-slate-500 mb-4">
            Basé sur les profils AlternHub ayant réussi · Cliquez pour en savoir plus
          </p>
          <div className="space-y-3">
            {careerData.map((career) => {
              const matchPct = careerMatchScore(career);
              const isSelected = selectedCareer === career.id;
              return (
                <div key={career.id}>
                  <button
                    onClick={() => setSelectedCareer(isSelected ? null : career.id)}
                    className={`w-full text-left rounded-2xl border p-4 transition-all hover:shadow-md ${
                      isSelected ? "border-primary-300 bg-primary-50 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{career.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-slate-900">{career.name}</p>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold ${matchPct >= 60 ? "text-green-600" : matchPct >= 30 ? "text-amber-600" : "text-slate-400"}`}>
                              {matchPct}% match
                            </span>
                            <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${isSelected ? "rotate-90" : ""}`} />
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Trophy className="h-3 w-3 text-green-500" />
                            {career.successRate}% de réussite
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-blue-500" />
                            {career.timeToJob} pour trouver
                          </span>
                          <span className="flex items-center gap-1">
                            <Euro className="h-3 w-3 text-violet-500" />
                            {career.avgSalary.split("–")[0]}...
                          </span>
                        </div>
                        <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              matchPct >= 60 ? "bg-green-500" : matchPct >= 30 ? "bg-amber-500" : "bg-slate-300"
                            }`}
                            style={{ width: `${matchPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {isSelected && selectedData && (
                    <div className="mt-2 rounded-2xl border border-primary-200 bg-white p-5 space-y-4">
                      <div className="grid grid-cols-3 gap-3 text-center">
                        {[
                          { label: "Taux de réussite", value: `${selectedData.successRate}%`, color: "text-green-600" },
                          { label: "Délai emploi", value: selectedData.timeToJob, color: "text-blue-600" },
                          { label: "Salaire moyen", value: selectedData.avgSalary, color: "text-violet-600" },
                        ].map(({ label, value, color }) => (
                          <div key={label} className="rounded-xl bg-slate-50 p-3">
                            <p className={`font-bold text-sm ${color}`}>{value}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
                          </div>
                        ))}
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-600 mb-2">Compétences clés</p>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedData.keySkills.map((skill) => {
                            const has = userSkills.some((us) => us.skill.name.toLowerCase() === skill.toLowerCase());
                            return (
                              <span
                                key={skill}
                                className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
                                  has ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-50 text-slate-500 border-slate-200"
                                }`}
                              >
                                {has ? "✓ " : ""}{skill}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-600 mb-2">Top entreprises recrutantes</p>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedData.topCompanies.map((co) => (
                            <span key={co} className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[11px] text-blue-700 font-medium">
                              {co}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-600 mb-2">Témoignages Alumni</p>
                        <div className="space-y-3">
                          {selectedData.testimonials.map((t, i) => (
                            <div key={i} className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                                  {t.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-slate-800">{t.name} · {t.school}</p>
                                  <p className="text-[10px] text-slate-400">{t.role}</p>
                                </div>
                              </div>
                              <p className="text-[11px] text-slate-600 italic leading-relaxed">
                                <Quote className="h-3 w-3 inline mr-1 text-slate-300" />
                                {t.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <a
                        href="/student/offres"
                        className="flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
                      >
                        Voir les offres {selectedData.name} <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
