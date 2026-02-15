/**
 * 📊 Tableau des Rendez-vous (Admin/Employé)
 * 
 * Tableau pour afficher et gérer les rendez-vous avec :
 * - Filtres par statut
 * - Actions : Voir, Approuver, Rejeter, Supprimer
 * - Badges colorés selon le statut
 * - Animation d'apparition
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  Calendar,
  User,
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

import { RendezVous, RendezVousStatus } from "@/types/Rendezvous.types";
import { RendezVousDetailsModal } from "@/components/rende-vous/Rendezvousdetailsmodal";
import { DeleteRendezVousModal } from "@/components/rende-vous/Deleterendezvousmodal";
import { RejectRendezVousModal } from "@/components/rende-vous/Rejectrendezvousmodal";
import { approveRendezVous } from "@/lib/Rendezvous.api";
import { useTranslations as useT } from "next-intl";

interface RendezVousTableProps {
  rendezvous: RendezVous[];
  isLoading: boolean;
  onRefresh: () => void;
  currentUserRole?: string;
}

export function RendezVousTable({
  rendezvous,
  isLoading,
  onRefresh,
  currentUserRole,
}: RendezVousTableProps) {
  const tRdv = useTranslations("rendezvous");
  const t = useT();
  const locale = useLocale();

  const [selectedRendezVous, setSelectedRendezVous] = useState<RendezVous | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);

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

  const handleDelete = (rdv: RendezVous) => {
    setSelectedRendezVous(rdv);
    setDeleteModalOpen(true);
  };

  const handleReject = (rdv: RendezVous) => {
    setSelectedRendezVous(rdv);
    setRejectModalOpen(true);
  };

  const handleApprove = async (rdv: RendezVous) => {
    setApprovingId(rdv.id);
    try {
      const result = await approveRendezVous(rdv.id);
      toast.success(t(result.messageKey));
      onRefresh();
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      toast.error(t(err.message));
    } finally {
      setApprovingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (rendezvous.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{tRdv("noRendezVous")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{tRdv("client")}</TableHead>
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
                  {rdv.client && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{rdv.client.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {rdv.client.email}
                        </p>
                      </div>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {format(new Date(rdv.date), "PP", { locale: dateLocale })}
                      </p>
                      <p className="text-xs text-muted-foreground">
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
                <TableCell className="max-w-[200px]">
                  {rdv.note ? (
                    <p className="truncate text-sm text-muted-foreground">
                      {rdv.note}
                    </p>
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
                        <MoreHorizontal className="h-4 w-4" />
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
                          <DropdownMenuItem
                            onClick={() => handleApprove(rdv)}
                            disabled={approvingId === rdv.id}
                            className="text-green-600"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            {approvingId === rdv.id ? tRdv("approving") : tRdv("approve")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleReject(rdv)}
                            className="text-orange-600"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            {tRdv("reject")}
                          </DropdownMenuItem>
                        </>
                      )}
                      {currentUserRole === "ADMIN" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(rdv)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {tRdv("delete")}
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

      <DeleteRendezVousModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedRendezVous(null);
        }}
        rendezvous={selectedRendezVous}
        onSuccess={onRefresh}
      />

      <RejectRendezVousModal
        open={rejectModalOpen}
        onClose={() => {
          setRejectModalOpen(false);
          setSelectedRendezVous(null);
        }}
        rendezvous={selectedRendezVous}
        onSuccess={onRefresh}
      />
    </>
  );
}