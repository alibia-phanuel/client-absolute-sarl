// lib/diagnostic.api.ts
//
// Fonction publique de soumission du formulaire de diagnostic (6 étapes)
// POST /api/diagnostics — token JWT optionnel (injecté par axiosInstance si connecté)

import axiosInstance from "./axiosInstance";

// ─────────────────────────────────────────────────────────────────────────────
// MESSAGES D'ERREUR TRADUITS
// ─────────────────────────────────────────────────────────────────────────────
const ERROR_MESSAGES: Record<string, Record<string, string>> = {
  fr: {
    NETWORK_ERROR: "Impossible de contacter le serveur. Vérifiez votre connexion.",
    VALIDATION_ERROR: "Certains champs sont invalides. Veuillez vérifier le formulaire.",
    SERVER_ERROR: "Une erreur inattendue est survenue. Réessayez dans quelques instants.",
    DEFAULT: "Une erreur inattendue est survenue.",
  },
  en: {
    NETWORK_ERROR: "Unable to reach the server. Please check your connection.",
    VALIDATION_ERROR: "Some fields are invalid. Please review the form.",
    SERVER_ERROR: "An unexpected error occurred. Please try again later.",
    DEFAULT: "An unexpected error occurred.",
  },
  es: {
    NETWORK_ERROR: "No se puede contactar al servidor. Verifique su conexión.",
    VALIDATION_ERROR: "Algunos campos son inválidos. Por favor revise el formulario.",
    SERVER_ERROR: "Ocurrió un error inesperado. Inténtelo de nuevo más tarde.",
    DEFAULT: "Ocurrió un error inesperado.",
  },
};

function extractErrorMessage(error: unknown, locale: string): string {
  const msgs = ERROR_MESSAGES[locale] ?? ERROR_MESSAGES.fr;
  if (!error || typeof error !== "object") return msgs.DEFAULT;
  const err = error as any;
  if (err.code === "ERR_NETWORK" || err.message === "Network Error")
    return msgs.NETWORK_ERROR;
  const status = err.response?.status;
  const serverMsg = err.response?.data?.message;
  if (serverMsg) return serverMsg;
  if (status === 400) return msgs.VALIDATION_ERROR;
  if (status >= 500) return msgs.SERVER_ERROR;
  return msgs.DEFAULT;
}

// ─────────────────────────────────────────────────────────────────────────────
// TYPE PAYLOAD — miroir de DiagnosticFormData dans DiagnosticModal.tsx
// ─────────────────────────────────────────────────────────────────────────────
export interface DiagnosticPayload {
  // Étape 1
  lastName: string;
  firstName: string;
  birthDate: string;
  residenceCountry: string;
  nationality: string;
  // Étape 2
  lastDiploma: string;
  diplomaYear: string;
  institution: string;
  diplomaTitle: string;
  // Étape 3
  currentStatus: string;
  studyDomain?: string;
  professionalExperience?: string;
  // Étape 4
  destination: string;
  targetLevel: string;
  targetIntake: string;
  previousAttempt: string;
  identifiedNeeds?: string;
  // Étape 5 — Langue & Compétences
  frenchTest: string;           // TEF | TCF_CANADA | TCF_QUEBEC | OTHER_FR | NO
  frenchTestOther?: string;     // si OTHER_FR
  frenchOral?: string;          // scores si test passé
  frenchWritten?: string;
  frenchSpoken?: string;
  frenchExpression?: string;
  englishTest: string;          // IELTS | TOEIC | TOEFL | CAMBRIDGE | OTHER_EN | NO
  englishTestOther?: string;    // si OTHER_EN
  englishOral?: string;
  englishWritten?: string;
  englishSpoken?: string;
  englishExpression?: string;
  // Étape 6
  email: string;
  whatsapp: string;
  preferredContact: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// submitDiagnostic — POST /api/diagnostics
// ─────────────────────────────────────────────────────────────────────────────
export async function submitDiagnostic(
  payload: DiagnosticPayload,
  locale: string = "fr",
): Promise<void> {
  try {
    const body: Record<string, any> = {
      // Étape 1
      lastName:         payload.lastName.trim(),
      firstName:        payload.firstName.trim(),
      birthDate:        payload.birthDate,
      residenceCountry: payload.residenceCountry.trim(),
      nationality:      payload.nationality.trim(),
      // Étape 2
      lastDiploma:  payload.lastDiploma,
      diplomaYear:  payload.diplomaYear.trim(),
      institution:  payload.institution.trim(),
      diplomaTitle: payload.diplomaTitle.trim(),
      // Étape 3
      currentStatus: payload.currentStatus,
      // Étape 4
      destination:     payload.destination.toUpperCase(),
      targetLevel:     payload.targetLevel,
      targetIntake:    payload.targetIntake,
      previousAttempt: payload.previousAttempt,
      // Étape 5
      frenchTest:  payload.frenchTest,
      englishTest: payload.englishTest,
      // Étape 6
      email:            payload.email.trim().toLowerCase(),
      whatsapp:         payload.whatsapp.trim(),
      preferredContact: payload.preferredContact,
    };

    // Conditionnels étape 3
    if (payload.studyDomain?.trim())
      body.studyDomain = payload.studyDomain.trim();
    if (payload.professionalExperience?.trim())
      body.professionalExperience = payload.professionalExperience.trim();
    if (payload.identifiedNeeds?.trim())
      body.identifiedNeeds = payload.identifiedNeeds.trim();

    // Conditionnels étape 5 — français
    if (payload.frenchTest === "OTHER_FR" && payload.frenchTestOther?.trim())
      body.frenchTestOther = payload.frenchTestOther.trim();
    if (payload.frenchTest !== "NO") {
      if (payload.frenchOral)       body.frenchOral       = payload.frenchOral;
      if (payload.frenchWritten)    body.frenchWritten    = payload.frenchWritten;
      if (payload.frenchSpoken)     body.frenchSpoken     = payload.frenchSpoken;
      if (payload.frenchExpression) body.frenchExpression = payload.frenchExpression;
    }

    // Conditionnels étape 5 — anglais
    if (payload.englishTest === "OTHER_EN" && payload.englishTestOther?.trim())
      body.englishTestOther = payload.englishTestOther.trim();
    if (payload.englishTest !== "NO") {
      if (payload.englishOral)       body.englishOral       = payload.englishOral;
      if (payload.englishWritten)    body.englishWritten    = payload.englishWritten;
      if (payload.englishSpoken)     body.englishSpoken     = payload.englishSpoken;
      if (payload.englishExpression) body.englishExpression = payload.englishExpression;
    }

    await axiosInstance.post("/api/diagnostics", body);
  } catch (error) {
    throw new Error(extractErrorMessage(error, locale));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// getMyDiagnostics — GET /api/diagnostics/me
// ─────────────────────────────────────────────────────────────────────────────
export async function getMyDiagnostics(locale: string = "fr") {
  try {
    const res = await axiosInstance.get("/api/diagnostics/me");
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, locale));
  }
}