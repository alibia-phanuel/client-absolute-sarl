/**
 * 🗑️ Modal de Suppression de Rendez-vous
 *
 * Modal de confirmation pour supprimer un rendez-vous
 *
 * PERMISSIONS : ADMIN uniquement
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, AlertTriangle, Calendar, User } from "lucide-react";
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

import { RendezVous } from "@/types/Rendezvous.types";
import { deleteRendezVous } from "@/lib/Rendezvous.api";

interface DeleteRendezVousModalProps {
  open: boolean;
  onClose: () => void;
  rendezvous: RendezVous | null;
  onSuccess: () => void;
}

export function DeleteRendezVousModal({
  open,
  onClose,
  rendezvous,
  onSuccess,
}: DeleteRendezVousModalProps) {
  const t = useTranslations();
  const tRdv = useTranslations("rendezvous");
  const locale = useLocale();

  const [isLoading, setIsLoading] = useState(false);

  const dateLocale = locale === "fr" ? fr : enUS;

  const handleDelete = async () => {
    if (!rendezvous) return;

    setIsLoading(true);
    try {
      const result = await deleteRendezVous(rendezvous.id);
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            {tRdv("deleteTitle")}
          </DialogTitle>
          <DialogDescription>{tRdv("deleteDescription")}</DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{tRdv("deleteWarning")}</AlertDescription>
          </Alert>

          {rendezvous && (
            <div className="p-4 bg-muted rounded-lg space-y-3">
              {rendezvous.client && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-sm text-muted-foreground">
                      {tRdv("client")}:
                    </span>
                    <p className="font-medium">{rendezvous.client.name}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-sm text-muted-foreground">
                    {tRdv("date")}:
                  </span>
                  <p className="font-medium">
                    {format(new Date(rendezvous.date), "PPP 'à' p", {
                      locale: dateLocale,
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {tRdv("cancel")}
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
                {tRdv("deleting")}
              </>
            ) : (
              tRdv("confirmDelete")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
