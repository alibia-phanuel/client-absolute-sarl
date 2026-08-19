import type { Metadata, Viewport } from "next";
import { Locale, routing } from "@/i18n/routing";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Providers from "./providers";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://client-absolute-sarl.vercel.app";

const SITE_NAME = "ABSOLUTE SARL";

const TITLES: Record<Locale, string> = {
  fr: "Rejoignez ABSOLUTE SARL | Services, Freelances & Immigration",
  en: "Join ABSOLUTE SARL | Business Services, Freelancers & Immigration",
};

const DESCRIPTIONS: Record<Locale, string> = {
  fr: "ABSOLUTE SARL accompagne entreprises et particuliers à Douala et à l'international : services aux entreprises, mise à disposition de freelances qualifiés et accompagnement à l'immigration vers le Canada et la Belgique.",
  en: "ABSOLUTE SARL supports businesses and individuals in Douala and internationally: business services, qualified freelance placement, and immigration support to Canada and Belgium.",
};

const KEYWORDS: Record<Locale, string[]> = {
  fr: [
    "ABSOLUTE SARL",
    "services entreprises Douala",
    "freelances Cameroun",
    "immigration Canada",
    "immigration Belgique",
    "accompagnement immigration",
  ],
  en: [
    "ABSOLUTE SARL",
    "business services Douala",
    "freelancers Cameroon",
    "Canada immigration",
    "Belgium immigration",
    "immigration support",
  ],
};

// ── SEO dynamique selon la locale ──
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const validatedLocale = routing.locales.includes(locale as Locale)
    ? (locale as Locale)
    : routing.defaultLocale;

  const title = TITLES[validatedLocale];
  const description = DESCRIPTIONS[validatedLocale];

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${SITE_NAME}`,
    },
    description,
    keywords: KEYWORDS[validatedLocale],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: `/${validatedLocale}`,
      languages: {
        fr: "/fr",
        en: "/en",
      },
    },
    openGraph: {
      type: "website",
      locale: validatedLocale === "fr" ? "fr_FR" : "en_US",
      url: `${siteUrl}/${validatedLocale}`,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: "/images/og-image.png", // ⚠️ crée une image
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/og-image.png"],
    },
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const validatedLocale = locale as Locale;
  const messages = await getMessages();

  return (
    <html lang={validatedLocale} suppressHydrationWarning>
      <body className="antialiased">
        <Providers locale={validatedLocale} messages={messages}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
