"use client";
import { useTranslations } from "next-intl";
 
import { motion } from "framer-motion";

export default function ServerInProgress() {
    const t = useTranslations("HomePage");
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 dark:bg-black">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex max-w-xl flex-col items-center gap-6 rounded-2xl border border-zinc-200 bg-white p-10 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
      >
        {/* Loader */}
        <motion.div
          className="h-10 w-10 rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
        />

        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          <h1>{t("title")}</h1>;
        </h1>

        <p className="text-base leading-7 text-zinc-600 dark:text-zinc-400">
          La partie <strong>front-end</strong> est fonctionnelle et publique.
          <br />
          Le <strong>serveur</strong> est actuellement en développement et sera
          intégré progressivement.
        </p>

        <p className="text-sm text-zinc-500 dark:text-zinc-500">
          Projet réalisé dans le cadre d’une mission freelance pour{" "}
          <strong>Absolute-Sarl</strong>.
        </p>
      </motion.div>
    </div>
  );
}
