"use client";

import { useState } from "react";
import {
  FileText, User, Download, Share2, Sparkles, MapPin, Mail,
  Linkedin, Github, Building2, GraduationCap, Star, Upload,
  Eye, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { parseTags, formatDate } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────────── */
interface UserSkill {
  id: string;
  level: number;
  skill: { name: string; category: string };
}

interface Mission {
  id: string;
  title: string;
  description: string | null;
  impact: string | null;
  tags: string | null;
  status: string;
  createdAt: Date;
}

interface UserProfile {
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
    githubUrl: string | null;
    portfolioUrl: string | null;
    startDate: Date | null;
    endDate: Date | null;
    searchType: string | null;
    searchStartDate: Date | null;
    searchEndDate: Date | null;
    cvUrl: string | null;
    schoolOfferUrl: string | null;
    motivationLetter: string | null;
  } | null;
}

interface CVDisplayClientProps {
  user: UserProfile | null;
  missions: Mission[];
  userSkills: UserSkill[];
  skillsByCategory: Record<string, UserSkill[]>;
}

/* ─── AlternHub CV Component ─────────────────────────────── */
function AlternHubCV({ user, missions, userSkills, skillsByCategory }: CVDisplayClientProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* CV Preview */}
      <div className="lg:col-span-2">
        <Card className="overflow-hidden shadow-lg">
          {/* CV Header */}
          <div className="bg-gradient-to-r from-slate-900 to-primary-900 p-8 text-white">
            <h2 className="text-3xl font-bold">{user?.name ?? "Votre Nom"}</h2>
            <p className="text-primary-300 font-medium mt-1">
              {user?.profile?.position ?? "Alternant(e)"}
              {user?.profile?.company && ` @ ${user.profile.company}`}
            </p>
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-300">
              {user?.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />{user.email}
                </span>
              )}
              {user?.profile?.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />{user.profile.location}
                </span>
              )}
              {user?.profile?.linkedinUrl && (
                <span className="flex items-center gap-1.5">
                  <Linkedin className="h-3.5 w-3.5" />LinkedIn
                </span>
              )}
              {user?.profile?.githubUrl && (
                <span className="flex items-center gap-1.5">
                  <Github className="h-3.5 w-3.5" />GitHub
                </span>
              )}
            </div>
          </div>

          <CardContent className="p-8 space-y-8">
            {user?.profile?.bio && (
              <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Profil</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{user.profile.bio}</p>
              </section>
            )}

            {(user?.profile?.company || user?.profile?.school) && (
              <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                  Expérience & Formation
                </h3>
                <div className="space-y-4">
                  {user?.profile?.company && (
                    <div className="flex gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 border border-primary-100">
                        <Building2 className="h-4 w-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{user.profile.position ?? "Alternant"}</p>
                        <p className="text-sm text-primary-600 font-medium">{user.profile.company}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {user.profile.startDate ? formatDate(user.profile.startDate) : ""}
                          {user.profile.startDate && " — "}
                          {user.profile.endDate ? formatDate(user.profile.endDate) : "Présent"}
                        </p>
                      </div>
                    </div>
                  )}
                  {user?.profile?.school && (
                    <div className="flex gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 border border-violet-100">
                        <GraduationCap className="h-4 w-4 text-violet-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Étudiant(e) en alternance</p>
                        <p className="text-sm text-violet-600 font-medium">{user.profile.school}</p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {missions.length > 0 && (
              <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                  Missions & Réalisations
                </h3>
                <div className="space-y-4">
                  {missions.slice(0, 8).map((mission) => {
                    const tags = parseTags(mission.tags);
                    return (
                      <div key={mission.id} className="border-l-2 border-primary-200 pl-4">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-slate-900 text-sm">{mission.title}</p>
                          <span className="text-xs text-slate-400 shrink-0">{formatDate(mission.createdAt)}</span>
                        </div>
                        {mission.description && (
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{mission.description}</p>
                        )}
                        {mission.impact && (
                          <p className="text-xs text-green-600 font-medium mt-1">↑ {mission.impact}</p>
                        )}
                        {tags.length > 0 && (
                          <div className="flex gap-1 mt-1.5 flex-wrap">
                            {tags.map((tag) => (
                              <span key={tag} className="rounded-sm bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {Object.keys(skillsByCategory).length > 0 && (
              <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Compétences</h3>
                <div className="space-y-3">
                  {Object.entries(skillsByCategory).map(([category, skills]) => (
                    <div key={category}>
                      <p className="text-xs font-semibold text-slate-600 mb-2">{category}</p>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((us) => (
                          <div key={us.id} className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1">
                            <span className="text-xs font-medium text-slate-700">{us.skill.name}</span>
                            <div className="flex">
                              {Array.from({ length: us.level }).map((_, i) => (
                                <Star key={i} className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right panel */}
      <div className="space-y-6">
        <Card className="border-violet-200 bg-gradient-to-br from-violet-50 to-primary-50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-violet-500" />
              <span className="font-semibold text-violet-700">Suggestions IA</span>
              <Badge variant="purple" className="text-[10px]">BIENTÔT</Badge>
            </div>
            <div className="space-y-2 text-sm text-slate-600">
              <p>✓ Ajoutez votre résumé de profil</p>
              <p>✓ Complétez vos dates de mission</p>
              <p>✓ Quantifiez vos impacts</p>
              <p className="text-slate-400">→ +3 missions recommandées à compléter</p>
            </div>
            <Button variant="outline" className="w-full mt-4 border-violet-200 text-violet-700 hover:bg-violet-50" disabled>
              <Sparkles className="h-3.5 w-3.5 mr-2" />
              Améliorer avec l&apos;IA
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 space-y-3">
            <h3 className="font-semibold text-slate-800">Résumé du profil</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Missions</span>
                <span className="font-medium text-slate-800">{missions.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Compétences</span>
                <span className="font-medium text-slate-800">{userSkills.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Compétences Expert+</span>
                <span className="font-medium text-slate-800">
                  {userSkills.filter((us) => us.level >= 4).length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Missions terminées</span>
                <span className="font-medium text-green-600">
                  {missions.filter((m) => m.status === "COMPLETED").length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-slate-50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">Export PDF</span>
            </div>
            <p className="text-xs text-slate-500">
              L&apos;export PDF est disponible dans la version Pro. Vos données sont déjà prêtes !
            </p>
            <Button variant="outline" className="w-full mt-3 text-xs h-8" disabled>
              Passer au Pro →
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ─── Imported CV Viewer ─────────────────────────────────── */
function ImportedCVViewer({ url }: { url: string }) {
  const isPDF = url.toLowerCase().endsWith(".pdf");

  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <FileText className="h-4 w-4 text-slate-800" />
          CV importé
        </div>
        <a
          href={url}
          download
          className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-900 transition-colors"
        >
          <Download className="h-3.5 w-3.5" /> Télécharger
        </a>
      </div>
      {isPDF ? (
        <iframe
          src={`${url}#toolbar=0`}
          className="w-full"
          style={{ height: "80vh" }}
          title="CV importé"
        />
      ) : (
        <div className="flex items-center justify-center h-64 text-slate-400 flex-col gap-3 bg-white">
          <FileText className="h-12 w-12 opacity-30" />
          <p className="text-sm">Prévisualisation non disponible pour ce format</p>
          <a
            href={url}
            download
            className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900"
          >
            Télécharger le fichier
          </a>
        </div>
      )}
    </div>
  );
}

/* ─── Main Page Client ───────────────────────────────────── */
export function CVDisplayClient({ user, missions, userSkills, skillsByCategory }: CVDisplayClientProps) {
  const hasImportedCV = !!user?.profile?.cvUrl;
  const [cvView, setCvView] = useState<"alternhub" | "imported">(hasImportedCV ? "imported" : "alternhub");

  return (
    <div className="p-8">
      {/* Page header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mon CV</h1>
          <p className="text-slate-500 mt-1">Visualisez votre CV ou importez un fichier personnel</p>
        </div>
        {cvView === "alternhub" && (
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" />
              Partager
            </Button>
            <Button variant="gradient" className="gap-2">
              <Download className="h-4 w-4" />
              Télécharger PDF
            </Button>
          </div>
        )}
      </div>

      {/* CV source toggle — only shown if an imported CV exists */}
      {hasImportedCV && (
        <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-xs text-slate-500 font-medium">Source du CV :</span>
          <div className="flex gap-1 rounded-lg bg-white border border-slate-200 p-0.5">
            <button
              onClick={() => setCvView("alternhub")}
              className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold transition-all ${
                cvView === "alternhub"
                  ? "bg-primary-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              CV AlternHub
            </button>
            <button
              onClick={() => setCvView("imported")}
              className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold transition-all ${
                cvView === "imported"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Upload className="h-4 w-4" />
              CV importé
            </button>
          </div>
        </div>
      )}

      {/* Nudge to upload CV if none exists */}
      {!hasImportedCV && (
        <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-primary-50 border border-primary-100">
          <Sparkles className="h-4 w-4 text-primary-500 shrink-0" />
          <p className="text-sm text-primary-700 flex-1">
            Vous utilisez le <strong>CV AlternHub</strong>, généré automatiquement depuis votre profil.
            Vous pouvez aussi <strong>importer votre propre CV</strong> (PDF, Word) depuis{" "}
            <strong>Mon Profil</strong>.
          </p>
          <ChevronRight className="h-4 w-4 text-primary-400 shrink-0" />
        </div>
      )}

      {/* CV Display */}
      {cvView === "alternhub" ? (
        <AlternHubCV
          user={user}
          missions={missions}
          userSkills={userSkills}
          skillsByCategory={skillsByCategory}
        />
      ) : (
        user?.profile?.cvUrl && <ImportedCVViewer url={user.profile.cvUrl} />
      )}
    </div>
  );
}
