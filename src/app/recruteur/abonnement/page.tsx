export const metadata = { title: "Abonnement" };

const PLANS = [
  {
    id: "FREE",
    name: "Gratuit",
    price: "0€",
    period: "/mois",
    color: "border-slate-200",
    highlight: false,
    features: [
      "3 offres actives simultanées",
      "10 vues de CV par mois",
      "Accès au mode swipe basique",
      "Tableau de bord recruteur",
      "Pipeline de suivi candidatures",
    ],
    missing: [
      "Contact direct (email, téléphone)",
      "Export de candidats",
      "Matching avancé",
      "Support prioritaire",
    ],
  },
  {
    id: "PRO",
    name: "Pro",
    price: "49€",
    period: "/mois",
    color: "border-rose-400",
    highlight: true,
    features: [
      "20 offres actives simultanées",
      "100 vues de CV par mois",
      "Contact direct (email des candidats)",
      "Matching avancé + filtres",
      "Pipeline avancé",
      "Support prioritaire",
    ],
    missing: [
      "Téléphone des candidats",
      "Export illimité",
    ],
  },
  {
    id: "PREMIUM",
    name: "Premium",
    price: "149€",
    period: "/mois",
    color: "border-violet-400",
    highlight: false,
    features: [
      "Offres illimitées",
      "Vues de CV illimitées",
      "Email + téléphone des candidats",
      "Export CSV des candidats",
      "Matching IA avancé",
      "Sélection d'écoles ciblées",
      "Account manager dédié",
    ],
    missing: [],
  },
];

export default function AbonnementPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Abonnement</h1>
        <p className="text-slate-500 mt-1 text-sm">Choisissez le plan qui correspond à vos besoins de recrutement</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 max-w-4xl">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-2xl border-2 bg-white p-6 ${plan.color} ${plan.highlight ? "shadow-xl scale-105" : "shadow-sm"} relative`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-rose-600 px-3 py-0.5 text-xs font-bold text-white whitespace-nowrap">
                Le plus populaire
              </div>
            )}
            <div className="mb-4">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{plan.name}</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                <span className="text-sm text-slate-500">{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-2 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-green-500 shrink-0 mt-0.5">✓</span>{f}
                </li>
              ))}
              {plan.missing.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-400">
                  <span className="shrink-0 mt-0.5">✗</span>{f}
                </li>
              ))}
            </ul>

            <button
              disabled={plan.id === "FREE"}
              className={`w-full rounded-xl py-3 text-sm font-semibold transition-colors ${
                plan.highlight
                  ? "bg-rose-600 text-white hover:bg-rose-700"
                  : plan.id === "FREE"
                  ? "bg-slate-100 text-slate-400 cursor-default"
                  : "bg-violet-600 text-white hover:bg-violet-700"
              }`}
            >
              {plan.id === "FREE" ? "Plan actuel" : `Passer au plan ${plan.name}`}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-slate-50 border border-slate-200 p-6 max-w-4xl">
        <p className="text-sm text-slate-500">
          <strong className="text-slate-700">Note :</strong> Les paiements en ligne seront disponibles prochainement.
          Pour souscrire dès maintenant, contactez-nous à <span className="text-rose-600">hello@alternhub.fr</span>
        </p>
      </div>
    </div>
  );
}
