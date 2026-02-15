/**
 * 🖼️ Composant d'Upload d'Image vers Cloudinary
 * 
 * Composant réutilisable pour uploader des images avec :
 * - Prévisualisation de l'image
 * - Indicateur de progression
 * - Suppression de l'image
 * - Validation du type de fichier
 * - Gestion d'erreurs
 * 
 * Utilisation :
 * ```tsx
 * <ImageUpload
 *   imageUrl={imageUrl}
 *   onImageUpload={(url) => setImageUrl(url)}
 *   onImageRemove={() => setImageUrl(null)}
 *   isLoading={isUploading}
 * />
 * ```
 */

"use client";

import { useState, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

// ============================================================================
// 📋 Props du Composant
// ============================================================================

interface ImageUploadProps {
  imageUrl: string | null;           // URL de l'image actuelle (null si pas d'image)
  onImageUpload: (url: string) => void;  // Callback quand une image est uploadée
  onImageRemove: () => void;         // Callback quand l'image est supprimée
  disabled?: boolean;                // Désactiver l'upload (ex: pendant la sauvegarde)
}

// ============================================================================
// 🎨 Composant Principal
// ============================================================================

export function ImageUpload({
  imageUrl,
  onImageUpload,
  onImageRemove,
  disabled = false,
}: ImageUploadProps) {
  const t = useTranslations("blogs");

  // État local pour le loading de l'upload
  const [isUploading, setIsUploading] = useState(false);

  // ============================================================================
  // 📤 Gestion de l'Upload
  // ============================================================================

  /**
   * Gère la sélection et l'upload d'un fichier
   */
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    // Récupération du fichier sélectionné
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation : Vérifier que c'est bien une image
    if (!file.type.startsWith("image/")) {
      toast.error(t("imageUpload.invalidType"));
      return;
    }

    // Validation : Taille max 5MB
    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
    if (file.size > maxSize) {
      toast.error(t("imageUpload.tooLarge"));
      return;
    }

    // Upload vers Cloudinary
    setIsUploading(true);
    try {
      const result = await uploadImageToCloudinary(file);
      onImageUpload(result.url); // Passer l'URL au parent
      toast.success(t("imageUpload.success"));
    } catch (error) {
      console.error("Erreur upload:", error);
      toast.error(t("imageUpload.error"));
    } finally {
      setIsUploading(false);
    }
  };

  // ============================================================================
  // 🗑️ Gestion de la Suppression
  // ============================================================================

  /**
   * Supprime l'image (seulement côté client, pas de Cloudinary)
   * La suppression de Cloudinary se fait lors de la suppression du blog
   */
  const handleRemoveImage = () => {
    onImageRemove();
    toast.success(t("imageUpload.removed"));
  };

  // ============================================================================
  // 🎨 Rendu du Composant
  // ============================================================================

  return (
    <div className="space-y-4">
      {/* Label */}
      <label className="text-sm font-semibold flex items-center gap-2">
        <ImageIcon className="h-4 w-4 text-muted-foreground" />
        {t("image")}
        <span className="text-xs text-muted-foreground font-normal">
          ({t("imageUpload.optional")})
        </span>
      </label>

      {/* Zone d'upload ou prévisualisation */}
      <div className="space-y-3">
        <AnimatePresence mode="wait">
          {imageUrl ? (
            // ====== Prévisualisation de l'image ======
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative group"
            >
              {/* Image */}
              <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-border">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay au survol */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveImage}
                    disabled={disabled}
                  >
                    <X className="h-4 w-4 mr-2" />
                    {t("imageUpload.remove")}
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            // ====== Zone d'upload (drag & drop style) ======
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <label
                className={`
                  relative flex flex-col items-center justify-center
                  w-full h-48 border-2 border-dashed rounded-lg
                  cursor-pointer transition-all
                  ${
                    disabled || isUploading
                      ? "opacity-50 cursor-not-allowed bg-muted"
                      : "hover:bg-muted/50 hover:border-primary"
                  }
                `}
              >
                {/* Contenu de la zone d'upload */}
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {isUploading ? (
                    // Loading state
                    <>
                      <Loader2 className="h-10 w-10 text-primary animate-spin mb-3" />
                      <p className="text-sm text-muted-foreground">
                        {t("imageUpload.uploading")}
                      </p>
                    </>
                  ) : (
                    // État normal
                    <>
                      <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">
                          {t("imageUpload.clickToUpload")}
                        </span>{" "}
                        {t("imageUpload.orDragDrop")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, WEBP {t("imageUpload.maxSize")}
                      </p>
                    </>
                  )}
                </div>

                {/* Input file caché */}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={disabled || isUploading}
                />
              </label>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info supplémentaire */}
        {!imageUrl && (
          <p className="text-xs text-muted-foreground">
            💡 {t("imageUpload.tip")}
          </p>
        )}
      </div>
    </div>
  );
}