import axiosInstance from "./axiosInstance";
import {
  GetUsersResponse,
  GetUserByIdResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  DeleteUserResponse,
  UserRole,
} from "@/types/user.types";

/**
 * Récupère la liste des utilisateurs
 * @param role - Filtrer par rôle (optionnel)
 */
export const getUsers = async (role?: UserRole): Promise<GetUsersResponse> => {
  try {
    const params = role ? { role } : {};
    const response = await axiosInstance.get<GetUsersResponse>("/api/users", {
      params,
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.messageKey) {
      throw new Error(error.response.data.messageKey);
    }
    throw new Error("users.fetchError");
  }
};

/**
 * Récupère un utilisateur par son ID
 * @param id - ID de l'utilisateur
 */
export const getUserById = async (id: string): Promise<GetUserByIdResponse> => {
  try {
    const response = await axiosInstance.get<GetUserByIdResponse>(
      `/api/users/${id}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.messageKey) {
      throw new Error(error.response.data.messageKey);
    }

    if (error.response?.status === 404) {
      throw new Error("users.notFound");
    }

    throw new Error("users.fetchError");
  }
};

/**
 * Met à jour un utilisateur
 * @param id - ID de l'utilisateur
 * @param data - Données à mettre à jour
 */
export const updateUser = async (
  id: string,
  data: UpdateUserRequest
): Promise<UpdateUserResponse> => {
  try {
    const response = await axiosInstance.put<UpdateUserResponse>(
      `/api/users/${id}`,
      data
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.messageKey) {
      throw new Error(error.response.data.messageKey);
    }

    if (error.response?.status === 400) {
      throw new Error("validation.invalidData");
    }

    if (error.response?.status === 404) {
      throw new Error("users.notFound");
    }

    if (error.response?.status === 403) {
      throw new Error("users.accessDenied");
    }

    throw new Error("users.updateError");
  }
};

/**
 * Supprime un utilisateur
 * @param id - ID de l'utilisateur
 */
export const deleteUser = async (id: string): Promise<DeleteUserResponse> => {
  try {
    const response = await axiosInstance.delete<DeleteUserResponse>(
      `/api/users/${id}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.messageKey) {
      throw new Error(error.response.data.messageKey);
    }

    if (error.response?.status === 404) {
      throw new Error("users.notFound");
    }

    if (error.response?.status === 403) {
      throw new Error("users.accessDenied");
    }

    throw new Error("users.deleteError");
  }
};