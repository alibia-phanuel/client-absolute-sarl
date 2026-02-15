/**
 * 📡 Client API pour la gestion des blogs
 *
 * Ce fichier contient toutes les fonctions pour communiquer avec le backend :
 * - Récupérer la liste des blogs (avec filtres et pagination)
 * - Récupérer un blog par ID
 * - Créer un nouveau blog
 * - Mettre à jour un blog existant
 * - Supprimer un blog
 *
 * Toutes les fonctions gèrent les erreurs et retournent des messageKeys
 * pour l'internationalisation (i18n)
 */

import axiosInstance from "./axiosInstance";
import {
  BlogFilters,
  CreateBlogRequest,
  CreateBlogResponse,
  DeleteBlogResponse,
  GetBlogByIdResponse,
  GetBlogsResponse,
  UpdateBlogRequest,
  UpdateBlogResponse,
} from "@/types/Blog.types";

// ============================================================================
// 📋 GET ALL BLOGS - Récupérer la liste des blogs
// ============================================================================

/**
 * Récupère la liste des blogs avec pagination et filtres optionnels
 *
 * @param filters - Paramètres optionnels de filtrage et pagination
 * @returns Promise avec la liste des blogs et les métadonnées de pagination
 *
 * Exemple d'utilisation :
 * ```typescript
 * // Récupérer tous les blogs (page 1, 10 par page)
 * const blogs = await getBlogs();
 *
 * // Récupérer page 2 avec 20 blogs
 * const blogs = await getBlogs({ page: 2, limit: 20 });
 *
 * // Filtrer par auteur
 * const blogs = await getBlogs({ authorId: "user-123" });
 *
 * // Rechercher dans les titres français
 * const blogs = await getBlogs({ title_fr: "Next.js" });
 * ```
 */
export const getBlogs = async (
  filters?: BlogFilters,
): Promise<GetBlogsResponse> => {
  try {
    // Construction des paramètres de requête (query string)
    const params: Record<string, any> = {};

    if (filters?.page) params.page = filters.page;
    if (filters?.limit) params.limit = filters.limit;
    if (filters?.authorId) params.authorId = filters.authorId;
    if (filters?.title_fr) params.title_fr = filters.title_fr;
    if (filters?.title_en) params.title_en = filters.title_en;

    // Appel GET à l'API
    // Exemple : GET /api/blogs?page=1&limit=10&title_fr=Next
    const response = await axiosInstance.get<GetBlogsResponse>("/api/blogs", {
      params,
    });

    return response.data;
  } catch (error: any) {
    // Gestion des erreurs avec messageKey pour i18n
    if (error.response?.data?.messageKey) {
      throw new Error(error.response.data.messageKey);
    }
    throw new Error("blogs.fetchError");
  }
};

// ============================================================================
// 🔍 GET BLOG BY ID - Récupérer un blog spécifique
// ============================================================================

/**
 * Récupère un blog par son ID
 *
 * @param id - ID unique du blog
 * @returns Promise avec les données du blog
 *
 * Exemple d'utilisation :
 * ```typescript
 * const blog = await getBlogById("abc-123-def");
 * console.log(blog.data.title_fr); // Titre en français
 * ```
 */
export const getBlogById = async (id: string): Promise<GetBlogByIdResponse> => {
  try {
    // Appel GET à l'API
    // Exemple : GET /api/blogs/abc-123-def
    const response = await axiosInstance.get<GetBlogByIdResponse>(
      `/api/blogs/${id}`,
    );

    return response.data;
  } catch (error: any) {
    // Gestion des erreurs spécifiques
    if (error.response?.data?.messageKey) {
      throw new Error(error.response.data.messageKey);
    }

    // 404 = Blog introuvable
    if (error.response?.status === 404) {
      throw new Error("blogs.notFound");
    }

    throw new Error("blogs.fetchError");
  }
};

// ============================================================================
// ➕ CREATE BLOG - Créer un nouveau blog
// ============================================================================

/**
 * Crée un nouveau blog
 *
 * @param data - Données du blog à créer (titres et contenus FR/EN + image optionnelle)
 * @returns Promise avec le blog créé
 *
 * Exemple d'utilisation :
 * ```typescript
 * const newBlog = await createBlog({
 *   title_fr: "Mon premier article",
 *   title_en: "My first article",
 *   content_fr: "Contenu en français...",
 *   content_en: "Content in English...",
 *   imageUrl: "https://res.cloudinary.com/..."
 * });
 *
 * toast.success("Blog créé !");
 * ```
 */
export const createBlog = async (
  data: CreateBlogRequest,
): Promise<CreateBlogResponse> => {
  try {
    // Appel POST à l'API
    // Exemple : POST /api/blogs
    const response = await axiosInstance.post<CreateBlogResponse>(
      "/api/blogs",
      data,
    );

    return response.data;
  } catch (error: any) {
    // Gestion des erreurs
    if (error.response?.data?.messageKey) {
      throw new Error(error.response.data.messageKey);
    }

    // 400 = Données invalides (champs manquants)
    if (error.response?.status === 400) {
      throw new Error("validation.invalidData");
    }

    // 403 = Pas autorisé (pas ADMIN ou EMPLOYE)
    if (error.response?.status === 403) {
      throw new Error("blogs.accessDenied");
    }

    throw new Error("blogs.createError");
  }
};

// ============================================================================
// ✏️ UPDATE BLOG - Mettre à jour un blog existant
// ============================================================================

/**
 * Met à jour un blog existant
 *
 * @param id - ID du blog à mettre à jour
 * @param data - Données à modifier (tous les champs sont optionnels)
 * @returns Promise avec le blog mis à jour
 *
 * PERMISSIONS :
 * - ADMIN : Peut modifier tous les blogs
 * - EMPLOYE : Peut modifier uniquement ses propres blogs
 * - CLIENT : Pas autorisé
 *
 * Exemple d'utilisation :
 * ```typescript
 * // Modifier juste le titre français
 * await updateBlog("abc-123", {
 *   title_fr: "Nouveau titre"
 * });
 *
 * // Modifier l'image
 * await updateBlog("abc-123", {
 *   imageUrl: "https://res.cloudinary.com/nouvelle-image.jpg"
 * });
 *
 * // Modifier plusieurs champs
 * await updateBlog("abc-123", {
 *   title_fr: "Nouveau titre",
 *   content_fr: "Nouveau contenu",
 *   imageUrl: "https://..."
 * });
 * ```
 */
export const updateBlog = async (
  id: string,
  data: UpdateBlogRequest,
): Promise<UpdateBlogResponse> => {
  try {
    // Appel PUT à l'API
    // Exemple : PUT /api/blogs/abc-123
    const response = await axiosInstance.put<UpdateBlogResponse>(
      `/api/blogs/${id}`,
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

    // 403 = Pas le propriétaire du blog (pour EMPLOYE)
    if (error.response?.status === 403) {
      throw new Error("blogs.unauthorized.notOwner");
    }

    // 404 = Blog introuvable
    if (error.response?.status === 404) {
      throw new Error("blogs.notFound");
    }

    throw new Error("blogs.updateError");
  }
};

// ============================================================================
// 🗑️ DELETE BLOG - Supprimer un blog
// ============================================================================

/**
 * Supprime un blog
 *
 * @param id - ID du blog à supprimer
 * @returns Promise avec confirmation de suppression
 *
 * PERMISSIONS :
 * - ADMIN : Peut supprimer tous les blogs
 * - EMPLOYE : Peut supprimer uniquement ses propres blogs
 * - CLIENT : Pas autorisé
 *
 * ⚠️ IMPORTANT : Cette fonction supprime aussi l'image de Cloudinary
 * (si configuré dans le composant DeleteBlogModal)
 *
 * Exemple d'utilisation :
 * ```typescript
 * await deleteBlog("abc-123");
 * toast.success("Blog supprimé !");
 * ```
 */
export const deleteBlog = async (id: string): Promise<DeleteBlogResponse> => {
  try {
    // Appel DELETE à l'API
    // Exemple : DELETE /api/blogs/abc-123
    const response = await axiosInstance.delete<DeleteBlogResponse>(
      `/api/blogs/${id}`,
    );

    return response.data;
  } catch (error: any) {
    // Gestion des erreurs
    if (error.response?.data?.messageKey) {
      throw new Error(error.response.data.messageKey);
    }

    // 403 = Pas le propriétaire du blog (pour EMPLOYE)
    if (error.response?.status === 403) {
      throw new Error("blogs.unauthorized.notOwner");
    }

    // 404 = Blog introuvable
    if (error.response?.status === 404) {
      throw new Error("blogs.notFound");
    }

    throw new Error("blogs.deleteError");
  }
};

// ============================================================================
// 📖 Guide d'Utilisation
// ============================================================================

/**
 * EXEMPLES D'UTILISATION DANS UN COMPOSANT
 *
 * 1. CHARGER LES BLOGS AU MONTAGE DU COMPOSANT
 * ```typescript
 * const [blogs, setBlogs] = useState<Blog[]>([]);
 * const [isLoading, setIsLoading] = useState(true);
 *
 * useEffect(() => {
 *   const fetchBlogs = async () => {
 *     setIsLoading(true);
 *     try {
 *       const result = await getBlogs({ page: 1, limit: 10 });
 *       setBlogs(result.data);
 *     } catch (error) {
 *       toast.error(t((error as Error).message));
 *     } finally {
 *       setIsLoading(false);
 *     }
 *   };
 *
 *   fetchBlogs();
 * }, []);
 * ```
 *
 * 2. CRÉER UN BLOG AVEC IMAGE
 * ```typescript
 * const handleCreate = async (formData) => {
 *   try {
 *     // 1. Upload de l'image d'abord
 *     let imageUrl = null;
 *     if (selectedFile) {
 *       const uploadResult = await uploadImageToCloudinary(selectedFile);
 *       imageUrl = uploadResult.url;
 *     }
 *
 *     // 2. Créer le blog avec l'URL de l'image
 *     const result = await createBlog({
 *       ...formData,
 *       imageUrl
 *     });
 *
 *     toast.success(t(result.messageKey));
 *     refreshBlogs();
 *   } catch (error) {
 *     toast.error(t((error as Error).message));
 *   }
 * };
 * ```
 *
 * 3. SUPPRIMER UN BLOG ET SON IMAGE
 * ```typescript
 * const handleDelete = async (blog: Blog) => {
 *   try {
 *     // 1. Supprimer l'image de Cloudinary si elle existe
 *     if (blog.imageUrl) {
 *       const publicId = extractPublicIdFromUrl(blog.imageUrl);
 *       if (publicId) {
 *         await deleteImageFromCloudinary(publicId);
 *       }
 *     }
 *
 *     // 2. Supprimer le blog de la base de données
 *     await deleteBlog(blog.id);
 *
 *     toast.success("Blog supprimé !");
 *     refreshBlogs();
 *   } catch (error) {
 *     toast.error(t((error as Error).message));
 *   }
 * };
 * ```
 *
 * 4. RECHERCHER DES BLOGS
 * ```typescript
 * const [searchQuery, setSearchQuery] = useState("");
 *
 * useEffect(() => {
 *   const searchBlogs = async () => {
 *     if (!searchQuery) {
 *       // Pas de recherche = tous les blogs
 *       fetchBlogs();
 *       return;
 *     }
 *
 *     try {
 *       const result = await getBlogs({
 *         title_fr: searchQuery,  // Recherche dans titres français
 *       });
 *       setBlogs(result.data);
 *     } catch (error) {
 *       toast.error(t((error as Error).message));
 *     }
 *   };
 *
 *   // Debounce pour éviter trop de requêtes
 *   const timer = setTimeout(searchBlogs, 500);
 *   return () => clearTimeout(timer);
 * }, [searchQuery]);
 * ```
 */
