"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, Search, Tag } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Fake data pour le blog
const FAKE_BLOG_POSTS = [
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    title_fr: "Guide complet pour immigrer au Canada en 2026",
    title_en: "Complete Guide to Immigrating to Canada in 2026",
    content_fr:
      "Découvrez toutes les étapes essentielles pour réussir votre projet d'immigration au Canada. De la sélection du programme jusqu'à l'installation...",
    content_en:
      "Discover all the essential steps to succeed in your Canadian immigration project. From program selection to settlement...",
    imageUrl:
      "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&q=80",
    category_fr: "Immigration",
    category_en: "Immigration",
    author: {
      id: "b23b1d3b-6f2a-4d18-90e2-69adbb42e214",
      name: "Dilane Kamto",
      email: "dilane.kamto@absolutesarl.com",
    },
    createdAt: "2026-02-05T10:30:00.000Z",
    updatedAt: "2026-02-05T10:30:00.000Z",
  },
  {
    id: "b2c3d4e5-f6g7-8901-bcde-fg2345678901",
    title_fr: "5 erreurs à éviter dans votre dossier d'immigration",
    title_en: "5 Mistakes to Avoid in Your Immigration Application",
    content_fr:
      "Les erreurs courantes qui peuvent retarder ou compromettre votre dossier d'immigration. Apprenez à les identifier et à les éviter...",
    content_en:
      "Common mistakes that can delay or compromise your immigration application. Learn to identify and avoid them...",
    imageUrl:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
    category_fr: "Conseils",
    category_en: "Tips",
    author: {
      id: "c34c2d4c-7g3b-5e29-91f3-70bebb53f325",
      name: "Mike Tchabet",
      email: "mike.tchabet@absolutesarl.com",
    },
    createdAt: "2026-02-03T14:20:00.000Z",
    updatedAt: "2026-02-03T14:20:00.000Z",
  },
  {
    id: "c3d4e5f6-g7h8-9012-cdef-gh3456789012",
    title_fr: "Marketing digital : Comment booster votre visibilité en ligne",
    title_en: "Digital Marketing: How to Boost Your Online Visibility",
    content_fr:
      "Les stratégies éprouvées pour augmenter votre présence digitale et attirer plus de clients grâce au marketing en ligne...",
    content_en:
      "Proven strategies to increase your digital presence and attract more customers through online marketing...",
    imageUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    category_fr: "Marketing Digital",
    category_en: "Digital Marketing",
    author: {
      id: "d45d3e5d-8h4c-6f30-02g4-81cfcc64g436",
      name: "Adeline Ntouko",
      email: "adeline.ntouko@absolutesarl.com",
    },
    createdAt: "2026-02-01T09:15:00.000Z",
    updatedAt: "2026-02-01T09:15:00.000Z",
  },
  {
    id: "d4e5f6g7-h8i9-0123-defg-hi4567890123",
    title_fr: "Étudier en Belgique : Le guide complet des démarches",
    title_en: "Studying in Belgium: The Complete Guide to Procedures",
    content_fr:
      "Tout ce que vous devez savoir sur les études en Belgique : choix d'université, procédure d'admission, visa étudiant...",
    content_en:
      "Everything you need to know about studying in Belgium: university selection, admission process, student visa...",
    imageUrl:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
    category_fr: "Études à l'étranger",
    category_en: "Study Abroad",
    author: {
      id: "c34c2d4c-7g3b-5e29-91f3-70bebb53f325",
      name: "Mike Tchabet",
      email: "mike.tchabet@absolutesarl.com",
    },
    createdAt: "2026-01-28T11:45:00.000Z",
    updatedAt: "2026-01-28T11:45:00.000Z",
  },
  {
    id: "e5f6g7h8-i9j0-1234-efgh-ij5678901234",
    title_fr:
      "L'importance d'une identité visuelle forte pour votre entreprise",
    title_en: "The Importance of Strong Visual Identity for Your Business",
    content_fr:
      "Découvrez pourquoi investir dans une identité visuelle professionnelle est crucial pour le succès de votre entreprise...",
    content_en:
      "Discover why investing in professional visual identity is crucial for your business success...",
    imageUrl:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    category_fr: "Infographie",
    category_en: "Graphic Design",
    author: {
      id: "d45d3e5d-8h4c-6f30-02g4-81cfcc64g436",
      name: "Adeline Ntouko",
      email: "adeline.ntouko@absolutesarl.com",
    },
    createdAt: "2026-01-25T16:00:00.000Z",
    updatedAt: "2026-01-25T16:00:00.000Z",
  },
  {
    id: "f6g7h8i9-j0k1-2345-fghi-jk6789012345",
    title_fr: "Résidence permanente Canada : Les nouveaux quotas 2026",
    title_en: "Canada Permanent Residence: New 2026 Quotas",
    content_fr:
      "Analyse détaillée des nouveaux quotas d'immigration pour 2026 et leurs implications pour les candidats...",
    content_en:
      "Detailed analysis of new immigration quotas for 2026 and their implications for applicants...",
    imageUrl:
      "https://images.unsplash.com/photo-1485081669829-bacb8c7bb1f3?w=800&q=80",
    category_fr: "Immigration",
    category_en: "Immigration",
    author: {
      id: "b23b1d3b-6f2a-4d18-90e2-69adbb42e214",
      name: "Dilane Kamto",
      email: "dilane.kamto@absolutesarl.com",
    },
    createdAt: "2026-01-20T13:30:00.000Z",
    updatedAt: "2026-01-20T13:30:00.000Z",
  },
];

export default function BlogPage() {
  const t = useTranslations("blog");
  const locale = useLocale();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Obtenir les catégories uniques
  const categories = Array.from(
    new Set(
      FAKE_BLOG_POSTS.map((post) =>
        locale === "fr" ? post.category_fr : post.category_en,
      ),
    ),
  );

  // Filtrer les articles
  const filteredPosts = FAKE_BLOG_POSTS.filter((post) => {
    const title = locale === "fr" ? post.title_fr : post.title_en;
    const content = locale === "fr" ? post.content_fr : post.content_en;
    const category = locale === "fr" ? post.category_fr : post.category_en;

    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative py-20 overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-white/5" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {t("hero.title")}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              {t("hero.subtitle")}
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Filters Section */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={t("filters.search")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="w-full md:w-64">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("filters.allCategories")}
                    </SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results count */}
            <div className="mt-4 text-sm text-muted-foreground">
              {filteredPosts.length} {t("filters.results")}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {filteredPosts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <p className="text-xl text-muted-foreground">
                  {t("noResults")}
                </p>
              </motion.div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post, index) => {
                  const title = locale === "fr" ? post.title_fr : post.title_en;
                  const content =
                    locale === "fr" ? post.content_fr : post.content_en;
                  const category =
                    locale === "fr" ? post.category_fr : post.category_en;

                  return (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={post.imageUrl}
                          alt={title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                            <Tag className="h-3 w-3" />
                            {category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        {/* Meta */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(post.createdAt)}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {post.author.name}
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                          {content}
                        </p>

                        {/* Read More */}
                        <Link
                          href={{
                            pathname: "/blog/[id]",
                            params: { id: post.id },
                          }}
                          className="inline-flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all"
                        >
                          {t("readMore")}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
