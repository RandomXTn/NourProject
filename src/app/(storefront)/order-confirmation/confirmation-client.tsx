"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";

export function OrderConfirmationClient() {
  const params = useSearchParams();
  const orderNumber = params.get("order");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center max-w-md space-y-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
      >
        <CheckCircle className="w-16 h-16 text-gold mx-auto" />
      </motion.div>

      <div>
        <h1 className="font-serif text-4xl font-light text-ivory mb-3">Commande confirmée !</h1>
        <p className="text-stone text-sm leading-relaxed">
          Merci pour votre commande. Vous recevrez une confirmation sous peu.
        </p>
        {orderNumber && (
          <p className="mt-4 text-gold font-mono text-sm">
            N° de commande : <strong>{orderNumber}</strong>
          </p>
        )}
      </div>

      <div className="border border-border p-6 text-left space-y-3">
        <p className="text-xs font-medium tracking-widest uppercase text-ivory mb-3">Prochaines étapes</p>
        {[
          "Votre commande est en cours de traitement",
          "Vous serez contacté pour confirmer la livraison",
          "Livraison sous 2–4 jours ouvrables",
        ].map((step, i) => (
          <div key={i} className="flex items-start gap-3 text-sm text-stone">
            <span className="w-5 h-5 rounded-full bg-gold/20 text-gold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
            {step}
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/account/orders" className="btn-outline-gold btn-sm flex items-center gap-2">
          <ShoppingBag className="w-4 h-4" />
          Mes commandes
        </Link>
        <Link href="/shop" className="btn-gold btn-sm group flex items-center gap-2">
          Continuer les achats
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
