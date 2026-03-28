"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Target, Zap, FileText, LogOut, Sparkles,
  ChevronRight, Briefcase, Gift, Calculator, Search,
  TrendingUp, GraduationCap, Star, BookOpen,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const STATUS_CONFIG = {
  SEARCHING:     { label: "En recherche", color: "bg-amber-500", text: "text-amber-400" },
  IN_ALTERNANCE: { label: "En alternance", color: "bg-green-500", text: "text-green-400" },
  GRADUATED:     { label: "Diplômé",        color: "bg-violet-500", text: "text-violet-400" },
};

interface StudentSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    school?: string | null;
    searchStatus?: string;
    subscriptionTier?: string;
  };
}

export function StudentSidebar({ user }: StudentSidebarProps) {
  const pathname = usePathname();
  const status = STATUS_CONFIG[(user.searchStatus as keyof typeof STATUS_CONFIG) ?? "SEARCHING"];
  const isSearching = user.searchStatus === "SEARCHING" || !user.searchStatus;

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const navLink = (href: string, label: string, Icon: React.ElementType, badge?: string, section?: "main" | "discover" | "resources") => {
    const active = isActive(href);
    const sectionColor = section === "discover" ? "primary" : section === "resources" ? "green" : "primary";
    return (
      <Link
        key={href}
        href={href}
        className={cn(
          "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
          active
            ? sectionColor === "green"
              ? "bg-green-600/20 text-green-400 border border-green-600/30"
              : "bg-primary-600/20 text-primary-400 border border-primary-600/30"
            : "text-slate-400 hover:bg-slate-800 hover:text-white"
        )}
      >
        <Icon className={cn("h-4 w-4 shrink-0", active ? (sectionColor === "green" ? "text-green-400" : "text-primary-400") : "")} />
        <span className="flex-1">{label}</span>
        {badge && (
          <span className="rounded-full bg-green-500/20 px-1.5 py-0.5 text-[9px] font-bold text-green-400 border border-green-500/30">
            {badge}
          </span>
        )}
        {active && !badge && (
          <ChevronRight className={cn("h-3 w-3", sectionColor === "green" ? "text-green-400" : "text-primary-400")} />
        )}
      </Link>
    );
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-950 text-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-violet-500">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight">AlternHub</span>
        {user.subscriptionTier === "PRO" && (
          <span className="ml-auto rounded-full bg-amber-500/20 border border-amber-500/30 px-1.5 py-0.5 text-[9px] font-bold text-amber-400">PRO</span>
        )}
        {user.subscriptionTier === "PREMIUM" && (
          <span className="ml-auto rounded-full bg-violet-500/20 border border-violet-500/30 px-1.5 py-0.5 text-[9px] font-bold text-violet-400">⭐ PREMIUM</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {/* Mon parcours */}
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Mon parcours
        </p>
        {navLink("/student/dashboard", "Tableau de bord", LayoutDashboard, undefined, "main")}
        {navLink("/student/candidatures", "Candidatures", Briefcase, undefined, "main")}
        {navLink("/student/missions", "Mes Expériences", BookOpen, undefined, "main")}
        {navLink("/student/skills", "Mes Compétences", Zap, undefined, "main")}
        {navLink("/student/carriere", "Ma Carrière", TrendingUp, undefined, "main")}
        {navLink("/student/cv", "Mon CV", FileText, undefined, "main")}
        {navLink("/student/profil", "Mon Profil", Star, undefined, "main")}

        {/* Découverte (offres + matching + écoles) */}
        <div className="mt-4">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Découverte
          </p>
          {navLink("/student/offres", "Offres d'alternance", Search, "NEW", "discover")}
          {navLink("/student/ecoles", "Écoles", GraduationCap, undefined, "discover")}
        </div>

        {/* Ressources */}
        <div className="mt-4">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Ressources
          </p>
          {navLink("/student/bons-plans", "Bons Plans & Aides", Gift, undefined, "resources")}
          {navLink("/student/simulateur", "Simulateur salaire", Calculator, undefined, "resources")}
        </div>

        {/* AI Feature */}
        <div className="mt-4">
          <div className="relative overflow-hidden rounded-lg border border-violet-500/30 bg-violet-500/10 p-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-400" />
              <span className="text-xs font-medium text-violet-300">Rapport IA</span>
              <span className="ml-auto rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold text-violet-400 border border-violet-500/30">
                BIENTÔT
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Génère tes rapports automatiquement
            </p>
          </div>
        </div>
      </nav>

      {/* User Profile */}
      <div className="border-t border-slate-800 p-3">
        {/* Status badge */}
        <div className="mb-2 px-2 flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${status.color}`} />
          <span className={`text-[11px] font-medium ${status.text}`}>{status.label}</span>
          {isSearching && (
            <span className="ml-auto text-[9px] text-amber-400 font-semibold">
              Visible recruteurs ✓
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 rounded-lg p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image ?? undefined} />
            <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-white">{user.name ?? "Étudiant"}</p>
            <p className="truncate text-xs text-slate-500">{user.school ?? user.email}</p>
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
