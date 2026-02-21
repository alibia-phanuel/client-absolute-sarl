"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  User,
  ArrowLeft,
  Clock,
  Share2,
  Loader2,
  Mail,
} from "lucide-react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// ✅ Import de l'API et des types
import { getBlogById } from "@/lib/blogs.api";
import { Blog } from "@/types/Blog.types";

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("blog");

  const id = params.id as string;

  // ============================================================================
  // 🔄 États
  // ============================================================================
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ============================================================================
  // 📡 Chargement du blog depuis l'API
  // ============================================================================
  useEffect(() => {
    const fetchBlog = async () => {
      setIsLoading(true);
      try {
        const result = await getBlogById(id);
        setBlog(result.data);
      } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));
        toast.error(t(err.message) || "Erreur lors du chargement de l'article");
        console.error("Erreur chargement blog:", error);

        // Redirection vers la liste si blog introuvable
        setTimeout(() => router.push(`/${locale}/blog`), 2000);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id, locale, router, t]);

  // ============================================================================
  // 🛠️ Helpers
  // ============================================================================

  /**
   * Formater la date selon la locale
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  /**
   * Calculer le temps de lecture estimé (200 mots/min)
   */
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
  };

  /**
   * Obtenir les initiales de l'auteur
   */
  const getAuthorInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  /**
   * Partager l'article
   */
  const handleShare = async () => {
    const url = window.location.href;
    const title = locale === "fr" ? blog?.title_fr : blog?.title_en;

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url,
        });
        toast.success("Article partagé !");
      } catch (error) {
        console.log("Partage annulé");
      }
    } else {
      // Fallback : copier le lien
      navigator.clipboard.writeText(url);
      toast.success("Lien copié dans le presse-papier !");
    }
  };

  // ============================================================================
  // 🎨 RENDU - Loading
  // ============================================================================
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement de l&apos;article...</p>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 🎨 RENDU - Blog introuvable
  // ============================================================================
  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Article introuvable</h2>
          <p className="text-muted-foreground mb-6">
            Cet article n&apos;existe pas ou a été supprimé.
          </p>
          <Button onClick={() => router.push(`/${locale}/blog`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux articles
          </Button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 🎨 RENDU - Contenu du blog
  // ============================================================================

  const title = locale === "fr" ? blog.title_fr : blog.title_en;
  const content = locale === "fr" ? blog.content_fr : blog.content_en;
  const readingTime = calculateReadingTime(content);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* ====== HERO SECTION AVEC IMAGE ====== */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative h-[60vh] overflow-hidden"
      >
        {/* Image de fond */}
        {blog.imageUrl ? (
          <Image
            src={blog.imageUrl}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Bouton retour */}
        <div className="absolute top-8 left-4 md:left-8 z-10">
          <Button
            variant="secondary"
            onClick={() => router.push(`/${locale}/blog`)}
            className="backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>

        {/* Contenu du hero */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-12 md:pb-16">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-4xl"
            >
              {/* Métadonnées */}
              <div className="flex flex-wrap items-center gap-4 text-white/90 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{formatDate(blog.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{readingTime} min de lecture</span>
                </div>
                {blog.author && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{blog.author.name}</span>
                  </div>
                )}
              </div>

              {/* Titre */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {title}
              </h1>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ====== CONTENU PRINCIPAL ====== */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-[1fr_300px] gap-12">
              {/* ====== ARTICLE ====== */}
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-lg"
              >
                {/* Contenu de l'article */}
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-lg leading-relaxed whitespace-pre-wrap">
                    {content}
                  </p>
                </div>

                <Separator className="my-8" />

                {/* Informations de l'auteur */}
                {blog.author && (
                  <div className="flex items-center gap-4 p-6 bg-muted/50 rounded-xl">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                        {getAuthorInitials(blog.author.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{blog.author.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Mail className="w-4 h-4" />
                        {blog.author.email}
                      </div>
                    </div>
                  </div>
                )}
              </motion.article>

              {/* ====== SIDEBAR ====== */}
              <motion.aside
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-6"
              >
                {/* Bouton Partager */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-lg sticky top-24">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-primary" />
                    Partager cet article
                  </h3>
                  <Button
                    onClick={handleShare}
                    className="w-full"
                    variant="outline"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Partager
                  </Button>
                </div>

                {/* Informations de publication */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
                  <h3 className="font-semibold mb-4">Informations</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Publié le :</span>
                      <p className="font-medium">{formatDate(blog.createdAt)}</p>
                    </div>
                    {blog.updatedAt !== blog.createdAt && (
                      <div>
                        <span className="text-muted-foreground">
                          Mis à jour le :
                        </span>
                        <p className="font-medium">
                          {formatDate(blog.updatedAt)}
                        </p>
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground">
                        Temps de lecture :
                      </span>
                      <p className="font-medium">{readingTime} minutes</p>
                    </div>
                  </div>
                </div>
              </motion.aside>
            </div>

            {/* ====== CTA RETOUR ====== */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12 text-center"
            >
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push(`/${locale}/blog`)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voir tous les articles
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}