"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Locale, routing, usePathname, useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import ReactCountryFlag from "react-country-flag";

type Props = {
  children?: ReactNode;
  defaultValue: string;
  label: string;
  localeFlags: Record<string, string>;
  localeNames: Record<string, string>;
};

const Flag = ({
  locale,
  size = "md",
  localeFlags,
}: {
  locale: string;
  size?: "sm" | "md" | "lg";
  localeFlags: Record<string, string>;
}) => {
  const sizeMap = {
    sm: 20,
    md: 24,
    lg: 40,
  };

  return (
    <ReactCountryFlag
      countryCode={localeFlags[locale] || "UN"}
      svg
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
      }}
    />
  );
};

export default function LocaleSwitcherSelect({
  defaultValue,
  label,
  localeFlags,
  localeNames,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  function onSelectChange(nextLocale: string) {
    router.replace({ pathname, params } as any, {
      locale: nextLocale as Locale,
    });
  }

  return (
    <Select defaultValue={defaultValue} onValueChange={onSelectChange}>
      <SelectTrigger
        className="w-[130px] h-11 border-2 border-primary/60 bg-background hover:bg-primary/5 hover:border-primary focus:ring-2 focus:ring-primary/30 focus:ring-offset-0 transition-all duration-200 rounded-xl font-semibold shadow-sm"
        aria-label={label}
      >
        <SelectValue>
          <div className="flex items-center justify-center w-full">
            {/* 🔥 On affiche UNIQUEMENT le flag */}
            <Flag locale={defaultValue} size="md" localeFlags={localeFlags} />
          </div>
        </SelectValue>
      </SelectTrigger>

      <SelectContent className="min-w-[240px] rounded-2xl border-2 border-border/50 bg-background shadow-2xl p-2">
        {routing.locales.map((locale, index) => (
          <motion.div
            key={locale}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, delay: index * 0.05 }}
          >
            <SelectItem
              value={locale}
              className="cursor-pointer rounded-xl mb-1 hover:bg-muted focus:bg-muted transition-all duration-200 py-4 px-4 relative"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    <Flag locale={locale} size="lg" localeFlags={localeFlags} />
                  </div>

                  <div className="flex flex-col items-start gap-0.5">
                    <span className="text-base font-semibold text-foreground">
                      {localeNames[locale] || locale.toUpperCase()}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {locale.toUpperCase()}
                    </span>
                  </div>
                </div>

                {locale === defaultValue && (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-5 h-5 text-primary"
                    fill="none"
                    strokeWidth="3"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </motion.svg>
                )}
              </div>
            </SelectItem>
          </motion.div>
        ))}
      </SelectContent>
    </Select>
  );
}
