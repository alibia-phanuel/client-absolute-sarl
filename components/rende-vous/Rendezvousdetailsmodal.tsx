/**
 * 👁️ Modal de Détails d'un Rendez-vous
 *
 * Affiche toutes les informations d'un rendez-vous :
 * - Informations client
 * - Date et heure
 * - Statut (avec badge coloré)
 * - Note/Motif
 * - Dates de création et modification
 *
 * Utilisation :
 * ```tsx
 * <RendezVousDetailsModal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   rendezvous={selectedRendezVous}
 * />
 * ```
 */

"use client";

import { motion } from "framer-motion";
import { Calendar, User, Clock, FileText, AlertCircle } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { RendezVous, RendezVousStatus } from "@/types/Rendezvous.types";

// ============================================================================
// 📋 Props du Composant
// ============================================================================

interface RendezVousDetailsModalProps {
  open: boolean;
  onClose: () => void;
  rendezvous: RendezVous | null;
}

// ============================================================================
// 🎨 Composant Principal
// ============================================================================

export function RendezVousDetailsModal({
  open,
  onClose,
  rendezvous,
}: RendezVousDetailsModalProps) {
  const tRdv = useTranslations("rendezvous");
  const locale = useLocale();

  if (!rendezvous) return null;

  const dateLocale = locale === "fr" ? fr : enUS;

  /**
   * Retourne la couleur du badge selon le statut
   */
  const getStatusBadgeVariant = (status: RendezVousStatus) => {
    switch (status) {
      case RendezVousStatus.APPROVED:
        return "default"; // Vert
      case RendezVousStatus.REJECTED:
        return "destructive"; // Rouge
      case RendezVousStatus.PENDING:
        return "secondary"; // Jaune/Orange
      default:
        return "outline";
    }
  };

  /**
   * Retourne l'icône selon le statut
   */
  const getStatusIcon = (status: RendezVousStatus) => {
    switch (status) {
      case RendezVousStatus.APPROVED:
        return "✓";
      case RendezVousStatus.REJECTED:
        return "✗";
      case RendezVousStatus.PENDING:
        return "⏳";
      default:
        return "•";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {tRdv("details")}
          </DialogTitle>
          <DialogDescription>{tRdv("detailsDescription")}</DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6 py-4"
        >
          {/* ====== Client ====== */}
          {rendezvous.client && (
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  {tRdv("client")}
                </p>
                <p className="text-base font-semibold">
                  {rendezvous.client.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {rendezvous.client.email}
                </p>
              </div>
            </div>
          )}

          <Separator />

          {/* ====== Date et Heure ====== */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-500/10 text-blue-600">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">
                  {tRdv("dateTime")}
                </p>
                <p className="text-lg font-semibold">
                  {format(new Date(rendezvous.date), "PPP", {
                    locale: dateLocale,
                  })}
                </p>
                <p className="text-base text-muted-foreground mt-1 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {format(new Date(rendezvous.date), "p", {
                    locale: dateLocale,
                  })}
                </p>
              </div>
            </div>

            {/* ====== Statut ====== */}
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-500/10 text-purple-600">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">
                  {tRdv("status")}
                </p>
                <Badge
                  variant={getStatusBadgeVariant(rendezvous.status)}
                  className="text-sm"
                >
                  {getStatusIcon(rendezvous.status)}{" "}
                  {tRdv(`statuses.${rendezvous.status.toLowerCase()}`)}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* ====== Note/Motif ====== */}
          {rendezvous.note && (
            <>
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-500/10 text-orange-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2">
                    {tRdv("note")}
                  </p>
                  <p className="text-base bg-muted p-3 rounded-lg">
                    {rendezvous.note}
                  </p>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* ====== Dates système ====== */}
          <div className="space-y-3 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>{tRdv("createdAt")} :</span>
              <span>
                {format(new Date(rendezvous.createdAt), "PPP 'à' p", {
                  locale: dateLocale,
                })}
              </span>
            </div>
            {rendezvous.updatedAt !== rendezvous.createdAt && (
              <div className="flex justify-between">
                <span>{tRdv("updatedAt")} :</span>
                <span>
                  {format(new Date(rendezvous.updatedAt), "PPP 'à' p", {
                    locale: dateLocale,
                  })}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
