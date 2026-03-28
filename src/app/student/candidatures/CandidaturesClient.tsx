"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Briefcase, Loader2, ExternalLink, Clock,
  CheckCircle2, XCircle, Star, Trophy, Eye, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { formatDateRelative } from "@/lib/utils";
import type { Candidature } from "@prisma/client";

const COLUMNS: { key: string; label: string; color: string; bg: string; icon: typeof Briefcase }[] = [
  { key: "WISHLIST",  label: "Wishlist",  color: "text-slate-500",  bg: "bg-slate-50 border-slate-200",  icon: Star },
  { key: "APPLIED",   label: "Envoyées",  color: "text-blue-600",   bg: "bg-blue-50 border-blue-200",    icon: Briefcase },
  { key: "INTERVIEW", label: "Entretien", color: "text-violet-600", bg: "bg-violet-50 border-violet-200", icon: Eye },
  { key: "OFFER",     label: "Offre 🎉",  color: "text-green-600",  bg: "bg-green-50 border-green-200",  icon: Trophy },
  { key: "REJECTED",  label: "Refusées",  color: "text-red-500",    bg: "bg-red-50 border-red-200",      icon: XCircle },
];

const SOURCE_OPTIONS = [
  "LinkedIn", "Welcome to the Jungle", "Indeed", "Pôle Emploi",
  "Glassdoor", "APEC", "Hellowork", "Site entreprise", "Recommandation", "Autre",
];

const STATUS_BADGE: Record<string, string> = {
  WISHLIST:  "bg-slate-100 text-slate-600",
  APPLIED:   "bg-blue-100 text-blue-700",
  INTERVIEW: "bg-violet-100 text-violet-700",
  OFFER:     "bg-green-100 text-green-700",
  REJECTED:  "bg-red-100 text-red-600",
};

interface Props { candidatures: Candidature[]; userId: string; }

const emptyForm = {
  company: "", role: "", location: "", contractType: "ALTERNANCE",
  status: "WISHLIST", source: "", url: "", salary: "", notes: "",
  contactName: "", contactEmail: "",
};

export function CandidaturesClient({ candidatures: init, userId }: Props) {
  const router = useRouter();
  const [items, setItems] = useState(init);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Candidature | null>(null);

  const byStatus = (key: string) => items.filter((c) => c.status === key);
  const total = items.length;
  const hasOffer = items.some((c) => c.status === "OFFER");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/candidatures", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, userId }),
    });
    if (res.ok) {
      const created = await res.json();
      setItems((p) => [created, ...p]);
      setOpen(false);
      setForm(emptyForm);
      router.refresh();
    }
    setLoading(false);
  }

  async function moveStatus(id: string, status: string) {
    const res = await fetch(`/api/candidatures/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setItems((p) => p.map((c) => (c.id === id ? { ...c, status } : c)));
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/candidatures/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((p) => p.filter((c) => c.id !== id));
      setSelected(null);
    }
  }

  // Drag & Drop handlers
  function onDragStart(id: string) { setDraggingId(id); }
  function onDragOver(e: React.DragEvent) { e.preventDefault(); }
  async function onDrop(e: React.DragEvent, status: string) {
    e.preventDefault();
    if (draggingId && items.find((c) => c.id === draggingId)?.status !== status) {
      await moveStatus(draggingId, status);
    }
    setDraggingId(null);
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mes Candidatures</h1>
          <p className="text-slate-500 mt-1">
            {total} candidature{total > 1 ? "s" : ""}
            {hasOffer && <span className="ml-2 text-green-600 font-semibold">🎉 Vous avez une offre !</span>}
          </p>
        </div>
        <Button variant="gradient" onClick={() => setOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter une candidature
        </Button>
      </div>

      {/* Stats bar */}
      <div className="mb-6 flex gap-3 flex-wrap">
        {COLUMNS.map((col) => {
          const count = byStatus(col.key).length;
          return (
            <div key={col.key} className={`flex items-center gap-2 rounded-xl border px-4 py-2 ${col.bg}`}>
              <col.icon className={`h-4 w-4 ${col.color}`} />
              <span className={`text-sm font-semibold ${col.color}`}>{count}</span>
              <span className="text-xs text-slate-500">{col.label}</span>
            </div>
          );
        })}
      </div>

      {/* Kanban */}
      {total === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <Briefcase className="h-16 w-16 mb-4 opacity-20" />
          <p className="text-xl font-medium">Aucune candidature</p>
          <p className="text-sm mt-2">Commencez à tracker vos candidatures !</p>
          <Button variant="outline" className="mt-6" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter ma première candidature
          </Button>
        </div>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${COLUMNS.length}, minmax(200px, 1fr))` }}>
          {COLUMNS.map((col) => {
            const cards = byStatus(col.key);
            return (
              <div
                key={col.key}
                className="rounded-xl bg-slate-50 border border-slate-200 p-3 min-h-[300px]"
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, col.key)}
              >
                {/* Column header */}
                <div className={`mb-3 flex items-center justify-between rounded-lg border px-3 py-2 ${col.bg}`}>
                  <div className="flex items-center gap-2">
                    <col.icon className={`h-3.5 w-3.5 ${col.color}`} />
                    <span className={`text-xs font-bold ${col.color}`}>{col.label}</span>
                  </div>
                  <span className={`text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ${col.bg} ${col.color}`}>
                    {cards.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-2">
                  {cards.map((c) => (
                    <div
                      key={c.id}
                      draggable
                      onDragStart={() => onDragStart(c.id)}
                      onClick={() => setSelected(c)}
                      className="cursor-pointer rounded-lg border border-slate-200 bg-white p-3 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 active:scale-95"
                    >
                      <div className="flex items-start justify-between gap-1 mb-2">
                        <div>
                          <p className="text-sm font-bold text-slate-900 leading-tight">{c.company}</p>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{c.role}</p>
                        </div>
                        {c.url && (
                          <a
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-slate-300 hover:text-primary-500 transition-colors shrink-0"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>

                      {c.salary && (
                        <p className="text-[11px] font-semibold text-green-600 mb-1">{c.salary}</p>
                      )}

                      <div className="flex items-center gap-1 flex-wrap mt-2">
                        {c.location && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
                            {c.location}
                          </span>
                        )}
                        {c.source && (
                          <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] text-primary-600 font-medium">
                            {c.source}
                          </span>
                        )}
                      </div>

                      {c.appliedAt && (
                        <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          {formatDateRelative(c.appliedAt)}
                        </p>
                      )}

                      {/* Quick status change */}
                      <div className="mt-2 flex gap-1">
                        {col.key === "WISHLIST" && (
                          <button
                            onClick={(e) => { e.stopPropagation(); moveStatus(c.id, "APPLIED"); }}
                            className="text-[10px] text-blue-600 hover:underline font-medium"
                          >
                            Marquer envoyée →
                          </button>
                        )}
                        {col.key === "APPLIED" && (
                          <button
                            onClick={(e) => { e.stopPropagation(); moveStatus(c.id, "INTERVIEW"); }}
                            className="text-[10px] text-violet-600 hover:underline font-medium"
                          >
                            Entretien obtenu →
                          </button>
                        )}
                        {col.key === "INTERVIEW" && (
                          <button
                            onClick={(e) => { e.stopPropagation(); moveStatus(c.id, "OFFER"); }}
                            className="text-[10px] text-green-600 hover:underline font-medium"
                          >
                            Offre reçue 🎉
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nouvelle candidature</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Entreprise *</Label>
                <Input placeholder="ex: Google" value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })} required />
              </div>
              <div className="space-y-1.5">
                <Label>Poste *</Label>
                <Input placeholder="ex: Dev Frontend" value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Localisation</Label>
                <Input placeholder="Paris, Remote..." value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Salaire estimé</Label>
                <Input placeholder="ex: 1 800€/mois" value={form.salary}
                  onChange={(e) => setForm({ ...form, salary: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Statut</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WISHLIST">Wishlist</SelectItem>
                    <SelectItem value="APPLIED">Envoyée</SelectItem>
                    <SelectItem value="INTERVIEW">Entretien</SelectItem>
                    <SelectItem value="OFFER">Offre reçue</SelectItem>
                    <SelectItem value="REJECTED">Refusée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Source</Label>
                <Select value={form.source} onValueChange={(v) => setForm({ ...form, source: v })}>
                  <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                  <SelectContent>
                    {SOURCE_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Lien offre</Label>
              <Input placeholder="https://..." value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })} type="url" />
            </div>
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <textarea
                className="flex min-h-[60px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 resize-none"
                placeholder="Infos utiles, impressions, contacts..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
              <Button type="submit" variant="gradient" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      {selected && (
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary-500" />
                {selected.company}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-lg font-semibold text-slate-800">{selected.role}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_BADGE[selected.status]}`}>
                    {COLUMNS.find((c) => c.key === selected.status)?.label ?? selected.status}
                  </span>
                  {selected.salary && (
                    <span className="text-sm text-green-600 font-semibold">{selected.salary}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                {selected.location && (
                  <div><p className="text-xs text-slate-400">Localisation</p><p className="font-medium">{selected.location}</p></div>
                )}
                {selected.source && (
                  <div><p className="text-xs text-slate-400">Source</p><p className="font-medium">{selected.source}</p></div>
                )}
                {selected.appliedAt && (
                  <div><p className="text-xs text-slate-400">Postulé</p><p className="font-medium">{formatDateRelative(selected.appliedAt)}</p></div>
                )}
                {selected.contractType && (
                  <div><p className="text-xs text-slate-400">Type</p><p className="font-medium">{selected.contractType}</p></div>
                )}
              </div>

              {selected.notes && (
                <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                  <p className="text-xs text-slate-400 mb-1">Notes</p>
                  <p className="text-sm text-slate-700">{selected.notes}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-slate-400 mb-2">Changer le statut</p>
                <div className="flex flex-wrap gap-2">
                  {COLUMNS.map((col) => (
                    <button
                      key={col.key}
                      onClick={() => { moveStatus(selected.id, col.key); setSelected({ ...selected, status: col.key }); }}
                      className={`rounded-full px-3 py-1 text-xs font-semibold border transition-all ${
                        selected.status === col.key
                          ? `${col.bg} ${col.color} shadow-sm`
                          : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      {col.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              {selected.url && (
                <a href={selected.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-1">
                    <ExternalLink className="h-3 w-3" /> Voir l&apos;offre
                  </Button>
                </a>
              )}
              <Button
                variant="destructive"
                size="sm"
                className="gap-1"
                onClick={() => handleDelete(selected.id)}
              >
                <Trash2 className="h-3 w-3" /> Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
