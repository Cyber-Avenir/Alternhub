import Link from "next/link";
import {
  Sparkles,
  Target,
  Zap,
  FileText,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Star,
  Users,
  TrendingUp,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Target,
    title: "Suivi des Missions",
    description:
      "Logguez chaque mission, projet et responsabilité avec un système de tags et de priorités.",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: Zap,
    title: "Gestion des Compétences",
    description:
      "Suivez l'évolution de vos compétences techniques et soft skills en temps réel.",
    color: "text-violet-600 bg-violet-50",
  },
  {
    icon: FileText,
    title: "CV Auto-généré",
    description:
      "Générez automatiquement un CV professionnel à partir de vos activités enregistrées.",
    color: "text-green-600 bg-green-50",
  },
  {
    icon: Sparkles,
    title: "Rapports IA",
    description:
      "Générez des rapports d'alternance complets en un clic grâce à l'intelligence artificielle.",
    color: "text-orange-600 bg-orange-50",
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description:
      "Visualisez votre progression, vos KPIs et obtenez des insights personnalisés.",
    color: "text-rose-600 bg-rose-50",
  },
  {
    icon: Shield,
    title: "Sécurité & Confidentialité",
    description:
      "Vos données sont protégées et conformes au RGPD. Contrôle total sur la visibilité.",
    color: "text-slate-600 bg-slate-50",
  },
];

const testimonials = [
  {
    name: "Marie Dupont",
    role: "Développeuse Web • Alternante chez TechCorp",
    text: "AlternHub a transformé ma façon de gérer mon alternance. Mon rapport de fin d'année était prêt en 30 minutes au lieu de 3 jours !",
    avatar: "MD",
    stars: 5,
  },
  {
    name: "Thomas Martin",
    role: "Data Scientist • Alternant chez DataLabs",
    text: "Le suivi des compétences m'a permis de montrer concrètement mon évolution à mon tuteur. Ça a vraiment changé nos échanges.",
    avatar: "TM",
    stars: 5,
  },
  {
    name: "Sophie Bernard",
    role: "UX Designer • Alternante chez DesignStudio",
    text: "Le CV auto-généré est bluffant. J'ai décroché 3 entretiens pour mon prochain poste en l'envoyant directement depuis la plateforme.",
    avatar: "SB",
    stars: 5,
  },
];

const stats = [
  { value: "2 400+", label: "Alternants actifs" },
  { value: "18 500+", label: "Missions tracées" },
  { value: "340+", label: "Entreprises partenaires" },
  { value: "4.9/5", label: "Note moyenne" },
];

const pricing = [
  {
    name: "Gratuit",
    price: "0€",
    period: "/mois",
    description: "Pour commencer votre parcours",
    features: [
      "5 missions maximum",
      "10 compétences",
      "CV basique",
      "Dashboard simplifié",
    ],
    cta: "Commencer gratuitement",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "9€",
    period: "/mois",
    description: "Pour les alternants ambitieux",
    features: [
      "Missions illimitées",
      "Compétences illimitées",
      "CV personnalisable",
      "Rapports IA illimités",
      "Analytics avancés",
      "Portfolio public",
    ],
    cta: "Commencer l'essai gratuit",
    highlighted: true,
  },
  {
    name: "École / Entreprise",
    price: "Sur devis",
    period: "",
    description: "Pour les organisations",
    features: [
      "Tableau de bord multi-étudiants",
      "Suivi de progression",
      "Rapports personnalisés",
      "Intégrations API",
      "Support dédié",
    ],
    cta: "Nous contacter",
    highlighted: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-violet-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">AlternHub</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Fonctionnalités
            </a>
            <a href="#testimonials" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Témoignages
            </a>
            <a href="#pricing" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Tarifs
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Connexion
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" variant="gradient">
                Commencer gratuitement
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-primary-950/50 to-slate-900 py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-900/20 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5 text-sm text-primary-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>La plateforme #1 pour les alternants en France</span>
          </div>

          <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
            L&apos;
            <span className="bg-gradient-to-r from-primary-400 to-violet-400 bg-clip-text text-transparent">
              OS des alternants
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-400 md:text-xl">
            Gérez vos missions, suivez vos compétences, générez vos rapports et accélérez votre
            carrière — tout en un seul endroit, propulsé par l&apos;IA.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button size="xl" variant="gradient" className="gap-2 shadow-lg shadow-primary-500/25">
                Commencer gratuitement
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                size="xl"
                variant="outline"
                className="border-slate-700 bg-transparent text-white hover:bg-slate-800 hover:text-white"
              >
                Se connecter
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Gratuit pour commencer · Aucune carte bancaire requise
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-gradient">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              AlternHub centralise tous les outils dont les alternants ont besoin pour réussir leur
              parcours professionnel.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-lg text-slate-500">
              Des centaines d&apos;alternants utilisent déjà AlternHub pour accélérer leur carrière.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
              >
                <div className="flex mb-3">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-violet-500 text-white text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Tarifs simples et transparents</h2>
            <p className="text-lg text-slate-500">
              Commencez gratuitement, passez au Pro quand vous êtes prêt.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-8 ${
                  plan.highlighted
                    ? "border-primary-500 bg-gradient-to-b from-primary-600 to-primary-700 text-white shadow-xl shadow-primary-500/25 scale-105"
                    : "border-slate-200 bg-white shadow-sm"
                }`}
              >
                <h3 className={`text-lg font-bold mb-1 ${plan.highlighted ? "text-white" : "text-slate-900"}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.highlighted ? "text-primary-200" : "text-slate-500"}`}>
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className={`text-4xl font-extrabold ${plan.highlighted ? "text-white" : "text-slate-900"}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ${plan.highlighted ? "text-primary-200" : "text-slate-400"}`}>
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className={`h-4 w-4 flex-shrink-0 ${plan.highlighted ? "text-primary-200" : "text-green-500"}`} />
                      <span className={plan.highlighted ? "text-primary-100" : "text-slate-600"}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href="/auth/register">
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? "outline" : "default"}
                    style={
                      plan.highlighted
                        ? { borderColor: "rgba(255,255,255,0.4)", color: "white", backgroundColor: "rgba(255,255,255,0.1)" }
                        : {}
                    }
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary-600 to-violet-600 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Users className="mx-auto mb-4 h-12 w-12 text-white/80" />
          <h2 className="text-4xl font-bold text-white mb-4">
            Rejoignez 2 400+ alternants qui réussissent avec AlternHub
          </h2>
          <p className="text-lg text-primary-100 mb-8">
            Créez votre compte en 30 secondes et commencez à tracker votre parcours dès aujourd&apos;hui.
          </p>
          <Link href="/auth/register">
            <Button size="xl" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-700 gap-2">
              Créer mon compte gratuitement
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 text-slate-400">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-violet-600">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-bold text-white">AlternHub</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-primary-400" />
              <span>L&apos;OS des alternants • MVP v1.0 • 2024</span>
            </div>
            <p className="text-sm">© 2024 AlternHub. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
