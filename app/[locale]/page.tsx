"use client";

import { useTranslations } from "next-intl";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Plane,
  GraduationCap,
  Palette,
  Megaphone,
  FileText,
  ShoppingCart,
  ArrowRight,
  CheckCircle2,
  Clock,
  Shield,
  Users,
  Sparkles,
  Globe,
  Award,
  TrendingUp,
  Zap,
  Target,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  FileCheck,
  DollarSign,
  Heart,
  Star,
  LucideIcon,
  X,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import AppointmentModal from "@/components/AppointmentModal";
import DiagnosticModal from "@/components/DiagnosticModal";

// ========================================
// TYPES
// ========================================
interface ServiceCard {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  gradient: string;
}

interface StatCard {
  icon: LucideIcon;
  value: string;
  label: string;
}

interface WhyUsFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface Destination {
  key: "canada" | "europe";
  title: string;
  description: string;
  programs: string;
  cta: string;
  gradient: string;
  flag: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

// ========================================
// ANIMATION VARIANTS
// ========================================
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// ========================================
// HERO SUB-COMPONENTS
// ========================================

function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 4,
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `rgba(28, 169, 201, ${Math.random() * 0.4 + 0.15})`,
            boxShadow: `0 0 ${p.size * 3}px rgba(28, 169, 201, 0.5)`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.9, 0.3],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function AnimatedGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(28,169,201,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(28,169,201,1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      <motion.div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(28,169,201,0.18) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(28,169,201,0.12) 0%, transparent 70%)",
        }}
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.9, 0.5] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(28,169,201,0.08) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(28,169,201,0.4), transparent)",
        }}
        animate={{ top: ["0%", "100%"] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 2,
        }}
      />
    </div>
  );
}

function MouseFollower() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 160);
      mouseY.set(e.clientY - 160);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed pointer-events-none z-0 w-80 h-80 rounded-full"
      style={{
        x: springX,
        y: springY,
        background:
          "radial-gradient(circle, rgba(28,169,201,0.08) 0%, transparent 70%)",
      }}
    />
  );
}

function MagneticBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative inline-block">
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: "-2px",
          background:
            "conic-gradient(from 0deg, transparent 60%, rgba(28,169,201,0.7) 80%, transparent 100%)",
          padding: "2px",
          borderRadius: "9999px",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-full h-full rounded-full bg-background" />
      </motion.div>
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: "-6px",
          background:
            "conic-gradient(from 180deg, transparent 60%, rgba(28,169,201,0.35) 80%, transparent 100%)",
          borderRadius: "9999px",
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: [
            "0 0 0 0px rgba(28,169,201,0.6)",
            "0 0 0 10px rgba(28,169,201,0)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ========================================
// DESTINATION MODAL
// ========================================

function DestinationModal({
  isOpen,
  onClose,
  destination,
  t,
}: {
  isOpen: boolean;
  onClose: () => void;
  destination: "canada" | "europe" | null;
  t: ReturnType<typeof useTranslations<"HomePage">>;
}) {
  if (!destination) return null;

  const isCanada = destination === "canada";

  const modalData = {
    canada: {
      flag: "🇨🇦",
      gradient: "from-red-500 to-red-700",
      title: t("destinations.modal.canada.title"),
      subtitle: t("destinations.modal.canada.subtitle"),
      intro: t("destinations.modal.canada.intro"),
      whyTitle: t("destinations.modal.canada.whyTitle"),
      whyPoints: t.raw("destinations.modal.canada.whyPoints") as string[],
      whyTagline: t("destinations.modal.canada.whyTagline"),
      servicesTitle: t("destinations.modal.canada.servicesTitle"),
      services: [
        {
          icon: FileText,
          label: t("destinations.modal.canada.services.residency"),
          detail: t("destinations.modal.canada.services.residencyDetail"),
        },
        {
          icon: GraduationCap,
          label: t("destinations.modal.canada.services.study"),
          detail: t("destinations.modal.canada.services.studyDetail"),
        },
      ],
      methodTitle: t("destinations.modal.canada.methodTitle"),
      methodSteps: t.raw("destinations.modal.canada.methodSteps") as string[],
      cta: t("destinations.modal.canada.cta"),
      whatsapp: t("destinations.modal.canada.whatsapp"),
    },
    europe: {
      flag: "🌍",
      gradient: "from-blue-600 to-indigo-700",
      title: t("destinations.modal.europe.title"),
      subtitle: t("destinations.modal.europe.subtitle"),
      intro: t("destinations.modal.europe.intro"),
      whyTitle: t("destinations.modal.europe.whyTitle"),
      whyPoints: t.raw("destinations.modal.europe.whyPoints") as string[],
      whyTagline: t("destinations.modal.europe.whyTagline"),
      servicesTitle: t("destinations.modal.europe.servicesTitle"),
      services: [
        {
          icon: GraduationCap,
          label: t("destinations.modal.europe.services.studies"),
          detail: t("destinations.modal.europe.services.studiesDetail"),
        },
        {
          icon: Briefcase,
          label: t("destinations.modal.europe.services.work"),
          detail: t("destinations.modal.europe.services.workDetail"),
        },
        {
          icon: Target,
          label: t("destinations.modal.europe.services.orientation"),
          detail: t("destinations.modal.europe.services.orientationDetail"),
        },
      ],
      methodTitle: t("destinations.modal.europe.methodTitle"),
      methodSteps: t.raw("destinations.modal.europe.methodSteps") as string[],
      cta: t("destinations.modal.europe.cta"),
      whatsapp: t("destinations.modal.europe.whatsapp"),
    },
  };

  const data = modalData[destination];

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

                {/* Pourquoi nous */}
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
                  <p className="mt-3 text-sm font-semibold text-foreground italic">
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

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1 h-11 bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600"
                    asChild
                  >
                    <a
                      href="https://wa.me/237699992818"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="mr-2 w-4 h-4" />
                      {data.whatsapp}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ========================================
// UTILITY COMPONENTS
// ========================================

const StatCardComponent = ({ icon: Icon, value, label }: StatCard) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
      <div className="relative bg-card border-2 border-border rounded-2xl p-4 sm:p-6 hover:border-primary/50 transition-all duration-300">
        <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-2 sm:mb-3" />
        <div className="text-2xl sm:text-3xl font-bold mb-1">{value}</div>
        <div className="text-xs sm:text-sm text-muted-foreground">{label}</div>
      </div>
    </motion.div>
  );
};

const ServiceCardComponent = ({
  service,
  index,
}: {
  service: ServiceCard;
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);

  const serviceImages: Record<string, string> = {
    immigration: "/services/Immigration.jpg",
    digital: "/services/Marketing-digital.jpeg",
    infography: "/services/infography.jpeg",
    secretariat: "/services/Assistance-virtuelle.jpeg",
    commerce: "/services/Commerce-général.jpeg",
    consulting: "/services/bg.jpeg",
  };

  const serviceKeys = [
    "immigration",
    "digital",
    "infography",
    "secretariat",
    "commerce",
    "consulting",
  ];
  const imageKey = serviceKeys[index] || "immigration";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="group relative h-full overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl">
        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={serviceImages[imageKey] || "/images/default.jpg"}
            alt={service.title}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.15 : 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <motion.div
            animate={{ scale: isHovered ? 1.1 : 1, y: isHovered ? -5 : 0 }}
            transition={{ duration: 0.3 }}
            className={`absolute bottom-4 left-4 w-14 h-14 rounded-xl ${service.gradient} flex items-center justify-center shadow-lg backdrop-blur-sm`}
          >
            <service.icon className="w-7 h-7 text-white" />
          </motion.div>
        </div>

        <motion.div
          className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${service.gradient}`}
          animate={{ opacity: isHovered ? 0.1 : 0 }}
        />
        <div
          className={`absolute top-48 right-0 w-20 h-20 sm:w-24 sm:h-24 ${service.gradient} opacity-10 rounded-bl-full`}
        />

        <CardHeader className="relative z-10 pt-6">
          <CardTitle className="text-lg sm:text-2xl mb-2 group-hover:text-primary transition-colors">
            {service.title}
          </CardTitle>
          <CardDescription className="text-sm sm:text-base leading-relaxed">
            {service.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="relative z-10 space-y-3 sm:space-y-4 pb-6">
          <ul className="space-y-1.5 sm:space-y-2">
            {service.features.map((feature, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-xs sm:text-sm"
              >
                <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </Card>
    </motion.div>
  );
};

const DestinationCard = ({
  destination,
  index,
  onOpen,
}: {
  destination: Destination;
  index: number;
  onOpen: (key: "canada" | "europe") => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl h-full">
        <div
          className={`absolute inset-0 ${destination.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}
        />
        <div className="absolute top-4 right-4 text-4xl sm:text-6xl opacity-10 group-hover:opacity-20 transition-opacity">
          {destination.flag}
        </div>
        <CardHeader className="relative z-10">
          <CardTitle className="text-xl sm:text-2xl mb-2 group-hover:text-primary transition-colors">
            {destination.title}
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {destination.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <GraduationCap className="w-4 h-4 text-primary" />
            <span>{destination.programs}</span>
          </div>
          <Button
            className="w-full group/btn"
            variant="outline"
            onClick={() => onOpen(destination.key)}
          >
            {destination.cta}
            <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ProcessStep = ({
  icon: Icon,
  title,
  description,
  index,
  t,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
  t: ReturnType<typeof useTranslations<"HomePage">>;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative"
    >
      <div className="bg-card border-2 border-border rounded-2xl p-4 sm:p-6 text-center hover:border-primary/50 transition-all duration-300 hover:shadow-lg h-full">
        <div className="bg-gradient-to-br from-primary to-primary/60 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        </div>
        <div className="text-xs sm:text-sm font-bold text-primary mb-2">
          {t("process.step")} {index + 1}
        </div>
        <h3 className="font-bold mb-2 text-sm sm:text-base">{title}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      {index < 4 && (
        <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
      )}
    </motion.div>
  );
};

const WhyUsFeatureCard = ({
  feature,
  index,
}: {
  feature: WhyUsFeature;
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-card border-2 border-border rounded-2xl p-4 sm:p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg text-center group"
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
        <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
      </div>
      <h3 className="font-bold mb-2 text-sm sm:text-lg">{feature.title}</h3>
      <p className="text-xs sm:text-sm text-muted-foreground">
        {feature.description}
      </p>
    </motion.div>
  );
};

// ========================================
// MAIN COMPONENT
// ========================================
export default function HomePage() {
  const t = useTranslations("HomePage");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [destinationModal, setDestinationModal] = useState<
    "canada" | "europe" | null
  >(null);

  const btnX = useMotionValue(0);
  const btnY = useMotionValue(0);
  const springBtnX = useSpring(btnX, { stiffness: 200, damping: 15 });
  const springBtnY = useSpring(btnY, { stiffness: 200, damping: 15 });

  const handleBtnMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    btnX.set((e.clientX - (rect.left + rect.width / 2)) * 0.25);
    btnY.set((e.clientY - (rect.top + rect.height / 2)) * 0.25);
  };
  const handleBtnLeave = () => {
    btnX.set(0);
    btnY.set(0);
  };

  const services: ServiceCard[] = [
    {
      icon: Plane,
      title: t("services.immigration.title"),
      description: t("services.immigration.description"),
      features: t.raw("services.immigration.features") as string[],
      gradient: "bg-gradient-to-br from-blue-500 to-blue-700",
    },
    {
      icon: Megaphone,
      title: t("services.digital.title"),
      description: t("services.digital.description"),
      features: t.raw("services.digital.features") as string[],
      gradient: "bg-gradient-to-br from-pink-500 to-rose-600",
    },
    {
      icon: Palette,
      title: t("services.infography.title"),
      description: t("services.infography.description"),
      features: t.raw("services.infography.features") as string[],
      gradient: "bg-gradient-to-br from-purple-500 to-violet-600",
    },
    {
      icon: FileText,
      title: t("services.secretariat.title"),
      description: t("services.secretariat.description"),
      features: t.raw("services.secretariat.features") as string[],
      gradient: "bg-gradient-to-br from-green-500 to-emerald-600",
    },
    {
      icon: ShoppingCart,
      title: t("services.commerce.title"),
      description: t("services.commerce.description"),
      features: t.raw("services.commerce.features") as string[],
      gradient: "bg-gradient-to-br from-orange-500 to-red-500",
    },
    {
      icon: Users,
      title: t("services.consulting.title"),
      description: t("services.consulting.description"),
      features: t.raw("services.consulting.features") as string[],
      gradient: "bg-gradient-to-br from-indigo-500 to-purple-600",
    },
  ];

  const stats: StatCard[] = [
    { icon: Award, value: "2026", label: t("stats.experience") },
    { icon: Sparkles, value: "6+", label: t("stats.services") },
    { icon: Globe, value: "4", label: t("stats.countries") },
    { icon: Heart, value: "98%", label: t("stats.satisfaction") },
  ];

  const whyUsFeatures: WhyUsFeature[] = [
    {
      icon: Shield,
      title: t("whyUs.features.professionalism.title"),
      description: t("whyUs.features.professionalism.description"),
    },
    {
      icon: CheckCircle2,
      title: t("whyUs.features.transparency.title"),
      description: t("whyUs.features.transparency.description"),
    },
    {
      icon: Award,
      title: t("whyUs.features.confidentiality.title"),
      description: t("whyUs.features.confidentiality.description"),
    },
    {
      icon: Users,
      title: t("whyUs.features.support.title"),
      description: t("whyUs.features.support.description"),
    },
    {
      icon: Target,
      title: t("whyUs.features.personalized.title"),
      description: t("whyUs.features.personalized.description"),
    },
    {
      icon: Zap,
      title: t("whyUs.features.reactivity.title"),
      description: t("whyUs.features.reactivity.description"),
    },
    {
      icon: TrendingUp,
      title: t("whyUs.features.experience.title"),
      description: t("whyUs.features.experience.description"),
    },
    {
      icon: Star,
      title: t("whyUs.features.results.title"),
      description: t("whyUs.features.results.description"),
    },
  ];

  const destinations: Destination[] = [
    {
      key: "canada",
      title: t("destinations.canada.title"),
      description: t("destinations.canada.description"),
      programs: t("destinations.canada.programs"),
      cta: t("destinations.canada.cta"),
      gradient: "bg-gradient-to-br from-red-500 to-red-700",
      flag: "🇨🇦",
    },
    {
      key: "europe",
      title: t("destinations.europe.title"),
      description: t("destinations.europe.description"),
      programs: t("destinations.europe.programs"),
      cta: t("destinations.europe.cta"),
      gradient: "bg-gradient-to-br from-blue-600 to-indigo-700",
      flag: "🌍",
    },
  ];

  const processSteps = [
    {
      icon: Target,
      title: t("process.steps.contact.title"),
      description: t("process.steps.contact.description"),
    },
    {
      icon: FileCheck,
      title: t("process.steps.diagnostic.title"),
      description: t("process.steps.diagnostic.description"),
    },
    {
      icon: FileText,
      title: t("process.steps.quote.title"),
      description: t("process.steps.quote.description"),
    },
    {
      icon: DollarSign,
      title: t("process.steps.payment.title"),
      description: t("process.steps.payment.description"),
    },
    {
      icon: Zap,
      title: t("process.steps.execution.title"),
      description: t("process.steps.execution.description"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* ============================================================ */}
      {/* HERO SECTION                                                 */}
      {/* ============================================================ */}
      <MouseFollower />

      <section
        className="relative py-12 sm:py-20 lg:py-32 overflow-hidden"
        style={{ isolation: "isolate" }}
      >
        <AnimatedGrid />
        <FloatingParticles />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block mb-6 sm:mb-8"
            >
              <MagneticBadge>
                <Badge
                  className="px-4 py-2 text-xs sm:text-sm font-semibold relative z-10"
                  style={{
                    border: "1px solid rgba(28,169,201,0.4)",
                    background: "rgba(28,169,201,0.08)",
                    color: "#1CA9C9",
                  }}
                  variant="outline"
                >
                  <motion.span
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    className="inline-block mr-2"
                  >
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                  </motion.span>
                  {t("hero.badge")}
                </Badge>
              </MagneticBadge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6"
            >
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #1CA9C9 0%, #0e7fa0 50%, #1CA9C9 100%)",
                  backgroundSize: "200% auto",
                  animation: "heroGradientShift 4s linear infinite",
                }}
              >
                {t("hero.title")}
              </span>
              <br />
              <span className="text-foreground text-2xl sm:text-3xl md:text-5xl lg:text-6xl">
                {t("hero.titleHighlight")}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="text-sm sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto px-4"
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center px-4"
            >
              <motion.div
                onClick={() => setIsDiagnosticOpen(true)}
                style={{
                  x: springBtnX,
                  y: springBtnY,
                  background: "linear-gradient(135deg, #1CA9C9, #0e7fa0)",
                  boxShadow: "0 4px 20px rgba(28,169,201,0.35)",
                  padding: "12px",
                  borderRadius: "8px",
                }}
                onMouseMove={handleBtnMove}
                onMouseLeave={handleBtnLeave}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="relative inline-flex items-center justify-center h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base font-semibold rounded-xl text-white overflow-hidden group w-full sm:w-auto cursor-pointer"
              >
                <motion.span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
                    backgroundSize: "200% 100%",
                  }}
                  animate={{ backgroundPosition: ["-100% 0", "200% 0"] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                {t("hero.ctaPrimary")}
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </motion.div>

              <Link href="/services">
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base font-semibold rounded-xl border border-border text-foreground hover:border-[#1CA9C9] hover:text-[#1CA9C9] transition-colors w-full sm:w-auto"
                >
                  {t("hero.ctaSecondary")}
                </motion.div>
              </Link>

              <motion.a
                href="https://wa.me/237699992818"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base font-semibold rounded-xl bg-green-500 hover:bg-green-600 text-white transition-colors w-full sm:w-auto"
                style={{ boxShadow: "0 4px 16px rgba(34,197,94,0.3)" }}
              >
                <MessageCircle className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                {t("hero.ctaWhatsApp")}
              </motion.a>
            </motion.div>
          </motion.div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(28,169,201,0.03))",
          }}
        />
      </section>

      <style>{`
        @keyframes heroGradientShift {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      {/* ============================================================ */}
      {/* STATS SECTION                                                */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-16 border-y border-border/50 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <StatCardComponent key={index} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SERVICES SECTION                                             */}
      {/* ============================================================ */}
      <section id="services" className="py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
          >
            <Badge className="mb-4 text-sm sm:text-base md:text-lg font-semibold" variant="outline">
              {t("services.badge")}
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4">
              {t("services.title")}
            </h2>
            <p className="text-sm sm:text-lg text-muted-foreground">
              {t("services.subtitle")}
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {services.map((service, index) => (
              <ServiceCardComponent
                key={index}
                service={service}
                index={index}
              />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button size="lg" asChild>
              <Link href="/services">
                {t("services.cta")}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PROCESS SECTION                                              */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
          >
            <Badge className="mb-4 text-sm sm:text-base md:text-lg font-semibold" variant="outline">
              {t("process.badge")}
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4">
              {t("process.title")}
            </h2>
            <p className="text-sm sm:text-lg text-muted-foreground">
              {t("process.subtitle")}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {processSteps.map((step, index) => (
              <ProcessStep
                key={index}
                icon={step.icon}
                title={step.title}
                description={step.description}
                index={index}
                t={t}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* DESTINATIONS SECTION                                         */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
          >
            <Badge className="mb-4 text-sm sm:text-base md:text-lg font-semibold" variant="outline">
              {t("destinations.badge")}
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4">
              {t("destinations.title")}
            </h2>
            <p className="text-sm sm:text-lg text-muted-foreground">
              {t("destinations.subtitle")}
            </p>
          </motion.div>

          {/* 2 cartes centrées */}
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto">
            {destinations.map((destination, index) => (
              <DestinationCard
                key={index}
                destination={destination}
                index={index}
                onOpen={(key) => setDestinationModal(key)}
             
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* WHY US SECTION                                               */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
          >
            <Badge className="mb-4 text-sm sm:text-base md:text-lg font-semibold" variant="outline">
              {t("whyUs.badge")}
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4">
              {t("whyUs.title")}
            </h2>
            <p className="text-sm sm:text-lg text-muted-foreground">
              {t("whyUs.subtitle")}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {whyUsFeatures.map((feature, index) => (
              <WhyUsFeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CTA SECTION                                                  */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-primary/10 via-primary/5 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6">
              {t("cta.title")}
            </h2>
            <p className="text-sm sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 leading-relaxed px-4">
              {t("cta.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4">
              <Button
                onClick={() => setIsDiagnosticOpen(true)}
                size="lg"
                className="h-12 sm:h-14 px-8 sm:px-10 text-sm sm:text-base group w-full sm:w-auto"
              >
                {t("cta.primary")}
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 sm:h-14 px-8 sm:px-10 text-sm sm:text-base w-full sm:w-auto"
                onClick={() => setIsModalOpen(true)}
              >
                {t("cta.secondary")}
              </Button>
              <Button
                size="lg"
                className="h-12 sm:h-14 px-8 sm:px-10 text-sm sm:text-base bg-green-500 hover:bg-green-600 w-full sm:w-auto"
                asChild
              >
                <a
                  href="https://wa.me/237699992818"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  {t("cta.whatsapp")}
                </a>
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 sm:gap-8 justify-center items-center text-xs sm:text-sm text-muted-foreground px-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                <span>{t("cta.trust.freeQuote")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                <span>{t("cta.trust.noCommitment")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                <span>{t("cta.trust.quickResponse")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                <span>{t("cta.trust.payment")}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CONTACT SECTION                                              */}
      {/* ============================================================ */}
      <section id="contact" className="py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4">
              {t("contact.title")}
            </h2>
            <p className="text-sm sm:text-lg text-muted-foreground">
              {t("contact.subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {/* Adresse */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
                <CardTitle className="text-base sm:text-lg">
                  {t("contact.address.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {t("contact.address.line1")}
                  <br />
                  {t("contact.address.line2")}
                  <br />
                  {t("contact.address.line3")}
                </p>
              </CardContent>
            </Card>

            {/* Téléphone */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Phone className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
                <CardTitle className="text-base sm:text-lg">
                  {t("contact.phone.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <a
                  href={`tel:${t("contact.phone.primary")}`}
                  className="block text-xs sm:text-sm text-primary hover:underline"
                >
                  {t("contact.phone.primary")}
                </a>
                <a
                  href={`tel:${t("contact.phone.secondary")}`}
                  className="block text-xs sm:text-sm text-muted-foreground hover:text-primary hover:underline"
                >
                  {t("contact.phone.secondary")}
                </a>
              </CardContent>
            </Card>

            {/* Email */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Mail className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
                <CardTitle className="text-base sm:text-lg">
                  {t("contact.email.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <a
                  href={`mailto:${t("contact.email.support")}`}
                  className="block text-xs sm:text-sm text-primary hover:underline break-all"
                >
                  {t("contact.email.support")}
                </a>
                <a
                  href={`mailto:${t("contact.email.director")}`}
                  className="block text-xs sm:text-sm text-muted-foreground hover:text-primary hover:underline break-all"
                >
                  {t("contact.email.director")}
                </a>
              </CardContent>
            </Card>

            {/* Horaires */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
                <CardTitle className="text-base sm:text-lg">
                  {t("contact.hours.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {t("contact.hours.weekdays")}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {t("contact.hours.saturday")}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {t("contact.hours.sunday")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* MODALS                                                       */}
      {/* ============================================================ */}
      <DestinationModal
        isOpen={destinationModal !== null}
        onClose={() => setDestinationModal(null)}
        destination={destinationModal}
        t={t}
      />
      <DiagnosticModal
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
      />
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
