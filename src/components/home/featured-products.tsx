"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { ArrowRight } from "lucide-react";

interface FeaturedProductsProps {
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

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  // Show placeholder cards if no products yet
  const displayProducts = products.length > 0 ? products : DEMO_PRODUCTS;

  return (
    <section
      className="py-24 bg-obsidian-50"
      aria-labelledby="featured-title"
    >
      <div className="container-luxury">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <span className="block h-px w-12 bg-gold mb-4" />
            <h2
              id="featured-title"
              className="font-serif text-4xl lg:text-5xl font-light text-ivory"
            >
              Sélection du moment
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-2 text-xs font-sans font-medium tracking-widest uppercase text-gold hover:text-gold-light transition-colors duration-200 group"
          >
            Voir tout
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayProducts.slice(0, 8).map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Link href="/shop" className="btn-outline-gold btn-sm">
            Voir tous les produits
          </Link>
        </div>
      </div>
    </section>
  );
}

// Demo products for empty state
const DEMO_PRODUCTS = [
  {
    id: "demo-1",
    name: "Collier Diamant Éternel",
    slug: "collier-diamant-eternel",
    priceMillimes: 285000,
    salePriceMillimes: null,
    images: [
      {
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80",
        alt: "Collier diamant",
        isPrimary: true,
      },
    ],
    variants: [],
  },
  {
    id: "demo-2",
    name: "Montre Prestige Or",
    slug: "montre-prestige-or",
    priceMillimes: 890000,
    salePriceMillimes: 750000,
    images: [
      {
        url: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80",
        alt: "Montre prestige",
        isPrimary: true,
      },
    ],
    variants: [],
  },
  {
    id: "demo-3",
    name: "Sac Cuir Milano",
    slug: "sac-cuir-milano",
    priceMillimes: 420000,
    salePriceMillimes: null,
    images: [
      {
        url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
        alt: "Sac cuir",
        isPrimary: true,
      },
    ],
    variants: [],
  },
  {
    id: "demo-4",
    name: "Lunettes Solaires Aviateur",
    slug: "lunettes-solaires-aviateur",
    priceMillimes: 195000,
    salePriceMillimes: null,
    images: [
      {
        url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80",
        alt: "Lunettes aviateur",
        isPrimary: true,
      },
    ],
    variants: [],
  },
  {
    id: "demo-5",
    name: "Bracelet Or Rose",
    slug: "bracelet-or-rose",
    priceMillimes: 165000,
    salePriceMillimes: null,
    images: [
      {
        url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80",
        alt: "Bracelet or rose",
        isPrimary: true,
      },
    ],
    variants: [],
  },
  {
    id: "demo-6",
    name: "Montre Automatique Noire",
    slug: "montre-automatique-noire",
    priceMillimes: 650000,
    salePriceMillimes: null,
    images: [
      {
        url: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80",
        alt: "Montre automatique",
        isPrimary: true,
      },
    ],
    variants: [],
  },
  {
    id: "demo-7",
    name: "Sac à Main Velours",
    slug: "sac-main-velours",
    priceMillimes: 310000,
    salePriceMillimes: 260000,
    images: [
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80",
        alt: "Sac velours",
        isPrimary: true,
      },
    ],
    variants: [],
  },
  {
    id: "demo-8",
    name: "Boucles d'Oreilles Perles",
    slug: "boucles-oreilles-perles",
    priceMillimes: 125000,
    salePriceMillimes: null,
    images: [
      {
        url: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&q=80",
        alt: "Boucles perles",
        isPrimary: true,
      },
    ],
    variants: [],
  },
];
