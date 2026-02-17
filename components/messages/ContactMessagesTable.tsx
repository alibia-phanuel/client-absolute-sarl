/**
 * 📊 Tableau des Messages de Contact
 * 
 * Composant de tableau pour afficher les messages avec :
 * - Affichage des informations principales (nom, email, sujet, statut)
 * - Actions : Voir détails, Changer statut, Supprimer
 * - Badges de statut colorés
 * - Animation d'apparition
 * - Responsive design
 * 
 * Utilisation :
 * ```tsx
 * <ContactMessagesTable
 *   messages={messages}
 *   isLoading={isLoading}
 *   onRefresh={fetchMessages}
 *   currentUserRole={user.role}
 * />
 * ```
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Mail,
  Phone,
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
import { Badge } from "@/components/ui/badge";

import { ContactMessage, ContactMessageStatus } from "@/types/ContactMessages.types";
import { MessageDetailsModal } from "./MessageDetailsModal";
import { UpdateStatusModal } from "./UpdateStatusModal";
import { DeleteMessageModal } from "./DeleteMessageModal";

// ============================================================================
// 📋 Props du Composant
// ============================================================================

interface ContactMessagesTableProps {
  messages: ContactMessage[];
  isLoading: boolean;
  onRefresh: () => void;
  currentUserRole?: string;
}

// ============================================================================
// 🎨 Composant Principal
// ============================================================================

export function ContactMessagesTable({
  messages,
  isLoading,
  onRefresh,
  currentUserRole,
}: ContactMessagesTableProps) {
  const tMessages = useTranslations("contactMessages");
  const locale = useLocale();

  // États pour les modals
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Locale pour les dates
  const dateLocale = locale === "fr" ? fr : enUS;

  // ============================================================================
  // 🎨 Helpers pour l'Affichage
  // ============================================================================

  /**
   * Retourne la couleur du badge selon le statut
   */
  const getStatusBadgeVariant = (status: ContactMessageStatus) => {
    switch (status) {
      case "NEW":
        return "default";
      case "READ":
        return "secondary";
      case "IN_PROGRESS":
        return "default";
      case "RESOLVED":
        return "default";
      case "ARCHIVED":
        return "outline";
      default:
        return "secondary";
    }
  };

  /**
   * Retourne la couleur CSS du badge selon le statut
   */
  const getStatusColor = (status: ContactMessageStatus) => {
    switch (status) {
      case "NEW":
        return "bg-blue-500/10 text-blue-700 border-blue-200";
      case "READ":
        return "bg-purple-500/10 text-purple-700 border-purple-200";
      case "IN_PROGRESS":
        return "bg-orange-500/10 text-orange-700 border-orange-200";
      case "RESOLVED":
        return "bg-green-500/10 text-green-700 border-green-200";
      case "ARCHIVED":
        return "bg-gray-500/10 text-gray-700 border-gray-200";
      default:
        return "";
    }
  };

  /**
   * Tronque le texte avec ellipsis
   */
  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  // ============================================================================
  // 🎬 Handlers d'Actions
  // ============================================================================

  const handleViewDetails = (message: ContactMessage) => {
    setSelectedMessage(message);
    setDetailsModalOpen(true);
  };

  const handleUpdateStatus = (message: ContactMessage) => {
    setSelectedMessage(message);
    setStatusModalOpen(true);
  };

  const handleDelete = (message: ContactMessage) => {
    setSelectedMessage(message);
    setDeleteModalOpen(true);
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
  // 🎨 Rendu - Aucun Message
  // ============================================================================

  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{tMessages("noMessages")}</p>
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
              <TableHead>{tMessages("name")}</TableHead>
              <TableHead>{tMessages("contact")}</TableHead>
              <TableHead>{tMessages("subject")}</TableHead>
              <TableHead>{tMessages("status")}</TableHead>
              <TableHead>{tMessages("date")}</TableHead>
              <TableHead className="text-right">{tMessages("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((message, index) => (
              <motion.tr
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group"
              >
                {/* ====== Colonne Nom ====== */}
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium">{message.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {truncateText(message.message, 50)}
                    </p>
                  </div>
                </TableCell>

                {/* ====== Colonne Contact ====== */}
                <TableCell>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs">{message.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs">{message.phone}</span>
                    </div>
                  </div>
                </TableCell>

                {/* ====== Colonne Sujet ====== */}
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {tMessages(`subject${message.subject}`)}
                  </Badge>
                </TableCell>

                {/* ====== Colonne Statut ====== */}
                <TableCell>
                  <Badge 
                    variant={getStatusBadgeVariant(message.status)}
                    className={getStatusColor(message.status)}
                  >
                    {tMessages(`status${message.status}`)}
                  </Badge>
                </TableCell>

                {/* ====== Colonne Date ====== */}
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(message.createdAt), "PP", {
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
                      <DropdownMenuLabel>{tMessages("actions")}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      
                      {/* Voir les détails */}
                      <DropdownMenuItem onClick={() => handleViewDetails(message)}>
                        <Eye className="mr-2 h-4 w-4" />
                        {tMessages("viewDetails")}
                      </DropdownMenuItem>

                      {/* Changer le statut */}
                      <DropdownMenuItem onClick={() => handleUpdateStatus(message)}>
                        <Edit className="mr-2 h-4 w-4" />
                        {tMessages("updateStatus")}
                      </DropdownMenuItem>

                      {/* Supprimer (Admin uniquement) */}
                      {currentUserRole === "ADMIN" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(message)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {tMessages("delete")}
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
      
      {/* Modal de Détails */}
      <MessageDetailsModal
        open={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedMessage(null);
        }}
        message={selectedMessage}
      />

      {/* Modal de Changement de Statut */}
      <UpdateStatusModal
        open={statusModalOpen}
        onClose={() => {
          setStatusModalOpen(false);
          setSelectedMessage(null);
        }}
        message={selectedMessage}
        onSuccess={onRefresh}
      />

      {/* Modal de Suppression */}
      <DeleteMessageModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedMessage(null);
        }}
        message={selectedMessage}
        onSuccess={onRefresh}
      />
    </>
  );
}