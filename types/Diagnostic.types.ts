// types/Diagnostic.types.ts

export type DiagnosticStatus =
  | "NEW"
  | "READ"
  | "IN_PROGRESS"
  | "TREATED"
  | "RESOLVED"
  | "ARCHIVED";

export type DiagnosticDestination = "CANADA" | "BELGIUM" | "FRANCE" | "OTHER";

export interface Diagnostic {
  id: string;
  lastName: string;
  firstName: string;
  birthDate: string;
  residenceCountry: string;
  nationality: string;
  lastDiploma: string;
  diplomaYear: string;
  institution: string;
  diplomaTitle: string;
  currentStatus: string;
  studyDomain?: string;
  professionalExperience?: string;
  destination: DiagnosticDestination;
  targetLevel: string;
  targetIntake: string;
  previousAttempt: boolean;
  identifiedNeeds?: string;
  frenchLevel: string;
  englishLevel: string;
  email: string;
  whatsapp: string;
  preferredContact: string;
  status: DiagnosticStatus;
  internalNotes?: string;
  readAt?: string;
  readBy?: string;
  assignedTo?: string;
  assignedAt?: string;
  treatedAt?: string;
  treatedBy?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiagnosticStats {
  total: number;
  byStatus: Record<DiagnosticStatus, number>;
  byDestination: Record<DiagnosticDestination, number>;
  newToday: number;
  newThisWeek: number;
}

export interface DiagnosticFilters {
  status?: DiagnosticStatus;
  destination?: DiagnosticDestination;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt" | "status";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedDiagnostics {
  data: Diagnostic[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
