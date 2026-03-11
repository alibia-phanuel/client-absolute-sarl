// lib/diagnostic.api.ts
//
// 📋 CE FICHIER gère TOUTE la communication avec l'API backend pour les diagnostics.
// Il utilise l'instance axios centralisée (axiosInstance.ts) qui :
//   ✅ Injecte automatiquement le token JWT dans chaque requête
//   ✅ Gère les redirections vers /login si le token expire
//   ✅ Préfixe automatiquement l'URL de base du backend
// ─────────────────────────────────────────────────────────────────────────────

import axiosInstance from "./axiosInstance";

// ─────────────────────────────────────────────────────────────────────────────
// 📦 TYPES — Miroir exact du backend (diagnostic.types.ts côté serveur)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Payload envoyé lors de la soumission du formulaire 6 étapes.
 * Les valeurs correspondent exactement aux champs du DiagnosticModal.tsx
 */
export interface DiagnosticSubmitPayload {
  // Étape 1 — Infos personnelles
  lastName: string;
  firstName: string;
  birthDate: string; // Format "YYYY-MM-DD" (input type="date")
  residenceCountry: string;
  nationality: string;

  // Étape 2 — Diplôme
  lastDiploma: string; // "baccalaureat" | "licence" | "master" | "other"
  diplomaYear: string; // 4 chiffres : "2022"
  institution: string;
  diplomaTitle: string;

  // Étape 3 — Situation
  currentStatus: string; // "employed" | "unemployed" | "student" | "other"
  studyDomain?: string; // Requis si currentStatus === "student" | "other"
  professionalExperience?: string; // Requis si currentStatus === "employed" | "unemployed"

  // Étape 4 — Projet
  destination: string; // "canada" | "belgium" | "france" | "other"
  targetLevel: string; // "licence" | "master" | "phd" | "professional" | "other"
  targetIntake: string; // "2025" | "2026" | "2027"
  previousAttempt: string; // "yes" | "no" — le backend accepte aussi boolean

  // Étape 5 — Besoins & langues
  identifiedNeeds?: string;
  frenchLevel: string; // "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "native"
  englishLevel: string;

  // Étape 6 — Coordonnées
  email: string;
  whatsapp: string;
  preferredContact: string; // "whatsapp" | "call" | "email"
}

/**
 * Réponse retournée après une soumission réussie (endpoint PUBLIC)
 * Le backend ne renvoie pas les données sensibles internes
 */
export interface DiagnosticPublicResponse {
  id: string;
  firstName: string;
  lastName: string;
  destination: string;
  status: string;
  createdAt: string;
  message: string; // Message de confirmation affiché à l'utilisateur
}

/**
 * Réponse complète (endpoint CLIENT /me)
 * Contient toutes les données sauf les champs internes (notes, assignations...)
 */
export interface DiagnosticClientResponse {
  id: string;
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
  studyDomain?: string;
  professionalExperience?: string;
  destination: string;
  targetLevel: string;
  targetIntake: string;
  previousAttempt: boolean;
  identifiedNeeds?: string;
  frenchLevel: string;
  englishLevel: string;
  email: string;
  whatsapp: string;
  preferredContact: string;
  status: DiagnosticStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Statuts possibles d'un diagnostic (identiques à l'enum Prisma)
 */
export type DiagnosticStatus =
  | "NEW"
  | "READ"
  | "IN_PROGRESS"
  | "TREATED"
  | "RESOLVED"
  | "ARCHIVED";

/**
 * Structure d'une erreur de validation retournée par le backend
 * Le backend renvoie un tableau d'erreurs par champ
 */
export interface ApiValidationError {
  field: string;
  message: string;
}

/**
 * Structure générique d'une erreur API
 */
export interface ApiError {
  success: false;
  message: string;
  errors?: ApiValidationError[];
}

// ─────────────────────────────────────────────────────────────────────────────
// 🌍 MESSAGES D'ERREUR MULTILINGUES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Traduit les messages d'erreur API selon la locale active.
 *
 * POURQUOI CETTE APPROCHE :
 * Le backend renvoie des messages en français, mais l'app supporte FR/EN/ES.
 * On mappe ici les codes d'erreur connus vers des messages traduits.
 * Pour les erreurs inconnues, on garde le message brut du backend.
 */
function getErrorMessage(
  backendMessage: string,
  locale: string = "fr",
): string {
  // Table de traduction des erreurs backend connues
  const errorTranslations: Record<string, Record<string, string>> = {
    "Données invalides": {
      fr: "Données invalides. Vérifiez le formulaire.",
      en: "Invalid data. Please check the form.",
      es: "Datos inválidos. Por favor revise el formulario.",
    },
    "Diagnostic introuvable": {
      fr: "Diagnostic introuvable.",
      en: "Diagnostic not found.",
      es: "Diagnóstico no encontrado.",
    },
    "Une erreur interne est survenue": {
      fr: "Une erreur interne est survenue. Réessayez plus tard.",
      en: "An internal error occurred. Please try again later.",
      es: "Ocurrió un error interno. Inténtelo más tarde.",
    },
    "Non authentifié": {
      fr: "Vous devez être connecté.",
      en: "You must be logged in.",
      es: "Debe iniciar sesión.",
    },
  };

  // Cherche une traduction connue
  const translations = errorTranslations[backendMessage];
  if (translations) {
    return translations[locale] ?? translations["fr"];
  }

  // Retourne le message brut si pas de traduction connue
  return backendMessage;
}

/**
 * Extrait le message d'erreur lisible depuis une réponse axios échouée.
 * Gère les erreurs de validation (champ par champ) et les erreurs générales.
 */
function extractErrorMessage(error: unknown, locale: string = "fr"): string {
  // Erreur axios avec réponse du serveur
  if (typeof error === "object" && error !== null && "response" in error) {
    const axiosError = error as { response?: { data?: ApiError } };
    const data = axiosError.response?.data;

    if (data) {
      // Si erreur de validation avec détails par champ
      if (data.errors && data.errors.length > 0) {
        return data.errors.map((e) => e.message).join(", ");
      }
      // Message d'erreur général
      if (data.message) {
        return getErrorMessage(data.message, locale);
      }
    }
  }

  // Erreur réseau (pas de connexion)
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    (error as Error).message === "Network Error"
  ) {
    const networkErrors: Record<string, string> = {
      fr: "Erreur de connexion. Vérifiez votre connexion internet.",
      en: "Connection error. Please check your internet connection.",
      es: "Error de conexión. Verifique su conexión a internet.",
    };
    return networkErrors[locale] ?? networkErrors["fr"];
  }

  // Fallback générique
  const genericErrors: Record<string, string> = {
    fr: "Une erreur inattendue est survenue.",
    en: "An unexpected error occurred.",
    es: "Ocurrió un error inesperado.",
  };
  return genericErrors[locale] ?? genericErrors["fr"];
}

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 ENDPOINT 1 : SOUMETTRE UN DIAGNOSTIC (PUBLIC)
// POST /api/diagnostics
//
// ✅ Accessible sans connexion
// ✅ Si l'utilisateur est connecté, son token est automatiquement injecté
//    par l'intercepteur de axiosInstance → le diagnostic sera lié à son compte
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Soumet le formulaire de diagnostic complet (6 étapes).
 *
 * APPELÉ DEPUIS : DiagnosticModal.tsx → handleSubmit()
 * REMPLACE : console.log("📋 DIAGNOSTIC FORM DATA:", ...)
 *
 * @param payload  - Les données du formulaire (toutes les 6 étapes)
 * @param locale   - La locale active pour les messages d'erreur ("fr" | "en" | "es")
 * @returns        - La réponse publique avec l'ID et le message de confirmation
 * @throws         - Lance une Error avec un message traduit si l'API échoue
 *
 * @example
 * // Dans DiagnosticModal.tsx :
 * const result = await submitDiagnostic(formData, locale);
 * // result.message → "Votre demande a été enregistrée..."
 */
export async function submitDiagnostic(
  payload: DiagnosticSubmitPayload,
  locale: string = "fr",
): Promise<DiagnosticPublicResponse> {
  try {
    // ── Envoi de la requête POST vers le backend ──────────────────────────
    // axiosInstance ajoute automatiquement :
    //   - Content-Type: application/json
    //   - Authorization: Bearer <token> (si connecté)
    const response = await axiosInstance.post<{
      success: true;
      message: string;
      data: DiagnosticPublicResponse;
    }>("/api/diagnostics", payload);

    // ── Retourner les données de confirmation ─────────────────────────────
    return response.data.data;
  } catch (error) {
    // ── Transformer l'erreur en message lisible et traduit ────────────────
    throw new Error(extractErrorMessage(error, locale));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 🔐 ENDPOINT 2 : MES DIAGNOSTICS (CLIENT CONNECTÉ)
// GET /api/diagnostics/me
//
// ✅ Requiert une authentification (token JWT injecté automatiquement)
// ✅ Retourne uniquement les diagnostics liés au compte connecté
// ⛔ Les champs internes (notes, assignations...) sont masqués par le backend
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Récupère tous les diagnostics soumis par le client connecté.
 *
 * APPELÉ DEPUIS : Page "Mon profil" ou "Mes diagnostics"
 * AFFICHE : Historique des demandes avec leur statut de traitement
 *
 * @param locale - La locale active pour les messages d'erreur
 * @returns      - Tableau des diagnostics du client (sans champs internes)
 * @throws       - Lance une Error si non connecté ou erreur API
 *
 * @example
 * const myDiagnostics = await getMyDiagnostics("fr");
 * // Afficher la liste avec statut NEW, READ, IN_PROGRESS...
 */
export async function getMyDiagnostics(
  locale: string = "fr",
): Promise<DiagnosticClientResponse[]> {
  try {
    // ── Requête GET authentifiée ──────────────────────────────────────────
    // Le token est injecté automatiquement par l'intercepteur axios
    const response = await axiosInstance.get<{
      success: true;
      data: DiagnosticClientResponse[];
    }>("/api/diagnostics/me");

    return response.data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, locale));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 🌐 HELPERS D'AFFICHAGE MULTILINGUES
// Ces fonctions permettent d'afficher les valeurs du diagnostic
// dans la bonne langue sans dépendre de next-intl dans ce fichier.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Traduit le statut d'un diagnostic en label lisible selon la locale.
 *
 * UTILISÉ DANS : les badges de statut dans la liste des diagnostics
 *
 * @example
 * getDiagnosticStatusLabel("IN_PROGRESS", "fr") // → "En cours"
 * getDiagnosticStatusLabel("IN_PROGRESS", "en") // → "In progress"
 */
export function getDiagnosticStatusLabel(
  status: DiagnosticStatus,
  locale: string = "fr",
): string {
  const labels: Record<DiagnosticStatus, Record<string, string>> = {
    NEW: {
      fr: "Nouvelle demande",
      en: "New request",
      es: "Nueva solicitud",
    },
    READ: {
      fr: "Reçu",
      en: "Received",
      es: "Recibido",
    },
    IN_PROGRESS: {
      fr: "En cours de traitement",
      en: "In progress",
      es: "En proceso",
    },
    TREATED: {
      fr: "Traité",
      en: "Treated",
      es: "Tratado",
    },
    RESOLVED: {
      fr: "Résolu",
      en: "Resolved",
      es: "Resuelto",
    },
    ARCHIVED: {
      fr: "Archivé",
      en: "Archived",
      es: "Archivado",
    },
  };

  return labels[status]?.[locale] ?? labels[status]?.["fr"] ?? status;
}

/**
 * Retourne la couleur Tailwind associée à un statut de diagnostic.
 * Utilisé pour coloriser les badges de statut dans l'interface.
 *
 * @example
 * getDiagnosticStatusColor("NEW")        // → "bg-blue-100 text-blue-700"
 * getDiagnosticStatusColor("RESOLVED")   // → "bg-green-100 text-green-700"
 */
export function getDiagnosticStatusColor(status: DiagnosticStatus): string {
  const colors: Record<DiagnosticStatus, string> = {
    NEW: "bg-blue-100 text-blue-700 border-blue-200",
    READ: "bg-yellow-100 text-yellow-700 border-yellow-200",
    IN_PROGRESS: "bg-orange-100 text-orange-700 border-orange-200",
    TREATED: "bg-purple-100 text-purple-700 border-purple-200",
    RESOLVED: "bg-green-100 text-green-700 border-green-200",
    ARCHIVED: "bg-gray-100 text-gray-600 border-gray-200",
  };

  return colors[status] ?? "bg-gray-100 text-gray-600";
}

/**
 * Traduit la destination d'un diagnostic avec son drapeau.
 *
 * @example
 * getDiagnosticDestinationLabel("CANADA", "fr") // → "🇨🇦 Canada"
 */
export function getDiagnosticDestinationLabel(
  destination: string,
  locale: string = "fr",
): string {
  const labels: Record<string, Record<string, string>> = {
    CANADA: { fr: "🇨🇦 Canada", en: "🇨🇦 Canada", es: "🇨🇦 Canadá" },
    BELGIUM: { fr: "🇧🇪 Belgique", en: "🇧🇪 Belgium", es: "🇧🇪 Bélgica" },
    FRANCE: { fr: "🇫🇷 France", en: "🇫🇷 France", es: "🇫🇷 Francia" },
    OTHER: { fr: "🌍 Autre", en: "🌍 Other", es: "🌍 Otro" },
  };

  return (
    labels[destination]?.[locale] ?? labels[destination]?.[`fr`] ?? destination
  );
}
