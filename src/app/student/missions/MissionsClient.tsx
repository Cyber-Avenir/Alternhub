"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Target, Clock, CheckCircle2, Circle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getStatusLabel,
  getStatusColor,
  getPriorityColor,
  getPriorityLabel,
  parseTags,
  formatDateRelative,
} from "@/lib/utils";
import type { Mission } from "@prisma/client";

interface MissionsClientProps {
  missions: Mission[];
  userId: string;
}

type Status = "ALL" | "TODO" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

const statusIcons = {
  TODO: Circle,
  IN_PROGRESS: Clock,
  COMPLETED: CheckCircle2,
  CANCELLED: AlertCircle,
};

const statusColors = {
  TODO: "text-slate-400",
  IN_PROGRESS: "text-blue-500",
  COMPLETED: "text-green-500",
  CANCELLED: "text-red-400",
};

export function MissionsClient({ missions: initialMissions, userId }: MissionsClientProps) {
  const router = useRouter();
  const [missions, setMissions] = useState(initialMissions);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<Status>("ALL");
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    impact: "",
    tags: "",
  });

  const filtered = missions.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      (m.description ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === "ALL" || m.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const counts = {
    ALL: missions.length,
    TODO: missions.filter((m) => m.status === "TODO").length,
    IN_PROGRESS: missions.filter((m) => m.status === "IN_PROGRESS").length,
    COMPLETED: missions.filter((m) => m.status === "COMPLETED").length,
    CANCELLED: missions.filter((m) => m.status === "CANCELLED").length,
  };

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const tagsArray = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const res = await fetch("/api/missions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, tags: JSON.stringify(tagsArray), userId }),
    });

    if (res.ok) {
      const newMission = await res.json();
      setMissions((prev) => [newMission, ...prev]);
      setShowDialog(false);
      setForm({ title: "", description: "", status: "IN_PROGRESS", priority: "MEDIUM", impact: "", tags: "" });
      router.refresh();
    }
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/missions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setMissions((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mes Missions</h1>
          <p className="text-slate-500 mt-1">{missions.length} missions enregistrées</p>
        </div>
        <Button variant="gradient" onClick={() => setShowDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle mission
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Rechercher une mission..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Status)}>
        <TabsList className="mb-6">
          <TabsTrigger value="ALL">Toutes ({counts.ALL})</TabsTrigger>
          <TabsTrigger value="IN_PROGRESS">En cours ({counts.IN_PROGRESS})</TabsTrigger>
          <TabsTrigger value="TODO">À faire ({counts.TODO})</TabsTrigger>
          <TabsTrigger value="COMPLETED">Terminées ({counts.COMPLETED})</TabsTrigger>
          <TabsTrigger value="CANCELLED">Annulées ({counts.CANCELLED})</TabsTrigger>
        </TabsList>

        {(["ALL", "TODO", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as Status[]).map((tab) => (
          <TabsContent key={tab} value={tab}>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Target className="h-12 w-12 mb-4 opacity-20" />
                <p className="text-lg font-medium">Aucune mission trouvée</p>
                <p className="text-sm mt-1">
                  {search ? "Essayez un autre terme de recherche" : "Créez votre première mission !"}
                </p>
                {!search && (
                  <Button variant="outline" className="mt-4" onClick={() => setShowDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une mission
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((mission) => {
                  const tags = parseTags(mission.tags);
                  const StatusIcon = statusIcons[mission.status as keyof typeof statusIcons] ?? Circle;
                  const iconColor = statusColors[mission.status as keyof typeof statusColors] ?? "text-slate-400";

                  return (
                    <Card key={mission.id} className="hover:shadow-md transition-all hover:-translate-y-0.5">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="mt-0.5">
                            <StatusIcon className={`h-5 w-5 ${iconColor}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900">{mission.title}</h3>
                            {mission.description && (
                              <p className="text-sm text-slate-500 mt-1 line-clamp-2">{mission.description}</p>
                            )}
                            {mission.impact && (
                              <div className="mt-2 rounded-lg bg-green-50 border border-green-100 px-3 py-1.5">
                                <p className="text-xs text-green-700">
                                  <span className="font-semibold">Impact :</span> {mission.impact}
                                </p>
                              </div>
                            )}
                            <div className="flex items-center gap-2 mt-3 flex-wrap">
                              <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(mission.status)}`}>
                                {getStatusLabel(mission.status)}
                              </span>
                              <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getPriorityColor(mission.priority)}`}>
                                {getPriorityLabel(mission.priority)}
                              </span>
                              {tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <span className="text-xs text-slate-400">{formatDateRelative(mission.createdAt)}</span>
                            {mission.status === "IN_PROGRESS" && (
                              <button
                                onClick={() => updateStatus(mission.id, "COMPLETED")}
                                className="text-xs font-medium text-green-600 hover:text-green-700 hover:underline"
                              >
                                Marquer terminée
                              </button>
                            )}
                            {mission.status === "TODO" && (
                              <button
                                onClick={() => updateStatus(mission.id, "IN_PROGRESS")}
                                className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                              >
                                Démarrer
                              </button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Add Mission Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nouvelle mission</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Titre *</Label>
              <Input
                placeholder="ex: Développer l'API d'authentification"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <textarea
                className="flex min-h-[80px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 resize-none"
                placeholder="Décrivez la mission..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Statut</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODO">À faire</SelectItem>
                    <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                    <SelectItem value="COMPLETED">Terminée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priorité</Label>
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Faible</SelectItem>
                    <SelectItem value="MEDIUM">Normale</SelectItem>
                    <SelectItem value="HIGH">Haute</SelectItem>
                    <SelectItem value="URGENT">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Impact / Résultat</Label>
              <Input
                placeholder="ex: Réduction du temps de réponse de 40%"
                value={form.impact}
                onChange={(e) => setForm({ ...form, impact: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Tags (séparés par des virgules)</Label>
              <Input
                placeholder="ex: React, API, Performance"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                Annuler
              </Button>
              <Button type="submit" variant="gradient" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Créer la mission"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
