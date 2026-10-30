"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export function HeroSection() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden" aria-label="Hero">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1920&q=80"
          alt="Collection NOUR — Bijoux et accessoires de luxe"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/90 via-obsidian/60 to-obsidian/20" />
        <div className="absolute inset-0 bg-hero-gradient" />
      </div>

      {/* Gold particles decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-16 bg-gradient-to-b from-transparent via-gold/30 to-transparent"
            style={{
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative container-luxury">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-2xl"
        >
          {/* Eyebrow */}
          <motion.div variants={item} className="flex items-center gap-3 mb-6">
            <span className="block h-px w-10 bg-gold" />
            <span className="text-gold text-xs font-sans font-medium tracking-[0.3em] uppercase">
              Nouvelle Collection
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={item}
            className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light text-ivory leading-[1.05] mb-6"
          >
            L&apos;Art de{" "}
            <span className="italic text-gold-light">l&apos;Élégance</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={item}
            className="text-base sm:text-lg text-stone max-w-md leading-relaxed mb-10"
          >
            Bijoux, montres, sacs et lunettes sélectionnés pour celles et ceux
            qui exigent l&apos;excellence.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <Link
              href="/shop"
              className="btn-gold group inline-flex items-center gap-2"
            >
              Découvrir la Collection
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/collections/new-arrivals"
              className="btn-outline-gold"
            >
              Nouveautés
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-2xs text-stone/50 tracking-widest uppercase">
          Défiler
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-gold/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}
