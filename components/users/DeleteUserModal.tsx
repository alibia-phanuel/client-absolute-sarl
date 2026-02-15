"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, AlertTriangle } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { User } from "@/types/user.types";
import { deleteUser } from "@/lib/users.api";

interface DeleteUserModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onSuccess: () => void;
}

export function DeleteUserModal({
  open,
  onClose,
  user,
  onSuccess,
}: DeleteUserModalProps) {
  const t = useTranslations();
  const tUsers = useTranslations("users");

  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const result = await deleteUser(user.id);
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
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            {tUsers("deleteUser")}
          </DialogTitle>
          <DialogDescription>
            {tUsers("deleteUserDescription")}
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{tUsers("deleteWarning")}</AlertDescription>
          </Alert>

          {user && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">
                  {tUsers("name")}:
                </span>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">
                  {tUsers("email")}:
                </span>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">
                  {tUsers("role")}:
                </span>
                <p className="font-medium">
                  {tUsers(`roles.${user.role.toLowerCase()}`)}
                </p>
              </div>
            </div>
          )}
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
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {tUsers("deleting")}
              </>
            ) : (
              tUsers("confirmDelete")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
