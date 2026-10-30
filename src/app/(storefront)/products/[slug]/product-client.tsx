"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, ShoppingBag, Share2, ChevronRight, Star, Minus, Plus, ZoomIn
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { toast } from "@/hooks/use-toast";
import { ProductCard } from "@/components/product/product-card";

interface Review {
  id: string;
  name: string;
  rating: number;
  title: string | null;
  body: string;
  createdAt: Date;
}

interface Variant {
  id: string;
  name: string;
  value: string;
  sku?: string | null;
  priceMillimes: number | null;
  stockQty: number;
  imageUrl: string | null;
}

interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  isPrimary: boolean;
}

interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDesc: string | null;
  priceMillimes: number;
  salePriceMillimes: number | null;
  sku: string | null;
  material: string | null;
  images: ProductImage[];
  variants: Variant[];
  reviews: Review[];
  category: { name: string; slug: string } | null;
}

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  priceMillimes: number;
  salePriceMillimes: number | null;
  images: Array<{ url: string; alt: string | null; isPrimary: boolean }>;
  variants: Array<{ id: string; name: string; value: string }>;
}

interface ProductPageClientProps {
  product: ProductDetail;
  related: RelatedProduct[];
}

export function ProductPageClient({ product, related }: ProductPageClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants[0] ?? null
  );
  const [qty, setQty] = useState(1);
  const [zoomed, setZoomed] = useState(false);
  const [adding, setAdding] = useState(false);

  const { addItem } = useCartStore();
  const { toggle, has } = useWishlistStore();
  const isWishlisted = has(product.id);

  const isOnSale = product.salePriceMillimes !== null && product.salePriceMillimes < product.priceMillimes;
  const activePrice = selectedVariant?.priceMillimes
    ?? (isOnSale ? product.salePriceMillimes! : product.priceMillimes);

  const currentImage = product.images[selectedImage];

  const stockQty = selectedVariant ? selectedVariant.stockQty : 99;
  const inStock = stockQty > 0;

  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 0;

  function handleAddToCart() {
    if (!inStock) return;
    setAdding(true);
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      slug: product.slug,
      imageUrl: currentImage?.url,
      priceMillimes: activePrice,
      variant: selectedVariant ? {
        id: selectedVariant.id,
        name: selectedVariant.name,
        value: selectedVariant.value,
        priceMillimes: selectedVariant.priceMillimes,
      } : null,
      qty,
      maxQty: stockQty,
    });
    toast({ title: "Ajouté au panier", description: product.name, variant: "success" });
    setTimeout(() => setAdding(false), 600);
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Lien copié", description: "Le lien a été copié dans le presse-papier." });
    }
  }

  // Group variants by name
  const variantGroups = product.variants.reduce<Record<string, Variant[]>>(
    (acc, v) => {
      if (!acc[v.name]) acc[v.name] = [];
      acc[v.name].push(v);
      return acc;
    },
    {}
  );

  return (
    <div className="container-luxury py-12">
      {/* Breadcrumbs */}
      <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-xs text-stone mb-8">
        <Link href="/" className="hover:text-ivory transition-colors">Accueil</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/shop" className="hover:text-ivory transition-colors">Boutique</Link>
        {product.category && (
          <>
            <ChevronRight className="w-3 h-3" />
            <Link
              href={`/collections/${product.category.slug}`}
              className="hover:text-ivory transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3 h-3" />
        <span className="text-ivory truncate">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
        {/* Images */}
        <div className="space-y-4">
          {/* Main image */}
          <div
            className="relative overflow-hidden aspect-square bg-obsidian-50 cursor-zoom-in"
            onClick={() => setZoomed(true)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                {currentImage && (
                  <Image
                    src={currentImage.url}
                    alt={currentImage.alt ?? product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                )}
              </motion.div>
            </AnimatePresence>
            <div className="absolute top-4 right-4 p-2 bg-obsidian/60 backdrop-blur-sm">
              <ZoomIn className="w-4 h-4 text-stone" />
            </div>
            {isOnSale && (
              <div className="absolute top-4 left-4 px-2 py-1 bg-gold text-obsidian text-2xs font-bold tracking-wider uppercase">
                Promo
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "relative aspect-square overflow-hidden border-2 transition-colors duration-200",
                    i === selectedImage ? "border-gold" : "border-transparent hover:border-border-light"
                  )}
                  aria-label={`Image ${i + 1}`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt ?? product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {product.category && (
            <Link
              href={`/collections/${product.category.slug}`}
              className="text-xs text-gold/70 hover:text-gold tracking-widest uppercase transition-colors"
            >
              {product.category.name}
            </Link>
          )}

          <h1 className="font-serif text-3xl lg:text-4xl font-light text-ivory leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          {product.reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4"
                    fill={i < Math.round(avgRating) ? "#C8A45D" : "none"}
                    stroke={i < Math.round(avgRating) ? "#C8A45D" : "#6B6560"}
                  />
                ))}
              </div>
              <a href="#reviews" className="text-xs text-stone hover:text-ivory transition-colors">
                ({product.reviews.length} avis)
              </a>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className={cn("font-serif text-2xl", isOnSale ? "text-gold" : "text-ivory")}>
              {formatPrice(activePrice)}
            </span>
            {isOnSale && (
              <span className="text-stone line-through text-sm">
                {formatPrice(product.priceMillimes)}
              </span>
            )}
          </div>

          {product.shortDesc && (
            <p className="text-stone text-sm leading-relaxed border-t border-border pt-4">
              {product.shortDesc}
            </p>
          )}

          {/* Variants */}
          {Object.entries(variantGroups).map(([groupName, variants]) => (
            <div key={groupName}>
              <p className="text-xs font-medium tracking-widest uppercase text-ivory mb-3">
                {groupName}
                {selectedVariant && variants.some((v) => v.id === selectedVariant.id) && (
                  <span className="text-stone font-normal ml-2">: {selectedVariant.value}</span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(selectedVariant?.id === variant.id ? null : variant)}
                    disabled={variant.stockQty === 0}
                    className={cn(
                      "px-4 py-2 text-xs border transition-all duration-200",
                      selectedVariant?.id === variant.id
                        ? "border-gold text-gold bg-gold/5"
                        : "border-border text-stone hover:border-stone",
                      variant.stockQty === 0 && "opacity-30 cursor-not-allowed line-through"
                    )}
                  >
                    {variant.value}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-border">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="p-3 text-stone hover:text-ivory transition-colors"
                aria-label="Diminuer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center text-ivory">{qty}</span>
              <button
                onClick={() => setQty(Math.min(stockQty, qty + 1))}
                disabled={qty >= stockQty}
                className="p-3 text-stone hover:text-ivory transition-colors disabled:opacity-30"
                aria-label="Augmenter"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {!inStock && (
              <span className="text-xs text-red-400 tracking-widest uppercase">
                Rupture de stock
              </span>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!inStock || adding}
              className="btn-gold flex-1 group"
            >
              <ShoppingBag className="w-4 h-4" />
              {adding ? "Ajouté !" : inStock ? "Ajouter au panier" : "Indisponible"}
            </button>
            <button
              onClick={() => toggle(product.id)}
              className={cn(
                "p-4 border transition-all duration-200",
                isWishlisted
                  ? "border-gold bg-gold/5 text-gold"
                  : "border-border text-stone hover:border-gold hover:text-gold"
              )}
              aria-label={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Heart
                className="w-5 h-5"
                fill={isWishlisted ? "currentColor" : "none"}
              />
            </button>
            <button
              onClick={handleShare}
              className="p-4 border border-border text-stone hover:border-gold hover:text-gold transition-all duration-200"
              aria-label="Partager"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* SKU / Material */}
          <div className="border-t border-border pt-4 space-y-2 text-xs text-stone">
            {product.sku && <p>Référence : {selectedVariant?.sku ?? product.sku}</p>}
            {product.material && <p>Matière : {product.material}</p>}
          </div>

          {/* Delivery info */}
          <div className="border border-border p-4 space-y-2">
            <p className="text-xs font-medium tracking-widest uppercase text-ivory mb-3">
              Livraison & Retours
            </p>
            <p className="text-xs text-stone leading-relaxed">
              🚚 Livraison en 2–4 jours ouvrables dans toute la Tunisie
            </p>
            <p className="text-xs text-stone leading-relaxed">
              🎁 Livraison gratuite dès 150 DT d&apos;achat
            </p>
            <p className="text-xs text-stone leading-relaxed">
              ↩️ Retours acceptés sous 14 jours
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="mt-16 max-w-2xl">
          <h2 className="font-serif text-2xl font-light text-ivory mb-4">
            Description
          </h2>
          <div className="prose prose-invert prose-sm text-stone leading-relaxed">
            {product.description.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      {product.reviews.length > 0 && (
        <div id="reviews" className="mt-16">
          <h2 className="font-serif text-2xl font-light text-ivory mb-8">
            Avis clients ({product.reviews.length})
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {product.reviews.map((review) => (
              <div key={review.id} className="border border-border p-5 space-y-3">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5"
                      fill={i < review.rating ? "#C8A45D" : "none"}
                      stroke={i < review.rating ? "#C8A45D" : "#6B6560"}
                    />
                  ))}
                </div>
                {review.title && (
                  <p className="text-sm font-medium text-ivory">{review.title}</p>
                )}
                <p className="text-sm text-stone leading-relaxed">{review.body}</p>
                <p className="text-xs text-stone/50">
                  {review.name} · {new Date(review.createdAt).toLocaleDateString("fr-TN")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-20">
          <div className="flex items-center gap-4 mb-10">
            <span className="block h-px w-12 bg-gold" />
            <h2 className="font-serif text-3xl font-light text-ivory">
              Vous pourriez aimer
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Zoom Modal */}
      <AnimatePresence>
        {zoomed && currentImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-obsidian/95 flex items-center justify-center p-4"
            onClick={() => setZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl max-h-[90vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={currentImage.url}
                alt={currentImage.alt ?? product.name}
                fill
                className="object-contain"
              />
              <button
                onClick={() => setZoomed(false)}
                className="absolute top-4 right-4 p-2 bg-obsidian/60 text-ivory hover:text-gold transition-colors"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
