"use client";

import { NextIntlClientProvider } from "next-intl";
import type { AbstractIntlMessages } from "next-intl";
import { usePathname } from "next/navigation";
import ReactQueryProvider from "@/providers/react-query-provider";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

interface ProvidersProps {
  children: React.ReactNode;
  messages: AbstractIntlMessages;
  locale: string;
}

export default function Providers({
  children,
  messages,
  locale,
}: ProvidersProps) {
  const pathname = usePathname();

  // Vérifier si on est sur la page d'accueil (uniquement /fr ou /en)
  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <ReactQueryProvider>
        <Toaster position="top-right" />
        {isHomePage && <Navbar />}
        {children}
        <Footer />
      </ReactQueryProvider>
    </NextIntlClientProvider>
  );
}