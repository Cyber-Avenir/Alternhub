import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  color?: "blue" | "green" | "violet" | "orange" | "rose";
}

const colorMap = {
  blue: {
    bg: "bg-blue-50",
    icon: "bg-blue-100 text-blue-600",
    trend: "text-blue-600",
  },
  green: {
    bg: "bg-green-50",
    icon: "bg-green-100 text-green-600",
    trend: "text-green-600",
  },
  violet: {
    bg: "bg-violet-50",
    icon: "bg-violet-100 text-violet-600",
    trend: "text-violet-600",
  },
  orange: {
    bg: "bg-orange-50",
    icon: "bg-orange-100 text-orange-600",
    trend: "text-orange-600",
  },
  rose: {
    bg: "bg-rose-50",
    icon: "bg-rose-100 text-rose-600",
    trend: "text-rose-600",
  },
};

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "blue",
}: StatsCardProps) {
  const colors = colorMap[color];

  return (
    <div className={cn("rounded-xl p-5 border border-slate-200 bg-white shadow-sm", colors.bg)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
          {trend && (
            <div className={cn("mt-2 flex items-center gap-1 text-xs font-medium", colors.trend)}>
              <span>+{trend.value}%</span>
              <span className="text-slate-400">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", colors.icon)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
