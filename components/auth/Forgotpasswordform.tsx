"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
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
import { sendResetOtp, resetPassword } from "@/lib/auth.api";

/* ===========================
   SCHEMAS
=========================== */

const emailSchema = z.object({
  email: z.string().email("Email invalide"),
});

const resetPasswordSchema = z
  .object({
    otp: z.string().length(6, "Le code doit contenir 6 chiffres"),
    newPassword: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type EmailFormData = z.infer<typeof emailSchema>;
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

type Step = "email" | "reset" | "success";

/* ===========================
   COMPONENT
=========================== */

export default function ForgotPasswordForm() {
  const t = useTranslations();
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  /* ===========================
     ACTIONS
  =========================== */

  const onSubmitEmail = async (data: EmailFormData) => {
    setIsLoading(true);
    try {
      const result = await sendResetOtp({ email: data.email });
      toast.success(t(result.messageKey));
      setEmail(data.email);
      setStep("reset");
    } catch (error: unknown) {
      // ← CHANGEMENT 1/3
      const err = error instanceof Error ? error : new Error(String(error));
      toast.error(t(err.message)); // ← on utilise err.message
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitReset = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      const result = await resetPassword({
        email,
        otp: data.otp,
        newPassword: data.newPassword,
      });

      toast.success(t(result.messageKey));
      setStep("success");

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: unknown) {
      // ← CHANGEMENT 2/3
      const err = error instanceof Error ? error : new Error(String(error));
      toast.error(t(err.message)); // ← on utilise err.message
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      const result = await sendResetOtp({ email });
      toast.success(t(result.messageKey));
    } catch (error: unknown) {
      // ← CHANGEMENT 3/3
      const err = error instanceof Error ? error : new Error(String(error));
      toast.error(t(err.message)); // ← on utilise err.message
    } finally {
      setIsResending(false);
    }
  };

  /* ===========================
     UI
  =========================== */

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

        <AnimatePresence mode="wait">
          {/* ================= EMAIL ================= */}
          {step === "email" && (
            <motion.div key="email">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">
                  {t("auth.forgotPassword.title")}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {t("auth.forgotPassword.subtitle")}
                </p>
              </div>

              <Form {...emailForm}>
                <form
                  onSubmit={emailForm.handleSubmit(onSubmitEmail)}
                  className="space-y-5"
                >
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.forgotPassword.email")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                              {...field}
                              type="email"
                              placeholder="nom@exemple.com"
                              className="pl-10 h-12"
                              disabled={isLoading}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button disabled={isLoading} className="w-full h-12">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {t("auth.forgotPassword.loading")}
                      </>
                    ) : (
                      t("auth.forgotPassword.submit")
                    )}
                  </Button>
                </form>
              </Form>

              <div className="mt-8 text-center">
                <Link
                  href="/login"
                  className="text-sm text-muted-foreground flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t("auth.forgotPassword.backToLogin")}
                </Link>
              </div>
            </motion.div>
          )}

          {/* ================= RESET ================= */}
          {step === "reset" && (
            <motion.div key="reset">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">
                  {t("auth.resetPassword.title")}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {t("auth.resetPassword.subtitle")}
                </p>
                <p className="text-primary font-semibold mt-2">{email}</p>
              </div>

              <Form {...resetForm}>
                <form
                  onSubmit={resetForm.handleSubmit(onSubmitReset)}
                  className="space-y-6"
                >
                  {/* OTP - 6 inputs séparés */}
                  <FormField
                    control={resetForm.control}
                    name="otp"
                    render={({ field }) => {
                      const otpValue = field.value || "";
                      const otpArray = otpValue
                        .padEnd(6, " ")
                        .slice(0, 6)
                        .split("");

                      return (
                        <FormItem>
                          <FormLabel>
                            {t("auth.resetPassword.otpCode") || "Code OTP"}
                          </FormLabel>
                          <FormControl>
                            <div className="flex justify-center gap-3 my-6">
                              {Array.from({ length: 6 }).map((_, i) => (
                                <Input
                                  key={i}
                                  type="text"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  maxLength={1}
                                  value={otpArray[i] === " " ? "" : otpArray[i]}
                                  onChange={(e) => {
                                    const val = e.target.value.replace(
                                      /\D/g,
                                      "",
                                    );
                                    if (val.length === 0 && i > 0) {
                                      // backspace sur champ vide → précédent
                                      const newOtp =
                                        otpValue.slice(0, i) +
                                        otpValue.slice(i + 1);
                                      field.onChange(newOtp);
                                      setTimeout(() => {
                                        const prev = document.querySelector(
                                          `input[data-otp-index="${i - 1}"]`,
                                        ) as HTMLInputElement;
                                        prev?.focus();
                                      }, 0);
                                      return;
                                    }
                                    if (val) {
                                      const newOtp =
                                        otpValue.slice(0, i) +
                                        val +
                                        otpValue.slice(i + 1);
                                      const limited = newOtp.slice(0, 6);
                                      field.onChange(limited);
                                      if (i < 5 && limited.length > i) {
                                        setTimeout(() => {
                                          const next = document.querySelector(
                                            `input[data-otp-index="${i + 1}"]`,
                                          ) as HTMLInputElement;
                                          next?.focus();
                                        }, 0);
                                      }
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (
                                      e.key === "Backspace" &&
                                      !otpArray[i] &&
                                      i > 0
                                    ) {
                                      e.preventDefault();
                                      const prev = document.querySelector(
                                        `input[data-otp-index="${i - 1}"]`,
                                      ) as HTMLInputElement;
                                      prev?.focus();
                                    }
                                  }}
                                  onPaste={(e) => {
                                    e.preventDefault();
                                    const pasted = (
                                      e.clipboardData || window.Clipboard
                                    )
                                      .getData("text")
                                      .replace(/\D/g, "")
                                      .slice(0, 6 - i);

                                    if (pasted) {
                                      const newOtp =
                                        otpValue.slice(0, i) +
                                        pasted +
                                        otpValue.slice(i + pasted.length);
                                      field.onChange(newOtp.slice(0, 6));
                                      const nextFocus = Math.min(
                                        i + pasted.length,
                                        5,
                                      );
                                      setTimeout(() => {
                                        const el = document.querySelector(
                                          `input[data-otp-index="${nextFocus}"]`,
                                        ) as HTMLInputElement;
                                        el?.focus();
                                      }, 50);
                                    }
                                  }}
                                  className="text-center text-2xl font-bold h-14 w-14 border-2 border-border/50 focus:border-primary transition-all"
                                  disabled={isLoading}
                                  data-otp-index={i}
                                  autoComplete="one-time-code"
                                />
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={resetForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("auth.resetPassword.password")}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pl-10 pr-10 h-12"
                              disabled={isLoading}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={resetForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("auth.resetPassword.confirmPassword")}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                              {...field}
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pl-10 pr-10 h-12"
                              disabled={isLoading}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button disabled={isLoading} className="w-full h-12">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {t("auth.resetPassword.loading")}
                      </>
                    ) : (
                      t("auth.resetPassword.submit")
                    )}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  {t("auth.resetPassword.didntReceive")}
                </p>
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResendOtp}
                  disabled={isResending}
                >
                  {isResending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("auth.resetPassword.resending")}
                    </>
                  ) : (
                    t("auth.resetPassword.resend")
                  )}
                </Button>
              </div>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="text-sm text-muted-foreground flex items-center justify-center gap-2 mx-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t("auth.resetPassword.changeEmail")}
                </button>
              </div>
            </motion.div>
          )}

          {/* ================= SUCCESS ================= */}
          {step === "success" && (
            <motion.div key="success" className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">
                {t("auth.resetPassword.successTitle")}
              </h1>
              <p className="text-muted-foreground mb-4">
                {t("auth.resetPassword.successMessage")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("auth.resetPassword.redirecting")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
