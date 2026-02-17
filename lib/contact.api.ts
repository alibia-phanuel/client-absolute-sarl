import {
  CreateContactMessagePayload,
  CreateContactMessageResponse,
  DeleteContactMessageResponse,
  GetContactMessageByIdResponse,
  GetContactMessagesParams,
  GetContactMessagesResponse,
  GetContactMessagesStatsResponse,
  UpdateContactMessagePayload,
  UpdateContactMessageResponse,
} from "@/types/ContactMessages.types";
import axiosInstance from "./axiosInstance";

export const createContactMessage = async (
  payload: CreateContactMessagePayload,
): Promise<CreateContactMessageResponse> => {
  try {
    const { data } = await axiosInstance.post<CreateContactMessageResponse>(
      "/api/contact-messages",
      payload,
    );

    return data;
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error("Données invalides");
    }

    if (error.response?.status === 429) {
      throw new Error("Trop de requêtes. Veuillez réessayer plus tard.");
    }

    if (error.response?.data?.messageKey) {
      throw new Error(error.response.data.messageKey);
    }

    throw new Error("Une erreur est survenue lors de l'envoi du message.");
  }
};

export const getContactMessages = async (
  params?: GetContactMessagesParams,
): Promise<GetContactMessagesResponse> => {
  try {
    const { data } = await axiosInstance.get<GetContactMessagesResponse>(
      "/api/contact-messages",
      {
        params,
      },
    );

    return data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error("Non authentifié");
    }

    if (error.response?.status === 403) {
      throw new Error("Accès refusé");
    }

    throw new Error("Impossible de récupérer les messages.");
  }
};

export const getContactMessagesStats =
  async (): Promise<GetContactMessagesStatsResponse> => {
    try {
      const { data } = await axiosInstance.get<GetContactMessagesStatsResponse>(
        "/api/contact-messages/stats",
      );

      return data;
    } catch (error: any) {
      throw new Error("Impossible de récupérer les statistiques.");
    }
  };

export const getContactMessageById = async (
  id: string,
): Promise<GetContactMessageByIdResponse> => {
  try {
    const { data } = await axiosInstance.get<GetContactMessageByIdResponse>(
      `/api/contact-messages/${id}`,
    );

    return data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error("Message non trouvé");
    }

    throw new Error("Impossible de récupérer le message.");
  }
};

export const updateContactMessage = async (
  id: string,
  payload: UpdateContactMessagePayload,
): Promise<UpdateContactMessageResponse> => {
  try {
    const { data } = await axiosInstance.patch<UpdateContactMessageResponse>(
      `/api/contact-messages/${id}`,
      payload,
    );

    return data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error("Message non trouvé");
    }

    if (error.response?.status === 400) {
      throw new Error("Données invalides");
    }

    throw new Error("Impossible de mettre à jour le message.");
  }
};

export const deleteContactMessage = async (
  id: string,
): Promise<DeleteContactMessageResponse> => {
  try {
    const { data } = await axiosInstance.delete<DeleteContactMessageResponse>(
      `/api/contact-messages/${id}`,
    );

    return data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error("Message non trouvé");
    }

    if (error.response?.status === 403) {
      throw new Error("Accès refusé");
    }

    throw new Error("Impossible de supprimer le message.");
  }
};