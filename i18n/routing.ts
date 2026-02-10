import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "fr"],
  // Used when no locale matches
  defaultLocale: "en",
  pathnames: {
    // Pages publiques
    "/": "/",
    // Pages d'authentification
    "/login": {
      en: "/login",
      fr: "/connexion",
      es: "/iniciar-sesion",
    },
    "/register": {
      en: "/register",
      fr: "/inscription",
      es: "/registro",
    },
    "/forgot-password": {
      en: "/forgot-password",
      fr: "/mot-de-passe-oublie",
      es: "/olvide-contrasena",
    },
    "/verify-account": {
      en: "/verify-email",
      fr: "/verifier-email",
      es: "/verificar-email",
    },

    // Pages principales
    "/services": {
      en: "/services",
      fr: "/services",
      es: "/servicios",
    },
    "/blog": {
      en: "/blog",
      fr: "/blog",
      es: "/blog",
    },
    "/contact": {
      en: "/contact",
      fr: "/contactez-nous",
      es: "/contacto",
    },
    "/about": {
      en: "/about",
      fr: "/a-propos",
      es: "/acerca-de",
    },
    "/terms": {
      en: "/terms",
      fr: "/conditions",
      es: "/terminos",
    },
    "/privacy": {
      en: "/privacy",
      fr: "/confidentialite",
      es: "/privacidad",
    },

    // ← Ajoute ceci :
    "/blog/[id]": {
      en: "/blog/[id]",
      fr: "/blog/[id]",
    },
    "/admin": {
      en: "/admin",
      fr: "/admin",
      // ou "/admin" en fr aussi si pas de traduction
    },
    "/profile": {
      en: "/profile",
      fr: "/profile", // ou "/profil" si tu veux traduire le chemin
    },
  },
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export type Locale = (typeof routing.locales)[number];  // → "en" | "fr"
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
