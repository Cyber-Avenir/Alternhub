import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return format(new Date(date), "dd MMM yyyy", { locale: fr });
}

export function formatDateRelative(date: Date | string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
}

export function getInitials(name?: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    TODO: "À faire",
    IN_PROGRESS: "En cours",
    COMPLETED: "Terminée",
    CANCELLED: "Annulée",
  };
  return labels[status] ?? status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    TODO: "bg-slate-100 text-slate-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };
  return colors[status] ?? "bg-slate-100 text-slate-700";
}

export function getPriorityLabel(priority: string): string {
  const labels: Record<string, string> = {
    LOW: "Faible",
    MEDIUM: "Normale",
    HIGH: "Haute",
    URGENT: "Urgente",
  };
  return labels[priority] ?? priority;
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    LOW: "bg-slate-100 text-slate-600",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    HIGH: "bg-orange-100 text-orange-700",
    URGENT: "bg-red-100 text-red-700",
  };
  return colors[priority] ?? "bg-slate-100 text-slate-600";
}

export function getLevelLabel(level: number): string {
  const labels: Record<number, string> = {
    1: "Débutant",
    2: "Intermédiaire",
    3: "Avancé",
    4: "Expert",
    5: "Maître",
  };
  return labels[level] ?? "Débutant";
}

export function parseTags(tags: string): string[] {
  try {
    return JSON.parse(tags);
  } catch {
    return [];
  }
}

export function calculateScore(
  missions: { status: string }[],
  skillCount: number,
  candidatures?: { status: string }[]
): number {
  const completedMissions = missions.filter((m) => m.status === "COMPLETED").length;
  const inProgressMissions = missions.filter((m) => m.status === "IN_PROGRESS").length;
  let base = completedMissions * 10 + inProgressMissions * 5 + skillCount * 3;

  if (candidatures && candidatures.length > 0) {
    const applied = candidatures.filter((c) => c.status === "APPLIED").length;
    const interview = candidatures.filter((c) => c.status === "INTERVIEW").length;
    const offer = candidatures.filter((c) => c.status === "OFFER").length;
    base += applied * 2 + interview * 5 + offer * 10;
  }

  return Math.min(base, 100);
}
