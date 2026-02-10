"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function PrivacyPage() {
  const t = useTranslations("legal");

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
            {/* {t("privacy.title") || "} */}
            Politique de Confidentialité
          </motion.h1>
          <p className="text-muted-foreground text-center text-lg">
            Dernière mise à jour : 9 février 2026
          </p>
        </div>

        {/* Contenu */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-muted-foreground leading-relaxed mb-8">
            Chez ABSOLUTE SARL, nous respectons votre vie privée. Cette
            Politique de Confidentialité explique comment nous collectons,
            utilisons, partageons et protégeons vos données personnelles.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-12 mb-6">
            1. Données que nous collectons
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>
              Informations d’inscription : nom, email, mot de passe (haché)
            </li>
            <li>
              Données d’utilisation : pages visitées, interactions, IP,
              navigateur
            </li>
            <li>Données techniques : cookies, logs, device info</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-10 mb-6">
            2. Finalités de la collecte
          </h2>
          <p>Nous utilisons vos données pour :</p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Fournir et améliorer nos services</li>
            <li>Authentification et sécurité du compte</li>
            <li>Communications (newsletters, OTP, support)</li>
            <li>Respect des obligations légales</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-12 mb-6">
            3. Partage de vos données
          </h2>
          <p>
            Nous ne vendons pas vos données. Nous pouvons les partager avec :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Fournisseurs de services (hébergement, email, OTP)</li>
            <li>Autorités compétentes en cas d’obligation légale</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-12 mb-6">
            4. Sécurité des données
          </h2>
          <p>
            Nous mettons en œuvre des mesures techniques et organisationnelles
            appropriées pour protéger vos données (chiffrement, accès restreint,
            etc.).
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-12 mb-6">
            5. Vos droits
          </h2>
          <p>
            Conformément au RGPD et à la loi camerounaise sur la protection des
            données, vous disposez des droits d’accès, de rectification,
            d’effacement, de limitation, de portabilité et d’opposition.
          </p>

          {/* ... plus de sections ... */}

          <div className="mt-16 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>ABSOLUTE SARL – SARL au capital de XXX € – RCS Yaoundé XXX</p>
            <p>Contact DPO : dpo@absolute-sarl.cm</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
