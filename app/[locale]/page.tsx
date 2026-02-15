"use client";

import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
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
  title: string;
  description: string;
  programs: string;
  cta: string;
  gradient: string;
  flag: string;
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
        <motion.div
          className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${service.gradient}`}
          animate={{ opacity: isHovered ? 0.1 : 0 }}
        />
        <div
          className={`absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 ${service.gradient} opacity-10 rounded-bl-full`}
        />
        <CardHeader className="relative z-10">
          <motion.div
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? 5 : 0,
            }}
            transition={{ duration: 0.3 }}
            className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl ${service.gradient} flex items-center justify-center mb-3 sm:mb-4 shadow-lg`}
          >
            <service.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </motion.div>
          <CardTitle className="text-lg sm:text-2xl mb-2 group-hover:text-primary transition-colors">
            {service.title}
          </CardTitle>
          <CardDescription className="text-sm sm:text-base leading-relaxed">
            {service.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 space-y-3 sm:space-y-4">
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
}: {
  destination: Destination;
  index: number;
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
          <Button className="w-full group/btn" variant="outline">
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
  t,
}: {
  feature: WhyUsFeature;
  index: number;
  t: ReturnType<typeof useTranslations<"HomePage">>;
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
    { icon: Award, value: "2025", label: t("stats.experience") },
    { icon: Sparkles, value: "6+", label: t("stats.services") },
    { icon: Globe, value: "3", label: t("stats.countries") },
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
      title: t("destinations.canada.title"),
      description: t("destinations.canada.description"),
      programs: t("destinations.canada.programs"),
      cta: t("destinations.canada.cta"),
      gradient: "bg-gradient-to-br from-red-500 to-red-700",
      flag: "🇨🇦",
    },
    {
      title: t("destinations.belgium.title"),
      description: t("destinations.belgium.description"),
      programs: t("destinations.belgium.programs"),
      cta: t("destinations.belgium.cta"),
      gradient: "bg-gradient-to-br from-yellow-500 to-amber-600",
      flag: "🇧🇪",
    },
    {
      title: t("destinations.france.title"),
      description: t("destinations.france.description"),
      programs: t("destinations.france.programs"),
      cta: t("destinations.france.cta"),
      gradient: "bg-gradient-to-br from-blue-600 to-indigo-700",
      flag: "🇫🇷",
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
      {/* HERO SECTION */}
      <section className="relative py-12 sm:py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

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
              className="inline-block mb-4 sm:mb-6"
            >
              <Badge
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold"
                variant="outline"
              >
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                {t("hero.badge")}
              </Badge>
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                {t("hero.title")}
              </span>
              <br />
              <span className="text-foreground text-2xl sm:text-3xl md:text-5xl lg:text-6xl">
                {t("hero.titleHighlight")}
              </span>
            </h1>

            <p className="text-sm sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto px-4">
              {t("hero.subtitle")}
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center px-4"
            >
              <Button
                size="lg"
                className="h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base group w-full sm:w-auto"
                asChild
              >
                <a href="#contact">
                  {t("hero.ctaPrimary")}
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base w-full sm:w-auto"
                asChild
              >
                <a href="#services">{t("hero.ctaSecondary")}</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600 w-full sm:w-auto"
                asChild
              >
                <a
                  href="https://wa.me/237699992818"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  {t("hero.ctaWhatsApp")}
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-12 sm:py-16 border-y border-border/50 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <StatCardComponent key={index} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
          >
            <Badge className="mb-4" variant="outline">
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

      {/* PROCESS SECTION */}
      <section className="py-12 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
          >
            <Badge className="mb-4" variant="outline">
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

      {/* DESTINATIONS SECTION */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
          >
            <Badge className="mb-4" variant="outline">
              {t("destinations.badge")}
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4">
              {t("destinations.title")}
            </h2>
            <p className="text-sm sm:text-lg text-muted-foreground">
              {t("destinations.subtitle")}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {destinations.map((destination, index) => (
              <DestinationCard
                key={index}
                destination={destination}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* WHY US SECTION */}
      <section className="py-12 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
          >
            <Badge className="mb-4" variant="outline">
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
              <WhyUsFeatureCard
                key={index}
                feature={feature}
                index={index}
                t={t}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
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
                size="lg"
                className="h-12 sm:h-14 px-8 sm:px-10 text-sm sm:text-base group w-full sm:w-auto"
                asChild
              >
                <a  href="#contact">
                  {t("cta.primary")}
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </a>
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

      {/* CONTACT SECTION */}
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
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
