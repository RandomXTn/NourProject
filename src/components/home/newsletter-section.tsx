"use client";

import { useState } from "react";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        toast({
          title: "Inscription réussie !",
          description: "Vous recevrez nos dernières nouveautés.",
          variant: "success",
        });
        setEmail("");
      } else {
        toast({
          title: "Une erreur est survenue",
          description: "Veuillez réessayer.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Erreur de connexion",
        description: "Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      ref={ref}
      className="py-20 relative overflow-hidden"
      aria-labelledby="newsletter-title"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-obsidian-50" />
      <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5" />

      <div className="relative container-luxury max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <Mail className="w-8 h-8 text-gold mx-auto" />
          <h2
            id="newsletter-title"
            className="font-serif text-4xl font-light text-ivory"
          >
            Restez dans l&apos;exclusivité
          </h2>
          <p className="text-stone text-sm leading-relaxed max-w-md mx-auto">
            Inscrivez-vous pour recevoir en avant-première nos nouvelles
            collections, offres exclusives et inspirations mode.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto mt-8"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Adresse e-mail
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse e-mail"
              required
              className="input-luxury flex-1 border-r-0"
              autoComplete="email"
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-gold flex-shrink-0 group"
            >
              {loading ? "..." : (
                <>
                  S&apos;inscrire
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-2xs text-stone/50">
            En vous inscrivant, vous acceptez notre politique de
            confidentialité. Désinscription possible à tout moment.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
