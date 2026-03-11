/**
 * 🗑️ Modal de Suppression de Blog
 * 
 * Modal de confirmation pour supprimer un blog avec :
 * - Affichage des informations du blog
 * - Alerte de suppression définitive
 * - Suppression automatique de l'image Cloudinary
 * - Gestion des permissions (ADMIN vs EMPLOYE)
 * 
 * Utilisation :
 * ```tsx
 * <DeleteBlogModal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   blog={selectedBlog}
 *   onSuccess={refreshBlogs}
 * />
 * ```
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, AlertTriangle, FileText, User, Calendar } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { Blog } from "@/types/Blog.types";
import { deleteBlog } from "@/lib/blogs.api";
import {
  deleteImageFromCloudinary,
  extractPublicIdFromUrl,
  isCloudinaryUrl,
} from "@/lib/cloudinary";

// ============================================================================
// 📋 Props du Composant
// ============================================================================

interface DeleteBlogModalProps {
  open: boolean;              // Modal ouvert/fermé
  onClose: () => void;        // Callback pour fermer
  blog: Blog | null;          // Blog à supprimer
  onSuccess: () => void;      // Callback après succès
}

// ============================================================================
// 🎨 Composant Principal
// ============================================================================

export function DeleteBlogModal({
  open,
  onClose,
  blog,
  onSuccess,
}: DeleteBlogModalProps) {
  const t = useTranslations();
  const tBlogs = useTranslations("admin.blog");
  const locale = useLocale();

  const [isLoading, setIsLoading] = useState(false);

  // Locale pour les dates
  const dateLocale = locale === "fr" ? fr : enUS;

  // ============================================================================
  // 🗑️ Suppression du Blog
  // ============================================================================

  /**
   * Supprime le blog ET son image Cloudinary
   * 
   * Processus :
   * 1. Extraire le publicId de l'URL Cloudinary (si image existe)
   * 2. Supprimer l'image de Cloudinary
   * 3. Supprimer le blog de la base de données
   * 4. Rafraîchir la liste des blogs
   */
  const handleDelete = async () => {
    if (!blog) return;

    setIsLoading(true);
    try {
      // ====== ÉTAPE 1 : Supprimer l'image Cloudinary ======
      if (blog.imageUrl && isCloudinaryUrl(blog.imageUrl)) {
        // Extraire le publicId de l'URL
        const publicId = extractPublicIdFromUrl(blog.imageUrl);
        
        if (publicId) {
          try {
            // Supprimer l'image de Cloudinary
            await deleteImageFromCloudinary(publicId);
            console.log("✅ Image Cloudinary supprimée:", publicId);
          } catch (error) {
            // Si la suppression Cloudinary échoue, on continue quand même
            // L'image restera sur Cloudinary mais le blog sera supprimé de la BD
            console.error("❌ Erreur suppression Cloudinary:", error);
            console.warn("⚠️ L'image Cloudinary n'a pas pu être supprimée, mais le blog sera supprimé");
          }
        }
      }

      // ====== ÉTAPE 2 : Supprimer le blog de la base de données ======
      const result = await deleteBlog(blog.id);
      
      // ====== ÉTAPE 3 : Succès ======
      toast.success(t(result.messageKey));
      onSuccess();   // Rafraîchir la liste
      onClose();     // Fermer le modal
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      toast.error(t(err.message));
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // 🎨 Rendu du Composant
  // ============================================================================

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            {tBlogs("deleteBlog")}
          </DialogTitle>
          <DialogDescription>
            {tBlogs("deleteBlogDescription")}
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* ====== Alerte de suppression ====== */}
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {tBlogs("deleteWarning")}
            </AlertDescription>
          </Alert>

          {/* ====== Informations du blog ====== */}
          {blog && (
            <div className="space-y-4">
              {/* Image (si présente) */}
              {blog.imageUrl && (
                <div className="relative w-full h-32 rounded-lg overflow-hidden border">
                  <img
                    src={blog.imageUrl}
                    alt={blog.title_fr}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Détails */}
              <div className="p-4 bg-muted rounded-lg space-y-3">
                {/* Titre */}
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                  <div className="flex-1">
                    <span className="text-xs text-muted-foreground">
                      {tBlogs("title")}:
                    </span>
                    <p className="font-medium">
                      {locale === "fr" ? blog.title_fr : blog.title_en}
                    </p>
                  </div>
                </div>

                {/* Auteur */}
                {blog.author && (
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <span className="text-xs text-muted-foreground">
                        {tBlogs("author")}:
                      </span>
                      <p className="font-medium">{blog.author.name}</p>
                    </div>
                  </div>
                )}

                {/* Date de création */}
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                  <div className="flex-1">
                    <span className="text-xs text-muted-foreground">
                      {tBlogs("createdAt")}:
                    </span>
                    <p className="font-medium">
                      {format(new Date(blog.createdAt), "PPP", {
                        locale: dateLocale,
                      })}
                    </p>
                  </div>
                </div>

                {/* Info suppression image */}
                {blog.imageUrl && isCloudinaryUrl(blog.imageUrl) && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-orange-600">
                      ⚠️ {tBlogs("imageWillBeDeleted")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* ====== Boutons d'action ====== */}
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {tBlogs("cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {tBlogs("deleting")}
              </>
            ) : (
              <>
                <AlertTriangle className="mr-2 h-4 w-4" />
                {tBlogs("confirmDelete")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}