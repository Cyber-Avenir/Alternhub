"use client";

import { useState } from "react";
import {
  X, Heart, Star, MapPin, GraduationCap, Zap, Briefcase,
  ChevronLeft, ChevronRight, Eye, Lock, MessageSquare, Trophy,
  Users, Loader,
} from "lucide-react";
import { computeMatchScore, getMatchLabel } from "@/lib/matching";

interface StudentProfile {
  id: string;
  name: string | null;
  email: string;
  searchStatus: string;
  profile: {
    bio: string | null;
    school: string | null;
    company: string | null;
    position: string | null;
    location: string | null;
    phone: string | null;
    linkedinUrl: string | null;
    ecole: { name: string; city: string | null } | null;
  } | null;
  skills: { skillId: string; level: number; skill: { name: string; category: string } }[];
  missions: { title: string; status: string }[];
}

interface OffreItem {
  id: string;
  title: string;
  skills: { skillId: string; required: boolean; weight: number; skill: { id: string; name: string } }[];
}

interface Props {
  students: StudentProfile[];
  offres: OffreItem[];
  isPremium: boolean;
}

export function CandidatsSwipeClient({ students, offres, isPremium }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOffre, setSelectedOffre] = useState<string>(offres[0]?.id ?? "");
  const [liked, setLiked] = useState<string[]>([]);
  const [passed, setPassed] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"swipe" | "list">("swipe");
  const [selectedStudent, setSelectedStudent] = useState<{ studentId: string; offreId: string } | null>(null);
  const [inviting, setInviting] = useState(false);

  const activeOffre = offres.find((o) => o.id === selectedOffre);

  const offreSkills = activeOffre
    ? activeOffre.skills.map((s) => ({ skillId: s.skill.id, required: s.required, weight: s.weight }))
    : [];

  const scoredStudents = students
    .filter((s) => !passed.includes(s.id))
    .map((s) => ({
      ...s,
      matchScore: computeMatchScore(
        s.skills.map((sk) => ({ skillId: sk.skillId, level: sk.level })),
        offreSkills
      ),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);

  const current = scoredStudents[currentIdx];

  function handleLike() {
    if (!current) return;
    setLiked((prev) => [...prev, current.id]);
    setCurrentIdx((i) => Math.min(i + 1, scoredStudents.length - 1));
  }

  function handlePass() {
    if (!current) return;
    setPassed((prev) => [...prev, current.id]);
    setCurrentIdx((i) => Math.min(i + 1, scoredStudents.length - 1));
  }

  function handlePrev() {
    setCurrentIdx((i) => Math.max(i - 1, 0));
  }

  async function handleInviteToPipeline() {
    if (!selectedStudent) return;
    setInviting(true);
    try {
      const res = await fetch("/api/candidatures/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offreId: selectedStudent.offreId }),
      });
      if (res.ok) {
        alert("Candidat ajouté au pipeline!");
        setSelectedStudent(null);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Erreur lors de l'ajout au pipeline");
    } finally {
      setInviting(false);
    }
  }

  if (students.length === 0) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-96 text-slate-400">
        <Users className="h-16 w-16 mb-4 opacity-20" />
        <p className="text-lg font-medium text-slate-600">Aucun étudiant en recherche active</p>
        <p className="text-sm mt-1">Les étudiants apparaissent ici quand ils activent le mode "En recherche"</p>
      </div>
    );
  }

  const matchInfo = current ? getMatchLabel(current.matchScore) : null;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Explorer les candidats</h1>
          <p className="text-slate-500 text-sm mt-1">
            {scoredStudents.length} étudiant{scoredStudents.length !== 1 ? "s" : ""} en recherche active · Triés par compatibilité
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("swipe")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              viewMode === "swipe" ? "bg-rose-600 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Mode carte
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              viewMode === "list" ? "bg-rose-600 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Liste
          </button>
        </div>
      </div>

      {/* Offre selector */}
      {offres.length > 0 && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold text-slate-500 mb-2">Calculer la compatibilité pour :</p>
          <div className="flex flex-wrap gap-2">
            {offres.map((o) => (
              <button
                key={o.id}
                onClick={() => setSelectedOffre(o.id)}
                className={`rounded-xl border px-3 py-1.5 text-sm font-medium transition-all ${
                  selectedOffre === o.id
                    ? "border-rose-500 bg-rose-50 text-rose-700"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {o.title}
              </button>
            ))}
            <button
              onClick={() => setSelectedOffre("")}
              className={`rounded-xl border px-3 py-1.5 text-sm font-medium transition-all ${
                !selectedOffre ? "border-rose-500 bg-rose-50 text-rose-700" : "border-slate-200 text-slate-600"
              }`}
            >
              Tous profils
            </button>
          </div>
        </div>
      )}

      {/* Liked count */}
      {liked.length > 0 && (
        <div className="mb-4 rounded-xl bg-green-50 border border-green-200 px-4 py-2.5 flex items-center gap-2">
          <Heart className="h-4 w-4 text-green-600 fill-green-600" />
          <span className="text-sm font-semibold text-green-700">
            {liked.length} candidat{liked.length > 1 ? "s" : ""} présélectionné{liked.length > 1 ? "s" : ""}
          </span>
        </div>
      )}

      {viewMode === "swipe" ? (
        /* SWIPE MODE */
        <div className="flex flex-col items-center gap-6">
          {!current ? (
            <div className="text-center py-16 text-slate-400">
              <Trophy className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="text-lg font-medium text-slate-600">Vous avez vu tous les profils !</p>
              <p className="text-sm mt-1">Revenez demain pour de nouveaux candidats</p>
            </div>
          ) : (
            <>
              <div className="text-sm text-slate-400">{currentIdx + 1} / {scoredStudents.length}</div>
              <div className="w-full max-w-md">
                <div className="rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">
                  {/* Match score header */}
                  <div className={`p-4 ${matchInfo?.bg ?? "bg-slate-100"} flex items-center justify-between`}>
                    <div>
                      <p className={`text-sm font-bold ${matchInfo?.color ?? "text-slate-600"}`}>{matchInfo?.label}</p>
                      {activeOffre && (
                        <p className="text-xs text-slate-500 mt-0.5">{activeOffre.title}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className={`text-3xl font-extrabold ${matchInfo?.color ?? "text-slate-600"}`}>{current.matchScore}%</p>
                      <p className="text-xs text-slate-400">compatibilité</p>
                    </div>
                  </div>

                  {/* Student info */}
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-violet-500 text-xl font-bold text-white">
                        {(current.name ?? current.email).charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900">{current.name ?? "Étudiant"}</h3>
                        {current.profile?.position && (
                          <p className="text-sm text-primary-600 font-medium">{current.profile.position}</p>
                        )}
                        {current.profile?.location && (
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3" />{current.profile.location}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* School */}
                    {(current.profile?.ecole || current.profile?.school) && (
                      <div className="flex items-center gap-2 mb-3 rounded-xl bg-slate-50 border border-slate-200 px-3 py-2">
                        <GraduationCap className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-700 font-medium">
                          {current.profile.ecole?.name ?? current.profile.school}
                        </span>
                        {current.profile.ecole?.city && (
                          <span className="text-xs text-slate-400">· {current.profile.ecole.city}</span>
                        )}
                      </div>
                    )}

                    {/* Bio */}
                    {current.profile?.bio && (
                      <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
                        {current.profile.bio}
                      </p>
                    )}

                    {/* Skills */}
                    {current.skills.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
                          <Zap className="h-3.5 w-3.5" /> Compétences
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {current.skills.slice(0, 6).map((s) => {
                            const isMatch = offreSkills.some((os) => os.skillId === s.skillId);
                            return (
                              <span
                                key={s.skillId}
                                className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
                                  isMatch
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-slate-50 text-slate-600 border-slate-200"
                                }`}
                              >
                                {isMatch ? "✓ " : ""}{s.skill.name} ·{s.level}/5
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Completed missions */}
                    {current.missions.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
                          <Briefcase className="h-3.5 w-3.5" /> Expériences ({current.missions.length} mission{current.missions.length > 1 ? "s" : ""})
                        </p>
                        <div className="space-y-1">
                          {current.missions.slice(0, 3).map((m) => (
                            <p key={m.title} className="text-xs text-slate-600">✓ {m.title}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Premium contact info */}
                    {isPremium ? (
                      <div className="rounded-xl bg-primary-50 border border-primary-100 p-3 space-y-1">
                        <p className="text-xs font-semibold text-primary-700">Contact direct</p>
                        <p className="text-sm font-medium text-primary-800">{current.email}</p>
                        {current.profile?.phone && (
                          <p className="text-sm font-medium text-primary-800">{current.profile.phone}</p>
                        )}
                        {current.profile?.linkedinUrl && (
                          <a href={current.profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 hover:underline">
                            LinkedIn →
                          </a>
                        )}
                      </div>
                    ) : (
                      <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 flex items-center gap-2">
                        <Lock className="h-4 w-4 text-amber-500" />
                        <span className="text-xs text-amber-700 font-medium">
                          Email & téléphone disponibles avec le plan Pro
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-center gap-6 px-6 pb-6">
                    <button
                      onClick={handlePrev}
                      disabled={currentIdx === 0}
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all disabled:opacity-30"
                    >
                      <ChevronLeft className="h-5 w-5 text-slate-400" />
                    </button>
                    <button
                      onClick={handlePass}
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-white border-2 border-slate-200 shadow-md hover:border-red-300 hover:shadow-lg transition-all"
                    >
                      <X className="h-7 w-7 text-slate-400 hover:text-red-500 transition-colors" />
                    </button>
                    <button
                      onClick={handleLike}
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-500 shadow-md hover:shadow-lg hover:scale-105 transition-all"
                    >
                      <Heart className="h-7 w-7 text-white fill-white" />
                    </button>
                    <button
                      onClick={() => setCurrentIdx((i) => Math.min(i + 1, scoredStudents.length - 1))}
                      disabled={currentIdx >= scoredStudents.length - 1}
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all disabled:opacity-30"
                    >
                      <ChevronRight className="h-5 w-5 text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        /* LIST MODE */
        <div className="space-y-3">
          {scoredStudents.map((student) => {
            const mInfo = getMatchLabel(student.matchScore);
            const isLiked = liked.includes(student.id);
            return (
              <div
                key={student.id}
                onClick={() => selectedOffre && setSelectedStudent({ studentId: student.id, offreId: selectedOffre })}
                className={`rounded-2xl border bg-white p-5 transition-all cursor-pointer ${isLiked ? "border-green-300 bg-green-50" : "border-slate-200 hover:shadow-md hover:border-slate-300"}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-violet-500 text-lg font-bold text-white">
                    {(student.name ?? student.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-bold text-slate-900">{student.name ?? "Étudiant"}</p>
                        {student.profile?.position && (
                          <p className="text-sm text-primary-600">{student.profile.position}</p>
                        )}
                        {student.profile?.location && (
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />{student.profile.location}
                          </p>
                        )}
                      </div>
                      <div className={`shrink-0 rounded-xl border px-3 py-1.5 text-center ${mInfo.bg}`}>
                        <p className={`text-lg font-extrabold ${mInfo.color}`}>{student.matchScore}%</p>
                        <p className={`text-[10px] ${mInfo.color}`}>{mInfo.label}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {student.skills.slice(0, 5).map((s) => (
                        <span key={s.skillId} className="rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[11px] text-slate-600">
                          {s.skill.name}
                        </span>
                      ))}
                    </div>
                    {isPremium ? (
                      <p className="mt-2 text-sm text-primary-700 font-medium">{student.email}</p>
                    ) : (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600">
                        <Lock className="h-3.5 w-3.5" /> Contact visible avec le plan Pro
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setLiked((prev) => isLiked ? prev.filter((id) => id !== student.id) : [...prev, student.id])}
                    className={`shrink-0 flex h-10 w-10 items-center justify-center rounded-full border transition-all ${
                      isLiked ? "border-rose-300 bg-rose-50" : "border-slate-200 hover:border-rose-300"
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? "text-rose-500 fill-rose-500" : "text-slate-300"}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal pour voir les détails et ajouter au pipeline */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
            {(() => {
              const student = students.find((s) => s.id === selectedStudent.studentId);
              if (!student) return null;

              const matchInfo = getMatchLabel(
                students
                  .map((s) => ({
                    ...s,
                    matchScore: computeMatchScore(
                      s.skills.map((sk) => ({ skillId: sk.skillId, level: sk.level })),
                      activeOffre?.skills.map((s) => ({ skillId: s.skill.id, required: s.required, weight: s.weight })) ?? []
                    ),
                  }))
                  .find((s) => s.id === student.id)?.matchScore ?? 0
              );

              return (
                <div className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-violet-500 text-xl font-bold text-white">
                        {(student.name ?? student.email).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">{student.name ?? "Étudiant"}</h2>
                        <p className="text-sm text-slate-500">{student.email}</p>
                        {student.profile?.location && (
                          <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                            <MapPin className="h-3.5 w-3.5" />{student.profile.location}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedStudent(null)}
                      className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
                    >
                      ✕
                    </button>
                  </div>

                  <div className={`rounded-xl p-3 ${matchInfo.bg}`}>
                    <p className={`text-sm font-bold ${matchInfo.color}`}>{matchInfo.label}</p>
                    <p className={`text-2xl font-extrabold ${matchInfo.color}`}>
                      {students
                        .map((s) => ({
                          ...s,
                          matchScore: computeMatchScore(
                            s.skills.map((sk) => ({ skillId: sk.skillId, level: sk.level })),
                            activeOffre?.skills.map((s) => ({ skillId: s.skill.id, required: s.required, weight: s.weight })) ?? []
                          ),
                        }))
                        .find((s) => s.id === student.id)?.matchScore ?? 0}
                      % de compatibilité
                    </p>
                  </div>

                  {/* School & Bio */}
                  {student.profile?.ecole && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">École</p>
                      <p className="text-sm text-slate-700">{student.profile.ecole.name}</p>
                    </div>
                  )}

                  {student.profile?.bio && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">À propos</p>
                      <p className="text-sm text-slate-600">{student.profile.bio}</p>
                    </div>
                  )}

                  {/* Skills */}
                  {student.skills.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-2">Compétences</p>
                      <div className="flex flex-wrap gap-2">
                        {student.skills.map((s) => (
                          <span key={s.skillId} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                            {s.skill.name} · {s.level}/5
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <button
                      onClick={() => setSelectedStudent(null)}
                      className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Fermer
                    </button>
                    <button
                      onClick={handleInviteToPipeline}
                      disabled={inviting}
                      className="flex-1 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {inviting && <Loader className="h-4 w-4 animate-spin" />}
                      Ajouter au pipeline
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
