"use client";

import React from "react";
import { motion } from "framer-motion";

const Page = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-black text-white px-6">
      {/* Background animé */}
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-3xl"
      />

      <motion.div
        animate={{ scale: [1.1, 1, 1.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl"
      />

      {/* Content */}
      <div className="relative z-10 text-center space-y-8">
        {/* Titre */}
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent"
        >
          Page en conception
        </motion.h1>

        {/* Sous texte */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="text-zinc-400 text-lg max-w-md mx-auto"
        >
          Une nouvelle expérience est en cours de création. Revenez bientôt.
        </motion.p>

        {/* Loader premium */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex justify-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "linear",
            }}
            className="w-14 h-14 border-4 border-zinc-800 border-t-purple-500 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.6)]"
          />
        </motion.div>

        {/* Barre breathing */}
        <motion.div
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="h-[2px] w-48 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"
        />
      </div>
    </div>
  );
};

export default Page;
