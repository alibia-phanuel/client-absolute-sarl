"use client";

/**
 * 📋 Page de Gestion des Diagnostics — Espace Admin/Employé
 *
 * Structure identique à ContactMessagesPage pour cohérence UI :
 * - Dashboard statistiques (total, nouveaux, en cours, résolus)
 * - Filtres par statut, destination, recherche
 * - Tableau avec actions
 * - Pagination
 * - Traductions FR/EN via next-intl
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ClipboardList, Filter, RefreshCw, Search, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/store/authStore";
import { getDiagnostics, getDiagnosticStats } from "@/lib/diagnostic.admin.api";
import {
  Diagnostic,
  DiagnosticDestination,
  DiagnosticFilters,
  DiagnosticStats,
  DiagnosticStatus,
} from "@/types/Diagnostic.types";
import { DiagnosticsTable } from "@/components/diagnostic/Diagnosticstable";

export default function DiagnosticsPage() {
  const tD = useTranslations("diagnostics");
  const { user } = useAuthStore();

  // ── États ──────────────────────────────────────────────────────────────────
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // ── Filtres ────────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DiagnosticStatus | "ALL">("ALL");
  const [destinationFilter, setDestinationFilter] = useState<DiagnosticDestination | "ALL">("ALL");

  // ── Stats ──────────────────────────────────────────────────────────────────
  const [stats, setStats] = useState<DiagnosticStats>({
    total: 0,
    byStatus: { NEW: 0, READ: 0, IN_PROGRESS: 0, TREATED: 0, RESOLVED: 0, ARCHIVED: 0 },
    byDestination: { CANADA: 0, BELGIUM: 0, FRANCE: 0, OTHER: 0 },
    newToday: 0,
    newThisWeek: 0,
  });

  // ── Fetch diagnostics ──────────────────────────────────────────────────────
  const fetchDiagnostics = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const params: DiagnosticFilters = { page, limit: 10 };
      if (statusFilter !== "ALL") params.status = statusFilter;
      if (destinationFilter !== "ALL") params.destination = destinationFilter;
      if (searchQuery.trim()) params.search = searchQuery;

      const result = await getDiagnostics(params);
      setDiagnostics(result.data);
      setCurrentPage(result.meta.page);
      setTotalPages(result.meta.totalPages);
      setTotal(result.meta.total);
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      toast.error(tD(err.message as string) || tD("fetchError"));
    } finally {
      setIsLoading(false);
    }
  };

  // ── Fetch stats (admin seulement) ──────────────────────────────────────────
  const fetchStats = async () => {
    if (user?.role !== "ADMIN") return;
    try {
      const data = await getDiagnosticStats();
      setStats(data);
    } catch {
      // silencieux — les stats ne sont pas critiques
    }
  };

  // Montage initial
  useEffect(() => {
    fetchDiagnostics();
    fetchStats();
  }, []);

  // Rechargement sur changement de filtre
  useEffect(() => {
    fetchDiagnostics(1);
  }, [statusFilter, destinationFilter, searchQuery]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleRefresh = () => {
    fetchDiagnostics(currentPage);
    fetchStats();
    toast.success(tD("refreshed"));
  };

  const handlePageChange = (newPage: number) => {
    fetchDiagnostics(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetFilters = () => {
    setStatusFilter("ALL");
    setDestinationFilter("ALL");
    setSearchQuery("");
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary">
            <ClipboardList className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{tD("title")}</h1>
            <p className="text-muted-foreground">{tD("description")}</p>
          </div>
        </div>
      </motion.div>

      {/* ── Stats (admin uniquement) ── */}
      {user?.role === "ADMIN" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid gap-4 md:grid-cols-4 mb-8"
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                {tD("totalDiagnostics")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {tD("newToday")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.newToday}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {tD("thisWeek")} : {stats.newThisWeek}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {tD("inProgress")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {(stats.byStatus.NEW ?? 0) + (stats.byStatus.READ ?? 0) + (stats.byStatus.IN_PROGRESS ?? 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                {tD("resolved")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.byStatus.RESOLVED ?? 0}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ── Filtres ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              {tD("filters")}
            </CardTitle>
            <CardDescription>{tD("filtersDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={tD("searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtres ligne */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Filtre Statut */}
                <Select
                  value={statusFilter}
                  onValueChange={(value: DiagnosticStatus) => setStatusFilter(value)}
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder={tD("filterByStatus")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">{tD("allStatuses")}</SelectItem>
                    <SelectItem value="NEW">{tD("statusNEW")}</SelectItem>
                    <SelectItem value="READ">{tD("statusREAD")}</SelectItem>
                    <SelectItem value="IN_PROGRESS">{tD("statusIN_PROGRESS")}</SelectItem>
                    <SelectItem value="TREATED">{tD("statusTREATED")}</SelectItem>
                    <SelectItem value="RESOLVED">{tD("statusRESOLVED")}</SelectItem>
                    <SelectItem value="ARCHIVED">{tD("statusARCHIVED")}</SelectItem>
                  </SelectContent>
                </Select>

                {/* Filtre Destination */}
                <Select
                  value={destinationFilter}
                  onValueChange={(value: DiagnosticDestination) => setDestinationFilter(value)}
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder={tD("filterByDestination")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">{tD("allDestinations")}</SelectItem>
                    <SelectItem value="CANADA">🇨🇦 {tD("destCANADA")}</SelectItem>
                    <SelectItem value="BELGIUM">🇧🇪 {tD("destBELGIUM")}</SelectItem>
                    <SelectItem value="FRANCE">🇫🇷 {tD("destFRANCE")}</SelectItem>
                    <SelectItem value="OTHER">🌍 {tD("destOTHER")}</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={handleResetFilters} className="w-full sm:w-auto">
                  {tD("resetFilters")}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="w-full sm:w-auto ml-auto"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                  {tD("refresh")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Tableau ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{tD("diagnosticsList")} ({total})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DiagnosticsTable
              diagnostics={diagnostics}
              isLoading={isLoading}
              onRefresh={() => {
                fetchDiagnostics(currentPage);
                fetchStats();
              }}
              currentUserRole={user?.role}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                >
                  {tD("previous")}
                </Button>
                <div className="text-sm text-muted-foreground">
                  {tD("page")} {currentPage} {tD("of")} {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isLoading}
                >
                  {tD("next")}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}