/**
 * 📨 Page de Gestion des Messages de Contact
 *
 * Page principale pour la gestion des messages avec :
 * - Dashboard avec statistiques (total, nouveaux, en cours, résolus)
 * - Filtres par statut et sujet
 * - Recherche globale
 * - Tableau des messages avec actions
 * - Pagination
 *
 * Cette page est réservée aux ADMIN et EMPLOYE (via AdminGuard)
 */

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Filter, RefreshCw, Search } from "lucide-react";
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
import {
  ContactMessage,
  ContactMessageStatus,
  ContactMessageSubject,
} from "@/types/ContactMessages.types";
import { getContactMessages, getContactMessagesStats } from "@/lib/contact.api";
import { ContactMessagesTable } from "@/components/messages/ContactMessagesTable";
import { useAuthStore } from "@/store/authStore";

// ============================================================================
// 🎨 Composant Principal
// ============================================================================

export default function ContactMessagesPage() {
  const t = useTranslations();
  const tMessages = useTranslations("contactMessages");

  // Récupérer l'utilisateur connecté pour les permissions
  const { user } = useAuthStore();

  // États
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Filtres
  const [statusFilter, setStatusFilter] = useState<
    ContactMessageStatus | "ALL"
  >("ALL");
  const [subjectFilter, setSubjectFilter] = useState<
    ContactMessageSubject | "ALL"
  >("ALL");
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);

  // Statistiques
  const [stats, setStats] = useState({
    total: 0,
    byStatus: {
      new: 0,
      inProgress: 0,
      resolved: 0,
    },
    bySubject: {} as Partial<Record<ContactMessageSubject, number>>,
  });

  // ============================================================================
  // 📡 Chargement des Messages
  // ============================================================================

  /**
   * Charge les messages depuis l'API
   */
  const fetchMessages = async (page: number = 1) => {
    setIsLoading(true);
    try {
      // Construire les paramètres de filtres
      const params: any = {
        page,
        limit: 10,
      };

      if (statusFilter !== "ALL") {
        params.status = statusFilter;
      }

      if (subjectFilter !== "ALL") {
        params.subject = subjectFilter;
      }

      if (searchQuery.trim()) {
        params.search = searchQuery;
      }

      const result = await getContactMessages(params);

      setMessages(result.data);
      setFilteredMessages(result.data);
      setCurrentPage(result.pagination.page);
      setTotalPages(result.pagination.totalPages);
      setTotalMessages(result.pagination.total);
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      toast.error(t(err.message));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Charge les statistiques
   */
  const fetchStats = async () => {
    try {
      const result = await getContactMessagesStats();
      setStats(result.data);
    } catch (error: unknown) {
      console.error("Erreur chargement stats:", error);
    }
  };

  /**
   * Charger les messages et stats au montage
   */
  useEffect(() => {
    fetchMessages();
    fetchStats();
  }, []);

  // ============================================================================
  // 🔍 Gestion des Filtres
  // ============================================================================

  /**
   * Recharger quand les filtres changent
   */
  useEffect(() => {
    fetchMessages(1); // Reset à la page 1
  }, [statusFilter, subjectFilter, searchQuery]);

  // ============================================================================
  // 🎬 Handlers
  // ============================================================================

  /**
   * Rafraîchit la liste des messages
   */
  const handleRefresh = () => {
    fetchMessages(currentPage);
    fetchStats();
    toast.success(tMessages("refreshed"));
  };

  /**
   * Change de page
   */
  const handlePageChange = (newPage: number) => {
    fetchMessages(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /**
   * Réinitialise tous les filtres
   */
  const handleResetFilters = () => {
    setStatusFilter("ALL");
    setSubjectFilter("ALL");
    setSearchQuery("");
  };

  // ============================================================================
  // 🎨 Rendu du Composant
  // ============================================================================

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* ====== Header ====== */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {tMessages("title")}
            </h1>
            <p className="text-muted-foreground">{tMessages("description")}</p>
          </div>
        </div>
      </motion.div>

      {/* ====== Dashboard - Cartes de Statistiques ====== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-4 md:grid-cols-4 mb-8"
      >
        {/* Total des messages */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {tMessages("totalMessages")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        {/* Nouveaux messages */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {tMessages("newMessages")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.byStatus.new}
            </div>
          </CardContent>
        </Card>

        {/* En cours */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {tMessages("inProgress")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.byStatus.inProgress}
            </div>
          </CardContent>
        </Card>

        {/* Résolus */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {tMessages("resolved")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.byStatus.resolved}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ====== Filtres et Actions ====== */}
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
              {tMessages("filters")}
            </CardTitle>
            <CardDescription>{tMessages("filtersDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Ligne 1 : Recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={tMessages("searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Ligne 2 : Filtres & Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Filtre Statut */}
                <Select
                  value={statusFilter}
                  onValueChange={(value: any) => setStatusFilter(value)}
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder={tMessages("filterByStatus")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">
                      {tMessages("allStatuses")}
                    </SelectItem>
                    <SelectItem value="NEW">
                      {tMessages("statusNEW")}
                    </SelectItem>
                    <SelectItem value="READ">
                      {tMessages("statusREAD")}
                    </SelectItem>
                    <SelectItem value="IN_PROGRESS">
                      {tMessages("statusIN_PROGRESS")}
                    </SelectItem>
                    <SelectItem value="RESOLVED">
                      {tMessages("statusRESOLVED")}
                    </SelectItem>
                    <SelectItem value="ARCHIVED">
                      {tMessages("statusARCHIVED")}
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Filtre Sujet */}
                <Select
                  value={subjectFilter}
                  onValueChange={(value: any) => setSubjectFilter(value)}
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder={tMessages("filterBySubject")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">
                      {tMessages("allSubjects")}
                    </SelectItem>
                    <SelectItem value="CANADA">
                      {tMessages("subjectCANADA")}
                    </SelectItem>
                    <SelectItem value="BELGIUM">
                      {tMessages("subjectBELGIUM")}
                    </SelectItem>
                    <SelectItem value="FRANCE">
                      {tMessages("subjectFRANCE")}
                    </SelectItem>
                    <SelectItem value="DIGITAL">
                      {tMessages("subjectDIGITAL")}
                    </SelectItem>
                    <SelectItem value="SECRETARIAT">
                      {tMessages("subjectSECRETARIAT")}
                    </SelectItem>
                    <SelectItem value="COMMERCE">
                      {tMessages("subjectCOMMERCE")}
                    </SelectItem>
                    <SelectItem value="OTHER">
                      {tMessages("subjectOTHER")}
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Bouton Reset */}
                <Button
                  variant="outline"
                  onClick={handleResetFilters}
                  className="w-full sm:w-auto"
                >
                  {tMessages("resetFilters")}
                </Button>

                {/* Bouton Rafraîchir */}
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="w-full sm:w-auto ml-auto"
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                  />
                  {tMessages("refresh")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ====== Tableau des Messages ====== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                {tMessages("messagesList")} ({filteredMessages.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ContactMessagesTable
              messages={filteredMessages}
              isLoading={isLoading}
              onRefresh={() => {
                fetchMessages(currentPage);
                fetchStats();
              }}
              currentUserRole={user?.role}
            />

            {/* Pagination (si plus d'une page) */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                >
                  Précédent
                </Button>
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} sur {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isLoading}
                >
                  Suivant
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
