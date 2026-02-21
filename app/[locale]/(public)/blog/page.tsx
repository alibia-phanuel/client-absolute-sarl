"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, Search } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { getBlogs } from "@/lib/blogs.api";
import { Blog } from "@/types/Blog.types";

export default function BlogPage() {
  // ← On utilise UNIQUEMENT "blog" ici (le namespace public)
  const t = useTranslations("blog");
  const locale = useLocale();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);

  const fetchBlogs = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const result = await getBlogs({ page, limit: 9 });
      setBlogs(result.data);
      setCurrentPage(result.meta.page);
      setTotalPages(result.meta.totalPages);
      setTotalBlogs(result.meta.total);
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      // Utilise t() ici aussi si tu as une clé d'erreur dans "blog"
      toast.error(
        t("errorLoading") || "Erreur lors du chargement des articles",
      );
      console.error("Erreur chargement blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter((blog) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const title = locale === "fr" ? blog.title_fr : blog.title_en;
    const content = locale === "fr" ? blog.content_fr : blog.content_en;
    return (
      title.toLowerCase().includes(query) ||
      content.toLowerCase().includes(query) ||
      (blog.author?.name?.toLowerCase().includes(query) ?? false)
    );
  });

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateString));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchBlogs(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const BlogCardSkeleton = () => (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* HERO */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative py-20 overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-white/5" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {t("hero.title")}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              {t("hero.subtitle")}
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Filtres */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={t("filters.search")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              {filteredBlogs.length} {t("filters.results")}
            </div>
          </div>
        </div>
      </section>

      {/* Liste articles */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(9)].map((_, i) => (
                  <BlogCardSkeleton key={`skel-${i}`} />
                ))}
              </div>
            ) : filteredBlogs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <p className="text-xl text-muted-foreground">
                  {t("noResults")}
                </p>
              </motion.div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredBlogs.map((blog, index) => {
                    const title =
                      locale === "fr" ? blog.title_fr : blog.title_en;
                    const content =
                      locale === "fr" ? blog.content_fr : blog.content_en;

                    return (
                      <motion.article
                        key={blog.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.08 }}
                        className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
                      >
                        <div className="relative h-48 overflow-hidden bg-muted">
                          {blog.imageUrl ? (
                            <Image
                              src={blog.imageUrl}
                              alt={title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              priority={index < 6}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 text-6xl">
                              📰
                            </div>
                          )}
                        </div>

                        <div className="p-6">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(blog.createdAt)}
                            </div>
                            {blog.author?.name && (
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {blog.author.name}
                              </div>
                            )}
                          </div>

                          <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {title}
                          </h3>

                          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                            {content}
                          </p>

                          <Link
                            href={{
                              pathname: "/blog/[id]",
                              params: { id: blog.id },
                            }}
                            className="inline-flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all"
                          >
                            {t("readMore")}
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>

                {!isLoading && totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-12">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Précédent
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} sur {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Suivant
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
