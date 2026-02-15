"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Filter, RefreshCw, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { RendezVous, RendezVousStatus } from "@/types/Rendezvous.types";
import { getMyRendezVous } from "@/lib/Rendezvous.api";
import { MyRendezVousTable } from "@/components/rende-vous/MyRendezVousTable";
import AppointmentModal from "@/components/AppointmentModal";

export default function MyRendezVousPage() {
  const t = useTranslations();
  const tRdv = useTranslations("rendezvous");

  const [rendezvous, setRendezVous] = useState<RendezVous[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<RendezVousStatus | "ALL">("ALL");
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRendezVous, setTotalRendezVous] = useState(0);

  const fetchMyRendezVous = async (page: number = 1, status?: RendezVousStatus) => {
    setIsLoading(true);
    try {
      const filters: any = { page, limit: 10 };
      if (status) filters.status = status;

      const result = await getMyRendezVous(filters);
      setRendezVous(result.data);
      setCurrentPage(result.pagination.page);
      setTotalPages(result.pagination.totalPages);
      setTotalRendezVous(result.pagination.total);
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      toast.error(t(err.message));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const status = statusFilter !== "ALL" ? statusFilter : undefined;
    fetchMyRendezVous(1, status);
  }, [statusFilter]);

  const handleRefresh = () => {
    const status = statusFilter !== "ALL" ? statusFilter : undefined;
    fetchMyRendezVous(currentPage, status);
    toast.success(tRdv("refreshed"));
  };

  const handlePageChange = (newPage: number) => {
    const status = statusFilter !== "ALL" ? statusFilter : undefined;
    fetchMyRendezVous(newPage, status);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAppointmentSuccess = () => {
    fetchMyRendezVous(1);
  };

  const stats = {
    total: totalRendezVous,
    pending: rendezvous.filter((r) => r.status === RendezVousStatus.PENDING).length,
    approved: rendezvous.filter((r) => r.status === RendezVousStatus.APPROVED).length,
    rejected: rendezvous.filter((r) => r.status === RendezVousStatus.REJECTED).length,
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {tRdv("client.myAppointments")}
              </h1>
              <p className="text-muted-foreground">
                {tRdv("client.myAppointmentsDescription")}
              </p>
            </div>
          </div>
          <Button
            onClick={() => setAppointmentModalOpen(true)}
            size="lg"
            className="hidden md:flex"
          >
            <Plus className="h-5 w-5 mr-2" />
            {tRdv("client.newAppointment")}
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-4 md:grid-cols-4 mb-8"
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {tRdv("client.totalAppointments")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {tRdv("statuses.pending")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {tRdv("statuses.approved")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {tRdv("statuses.rejected")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
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
              {tRdv("filters")}
            </CardTitle>
            <CardDescription>{tRdv("client.filtersDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as RendezVousStatus | "ALL")}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">{tRdv("allStatuses")}</SelectItem>
                  <SelectItem value={RendezVousStatus.PENDING}>
                    {tRdv("statuses.pending")}
                  </SelectItem>
                  <SelectItem value={RendezVousStatus.APPROVED}>
                    {tRdv("statuses.approved")}
                  </SelectItem>
                  <SelectItem value={RendezVousStatus.REJECTED}>
                    {tRdv("statuses.rejected")}
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={() => setAppointmentModalOpen(true)}
                className="w-full sm:w-auto md:hidden"
              >
                <Plus className="h-4 w-4 mr-2" />
                {tRdv("client.newAppointment")}
              </Button>

              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                {tRdv("refresh")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>
              {tRdv("client.myAppointmentsList")} ({rendezvous.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MyRendezVousTable
              rendezvous={rendezvous}
              isLoading={isLoading}
              onRefresh={() =>
                fetchMyRendezVous(
                  currentPage,
                  statusFilter !== "ALL" ? statusFilter : undefined
                )
              }
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
                  {tRdv("previous")}
                </Button>
                <div className="text-sm text-muted-foreground">
                  {tRdv("page")} {currentPage} {tRdv("of")} {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isLoading}
                >
                  {tRdv("next")}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Modal */}
      <AppointmentModal
        isOpen={appointmentModalOpen}
        onClose={() => setAppointmentModalOpen(false)}
        onSuccess={handleAppointmentSuccess}
      />
    </div>
  );
}
