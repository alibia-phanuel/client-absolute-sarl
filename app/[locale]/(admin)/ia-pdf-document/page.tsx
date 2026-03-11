"use client";

import React from "react";
import { motion } from "framer-motion";

const Page = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-black text-white px-6">
      {/* Background lumineux animé */}
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[700px] h-[700px] bg-cyan-500/20 rounded-full blur-3xl"
      />

      <motion.div
        animate={{ scale: [1.1, 1, 1.1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl"
      />

      {/* Content */}
      <div className="relative z-10 text-center space-y-8">
        {/* Titre */}
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
        >
          Assistant IA
        </motion.h1>

        {/* Texte dynamique */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="text-zinc-400 text-lg max-w-md mx-auto"
        >
          Intelligence en cours d’initialisation...
        </motion.p>

        {/* Loader circulaire */}
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
              duration: 1.4,
              ease: "linear",
            }}
            className="w-14 h-14 border-4 border-zinc-800 border-t-cyan-400 rounded-full shadow-[0_0_25px_rgba(34,211,238,0.6)]"
          />
        </motion.div>

        {/* Effet typing cursor */}
        <motion.div
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="h-5 w-1 bg-cyan-400 mx-auto rounded"
        />
      </div>
    </div>
  );
};

export default Page;
