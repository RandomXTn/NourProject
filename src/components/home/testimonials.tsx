"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Yasmine B.",
    location: "Tunis",
    rating: 5,
    text: "La qualité est exceptionnelle. J'ai commandé un collier en or et il est encore plus beau en vrai qu'en photo. La livraison était rapide et l'emballage soigné.",
  },
  {
    id: 2,
    name: "Mehdi K.",
    location: "Sousse",
    rating: 5,
    text: "J'ai offert une montre à ma femme pour notre anniversaire. Elle était ravie. Le service client est très réactif et professionnel. Je recommande vivement.",
  },
  {
    id: 3,
    name: "Nadia T.",
    location: "Sfax",
    rating: 5,
    text: "Des pièces uniques qu'on ne trouve pas ailleurs en Tunisie. Le rapport qualité-prix est excellent. NOUR est ma boutique préférée pour les accessoires.",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className="w-3.5 h-3.5"
          fill={i < rating ? "#C8A45D" : "none"}
          stroke={i < rating ? "#C8A45D" : "#6B6560"}
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const prev = () =>
    setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setCurrent((c) => (c + 1) % TESTIMONIALS.length);

  return (
    <section className="py-24" aria-labelledby="testimonials-title" ref={ref}>
      <div className="container-luxury max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="gold-line mb-4" />
          <h2
            id="testimonials-title"
            className="font-serif text-4xl lg:text-5xl font-light text-ivory mt-4"
          >
            Ce que disent nos clients
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          {/* Large quote mark */}
          <div
            className="absolute -top-8 left-1/2 -translate-x-1/2 font-serif text-9xl text-gold/10 select-none pointer-events-none leading-none"
            aria-hidden="true"
          >
            &ldquo;
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="text-center px-8"
            >
              <StarRating rating={TESTIMONIALS[current].rating} />
              <blockquote className="font-serif text-xl lg:text-2xl font-light text-ivory/90 leading-relaxed mt-6 mb-8">
                &ldquo;{TESTIMONIALS[current].text}&rdquo;
              </blockquote>
              <div>
                <p className="text-sm font-medium text-ivory">
                  {TESTIMONIALS[current].name}
                </p>
                <p className="text-xs text-stone mt-1">
                  {TESTIMONIALS[current].location}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mt-10">
            <button
              onClick={prev}
              className="p-2 text-stone hover:text-gold transition-colors duration-200"
              aria-label="Précédent"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`transition-all duration-300 ${
                    i === current
                      ? "w-8 h-px bg-gold"
                      : "w-4 h-px bg-border-light hover:bg-stone"
                  }`}
                  aria-label={`Avis ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="p-2 text-stone hover:text-gold transition-colors duration-200"
              aria-label="Suivant"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
