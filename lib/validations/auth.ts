import { z } from "zod";

// Schéma pour la connexion
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide"),
  password: z
    .string()
    .min(1, "Le mot de passe est requis")
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Schéma pour l'inscription
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Le nom est requis")
      .min(2, "Le nom doit contenir au moins 2 caractères")
      .max(50, "Le nom ne peut pas dépasser 50 caractères"),
    email: z
      .string()
      .min(1, "L'email est requis")
      .email("Format d'email invalide"),
    password: z
      .string()
      .min(1, "Le mot de passe est requis")
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre",
      ),
    confirmPassword: z.string().min(1, "Veuillez confirmer votre mot de passe"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

// Schéma pour la réinitialisation de mot de passe
export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide"),
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// Schéma pour le nouveau mot de passe
export const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Le mot de passe est requis")
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre",
      ),
    confirmPassword: z.string().min(1, "Veuillez confirmer votre mot de passe"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type NewPasswordFormData = z.infer<typeof newPasswordSchema>;

// Schéma pour la vérification d'email
export const verifyEmailSchema = z.object({
  code: z
    .string()
    .min(1, "Le code est requis")
    .length(6, "Le code doit contenir 6 caractères"),
});

export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;
