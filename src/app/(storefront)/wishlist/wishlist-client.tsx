"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist";
import { ProductCard } from "@/components/product/product-card";

interface Product {
  id: string;
  name: string;
  slug: string;
  priceMillimes: number;
  salePriceMillimes: number | null;
  images: Array<{ url: string; alt: string | null; isPrimary: boolean }>;
  variants: Array<{ id: string; name: string; value: string }>;
}

export function WishlistClient() {
  const ids = useWishlistStore((s) => s.items);
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    if (ids.length === 0) {
      setProducts([]);
      return;
    }
    const params = new URLSearchParams({ ids: ids.join(",") });
    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((data) => setProducts(data.products ?? []))
      .catch(() => setProducts([]));
  }, [ids]);

  if (products === null) {
    return <p className="text-center text-stone py-16">Chargement…</p>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 space-y-6">
        <Heart className="w-12 h-12 text-stone/30 mx-auto" />
        <p className="font-serif text-2xl font-light text-ivory">Aucun favori pour le moment</p>
        <Link href="/shop" className="btn-gold inline-flex">Explorer la boutique</Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 pb-16">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} />
      ))}
    </div>
  );
}
