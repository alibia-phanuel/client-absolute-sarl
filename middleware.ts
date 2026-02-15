import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Create the next-intl middleware
const intlMiddleware = createIntlMiddleware(routing);

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/verify-account",
  "/",
];

// Define admin routes that require ADMIN or EMPLOYE role
const ADMIN_ROUTES = ["/admin"];

// Define routes that are accessible from /app/[locale]/(public)
const PUBLIC_APP_ROUTES = [
  "/blog",
  "/contact",
  "/faq",
  "/profile",
  "/services",
];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // First, apply next-intl middleware for internationalization
  const intlResponse = intlMiddleware(request);

  // Get token from cookies
  const token = request.cookies.get("auth-token")?.value;

  // Parse stored auth data from cookies (set by zustand persist)
  let user = null;
  let pendingVerificationEmail = null;

  try {
    const authStorage = request.cookies.get("auth-storage")?.value;
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      user = parsed.state?.user;
      pendingVerificationEmail = parsed.state?.pendingVerificationEmail;
    }
  } catch (error) {
    console.error("Error parsing auth storage:", error);
  }

  // Remove locale prefix for route matching (supports /en, /fr, /de)
  const pathWithoutLocale = pathname.replace(/^\/(en|fr|de)/, "") || "/";

  // ==========================================
  // 1. CHECK VERIFY-ACCOUNT ACCESS
  // ==========================================
  if (pathWithoutLocale === "/verify-account") {
    // Allow access if:
    // - User has pending verification email, OR
    // - User is logged in but not verified
    if (pendingVerificationEmail || (user && !user.isAccountVerified)) {
      return intlResponse;
    }

    // If no pending verification and user is verified, redirect to home
    if (user && user.isAccountVerified) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // If no user at all, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ==========================================
  // 2. REDIRECT UNVERIFIED USERS
  // ==========================================
  // If user is logged in but not verified, redirect to verify-account
  // (except for logout and public routes)
  if (
    user &&
    !user.isAccountVerified &&
    pathWithoutLocale !== "/verify-account" &&
    pathWithoutLocale !== "/logout" &&
    !PUBLIC_ROUTES.some((route) => pathWithoutLocale.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/verify-account", request.url));
  }

  // ==========================================
  // 3. CHECK ADMIN ROUTES
  // ==========================================
  if (ADMIN_ROUTES.some((route) => pathWithoutLocale.startsWith(route))) {
    // Not authenticated -> redirect to login
    if (!token || !user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Not verified -> redirect to verify-account
    if (!user.isAccountVerified) {
      return NextResponse.redirect(new URL("/verify-account", request.url));
    }

    // Not admin or employee -> redirect to home
    if (user.role !== "ADMIN" && user.role !== "EMPLOYE") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Admin/Employee and verified -> allow access
    return intlResponse;
  }

  // ==========================================
  // 4. HANDLE AUTH PAGES (login, register, forgot-password)
  // ==========================================
  if (
    pathWithoutLocale === "/login" ||
    pathWithoutLocale === "/register" ||
    pathWithoutLocale === "/forgot-password"
  ) {
    // If already authenticated and verified, redirect to appropriate page
    if (token && user && user.isAccountVerified) {
      if (user.role === "ADMIN" || user.role === "EMPLOYE") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // ==========================================
  // 5. PUBLIC APP ROUTES
  // ==========================================
  if (PUBLIC_APP_ROUTES.some((route) => pathWithoutLocale.startsWith(route))) {
    // Some routes might need authentication, add logic here if needed
    // For now, allow access to all
    return intlResponse;
  }

  // ==========================================
  // 6. DEFAULT - Allow access with intl
  // ==========================================
  return intlResponse;
}

export const config = {
  // Match only internationalized pathnames
  // Exclude static files and Next.js internals
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/",
    "/(en|fr|de)/:path*",
  ],
};

// https://claude.ai/chat/e769bf37-903c-4ee7-845e-ac9fa5520cfa
