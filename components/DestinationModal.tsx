"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  FileText,
  Target,
  Globe,
} from "lucide-react";

interface DestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: "canada" | "europe" | null;
}

export default function DestinationModal({
  isOpen,
  onClose,
  destination,
}: DestinationModalProps) {
  const t = useTranslations("destinations.modal");

  if (!destination) return null;

  const content = {
    canada: {
      flag: "🇨🇦",
      gradient: "from-red-500 to-red-700",
      title: t("canada.title"),
      subtitle: t("canada.subtitle"),
      intro: t("canada.intro"),
      whyTitle: t("canada.whyTitle"),
      whyPoints: t.raw("canada.whyPoints") as string[],
      whyTagline: t("canada.whyTagline"),
      servicesTitle: t("canada.servicesTitle"),
      services: [
        {
          icon: FileText,
          label: t("canada.services.residency"),
          detail: t("canada.services.residencyDetail"),
        },
        {
          icon: GraduationCap,
          label: t("canada.services.study"),
          detail: t("canada.services.studyDetail"),
        },
      ],
      methodTitle: t("canada.methodTitle"),
      methodSteps: t.raw("canada.methodSteps") as string[],
    },
    europe: {
      flag: "🌍",
      gradient: "from-blue-600 to-indigo-700",
      title: t("europe.title"),
      subtitle: t("europe.subtitle"),
      intro: t("europe.intro"),
      whyTitle: t("europe.whyTitle"),
      whyPoints: t.raw("europe.whyPoints") as string[],
      whyTagline: t("europe.whyTagline"),
      servicesTitle: t("europe.servicesTitle"),
      services: [
        {
          icon: GraduationCap,
          label: t("europe.services.studies"),
          detail: t("europe.services.studiesDetail"),
        },
        {
          icon: Briefcase,
          label: t("europe.services.work"),
          detail: t("europe.services.workDetail"),
        },
        {
          icon: Target,
          label: t("europe.services.orientation"),
          detail: t("europe.services.orientationDetail"),
        },
      ],
      methodTitle: t("europe.methodTitle"),
      methodSteps: t.raw("europe.methodSteps") as string[],
    },
  };

  const data = content[destination];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="bg-background rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className={`relative bg-gradient-to-br ${data.gradient} p-6 sm:p-8 rounded-t-2xl overflow-hidden`}
              >
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
                    backgroundSize: "30px 30px",
                  }}
                />
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="relative z-10">
                  <div className="text-5xl mb-3">{data.flag}</div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    {data.title}
                  </h2>
                  <p className="text-white/80 text-sm sm:text-base">
                    {data.subtitle}
                  </p>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* Intro */}
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  {data.intro}
                </p>

                {/* Pourquoi nous choisir */}
                <div>
                  <h3 className="font-bold text-base sm:text-lg mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    {data.whyTitle}
                  </h3>
                  <ul className="space-y-2">
                    {data.whyPoints.map((point, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-sm font-medium text-foreground italic">
                    {data.whyTagline}
                  </p>
                </div>

                {/* Services */}
                <div>
                  <h3 className="font-bold text-base sm:text-lg mb-3 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" />
                    {data.servicesTitle}
                  </h3>
                  <div className="grid gap-3">
                    {data.services.map((service, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border border-border"
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <service.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">
                            {service.label}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {service.detail}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Méthode */}
                <div>
                  <h3 className="font-bold text-base sm:text-lg mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    {data.methodTitle}
                  </h3>
                  <div className="space-y-2">
                    {data.methodSteps.map((step, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {i + 1}
                        </div>
                        <span className="text-muted-foreground">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
