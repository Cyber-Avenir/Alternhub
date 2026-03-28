"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, ChevronRight, Sparkles } from "lucide-react";

const INDUSTRY_OPTIONS = [
  "Tech / Numérique", "Finance / Banque", "Conseil / Audit", "Industrie / Ingénierie",
  "Santé / Pharma", "Commerce / Marketing", "Énergie", "Médias / Communication", "Autre",
];

const SIZE_OPTIONS = ["1-10", "11-50", "51-200", "201-500", "500+"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    industry: "",
    companySize: "",
    companyWebsite: "",
    phone: "",
    location: "",
    bio: "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/recruteur/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/recruteur/dashboard");
        router.refresh();
      } else {
        setSaving(false);
      }
    } catch {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-orange-500">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">AlternHub</span>
          <span className="rounded-full bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 text-xs font-bold text-rose-400">Recruteur</span>
        </div>

        <div className="rounded-2xl bg-white shadow-2xl overflow-hidden">
          {/* Progress */}
          <div className="h-1.5 bg-slate-100">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-orange-500 transition-all"
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>

          <div className="p-8">
            <div className="mb-6">
              <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1">
                Étape {step}/2 — Configuration du compte
              </p>
              <h1 className="text-2xl font-bold text-slate-900">
                {step === 1 ? "Votre entreprise" : "Finalisez votre profil"}
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                {step === 1
                  ? "Ces informations seront visibles par les alternants"
                  : "Quelques détails supplémentaires pour commencer"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Nom de l&apos;entreprise *</label>
                    <input
                      required
                      value={form.companyName}
                      onChange={(e) => set("companyName", e.target.value)}
                      placeholder="Ex: Société Générale"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Secteur d&apos;activité *</label>
                    <select
                      required
                      value={form.industry}
                      onChange={(e) => set("industry", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="">Sélectionner...</option>
                      {INDUSTRY_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Taille de l&apos;entreprise</label>
                    <div className="grid grid-cols-5 gap-2">
                      {SIZE_OPTIONS.map((s) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => set("companySize", s)}
                          className={`rounded-xl border py-2.5 text-sm font-medium transition-all ${
                            form.companySize === s
                              ? "border-rose-500 bg-rose-50 text-rose-700"
                              : "border-slate-200 text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={!form.companyName || !form.industry}
                    onClick={() => setStep(2)}
                    className="w-full rounded-xl bg-rose-600 py-3 text-sm font-semibold text-white hover:bg-rose-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    Continuer <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Site web</label>
                      <input
                        value={form.companyWebsite}
                        onChange={(e) => set("companyWebsite", e.target.value)}
                        placeholder="https://..."
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Téléphone</label>
                      <input
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        placeholder="+33 1 23 45 67 89"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Ville / Localisation</label>
                    <input
                      value={form.location}
                      onChange={(e) => set("location", e.target.value)}
                      placeholder="Paris, Lyon, Remote..."
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Description (visible par les alternants)</label>
                    <textarea
                      value={form.bio}
                      onChange={(e) => set("bio", e.target.value)}
                      placeholder="Présentez votre entreprise et vos valeurs..."
                      rows={3}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      Retour
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 rounded-xl bg-rose-600 py-3 text-sm font-semibold text-white hover:bg-rose-700 transition-colors disabled:opacity-50"
                    >
                      {saving ? "Création du compte..." : "Accéder au tableau de bord →"}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
