/**
 * 👁️ Modal de Détails d'un Blog
 *
 * Affiche toutes les informations d'un blog :
 * - Image
 * - Titre et contenu (FR/EN avec onglets)
 * - Informations auteur
 * - Dates de création et modification
 *
 * Utilisation :
 * ```tsx
 * <BlogDetailsModal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   blog={selectedBlog}
 * />
 * ```
 */

"use client";

import { motion } from "framer-motion";
import {
  FileText,
  User,
  Calendar,
  Languages,
  Image as ImageIcon,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Blog } from "@/types/Blog.types";

// ============================================================================
// 📋 Props du Composant
// ============================================================================

interface BlogDetailsModalProps {
  open: boolean; // Modal ouvert/fermé
  onClose: () => void; // Callback pour fermer
  blog: Blog | null; // Blog à afficher
}

// ============================================================================
// 🎨 Composant Principal
// ============================================================================

export function BlogDetailsModal({
  open,
  onClose,
  blog,
}: BlogDetailsModalProps) {
  const tBlogs = useTranslations("blogs");
  const locale = useLocale();

  // Si pas de blog, ne rien afficher
  if (!blog) return null;

  // Locale pour les dates
  const dateLocale = locale === "fr" ? fr : enUS;

  // ============================================================================
  // 🎨 Rendu du Composant
  // ============================================================================

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {tBlogs("blogDetails")}
          </DialogTitle>
          <DialogDescription>
            {tBlogs("blogDetailsDescription")}
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6 py-4"
        >
          {/* ====== Image ====== */}
          {blog.imageUrl && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ImageIcon className="h-4 w-4" />
                {tBlogs("image")}
              </div>
              <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                <img
                  src={blog.imageUrl}
                  alt={blog.title_fr}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          <Separator />

          {/* ====== Contenu Multilingue ====== */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Languages className="h-4 w-4" />
              {tBlogs("content")}
            </div>

            <Tabs defaultValue={locale} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="fr">🇫🇷 Français</TabsTrigger>
                <TabsTrigger value="en">🇬🇧 English</TabsTrigger>
              </TabsList>

              {/* ====== Contenu Français ====== */}
              <TabsContent value="fr" className="space-y-4 mt-4">
                {/* Titre FR */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {blog.title_fr}
                  </h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {blog.content_fr}
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* ====== Contenu Anglais ====== */}
              <TabsContent value="en" className="space-y-4 mt-4">
                {/* Titre EN */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {blog.title_en}
                  </h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {blog.content_en}
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <Separator />

          {/* ====== Métadonnées ====== */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">{tBlogs("metadata")}</h4>

            {/* Auteur */}
            {blog.author && (
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    {tBlogs("author")}
                  </p>
                  <p className="font-medium">{blog.author.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {blog.author.email}
                  </p>
                </div>
              </div>
            )}

            {/* Date de création */}
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-500/10 text-blue-600">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  {tBlogs("createdAt")}
                </p>
                <p className="font-medium">
                  {format(new Date(blog.createdAt), "PPP 'à' p", {
                    locale: dateLocale,
                  })}
                </p>
              </div>
            </div>

            {/* Date de modification */}
            {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-500/10 text-orange-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    {tBlogs("updatedAt")}
                  </p>
                  <p className="font-medium">
                    {format(new Date(blog.updatedAt), "PPP 'à' p", {
                      locale: dateLocale,
                    })}
                  </p>
                </div>
              </div>
            )}

            {/* ID (pour debug) */}
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                ID: <code className="bg-muted px-1 rounded">{blog.id}</code>
              </p>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
