"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Search,
  ChevronDown,
  Plane,
  Megaphone,
  HelpCircle,
  Clock,
  Globe,
  Shield,
  Users,
  Sparkles,
  CheckCircle2,
  MessageCircle,
  LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Types
interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

interface FAQCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const FAQAccordion = ({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Card
        className={`group overflow-hidden border-2 transition-all duration-300 ${
          isOpen
            ? "border-primary/50 shadow-lg"
            : "border-border hover:border-primary/30 hover:shadow-md"
        }`}
      >
        <button
          onClick={onToggle}
          className="w-full text-left p-6 flex items-start gap-4 transition-all duration-300"
        >
          <div className="flex-shrink-0 mt-1">
            <div
              className={`w-8 h-8 rounded-lg bg-gradient-to-br ${
                isOpen
                  ? "from-primary to-primary/60"
                  : "from-primary/20 to-primary/10"
              } flex items-center justify-center transition-all duration-300`}
            >
              <HelpCircle
                className={`w-4 h-4 ${
                  isOpen ? "text-white" : "text-primary"
                } transition-colors duration-300`}
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className={`text-base md:text-lg font-semibold mb-1 transition-colors duration-300 ${
                isOpen
                  ? "text-primary"
                  : "text-foreground group-hover:text-primary"
              }`}
            >
              {item.question}
            </h3>
            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {item.tags.map((tag, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="text-xs bg-muted/50"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0"
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <CardContent className="px-6 pb-6 pt-0">
                <div className="pl-12">
                  <div className="h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent mb-4" />
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {item.answer}
                  </p>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

const CategoryCard = ({
  category,
  isActive,
  onClick,
  count,
  t,
}: {
  category: FAQCategory;
  isActive: boolean;
  onClick: () => void;
  count: number;
  t: ReturnType<typeof useTranslations<"faq">>;
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
        isActive
          ? "border-primary/50 shadow-lg bg-primary/5"
          : "border-border hover:border-primary/30 bg-card"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-xl ${category.gradient} flex items-center justify-center flex-shrink-0 shadow-md`}
        >
          <category.icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold mb-1 text-sm md:text-base">
            {category.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            {count}{" "}
            {count === 1
              ? t("filters.questionSingular")
              : t("filters.questionPlural")}
          </p>
        </div>
      </div>
    </motion.button>
  );
};

const StatCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
      className="bg-card border-2 border-border rounded-2xl p-6 text-center hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
    >
      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
};

export default function FAQPage() {
  const t = useTranslations("faq");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openItemId, setOpenItemId] = useState<number | null>(null);

  // Categories
  const categories: FAQCategory[] = [
    {
      id: "all",
      name: t("categories.all"),
      icon: HelpCircle,
      color: "bg-blue-500",
      gradient: "bg-gradient-to-br from-blue-500 to-blue-700",
    },
    {
      id: "immigration",
      name: t("categories.immigration"),
      icon: Plane,
      color: "bg-indigo-500",
      gradient: "bg-gradient-to-br from-indigo-500 to-purple-600",
    },
    {
      id: "services",
      name: t("categories.services"),
      icon: Megaphone,
      color: "bg-pink-500",
      gradient: "bg-gradient-to-br from-pink-500 to-rose-600",
    },
    {
      id: "general",
      name: t("categories.general"),
      icon: Globe,
      color: "bg-green-500",
      gradient: "bg-gradient-to-br from-green-500 to-emerald-600",
    },
  ];

  // FAQ Data from translations
  const faqData: FAQItem[] = t.raw("questions") as FAQItem[];

  // Filter FAQ based on search and category
  const filteredFAQ = faqData.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Get count per category
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === "all") return faqData.length;
    return faqData.filter((item) => item.category === categoryId).length;
  };

  const stats = [
    { icon: HelpCircle, label: t("stats.questions"), value: "25+" },
    { icon: Clock, label: t("stats.availability"), value: "24/7" },
    { icon: Users, label: t("stats.experts"), value: "4" },
    { icon: CheckCircle2, label: t("stats.satisfaction"), value: "98%" },
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
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
              {t("hero.subtitle")}
            </p>

            {/* Search Bar */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t("filters.search")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-base rounded-2xl border-2 focus:border-primary/50 transition-colors"
                />
              </div>
            </motion.div> */}
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

      {/* Categories Section */}
      <section className="py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">
              {t("categoriesSection.title")}
            </h2>
            <p className="text-muted-foreground text-center">
              {t("categoriesSection.subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                isActive={selectedCategory === category.id}
                onClick={() => setSelectedCategory(category.id)}
                count={getCategoryCount(category.id)}
                t={t}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {filteredFAQ.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  {t("noResults.title")}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {t("noResults.subtitle")}
                </p>
                <Button size="lg">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {t("noResults.cta")}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-4"
              >
                {filteredFAQ.map((item, index) => (
                  <FAQAccordion
                    key={item.id}
                    item={item}
                    index={index}
                    isOpen={openItemId === item.id}
                    onToggle={() =>
                      setOpenItemId(openItemId === item.id ? null : item.id)
                    }
                  />
                ))}
              </motion.div>
            )}
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
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {t("cta.title")}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
              {t("cta.subtitle")}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="h-14 px-10 text-base group">
                <MessageCircle className="w-5 h-5 mr-2" />
                {t("cta.primary")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-10 text-base"
              >
                <Shield className="w-5 h-5 mr-2" />
                {t("cta.secondary")}
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="flex flex-col items-center gap-2">
                <Clock className="w-8 h-8 text-primary" />
                <span className="font-semibold">
                  {t("cta.features.fast.title")}
                </span>
                <span className="text-muted-foreground">
                  {t("cta.features.fast.description")}
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Shield className="w-8 h-8 text-primary" />
                <span className="font-semibold">
                  {t("cta.features.expert.title")}
                </span>
                <span className="text-muted-foreground">
                  {t("cta.features.expert.description")}
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <CheckCircle2 className="w-8 h-8 text-primary" />
                <span className="font-semibold">
                  {t("cta.features.free.title")}
                </span>
                <span className="text-muted-foreground">
                  {t("cta.features.free.description")}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
