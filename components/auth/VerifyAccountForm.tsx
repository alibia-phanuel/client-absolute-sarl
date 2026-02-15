"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  ArrowLeft,
  CheckCircle2,
  Mail,
} from "lucide-react";
import Image from "next/image";
import {  useRouter as useI18nRouter } from "@/i18n/routing";
import { useRouter } from "next/navigation";
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
import { sendVerifyOtp, verifyAccount } from "@/lib/auth.api";
import { useAuthStore } from "@/store/authStore";

type Step = "verify" | "success";

/* ===========================
   COMPONENT
=========================== */

export default function VerifyAccountForm() {
  const t = useTranslations();
  const V = useTranslations("validation");
  const router = useRouter(); // Native router for direct navigation
  const i18nRouter = useI18nRouter(); // i18n router for localized paths

  const { 
    user, 
    pendingVerificationEmail, 
    clearPendingVerification,
    updateUserVerificationStatus,
    logout
  } = useAuthStore();

  const [step, setStep] = useState<Step>("verify");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Initialiser l'email depuis le store
  useEffect(() => {
    if (pendingVerificationEmail) {
      setEmail(pendingVerificationEmail);
    } else if (user?.email) {
      setEmail(user.email);
    } else {
      // Si pas d'email disponible, rediriger vers login
      i18nRouter.push("/login");
    }
  }, [pendingVerificationEmail, user, i18nRouter]);

  /* ===========================
     SCHEMAS ZOD
  =========================== */

  const verifySchema = z.object({
    otp: z.string().length(6, V("codeLength")),
  });

  type VerifyFormData = z.infer<typeof verifySchema>;

  const verifyForm = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      otp: "",
    },
  });

  /* ===========================
     ACTIONS
  =========================== */

  const onSubmitVerify = async (data: VerifyFormData) => {
    if (!email) {
      toast.error(t("auth.verifyAccount.noEmail"));
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyAccount({
        email,
        otp: data.otp,
      });

      toast.success(t(result.messageKey));
      
      // Mettre à jour le statut de vérification
      updateUserVerificationStatus(true);
      clearPendingVerification();
      
      // Attendre que les cookies soient synchronisés
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setStep("success");

      setTimeout(() => {
        // Rediriger selon le rôle
        if (user?.role === "ADMIN" || user?.role === "EMPLOYE") {
          i18nRouter.push("/admin");
        } else {
          i18nRouter.push("/");
        }
      }, 2000); // Laisser le temps de voir le message de succès
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      toast.error(t(err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error(t("auth.verifyAccount.noEmail"));
      return;
    }

    setIsResending(true);
    try {
      const result = await sendVerifyOtp({ email });
      toast.success(t(result.messageKey));
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      toast.error(t(err.message));
    } finally {
      setIsResending(false);
    }
  };

  const handleCancelVerification = () => {
    // Déconnecter l'utilisateur et rediriger vers login
    logout();
    i18nRouter.push("/login");
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
          {/* ================= VERIFY ================= */}
          {step === "verify" && (
            <motion.div key="verify">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">
                  {t("auth.verifyAccount.title")}
                </h1>
                <p className="text-muted-foreground text-sm mb-4">
                  {t("auth.verifyAccount.subtitle")}
                </p>
                <div className="flex items-center justify-center gap-2 text-primary font-semibold">
                  <Mail className="w-5 h-5" />
                  <p>{email}</p>
                </div>
              </div>

              <Form {...verifyForm}>
                <form
                  onSubmit={verifyForm.handleSubmit(onSubmitVerify)}
                  className="space-y-6"
                >
                  {/* OTP - 6 inputs séparés */}
                  <FormField
                    control={verifyForm.control}
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
                            {t("auth.verifyAccount.otpCode")}
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
                                      e.clipboardData || (window as any).Clipboard
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

                  <Button disabled={isLoading} className="w-full h-12">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {t("auth.verifyAccount.loading")}
                      </>
                    ) : (
                      t("auth.verifyAccount.submit")
                    )}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  {t("auth.verifyAccount.didntReceive")}
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
                      {t("auth.verifyAccount.resending")}
                    </>
                  ) : (
                    t("auth.verifyAccount.resend")
                  )}
                </Button>
              </div>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={handleCancelVerification}
                  className="text-sm text-muted-foreground flex items-center justify-center gap-2 mx-auto hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t("auth.verifyAccount.backToLogin")}
                </button>
              </div>
            </motion.div>
          )}

          {/* ================= SUCCESS ================= */}
          {step === "success" && (
            <motion.div key="success" className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">
                {t("auth.verifyAccount.successTitle")}
              </h1>
              <p className="text-muted-foreground mb-4">
                {t("auth.verifyAccount.successMessage")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("auth.verifyAccount.redirecting")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}