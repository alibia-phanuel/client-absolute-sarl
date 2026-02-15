/**
 * 📰 Page de Gestion des Blogs
 * 
 * Page principale pour la gestion des blogs avec :
 * - Dashboard avec statistiques (total blogs, par auteur, etc.)
 * - Filtres et recherche
 * - Bouton d'ajout de blog
 * - Tableau des blogs avec actions
 * - Pagination
 * 
 * Cette page est réservée aux ADMIN et EMPLOYE (via AdminGuard)
 */

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Filter, RefreshCw, Search, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Blog } from "@/types/Blog.types";
import { getBlogs } from "@/lib/blogs.api";
import { BlogsTable } from "@/components/blog/BlogsTable";
import { BlogFormModal } from "@/components/blog/BlogFormModal";
import { useAuthStore } from "@/store/authStore";

// ============================================================================
// 🎨 Composant Principal
// ============================================================================

export default function BlogsPage() {
  const t = useTranslations();
  const tBlogs = useTranslations("blogs");

  // Récupérer l'utilisateur connecté pour les permissions
  const { user } = useAuthStore();

  // États
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);

  // ============================================================================
  // 📡 Chargement des Blogs
  // ============================================================================

  /**
   * Charge les blogs depuis l'API
   * Peut être appelée avec ou sans filtres
   */
  const fetchBlogs = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const result = await getBlogs({
        page,
        limit: 10, // 10 blogs par page
      });

      setBlogs(result.data);
      setFilteredBlogs(result.data);
      setCurrentPage(result.meta.page);
      setTotalPages(result.meta.totalPages);
      setTotalBlogs(result.meta.total);
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      toast.error(t(err.message));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Charger les blogs au montage du composant
   */
  useEffect(() => {
    fetchBlogs();
  }, []);

  // ============================================================================
  // 🔍 Recherche Locale
  // ============================================================================

  /**
   * Filtre les blogs localement par recherche
   * (La recherche est côté client pour une réactivité instantanée)
   */
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredBlogs(blogs);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = blogs.filter(
      (blog) =>
        blog.title_fr.toLowerCase().includes(query) ||
        blog.title_en.toLowerCase().includes(query) ||
        blog.content_fr.toLowerCase().includes(query) ||
        blog.content_en.toLowerCase().includes(query) ||
        blog.author?.name.toLowerCase().includes(query)
    );

    setFilteredBlogs(filtered);
  }, [searchQuery, blogs]);

  // ============================================================================
  // 🎬 Handlers
  // ============================================================================

  /**
   * Rafraîchit la liste des blogs
   */
  const handleRefresh = () => {
    fetchBlogs(currentPage);
    toast.success(tBlogs("refreshed"));
  };

  /**
   * Change de page
   */
  const handlePageChange = (newPage: number) => {
    fetchBlogs(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ============================================================================
  // 📊 Statistiques
  // ============================================================================

  /**
   * Calcule les statistiques pour le dashboard
   */
  const stats = {
    total: totalBlogs,
    myBlogs: user ? blogs.filter((b) => b.authorId === user.id).length : 0,
    withImages: blogs.filter((b) => b.imageUrl).length,
    recent: blogs.filter((b) => {
      const daysDiff = Math.floor(
        (Date.now() - new Date(b.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysDiff <= 7;
    }).length,
  };

  // ============================================================================
  // 🎨 Rendu du Composant
  // ============================================================================

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* ====== Header ====== */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {tBlogs("title")}
            </h1>
            <p className="text-muted-foreground">{tBlogs("description")}</p>
          </div>
        </div>
      </motion.div>

      {/* ====== Dashboard - Cartes de Statistiques ====== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-4 md:grid-cols-4 mb-8"
      >
        {/* Total des blogs */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {tBlogs("totalBlogs")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        {/* Mes blogs (pour EMPLOYE) */}
        {user?.role === "EMPLOYE" && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {tBlogs("myBlogs")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.myBlogs}</div>
            </CardContent>
          </Card>
        )}

        {/* Avec images */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {tBlogs("withImages")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.withImages}</div>
          </CardContent>
        </Card>

        {/* Récents (7 derniers jours) */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {tBlogs("recent")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recent}</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ====== Filtres et Actions ====== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              {tBlogs("filters")}
            </CardTitle>
            <CardDescription>{tBlogs("filtersDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Recherche */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={tBlogs("searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Bouton Ajouter */}
              <Button
                onClick={() => setAddModalOpen(true)}
                className="w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                {tBlogs("addBlog")}
              </Button>

              {/* Bouton Rafraîchir */}
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                {tBlogs("refresh")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ====== Tableau des Blogs ====== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                {tBlogs("blogsList")} ({filteredBlogs.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BlogsTable
              blogs={filteredBlogs}
              isLoading={isLoading}
              onRefresh={fetchBlogs}
              currentUserId={user?.id}
              currentUserRole={user?.role}
            />

            {/* Pagination (si plus d'une page) */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                >
                  Précédent
                </Button>
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} sur {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isLoading}
                >
                  Suivant
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ====== Modal d'Ajout de Blog ====== */}
      <BlogFormModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={() => fetchBlogs(currentPage)}
      />
    </div>
  );
}