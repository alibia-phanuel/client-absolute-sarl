export interface ContactMessageMetadata {
  userAgent: string;
  referrer: string;
}

export interface CreateContactMessagePayload {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  metadata: ContactMessageMetadata;
}

export interface CreateContactMessageResponse {
  success: boolean;
  messageKey: string;
  message: string;
  data: {
    id: string;
    createdAt: string;
  };
}

export type ContactMessageStatus =
  | "NEW"
  | "READ"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "ARCHIVED";

export type ContactMessageSubject =
  | "CANADA"
  | "BELGIUM"
  | "FRANCE"
  | "DIGITAL"
  | "SECRETARIAT"
  | "COMMERCE"
  | "OTHER";

export interface ContactMessageMetadataFull {
  ip: string;
  referrer: string;
  userAgent: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: ContactMessageSubject;
  message: string;
  status: ContactMessageStatus;
  metadata: ContactMessageMetadataFull;
  readAt: string | null;
  readBy: string | null;
  assignedTo: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessagesPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetContactMessagesResponse {
  success: boolean;
  messageKey: string;
  data: ContactMessage[];
  pagination: ContactMessagesPagination;
}

export interface GetContactMessagesParams {
  page?: number;
  limit?: number;
  status?: ContactMessageStatus;
  subject?: ContactMessageSubject;
  search?: string;
}

export interface ContactMessagesStatsData {
  total: number;
  byStatus: {
    new: number;
    inProgress: number;
    resolved: number;
  };
  bySubject: Partial<Record<ContactMessageSubject, number>>;
}

export interface GetContactMessagesStatsResponse {
  success: boolean;
  messageKey: string;
  data: ContactMessagesStatsData;
}

export interface GetContactMessageByIdResponse {
  success: boolean;
  messageKey: string;
  data: ContactMessage;
}

export interface UpdateContactMessagePayload {
  status?: ContactMessageStatus;
  notes?: string;
  assignedTo?: string; // ID admin ou employé
}

export interface UpdateContactMessageResponse {
  success: boolean;
  messageKey: string;
  message: string;
  data: ContactMessage;
}

export interface DeleteContactMessageResponse {
  success: boolean;
  messageKey: string;
  message: string;
}