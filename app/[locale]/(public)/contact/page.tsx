"use client";

// ============================================================
// 📌 IMPORTS
// ============================================================
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
  MessageSquare,
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

// ✅ Import de la fonction API depuis ton fichier existant
import { createContactMessage } from "@/lib/contact.api";

// ============================================================
// 📌 MAPPING DES SUJETS
// ============================================================
/**
 * Convertit les valeurs du Select (minuscules) en valeurs API (majuscules)
 *
 * Le formulaire envoie : "canada", "belgium", etc.
 * L'API backend attend : "CANADA", "BELGIUM", etc.
 */
const SUBJECT_MAP: Record<string, string> = {
  canada: "CANADA",
  belgium: "BELGIUM",
  france: "FRANCE",
  digital: "DIGITAL",
  secretariat: "SECRETARIAT",
  commerce: "COMMERCE",
  other: "OTHER",
};

// ============================================================
// 📌 COMPOSANT PRINCIPAL
// ============================================================
export default function ContactPage() {
  // 🌐 Traductions (next-intl)
  const t = useTranslations("contact");
  const V = useTranslations("validation");

  // 🔄 États locaux
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ============================================================
  // 📌 SCHÉMA DE VALIDATION ZOD (côté client)
  // ============================================================
  const contactSchema = z.object({
    name: z.string().min(1, V("nameRequired")).min(2, V("nameMin")),

    email: z.string().min(1, V("emailRequired")).email(V("emailInvalid")),

    // ✅ Validation internationale : min 8 pour numéros mondiaux
    phone: z.string().min(1, V("phoneRequired")).min(8, V("phoneMin")),

    subject: z.string().min(1, V("subjectRequired")),

    message: z.string().min(1, V("messageRequired")).min(10, V("messageMin")),
  });

  type ContactFormData = z.infer<typeof contactSchema>;

  // ============================================================
  // 📌 INITIALISATION DU FORMULAIRE
  // ============================================================
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

  // ============================================================
  // 📌 SOUMISSION DU FORMULAIRE
  // ============================================================
  /**
   * Cette fonction est appelée après validation Zod côté client
   *
   * Flow :
   * 1. Convertir le sujet (canada → CANADA)
   * 2. Construire le payload avec métadonnées
   * 3. Appeler createContactMessage() depuis l'API
   * 4. Gérer succès/erreurs avec toasts
   */
  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true);

    try {
      // 🔄 Étape 1 : Convertir le sujet en MAJUSCULES
      const mappedSubject = SUBJECT_MAP[data.subject.toLowerCase()];

      if (!mappedSubject) {
        throw new Error(`Sujet invalide : "${data.subject}"`);
      }

      // 📦 Étape 2 : Construire le payload pour l'API
      const payload = {
        // Nettoyage des espaces
        name: data.name.trim(),

        // Email en minuscules (double sécurité avec backend)
        email: data.email.toLowerCase().trim(),

        // Supprime les espaces du téléphone
        phone: data.phone.replace(/\s/g, "").trim(),

        // Sujet converti en majuscules
        subject: mappedSubject,

        // Message nettoyé
        message: data.message.trim(),

        // 🌐 Métadonnées collectées automatiquement depuis le navigateur
        metadata: {
          userAgent: navigator.userAgent,
          referrer: document.referrer || "direct",
        },
      };

      // 🔍 Debug : Log du payload (à retirer en production)
      if (process.env.NODE_ENV === "development") {
        console.log("📦 Payload envoyé:", payload);
      }

      // 🚀 Étape 3 : Appel à l'API via createContactMessage()
      // Cette fonction gère automatiquement :
      //   - La requête POST /api/contact-messages
      //   - Les erreurs HTTP (400, 429, etc.)
      //   - Le format de la réponse
      const result = await createContactMessage(payload);

      // ✅ Succès : Afficher toast et réinitialiser le formulaire
      console.log("✅ Message créé, ID:", result.data.id);

      toast.success(t("form.success"), {
        description: "Nous vous répondrons dans les plus brefs délais.",
      });

      // Délai avant reset pour une meilleure UX
      setTimeout(() => form.reset(), 1000);
    } catch (error: any) {
      // ❌ GESTION DES ERREURS

      console.error("❌ Erreur lors de l'envoi:", error);

      // Afficher le message d'erreur approprié
      if (error.message === "Données invalides") {
        toast.error("Formulaire invalide", {
          description: "Veuillez vérifier les champs du formulaire.",
        });
      } else if (
        error.message === "Trop de requêtes. Veuillez réessayer plus tard."
      ) {
        toast.error("Trop de messages envoyés", {
          description: "Veuillez patienter 15 minutes avant de réessayer.",
        });
      } else {
        // Erreur générique
        toast.error(t("form.error"), {
          description: "Veuillez réessayer plus tard.",
        });
      }
    } finally {
      // 🔄 Désactiver le spinner dans tous les cas
      setIsLoading(false);
    }
  };

  // ============================================================
  // 📌 RENDU JSX
  // ============================================================
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* ── HERO SECTION ─────────────────────────────────────── */}
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

      {/* ── CONTACT SECTION ──────────────────────────────────── */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* ── INFOS DE CONTACT (colonne gauche) ────────── */}
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

              {/* Cartes de contact */}
              <div className="space-y-4">
                {/* Adresse */}
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

                {/* Téléphones */}
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

              {/* Horaires d'ouverture */}
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

            {/* ── FORMULAIRE DE CONTACT (colonne droite) ────── */}
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
                  {/* Champ Nom */}
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

                  {/* Champs Email & Téléphone côte à côte */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Email */}
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

                    {/* Téléphone */}
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

                  {/* 
                    ⚠️ IMPORTANT : Champ Sujet
                    
                    Les valeurs du Select sont en MINUSCULES ("canada", "belgium"...)
                    Le SUBJECT_MAP les convertit en MAJUSCULES ("CANADA", "BELGIUM"...)
                    avant l'envoi à l'API
                  */}
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

                  {/* Bouton de soumission */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold relative overflow-hidden group"
                  >
                    {isLoading ? (
                      // État de chargement
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {t("form.sending")}
                      </>
                    ) : (
                      // État normal
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

                  {/* Mention de confidentialité */}
                  <p className="text-xs text-center text-muted-foreground">
                    {t("form.privacy")}
                  </p>
                </form>
              </Form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ──────────────────────────────────────── */}
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
