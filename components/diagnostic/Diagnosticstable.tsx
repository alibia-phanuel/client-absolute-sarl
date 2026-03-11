"use client";

/**
 * 📊 Tableau des Diagnostics
 * Structure identique à ContactMessagesTable
 */

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
  MapPin,
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
import {
  Diagnostic,
  DiagnosticStatus,
  DiagnosticDestination,
} from "@/types/Diagnostic.types";

import {DiagnosticDetailsModal} from "../diagnostic/Diagnosticdetailsmodal";
import {DiagnosticUpdateStatusModal} from "../diagnostic/Diagnosticupdatestatusmoda";
import { DiagnosticDeleteModal } from "../diagnostic/Diagnosticdeletemodal";
interface DiagnosticsTableProps {
  diagnostics: Diagnostic[];
  isLoading: boolean;
  onRefresh: () => void;
  currentUserRole?: string;
}

const STATUS_COLORS: Record<DiagnosticStatus, string> = {
  NEW: "bg-blue-500/10 text-blue-700 border-blue-200",
  READ: "bg-purple-500/10 text-purple-700 border-purple-200",
  IN_PROGRESS: "bg-orange-500/10 text-orange-700 border-orange-200",
  TREATED: "bg-indigo-500/10 text-indigo-700 border-indigo-200",
  RESOLVED: "bg-green-500/10 text-green-700 border-green-200",
  ARCHIVED: "bg-gray-500/10 text-gray-600 border-gray-200",
};

const DEST_FLAGS: Record<DiagnosticDestination, string> = {
  CANADA: "🇨🇦",
  BELGIUM: "🇧🇪",
  FRANCE: "🇫🇷",
  OTHER: "🌍",
};

export function DiagnosticsTable({
  diagnostics,
  isLoading,
  onRefresh,
  currentUserRole,
}: DiagnosticsTableProps) {
  const tD = useTranslations("diagnostics");
  const locale = useLocale();
  const dateLocale = locale === "fr" ? fr : enUS;

  const [selected, setSelected] = useState<Diagnostic | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleViewDetails = (d: Diagnostic) => {
    setSelected(d);
    setDetailsOpen(true);
  };
  const handleUpdateStatus = (d: Diagnostic) => {
    setSelected(d);
    setStatusOpen(true);
  };
  const handleDelete = (d: Diagnostic) => {
    setSelected(d);
    setDeleteOpen(true);
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  // ── Empty ──────────────────────────────────────────────────────────────────
  if (diagnostics.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{tD("noDiagnostics")}</p>
      </div>
    );
  }

  // ── Table ──────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{tD("colCandidate")}</TableHead>
              <TableHead>{tD("colContact")}</TableHead>
              <TableHead>{tD("colDestination")}</TableHead>
              <TableHead>{tD("colLevel")}</TableHead>
              <TableHead>{tD("colStatus")}</TableHead>
              <TableHead>{tD("colDate")}</TableHead>
              <TableHead className="text-right">{tD("colActions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {diagnostics.map((d, index) => (
              <motion.tr
                key={d.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className="group"
              >
                {/* Candidat */}
                <TableCell>
                  <div className="space-y-0.5">
                    <p className="font-medium">
                      {d.firstName} {d.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {d.residenceCountry} · {d.nationality}
                    </p>
                  </div>
                </TableCell>

                {/* Contact */}
                <TableCell>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs">{d.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs">{d.whatsapp}</span>
                    </div>
                  </div>
                </TableCell>

                {/* Destination */}
                <TableCell>
                  <Badge variant="outline" className="text-xs gap-1">
                    <span>{DEST_FLAGS[d.destination]}</span>
                    {tD(`dest${d.destination}`)}
                  </Badge>
                </TableCell>

                {/* Niveau */}
                <TableCell>
                  <div className="text-sm">
                    <p className="font-medium capitalize">{d.targetLevel}</p>
                    <p className="text-xs text-muted-foreground">
                      {d.targetIntake}
                    </p>
                  </div>
                </TableCell>

                {/* Statut */}
                <TableCell>
                  <Badge variant="outline" className={STATUS_COLORS[d.status]}>
                    {tD(`status${d.status}`)}
                  </Badge>
                </TableCell>

                {/* Date */}
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(d.createdAt), "PP", {
                      locale: dateLocale,
                    })}
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <span className="sr-only">Menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{tD("colActions")}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleViewDetails(d)}>
                        <Eye className="mr-2 h-4 w-4" />
                        {tD("viewDetails")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(d)}>
                        <Edit className="mr-2 h-4 w-4" />
                        {tD("updateStatus")}
                      </DropdownMenuItem>
                      {currentUserRole === "ADMIN" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(d)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {tD("delete")}
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

      {/* Modals */}
      <DiagnosticDetailsModal
        open={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          setSelected(null);
        }}
        diagnostic={selected}
      />
      <DiagnosticUpdateStatusModal
        open={statusOpen}
        onClose={() => {
          setStatusOpen(false);
          setSelected(null);
        }}
        diagnostic={selected}
        onSuccess={onRefresh}
      />
      <DiagnosticDeleteModal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelected(null);
        }}
        diagnostic={selected}
        onSuccess={onRefresh}
      />
    </>
  );
}
