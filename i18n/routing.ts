import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr"],
  defaultLocale: "en",

  pathnames: {
    // Pages publiques
    "/": "/",

    // Auth
    "/login": { en: "/login", fr: "/connexion" },
    "/register": { en: "/register", fr: "/inscription" },
    "/forgot-password": { en: "/forgot-password", fr: "/mot-de-passe-oublie" },
    "/verify-account": { en: "/verify-email", fr: "/verifier-email" },
    // Pages principales
    "/services": { en: "/services", fr: "/services" },
    "/blog": { en: "/blog", fr: "/blog" },
    "/blog/[id]": { en: "/blog/[id]", fr: "/blog/[id]" },
    "/contact": { en: "/contact", fr: "/contactez-nous" },
    "/about": { en: "/about", fr: "/a-propos" },
    "/terms": { en: "/terms", fr: "/conditions" },
    "/privacy": { en: "/privacy", fr: "/confidentialite" },
    "/faq": { en: "/faq-custumer", fr: "/faq-client" },
    // Admin / Utilisateurs
    "/admin": { en: "/admin", fr: "/admin" },
    "/rendezvous": { en: "/Appointments", fr: "/rendezvous" },
    "/sms": { en: "/messages-custumer", fr: "/messages-client" },
    "/devisclient": { en: "/devisclient", fr: "/devis-client" },
    // MenuSections personnalisé
    "/ia-pdf-document": { en: "/ia-pdf-document", fr: "/documents-pdf-ia" },
    "/blogs": { en: "/blogs", fr: "/blogs" },
    "/messages": { en: "/messages", fr: "/messages" },
    "/devis": { en: "/devis-admin", fr: "/devis-admin" },
    "/rendez-vous": { en: "/rendez-vous", fr: "/rendez-vous" },
    "/utilisateurs": { en: "/users", fr: "/utilisateurs" },
  },
});

// Types
export type Locale = (typeof routing.locales)[number];

// Navigation helpers
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
