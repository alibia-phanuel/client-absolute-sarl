/**
 * 📝 Types pour le système de gestion des blogs
 * 
 * Ce fichier contient tous les types TypeScript nécessaires pour :
 * - Les articles de blog (Blog)
 * - Les requêtes API (Create, Update, Delete)
 * - Les réponses API (avec pagination)
 * 
 * Utilisation : Import ces types partout où vous manipulez des blogs
 */

// ============================================================================
// 👤 Types de Base
// ============================================================================

/**
 * Informations de l'auteur d'un article
 * Sous-ensemble des données utilisateur pour éviter d'exposer des infos sensibles
 */
export interface BlogAuthor {
  id: string;
  name: string;
  email: string;
}

/**
 * Article de blog complet
 * Contient les titres et contenus en français ET anglais (i18n)
 */
export interface Blog {
  id: string;
  title_fr: string;          // Titre en français
  title_en: string;          // Titre en anglais
  content_fr: string;        // Contenu en français
  content_en: string;        // Contenu en anglais
  imageUrl: string | null;   // URL de l'image sur Cloudinary (ou null si pas d'image)
  authorId: string;          // ID de l'auteur
  author?: BlogAuthor;       // Données de l'auteur (optionnel, chargé avec include)
  createdAt: string;         // Date de création (ISO string)
  updatedAt: string;         // Date de dernière modification (ISO string)
}

// ============================================================================
// 📤 Types de Requêtes (ce qu'on envoie à l'API)
// ============================================================================

/**
 * Données pour créer un nouvel article
 * Tous les champs sont requis sauf imageUrl
 */
export interface CreateBlogRequest {
  title_fr: string;
  title_en: string;
  content_fr: string;
  content_en: string;
  imageUrl?: string | null;  // Optionnel : URL Cloudinary après upload
}

/**
 * Données pour mettre à jour un article
 * Tous les champs sont optionnels (on peut modifier juste le titre par exemple)
 */
export interface UpdateBlogRequest {
  title_fr?: string;
  title_en?: string;
  content_fr?: string;
  content_en?: string;
  imageUrl?: string | null;
}

// ============================================================================
// 📥 Types de Réponses (ce que l'API nous renvoie)
// ============================================================================

/**
 * Réponse pour la liste des blogs (avec pagination)
 */
export interface GetBlogsResponse {
  success: boolean;
  data: Blog[];              // Tableau des articles
  meta: {
    page: number;            // Page actuelle (commence à 1)
    limit: number;           // Nombre d'articles par page
    total: number;           // Nombre total d'articles
    totalPages: number;      // Nombre total de pages
  };
}

/**
 * Réponse pour un seul blog (par ID)
 */
export interface GetBlogByIdResponse {
  success: boolean;
  data: Blog;
}

/**
 * Réponse après création d'un blog
 */
export interface CreateBlogResponse {
  success: boolean;
  messageKey: string;        // Clé de traduction (ex: "blog.created")
  message: string;           // Message en texte brut
  data: Blog;                // L'article créé
}

/**
 * Réponse après mise à jour d'un blog
 */
export interface UpdateBlogResponse {
  success: boolean;
  messageKey: string;
  message: string;
  data: Blog;                // L'article mis à jour
}

/**
 * Réponse après suppression d'un blog
 */
export interface DeleteBlogResponse {
  success: boolean;
  messageKey: string;
  message: string;
}

// ============================================================================
// 🔍 Types de Filtres (pour la recherche)
// ============================================================================

/**
 * Paramètres de recherche pour filtrer les blogs
 * Tous optionnels : utilisez seulement ceux dont vous avez besoin
 */
export interface BlogFilters {
  page?: number;             // Numéro de page (défaut: 1)
  limit?: number;            // Articles par page (défaut: 10, max: 50)
  authorId?: string;         // Filtrer par auteur
  title_fr?: string;         // Recherche dans le titre français (insensible à la casse)
  title_en?: string;         // Recherche dans le titre anglais (insensible à la casse)
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

// ============================================================================
// 🖼️ Types pour Upload Cloudinary
// ============================================================================

/**
 * Réponse Cloudinary après upload d'une image
 */
export interface CloudinaryUploadResponse {
  secure_url: string;        // URL HTTPS de l'image uploadée
  public_id: string;         // ID unique pour supprimer l'image plus tard
  width: number;
  height: number;
  format: string;            // jpg, png, webp, etc.
  resource_type: string;     // "image"
}

/**
 * Données stockées pour tracer les images uploadées
 * Permet de supprimer les images de Cloudinary quand on supprime un blog
 */
export interface CloudinaryImageData {
  url: string;               // URL complète (secure_url)
  publicId: string;          // ID pour la suppression (public_id)
}