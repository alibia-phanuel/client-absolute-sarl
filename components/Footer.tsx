"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Facebook,
  Linkedin,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Clock,
  Heart,
  Smartphone,
  ChevronRight,
  CreditCard,
  Banknote,
  Wallet,
  Shield,
  LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Link } from "@/i18n/routing";

// ========================================
// TYPES
// ========================================
interface SocialLink {
  name: string;
  icon: LucideIcon;
  url: string;
  color: string;
}

interface FooterLink {
  label: string;
  href: string;
}

// ========================================
// MAIN COMPONENT
// ========================================
export default function Footer() {
  const t = useTranslations("Footer");
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  // ========================================
  // DATA - Réseaux Sociaux
  // ========================================
  const socialLinks: SocialLink[] = [
    {
      name: t("social.facebook"),
      icon: Facebook,
      url: "https://www.facebook.com/profile.php?id=61586028021180",
      color: "hover:bg-blue-600",
    },
    {
      name: t("social.linkedin"),
      icon: Linkedin,
      url: "https://www.linkedin.com/company/absolute-sarl/",
      color: "hover:bg-blue-700",
    },
    {
      name: t("social.instagram"),
      icon: Instagram,
      url: "#",
      color: "hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600",
    },
    {
      name: t("social.twitter"),
      icon: Twitter,
      url: "#",
      color: "hover:bg-sky-500",
    },
    {
      name: t("social.youtube"),
      icon: Youtube,
      url: "#",
      color: "hover:bg-red-600",
    },
  ];

  // ========================================
  // DATA - Sections de Liens
  // ========================================
  const servicesLinks: FooterLink[] = [
    { label: t("services.immigration"), href: "/services#canada" },
    { label: t("services.belgium"), href: "/services#belgium" },
    { label: t("services.france"), href: "/services#france" },
    { label: t("services.digital"), href: "/services#digital" },
    { label: t("services.infography"), href: "/services#infography" },
    { label: t("services.secretariat"), href: "/services#secretariat" },
    { label: t("services.commerce"), href: "/services#commerce" },
  ];

  const quickLinks: FooterLink[] = [
    { label: t("quickLinks.about"), href: "/about" },
    { label: t("quickLinks.services"), href: "/services" },
    { label: t("quickLinks.process"), href: "/#process" },
    { label: t("quickLinks.contact"), href: "/#contact" },
    { label: t("quickLinks.faq"), href: "/faq" },
    { label: t("quickLinks.blog"), href: "/blog" },
    { label: t("quickLinks.careers"), href: "/careers" },
    { label: t("quickLinks.partners"), href: "/partners" },
  ];

  const legalLinks: FooterLink[] = [
    { label: t("legal.privacy"), href: "/privacy" },
    { label: t("legal.terms"), href: "/terms" },
    { label: t("legal.cookies"), href: "/cookies" },
    { label: t("legal.legal"), href: "/legal" },
  ];

  // ========================================
  // HANDLERS
  // ========================================
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);

    // Simuler un appel API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // TODO: Intégrer votre API de newsletter
    console.log("Newsletter subscription:", email);

    setIsSubscribing(false);
    setEmail("");
  };

  // ========================================
  // RENDER
  // ========================================
  return (
    <footer className="relative bg-gradient-to-b from-muted/30 via-muted/50 to-muted border-t border-border">
      {/* SECTION PRINCIPALE */}
      <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
        <div className="grid gap-8 sm:gap-12 lg:gap-16 grid-cols-1 sm:grid-cols-2 lg:grid-cols-12">
          {/* COLONNE 1 : À PROPOS + APP MOBILE */}
          <div className="lg:col-span-4 space-y-6">
            {/* Logo et Description */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Link href="/" className="inline-block group">
                  <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent group-hover:from-primary/80 group-hover:to-primary transition-all">
                    {t("company.title")}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 italic">
                    {t("company.slogan")}
                  </p>
                </Link>
              </motion.div>

              <p className="text-sm text-muted-foreground leading-relaxed mt-4">
                {t("company.description")}
              </p>

              <Badge variant="outline" className="mt-4 text-xs">
                {t("company.rccm")}
              </Badge>
            </div>

            {/* Applications Mobiles */}
            <div>
              <h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-primary" />
                {t("mobileApp.title")}
              </h4>
              <p className="text-xs text-muted-foreground mb-4">
                {t("mobileApp.description")}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Bouton App Store */}
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 px-4 py-2.5 bg-card border-2 border-border rounded-xl hover:border-primary/50 transition-all group relative overflow-hidden"
                >
                  <Badge
                    variant="secondary"
                    className="absolute -top-1 -right-1 text-[10px] px-2 py-0.5"
                  >
                    {t("mobileApp.comingSoon")}
                  </Badge>

                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-white"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                  </div>

                  <div className="flex-1 text-left">
                    <p className="text-[10px] text-muted-foreground">
                      {t("mobileApp.ios")}
                    </p>
                    <p className="text-xs font-semibold group-hover:text-primary transition-colors">
                      App Store
                    </p>
                  </div>
                </motion.a>

                {/* Bouton Google Play */}
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 px-4 py-2.5 bg-card border-2 border-border rounded-xl hover:border-primary/50 transition-all group relative overflow-hidden"
                >
                  <Badge
                    variant="secondary"
                    className="absolute -top-1 -right-1 text-[10px] px-2 py-0.5"
                  >
                    {t("mobileApp.comingSoon")}
                  </Badge>

                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-white"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                    </svg>
                  </div>

                  <div className="flex-1 text-left">
                    <p className="text-[10px] text-muted-foreground">
                      {t("mobileApp.android")}
                    </p>
                    <p className="text-xs font-semibold group-hover:text-primary transition-colors">
                      Google Play
                    </p>
                  </div>
                </motion.a>
              </div>
            </div>

            {/* Réseaux Sociaux */}
            <div>
              <h4 className="font-semibold text-sm mb-4">
                {t("social.title")}
              </h4>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-10 h-10 rounded-xl bg-card border-2 border-border flex items-center justify-center transition-all ${social.color} hover:text-white hover:border-transparent group`}
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* COLONNE 2 : NOS SERVICES */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold mb-4 sm:mb-6 text-sm sm:text-base">
              {t("services.title")}
            </h4>
            <ul className="space-y-2.5 sm:space-y-3">
              {servicesLinks.map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={link.href as any} // ← correction TypeScript ici
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* COLONNE 3 : LIENS RAPIDES */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold mb-4 sm:mb-6 text-sm sm:text-base">
              {t("quickLinks.title")}
            </h4>
            <ul className="space-y-2.5 sm:space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={link.href as any} // ← correction TypeScript ici
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* COLONNE 4 : CONTACT + NEWSLETTER */}
          <div className="lg:col-span-4 space-y-6">
            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4 sm:mb-6 text-sm sm:text-base">
                {t("contact.title")}
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    {t("contact.address")}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                  <div className="flex flex-col gap-1">
                    <a
                      href={`tel:${t("contact.phone")}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {t("contact.phone")}
                    </a>
                    <a
                      href={`tel:${t("contact.phoneSecondary")}`}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      {t("contact.phoneSecondary")}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                  <a
                    href={`mailto:${t("contact.email")}`}
                    className="text-muted-foreground hover:text-primary transition-colors break-all"
                  >
                    {t("contact.email")}
                  </a>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">
                    {t("contact.hours")}
                  </span>
                </div>
              </div>
            </div>

            {/* Moyens de Paiement */}
            <div>
              <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                {t("payment.title")}
              </h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  <CreditCard className="w-3 h-3 mr-1" />
                  {t("payment.bankTransfer")}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Banknote className="w-3 h-3 mr-1" />
                  {t("payment.cash")}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Wallet className="w-3 h-3 mr-1" />
                  {t("payment.mobileMoney")}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Shield className="w-3 h-3 text-green-500" />
                {t("payment.secure")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Separator className="container mx-auto" />

      {/* SECTION COPYRIGHT */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-muted-foreground">
          {/* Liens Légaux */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {legalLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href as any} // ← correction TypeScript ici aussi
                className="hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Made with Love */}
          <div className="flex items-center gap-1.5">
            <span>{t("madeWith")}</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
            <span>{t("by")} IKOUMA LABS</span>
          </div>
        </div>
      </div>

      {/* ÉLÉMENTS DÉCORATIFS */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/3 rounded-full blur-3xl -z-10" />
    </footer>
  );
}
