"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { cartItemCount, cartSubtotal, useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, couponCode, discountMillimes } =
    useCartStore();
  const subtotalMillimes = cartSubtotal(items);
  const itemCount = cartItemCount(items);

  const shippingMillimes = subtotalMillimes >= 150000 ? 0 : 8000;
  const totalMillimes = subtotalMillimes - discountMillimes + shippingMillimes;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-obsidian/70 backdrop-blur-sm"
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-obsidian border-l border-border flex flex-col"
            role="dialog"
            aria-label="Votre panier"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-gold" />
                <h2 className="font-sans text-sm font-medium tracking-widest uppercase text-ivory">
                  Panier
                </h2>
                {itemCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-gold text-obsidian text-[10px] font-bold flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-stone hover:text-ivory transition-colors"
                aria-label="Fermer le panier"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-6 px-6 text-center">
                  <ShoppingBag className="w-12 h-12 text-stone/30" />
                  <div>
                    <p className="text-ivory font-serif text-xl font-light">
                      Votre panier est vide
                    </p>
                    <p className="text-stone text-sm mt-2">
                      Découvrez nos collections exclusives
                    </p>
                  </div>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="btn-gold btn-sm"
                  >
                    Explorer la boutique
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-border" role="list">
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onRemove={removeItem}
                      onUpdateQty={updateQty}
                    />
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border px-6 py-6 space-y-4">
                {/* Coupon */}
                {couponCode && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone">Code: {couponCode}</span>
                    <span className="text-gold">-{formatPrice(discountMillimes)}</span>
                  </div>
                )}

                {/* Shipping */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone">Livraison</span>
                  <span className="text-ivory">
                    {shippingMillimes === 0 ? (
                      <span className="text-gold">Gratuite</span>
                    ) : (
                      formatPrice(shippingMillimes)
                    )}
                  </span>
                </div>

                {shippingMillimes > 0 && (
                  <div className="relative h-1.5 bg-obsidian-100 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gold rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((subtotalMillimes / 150000) * 100, 100)}%`,
                      }}
                    />
                  </div>
                )}
                {shippingMillimes > 0 && (
                  <p className="text-2xs text-stone/60 text-center">
                    Plus que {formatPrice(150000 - subtotalMillimes)} pour la livraison gratuite
                  </p>
                )}

                {/* Total */}
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <span className="text-sm font-medium tracking-widest uppercase text-ivory">
                    Total
                  </span>
                  <span className="text-lg font-serif text-gold">
                    {formatPrice(totalMillimes)}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-gold w-full justify-center"
                >
                  Commander
                </Link>
                <button
                  onClick={closeCart}
                  className="w-full text-center text-xs text-stone/60 hover:text-stone transition-colors py-1"
                >
                  Continuer mes achats
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CartItem({
  item,
  onRemove,
  onUpdateQty,
}: {
  item: ReturnType<typeof useCartStore.getState>["items"][0];
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, qty: number) => void;
}) {
  return (
    <li className="flex gap-4 px-6 py-4">
      {/* Image */}
      <Link
        href={`/products/${item.slug}`}
        className="relative w-20 h-24 flex-shrink-0 bg-obsidian-100 overflow-hidden"
      >
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="w-full h-full bg-obsidian-100" />
        )}
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${item.slug}`}
          className="text-sm text-ivory/90 hover:text-ivory transition-colors line-clamp-2"
        >
          {item.name}
        </Link>
        {item.variant && (
          <p className="text-xs text-stone mt-0.5">
            {item.variant.name}: {item.variant.value}
          </p>
        )}
        <p className="text-sm text-gold mt-1">{formatPrice(item.priceMillimes)}</p>

        {/* Qty controls */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center border border-border">
            <button
              onClick={() => onUpdateQty(item.id, item.qty - 1)}
              className="p-1.5 text-stone hover:text-ivory transition-colors"
              aria-label="Diminuer la quantité"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center text-sm text-ivory">{item.qty}</span>
            <button
              onClick={() => onUpdateQty(item.id, item.qty + 1)}
              disabled={item.qty >= item.maxQty}
              className="p-1.5 text-stone hover:text-ivory transition-colors disabled:opacity-30"
              aria-label="Augmenter la quantité"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={() => onRemove(item.id)}
            className="p-1.5 text-stone/50 hover:text-red-400 transition-colors"
            aria-label="Supprimer l'article"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </li>
  );
}
