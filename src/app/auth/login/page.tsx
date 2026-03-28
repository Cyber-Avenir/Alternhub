"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const callbackUrl = searchParams.get("callbackUrl") ?? "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
      return;
    }

    // Fetch session to get role
    const res = await fetch("/api/auth/session");
    const session = await res.json();
    const role = session?.user?.role;

    if (role === "ADMIN") {
      router.push("/admin");
    } else if (role === "RECRUTEUR") {
      router.push("/recruteur/dashboard");
    } else {
      router.push(callbackUrl || "/student/dashboard");
    }
  }

  function fillDemo(type: "admin" | "student" | "recruteur") {
    if (type === "admin") {
      setEmail("admin@alternhub.fr");
      setPassword("Admin1234!");
    } else if (type === "recruteur") {
      setEmail("recruteur@techcorp.fr");
      setPassword("Recruteur1234!");
    } else {
      setEmail("marie.dupont@email.fr");
      setPassword("Student1234!");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-primary-950/30 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-violet-500">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">AlternHub</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Bon retour !</h1>
          <p className="text-slate-400 mt-1">Connectez-vous à votre espace</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-black/20 p-8">
          {/* Demo buttons */}
          <div className="mb-6 rounded-xl bg-slate-50 border border-slate-200 p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Connexion démo rapide
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillDemo("student")}
                className="flex-1 rounded-lg border border-primary-200 bg-primary-50 py-2 text-xs font-medium text-primary-700 hover:bg-primary-100 transition-colors"
              >
                👨‍🎓 Étudiant
              </button>
              <button
                type="button"
                onClick={() => fillDemo("recruteur")}
                className="flex-1 rounded-lg border border-orange-200 bg-orange-50 py-2 text-xs font-medium text-orange-700 hover:bg-orange-100 transition-colors"
              >
                🏢 Recruteur
              </button>
              <button
                type="button"
                onClick={() => fillDemo("admin")}
                className="flex-1 rounded-lg border border-rose-200 bg-rose-50 py-2 text-xs font-medium text-rose-700 hover:bg-rose-100 transition-colors"
              >
                🛡️ Admin
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <Input
                id="email"
                type="email"
                placeholder="vous@exemple.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading} variant="gradient">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Pas encore de compte ?{" "}
            <Link href="/auth/register" className="font-medium text-primary-600 hover:text-primary-700">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
