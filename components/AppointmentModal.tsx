/**
 * 📅 Modal de Prise de Rendez-vous (Espace Client)
 * 
 * Modal amélioré pour créer un rendez-vous avec :
 * - Sélection de date (future uniquement)
 * - Sélection d'heure
 * - Choix du sujet (liste déroulante)
 * - Validation complète
 * - Intégration API
 * - Gestion des erreurs
 */

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Calendar, Clock, Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createRendezVous } from "@/lib/Rendezvous.api";

// ============================================================================
// 📋 Props du Composant
// ============================================================================

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // Callback optionnel après succès
}

// ============================================================================
// 🎨 Composant Principal
// ============================================================================

export default function AppointmentModal({
  isOpen,
  onClose,
  onSuccess,
}: AppointmentModalProps) {
  const t = useTranslations();
  const V = useTranslations("validation");
  const C = useTranslations("contact");

  const [isLoading, setIsLoading] = useState(false);

  // ============================================================================
  // 📝 Validation avec Zod
  // ============================================================================

  const appointmentSchema = z.object({
    date: z
      .string()
      .min(1, V("dateRequired"))
      .refine(
        (date) => {
          const selectedDate = new Date(date);
          const now = new Date();
          return selectedDate > now;
        },
        {
          message: V("dateFuture"),
        }
      ),
    time: z
      .string()
      .min(1, V("timeRequired"))
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, V("timeInvalid")),
    note: z.string().min(1, V("noteRequired")),
  });

  type AppointmentFormData = z.infer<typeof appointmentSchema>;

  // ============================================================================
  // 🎯 Initialisation du Formulaire
  // ============================================================================

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      date: "",
      time: "",
      note: "",
    },
  });

  // ============================================================================
  // 💾 Soumission du Formulaire
  // ============================================================================

  const onSubmit = async (data: AppointmentFormData) => {
    setIsLoading(true);

    try {
      // ====== ÉTAPE 1 : Combiner date et heure en ISO 8601 ======
      const dateTimeISO = new Date(
        `${data.date}T${data.time}:00`
      ).toISOString();

      // ====== ÉTAPE 2 : Préparer le payload pour l'API ======
      const apiPayload = {
        date: dateTimeISO,
        note: data.note.trim(),
      };

      console.log("📦 Données du rendez-vous:", {
        dateOriginal: data.date,
        timeOriginal: data.time,
        dateTimeISO: dateTimeISO,
        note: data.note,
      });

      // ====== ÉTAPE 3 : Appel à l'API ======
      const result = await createRendezVous(apiPayload);

      console.log("✅ Rendez-vous créé:", result);

      // ====== ÉTAPE 4 : Succès ======
      toast.success(t(result.messageKey));
      form.reset();
      onClose();
      
      // Appeler le callback de succès si fourni
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      // ====== ÉTAPE 5 : Gestion des erreurs ======
      console.error("❌ Erreur création rendez-vous:", error);
      const err = error instanceof Error ? error : new Error(String(error));
      toast.error(t(err.message));
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // 🚪 Fermeture du Modal
  // ============================================================================

  const handleClose = () => {
    form.reset();
    onClose();
  };

  // ============================================================================
  // 🎨 Rendu du Composant
  // ============================================================================

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {/* ====== Header avec Gradient ====== */}
          <div className="relative bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-colors"
              disabled={isLoading}
            >
              <X className="h-5 w-5" />
            </button>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Calendar className="h-6 w-6" />
                {t("appointment.title")}
              </DialogTitle>
              <DialogDescription className="text-primary-foreground/90 mt-2">
                {t("appointment.subtitle")}
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* ====== Formulaire ====== */}
          <div className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* ====== Date ====== */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        {t("appointment.date")}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            {...field}
                            type="date"
                            className="pl-10 h-12 border-2 border-border/50 focus:border-primary transition-colors"
                            disabled={isLoading}
                            min={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* ====== Heure ====== */}
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        {t("appointment.time")}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            {...field}
                            type="time"
                            className="pl-10 h-12 border-2 border-border/50 focus:border-primary transition-colors"
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* ====== Sujet / Note (Select) ====== */}
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        {t("appointment.note")}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 border-2 border-border/50 focus:border-primary transition-colors">
                            <SelectValue
                              placeholder={t("appointment.notePlaceholder")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Immigration Canada">
                            {C("form.subjects.canada")}
                          </SelectItem>
                          <SelectItem value="Immigration Belgique">
                            {C("form.subjects.belgium")}
                          </SelectItem>
                          <SelectItem value="Immigration France">
                            {C("form.subjects.france")}
                          </SelectItem>
                          <SelectItem value="Services digitaux & Infographie">
                            {C("form.subjects.digital")}
                          </SelectItem>
                          <SelectItem value="E-secrétariat">
                            {C("form.subjects.secretariat")}
                          </SelectItem>
                          <SelectItem value="Commerce général">
                            {C("form.subjects.commerce")}
                          </SelectItem>
                          <SelectItem value="Autre demande">
                            {C("form.subjects.other")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* ====== Horaires Disponibles ====== */}
                <div className="p-4 bg-muted/50 rounded-lg border border-border">
                  <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    {t("appointment.availableHours")}
                  </p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>• {t("appointment.weekdays")}: 08:00 - 17:00</p>
                    <p>• {t("appointment.saturday")}: 08:00 - 15:00</p>
                    <p className="text-red-600">
                      • {t("appointment.sunday")}: {t("appointment.closed")}
                    </p>
                  </div>
                </div>

                {/* ====== Boutons d'Action ====== */}
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="flex-1 h-12"
                  >
                    {t("appointment.cancel")}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold relative overflow-hidden group"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {t("appointment.loading")}
                      </>
                    ) : (
                      <>
                        <Calendar className="mr-2 h-5 w-5" />
                        <span className="relative z-10">
                          {t("appointment.submit")}
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
                </div>
              </form>
            </Form>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}