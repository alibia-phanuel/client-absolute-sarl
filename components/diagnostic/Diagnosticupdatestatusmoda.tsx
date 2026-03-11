"use client";

/**
 * ✏️ Modal Changement de Statut — Diagnostic
 * Même structure que UpdateStatusModal (messages)
 */

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Diagnostic, DiagnosticStatus } from "@/types/Diagnostic.types";
import { updateDiagnosticStatus } from "@/lib/diagnostic.admin.api";

interface Props {
  open: boolean;
  onClose: () => void;
  diagnostic: Diagnostic | null;
  onSuccess: () => void;
}

const STATUSES: DiagnosticStatus[] = [
  "NEW",
  "READ",
  "IN_PROGRESS",
  "TREATED",
  "RESOLVED",
  "ARCHIVED",
];

export function DiagnosticUpdateStatusModal({
  open,
  onClose,
  diagnostic,
  onSuccess,
}: Props) {
  const tD = useTranslations("diagnostics");

  const [status, setStatus] = useState<DiagnosticStatus | "">(
    diagnostic?.status ?? "",
  );
  const [internalNotes, setInternalNotes] = useState(
    diagnostic?.internalNotes ?? "",
  );
  const [isLoading, setIsLoading] = useState(false);

  // Reset quand un nouveau diagnostic est ouvert
  const handleOpenChange = (open: boolean) => {
    if (open && diagnostic) {
      setStatus(diagnostic.status);
      setInternalNotes(diagnostic.internalNotes ?? "");
    }
    if (!open) onClose();
  };

  const handleSubmit = async () => {
    if (!diagnostic || !status) return;
    setIsLoading(true);
    try {
      await updateDiagnosticStatus(diagnostic.id, {
        status,
        internalNotes: internalNotes.trim() || undefined,
      });
      toast.success(tD("statusUpdated"));
      onSuccess();
      onClose();
    } catch (error) {
      const err = error instanceof Error ? error.message : tD("updateError");
      toast.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{tD("updateStatusTitle")}</DialogTitle>
          <DialogDescription>
            {diagnostic && (
              <span className="font-medium">
                {diagnostic.firstName} {diagnostic.lastName}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Sélecteur de statut */}
          <div className="space-y-2">
            <Label>{tD("newStatus")}</Label>
            <Select
              value={status}
              onValueChange={(v: DiagnosticStatus) => setStatus(v)}
            >
              <SelectTrigger>
                <SelectValue placeholder={tD("selectStatus")} />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {tD(`status${s}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes internes */}
          <div className="space-y-2">
            <Label>
              {tD("internalNotes")}{" "}
              <span className="text-muted-foreground text-xs">
                ({tD("optional")})
              </span>
            </Label>
            <Textarea
              placeholder={tD("internalNotesPlaceholder")}
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {tD("cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !status}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {tD("saving")}
              </>
            ) : (
              tD("saveStatus")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
