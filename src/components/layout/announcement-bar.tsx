"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AnnouncementBarProps {
  text?: string;
  link?: string;
}

export function AnnouncementBar({
  text = "Livraison gratuite pour toute commande supérieure à 150 DT — Code: NOUR150",
  link,
}: AnnouncementBarProps) {
  const [visible, setVisible] = useState(true);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="bg-gold text-obsidian relative flex items-center justify-center px-4 py-2.5">
            <p className="text-center text-xs font-sans font-medium tracking-widest uppercase">
              {link ? (
                <a href={link} className="hover:underline">
                  {text}
                </a>
              ) : (
                text
              )}
            </p>
            <button
              onClick={() => setVisible(false)}
              className="absolute right-4 p-1 hover:opacity-70 transition-opacity"
              aria-label="Fermer l'annonce"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
