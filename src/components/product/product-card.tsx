"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { toast } from "@/hooks/use-toast";

interface ProductCardProduct {
  id: string;
  name: string;
  slug: string;
  priceMillimes: number;
  salePriceMillimes: number | null;
  images: Array<{ url: string; alt: string | null; isPrimary: boolean }>;
  variants: Array<{ id: string; name: string; value: string }>;
}

interface ProductCardProps {
  product: ProductCardProduct;
  index?: number;
  className?: string;
}

export function ProductCard({ product, index = 0, className }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [adding, setAdding] = useState(false);

  const { addItem } = useCartStore();
  const { toggle, has } = useWishlistStore();

  const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const secondaryImage = product.images[1];

  const isWishlisted = has(product.id);
  const isOnSale =
    product.salePriceMillimes !== null &&
    product.salePriceMillimes < product.priceMillimes;
  const activePrice = isOnSale
    ? product.salePriceMillimes!
    : product.priceMillimes;

  const discount = isOnSale
    ? Math.round(
        ((product.priceMillimes - product.salePriceMillimes!) /
          product.priceMillimes) *
          100
      )
    : 0;

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (product.variants.length > 1) {
      window.location.href = `/products/${product.slug}`;
      return;
    }
    const variant = product.variants[0];
    setAdding(true);
    addItem({
      productId: product.id,
      variantId: variant?.id,
      name: product.name,
      slug: product.slug,
      imageUrl: primaryImage?.url,
      priceMillimes: activePrice,
      variant: variant
        ? { id: variant.id, name: variant.name, value: variant.value }
        : null,
      qty: 1,
      maxQty: 99,
    });
    toast({ title: "Ajouté au panier", description: product.name, variant: "success" });
    setTimeout(() => setAdding(false), 600);
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggle(product.id);
    toast({
      title: isWishlisted ? "Retiré des favoris" : "Ajouté aux favoris",
      description: product.name,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.07, 0.4), ease: [0.25, 0.1, 0.25, 1] }}
      className={cn("group", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-obsidian-100 aspect-[3/4]">
          {/* Primary Image */}
          {primaryImage && (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt ?? product.name}
              fill
              className={cn(
                "object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                hovered && secondaryImage ? "opacity-0" : "opacity-100",
                hovered && !secondaryImage ? "scale-105" : "scale-100"
              )}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}

          {/* Secondary Image (hover) */}
          {secondaryImage && (
            <Image
              src={secondaryImage.url}
              alt={secondaryImage.alt ?? product.name}
              fill
              className={cn(
                "object-cover absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                hovered ? "opacity-100 scale-100" : "opacity-0 scale-105"
              )}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isOnSale && (
              <span className="px-2 py-1 bg-gold text-obsidian text-2xs font-sans font-bold tracking-wider uppercase">
                -{discount}%
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {/* Wishlist */}
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 10 }}
              transition={{ duration: 0.2 }}
              onClick={handleWishlist}
              className={cn(
                "p-2 backdrop-blur-sm transition-colors duration-200",
                isWishlisted
                  ? "bg-gold text-obsidian"
                  : "bg-obsidian/60 text-ivory hover:bg-gold hover:text-obsidian"
              )}
              aria-label={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Heart
                className="w-4 h-4"
                fill={isWishlisted ? "currentColor" : "none"}
              />
            </motion.button>

            {/* Quick View */}
            <motion.a
              href={`/products/${product.slug}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 10 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              className="p-2 bg-obsidian/60 text-ivory hover:bg-obsidian backdrop-blur-sm transition-colors duration-200"
              aria-label="Voir le produit"
            >
              <Eye className="w-4 h-4" />
            </motion.a>
          </div>

          {/* Add to Cart - bottom overlay */}
          <motion.button
            initial={{ y: "100%" }}
            animate={{ y: hovered ? 0 : "100%" }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={handleAddToCart}
            disabled={adding}
            className="absolute bottom-0 inset-x-0 flex items-center justify-center gap-2 py-3.5 bg-obsidian/90 backdrop-blur-sm text-xs font-sans font-medium tracking-widest uppercase text-gold hover:bg-obsidian transition-colors duration-200 disabled:opacity-60"
            aria-label="Ajouter au panier"
          >
            <ShoppingBag className="w-4 h-4" />
            {adding ? "Ajouté !" : product.variants.length > 1 ? "Choisir" : "Ajouter"}
          </motion.button>
        </div>

        {/* Product Info */}
        <div className="pt-4 pb-2">
          <p className="text-xs text-stone/60 tracking-widest uppercase mb-1 truncate">
            {/* Category would go here */}
          </p>
          <h3 className="text-sm font-sans text-ivory/90 group-hover:text-ivory transition-colors duration-200 truncate">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-1.5 flex items-center gap-2">
            <span
              className={cn(
                "text-sm font-medium",
                isOnSale ? "text-gold" : "text-ivory/80"
              )}
            >
              {formatPrice(activePrice)}
            </span>
            {isOnSale && (
              <span className="text-xs text-stone/60 line-through">
                {formatPrice(product.priceMillimes)}
              </span>
            )}
          </div>

          {/* Variant dots (colors) */}
          {product.variants.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5">
              {product.variants.slice(0, 5).map((v) => (
                <div
                  key={v.id}
                  className="w-3 h-3 rounded-full border border-border bg-obsidian-200"
                  title={v.value}
                  style={
                    v.name.toLowerCase() === "couleur"
                      ? { backgroundColor: v.value.toLowerCase() }
                      : {}
                  }
                />
              ))}
              {product.variants.length > 5 && (
                <span className="text-2xs text-stone/50">
                  +{product.variants.length - 5}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
