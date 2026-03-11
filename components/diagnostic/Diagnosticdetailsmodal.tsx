"use client";

/**
 * 🔍 Modal Détails d'un Diagnostic
 * Même structure que MessageDetailsModal
 */

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User, GraduationCap, Briefcase,
  Globe, Phone, Clock, AlertCircle,
} from "lucide-react";
import { Diagnostic, DiagnosticStatus, DiagnosticDestination } from "@/types/Diagnostic.types";
import { getDiagnosticById } from "@/lib/diagnostic.admin.api";

interface Props {
  open: boolean;
  onClose: () => void;
  diagnostic: Diagnostic | null;
}

const STATUS_COLORS: Record<DiagnosticStatus, string> = {
  NEW:         "bg-blue-500/10 text-blue-700 border-blue-200",
  READ:        "bg-purple-500/10 text-purple-700 border-purple-200",
  IN_PROGRESS: "bg-orange-500/10 text-orange-700 border-orange-200",
  TREATED:     "bg-indigo-500/10 text-indigo-700 border-indigo-200",
  RESOLVED:    "bg-green-500/10 text-green-700 border-green-200",
  ARCHIVED:    "bg-gray-500/10 text-gray-600 border-gray-200",
};

const DEST_FLAGS: Record<DiagnosticDestination, string> = {
  CANADA: "🇨🇦", BELGIUM: "🇧🇪", FRANCE: "🇫🇷", OTHER: "🌍",
};

function InfoItem({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 text-primary mb-3">
      <Icon className="h-4 w-4" />
      <h3 className="text-sm font-semibold uppercase tracking-wide">{title}</h3>
    </div>
  );
}

export function DiagnosticDetailsModal({ open, onClose, diagnostic }: Props) {
  const tD = useTranslations("diagnostics");
  const locale = useLocale();
  const dateLocale = locale === "fr" ? fr : enUS;

  const [full, setFull] = useState<Diagnostic | null>(null);
  const [loading, setLoading] = useState(false);

useEffect(() => {
  if (!open || !diagnostic) return;

  const fetchDiagnostic = async () => {
    try {
      setLoading(true);
      const data = await getDiagnosticById(diagnostic.id);
      setFull(data);
    } catch {
      setFull(diagnostic);
    } finally {
      setLoading(false);
    }
  };

  fetchDiagnostic();
}, [open, diagnostic?.id]);

  const d = full ?? diagnostic;
  const fmt = (date?: string | null) =>
    date ? format(new Date(date), "PPp", { locale: dateLocale }) : "—";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{tD("detailsTitle")}</DialogTitle>
          <DialogDescription>{tD("detailsDescription")}</DialogDescription>
        </DialogHeader>

        {loading || !d ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : (
          <div className="space-y-6">

            {/* Badges statut + destination */}
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="outline" className={STATUS_COLORS[d.status]}>
                {tD(`status${d.status}`)}
              </Badge>
              <Badge variant="outline" className="gap-1">
                {DEST_FLAGS[d.destination]} {tD(`dest${d.destination}`)}
              </Badge>
              <span className="text-xs text-muted-foreground ml-auto">{fmt(d.createdAt)}</span>
            </div>

            <Separator />

            {/* Infos personnelles */}
            <div>
              <SectionTitle icon={User} title={tD("sectionPersonal")} />
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label={tD("fieldLastName")} value={d.lastName} />
                <InfoItem label={tD("fieldFirstName")} value={d.firstName} />
                <InfoItem label={tD("fieldBirthDate")} value={fmt(d.birthDate)} />
                <InfoItem label={tD("fieldNationality")} value={d.nationality} />
                <InfoItem label={tD("fieldResidenceCountry")} value={d.residenceCountry} />
              </div>
            </div>

            <Separator />

            {/* Diplôme */}
            <div>
              <SectionTitle icon={GraduationCap} title={tD("sectionDiploma")} />
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label={tD("fieldLastDiploma")} value={d.lastDiploma} />
                <InfoItem label={tD("fieldDiplomaYear")} value={d.diplomaYear} />
                <InfoItem label={tD("fieldInstitution")} value={d.institution} />
                <InfoItem label={tD("fieldDiplomaTitle")} value={d.diplomaTitle} />
              </div>
            </div>

            <Separator />

            {/* Situation */}
            <div>
              <SectionTitle icon={Briefcase} title={tD("sectionSituation")} />
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label={tD("fieldCurrentStatus")} value={d.currentStatus} />
                {d.studyDomain && <InfoItem label={tD("fieldStudyDomain")} value={d.studyDomain} />}
                {d.professionalExperience && (
                  <div className="col-span-2">
                    <InfoItem label={tD("fieldProfessionalExperience")} value={d.professionalExperience} />
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Projet */}
            <div>
              <SectionTitle icon={Globe} title={tD("sectionProject")} />
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label={tD("fieldTargetLevel")} value={d.targetLevel} />
                <InfoItem label={tD("fieldTargetIntake")} value={d.targetIntake} />
                <InfoItem
                  label={tD("fieldPreviousAttempt")}
                  value={d.previousAttempt ? tD("yes") : tD("no")}
                />
                {d.identifiedNeeds && (
                  <div className="col-span-2">
                    <InfoItem label={tD("fieldIdentifiedNeeds")} value={d.identifiedNeeds} />
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Contact + langues */}
            <div>
              <SectionTitle icon={Phone} title={tD("sectionContact")} />
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label={tD("fieldFrenchLevel")} value={d.frenchLevel} />
                <InfoItem label={tD("fieldEnglishLevel")} value={d.englishLevel} />
                <InfoItem label={tD("fieldEmail")} value={d.email} />
                <InfoItem label={tD("fieldWhatsapp")} value={d.whatsapp} />
                <InfoItem label={tD("fieldPreferredContact")} value={d.preferredContact} />
              </div>
            </div>

            {/* Notes internes */}
            {d.internalNotes && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 text-orange-600 mb-3">
                    <AlertCircle className="h-4 w-4" />
                    <h3 className="text-sm font-semibold uppercase tracking-wide">
                      {tD("sectionInternalNotes")}
                    </h3>
                  </div>
                  <p className="text-sm bg-orange-50 border border-orange-200 rounded-lg p-3">
                    {d.internalNotes}
                  </p>
                </div>
              </>
            )}

            {/* Tracking */}
            <Separator />
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-3">
                <Clock className="h-4 w-4" />
                <h3 className="text-sm font-semibold uppercase tracking-wide">
                  {tD("sectionTracking")}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                {d.readAt && <span>{tD("readAt")} : {fmt(d.readAt)}</span>}
                {d.assignedAt && <span>{tD("assignedAt")} : {fmt(d.assignedAt)}</span>}
                {d.treatedAt && <span>{tD("treatedAt")} : {fmt(d.treatedAt)}</span>}
                {d.resolvedAt && <span>{tD("resolvedAt")} : {fmt(d.resolvedAt)}</span>}
              </div>
            </div>

          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}