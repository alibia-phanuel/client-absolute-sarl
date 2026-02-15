/**
 * ❌ Modal de Rejet de Rendez-vous
 * 
 * Modal pour rejeter un rendez-vous avec une note optionnelle
 * 
 * PERMISSIONS : ADMIN et EMPLOYE
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, XCircle } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { RendezVous } from "@/types/Rendezvous.types";
import { rejectRendezVous } from "@/lib/Rendezvous.api";

interface RejectRendezVousModalProps {
  open: boolean;
  onClose: () => void;
  rendezvous: RendezVous | null;
  onSuccess: () => void;
}

export function RejectRendezVousModal({
  open,
  onClose,
  rendezvous,
  onSuccess,
}: RejectRendezVousModalProps) {
  const t = useTranslations();
  const tRdv = useTranslations("rendezvous");

  const [isLoading, setIsLoading] = useState(false);
  const [note, setNote] = useState("");

  const handleReject = async () => {
    if (!rendezvous) return;

    setIsLoading(true);
    try {
      const result = await rejectRendezVous(rendezvous.id, { note: note || undefined });
      toast.error(t(result.messageKey));
      onSuccess();
      handleClose();
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      toast.error(t(err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setNote("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-600">
            <XCircle className="h-5 w-5" />
            {tRdv("rejectTitle")}
          </DialogTitle>
          <DialogDescription>
            {tRdv("rejectDescription")}
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 py-4"
        >
          <div className="space-y-2">
            <Label htmlFor="reject-note">
              {tRdv("rejectNote")}
              <span className="text-xs text-muted-foreground ml-2">
                ({tRdv("optional")})
              </span>
            </Label>
            <Textarea
              id="reject-note"
              placeholder={tRdv("rejectNotePlaceholder")}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={isLoading}
              className="min-h-[100px] resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {tRdv("rejectNoteHint")}
            </p>
          </div>
        </motion.div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            {tRdv("cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleReject}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {tRdv("rejecting")}
              </>
            ) : (
              tRdv("confirmReject")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}