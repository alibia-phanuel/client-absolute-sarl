/**
 * 📅 Types pour le système de gestion des rendez-vous
 * 
 * Ce fichier contient tous les types TypeScript nécessaires pour :
 * - Les rendez-vous (RendezVous)
 * - Les requêtes API (Create, Update, Approve, Reject)
 * - Les réponses API (avec pagination)
 * - Les statuts de rendez-vous
 * 
 * Utilisation : Import ces types partout où vous manipulez des rendez-vous
 */

// ============================================================================
// 📊 Enum des Statuts
// ============================================================================

/**
 * Statut d'un rendez-vous
 * - PENDING : En attente de traitement (par défaut à la création)
 * - APPROVED : Approuvé par un admin/employé
 * - REJECTED : Rejeté par un admin/employé
 */
export enum RendezVousStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

// ============================================================================
// 👤 Types de Base
// ============================================================================

/**
 * Informations du client qui a créé le rendez-vous
 */
export interface RendezVousClient {
  id: string;
  name: string;
  email: string;
  role: string;
}

/**
 * Rendez-vous complet
 */
export interface RendezVous {
  id: string;
  clientId: string;
  date: string;                    // Date ISO du rendez-vous
  status: RendezVousStatus;         // PENDING, APPROVED, REJECTED
  note: string | null;              // Note/motif du rendez-vous
  createdAt: string;                // Date de création
  updatedAt: string;                // Date de dernière modification
  client?: RendezVousClient;        // Infos du client (chargé avec include)
}

// ============================================================================
// 📤 Types de Requêtes (ce qu'on envoie à l'API)
// ============================================================================

/**
 * Données pour créer un nouveau rendez-vous
 * Note : Le clientId est automatiquement récupéré depuis le token JWT
 */
export interface CreateRendezVousRequest {
  date: string;           // Date ISO (ex: "2026-02-15T14:30:00.000Z")
  note?: string;          // Motif optionnel du rendez-vous
}

/**
 * Données pour mettre à jour un rendez-vous
 * - CLIENT : Peut modifier date et note (seulement si status = PENDING)
 * - ADMIN/EMPLOYE : Peut modifier date, note ET status
 */
export interface UpdateRendezVousRequest {
  date?: string;
  note?: string;
  status?: RendezVousStatus;  // Réservé aux ADMIN/EMPLOYE
}

/**
 * Données pour rejeter un rendez-vous
 */
export interface RejectRendezVousRequest {
  note?: string;  // Note expliquant le motif du rejet (optionnel)
}

// ============================================================================
// 📥 Types de Réponses (ce que l'API nous renvoie)
// ============================================================================

/**
 * Métadonnées de pagination
 */
export interface PaginationMeta {
  total: number;          // Nombre total de rendez-vous
  page: number;           // Page actuelle
  limit: number;          // Nombre de rendez-vous par page
  totalPages: number;     // Nombre total de pages
}

/**
 * Réponse pour la liste des rendez-vous (avec pagination)
 */
export interface GetRendezVousResponse {
  success: boolean;
  messageKey: string;
  message: string;
  data: RendezVous[];
  pagination: PaginationMeta;
}

/**
 * Réponse pour un seul rendez-vous (par ID)
 */
export interface GetRendezVousByIdResponse {
  success: boolean;
  messageKey: string;
  message: string;
  data: RendezVous;
}

/**
 * Réponse après création d'un rendez-vous
 */
export interface CreateRendezVousResponse {
  success: boolean;
  messageKey: string;
  message: string;
  data: RendezVous;
}

/**
 * Réponse après mise à jour d'un rendez-vous
 */
export interface UpdateRendezVousResponse {
  success: boolean;
  messageKey: string;
  message: string;
  data: RendezVous;
}

/**
 * Réponse après suppression d'un rendez-vous
 */
export interface DeleteRendezVousResponse {
  success: boolean;
  messageKey: string;
  message: string;
}

/**
 * Réponse après approbation d'un rendez-vous
 */
export interface ApproveRendezVousResponse {
  success: boolean;
  messageKey: string;
  message: string;
  data: RendezVous;
}

/**
 * Réponse après rejet d'un rendez-vous
 */
export interface RejectRendezVousResponse {
  success: boolean;
  messageKey: string;
  message: string;
  data: RendezVous;
}

// ============================================================================
// 🔍 Types de Filtres (pour la recherche)
// ============================================================================

/**
 * Paramètres de recherche pour filtrer les rendez-vous
 */
export interface RendezVousFilters {
  status?: RendezVousStatus;    // Filtrer par statut
  page?: number;                 // Numéro de page (défaut: 1)
  limit?: number;                // Rendez-vous par page (défaut: 10)
}

// ============================================================================
// ⚠️ Types d'Erreurs
// ============================================================================

/**
 * Format standard des erreurs API
 */
export interface ApiError {
  success: false;
  messageKey: string;
  message: string;
}