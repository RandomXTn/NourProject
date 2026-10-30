"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Truck, RotateCcw, Shield, CreditCard } from "lucide-react";

const FEATURES = [
  {
    icon: Truck,
    title: "Livraison en Tunisie",
    description: "Livraison rapide dans tous les gouvernorats. Gratuite dès 150 DT.",
  },
  {
    icon: RotateCcw,
    title: "Retours facilités",
    description: "14 jours pour changer d'avis. Retour simple et sans tracas.",
  },
  {
    icon: Shield,
    title: "Paiement sécurisé",
    description: "Transactions protégées. Paiement en ligne ou à la livraison.",
  },
  {
    icon: CreditCard,
    title: "Paiement à la livraison",
    description: "Payez cash à la réception de votre commande dans toute la Tunisie.",
  },
];

export function ShippingInfo() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="border-t border-border py-16" ref={ref}>
      <div className="container-luxury">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center space-y-3"
            >
              <div className="w-10 h-10 mx-auto flex items-center justify-center border border-gold/30">
                <feat.icon className="w-5 h-5 text-gold" />
              </div>
              <h3 className="text-sm font-sans font-medium tracking-wide text-ivory">
                {feat.title}
              </h3>
              <p className="text-xs text-stone leading-relaxed">
                {feat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
