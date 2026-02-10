// ===========================
// 📌 TYPES
// ===========================

export type UserRole = "CLIENT" | "ADMIN" | "EMPLOYE";

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isAccountVerified: boolean;
  avatarUrl?: string; // ✅ Optionnel
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


// ===========================
// 📌 TYPES
// ===========================



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