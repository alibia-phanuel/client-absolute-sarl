/**
 * ✏️ Modal de Mise à Jour du Statut d'un Message
 *
 * Permet de :
 * - Changer le statut du message (NEW → READ → IN_PROGRESS → RESOLVED)
 * - Ajouter/modifier des notes internes
 * - Assigner le message à un employé
 *
 * Utilisation :
 * ```tsx
 * <UpdateStatusModal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   message={selectedMessage}
 *   onSuccess={refreshMessages}
 * />
 * ```
 */

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Loader2, Edit, MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { ContactMessage, ContactMessageStatus } from "@/types/ContactMessages.types";
import { updateContactMessage } from "@/lib/contact.api";

// ============================================================================
// 📋 Props du Composant
// ============================================================================

interface UpdateStatusModalProps {
  open: boolean;
  onClose: () => void;
  message: ContactMessage | null;
  onSuccess: () => void;
}

// ============================================================================
// 🎨 Composant Principal
// ============================================================================

export function UpdateStatusModal({
  open,
  onClose,
  message,
  onSuccess,
}: UpdateStatusModalProps) {
  const t = useTranslations();
  const tMessages = useTranslations("contactMessages");

  const [isLoading, setIsLoading] = useState(false);

  // ============================================================================
  // 📝 Validation avec Zod
  // ============================================================================

  const updateSchema = z.object({
    status: z.enum(["NEW", "READ", "IN_PROGRESS", "RESOLVED", "ARCHIVED"]),
    notes: z.string().optional(),
  });

  type UpdateFormData = z.infer<typeof updateSchema>;

  // ============================================================================
  // 🎯 Initialisation du Formulaire
  // ============================================================================

  const form = useForm<UpdateFormData>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      status: "NEW",
      notes: "",
    },
  });

  /**
   * Remplir le formulaire avec les données existantes
   */
  useEffect(() => {
    if (message) {
      form.reset({
        status: message.status,
        notes: message.notes || "",
      });
    }
  }, [message, form]);

  // ============================================================================
  // 💾 Soumission du Formulaire
  // ============================================================================

  const onSubmit = async (data: UpdateFormData) => {
    if (!message) return;

    setIsLoading(true);
    try {
      const result = await updateContactMessage(message.id, {
        status: data.status as ContactMessageStatus,
        notes: data.notes,
      });

      toast.success(t(result.messageKey));
      onSuccess();
      handleClose();
    } catch (error: unknown) {
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
  // 🎨 Helper pour la couleur du statut
  // ============================================================================

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-blue-500/10 text-blue-700 border-blue-200";
      case "READ":
        return "bg-purple-500/10 text-purple-700 border-purple-200";
      case "IN_PROGRESS":
        return "bg-orange-500/10 text-orange-700 border-orange-200";
      case "RESOLVED":
        return "bg-green-500/10 text-green-700 border-green-200";
      case "ARCHIVED":
        return "bg-gray-500/10 text-gray-700 border-gray-200";
      default:
        return "";
    }
  };

  // ============================================================================
  // 🎨 Rendu
  // ============================================================================

  if (!message) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            {tMessages("updateStatus")}
          </DialogTitle>
          <DialogDescription>
            {tMessages("updateStatusDescription")}
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Infos du message */}
          <div className="mb-6 p-4 bg-muted rounded-lg space-y-2">
            <div className="flex items-start gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground mt-1" />
              <div className="flex-1">
                <p className="text-sm font-medium">{message.name}</p>
                <p className="text-xs text-muted-foreground">{message.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-xs text-muted-foreground">
                {tMessages("currentStatus")}:
              </span>
              <Badge className={getStatusColor(message.status)}>
                {tMessages(`status${message.status}`)}
              </Badge>
            </div>
          </div>

          {/* Formulaire */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Champ Statut */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tMessages("newStatus")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="NEW">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                            {tMessages("statusNEW")}
                          </div>
                        </SelectItem>
                        <SelectItem value="READ">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-purple-500" />
                            {tMessages("statusREAD")}
                          </div>
                        </SelectItem>
                        <SelectItem value="IN_PROGRESS">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-orange-500" />
                            {tMessages("statusIN_PROGRESS")}
                          </div>
                        </SelectItem>
                        <SelectItem value="RESOLVED">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            {tMessages("statusRESOLVED")}
                          </div>
                        </SelectItem>
                        <SelectItem value="ARCHIVED">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-gray-500" />
                            {tMessages("statusARCHIVED")}
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Champ Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tMessages("internalNotes")}</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={tMessages("notesPlaceholder")}
                        disabled={isLoading}
                        className="min-h-[120px] resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Boutons d'action */}
              <DialogFooter className="gap-2 sm:gap-0 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  {tMessages("cancel")}
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {tMessages("saving")}
                    </>
                  ) : (
                    tMessages("save")
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}