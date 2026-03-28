"use client";

import { useState, useRef } from "react";
import {
  User, MapPin, Phone, Linkedin, Github, Globe, Building2,
  GraduationCap, Search, Calendar, FileText, Upload, Save,
  CheckCircle2, AlertCircle, Eye, Download, X, Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { differenceInDays } from "date-fns";

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
    searchType: string | null;
    searchStartDate: Date | null;
    searchEndDate: Date | null;
    cvUrl: string | null;
    schoolOfferUrl: string | null;
    motivationLetter: string | null;
  } | null;
}

const SEARCH_STATUS_OPTIONS = [
  { value: "SEARCHING", label: "🔍 En recherche active", color: "text-amber-600 bg-amber-50 border-amber-200" },
  { value: "IN_ALTERNANCE", label: "✅ Déjà en alternance", color: "text-green-600 bg-green-50 border-green-200" },
  { value: "GRADUATED", label: "🎓 Diplômé", color: "text-violet-600 bg-violet-50 border-violet-200" },
];

interface DocumentPreviewProps {
  url: string;
  title: string;
  onClose: () => void;
}

function DocumentPreview({ url, title, onClose }: DocumentPreviewProps) {
  const isPDF = url.toLowerCase().endsWith(".pdf");

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary-500" />
            {title}
          </h3>
          <div className="flex items-center gap-2">
            <a
              href={url}
              download
              className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-700 transition-colors"
            >
              <Download className="h-3.5 w-3.5" /> Télécharger
            </a>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          {isPDF ? (
            <iframe
              src={`${url}#toolbar=0`}
              className="w-full h-full min-h-[70vh]"
              title={title}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-slate-400 flex-col gap-3">
              <FileText className="h-12 w-12 opacity-30" />
              <p className="text-sm">Prévisualisation non disponible pour ce format</p>
              <a
                href={url}
                download
                className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
              >
                Télécharger le fichier
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProfilClient({ user }: { user: UserProfile | null }) {
  const p = user?.profile;
  const [form, setForm] = useState({
    bio: p?.bio ?? "",
    school: p?.school ?? "",
    company: p?.company ?? "",
    position: p?.position ?? "",
    location: p?.location ?? "",
    phone: p?.phone ?? "",
    linkedinUrl: p?.linkedinUrl ?? "",
    githubUrl: p?.githubUrl ?? "",
    portfolioUrl: p?.portfolioUrl ?? "",
    searchStatus: user?.searchStatus ?? "SEARCHING",
    searchType: p?.searchType ?? "ALTERNANCE",
    searchStartDate: p?.searchStartDate ? new Date(p.searchStartDate).toISOString().split("T")[0] : "",
    searchEndDate: p?.searchEndDate ? new Date(p.searchEndDate).toISOString().split("T")[0] : "",
    motivationLetter: p?.motivationLetter ?? "",
  });

  const [cvUrl, setCvUrl] = useState(p?.cvUrl ?? "");
  const [schoolOfferUrl, setSchoolOfferUrl] = useState(p?.schoolOfferUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [uploadingOffer, setUploadingOffer] = useState(false);
  const [preview, setPreview] = useState<{ url: string; title: string } | null>(null);

  const cvRef = useRef<HTMLInputElement>(null);
  const offerRef = useRef<HTMLInputElement>(null);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  // Calculate urgency if in search
  const isSearching = form.searchStatus === "SEARCHING";
  const daysLeft = form.searchEndDate
    ? differenceInDays(new Date(form.searchEndDate), new Date())
    : null;
  const urgency = daysLeft !== null
    ? daysLeft <= 30 ? "URGENT" : daysLeft <= 60 ? "HIGH" : "NORMAL"
    : null;

  async function uploadFile(file: File, type: "cv" | "schoolOffer") {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", type);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.url as string;
  }

  async function handleCvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCv(true);
    try {
      const url = await uploadFile(file, "cv");
      setCvUrl(url);
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvUrl: url }),
      });
    } catch { /* ignore */ } finally { setUploadingCv(false); }
  }

  async function handleOfferUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingOffer(true);
    try {
      const url = await uploadFile(file, "schoolOffer");
      setSchoolOfferUrl(url);
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolOfferUrl: url }),
      });
    } catch { /* ignore */ } finally { setUploadingOffer(false); }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, cvUrl, schoolOfferUrl }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { /* ignore */ } finally { setSaving(false); }
  }

  return (
    <div className="p-8 max-w-3xl">
      {preview && (
        <DocumentPreview url={preview.url} title={preview.title} onClose={() => setPreview(null)} />
      )}

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-violet-600">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Mon Profil</h1>
            <p className="text-slate-500 text-sm">Visible par les recruteurs · Alimente votre CV et le matching</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* Statut de recherche */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Search className="h-4 w-4 text-primary-500" />
              Statut de recherche
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {SEARCH_STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set("searchStatus", opt.value)}
                  className={`rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
                    form.searchStatus === opt.value ? opt.color : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {isSearching && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Type de contrat</label>
                    <div className="flex gap-2">
                      {["ALTERNANCE", "STAGE"].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => set("searchType", t)}
                          className={`flex-1 rounded-xl border py-2 text-sm font-medium transition-all ${
                            form.searchType === t
                              ? "border-primary-500 bg-primary-50 text-primary-700"
                              : "border-slate-200 text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> Début souhaité
                    </label>
                    <input
                      type="date"
                      value={form.searchStartDate}
                      onChange={(e) => set("searchStartDate", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> Fin souhaitée
                    </label>
                    <input
                      type="date"
                      value={form.searchEndDate}
                      onChange={(e) => set("searchEndDate", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {form.searchStartDate && form.searchEndDate && (
                  <div className={`rounded-xl border p-3 flex items-start gap-2 ${
                    urgency === "URGENT" ? "bg-red-50 border-red-200" :
                    urgency === "HIGH" ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"
                  }`}>
                    {urgency === "URGENT" ? (
                      <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className={`text-xs font-semibold ${urgency === "URGENT" ? "text-red-700" : urgency === "HIGH" ? "text-amber-700" : "text-green-700"}`}>
                        {form.searchType} du {new Date(form.searchStartDate).toLocaleDateString("fr-FR")} au {new Date(form.searchEndDate).toLocaleDateString("fr-FR")}
                      </p>
                      {daysLeft !== null && (
                        <p className={`text-xs ${urgency === "URGENT" ? "text-red-600" : urgency === "HIGH" ? "text-amber-600" : "text-green-600"}`}>
                          {daysLeft > 0
                            ? `${daysLeft} jours avant la fin · ${urgency === "URGENT" ? "⚠️ Urgence élevée" : urgency === "HIGH" ? "Urgence modérée" : "Pas urgent"}`
                            : "Date de fin dépassée"}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Infos personnelles */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-primary-500" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bio / Présentation</label>
              <textarea
                value={form.bio}
                onChange={(e) => set("bio", e.target.value)}
                rows={3}
                placeholder="Décrivez-vous en quelques lignes : vos ambitions, vos centres d'intérêt..."
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> Localisation
                </label>
                <input
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                  placeholder="Paris, Lyon, Remote..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" /> Téléphone
                </label>
                <input
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                </label>
                <input
                  value={form.linkedinUrl}
                  onChange={(e) => set("linkedinUrl", e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Github className="h-3.5 w-3.5" /> GitHub
                </label>
                <input
                  value={form.githubUrl}
                  onChange={(e) => set("githubUrl", e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scolarité / Entreprise */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary-500" />
              Formation & Entreprise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">École</label>
                <input
                  value={form.school}
                  onChange={(e) => set("school", e.target.value)}
                  placeholder="EPITECH, HEC, 42..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Entreprise actuelle</label>
                <input
                  value={form.company}
                  onChange={(e) => set("company", e.target.value)}
                  placeholder="TechCorp France..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Poste / Titre</label>
              <input
                value={form.position}
                onChange={(e) => set("position", e.target.value)}
                placeholder="Alternant Développeur Full Stack..."
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary-500" />
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* CV */}
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Curriculum Vitae (CV)</p>
                  <p className="text-xs text-slate-400 mt-0.5">PDF recommandé · Max 10MB</p>
                </div>
                {cvUrl && (
                  <button
                    type="button"
                    onClick={() => setPreview({ url: cvUrl, title: "Mon CV" })}
                    className="flex items-center gap-1.5 rounded-lg border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700 hover:bg-primary-100 transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" /> Prévisualiser
                  </button>
                )}
              </div>
              <input ref={cvRef} type="file" accept=".pdf,.doc,.docx" onChange={handleCvUpload} className="hidden" />
              <button
                type="button"
                onClick={() => cvRef.current?.click()}
                disabled={uploadingCv}
                className="w-full rounded-xl border-2 border-dashed border-slate-200 py-4 flex flex-col items-center gap-2 text-slate-400 hover:border-primary-300 hover:text-primary-500 transition-all"
              >
                {uploadingCv ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /><span className="text-xs">Téléchargement...</span></>
                ) : cvUrl ? (
                  <><CheckCircle2 className="h-5 w-5 text-green-500" /><span className="text-xs text-green-600 font-medium">CV uploadé — Cliquer pour remplacer</span></>
                ) : (
                  <><Upload className="h-5 w-5" /><span className="text-xs">Glissez ou cliquez pour uploader votre CV</span></>
                )}
              </button>
            </div>

            {/* Offre d'école */}
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Offre d&apos;école / Convention</p>
                  <p className="text-xs text-slate-400 mt-0.5">La fiche fournie par votre école à signer par l&apos;employeur · PDF ou PPTX</p>
                </div>
                {schoolOfferUrl && (
                  <button
                    type="button"
                    onClick={() => setPreview({ url: schoolOfferUrl, title: "Convention école" })}
                    className="flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 hover:bg-violet-100 transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" /> Prévisualiser
                  </button>
                )}
              </div>
              <input ref={offerRef} type="file" accept=".pdf,.pptx,.ppt" onChange={handleOfferUpload} className="hidden" />
              <button
                type="button"
                onClick={() => offerRef.current?.click()}
                disabled={uploadingOffer}
                className="w-full rounded-xl border-2 border-dashed border-slate-200 py-4 flex flex-col items-center gap-2 text-slate-400 hover:border-violet-300 hover:text-violet-500 transition-all"
              >
                {uploadingOffer ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /><span className="text-xs">Téléchargement...</span></>
                ) : schoolOfferUrl ? (
                  <><CheckCircle2 className="h-5 w-5 text-green-500" /><span className="text-xs text-green-600 font-medium">Document uploadé — Cliquer pour remplacer</span></>
                ) : (
                  <><Upload className="h-5 w-5" /><span className="text-xs">Convention de stage / Fiche école (PDF, PPTX)</span></>
                )}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Lettre de motivation */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-violet-500" />
              Lettre de motivation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-400 mb-3">
              Rédigez une lettre de motivation générique qui sera visible par les recruteurs. Personnalisez-la selon le poste lors de vos candidatures.
            </p>
            <textarea
              value={form.motivationLetter}
              onChange={(e) => set("motivationLetter", e.target.value)}
              rows={10}
              placeholder={`Madame, Monsieur,\n\nPassionné(e) par le développement web et les nouvelles technologies, je suis actuellement en formation à [École] en [Cursus]...\n\nMon parcours m'a permis de développer des compétences solides en [Compétences]...\n\nJe suis convaincu(e) que cette alternance au sein de votre entreprise me permettrait de...\n\nDans l'attente d'un entretien, je reste à votre disposition.\n\nCordialement,\n[Votre nom]`}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono leading-relaxed"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-slate-400">{form.motivationLetter.length} caractères</span>
              {form.motivationLetter.length > 100 && (
                <button
                  type="button"
                  onClick={() => setPreview({
                    url: "data:text/html;charset=utf-8," + encodeURIComponent(`
                      <html><body style="font-family:Georgia,serif;max-width:700px;margin:40px auto;padding:40px;line-height:1.8;color:#1e293b;font-size:15px;white-space:pre-wrap;">${form.motivationLetter}</body></html>
                    `),
                    title: "Lettre de motivation"
                  })}
                  className="flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-800 font-medium"
                >
                  <Eye className="h-3.5 w-3.5" /> Prévisualiser
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Save button */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Enregistrement..." : "Sauvegarder le profil"}
          </button>
          {saved && (
            <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
              <CheckCircle2 className="h-4 w-4" /> Profil mis à jour !
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
