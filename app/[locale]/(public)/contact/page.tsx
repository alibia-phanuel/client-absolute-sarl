"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Loader2,
  User,
  Clock,
  Calendar,
  MessageSquare
} from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AppointmentModal from "@/components/AppointmentModal";

export default function ContactPage() {
  const t = useTranslations("contact");
  const V = useTranslations("validation");
  const [isLoading, setIsLoading] = useState(false);
const [isModalOpen, setIsModalOpen] = useState(false);
  // ✅ Validation Zod locale
  const contactSchema = z.object({
    name: z
      .string()
      .min(1, V("nameRequired"))
      .min(2, V("nameMin")),
    email: z
      .string()
      .min(1, V("emailRequired"))
      .email(V("emailInvalid")),
    phone: z
      .string()
      .min(1, V("phoneRequired"))
      .min(9, V("phoneMin")),
    subject: z
      .string()
      .min(1, V("subjectRequired")),
    message: z
      .string()
      .min(1, V("messageRequired"))
      .min(10, V("messageMin")),
  });

  type ContactFormData = z.infer<typeof contactSchema>;

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true);
    
    // ✅ LOG des données validées prêtes pour l'API
    console.log("📦 Données validées pour l'API:", {
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      timestamp: new Date().toISOString(),
      locale: navigator.language,
    });

    // ✅ Payload formaté pour l'API
    const apiPayload = {
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone.trim(),
      subject: data.subject,
      message: data.message.trim(),
      metadata: {
        userAgent: navigator.userAgent,
        referrer: document.referrer || "direct",
        timestamp: new Date().toISOString(),
      }
    };

    console.log("🚀 Payload API complet:", JSON.stringify(apiPayload, null, 2));

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Erreur API:", errorData);
        throw new Error(errorData.message || "Erreur lors de l'envoi");
      }

      const result = await response.json();
      console.log("✅ Réponse API:", result);

      toast.success(t("form.success"));
      form.reset();
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi:", error);
      toast.error(t("form.error"));
    } finally {
      setIsLoading(false);
    }
  };

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
            <p className="text-lg md:text-xl text-muted-foreground mb-4">
              {t("hero.subtitle")}
            </p>
            <p className="text-base text-muted-foreground italic">
              {t("hero.slogan")}
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold mb-4">{t("info.title")}</h2>
                <p className="text-muted-foreground mb-8">
                  {t("info.description")}
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                {/* Address */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start gap-4 p-6 bg-card border border-border rounded-xl hover:shadow-lg transition-shadow"
                >
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      {t("info.address.title")}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {t("info.address.line1")}
                      <br />
                      {t("info.address.line2")}
                      <br />
                      {t("info.address.line3")}
                    </p>
                  </div>
                </motion.div>

                {/* Emails */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start gap-4 p-6 bg-card border border-border rounded-xl hover:shadow-lg transition-shadow"
                >
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold mb-1">
                      {t("info.email.title")}
                    </h3>
                    <div className="space-y-1">
                      <a
                        href="mailto:servicesclients@absolutesarl.com"
                        className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        servicesclients@absolutesarl.com
                      </a>
                      <a
                        href="mailto:jordan.ntouko@absolutesarl.com"
                        className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        jordan.ntouko@absolutesarl.com
                      </a>
                    </div>
                  </div>
                </motion.div>

                {/* Phones */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start gap-4 p-6 bg-card border border-border rounded-xl hover:shadow-lg transition-shadow"
                >
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold mb-1">
                      {t("info.phone.title")}
                    </h3>
                    <div className="space-y-1">
                      <a
                        href="tel:+237699992818"
                        className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        📞 +237 699 99 28 18{" "}
                        <span className="text-xs">
                          ({t("info.phone.primary")})
                        </span>
                      </a>
                      <a
                        href="tel:+237675157871"
                        className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        📞 +237 675 15 78 71{" "}
                        <span className="text-xs">
                          ({t("info.phone.secondary")})
                        </span>
                      </a>
                      <a
                        href="https://wa.me/237699992818"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-green-600 hover:text-green-700 transition-colors font-medium"
                      >
                        💬 WhatsApp Business
                      </a>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Business Hours */}
              <div className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">{t("info.hours.title")}</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      {t("info.hours.weekdays")}
                    </span>
                    <span className="font-medium text-foreground">
                      08:00 - 17:00
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      {t("info.hours.saturday")}
                    </span>
                    <span className="font-medium text-foreground">
                      08:00 - 15:00
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      {t("info.hours.sunday")}
                    </span>
                    <span className="font-medium text-red-600">
                      {t("info.hours.closed")}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-card border-2 border-border rounded-2xl shadow-xl p-8"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">{t("form.title")}</h2>
                <p className="text-sm text-muted-foreground">
                  {t("form.subtitle")}
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  {/* Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.name")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                              {...field}
                              placeholder={t("form.namePlaceholder")}
                              className="pl-10 h-12"
                              disabled={isLoading}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email & Phone */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.email")}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                              <Input
                                {...field}
                                type="email"
                                placeholder={t("form.emailPlaceholder")}
                                className="pl-10 h-12"
                                disabled={isLoading}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.phone")}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                              <Input
                                {...field}
                                placeholder={t("form.phonePlaceholder")}
                                className="pl-10 h-12"
                                disabled={isLoading}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Subject */}
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.subject")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue
                                placeholder={t("form.subjectPlaceholder")}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="canada">
                              {t("form.subjects.canada")}
                            </SelectItem>
                            <SelectItem value="belgium">
                              {t("form.subjects.belgium")}
                            </SelectItem>
                            <SelectItem value="france">
                              {t("form.subjects.france")}
                            </SelectItem>
                            <SelectItem value="digital">
                              {t("form.subjects.digital")}
                            </SelectItem>
                            <SelectItem value="secretariat">
                              {t("form.subjects.secretariat")}
                            </SelectItem>
                            <SelectItem value="commerce">
                              {t("form.subjects.commerce")}
                            </SelectItem>
                            <SelectItem value="other">
                              {t("form.subjects.other")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Message */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.message")}</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder={t("form.messagePlaceholder")}
                            className="min-h-32 resize-none"
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold relative overflow-hidden group"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {t("form.sending")}
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        <span className="relative z-10">
                          {t("form.submit")}
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

                  <p className="text-xs text-center text-muted-foreground">
                    {t("form.privacy")}
                  </p>
                </form>
              </Form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("cta.title")}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t("cta.subtitle")}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={() => setIsModalOpen(true)}
                size="lg"
                className="h-12 px-8"
              >
                <Calendar className="mr-2 h-5 w-5" />
                {t("cta.appointment")}
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8" asChild>
                <a
                  href="https://wa.me/237699992818"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  {t("cta.whatsapp")}
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
        <AppointmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </section>
    </div>
  );
}