"use client";

import { useState, useMemo } from "react";
import { Calculator, Info, TrendingUp, Euro, AlertCircle, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ─── Barème légal 2024 (SMIC = 1 766,92€ brut)
const SMIC_BRUT = 1766.92;

// Grilles salaires minimum apprentissage 2024
// source: travail-emploi.gouv.fr
const GRILLE_APPRENTISSAGE: Record<string, Record<string, number>> = {
  // Moins de 18 ans
  "minus18": { "1": 0.27, "2": 0.39, "3": 0.55 },
  // 18-20 ans
  "18-20": { "1": 0.43, "2": 0.51, "3": 0.67 },
  // 21-25 ans
  "21-25": { "1": 0.53, "2": 0.61, "3": 0.78 },
  // 26 ans et plus
  "26plus": { "1": 1.00, "2": 1.00, "3": 1.00 },
};

// Cotisations sociales (part salariale) — apprentissage = exonéré jusqu'à 79% SMIC
const TAUX_CHARGES = {
  securiteSociale: 0.0, // exonéré
  assuranceChomage: 0.0, // exonéré
  retraiteComplementaire: 0.0, // exonéré si < 79% SMIC
  impotRevenu: 0.0, // exonéré jusqu'à 1 SMIC
};

function computeNetMensuel(brut: number): {
  net: number;
  cotisations: number;
  tauxNet: number;
  exonere: boolean;
  impotEstime: number;
} {
  const seuil79 = SMIC_BRUT * 0.79;
  const exonere = brut <= seuil79;

  let cotisations = 0;
  if (!exonere) {
    // Cotisations sur la partie dépassant 79% SMIC
    const base = brut - seuil79;
    cotisations = base * 0.22; // ~22% part salariale
  }

  const net = brut - cotisations;
  // IR : exonéré jusqu'à 1 SMIC annuel (~21 203€/an)
  const annuel = net * 12;
  const impotEstime = annuel > 21203 ? (annuel - 21203) * 0.11 / 12 : 0;
  const tauxNet = (net / brut) * 100;

  return { net, cotisations, tauxNet, exonere, impotEstime };
}

const AGE_OPTIONS = [
  { value: "minus18", label: "Moins de 18 ans" },
  { value: "18-20", label: "18 à 20 ans" },
  { value: "21-25", label: "21 à 25 ans" },
  { value: "26plus", label: "26 ans et plus" },
];

const YEAR_OPTIONS = [
  { value: "1", label: "1ère année" },
  { value: "2", label: "2ème année" },
  { value: "3", label: "3ème année et +" },
];

const SECTOR_BONUS: Record<string, { label: string; bonus: number }> = {
  tech:       { label: "Tech / Numérique",    bonus: 300 },
  finance:    { label: "Finance / Banque",    bonus: 250 },
  consulting: { label: "Conseil / Audit",     bonus: 200 },
  industrie:  { label: "Industrie",           bonus: 150 },
  sante:      { label: "Santé / Pharma",      bonus: 100 },
  commerce:   { label: "Commerce / Marketing",bonus: 50 },
  autre:      { label: "Autre secteur",       bonus: 0 },
};

export function SalaireSimulateur() {
  const [age, setAge] = useState("21-25");
  const [year, setYear] = useState("1");
  const [sector, setSector] = useState("tech");
  const [customBrut, setCustomBrut] = useState("");

  const bruteMinLegal = useMemo(() => {
    const pct = GRILLE_APPRENTISSAGE[age]?.[year] ?? 0.53;
    return Math.round(SMIC_BRUT * pct);
  }, [age, year]);

  const brutWithSector = bruteMinLegal + (SECTOR_BONUS[sector]?.bonus ?? 0);
  const brutFinal = customBrut ? parseFloat(customBrut) || 0 : brutWithSector;

  const result = useMemo(() => computeNetMensuel(brutFinal), [brutFinal]);

  const netAnnuel = result.net * 12;
  const brutAnnuel = brutFinal * 12;

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-violet-600">
            <Calculator className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Simulateur de salaire</h1>
            <p className="text-slate-500 text-sm">Barème légal 2024 · Contrat d&apos;apprentissage</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Votre situation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Age */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Votre âge</label>
                <div className="grid grid-cols-2 gap-2">
                  {AGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setAge(opt.value)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                        age === opt.value
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Year */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Année d&apos;alternance</label>
                <div className="grid grid-cols-3 gap-2">
                  {YEAR_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setYear(opt.value)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                        year === opt.value
                          ? "border-violet-500 bg-violet-50 text-violet-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Secteur d&apos;activité</label>
                <div className="relative">
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {Object.entries(SECTOR_BONUS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.label} {v.bonus > 0 ? `(+${v.bonus}€ bonus secteur)` : ""}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
                <p className="text-xs text-slate-400">
                  Estimation basée sur les conventions collectives moyennes du secteur
                </p>
              </div>

              {/* Custom brut override */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-sm font-medium text-slate-700">
                  Ou saisir votre brut négocié (€/mois)
                </label>
                <div className="relative">
                  <Euro className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="number"
                    placeholder={`ex: ${brutWithSector}`}
                    value={customBrut}
                    onChange={(e) => setCustomBrut(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                {customBrut && (
                  <button
                    onClick={() => setCustomBrut("")}
                    className="text-xs text-primary-600 hover:underline"
                  >
                    Réinitialiser avec le calcul automatique
                  </button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Legal info */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">Salaire minimum légal</span>
              </div>
              <p className="text-sm text-blue-600">
                Pour votre profil ({AGE_OPTIONS.find((a) => a.value === age)?.label},{" "}
                {YEAR_OPTIONS.find((y) => y.value === year)?.label}) :
                <strong className="text-blue-800"> {bruteMinLegal}€ brut/mois minimum</strong>
                {" "}({Math.round((GRILLE_APPRENTISSAGE[age]?.[year] ?? 0.53) * 100)}% du SMIC)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {/* Main result */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-primary-900 p-6 text-white">
            <p className="text-sm text-slate-300 mb-1">Salaire net estimé</p>
            <p className="text-5xl font-extrabold text-white">
              {Math.round(result.net).toLocaleString("fr-FR")}€
              <span className="text-xl font-normal text-slate-300">/mois</span>
            </p>
            <div className="mt-4 flex items-center gap-4">
              <div>
                <p className="text-xs text-slate-400">Brut</p>
                <p className="text-lg font-bold">{Math.round(brutFinal).toLocaleString("fr-FR")}€</p>
              </div>
              <div className="h-8 w-px bg-slate-700" />
              <div>
                <p className="text-xs text-slate-400">Cotisations</p>
                <p className="text-lg font-bold text-red-300">-{Math.round(result.cotisations)}€</p>
              </div>
              <div className="h-8 w-px bg-slate-700" />
              <div>
                <p className="text-xs text-slate-400">Taux de rétention</p>
                <p className="text-lg font-bold text-green-300">{result.tauxNet.toFixed(0)}%</p>
              </div>
            </div>

            {result.exonere && (
              <div className="mt-4 rounded-xl bg-green-500/20 border border-green-500/30 px-3 py-2">
                <p className="text-xs text-green-300 font-medium">
                  ✓ Vous êtes exonéré de cotisations salariales (salaire {"≤"} 79% SMIC)
                </p>
              </div>
            )}
          </div>

          {/* Annual breakdown */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary-500" />
                Vue annuelle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-sm text-slate-600">Brut annuel</span>
                <span className="font-bold text-slate-800">{Math.round(brutAnnuel).toLocaleString("fr-FR")}€</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-sm text-slate-600">Net annuel</span>
                <span className="font-bold text-green-600">{Math.round(netAnnuel).toLocaleString("fr-FR")}€</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-sm text-slate-600">Cotisations annuelles</span>
                <span className="font-medium text-slate-500">-{Math.round(result.cotisations * 12).toLocaleString("fr-FR")}€</span>
              </div>
              {result.impotEstime > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-600">IR estimé (mensuel)</span>
                  <span className="font-medium text-orange-500">~{Math.round(result.impotEstime)}€/mois</span>
                </div>
              )}
              {result.impotEstime === 0 && (
                <div className="rounded-lg bg-green-50 border border-green-200 p-3">
                  <p className="text-xs text-green-700 font-medium">
                    ✓ Exonéré d&apos;impôt sur le revenu (salaire {"<"} 1 SMIC annuel)
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="border-violet-200 bg-violet-50">
            <CardContent className="p-4 space-y-2">
              <p className="text-sm font-semibold text-violet-700">💡 Conseils négociation</p>
              <ul className="text-xs text-violet-600 space-y-1.5">
                <li>→ Le salaire minimum est un plancher, pas un plafond</li>
                <li>→ Négociez avec vos compétences et vos certifications (GitHub Copilot, AWS...)</li>
                <li>→ Les grandes entreprises Tech paient souvent 20-40% au-dessus</li>
                <li>→ Demandez les avantages : tickets restaurant, remboursement transport, télétravail</li>
                {brutFinal < bruteMinLegal && (
                  <li className="text-red-600 font-medium">
                    ⚠️ Votre brut est inférieur au minimum légal !
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <div className="flex gap-2 rounded-lg bg-slate-50 border border-slate-200 p-3">
            <AlertCircle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-400">
              Simulation indicative basée sur le barème 2024. Les montants réels peuvent varier selon
              votre convention collective. Consultez un expert-comptable pour une simulation précise.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
