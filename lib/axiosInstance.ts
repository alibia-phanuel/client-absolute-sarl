import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const API_URL = "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Helper pour obtenir la locale depuis l'URL
const getLocaleFromPath = (): string => {
  if (typeof window === "undefined") return "en";
  const pathParts = window.location.pathname.split("/");
  const locale = pathParts[1];
  return ["en", "fr", "es"].includes(locale) ? locale : "en";
};

// ✅ Helper pour obtenir l'URL de login selon la locale
const getLoginUrl = (): string => {
  const locale = getLocaleFromPath();
  const loginPaths: Record<string, string> = {
    en: "/en/login",
    fr: "/fr/connexion",
    es: "/es/iniciar-sesion",
  };
  return loginPaths[locale] || "/en/login";
};

// ✅ Interceptor REQUEST
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;

    console.log("🔑 Token intercepté :", token);

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ✅ Interceptor RESPONSE
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;

      // Liste des chemins publics (incluant toutes les traductions)
      const publicPaths = [
        "/login",
        "/connexion",
        "/iniciar-sesion",
        "/register",
        "/inscription",
        "/registro",
        "/forgot-password",
        "/mot-de-passe-oublie",
        "/olvide-contrasena",
        "/verify-email",
        "/verifier-email",
        "/verificar-email",
      ];

      const isPublicPage = publicPaths.some((path) =>
        currentPath.includes(path),
      );

      // Ne rediriger que si on est sur une page protégée
      if (!isPublicPage) {
        console.log("⚠️ Token expiré - Redirection vers login");
        useAuthStore.getState().logout();
        window.location.href = getLoginUrl();
      } else {
        console.log("✅ Erreur 401 sur page publique - Pas de redirection");
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
