// ===========================
// 📌 TYPES
// ===========================

import axiosInstance from "./axiosInstance";

export type UserRole = "CLIENT" | "ADMIN" | "EMPLOYE";

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  messageKey: string;
  message: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isAccountVerified: boolean;
  verifyOtp: string | null;
  verifyOtpExpireAt: string | null;
  resetOtp: string | null;
  resetOtpExpireAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterResponse {
  success: boolean;
  userData: UserData;
  token: string;
  messageKey: string;
  message: string;
}

export interface SendVerifyOtpRequest {
  email: string;
}

export interface SendVerifyOtpResponse {
  success: boolean;
  messageKey: string;
  message: string;
}

export interface VerifyAccountRequest {
  email: string;
  otp: string;
}

export interface VerifyAccountResponse {
  success: boolean;
  messageKey: string;
  message: string;
}

export interface IsAuthResponse {
  success: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    isAccountVerified: boolean;
    createdAt: string;
  };
}
export interface SendResetOtpRequest {
  email: string;
}

export interface SendResetOtpResponse {
  success: boolean;
  messageKey: string;
  message: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  messageKey: string;
  message: string;
}
// ===========================
// 📌 API FUNCTIONS
// ===========================

/**
 * Inscription d'un nouvel utilisateur
 * @param data - Données d'inscription (name, email, password, role)
 * @returns Données utilisateur + token JWT
 */
export const register = async (
  data: RegisterRequest,
): Promise<RegisterResponse> => {
  try {
    const response = await axiosInstance.post<RegisterResponse>(
      "/api/auth/register",
      data,
    );

    return response.data;
  } catch (error: any) {
    if (error.response?.data?.messageKey) {
      throw new Error(error.response.data.messageKey);
    }

    throw new Error(error.response?.data?.message || "auth.registerError");
  }
};

/**
 * Connexion d'un utilisateur
 * @param data - Email et mot de passe
 * @returns Token JWT
 */
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post<LoginResponse>(
      "/api/auth/login",
      data,
    );

    return response.data;
  } catch (error: any) {
    if (error.response?.data?.messageKey) {
      throw new Error(error.response.data.messageKey);
    }

    if (error.response?.status === 401) {
      throw new Error("auth.invalidCredentials");
    }

    throw new Error(error.response?.data?.message || "auth.loginError");
  }
};

/**
 * Vérifier si l'utilisateur est authentifié
 * @returns Données de l'utilisateur connecté
 */
export const isAuth = async (): Promise<IsAuthResponse> => {
  try {
    const response =
      await axiosInstance.get<IsAuthResponse>("/api/auth/is-auth");

    return response.data;
  } catch (error: any) {
    if (error.response?.data?.messageKey) {
      throw new Error(error.response.data.messageKey);
    }

    if (error.response?.status === 401) {
      throw new Error("auth.notAuthenticated");
    }

    throw new Error(error.response?.data?.message || "auth.authCheckError");
  }
};

/**
 * Envoyer un OTP pour vérification de l'email
 * @param data - Email de l'utilisateur
 * @returns Confirmation d'envoi de l'OTP
 */
export const sendVerifyOtp = async (
  data: SendVerifyOtpRequest,
): Promise<SendVerifyOtpResponse> => {
  try {
    const response = await axiosInstance.post<SendVerifyOtpResponse>(
      "/api/auth/send-verify-otp",
      data,
    );

    return response.data;
  } catch (error: any) {
    if (error.response?.data?.messageKey) {
      throw new Error(error.response.data.messageKey);
    }

    if (error.response?.status === 400) {
      throw new Error("auth.alreadyVerified");
    }

    if (error.response?.status === 404) {
      throw new Error("auth.userNotFound");
    }

    throw new Error(error.response?.data?.message || "auth.sendOtpError");
  }
};

/**
 * Vérifier le compte avec l'OTP
 * @param data - Email et code OTP
 * @returns Confirmation de vérification
 */
export const verifyAccount = async (
  data: VerifyAccountRequest,
): Promise<VerifyAccountResponse> => {
  try {
    const response = await axiosInstance.post<VerifyAccountResponse>(
      "/api/auth/verify-account",
      data,
    );

    return response.data;
  } catch (error: any) {
    if (error.response?.data?.messageKey) {
      throw new Error(error.response.data.messageKey);
    }

    if (error.response?.status === 400) {
      throw new Error("auth.invalidOtp");
    }

    if (error.response?.status === 404) {
      throw new Error("auth.userNotFound");
    }

    throw new Error(error.response?.data?.message || "auth.verifyAccountError");
  }
};

/**
 * Envoyer un OTP pour réinitialisation du mot de passe
 * @param data - Email de l'utilisateur
 * @returns Confirmation d'envoi de l'OTP
 */
export const sendResetOtp = async (
  data: SendResetOtpRequest,
): Promise<SendResetOtpResponse> => {
  try {
    const response = await axiosInstance.post<SendResetOtpResponse>(
      "/api/auth/send-reset-otp",
      data,
    );

    return response.data;
  } catch (error: any) {
    if (error.response?.data?.messageKey) {
      throw new Error(error.response.data.messageKey);
    }

    if (error.response?.status === 400) {
      throw new Error("auth.emailRequired");
    }

    if (error.response?.status === 404) {
      throw new Error("auth.userNotFound");
    }

    throw new Error(error.response?.data?.message || "auth.sendResetOtpError");
  }
};

/**
 * Réinitialiser le mot de passe avec un OTP
 * @param data - Email, OTP et nouveau mot de passe
 * @returns Confirmation de réinitialisation
 */
export const resetPassword = async (
  data: ResetPasswordRequest,
): Promise<ResetPasswordResponse> => {
  try {
    const response = await axiosInstance.post<ResetPasswordResponse>(
      "/api/auth/reset-password",
      data,
    );

    return response.data;
  } catch (error: any) {
    if (error.response?.data?.messageKey) {
      throw new Error(error.response.data.messageKey);
    }

    if (error.response?.status === 400) {
      throw new Error("auth.invalidResetOtp");
    }

    if (error.response?.status === 404) {
      throw new Error("auth.userNotFound");
    }

    throw new Error(error.response?.data?.message || "auth.resetPasswordError");
  }
};
