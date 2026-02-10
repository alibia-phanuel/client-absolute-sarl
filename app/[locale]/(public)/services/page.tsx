"use client";

import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
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
  DollarSign,
  FileCheck,
  Users,
  Sparkles,
  Globe,
  Shield,
  Award,
  TrendingUp,
  Zap,
  Target,
  LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types
interface Service {
  id: string;
  icon: LucideIcon;
  title: string;
  shortDescription: string;
  longDescription: string;
  price: string;
  duration: string;
  prerequisites: string[];
  included: string[];
  notIncluded?: string[];
  advantages: string[];
  color: string;
  gradient: string;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const ServiceCard = ({
  service,
  index,
  t,
}: {
  service: Service;
  index: number;
  t: ReturnType<typeof useTranslations<"services">>;
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
        {/* Gradient background on hover */}
        <motion.div
          className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${service.gradient}`}
          animate={{
            opacity: isHovered ? 0.1 : 0,
          }}
        />

        {/* Decorative corner accent */}
        <div
          className={`absolute top-0 right-0 w-24 h-24 ${service.gradient} opacity-10 rounded-bl-full`}
        />

        <CardHeader className="relative z-10">
          <motion.div
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? 5 : 0,
            }}
            transition={{ duration: 0.3 }}
            className={`w-16 h-16 rounded-2xl ${service.gradient} flex items-center justify-center mb-4 shadow-lg`}
          >
            <service.icon className="w-8 h-8 text-white" />
          </motion.div>

          <CardTitle className="text-2xl mb-2 group-hover:text-primary transition-colors">
            {service.title}
          </CardTitle>
          <CardDescription className="text-base leading-relaxed">
            {service.shortDescription}
          </CardDescription>
        </CardHeader>

        <CardContent className="relative z-10 space-y-4">
          {/* Key details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">{service.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">{service.price}</span>
            </div>
          </div>

          {/* Advantages */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              {t("card.keyAdvantages")}
            </h4>
            <ul className="space-y-1.5">
              {service.advantages.slice(0, 3).map((advantage, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{advantage}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>

        <CardFooter className="relative z-10">
          <Button className="w-full group/btn" size="lg">
            {t("card.learnMore")}
            <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </CardFooter>

        {/* Hover effect beam */}
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

const StatCard = ({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
}) => {
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
      <div className="relative bg-card border-2 border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300">
        <Icon className="w-8 h-8 text-primary mb-3" />
        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </motion.div>
  );
};

// Nouveau composant pour les étapes du processus
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
  t: ReturnType<typeof useTranslations<"services">>;
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
      <div className="bg-card border-2 border-border rounded-2xl p-6 text-center hover:border-primary/50 transition-all duration-300 hover:shadow-lg h-full">
        <div className="bg-gradient-to-br from-primary to-primary/60 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div className="text-sm font-bold text-primary mb-2">
          {t("process.step")} {index + 1}
        </div>
        <h3 className="font-bold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {index < 4 && (
        <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
      )}
    </motion.div>
  );
};

// Nouveau composant pour les "Why Us" features
const WhyUsFeatureCard = ({
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
  t: ReturnType<typeof useTranslations<"services">>;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-card border-2 border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg text-center group"
    >
      <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <h3 className="font-bold mb-2 text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );
};

export default function ServicesPage() {
  const t = useTranslations("services");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Services data
  const services: Service[] = [
    {
      id: "canada",
      icon: Plane,
      title: t("services.canada.title"),
      shortDescription: t("services.canada.short"),
      longDescription: t("services.canada.long"),
      price: t("services.canada.price"),
      duration: t("services.canada.duration"),
      prerequisites: [],
      included: [],
      advantages: t.raw("services.canada.advantages") as string[],
      color: "bg-blue-500",
      gradient: "bg-gradient-to-br from-blue-500 to-blue-700",
    },
    {
      id: "belgium",
      icon: GraduationCap,
      title: t("services.belgium.title"),
      shortDescription: t("services.belgium.short"),
      longDescription: t("services.belgium.long"),
      price: t("services.belgium.price"),
      duration: t("services.belgium.duration"),
      prerequisites: [],
      included: [],
      advantages: t.raw("services.belgium.advantages") as string[],
      color: "bg-amber-500",
      gradient: "bg-gradient-to-br from-amber-500 to-orange-600",
    },
    {
      id: "france",
      icon: GraduationCap,
      title: t("services.france.title"),
      shortDescription: t("services.france.short"),
      longDescription: t("services.france.long"),
      price: t("services.france.price"),
      duration: t("services.france.duration"),
      prerequisites: [],
      included: [],
      advantages: t.raw("services.france.advantages") as string[],
      color: "bg-indigo-500",
      gradient: "bg-gradient-to-br from-indigo-500 to-purple-600",
    },
    {
      id: "digital",
      icon: Megaphone,
      title: t("services.digital.title"),
      shortDescription: t("services.digital.short"),
      longDescription: t("services.digital.long"),
      price: t("services.digital.price"),
      duration: t("services.digital.duration"),
      prerequisites: [],
      included: [],
      advantages: t.raw("services.digital.advantages") as string[],
      color: "bg-pink-500",
      gradient: "bg-gradient-to-br from-pink-500 to-rose-600",
    },
    {
      id: "infography",
      icon: Palette,
      title: t("services.infography.title"),
      shortDescription: t("services.infography.short"),
      longDescription: t("services.infography.long"),
      price: t("services.infography.price"),
      duration: t("services.infography.duration"),
      prerequisites: [],
      included: [],
      advantages: t.raw("services.infography.advantages") as string[],
      color: "bg-purple-500",
      gradient: "bg-gradient-to-br from-purple-500 to-violet-600",
    },
    {
      id: "secretariat",
      icon: FileText,
      title: t("services.secretariat.title"),
      shortDescription: t("services.secretariat.short"),
      longDescription: t("services.secretariat.long"),
      price: t("services.secretariat.price"),
      duration: t("services.secretariat.duration"),
      prerequisites: [],
      included: [],
      advantages: t.raw("services.secretariat.advantages") as string[],
      color: "bg-green-500",
      gradient: "bg-gradient-to-br from-green-500 to-emerald-600",
    },
    {
      id: "commerce",
      icon: ShoppingCart,
      title: t("services.commerce.title"),
      shortDescription: t("services.commerce.short"),
      longDescription: t("services.commerce.long"),
      price: t("services.commerce.price"),
      duration: t("services.commerce.duration"),
      prerequisites: [],
      included: [],
      advantages: t.raw("services.commerce.advantages") as string[],
      color: "bg-orange-500",
      gradient: "bg-gradient-to-br from-orange-500 to-red-500",
    },
  ];

  const stats = [
    { icon: Users, value: "1000+", label: t("stats.clients") },
    { icon: Globe, value: "3", label: t("stats.countries") },
    { icon: Award, value: "98%", label: t("stats.satisfaction") },
    { icon: TrendingUp, value: "24/7", label: t("stats.support") },
  ];

  const filteredServices =
    selectedCategory === "all"
      ? services
      : services.filter((s) => s.id.includes(selectedCategory));

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

  const whyUsFeatures = [
    {
      icon: Shield,
      title: t("whyUs.features.transparency.title"),
      description: t("whyUs.features.transparency.description"),
    },
    {
      icon: Users,
      title: t("whyUs.features.personalized.title"),
      description: t("whyUs.features.personalized.description"),
    },
    {
      icon: Award,
      title: t("whyUs.features.expertise.title"),
      description: t("whyUs.features.expertise.description"),
    },
    {
      icon: Zap,
      title: t("whyUs.features.reactivity.title"),
      description: t("whyUs.features.reactivity.description"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
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
              className="inline-block mb-6"
            >
              <Badge
                className="px-4 py-2 text-sm font-semibold"
                variant="outline"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {t("hero.badge")}
              </Badge>
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                {t("hero.title")}
              </span>
              <br />
              <span className="text-foreground">
                {t("hero.titleHighlight")}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
              {t("hero.subtitle")}
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Button size="lg" className="h-12 px-8 text-base group">
                {t("hero.ctaPrimary")}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base"
              >
                {t("hero.ctaSecondary")}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border/50 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t("portfolio.title")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t("portfolio.subtitle")}
            </p>
          </motion.div>

          <Tabs defaultValue="all" className="mb-12">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 h-auto p-1">
              <TabsTrigger value="all" className="py-3">
                {t("tabs.all")}
              </TabsTrigger>
              <TabsTrigger value="immigration" className="py-3">
                {t("tabs.immigration")}
              </TabsTrigger>
              <TabsTrigger value="digital" className="py-3">
                {t("tabs.digital")}
              </TabsTrigger>
              <TabsTrigger value="commerce" className="py-3">
                {t("tabs.others")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-12">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {services.map((service, index) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    index={index}
                    t={t}
                  />
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="immigration" className="mt-12">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {services
                  .filter((s) => ["canada", "belgium", "france"].includes(s.id))
                  .map((service, index) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      index={index}
                      t={t}
                    />
                  ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="digital" className="mt-12">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {services
                  .filter((s) => ["digital", "infography"].includes(s.id))
                  .map((service, index) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      index={index}
                      t={t}
                    />
                  ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="commerce" className="mt-12">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {services
                  .filter((s) => ["secretariat", "commerce"].includes(s.id))
                  .map((service, index) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      index={index}
                      t={t}
                    />
                  ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t("process.title")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t("process.subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-6 max-w-6xl mx-auto">
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

      {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t("whyUs.title")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t("whyUs.subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {whyUsFeatures.map((feature, index) => (
              <WhyUsFeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
                t={t}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-primary/5 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {t("cta.title")}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
              {t("cta.subtitle")}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="h-14 px-10 text-base group">
                {t("cta.primary")}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-10 text-base"
              >
                {t("cta.secondary")}
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap gap-8 justify-center items-center text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>{t("cta.trust.freeQuote")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>{t("cta.trust.noCommitment")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>{t("cta.trust.quickResponse")}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
