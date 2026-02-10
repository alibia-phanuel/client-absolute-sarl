import type { Metadata } from "next";
import { Locale, routing } from "@/i18n/routing";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rejoignez ABSOLUTE SARL | Services, Freelances & Immigration",
  description:
    "ABSOLUTE SARL accompagne entreprises et particuliers à Douala et à l'international : services aux entreprises, mise à disposition de freelances qualifiés et accompagnement à l'immigration vers le Canada et la Belgique.",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // ← Changement ici : string au lieu de Locale
}) {
  // On await les params pour récupérer la locale
  const { locale } = await params;

  // Vérification de sécurité : on valide que c'est bien "en" ou "fr"
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // TypeScript sait maintenant que locale est bien "en" | "fr"
  const validatedLocale = locale as Locale;

  // Récupération des messages de traduction
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
