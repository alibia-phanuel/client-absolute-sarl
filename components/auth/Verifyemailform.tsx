"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
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
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/lib/validations/auth";

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("auth");

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      // TODO: Appel API pour envoyer le lien de réinitialisation
      console.log("Reset password data:", data);

      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Reset password error:", error);
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
            {t("forgotPassword.title")}
          </h1>
          <p className="text-muted-foreground text-sm">
            {t("forgotPassword.subtitle")}
          </p>
        </motion.div>

        {/* Formulaire */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      {t("forgotPassword.email")}
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

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t("forgotPassword.loading")}
                  </>
                ) : (
                  t("forgotPassword.submit")
                )}
              </Button>
            </motion.div>
          </form>
        </Form>

        {/* Retour */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6 text-center"
        >
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("forgotPassword.backToLogin")}
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
