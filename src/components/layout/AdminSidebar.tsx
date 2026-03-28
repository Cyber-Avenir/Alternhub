"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
  ChevronRight,
  Shield,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Utilisateurs", icon: Users },
  { href: "/admin/stats", label: "Statistiques", icon: BarChart3 },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
];

interface AdminSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-950 text-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-orange-500">
          <Shield className="h-4 w-4 text-white" />
        </div>
        <div>
          <span className="block text-lg font-bold tracking-tight leading-none">AlternHub</span>
          <span className="text-[10px] font-semibold text-rose-400 uppercase tracking-wider">
            Administration
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Administration
        </p>
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className={cn("h-4 w-4", isActive ? "text-rose-400" : "")} />
              {item.label}
              {isActive && <ChevronRight className="ml-auto h-3 w-3 text-rose-400" />}
            </Link>
          );
        })}

        {/* Platform info */}
        <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900/50 p-3">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-xs font-medium text-slate-300">Plateforme</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Version</span>
              <span className="text-slate-300 font-medium">MVP 1.0</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Environnement</span>
              <span className="text-green-400 font-medium">Production</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Admin Profile */}
      <div className="border-t border-slate-800 p-3">
        <div className="flex items-center gap-3 rounded-lg p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image ?? undefined} />
            <AvatarFallback className="bg-gradient-to-br from-rose-500 to-orange-500 text-xs">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-white">{user.name ?? "Admin"}</p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
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
