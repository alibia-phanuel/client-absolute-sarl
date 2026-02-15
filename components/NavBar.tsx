"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, Calendar, MessageSquare, FileText } from "lucide-react";
import Image from "next/image";
import { Link, routing, useRouter as useI18nRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "./LocaleSwitcher";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

const navItems = [
  { key: "home", href: "/" as const },
  { key: "services", href: "/services" as const },
  { key: "blog", href: "/blog" as const },
  { key: "faq", href: "/faq" as const },
  { key: "contact", href: "/contact" as const },
] satisfies Array<{ key: string; href: keyof (typeof routing)["pathnames"] }>;

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("nav");
  const tAuth = useTranslations("auth");
  const i18nRouter = useI18nRouter();

  // Récupérer l'état d'authentification
  const { user, isAuthenticated, logout } = useAuthStore();

  const toggleMenu = () => setIsOpen(!isOpen);

  // Fonction de déconnexion
  const handleLogout = async () => {
    logout();
    toast.success(tAuth("logoutSuccess"));
    // Attendre la synchronisation des cookies
    await new Promise((resolve) => setTimeout(resolve, 300));
    i18nRouter.push("/");
  };

  // Obtenir les initiales pour l'avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="relative h-20 w-72"
              >
                <Image
                  src="/logo.png"
                  alt="ABSOLUTE SARL"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <Link
                  href={item.href}
                  className="relative px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground group"
                >
                  {t(item.key)}
                  <motion.span
                    className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-300"
                    whileHover={{ width: "100%" }}
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="hidden lg:flex items-center gap-4"
          >
            <LocaleSwitcher />

            {/* Affichage conditionnel : Login ou User Menu */}
            {isAuthenticated() && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 rounded-full border-2 border-border/50 p-1 hover:border-primary transition-colors"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* Lien Admin pour ADMIN/EMPLOYE */}
                  {(user.role === "ADMIN" || user.role === "EMPLOYE") && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/admin"
                          className="flex items-center cursor-pointer"
                        >
                          <User className="mr-2 h-4 w-4" />
                          <span>{t("admin")}</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  {/* Appointments */}
                  {user.role === "CLIENT" && (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/rendezvous"
                        className="flex items-center cursor-pointer"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>{t("Appointments")}</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {/* Messages */}
                  {user.role === "CLIENT" && (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/sms"
                        className="flex items-center cursor-pointer"
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>{t("sms")}</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {/* Quotes */}
                  {user.role === "CLIENT" && (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/devisclient"
                        className="flex items-center cursor-pointer"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        <span>{t("devis")}</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("logout")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/login">
                  <Button
                    variant="default"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium relative overflow-hidden group"
                  >
                    <span className="relative z-10">{t("login")}</span>
                    <motion.div
                      className="absolute inset-0 bg-accent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onClick={toggleMenu}
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-6 w-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden overflow-hidden"
            >
              <motion.div className="py-6 space-y-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 * index }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2 text-base font-medium text-foreground/80 hover:text-primary hover:bg-muted rounded-md transition-all"
                    >
                      {t(item.key)}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="pt-4 border-t border-border space-y-4 px-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {t("language")}
                    </span>
                    <LocaleSwitcher />
                  </div>

                  {/* Mobile : Login ou User Info */}
                  {isAuthenticated() && user ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatarUrl} alt={user.name} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      {/* Lien Admin pour ADMIN/EMPLOYE */}
                      {(user.role === "ADMIN" || user.role === "EMPLOYE") && (
                        <Link
                          href="/admin"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-muted rounded-md transition-all"
                        >
                          <User className="h-4 w-4" />
                          <span>{t("admin")}</span>
                        </Link>
                      )}

                      {/* Lien Admin pour ADMIN/EMPLOYE */}
                      {user.role === "CLIENT" && (
                        <Link
                          href="/rendezvous"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-muted rounded-md transition-all"
                        >
                          <User className="h-4 w-4" />
                          <span>{t("Appointments")}</span>
                        </Link>
                      )}

                      <Button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        variant="destructive"
                        className="w-full"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        {t("logout")}
                      </Button>
                    </div>
                  ) : (
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button
                        variant="default"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                      >
                        {t("login")}
                      </Button>
                    </Link>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
