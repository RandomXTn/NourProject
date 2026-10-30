"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";

export function BrandStory() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="py-24 overflow-hidden"
      aria-labelledby="story-title"
    >
      <div className="container-luxury">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
                alt="L'atelier NOUR"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-obsidian/20" />
            </div>
            {/* Gold frame accent */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-gold/30 -z-10" />
            <div className="absolute -top-4 -left-4 w-20 h-20 border border-gold/20 -z-10" />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-6"
          >
            <span className="block h-px w-12 bg-gold" />
            <h2
              id="story-title"
              className="font-serif text-4xl lg:text-5xl font-light text-ivory leading-tight"
            >
              L&apos;art du{" "}
              <span className="italic text-gold-light">raffinement</span>
            </h2>
            <p className="text-stone leading-relaxed">
              NOUR est née d&apos;une passion pour les accessoires d&apos;exception.
              Chaque pièce de notre collection est soigneusement sélectionnée
              pour sa beauté, sa qualité et son caractère intemporel.
            </p>
            <p className="text-stone leading-relaxed">
              Nous croyons que le luxe n&apos;est pas une question de prix —
              c&apos;est une expérience, une émotion, une façon de se sentir
              unique au quotidien.
            </p>

            <div className="grid grid-cols-3 gap-6 py-8 border-y border-border">
              {[
                { value: "500+", label: "Produits sélectionnés" },
                { value: "2000+", label: "Clients satisfaits" },
                { value: "24h", label: "Livraison express" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-serif text-2xl text-gold mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-stone tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <Link href="/about" className="btn-outline-gold inline-flex">
              Notre histoire
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
