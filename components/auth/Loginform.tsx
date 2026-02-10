"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import Image from "next/image";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { login, isAuth } from "@/lib/auth.api";
import { useAuthStore } from "@/store/authStore";
import { loginSchema } from "@/lib/validations/auth";

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const t = useTranslations();
  const tAuth = useTranslations("auth");
  const V = useTranslations("validation");
  const router = useRouter();
  const loginSchema = z.object({
    email: z.string().email(V("email")).min(1, V("required")),
    password: z.string().min(1, V("required")),
  });
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      // ✅ Étape 1 : Connexion
      const result = await login({
        email: data.email,
        password: data.password,
      });

      // ✅ Stocker le token
      useAuthStore.getState().setToken(result.token);

      // ✅ Étape 2 : Récupérer les données utilisateur
      const authResult = await isAuth();

      // ✅ Stocker les données utilisateur
      useAuthStore.getState().setUser({
        id: authResult.user.id,
        name: authResult.user.name,
        email: authResult.user.email,
        role: authResult.user.role,
        isAccountVerified: authResult.user.isAccountVerified,
        verifyOtp: null,
        verifyOtpExpireAt: null,
        resetOtp: null,
        resetOtpExpireAt: null,
        createdAt: authResult.user.createdAt,
        updatedAt: authResult.user.createdAt,
      });

      toast.success(t(result.messageKey));

      // ✅ Redirection conditionnelle
      if (!authResult.user.isAccountVerified) {
        useAuthStore
          .getState()
          .setPendingVerificationEmail(authResult.user.email);
        router.push("/verify-account");
      } else if (
        authResult.user.role === "ADMIN" ||
        authResult.user.role === "EMPLOYE"
      ) {
        router.push({
          pathname: "/admin",
        });
      } else {
        router.push("/");
      }
    } catch (error: unknown) {
      const err =
        error instanceof Error
          ? error
          : new Error(
              typeof error === "string"
                ? error
                : "Une erreur inconnue est survenue",
            );

      toast.error(t(err.message || "Une erreur est survenue"));
      return;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-card border-2 border-border/50 rounded-2xl shadow-2xl p-8">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="relative h-16 w-48">
            <Image
              src="/logo.png"
              alt="ABSOLUTE SARL"
              fill
              className="object-contain"
              priority
            />
          </div>
        </motion.div>

        {/* Titre */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {tAuth("login.title")}
          </h1>
          <p className="text-muted-foreground text-sm">
            {tAuth("login.subtitle")}
          </p>
        </motion.div>

        {/* Formulaire */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      {tAuth("login.email")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          {...field}
                          type="email"
                          placeholder="nom@exemple.com"
                          className="pl-10 h-12 border-2 border-border/50 focus:border-primary transition-colors"
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </motion.div>

            {/* Mot de passe */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm font-semibold">
                        {tAuth("login.password")}
                      </FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-xs text-primary hover:underline"
                      >
                        {tAuth("login.forgotPassword")}
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10 h-12 border-2 border-border/50 focus:border-primary transition-colors"
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </motion.div>

            {/* Bouton de connexion */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base relative overflow-hidden group"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {tAuth("login.loading")}
                  </>
                ) : (
                  <>
                    <span className="relative z-10">
                      {tAuth("login.submit")}
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-accent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </Form>

        {/* Séparateur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="relative my-8"
        >
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              {tAuth("login.or")}
            </span>
          </div>
        </motion.div>

        {/* Créer un compte */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground">
            {tAuth("login.noAccount")}{" "}
            <Link
              href="/register"
              className="text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              {tAuth("login.createAccount")}
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
