import { UserData } from "@/types/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Helper function to sync localStorage to cookies for middleware access
const syncToCookie = (state: any) => {
  if (typeof document !== 'undefined') {
    const cookieValue = JSON.stringify({
      state: {
        user: state.user,
        accessToken: state.accessToken,
        pendingVerificationEmail: state.pendingVerificationEmail
      }
    });
    document.cookie = `auth-storage=${encodeURIComponent(cookieValue)}; path=/; max-age=2592000; SameSite=Lax`;
    
    // Also set auth-token cookie for easy access
    if (state.accessToken) {
      document.cookie = `auth-token=${state.accessToken}; path=/; max-age=2592000; SameSite=Lax`;
    } else {
      document.cookie = `auth-token=; path=/; max-age=0`;
    }
  }
};

interface AuthState {
  // État
  accessToken: string | null;
  user: UserData | null;
  pendingVerificationEmail: string | null;

  // Actions
  setToken: (token: string) => void;
  setUser: (user: UserData) => void;
  setAuth: (token: string, user: UserData) => void;
  setPendingVerificationEmail: (email: string) => void;
  clearPendingVerification: () => void;
  updateUserVerificationStatus: (isVerified: boolean) => void;
  logout: () => void;

  // Helpers
  isAuthenticated: () => boolean;
  isVerified: () => boolean;
  needsVerification: () => boolean;
  hasRole: (roles: string | string[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // État initial
      accessToken: null,
      user: null,
      pendingVerificationEmail: null,

      // Setter pour le token uniquement
      setToken: (token) => {
        set({ accessToken: token });
        const currentState = get();
        syncToCookie({ accessToken: token, user: currentState.user, pendingVerificationEmail: currentState.pendingVerificationEmail });
      },

      // Setter pour l'utilisateur uniquement
      setUser: (user) => {
        set({ user });
        const currentState = get();
        syncToCookie({ accessToken: currentState.accessToken, user, pendingVerificationEmail: currentState.pendingVerificationEmail });
      },

      // Setter combiné (pratique après login/register)
      setAuth: (token, user) => {
        set({ 
          accessToken: token, 
          user,
          // Si l'utilisateur n'est pas vérifié, garder son email
          pendingVerificationEmail: !user.isAccountVerified ? user.email : null
        });
        // Sync to cookies for middleware
        syncToCookie({ accessToken: token, user, pendingVerificationEmail: !user.isAccountVerified ? user.email : null });
      },

      // Sauvegarder l'email en attente de vérification
      setPendingVerificationEmail: (email) => {
        set({ pendingVerificationEmail: email });
        const currentState = get();
        syncToCookie({ accessToken: currentState.accessToken, user: currentState.user, pendingVerificationEmail: email });
      },

      // Nettoyer l'email après vérification
      clearPendingVerification: () => {
        set({ pendingVerificationEmail: null });
        const currentState = get();
        syncToCookie({ accessToken: currentState.accessToken, user: currentState.user, pendingVerificationEmail: null });
      },

      // Mettre à jour le statut de vérification
      updateUserVerificationStatus: (isVerified) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, isAccountVerified: isVerified };
          set({ 
            user: updatedUser,
            pendingVerificationEmail: isVerified ? null : currentUser.email
          });
          // Sync to cookies
          const currentState = get();
          syncToCookie({ 
            accessToken: currentState.accessToken, 
            user: updatedUser, 
            pendingVerificationEmail: isVerified ? null : currentUser.email 
          });
        }
      },

      // Logout - réinitialise tout
      logout: () => {
        set({
          accessToken: null,
          user: null,
          pendingVerificationEmail: null,
        });
        
        // Clear cookies
        syncToCookie({ accessToken: null, user: null, pendingVerificationEmail: null });
      },

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

      // Helper pour vérifier si la vérification est nécessaire
      needsVerification: () => {
        const { user, pendingVerificationEmail } = get();
        return !!pendingVerificationEmail || (!!user && !user.isAccountVerified);
      },

      // Helper pour vérifier le rôle
      hasRole: (roles) => {
        const { user } = get();
        if (!user) return false;
        
        if (typeof roles === 'string') {
          return user.role === roles;
        }
        
        return roles.includes(user.role);
      },
    }),
    {
      name: "auth-storage",
      // Utiliser localStorage pour une persistence synchrone
      // Les cookies seront gérés séparément pour le middleware
    },
  ),
);