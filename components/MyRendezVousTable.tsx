/**
 * 📅 Mes Rendez-vous - Tableau pour l'Espace Client
 * 
 * Affiche les rendez-vous du client avec :
 * - Date et heure
 * - Statut avec badge coloré
 * - Note/Motif
 * - Actions selon le statut
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MoreVertical, Eye, Trash2, Clock } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { toast } from "sonner";

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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { RendezVous, RendezVousStatus } from "@/types/Rendezvous.types";
import { deleteRendezVous } from "@/lib/Rendezvous.api";
import { RendezVousDetailsModal } from "@/components/rende-vous/Rendezvousdetailsmodal";

interface MyRendezVousTableProps {
  rendezvous: RendezVous[];
  isLoading: boolean;
  onRefresh: () => void;
}

export function MyRendezVousTable({
  rendezvous,
  isLoading,
  onRefresh,
}: MyRendezVousTableProps) {
  const tRdv = useTranslations("rendezvous");
  const t = useTranslations();
  const locale = useLocale();

  const [selectedRendezVous, setSelectedRendezVous] = useState<RendezVous | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const dateLocale = locale === "fr" ? fr : enUS;

  const getStatusBadgeVariant = (status: RendezVousStatus) => {
    switch (status) {
      case RendezVousStatus.APPROVED:
        return "default";
      case RendezVousStatus.REJECTED:
        return "destructive";
      case RendezVousStatus.PENDING:
        return "secondary";
      default:
        return "outline";
    }
  };

  const handleViewDetails = (rdv: RendezVous) => {
    setSelectedRendezVous(rdv);
    setDetailsModalOpen(true);
  };

  const handleDeleteClick = (rdv: RendezVous) => {
    setSelectedRendezVous(rdv);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRendezVous) return;

    setIsDeleting(true);
    try {
      const result = await deleteRendezVous(selectedRendezVous.id);
      toast.success(t(result.messageKey));
      onRefresh();
      setDeleteDialogOpen(false);
      setSelectedRendezVous(null);
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      toast.error(t(err.message));
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (rendezvous.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">{tRdv("noMyRendezVous")}</p>
        <p className="text-sm text-muted-foreground mt-2">
          {tRdv("noMyRendezVousHint")}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{tRdv("date")}</TableHead>
              <TableHead>{tRdv("status")}</TableHead>
              <TableHead>{tRdv("note")}</TableHead>
              <TableHead className="text-right">{tRdv("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rendezvous.map((rdv, index) => (
              <motion.tr
                key={rdv.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group"
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {format(new Date(rdv.date), "PP", { locale: dateLocale })}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(rdv.date), "p", { locale: dateLocale })}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(rdv.status)}>
                    {tRdv(`statuses.${rdv.status.toLowerCase()}`)}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[300px]">
                  {rdv.note ? (
                    <p className="truncate text-sm">{rdv.note}</p>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">
                      {tRdv("noNote")}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{tRdv("actions")}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleViewDetails(rdv)}>
                        <Eye className="mr-2 h-4 w-4" />
                        {tRdv("viewDetails")}
                      </DropdownMenuItem>
                      {rdv.status === RendezVousStatus.PENDING && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(rdv)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {tRdv("cancelAppointment")}
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

      <RendezVousDetailsModal
        open={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedRendezVous(null);
        }}
        rendezvous={selectedRendezVous}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tRdv("cancelAppointmentTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {tRdv("cancelAppointmentDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {selectedRendezVous && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm">
                <strong>{tRdv("date")}:</strong>{" "}
                {format(new Date(selectedRendezVous.date), "PPP 'à' p", {
                  locale: dateLocale,
                })}
              </p>
              {selectedRendezVous.note && (
                <p className="text-sm mt-1">
                  <strong>{tRdv("note")}:</strong> {selectedRendezVous.note}
                </p>
              )}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {tRdv("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? tRdv("cancelling") : tRdv("confirmCancel")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}