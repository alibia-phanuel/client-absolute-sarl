"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "@/i18n/routing";
import { useAuthStore } from "@/store/authStore";

export type RouteType = "public" | "authenticated" | "admin" | "unverified";

interface UseRouteGuardOptions {
  routeType?: RouteType;
  redirectTo?: string;
}

/**
 * Hook pour protéger les routes côté client
 * @param options - Options de configuration
 */
export function useRouteGuard(options: UseRouteGuardOptions = {}) {
  const { routeType = "public", redirectTo } = options;
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isVerified, hasRole, user, needsVerification } =
    useAuthStore();

  useEffect(() => {
    const checkAccess = () => {
      const authenticated = isAuthenticated();
      const verified = isVerified();
      const needsVerif = needsVerification();

      // Cas 1: Route nécessitant une authentification
      if (routeType === "authenticated" && !authenticated) {
        router.push({
          pathname: "/login",
          query: { redirect: pathname },
        });
        return;
      }

      // Cas 2: Utilisateur authentifié mais non vérifié (sauf sur la page de vérification)
      if (
        authenticated &&
        !verified &&
        needsVerif &&
        pathname !== "/verify-account"
      ) {
        router.push("/verify-account");
        return;
      }

      // Cas 3: Route admin nécessitant un rôle spécifique
      if (routeType === "admin") {
        if (!authenticated) {
          router.push({
            pathname: "/login",
            query: { redirect: pathname },
          });
          return;
        }

        if (!verified) {
          router.push("/verify-account");
          return;
        }

        if (!hasRole(["ADMIN", "EMPLOYE"])) {
          router.push("/");
          return;
        }
      }

      // Cas 4: Route de vérification (uniquement pour utilisateurs non vérifiés)
      if (routeType === "unverified") {
        if (!authenticated) {
          router.push("/login");
          return;
        }

        if (verified) {
          // Si déjà vérifié, rediriger selon le rôle
          if (hasRole(["ADMIN", "EMPLOYE"])) {
            router.push("/admin");
          } else {
            router.push("/");
          }
          return;
        }
      }

      // Cas 5: Redirection personnalisée si fournie
      if (redirectTo) {
        // redirectTo peut être une string arbitraire → on contourne le typage strict de next-intl
        router.push(redirectTo as any);
        // Alternative recommandée si redirectTo est toujours une route interne connue :
        // router.push(redirectTo as Parameters<typeof router.push>[0]);
      }
    };

    checkAccess();
  }, [
    routeType,
    isAuthenticated,
    isVerified,
    hasRole,
    needsVerification,
    router,
    pathname,
    redirectTo,
    user,
  ]);

  return {
    isAuthenticated: isAuthenticated(),
    isVerified: isVerified(),
    user,
    hasRole,
  };
}

/**
 * Hook pour rediriger les utilisateurs déjà connectés
 * Utile pour les pages login/register
 */
export function useGuestOnly() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isVerified, hasRole } = useAuthStore();

  useEffect(() => {
    // Ne pas rediriger si on est sur la page de login avec un paramètre redirect
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const hasRedirect = searchParams.has("redirect");

      if (hasRedirect) {
        return;
      }
    }

    if (isAuthenticated() && isVerified()) {
      if (hasRole(["ADMIN", "EMPLOYE"])) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  }, [isAuthenticated, isVerified, hasRole, router, pathname]);
}
