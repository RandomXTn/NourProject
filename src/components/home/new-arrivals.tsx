"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";

interface NewArrivalsProps {
  products: Array<{
    id: string;
    name: string;
    slug: string;
    priceMillimes: number;
    salePriceMillimes: number | null;
    images: Array<{ url: string; alt: string | null; isPrimary: boolean }>;
    variants: Array<{ id: string; name: string; value: string }>;
  }>;
}

const DEMO = [
  {
    id: "na-1",
    name: "Bague Saphir Royal",
    slug: "bague-saphir-royal",
    priceMillimes: 340000,
    salePriceMillimes: null,
    images: [{ url: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&q=80", alt: "Bague saphir", isPrimary: true }],
    variants: [],
  },
  {
    id: "na-2",
    name: "Montre Chronographe Sport",
    slug: "montre-chronographe-sport",
    priceMillimes: 720000,
    salePriceMillimes: null,
    images: [{ url: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600&q=80", alt: "Montre sport", isPrimary: true }],
    variants: [],
  },
  {
    id: "na-3",
    name: "Sac Clutch Soirée",
    slug: "sac-clutch-soiree",
    priceMillimes: 225000,
    salePriceMillimes: 185000,
    images: [{ url: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80", alt: "Sac clutch", isPrimary: true }],
    variants: [],
  },
  {
    id: "na-4",
    name: "Lunettes Cat Eye Vintage",
    slug: "lunettes-cat-eye-vintage",
    priceMillimes: 175000,
    salePriceMillimes: null,
    images: [{ url: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&q=80", alt: "Lunettes cat eye", isPrimary: true }],
    variants: [],
  },
];

export function NewArrivals({ products }: NewArrivalsProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const display = products.length > 0 ? products : DEMO;

  return (
    <section className="py-24 bg-obsidian-50" aria-labelledby="new-arrivals-title">
      <div className="container-luxury">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <span className="block h-px w-12 bg-gold mb-4" />
            <h2 id="new-arrivals-title" className="font-serif text-4xl lg:text-5xl font-light text-ivory">
              Nouveautés
            </h2>
            <p className="text-stone mt-3 text-sm">
              Les dernières pièces de notre sélection exclusive.
            </p>
          </div>
          <Link
            href="/collections/new-arrivals"
            className="hidden sm:inline-flex items-center gap-2 text-xs font-sans font-medium tracking-widest uppercase text-gold hover:text-gold-light transition-colors duration-200 group"
          >
            Tout voir
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {display.slice(0, 4).map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
