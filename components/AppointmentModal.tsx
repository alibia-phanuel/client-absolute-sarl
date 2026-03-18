"use client";

/**
 * 📅 Modal de Prise de Rendez-vous (Espace Client)
 * Version mobile-first corrigée
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Calendar, Clock, Loader2, Phone, X } from "lucide-react";
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

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AppointmentModal({
  isOpen,
  onClose,
  onSuccess,
}: AppointmentModalProps) {
  const t = useTranslations();
  const V = useTranslations("validation");
  const C = useTranslations("contact");

  const [isLoading, setIsLoading] = useState(false);

  const appointmentSchema = z.object({
    date: z
      .string()
      .min(1, V("dateRequired"))
      .refine(
        (date) => new Date(date) > new Date(),
        { message: V("dateFuture") }
      ),
    time: z
      .string()
      .min(1, V("timeRequired"))
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, V("timeInvalid")),
    note: z.string().min(1, V("noteRequired")),
    phone: z
      .string()
      .min(1, V("phoneRequired"))
      .min(7, V("phoneMin")),
  });

  type AppointmentFormData = z.infer<typeof appointmentSchema>;

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: { date: "", time: "", note: "", phone: "" },
  });

  const onSubmit = async (data: AppointmentFormData) => {
    setIsLoading(true);
    try {
      const dateTimeISO = new Date(`${data.date}T${data.time}:00`).toISOString();
      const result = await createRendezVous({
        date: dateTimeISO,
        note: `[${data.phone.trim()}] ${data.note.trim()}`,
      });
      toast.success(t("rendezvous.createSuccess"));
      form.reset();
      onClose();
      onSuccess?.();
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      toast.error(t(err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      {/* ── max-w-full sur mobile, 500px sur sm+ ── */}
      <DialogContent className="w-[calc(100vw-24px)] max-w-[500px] p-0 overflow-hidden rounded-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {/* ── Header ── */}
          <div className="relative bg-gradient-to-r from-primary to-primary/80 px-5 py-5 text-primary-foreground">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-colors"
              disabled={isLoading}
            >
              <X className="h-5 w-5" />
            </button>
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2 pr-8">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                {t("appointment.title")}
              </DialogTitle>
              <DialogDescription className="text-primary-foreground/90 mt-1 text-sm">
                {t("appointment.subtitle")}
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* ── Corps ── */}
          <div className="px-4 py-5 sm:px-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                {/* Date + Heure — côte à côte sur mobile aussi */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Date */}
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          {t("appointment.date")}
                        </FormLabel>
                        <FormControl>
                          {/* ── Pas d'icône en padding sur mobile ── */}
                          <Input
                            {...field}
                            type="date"
                            className="h-11 w-full text-sm border-2 border-border/50 focus:border-primary transition-colors"
                            disabled={isLoading}
                            min={new Date().toISOString().split("T")[0]}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Heure */}
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          {t("appointment.time")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="time"
                            className="h-11 w-full text-sm border-2 border-border/50 focus:border-primary transition-colors"
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Motif */}
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
                          <SelectTrigger className="h-11 w-full text-sm border-2 border-border/50 focus:border-primary transition-colors">
                            <SelectValue placeholder={t("appointment.notePlaceholder")} />
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


                {/* Téléphone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        Numéro de téléphone
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            type="tel"
                            placeholder="+237 6XX XX XX XX"
                            className="pl-9 h-11 w-full text-sm border-2 border-border/50 focus:border-primary transition-colors"
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                {/* Horaires disponibles */}
                <div className="p-3 bg-muted/50 rounded-lg border border-border">
                  <p className="text-xs font-semibold mb-1.5 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    {t("appointment.availableHours")}
                  </p>
                  <div className="space-y-0.5 text-xs text-muted-foreground">
                    <p>• {t("appointment.weekdays")}: 08:00 - 17:00</p>
                    <p>• {t("appointment.saturday")}: 08:00 - 15:00</p>
                    <p className="text-red-500">
                      • {t("appointment.sunday")}: {t("appointment.closed")}
                    </p>
                  </div>
                </div>

                {/* Boutons — pleine largeur sur mobile */}
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="w-full sm:flex-1 h-11"
                  >
                    {t("appointment.cancel")}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:flex-1 h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("appointment.loading")}
                      </>
                    ) : (
                      <>
                        <Calendar className="mr-2 h-4 w-4" />
                        {t("appointment.submit")}
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