// Types pour la gestion des utilisateurs

export type UserRole = "CLIENT" | "ADMIN" | "EMPLOYE";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isAccountVerified: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface GetUsersResponse {
  success: boolean;
  messageKey: string;
  message: string;
  data: User[];
}

export interface GetUserByIdResponse {
  success: boolean;
  messageKey: string;
  message: string;
  data: User;
}

export interface UpdateUserRequest {
  name?: string;
  role?: UserRole;
}

export interface UpdateUserResponse {
  success: boolean;
  messageKey: string;
  message: string;
  data: User;
}

export interface DeleteUserResponse {
  success: boolean;
  messageKey: string;
  message: string;
}

export interface ApiError {
  success: false;
  messageKey: string;
  message: string;
}