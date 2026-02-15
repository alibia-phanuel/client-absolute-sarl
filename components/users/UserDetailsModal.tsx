"use client";

import { motion } from "framer-motion";
import { User, Mail, Shield, Calendar, CheckCircle, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { useLocale } from "next-intl";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { User as UserType } from "@/types/user.types";

interface UserDetailsModalProps {
  open: boolean;
  onClose: () => void;
  user: UserType | null;
}

export function UserDetailsModal({
  open,
  onClose,
  user,
}: UserDetailsModalProps) {
  const tUsers = useTranslations("users");
  const locale = useLocale();

  if (!user) return null;

  const dateLocale = locale === "fr" ? fr : enUS;

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "destructive";
      case "EMPLOYE":
        return "default";
      case "CLIENT":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {tUsers("userDetails")}
          </DialogTitle>
          <DialogDescription>
            {tUsers("userDetailsDescription")}
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6 py-4"
        >
          {/* Nom et Email */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  {tUsers("name")}
                </p>
                <p className="text-lg font-semibold">{user.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-500/10 text-blue-600">
                <Mail className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  {tUsers("email")}
                </p>
                <p className="text-base font-medium">{user.email}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Rôle et Statut */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-500/10 text-purple-600">
                <Shield className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">
                  {tUsers("role")}
                </p>
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {tUsers(`roles.${user.role.toLowerCase()}`)}
                </Badge>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div
                className={`flex items-center justify-center h-10 w-10 rounded-full ${
                  user.isAccountVerified
                    ? "bg-green-500/10 text-green-600"
                    : "bg-orange-500/10 text-orange-600"
                }`}
              >
                {user.isAccountVerified ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">
                  {tUsers("status")}
                </p>
                <Badge
                  variant={user.isAccountVerified ? "default" : "outline"}
                  className={
                    user.isAccountVerified
                      ? "bg-green-500 hover:bg-green-600"
                      : "text-orange-600 border-orange-600"
                  }
                >
                  {user.isAccountVerified
                    ? tUsers("verified")
                    : tUsers("notVerified")}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Dates */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-500/10 text-gray-600">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  {tUsers("createdAt")}
                </p>
                <p className="text-base font-medium">
                  {format(new Date(user.createdAt), "PPP 'à' p", {
                    locale: dateLocale,
                  })}
                </p>
              </div>
            </div>

            {user.updatedAt && user.updatedAt !== user.createdAt && (
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-500/10 text-gray-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    {tUsers("updatedAt")}
                  </p>
                  <p className="text-base font-medium">
                    {format(new Date(user.updatedAt), "PPP 'à' p", {
                      locale: dateLocale,
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}