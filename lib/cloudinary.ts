/**
 * 🖼️ Configuration et utilitaires Cloudinary
 * 
 * Ce fichier gère :
 * - Upload d'images vers Cloudinary
 * - Suppression d'images de Cloudinary
 * - Extraction du publicId depuis une URL Cloudinary
 * 
 * IMPORTANT : Ajoutez ces variables dans votre fichier .env :
 * - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=votre-cloud-name
 * - NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=votre-upload-preset
 * 
 * Configuration Cloudinary (sur cloudinary.com) :
 * 1. Settings → Upload → Upload presets
 * 2. Créer un preset "unsigned" (pas besoin de signature côté client)
 * 3. Configurer le folder : "blogs" (optionnel mais recommandé)
 */

import { CloudinaryUploadResponse } from "@/types/Blog.types";

// ============================================================================
// 🔧 Configuration
// ============================================================================

/**
 * Nom de votre compte Cloudinary
 * Exemple : "monentreprise" si votre URL est monentreprise.cloudinary.com
 */
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

/**
 * Upload preset configuré dans Cloudinary
 * Permet l'upload sans signature (unsigned upload)
 */
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

/**
 * URL de base pour l'API Cloudinary upload
 */
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// ============================================================================
// 📤 Upload d'Image
// ============================================================================

/**
 * Upload une image vers Cloudinary
 * 
 * @param file - Fichier image (File object du browser)
 * @returns Promise avec l'URL de l'image uploadée et son publicId
 * 
 * Exemple d'utilisation :
 * ```typescript
 * const file = event.target.files[0];
 * const result = await uploadImageToCloudinary(file);
 * console.log(result.url); // https://res.cloudinary.com/...
 * ```
 */
export const uploadImageToCloudinary = async (
  file: File
): Promise<{ url: string; publicId: string }> => {
  // Vérification : les variables d'environnement sont-elles configurées ?
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary non configuré. Ajoutez NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME et NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET dans .env"
    );
  }

  // Création du FormData pour l'upload multipart
  const formData = new FormData();
  formData.append("file", file);                        // Le fichier image
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET); // Le preset
  formData.append("folder", "blogs");                   // Dossier dans Cloudinary (optionnel)

  try {
    // Envoi de la requête HTTP POST vers Cloudinary
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: "POST",
      body: formData,
    });

    // Vérification : l'upload a réussi ?
    if (!response.ok) {
      const error = await response.json();
      console.error("Erreur Cloudinary:", error);
      throw new Error("Échec de l'upload de l'image");
    }

    // Récupération des données de l'image uploadée
    const data: CloudinaryUploadResponse = await response.json();

    // Retour des informations essentielles
    return {
      url: data.secure_url,      // URL HTTPS de l'image
      publicId: data.public_id,  // ID pour suppression ultérieure
    };
  } catch (error) {
    console.error("Erreur upload Cloudinary:", error);
    throw new Error("Impossible d'uploader l'image");
  }
};

// ============================================================================
// 🗑️ Suppression d'Image
// ============================================================================

/**
 * Supprime une image de Cloudinary
 * 
 * ⚠️ ATTENTION : Cette fonction nécessite un endpoint backend !
 * La suppression ne peut PAS se faire directement depuis le client (sécurité).
 * 
 * @param publicId - L'ID public de l'image à supprimer
 * @returns Promise<void>
 * 
 * Configuration backend requise :
 * ```typescript
 * // Backend (Express)
 * import cloudinary from 'cloudinary';
 * 
 * app.delete('/api/cloudinary/:publicId', async (req, res) => {
 *   await cloudinary.v2.uploader.destroy(req.params.publicId);
 *   res.json({ success: true });
 * });
 * ```
 */
export const deleteImageFromCloudinary = async (
  publicId: string
): Promise<void> => {
  try {
    // Appel à votre endpoint backend qui fera la suppression
    const response = await fetch(`/api/cloudinary/${publicId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      console.error("Échec de suppression image Cloudinary");
      // On ne throw pas d'erreur pour ne pas bloquer la suppression du blog
      // L'image reste sur Cloudinary mais le blog est supprimé de la BD
    }
  } catch (error) {
    console.error("Erreur lors de la suppression Cloudinary:", error);
    // Même stratégie : on continue malgré l'erreur
  }
};

// ============================================================================
// 🔍 Utilitaires
// ============================================================================

/**
 * Extrait le publicId d'une URL Cloudinary
 * 
 * @param url - URL complète Cloudinary
 * @returns Le publicId ou null si l'URL n'est pas valide
 * 
 * Exemple :
 * ```typescript
 * const url = "https://res.cloudinary.com/demo/image/upload/v123456/blogs/article1.jpg";
 * const publicId = extractPublicIdFromUrl(url);
 * // Retourne : "blogs/article1"
 * ```
 */
export const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    // Pattern : https://res.cloudinary.com/{cloud_name}/{resource_type}/{type}/v{version}/{publicId}.{format}
    const regex = /\/upload\/(?:v\d+\/)?(.+)\.\w+$/;
    const match = url.match(regex);
    
    if (match && match[1]) {
      return match[1]; // Retourne le publicId (avec le folder si présent)
    }
    
    return null;
  } catch (error) {
    console.error("Erreur extraction publicId:", error);
    return null;
  }
};

/**
 * Vérifie si une URL est une URL Cloudinary valide
 * 
 * @param url - URL à vérifier
 * @returns true si c'est une URL Cloudinary
 */
export const isCloudinaryUrl = (url: string): boolean => {
  return url.includes("res.cloudinary.com") || url.includes("cloudinary.com");
};

// ============================================================================
// 📝 Guide d'Utilisation
// ============================================================================

/**
 * CONFIGURATION CLOUDINARY (À FAIRE UNE SEULE FOIS)
 * 
 * 1. Créer un compte sur cloudinary.com
 * 
 * 2. Récupérer votre Cloud Name
 *    - Dashboard → Account Details → Cloud name
 * 
 * 3. Créer un Upload Preset
 *    - Settings → Upload → Upload presets
 *    - Cliquer "Add upload preset"
 *    - Signing Mode : "Unsigned"
 *    - Folder : "blogs" (optionnel)
 *    - Copier le "Preset name"
 * 
 * 4. Ajouter dans .env.local :
 *    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=votre-cloud-name
 *    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=votre-preset-name
 * 
 * 5. Pour la suppression, créer un endpoint backend :
 *    - Installer : npm install cloudinary
 *    - Configurer avec API Key et Secret (depuis Dashboard Cloudinary)
 *    - Créer route DELETE pour supprimer les images
 * 
 * EXEMPLE D'UTILISATION DANS UN COMPOSANT
 * 
 * ```typescript
 * import { uploadImageToCloudinary } from '@/lib/cloudinary';
 * 
 * const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
 *   const file = e.target.files?.[0];
 *   if (!file) return;
 * 
 *   setIsUploading(true);
 *   try {
 *     const result = await uploadImageToCloudinary(file);
 *     setImageUrl(result.url);
 *     toast.success("Image uploadée !");
 *   } catch (error) {
 *     toast.error("Échec de l'upload");
 *   } finally {
 *     setIsUploading(false);
 *   }
 * };
 * ```
 */