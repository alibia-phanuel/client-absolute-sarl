/**
 * 🗑️ Modal de Suppression d'un Message de Contact
 * 
 * Modal de confirmation pour supprimer un message avec :
 * - Affichage des informations du message
 * - Alerte de suppression définitive
 * - Réservé aux ADMIN uniquement
 * 
 * Utilisation :
 * ```tsx
 * <DeleteMessageModal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   message={selectedMessage}
 *   onSuccess={refreshMessages}
 * />
 * ```
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, AlertTriangle, MessageSquare, Mail, Phone } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

import { ContactMessage } from "@/types/ContactMessages.types";
import { deleteContactMessage } from "@/lib/contact.api";

// ============================================================================
// 📋 Props du Composant
// ============================================================================

interface DeleteMessageModalProps {
  open: boolean;
  onClose: () => void;
  message: ContactMessage | null;
  onSuccess: () => void;
}

// ============================================================================
// 🎨 Composant Principal
// ============================================================================

export function DeleteMessageModal({
  open,
  onClose,
  message,
  onSuccess,
}: DeleteMessageModalProps) {
  const t = useTranslations();
  const tMessages = useTranslations("contactMessages");
  const locale = useLocale();

  const [isLoading, setIsLoading] = useState(false);

  const dateLocale = locale === "fr" ? fr : enUS;

  // ============================================================================
  // 🗑️ Suppression du Message
  // ============================================================================

  const handleDelete = async () => {
    if (!message) return;

    setIsLoading(true);
    try {
      const result = await deleteContactMessage(message.id);
      
      toast.success(t(result.messageKey));
      onSuccess();
      onClose();
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      toast.error(t(err.message));
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // 🎨 Helper pour la couleur du statut
  // ============================================================================

  const getStatusColor = (status: string) => {
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

  // ============================================================================
  // 🎨 Rendu
  // ============================================================================

  if (!message) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            {tMessages("deleteMessage")}
          </DialogTitle>
          <DialogDescription>
            {tMessages("deleteMessageDescription")}
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Alerte de suppression */}
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {tMessages("deleteWarning")}
            </AlertDescription>
          </Alert>

          {/* Informations du message */}
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg space-y-3">
              {/* Statut */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {tMessages("status")}:
                </span>
                <Badge className={getStatusColor(message.status)}>
                  {tMessages(`status${message.status}`)}
                </Badge>
              </div>

              {/* Sujet */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {tMessages("subject")}:
                </span>
                <Badge variant="outline">
                  {tMessages(`subject${message.subject}`)}
                </Badge>
              </div>

              {/* Nom */}
              <div className="flex items-start gap-2 pt-2 border-t">
                <MessageSquare className="h-4 w-4 text-muted-foreground mt-1" />
                <div className="flex-1">
                  <span className="text-xs text-muted-foreground">
                    {tMessages("name")}:
                  </span>
                  <p className="font-medium">{message.name}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-muted-foreground mt-1" />
                <div className="flex-1">
                  <span className="text-xs text-muted-foreground">
                    {tMessages("email")}:
                  </span>
                  <p className="font-medium text-sm">{message.email}</p>
                </div>
              </div>

              {/* Téléphone */}
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-muted-foreground mt-1" />
                <div className="flex-1">
                  <span className="text-xs text-muted-foreground">
                    {tMessages("phone")}:
                  </span>
                  <p className="font-medium text-sm">{message.phone}</p>
                </div>
              </div>

              {/* Message (extrait) */}
              <div className="pt-2 border-t">
                <span className="text-xs text-muted-foreground">
                  {tMessages("message")}:
                </span>
                <p className="text-sm text-muted-foreground mt-1">
                  {message.message.length > 100
                    ? `${message.message.slice(0, 100)}...`
                    : message.message}
                </p>
              </div>

              {/* Date */}
              <div className="pt-2 border-t">
                <span className="text-xs text-muted-foreground">
                  {tMessages("createdAt")}:
                </span>
                <p className="text-sm font-medium">
                  {format(new Date(message.createdAt), "PPP", {
                    locale: dateLocale,
                  })}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Boutons d'action */}
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {tMessages("cancel")}
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
                {tMessages("deleting")}
              </>
            ) : (
              <>
                <AlertTriangle className="mr-2 h-4 w-4" />
                {tMessages("confirmDelete")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}