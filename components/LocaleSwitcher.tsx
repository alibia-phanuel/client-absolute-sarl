"use client";


import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import LocaleSwitcherSelect from "./LocaleSwitcherSelect";
import { motion } from "framer-motion";

const localeFlags: Record<string, string> = {
  en: "GB",
  fr: "FR",
  es: "ES",
  de: "DE",
  it: "IT",
  pt: "PT",
  ar: "SA",
  zh: "CN",
  ja: "JP",
  ko: "KR",
  ru: "RU",
  nl: "NL",
};

export const localeNames: Record<string, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  de: "Deutsch",
  it: "Italiano",
  pt: "Português",
  ar: "العربية",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
  ru: "Русский",
  nl: "Nederlands",
};

export default function LocaleSwitcher() {
  const locale = useLocale();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-2 group"
    >
      <motion.div
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <Globe className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </motion.div>

      <LocaleSwitcherSelect
        defaultValue={locale}
        label="Select a locale"
        localeFlags={localeFlags}
        localeNames={localeNames}
      />
    </motion.div>
  );
}
