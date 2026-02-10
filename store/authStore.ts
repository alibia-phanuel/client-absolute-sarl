import { UserData } from "@/types/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";


interface AuthState {
  // État
  accessToken: string | null;
  user: UserData | null;
  pendingVerificationEmail: string | null; // ✅ Nouveau champ

  // Actions
  setToken: (token: string) => void;
  setUser: (user: UserData) => void;
  setAuth: (token: string, user: UserData) => void;
  setPendingVerificationEmail: (email: string) => void; // ✅ Nouveau setter
  clearPendingVerification: () => void; // ✅ Nouveau clearer
  logout: () => void;

  // Helpers
  isAuthenticated: () => boolean;
  isVerified: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // État initial
      accessToken: null,
      user: null,
      pendingVerificationEmail: null, // ✅ Nouveau champ

      // Setter pour le token uniquement
      setToken: (token) => set({ accessToken: token }),

      // Setter pour l'utilisateur uniquement
      setUser: (user) => set({ user }),

      // Setter combiné (pratique après login/register)
      setAuth: (token, user) => set({ accessToken: token, user }),

      // ✅ Sauvegarder l'email en attente de vérification
      setPendingVerificationEmail: (email) =>
        set({ pendingVerificationEmail: email }),

      // ✅ Nettoyer l'email après vérification
      clearPendingVerification: () => set({ pendingVerificationEmail: null }),

      // Logout - réinitialise tout
      logout: () =>
        set({
          accessToken: null,
          user: null,
          pendingVerificationEmail: null,
        }),

      // Helper pour vérifier si l'utilisateur est connecté
      isAuthenticated: () => {
        const { accessToken, user } = get();
        return !!accessToken && !!user;
      },

      // Helper pour vérifier si le compte est vérifié
      isVerified: () => {
        const { user } = get();
        return user?.isAccountVerified ?? false;
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
