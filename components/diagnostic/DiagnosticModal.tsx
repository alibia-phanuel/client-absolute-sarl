"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  User,
  GraduationCap,
  Briefcase,
  Globe,
  MessageSquare,
  Phone,
  MapPin,
  Mail,
  Send,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// ─── Import de la fonction API ────────────────────────────────────────────────
// submitDiagnostic() envoie POST /api/diagnostics via axiosInstance
// axiosInstance injecte automatiquement le token JWT si l'utilisateur est connecté
import { submitDiagnostic } from "@/lib/diagnostic.api";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface DiagnosticFormData {
  lastName: string;
  firstName: string;
  birthDate: string;
  residenceCountry: string;
  nationality: string;
  lastDiploma: string;
  diplomaYear: string;
  institution: string;
  diplomaTitle: string;
  currentStatus: string;
  studyDomain: string;
  professionalExperience: string;
  destination: string;
  targetLevel: string;
  targetIntake: string;
  previousAttempt: string;
  identifiedNeeds: string;
  // ── Étape 5 : Langue & Compétences ────────────────────────────────────────
  frenchTest: string;        // Q16 : TEF | TCF_CANADA | TCF_QUEBEC | OTHER_FR | NO
  frenchTestOther: string;   // Q16 : précision si OTHER_FR
  frenchOral: string;        // Q17 : compréhension orale
  frenchWritten: string;     // Q17 : compréhension écrite
  frenchSpoken: string;      // Q17 : expression orale
  frenchExpression: string;  // Q17 : expression écrite
  englishTest: string;       // Q18 : IELTS | TOEIC | TOEFL | CAMBRIDGE | OTHER_EN | NO
  englishTestOther: string;  // Q18 : précision si OTHER_EN
  englishOral: string;       // Q19 : compréhension orale
  englishWritten: string;    // Q19 : compréhension écrite
  englishSpoken: string;     // Q19 : expression orale
  englishExpression: string; // Q19 : expression écrite
  // ──────────────────────────────────────────────────────────────────────────
  email: string;
  whatsapp: string;
  preferredContact: string;
}
type FieldErrors = Record<string, string>;

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTES — HORS composant (stables entre renders)
// ─────────────────────────────────────────────────────────────────────────────
const STEPS = [1, 2, 3, 4, 5, 6];
const STEP_ICONS = [
  User,
  GraduationCap,
  Briefcase,
  Globe,
  MessageSquare,
  Phone,
];
const DESTINATIONS = ["canada", "belgium", "france", "other"];
const LEVELS = ["licence", "master", "phd", "professional", "other"];
const INTAKES = ["2025", "2026", "2027"];
const DIPLOMAS = ["baccalaureat", "licence", "master", "other"];
const STATUSES = ["employed", "unemployed", "student", "other"];
const CONTACT_TYPES = ["whatsapp", "call", "email"];

// Tests de français (Q16)
const FRENCH_TESTS = [
  { value: "TEF",        label: "Oui — TEF" },
  { value: "TCF_CANADA", label: "Oui — TCF CANADA" },
  { value: "TCF_QUEBEC", label: "Oui — TCF QUÉBEC" },
  { value: "OTHER_FR",   label: "Oui — Autre" },
  { value: "NO",         label: "Non" },
];

// Tests d'anglais (Q18)
const ENGLISH_TESTS = [
  { value: "IELTS",     label: "Oui — IELTS" },
  { value: "TOEIC",     label: "Oui — TOEIC" },
  { value: "TOEFL",     label: "Oui — TOEFL" },
  { value: "CAMBRIDGE", label: "Oui — Cambridge English Qualification" },
  { value: "OTHER_EN",  label: "Oui — Autre" },
  { value: "NO",        label: "Non" },
];
const DEST_FLAGS: Record<string, string> = {
  canada: "🇨🇦",
  belgium: "🇧🇪",
  france: "🇫🇷",
  other: "🌍",
};

const INITIAL_FORM: DiagnosticFormData = {
  lastName: "",
  firstName: "",
  birthDate: "",
  residenceCountry: "",
  nationality: "",
  lastDiploma: "",
  diplomaYear: "",
  institution: "",
  diplomaTitle: "",
  currentStatus: "",
  studyDomain: "",
  professionalExperience: "",
  destination: "",
  targetLevel: "",
  targetIntake: "",
  previousAttempt: "",
  identifiedNeeds: "",
  frenchTest: "",
  frenchTestOther: "",
  frenchOral: "",
  frenchWritten: "",
  frenchSpoken: "",
  frenchExpression: "",
  englishTest: "",
  englishTestOther: "",
  englishOral: "",
  englishWritten: "",
  englishSpoken: "",
  englishExpression: "",
  email: "",
  whatsapp: "",
  preferredContact: "",
};

// ─────────────────────────────────────────────────────────────────────────────
// SOUS-COMPOSANTS STABLES — HORS du composant principal
// ⚠️ Ne jamais définir ces composants à l'intérieur de DiagnosticModal
//    sinon ils sont recréés à chaque render → perte de focus sur les inputs
// ─────────────────────────────────────────────────────────────────────────────
function ErrorMsg({ error }: { error?: string }) {
  if (!error) return null;
  return <p className="text-xs text-red-500 mt-1">{error}</p>;
}

function FieldWrapper({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {children}
      <ErrorMsg error={error} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION PAR ÉTAPE — HORS composant
// Miroir exact de la validation côté backend (diagnostic.validator.ts)
// ─────────────────────────────────────────────────────────────────────────────
function validateStep(
  step: number,
  data: DiagnosticFormData,
  msgs: { required: string; invalidEmail: string; invalidYear: string },
): FieldErrors {
  const e: FieldErrors = {};
  const req = msgs.required;

  if (step === 1) {
    if (!data.lastName.trim()) e.lastName = req;
    if (!data.firstName.trim()) e.firstName = req;
    if (!data.birthDate) e.birthDate = req;
    if (!data.residenceCountry.trim()) e.residenceCountry = req;
    if (!data.nationality.trim()) e.nationality = req;
  }
  if (step === 2) {
    if (!data.lastDiploma) e.lastDiploma = req;
    if (!data.diplomaYear.trim()) e.diplomaYear = req;
    else if (!/^\d{4}$/.test(data.diplomaYear))
      e.diplomaYear = msgs.invalidYear;
    if (!data.institution.trim()) e.institution = req;
    if (!data.diplomaTitle.trim()) e.diplomaTitle = req;
  }
  if (step === 3) {
    if (!data.currentStatus) e.currentStatus = req;
    if (
      ["student", "other"].includes(data.currentStatus) &&
      !data.studyDomain.trim()
    )
      e.studyDomain = req;
    if (
      ["employed", "unemployed"].includes(data.currentStatus) &&
      !data.professionalExperience.trim()
    )
      e.professionalExperience = req;
  }
  if (step === 4) {
    if (!data.destination) e.destination = req;
    if (!data.targetLevel) e.targetLevel = req;
    if (!data.targetIntake) e.targetIntake = req;
    if (!data.previousAttempt) e.previousAttempt = req;
  }
  if (step === 5) {
    // Q16 : test de français obligatoire
    if (!data.frenchTest) e.frenchTest = req;
    // Q16 : si "Autre" → précision obligatoire
    if (data.frenchTest === "OTHER_FR" && !data.frenchTestOther.trim())
      e.frenchTestOther = req;
    // Q18 : test d'anglais obligatoire
    if (!data.englishTest) e.englishTest = req;
    // Q18 : si "Autre" → précision obligatoire
    if (data.englishTest === "OTHER_EN" && !data.englishTestOther.trim())
      e.englishTestOther = req;
    // Q17 : scores français obligatoires si test passé
    if (data.frenchTest && data.frenchTest !== "NO") {
      if (!data.frenchOral.trim())      e.frenchOral = req;
      if (!data.frenchWritten.trim())   e.frenchWritten = req;
      if (!data.frenchSpoken.trim())    e.frenchSpoken = req;
      if (!data.frenchExpression.trim()) e.frenchExpression = req;
    }
    // Q19 : scores anglais obligatoires si test passé
    if (data.englishTest && data.englishTest !== "NO") {
      if (!data.englishOral.trim())      e.englishOral = req;
      if (!data.englishWritten.trim())   e.englishWritten = req;
      if (!data.englishSpoken.trim())    e.englishSpoken = req;
      if (!data.englishExpression.trim()) e.englishExpression = req;
    }
  }
  if (step === 6) {
    if (!data.email.trim()) e.email = req;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      e.email = msgs.invalidEmail;
    if (!data.whatsapp.trim()) e.whatsapp = req;
    if (!data.preferredContact) e.preferredContact = req;
  }
  return e;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
interface DiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DiagnosticModal({
  isOpen,
  onClose,
}: DiagnosticModalProps) {
  const t = useTranslations("diagnostic");

  // ── Récupère la locale active pour les messages d'erreur traduits ─────────
  // useLocale() retourne "fr" | "en" | "es" selon la langue choisie
  const locale = useLocale();

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<DiagnosticFormData>(INITIAL_FORM);

  // ── Mise à jour d'un champ + effacement de son erreur en temps réel ───────
  const updateField = (field: keyof DiagnosticFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validationMsgs = {
    required: t("validation.required"),
    invalidEmail: t("validation.invalidEmail"),
    invalidYear: t("validation.invalidYear"),
  };

  // ── Navigation vers l'étape suivante avec validation ──────────────────────
  const handleNext = () => {
    const errs = validateStep(currentStep, formData, validationMsgs);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setCurrentStep((p) => Math.min(p + 1, 6));
  };

  // ── Navigation vers l'étape précédente ───────────────────────────────────
  const handleBack = () => {
    setErrors({});
    setCurrentStep((p) => Math.max(p - 1, 1));
  };

  // ─────────────────────────────────────────────────────────────────────────
  // SOUMISSION DU FORMULAIRE — Consommation API
  //
  // Remplace l'ancien console.log() par un vrai appel POST /api/diagnostics
  // via submitDiagnostic() défini dans lib/diagnostic.api.ts
  //
  // FLUX :
  //   1. Validation de l'étape 6
  //   2. setIsSubmitting(true) → affiche le spinner
  //   3. Appel API via submitDiagnostic(formData, locale)
  //      → axiosInstance envoie POST /api/diagnostics
  //      → token JWT injecté automatiquement si l'utilisateur est connecté
  //   4a. Succès → setIsSuccess(true) → affiche l'écran de confirmation
  //   4b. Erreur → setErrors({ submit: message }) → affiche l'erreur en bas
  //   5. setIsSubmitting(false) dans tous les cas (finally)
  // ─────────────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    // ── Validation finale avant envoi ─────────────────────────────────────
    const errs = validateStep(6, formData, validationMsgs);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    // Effacer toute erreur globale précédente
    setErrors({});

    try {

      console.log(formData);
      // ── Appel à l'API backend ────────────────────────────────────────────
      // submitDiagnostic envoie toutes les données du formulaire au serveur.
      // La locale est passée pour obtenir des messages d'erreur traduits
      // en cas d'échec côté API.
      await submitDiagnostic(formData, locale);

      // ── Succès : afficher l'écran de confirmation ────────────────────────
      setIsSuccess(true);

    } catch (error) {
      // ── Erreur API : afficher le message traduit sous les boutons ─────────
      // L'erreur est stockée dans errors.submit (clé spéciale)
      // Elle s'affiche dans le footer du modal, visible par l'utilisateur
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : t("validation.required"),
      });

    } finally {
      // ── Toujours désactiver le spinner, succès ou erreur ─────────────────
      setIsSubmitting(false);
    }
  };

  // ── Reset complet du formulaire à la fermeture du modal ──────────────────
  const handleClose = () => {
    onClose();
    // Délai pour laisser l'animation de fermeture se terminer
    setTimeout(() => {
      setCurrentStep(1);
      setErrors({});
      setIsSuccess(false);
      setIsSubmitting(false);
      setFormData(INITIAL_FORM);
    }, 300);
  };

  const StepIcon = STEP_ICONS[currentStep - 1];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-2xl max-h-[92vh] bg-background rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── ÉCRAN DE SUCCÈS ── */}
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center p-10 text-center gap-4 min-h-[400px]">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <CheckCircle2 className="w-20 h-20 text-green-500" />
                </motion.div>
                <h2 className="text-2xl font-bold">{t("success.title")}</h2>
                <p className="text-muted-foreground max-w-sm">
                  {t("success.message")}
                </p>
                <Button onClick={handleClose} className="mt-4 px-8">
                  {t("success.close")}
                </Button>
              </div>
            ) : (
              <>
                {/* ── HEADER ── */}
                <div className="relative bg-gradient-to-r from-primary to-primary/70 text-white p-5 flex-shrink-0">
                  <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <StepIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white/70 text-xs font-medium uppercase tracking-wide">
                        {t("step")} {currentStep} / 6
                      </p>
                      <h2 className="text-lg font-bold leading-tight">
                        {t(`steps.step${currentStep}.title`)}
                      </h2>
                    </div>
                  </div>
                  {/* Barre de progression par étapes */}
                  <div className="flex gap-1.5">
                    {STEPS.map((s) => (
                      <div
                        key={s}
                        className={cn(
                          "h-1.5 rounded-full flex-1 transition-all duration-500",
                          s <= currentStep ? "bg-white" : "bg-white/30",
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* ── BANDE DE CONTACT ── */}
                <div className="bg-muted/50 border-b border-border px-5 py-2.5 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground flex-shrink-0">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-primary" />
                    +237 699 99 28 18
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-primary" />
                    servicesclients@absolutesarl.com
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-primary" />
                    Cité des Palmiers, Yellow Building - 2nd Floor - Office B09, Douala, Cameroon
                  </span>
                </div>

                {/* ── CORPS DU FORMULAIRE ── */}
                <div className="overflow-y-auto flex-1 p-5 sm:p-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.22 }}
                      className="space-y-4"
                    >
                      {/* ── ÉTAPE 1 : Informations personnelles ── */}
                      {currentStep === 1 && (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FieldWrapper
                              label={t("fields.lastName")}
                              required
                              error={errors.lastName}
                            >
                              <Input
                                placeholder={t("placeholders.lastName")}
                                value={formData.lastName}
                                onChange={(e) =>
                                  updateField("lastName", e.target.value)
                                }
                                className={errors.lastName ? "border-red-500" : ""}
                              />
                            </FieldWrapper>
                            <FieldWrapper
                              label={t("fields.firstName")}
                              required
                              error={errors.firstName}
                            >
                              <Input
                                placeholder={t("placeholders.firstName")}
                                value={formData.firstName}
                                onChange={(e) =>
                                  updateField("firstName", e.target.value)
                                }
                                className={errors.firstName ? "border-red-500" : ""}
                              />
                            </FieldWrapper>
                          </div>
                          <FieldWrapper
                            label={t("fields.birthDate")}
                            required
                            error={errors.birthDate}
                          >
                            <Input
                              type="date"
                              value={formData.birthDate}
                              onChange={(e) =>
                                updateField("birthDate", e.target.value)
                              }
                              className={errors.birthDate ? "border-red-500" : ""}
                            />
                          </FieldWrapper>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FieldWrapper
                              label={t("fields.residenceCountry")}
                              required
                              error={errors.residenceCountry}
                            >
                              <Input
                                placeholder={t("placeholders.residenceCountry")}
                                value={formData.residenceCountry}
                                onChange={(e) =>
                                  updateField("residenceCountry", e.target.value)
                                }
                                className={errors.residenceCountry ? "border-red-500" : ""}
                              />
                            </FieldWrapper>
                            <FieldWrapper
                              label={t("fields.nationality")}
                              required
                              error={errors.nationality}
                            >
                              <Input
                                placeholder={t("placeholders.nationality")}
                                value={formData.nationality}
                                onChange={(e) =>
                                  updateField("nationality", e.target.value)
                                }
                                className={errors.nationality ? "border-red-500" : ""}
                              />
                            </FieldWrapper>
                          </div>
                        </>
                      )}

                      {/* ── ÉTAPE 2 : Niveau d'études ── */}
                      {currentStep === 2 && (
                        <>
                          <FieldWrapper
                            label={t("fields.lastDiploma")}
                            required
                            error={errors.lastDiploma}
                          >
                            <Select
                              value={formData.lastDiploma}
                              onValueChange={(v) => updateField("lastDiploma", v)}
                            >
                              <SelectTrigger
                                className={errors.lastDiploma ? "border-red-500" : ""}
                              >
                                <SelectValue placeholder={t("placeholders.select")} />
                              </SelectTrigger>
                              <SelectContent>
                                {DIPLOMAS.map((d) => (
                                  <SelectItem key={d} value={d}>
                                    {t(`options.diploma.${d}`)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FieldWrapper>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FieldWrapper
                              label={t("fields.diplomaYear")}
                              required
                              error={errors.diplomaYear}
                            >
                              <Input
                                placeholder="Ex: 2022"
                                value={formData.diplomaYear}
                                maxLength={4}
                                onChange={(e) =>
                                  updateField("diplomaYear", e.target.value)
                                }
                                className={errors.diplomaYear ? "border-red-500" : ""}
                              />
                            </FieldWrapper>
                            <FieldWrapper
                              label={t("fields.institution")}
                              required
                              error={errors.institution}
                            >
                              <Input
                                placeholder={t("placeholders.institution")}
                                value={formData.institution}
                                onChange={(e) =>
                                  updateField("institution", e.target.value)
                                }
                                className={errors.institution ? "border-red-500" : ""}
                              />
                            </FieldWrapper>
                          </div>
                          <FieldWrapper
                            label={t("fields.diplomaTitle")}
                            required
                            error={errors.diplomaTitle}
                          >
                            <Input
                              placeholder={t("placeholders.diplomaTitle")}
                              value={formData.diplomaTitle}
                              onChange={(e) =>
                                updateField("diplomaTitle", e.target.value)
                              }
                              className={errors.diplomaTitle ? "border-red-500" : ""}
                            />
                          </FieldWrapper>
                        </>
                      )}

                      {/* ── ÉTAPE 3 : Filière & domaine ── */}
                      {currentStep === 3 && (
                        <>
                          <FieldWrapper
                            label={t("fields.currentStatus")}
                            required
                            error={errors.currentStatus}
                          >
                            <Select
                              value={formData.currentStatus}
                              onValueChange={(v) => updateField("currentStatus", v)}
                            >
                              <SelectTrigger
                                className={errors.currentStatus ? "border-red-500" : ""}
                              >
                                <SelectValue placeholder={t("placeholders.select")} />
                              </SelectTrigger>
                              <SelectContent>
                                {STATUSES.map((s) => (
                                  <SelectItem key={s} value={s}>
                                    {t(`options.status.${s}`)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FieldWrapper>

                          {/* Affiché conditionnellement selon le statut — miroir du backend */}
                          {["student", "other"].includes(formData.currentStatus) && (
                            <FieldWrapper
                              label={t("fields.studyDomain")}
                              required
                              error={errors.studyDomain}
                            >
                              <Input
                                placeholder={t("placeholders.studyDomain")}
                                value={formData.studyDomain}
                                onChange={(e) =>
                                  updateField("studyDomain", e.target.value)
                                }
                                className={errors.studyDomain ? "border-red-500" : ""}
                              />
                            </FieldWrapper>
                          )}

                          {["employed", "unemployed"].includes(formData.currentStatus) && (
                            <FieldWrapper
                              label={t("fields.professionalExperience")}
                              required
                              error={errors.professionalExperience}
                            >
                              <Textarea
                                placeholder={t("placeholders.professionalExperience")}
                                value={formData.professionalExperience}
                                onChange={(e) =>
                                  updateField("professionalExperience", e.target.value)
                                }
                                className={cn(
                                  "resize-none",
                                  errors.professionalExperience ? "border-red-500" : "",
                                )}
                                rows={4}
                              />
                            </FieldWrapper>
                          )}
                        </>
                      )}

                      {/* ── ÉTAPE 4 : Projet d'études ── */}
                      {currentStep === 4 && (
                        <>
                          <FieldWrapper
                            label={t("fields.destination")}
                            required
                            error={errors.destination}
                          >
                            <div className="grid grid-cols-2 gap-2">
                              {DESTINATIONS.map((dest) => (
                                <button
                                  key={dest}
                                  type="button"
                                  onClick={() => updateField("destination", dest)}
                                  className={cn(
                                    "flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all",
                                    formData.destination === dest
                                      ? "border-primary bg-primary/10 text-primary"
                                      : "border-border hover:border-primary/50",
                                  )}
                                >
                                  <span className="text-lg">{DEST_FLAGS[dest]}</span>
                                  {t(`options.destination.${dest}`)}
                                </button>
                              ))}
                            </div>
                          </FieldWrapper>
                          <FieldWrapper
                            label={t("fields.targetLevel")}
                            required
                            error={errors.targetLevel}
                          >
                            <Select
                              value={formData.targetLevel}
                              onValueChange={(v) => updateField("targetLevel", v)}
                            >
                              <SelectTrigger
                                className={errors.targetLevel ? "border-red-500" : ""}
                              >
                                <SelectValue placeholder={t("placeholders.select")} />
                              </SelectTrigger>
                              <SelectContent>
                                {LEVELS.map((l) => (
                                  <SelectItem key={l} value={l}>
                                    {t(`options.level.${l}`)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FieldWrapper>
                          <FieldWrapper
                            label={t("fields.targetIntake")}
                            required
                            error={errors.targetIntake}
                          >
                            <div className="flex gap-2 flex-wrap">
                              {INTAKES.map((intake) => (
                                <button
                                  key={intake}
                                  type="button"
                                  onClick={() => updateField("targetIntake", intake)}
                                  className={cn(
                                    "px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all",
                                    formData.targetIntake === intake
                                      ? "border-primary bg-primary/10 text-primary"
                                      : "border-border hover:border-primary/50",
                                  )}
                                >
                                  {t("options.intake.rentre")} {intake}
                                </button>
                              ))}
                            </div>
                          </FieldWrapper>

                          {/* ── Tentative précédente ── */}
                          <FieldWrapper
                            label={t("fields.previousAttempt")}
                            required
                            error={errors.previousAttempt}
                          >
                            <div className="flex gap-3">
                              {["yes", "no"].map((v) => (
                                <button
                                  key={v}
                                  type="button"
                                  onClick={() => updateField("previousAttempt", v)}
                                  className={cn(
                                    "flex-1 py-2.5 rounded-xl border-2 text-sm font-medium transition-all",
                                    formData.previousAttempt === v
                                      ? "border-primary bg-primary/10 text-primary"
                                      : "border-border hover:border-primary/50",
                                  )}
                                >
                                  {t(`options.yesNo.${v}`)}
                                </button>
                              ))}
                            </div>
                          </FieldWrapper>
                        </>
                      )}

                      {/* ── ÉTAPE 5 : Langue & Compétences ── */}
                      {currentStep === 5 && (
                        <>
                          {/* ── Q16 : Test de français ── */}
                          <FieldWrapper
                            label={t("fields.frenchTest")}
                            required
                            error={errors.frenchTest}
                          >
                            <Select
                              value={formData.frenchTest}
                              onValueChange={(v) => {
                                updateField("frenchTest", v);
                                // Reset scores si on passe à "Non"
                                if (v === "NO") {
                                  updateField("frenchOral", "");
                                  updateField("frenchWritten", "");
                                  updateField("frenchSpoken", "");
                                  updateField("frenchExpression", "");
                                  updateField("frenchTestOther", "");
                                }
                              }}
                            >
                              <SelectTrigger className={errors.frenchTest ? "border-red-500" : ""}>
                                <SelectValue placeholder={t("placeholders.select")} />
                              </SelectTrigger>
                              <SelectContent>
                                {FRENCH_TESTS.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FieldWrapper>

                          {/* Q16 — Précision si "Oui – Autre" */}
                          {formData.frenchTest === "OTHER_FR" && (
                            <FieldWrapper
                              label={t("fields.frenchTestOther")}
                              required
                              error={errors.frenchTestOther}
                            >
                              <Input
                                placeholder={t("placeholders.frenchTestOther")}
                                value={formData.frenchTestOther}
                                onChange={(e) => updateField("frenchTestOther", e.target.value)}
                                className={errors.frenchTestOther ? "border-red-500" : ""}
                              />
                            </FieldWrapper>
                          )}

                          {/* Q17 — Scores français (conditionnel si test passé) */}
                          {formData.frenchTest && formData.frenchTest !== "NO" && (
                            <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
                              <p className="text-sm font-medium flex items-center gap-2">
                                🇫🇷 {t("fields.frenchScores")}
                              </p>
                              <div className="grid grid-cols-2 gap-3">
                                <FieldWrapper
                                  label={t("fields.frenchOral")}
                                  required
                                  error={errors.frenchOral}
                                >
                                  <Input
                                    type="number"
                                    min="0"
                                    placeholder="ex: 14"
                                    value={formData.frenchOral}
                                    onChange={(e) => updateField("frenchOral", e.target.value)}
                                    className={errors.frenchOral ? "border-red-500" : ""}
                                  />
                                </FieldWrapper>
                                <FieldWrapper
                                  label={t("fields.frenchWritten")}
                                  required
                                  error={errors.frenchWritten}
                                >
                                  <Input
                                    type="number"
                                    min="0"
                                    placeholder="ex: 16"
                                    value={formData.frenchWritten}
                                    onChange={(e) => updateField("frenchWritten", e.target.value)}
                                    className={errors.frenchWritten ? "border-red-500" : ""}
                                  />
                                </FieldWrapper>
                                <FieldWrapper
                                  label={t("fields.frenchSpoken")}
                                  required
                                  error={errors.frenchSpoken}
                                >
                                  <Input
                                    type="number"
                                    min="0"
                                    placeholder="ex: 12"
                                    value={formData.frenchSpoken}
                                    onChange={(e) => updateField("frenchSpoken", e.target.value)}
                                    className={errors.frenchSpoken ? "border-red-500" : ""}
                                  />
                                </FieldWrapper>
                                <FieldWrapper
                                  label={t("fields.frenchExpression")}
                                  required
                                  error={errors.frenchExpression}
                                >
                                  <Input
                                    type="number"
                                    min="0"
                                    placeholder="ex: 15"
                                    value={formData.frenchExpression}
                                    onChange={(e) => updateField("frenchExpression", e.target.value)}
                                    className={errors.frenchExpression ? "border-red-500" : ""}
                                  />
                                </FieldWrapper>
                              </div>
                            </div>
                          )}

                          {/* ── Q18 : Test d'anglais ── */}
                          <FieldWrapper
                            label={t("fields.englishTest")}
                            required
                            error={errors.englishTest}
                          >
                            <Select
                              value={formData.englishTest}
                              onValueChange={(v) => {
                                updateField("englishTest", v);
                                if (v === "NO") {
                                  updateField("englishOral", "");
                                  updateField("englishWritten", "");
                                  updateField("englishSpoken", "");
                                  updateField("englishExpression", "");
                                  updateField("englishTestOther", "");
                                }
                              }}
                            >
                              <SelectTrigger className={errors.englishTest ? "border-red-500" : ""}>
                                <SelectValue placeholder={t("placeholders.select")} />
                              </SelectTrigger>
                              <SelectContent>
                                {ENGLISH_TESTS.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FieldWrapper>

                          {/* Q18 — Précision si "Oui – Autre" */}
                          {formData.englishTest === "OTHER_EN" && (
                            <FieldWrapper
                              label={t("fields.englishTestOther")}
                              required
                              error={errors.englishTestOther}
                            >
                              <Input
                                placeholder={t("placeholders.englishTestOther")}
                                value={formData.englishTestOther}
                                onChange={(e) => updateField("englishTestOther", e.target.value)}
                                className={errors.englishTestOther ? "border-red-500" : ""}
                              />
                            </FieldWrapper>
                          )}

                          {/* Q19 — Scores anglais (conditionnel si test passé) */}
                          {formData.englishTest && formData.englishTest !== "NO" && (
                            <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
                              <p className="text-sm font-medium flex items-center gap-2">
                                🇬🇧 {t("fields.englishScores")}
                              </p>
                              <div className="grid grid-cols-2 gap-3">
                                <FieldWrapper
                                  label={t("fields.englishOral")}
                                  required
                                  error={errors.englishOral}
                                >
                                  <Input
                                    type="number"
                                    min="0"
                                    placeholder="ex: 7.5"
                                    value={formData.englishOral}
                                    onChange={(e) => updateField("englishOral", e.target.value)}
                                    className={errors.englishOral ? "border-red-500" : ""}
                                  />
                                </FieldWrapper>
                                <FieldWrapper
                                  label={t("fields.englishWritten")}
                                  required
                                  error={errors.englishWritten}
                                >
                                  <Input
                                    type="number"
                                    min="0"
                                    placeholder="ex: 8"
                                    value={formData.englishWritten}
                                    onChange={(e) => updateField("englishWritten", e.target.value)}
                                    className={errors.englishWritten ? "border-red-500" : ""}
                                  />
                                </FieldWrapper>
                                <FieldWrapper
                                  label={t("fields.englishSpoken")}
                                  required
                                  error={errors.englishSpoken}
                                >
                                  <Input
                                    type="number"
                                    min="0"
                                    placeholder="ex: 6.5"
                                    value={formData.englishSpoken}
                                    onChange={(e) => updateField("englishSpoken", e.target.value)}
                                    className={errors.englishSpoken ? "border-red-500" : ""}
                                  />
                                </FieldWrapper>
                                <FieldWrapper
                                  label={t("fields.englishExpression")}
                                  required
                                  error={errors.englishExpression}
                                >
                                  <Input
                                    type="number"
                                    min="0"
                                    placeholder="ex: 7"
                                    value={formData.englishExpression}
                                    onChange={(e) => updateField("englishExpression", e.target.value)}
                                    className={errors.englishExpression ? "border-red-500" : ""}
                                  />
                                </FieldWrapper>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {/* ── ÉTAPE 6 : Coordonnées de contact ── */}
                      {currentStep === 6 && (
                        <>
                          <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-start gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <p className="text-muted-foreground">
                              {t("steps.step6.recap")}
                            </p>
                          </div>
                          <FieldWrapper
                            label={t("fields.email")}
                            required
                            error={errors.email}
                          >
                            <Input
                              type="email"
                              placeholder="votre@email.com"
                              value={formData.email}
                              onChange={(e) => updateField("email", e.target.value)}
                              className={errors.email ? "border-red-500" : ""}
                            />
                          </FieldWrapper>
                          <FieldWrapper
                            label={t("fields.whatsapp")}
                            required
                            error={errors.whatsapp}
                          >
                            <Input
                              placeholder="+237 6XX XX XX XX"
                              value={formData.whatsapp}
                              onChange={(e) => updateField("whatsapp", e.target.value)}
                              className={errors.whatsapp ? "border-red-500" : ""}
                            />
                          </FieldWrapper>
                          <FieldWrapper
                            label={t("fields.preferredContact")}
                            required
                            error={errors.preferredContact}
                          >
                            <div className="flex gap-2 flex-wrap">
                              {CONTACT_TYPES.map((c) => (
                                <button
                                  key={c}
                                  type="button"
                                  onClick={() => updateField("preferredContact", c)}
                                  className={cn(
                                    "px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all flex-1",
                                    formData.preferredContact === c
                                      ? "border-primary bg-primary/10 text-primary"
                                      : "border-border hover:border-primary/50",
                                  )}
                                >
                                  {t(`options.contact.${c}`)}
                                </button>
                              ))}
                            </div>
                          </FieldWrapper>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
                {/* ── FOOTER : Navigation + Erreur globale API ── */}
                <div className="border-t border-border flex-shrink-0 bg-background">
                  {/* ── Bannière d'erreur API globale ────────────────────────────────
                      Affichée uniquement si l'API retourne une erreur lors du submit.
                      errors.submit est renseigné dans le catch de handleSubmit().
                      Elle disparaît automatiquement dès que l'utilisateur retape. ── */}
                  <AnimatePresence>
                    {errors.submit && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-4 pt-3"
                      >
                        <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <p>{errors.submit}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── Boutons de navigation ─────────────────────────────────────── */}
                  <div className="p-4 flex items-center justify-between gap-3">
                    <div>
                      {currentStep > 1 && (
                        <Button
                          variant="ghost"
                          onClick={handleBack}
                          disabled={isSubmitting}
                          className="gap-1.5"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          {t("back")}
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground hidden sm:block">
                        {t("step")} {currentStep}/6
                      </span>
                      {currentStep < 6 ? (
                        <Button onClick={handleNext} className="gap-1.5">
                          {t("next")}
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      ) : (
                        // ── Bouton de soumission final ────────────────────────────
                        // Désactivé pendant l'envoi (isSubmitting)
                        // Affiche un spinner Loader2 + texte "Envoi en cours..."
                        <Button
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          className="gap-2 min-w-[140px]"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              {t("submitting")}
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              {t("submit")}
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}