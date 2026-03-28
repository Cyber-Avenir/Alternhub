"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, PlusCircle, List, Users, LogOut,
  Building2, ChevronRight, Layers, CreditCard, Star,
  Sparkles, Search,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TIER_CONFIG = {
  FREE:    { label: "Gratuit",  color: "text-slate-400",  bg: "bg-slate-500/20",  border: "border-slate-500/30" },
  PRO:     { label: "Pro",      color: "text-amber-400",  bg: "bg-amber-500/20",  border: "border-amber-500/30" },
  PREMIUM: { label: "Premium",  color: "text-violet-400", bg: "bg-violet-500/20", border: "border-violet-500/30" },
};

interface RecruteurSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    companyName?: string | null;
    subscriptionTier?: string;
    offreQuota?: number;
    cvViewQuota?: number;
  };
}

export function RecruteurSidebar({ user }: RecruteurSidebarProps) {
  const pathname = usePathname();
  const tier = TIER_CONFIG[(user.subscriptionTier as keyof typeof TIER_CONFIG) ?? "FREE"];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const navLink = (href: string, label: string, Icon: React.ElementType, badge?: string) => {
    const active = isActive(href);
    return (
      <Link
        key={href}
        href={href}
        className={cn(
          "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
          active
            ? "bg-rose-600/20 text-rose-400 border border-rose-600/30"
            : "text-slate-400 hover:bg-slate-800 hover:text-white"
        )}
      >
        <Icon className={cn("h-4 w-4 shrink-0", active ? "text-rose-400" : "")} />
        <span className="flex-1">{label}</span>
        {badge && (
          <span className="rounded-full bg-rose-500/20 px-1.5 py-0.5 text-[9px] font-bold text-rose-400 border border-rose-500/30">
            {badge}
          </span>
        )}
        {active && !badge && <ChevronRight className="h-3 w-3 text-rose-400" />}
      </Link>
    );
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-950 text-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-orange-500">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight">AlternHub</span>
        <span className={cn("ml-auto rounded-full px-1.5 py-0.5 text-[9px] font-bold border", tier.color, tier.bg, tier.border)}>
          {tier.label}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Recrutement
        </p>
        {navLink("/recruteur/dashboard", "Tableau de bord", LayoutDashboard)}
        {navLink("/recruteur/offres", "Mes Offres", List)}
        {navLink("/recruteur/offres/new", "Publier une offre", PlusCircle)}

        <div className="mt-4">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Candidats
          </p>
          {navLink("/recruteur/candidats", "Explorer", Search)}
          {navLink("/recruteur/pipeline", "Pipeline", Layers)}
        </div>

        <div className="mt-4">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Entreprise
          </p>
          {navLink("/recruteur/profil", "Mon profil", Building2)}
          {navLink("/recruteur/abonnement", "Abonnement", CreditCard)}
        </div>

        {/* Quota widget */}
        {user.subscriptionTier === "FREE" && (
          <div className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Star className="h-3.5 w-3.5 text-rose-400" />
              <span className="text-xs font-medium text-rose-300">Plan Gratuit</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Offres actives</span>
                <span className="text-rose-300 font-medium">{user.offreQuota ?? 3} max</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Vues CV/mois</span>
                <span className="text-rose-300 font-medium">{user.cvViewQuota ?? 10} max</span>
              </div>
            </div>
            <Link
              href="/recruteur/abonnement"
              className="block mt-2 text-center rounded-md bg-rose-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-rose-700 transition-colors"
            >
              Passer Pro →
            </Link>
          </div>
        )}
      </nav>

      {/* User Profile */}
      <div className="border-t border-slate-800 p-3">
        <div className="flex items-center gap-3 rounded-lg p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image ?? undefined} />
            <AvatarFallback className="text-xs bg-rose-600">{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-white">{user.name ?? "Recruteur"}</p>
            <p className="truncate text-xs text-slate-500">{user.companyName ?? user.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-800 hover:text-white transition-colors"
            title="Déconnexion"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
