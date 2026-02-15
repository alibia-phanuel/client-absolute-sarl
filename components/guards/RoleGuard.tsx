"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";

type UserRole = "CLIENT" | "ADMIN" | "EMPLOYE";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
  fallback?: ReactNode;
}

/**
 * Composant de protection basé sur les rôles
 * Redirige automatiquement si l'utilisateur n'a pas le bon rôle
 */
export function RoleGuard({
  children,
  allowedRoles,
  redirectTo = "/login",
  fallback,
}: RoleGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    // Vérifier l'authentification
    if (!isAuthenticated() || !user) {
      logout();
      router.push(redirectTo);
      return;
    }

    // Vérifier le rôle
    if (!allowedRoles.includes(user.role)) {
      // Rediriger selon le rôle actuel
      if (user.role === "ADMIN" || user.role === "EMPLOYE") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  }, [user, isAuthenticated, allowedRoles, router, redirectTo, logout]);

  // Afficher un loader pendant la vérification
  if (!isAuthenticated() || !user || !allowedRoles.includes(user.role)) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )
    );
  }

  return <>{children}</>;
}

/**
 * Guard pour les routes admin (ADMIN ou EMPLOYE uniquement)
 */
export function AdminGuard({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={["ADMIN", "EMPLOYE"]} redirectTo="/login">
      {children}
    </RoleGuard>
  );
}

/**
 * Guard pour les routes client (CLIENT uniquement)
 */
export function ClientGuard({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={["CLIENT"]} redirectTo="/login">
      {children}
    </RoleGuard>
  );
}

/**
 * Guard pour les routes authentifiées (tous les rôles)
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  return (
    <RoleGuard
      allowedRoles={["CLIENT", "ADMIN", "EMPLOYE"]}
      redirectTo="/login"
    >
      {children}
    </RoleGuard>
  );
}
