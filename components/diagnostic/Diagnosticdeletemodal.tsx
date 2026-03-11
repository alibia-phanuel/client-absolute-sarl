"use client";

/**
 * 🗑️ Modal Suppression — Diagnostic
 * Même structure que DeleteMessageModal
 */

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Diagnostic } from "@/types/Diagnostic.types";
import { deleteDiagnostic } from "@/lib/diagnostic.admin.api";

interface Props {
  open: boolean;
  onClose: () => void;
  diagnostic: Diagnostic | null;
  onSuccess: () => void;
}

export function DiagnosticDeleteModal({
  open,
  onClose,
  diagnostic,
  onSuccess,
}: Props) {
  const tD = useTranslations("diagnostics");
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!diagnostic) return;
    setIsLoading(true);
    try {
      await deleteDiagnostic(diagnostic.id);
      toast.success(tD("deleteSuccess"));
      onSuccess();
      onClose();
    } catch (error) {
      const err = error instanceof Error ? error.message : tD("deleteError");
      toast.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            {tD("deleteTitle")}
          </DialogTitle>
          <DialogDescription className="space-y-2">
            <span>{tD("deleteConfirm")}</span>
            {diagnostic && (
              <span className="block font-semibold text-foreground">
                {diagnostic.firstName} {diagnostic.lastName} —{" "}
                {diagnostic.email}
              </span>
            )}
            <span className="block text-red-500 text-sm">
              {tD("deleteWarning")}
            </span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {tD("cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {tD("deleting")}
              </>
            ) : (
              tD("confirmDelete")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
