"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Loader2, User, Mail, Shield } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { User as UserType } from "@/types/user.types";
import { updateUser } from "@/lib/users.api";

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  user?: UserType | null;
  onSuccess: () => void;
}

export function UserFormModal({
  open,
  onClose,
  user,
  onSuccess,
}: UserFormModalProps) {
  const t = useTranslations();
  const tUsers = useTranslations("users");
  const V = useTranslations("validation");

  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = !!user;

  // Schema de validation – compatible Zod v4 (et v3 avec commentaire)
  const userSchema = z.object({
    name: z
      .string()
      .min(1, V("nameRequired"))
      .min(2, V("nameMin"))
      .max(50, V("nameMax")),
    role: z.enum(["CLIENT", "ADMIN", "EMPLOYE"], {
      // Zod v4 → utiliser 'error' (message unique pour simplicité)
      error: V("roleRequired") || "Le rôle est obligatoire",

      // Si tu es sur Zod v3 (peu probable vu l'erreur), décommente ceci à la place :
      // required_error: V("roleRequired"),
      // invalid_type_error: V("roleInvalid") || "Rôle invalide",
    }),
  });

  type UserFormData = z.infer<typeof userSchema>;

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      role: "CLIENT",
    },
  });

  // Remplir le formulaire si mode édition
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        role: user.role,
      });
    } else {
      form.reset({
        name: "",
        role: "CLIENT",
      });
    }
  }, [user, form]);

  const onSubmit = async (data: UserFormData) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const result = await updateUser(user.id, {
        name: data.name,
        role: data.role,
      });

      toast.success(t(result.messageKey));
      onSuccess();
      onClose();
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      toast.error(t(err.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {isEditMode ? tUsers("editUser") : tUsers("addUser")}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? tUsers("editUserDescription")
              : tUsers("addUserDescription")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Email (read-only en mode édition) */}
            {isEditMode && (
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {tUsers("email")}
                </label>
                <Input
                  value={user?.email}
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
              </div>
            )}

            {/* Nom */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {tUsers("name")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={tUsers("namePlaceholder")}
                        disabled={isLoading}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            {/* Rôle */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      {tUsers("role")}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder={tUsers("selectRole")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CLIENT">
                          {tUsers("roles.client")}
                        </SelectItem>
                        <SelectItem value="EMPLOYE">
                          {tUsers("roles.employe")}
                        </SelectItem>
                        <SelectItem value="ADMIN">
                          {tUsers("roles.admin")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                {tUsers("cancel")}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {tUsers("saving")}
                  </>
                ) : (
                  tUsers("save")
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
