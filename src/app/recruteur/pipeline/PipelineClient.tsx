'use client';

import { useState } from 'react';
import { formatDistanceToNow, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MessageCircle, Clock, CheckCircle, XCircle, MapPin, Zap } from 'lucide-react';

const STATUS_COLORS = {
  INITIAL: 'bg-gray-100 text-gray-800',
  RECRUTEMENT_EN_COURS: 'bg-blue-100 text-blue-800',
  ENTRETIEN_ACCEPTE: 'bg-green-100 text-green-800',
  HIRED: 'bg-green-200 text-green-900',
  REJECTED: 'bg-red-100 text-red-800',
};

const STATUS_LABELS = {
  INITIAL: 'Initial',
  RECRUTEMENT_EN_COURS: 'Recrutement en cours',
  ENTRETIEN_ACCEPTE: 'Entretien accepté',
  HIRED: 'Recruté',
  REJECTED: 'Rejeté',
};

interface StudentProfile {
  bio?: string | null;
  location?: string | null;
  linkedinUrl?: string | null;
  ecole?: {
    name: string;
    city?: string | null;
  } | null;
}

interface Application {
  id: string;
  offreId: string;
  studentId: string;
  status: string;
  appliedAt: string;
  statusUpdatedAt: string;
  responseDeadline: string | null;
  student: {
    name: string;
    email: string;
    profile?: StudentProfile | null;
    skills?: Array<{
      skillId: string;
      level: number;
      skill: { name: string };
    }>;
  };
  offre: {
    title: string;
  };
  messages: Array<{
    id: string;
    createdAt: string;
  }>;
}

export default function PipelineClient({
  applications,
}: {
  applications: Application[];
}) {
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Application | null>(null);

  const handleStatusChange = async (appId: string, newStatus: string) => {
    setUpdating(appId);
    try {
      const res = await fetch('/api/pipeline/update-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: appId, status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      setUpdating(null);
    }
  };

  const getWaitingTime = (appliedAt: string, statusUpdatedAt: string) => {
    const lastUpdate = new Date(statusUpdatedAt);
    const days = differenceInDays(new Date(), lastUpdate);
    return days;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'HIRED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-blue-600" />;
    }
  };

  if (applications.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Aucune candidature pour le moment</p>
        </div>
      </div>
    );
  }

  // Group applications by offre
  const groupedByOffre = applications.reduce(
    (acc, app) => {
      if (!acc[app.offreId]) {
        acc[app.offreId] = [];
      }
      acc[app.offreId].push(app);
      return acc;
    },
    {} as Record<string, Application[]>
  );

  return (
    <div className="space-y-6">
      {Object.entries(groupedByOffre).map(([offreId, apps]) => (
        <div key={offreId}>
          <h3 className="text-lg font-semibold mb-4">{apps[0].offre.title}</h3>
          <div className="space-y-3">
            {apps.map((app) => {
              const waitingDays = getWaitingTime(
                app.appliedAt,
                app.statusUpdatedAt
              );
              const isOverdue =
                app.responseDeadline &&
                new Date(app.responseDeadline) < new Date();

              return (
                <Card key={app.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      {/* Student Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <button
                            onClick={() => setSelectedStudent(app)}
                            className="font-semibold hover:text-blue-600 cursor-pointer transition-colors"
                          >
                            {app.student.name}
                          </button>
                          <Badge variant="outline">{app.student.email}</Badge>
                        </div>

                        {/* Status & Timing */}
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(app.status)}
                            <Badge className={STATUS_COLORS[app.status as keyof typeof STATUS_COLORS]}>
                              {STATUS_LABELS[app.status as keyof typeof STATUS_LABELS]}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>
                              {isOverdue
                                ? `Délai dépassé depuis ${Math.abs(differenceInDays(new Date(), new Date(app.responseDeadline!)))} j`
                                : `En attente depuis ${waitingDays} j`}
                            </span>
                          </div>

                          {app.messages.length > 0 && (
                            <div className="flex items-center gap-1 text-sm text-blue-600">
                              <MessageCircle className="w-4 h-4" />
                              <span>{app.messages.length} message(s)</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status Changer */}
                      <div className="flex-shrink-0 w-48">
                        <Select
                          defaultValue={app.status}
                          onValueChange={(value) =>
                            handleStatusChange(app.id, value)
                          }
                          disabled={updating === app.id}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="INITIAL">Initial</SelectItem>
                            <SelectItem value="RECRUTEMENT_EN_COURS">
                              Recrutement en cours
                            </SelectItem>
                            <SelectItem value="ENTRETIEN_ACCEPTE">
                              Entretien accepté
                            </SelectItem>
                            <SelectItem value="HIRED">Recruté</SelectItem>
                            <SelectItem value="REJECTED">Rejeté</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // TODO: Open chat modal
                            console.log('Open chat for', app.id);
                          }}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Chat
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      {/* Modal for student profile */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{selectedStudent.student.name}</h2>
                  <p className="text-sm text-slate-500">{selectedStudent.student.email}</p>
                  {selectedStudent.student.profile?.location && (
                    <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {selectedStudent.student.profile.location}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
                >
                  ✕
                </button>
              </div>

              {/* Offre */}
              <div className="rounded-xl bg-blue-50 border border-blue-200 p-3">
                <p className="text-xs font-semibold text-blue-700">Candidature pour</p>
                <p className="text-sm font-medium text-blue-900">{selectedStudent.offre.title}</p>
              </div>

              {/* Status */}
              <div className="rounded-xl bg-slate-100 p-3">
                <p className="text-xs font-semibold text-slate-600 mb-1">Statut actuel</p>
                <Badge className={STATUS_COLORS[selectedStudent.status as keyof typeof STATUS_COLORS]}>
                  {STATUS_LABELS[selectedStudent.status as keyof typeof STATUS_LABELS]}
                </Badge>
              </div>

              {/* School & Bio */}
              {selectedStudent.student.profile?.ecole && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1">École</p>
                  <p className="text-sm text-slate-700">{selectedStudent.student.profile.ecole.name}</p>
                </div>
              )}

              {selectedStudent.student.profile?.bio && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1">À propos</p>
                  <p className="text-sm text-slate-600">{selectedStudent.student.profile.bio}</p>
                </div>
              )}

              {/* Skills */}
              {selectedStudent.student.skills && selectedStudent.student.skills.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5" /> Compétences
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.student.skills.map((s) => (
                      <span key={s.skillId} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                        {s.skill.name} · {s.level}/5
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* LinkedIn */}
              {selectedStudent.student.profile?.linkedinUrl && (
                <div>
                  <a
                    href={selectedStudent.student.profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Voir le profil LinkedIn →
                  </a>
                </div>
              )}

              {/* Close button */}
              <button
                onClick={() => setSelectedStudent(null)}
                className="w-full mt-4 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
