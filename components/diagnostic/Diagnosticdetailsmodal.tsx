"use client";

/**
 * 🔍 Modal Détails d'un Diagnostic
 * - Affichage complet avec nouvelle structure étape 5 (tests de langue + scores)
 * - Export PDF via html2canvas-pro + jsPDF (compatible Tailwind v4 oklch/lab)
 *
 * Installation requise :
 * npm install html2canvas-pro jspdf
 */

import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  GraduationCap,
  Briefcase,
  Globe,
  Phone,
  Clock,
  AlertCircle,
  Download,
  Loader2,
  Languages,
} from "lucide-react";
import {
  Diagnostic,
  DiagnosticStatus,
  DiagnosticDestination,
} from "@/types/Diagnostic.types";
import { getDiagnosticById } from "@/lib/diagnostic.admin.api";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTES — HORS composant
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  open: boolean;
  onClose: () => void;
  diagnostic: Diagnostic | null;
}

const STATUS_COLORS: Record<DiagnosticStatus, string> = {
  NEW: "bg-blue-500/10 text-blue-700 border-blue-200",
  READ: "bg-purple-500/10 text-purple-700 border-purple-200",
  IN_PROGRESS: "bg-orange-500/10 text-orange-700 border-orange-200",
  TREATED: "bg-indigo-500/10 text-indigo-700 border-indigo-200",
  RESOLVED: "bg-green-500/10 text-green-700 border-green-200",
  ARCHIVED: "bg-gray-500/10 text-gray-600 border-gray-200",
};

const DEST_FLAGS: Record<DiagnosticDestination, string> = {
  CANADA: "🇨🇦",
  BELGIUM: "🇧🇪",
  FRANCE: "🇫🇷",
  OTHER: "🌍",
};

const FRENCH_TEST_LABELS: Record<string, string> = {
  TEF: "TEF",
  TCF_CANADA: "TCF CANADA",
  TCF_QUEBEC: "TCF QUÉBEC",
  OTHER_FR: "Autre",
  NO: "Non passé",
};

const ENGLISH_TEST_LABELS: Record<string, string> = {
  IELTS: "IELTS",
  TOEIC: "TOEIC",
  TOEFL: "TOEFL",
  CAMBRIDGE: "Cambridge English Qualification",
  OTHER_EN: "Autre",
  NO: "Non passé",
};

// ─────────────────────────────────────────────────────────────────────────────
// SOUS-COMPOSANTS
// ─────────────────────────────────────────────────────────────────────────────

function InfoItem({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 text-primary mb-3">
      <Icon className="h-4 w-4" />
      <h3 className="text-sm font-semibold uppercase tracking-wide">{title}</h3>
    </div>
  );
}

function ScoreGrid({
  scores,
}: {
  scores: { label: string; value?: string | null }[];
}) {
  const hasAny = scores.some((s) => s.value);
  if (!hasAny) return null;
  return (
    <div className="grid grid-cols-2 gap-2 mt-2 pl-3 border-l-2 border-primary/20">
      {scores.map((s) =>
        s.value ? (
          <div key={s.label} className="space-y-0.5">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-sm font-bold">{s.value}</p>
          </div>
        ) : null,
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

export function DiagnosticDetailsModal({ open, onClose, diagnostic }: Props) {
  const tD = useTranslations("diagnostics");
  const locale = useLocale();
  const dateLocale = locale === "fr" ? fr : enUS;

  const [full, setFull] = useState<Diagnostic | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const printRef = useRef<HTMLDivElement>(null);

  // Chargement du diagnostic complet
  useEffect(() => {
    if (!open || !diagnostic) return;

    const fetchDiagnostic = async () => {
      try {
        setLoading(true);
        const data = await getDiagnosticById(diagnostic.id);
        setFull(data);
      } catch (err) {
        console.error("Erreur fetch diagnostic:", err);
        setFull(diagnostic); // fallback
      } finally {
        setLoading(false);
      }
    };
    fetchDiagnostic();
  }, [open, diagnostic?.id]);

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setFull(null);
        setExportError(null);
      }, 300);
    }
  }, [open]);

  const d = full ?? diagnostic;
  const fmt = (date?: string | null) =>
    date ? format(new Date(date), "PPp", { locale: dateLocale }) : "—";

  // ── Export PDF avec html2canvas-pro + jsPDF ────────────────────────────────
  const handleExportPDF = async () => {
    if (!printRef.current || !d) return;

    setExporting(true);
    setExportError(null);

    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const jsPDF = (await import("jspdf")).default;

      const canvas = await html2canvas(printRef.current, {
        scale: 2, // meilleure qualité
        useCORS: true, // pour images externes si besoin
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10; // petite marge haut

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio,
      );

      const dateStr = format(new Date(), "yyyy-MM-dd");
      const filename = `Diagnostic_${d.lastName}_${d.firstName}_${dateStr}.pdf`;
      pdf.save(filename);
    } catch (err: any) {
      console.error("Erreur export PDF :", err);
      setExportError(
        "Échec de l'export PDF. Vérifiez la console pour plus de détails.",
      );
    } finally {
      setExporting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <DialogTitle>{tD("detailsTitle")}</DialogTitle>
              <DialogDescription>{tD("detailsDescription")}</DialogDescription>
            </div>

            {d && !loading && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPDF}
                disabled={exporting}
                className="gap-2 flex-shrink-0"
              >
                {exporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Export en cours...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Exporter PDF
                  </>
                )}
              </Button>
            )}
          </div>
        </DialogHeader>

        {exportError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-sm rounded">
            {exportError}
          </div>
        )}

        {loading || !d ? (
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div
            ref={printRef}
            className="space-y-6 bg-white text-black p-4 print:p-0"
          >
            {/* Statut + destination + date */}
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="outline" className={STATUS_COLORS[d.status]}>
                {tD(`status${d.status}`)}
              </Badge>
              <Badge variant="outline" className="gap-1">
                {DEST_FLAGS[d.destination]} {tD(`dest${d.destination}`)}
              </Badge>
              <span className="text-xs text-muted-foreground ml-auto">
                {fmt(d.createdAt)}
              </span>
            </div>

            <Separator />

            {/* Sections : perso, diplôme, situation, projet, langue, contact, notes, tracking */}
            {/* 1. Infos personnelles */}
            <div>
              <SectionTitle icon={User} title={tD("sectionPersonal")} />
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label={tD("fieldLastName")} value={d.lastName} />
                <InfoItem label={tD("fieldFirstName")} value={d.firstName} />
                <InfoItem
                  label={tD("fieldBirthDate")}
                  value={fmt(d.birthDate)}
                />
                <InfoItem
                  label={tD("fieldNationality")}
                  value={d.nationality}
                />
                <InfoItem
                  label={tD("fieldResidenceCountry")}
                  value={d.residenceCountry}
                />
              </div>
            </div>

            <Separator />

            {/* 2. Diplôme */}
            <div>
              <SectionTitle icon={GraduationCap} title={tD("sectionDiploma")} />
              <div className="grid grid-cols-2 gap-4">
                <InfoItem
                  label={tD("fieldLastDiploma")}
                  value={d.lastDiploma}
                />
                <InfoItem
                  label={tD("fieldDiplomaYear")}
                  value={d.diplomaYear}
                />
                <InfoItem
                  label={tD("fieldInstitution")}
                  value={d.institution}
                />
                <InfoItem
                  label={tD("fieldDiplomaTitle")}
                  value={d.diplomaTitle}
                />
              </div>
            </div>

            <Separator />

            {/* 3. Situation */}
            <div>
              <SectionTitle icon={Briefcase} title={tD("sectionSituation")} />
              <div className="grid grid-cols-2 gap-4">
                <InfoItem
                  label={tD("fieldCurrentStatus")}
                  value={d.currentStatus}
                />
                {d.studyDomain && (
                  <InfoItem
                    label={tD("fieldStudyDomain")}
                    value={d.studyDomain}
                  />
                )}
                {d.professionalExperience && (
                  <div className="col-span-2">
                    <InfoItem
                      label={tD("fieldProfessionalExperience")}
                      value={d.professionalExperience}
                    />
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* 4. Projet d'études */}
            <div>
              <SectionTitle icon={Globe} title={tD("sectionProject")} />
              <div className="grid grid-cols-2 gap-4">
                <InfoItem
                  label={tD("fieldTargetLevel")}
                  value={d.targetLevel}
                />
                <InfoItem
                  label={tD("fieldTargetIntake")}
                  value={d.targetIntake}
                />
                <InfoItem
                  label={tD("fieldPreviousAttempt")}
                  value={d.previousAttempt ? tD("yes") : tD("no")}
                />
                {d.identifiedNeeds && (
                  <div className="col-span-2">
                    <InfoItem
                      label={tD("fieldIdentifiedNeeds")}
                      value={d.identifiedNeeds}
                    />
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* 5. Langue & Compétences */}
            <div>
              <SectionTitle icon={Languages} title={tD("sectionLanguage")} />
              <div className="space-y-5">
                {/* Français */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base">🇫🇷</span>
                    <p className="text-sm font-semibold">
                      {tD("fieldFrenchTest")}
                    </p>
                    {d.frenchTest && (
                      <Badge variant="outline" className="text-xs">
                        {FRENCH_TEST_LABELS[d.frenchTest] ?? d.frenchTest}
                        {d.frenchTestOther ? ` — ${d.frenchTestOther}` : ""}
                      </Badge>
                    )}
                  </div>
                  {d.frenchTest && d.frenchTest !== "NO" ? (
                    <ScoreGrid
                      scores={[
                        { label: tD("fieldFrenchOral"), value: d.frenchOral },
                        {
                          label: tD("fieldFrenchWritten"),
                          value: d.frenchWritten,
                        },
                        {
                          label: tD("fieldFrenchSpoken"),
                          value: d.frenchSpoken,
                        },
                        {
                          label: tD("fieldFrenchExpression"),
                          value: d.frenchExpression,
                        },
                      ]}
                    />
                  ) : d.frenchTest === "NO" ? (
                    <p className="text-xs text-muted-foreground pl-3 italic">
                      {tD("noTestPassed")}
                    </p>
                  ) : null}
                </div>

                {/* Anglais */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base">🇬🇧</span>
                    <p className="text-sm font-semibold">
                      {tD("fieldEnglishTest")}
                    </p>
                    {d.englishTest && (
                      <Badge variant="outline" className="text-xs">
                        {ENGLISH_TEST_LABELS[d.englishTest] ?? d.englishTest}
                        {d.englishTestOther ? ` — ${d.englishTestOther}` : ""}
                      </Badge>
                    )}
                  </div>
                  {d.englishTest && d.englishTest !== "NO" ? (
                    <ScoreGrid
                      scores={[
                        { label: tD("fieldEnglishOral"), value: d.englishOral },
                        {
                          label: tD("fieldEnglishWritten"),
                          value: d.englishWritten,
                        },
                        {
                          label: tD("fieldEnglishSpoken"),
                          value: d.englishSpoken,
                        },
                        {
                          label: tD("fieldEnglishExpression"),
                          value: d.englishExpression,
                        },
                      ]}
                    />
                  ) : d.englishTest === "NO" ? (
                    <p className="text-xs text-muted-foreground pl-3 italic">
                      {tD("noTestPassed")}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            <Separator />

            {/* 6. Contact */}
            <div>
              <SectionTitle icon={Phone} title={tD("sectionContact")} />
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label={tD("fieldEmail")} value={d.email} />
                <InfoItem label={tD("fieldWhatsapp")} value={d.whatsapp} />
                <InfoItem
                  label={tD("fieldPreferredContact")}
                  value={d.preferredContact}
                />
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
                {d.readAt && (
                  <span>
                    {tD("readAt")} : {fmt(d.readAt)}
                  </span>
                )}
                {d.assignedAt && (
                  <span>
                    {tD("assignedAt")} : {fmt(d.assignedAt)}
                  </span>
                )}
                {d.treatedAt && (
                  <span>
                    {tD("treatedAt")} : {fmt(d.treatedAt)}
                  </span>
                )}
                {d.resolvedAt && (
                  <span>
                    {tD("resolvedAt")} : {fmt(d.resolvedAt)}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
