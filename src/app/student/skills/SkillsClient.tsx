"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Zap, Loader2, Star, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { getLevelLabel } from "@/lib/utils";
import type { Skill, UserSkill } from "@prisma/client";

type UserSkillWithSkill = UserSkill & { skill: Skill };

interface SkillsClientProps {
  userSkills: UserSkillWithSkill[];
  allSkills: Skill[];
  userId: string;
}

const categoryColors: Record<string, string> = {
  Frontend: "bg-blue-50 border-blue-200 text-blue-700",
  Backend: "bg-green-50 border-green-200 text-green-700",
  Database: "bg-orange-50 border-orange-200 text-orange-700",
  DevOps: "bg-violet-50 border-violet-200 text-violet-700",
  Design: "bg-pink-50 border-pink-200 text-pink-700",
  Data: "bg-yellow-50 border-yellow-200 text-yellow-700",
  Security: "bg-red-50 border-red-200 text-red-700",
  "Soft Skills": "bg-slate-50 border-slate-200 text-slate-700",
};

const levelColors = [
  "",
  "from-slate-400 to-slate-500",
  "from-blue-400 to-blue-500",
  "from-green-400 to-green-500",
  "from-orange-400 to-orange-500",
  "from-violet-500 to-primary-600",
];

export function SkillsClient({ userSkills: initialSkills, allSkills, userId }: SkillsClientProps) {
  const router = useRouter();
  const [userSkills, setUserSkills] = useState(initialSkills);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [level, setLevel] = useState("3");

  const addedSkillIds = new Set(userSkills.map((us) => us.skillId));
  const availableSkills = allSkills.filter(
    (s) =>
      !addedSkillIds.has(s.id) &&
      s.name.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = userSkills.reduce<Record<string, UserSkillWithSkill[]>>((acc, us) => {
    const cat = us.skill.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(us);
    return acc;
  }, {});

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSkillId) return;
    setLoading(true);

    const res = await fetch("/api/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skillId: selectedSkillId, level: parseInt(level), userId }),
    });

    if (res.ok) {
      const newUserSkill = await res.json();
      setUserSkills((prev) => [newUserSkill, ...prev]);
      setShowDialog(false);
      setSelectedSkillId("");
      setLevel("3");
      router.refresh();
    }
    setLoading(false);
  }

  async function updateLevel(userSkillId: string, newLevel: number) {
    const res = await fetch(`/api/skills/${userSkillId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level: newLevel }),
    });
    if (res.ok) {
      setUserSkills((prev) =>
        prev.map((us) => (us.id === userSkillId ? { ...us, level: newLevel } : us))
      );
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mes Compétences</h1>
          <p className="text-slate-500 mt-1">{userSkills.length} compétences tracées</p>
        </div>
        <Button variant="gradient" onClick={() => setShowDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter une compétence
        </Button>
      </div>

      {/* Overview */}
      {userSkills.length > 0 && (
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card className="bg-gradient-to-br from-primary-50 to-violet-50 border-primary-100">
            <CardContent className="p-5">
              <p className="text-3xl font-bold text-primary-700">{userSkills.length}</p>
              <p className="text-sm text-slate-500 mt-1">Compétences totales</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
            <CardContent className="p-5">
              <p className="text-3xl font-bold text-green-700">
                {userSkills.filter((us) => us.level >= 4).length}
              </p>
              <p className="text-sm text-slate-500 mt-1">Niveau Expert+</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-100">
            <CardContent className="p-5">
              <p className="text-3xl font-bold text-orange-700">
                {Object.keys(grouped).length}
              </p>
              <p className="text-sm text-slate-500 mt-1">Catégories</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Skills by category */}
      {Object.keys(grouped).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <Zap className="h-16 w-16 mb-4 opacity-20" />
          <p className="text-xl font-medium">Aucune compétence tracée</p>
          <p className="text-sm mt-2">Ajoutez vos premières compétences !</p>
          <Button variant="outline" className="mt-6" onClick={() => setShowDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une compétence
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([category, skills]) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-4">
                <span className={`rounded-full border px-3 py-1 text-sm font-semibold ${categoryColors[category] ?? "bg-slate-50 border-slate-200 text-slate-700"}`}>
                  {category}
                </span>
                <span className="text-sm text-slate-400">{skills.length} compétences</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {skills.map((us) => (
                  <Card key={us.id} className="hover:shadow-md transition-all hover:-translate-y-0.5">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-slate-900">{us.skill.name}</h3>
                        <span className={`rounded-full bg-gradient-to-r ${levelColors[us.level]} px-2.5 py-0.5 text-xs font-bold text-white`}>
                          {getLevelLabel(us.level)}
                        </span>
                      </div>

                      {/* Level stars */}
                      <div className="flex items-center gap-1 mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => updateLevel(us.id, i + 1)}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              className={`h-4 w-4 ${
                                i < us.level
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-slate-200"
                              }`}
                            />
                          </button>
                        ))}
                      </div>

                      {/* Progress bar */}
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${levelColors[us.level]} rounded-full transition-all`}
                          style={{ width: `${(us.level / 5) * 100}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Skill Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une compétence</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Rechercher une compétence</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="React, Python, Figma..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1 rounded-lg border border-slate-200 p-2">
              {availableSkills.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">Aucune compétence disponible</p>
              ) : (
                availableSkills.map((skill) => (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => setSelectedSkillId(skill.id)}
                    className={`w-full text-left rounded-md px-3 py-2 text-sm transition-colors flex items-center justify-between ${
                      selectedSkillId === skill.id
                        ? "bg-primary-50 text-primary-700 font-medium"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span>{skill.name}</span>
                    <span className={`text-xs rounded-full px-2 py-0.5 ${categoryColors[skill.category] ?? "bg-slate-100 text-slate-500"}`}>
                      {skill.category}
                    </span>
                  </button>
                ))
              )}
            </div>

            <div className="space-y-2">
              <Label>Niveau actuel</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Débutant</SelectItem>
                  <SelectItem value="2">2 - Intermédiaire</SelectItem>
                  <SelectItem value="3">3 - Avancé</SelectItem>
                  <SelectItem value="4">4 - Expert</SelectItem>
                  <SelectItem value="5">5 - Maître</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                Annuler
              </Button>
              <Button type="submit" variant="gradient" disabled={loading || !selectedSkillId}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
