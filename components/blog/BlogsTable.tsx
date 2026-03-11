"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Blog } from "@/types/Blog.types";
import { BlogFormModal } from "./BlogFormModal";
import { DeleteBlogModal } from "./DeleteBlogModal";
import { BlogDetailsModal } from "./BlogDetailsModal";

// ============================================================================
// 📋 Props du Composant
// ============================================================================

interface BlogsTableProps {
  blogs: Blog[]; // Liste des blogs à afficher
  isLoading: boolean; // État de chargement
  onRefresh: () => void; // Callback pour rafraîchir la liste
  currentUserId?: string; // ID de l'utilisateur connecté (pour permissions)
  currentUserRole?: string; // Rôle de l'utilisateur connecté (ADMIN, EMPLOYE, CLIENT)
}

// ============================================================================
// 🎨 Composant Principal
// ============================================================================

export function BlogsTable({
  blogs,
  isLoading,
  onRefresh,
  currentUserId,
  currentUserRole,
}: BlogsTableProps) {
  // ✅ CORRIGÉ : "admin.blog" au lieu de "admin.blogs" (sans le 's')
  const tBlogs = useTranslations("admin.blog");
  const locale = useLocale();

  // États pour les modals
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Locale pour les dates
  const dateLocale = locale === "fr" ? fr : enUS;

  // ============================================================================
  // 🔐 Gestion des Permissions
  // ============================================================================

  const canEditBlog = (blog: Blog): boolean => {
    if (currentUserRole === "ADMIN") return true;
    if (currentUserRole === "EMPLOYE" && blog.authorId === currentUserId)
      return true;
    return false;
  };

  const canDeleteBlog = (blog: Blog): boolean => {
    return canEditBlog(blog);
  };

  // ============================================================================
  // 🎬 Handlers d'Actions
  // ============================================================================

  const handleEdit = (blog: Blog) => {
    setSelectedBlog(blog);
    setEditModalOpen(true);
  };

  const handleDelete = (blog: Blog) => {
    setSelectedBlog(blog);
    setDeleteModalOpen(true);
  };

  const handleViewDetails = (blog: Blog) => {
    setSelectedBlog(blog);
    setDetailsModalOpen(true);
  };

  const getAuthorInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  // ============================================================================
  // 🎨 Rendu - État de Chargement
  // ============================================================================

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  // ============================================================================
  // 🎨 Rendu - Aucun Blog
  // ============================================================================

  if (blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{tBlogs("noBlogs")}</p>
      </div>
    );
  }

  // ============================================================================
  // 🎨 Rendu - Tableau
  // ============================================================================

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">{tBlogs("image")}</TableHead>
              <TableHead>{tBlogs("titleFr")}</TableHead>
              <TableHead>{tBlogs("author")}</TableHead>
              <TableHead>{tBlogs("createdAt")}</TableHead>
              <TableHead className="text-right">{tBlogs("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.map((blog, index) => (
              <motion.tr
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group"
              >
                {/* ====== Colonne Image ====== */}
                <TableCell>
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                    {blog.imageUrl ? (
                      <img
                        src={blog.imageUrl}
                        alt={blog.title_fr}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                </TableCell>

                {/* ====== Colonne Titre ====== */}
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium">
                      {truncateText(
                        locale === "fr" ? blog.title_fr : blog.title_en,
                        50,
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {truncateText(
                        locale === "fr" ? blog.content_fr : blog.content_en,
                        80,
                      )}
                    </p>
                  </div>
                </TableCell>

                {/* ====== Colonne Auteur ====== */}
                <TableCell>
                  {blog.author && (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {getAuthorInitials(blog.author.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {blog.author.name}
                        </p>
                      </div>
                    </div>
                  )}
                </TableCell>

                {/* ====== Colonne Date ====== */}
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(blog.createdAt), "PP", {
                      locale: dateLocale,
                    })}
                  </div>
                </TableCell>

                {/* ====== Colonne Actions ====== */}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{tBlogs("actions")}</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      {/* Voir les détails (toujours disponible) */}
                      <DropdownMenuItem onClick={() => handleViewDetails(blog)}>
                        <Eye className="mr-2 h-4 w-4" />
                        {tBlogs("viewDetails")}
                      </DropdownMenuItem>

                      {/* Modifier (si autorisé) */}
                      {canEditBlog(blog) && (
                        <DropdownMenuItem onClick={() => handleEdit(blog)}>
                          <Edit className="mr-2 h-4 w-4" />
                          {tBlogs("edit")}
                        </DropdownMenuItem>
                      )}

                      {/* Supprimer (si autorisé) */}
                      {canDeleteBlog(blog) && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(blog)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {tBlogs("delete")}
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ====== Modals ====== */}

      {/* Modal de Modification */}
      <BlogFormModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedBlog(null);
        }}
        blog={selectedBlog}
        onSuccess={onRefresh}
      />

      {/* Modal de Suppression */}
      <DeleteBlogModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedBlog(null);
        }}
        blog={selectedBlog}
        onSuccess={onRefresh}
      />

      {/* Modal de Détails */}
      <BlogDetailsModal
        open={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedBlog(null);
        }}
        blog={selectedBlog}
      />
    </>
  );
}
