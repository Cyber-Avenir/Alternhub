import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Shield, Bell, Database, Sparkles } from "lucide-react";

export const metadata = { title: "Paramètres" };

export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Paramètres</h1>
        <p className="text-slate-500 mt-1">Configuration de la plateforme AlternHub</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-rose-500" />
              Sécurité & Accès
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
              <div>
                <p className="font-medium text-slate-800 text-sm">Authentification 2FA</p>
                <p className="text-xs text-slate-500">Sécurité renforcée pour les admins</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">Bientôt</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
              <div>
                <p className="font-medium text-slate-800 text-sm">OAuth Google/Microsoft</p>
                <p className="text-xs text-slate-500">Connexion sociale pour les étudiants</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">Bientôt</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4 text-blue-500" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
              <div>
                <p className="font-medium text-slate-800 text-sm">Email de rappel hebdomadaire</p>
                <p className="text-xs text-slate-500">Rappel pour compléter les missions</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">Bientôt</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-500" />
              Intelligence IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl bg-gradient-to-br from-violet-50 to-primary-50 border border-violet-200 p-5">
              <p className="font-semibold text-violet-800 text-sm mb-2">Intégration Claude AI</p>
              <p className="text-xs text-violet-600">
                Connectez l&apos;API Claude d&apos;Anthropic pour activer la génération automatique de rapports,
                les suggestions de compétences et l&apos;analyse de carrière.
              </p>
              <div className="mt-3 rounded-lg bg-white border border-violet-100 p-3">
                <p className="text-xs font-mono text-slate-600">ANTHROPIC_API_KEY=sk-ant-...</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="h-4 w-4 text-green-500" />
              Base de données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg bg-green-50 border border-green-200 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-800">SQLite (MVP)</span>
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                  Actif
                </span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                Migration vers PostgreSQL recommandée pour la production
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
