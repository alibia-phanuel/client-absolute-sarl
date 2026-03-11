/**
 * 🖼️ Composant d'Upload d'Image vers Cloudinary
 * 
 * Composant réutilisable pour uploader des images avec :
 * - Prévisualisation de l'image
 * - Indicateur de progression
 * - Suppression de l'image
 * - Validation du type de fichier
 * - Gestion d'erreurs
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
  imageUrl: string | null;
  onImageUpload: (url: string) => void;
  onImageRemove: () => void;
  disabled?: boolean;
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
  // ✅ CORRIGÉ : "admin.blog" au lieu de "blogs"
  const t = useTranslations("admin.blog");

  const [isUploading, setIsUploading] = useState(false);

  // ============================================================================
  // 📤 Gestion de l'Upload
  // ============================================================================

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(t("imageUpload.invalidType"));
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error(t("imageUpload.tooLarge"));
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadImageToCloudinary(file);
      onImageUpload(result.url);
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
              <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-border">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
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
            // ====== Zone d'upload ======
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
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {isUploading ? (
                    <>
                      <Loader2 className="h-10 w-10 text-primary animate-spin mb-3" />
                      <p className="text-sm text-muted-foreground">
                        {t("imageUpload.uploading")}
                      </p>
                    </>
                  ) : (
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

        {/* Tip */}
        {!imageUrl && (
          <p className="text-xs text-muted-foreground">
            💡 {t("imageUpload.tip")}
          </p>
        )}
      </div>
    </div>
  );
}