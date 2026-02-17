/**
 * 👁️ Modal de Détails d'un Message de Contact
 *
 * Affiche toutes les informations d'un message :
 * - Informations du contact (nom, email, téléphone)
 * - Sujet et message complet
 * - Statut actuel
 * - Métadonnées (IP, navigateur, etc.)
 * - Historique (dates de création, lecture, etc.)
 *
 * Utilisation :
 * ```tsx
 * <MessageDetailsModal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   message={selectedMessage}
 * />
 * ```
 */

"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  Globe,
  Eye,
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
import { Badge } from "@/components/ui/badge";
import { ContactMessage } from "@/types/ContactMessages.types";

// ============================================================================
// 📋 Props du Composant
// ============================================================================

interface MessageDetailsModalProps {
  open: boolean;
  onClose: () => void;
  message: ContactMessage | null;
}

// ============================================================================
// 🎨 Composant Principal
// ============================================================================

export function MessageDetailsModal({
  open,
  onClose,
  message,
}: MessageDetailsModalProps) {
  const tMessages = useTranslations("contactMessages");
  const locale = useLocale();

  if (!message) return null;

  const dateLocale = locale === "fr" ? fr : enUS;

  // ============================================================================
  // 🎨 Helpers
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {tMessages("messageDetails")}
          </DialogTitle>
          <DialogDescription>
            {tMessages("messageDetailsDescription")}
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6 py-4"
        >
          {/* ====== Statut Actuel ====== */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {tMessages("currentStatus")}:
            </span>
            <Badge className={getStatusColor(message.status)}>
              {tMessages(`status${message.status}`)}
            </Badge>
          </div>

          <Separator />

          {/* ====== Informations du Contact ====== */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">{tMessages("contactInfo")}</h4>

            {/* Nom */}
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  {tMessages("name")}
                </p>
                <p className="font-medium">{message.name}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-500/10 text-blue-600">
                <Mail className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  {tMessages("email")}
                </p>
                <a
                  href={`mailto:${message.email}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {message.email}
                </a>
              </div>
            </div>

            {/* Téléphone */}
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-500/10 text-green-600">
                <Phone className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  {tMessages("phone")}
                </p>
                <a
                  href={`tel:${message.phone}`}
                  className="font-medium text-green-600 hover:underline"
                >
                  {message.phone}
                </a>
              </div>
            </div>
          </div>

          <Separator />

          {/* ====== Sujet & Message ====== */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">{tMessages("messageContent")}</h4>

            {/* Sujet */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {tMessages("subject")}:
              </p>
              <Badge variant="outline">
                {tMessages(`subject${message.subject}`)}
              </Badge>
            </div>

            {/* Message */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {tMessages("message")}:
              </p>
              <div className="p-4 bg-muted rounded-lg">
                <p className="whitespace-pre-wrap text-sm">{message.message}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* ====== Notes Internes ====== */}
          {message.notes && (
            <>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">{tMessages("internalNotes")}</h4>
                <div className="p-4 bg-orange-500/5 border border-orange-200 rounded-lg">
                  <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                    {message.notes}
                  </p>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* ====== Métadonnées Techniques ====== */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">{tMessages("metadata")}</h4>

            {/* Date de création */}
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-500/10 text-blue-600">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  {tMessages("createdAt")}
                </p>
                <p className="font-medium">
                  {format(new Date(message.createdAt), "PPP 'à' p", {
                    locale: dateLocale,
                  })}
                </p>
              </div>
            </div>

            {/* Date de lecture */}
            {message.readAt && (
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-500/10 text-purple-600">
                  <Eye className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    {tMessages("readAt")}
                  </p>
                  <p className="font-medium">
                    {format(new Date(message.readAt), "PPP 'à' p", {
                      locale: dateLocale,
                    })}
                  </p>
                </div>
              </div>
            )}

            {/* Métadonnées navigateur */}
            {message.metadata && (
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-500/10 text-gray-600">
                  <Globe className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2">
                    {tMessages("technicalInfo")}
                  </p>
                  <div className="space-y-1 text-xs">
                    {message.metadata.ip && (
                      <p>
                        <span className="font-medium">IP:</span>{" "}
                        <code className="bg-muted px-1 rounded">
                          {message.metadata.ip}
                        </code>
                      </p>
                    )}
                    {message.metadata.referrer && (
                      <p>
                        <span className="font-medium">Referrer:</span>{" "}
                        <code className="bg-muted px-1 rounded">
                          {message.metadata.referrer}
                        </code>
                      </p>
                    )}
                    {message.metadata.userAgent && (
                      <p>
                        <span className="font-medium">User Agent:</span>{" "}
                        <code className="bg-muted px-1 rounded text-xs">
                          {message.metadata.userAgent}
                        </code>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ID (pour debug) */}
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                ID: <code className="bg-muted px-1 rounded">{message.id}</code>
              </p>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}