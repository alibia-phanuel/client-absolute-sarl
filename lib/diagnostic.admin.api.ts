// lib/diagnostic.admin.api.ts
import axiosInstance from "./axiosInstance";
import {
  Diagnostic,
  DiagnosticStats,
  DiagnosticFilters,
  DiagnosticStatus,
  PaginatedDiagnostics,
} from "@/types/Diagnostic.types";

export async function getDiagnostics(
  filters: DiagnosticFilters = {},
): Promise<PaginatedDiagnostics> {
  const params: Record<string, any> = {};
  if (filters.status) params.status = filters.status;
  if (filters.destination) params.destination = filters.destination;
  if (filters.search?.trim()) params.search = filters.search;
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;
  if (filters.sortBy) params.sortBy = filters.sortBy;
  if (filters.sortOrder) params.sortOrder = filters.sortOrder;

  const res = await axiosInstance.get<{ success: true } & PaginatedDiagnostics>(
    "/api/diagnostics",
    { params },
  );
  return { data: res.data.data, meta: res.data.meta };
}

export async function getDiagnosticStats(): Promise<DiagnosticStats> {
  const res = await axiosInstance.get<{
    success: true;
    data: DiagnosticStats;
  }>("/api/diagnostics/stats");
  return res.data.data;
}

export async function getDiagnosticById(id: string): Promise<Diagnostic> {
  const res = await axiosInstance.get<{ success: true; data: Diagnostic }>(
    `/api/diagnostics/${id}`,
  );
  return res.data.data;
}

export async function updateDiagnosticStatus(
  id: string,
  payload: {
    status: DiagnosticStatus;
    internalNotes?: string;
    assignedTo?: string;
  },
): Promise<Diagnostic> {
  const res = await axiosInstance.patch<{ success: true; data: Diagnostic }>(
    `/api/diagnostics/${id}/status`,
    payload,
  );
  return res.data.data;
}

export async function deleteDiagnostic(id: string): Promise<void> {
  await axiosInstance.delete(`/api/diagnostics/${id}`);
}