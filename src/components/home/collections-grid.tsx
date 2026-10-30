"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useInView } from "framer-motion";
import { useRef } from "react";

const COLLECTIONS = [
  {
    name: "Bijoux",
    tagline: "L'élégance dans chaque détail",
    href: "/collections/jewelry",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
    alt: "Collection Bijoux NOUR",
  },
  {
    name: "Montres",
    tagline: "Précision intemporelle",
    href: "/collections/watches",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80",
    alt: "Collection Montres NOUR",
  },
  {
    name: "Sacs",
    tagline: "Sophistication au quotidien",
    href: "/collections/bags",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    alt: "Collection Sacs NOUR",
  },
  {
    name: "Lunettes",
    tagline: "Un style distinctif",
    href: "/collections/sunglasses",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
    alt: "Collection Lunettes NOUR",
  },
];

function CollectionCard({
  collection,
  index,
}: {
  collection: (typeof COLLECTIONS)[0];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link
        href={collection.href}
        className="group relative block overflow-hidden aspect-[3/4] bg-obsidian-50"
        aria-label={`Collection ${collection.name}`}
      >
        {/* Image */}
        <Image
          src={collection.image}
          alt={collection.alt}
          fill
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <span className="block h-px w-8 bg-gold mb-3 transition-all duration-500 group-hover:w-12" />
          <h2 className="font-serif text-2xl font-light text-ivory mb-1">
            {collection.name}
          </h2>
          <p className="text-xs text-stone/80 tracking-wide mb-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
            {collection.tagline}
          </p>
          <span className="inline-flex items-center gap-2 text-xs font-sans font-medium tracking-widest uppercase text-gold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-75">
            Explorer
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export function CollectionsGrid() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 container-luxury" aria-labelledby="collections-title">
      {/* Header */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <span className="gold-line mb-4" />
        <h2
          id="collections-title"
          className="font-serif text-4xl lg:text-5xl font-light text-ivory mt-4"
        >
          Nos Collections
        </h2>
        <p className="text-stone mt-4 text-sm max-w-md mx-auto leading-relaxed">
          Quatre univers, une seule signature — l&apos;excellence NOUR.
        </p>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {COLLECTIONS.map((col, i) => (
          <CollectionCard key={col.href} collection={col} index={i} />
        ))}
      </div>
    </section>
  );
}
