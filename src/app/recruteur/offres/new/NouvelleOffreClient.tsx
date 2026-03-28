"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Plus, X, ChevronDown } from "lucide-react";

interface Skill { id: string; name: string; category: string }
interface Ecole { id: string; name: string; city: string | null }

interface SelectedSkill {
  skillId: string;
  name: string;
  required: boolean;
  weight: number;
}

const CONTRACT_OPTIONS = ["ALTERNANCE", "STAGE", "CDI", "CDD"];
const LEVEL_OPTIONS = ["BAC+2", "BAC+3", "BAC+4", "BAC+5"];
const WEIGHT_LABELS: Record<number, string> = { 1: "Souhaité", 2: "Important", 3: "Indispensable" };

interface Props { skills: Skill[]; ecoles: Ecole[] }

export function NouvelleOffreClient({ skills, ecoles }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [skillQuery, setSkillQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<SelectedSkill[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    contractType: "ALTERNANCE",
    location: "",
    remote: false,
    salary: "",
    startDate: "",
    duration: "",
    requiredLevel: "",
    status: "PUBLISHED",
  });

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const groupedSkills = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  const filteredSkills = skillQuery
    ? skills.filter((s) => s.name.toLowerCase().includes(skillQuery.toLowerCase()) && !selectedSkills.find((ss) => ss.skillId === s.id))
    : [];

  function addSkill(skill: Skill) {
    setSelectedSkills((prev) => [...prev, { skillId: skill.id, name: skill.name, required: true, weight: 2 }]);
    setSkillQuery("");
  }

  function removeSkill(id: string) {
    setSelectedSkills((prev) => prev.filter((s) => s.skillId !== id));
  }

  function updateSkill(id: string, key: "required" | "weight", value: boolean | number) {
    setSelectedSkills((prev) => prev.map((s) => s.skillId === id ? { ...s, [key]: value } : s));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/offres", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, skills: selectedSkills }),
      });
      if (res.ok) {
        router.push("/recruteur/offres");
      } else {
        setSaving(false);
      }
    } catch {
      setSaving(false);
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-orange-500">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Nouvelle offre</h1>
            <p className="text-slate-500 text-sm">Rédigez votre offre d&apos;alternance · Visible par tous les étudiants</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Titre */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <h2 className="font-semibold text-slate-800">Informations principales</h2>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Intitulé du poste *</label>
            <input
              required
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Ex: Alternant Développeur Full Stack"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Type de contrat</label>
              <div className="relative">
                <select
                  value={form.contractType}
                  onChange={(e) => set("contractType", e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {CONTRACT_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Niveau requis</label>
              <div className="relative">
                <select
                  value={form.requiredLevel}
                  onChange={(e) => set("requiredLevel", e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">Non spécifié</option>
                  {LEVEL_OPTIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Localisation</label>
              <input
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="Paris, Lyon, Remote..."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Salaire / Rémunération</label>
              <input
                value={form.salary}
                onChange={(e) => set("salary", e.target.value)}
                placeholder="Ex: 1200€/mois, 70% SMIC"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Durée</label>
              <input
                value={form.duration}
                onChange={(e) => set("duration", e.target.value)}
                placeholder="Ex: 12 mois, 24 mois"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Date de début</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => set("startDate", e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.remote}
              onChange={(e) => set("remote", e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
            />
            <span className="text-sm font-medium text-slate-700">Télétravail possible</span>
          </label>
        </div>

        {/* Description */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <h2 className="font-semibold text-slate-800">Description du poste *</h2>
          <textarea
            required
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Décrivez les missions, le contexte, l'équipe, les attentes..."
            rows={6}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Skills */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <h2 className="font-semibold text-slate-800">Compétences recherchées</h2>
          <p className="text-sm text-slate-500">Ces compétences seront utilisées pour calculer le score de compatibilité des candidats</p>

          {/* Search */}
          <div className="relative">
            <input
              value={skillQuery}
              onChange={(e) => setSkillQuery(e.target.value)}
              placeholder="Rechercher une compétence (React, Python, SQL...)"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            {filteredSkills.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 z-10 rounded-xl bg-white border border-slate-200 shadow-lg max-h-48 overflow-y-auto">
                {filteredSkills.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => addSkill(s)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-xs text-slate-400 w-24 shrink-0">{s.category}</span>
                    <span className="font-medium text-slate-700">{s.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected skills */}
          {selectedSkills.length > 0 && (
            <div className="space-y-2">
              {selectedSkills.map((ss) => (
                <div key={ss.skillId} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <span className="flex-1 text-sm font-medium text-slate-800">{ss.name}</span>
                  <div className="flex items-center gap-2">
                    <select
                      value={ss.weight}
                      onChange={(e) => updateSkill(ss.skillId, "weight", Number(e.target.value))}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs focus:outline-none"
                    >
                      {Object.entries(WEIGHT_LABELS).map(([w, l]) => (
                        <option key={w} value={w}>{l}</option>
                      ))}
                    </select>
                    <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ss.required}
                        onChange={(e) => updateSkill(ss.skillId, "required", e.target.checked)}
                        className="h-3.5 w-3.5"
                      />
                      Requis
                    </label>
                    <button type="button" onClick={() => removeSkill(ss.skillId)} className="text-slate-400 hover:text-red-500 transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/recruteur/offres")}
            className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-xl bg-rose-600 py-3 text-sm font-semibold text-white hover:bg-rose-700 transition-colors disabled:opacity-50"
          >
            {saving ? "Publication en cours..." : "Publier l'offre →"}
          </button>
        </div>
      </form>
    </div>
  );
}
