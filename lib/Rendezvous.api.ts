/**
 * 📡 Client API pour la gestion des rendez-vous (ADMIN/EMPLOYE)
 *
 * Ce fichier contient les fonctions pour gérer les rendez-vous côté administration :
 * - Récupérer tous les rendez-vous (avec filtres et pagination)
 * - Récupérer un rendez-vous par ID
 * - Approuver un rendez-vous
 * - Rejeter un rendez-vous
 * - Supprimer un rendez-vous
 *
 * ⚠️ IMPORTANT : Ces fonctions sont réservées aux ADMIN et EMPLOYE
 * Les clients ont leur propre interface pour créer et voir leurs rendez-vous
 */

import axiosInstance from "./axiosInstance";
import {
  RendezVousFilters,
  GetRendezVousResponse,
  GetRendezVousByIdResponse,
  ApproveRendezVousResponse,
  RejectRendezVousResponse,
  DeleteRendezVousResponse,
  UpdateRendezVousRequest,
  UpdateRendezVousResponse,
  RejectRendezVousRequest,
  CreateRendezVousRequest,
  CreateRendezVousResponse,
} from "@/types/Rendezvous.types";

// ============================================================================
// 📋 GET ALL RENDEZ-VOUS - Récupérer tous les rendez-vous
// ============================================================================

/**
 * Récupère la liste de tous les rendez-vous avec pagination et filtres
 *
 * PERMISSIONS : ADMIN et EMPLOYE uniquement
 *
 * @param filters - Paramètres optionnels de filtrage et pagination
 * @returns Promise avec la liste des rendez-vous et pagination
 *
 * Exemple d'utilisation :
 * ```typescript
 * // Récupérer tous les rendez-vous (page 1)
 * const rdv = await getAllRendezVous();
 *
 * // Récupérer page 2 avec 20 rendez-vous
 * const rdv = await getAllRendezVous({ page: 2, limit: 20 });
 *
 * // Filtrer par statut PENDING
 * const rdv = await getAllRendezVous({ status: RendezVousStatus.PENDING });
 *
 * // Filtrer par statut APPROVED, page 1, 10 par page
 * const rdv = await getAllRendezVous({
 *   status: RendezVousStatus.APPROVED,
 *   page: 1,
 *   limit: 10
 * });
 * ```
 */


/**
 * Crée un nouveau rendez-vous
 * 
 * PERMISSIONS : CLIENT uniquement
 * 
 * @param data - Données du rendez-vous (date, note)
 * @returns Promise avec le rendez-vous créé
 * 
 * Exemple d'utilisation :
 * ```typescript
 * const rdv = await createRendezVous({
 *   date: "2026-02-15T14:30:00.000Z",
 *   note: "Consultation pour projet web"
 * });
 * 
 * toast.success("Rendez-vous créé !");
 * ```
 */
export const createRendezVous = async (
  data: CreateRendezVousRequest
): Promise<CreateRendezVousResponse> => {
  try {
    // Appel POST à l'API
    // Exemple : POST /api/rendezvous
    const response = await axiosInstance.post<CreateRendezVousResponse>(
      "/api/rendezvous",
      data
    );

    return response.data;
  } catch (error: any) {
    // Gestion des erreurs
    if (error.response?.data?.messageKey) {
      throw new Error(error.response.data.messageKey);
    }

    // 400 = Données invalides
    if (error.response?.status === 400) {
      throw new Error("rendezvous.validation.invalidData");
    }

    // 401 = Non authentifié
    if (error.response?.status === 401) {
      throw new Error("auth.notAuthenticated");
    }

    throw new Error("rendezvous.createError");
  }
};


// ============================================================================
// ➕ CREATE RENDEZ-VOUS - Créer un rendez-vous
// ============================================================================

/**
 * Crée un nouveau rendez-vous
 * 
 * PERMISSIONS : CLIENT uniquement
 * 
 * @param data - Données du rendez-vous (date, note)
 * @returns Promise avec le rendez-vous créé
 * 
 * Exemple d'utilisation :
 * ```typescript
 * const rdv = await createRendezVous({
 *   date: "2026-02-15T14:30:00.000Z",
 *   note: "Consultation pour projet web"
 * });
 * 
 * toast.success("Rendez-vous créé !");
 * ```
 */

// ============================================================================
// 📋 GET MY RENDEZ-VOUS - Récupérer mes rendez-vous
// ============================================================================

/**
 * Récupère la liste de MES rendez-vous (espace client)
 * 
 * PERMISSIONS : CLIENT uniquement
 * 
 * @param filters - Paramètres optionnels de filtrage et pagination
 * @returns Promise avec la liste de mes rendez-vous
 * 
 * Exemple d'utilisation :
 * ```typescript
 * // Récupérer tous mes rendez-vous
 * const rdv = await getMyRendezVous();
 * 
 * // Filtrer par statut PENDING
 * const rdv = await getMyRendezVous({ status: RendezVousStatus.PENDING });
 * 
 * // Pagination
 * const rdv = await getMyRendezVous({ page: 2, limit: 5 });
 * ```
 */
export const getMyRendezVous = async (
  filters?: RendezVousFilters
): Promise<GetRendezVousResponse> => {
  try {
    // Construction des paramètres de requête
    const params: Record<string, any> = {};
    
    if (filters?.page) params.page = filters.page.toString();
    if (filters?.limit) params.limit = filters.limit.toString();
    if (filters?.status) params.status = filters.status;

    // Appel GET à l'API
    // Exemple : GET /api/rendezvous/me?status=PENDING&page=1&limit=10
    const response = await axiosInstance.get<GetRendezVousResponse>(
      "/api/rendezvous/me",
      { params }
    );

    return response.data;
  } catch (error: any) {
    // Gestion des erreurs
    if (error.response?.data?.messageKey) {
      throw new Error(error.response.data.messageKey);
    }

    // 401 = Non authentifié
    if (error.response?.status === 401) {
      throw new Error("auth.notAuthenticated");
    }

    throw new Error("rendezvous.fetchError");
  }
};

/**
 * Supprime un de mes rendez-vous (uniquement si PENDING)
 * 
 * PERMISSIONS : CLIENT uniquement (seulement SES rendez-vous PENDING)
 * 
 * @param id - ID du rendez-vous à supprimer
 * @returns Promise avec confirmation de suppression
 * 
 * ⚠️ Restrictions CLIENT :
 * - Peut supprimer uniquement SES rendez-vous
 * - Uniquement si status = PENDING
 * - Rendez-vous APPROVED/REJECTED ne peuvent pas être supprimés
 * 
 * Exemple d'utilisation :
 * ```typescript
 * await deleteRendezVous("abc-123");
 * toast.success("Rendez-vous annulé !");
 * refreshList();
 * ```
 */
export const deleteRendezVous = async (
  id: string
): Promise<DeleteRendezVousResponse> => {
  try {
    // Appel DELETE à l'API
    // Exemple : DELETE /api/rendezvous/abc-123
    const response = await axiosInstance.delete<DeleteRendezVousResponse>(
      `/api/rendezvous/${id}`
    );

    return response.data;
  } catch (error: any) {
    // Gestion des erreurs
    if (error.response?.data?.messageKey) {
      throw new Error(error.response.data.messageKey);
    }

    // 400 = Rendez-vous non PENDING
    if (error.response?.status === 400) {
      throw new Error("rendezvous.cannotDeleteNonPending");
    }

    // 403 = Accès refusé
    if (error.response?.status === 403) {
      throw new Error("rendezvous.unauthorized.notYourRendezVous");
    }

    // 404 = Rendez-vous introuvable
    if (error.response?.status === 404) {
      throw new Error("rendezvous.notFound");
    }

    throw new Error("rendezvous.deleteError");
  }
};

export const getAllRendezVous = async (
  filters?: RendezVousFilters,
): Promise<GetRendezVousResponse> => {
  try {
    // Construction des paramètres de requête (query string)
    const params: Record<string, any> = {};

    if (filters?.page) params.page = filters.page.toString();
    if (filters?.limit) params.limit = filters.limit.toString();
    if (filters?.status) params.status = filters.status;

    // Appel GET à l'API
    // Exemple : GET /api/rendezvous?status=PENDING&page=1&limit=10
    const response = await axiosInstance.get<GetRendezVousResponse>(
      "/api/rendezvous",
      { params },
    );

    return response.data;
  } catch (error: any) {
    // Gestion des erreurs avec messageKey pour i18n
    if (error.response?.data?.messageKey) {
      throw new Error(error.response.data.messageKey);
    }

    // 403 = Accès refusé (pas ADMIN ou EMPLOYE)
    if (error.response?.status === 403) {
      throw new Error("rendezvous.accessDenied");
    }

    throw new Error("rendezvous.fetchError");
  }
};

// ============================================================================
// 🔍 GET RENDEZ-VOUS BY ID - Récupérer un rendez-vous spécifique
// ============================================================================

/**
 * Récupère un rendez-vous par son ID
 *
 * PERMISSIONS : ADMIN et EMPLOYE uniquement
 *
 * @param id - ID unique du rendez-vous
 * @returns Promise avec les données du rendez-vous
 *
 * Exemple d'utilisation :
 * ```typescript
 * const rdv = await getRendezVousById("abc-123-def");
 * console.log(rdv.data.status); // PENDING, APPROVED, ou REJECTED
 * ```
 */
export const getRendezVousById = async (
  id: string,
): Promise<GetRendezVousByIdResponse> => {
  try {
    // Appel GET à l'API
    // Exemple : GET /api/rendezvous/abc-123-def
    const response = await axiosInstance.get<GetRendezVousByIdResponse>(
      `/api/rendezvous/${id}`,
    );

    return response.data;
  } catch (error: any) {
    // Gestion des erreurs spécifiques
    if (error.response?.data?.messageKey) {
      throw new Error(error.response.data.messageKey);
    }

    // 404 = Rendez-vous introuvable
    if (error.response?.status === 404) {
      throw new Error("rendezvous.notFound");
    }

    // 403 = Accès refusé
    if (error.response?.status === 403) {
      throw new Error("rendezvous.accessDenied");
    }

    throw new Error("rendezvous.fetchError");
  }
};

// ============================================================================
// ✅ APPROVE RENDEZ-VOUS - Approuver un rendez-vous
// ============================================================================

/**
 * Approuve un rendez-vous (change le statut de PENDING à APPROVED)
 *
 * PERMISSIONS : ADMIN et EMPLOYE uniquement
 *
 * @param id - ID du rendez-vous à approuver
 * @returns Promise avec le rendez-vous mis à jour
 *
 * Exemple d'utilisation :
 * ```typescript
 * await approveRendezVous("abc-123");
 * toast.success("Rendez-vous approuvé !");
 * refreshList();
 * ```
 */
export const approveRendezVous = async (
  id: string,
): Promise<ApproveRendezVousResponse> => {
  try {
    // Appel PATCH à l'API
    // Exemple : PATCH /api/rendezvous/abc-123/approve
    const response = await axiosInstance.patch<ApproveRendezVousResponse>(
      `/api/rendezvous/${id}/approve`,
    );

    return response.data;
  } catch (error: any) {
    // Gestion des erreurs
    if (error.response?.data?.messageKey) {
      throw new Error(error.response.data.messageKey);
    }

    // 400 = Déjà traité
    if (error.response?.status === 400) {
      throw new Error("rendezvous.alreadyProcessed");
    }

    // 404 = Rendez-vous introuvable
    if (error.response?.status === 404) {
      throw new Error("rendezvous.notFound");
    }

    // 403 = Accès refusé
    if (error.response?.status === 403) {
      throw new Error("rendezvous.accessDenied");
    }

    throw new Error("rendezvous.approveError");
  }
};

// ============================================================================
// ❌ REJECT RENDEZ-VOUS - Rejeter un rendez-vous
// ============================================================================

/**
 * Rejette un rendez-vous (change le statut de PENDING à REJECTED)
 *
 * PERMISSIONS : ADMIN et EMPLOYE uniquement
 *
 * @param id - ID du rendez-vous à rejeter
 * @param data - Données optionnelles (note expliquant le rejet)
 * @returns Promise avec le rendez-vous mis à jour
 *
 * Exemple d'utilisation :
 * ```typescript
 * // Sans note
 * await rejectRendezVous("abc-123");
 *
 * // Avec note expliquant le rejet
 * await rejectRendezVous("abc-123", {
 *   note: "Date non disponible, veuillez choisir une autre date"
 * });
 *
 * toast.error("Rendez-vous rejeté");
 * refreshList();
 * ```
 */
export const rejectRendezVous = async (
  id: string,
  data?: RejectRendezVousRequest,
): Promise<RejectRendezVousResponse> => {
  try {
    // Appel PATCH à l'API
    // Exemple : PATCH /api/rendezvous/abc-123/reject
    const response = await axiosInstance.patch<RejectRendezVousResponse>(
      `/api/rendezvous/${id}/reject`,
      data || {},
    );

    return response.data;
  } catch (error: any) {
    // Gestion des erreurs
    if (error.response?.data?.messageKey) {
      throw new Error(error.response.data.messageKey);
    }

    // 400 = Déjà traité
    if (error.response?.status === 400) {
      throw new Error("rendezvous.alreadyProcessed");
    }

    // 404 = Rendez-vous introuvable
    if (error.response?.status === 404) {
      throw new Error("rendezvous.notFound");
    }

    // 403 = Accès refusé
    if (error.response?.status === 403) {
      throw new Error("rendezvous.accessDenied");
    }

    throw new Error("rendezvous.rejectError");
  }
};

// ============================================================================
// ✏️ UPDATE RENDEZ-VOUS - Mettre à jour un rendez-vous
// ============================================================================

/**
 * Met à jour un rendez-vous
 *
 * PERMISSIONS : ADMIN et EMPLOYE uniquement (pour l'interface admin)
 *
 * @param id - ID du rendez-vous à mettre à jour
 * @param data - Données à modifier (date, note, status)
 * @returns Promise avec le rendez-vous mis à jour
 *
 * Exemple d'utilisation :
 * ```typescript
 * // Modifier la date
 * await updateRendezVous("abc-123", {
 *   date: "2026-02-20T10:00:00.000Z"
 * });
 *
 * // Modifier la note
 * await updateRendezVous("abc-123", {
 *   note: "Rendez-vous reporté"
 * });
 *
 * // Modifier le statut (ADMIN/EMPLOYE uniquement)
 * await updateRendezVous("abc-123", {
 *   status: RendezVousStatus.APPROVED
 * });
 * ```
 */
export const updateRendezVous = async (
  id: string,
  data: UpdateRendezVousRequest,
): Promise<UpdateRendezVousResponse> => {
  try {
    // Appel PUT à l'API
    // Exemple : PUT /api/rendezvous/abc-123
    const response = await axiosInstance.put<UpdateRendezVousResponse>(
      `/api/rendezvous/${id}`,
      data,
    );

    return response.data;
  } catch (error: any) {
    // Gestion des erreurs
    if (error.response?.data?.messageKey) {
      throw new Error(error.response.data.messageKey);
    }

    // 400 = Données invalides
    if (error.response?.status === 400) {
      throw new Error("validation.invalidData");
    }

    // 403 = Accès refusé
    if (error.response?.status === 403) {
      throw new Error("rendezvous.accessDenied");
    }

    // 404 = Rendez-vous introuvable
    if (error.response?.status === 404) {
      throw new Error("rendezvous.notFound");
    }

    throw new Error("rendezvous.updateError");
  }
};

// ============================================================================
// 🗑️ DELETE RENDEZ-VOUS - Supprimer un rendez-vous
// ============================================================================



// ============================================================================
// 📖 Guide d'Utilisation
// ============================================================================

/**
 * EXEMPLES D'UTILISATION DANS UN COMPOSANT
 *
 * 1. CHARGER LES RENDEZ-VOUS AU MONTAGE
 * ```typescript
 * const [rendezvous, setRendezVous] = useState<RendezVous[]>([]);
 * const [isLoading, setIsLoading] = useState(true);
 *
 * useEffect(() => {
 *   const fetchRendezVous = async () => {
 *     setIsLoading(true);
 *     try {
 *       const result = await getAllRendezVous({ page: 1, limit: 10 });
 *       setRendezVous(result.data);
 *     } catch (error) {
 *       toast.error(t((error as Error).message));
 *     } finally {
 *       setIsLoading(false);
 *     }
 *   };
 *
 *   fetchRendezVous();
 * }, []);
 * ```
 *
 * 2. APPROUVER UN RENDEZ-VOUS
 * ```typescript
 * const handleApprove = async (id: string) => {
 *   try {
 *     const result = await approveRendezVous(id);
 *     toast.success(t(result.messageKey));
 *     refreshRendezVous();
 *   } catch (error) {
 *     toast.error(t((error as Error).message));
 *   }
 * };
 * ```
 *
 * 3. REJETER UN RENDEZ-VOUS AVEC NOTE
 * ```typescript
 * const handleReject = async (id: string, note: string) => {
 *   try {
 *     const result = await rejectRendezVous(id, { note });
 *     toast.error(t(result.messageKey));
 *     refreshRendezVous();
 *   } catch (error) {
 *     toast.error(t((error as Error).message));
 *   }
 * };
 * ```
 *
 * 4. FILTRER PAR STATUT
 * ```typescript
 * const [statusFilter, setStatusFilter] = useState<RendezVousStatus | "ALL">("ALL");
 *
 * useEffect(() => {
 *   const fetchFiltered = async () => {
 *     const filters = statusFilter !== "ALL" ? { status: statusFilter } : {};
 *     const result = await getAllRendezVous(filters);
 *     setRendezVous(result.data);
 *   };
 *
 *   fetchFiltered();
 * }, [statusFilter]);
 * ```
 */
