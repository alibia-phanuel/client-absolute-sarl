"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function TermsPage() {
  const t = useTranslations("legal"); // suppose que tu as une section "legal" dans tes traductions

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-background py-12 md:py-20"
    >
      <div className="container max-w-4xl mx-auto px-6 lg:px-8">
        {/* Logo + Titre */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative h-16 w-48 mb-6">
            <Image
              src="/logo.png"
              alt="ABSOLUTE SARL"
              fill
              className="object-contain"
              priority
            />
          </div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-foreground text-center mb-4"
          >
            {/* {t("terms.title") || ""} */}

            Conditions Générales d'Utilisation
          </motion.h1>
          <p className="text-muted-foreground text-center text-lg">
            Dernière mise à jour : 9 février 2026
          </p>
        </div>

        {/* Contenu */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-muted-foreground leading-relaxed mb-8">
            Bienvenue sur la plateforme ABSOLUTE SARL. Les présentes Conditions
            Générales d'Utilisation (« CGU ») régissent votre accès et votre
            utilisation de nos services. En utilisant la plateforme, vous
            acceptez ces conditions.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-12 mb-6">
            1. Acceptation des Conditions
          </h2>
          <p>
            En créant un compte ou en accédant à nos services, vous confirmez
            que vous avez lu, compris et acceptez ces CGU ainsi que notre
            Politique de Confidentialité.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-10 mb-6">
            2. Description des Services
          </h2>
          <p>
            ABSOLUTE SARL fournit une plateforme permettant aux utilisateurs de
            [décrire brièvement les services : ex. gérer leurs réservations,
            accéder à des contenus exclusifs, etc.].
          </p>

          <h3 className="text-xl font-medium mt-8 mb-4">2.1 Éligibilité</h3>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>
              Vous devez avoir au moins 18 ans ou l’âge de la majorité dans
              votre juridiction.
            </li>
            <li>
              Vous garantissez que toutes les informations fournies sont exactes
              et à jour.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-12 mb-6">
            3. Compte Utilisateur
          </h2>
          <p>
            Vous êtes responsable de la confidentialité de vos identifiants.
            Toute activité sur votre compte vous est imputable.
          </p>

          {/* Ajoute autant de sections que nécessaire */}
          <h2 className="text-2xl font-semibold text-foreground mt-12 mb-6">
            4. Propriété Intellectuelle
          </h2>
          <p>
            Tous les contenus présents sur la plateforme sont protégés par le
            droit d'auteur et restent la propriété exclusive d'ABSOLUTE SARL ou
            de ses concédants.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-12 mb-6">
            5. Limitation de Responsabilité
          </h2>
          <p>
            Nos services sont fournis « en l’état ». Nous ne garantissons pas un
            fonctionnement ininterrompu ou sans erreur.
          </p>

          {/* ... plus de sections ... */}

          <div className="mt-16 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>ABSOLUTE SARL – SARL au capital de XXX € – RCS Yaoundé XXX</p>
            <p>Contact : contact@absolute-sarl.cm</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
