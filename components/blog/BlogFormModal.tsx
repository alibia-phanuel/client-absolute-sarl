/**
 * 📝 Modal de Formulaire Blog (Ajout & Édition)
 *
 * Modal réutilisable pour :
 * - Créer un nouveau blog
 * - Modifier un blog existant
 *
 * Fonctionnalités :
 * - Upload d'image vers Cloudinary
 * - Validation avec Zod
 * - Support multilingue (FR/EN)
 * - Gestion d'erreurs
 * - Loading states
 */

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Loader2, FileText, Languages } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Blog } from "@/types/Blog.types";
import { createBlog, updateBlog } from "@/lib/blogs.api";
import { ImageUpload } from "../ImageUpload";

// ============================================================================
// 📋 Props du Composant
// ============================================================================

interface BlogFormModalProps {
  open: boolean;
  onClose: () => void;
  blog?: Blog | null;
  onSuccess: () => void;
}

// ============================================================================
// 🎨 Composant Principal
// ============================================================================

export function BlogFormModal({
  open,
  onClose,
  blog,
  onSuccess,
}: BlogFormModalProps) {
  const t = useTranslations();
  // ✅ CORRIGÉ : "admin.blog" au lieu de "admin.blogs" (sans le 's')
  const tBlogs = useTranslations("admin.blog");
  const V = useTranslations("validation");

  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const isEditMode = !!blog;

  // ============================================================================
  // 📝 Validation avec Zod
  // ============================================================================

  const blogSchema = z.object({
    title_fr: z
      .string()
      .min(1, V("titleRequired"))
      .min(3, V("titleMin"))
      .max(200, V("titleMax")),
    title_en: z
      .string()
      .min(1, V("titleRequired"))
      .min(3, V("titleMin"))
      .max(200, V("titleMax")),
    content_fr: z
      .string()
      .min(1, V("contentRequired"))
      .min(50, V("contentMin")),
    content_en: z
      .string()
      .min(1, V("contentRequired"))
      .min(50, V("contentMin")),
  });

  type BlogFormData = z.infer<typeof blogSchema>;

  // ============================================================================
  // 🎯 Initialisation du Formulaire
  // ============================================================================

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title_fr: "",
      title_en: "",
      content_fr: "",
      content_en: "",
    },
  });

  useEffect(() => {
    if (blog) {
      form.reset({
        title_fr: blog.title_fr,
        title_en: blog.title_en,
        content_fr: blog.content_fr,
        content_en: blog.content_en,
      });
      setImageUrl(blog.imageUrl);
    } else {
      form.reset({
        title_fr: "",
        title_en: "",
        content_fr: "",
        content_en: "",
      });
      setImageUrl(null);
    }
  }, [blog, form]);

  // ============================================================================
  // 💾 Soumission du Formulaire
  // ============================================================================

  const onSubmit = async (data: BlogFormData) => {
    setIsLoading(true);
    try {
      if (isEditMode && blog) {
        const result = await updateBlog(blog.id, { ...data, imageUrl });
        toast.success(t(result.messageKey));
      } else {
        const result = await createBlog({ ...data, imageUrl });
        toast.success(t(result.messageKey));
      }

      onSuccess();
      handleClose();
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      toast.error(t(err.message));
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // 🚪 Fermeture du Modal
  // ============================================================================

  const handleClose = () => {
    form.reset();
    setImageUrl(null);
    onClose();
  };

  // ============================================================================
  // 🎨 Rendu du Composant
  // ============================================================================

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {isEditMode ? tBlogs("editBlog") : tBlogs("addBlog")}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? tBlogs("editBlogDescription")
              : tBlogs("addBlogDescription")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* ====== Upload d'Image ====== */}
            <ImageUpload
              imageUrl={imageUrl}
              onImageUpload={setImageUrl}
              onImageRemove={() => setImageUrl(null)}
              disabled={isLoading}
            />

            {/* ====== Onglets Français / Anglais ====== */}
            <Tabs defaultValue="fr" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="fr" className="flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  Français
                </TabsTrigger>
                <TabsTrigger value="en" className="flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  English
                </TabsTrigger>
              </TabsList>

              {/* ====== Contenu Français ====== */}
              <TabsContent value="fr" className="space-y-4 mt-4">
                {/* Titre FR */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FormField
                    control={form.control}
                    name="title_fr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{tBlogs("titleFr")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={tBlogs("titleFrPlaceholder")}
                            disabled={isLoading}
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Contenu FR */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <FormField
                    control={form.control}
                    name="content_fr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{tBlogs("contentFr")}</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder={tBlogs("contentFrPlaceholder")}
                            disabled={isLoading}
                            className="min-h-[200px] resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              </TabsContent>

              {/* ====== Contenu Anglais ====== */}
              <TabsContent value="en" className="space-y-4 mt-4">
                {/* Titre EN */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FormField
                    control={form.control}
                    name="title_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{tBlogs("titleEn")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={tBlogs("titleEnPlaceholder")}
                            disabled={isLoading}
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Contenu EN */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <FormField
                    control={form.control}
                    name="content_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{tBlogs("contentEn")}</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder={tBlogs("contentEnPlaceholder")}
                            disabled={isLoading}
                            className="min-h-[200px] resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              </TabsContent>
            </Tabs>

            {/* ====== Boutons d'Action ====== */}
            <DialogFooter className="gap-2 sm:gap-0 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                {tBlogs("cancel")}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {tBlogs("saving")}
                  </>
                ) : (
                  tBlogs("save")
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}